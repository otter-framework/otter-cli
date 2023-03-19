import * as crypto from "crypto";

export const generateApiKey = () => {
  const user = crypto.randomUUID();
  return Buffer.from(user).toString("base64url");
};
