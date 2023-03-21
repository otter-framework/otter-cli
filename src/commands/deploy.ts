import { Command } from "@oclif/core";
import { GetAwsInfo } from "../prompts/getAwsInfo.js";
import { AwsServices } from "../aws/awsServices.js";
import {
  StackDescription,
  apiStack,
  signalStack,
  turnStack,
  cloudFrontStack,
  ec2Stack,
  s3Lambda,
} from "../utils/stackDescriptions.js";
import { config, storeStackId } from "../utils/config.js";
import * as ui from "../utils/ui.js";
import { deployErrorHandler } from "../utils/errorHandler.js";
import { writeFile } from "../utils/writeFile.js";
import { generateApiKey } from "../utils/generateApiKey.js";
import { getSampleRoomUrl } from "../utils/sampleRoom.js";
import Listr from "listr";

let aws: AwsServices;
let apiKey: string;

// deploy stack helper function
const deployStack = async (stack: StackDescription): Promise<boolean> => {
  const stackId = await aws
    .provisionResources(stack.name, stack.template)
    .catch((err) => deployErrorHandler(err));

  if (stackId) storeStackId(stack.name, stackId);

  await aws
    .checkStackCreationStatus(stack.name)
    .catch((err) => deployErrorHandler(err));
  return Promise.resolve(true);
};

const concurrentTasks = new Listr(
  [
    {
      title: signalStack.deployingMessage,
      task: async (_, task) => {
        await deployStack(signalStack);
        task.title = ui.secondary(signalStack.deployCompleteMessage);
      },
    },
    {
      title: turnStack.deployingMessage,
      task: async (_, task) => {
        await deployStack(turnStack);
        task.title = ui.secondary(turnStack.deployCompleteMessage);
      },
    },
    {
      title: cloudFrontStack.deployingMessage,
      task: async (_, task) => {
        await deployStack(cloudFrontStack);
        task.title = ui.secondary(cloudFrontStack.deployCompleteMessage);
      },
    },
    {
      title: ec2Stack.deployingMessage,
      task: async (_, task) => {
        await deployStack(ec2Stack);
        task.title = ui.secondary(ec2Stack.deployCompleteMessage);
      },
    },
    {
      title: "Prepare Lambdas for deployment",
      task: async (_, task) => {
        await deployStack(s3Lambda);
        const bucketName = await aws.getLambdaBucketName();
        await aws.uploadFile(
          "/lambdas/create-room.zip",
          "create-room.zip",
          bucketName
        );
        await aws.uploadFile(
          "/lambdas/authorizer.zip",
          "authorizer.zip",
          bucketName
        );
        task.title = ui.secondary("Lambdas are ready.");
      },
    },
  ],
  { concurrent: true }
);

const tasks = new Listr([
  {
    title: "Deploy Otter Infrastructure",
    task: () => concurrentTasks,
  },
  {
    title: ui.secondary(apiStack.deployingMessage),
    task: async (_, task) => {
      task.title = apiStack.deployingMessage;
      await deployStack(apiStack);
      task.title = apiStack.deployCompleteMessage;
    },
  },
  {
    title: ui.secondary("Prepare Otter-meet domain"),
    task: async (_, task) => {
      task.title = "Getting Otter-meet domain";
      const cloudFrontDomain = await aws
        .getEndpoint(cloudFrontStack.name, "CloudFrontDomainName")
        .catch((err) => deployErrorHandler(err));
      await aws.saveDomainToDynamo(cloudFrontDomain);
      // modifyApiYaml(cloudFrontDomain); // modify YAML to embed CF domain in Lambda code
      task.title = "Otter-meet domain is ready.";
    },
  },
  {
    title: ui.secondary("Gather resource information"),
    task: async (_, task) => {
      task.title = "Gather resource information";
      const apiEndpoint = await aws
        .getEndpoint(apiStack.name, "APIGateWayEndpoint")
        .catch((err) => deployErrorHandler(err));
      config.set({ apiEndpoint });
      const webSocketEndpoint = await aws
        .getEndpoint(signalStack.name, "WebSocketAPIGatewayEndpoint")
        .catch((err) => deployErrorHandler(err));
      config.set({ webSocketEndpoint });
      const loadBalancerEndpoint = await aws
        .getEndpoint(turnStack.name, "LoadBalancerEndpoint")
        .catch((err) => deployErrorHandler(err));
      config.set({ loadBalancerEndpoint });
      task.title = "Resource information acquired";
    },
  },
  {
    title: ui.secondary("Create Otter-meet Application"),
    task: async (_, task) => {
      task.title = "Creating and serving Otter-meet App";

      // Get EC2 instance ID from ec2 cloudformation template output
      const EC2InstanceId = await aws
        .getEndpoint(ec2Stack.name, "InstanceId")
        .catch((err) => deployErrorHandler(err));

      // Get endpoints for writing config file
      const ELBEndpoint = config.get("loadBalancerEndpoint") as string;
      const WSEndpoint = config.get("webSocketEndpoint") as string;
      const APIEndpoint = config.get("apiEndpoint") as string;

      // Generate Config file
      await writeFile(ELBEndpoint, WSEndpoint, APIEndpoint);

      // Upload config file to Config s3 bucket
      const bucketName = await aws.getConfigBucketName();
      await aws.uploadFile("/configs.js", "configs.js", bucketName);
      // Send commands to EC2 to build react app
      await aws.sendEC2Commands(EC2InstanceId);
      await aws.destroyResources(ec2Stack.name);
      task.title = "Otter-meet App is ready.";
    },
  },
  {
    title: ui.secondary("Generate API Key"),
    task: async () => {
      apiKey = generateApiKey();
      config.set("apiKey", apiKey);
      await aws.saveApiKeyToDynamo(apiKey);
    },
  },
]);

// main `deploy` command logic
export class Deploy extends Command {
  static description = "deploy otter aws infrastructure";

  async run(): Promise<void> {
    ui.hello();
    ui.generateLogo();

    const { credentials, region } = await GetAwsInfo();
    aws = new AwsServices(credentials, region);

    ui.display("\n🦦 Otter is being deployed and might take a few minutes\n");

    await tasks.run();

    // summary and goodbye
    ui.printOtter();
    ui.display(`\n${ui.otterGradient(ui.logo)}\n`);
    ui.success("\n🎉 Deployment completed successfully 🎉\n");
    ui.display(`- API endpoint: ${ui.highlight(config.get("apiEndpoint"))}`);
    ui.display(`- Your API Key: ${ui.highlight(apiKey)}`);
    ui.display(
      `\nWe've also created a sample room for you to test out. Open the browser then go to ${ui.highlight(
        await getSampleRoomUrl()
      )}. Have fun streaming!`
    );

    ui.display("\nThank you for using Otter, see you next time! 👋");
  }
}
