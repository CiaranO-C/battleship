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
    let [i, j] = [0, 0];
    testBoard.recieveAttack(i, j);
    expect(testShip.hitsTaken()).toEqual(1);
    
    expect(testBoard.recieveAttack(9, 9)).toEqual([9, 9]);
    expect(testShip.hitsTaken()).toEqual(1);
});
