export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-5de1cc846717fdc1.elb.us-east-2.amazonaws.com:80",
          ],
          username: "1679341410-:-DefaultName",
          credential: "9iNiJKJIpVC293f715Jf0+RdcMg=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://xcj8u9xhme.execute-api.us-east-2.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://ai1ywezm26.execute-api.us-east-2.amazonaws.com/dev";