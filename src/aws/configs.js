export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-d4fad5a0f2f6090b.elb.us-east-2.amazonaws.com:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://0j2ywox280.execute-api.us-east-2.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://xe0ugafc7g.execute-api.us-east-2.amazonaws.com/v1";