const CLI = require("clui");

const generateSpinner = (spinnerText) => {
  const Spinner = CLI.Spinner;
  let spinner = new Spinner(spinnerText, [
    "⣾",
    "⣽",
    "⣻",
    "⢿",
    "⡿",
    "⣟",
    "⣯",
    "⣷",
  ]);
  spinner.start();
  return spinner;
};

module.exports = generateSpinner;
