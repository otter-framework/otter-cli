import { Command } from "@oclif/core";
import { getSampleRoomUrl } from "../utils/sampleRoom.js";

export class Dev extends Command {
  static description = "why are you here?";

  async run(): Promise<void> {
    await getSampleRoomUrl();
  }
}
