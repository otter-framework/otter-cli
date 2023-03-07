const { EC2 } = require("@aws-sdk/client-ec2");
const { IAM } = require("@aws-sdk/client-iam");
const { SSM } = require("@aws-sdk/client-ssm");
const { CloudFormation } = require("@aws-sdk/client-cloudformation");
const { ApiGatewayV2 } = require("@aws-sdk/client-apigatewayv2");
const readline = require("readline");
const inquirer = require("inquirer");
const printInstructions = require("./instructions.js");
const getWsUrl = require("./getWsUrl.js");
const generateSpinner = require("./spinner.js");
const provisionResources = require("./provisionResources.js");
const checkStackStatus = require("./awaitStackCreation.js");
const createCoturnEC2 = require("./createCoturnEC2.js");
const setupCoturn = require("./setupCoturn.js");
const checkEC2Status = require("./checkEC2status.js");
const createIAMEC2Role = require("./createIAMEC2role.js");
const associateIam = require("./associateiam.js");
const provisionAPI = require("./provisionAPI.js");
const emoji = require("node-emoji");
const checkMark = emoji.get("white_check_mark");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const SIGNAL_STACK_NAME = "NewTestSignalStack";
const API_STACK_NAME = "NewAPITestStack";

printInstructions();

rl.question("\nEnter your AWS access key ID: ", (accessKeyId) => {
  rl.question("Enter your AWS secret access key: ", (secretAccessKey) => {
    console.log("\n");
    inquirer
      .prompt([
        {
          type: "list",
          name: "region",
          message: "Please select a region to provision your resources:",
          choices: ["us-east-1", "us-east-2", "us-west-1", "us-west-2"],
        },
      ])
      .then((answers) => {
        const cloudFormation = new CloudFormation({
          apiVersion: "2010-05-15",
          region: answers.region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });

        const ec2 = new EC2({
          region: answers.region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });

        const ssm = new SSM({
          region: answers.region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });

        const apiGateway = new ApiGatewayV2({
          region: answers.region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });

        const iam = new IAM({
          region: answers.region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });

        const masterFunc = async () => {
          provisionResources(
            cloudFormation,
            SIGNAL_STACK_NAME,
            "./signaling.yaml"
          );
          provisionResources(cloudFormation, API_STACK_NAME, "./httpAPI.yaml");

          let spinner = generateSpinner("Configuring EC2 permissions...");
          const iamARN = await createIAMEC2Role(iam);
          spinner.stop();
          console.log("EC2 Permissions Created" + checkMark);

          spinner = generateSpinner("Provisioning EC2...");
          const ec2InstanceId = await createCoturnEC2(ec2, answers.region);
          spinner.stop();
          console.log("EC2 has been provisioned" + checkMark);

          spinner = generateSpinner("Deploying EC2...");
          await checkEC2Status(ec2InstanceId, ec2);
          spinner.stop();
          console.log("EC2 is running" + checkMark);

          spinner = generateSpinner("Configuring EC2 permissions...");
          await associateIam(ec2, iamARN, ec2InstanceId);
          spinner.stop();
          console.log("EC2 IAM Permissions configured" + checkMark);

          spinner = generateSpinner("Deploying signaling resources...");
          await checkStackStatus(cloudFormation, SIGNAL_STACK_NAME);
          spinner.stop();
          console.log("Signaling Server resources deployed" + checkMark);

          spinner = generateSpinner("Deploying HTTP API resources...");
          await checkStackStatus(cloudFormation, API_STACK_NAME);
          spinner.stop();
          console.log("HTTP API resources deployed" + checkMark);

          spinner = generateSpinner("Setting up Coturn on EC2...");
          const coturnIp = await setupCoturn(ec2, ssm, ec2InstanceId);
          spinner.stop();
          console.log("Coturn server is online" + checkMark + "\n");
          console.log(`TURN address: turn:${coturnIp}:3478`);
          console.log(`STUN address: stun:${coturnIp}:3478`);
          console.log("Username: test");
          console.log("Credential: test123");
          await getWsUrl(apiGateway, "WebsocketAPIGateway");
          await getWsUrl(apiGateway, "MyHTTPAPIGateway");
          console.log("\n\n");
          console.log(`
           .-"""-.                      
          /      o\                       
         |    o   0).-.                  
         |       .-;(_/     .-.         
          \\     /  /)).---._|  \`\\   , 
           '.  '  /((       \`'-./ _/| 
             \\  .'  )        .-.;\`  / 
              '.             |  \`\-' 
                '._        -'    /     
                   \`\`""--\`------\``);
        };
        masterFunc();
      });
  });
});
