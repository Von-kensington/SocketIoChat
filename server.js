const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let playerData = {};
let currentUserId = 0;

io.on("connection", (socket) => {
  console.log("New connection established!");
  socket.on("disconnect", () => {
    console.log("client disconnected!");
    currentUserId--;
    delete playerData[socket.id];
  });
  currentUserId++;

  // Declare player obj
  playerData[socket.id] = {
    pos: { x: Math.random() * 1000, y: Math.random() * 1000 },
    id: socket.id,
    angle: 0,
  };

  //Move and rotate player
  socket.on("movePlayer", (directionArr) => {
    let y = playerData[socket.id].pos.y + directionArr[0] * 2;
    let x = playerData[socket.id].pos.x + directionArr[1] * 2;
    playerData[socket.id] = { ...playerData[socket.id], pos: { x: x, y: y } };
  });
  socket.on("requestedAngle", (angle) => {
    playerData[socket.id] = { ...playerData[socket.id], angle: angle };
  });

  // Game Loop
  socket.on("gameLoop", () => io.emit("drawPlayers", playerData));
  socket.on("sentMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
