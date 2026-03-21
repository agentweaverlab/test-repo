# Test Repo

## Mission
Build a self-verifying web app with small, reversible changes.
Prefer deterministic verification over cleverness.

## Repo Map
- `apps/web`: Next.js app UI and server routes
- `packages/shared`: shared types and logic
- `tests/e2e`: Playwright smoke tests
- `.github/workflows`: CI gates
- `scripts/codex`: Codex cloud environment scripts

## Canonical Commands
- Install: `pnpm install --frozen-lockfile`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Unit tests: `pnpm test`
- Build: `pnpm build`
- E2E smoke: `pnpm test:e2e:smoke`
- Verify: `pnpm verify`

## Definition Of Done
A task is done only when:
1. `pnpm verify` passes
2. user-facing changes update unit coverage or e2e smoke coverage
3. the change remains secret-free for local and Codex-cloud verification

## Safety Boundaries
- Do not add production secrets or require live credentials for `pnpm verify`.
- Do not enable agent internet access unless explicitly requested.
- Do not make destructive auth, permissions, or data changes without approval.
- Prefer small diffs over broad refactors.

## Testing Guidance
- Use stable selectors with `data-testid`.
- Keep Playwright smoke tests focused on critical flows.
- Treat flaky e2e as a real bug to fix, not a reason to weaken the test.
- Capture Playwright traces and reports on retry or failure.

## Review Guidelines
- Flag regressions that break the `pnpm verify` contract as high severity.
- Flag secret-dependent setup as a regression.
- Flag missing coverage for user-facing changes.
- Flag brittle selectors or tests likely to flake in CI.

## Task Scoping
When working on a task, make the acceptance criteria, allowed paths, and verification steps explicit before broadening scope.
