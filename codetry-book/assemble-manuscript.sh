#!/usr/bin/env bash
# assemble-manuscript.sh
# Concatenates draft chapters in reading order into a single manuscript.md.
# Run from the repo root or from within codetry-book/.
# Output: codetry-book/manuscript.md  (generated — do not edit by hand)
#
# NOTE FOR CONTRIBUTORS: manuscript.md is listed in .gitignore and must never
# be committed. Edit the source files in codetry-book/drafts/ instead, then
# run this script to regenerate the assembled manuscript locally.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DRAFTS="$SCRIPT_DIR/drafts"
OUT="$SCRIPT_DIR/manuscript.md"

CHAPTERS=(
  "01-the-headwaters.md"
  "02-watching-the-beavers.md"
  "03-the-dam-breaks.md"
  "04-codetry-as-architecture.md"
  "05-sons-and-daughters-of-thunder.md"
  "appendix-deep-dives.md"
)

{
  echo "<!-- GENERATED FILE — do not edit by hand. Run assemble-manuscript.sh to regenerate. -->"
  echo ""

  first=1
  for chapter in "${CHAPTERS[@]}"; do
    src="$DRAFTS/$chapter"
    if [[ ! -f "$src" ]]; then
      echo "WARNING: $src not found — skipping" >&2
      continue
    fi

    if [[ $first -eq 0 ]]; then
      printf '\n\n---\n\n'
    fi
    first=0

    cat "$src"
  done
} > "$OUT"

echo "Assembled $(echo "${CHAPTERS[@]}" | wc -w) chapters → $OUT ($(wc -c < "$OUT") bytes)"
