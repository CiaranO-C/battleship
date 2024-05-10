import Player from "./player.js";
import dom from './dom.js';

let game;
const playButton = document.getElementById("playButton");

playButton.addEventListener("click", () => {
    game = Game();
    game.start();
});

function Game() {
  const playerOne = Player();
  const playerTwo = Player();

  function start() {
    initalisePlayers();
    renderBoards();
  }

  function initalisePlayers() {
    const nameOne = document.getElementById("playerOneName");
    const nameTwo = document.getElementById("playerTwoName");
    playerOne.setName(nameOne.value);
    playerTwo.setName(nameTwo.value);
    toggleReadOnly(nameOne);
    toggleReadOnly(nameTwo);
  }

  function renderBoards(){
    dom.renderBoard(document.querySelector('#playerOne board'), playerOne.board);
    dom.renderBoard(document.querySelector('#playerTwo board'), playerTwo.board);
  }

  function toggleReadOnly(input) {
    input.readonly = !input.readonly;
  }

  return { playerOne, playerTwo, start };
}

