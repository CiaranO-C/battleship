import { initialiseGame } from "../../gameController.js";
import { queryDom } from "../utils.js";
import { validateInputs } from "./utils.js";

function focusNameInput() {
  const playerOneNameInput = queryDom("#playerOneName");
  //sets caret to end of name input
  playerOneNameInput.focus();
  playerOneNameInput.setSelectionRange(1000, 1000);
}

function enablePlayerTwoSelection() {
  const playerTwoSelection = queryDom(".player-two-select");
  playerTwoSelection.addEventListener("click", toggleSelection);

  //allows switching between computer opponent or player 2
  function toggleSelection({ target }) {
    const selection = target;
    if (selection.classList.contains("name-input")) {
      const current = queryDom(".selected");
      current.classList.toggle("selected");
      selection.classList.toggle("selected");
    }
  }
}

function scrollToGame() {
  const gameContainer = queryDom(".game-container");
  gameContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

function enableScrollToGame() {
  const scrollDownBtn = queryDom("#scrollDown");

  scrollDownBtn.addEventListener("click", () => {
    const playerOneName = queryDom("#playerOneName");
    const playerTwoName = queryDom(".selected");

    const inputsEmpty = !validateInputs([playerOneName, playerTwoName]);
    if (inputsEmpty) return;

    initialiseGame(playerOneName, playerTwoName);
  });
}

function initaliseLandingPage() {
  focusNameInput();
  enablePlayerTwoSelection();
  enableScrollToGame();
}

export { initaliseLandingPage, scrollToGame };
