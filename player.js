import { Board } from "./gameboard.js";

function Player(computerPlayer = false) {
  let name = null;
  const board = Board();
  let score = 0;
  const computer = computerPlayer;

  function getName() {
    return name;
  }

  function getScore() {
    return score;
  }

  function incrementScore() {
    score++;
    return score;
  }

  function setName(newName) {
    name = newName;
  }

  function isComputer() {
    if (computer) return true;
    return false;
  }

  return {
    getName,
    setName,
    getScore,
    incrementScore,
    isComputer,
    board,
  };
}



export { Player };
