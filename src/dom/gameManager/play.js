import { handleRunGame, handleTurn } from "../../gameController.js";
import { getBoard, hideOverlays } from "../boards.js";
import { currentPlayer, getOpponent, switchCurrentPlayer } from "../players.js";
import { hideShips } from "../ships/ships.js";
import { isOnePlayer } from "../utils.js";
import { disableSetup } from "./setup.js";
import { clearOverlays, passDevice } from "./utils.js";

function runGame() {
  const onePlayer = isOnePlayer();
  toggleBoardListeners();
  clearOverlays();
  if (onePlayer) {
    hideOverlays();
  } else {
    hideShips();
    const opponentOverlay = getOpponent().querySelector(".overlay");
    opponentOverlay.classList.add("hidden");
  }
  disableSetup();
}

function enablePlayButton() {
  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", handleRunGame);
}

function validClick(target) {
  if (target.classList.contains("grid-cell")) {
    const classes = Array.from(target.classList);
    if (classes.includes("hit") || classes.includes("miss")) return false;
    return true;
  }
  return false;
}

function switchTurn() {
  const twoPlayer = document.querySelector(".selected").id !== "computer";
  switchCurrentPlayer();
  toggleBoardListeners();
  if (twoPlayer) passDevice();
}

function disableAttacks(board) {
  board.removeEventListener("click", handleTurn);
}

function enableAttacks(board) {
  board.addEventListener("click", handleTurn);
}

function toggleBoardListeners() {
  disableAttacks(getBoard(currentPlayer()));
  enableAttacks(getBoard(getOpponent()));
}

export {
  runGame,
  enablePlayButton,
  switchTurn,
  enableAttacks,
  disableAttacks,
  toggleBoardListeners,
  validClick,
};
