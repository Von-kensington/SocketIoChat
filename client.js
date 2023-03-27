const can = document.createElement("canvas");
const ctx = can.getContext("2d");
document.body.appendChild(can);

var socket = io();

const resizeCanvas = function () {
  can.width = window.innerWidth;
  can.height = window.innerHeight;
};

window.addEventListener("resize", resizeCanvas);
//window.addEventListener('fullscreenchange', resizeCanvas);
resizeCanvas();

socket.on("drawPlayers", (data) => {
  players = Object.values(data);
  if(Object.values(data).forEach(element => {
    currentPlayer = element;
  }));
});

let players = [];
let currentPlayer = null;
var angle = 0;

class Player {
  constructor(x, y, id, angle) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.angle = angle;
  }
  draw(_angle) {

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.fillStyle = "red"
    ctx.fillRect(-10, -5, 20, 10);
    ctx.restore();
  }
}

can.addEventListener("mousemove", (e) => {
  let rect = can.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  socket.emit("requestedAngle", Math.atan2(y - currentPlayer.pos.y, x - currentPlayer.pos.x));
});

function gameLoop() {
  ctx.clearRect(0, 0, can.width, can.height);
  players.forEach(playerData =>
    {
      let player = new Player(playerData.pos.x, playerData.pos.y, playerData.id, playerData.angle);
      player.draw();
    });
  requestAnimationFrame(gameLoop);
}
gameLoop();
