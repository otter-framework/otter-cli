export const RTCConfig = {
      iceServers: [
        {
          urls: [
            "turn:otter-coturn-nlb-2fdceaf3f1b7d475.elb.us-east-2.amazonaws.com:80",
          ],
          username: "1679249183-:-DefaultName",
          credential: "e5QpXrS9wtJsxGcSzRhZeI0QngE=",
        },
      ],
      iceCandidatePoolSize: 10,
    };
    
  export const WebSocketEndpoint = "wss://ek8xp7flkg.execute-api.us-east-2.amazonaws.com/dev";
  export const RESTAPIEndpoint = "https://154bolq0tc.execute-api.us-east-2.amazonaws.com/dev";