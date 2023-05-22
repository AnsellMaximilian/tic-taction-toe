const core = require("@actions/core");
const github = require("@actions/github");
const Game = require("./Game");

async function run() {
  try {
    // Preparations
    const githubToken = core.getInput("GITHUB_TOKEN");
    const octokit = github.getOctokit(githubToken);

    const context = github.context;
    console.log(context.payload.comment);

    // Get all comments
    const issueNumber = context.payload.issue.number;

    const comments = await octokit.rest.issues.listComments({
      ...context.repo,
      issue_number: issueNumber,
    });

    // Check for game start

    // If no game start command, check for active game, else ignore

    // Initialize game
    const game = new Game();
    game.initialize();

    const comment = `
<!--GAMESTATE:${JSON.stringify(game.getState())}-->
## TIC-TACTION-TOE

### YOUR MOVE (X)

Pick a cell!

${game.getBoard()}
`;

    const response = await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: issueNumber,
      body: comment,
    });
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

run();
