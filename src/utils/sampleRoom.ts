import axios from "axios";
import { config } from "./config.js";

export const getSampleRoomUrl = async (): Promise<string> => {
  const endpoint = config.get("apiEndpoint") + "/createRoom";
  const requestBody = { uniqueName: "otter-sample-room" };
  const response = await axios.post(endpoint, requestBody, {
    headers: {
      Authorization: config.get("apiKey") as string,
    },
  });

  const url: string = response.data?.url;
  return url;
};
