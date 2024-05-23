import { game } from "./index.js";
import { shipsData } from "./shipsData.js";

export default function Dom() {
  function renderPlayerBoard(container, board) {
    const length = board.length;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        const cell = document.createElement("div");
        cell.setAttribute("data-i", i);
        cell.setAttribute("data-j", j);
        const cellHasShip = board[i][j].hasShip();
        cell.classList = cellHasShip ? "grid-cell ship" : "grid-cell";
        container.appendChild(cell);
      }
    }
  }

  function renderComputerBoard() {
    const container = document.querySelector("#playerTwo .board");
    const length = 10;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        const cell = document.createElement("div");
        cell.setAttribute("data-i", i);
        cell.setAttribute("data-j", j);
        cell.classList.add("grid-cell");
        container.appendChild(cell);
      }
    }
  }

  function getAllShips() {
    const ships = document.querySelectorAll(".ship");
    return ships;
  }

  function getRandomIndex() {
    //random between 0-9
    const i = Math.floor(Math.random() * 10);
    const j = Math.floor(Math.random() * 10);
    return [i, j];
  }

  function randomize() {
    const allShips = getAllShips();
    allShips.forEach((ship) => {
      toggleSelectedShip(ship);
      if (ship.parentElement.classList.contains("grid-cell")) {
       
        clearPosition();
      }
      let shipPlaced = false;
      while (!shipPlaced) {
        const [i, j] = getRandomIndex();
        const parentCell = getCell(i, j);
        if (validSnap(parentCell)) {
          parentCell.appendChild(ship);
          setPosition();
          shipPlaced = true;
        } else {
          toggleAxis(ship);
          spin();
          if (validSnap(parentCell)) {
            parentCell.appendChild(ship);
            setPosition();
            shipPlaced = true;
          }
        }
      }
    });
  }

  function allShipsPlaced() {
    const ships = getAllShips();
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const parent = ship.parentElement;
      const shipOnGrid = parent.classList.contains("grid-cell");
      if (!shipOnGrid) return false;
    }
    return true;
  }

  function confirmShips() {
    if (allShipsPlaced()) {
      const shipArray = [];
      const ships = getAllShips();
      ships.forEach((ship) => {
        const parentCell = ship.parentElement;
        const [i, j] = getIndexAttributes(parentCell);
        const { name, length, axis } = getShipInfo(ship);
        const shipPackage = { i, j, name, length, axis };
        shipArray.push(shipPackage);
      });
      return shipArray;
    }
    return null;
  }

  function addPoint(player) {
    const container = document.getElementById(`${player}Points`);
    const point = document.createElement("div");
    point.classList.add("point");
    container.appendChild(point);
  }

  function dockShips() {
    const ships = getAllShips();
    ships.forEach((ship) => {
      toggleSelectedShip(ship);
      clearPosition();
      ship.remove();
    });
    renderDockedShips();
    dragAndDrop();
  }

  function spin() {
    const ship = getSelectedShip();
    const width = ship.offsetWidth;
    const height = ship.offsetHeight;
    ship.style.height = `${width}px`;
    ship.style.width = `${height}px`;
  }

  function rotateShip() {
    const ship = getSelectedShip();
    if (ship) {
      const shipOnGrid = ship.parentElement.classList.contains("grid-cell");

      if (shipOnGrid) {
        const parentCell = ship.parentElement;
        
        clearPosition(); // clear current position to stop parent cell interfering with validation
       
        toggleAxis(ship);
        if (validSnap(parentCell)) {
         
          const width = ship.offsetWidth;
          const height = ship.offsetHeight;
          ship.style.height = `${width}px`;
          ship.style.width = `${height}px`;
        } else {
          toggleAxis(ship);
          return false;
        }
        setPosition();
      }
    }
  }

  function toggleAxis(ship) {
    const axis = ship.getAttribute("data-axis");
    axis === "horizontal"
      ? ship.setAttribute("data-axis", "vertical")
      : ship.setAttribute("data-axis", "horizontal");
  }

  const restart = document.getElementById("restart");
  const rotate = document.getElementById("rotateShip");
  const random = document.getElementById("randomize");
  const reset = document.getElementById("returnShips");
  const playButtonContainer = document.querySelector(".start-game-container");

  //function restartGame() {
  //overwrite game object with new game, remove listeners and old elements
  // }

  function enableButtons() {
    // restart.addEventListener('click', restartGame);
    rotate.addEventListener("click", rotateShip);
    random.addEventListener("click", randomize);
    reset.addEventListener("click", dockShips);
  }

  function disableSetup() {
    rotate.removeEventListener("click", rotateShip);
    random.removeEventListener("click", randomize);
    reset.removeEventListener("click", dockShips);
    playButtonContainer.classList.add("hidden");
    const selected = getSelectedShip();
    selected.classList.remove("selected-ship");
    //clone to remove dragNdrop event listeners
    const ships = getAllShips();
    ships.forEach((ship) => {
      ship.style.zIndex = "-1";
      ship.replaceWith(ship.cloneNode(true));
    });
  }

  function toggleSelectedShip(ship) {
    const oldShip = getSelectedShip();
    if (oldShip) oldShip.classList.toggle("selected-ship", false);
    ship.classList.toggle("selected-ship", true);
  }

  function getSelectedShip() {
    const selected = document.querySelector(".selected-ship");
    return selected;
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

  function renderDockedShips() {
    shipsData.forEach((ship) => {
      const [name, length] = ship;
      const lowerCaseName = name.toLowerCase();
      const shipDiv = createShip(name, length);
      const dock = document.getElementById(`${lowerCaseName}Parent`);
      dock.appendChild(shipDiv);
    });
  }

  function getCell(i, j) {
    const cell = document.querySelector(
      `.grid-cell[data-i="${i}"][data-j="${j}"]`,
    );
    return cell;
  }

  function getShipInfo(ship) {
    const name = ship.getAttribute("data-name");
    const length = Number(ship.getAttribute("data-length"));
    const axis = ship.getAttribute("data-axis");

    return { name, length, axis };
  }

  function validSnap(startCell) {
    //check first cell is valid before checking array of cells
    if (validCell(startCell)) {
      const cells = getCellsArray(startCell);
      if (validateCells(cells)) return true;
    } else return false;
  }

  function validCell(cell) {
    if (!cell || cell.classList.contains("occupied")) {
      return false;
    }
    return true;
  }

  function getCellsArray(startCell, ship = getSelectedShip()) {
    const { length, axis } = getShipInfo(ship);
    let [i, j] = getIndexAttributes(startCell);

    const cells = [];
    const isHorizontal = axis === "horizontal";

    let n = isHorizontal ? j : i;
    const shipEnd = n + length;
    let currentCell;

    for (n; n < shipEnd; n++) {
      if (isHorizontal) {
        currentCell = getCell(i, n);
      } else {
        currentCell = getCell(n, j);
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

  function getIndexAttributes(element) {
    const iString = element.getAttribute("data-i");
    const jString = element.getAttribute("data-j");

    if (!iString || !jString) return null;

    const i = Number(iString);
    const j = Number(jString);

    return [i, j];
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

  function clearPosition(ship = getSelectedShip()) {
    const { name } = getShipInfo(ship);
    const cells = document.querySelectorAll(`.grid-cell[data-id="${name}"]`);

    cells.forEach((cell) => {
      cell.removeAttribute("data-id");
      cell.classList.remove("occupied");
    });
  }

  function dragAndDrop() {
    const ships = document.querySelectorAll(".ship");
    const board = document.querySelector("#playerOne .board");
    let startX = 0;
    let startY = 0;
    let newX = 0;
    let newY = 0;

    ships.forEach((ship) => {
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
        const boardXY = board.getBoundingClientRect();
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
        if (target !== undefined && target.classList.contains("grid-cell")) {
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
        const newParent = document.querySelector(
          `.grid-cell[data-i="${i - 1}"][data-j="${j}"]`,
        );
        snapTo(newParent);
      }

      function snapDown() {
        const [i, j] = getIndexAttributes(ship.parentElement);
        const newParent = document.querySelector(
          `.grid-cell[data-i="${i + 1}"][data-j="${j}"]`,
        );
        snapTo(newParent);
      }

      function snapLeft() {
        const [i, j] = getIndexAttributes(ship.parentElement);
        const newParent = document.querySelector(
          `.grid-cell[data-i="${i}"][data-j="${j - 1}"]`,
        );
        snapTo(newParent);
      }

      function snapRight() {
        const [i, j] = getIndexAttributes(ship.parentElement);
        const newParent = document.querySelector(
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

      function getShip() {
        const length = Number(ship.getAttribute("data-length"));
        const testShip = game.playerOne.board.createShip(length);
        return testShip;
      }

      function validPosition(ship, i, j) {
        const isValid = game.playerOne.board.validatePosition(ship, i, j);

        return isValid;
      }
    });
  }

  return {
    addPoint,
    getIndexAttributes,
    renderPlayerBoard,
    renderComputerBoard,
    renderDockedShips,
    dragAndDrop,
    enableButtons,
    confirmShips,
    disableSetup,
    getCell,
  };
}
