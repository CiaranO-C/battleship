import { Board } from "./gameboard.js";

export default function Player() {
  let name = null;
  const board = Board();
  let score = 0;

  function getName() {
    return name;
  }

  function getScore() {
    return score;
  }

  function setName(newName) {
    name = newName;
  }

  return {
    getName,
    setName,
    board,
  };
}

function Computer() {
  const name = "Computer";
  const board = Board();
  let score = 0;

  function getScore() {
    return score;
  }

  function playTurn(){
    const target = board.getRandomIndex();
    
  }
}
