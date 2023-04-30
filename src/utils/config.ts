import Conf from "conf";

const schema = {
  region: {
    type: "string",
    default: "",
  },

  accessKeyId: {
    type: "string",
    default: "",
  },

  secretAccessKey: {
    type: "string",
    default: "",
  },

  createdStacks: {
    type: "object",
    default: {},
  },

  apiEndpoint: {
    type: "string",
    default: "",
  },

  webSocketEndpoint: {
    type: "string",
    default: "",
  },

  loadBalancerEndpoint: {
    type: "string",
    default: "",
  },

  apiKey: {
    type: "string",
    default: "",
  },
};

export const config = new Conf({
  projectName: "otter",
  schema,
  projectSuffix: "framework",
});

export const storeStackId = (stackName: string, stackId: string): void => {
  const createdStacks = config.get("createdStacks") as Record<string, string>;
  createdStacks[stackName] = stackId;
  config.set({ createdStacks });
};
