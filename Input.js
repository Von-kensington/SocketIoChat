const Input = {
  key: [0, 0],
  updateKeys: function (code, val) {
    switch (code) {
      case "KeyW":
      case "ArrowUp":
      case "KeyS":
      case "ArrowDown":
        this.key[0] = val;
        break;
      case "KeyA":
      case "ArrowLeft":
      case "ArrowRight":
      case "KeyD":
        this.key[1] = val;
        break;
    }
  },
};

export default Input;
