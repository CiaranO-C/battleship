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

  const previousTargets = [];

  setName("Computer");
  board.randomize();

  function getTarget() {
    const target = board.getRandomIndex();
    previousTargets.push(target);
    return target;
  }

  function getAdjacentTargets() {
    const previous = previousTargets.pop();
    const [i, j] = previous;
    const above = [i + 1, j];
    const below = [i - 1, j];
    const left = [i, j - 1];
    const right = [i, j + 1];
    const targets = [above, below, left, right];
    return targets;
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
