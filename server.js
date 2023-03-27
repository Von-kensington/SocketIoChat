const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let players = {};
let currentUserId = 0;


io.on('connection', (socket) =>{
    console.log("New connection established!");
    socket.on('disconnect', () => {console.log('client disconnected!'); currentUserId--; delete players[socket.id];});
    currentUserId++;
    players[socket.id] = {pos: {x: Math.random() * 100, y: 500}, id: socket.id, angle: 0};
    socket.on('requestedAngle', angle => {players[socket.id] = {...players[socket.id], angle: angle}; io.emit('drawPlayers', players)});   
    io.emit('drawPlayers', players);
});

server.listen(3000, () =>{
    console.log('listening on port 3000');
});