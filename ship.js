export function Ship(size) {
  const length = size;
  let hitCounter = 0;
  let sunk = false;
  let vertical = false;
  let horizontal = true;

  function getLength() {
    return length;
  }

  function rotate() {
    vertical = !vertical;
    horizontal = !horizontal;
  }

  function isVertical(){
    return vertical;
  }

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
    getLength,
    hit,
    hitsTaken,
    isSunk,
    rotate,
    isVertical,

  };
}

//module.exports = { Ship };
