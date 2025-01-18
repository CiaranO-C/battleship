import { getCell, getIndexAttributes } from "../boards.js";
import { getParentPlayer } from "../players.js";
import {
  clearPosition,
  getAllShips,
  getSelectedShip,
  getShipInfo,
  toggleSelectedShip,
} from "./ships.js";

function dragAndDrop(ships = getAllShips()) {
  let startX = 0;
  let startY = 0;
  let newX = 0;
  let newY = 0;

  ships.forEach((ship) => {
    const parentPlayer = getParentPlayer(ship);
    let shipTop = 0;
    let shipLeft = 0;
    let anchorX;
    let anchorY;
    let snapped;

    ship.addEventListener("mousedown", selectShip);

    function selectShip(event) {
      event.preventDefault();
      event.stopPropagation();
      toggleSelectedShip(ship);
      startX = event.clientX;
      startY = event.clientY;
      if (snapped) {
        setAnchor(event);
        clearPosition();
      }
      document.addEventListener("mousemove", moveShip);
      document.addEventListener("mouseup", dropShip);
    }

    function checkWithinBoard(shipX, shipY) {
      const boardXY = parentPlayer.getBoundingClientRect();
      const isWithin =
        shipX >= boardXY.left &&
        shipX <= boardXY.right &&
        shipY >= boardXY.top &&
        shipY <= boardXY.bottom;

      return isWithin;
    }

    function moveShip(event) {
      const shipRect = ship.getBoundingClientRect();
      if (snapped) {
        clearPosition();

        const withinTolerance = checkTolerance(event);
        if (!withinTolerance) setAnchor(event);
      } else {
        newX = event.clientX;
        newY = event.clientY;

        shipTop += newY - startY;
        shipLeft += newX - startX;
        ship.style.top = `${shipTop}px`;
        ship.style.left = `${shipLeft}px`;

        startX = event.clientX;
        startY = event.clientY;
        if (checkWithinBoard(shipRect.left, shipRect.top)) {
          checkForSnap();
          setAnchor(event);
        }
      }
    }

    function checkTolerance(event) {
      const tolernace = 30;
      const differenceX = anchorX - event.clientX;
      const differenceY = anchorY - event.clientY;

      const xOutOfBounds = Math.abs(differenceX) > tolernace;
      const yOutOfBounds = Math.abs(differenceY) > tolernace;

      if (xOutOfBounds || yOutOfBounds) {
        if (differenceX > tolernace) {
          snapLeft();
        } else if (differenceX < -tolernace) {
          snapRight();
        } else if (differenceY > tolernace) {
          snapUp();
        } else if (differenceY < -tolernace) {
          snapDown();
        }
        return false;
      }
      return true;
    }

    function checkForSnap() {
      const shipCoords = ship.getBoundingClientRect();
      const elements = document.elementsFromPoint(
        shipCoords.left,
        shipCoords.top,
      );
      //elements[1] will return element directly underneath ship
      const target = elements[1];
      if (
        target !== undefined &&
        target.classList.contains("grid-cell") &&
        parentPlayer.contains(target)
      ) {
        const isValid = validSnap(target);
        if (isValid) {
          const canSnap = checkProximity(ship, target);
          if (canSnap) {
            snapTo(target);
            return true;
          }
        }
      }
      return false;
    }

    function setAnchor() {
      //achor is reset to middle of ship with every snap
      const [shipMidX, shipMidY] = getMidShip();
      anchorX = shipMidX;
      anchorY = shipMidY;
    }

    function getMidShip() {
      const shipRect = ship.getBoundingClientRect();
      const midX = (shipRect.right - shipRect.left) / 2 + shipRect.left;
      const midY = (shipRect.bottom - shipRect.top) / 2 + shipRect.top;
      return [midX, midY];
    }

    function snapUp() {
      const [i, j] = getIndexAttributes(ship.parentElement);
      const newParent = parentPlayer.querySelector(
        `.grid-cell[data-i="${i - 1}"][data-j="${j}"]`,
      );
      snapTo(newParent);
    }

    function snapDown() {
      const [i, j] = getIndexAttributes(ship.parentElement);
      const newParent = parentPlayer.querySelector(
        `.grid-cell[data-i="${i + 1}"][data-j="${j}"]`,
      );
      snapTo(newParent);
    }

    function snapLeft() {
      const [i, j] = getIndexAttributes(ship.parentElement);
      const newParent = parentPlayer.querySelector(
        `.grid-cell[data-i="${i}"][data-j="${j - 1}"]`,
      );
      snapTo(newParent);
    }

    function snapRight() {
      const [i, j] = getIndexAttributes(ship.parentElement);
      const newParent = parentPlayer.querySelector(
        `.grid-cell[data-i="${i}"][data-j="${j + 1}"]`,
      );
      snapTo(newParent);
    }

    function snapTo(targetCell) {
      if (validSnap(targetCell)) {
        snapped = true;
        targetCell.appendChild(ship);
        returnShip();
      } else {
        unSnap();
      }
    }

    function unSnap() {
      const [shipMidX, shipMidY] = getMidShip();
      startX = shipMidX;
      startY = shipMidY;
      snapped = false;
    }

    function dropShip() {
      if (snapped) {
        setPosition();
      } else {
        returnShip();
      }
      document.removeEventListener("mousemove", moveShip);
      document.removeEventListener("mouseup", dropShip);
    }

    function checkProximity(ship, cell) {
      const shipCoords = ship.getBoundingClientRect();
      const cellCoords = cell.getBoundingClientRect();
      const differenceX = Math.floor(shipCoords.x - cellCoords.x);
      const differenceY = Math.floor(shipCoords.y - cellCoords.y);
      if (differenceX <= 12 && differenceY <= 12) return true;
      return false;
    }

    function returnShip() {
      shipTop = 0;
      shipLeft = 0;
      ship.style.top = `${shipTop}px`;
      ship.style.left = `${shipLeft}px`;
    }
  });
}

function validSnap(startCell) {
  //check first cell is valid before checking array of cells
  if (validCell(startCell)) {
    const cells = getCellsArray(startCell);
    if (validateCells(cells)) return true;
  } else return false;
}

function setPosition(ship = getSelectedShip()) {
  const cells = getCellsArray(ship.parentElement);
  if (validateCells(cells)) {
    const { name } = getShipInfo(ship);
    cells.forEach((cell) => {
      cell.setAttribute("data-id", `${name}`);
      cell.classList.add("occupied");
    });
  }
}

function validCell(cell) {
  if (!cell || cell.classList.contains("occupied")) {
    return false;
  }
  return true;
}

function getCellsArray(startCell, ship = getSelectedShip()) {
  const parentPlayer = getParentPlayer(ship);
  const { length, axis } = getShipInfo(ship);
  let [i, j] = getIndexAttributes(startCell);

  const cells = [];
  const isHorizontal = axis === "horizontal";

  let n = isHorizontal ? j : i;
  const shipEnd = n + length;
  let currentCell;

  for (n; n < shipEnd; n++) {
    if (isHorizontal) {
      currentCell = getCell(parentPlayer, i, n);
    } else {
      currentCell = getCell(parentPlayer, n, j);
    }
    cells.push(currentCell);
  }
  return cells;
}

function validateCells(cells) {
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const isValid = validCell(cell);
    if (isValid === false) {
      return false;
    }
  }
  return true;
}

export { dragAndDrop, validSnap, setPosition };
