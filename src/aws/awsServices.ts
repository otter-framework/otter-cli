import {
  CloudFormation,
  CloudFormationServiceException,
  DescribeStacksCommandOutput,
} from "@aws-sdk/client-cloudformation";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

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
  cloudFormationClient: CloudFormation | null;
  checkInterval: number;

  constructor() {
    this.cloudFormationClient = null;
    this.checkInterval = 3000;
  }

  async provisionResources(
    stackName: string,
    template: string
  ): Promise<string | undefined> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const params = {
      StackName: stackName,
      TemplateBody: fs.readFileSync(path.join(__dirname, template), "utf8"),
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
      }, this.checkInterval);
    });
  }

  // check deletion result by looking for target stack from all deleted stacks
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
      }, this.checkInterval);
    });
  }

  // get API endpoint from stack output
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

  // private methods below
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
