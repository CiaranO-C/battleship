import { Ship } from "./ship.js";

export function Board() {
  const board = buildBoard();
  const missedAttacks = [];
  let totalHits = 0;
  const shipLengths = {
    carrier: 5,
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    "patrol boat": 2,
  };

  function getBoard() {
    return board;
  }

  function buildBoard() {
    const newBoard = [];
    const boardWidth = 10;
    for (let i = 0; i < boardWidth; i++) {
      const row = [];
      for (let j = 0; j < boardWidth; j++) {
        row.push("");
      }
      newBoard.push(row);
    }
    return newBoard;
  }

  function createShip(length, axis){
    const ship = Ship(length, axis);
    return ship;
  }

  function getRandomIndex() {
    //get random coordinates between 0-9
    const i = Math.floor(Math.random() * 10);
    const j = Math.floor(Math.random() * 10);
    return [i, j];
  }

  function randomize() {
    const lengths = Object.values(shipLengths);

    lengths.forEach((length) => {
      let [i, j] = getRandomIndex();
      const newShip = Ship(length);
      let shipPlaced = placeShip(newShip, i, j);
      //if ship cannot be placed try again with new coordinates
      if (!shipPlaced) {
        newShip.rotate();
        shipPlaced = placeShip(newShip, i, j);
      }

      while (!shipPlaced) {
        [i, j] = getRandomIndex();
        shipPlaced = placeShip(newShip, i, j);
        if (!shipPlaced) {
          newShip.rotate();
          shipPlaced = placeShip(newShip, i, j);
        }
      }
    });
    printBoard();
  }

  function validateCoords(i, j) {
    //if cell is empty and coordinates are positive values
    if (i > 9 || i < 0 || j > 9 || j < 0) return false;

    const cell = board[i][j];
    if (cell === "") {
      return true;
    } else {
      return false;
    }
  }

  function validatePosition(ship, i, j) {
    if (validateCoords(i, j)) {
      let shipEnd;
      const shipLength = ship.getLength();
      let validCells = [];

      if (ship.isVertical()) {
        shipEnd = i + shipLength;
        for (let n = i; n < shipEnd; n++) {
          console.log(`n = ${n} // j = ${j}`);
          if (!validateCoords(n, j)) return false;
          validCells.push([n, j]);
        }
      } else {
        shipEnd = j + shipLength;
        for (let n = j; n < shipEnd; n++) {
          const currentCell = board[i][n];
          if (!validateCoords(i, n)) return false;
          validCells.push([i, n]);
        }
      }
      return validCells;
    }
    //return something if initial cell invalid
  }

  function placeShip(ship, i, j) {
    const validCells = validatePosition(ship, i, j);
    if (validCells) {
      validCells.forEach((coordinates) => {
        const i = coordinates[0];
        const j = coordinates[1];
        board[i][j] = ship;
      });
    } else {
      console.error(`invalid position -> ${i}, ${j}`);
      return false;
    }
    return true;
  }
  function printBoard() {
    console.table(board);
  }

  function recieveAttack(i, j) {
    const target = getCell(i, j);
    if (validateAttack(target)) {
      if (target === "") {
        missedAttacks.push([i, j]);
        board[i][j] = "O";
        printBoard();
      } else {
        target.hit();
        totalHits++;
        board[i][j] = "X";
        printBoard();
      }
      return true;
    }
    return false;
  }

  function validateAttack(target) {
    if (target === "O" || target === "X") return false;
    return true;
  }

  function shipsSunk() {
    let sumOfLengths = 0;
    const lengths = Object.values(shipLengths);
    lengths.forEach((length) => {
      sumOfLengths += length;
    });
    if (totalHits === sumOfLengths) {
      return true;
    }
    return false;
  }

  function getCell(i, j) {
    return board[i][j];
  }
  return {
    getBoard,
    buildBoard,
    placeShip,
    printBoard,
    randomize,
    getCell,
    recieveAttack,
    shipsSunk,
    validateCoords,
    getRandomIndex,
    validatePosition,
    createShip
  };
}

let board = Board();
board.buildBoard();
console.log("board built");
//board.randomize();
board.printBoard();
