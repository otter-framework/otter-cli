export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-9981a5664d47d1eb.elb.us-east-2.amazonaws.com:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://gbcukl6rb1.execute-api.us-east-2.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://awp8bkb3x2.execute-api.us-east-2.amazonaws.com/dev";