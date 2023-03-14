const getWsUrl = (apiGateway, API_name) => {
  return new Promise((res, rej) => {
    const getApiId = async (apiName) => {
      const apis = await apiGateway.getApis("", "");
      const api = apis.Items.find((item) => item.Name === apiName);
      return api.ApiId;
    };

    getApiId(API_name)
      .then((apiId) => {
        const params = {
          ApiId: apiId,
        };

        apiGateway.getApi(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            process.exit();
          }
          if (API_name == "MyHTTPAPIGateway") {
            console.log(
              "Your HTTP API Endpoint is: " + data.ApiEndpoint + "/dev"
            );
          } else {
            console.log(
              "Your WebSocket API Endpoint is: " + data.ApiEndpoint + "/dev"
            );
          }
          res();
        });
      })
      .catch((err) => console.log(err));
  });
};

module.exports = getWsUrl;
