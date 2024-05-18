import { Player, Computer } from "./player.js";
import Dom from "./dom.js";

let game;

const computerName = document.getElementById("computer");
const playerTwoName = document.getElementById("playerTwoName");
const playerTwoSelection = document.querySelector(".player-two-select");
const scrollDownBtn = document.getElementById("scrollDown");

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

scrollDownBtn.addEventListener("click", gameSetup, { once: true });

function gameSetup() {
  game = Game();
  game.setup();
  renderPlayerNames();
  scrollToGame();
  enablePlayButton();
}

function renderPlayerNames() {
  const nameOne = document.getElementById("playerOneName").value;
  const nameTwo = document.querySelector(".selected").value;
  const playerOneName = document.querySelector("#playerOne p");
  const playerTwoName = document.querySelector("#playerTwo p");

  playerOneName.textContent = nameOne;
  playerTwoName.textContent = nameTwo;
}

function scrollToGame() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.scrollIntoView({ behavior: "smooth", block: "center" });
}

function enablePlayButton() {
  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", () => {
    game.run();
  });
}

function Game() {
  const { playerOne, playerTwo } = initalisePlayers();
  const gui = Dom();
  let turn = playerOne;

  function setup() {
    initalisePlayers();
    disableInputs();
    renderBoards(); //bug here
    gui.renderDockedShips();
    gui.enableButtons();
    gui.dragAndDrop();
  }

  function run() {
    if (confirmAllShips()) {
      gui.disableSetup();
      switchBoards();
      playerOne.board.printBoard();
      playerTwo.board.printBoard();
      //switchBoard();
      //disablePlayerBoard
      //enableOpponent board
      //start round (check turn)
      //player one turn
      //enable click on opponent board
      //click should get i, j and send to opponents recieve attack
      //click should disable div from being clicked again
      //if miss add to opponent missed array, return
      //new .hit and .miss class css
      //
      //if hit, check opponent isSunk
    }
  }

  function confirmAllShips() {
    const validShips = gui.confirmShips();
    if (validShips) {
      validShips.forEach((ship) => {
        let newShip;
        const { i, j, length, axis } = ship;
        if (axis === "vertical") {
          newShip = playerOne.board.createShip(length, axis);
        } else {
          newShip = playerOne.board.createShip(length);
        }
        playerOne.board.placeShip(newShip, i, j);
      });
    } else {
      console.log("false");
      return false;
    }
    playerOne.board.printBoard();
    return true;
  }

  function switchTurn() {
    turn = turn === playerOne ? playerTwo : playerOne;
  }

  function switchBoards() {
    toggleOverlay();
    toggleAttacks();
  }

  function getBoards() {
    const boards = document.querySelectorAll(".board");
    return boards;
  }

  function toggleOverlay() {
    const boards = getBoards();
    boards.forEach((board) => {
      const overlay = board.firstElementChild;
      overlay.classList.toggle("hidden");
    });
  }

  function toggleAttacks() {
    const [boardOne, boardTwo] = getBoards();
    if (turn === playerOne) {
      enableAttacks(boardTwo);
      disableAttacks(boardOne);
    } else {
      enableAttacks(boardOne);
      disableAttacks(boardTwo);
    }
  }

  function enableAttacks(board) {
    board.addEventListener("click", sendAttack);
  }

  function disableAttacks(board) {
    board.removeEventListener("click", sendAttack);
  }

  function validAttack(target) {
    const classList = Array.from(target.classList);
    if (classList.includes("hit") || classList.includes("miss")) return false;
    return true;
  }

  function sendAttack(event) {
    const validTarget = validAttack(event.target);
    if (validTarget) {
      const cell = event.target;
      const i = cell.getAttribute("data-i");
      const j = cell.getAttribute("data-j");

      const opponent = getOpponent();
      const validAttack = opponent.board.recieveAttack(i, j);
      if (validAttack) {
        console.log(validAttack);
        markCell(cell, opponent.board.getCell(i, j));
        opponent.board.printBoard();
        return true;
      } else {
        return false;
      }
    }
  }

  function markCell(uiCell, arrayCell) {
    if (arrayCell === "O") {
      uiCell.classList.add("miss");
    } else {
      uiCell.classList.add("hit");
    }
  }

  function getOpponent() {
    if (turn === playerOne) {
      return playerTwo;
    }
    return playerOne;
  }

  function disableInputs() {
    const inputs = document.querySelectorAll(".name-input");
    for (let i = 0; i < inputs.length; i++) {}
    inputs.forEach((input) => {
      input.setAttribute("readOnly", true);
    });
  }

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

  function renderBoards() {
    const boardOne = document.querySelector("#playerOne .board");
    const boardTwo = document.querySelector("#playerTwo .board");
    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      overlay.classList.toggle("hidden");
    });
    gui.renderPlayerBoard(boardOne, playerOne.board.getBoard());
    gui.renderComputerBoard();
  }

  function toggleReadOnly(input) {
    if (input.readOnly) {
      input.readOnly = false;
    } else {
      input.readOnly = true;
    }
  }

  return { playerOne, playerTwo, run, setup };
}

export { game };
