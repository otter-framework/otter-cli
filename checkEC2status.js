const checkEC2Status = (instanceId, ec2) => {
  return new Promise((res, _) => {
    const params = {
      InstanceIds: [instanceId],
    };

    // call the describeInstances method to get information about the instance
    ec2.describeInstances(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const state = data.Reservations[0].Instances[0].State.Name;

        // check if the instance state is running
        if (state === "running") {
          res();
        } else {
          setTimeout(() => res(checkEC2Status(instanceId, ec2)), 10000);
          // wait 10 seconds and call the checkInstanceStatus function again
        }
      }
    });
  });
};

module.exports = checkEC2Status;
