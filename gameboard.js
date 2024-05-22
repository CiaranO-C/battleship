import { Ship } from "./ship.js";
import { sumLengths, arrayOfLengths, shipsData } from "./shipsData.js";
import Cell from "./gridCell.js";

export function Board() {
  const board = buildBoard();
  const missedAttacks = [];
  let totalHits = 0;

  function getBoard() {
    return board;
  }

  function buildBoard() {
    const newBoard = [];
    const boardWidth = 10;
    for (let i = 0; i < boardWidth; i++) {
      const row = [];
      for (let j = 0; j < boardWidth; j++) {
        const cell = Cell();
        row.push(cell);
      }
      newBoard.push(row);
    }
    return newBoard;
  }

  function createShip(name, length, axis) {
    const ship = Ship(name, length, axis);
    return ship;
  }

  function getRandomIndex() {
    //get random coordinates between 0-9
    const i = Math.floor(Math.random() * 10);
    const j = Math.floor(Math.random() * 10);
    return [i, j];
  }

  function randomize() {
    const ships = shipsData;

    ships.forEach((ship) => {
      let i;
      let j;
      let shipPlaced = false;
      const [name, length] = ship;
      const shipObj = Ship(name, length);

      while (!shipPlaced) {
        [i, j] = getRandomIndex();
        shipPlaced = placeShip(shipObj, i, j);
        if (!shipPlaced) {
          shipObj.rotate();
          shipPlaced = placeShip(shipObj, i, j);
        }
      }
    });
  }

  function placeShip(ship, i, j) {
    
    const validCells = validatePosition(ship, i, j);

    if (validCells && validCells.length !== 0) {
      validCells.forEach((coordinates) => {
        const [i, j] = coordinates;
        board[i][j].setShip(ship);
      });

      return true;
    }
    return false;
  }

  function validateCoords(i, j) {
    //if cell is empty and coordinates are positive values
    if (i > 9 || i < 0 || j > 9 || j < 0) return false;

    const cell = board[i][j];
    if (cell.isHit() || cell.hasShip()) {
      return false;
    } else {
      return true;
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
    console.log("initial cell invalid");
  }

  function printBoard() {
    console.table(board);
  }

  function recieveAttack(i, j) {
    const targetCell = getCell(i, j);
    if (validateAttack(targetCell)) {
      if (targetCell.hasShip()) {
        const ship = targetCell.getShip();
        ship.hit();
        totalHits++;
      }
      targetCell.setHit();
      return true;
    }
    return false;
  }

  function validateAttack(targetCell) {
    const beenHit = targetCell.isHit();
    if (beenHit) return false;
    return true;
  }

  function shipsSunk() {
    let sumOfLengths = sumLengths();
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
    validateAttack,
    shipsSunk,
    validateCoords,
    getRandomIndex,
    validatePosition,
    createShip,
  };
}

let board = Board();
board.buildBoard();
