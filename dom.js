import { game } from "./index.js";

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

  function dragAndDrop() {
    const ships = document.querySelectorAll(".ship");
    let startX = 0;
    let startY = 0;
    let newX = 0;
    let newY = 0;
    let element;

    ships.forEach((ship) => {
      ship.addEventListener("mousedown", selectShip);

      let shipTop = 0;
      let shipLeft = 0;

      function selectShip(event) {
        toggleSelectedShip(ship);
        event.preventDefault();
        event.stopPropagation();
        ship.style.pointerEvents = "none";
        startX = event.clientX;
        startY = event.clientY;

        document.addEventListener("mousemove", moveShip);
        document.addEventListener("mouseup", dropShip);
      }

      function moveShip(event) {
        ship.removeEventListener("click", rotateShip);
        newX = event.clientX;
        newY = event.clientY;

        shipTop += newY - startY;
        shipLeft += newX - startX;
        ship.style.top = `${shipTop}px`;
        ship.style.left = `${shipLeft}px`;

        startX = event.clientX;
        startY = event.clientY;

        let shipCoords = ship.getBoundingClientRect();
        let newElement = document.elementFromPoint(
          shipCoords.left,
          shipCoords.top,
        );
        if (element !== newElement) console.log(newElement);
        element = newElement;
      }

      function dropShip(event) {
        //make cells able to hold stuff? make them relative for absolute ship?
        ship.style.pointerEvents = "auto";
        console.log(event.target);
        /* if (dropValid) {
        } else {
          shipTop = 0;
          shipLeft = 0;
          ship.style.top = `${shipTop}px`;
          ship.style.left = `${shipLeft}px`;
        }*/

        //console.log(droppedOn);
        document.removeEventListener("mousemove", moveShip);
        document.removeEventListener("mouseup", dropShip);
        ship.addEventListener("click", rotateShip);
      }
    });
  }

  return { renderBoard, dragAndDrop, shipButtons };
}
