import TileMap from "./TileMap.js";
const tileSize = 32;
let velocity = 3;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileMap = new TileMap(tileSize);
const hero = tileMap.getHero(velocity);

// KEY INPUT SENSING

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

let keyState = {}; // Object to store the state of each key

// handle keydown and keyup with event.code to get physical key code

function handleKeyDown(event) {
  keyState[event.code] = true;

  //Start game action
  if (keyState["KeyN"]) {
    startGameLoop();
  }

}

function handleKeyUp(event) {
  keyState[event.code] = false;
}

// START GAME ACTION
let gameRunning = false;

const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", startGameLoop);



//check if game loop is already running


function startGameLoop() {
  if (!gameRunning) {
    gameRunning = true;
    startButton.style.visibility = "hidden";
    gameLoop();
    // Hide the button
  }
}

// OTHER ELEMENTS AND BUTTONS

const helpButton = document.querySelector("#helpButton");
const help = document.querySelector(".help");

helpButton.addEventListener("click", handleHelp);
const computedStyle = getComputedStyle(help);

function handleHelp() {
  if (computedStyle.visibility === "hidden") {
    helpButton.style.background = "transparent";
    help.style.visibility = "visible";
  } else {
    helpButton.style.background = "white";
    help.style.visibility = "hidden";
  }
}

// GAME LOOP

function gameLoop() {
  tileMap.drawInitial(canvas, ctx);

  if (gameRunning) {

    if (keyState["ArrowUp"]) {
      // Perform action when ArrowUp key is pressed
      console.log("move_up");
      hero.moveUp();
    }

    if (keyState["ArrowDown"]) {
      // Perform action when ArrowDown key is pressed
      console.log("move_down");
      hero.moveDown();
    }

    if (keyState["ArrowRight"]) {
      // Perform action when ArrowDown key is pressed
      console.log("move_right");
      hero.moveRight();
    }

    if (keyState["ArrowLeft"]) {
      // Perform action when ArrowDown key is pressed
      console.log("move_left");
      hero.moveLeft();
    }

    tileMap.draw(canvas, ctx);
    hero.draw(ctx);
    hero.winCondition();
    hero.surfaceBehaviour();
    // hero.uncoverTile();

  }
}

setInterval(gameLoop, 1000 / 60);



