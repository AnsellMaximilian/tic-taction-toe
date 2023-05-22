exports.parseGameState = function (text) {
  var regex = /<!--GAMESTATE:(.*?)-->/;
  var matches = text.match(regex);

  if (matches && matches.length > 1) {
    return JSON.parse(matches[1]);
  }

  return null;
};

exports.parseChoice = function (text) {
  var regex = /tic-taction-toe >>(\d*?)<</;
  var matches = text.match(regex);

  if (matches && matches.length > 1) {
    return JSON.parse(matches[1]);
  }

  return null;
};
