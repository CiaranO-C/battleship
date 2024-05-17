export function Ship(size, axis) {
  const length = size;
  let hitCounter = 0;
  let sunk = false;
  //if axis passed in then ship vertical, otherwise horizontal
  let vertical = axis ? true : false
  let horizontal = axis ? false : true

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
