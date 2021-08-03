const axios = require("axios");

axios.interceptors.request.use((request) => {
  request.meta = request.meta || {};
  request.meta.requestStartedAt = new Date().getTime();
  return request;
});

const buildLogResponse = (response) => {
  const workingResponse = response.response || response;
  return {
    status: workingResponse.status,
    statusText: workingResponse.statusText,
    body: workingResponse.data,
    headers: workingResponse.headers,
  };
};

const logResponse = (status, response) => {
  const logObject = JSON.parse(
    JSON.stringify({
      status,
      code: response.code,
      reason: response.message || response.statusText,
      request: {
        url: response.config.url,
        method: response.config.method,
        body: response.config.data,
        headers: response.config.headers,
        timeout: response.config.timeout,
      },
      response: buildLogResponse(response),
      responseTime: response.config.meta.requestStartedAt
        ? new Date().getTime() - response.config.meta.requestStartedAt
        : undefined,
    })
  );

  console.log(logObject);
};

const result = axios
  .post(
    "http://demo7300757.mockable.io/post",
    { body: "bode" },
    {
      headers: {
        "header-cliet": "header-client-value",
      },
      timeout: 1,
    }
  )
  .then((err) => {
    logResponse("success", err);
  })
  .catch((err) => {
    logResponse("failed", err);
  });
