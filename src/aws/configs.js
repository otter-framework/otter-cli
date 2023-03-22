export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-3b379a0c7a368847.elb.us-east-2.amazonaws.com:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://ccmi4vcy7h.execute-api.us-east-2.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://pnic54i7zc.execute-api.us-east-2.amazonaws.com/v1";