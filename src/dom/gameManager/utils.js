import { hideBoards } from "../boards.js";
import { currentPlayer, getOpponent } from "../players.js";
import { removeAllChildren } from "../utils.js";

function clearOverlays() {
  //clears any messages displayed ontop of boards
  const overlays = document.querySelectorAll(".overlay");
  overlays.forEach((overlay) => removeAllChildren(overlay));
}

function passDeviceListener(overlay) {
  overlay.addEventListener(
    "click",
    () => {
      overlay.classList.add("hidden");
    },
    { once: true },
  );
}

function passDeviceUI() {
  const player = currentPlayer();
  const name = document.querySelector(`#${player.id}Header`).textContent;
  const opponent = getOpponent();
  const overlay = opponent.querySelector(".overlay");
  const message = document.createElement("h2");
  const prompt = document.createElement("p");
  prompt.textContent = "click here!"
  message.textContent = `Pass to ${name}`;
  passDeviceListener(overlay);
  overlay.append(message, prompt);
}

function passDevice() {
  setTimeout(() => {
    clearOverlays();
    hideBoards();
    passDeviceUI();
  }, 1000);
}

function validateInputs(inputs) {
  if (
    !Array.isArray(inputs) ||
    !inputs.every((input) => input.classList.contains("name-input"))
  )
    throw new Error("Validate inputs must recieve an array of name inputs");

  for (let i = 0; i < inputs.length; i++) {
    const { id, value } = inputs[i];
    if (id === "computer") continue;
    if (!value) return false;
  }
  return true;
}

export {
  clearOverlays,
  passDevice,
  passDeviceListener,
  passDeviceUI,
  validateInputs,
};
