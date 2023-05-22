const { intRandom, sumArray, shuffleArray, isInArray } = require("./helpers");

//==================================
// GRID OBJECT
//==================================

// Grid constructor
//=================
function Grid() {
  this.cells = new Array(9);
}

// Grid methods
//=============

// Get free cells in an array.
// Returns an array of indices in the original Grid.cells array, not the values
// of the array elements.
// Their values can be accessed as Grid.cells[index].
Grid.prototype.getFreeCellIndices = function () {
  var i = 0,
    resultArray = [];
  for (i = 0; i < this.cells.length; i++) {
    if (this.cells[i] === 0) {
      resultArray.push(i);
    }
  }
  // console.log("resultArray: " + resultArray.toString());
  // debugger;
  return resultArray;
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns the values of the elements.
Grid.prototype.getRowValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getRowValues!");
    return undefined;
  }
  var i = index * 3;
  return this.cells.slice(i, i + 3);
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns an array with the indices, not their values.
Grid.prototype.getRowIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getRowIndices!");
    return undefined;
  }
  var row = [];
  index = index * 3;
  row.push(index);
  row.push(index + 1);
  row.push(index + 2);
  return row;
};

// get a column (values)
Grid.prototype.getColumnValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnValues!");
    return undefined;
  }
  var i,
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(this.cells[i]);
  }
  return column;
};

// get a column (indices)
Grid.prototype.getColumnIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnIndices!");
    return undefined;
  }
  var i,
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(i);
  }
  return column;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagValues = function (arg) {
  var cells = [];
  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagValues!");
    return undefined;
  } else if (arg === 0) {
    cells.push(this.cells[0]);
    cells.push(this.cells[4]);
    cells.push(this.cells[8]);
  } else {
    cells.push(this.cells[2]);
    cells.push(this.cells[4]);
    cells.push(this.cells[6]);
  }
  return cells;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagIndices = function (arg) {
  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagIndices!");
    return undefined;
  } else if (arg === 0) {
    return [0, 4, 8];
  } else {
    return [2, 4, 6];
  }
};

// Get first index with two in a row (accepts computer or player as argument)
Grid.prototype.getFirstWithTwoInARow = function (agent) {
  if (agent !== computer && agent !== player) {
    console.error(
      "Function getFirstWithTwoInARow accepts only player or computer as argument."
    );
    return undefined;
  }
  var sum = agent * 2,
    freeCells = shuffleArray(this.getFreeCellIndices());
  for (var i = 0; i < freeCells.length; i++) {
    for (var j = 0; j < 3; j++) {
      var rowV = this.getRowValues(j);
      var rowI = this.getRowIndices(j);
      var colV = this.getColumnValues(j);
      var colI = this.getColumnIndices(j);
      if (sumArray(rowV) == sum && isInArray(freeCells[i], rowI)) {
        return freeCells[i];
      } else if (sumArray(colV) == sum && isInArray(freeCells[i], colI)) {
        return freeCells[i];
      }
    }
    for (j = 0; j < 2; j++) {
      var diagV = this.getDiagValues(j);
      var diagI = this.getDiagIndices(j);
      if (sumArray(diagV) == sum && isInArray(freeCells[i], diagI)) {
        return freeCells[i];
      }
    }
  }
  return false;
};

Grid.prototype.reset = function () {
  for (var i = 0; i < this.cells.length; i++) {
    this.cells[i] = 0;
  }
  return true;
};

module.exports = Grid;
