import { game } from "./index.js";
import { shipsData } from "./shipsData.js";

export default function Dom() {
  const rotateButtons = document.querySelectorAll(".rotate-ship");
  const shuffleButtons = document.querySelectorAll(".randomize");
  const resetButtons = document.querySelectorAll(".return-ships");

  function setup() {
    toggleInputs();
    renderPlayerNames();
    renderBoards();
    renderDockedShips();
    enableButtons();
    dragAndDrop(); //needs revising
    placeShips();
  }

  function toggleInputs() {
    const inputOne = document.getElementById("playerOneName");
    const inputTwo = document.getElementById("playerTwoName");
    [inputOne, inputTwo].forEach((input) => {
      if (input.readOnly) {
        input.removeAttribute("readonly");
      } else {
        input.setAttribute("readonly", true);
      }
    });
  }

  function renderPlayerNames() {
    const nameOne = document.getElementById("playerOneName").value;
    const nameTwo = document.querySelector(".selected").value;
    const playerOneName = document.querySelector("#playerOne p");
    const playerTwoName = document.querySelector("#playerTwo p");

    playerOneName.textContent = nameOne;
    playerTwoName.textContent = nameTwo;
  }

  function renderBoards() {
    const existingCells = document.querySelectorAll(".grid-cell");
    if (existingCells.length) {
      resetBoards(existingCells);
    }
    const boardSize = 10;
    const boards = document.querySelectorAll(".board");
    boards.forEach((board) => renderPlayerBoard(board, boardSize));

    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      overlay.classList.toggle("hidden");
    });
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
    console.log(player);
    if (player.id === "playerTwo") {
      player.querySelector(".board-tools").classList.remove("hidden");
    }
    shipsData.forEach((ship) => {
      const [name, length] = ship;
      const lowerCaseName = name.toLowerCase();
      const shipDiv = createShip(name, length);

      const dock = player.querySelector(`.${lowerCaseName}-parent`);
      dock.appendChild(shipDiv);
    });
  }

  function enableButtons() {
    // restart.addEventListener('click', restartGame);
    rotateButtons.forEach((btn) => btn.addEventListener("click", rotateShip));
    shuffleButtons.forEach((btn) => btn.addEventListener("click", randomize));
    resetButtons.forEach((btn) => btn.addEventListener("click", dockShips));
  }

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

  function currentPlayer() {
    const currentPlayer = document.querySelector(".active");
    return currentPlayer;
  }

  function placeShips() {
    const twoPlayer = document.querySelector(".selected").id !== "computer";
    if (twoPlayer) {
      confirmShipsUI();
      enableConfirmButton();
    } else {
      playButtonUI();
      enablePlayButton();
    }
  }

  function enableConfirmButton() {
    const button = document.getElementById("confirmButton");
    button.addEventListener("click", () => {
      const player = currentPlayer();
      const ships = getPlayerShips(player);
      if (allShipsPlaced()) {
        console.log('ready to play!')
        hideOverlays();
        playButtonUI();
        enablePlayButton();
      } else if (allShipsPlaced(ships)) {
        console.log('Not ready yet!')
        switchCurrentPlayer();
        switchConfirmShipUI();
      }
    });
  }

  function hideOverlays() {
    const boards = document.querySelectorAll(".board");
    boards.forEach((board) => {
      const overlay = board.firstElementChild;
      overlay.classList.toggle("hidden", true);
    });
  }

  function playButtonUI() {
    const overlay = document.querySelector("#playerTwo .overlay");
    const container = document.createElement("div");
    container.classList.add("start-game-container");
    const message = document.createElement("h2");
    const playButton = document.createElement("button");

    message.textContent = "Place your ships!";
    playButton.textContent = "Play";
    playButton.id = "playButton";

    overlay.classList.toggle("hidden", false);

    container.append(message, playButton);
    overlay.appendChild(container);
  }

  function enablePlayButton() {
    const playButton = document.getElementById("playButton");
    playButton.addEventListener("click", () => {
      game.run();
    });
  }

  function confirmShipsUI() {
    const overlay = getCurrentOverlay();
    const container = document.createElement("div");
    container.classList.add("start-game-container");
    const message = document.createElement("h2");
    const confirmButton = document.createElement("button");

    message.textContent = "Confirm Ships?";
    confirmButton.textContent = "Done";
    confirmButton.id = "confirmButton";

    container.append(message, confirmButton);
    overlay.appendChild(container);
  }

  function switchCurrentPlayer() {
    const players = document.querySelectorAll(".player-container");
    players.forEach((player) => player.classList.toggle("active"));
  }

  function switchOverlay() {
    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      overlay.classList.toggle("hidden");
    });
  }

  function getCurrentOverlay() {
    const overlays = document.querySelectorAll(".overlay");
    let currentOverlay;
    overlays.forEach((elem) => {
      if (!elem.classList.contains("hidden")) currentOverlay = elem;
    });
    return currentOverlay;
  }

  function switchConfirmShipUI() {
    const previousOverlay = getCurrentOverlay();
    removeAllChildren(previousOverlay);
    switchOverlay();
    const newOverlay = getCurrentOverlay();
    confirmShipsUI(newOverlay);
    enableConfirmButton();
  }

  function disableSetup() {
    rotateButtons.forEach((btn) =>
      btn.removeEventListener("click", rotateShip),
    );
    shuffleButtons.forEach((btn) =>
      btn.removeEventListener("click", randomize),
    );
    resetButtons.forEach((btn) => btn.removeEventListener("click", dockShips));

    const selected = getSelectedShip();
    selected.classList.remove("selected-ship");
    //clone to remove dragNdrop event listeners
    const ships = getAllShips();
    ships.forEach((ship) => {
      ship.style.zIndex = "-1";
      ship.replaceWith(ship.cloneNode(true));
    });
  }

  function resetBoards(existing) {
    existing.forEach((cell) => cell.remove());
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

  function getAllShips() {
    const ships = document.querySelectorAll(".ship");
    return ships;
  }

  function getPlayerShips(player) {
    const ships = player.querySelectorAll(".ship");
    return ships;
  }

  function getRandomIndex() {
    //random between 0-9
    const i = Math.floor(Math.random() * 10);
    const j = Math.floor(Math.random() * 10);
    return [i, j];
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

  function removeAllChildren(element) {
    while (element.firstElementChild) {
      element.removeChild(element.firstElementChild);
    }
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

  function dockShips(event) {
    const button = event.target;
    const parentPlayer = getParentPlayer(button);
    const ships = getPlayerShips(parentPlayer);
    ships.forEach((ship) => {
      toggleSelectedShip(ship);
      clearPosition();
      ship.remove();
    });
    renderPlayerShips(parentPlayer);
    dragAndDrop(getPlayerShips(parentPlayer));
  }

  function spin() {
    const ship = getSelectedShip();
    const width = ship.offsetWidth;
    const height = ship.offsetHeight;
    ship.style.height = `${width}px`;
    ship.style.width = `${height}px`;
  }

  function rotateShip(event) {
    const ship = getSelectedShip();
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

  function toggleAxis(ship) {
    const axis = ship.getAttribute("data-axis");
    axis === "horizontal"
      ? ship.setAttribute("data-axis", "vertical")
      : ship.setAttribute("data-axis", "horizontal");
  }

  const restart = document.getElementById("restart");

  //function restartGame() {
  //overwrite game object with new game, remove listeners and old elements
  // }

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

  function getCell(parentPlayer, i, j) {
    console.log(parentPlayer);
    const cell = parentPlayer.querySelector(
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

  function getParentPlayer(element) {
    const playerOne = document.getElementById("playerOne");
    const playerTwo = document.getElementById("playerTwo");

    console.log(playerOne.contains(element));
    const parent = playerOne.contains(element) ? playerOne : playerTwo;
    return parent;
  }

  return {
    setup,
    addPoint,
    getIndexAttributes,
    renderBoards,
    renderDockedShips,
    dragAndDrop,
    enableButtons,
    confirmShips,
    disableSetup,
    getCell,
    renderPlayerNames,
  };
}
