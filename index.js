const core = require("@actions/core");
const github = require("@actions/github");

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

    const comment = "HELLO MADAF";

    const issueNumber = context.payload.issue.number;
    const octokit = github.getOctokit(githubToken);

    console.log(`Issue number: ${issueNumber}`);
    console.log(`TOKEN: ${githubToken}. Type: ${typeof githubToken}`);

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
