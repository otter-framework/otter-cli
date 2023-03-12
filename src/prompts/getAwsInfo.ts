import inquirer, { Answers, DistinctQuestion } from "inquirer";
import { isNotEmpty } from "../utils/validate.js";
import { getLocalCredentials } from "../utils/getLocalCredentials.js";
import * as ui from "../utils/ui.js";
import { config } from "../utils/config.js";
import { AwsCredentialIdentity } from "@aws-sdk/types";

const accessKeyIdQuestion: DistinctQuestion = {
  type: "input",
  name: "accessKeyId",
  message: "Enter your AWS access key ID: ",
  validate: isNotEmpty,
};

const secretAccessKeyQuestion: DistinctQuestion = {
  type: "input",
  name: "secretAccessKey",
  message: "Enter your AWS secret access key: ",
  validate: isNotEmpty,
};

const selectRegionQuestion: DistinctQuestion = {
  type: "list",
  name: "region",
  message: "Please select a region to provision/access your resources: ",
  choices: [
    "us-east-1",
    "us-east-2",
    "us-west-1",
    "us-west-2",
    "eu-west-1",
    "eu-west-2",
    "eu-west-3",
    "eu-central-1",
    "eu-central-2",
    "ap-southeast-1",
    "ap-southeast-2",
  ],
};

export const GetAwsInfo = async (): Promise<Answers> => {
  const localAwsCredentials = await getLocalCredentials();

  // if valid local AWS credentials are found, save it to config
  if (Object.keys(localAwsCredentials).length > 0) {
    const credentials = localAwsCredentials as AwsCredentialIdentity;
    ui.success("Local AWS credentials found.");
    config.set({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    });
  }

  // extract known info from config, prefill the answer
  let preAnswered;
  const accessKeyId = config.get("accessKeyId");
  const secretAccessKey = config.get("secretAccessKey");
  const region = config.get("region");
  if (region) ui.display(`Your region: ${ui.highlight(region)}\n`);
  if (accessKeyId && secretAccessKey) {
    preAnswered = { accessKeyId, secretAccessKey, region };
  } else {
    preAnswered = { region };
  }

  // ask questions based on what we've known
  let answers = await inquirer.prompt(
    [accessKeyIdQuestion, secretAccessKeyQuestion, selectRegionQuestion],
    { ...preAnswered }
  );

  config.set({ region: answers.region });

  // format return object for AWS client use
  const AwsInfo = {
    credentials: {
      accessKeyId: answers.accessKeyId,
      secretAccessKey: answers.secretAccessKey,
    },
    region: answers.region,
  };

  return AwsInfo;
};
