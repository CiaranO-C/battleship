import Player from "./player.js";
import Dom from "./dom.js";

let game;
const playButton = document.getElementById("playButton");

playButton.addEventListener("click", () => {
  game = Game();
  game.start();
});

function Game() {
  const playerOne = Player();
  const playerTwo = Player();
  const gui = Dom();
  let turn = playerOne;

  function start() {
    initalisePlayers();
    disableInputs();
    playerOne.board.randomize();
    playerTwo.board.randomize();
    renderBoards();
    switchBoard();
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
    //make player two board clickable
    //dimPlayerBoard
    //make own board disabled
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
    console.log(cell)
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
    overlay.classList.toggle("hidden");
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
    const nameTwo = document.getElementById("playerTwoName");
    playerOne.setName(nameOne.value);
    playerTwo.setName(nameTwo.value);
  }

  function renderBoards() {
    const boardOne = document.querySelector("#playerOne .board");
    const boardTwo = document.querySelector("#playerTwo .board");
    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      overlay.classList.add("hidden");
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

  return { playerOne, playerTwo, start };
}

export { game };
