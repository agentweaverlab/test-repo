#!/usr/bin/env bash
set -euxo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  if command -v corepack >/dev/null 2>&1; then
    corepack enable
    corepack prepare pnpm@10.0.0 --activate
  else
    npm install -g pnpm@10.0.0
  fi
fi

pnpm install --frozen-lockfile
pnpm exec playwright install chromium
