const checkStackStatus = async (cloudFormation, stackName) => {
  return new Promise((res, rej) => {
    cloudFormation.describeStacks({ StackName: stackName }, (err, data) => {
      if (err) {
        console.log(
          "An error occurred while checking on your resource creation."
        );
        rej(err);
      }

      const stack = data.Stacks[0];
      const stackStatus = stack.StackStatus;

      if (stackStatus.endsWith("TE_COMPLETE")) {
        res();
      } else if (stackStatus.endsWith("_IN_PROGRESS")) {
        setTimeout(
          () => res(checkStackStatus(cloudFormation, stackName)),
          5000
        );
      } else {
        console.log(`Stack creation failed with status ${stackStatus}`);
        rej(new Error(`Stack creation failed with status ${stackStatus}`));
      }
    });
  });
};

module.exports = checkStackStatus;
