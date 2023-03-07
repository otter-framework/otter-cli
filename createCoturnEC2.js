const createCoturnEC2 = async (ec2, region) => {
  const imageId = determineImageId(region);

  const keyName = "KeyForCoturn";
  const keyParams = {
    KeyName: keyName,
  };

  try {
    await ec2.createKeyPair(keyParams);
    // console.log("Created EC2 keypair");
    // write return value of this call  to a file to keep track of rsa key
  } catch (err) {
    console.log("Error creating keypair", err);
  }

  const installDockerCommands = ""; // if we want to use docker later

  const sgParams = {
    Description: "Coturn_EC2_sec_group",
    GroupName: "Coturn_EC2_sec_group_name",
  };

  let sgId;
  try {
    const sgData = await ec2.createSecurityGroup(sgParams);
    sgId = sgData.GroupId;
    // console.log(`Created security group for EC2`);
  } catch (err) {
    console.error("Error creating security group", err);
    process.exit();
  }

  const authParams = {
    GroupId: sgId,
    IpPermissions: [
      {
        IpProtocol: "tcp",
        FromPort: 22,
        ToPort: 22,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
      },
      {
        IpProtocol: "udp",
        FromPort: 49152,
        ToPort: 65535,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
      },
      {
        IpProtocol: "tcp",
        FromPort: 3478,
        ToPort: 3478,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
      },
      {
        IpProtocol: "udp",
        FromPort: 3478,
        ToPort: 3478,
        IpRanges: [
          {
            CidrIp: "0.0.0.0/0",
          },
        ],
      },
    ],
  };

  try {
    await ec2.authorizeSecurityGroupIngress(authParams);
    // console.log(`Authorized security group ingress`);
  } catch (err) {
    console.error("Error authorizing security group ingress", err);
    process.exit();
  }

  const instanceParams = {
    ImageId: imageId,
    InstanceType: "t2.micro",
    KeyName: keyName,
    SecurityGroupIds: [sgId],
    MinCount: 1,
    MaxCount: 1,
    // UserData: new Buffer.from(installDockerCommands).toString("base64"), // for using docker later
  };

  try {
    const instanceData = await ec2.runInstances(instanceParams);
    const instanceId = instanceData.Instances[0].InstanceId;
    // console.log(`Created instance ${instanceId}`);
    return instanceId;
  } catch (err) {
    console.error("Error creating instance", err);
    process.exit();
  }
};

const determineImageId = (region) => {
  // t2.micro instances have a different AMI depending on region
  if (region == "us-west-1") {
    return "ami-0d50e5e845c552faf";
  } else if (region == "us-west-2") {
    return "ami-0735c191cf914754d";
  } else if (region == "us-east-1") {
    return "ami-0557a15b87f6559cf";
  } else if (region == "us-east-2") {
    return "ami-00eeedc4036573771";
  }
};

module.exports = createCoturnEC2;
