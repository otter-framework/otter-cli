import { fromIni } from "@aws-sdk/credential-providers";
import { AwsCredentialIdentity } from "@aws-sdk/types";

export const getLocalCredentials = async (): Promise<
  AwsCredentialIdentity | {}
> => {
  let credentials: AwsCredentialIdentity | {} = {};
  const credentialProvider = fromIni();
  try {
    credentials = await credentialProvider();
  } catch (err) {
    console.log("Local AWS credentials are not valid or not found.");
  }

  return credentials;
};
