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
};

export const config = new Conf({
  projectName: "otter",
  schema,
  projectSuffix: "framework",
});
