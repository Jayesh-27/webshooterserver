const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server running on ws://localhost:8080");

wss.on('connection', function connection(ws) {
  console.log("Client connected!");

  ws.on('message', function incoming(data) {
    console.log('Received from client:', data.toString());

    // Reply back to Unity
    ws.send("Hello from server!");
  });

  ws.on('close', () => {
    console.log("Client disconnected.");
  });
});
