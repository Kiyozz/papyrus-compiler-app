---
name: create-github-pull-request
description: Run to create a pull request (pr in short) to GitHub using `gh` cli tool or mcp tool.
version: 1.0.0
---

Your task is to create a pull request (pr) in English on GitHub. Infer the current issue number from the branch name if any, check the git branch format.

Assign the pull request to the authenticated GitHub user of the current session by passing `--assignee @me` to `gh pr create` (or the equivalent `assignees` field when using the MCP tool).

## Format

```md
## Issues

Closes #{issue_number}

## Description

{short_description_of_pr}

## Notes

{additional_notes}
```

Remove the ## Issues section if not needed.
Remove the ## Notes section if not needed.
