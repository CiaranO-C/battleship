import { Player } from "./player.js";
import { game } from "./index.js";

export function Computer() {
  const player = Player(true);
  const {
    board,
    score,
    getScore,
    getName,
    setName,
    incrementScore,
    isComputer,
  } = player;

  setName("Computer");
  board.randomize();

  const previousHits = [];
  const targetQueue = [];
  let sunkShip = false;

  function disableSunkShip() {
    sunkShip = false;
  }

  function enemyShipSunk() {
    sunkShip = true;
  }

  function getPreviousHit() {
    if (previousHits.length > 0) {
      return previousHits[previousHits.length - 1];
    }
    return false;
  }

  function saveTarget(coordinates) {
    previousHits.push(coordinates);
  }

  function getRandomTarget() {
    let validTarget = false;
    let target;
    while (!validTarget) {
      target = board.getRandomIndex();
      validTarget = game.validateOpponentBoard(target);
    }
    if (previousHits.length > 0) resetHits();
    console.log("random target");
    return target;
  }

  function getAdjacents() {
    const [i, j] = previousHits[0];
    const above = [i - 1, j];
    const below = [i + 1, j];
    const left = [i, j - 1];
    const right = [i, j + 1];
    const adjacents = validAdjacents([above, below, left, right]);

    if (adjacents.length === 0) return false;
    return adjacents;
  }

  function validAdjacents(targetCoords) {
    const validCoords = [];
    targetCoords.forEach((coord) => {
      const validTarget = game.validateOpponentBoard(coord);
      if (validTarget) {
        validCoords.push(coord);
      }
    });

    return validCoords;
  }

  function getNextTarget() {
    const [iLast, jLast] = previousHits[previousHits.length - 1];
    const [iSecondLast, jSecondLast] = previousHits[previousHits.length - 2];

    const iDiff = iLast - iSecondLast;
    const jDiff = jLast - jSecondLast;

    const i = iLast + iDiff;
    const j = jLast + jDiff;

    const next = [i, j];
    const validTarget = game.validateOpponentBoard(next);

    if (!validTarget) return false;
    console.log("next target");
    return next;
  }

  function getOppositeTarget() {
    const start = previousHits[0];
    const end = previousHits[previousHits.length - 1];
    const length = previousHits.length;
    let opposite;
    if (start[0] === end[0]) {
      opposite =
        start[1] > end[1]
          ? [end[0], end[1] + length]
          : [end[0], end[1] - length];
    } else {
      opposite =
        start[0] > end[0]
          ? [end[0] + length, end[1]]
          : [end[0] - length, end[1]];
    }
    const validTarget = game.validateOpponentBoard(opposite);

    if (!validTarget) return false;
    console.log("opposite target");
    //if opposite is a miss this forces random targeting to resume on following turn
    overWriteHits();
    return opposite;
  }

  function overWriteHits() {
    const start = previousHits[0];
    for (let i = 0; i < previousHits.length; i++) {
      previousHits[i] = start;
    }
    console.log(previousHits);
  }

  function enqueue(target) {
    targetQueue.push(target);
  }

  function getTargetCoordinates() {
    const targetCoords = targetQueue.shift();
    return targetCoords;
  }

  function getAdjacentTarget() {
    console.log("adjacent target");
    const adjacents = getAdjacents();
    const adjIndex = Math.floor(Math.random() * adjacents.length);
    const target = adjacents[adjIndex];
    return target;
  }

  function queueTarget() {
    console.log(previousHits);
    const hits = previousHits.length;
    let target;
    if (hits === 0 || sunkShip) {
      target = getRandomTarget();
      disableSunkShip();
    } else if (hits === 1) {
      target = getAdjacentTarget();
    } else {
      target = getNextTarget() || getOppositeTarget() || getRandomTarget();
    }
    enqueue(target);
  }

  function resetHits() {
    previousHits.length = 0;
  }

  return {
    getName,
    getScore,
    incrementScore,
    getRandomTarget,
    isComputer,
    enemyShipSunk,
    getPreviousHit,
    saveTarget,

    getTargetCoordinates,

    queueTarget,
    board,
  };
}
