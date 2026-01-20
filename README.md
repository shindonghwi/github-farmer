# GitHub Farmer

A GitHub Action that generates an animated GIF of your contribution graph being harvested.

![Example](https://raw.githubusercontent.com/shindonghwi/github-farmer/main/example.gif)

## Features

- Arrow character harvests your yearly GitHub contributions
- Egg hatches into a chick every 1000 contributions
- Displays commit and PR statistics
- Smooth wave animation on completion

## Usage

### 1. Create Workflow

Add `.github/workflows/github-farmer.yml` to your profile repository:

```yaml
name: GitHub Farmer

on:
  schedule:
    - cron: '0 0 * * *'  # Daily update
  workflow_dispatch:      # Manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: shindonghwi/github-farmer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add github-farmer.gif
          git diff --staged --quiet || git commit -m "Update GitHub Farmer GIF"
          git push
```

### 2. Add to README

```md
![GitHub Farmer](./github-farmer.gif)
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token for API access | Yes | - |
| `username` | GitHub username | No | Repository owner |
| `output-path` | Output path for GIF | No | `github-farmer.gif` |

## Examples

Generate GIF for a different user:

```yaml
- uses: shindonghwi/github-farmer@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    username: torvalds
    output-path: torvalds-farm.gif
```

## License

MIT
