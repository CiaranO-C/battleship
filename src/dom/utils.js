function removeAllChildren(element) {
  while (element.firstElementChild) {
    element.removeChild(element.firstElementChild);
  }
}

function getRandomIndex() {
  //random between 0-9
  const i = Math.floor(Math.random() * 10);
  const j = Math.floor(Math.random() * 10);
  return [i, j];
}

function scrollToTop() {
  const gameStartPage = document.querySelector(".game-start");
  gameStartPage.scrollIntoView({ behavior: "smooth", block: "center" });
}

export { removeAllChildren, getRandomIndex, scrollToTop };
