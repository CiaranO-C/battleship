function Ship(size) {
  const length = size;
  let hitCounter = 0;
  let sunk = false;

  function hit() {
    hitCounter++;
  }

  function hitsTaken() {
    return hitCounter;
  }

  function isSunk() {
    if (hitCounter === length) {
      sunk = true;
    }
    return sunk;
  }
  
  return {
    length,
    hit,
    hitsTaken,
    isSunk,
  };
}

module.exports = { Ship };
