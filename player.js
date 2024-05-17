import { Board } from "./gameboard.js";

function Player() {
  let name = null;
  const board = Board();
  let score = 0;

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

  return {
    getName,
    setName,
    getScore,
    incrementScore,
    board,
  };
}

function Computer() {
  const player = Player();
  const { board, score, getScore, getName, setName, incrementScore } = player;

  setName("Computer");

  function playTurn() {
    const target = board.getRandomIndex();
  }

  return {
    getName,
    getScore,
    incrementScore,
    playTurn,
    board,
  };
}

export { Player, Computer };
