import { Command } from "@oclif/core";
import { GetAwsInfo } from "../prompts/getAwsInfo.js";
import { DestroyPrompt } from "../prompts/destroyPrompt.js";
import { AwsServices } from "../aws/awsServices.js";
import { config } from "../utils/config.js";
import * as ui from "../utils/ui.js";
import { errorHandler } from "../utils/errorHandler.js";

const createdStacks = config.get("createdStacks") as string[];

// main `destroy` command logic
export class Destroy extends Command {
  static description = "destroy otter aws infrastructure";

  async run(): Promise<void> {
    ui.hello();

    // make sure all AWS info exists
    const { credentials, region } = await GetAwsInfo();
    const aws = new AwsServices(credentials, region);

    const { confirmDestroy } = await DestroyPrompt();

    if (!confirmDestroy) process.exit();
    if (createdStacks.length === 0) {
      ui.display("No Otter resources are found. Abort");
      this.exit();
    }

    // start teardown process
    ui.display(
      "\n🚜 Otter infrastructure is being removed. It will take a while, please check back after 10 - 15 minutes.\n"
    );

    let spinner = ui.emptySpinner();
    spinner.start();

    // teardown from newest stack to oldest stack, check status periodically
    for (let i = createdStacks.length - 1; i >= 0; i -= 1) {
      const currentStack = createdStacks[i];
      const currentStageText = `stage ${createdStacks.length - i} of ${
        createdStacks.length
      }`;
      spinner.text = `Tearing down your Otter infrastructure... [${currentStageText}]`;

      await aws
        .destroyResources(currentStack)
        .catch((err) => errorHandler(err, spinner));

      await aws
        .checkStackDeletionStatus(currentStack)
        .catch((err) => errorHandler(err, spinner));
    }
    spinner.succeed(ui.secondary("Otter teardown complete"));

    // remove stack info from config
    spinner = ui.spinner("Final cleanup");
    config.set({
      createdStacks: [],
      apiEndpoint: "",
      webSocketEndpoint: "",
      loadBalancerEndpoint: "",
    });
    spinner.succeed(ui.secondary("Final cleanup"));

    ui.success("\nTeardown completed successfully. Bye! 👋");
  }
}
