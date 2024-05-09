import { Board } from "./gameboard.js";

function Player(name = "Computer") {
  let title = name;
  let board = Board();

  function getName() {
    return name;
  }

  return {
    getName,
    board,
  };
}