#!/bin/bash
set -e
pnpm install --frozen-lockfile --prefer-offline
pnpm --filter db push

# Push to GitHub backup — GITHUB_TOKEN must be set as a Replit secret.
# The token is embedded in a one-shot URL so it is never written to .git/config.
if [ -n "$GITHUB_TOKEN" ]; then
  PUSH_OUTPUT=$(git push --force "https://x-access-token:${GITHUB_TOKEN}@github.com/OurHeadwaters/Workbench.git" HEAD:main 2>&1)
  PUSH_EXIT=$?
  if [ $PUSH_EXIT -ne 0 ]; then
    echo "ERROR: GitHub sync failed (exit $PUSH_EXIT):"
    echo "$PUSH_OUTPUT"
    # Send an email alert via the google-mail integration so the founder knows
    # the mirror is out of sync. The script still exits non-zero so the failure
    # is also visible in the Replit agent inbox.
    pnpm --filter @workspace/scripts run notify-github-sync-failure \
      "git push exited $PUSH_EXIT — $PUSH_OUTPUT" || true
    exit $PUSH_EXIT
  fi
  echo "GitHub sync complete."
else
  echo "WARNING: GITHUB_TOKEN not set — skipping GitHub push."
fi
