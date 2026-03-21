# Codex And GitHub Setup

This file is the short, practical handoff for the account-level steps that cannot be completed purely by editing repo files.

## Phase 1: Local Machine

You do:

1. Install Node 24 with Homebrew, `nvm`, or your preferred tool.
2. Make sure `pnpm` is available:
   If `corepack` exists, run `corepack enable`.
   Otherwise run `npm install -g pnpm@10.0.0`.
3. Run `pnpm install`.
4. Run `pnpm exec playwright install --with-deps chromium`.
5. Run `pnpm verify`.

Codex can then:

- inspect failures
- repair bootstrap issues
- tighten scripts and configs

## Phase 2: GitHub Repo

You do:

1. Re-auth GitHub CLI with `gh auth login`, or configure the repo through the GitHub web UI.
2. Push the repo once local proof-of-life is green.
3. In GitHub repo settings, keep Actions enabled.
4. Add branch protection for `main`.
5. Require the `verify` check before merge.
6. Require at least one human approval before merge.

Codex can help by:

- preparing the workflow file
- reviewing the check names you should require
- validating the branch protection plan

## Phase 3: Codex Web

You do:

1. Open Codex web and connect the GitHub repository.
2. Create a Codex cloud environment for this repo.
3. Set the setup script to `scripts/codex/setup.sh`.
4. Optionally set the maintenance script to `scripts/codex/maintenance.sh`.
5. Leave agent internet access off for v1.
6. Turn on GitHub code review for the repository.

Proof-of-life steps:

1. Start a small Codex cloud task against this repo.
2. Ask it to run `pnpm verify` and make a tiny safe change.
3. Open a PR.
4. In the PR, comment `@codex review`.

## Recommended Defaults

- Node: 24 LTS
- Package manager: `pnpm` 10.x
- Required CI gate: `verify`
- Agent internet access: Off
- First Codex tasks: docs, tests, and small UI changes

## Intentionally Deferred

These are good next steps, but not part of the first proof-of-life:

- preview deployments
- SQLite-backed persistence
- CI-based Codex write automation
- CODEOWNERS and stricter review governance
