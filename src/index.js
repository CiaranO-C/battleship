import { Player } from "./gameLogic/player.js";
import { Computer } from "./gameLogic/computer.js";
import "./styles/style.css";
import { getCell } from "./dom/boards.js";
import {
  runGame,
  toggleBoardListeners,
  switchTurn as guiSwitchTurn,
} from "./dom/gameManager/play.js";
import { gameResult, endGame as guiEndGame } from "./dom/gameManager/end.js";
import { confirmShips, setupGame } from "./dom/gameManager/setup.js";

let game;

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
scrollDownBtn.addEventListener("click", initialiseGame);

function scrollToGame() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.scrollIntoView({ behavior: "smooth", block: "center" });
}

function initialiseGame() {
  game = Game();
  game.setup();
  scrollToGame();
}

function Game() {
  const { playerOne, playerTwo } = initalisePlayers();

  //const gui = Dom();
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
    setupGame();
  }

  function run() {
    if (confirmAllShips()) {
      runGame();
      playTurn();
    }
  }

  function playTurn() {
    toggleBoardListeners();
    if (currentPlayer.isComputer()) {
      computerTurn();
    }
  }

  function sendAttack(coords) {
    const validCell = validateOpponentBoard(coords);
    if (validCell) {
      const [i, j] = coords;
      const opponent = getOpponent();
      opponent.board.recieveAttack(i, j);
      return validCell;
    }
    return false;
  }

  function computerTurn() {
    const opponentContainer = document.getElementById("playerOne");
    const computer = currentPlayer;
    computer.queueTarget();
    const [i, j] = computer.getTargetCoordinates();
    const targetCell = getCell(opponentContainer, i, j);
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

  function checkForWinner() {
    const opponent = getOpponent();
    if (opponent.board.shipsSunk()) {
      gameResult(currentPlayer.getName());
      currentPlayer.incrementScore();
      return true;
    }
    return false;
  }

  function endGame() {
    guiEndGame();
  }

  function endTurn() {
    setTimeout(() => {
      const winner = checkForWinner();
      if (winner) {
        endGame();
      } else {
        switchTurn();
        guiSwitchTurn();
        playTurn();
      }
    }, 250);
  }

  function playAgain() {
    playerOne.board.resetBoard();
    playerTwo.board.resetBoard();
    if (playerTwo.isComputer()) playerTwo.board.randomize();
  }

  function resetGame() {
    game = null;
  }

  function confirmAllShips() {
    const shipPackages = confirmShips();
    if (shipPackages) {
      let playerOneShips;
      if (playerTwo.isComputer()) {
        playerOneShips = shipPackages;
        generateShips(playerOne, playerOneShips);
      } else {
        const { packOne, packTwo } = shipPackages;
        console.dir(packOne);
        console.dir(packTwo);
        generateShips(playerOne, packOne);
        generateShips(playerTwo, packTwo);
      }
      return true;
    }
    return false;
  }

  function generateShips(player, shipPackages) {
    shipPackages.forEach((pack) => {
      const { i, j, name, length, axis } = pack;
      let newShip;
      if (axis === "vertical") {
        newShip = player.board.createShip(name, length, axis);
      } else {
        newShip = player.board.createShip(name, length);
      }
      player.board.placeShip(newShip, i, j);
    });
  }

  function switchTurn() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  function validateOpponentBoard(target) {
    let isValid = false;
    const opponent = getOpponent();
    const [i, j] = target;

    const cell = opponent.board.getCell(i, j);
    if (cell) {
      isValid = opponent.board.validateAttack(cell);
      if (isValid) return cell;
    }
    return isValid;
  }

  function getOpponent() {
    if (currentPlayer === playerOne) {
      return playerTwo;
    }
    return playerOne;
  }

  return {
    playerOne,
    playerTwo,
    setup,
    run,
    endTurn,
    playAgain,
    resetGame,
    validateOpponentBoard,
    sendAttack,
  };
}

export { game };
