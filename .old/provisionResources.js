const fs = require("fs");

const provisionResources = (cloudFormation, stackName, fileLocation) => {
  const params = {
    StackName: stackName,
    TemplateBody: fs.readFileSync(fileLocation, "utf8"),
    Capabilities: ["CAPABILITY_IAM"],
  };

  return new Promise((res) => {
    cloudFormation.createStack(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        process.exit(0);
      }
      // console.log(data);
      res();
    });
  });
};

module.exports = provisionResources;
