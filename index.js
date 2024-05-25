import { Player } from "./player.js";
import Dom from "./dom.js";
import { Computer } from "./computer.js";

let game;

const computerName = document.getElementById("computer");
const playerTwoName = document.getElementById("playerTwoName");
const playerTwoSelection = document.querySelector(".player-two-select");

document.addEventListener("DOMContentLoaded", () => {
  const playerOneNameInput = document.getElementById("playerOneName");
  //sets caret to end of name input
  playerOneNameInput.focus();
  playerOneNameInput.setSelectionRange(1000, 1000);
});

playerTwoSelection.addEventListener("click", toggleSelection);

function toggleSelection(event) {
  const selection = event.target;
  if (selection.classList.contains("name-input")) {
    const current = document.querySelector(".selected");
    current.classList.toggle("selected");
    selection.classList.toggle("selected");
  }
}
const scrollDownBtn = document.getElementById("scrollDown");
scrollDownBtn.addEventListener("click", gameSetup);
function scrollToGame() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.scrollIntoView({ behavior: "smooth", block: "center" });
}

function gameSetup() {
  game = Game();
  game.setup();
  scrollToGame();
}

function scrollToTop() {
  const gameStartPage = document.querySelector(".game-start");
  gameStartPage.scrollIntoView({ behavior: "smooth", block: "center" });
}

function Game() {
  const { playerOne, playerTwo } = initalisePlayers();
  const gui = Dom();
  let currentPlayer = playerOne;

  function initalisePlayers() {
    const playerOne = Player();
    const playerOneName = document.getElementById("playerOneName");
    playerOne.setName(playerOneName.value);

    let playerTwo;
    const selected = document.querySelector(".selected");
    if (selected.id === "computer") {
      playerTwo = Computer();
    } else {
      playerTwo = Player();
      playerTwo.setName(selected.value);
    }
    return { playerOne, playerTwo };
  }

  function setup() {
    gui.setup();
  }

  function run() {
    if (confirmAllShips()) {
      hideOverlays();
      gui.disableSetup();
      playTurn();
    }
  }

  function playTurn() {
    const opponent = getOpponent();
    disableAttacks(getBoard(currentPlayer));
    enableAttacks(getBoard(opponent));

    if (currentPlayer.isComputer()) {
      computerTurn();
    }
  }

  function computerTurn() {
    const opponentContainer = document.getElementById("playerOne");
    const computer = currentPlayer;
    computer.queueTarget();
    const [i, j] = computer.getTargetCoordinates();

    const targetCell = gui.getCell(opponentContainer, i, j);
    const cellObj = getOpponent().board.getCell(i, j);
    const shipFound = cellObj.hasShip();

    if (shipFound) {
      currentPlayer.saveTarget([i, j]);
    }
    targetCell.click();
    // after click, check if it was sunk
    if (shipFound) {
      const shipObj = cellObj.getShip();
      if (shipObj.isSunk()) computer.enemyShipSunk();
    }
  }

  function updateScores() {
    currentPlayer.incrementScore();
    const player = currentPlayer === playerOne ? "playerOne" : "playerTwo";
    gui.addPoint(player);
  }

  function checkForWinner() {
    const opponent = getOpponent();
    if (opponent.board.shipsSunk()) {
      updateScores();
      return true;
    }
    return false;
  }

  function declareWinner() {
    const name = currentPlayer.getName();

    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      const winner = document.createElement("h2");
      winner.textContent = `${name} wins!`;
      overlay.appendChild(winner);
    });
  }

  function endGame() {
    disableAttacks(getBoard(getOpponent()));
    hideBoards();
    declareWinner();
    promptPlayAgain();
  }

  function endTurn() {
    setTimeout(() => {
      const winner = checkForWinner();
      if (winner) {
        endGame();
      } else {
        switchTurn();
        playTurn();
      }
    }, 250);
  }

  function playAgain() {
    console.log("play Again");
  }
  function confirmEndGame() {
    scrollToTop();
    toggleInputs();
    resetGame();
  }

  function resetGame() {
    game = null;
  }

  function promptPlayAgain() {
    const container = document.querySelector("#playerTwo .overlay");
    const winnerText = container.querySelector("h2");
    const playAgainBtn = document.createElement("button");
    const endGameBtn = document.createElement("button");
    playAgainBtn.textContent = "Play Again";
    endGameBtn.textContent = "End Game";

    playAgainBtn.id = "playAgain";
    endGameBtn.id = "endGame";

    playAgainBtn.onclick = () => playAgain();
    endGameBtn.onclick = () => confirmEndGame();
    setTimeout(() => {
      container.removeChild(winnerText);
      container.append(playAgainBtn, endGameBtn);
    }, 2500);
  }

  function confirmAllShips() {
    const validShips = gui.confirmShips();
    if (validShips) {
      validShips.forEach((ship) => {
        let newShip;
        const { i, j, name, length, axis } = ship;
        if (axis === "vertical") {
          newShip = playerOne.board.createShip(name, length, axis);
        } else {
          newShip = playerOne.board.createShip(name, length);
        }
        playerOne.board.placeShip(newShip, i, j);
      });
      return true;
    }
    return false;
  }

  function switchTurn() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  function hideBoards() {
    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      overlay.classList.remove("hidden");
    });
  }

  function enableAttacks(board) {
    board.addEventListener("click", handleAttack);
  }

  function disableAttacks(board) {
    board.removeEventListener("click", handleAttack);
  }

  function handleAttack(event) {
    const target = event.target;
    if (validAttack(target)) {
      const attackSuccessful = sendAttack(target);
      if (attackSuccessful) endTurn();
    }
  }

  function validAttack(target) {
    if (target.classList.contains("grid-cell")) {
      const classes = Array.from(target.classList);
      if (classes.includes("hit") || classes.includes("miss")) return false;
      return true;
    }
    return false;
  }

  function validateOpponentBoard(target) {
    let isValid = false;
    const opponent = getOpponent();
    const [i, j] = target;
    const cell = opponent.board.getCell(i, j);
    if (cell) {
      isValid = opponent.board.validateAttack(cell);
    }
    return isValid;
  }

  function sendAttack(cell) {
    const [i, j] = gui.getIndexAttributes(cell);
    const opponent = getOpponent();
    const validAttack = opponent.board.recieveAttack(i, j);

    if (validAttack) {
      markCell(cell, opponent.board.getCell(i, j));
      disableAttacks(getBoard(getOpponent()));
      return true;
    } else {
      return false;
    }
  }

  function markCell(uiCell, cell) {
    if (cell.hasShip()) {
      uiCell.classList.add("hit");
    } else {
      uiCell.classList.add("miss");
    }
  }

  function getBoard(player) {
    const boards = document.querySelectorAll(".board");
    if (player === playerOne) {
      return boards[0];
    } else {
      return boards[1];
    }
  }

  function getOpponent() {
    if (currentPlayer === playerOne) {
      return playerTwo;
    }
    return playerOne;
  }

  return { playerOne, playerTwo, run, setup, validateOpponentBoard };
}

export { game };
