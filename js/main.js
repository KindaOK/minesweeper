/***
 * Defines a rectangular object that can be rendered on the screen
 */
class Sprite {
  /**
   *
   * @param {number} x the x position of the top left corner
   * @param {number} y the y position of the top left corner
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /***
   * Render the sprite at its position on the screen
   */
  draw() {}

}

/***
 * Defines a rectangular clickable sprite that does something when clicked
 */
class Clickable extends Sprite {
//we might want to make this a subclass of sprite and just display sprites
  /**
   *
   * @param {number} x the x position of the top left corner
   * @param {number} y the y position of the top left corner
   * @param {number} width the width of the zone
   * @param {number} height the height of the zone
   */
  constructor(x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  left_click() {}

  right_click() {}

  test_click(x, y, button) {
    if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
      if (button === 0) {
        this.left_click();
      } else if (button === 2) {
        this.right_click()
      }
      return true;
    }
    return false;
  }

}

class MineTile extends Clickable {
  constructor(x, y, width, height, trueX, trueY) {
    super(x, y, width, height);
    this.trueX = trueX;
    this.trueY = trueY;
    //states are 0(default), 1(flagged), or 2(unknown)
    this.state = 0;
    this.font = height + "px Verdana";
  }

  left_click() {
    minefield.reveal(this.trueX, this.trueY);
  }

  right_click() {
    this.state = (this.state + 1) % 3;
    if (this.state === 1) {
      minefield.mines_flagged++;
    }
    if (this.state === 2) {
      //if a mines shifts to this states, we need to reduce mines flagged because state 1 increased that
      minefield.mines_flagged--;
    }
  }

  draw() {
    //if the mine is revealed, draw the thing
    if (minefield.revealed[this.trueX][this.trueY]) {
      ctx.fillStyle = "#888888";
      ctx.strokeStyle = "#999999";
      ctx.lineWidth = 1;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      if (minefield.grid[this.trueX][this.trueY] === -1) {
        ctx.fillStyle = "#ff0000";
      } else {
        ctx.fillStyle = "#ff00ff";
      }
      ctx.font = this.font;
      ctx.textAlign = "center";
      ctx.fillText(minefield.grid[this.trueX][this.trueY] === -1 ? "*" :
        minefield.grid[this.trueX][this.trueY] === 0 ? "" : minefield.grid[this.trueX][this.trueY], this.x + this.width/2, this.y + this.height*.9);
      //if the tile is not revealed, just draw a grid box
    } else {
      ctx.fillStyle = "#222222";ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      switch (this.state) {
        case 0:
          break;
        case 1:
          ctx.beginPath();
          ctx.moveTo(this.x + this.width/2, this.y + this.height);
          ctx.strokeStyle = "#ff00ff";
          ctx.lineTo(this.x + this.width/2, this.y + this.height/3);
          ctx.strokeStyle = "#000000";
          ctx.lineTo(this.x + this.width*.75, this.y + this.height/2);
          ctx.lineTo(this.x + this.width/2, this.y + this.height*.66);
          ctx.fillStyle = "#ff0000";
          ctx.fill();
          break;
        case 2:
          ctx.fillStyle = "#ff00ff";
          ctx.font = this.font;
          ctx.textAlign = "center";
          ctx.fillText("?", this.x + this.width/2, this.y+this.height*.9, this.width);
          break;
        default:
          break;
      }
    }
  }

}

class Button extends Clickable{
  /**
   * Creates a button which runs a function when it is clicked
   * @param x
   * @param y
   * @param width
   * @param height
   * @param {string} text The text on the button
   * @param {function} action The function the button runs on press
   */
  constructor(x, y, width, height, text, action) {
    super(x, y, width, height);
    this.text = text;
    this.action = action;
    this.font = height + "px Verdana"
  }

  left_click() {
    this.action();
  }

  draw() {
    ctx.fillStyle = "#000099";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = this.font;
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.x + this.width/2, this.y + this.height*.9, this.width);
  }

}

class Timer extends Sprite {
  constructor(x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.font = height + "px Consolas";
  }

  draw() {
    ctx.fillStyle = "#333333";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#999999";
    ctx.textAlign = "center";
    ctx.font = this.font;
    ctx.fillText(Math.floor(play_time/60) + ":" + (play_time%60 < 10 ? "0": "") + play_time%60 , this.x + this.width/2, this.y + this.height*.9);
  }
}

class Popup extends Clickable {
  constructor(title_text) {
    //the popup covers the entire screen
    super(0, 0, canvas.width, canvas.height);
    this.title_text = title_text;
  }

  draw() {
    ctx.fillStyle = "#dfafaf";
    ctx.fillRect(this.width*.33, this.height*.15, this.width*.33, this.height*.55);
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.width*.33, this.height*.15, this.width*.33, this.height*.55);
    ctx.fillStyle = "#ffffff";
    ctx.font = "40px Verdana";
    ctx.textAlign = "center";
    ctx.fillText(this.title_text, this.width/2, this.height*.23, this.width*.33);
  }

  init() {
    sprites.push(new Button(this.width*.45, this.height*.25, this.width*.1, this.height*.1, "Beginner", () => init_game(10, 10, 10)));
    sprites.push(new Button(this.width*.45, this.height*.40, this.width*.1, this.height*.1, "Intermediate", () => init_game(30, 15, 50)));
    sprites.push(new Button(this.width*.45, this.height*.55, this.width*.1, this.height*.1, "Advanced", () => init_game(50, 30, 100)));
  }
}

