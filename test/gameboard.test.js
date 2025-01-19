import { Board } from "../src/gameLogic/gameboard.js";
import { Ship } from "../src/gameLogic/ship.js";

const shipsData = [
  ["Carrier", 5],
  ["Battleship", 4],
  ["Destroyer", 3],
  ["Submarine", 3],
  ["Patrol", 2],
];

const testBoard = Board();
const battleship = Ship(shipsData[1][0], shipsData[1][1]);

test("Test random index numbers 0-9", () => {
  const [i, j] = [0, 0];
  expect(testBoard.placeShip(battleship, i, j)).toBeTruthy();
  //ship of length 3 should span from 0,0 to 0,2
  expect(testBoard.getCell(i, j).getShip()).toBe(battleship);
  expect(testBoard.getCell(i, j + 1).getShip()).toBe(battleship);
  expect(testBoard.getCell(i, j + 2).getShip()).toBe(battleship);
});

test("recieves attack and updates ship or misses", () => {
  const [i, j] = [0, 0];
  expect(testBoard.recieveAttack(i, j)).toBeTruthy();
  expect(battleship.hitsTaken()).toEqual(1);

  expect(testBoard.recieveAttack(i, j)).toBeFalsy();
  expect(battleship.hitsTaken()).toEqual(1);
});

test("gameboard checks if all ships have sunk", () => {
  const newBoard = Board();
  newBoard.randomize();
  const totalShipCells = 17;
  expect(newBoard.shipsSunk()).toBeFalsy();
  //hits entire board to test if ships sunk
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      newBoard.recieveAttack(i, j);
    }
  }
  expect(newBoard.shipsSunk()).toBeTruthy();
});
