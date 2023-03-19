export type StackDescription = {
  name: string;
  template: string;
  initiateMessage: string;
  initiateCompleteMessage: string;
  deployingMessage: string;
  deployCompleteMessage: string;
};

export const cloudFrontStack: StackDescription = {
  name: "CloudFrontStack",
  template: "/templates/cloudFront.yaml",
  initiateMessage: "Initiating CloudFront Stack deployment",
  initiateCompleteMessage: "CloudFront Stack deployment initiated",
  deployingMessage: "Deploying CloudFront Stack",
  deployCompleteMessage: "CloudFront Stack is deployed.",
};

export const signalStack: StackDescription = {
  name: "NewTestSignalStack",
  template: "/templates/signaling.yaml",
  initiateMessage: "Initiating Signaling Services deployment",
  initiateCompleteMessage: "Signaling Services deployment initiated",
  deployingMessage: "Deploying Otter Signaling Services",
  deployCompleteMessage: "Otter Signaling Services is ready.",
};

export const apiStack: StackDescription = {
  name: "APIStack",
  template: "/templates/httpAPI.yaml",
  initiateMessage: "Initiating API Services deployment",
  initiateCompleteMessage: "API Services deployment initiated",
  deployingMessage: "Deploying Otter API Services",
  deployCompleteMessage: "Otter API Services is ready.",
};

export const turnStack: StackDescription = {
  name: "TurnStack",
  template: "/templates/fargate.yaml",
  initiateMessage: "Initiating STUN/TURN cluster deployment",
  initiateCompleteMessage: "STUN/TURN cluster deployment initiated",
  deployingMessage: "Deploying Otter STUN/TURN cluster",
  deployCompleteMessage: "Otter STUN/TURN cluster is ready.",
};

export const ec2Stack: StackDescription = {
  name: "EC2Stack",
  template: "/templates/ec2.yaml",
  initiateMessage: "Initiating EC2 deployment",
  initiateCompleteMessage: "EC2 deployment initiated",
  deployingMessage: "Deploying Otter EC2",
  deployCompleteMessage: "Otter EC2 is ready.",
};

export const stacks: StackDescription[] = [
  cloudFrontStack,
  signalStack,
  apiStack,
  turnStack,
];
