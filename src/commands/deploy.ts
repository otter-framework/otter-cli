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
} from "../utils/stackDescriptions.js";
import { config, storeStackId } from "../utils/config.js";
import * as ui from "../utils/ui.js";
import { deployErrorHandler } from "../utils/errorHandler.js";
import { modifyApiYaml } from "../utils/yaml.js";
import Listr from "listr";

let aws: AwsServices;

// deploy stack helper function
const deployStack = async (stack: StackDescription): Promise<boolean> => {
  // let spinner = ui.spinner(stack.initiateMessage);
  const stackId = await aws
    .provisionResources(stack.name, stack.template)
    .catch((err) => deployErrorHandler(err));
  // spinner.succeed(ui.secondary(stack.initiateCompleteMessage));

  if (stackId) storeStackId(stackId);

  // spinner = ui.spinner(stack.deployingMessage);
  await aws
    .checkStackCreationStatus(stack.name)
    .catch((err) => deployErrorHandler(err));
  // spinner.succeed(ui.secondary(stack.deployCompleteMessage));
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
  ],
  { concurrent: true }
);

const tasks = new Listr([
  {
    title: "Deploy Otter Infrastructure",
    task: () => concurrentTasks,
  },
  {
    title: ui.secondary("Prepare Otter-meet domain"),
    task: async (_, task) => {
      task.title = "Getting Otter-meet domain";
      const cloudFrontDomain = await aws
        .getApiEndpoint(cloudFrontStack.name)
        .catch((err) => deployErrorHandler(err));

      modifyApiYaml(cloudFrontDomain); // modify YAML to embed CF domain in Lambda code
      task.title = "Otter-meet domain is ready.";
    },
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
    title: ui.secondary("Create Otter-meet Application"),
    task: async (_, task) => {
      task.title = "Creating and serving Otter-meet App";

      // Get EC2 instance ID from ec2 cloudformation template output
      const EC2InstanceId = await aws
        .getApiEndpoint(ec2Stack.name)
        .catch((err) => deployErrorHandler(err));

      // Get endpoints for writing config file
      const ELBEndpoint = config.get("loadBalancerEndpoint") as string;
      const WSEndpoint = config.get("webSocketEndpoint") as string;
      const APIEndpoint = config.get("apiEndpoint") as string;

      // Generate Config file
      await aws.writeFile(
        ELBEndpoint,
        "1679249183-:-DefaultName",
        "e5QpXrS9wtJsxGcSzRhZeI0QngE=",
        WSEndpoint,
        APIEndpoint
      );

      // Upload config file to Config s3 bucket
      await aws.uploadFile();
      // Send commands to EC2 to build react app
      await aws.sendEC2Commands(EC2InstanceId);
      // await aws.destroyResources(ec2Stack.name);
      task.title = "Otter-meet App is ready.";
    },
  },
  {
    title: ui.secondary("Gather resource information"),
    task: async (_, task) => {
      task.title = "Gather resource information";
      const apiEndpoint = await aws
        .getApiEndpoint(apiStack.name)
        .catch((err) => deployErrorHandler(err));
      config.set({ apiEndpoint });
      const webSocketEndpoint = await aws
        .getApiEndpoint(signalStack.name)
        .catch((err) => deployErrorHandler(err));
      config.set({ webSocketEndpoint });
      const loadBalancerEndpoint = await aws
        .getApiEndpoint(turnStack.name)
        .catch((err) => deployErrorHandler(err));
      config.set({ loadBalancerEndpoint });
      task.title = "Resource information acquired";
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
    ui.display(
      `- WebSocket endpoint: ${ui.highlight(config.get("webSocketEndpoint"))}`
    );
    ui.display(
      `- STUN/TURN URL: ${ui.highlight(
        `turn:${config.get("loadBalancerEndpoint")}:80`
      )}`
    );
    ui.display(`- Your Otter configuration file: ${ui.highlight(config.path)}`);

    ui.display("\nThank you for using Otter, see you next time! 👋");
  }
}
