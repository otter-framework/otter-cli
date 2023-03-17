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
  initiateMessage: "Initiating CloudFront Stack deployment...",
  initiateCompleteMessage: "CloudFront Stack deployment initiated",
  deployingMessage: "Deploying CloudFront Stack...",
  deployCompleteMessage: "CloudFront Stack deployed",
};

export const signalStack: StackDescription = {
  name: "NewTestSignalStack",
  template: "/templates/signaling.yaml",
  initiateMessage: "Initiating Signaling Services deployment...",
  initiateCompleteMessage: "Signaling Services deployment initiated",
  deployingMessage: "Deploying Otter Signaling Services...",
  deployCompleteMessage: "Otter Signaling Services deployed",
};

export const apiStack: StackDescription = {
  name: "APIStack",
  template: "/templates/httpAPI.yaml",
  initiateMessage: "Initiating API Services deployment...",
  initiateCompleteMessage: "API Services deployment initiated",
  deployingMessage: "Deploying Otter API Services...",
  deployCompleteMessage: "Otter API Services deployed",
};

export const turnStack: StackDescription = {
  name: "TurnStack",
  template: "/templates/fargate.yaml",
  initiateMessage: "Initiating STUN/TURN cluster deployment...",
  initiateCompleteMessage: "STUN/TURN cluster deployment initiated",
  deployingMessage: "Deploying Otter STUN/TURN cluster...",
  deployCompleteMessage: "Otter STUN/TURN cluster deployed",
};

export const stacks: StackDescription[] = [
  cloudFrontStack,
  signalStack,
  // apiStack,
  turnStack,
];
