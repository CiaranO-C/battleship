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

  function getPreviousHits() {
    if (previousHits.length > 0) {
      return previousHits;
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
    return target;
  }

  function getAdjacents() {
    const [i, j] = previousHits[0];
    const above = [i - 1, j];
    const below = [i + 1, j];
    const left = [i, j - 1];
    const right = [i, j + 1];
    const adjacents = validAdjacents([above, below, left, right]);
    console.log(adjacents);
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
    console.log(validCoords);
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
    return opposite;
  }

  function enqueue(target) {
    targetQueue.push(target);
  }

  function getTargetCoordinates() {
    const targetCoords = targetQueue.shift();
    return targetCoords;
  }

  function queueTarget() {
    const shipFound = previousHits.length > 0;
    const queueEmpty = targetQueue.length === 0;
    let target;
    if (!shipFound) {
      console.log("random target");
      target = getRandomTarget();
    } else if (previousHits.length === 1) {
      console.log("adj target");
      const adjacents = getAdjacents();
      const adjIndex = Math.floor(Math.random() * adjacents.length)
      target = adjacents[adjIndex];
    } else if (previousHits.length > 1) {
      console.log("next target");
      target = getNextTarget();
      if (!target) {
        console.log("opposite target");
        target = getOppositeTarget();
        previousHits.length = 1;
      }
      if (!target) {
        console.log("new random target");
        target = getRandomTarget();
        previousHits.length = 0;
        targetQueue.length = 0;
      }
    }
    console.log(target);
    enqueue(target);
  }

  return {
    getName,
    getScore,
    incrementScore,
    getRandomTarget,
    isComputer,

    getPreviousHits,
    saveTarget,

    getTargetCoordinates,

    queueTarget,
    board,
  };
}
