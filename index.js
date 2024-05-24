const WebSocketServer = require("./lib/websocket-server");
const http = require("http");   
const fs = require("fs");
const path = require("path");

const wss = new WebSocketServer({ port: 8888 });

wss.on("connection", (ws) => {
   
    ws.on("message", (message) => {
        console.log("Received: " + message);
        ws.send("Echo: " + message);
    });

    ws.on("close", () => {
        console.log("Connection closed");
    });

    ws.send("Hello! Message from server");

});

const server = http.createServer((req, res) => {
   const filePath = path.join(__dirname, 'public', req.url === '/' ? "index.html" : req.url);
   const extname = path.extname(filePath);

   let contentType = 'text/html';
    switch (extname) {
         case '.js':
              contentType = 'text/javascript';
              break;
         case '.css':
              contentType = 'text/css';
              break;
         case '.json':
              contentType = 'application/json';
              break;
         case '.png':
              contentType = 'image/png';
              break;
         case '.jpg':
              contentType = 'image/jpg';
              break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if(err.code == 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });


})

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});




