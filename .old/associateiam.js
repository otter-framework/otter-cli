const associateIam = async (ec2, iamARN, instanceId) => {
  const params = {
    IamInstanceProfile: {
      Arn: iamARN,
    },
    InstanceId: instanceId,
  };

  try {
    await ec2.associateIamInstanceProfile(params);
    return;
  } catch (err) {
    console.log(err, err.stack, "error associating IAM with EC2");
  }
};

module.exports = associateIam;
