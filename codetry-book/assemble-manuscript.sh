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
MANIFEST="$SCRIPT_DIR/chapters.txt"

if [[ ! -f "$MANIFEST" ]]; then
  echo "ERROR: chapter manifest not found: $MANIFEST" >&2
  exit 1
fi

# Read chapters.txt, skipping blank lines and comment lines.
mapfile -t CHAPTERS < <(grep -v '^\s*#' "$MANIFEST" | grep -v '^\s*$')

{
  echo "<!-- GENERATED FILE — do not edit by hand. Run assemble-manuscript.sh to regenerate. -->"
  echo ""

  first=1
  for chapter in "${CHAPTERS[@]}"; do
    src="$DRAFTS/$chapter"
    if [[ ! -f "$src" ]]; then
      echo "ERROR: expected chapter file is missing: $src" >&2
      echo "Assembly aborted. Restore or recreate the file, then re-run assemble-manuscript.sh." >&2
      exit 1
    fi

    if [[ $first -eq 0 ]]; then
      printf '\n\n---\n\n'
    fi
    first=0

    cat "$src"
  done
} > "$OUT"

echo "Assembled $(echo "${CHAPTERS[@]}" | wc -w) chapters → $OUT ($(wc -c < "$OUT") bytes)"
