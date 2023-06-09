const Grid = require("./Grid");
const { intRandom, sumArray, shuffleArray, isInArray } = require("./helpers");

function Game() {
  this.moves = 0;
  this.winner = 0;
  this.x = 1;
  this.o = 3;
  this.player = this.x;
  this.computer = this.o;
  this.whoseTurn = this.x;
  this.gameOver = false;
  this.score = {
    ties: 0,
    player: 0,
    computer: 0,
  };
  this.difficulty = 1;
  this.myGrid = null;
}

Game.prototype.initialize = function (prevState) {
  this.myGrid = new Grid();
  this.moves = prevState ? prevState.moves : 0;
  this.winner = prevState ? prevState.winner : 0;
  this.gameOver = prevState ? prevState.gameOver : false;
  this.whoseTurn = prevState ? prevState.whoseTurn : this.player; // default, this may change
  if (prevState) {
    this.myGrid.cells = prevState.gridCells;
  } else {
    for (var i = 0; i <= this.myGrid.cells.length - 1; i++) {
      this.myGrid.cells[i] = 0;
    }
  }
};

Game.prototype.getState = function () {
  return {
    gridCells: this.myGrid.cells,
    moves: this.moves,
    winner: this.winner,
    gameOver: this.gameOver,
    whoseTurn: this.whoseTurn,
  };
};

Game.prototype.cellChosen = function (index) {
  console.log("MAKING PLAYER MOVE", index);
  if (
    this.myGrid.cells[index] > 0 ||
    this.whoseTurn !== this.player ||
    this.gameOver
  ) {
    // cell is already occupied or something else is wrong
    return false;
  }
  this.moves += 1;
  this.myGrid.cells[index] = this.player;
  // Test if we have a winner:
  if (this.moves >= 5) {
    this.winner = this.checkWin();
  }
  if (this.winner === 0) {
    this.whoseTurn = this.computer;
    this.makeComputerMove();
  }
  return true;
};

Game.prototype.makeComputerMove = function () {
  console.log("MAKING COMPUTER MOVE");
  // debugger;
  if (this.gameOver) {
    return false;
  }
  var cell = -1,
    myArr = [],
    corners = [0, 2, 6, 8];
  if (this.moves >= 3) {
    cell = this.myGrid.getFirstWithTwoInARow(this.computer);
    if (cell === false) {
      cell = this.myGrid.getFirstWithTwoInARow(this.player);
    }
    if (cell === false) {
      if (this.myGrid.cells[4] === 0 && this.difficulty == 1) {
        cell = 4;
      } else {
        myArr = this.myGrid.getFreeCellIndices();
        cell = myArr[intRandom(0, myArr.length - 1)];
      }
    }
    // Avoid a catch-22 situation:
    if (
      this.moves == 3 &&
      this.myGrid.cells[4] == this.computer &&
      this.player == this.x &&
      this.difficulty == 1
    ) {
      if (
        this.myGrid.cells[7] == this.player &&
        (this.myGrid.cells[0] == this.player ||
          this.myGrid.cells[2] == this.player)
      ) {
        myArr = [6, 8];
        cell = myArr[intRandom(0, 1)];
      } else if (
        this.myGrid.cells[5] == this.player &&
        (this.myGrid.cells[0] == this.player ||
          this.myGrid.cells[6] == this.player)
      ) {
        myArr = [2, 8];
        cell = myArr[intRandom(0, 1)];
      } else if (
        this.myGrid.cells[3] == this.player &&
        (this.myGrid.cells[2] == this.player ||
          this.myGrid.cells[8] == this.player)
      ) {
        myArr = [0, 6];
        cell = myArr[intRandom(0, 1)];
      } else if (
        this.myGrid.cells[1] == this.player &&
        (this.myGrid.cells[6] == this.player ||
          this.myGrid.cells[8] == this.player)
      ) {
        myArr = [0, 2];
        cell = myArr[intRandom(0, 1)];
      }
    } else if (
      this.moves == 3 &&
      this.myGrid.cells[4] == this.player &&
      this.player == this.x &&
      this.difficulty == 1
    ) {
      if (
        this.myGrid.cells[2] == this.player &&
        this.myGrid.cells[6] == this.computer
      ) {
        cell = 8;
      } else if (
        this.myGrid.cells[0] == this.player &&
        this.myGrid.cells[8] == this.computer
      ) {
        cell = 6;
      } else if (
        this.myGrid.cells[8] == this.player &&
        this.myGrid.cells[0] == this.computer
      ) {
        cell = 2;
      } else if (
        this.myGrid.cells[6] == this.player &&
        myGrid.cells[2] == this.computer
      ) {
        cell = 0;
      }
    }
  } else if (
    this.moves === 1 &&
    this.myGrid.cells[4] == this.player &&
    this.difficulty == 1
  ) {
    // if player is X and played center, play one of the corners
    cell = corners[intRandom(0, 3)];
  } else if (
    this.moves === 2 &&
    this.myGrid.cells[4] == this.player &&
    this.computer == this.x &&
    this.difficulty == 1
  ) {
    // if player is O and played center, take two opposite corners
    if (this.myGrid.cells[0] == this.computer) {
      cell = 8;
    } else if (this.myGrid.cells[2] == this.computer) {
      cell = 6;
    } else if (this.myGrid.cells[6] == this.computer) {
      cell = 2;
    } else if (this.myGrid.cells[8] == this.computer) {
      cell = 0;
    }
  } else if (this.moves === 0 && intRandom(1, 10) < 8) {
    // if computer is X, start with one of the corners sometimes
    cell = corners[intRandom(0, 3)];
  } else {
    // choose the center of the board if possible
    if (this.myGrid.cells[4] === 0 && this.difficulty == 1) {
      cell = 4;
    } else {
      myArr = this.myGrid.getFreeCellIndices();
      cell = myArr[intRandom(0, myArr.length - 1)];
    }
  }
  this.myGrid.cells[cell] = this.computer;
  this.moves += 1;
  if (this.moves >= 5) {
    this.winner = this.checkWin();
  }
  if (this.winner === 0 && !this.gameOver) {
    this.whoseTurn = this.player;
  }
};

