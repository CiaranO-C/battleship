import { Board } from "../src/gameLogic/gameboard.js";
import { Ship } from "../src/gameLogic/ship.js";

const shipsData = [
  ["Carrier", 5],
  ["Battleship", 4],
  ["Destroyer", 3],
  ["Submarine", 3],
  ["Patrol", 2],
];

describe("Test Gameboard methods", () => {
  const boardSize = 10;
  let testBoard;
  let battleship;
  let i;
  let j;

  beforeEach(() => {
    testBoard = Board();
    battleship = Ship(shipsData[1][0], shipsData[1][1]);
    [i, j] = [0, 0];
  });

  test("getBoard returns board array", () => {
    const board = testBoard.getBoard();
    expect(Array.isArray(board)).toBe(true);
    expect(board.length).toBe(boardSize);
  });

  test("randomises ship positions", () => {
    function getPositions(boardArr) {
      //converts to a board of true/false based on ship presence
      const boolBoard = boardArr.map((row) =>
        row.map((cell) => cell.hasShip()),
      );
      let positions = "";
      //adds any cell with true to positions string
      boolBoard.forEach((row, i) =>
        row.forEach((cell, j) =>
          cell ? (positions += `[${i},${j}] `) : undefined,
        ),
      );

      return positions;
    }

    testBoard.randomize();
    const posOne = getPositions(testBoard.getBoard());

    testBoard.randomize();
    const posTwo = getPositions(testBoard.getBoard());
    expect(posOne).not.toEqual(posTwo);
  });

  test("Places ship, or returns false for invalid position", () => {
    expect(testBoard.placeShip(battleship, i, j)).toBe(true);
    expect(testBoard.placeShip(battleship, i, j)).toBe(false);
  });

  test("Places ship correctly, and get cell contents", () => {
    expect(testBoard.placeShip(battleship, i, j)).toBeTruthy();
    //ship of length 3 should span from 0,0 to 0,2
    expect(testBoard.getCell(i, j).getShip()).toBe(battleship);
    expect(testBoard.getCell(i, j + 1).getShip()).toBe(battleship);
    expect(testBoard.getCell(i, j + 2).getShip()).toBe(battleship);
    expect(testBoard.getCell(9, 9).getShip()).toBeNull();
  });

  test("Attack on same coordinates does not update hits twice", () => {
    testBoard.placeShip(battleship, i, j);
    expect(testBoard.recieveAttack(i, j)).toBeTruthy();
    expect(battleship.hitsTaken()).toEqual(1);

    expect(testBoard.recieveAttack(i, j)).toBeFalsy();
    expect(battleship.hitsTaken()).toEqual(1);
  });

  test("Checks if all ships have sunk", () => {
    testBoard.randomize();
    expect(testBoard.shipsSunk()).toBeFalsy();
    //hits entire board to test if ships sunk
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        testBoard.recieveAttack(i, j);
      }
    }
    expect(testBoard.shipsSunk()).toBeTruthy();
  });

  test("resetBoard sets total hits to 0", () => {
    testBoard.randomize();
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        testBoard.recieveAttack(i, j);
      }
    }
    expect(testBoard.shipsSunk()).toBe(true);
    testBoard.resetBoard();
    expect(testBoard.shipsSunk()).toBe(false);
  });

  test("Validates targets, true if good, false otherwise", () => {
    expect(testBoard.validateAttack(testBoard.getCell(i, j))).toBe(true);
    testBoard.recieveAttack(i, j);
    expect(testBoard.validateAttack(testBoard.getCell(i, j))).toBe(false);
  });

  test("Can create ships", () => {
    const [carrierName, carrierLength] = shipsData[0];
    const carrier = testBoard.createShip(carrierName, carrierLength);
    expect(carrier).toBeTruthy();
    expect(carrier.getName()).toEqual(carrierName);
    expect(carrier.getLength()).toEqual(carrierLength);
  });
});
