var http = require("http");
var WebSocketServer = require('ws').Server;

wss = new WebSocketServer({ port: 8080, path: '/chat' });

var clients = [];

http.createServer(function (req, res) {
    res.writeHeader(200, {
        "Content-Type": "text/event-stream"
        , "Cache-Control": "no-cache"
        , "Connection": "keep-alive"
        , "Access-Control-Allow-Origin": "*"
    });

    wss.on("connection", function (ws) {
        console.log("Novo cliente se conectou");
        clients.push(ws);
        ws.on("message", function (message) {
            for (let index = 0; index < clients.length; index++) {
                clients[index].send(JSON.stringify({ text: message }));
            }
            sendToReadOnly(message);
        });
    });

    function sendToReadOnly(message) {
        message = JSON.stringify({ text: message })
        res.write("data: " + message + "\n\n");
    }

}).listen(9090);