/**
 * Represents a minefield
 * Mines are a -1, all other tiles are either 0(blank) or the number of mines next to them
 * grid is called by grid[x][y]
 */
class Minefield {
  constructor(width, height, mines) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.mines_flagged = 0;
    this.grid = new Array(this.width);
    //create the grid
    for (let i = 0; i < this.width; i++) {
      this.grid[i] = new Array(this.height).fill(0)
    }
    //create a grid of revealed tiles
    //0 indicates hidden, 1 indicates revealed
    this.revealed = new Array(this.width);
    for (let i = 0; i < this.width; i++) {
      this.revealed[i] = new Array(this.height).fill(0)
    }
    //add mines
    for (let i = 0; i < this.mines; i++) {
      while (true) {
        let randY = randRange(0, this.height);
        let randX = randRange(0, this.width);
        if (this.grid[randX][randY] !== -1) {
          this.grid[randX][randY] = -1;
          break;
        }
      }
    }
    //calculate neighbors
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.grid[i][j] !== -1) {
          this.grid[i][j] = this._num_neighboring_mines(i, j);
        }
      }
    }
  }

  _num_neighboring_mines(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      if (x + i < 0 || x + i >= this.width) continue;
      for (let j = -1; j <= 1; j++) {
        if (y + j < 0 || y + j >= this.height) continue;
          if (this.grid[x+i][y+j] === -1) {
            count++;
          }
      }
    }
    return count;
  }

  reveal(x, y) {
    //if this tile is already revealed, do nothing
    if (this.revealed[x][y]) return;
    //if the tile is a mine, end the game
    if (this.grid[x][y] === -1) this.end_game();
    //if this tile is a number, only reveal it
    if (this.grid[x][y] !== 0) {
      this.revealed[x][y] = 1;
      return;
    }
    //if the tile is blank, reveal it and all surrounding tiles
    if (this.grid[x][y] === 0) {
      this.revealed[x][y] = 1;
      for (let i = -1; i <= 1; i++) {
        if (x + i < 0 || x + i >= this.width) continue;
        for (let j = -1; j <= 1; j++) {
          if (y + j < 0 || y + j >= this.height) continue;
          this.reveal(x+i, y+j);
        }
      }
    }
  }

  end_game() {
    //reveal all mine tiles
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.grid[i][j] === -1) {
          this.revealed[i][j] = 1;
        }
      }
    }
    end_game(false)
  }

  check_if_win() {
    if (this.already_won) return;
    let tiles_undiscovered = 0;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (!this.revealed[i][j]) tiles_undiscovered++;
      }
    }
    if (tiles_undiscovered === this.mines){
      this.already_won = true;
      end_game(true);
    }
  }

}




/**
 * Return a random int between min(inclusive) and max(exclusive)
 * @param min
 * @param max
 */
function randRange(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}


function get_mouse_pos(event) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: Math.round((event.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
    y: Math.round((event.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
  };
}

function reverse(arr) {
  let new_arr = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    new_arr[i] = arr[arr.length - 1 - i];
  }
  return new_arr;
}

function on_mouse_down(event) {
  let pos = get_mouse_pos(event);
  for(const sprite of reverse(sprites)) {
    //ensures that only the top sprites get clicked
    if (sprite instanceof Clickable) {
      if (sprite.test_click(pos.x, pos.y, event.button)) {
        //needs to be unreversed
        return
      }
    }
  }
}
function draw() {
//sprites on the top are drawn last
//sprites added most recently are at the end of the list
  for(const sprite of sprites) {
    sprite.draw();
  }
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render() {
  clear();
  draw();
}

function end_game(win) {
  clearInterval(game_timer);
    if (win) {
      let popup =  new Popup("You win!");
      sprites.push(popup);
      popup.init();
    } else {
      let popup = new Popup("You lose!");
      sprites.push(popup);
      popup.init();
    }
}

function update() {
  minefield.check_if_win();
  render();
}

function get_random_color() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function init_game(width, height, mines) {
  minefield = new Minefield(width, height, mines);
  sprites = [];
  //-50 accounts for the space the title plage takes up
  let tile_size = Math.min(canvas.width/width, (canvas.height-50)/height);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      sprites.push(new MineTile(tile_size*i, tile_size*j+50, tile_size, tile_size, i, j));
    }
  }
  play_time = 0;
  game_timer = setInterval(() => play_time++, 1000);
  sprites.push(new Timer(0, 0, 150, 50));
  sprites.push(new Button(150, 0, 150, 50, "New Game", () => {end_game(false);}))
}


//disables the context menu when you left click on the canvas
$('body').on('contextmenu', '#canvas', function(e){ return false; });
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


let frame_count = 0;

let sprites = [];
let minefield = [];
let play_time = 0;
let game_timer = 0;
// for (let i = 0; i < 10; i++) {
//   for (let j = 0; j < 10; j++) {
//     sprites.push(new DisplayTimesClicked(30*i, 30*j, 30, 30, get_random_color()))
//   }
// }
// sprites.push(new DisplayTimesClicked(50, 50, 50, 50, "#363cff"));
//canvas.addEventListener("mousemove", this.detect_mouse, false);
canvas.addEventListener("mousedown", on_mouse_down, false);
setInterval(update, 100);

init_game(50, 30, 10);
