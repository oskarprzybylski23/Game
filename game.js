import TileMap from "./TileMap.js";
const tileSize = 32;
let velocity = 2;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileMap = new TileMap(tileSize);
const hero = tileMap.getHero(velocity);

const uncoveredTime = 0;
let remainingTime = tileMap.targetTime;
let actualTime = 0;
let coverVisible = false;
let pauseGame = true;

// === KEY INPUT SENSING ===

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

// === START GAME ACTION ===

let gameRunning = false; //change to false

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

// === TIMER ===

function updateTimer() {
  if (coverVisible === true) {
    const remainingTimeElement = document.getElementById("timer");
    remainingTimeElement.textContent = Math.ceil(remainingTime);
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    remainingTimeElement.textContent = formattedTime;

    document.getElementById("timer").style.visibility = "visible"
  } else {
    const remainingTimeElement = document.getElementById("timer");
    remainingTimeElement.textContent = "00:00";
  }
}

// === OTHER ELEMENTS AND BUTTONS ===

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

const continueButton = document.querySelector("#continueButton");
continueButton.addEventListener("click", handleContinue);

function handleContinue() {
  gameRunning = false;
  continueButton.style.visibility = "hidden";
  restartButton.style.visibility = "hidden";
  startButton.style.visibility = "visible";
  banner.style.visibility = "hidden";
  tileMap.nextMap();
  tileMap.resetcover();
  hero.findStartPosition();
  remainingTime = tileMap.targetTime;
  actualTime = 0;
  winorlose = 0;
}

const restartButton = document.querySelector("#restartButton");
restartButton.addEventListener("click", handleRestart);

function handleRestart() {
  gameRunning = false;
  continueButton.style.visibility = "hidden";
  restartButton.style.visibility = "hidden";
  startButton.style.visibility = "visible";
  banner.style.visibility = "hidden";
  tileMap.resetcover();
  hero.findStartPosition();
  remainingTime = tileMap.targetTime;
  actualTime = 0;
  winorlose = 0;
}

// === WIN AND LOSE ACTIONS ===

const banner = document.querySelector(".banner-container");
const bannerHeading = document.getElementById("banner-heading");
const bannerMessageOne = document.getElementById("banner-message-1");
const bannerMessageTwo = document.getElementById("banner-message-2");

//win
document.addEventListener('winEvent', handleWin);
let winorlose = 0;

function handleWin(event) {
  winorlose = 1;
  pauseGame = true;
  coverVisible = false;
  continueButton.style.visibility = "visible";
  restartButton.style.visibility = "visible";
  banner.style.visibility = "visible";
  let playerTime = (tileMap.targetTime - remainingTime).toFixed(2);
  bannerHeading.textContent = "YOU WON!!!";
  bannerMessageOne.textContent = "Congratulations! You reached the destination in " + playerTime + " seconds.";
  bannerMessageTwo.textContent = "Continue to the next adventure, or repeat your hike to see if you can improve your time."

}

//lose
function loseGame() {
  winorlose = 1;
  pauseGame = true;
  remainingTime = 0;
  restartButton.style.visibility = "visible";
  banner.style.visibility = "visible";
  bannerHeading.textContent = "Time's Up!";
  bannerMessageOne.textContent = "You didn't manage to get to the destination before the night. You have to camp in the wild.";
  bannerMessageTwo.textContent = "Don't give up, try again, or take a break and try later!"
}

//game complete
document.addEventListener('gameCompleteEvent', handleGameComplete);

function handleGameComplete() {
  console.log("game complete!!!!")
  continueButton.style.visibility = "visible";
  startButton.style.visibility = "hidden";
  banner.style.visibility = "visible";
  bannerHeading.textContent = "Congratulations!";
  bannerMessageOne.textContent = "You have conquered all trails! Keep playing to see if you can improve your time!";
  bannerMessageTwo.textContent = "If you feel particularly adventurous, visit the github repo and add your own maps.</a>"
}

// === GAME LOOP ===

function gameLoop() {

  tileMap.drawInitial(canvas, ctx);

  if (gameRunning) { //block to be only executed if gameplay is underway

    //key actions

    if (pauseGame === false) {
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
        // Perform action when ArrowRight key is pressed
        console.log("move_right");
        hero.moveRight();
      }

      if (keyState["ArrowLeft"]) {
        // Perform action when ArrowLeft key is pressed
        console.log("move_left");
        hero.moveLeft();
      }

      remainingTime -= 1 / 60;

    }

    //draw map and hero layers
    tileMap.draw(canvas, ctx);
    hero.draw(ctx);
    hero.winCondition();
    hero.surfaceBehaviour();
    hero.uncoverTile();

    //timer

    actualTime += 1 / 60;

    updateTimer();

    if (remainingTime <= 0) {
      console.log("Time's up!");
      loseGame();
    }

    if (actualTime >= uncoveredTime && winorlose === 0) {
      coverVisible = true;
      pauseGame = false;
    }

    if (coverVisible === true) {
      tileMap.drawcover(ctx);
    }

    // console.log("actual time: " + Math.ceil(actualTime));
    // console.log("remaining time: " + Math.ceil(remainingTime));
    // console.log("cover" + coverVisible)
    // console.log("pause: " + pauseGame);
  }
}

setInterval(gameLoop, 1000 / 60);



