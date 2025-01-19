import { handlePlayAgain, resetGame } from "../../gameController.js";
import { getBoard, hideBoards, toggleBoardTools } from "../boards.js";
import { currentPlayer, getOpponent, resetActivePlayer } from "../players.js";
import { deleteShips } from "../ships/ships.js";
import { isOnePlayer, removeAllChildren, scrollToTop } from "../utils.js";
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
  const { id } = player;
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
  if (isOnePlayer()) {
    document.querySelector("#playerOne .overlay").classList.add("hidden");
  }
}

function endGame() {
  disableAttacks(getBoard(getOpponent()));
  hideBoards();
  promptPlayAgain();
}

function enableResetButton() {
  const reset = document.querySelector("#resetGame");
  reset.addEventListener(
    "click",
    () => {
      confirmEndGame();
      resetGame();
      setTimeout(() => {
        deleteShips();
        toggleBoardTools(true);
      }, 450);
    },
    { once: true },
  );
}

function clearScores() {
  const scores = document.querySelectorAll(".point-container");
  scores.forEach((container) => removeAllChildren(container));
}

function confirmEndGame() {
  scrollToTop();
  toggleInputs();
  resetActivePlayer();
  setTimeout(() => {
    clearOverlays();
    clearScores();
  }, 450);
}

function promptPlayAgain() {
  const container = document.querySelector("#playerTwo .overlay");
  const playAgainBtn = document.createElement("button");
  const endGameBtn = document.createElement("button");
  playAgainBtn.textContent = "Play Again";
  endGameBtn.textContent = "End Game";

  playAgainBtn.id = "playAgain";
  endGameBtn.id = "endGame";

  playAgainBtn.addEventListener("click", handlePlayAgain, { once: true });
  endGameBtn.addEventListener(
    "click",
    () => {
      confirmEndGame();
      resetGame();
    },
    { once: true },
  );

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
  enableResetButton,
};
