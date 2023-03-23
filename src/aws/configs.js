export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-2a78fcd36aa96a7b.elb.us-east-2.amazonaws.com:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://fl38jr6f18.execute-api.us-east-2.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://826vk8iv18.execute-api.us-east-2.amazonaws.com/v1";