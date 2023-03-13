import { Command } from "@oclif/core";
import { GetAwsInfo } from "../prompts/getAwsInfo.js";
import { AwsServices } from "../aws/awsServices.js";
import { stackEnv } from "../aws/stackEnv.js";
import { config } from "../utils/config.js";
import * as ui from "../utils/ui.js";
import { errorHandler } from "../utils/errorHandler.js";

const aws = new AwsServices();

const storeStackId = (stackId: string) => {
  const createdStacks = config.get("createdStacks") as string[];
  createdStacks.push(stackId);
  config.set({ createdStacks });
};

export class Deploy extends Command {
  static description = "deploy otter aws infrastructure";

  async run(): Promise<void> {
    ui.hello();
    ui.generateLogo();

    const { credentials, region } = await GetAwsInfo();

    aws.setupClients(credentials, region);

    ui.display("\n🦦 Otter is being deployed and might take a few minutes\n");

    let spinner = ui.spinner("Initiating Signaling Services deployment...");

    const signalingStackId = await aws
      .provisionResources(
        stackEnv.SIGNAL_STACK_NAME,
        stackEnv.SIGNAL_STACK_TEMPLATE
      )
      .catch((err) => errorHandler(err, spinner));
    if (signalingStackId) storeStackId(signalingStackId);
    spinner.succeed(ui.green("Signaling Services deployment initiated"));

    spinner = ui.spinner("Deploying Otter Signaling Services...");

    await aws
      .checkStackCreationStatus(stackEnv.SIGNAL_STACK_NAME)
      .catch((err) => errorHandler(err, spinner));
    spinner.succeed(ui.green("Otter Signaling Services deployed"));

    spinner = ui.spinner("Initiating API Services deployment...");

    const apiStackId = await aws
      .provisionResources(stackEnv.API_STACK_NAME, stackEnv.API_STACK_TEMPLATE)
      .catch((err) => errorHandler(err, spinner));
    if (apiStackId) storeStackId(apiStackId);
    spinner.succeed(ui.green("API Services deployment initiated"));

    spinner = ui.spinner("Deploying Otter API Services...");

    await aws
      .checkStackCreationStatus(stackEnv.API_STACK_NAME)
      .catch((err) => errorHandler(err, spinner));
    spinner.succeed(ui.green("Otter API Services deployed"));

    spinner = ui.spinner("Gathering your resource information...");
    const apiEndpoint = await aws
      .getApiEndpoint(stackEnv.API_STACK_NAME)
      .catch((err) => errorHandler(err, spinner));
    spinner.succeed(ui.green("Resource information acquired"));

    ui.printOtter();
    ui.display(`\n${ui.highlight(ui.logo)}\n`);
    ui.success("\n🎉 Deployment completed successfully 🎉\n");
    ui.display(`- You API endpoint: ${ui.highlight(apiEndpoint)}`);
    ui.display(`- Your Otter configuration file: ${ui.highlight(config.path)}`);

    ui.display("\nThank you for using Otter, see you next time! 👋");
  }
}
