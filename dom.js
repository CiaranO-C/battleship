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

  function dragAndDrop() {
    const ships = document.querySelectorAll(".ship");
    let startX = 0;
    let startY = 0;
    let newX = 0;
    let newY = 0;

    ships.forEach((ship) => {
      ship.addEventListener("mousedown", selectShip);
      let shipTop = 0;
      let shipLeft = 0;
      let droppedOn;

      function selectShip(event) {
        const ship = event.target;
        console.log(ship);
        startX = event.clientX;
        startY = event.clientY;

        document.addEventListener("mousemove", moveShip);
        document.addEventListener("mouseup", dropShip);
      }

      function moveShip(event) {
        droppedOn = event.target;
        newX = event.clientX;
        newY = event.clientY;

        shipTop += newY - startY;
        shipLeft += newX - startX;
        ship.style.top = `${shipTop}px`;
        ship.style.left = `${shipLeft}px`;

        startX = event.clientX;
        startY = event.clientY;
      }

      function dropShip(event) {
        console.log(droppedOn)
        document.removeEventListener("mousemove", moveShip);
        document.removeEventListener("mouseup", dropShip);
      }
    });
  }

  return { renderBoard, dragAndDrop };
}
