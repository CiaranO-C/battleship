import { scrollToGame } from "./dom/gameManager/initial.js";
import { validateInputs } from "./dom/gameManager/utils.js";
import { queryDom } from "./dom/utils.js";
import { Game } from "./gameLogic/game.js";

let game = null;

function initialiseGame() {
  const playerOneName = queryDom("#playerOneName");
  const playerTwoName = queryDom(".selected");
  const inputsEmpty = !validateInputs([playerOneName, playerTwoName]);
  if (inputsEmpty) return;

  game = Game(playerOneName, playerTwoName);
  game.setup();
  scrollToGame();
}

function resetGame() {
  game = null;
}

export { game, initialiseGame, resetGame };
//functions used outside of dom modules
//setupGame,
//switchCurrentPlayer,
// switchTurn,
//setup,
// run,
// toggleBoardListeners,
//gameResult,
//endGame,
//playAgain,
// addPoint,
//getIndexAttributes,
//allShipsPlaced,
//getPlayerShips,
//confirmShips,
//  disableSetup,
//getCell,
