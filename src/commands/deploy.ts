import { Command } from "@oclif/core";
import { GetAwsInfo } from "../prompts/getAwsInfo.js";
import { AwsServices } from "../aws/awsServices.js";
import {
  StackDescription,
  stacks,
  apiStack,
} from "../utils/stackDescriptions.js";
import { config, storeStackId } from "../utils/config.js";
import * as ui from "../utils/ui.js";
import { deployErrorHandler } from "../utils/errorHandler.js";

const aws = new AwsServices();

const deployStack = async (stack: StackDescription) => {
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
};

// main `deploy` command login
export class Deploy extends Command {
  static description = "deploy otter aws infrastructure";

  async run(): Promise<void> {
    ui.hello();
    ui.generateLogo();

    const { credentials, region } = await GetAwsInfo();
    aws.setupClients(credentials, region);

    ui.display("\n🦦 Otter is being deployed and might take a few minutes\n");

    // deploy stacks
    for (let stack of stacks) {
      await deployStack(stack);
    }

    // retrieve API endpoint
    let spinner = ui.spinner("Gathering your resource information...");
    const apiEndpoint = await aws
      .getApiEndpoint(apiStack.name)
      .catch((err) => deployErrorHandler(err, spinner));
    config.set({ apiEndpoint });
    spinner.succeed(ui.secondary("Resource information acquired"));

    // summary and goodbye
    ui.printOtter();
    ui.display(`\n${ui.otterGradient(ui.logo)}\n`);
    ui.success("\n🎉 Deployment completed successfully 🎉\n");
    ui.display(`- You API endpoint: ${ui.highlight(apiEndpoint)}`);
    ui.display(`- Your Otter configuration file: ${ui.highlight(config.path)}`);

    ui.display("\nThank you for using Otter, see you next time! 👋");
  }
}
