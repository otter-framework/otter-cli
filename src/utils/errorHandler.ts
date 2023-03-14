import { Ora } from "ora";
import * as ui from "./ui.js";

export const errorHandler = (errorMessage: string, spinner?: Ora) => {
  spinner?.fail();
  ui.error(`Error: ${errorMessage}`);

  process.exit();
};

export const deployErrorHandler = (errorMessage: string, spinner?: Ora) => {
  spinner?.fail();
  ui.error(`Error: ${errorMessage}`);

  ui.display(
    "\nThere's an error during deployment. Please check your Otter configuration and try again." +
      "\nIf the error persists, please create an issue on the Otter Github repository."
  );
  process.exit();
};
