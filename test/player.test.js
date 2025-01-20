import { Player } from "../src/gameLogic/player.js";

describe("Test Player methods", () => {
  let player;
  const playerName = "testPlayer";

  beforeEach(() => {
    player = Player();
  });

  test("set/get player name", () => {
    expect(player.getName()).toBe(null);
    player.setName(playerName);
    expect(player.getName()).toBe(playerName);
  });

  test("get player score", () => {
    expect(player.getScore()).toBe(0);
  });

  test("increment player score", () => {
    expect(player.getScore()).toBe(0);
    player.incrementScore();
    expect(player.getScore()).toBe(1);
  });

  test("isComputer bool indicating computer or human player", () => {
    expect(player.isComputer()).toBe(false);

    const computerPlayer = Player(true);

    expect(computerPlayer.isComputer()).toBe(true);
  });
});
