const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Set();

// WebSocket connection handling
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

// HTTP GET to show server status
app.get('/', (req, res) => {
  res.send(`Server is up: ✅<br>Connected Devices: ${clients.size}`);
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
