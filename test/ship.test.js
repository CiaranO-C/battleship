import { Ship } from "../src/gameLogic/ship.js";

describe("test ship object methods", () => {
  let testShip;
  const shipLength = 5;
  const shipName = "testShip";
  beforeEach(() => {
    testShip = Ship(shipName, shipLength);
  });

  test("Hit function increments hit counter", () => {
    testShip.hit();
    expect(testShip.hitsTaken()).toBe(1);
    testShip.hit();
    expect(testShip.hitsTaken()).toBe(2);
  });

  test("Check if ship is sunk when hits === length", () => {
    expect(testShip.isSunk()).toBe(false);
    for (let i = 0; i < shipLength; i++) {
      testShip.hit();
    }
    expect(testShip.isSunk()).toBe(true);
  });

  test("testShip stores its name and length", () => {
    expect(testShip.getName()).toEqual(shipName);
    expect(testShip.getLength()).toEqual(shipLength);
  });

  test("No axis argument passed creates horizontal ship", () => {
    expect(testShip.isVertical()).toBe(false);
  })

  test("Axis argument passed creates vertical ship", () => {
    const vShip = Ship(shipName, shipLength, true);
    expect(vShip.isVertical()).toBe(true);
  })

  test("Rotate toggles ship axis", () => {
    expect(testShip.isVertical()).toBe(false);
    testShip.rotate()
    expect(testShip.isVertical()).toBe(true);
  })
});
