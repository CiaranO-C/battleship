import { getCell } from "../dom/boards.js";
import { Computer } from "./computer.js";
import { Player } from "./player.js";

function Game(playerOneName, playerTwoName) {
  const { playerOne, playerTwo } = initalisePlayers();

  let currentPlayer = playerOne;

  function initalisePlayers() {
    const playerOne = Player();
    playerOne.setName(playerOneName.value);

    let playerTwo;
    if (playerTwoName.id === "computer") {
      playerTwo = Computer();
    } else {
      playerTwo = Player();
      playerTwo.setName(playerTwoName.value);
    }

    return { playerOne, playerTwo };
  }

  function playTurn() {
    if (currentPlayer.isComputer()) {
      console.table(
        playerTwo.board
          .getBoard()
          .map((row) => row.map((cell) => cell.hasShip())),
      );
      computerTurn();
    }
  }

  function sendAttack(coords) {
    const validCell = validateOpponentBoard(coords);
    if (validCell) {
      const [i, j] = coords;
      const opponent = getOpponent();
      opponent.board.recieveAttack(i, j);
      return validCell;
    }
    return false;
  }

  function computerTurn() {
    const opponentContainer = document.getElementById("playerOne");
    const computer = currentPlayer;
    computer.queueTarget();
    const [i, j] = computer.getTargetCoordinates();
    const targetCell = getCell(opponentContainer, i, j);
    const cellObj = getOpponent().board.getCell(i, j);
    const shipFound = cellObj.hasShip();

    if (shipFound) {
      currentPlayer.saveTarget([i, j]);
    }

    targetCell.click();
    // after click, check if it was sunk
    if (shipFound) {
      const shipObj = cellObj.getShip();
      if (shipObj.isSunk()) computer.enemyShipSunk();
    }
  }

  function checkForWinner() {
    const opponent = getOpponent();
    if (opponent.board.shipsSunk()) {
      currentPlayer.incrementScore();
      return currentPlayer.getName();
    }
    return false;
  }

  function endTurn() {
    switchTurn();
    playTurn();
  }

  function playAgain() {
    playerOne.board.resetBoard();
    playerTwo.board.resetBoard();
    if (playerTwo.isComputer()) playerTwo.board.randomize();
  }

  function confirmAllShips(shipPackages) {
    console.log(shipPackages);

    if (shipPackages) {
      let playerOneShips;
      if (playerTwo.isComputer()) {
        playerOneShips = shipPackages;
        generateShips(playerOne, playerOneShips);
      } else {
        const { packOne, packTwo } = shipPackages;
        generateShips(playerOne, packOne);
        generateShips(playerTwo, packTwo);
      }
      return true;
    }
    return false;
  }

  function generateShips(player, shipPackages) {
    shipPackages.forEach((pack) => {
      const { i, j, name, length, axis } = pack;
      let newShip;
      if (axis === "vertical") {
        newShip = player.board.createShip(name, length, axis);
      } else {
        newShip = player.board.createShip(name, length);
      }
      player.board.placeShip(newShip, i, j);
    });
  }

  function switchTurn() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  function validateOpponentBoard(target) {
    let isValid = false;
    const opponent = getOpponent();
    const [i, j] = target;

    const cell = opponent.board.getCell(i, j);
    if (cell) {
      isValid = opponent.board.validateAttack(cell);
      if (isValid) return cell;
    }
    return isValid;
  }

  function getOpponent() {
    if (currentPlayer === playerOne) {
      return playerTwo;
    }
    return playerOne;
  }

  return {
    playTurn,
    endTurn,
    playAgain,
    validateOpponentBoard,
    confirmAllShips,
    sendAttack,
    checkForWinner,
  };
}

export { Game };
