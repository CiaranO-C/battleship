import { shipsData } from "../../shipsData.js";
import {
  getCurrentOverlay,
  hideBoards,
  switchOverlay,
  toggleBoardTools,
} from "../boards.js";
import {
  currentPlayer,
  getOpponent,
  getPlayerShips,
  renderPlayerNames,
  switchCurrentPlayer,
} from "../players.js";
import { dragAndDrop } from "../ships/dragAndDrop.js";
import { dockShips } from "../ships/shipPosition.js";
import {
  allShipsPlaced,
  createShip,
  getAllShips,
  getShipPackages,
  randomize,
  rotateShip,
  toggleSelectedShip,
} from "../ships/ships.js";
import { isOnePlayer, queryDom } from "../utils.js";
import { enableResetButton } from "./end.js";
import { enablePlayButton } from "./play.js";
import { clearOverlays } from "./utils.js";

function toggleInputs() {
  const inputOne = document.getElementById("playerOneName");
  const inputTwo = document.getElementById("playerTwoName");
  console.log(inputOne.getAttribute("readonly"));

  [inputOne, inputTwo].forEach((input) => {
    if (input.getAttribute("readonly")) {
      input.removeAttribute("readonly");
    } else {
      input.setAttribute("readonly", true);
    }
  });
}

function renderPlayerBoard(container, size) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("div");
      cell.setAttribute("data-i", i);
      cell.setAttribute("data-j", j);
      cell.classList = "grid-cell";
      container.appendChild(cell);
    }
  }
}

function renderBoards() {
  const existingCells = document.querySelectorAll(".grid-cell");
  if (existingCells.length) {
    existingCells.forEach((cell) => cell.remove());
  }
  const boardSize = 10;
  const boards = document.querySelectorAll(".board");
  boards.forEach((board) => renderPlayerBoard(board, boardSize));

  getOpponent().querySelector(".overlay").classList.remove("hidden");
  currentPlayer().querySelector(".overlay").classList.add("hidden");
}

function renderDockedShips() {
  const playerOne = document.getElementById("playerOne");
  const playerTwo = document.getElementById("playerTwo");
  const onePlayer = document.querySelector(".selected").id === "computer";
  const players = [];
  if (onePlayer) {
    players.push(playerOne);
  } else {
    players.push(playerOne, playerTwo);
  }
  players.forEach((player) => renderPlayerShips(player));
}

function renderPlayerShips(player) {
  if (player.id === "playerTwo") {
    toggleBoardTools(false);
  }
  shipsData.forEach((ship) => {
    const [name, length] = ship;
    const lowerCaseName = name.toLowerCase();
    const shipDiv = createShip(name, length);

    const dock = player.querySelector(`.${lowerCaseName}-parent`);
    dock.appendChild(shipDiv);
  });
}

function playButtonUI() {
  const overlay = document.querySelector("#playerTwo .overlay");
  const container = document.createElement("div");
  container.classList.add("start-game-container");
  const message = document.createElement("h2");
  const playButton = document.createElement("button");

  message.textContent = "Ready?";
  playButton.textContent = "Play";
  playButton.id = "playButton";

  overlay.classList.toggle("hidden", false);

  container.append(message, playButton);
  overlay.appendChild(container);
}

function disableSetup() {
  const rotateButtons = document.querySelectorAll(".rotate-ship");
  const shuffleButtons = document.querySelectorAll(".randomize");
  const resetButtons = document.querySelectorAll(".return-ships");
  rotateButtons.forEach((btn) => btn.removeEventListener("click", rotateShip));
  shuffleButtons.forEach((btn) => btn.removeEventListener("click", randomize));
  resetButtons.forEach((btn) => btn.removeEventListener("click", dockShips));

  toggleSelectedShip();

  //clone to remove dragNdrop event listeners
  const ships = getAllShips();
  ships.forEach((ship) => {
    ship.style.zIndex = "-1";
    ship.replaceWith(ship.cloneNode(true));
  });
}

function confirmShips() {
  if (allShipsPlaced()) {
    const twoPlayer = document.querySelector(".selected").id !== "computer";
    let shipPacks;

    const pOneShips = getPlayerShips(queryDom("#playerOne"));
    shipPacks = getShipPackages(pOneShips);

    if (twoPlayer) {
      const pTwoShips = getPlayerShips(queryDom("#playerTwo"));
      shipPacks = { packOne: shipPacks, packTwo: getShipPackages(pTwoShips) };
    }

    return shipPacks;
  }
  return false;
}

function placeShips() {
  //enables ship placement for first player
  const twoPlayer = !isOnePlayer();
  let player;
  if (twoPlayer) {
    player = currentPlayer();
    confirmShipsUI();
    enableConfirmButton();
  } else {
    player = document.querySelector("#playerOne");
    playButtonUI();
    enablePlayButton();
  }
  const ships = getPlayerShips(player);
  shipButtons(player).enable();
  dragAndDrop(ships);
}

function confirmShipsUI() {
  //populates opposite board with prompt to confirm ship placements
  const overlay = getOpponent().querySelector(".overlay");

  const container = document.createElement("div");
  container.classList.add("start-game-container");
  const message = document.createElement("h2");
  const confirmButton = document.createElement("button");

  message.textContent = "Confirm Ships?";
  confirmButton.textContent = "Done";
  confirmButton.id = "confirmButton";

  overlay.classList.toggle("hidden", false);
  container.append(message, confirmButton);
  overlay.appendChild(container);
}

function enableConfirmButton() {
  //enables confirm ship placement button
  const button = document.getElementById("confirmButton");
  button.addEventListener("click", () => {
    const player = currentPlayer();
    const ships = getPlayerShips(player);
    if (allShipsPlaced()) {
      clearOverlays();
      hideBoards();
      switchCurrentPlayer();
      playButtonUI();
      enablePlayButton();
    } else if (allShipsPlaced(ships)) {
      shipButtons(currentPlayer()).disable();
      switchConfirmShipUI();
      shipButtons(currentPlayer()).enable();
      const currentPlayerShips = getPlayerShips(currentPlayer());
      dragAndDrop(currentPlayerShips);
    }
  });
}

function switchConfirmShipUI() {
  clearOverlays();
  switchOverlay();
  const newOverlay = getCurrentOverlay();
  confirmShipsUI(newOverlay);
  enableConfirmButton();
}

function shipButtons(player) {
  const rotateBtn = player.querySelector(".rotate-ship");
  const shuffleBtn = player.querySelector(".randomize");
  const resetBtn = player.querySelector(".return-ships");

  function enable() {
    rotateBtn.addEventListener("click", rotateShip);
    shuffleBtn.addEventListener("click", randomize);
    resetBtn.addEventListener("click", dockShips);
  }

  function disable() {
    rotateBtn.removeEventListener("click", rotateShip);
    shuffleBtn.removeEventListener("click", randomize);
    resetBtn.removeEventListener("click", dockShips);
  }
  return { enable, disable };
}

function setupGame() {
  toggleInputs(); //sets landing inputs to readonly
  renderPlayerNames(); //takes input values and renders as board headers
  renderBoards();
  renderDockedShips();
  placeShips(); //enables ship placing for first player
  enableResetButton();
}

export {
  toggleInputs,
  renderBoards,
  renderDockedShips,
  renderPlayerShips,
  playButtonUI,
  disableSetup,
  placeShips,
  confirmShipsUI,
  enableConfirmButton,
  switchConfirmShipUI,
  setupGame,
  confirmShips,
};
