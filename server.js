const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let clients = new Set();

wss.on('connection', function connection(ws) {
  clients.add(ws);
  console.log('Client connected. Total:', clients.size);

  ws.on('message', function incoming(message) {
    // Broadcast to all other clients
    for (let client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total:', clients.size);
  });
});
