import { game } from '../../index.js';
import { getBoard, getIndexAttributes, hideOverlays, markCell } from "../boards.js";
import { currentPlayer, getOpponent, switchCurrentPlayer } from "../players.js";
import { allShipsPlaced, hideShips } from "../ships/ships.js";
import { disableSetup } from './setup.js';
import { clearOverlays, passDevice } from "./utils.js";

function runGame() {
  const onePlayer = document.querySelector(".selected").id === "computer";
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
  playButton.addEventListener("click", () => {
    if (allShipsPlaced()) {
      clearOverlays();
      game.run();
    }
  });
}

function validClick(target) {
  if (target.classList.contains("grid-cell")) {
    const classes = Array.from(target.classList);
    if (classes.includes("hit") || classes.includes("miss")) return false;
    return true;
  }
  return false;
}

function handleAttack(event) {
  const target = event.target;
  if (validClick(target)) {
    const coords = getIndexAttributes(target);
    const cellAttacked = game.sendAttack(coords);
    if (cellAttacked) {
      markCell(target, cellAttacked);
      game.endTurn();
    }
  }
}

function switchTurn() {
  const twoPlayer = document.querySelector(".selected").id !== "computer";
  switchCurrentPlayer();
  if (twoPlayer) passDevice();
}

function disableAttacks(board) {
  board.removeEventListener("click", handleAttack);
}

function enableAttacks(board) {
  board.addEventListener("click", handleAttack);
}

function toggleBoardListeners() {
  disableAttacks(getBoard(currentPlayer()));
  enableAttacks(getBoard(getOpponent()));
}

export {
  runGame,
  enablePlayButton,
  handleAttack,
  switchTurn,
  enableAttacks,
  disableAttacks,
  toggleBoardListeners,
};
