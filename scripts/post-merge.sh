#!/bin/bash
set -e
pnpm install --frozen-lockfile --prefer-offline
pnpm --filter db push

# Push to GitHub backup — GITHUB_TOKEN must be set as a Replit secret.
# The token is embedded in a one-shot URL so it is never written to .git/config.
if [ -n "$GITHUB_TOKEN" ]; then
  git push "https://x-access-token:${GITHUB_TOKEN}@github.com/OurHeadwaters/Workbench.git" HEAD:main
  echo "GitHub sync complete."
else
  echo "WARNING: GITHUB_TOKEN not set — skipping GitHub push."
fi
