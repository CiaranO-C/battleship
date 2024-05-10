import { Board } from "./gameboard.js";

export default function Player() {
  let name = null;
  let board = Board();
  let score = 0;

  function getName() {
    return name;
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