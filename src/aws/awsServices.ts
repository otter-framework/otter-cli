import {
  CloudFormation,
  CloudFormationServiceException,
  DescribeStacksCommandOutput,
} from "@aws-sdk/client-cloudformation";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { EC2 } from "@aws-sdk/client-ec2";
import {
  SSM,
  ListCommandInvocationsCommandInput,
  ListCommandInvocationsCommand,
} from "@aws-sdk/client-ssm";
import {
  S3,
  PutObjectCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  DeleteObjectsCommand,
  ObjectIdentifier,
  DeleteObjectsCommandInput,
} from "@aws-sdk/client-s3";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocument,
  PutCommand,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";

interface InterfaceAwsServices {
  provisionResources: (
    stackName: string,
    template: string
  ) => Promise<string | undefined>;
  destroyResources: (stack: string) => Promise<void>;
  checkStackCreationStatus: (stackName: string) => void;
  checkStackDeletionStatus: (existingStacks: string) => void;
}

export class AwsServices implements InterfaceAwsServices {
  cloudFormationClient: CloudFormation;
  s3Client: S3;
  ec2Client: EC2;
  ssmClient: SSM;
  cloudfront: CloudFrontClient;
  dynamo: DynamoDBDocument;
  checkInterval: number;

  constructor(credentials: AwsCredentialIdentity, region: string) {
    this.cloudFormationClient = new CloudFormation({ credentials, region });
    this.s3Client = new S3({ credentials, region });
    this.ec2Client = new EC2({ credentials, region });
    this.ssmClient = new SSM({ credentials, region });
    this.cloudfront = new CloudFrontClient({ credentials, region });
    const db = new DynamoDBClient({ credentials, region });
    this.dynamo = DynamoDBDocument.from(db);
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
      Capabilities: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"],
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
  async getEndpoint(apiStackName: string, outputKey: string): Promise<string> {
    const stackDescription = await this.cloudFormationClient
      ?.describeStacks({
        StackName: apiStackName,
      })
      .catch((err: CloudFormationServiceException) =>
        Promise.reject(err.message)
      );
    const outputs = stackDescription?.Stacks?.[0].Outputs;
    const targetOutput = outputs?.filter(
      (output) => output.OutputKey === outputKey
    )[0];
    const endpoint = targetOutput?.OutputValue;
    if (!endpoint) throw new Error("Could not find your endpoint");

    return endpoint;
  }

  async uploadFile(
    relativePath: string,
    fileName: string,
    bucketName: string
  ): Promise<void> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Read the file to be uploaded
    const fileContent = fs.readFileSync(path.join(__dirname, relativePath));

    const params = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
    });

    try {
      await this.s3Client.send(params);
      return;
    } catch (err) {
      console.error(err);
    }
  }

  async getLambdaBucketName(): Promise<string> {
    const data = await this.s3Client.send(new ListBucketsCommand({}));
    const buckets = data.Buckets;
    if (buckets && buckets.length === 0) return "";
    const lambdaBuckets = buckets?.filter((bucket) =>
      bucket.Name?.startsWith("s3lambda")
    );
    if (lambdaBuckets && lambdaBuckets.length === 0) return "";
    let target = lambdaBuckets?.[0];
    let newestTime = lambdaBuckets?.[0].CreationDate;
    lambdaBuckets?.forEach((bucket) => {
      if (
        bucket.CreationDate &&
        newestTime &&
        bucket.CreationDate > newestTime
      ) {
        target = bucket;
      }
    });

    if (target?.Name) return target?.Name;

    return "";
  }

  async getConfigBucketName(): Promise<string> {
    const data = await this.s3Client.send(new ListBucketsCommand({}));
    const buckets = data.Buckets;
    if (buckets && buckets.length === 0) return "";
    const configBuckets = buckets?.filter((bucket) =>
      bucket.Name?.startsWith("cloudfrontstack-s3configbucket")
    );
    if (configBuckets && configBuckets.length === 0) return "";
    let target = configBuckets?.[0];
    let newestTime = configBuckets?.[0].CreationDate;
    configBuckets?.forEach((bucket) => {
      if (
        bucket.CreationDate &&
        newestTime &&
        bucket.CreationDate > newestTime
      ) {
        target = bucket;
      }
    });

    if (target?.Name) return target?.Name;

    return "";
  }

  async getReactBucketName(): Promise<string> {
    const data = await this.s3Client.send(new ListBucketsCommand({}));
    const buckets = data.Buckets;
    if (buckets && buckets.length === 0) return "";
    const reactBuckets = buckets?.filter((bucket) =>
      bucket.Name?.startsWith("cloudfrontstack-s3bucket")
    );
    if (reactBuckets && reactBuckets.length === 0) return "";
    let target = reactBuckets?.[0];
    let newestTime = reactBuckets?.[0].CreationDate;
    reactBuckets?.forEach((bucket) => {
      if (
        bucket.CreationDate &&
        newestTime &&
        bucket.CreationDate > newestTime
      ) {
        target = bucket;
      }
    });

    if (target?.Name) return target?.Name;

    return "";
  }

  async deleteS3ConfigBucket(): Promise<void> {
    const bucketName = await this.getConfigBucketName();

    // Delete all objects within the bucket
    const objects = await this.s3Client.listObjectsV2({ Bucket: bucketName });
    if (objects.Contents) {
      const deleteParams = {
        Bucket: bucketName,
        Delete: { Objects: objects.Contents.map(({ Key }) => ({ Key })) },
      };
      await this.s3Client.deleteObjects(deleteParams);
    }

    // Delete the bucket
    await this.s3Client.deleteBucket({ Bucket: bucketName });
  }

  async sendEC2Commands(instanceId: string): Promise<void> {
    const configBucketName = await this.getConfigBucketName();
    const reactBucketName = await this.getReactBucketName();
    if (!configBucketName || !reactBucketName)
      return Promise.reject("Missing Bucket name, please try again");
    try {
      const describeParams = {
        InstanceIds: [instanceId],
      };
      await this.ec2Client.describeInstances(describeParams);
      // const instances = describeData.Reservations[0].Instances;
      const commands = [
        "#!/bin/bash",
        "sudo apt-get update -y",
        "sudo apt-get install npm -y",
        // "sudo apt-get install vite -y",
        "sudo apt-get install awscli -y",
        // "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash",
        // `export NVM_DIR="$HOME/.nvm" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`,
        // "sudo nvm install --lts",
        "curl -fsSL https://raw.githubusercontent.com/tj/n/master/bin/n | bash -s lts",
        "git clone https://github.com/otter-framework/otter-client",
        `location=$(find / -type d -name "otter-client")`,
        "cd $location",
        "npm i",
        `aws s3 cp s3://${configBucketName}/configs.js ./src/configs/configs.js`,
        "npm run build",
        "cd dist",
        `aws s3 cp ./index.html s3://${reactBucketName}/`,
        `aws s3 cp ./otter_1o.svg s3://${reactBucketName}/`,
        `aws s3 cp ./otter_5o.svg s3://${reactBucketName}/`,
        `aws s3 cp ./otter_7o.svg s3://${reactBucketName}/`,
        `aws s3 cp ./vite.svg s3://${reactBucketName}/`,
        `aws s3 cp ./assets/ s3://${reactBucketName}/assets --recursive`,
      ];

      const sendCommandParams = {
        InstanceIds: [instanceId],
        DocumentName: "AWS-RunShellScript",
        Parameters: {
          commands: commands,
        },
      };

      const sentCommand = await this.ssmClient.sendCommand(sendCommandParams);
      const commandId = sentCommand.Command?.CommandId;
      if (commandId) await this.checkCommandStatus(commandId, instanceId);
    } catch (err) {
      console.log(err);
    }
  }

  async checkCommandStatus(
    commandId: string,
    instanceId: string
  ): Promise<void> {
    return await new Promise((resolve, _) => {
      const id = setInterval(async () => {
        const params: ListCommandInvocationsCommandInput = {
          CommandId: commandId,
          InstanceId: instanceId,
        };
        const invos = await this.ssmClient.send(
          new ListCommandInvocationsCommand(params)
        );
        if (invos.CommandInvocations?.[0].Status === "Success") {
          clearInterval(id);
          resolve();
        }
      }, this.checkInterval);
    });
  }

  async emptyBuckets() {
    // const configBucketName = await this.getConfigBucketName();
    const reactBucketName = await this.getReactBucketName();
    const lambdaBucketName = await this.getLambdaBucketName();
    // if (configBucketName) await this.emptyBucket(configBucketName);
    if (reactBucketName) await this.emptyBucket(reactBucketName);
    if (lambdaBucketName) await this.emptyBucket(lambdaBucketName);
  }

  async emptyBucket(bucket: string) {
    const response = await this.s3Client.send(
      new ListObjectsCommand({ Bucket: bucket })
    );
    const objects = response.Contents;
    if (objects && objects?.length > 0) {
      let toBeDeleted: ObjectIdentifier[] = [];
      for (let obj of objects) {
        toBeDeleted.push({
          Key: obj.Key,
        });
      }
      const params: DeleteObjectsCommandInput = {
        Bucket: bucket,
        Delete: { Objects: toBeDeleted },
      };
      await this.s3Client.send(new DeleteObjectsCommand(params));
    }
  }

  async saveApiKeyToDynamo(apiKey: string) {
    const params: PutCommandInput = {
      TableName: "APIKeyTable",
      Item: { user: "otter-admin", apiKey },
    };

    const result = await this.dynamo.send(new PutCommand(params));
    console.log(result);
  }

  async saveDomainToDynamo(domain: string) {
    const params: PutCommandInput = {
      TableName: "ConfigTable",
      Item: { user: "otter-admin", domain },
    };

    const result = await this.dynamo.send(new PutCommand(params));
    console.log(result);
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
    if (status)
      return (
        status.endsWith("FAILED") ||
        status === "ROLLBACK_COMPLETE" ||
        status === "ROLLBACK_IN_PROGRESS"
      );

    return false;
  }
}
