import { renderPlayerShips } from "../gameManager/setup.js";
import { getParentPlayer, getPlayerShips } from "../players.js";
import { dragAndDrop } from "./dragAndDrop.js";
import { clearPosition, getSelectedShip, toggleSelectedShip } from "./ships.js";

function spin() {
  const ship = getSelectedShip();
  const width = ship.offsetWidth;
  const height = ship.offsetHeight;
  ship.style.height = `${width}px`;
  ship.style.width = `${height}px`;
}

function toggleAxis(ship) {
  const axis = ship.getAttribute("data-axis");
  axis === "horizontal"
    ? ship.setAttribute("data-axis", "vertical")
    : ship.setAttribute("data-axis", "horizontal");
}

function dockShips(event) {
  const button = event.target;
  const parentPlayer = getParentPlayer(button);
  const ships = getPlayerShips(parentPlayer);
  ships.forEach((ship) => {
    toggleSelectedShip(ship);
    clearPosition();
    ship.remove();
  });
  renderPlayerShips(parentPlayer);
  dragAndDrop(getPlayerShips(parentPlayer));
}

export { spin, toggleAxis, dockShips };
