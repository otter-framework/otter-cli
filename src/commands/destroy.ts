import { Command } from "@oclif/core";
import { GetAwsInfo } from "../prompts/getAwsInfo.js";
import { DestroyPrompt } from "../prompts/destroyPrompt.js";
import { AwsServices } from "../aws/awsServices.js";
import { config } from "../utils/config.js";
import * as ui from "../utils/ui.js";
import { errorHandler } from "../utils/errorHandler.js";
import { signalStack } from "../utils/stackDescriptions.js";
import Listr from "listr";

let aws: AwsServices;
const createdStacks = config.get("createdStacks") as Record<string, string>;

const destroyStack = async (stackId: string): Promise<void> => {
  await aws.destroyResources(stackId).catch((err) => errorHandler(err));

  await aws.checkStackDeletionStatus(stackId).catch((err) => errorHandler(err));
};

const cleanup = () => {
  config.set({
    createdStacks: {},
    apiEndpoint: "",
    webSocketEndpoint: "",
    loadBalancerEndpoint: "",
  });
};

const destroy = async () => {
  const concurrentTaskList: Listr.ListrTask[] = [];
  for (let stack in createdStacks) {
    if (stack === signalStack.name) continue;
    concurrentTaskList.push({
      title: `Teardown ${stack}`,
      task: async () => destroyStack(createdStacks[stack]),
    });
  }

  const concurrentTask = new Listr(concurrentTaskList, { concurrent: true });
  const allTasks = new Listr([
    {
      title: "Teardown Otter Infrastructure",
      task: () => concurrentTask,
    },
    {
      title: "Teardown Otter Signaling Service",
      task: async () => await destroyStack(createdStacks[signalStack.name]),
    },
    {
      title: "Final Cleanup",
      task: () => cleanup(),
    },
  ]);

  await allTasks.run().catch((err) => console.log(err));
};

// main `destroy` command logic
export class Destroy extends Command {
  static description = "destroy otter aws infrastructure";

  async run(): Promise<void> {
    ui.hello();

    // make sure all AWS info exists
    const { credentials, region } = await GetAwsInfo();
    aws = new AwsServices(credentials, region);

    const { confirmDestroy } = await DestroyPrompt();

    if (!confirmDestroy) process.exit();
    if (Object.keys(createdStacks).length === 0) {
      ui.display("No Otter resources are found. Abort");
      this.exit();
    }

    // start teardown process
    ui.display(
      "\n🚜 Otter infrastructure is being removed. It will take a while, please check back after 10 - 15 minutes.\n"
    );

    await destroy();

    ui.success("\nTeardown completed successfully. Bye! 👋");
  }
}
