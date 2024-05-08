const { Ship, isSunk } = require("./ship");

describe("test ship object methods", () => {
    const shipLength = 5;
    const testShip = Ship(shipLength);
  test("Hit function increments hit counter", () => {
    testShip.hit();
    expect(testShip.hitsTaken()).toBe(1);
    testShip.hit();
    expect(testShip.hitsTaken()).toBe(2);
  });

  test("Check if ship is sunk when hits == length", () => {
    expect(testShip.isSunk()).toBe(false);
    for(let i = 0; i<3; i++){
        testShip.hit();
    };
    expect(testShip.isSunk()).toBe(true);
  });
});
