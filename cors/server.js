const http = require("http");

const result = {
  status: 200,
  message: "hello world!"
}
const port = 3030;
const host = "localhost";


const server = http.createServer(function(request, response) {
  console.log(`${request.url} 访问了服务器`);
  const url = request.url;

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST",
    // "Access-Control-Allow-Headers": response.getHeader("Access-Control-Request-Headers")
  };
  Object.keys(headers).forEach(key => {
    response.setHeader(key, headers[key]);
  })

  if (url.startsWith("/cors")) {
    response.write(JSON.stringify(result));
  } else if (url.startsWith("/jsonp")) {
    console.log("jsonp");
    const callbackFoo = "handleJsonp";
    response.write(`${callbackFoo}(${JSON.stringify(result)})`);
  }

  response.end();
})

server.listen(3030, "localhost")

console.log(`http://${host}:${port}`);
console.log("服务器已启动!");