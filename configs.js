export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-e7596120cbc0bfe0.elb.us-west-1.amazonaws.com:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://kjyjkgps40.execute-api.us-west-1.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://r2jif4pueb.execute-api.us-west-1.amazonaws.com/dev";