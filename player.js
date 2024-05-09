import { Board } from "./gameboard.js";

function Player(name = "Computer") {
  let title = name;
  let board = Board();
  let score = 0;

  function getName() {
    return name;
  }

  return {
    getName,
    board,
  };
}