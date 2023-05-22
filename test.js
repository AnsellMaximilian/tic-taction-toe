const Game = require("./Game");

const game = new Game();
game.initialize({
  gridCells: [1, 3, 1, 1, 3, 1, 3, 1, 1],
  moves: 0,
  winner: 0,
  gameOver: false,
  whoseTurn: 1,
});

console.log(game.getBoard());
