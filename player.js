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

function Computer() {
  const player = Player(true);
  const {
    board,
    score,
    getScore,
    getName,
    setName,
    incrementScore,
    isComputer,
  } = player;
  

  setName("Computer");
  board.randomize();

  function getTarget() {
    const target = board.getRandomIndex();
    return target;
  }

  return {
    getName,
    getScore,
    incrementScore,
    getTarget,
    isComputer,
    board,
  };
}

export { Player, Computer };
