import ora from "ora";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";

export const warning = chalk.yellow;
export const red = chalk.red;
export const highlight = chalk.bold.hex("#39C5FB");
export const cyan = chalk.cyan;
export const green = chalk.green;
export const secondary = chalk.gray;
export const otterGradient = gradient(["#B175FF", "#6077FF", "#39C5FB"]);

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

export const error = (text: string) => {
  console.log(red(text));
};

export const success = (text: string) => {
  console.log(green(text));
};

export const clear = () => {
  console.clear();
};

export const generateLogo = (): void => {
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

export const hello = (): void => {
  clear();
  console.log(otterGradient("\nWelcome to Otter CLI!\n"));
};

export const printOtter = (): void => {
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
