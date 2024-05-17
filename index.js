import Player from "./player.js";
import Dom from "./dom.js";

let game;
const playButton = document.getElementById("playButton");
const computerName = document.getElementById("computerName");
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

playButton.addEventListener(
  "click",
  () => {
    game.run();
  },
  { once: true },
);

function Game() {
  const playerOne = Player();
  const playerTwo = Player();
  const gui = Dom();
  let turn = playerOne;

  function setup() {
    initalisePlayers();
    disableInputs();
    renderBoards();
    gui.renderDockedShips();
    gui.shipButtons();
    gui.dragAndDrop();
  }

  function run() {
    confirmAllShips();
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

  function confirmAllShips() {
    const validShips = gui.confirmShips();
    console.log(validShips)
   // if (validShips) {
      validShips.forEach((ship) => {
        let newShip;
        const { i, j, length, axis } = ship;
        if (axis === "vertical") {
          newShip = playerOne.board.createShip(length, axis);
        } else {
          newShip = playerOne.board.createShip(length);
        }
        playerOne.board.placeShip(newShip, i, j);
        console.log('maybe placed')
      });
   // }
    playerOne.board.printBoard();
  }

  function switchBoard() {
    let playerBoard;
    let opponentBoard;
    if (turn === playerOne) {
      playerBoard = document.querySelector("#playerOne .board");
      opponentBoard = document.querySelector("#playerTwo .board");
    } else {
      playerBoard = document.querySelector("#playerTwo .board");
      opponentBoard = document.querySelector("#playerOne .board");
    }
    dimBoard(playerBoard);
    enableBoard(opponentBoard);
  }

  function enableBoard(board) {
    board.addEventListener("click", sendAttack);
  }

  function sendAttack(event) {
    const targetCell = event.target;
    const i = targetCell.getAttribute("data-i");
    const j = targetCell.getAttribute("data-j");

    const opponent = getOpponent();
    const validAttack = opponent.board.recieveAttack(i, j);
    if (validAttack) {
      markCell(targetCell, opponent.board.getCell(i, j));
      return true;
    } else {
      return false;
    }
  }

  function markCell(DOMcell, cell) {
    console.log(cell);
    if (cell === "O") {
      DOMcell.classList = "miss";
    } else {
      DOMcell.classList = "hit";
    }
  }

  function getOpponent() {
    if (turn === playerOne) {
      return playerTwo;
    }
    return playerOne;
  }

  function dimBoard(board) {
    const overlay = board.firstElementChild;
    overlay.classList.toggle("hidden", false);
  }

  function disableInputs() {
    const inputs = document.querySelectorAll(".name-input");
    for (let i = 0; i < inputs.length; i++) {}
    inputs.forEach((input) => {
      input.setAttribute("readOnly", true);
    });
  }

  function initalisePlayers() {
    const nameOne = document.getElementById("playerOneName");
    const nameTwo = document.querySelector(".selected");
    playerOne.setName(nameOne.value);
    playerTwo.setName(nameTwo.value);
  }

  function renderBoards() {
    const boardOne = document.querySelector("#playerOne .board");
    const boardTwo = document.querySelector("#playerTwo .board");
    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      overlay.classList.toggle("hidden");
    });
    gui.renderBoard(boardOne, playerOne.board.getBoard());
    gui.renderBoard(boardTwo, playerTwo.board.getBoard());
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
