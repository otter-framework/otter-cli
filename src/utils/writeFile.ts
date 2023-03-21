import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

export const writeFile = async (
  turnEndpt: string,
  wsEndpt: string,
  RESTEndpt: string
): Promise<void> => {
  return new Promise((res, _) => {
    const content = `export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:${turnEndpt}:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "${wsEndpt}";
  export const RESTAPIEndpoint = "${RESTEndpt}";`;
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      fs.writeFile(
        path.join(__dirname, "../aws/configs.js"),
        content,
        (err) => {
          if (err) {
            console.error(err);
          } else {
            res();
            // file written successfully
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
};
