//引入node的http模組。
const http = require("http");

//定義個function來處理即將到來的http request.
requestHandler = (request, response) => {

    // 1. 看看自己的url及method
    console.log("this request from " + request.url);
    console.log("this request method: " + request.method);

    // 2. 塞個response header
    response.setHeader("Content-Type", "application/json");

    // 3. 回傳JSON格式的response訊息
    const json = JSON.stringify({
        say: 'hi',
        no: 'no~~',
    });

    response.end(json);
}

//使用http模組來建立一個server，並使用上述定義的function來處理request.
const server = http.createServer(requestHandler);
// http.createServer = https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#create-the-server

//啟動server並使用3000的port.
server.listen(5000);
