#!/bin/bash
set -e
pnpm install --frozen-lockfile --prefer-offline
pnpm --filter db push

# Re-generate the exported book files when handbook data changes.
# ORIG_HEAD is set by git after a merge and covers the full range of
# merged commits. Fall back to HEAD~1 for cherry-pick / rebase flows.
# If no reliable base is available, run the export unconditionally so
# the file is never silently stale.
if git rev-parse --verify ORIG_HEAD >/dev/null 2>&1; then
  DIFF_BASE="ORIG_HEAD"
elif git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
  DIFF_BASE="HEAD~1"
else
  DIFF_BASE=""
fi

if [ -z "$DIFF_BASE" ]; then
  echo "No diff base available — running book export unconditionally."
  pnpm --filter @workspace/codetry-handbook run export-book
  echo "Book export complete."
else
  HANDBOOK_CHANGED=$(git diff --name-only "$DIFF_BASE" HEAD 2>/dev/null | grep -E \
    '^artifacts/codetry-handbook/data/|^artifacts/codetry-handbook/public/narration/' \
    || true)

  if [ -n "$HANDBOOK_CHANGED" ]; then
    echo "Handbook data changed — regenerating book exports..."
    echo "$HANDBOOK_CHANGED" | sed 's/^/  /'
    pnpm --filter @workspace/codetry-handbook run export-book
    echo "Book export complete."
  else
    echo "No handbook data changes detected — skipping book export."
  fi
fi

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
