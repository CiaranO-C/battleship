import { hideBoards } from "../boards.js";
import { currentPlayer, getOpponent } from '../players.js';
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
  const name = player.firstElementChild.textContent;
  const opponent = getOpponent();
  const overlay = opponent.querySelector(".overlay");
  const message = document.createElement("h2");
  message.textContent = `Pass to ${name}`;
  passDeviceListener(overlay);
  overlay.appendChild(message);
}

function passDevice() {
  setTimeout(() => {
    clearOverlays();
    hideBoards();
    passDeviceUI();
  }, 1000);
}

export { clearOverlays, passDevice, passDeviceListener, passDeviceUI };
