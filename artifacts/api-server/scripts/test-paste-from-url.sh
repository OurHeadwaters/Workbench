#!/usr/bin/env bash
# Smoke test for POST /api/library/entries/from-url.
#
# Exercises Microlink + cheerio fallback against real public URLs covering
# the three categories in the task spec: media article, producer site, PDF.
# Prints title / summary / screenshot per response and reports
# PASS / WARN / FAIL per row, plus a summary.
#
# PASS: entry was created, sourceUrl matches input, AND a real title was
#       extracted (not the raw URL).
# WARN: entry was created and sourceUrl matches input, but extraction
#       degraded to URL-as-title (graceful fallback when both Microlink
#       and the source site are unreachable). This is documented behavior,
#       not a hard failure.
# FAIL: the request itself failed (no id) or sourceUrl wasn't persisted.
#
# Usage:
#   API_BASE=https://your-host/api/library ./test-paste-from-url.sh
#   ./test-paste-from-url.sh    # defaults to https://$REPLIT_DEV_DOMAIN/api/library
#
# Optional:
#   KEEP=1 ./test-paste-from-url.sh   # don't delete entries afterwards
set -euo pipefail

BASE="${API_BASE:-https://${REPLIT_DEV_DOMAIN:-localhost:8080}/api/library}"
KEEP="${KEEP:-0}"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required" >&2
  exit 1
fi

URLS=(
  "media|https://en.wikipedia.org/wiki/Food_security"
  "media|https://www.cbc.ca/news/canada/north"
  "producer|https://www.saputo.com/en"
  "pdf|https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
)

CREATED_IDS=()
PASS=0
WARN=0
FAIL=0

for entry in "${URLS[@]}"; do
  kind="${entry%%|*}"
  url="${entry#*|}"
  printf '\n=== %-10s %s\n' "[$kind]" "$url"
  resp="$(curl -sS -X POST "$BASE/entries/from-url" \
    -H "Content-Type: application/json" \
    -d "$(jq -nc --arg url "$url" --arg notes "smoke: $kind" \
      '{url: $url, notes: $notes}')")"
  id="$(jq -r '.id // empty' <<<"$resp")"
  title="$(jq -r '.title // empty' <<<"$resp")"
  summary="$(jq -r '.summary // empty' <<<"$resp")"
  shot="$(jq -r '.screenshotUrl // empty' <<<"$resp")"
  source_url="$(jq -r '.sourceUrl // empty' <<<"$resp")"
  echo "  id:         $id"
  echo "  sourceUrl:  $source_url"
  echo "  title:      $title"
  echo "  summary:    ${summary:0:120}"
  echo "  screenshot: ${shot:0:80}"
  [[ -n "$id" ]] && CREATED_IDS+=("$id")

  # Acceptance:
  #   FAIL — request didn't create an entry, or sourceUrl wasn't persisted.
  #   WARN — created cleanly but extraction degraded to URL-as-title or
  #          summary is empty (fallback path; documented behavior).
  #   PASS — sourceUrl persisted, title is real, summary populated.
  if [[ -z "$id" || "$source_url" != "$url" ]]; then
    echo "  FAIL — request did not persist a valid entry (id/sourceUrl missing)"
    FAIL=$((FAIL+1))
  elif [[ "$title" == "$url" || -z "$summary" ]]; then
    echo "  WARN — entry created but metadata extraction degraded (graceful fallback)"
    WARN=$((WARN+1))
  else
    echo "  PASS"
    PASS=$((PASS+1))
  fi
done

if [[ "$KEEP" != "1" ]]; then
  echo
  for id in "${CREATED_IDS[@]}"; do
    curl -s -X DELETE "$BASE/entries/$id" -o /dev/null \
      -w "cleaned $id => %{http_code}\n"
  done
fi

echo
echo "Summary: $PASS passed, $WARN warned, $FAIL failed (of $((PASS+WARN+FAIL)))"
[[ $FAIL -eq 0 ]] || exit 1
