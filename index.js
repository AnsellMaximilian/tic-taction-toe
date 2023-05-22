const core = require("@actions/core");
const github = require("@actions/github");
const Game = require("./Game");

console.log("You commented!");
console.log(core.getInput("GITHUB_TOKEN"));

async function run() {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN");

    const context = github.context;

    if (context.payload.pull_request == null && context.payload.issue == null) {
      core.setFailed("No pull request found.");
      return;
    }

    // Initialize game
    const game = new Game();
    game.initialize();

    const comment = `
<!--GAMESTATE:${JSON.stringify(game.getState())}-->
### TIC-TACTION-TOE

## YOUR MOVE (X)

Pick a cell!

${game.getBoard()}
`;

    const issueNumber = context.payload.issue.number;
    const octokit = github.getOctokit(githubToken);

    const response = await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: issueNumber,
      body: comment,
    });

    const comments = await octokit.rest.issues.listComments({
      ...context.repo,
      issue_number: issueNumber,
    });

    console.log(comments);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

run();
