import { Command } from "@oclif/core";
import { generateApiKey } from "../utils/generateApiKey.js";

export class Dev extends Command {
  static description = "why are you here?";

  async run(): Promise<void> {
    generateApiKey();
  }
}
