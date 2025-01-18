import { getCell, getIndexAttributes } from '../boards.js';
import { getParentPlayer, getPlayerShips } from "../players.js";
import { getRandomIndex } from "../utils.js";
import { setPosition, validSnap } from './dragAndDrop.js';
import { spin, toggleAxis } from "./shipPosition.js";

function toggleSelectedShip(ship) {
  const oldShip = getSelectedShip();
  if (oldShip) oldShip.classList.toggle("selected-ship", false);
  if (ship) ship.classList.toggle("selected-ship", true);
}

function getSelectedShip() {
  const selected = document.querySelector(".selected-ship");
  return selected;
}

function getAllShips() {
  const ships = document.querySelectorAll(".ship");
  return ships;
}

function clearPosition(ship = getSelectedShip()) {
  if (ship.parentElement.classList.contains("grid-cell")) {
    const parentPlayer = getParentPlayer(ship);
    const { name } = getShipInfo(ship);
    const cells = parentPlayer.querySelectorAll(
      `.grid-cell[data-id="${name}"]`,
    );

    cells.forEach((cell) => {
      cell.removeAttribute("data-id");
      cell.classList.remove("occupied");
    });
  }
}

function getShipInfo(ship) {
  const name = ship.getAttribute("data-name");
  const length = Number(ship.getAttribute("data-length"));
  const axis = ship.getAttribute("data-axis");

  return { name, length, axis };
}

function createShip(name, length) {
  const ship = document.createElement("div");
  name = name.toLowerCase();
  ship.classList.add("ship", `${name}`);
  ship.setAttribute("data-length", `${length}`);
  ship.setAttribute("data-axis", "horizontal");
  ship.setAttribute("data-name", `${name}`);
  return ship;
}

function allShipsPlaced(ships = getAllShips()) {
  for (let i = 0; i < ships.length; i++) {
    const ship = ships[i];
    const parent = ship.parentElement;
    const shipOnGrid = parent.classList.contains("grid-cell");
    if (!shipOnGrid) return false;
  }
  return true;
}

function hideShips() {
  const ships = document.querySelectorAll(".ship");
  ships.forEach((ship) => {
    ship.classList.add("hidden");
  });
}

function rotateShip(event) {
  const ship = getSelectedShip();
  if (!ship) return null;
  const parentPlayer = getParentPlayer(ship);
  const shipOnGrid = ship.parentElement.classList.contains("grid-cell");
  const commonParent =
    parentPlayer.contains(ship) && parentPlayer.contains(event.target);
  if (shipOnGrid && commonParent) {
    const parentCell = ship.parentElement;
    clearPosition(); // stop parent cell interfering with validation
    toggleAxis(ship); // toggle to check if rotation valid

    if (validSnap(parentCell)) {
      spin(); //if valid update ship dimensions
    } else {
      toggleAxis(ship); //return attribute to previous
      return false;
    }
    setPosition(); // set to previous or new position
  }
}

function randomize(event) {
  const button = event.target;
  const parentPlayer = getParentPlayer(button);
  const ships = getPlayerShips(parentPlayer);

  ships.forEach((ship) => {
    toggleSelectedShip(ship);
    clearPosition(); //clears previous grid cells if already placed
    let parentCell;
    let validPosition = false;
    while (!validPosition) {
      const [i, j] = getRandomIndex();
      parentCell = getCell(parentPlayer, i, j);
      validPosition = validSnap(parentCell);
      //if still invalid try rotating
      if (!validPosition) {
        toggleAxis(ship);
        spin();
        validPosition = validSnap(parentCell);
      }
    }
    parentCell.appendChild(ship);
    setPosition();
  });
  toggleSelectedShip();
}

function getShipPackages(shipsArray) {
  const shipPacks = [];
  shipsArray.forEach((ship) => {
    const parentCell = ship.parentElement;
    const [i, j] = getIndexAttributes(parentCell);
    const { name, length, axis } = getShipInfo(ship);
    const shipPackage = { i, j, name, length, axis };
    shipPacks.push(shipPackage);
  });
  return shipPacks;
}

export {
  getSelectedShip,
  toggleSelectedShip,
  getAllShips,
  clearPosition,
  getShipInfo,
  createShip,
  allShipsPlaced,
  hideShips,
  rotateShip,
  randomize,
  getShipPackages,
};
