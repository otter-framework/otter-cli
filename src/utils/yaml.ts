import { yamlParse, yamlDump } from "yaml-cfn";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

type Code = {
  ZipFile: string;
};

export const modifyApiYaml = (cloudFrontDomain: string) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, "../aws/templates/httpAPI.yaml");
  const yamlData = fs.readFileSync(filePath, "utf-8");
  const yamlObject = yamlParse(yamlData);
  const code: Code = yamlObject.Resources.CreateRoomFunction.Properties.Code;
  // looking for the line starts with "const domain = "
  const regex = /const domain = \S*/;
  // replace this line to embed CloudFront domain
  code.ZipFile = code.ZipFile.replace(
    regex,
    `const domain = "${cloudFrontDomain}"`
  );
  // update the yaml file
  fs.writeFileSync(filePath, yamlDump(yamlObject), "utf-8");
};
