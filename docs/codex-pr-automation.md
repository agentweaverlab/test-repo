# Codex PR Automation

This repository supports two different Codex workflows on pull requests.

## 1. Review Workflow

Use GitHub's built-in Codex integration when you want review feedback.

Examples:

- `@codex review`
- automatic Codex reviews enabled in repo settings

Result:

- Codex posts review feedback on the PR
- Codex may also create a Cloud task with a proposed diff
- that review flow does not directly push commits into the PR branch

## 2. Write-Back Workflow

Use the repository workflow command when you want Codex to modify the current PR branch.

Trigger format:

```text
/codex fix <what you want changed>
```

Examples:

```text
/codex fix address the latest review findings and rerun verify
/codex fix reduce this diff and add coverage for the edge case
/codex fix make the PR mergeable without changing the visual design
```

Result:

1. GitHub Actions checks out the PR branch
2. Codex runs against that branch with PR discussion context
3. If Codex changes files, the workflow runs `pnpm verify`
4. If verification passes, the workflow commits and pushes back into the same PR branch
5. The normal `verify` workflow reruns on the updated commit
6. The workflow posts a summary comment back on the PR

## Why This Uses `/codex` Instead Of `@codex`

The built-in GitHub integration already uses `@codex ...` comments to create Cloud tasks or reviews.
This repository uses `/codex ...` for write-back automation so the two systems do not double-trigger on the same comment.

## Required GitHub Secrets

Add these repository secrets before using the write-back workflow:

- `OPENAI_API_KEY`: used by `openai/codex-action@v1`
- `CODEX_PUSH_TOKEN`: a fine-grained token with write access to this repository so branch updates trigger normal GitHub workflows

Why a separate push token is required:

- GitHub documents that events triggered by the repository `GITHUB_TOKEN` do not start new workflow runs
- if the workflow pushed commits with `GITHUB_TOKEN`, the PR branch would update but the standard `verify` workflow would not rerun on that new commit

## Recommended Guardrails

- Keep automatic Codex review enabled if you like review feedback
- Keep `/codex ...` write-back human-triggered at first
- Keep branch protection requiring PRs and the `verify` check
- Do not require human approvals on a solo repository
- Do not enable auto-merge

## First-Time Setup Checklist

1. Add `OPENAI_API_KEY` to repository secrets
2. Add `CODEX_PUSH_TOKEN` to repository secrets
3. Merge the workflow into `main`
4. Open a PR
5. Comment:

```text
/codex fix address the latest review findings and rerun verify
```

6. Wait for the `codex-pr-followup` workflow to finish
7. Review the pushed commit and the rerun `verify` check

Important:

- The `/codex ...` command will not do anything until this workflow is merged into the default branch, because GitHub loads `issue_comment` workflows from the default branch.
