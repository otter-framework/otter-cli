const setupCoturn = async (ec2, ssm, instanceId) => {
  try {
    const describeParams = {
      InstanceIds: [instanceId],
    };
    const describeData = await ec2.describeInstances(describeParams);
    const instances = describeData.Reservations[0].Instances;
    const privateIp = instances[0].PrivateIpAddress;
    const publicIp = instances[0].PublicIpAddress;

    const commandString = `sudo echo 'realm=domain.org\n\nserver-name=turnserver\n\nfingerprint\n\nlistening-ip=0.0.0.0\n\nexternal-ip=${publicIp}\n\nlistening-port=3478\n\nmin-port=10000\n\nmax-port=20000\n\nlog-file=/var/log/turnserver.log\n\nverbose\n\nuser=test:test123\n\nlt-cred-mech\n\n' > /etc/turnserver.conf`;

    const commands = [
      "#!/bin/bash",
      "sudo apt update -y",
      "sudo apt install coturn -y",
      "sudo systemctl start coturn -y",
      "touch /etc/turnserver.conf",
      commandString,
      "sudo service coturn restart -y",
    ];

    const sendCommandParams = {
      InstanceIds: [instanceId],
      DocumentName: "AWS-RunShellScript",
      Parameters: {
        commands: commands,
      },
    };
    await ssm.sendCommand(sendCommandParams);
    // console.log(sendCommandData, "sent data!");
    return publicIp;
  } catch (err) {
    console.log(err);
  }
};

module.exports = setupCoturn;
