import ora from "ora";
import chalk from "chalk";
import figlet from "figlet";

export const warning = chalk.yellow;
export const error = chalk.red;
export const highlight = chalk.cyan.bold;
export const cyan = chalk.cyan;
export const green = chalk.green;

export let logo: string | undefined;

export const spinner = (text: string) => {
  return ora({ text }).start();
};

export const emptySpinner = () => {
  return ora();
};

export const display = (text: string) => {
  console.log(text);
};

export const warn = (text: string) => {
  console.log(warning(text));
};

export const success = (text: string) => {
  console.log(green(text));
};

export const clear = () => {
  console.clear();
};

export const generateLogo = () => {
  figlet.text(
    "Otter",
    {
      font: "Small Isometric1",
      horizontalLayout: "fitted",
      whitespaceBreak: true,
    },
    (err, data) => {
      if (err) {
        console.log(err.message);
        return;
      }
      logo = data;
    }
  );
};

export const hello = () => {
  clear();

  console.log(cyan("Welcome to Otter!\n"));
};

export const printOtter = () => {
  console.log("\n");
  console.log(`
      .-"""-.                      
    /      o\                       
   |    o   0).-.                  
   |       .-;(_/     .-.         
    \\     /  /)).---._|  \`\\   , 
      '.  '  /((       \`'-./ _/| 
        \\  .'  )        .-.;\`  / 
        '.             |  \`\-' 
          '._        -'    /     
              \`\`""--\`------\``);
};
