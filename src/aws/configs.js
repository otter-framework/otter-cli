export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-1e003da3ecd9ec11.elb.us-east-2.amazonaws.com:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://8giz6mrbsd.execute-api.us-east-2.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://4wkv9i0pcb.execute-api.us-east-2.amazonaws.com/v1";