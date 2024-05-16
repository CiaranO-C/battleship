import { game } from "./index.js";
import shipsData from "./shipsData.js";

export default function Dom() {
  function renderBoard(container, board) {
    const length = board.length;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        const cell = document.createElement("div");
        cell.setAttribute("data-i", i);
        cell.setAttribute("data-j", j);
        const cellHasShip = board[i][j] !== "";
        cell.classList = cellHasShip ? "grid-cell ship" : "grid-cell";
        container.appendChild(cell);
      }
    }
  }

  function getPlayerScore(player) {
    const score = player.getScore();
    return score;
  }

  function updateScores() {
    const playerOne = document.getElementById("playerOnePoints");
    const playerTwo = document.getElementById("playerTwoPoints");

    ///const playerOneScore = get
    //const playerTwoScore =
  }

  function shipButtons() {
    const rotate = document.getElementById("rotateShip");
    rotate.addEventListener("click", rotateShip);
  }

  function rotateShip() {
    const ship = document.querySelector(".selected-ship");

    const width = ship.offsetWidth;
    const height = ship.offsetHeight;

    /*
    when you try and rotate a ship, it is already placed on the actual grid
    so i need to be able to access that same original ship rather than making a new one
    the key thing about this is that i will be able to go to the hashmap and give it the data-id
    for the correct ship, but i can also store the coordinates where the ship is currently placed
    that way it makes it very easy to 'move' the ship by first checking if the rotated position is valid
    (maybe i make a check position function that doesnt need a ship passed in just length, direction, i, j)
    or i keep the same and just pass in a testShip that will get dumped after....
    if rotated position is valid then iterate through old coords and make all === '', then finally
    when placing in new rotated position, store new vertical coordinates!
    */

    if (width >= height) {
      ship.setAttribute("data-position", "vertical");
    } else {
      ship.setAttribute("data-position", "horizontal");
    }

    ship.style.height = `${width}px`;
    ship.style.width = `${height}px`;
  }

  function toggleSelectedShip(ship) {
    const oldShip = document.querySelector(".selected-ship");
    if (oldShip) oldShip.classList.toggle("selected-ship", false);
    ship.classList.toggle("selected-ship", true);
  }

  function createShip(name, length) {
    const ship = document.createElement("div");
    ship.classList.add("ship", `${name}`);
    ship.setAttribute("data-length", `${length}`);
    ship.setAttribute("data-axis", "horizontal");
    ship.setAttribute("data-name", `${name}`);
    return ship;
  }

  function renderDockedShips() {
    shipsData.forEach((ship) => {
      const [name, length] = ship;
      const shipDiv = createShip(name, length);
      const dock = document.getElementById(`${name}Parent`);
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
        const tolernace = 20;
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
        console.log(target);
        if (target.classList.contains("grid-cell")) {
          const isValid = validSnap(target);
          if (isValid) {
            console.log("checking");
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

      function validSnap(startCell) {
        //check first cell is valid before checking array of cells
        if (validCell(startCell)) {
          const cells = getCellsArray(startCell);
          if (validateCells(cells)) return true;
        } else return false;
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

      function getCellsArray(startCell) {
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
            currentCell = getCell(n, i);
          }
          cells.push(currentCell);
        }
        //console.log(cells)
        return cells;
      }

      function validCell(cell) {
        if (!cell || cell.classList.contains("occupied")) {
          return false;
        }
        return true;
      }

      function setPosition() {
        const cells = getCellsArray(ship.parentElement);
        if (validateCells(cells)) {
          const { name } = getShipInfo(ship);
          cells.forEach((cell) => {
            cell.setAttribute("data-id", `${name}`);
            cell.classList.add("occupied");
          });
        }
      }

      function clearPosition() {
        const cells = getCellsArray(ship.parentElement);
        if (validateCells(cells)) {
          console.log(cells);
          cells.forEach((cell) => {
            cell.removeAttribute("data-id");
            cell.classList.remove("occupied");
          });
        }
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

      function getIndexAttributes(element) {
        const iString = element.getAttribute("data-i");
        const jString = element.getAttribute("data-j");

        if (!iString || !jString) return null;

        const i = Number(iString);
        const j = Number(jString);

        return [i, j];
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

  return { renderBoard, renderDockedShips, dragAndDrop, shipButtons };
}
