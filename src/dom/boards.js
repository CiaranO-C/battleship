import { switchCurrentPlayer } from "./players.js";

function getCurrentOverlay() {
  const overlays = document.querySelectorAll(".overlay");
  let currentOverlay;
  overlays.forEach((elem) => {
    if (!elem.classList.contains("hidden")) currentOverlay = elem;
  });
  return currentOverlay;
}

function switchOverlay() {
  const overlays = document.querySelectorAll(".overlay");
  overlays.forEach((overlay) => {
    overlay.classList.toggle("hidden");
  });
  switchCurrentPlayer();
}

function hideOverlays() {
  const boards = document.querySelectorAll(".board");
  boards.forEach((board) => {
    const overlay = board.firstElementChild;
    overlay.classList.toggle("hidden", true);
  });
}

function getIndexAttributes(element) {
  const iString = element.getAttribute("data-i");
  const jString = element.getAttribute("data-j");

  if (!iString || !jString) return null;

  const i = Number(iString);
  const j = Number(jString);

  return [i, j];
}

function getCell(parentPlayer, i, j) {
  const cell = parentPlayer.querySelector(
    `.grid-cell[data-i="${i}"][data-j="${j}"]`,
  );
  return cell;
}

function markCell(uiCell, cell) {
  if (cell.hasShip()) {
    uiCell.classList.add("hit");
  } else {
    uiCell.classList.add("miss");
  }
}

function getBoard(player) {
  const boards = player.querySelector(".board");
  return boards;
}

function hideBoards() {
  const overlays = document.querySelectorAll(".overlay");
  overlays.forEach((overlay) => {
    overlay.classList.remove("hidden");
  });
}

export {
  getCurrentOverlay,
  switchOverlay,
  hideOverlays,
  getIndexAttributes,
  getCell,
  markCell,
  getBoard,
  hideBoards,
};
