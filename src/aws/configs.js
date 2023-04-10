export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-b4657b32c0f832cf.elb.us-east-2.amazonaws.com:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://z7l2hi12r8.execute-api.us-east-2.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://mfiap95kc1.execute-api.us-east-2.amazonaws.com/v1";