import { game } from "../../index.js";
import { getBoard, hideBoards } from "../boards.js";
import { currentPlayer, getOpponent, resetActivePlayer } from "../players.js";
import { removeAllChildren, scrollToTop } from "../utils.js";
import { disableAttacks } from "./play.js";
import {
  placeShips,
  renderBoards,
  renderDockedShips,
  toggleInputs,
} from "./setup.js";
import { clearOverlays } from "./utils.js";

function declareWinner(winnerName) {
  clearOverlays();
  const overlays = document.querySelectorAll(".overlay");
  overlays.forEach((overlay) => {
    const winner = document.createElement("h2");
    winner.textContent = `${winnerName} wins!`;
    overlay.appendChild(winner);
  });
}

function addPoint(player) {
  const id = player.id;
  const container = document.getElementById(`${id}Points`);
  const point = document.createElement("div");
  point.classList.add("point");
  container.appendChild(point);
}

function gameResult(winnerName) {
  addPoint(currentPlayer());
  declareWinner(winnerName);
}

function playAgain() {
  clearOverlays();
  renderBoards();
  renderDockedShips();
  placeShips();
}

function endGame() {
  disableAttacks(getBoard(getOpponent()));
  hideBoards();
  promptPlayAgain();
}

function clearScores() {
  const scores = document.querySelectorAll(".point-container");
  scores.forEach((container) => removeAllChildren(container));
}

function confirmEndGame() {
  scrollToTop();
  toggleInputs();
  clearOverlays();
  clearScores();
  resetActivePlayer();
}

function promptPlayAgain() {
  const container = document.querySelector("#playerTwo .overlay");
  const playAgainBtn = document.createElement("button");
  const endGameBtn = document.createElement("button");
  playAgainBtn.textContent = "Play Again";
  endGameBtn.textContent = "End Game";

  playAgainBtn.id = "playAgain";
  endGameBtn.id = "endGame";

  playAgainBtn.onclick = () => {
    playAgain();
    game.playAgain();
  };
  endGameBtn.onclick = () => {
    confirmEndGame();
    game.resetGame();
  };

  setTimeout(() => {
    removeAllChildren(container);
    container.append(playAgainBtn, endGameBtn);
  }, 2500);
}

export {
  declareWinner,
  gameResult,
  playAgain,
  endGame,
  clearScores,
  confirmEndGame,
};
