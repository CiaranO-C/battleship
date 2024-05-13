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
  return { renderBoard };
}
