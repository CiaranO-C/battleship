function currentPlayer() {
  const currentPlayer = document.querySelector(".active");
  return currentPlayer;
}

function getOpponent() {
  let opponent;
  const players = document.querySelectorAll(".player-container");
  players.forEach((player) => {
    if (!player.classList.contains("active")) opponent = player;
  });
  return opponent;
}

function switchCurrentPlayer() {
  const players = document.querySelectorAll(".player-container");
  players.forEach((player) => player.classList.toggle("active"));
}

function getParentPlayer(element) {
  const playerOne = document.getElementById("playerOne");
  const playerTwo = document.getElementById("playerTwo");

  const parent = playerOne.contains(element) ? playerOne : playerTwo;
  return parent;
}

function getPlayerShips(player) {
  const ships = player.querySelectorAll(".ship");
  return ships;
}

function renderPlayerNames() {
  const nameOne = document.getElementById("playerOneName").value;
  const nameTwo = document.querySelector(".selected").value;
  const playerOneName = document.querySelector("#playerOneHeader");
  const playerTwoName = document.querySelector("#playerTwoHeader");

  playerOneName.textContent = nameOne;
  playerTwoName.textContent = nameTwo;
}

function resetActivePlayer() {
  const players = document.querySelectorAll(".player-container");
  players.forEach((player) => player.classList.remove("active"));
  const playerOne = document.getElementById("playerOne");
  playerOne.classList.add("active");
}

export {
  currentPlayer,
  getOpponent,
  switchCurrentPlayer,
  getParentPlayer,
  getPlayerShips,
  renderPlayerNames,
  resetActivePlayer,
};
