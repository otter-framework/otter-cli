import { Ora } from "ora";
import * as ui from "./ui.js";

export const errorHandler = (errorMessage: string, spinner?: Ora) => {
  spinner?.fail();
  ui.warn(`Error: ${errorMessage}`);
  process.exit();
};
