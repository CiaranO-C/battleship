import { Board } from "./gameboard";
import { Ship } from "./ship";

const testBoard = Board();
const testShip = Ship(3);

test("Test random index numbers 0-9", () => {
  const [i, j] = [0, 0];
  expect(testBoard.placeShip(testShip, i, j)).toBeTruthy();
  //ship of length 3 should span from 0,0 to 0,2
  expect(testBoard.getCell(i, j)).toBe(testShip);
  expect(testBoard.getCell(i, j + 1)).toBe(testShip);
  expect(testBoard.getCell(i, j + 2)).toBe(testShip);
});

test("recieves attack and updates ship or misses", () => {
  const [i, j] = [0, 0];
  expect(testBoard.recieveAttack(i, j)).toBeTruthy();
  expect(testShip.hitsTaken()).toEqual(1);

  expect(testBoard.recieveAttack(i,j)).toBeFalsy();
  expect(testShip.hitsTaken()).toEqual(1);
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
