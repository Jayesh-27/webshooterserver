const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('🟢 Client connected. Total:', clients.size);

  ws.on('message', (msg) => {
    for (let client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('🔴 Client disconnected. Total:', clients.size);
  });
});

app.get('/', (req, res) => {
  res.send(`Server is up: ✅<br>Connected Devices: ${clients.size}`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
