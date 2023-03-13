import { Command } from "@oclif/core";
import { GetAwsInfo } from "../prompts/getAwsInfo.js";
import { AwsServices } from "../aws/awsServices.js";
import { stackEnv } from "../aws/stackEnv.js";
import { config, storeStackId } from "../utils/config.js";
import * as ui from "../utils/ui.js";
import { errorHandler } from "../utils/errorHandler.js";

const aws = new AwsServices();

export class Deploy extends Command {
  static description = "deploy otter aws infrastructure";

  async run(): Promise<void> {
    ui.hello();
    ui.generateLogo();

    const { credentials, region } = await GetAwsInfo();
    aws.setupClients(credentials, region);

    ui.display("\n🦦 Otter is being deployed and might take a few minutes\n");

    // deploy signaling stack
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

    // deploy API stack
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

    // retrieve API endpoint
    spinner = ui.spinner("Gathering your resource information...");
    const apiEndpoint = await aws
      .getApiEndpoint(stackEnv.API_STACK_NAME)
      .catch((err) => errorHandler(err, spinner));
    config.set({ apiEndpoint });
    spinner.succeed(ui.green("Resource information acquired"));

    // summary and goodbye
    ui.printOtter();
    ui.display(`\n${ui.otterGradient(ui.logo)}\n`);
    ui.success("\n🎉 Deployment completed successfully 🎉\n");
    ui.display(`- You API endpoint: ${ui.highlight(apiEndpoint)}`);
    ui.display(`- Your Otter configuration file: ${ui.highlight(config.path)}`);

    ui.display("\nThank you for using Otter, see you next time! 👋");
  }
}
