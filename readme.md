# Agent-First Web App Test Repo

This repository is a proof-of-life template for an agent-first web app workflow that works well with Codex, GitHub, and Playwright.

The first goal is not "build a big app." The first goal is to make the repo self-verifying:

1. One command tells us whether the repo is healthy: `pnpm verify`
2. Codex has clear standing instructions in `AGENTS.md`
3. GitHub can block broken changes with a required `verify` check
4. Codex cloud can run the same setup and verification steps as a human

## What This Repo Contains

- `apps/web`: a minimal Next.js app with a tiny create-item flow
- `packages/shared`: shared TypeScript logic with unit tests
- `tests/e2e`: Playwright smoke coverage for the app shell and create flow
- `.github/workflows/verify.yml`: the main CI gate
- `scripts/codex`: setup scripts for Codex cloud environments

## What We Are Doing First

We are intentionally starting with the smallest workflow that proves the system works:

- lightweight `pnpm` workspace
- one web app
- one shared package
- unit tests in the shared package
- smoke e2e with stable `data-testid` selectors
- no production secrets
- no preview deployment requirement yet
- no CI-based Codex write automation yet

SQLite and preview deployments can come next, once the verify loop is green and stable.

## Canonical Commands

- Install: `pnpm install`
- Dev app: `pnpm dev`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Unit tests: `pnpm test`
- Build: `pnpm build`
- E2E smoke: `pnpm test:e2e:smoke`
- Full verify: `pnpm verify`

## Local Proof Of Life

1. Install Node 24 or another LTS that satisfies the `>=20.9` engine.
2. Make sure `pnpm` is available:
   If `corepack` exists, run `corepack enable`.
   Otherwise run `npm install -g pnpm@10.0.0`.
3. Install dependencies: `pnpm install`
4. Install Playwright Chromium: `pnpm exec playwright install --with-deps chromium`
5. Run the contract: `pnpm verify`

## What I Can Do Vs What Needs You

Codex can do in-repo work:

- create the workspace structure
- add the example app and tests
- add CI workflows and templates
- prepare Codex environment scripts and docs
- run local verification once the toolchain exists

You need to handle account-bound or UI-bound steps:

- install or approve installation of Node on this machine
- re-authenticate GitHub CLI or use the GitHub web UI
- configure GitHub branch protection and required checks
- connect the repo in Codex web
- create the Codex environment and enable GitHub review

## Next Setup Steps

Follow [docs/codex-github-setup.md](docs/codex-github-setup.md) for the GitHub and Codex web steps after local proof-of-life is green.
