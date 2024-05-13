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

  function start() {
    initalisePlayers();
    renderBoards();
    toggleInputs();
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

  function toggleInputs() {
    const inputs = document.querySelectorAll(".name-input");
    for(let i = 0; i < inputs.length; i++){}
    inputs.forEach((input) => {
    
    input.setAttribute('readOnly', true);
      //toggleReadOnly(input);
      console.log(input);
    });
  }

  function initalisePlayers() {
    const nameOne = document.getElementById("playerOneName");
    const nameTwo = document.getElementById("playerTwoName");
    playerOne.setName(nameOne.value);
    playerTwo.setName(nameTwo.value);
    toggleReadOnly(nameOne);
    toggleReadOnly(nameTwo);
  }

  function renderBoards() {
    const boardOne = document.querySelector("#playerOne .board");
    const boardTwo = document.querySelector("#playerTwo .board");
    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      overlay.classList.add("hidden");
    });
    console.log(playerOne.board);
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
