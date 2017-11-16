const WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
var Order = require('./order/order');

var port = 9090;

app.use(express.static(path.join(__dirname, '/public')));

var wss = new WebSocketServer({server: server});
// Broadcast to all.
wss.broadcast = function broadcast (data) {
    wss.clients.forEach(function each (client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', function (ws) {
    console.log('started client');

    ws.on('message', function incoming (data) {
        var req = JSON.parse(data);
        console.log(req);
        if (typeof req.initData !== 'undefined') {
            ws.send(JSON.stringify({
                initData: Order.orders
            }));
        } else if (typeof req.batchAdd !== 'undefined') {
            var i = 0;
            var interval = setInterval(function () {
                console.log('add order');
                const addedOrder = Order.addOrder(Order.genOrder());
                wss.broadcast(JSON.stringify({
                    order: addedOrder
                }));
                i++;
                if (i === 5) {
                    clearInterval(interval);
                }
            }, 1000);
        } else {
            var updatedOrder = Order.addOrUpdateOrder(req.order);
            wss.broadcast(JSON.stringify({order: updatedOrder}));
        }
    });

    ws.on('close', function () {
        console.log('close client');
    });
});

server.on('request', app);
server.listen(port, function () {
    console.log(`Listening on http://localhost:${port}`);
});
