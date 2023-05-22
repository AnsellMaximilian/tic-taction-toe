# Tic-Taction-Toe (Tic-tac-toe game using Github Actions)

This github action lets you play games of tic-tac-toe with a bot in the issue comments of your repository.

## Usage

Here's an example workflow that uses this action. Detailed explanation are given in the following sections:

```yaml
name: "TEST"
on:
  issue_comment:
    types: [created]
permissions: write-all
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16.x
      - run: npm install
      - uses: ./
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Trigger

The action should be triggered in the comments section of an issue. To start a brand new game, type "play tic-taction-toe".

After the game board is displayed, choose a cell number to make your move using "tic-taction-toe >>{cell number}<<".

The usual rules apply for a normal game of tic-tac-toe.

```yaml
on:
  issue_comment:
    types: [created]
```

### Permissions

At the minimum your workflow must set the following permissions:

```yaml
permissions:
  issues: write
```
