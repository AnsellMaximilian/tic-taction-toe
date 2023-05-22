//==================================
// HELPER FUNCTIONS
//==================================
exports.sumArray = function sumArray(array) {
  var sum = 0,
    i = 0;
  for (i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
};

exports.isInArray = function isInArray(element, array) {
  if (array.indexOf(element) > -1) {
    return true;
  }
  return false;
};

exports.shuffleArray = function shuffleArray(array) {
  var counter = array.length,
    temp,
    index;
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
};

exports.intRandom = function intRandom(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};
