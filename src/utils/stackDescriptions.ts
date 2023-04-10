export type StackDescription = {
  name: string;
  template: string;
  initiateMessage: string;
  initiateCompleteMessage: string;
  deployingMessage: string;
  deployCompleteMessage: string;
};

export const s3Lambda: StackDescription = {
  name: "S3Lambda",
  template: "/templates/S3Lambda.yaml",
  initiateMessage: "Initiating S3Lambda deployment",
  initiateCompleteMessage: "S3Lambda deployment initiated",
  deployingMessage: "Deploying S3Lambda",
  deployCompleteMessage: "S3Lambda is deployed.",
};

export const cloudFrontStack: StackDescription = {
  name: "CloudFrontStack",
  template: "/templates/cloudFront.yaml",
  initiateMessage: "Initiating Frontend Stack deployment",
  initiateCompleteMessage: "Frontend Stack deployment initiated",
  deployingMessage: "Deploying Frontend Stack",
  deployCompleteMessage: "Frontend Stack is deployed.",
};

export const signalStack: StackDescription = {
  name: "NewTestSignalStack",
  template: "/templates/signaling.yaml",
  initiateMessage: "Initiating Signaling Stack deployment",
  initiateCompleteMessage: "Signaling Stack deployment initiated",
  deployingMessage: "Deploying Otter Signaling Stack",
  deployCompleteMessage: "Otter Signaling Stack is ready.",
};

export const apiStack: StackDescription = {
  name: "APIStack",
  template: "/templates/httpAPI.yaml",
  initiateMessage: "Initiating API Stack deployment",
  initiateCompleteMessage: "API Services Stack initiated",
  deployingMessage: "Deploy Otter API Stack",
  deployCompleteMessage: "Otter API Stack is ready.",
};

export const turnStack: StackDescription = {
  name: "TurnStack",
  template: "/templates/fargate.yaml",
  initiateMessage: "Initiating STUN/TURN Stack deployment",
  initiateCompleteMessage: "STUN/TURN Stack deployment initiated",
  deployingMessage: "Deploying Otter STUN/TURN Stack",
  deployCompleteMessage: "Otter STUN/TURN Stack is ready.",
};

export const ec2Stack: StackDescription = {
  name: "EC2Stack",
  template: "/templates/ec2.yaml",
  initiateMessage: "Initiating Frontend generator deployment",
  initiateCompleteMessage: "Frontend generator deployment initiated",
  deployingMessage: "Deploying Frontend generator",
  deployCompleteMessage: "Frontend generator is ready.",
};

export const stacks: StackDescription[] = [
  cloudFrontStack,
  signalStack,
  apiStack,
  turnStack,
];
