import inquirer, { Answers, DistinctQuestion } from "inquirer";
import * as ui from "../utils/ui.js";

const areYouSureQuestion: DistinctQuestion = {
  type: "confirm",
  name: "confirmDestroy",
  message:
    "Are you sure you want to " +
    ui.red("destroy ") +
    "all Otter infrastructures?",
  default: false,
};

export const DestroyPrompt = async (): Promise<Answers> => {
  const answers = inquirer.prompt([areYouSureQuestion]);

  return answers;
};
