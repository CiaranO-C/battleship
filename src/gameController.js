import { getIndexAttributes, markCell } from "./dom/boards.js";
import { endGame, gameResult } from "./dom/gameManager/end.js";
import { scrollToGame } from "./dom/gameManager/initial.js";
import { runGame, switchTurn, validClick } from "./dom/gameManager/play.js";
import { confirmShips, setupGame } from "./dom/gameManager/setup.js";
import { isOnePlayer } from "./dom/utils.js";
import { Game } from "./gameLogic/game.js";

let game = null;

function initialiseGame(playerOneName, playerTwoName) {
  game = Game(playerOneName, playerTwoName);
  setupGame();
  scrollToGame();
}

function handleRunGame() {
  const shipPacks = confirmShips();
  if (!shipPacks) return;

  const shipsConfirmed = game.confirmAllShips(shipPacks);

  if (shipsConfirmed) {
    runGame();
    if (isOnePlayer()) game.playTurn();
  }
}

function handleTurn({ target }) {
  if (!validClick(target)) return;

  const coords = getIndexAttributes(target);
  const cellAttacked = game.sendAttack(coords);
  if (!cellAttacked) return;

  markCell(target, cellAttacked);
  const winner = game.checkForWinner();

  if (winner) {
    setTimeout(() => {
      gameResult(winner);
      endGame();
    }, 1500);
  } else {
    setTimeout(() => {
      switchTurn();
      game.endTurn();
    }, 250);
  }
}

function resetGame() {
  game = null;
}

export { game, initialiseGame, handleRunGame, handleTurn, resetGame };
