export default function Cell() {
  let ship = null;
  let hit = false;

  function setShip(shipObj) {
    ship = shipObj;
  }

  function setHit() {
    hit = true;
  }

  function isHit() {
    return hit;
  }

  function hasShip() {
    if (ship) {
      return true;
    }
    return false;
  }

  function shipName() {
    if (ship) {
      const name = ship.getName();
      return name;
    }
  }

  return {
    setShip,
    setHit,
    hasShip,
    shipName,
    isHit,
  };
}
