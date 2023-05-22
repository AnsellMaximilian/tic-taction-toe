const core = require("@actions/core");
const github = require("@actions/github");
const Game = require("./Game");
const { parseGameState } = require("./parseGameState");

const githubToken = core.getInput("GITHUB_TOKEN");
const octokit = github.getOctokit(githubToken);
const context = github.context;

const issueNumber = context.payload.issue.number;

function generateReply(game) {
  const reply = `
<!--GAMESTATE:${JSON.stringify(game.getState())}-->
## TIC-TACTION-TOE

### YOUR MOVE (X)

Pick a cell!

${game.getBoard()}
`;

  return reply;
}

async function postComment(text) {
  const response = await octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: issueNumber,
    body: text,
  });
  return response;
}

async function run() {
  try {
    // Check for game start
    const triggerComment = context.payload.comment;
    if (triggerComment.body.toLowerCase().includes("play tic-taction-toe")) {
      // Initialize game
      const game = new Game();
      game.initialize();

      const reply = generateReply(game);
      await postComment(reply);
    } else if (
      /tic-taction-toe >>(\d*?)<</.test(triggerComment.body.toLowerCase())
    ) {
      // check for existing game
      // Get all comments that is a game board

      const comments = await octokit.rest.issues.listComments({
        ...context.repo,
        issue_number: issueNumber,
      });
      console.log("COMMENTS", comments.data);
      const gameComments = comments.data
        .filter((comment) => {
          return parseGameState(comment.body);
        })
        .sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

      const prevGameState = parseGameState(gameComments[0].body);

      const game = new Game();
      game.initialize(prevGameState);
      const reply = generateReply(game);
      await postComment(reply);
    }

    // If no game start command, check for active game, else ignore
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

run();
