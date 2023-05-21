const core = require("@actions/core");
const github = require("@actions/github");

console.log("You commented!");
console.log(core.getInput("GITHUB_TOKEN"));
