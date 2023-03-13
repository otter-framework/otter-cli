const createIAMEC2Role = async (iam) => {
  const roleName = "your-iam-role-name";
  const policyArn = "arn:aws:iam::aws:policy/AmazonSSMFullAccess";

  // Create the IAM role
  const createRoleParams = {
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Action: "sts:AssumeRole",
        },
      ],
    }),
  };

  let iamARN;

  try {
    await iam.createRole(createRoleParams);

    // Attach the AmazonSSMManagedInstanceCore policy to the role
    const policyParams = {
      PolicyArn: policyArn,
      RoleName: roleName,
    };
    await iam.attachRolePolicy(policyParams);

    // Create an instance profile with the same name as the IAM role
    const instanceProfileParams = {
      InstanceProfileName: roleName,
    };
    const instanceProfileData = await iam.createInstanceProfile(
      instanceProfileParams
    );

    iamARN = instanceProfileData.InstanceProfile.Arn;

    // Add the IAM role to the instance profile
    const addRoleParams = {
      InstanceProfileName: roleName,
      RoleName: roleName,
    };
    await iam.addRoleToInstanceProfile(addRoleParams);

    return iamARN;
  } catch (err) {
    console.log(err, err.stack);
  }
};

module.exports = createIAMEC2Role;
