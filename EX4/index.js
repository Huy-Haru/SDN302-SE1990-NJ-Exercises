const http = require("http");
const path = require("path");
const { readFile } = require("./file");
const hostname = "localhost";
const port = 8082;

const server = http.createServer(async (request, response) => {
  if (request.method !== "GET") {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end("<h1>Error 404: Method not supported</h1>");
    return;
  }

  const requestedFile = request.url === "/" ? "/index.html" : request.url;
  const filePath = path.resolve(__dirname, "public", `.${requestedFile}`);
  const publicPath = path.resolve(__dirname, "public");

  if (
    !filePath.startsWith(`${publicPath}${path.sep}`) ||
    path.extname(filePath) !== ".html"
  ) {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end("<h1>Error 404: File not found</h1>");
    return;
  }

  try {
    const data = await readFile(filePath);
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(data);
  } catch (error) {
    console.error("Error reading file:", error);
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end("<h1>Error 404: File not found</h1>");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Console will print the message
console.log(`Server running at http://${hostname}:${port}/`);
