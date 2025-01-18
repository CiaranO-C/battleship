const shipsData = [
  ["Carrier", 5],
  ["Battleship", 4],
  ["Destroyer", 3],
  ["Submarine", 3],
  ["Patrol", 2],
];

function sumLengths() {
  let sumOfLengths = 0;
  shipsData.forEach((ship) => {
    sumOfLengths += ship[1];
  });
  return sumOfLengths;
}

function arrayOfLengths() {
  const lengthArray = [];
  shipsData.forEach((ship) => {
    lengthArray.push(ship[1]);
  });
  return lengthArray;
}

export { shipsData, sumLengths, arrayOfLengths };
