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

function queryDom(selector, list = false) {
  if (!selector) throw new Error("invalid selector supplied to queryDom");
  if (list) {
    return document.querySelectorAll(selector);
  } else {
    return document.querySelector(selector);
  }
}

function isOnePlayer() {
  const onePlayer = document.querySelector(".selected").id === "computer";
  return onePlayer;
}

export { removeAllChildren, getRandomIndex, scrollToTop, queryDom, isOnePlayer };
