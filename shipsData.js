const shipsData = [
  ["carrier", 5],
  ["battleship", 4],
  ["destroyer", 3],
  ["submarine", 3],
  ["patrol", 2],
];

function sumLengths() {
  let sumOfLengths = 0;
  shipsData.forEach((ship) => {
    sumOfLengths += ship[1];
  });
  return sumOfLengths;
}

export {shipsData, sumLengths}
