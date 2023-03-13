import Conf, { Schema } from "conf";

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
    type: "array",
    default: [],
  },

  apiEndpoint: {
    type: "string",
    default: "",
  },
};

export const config = new Conf({
  projectName: "otter",
  schema,
  projectSuffix: "framework",
});

export const storeStackId = (stackId: string): void => {
  const createdStacks = config.get("createdStacks") as string[];
  createdStacks.push(stackId);
  config.set({ createdStacks });
};