Game.prototype.checkWin = function () {
  this.winner = 0;

  // rows
  for (var i = 0; i <= 2; i++) {
    var row = this.myGrid.getRowValues(i);
    if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
      if (row[0] == this.computer) {
        this.score.computer++;
        this.winner = this.computer;
        // console.log("computer wins");
      } else {
        this.score.player++;
        this.winner = this.player;
        // console.log("player wins");
      }
      return this.winner;
    }
  }

  // columns
  for (i = 0; i <= 2; i++) {
    var col = this.myGrid.getColumnValues(i);
    if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
      if (col[0] == this.computer) {
        this.score.computer++;
        this.winner = this.computer;
        // console.log("computer wins");
      } else {
        this.score.player++;
        this.winner = this.player;
        // console.log("player wins");
      }
      return this.winner;
    }
  }

  // diagonals
  for (i = 0; i <= 1; i++) {
    var diagonal = this.myGrid.getDiagValues(i);
    if (
      diagonal[0] > 0 &&
      diagonal[0] == diagonal[1] &&
      diagonal[0] == diagonal[2]
    ) {
      if (diagonal[0] == this.computer) {
        this.score.computer++;
        this.winner = this.computer;
        // console.log("computer wins");
      } else {
        this.score.player++;
        this.winner = player;
        // console.log("player wins");
      }
      return this.winner;
    }
  }

  // If we haven't returned a winner by now, if the board is full, it's a tie
  var myArr = this.myGrid.getFreeCellIndices();
  if (myArr.length === 0) {
    this.winner = 10;
    this.score.ties++;
    this.endGame(this.winner);
    return this.winner;
  }

  return this.winner;
};

Game.prototype.drawRow = function (row) {
  let rowText = "";
  this.myGrid.getRowValues(row).forEach((value, index) => {
    const symbol = value === 0 ? index + row * 3 : value === 1 ? "X" : "O";
    if (index === 0 || index === 2) {
      rowText += symbol;
    } else {
      rowText += ` | ${symbol} | `;
    }
  });
  return rowText;
};

Game.prototype.getBoard = function () {
  let board = "";
  board += this.drawRow(0);
  board += "\n";
  board += "-".repeat(9);
  board += "\n";
  board += this.drawRow(1);
  board += "\n";
  board += "-".repeat(9);
  board += "\n";
  board += this.drawRow(2);
  board += "\n";
  board += "-".repeat(9);
  return board;
};

module.exports = Game;
