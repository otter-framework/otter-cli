export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-d2b58903b8362cb6.elb.us-east-2.amazonaws.com:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://ozucda45m6.execute-api.us-east-2.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://sih76ibhkf.execute-api.us-east-2.amazonaws.com/v1";