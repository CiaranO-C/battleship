function Dom() {
  function renderBoard(container, board) {
    const length = board.length;
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        const cell = document.createElement("div");
        cell.setAttribute("data-i", i);
        cell.setAttribute("data-j", j);
        const cellHasShip = board[i][j] === "";
        cell.classList = cellHasShip ? "grid-cell" : "grid-cell ship";
        container.appendChild(cell);
      }
    }
  }
  return { renderBoard };
}

const dom = Dom();

export default { dom };
