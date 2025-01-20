import Cell from "../src/gameLogic/gridCell.js";
import { Ship } from "../src/gameLogic/ship.js";

describe("test gridCell methods", () => {
  const shipLength = 5;
  const shipName = "testShip";
  const testShip = Ship(shipName, shipLength);
  let cell;

  beforeEach(() => {
    cell = Cell();
  });

  test("Sets ship", () => {
    expect(cell.getShip()).toBe(null);
    cell.setShip(testShip);
    expect(cell.getShip()).toBe(testShip);
  });

  test("hasShip returns bool indicating ship presence", () => {
    expect(cell.hasShip()).toBe(false);
    cell.setShip(testShip);
    expect(cell.hasShip()).toBe(true);
  });

  test("Stores ship name", () => {
    expect(cell.shipName()).toBeFalsy();
    cell.setShip(testShip);
    expect(cell.shipName()).toBe(shipName);
  });

  test("Stores hit status", () => {
    expect(cell.isHit()).toBe(false);
    cell.setHit();
    expect(cell.isHit()).toBe(true);
  });
});
