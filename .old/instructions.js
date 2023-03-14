const cfonts = require("cfonts");

const printInstructions = () => {
  console.clear();

  cfonts.say("Otter", {
    font: "3d", // define the font face
    align: "center", // define text alignment
    colors: ["blue", "green"], // define all colors
    background: "transparent", // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1, // define letter spacing
    lineHeight: 1, // define the line height
    space: true, // define if the output text should have empty lines on top and on the bottom
    maxLength: "0", // define how many character can be on one line
    gradient: ["#012254", "#6592d6"], // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: true, // define if this is a transition between colors directly
    env: "node", // define the environment cfonts is being executed in
  });

  console.log(
    `\nBefore you continue, you will need you AWS access key and secret access key.`
  );
  console.log("Here are some steps to help you get an access key:");
  console.log("\n\n1. Sign in to the AWS Management Console.");
  console.log("2. Open the IAM console.");
  console.log("3. In the left-hand navigation pane, click on Users.");
  console.log(
    "4. Click on the user for which you want to generate access keys."
  );
  console.log("5. Click on the Security credentials tab.");
  console.log("6. Under Access keys, click on the Create access key button.");
  console.log(
    "7. Click on the Download .csv button to download the CSV file containing your access key ID and secret access key."
  );
  console.log("8. Save the CSV file in a secure location.");
};

module.exports = printInstructions;
