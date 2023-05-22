const Game = require("./Game");
const { parseGameState } = require("./parseGameState");

const game = new Game();
// game.initialize({
//   gridCells: [1, 3, 1, 1, 3, 1, 3, 1, 1],
//   moves: 0,
//   winner: 0,
//   gameOver: false,
//   whoseTurn: 1,
// });
game.initialize();

console.log(game.getBoard());

console.log(
  parseGameState(`<!--GAMESTATE:{"gridCells":[0,0,0,0,0,0,0,0,0],"moves":0,"winner":0,"gameOver":false,"whoseTurn":1}-->
## TIC-TACTION-TOE

### YOUR MOVE (X)

Pick a cell!

0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
---------
`)
);
