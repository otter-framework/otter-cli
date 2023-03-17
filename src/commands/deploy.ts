import { Command } from "@oclif/core";
import { GetAwsInfo } from "../prompts/getAwsInfo.js";
import { AwsServices } from "../aws/awsServices.js";
import {
  StackDescription,
  stacks,
  apiStack,
  signalStack,
  turnStack,
  cloudFrontStack,
} from "../utils/stackDescriptions.js";
import { config, storeStackId } from "../utils/config.js";
import * as ui from "../utils/ui.js";
import { deployErrorHandler } from "../utils/errorHandler.js";
import { modifyApiYaml } from "../utils/yaml.js";

const aws = new AwsServices();

// deploy stack helper function
const deployStack = async (stack: StackDescription): Promise<boolean> => {
  let spinner = ui.spinner(stack.initiateMessage);
  const stackId = await aws
    .provisionResources(stack.name, stack.template)
    .catch((err) => deployErrorHandler(err, spinner));
  spinner.succeed(ui.secondary(stack.initiateCompleteMessage));

  if (stackId) storeStackId(stackId);

  spinner = ui.spinner(stack.deployingMessage);
  await aws
    .checkStackCreationStatus(stack.name)
    .catch((err) => deployErrorHandler(err, spinner));
  spinner.succeed(ui.secondary(stack.deployCompleteMessage));
  return Promise.resolve(true);
};

const awaitPromises = async (promises: Promise<boolean>[]) => {
  await Promise.all(promises);
};

// main `deploy` command logic
export class Deploy extends Command {
  static description = "deploy otter aws infrastructure";

  async run(): Promise<void> {
    ui.hello();
    ui.generateLogo();

    const { credentials, region } = await GetAwsInfo();
    aws.setupClients(credentials, region);

    ui.display("\n🦦 Otter is being deployed and might take a few minutes\n");

    // deploy CF stack
    // await deployStack(cloudFrontStack);
    let stackPromises: Promise<boolean>[] = [];
    for (let stack of stacks) {
      stackPromises.push(deployStack(stack));
    }

    await awaitPromises(stackPromises);

    let spinner = ui.spinner("Getting your CloudFront domain...");
    const cloudFrontDomain = await aws
      .getApiEndpoint(cloudFrontStack.name)
      .catch((err) => deployErrorHandler(err, spinner));

    modifyApiYaml(cloudFrontDomain); // modify YAML to embed CF domain in Lambda code
    spinner.succeed(ui.secondary("Domain acquired"));

    await deployStack(apiStack);

    // // deploy other stacks
    // for (let stack of stacks) {
    //   await deployStack(stack);
    // }

    // setup ECS

    // retrieve API endpoint
    spinner = ui.spinner("Gathering your resource information...");
    const apiEndpoint = await aws
      .getApiEndpoint(apiStack.name)
      .catch((err) => deployErrorHandler(err, spinner));
    config.set({ apiEndpoint });
    const webSocketEndpoint = await aws
      .getApiEndpoint(signalStack.name)
      .catch((err) => deployErrorHandler(err, spinner));
    config.set({ webSocketEndpoint });
    const loadBalancerEndpoint = await aws
      .getApiEndpoint(turnStack.name)
      .catch((err) => deployErrorHandler(err, spinner));
    config.set({ loadBalancerEndpoint });
    spinner.succeed(ui.secondary("Resource information acquired"));

    // summary and goodbye
    ui.printOtter();
    ui.display(`\n${ui.otterGradient(ui.logo)}\n`);
    ui.success("\n🎉 Deployment completed successfully 🎉\n");
    ui.display(`- API endpoint: ${ui.highlight(apiEndpoint)}`);
    ui.display(`- WebSocket endpoint: ${ui.highlight(webSocketEndpoint)}`);
    ui.display(
      `- STUN/TURN URL: ${ui.highlight(`turn:${loadBalancerEndpoint}:80`)}`
    );
    ui.display(`- Your Otter configuration file: ${ui.highlight(config.path)}`);

    ui.display("\nThank you for using Otter, see you next time! 👋");
  }
}
