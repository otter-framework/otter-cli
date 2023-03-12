import {
  CloudFormation,
  CloudFormationServiceException,
  DescribeStacksCommandOutput,
} from "@aws-sdk/client-cloudformation";
import { ApiGatewayV2 } from "@aws-sdk/client-apigatewayv2";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import * as fs from "fs";

interface InterfaceAwsServices {
  provisionResources: (
    stackName: string,
    template: string
  ) => Promise<string | undefined>;
  destroyResources: (stack: string) => Promise<void>;
  setupClients: (credentials: AwsCredentialIdentity, region: string) => void;
  checkStackCreationStatus: (stackName: string) => void;
  checkStackDeletionStatus: (existingStacks: string) => void;
}

export class AwsServices implements InterfaceAwsServices {
  static Env = {
    SIGNAL_STACK_NAME: "NewTestSignalStack",
    SIGNAL_STACK_TEMPLATE: "./src/aws/signaling.yaml",
    API_STACK_NAME: "NewAPITestStack",
    API_STACK_TEMPLATE: "./src/aws/httpAPI.yaml",
    TURN_SERVER_STACK_NAME: "",
    TURN_SERVER_TEMPLATE: "",
  };

  cloudFormationClient: CloudFormation | null;

  constructor() {
    this.cloudFormationClient = null;
  }

  async provisionResources(
    stackName: string,
    template: string
  ): Promise<string | undefined> {
    const params = {
      StackName: stackName,
      TemplateBody: fs.readFileSync(template, "utf8"),
      Capabilities: ["CAPABILITY_IAM"],
    };

    const result = await this.cloudFormationClient
      ?.createStack(params)
      .catch((err) => {
        return Promise.reject(err.message);
      });

    return result?.StackId;
  }

  async destroyResources(stack: string): Promise<void> {
    await this.cloudFormationClient
      ?.deleteStack({ StackName: stack })
      .catch((err: CloudFormationServiceException) =>
        Promise.reject(err.message)
      );
  }

  async checkStackCreationStatus(stackName: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      const id = setInterval(async () => {
        const stackStatus = await this.getStackStatus(stackName).catch(
          (err) => {
            clearInterval(id);
            reject(err);
          }
        );

        switch (true) {
          case this.isComplete(stackStatus):
            clearInterval(id);
            resolve();
          case this.isError(stackStatus):
            clearInterval(id);
            reject(`Stack creation failed with status ${stackStatus}`);
        }
      }, 3000);
    });
  }

  async checkStackDeletionStatus(stackToBeDeleted: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      const id = setInterval(async () => {
        const allDeleted = await this.cloudFormationClient
          ?.listStacks({
            StackStatusFilter: ["DELETE_COMPLETE"],
          })
          .catch((err: CloudFormationServiceException) => {
            clearInterval(id);
            reject(`Error when fetching Stack data: ${err.message}`);
          });

        const deleted = allDeleted?.StackSummaries?.map(
          (stack) => stack.StackId
        );

        if (deleted?.includes(stackToBeDeleted)) {
          clearInterval(id);
          resolve();
        }
      }, 3000);
    });
  }

  async getApiEndpoint(apiStackName: string): Promise<string> {
    const stackDescription = await this.cloudFormationClient
      ?.describeStacks({
        StackName: apiStackName,
      })
      .catch((err: CloudFormationServiceException) =>
        Promise.reject(err.message)
      );
    const output = stackDescription?.Stacks?.[0].Outputs?.[0];
    const endpoint = output?.OutputValue;
    if (!endpoint) throw new Error("Could not find your API endpoint");

    return endpoint;
  }

  setupClients(credentials: AwsCredentialIdentity, region: string): void {
    this.cloudFormationClient = new CloudFormation({ credentials, region });
  }

  private async getStackStatus(stackName: string) {
    const stackData: DescribeStacksCommandOutput | undefined =
      await this.cloudFormationClient
        ?.describeStacks({ StackName: stackName })
        .catch((err: CloudFormationServiceException) => {
          return Promise.reject(err.message);
        });
    const stackStatus = stackData?.Stacks?.[0].StackStatus;

    return stackStatus;
  }

  private isComplete(status: string | void | undefined): boolean {
    if (status)
      return status === "CREATE_COMPLETE" || status === "UPDATE_COMPLETE";

    return false;
  }

  private isError(status: string | void | undefined): boolean {
    if (status) return status.endsWith("FAILED");

    return false;
  }
}
