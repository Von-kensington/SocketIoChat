(function () {
  // Input Obj
  const Input = {
    key: [0, 0],
    updateKeys: function (code, val) {
      switch (code) {
        case "KeyW":
        case "ArrowUp":
          this.key[0] = -val;
          break;
        case "KeyS":
        case "ArrowDown":
          this.key[0] = val;
          break;
        case "KeyA":
        case "ArrowLeft":
          this.key[1] = -val;
          break;
        case "ArrowRight":
        case "KeyD":
          this.key[1] = val;
          break;
      }
    },
  };

  // Class declaration
  class Player {
    constructor(x, y, id, angle) {
      this.x = x;
      this.y = y;
      this.id = id;
      this.angle = angle;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Math.PI / 2);
      let img = new Image();
      img.src = "Player.png";
      (img.width = img.width / 2),
        (img.height = img.height / 2),
        ctx.drawImage(
          img,
          -img.width / 2,
          -img.height / 2,
          img.width,
          img.height
        );
      ctx.restore();
    }
    move(directionArr) {
      players.forEach(element => {
        if(element.id !== currentPlayer.id){
          let sidex = element.pos.x - currentPlayer.x;
          let sidey = element.pos.y - currentPlayer.y;
          if(element.pos.x >= currentPlayer.x - 100 && element.pos.x <= currentPlayer.x + 100 && element.pos.y >= currentPlayer.y - 100 && element.pos.y <= currentPlayer.y + 100) {
            if(sidex < 0 ){
              socket.emit("movePlayer", [0, 1]);
            } else{
              socket.emit("movePlayer", [0, -1]);
            }
            if(sidey < 0){
              socket.emit("movePlayer", [1, 0]);
            }else{
              socket.emit("movePlayer", [-1, 0]);
            }
          }
        }
      });;
      socket.emit("movePlayer", directionArr);
    }
  }

  // Global variables
  var socket = io();
  let players = [];
  let currentPlayerData = null;
  let currentPlayer;
  let playerPrevInput;
  var chatOpen = false;
  // Canvas vars
  const can = document.createElement("canvas");
  const ctx = can.getContext("2d");
  document.body.appendChild(can);

  // Methods
  const resizeCanvas = function () {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
  };
  const chat = function () {
    if (chatOpen) {
      chatOpen = false;
      return;
    }
    chatOpen = true;
    let textInput = document.createElement("input");
    textInput.type = "text";
    textInput.setAttribute("style", "position: absolute; bottom: 10; left: 10");
    document.body.append(textInput);
    textInput.focus();
    textInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        socket.emit("sentMessage", textInput.value);
        textInput.value = "";
        textInput.remove();
      }
    };
  };

  const gameLoop = function () {
    socket.emit("gameLoop");
    ctx.clearRect(0, 0, can.width, can.height);

    players.forEach((playerData) => {
      let player = new Player(
        playerData.pos.x,
        playerData.pos.y,
        playerData.id,
        playerData.angle
      );

      if (player.id === socket.id) {
        currentPlayer = player;
        currentPlayer.move(Input.key);
      }
      player.draw();
    });

    requestAnimationFrame(gameLoop);
  };

  // Event listeners
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("fullscreenchange", resizeCanvas);
  resizeCanvas();

  window.addEventListener("keypress", (e) => {
    Input.updateKeys(e.code, 1);
    if (e.key === "Enter") chat();
  });
  window.addEventListener("keyup", (e) => {
    Input.updateKeys(e.code);
  });
  can.addEventListener("mousemove", (e) => {
    let rect = can.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    socket.emit(
      "requestedAngle",
      Math.atan2(y - currentPlayerData?.pos.y, x - currentPlayerData?.pos.x)
    );
  });

  // Socket Events
  socket.on("drawPlayers", (data) => {
    players = Object.values(data);
    if (
      Object.values(data).forEach((element) => {
        currentPlayerData = element;
      })
    );
  });

  let pPrev = null;
  socket.on("receiveMessage", (msg) => {
    pPrev?.remove();
    let p = document.createElement("p");
    p.setAttribute("style", "position: absolute; bottom: 100; left: 10");
    p.innerText += msg + "\n";
    document.body.append(p);
    pPrev = p;
    console.log("Recieved Message!");
  });
  // Method calls
  gameLoop();
})();
