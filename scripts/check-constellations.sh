#!/usr/bin/env bash
# check-constellations.sh
#
# Scans .local/tasks/*.md for a `constellation:` field in YAML front-matter.
#
# Rules:
#   - Only files whose *modification* date is >= CONSTELLATION_CUTOFF_DATE are checked.
#     Older files pre-date the convention and are skipped automatically.
#     NOTE: The cutoff is based on mtime (last modified), not the original creation/add
#     date.  A pre-convention file that is later edited will re-enter scope.  If strict
#     "first-committed date" semantics are needed, switch the date lookup to
#     `git log --diff-filter=A --format=%as -- "$file" | tail -1`.
#   - Files listed in IGNORE_FILES are always skipped regardless of date.
#   - Exits non-zero and prints the offending file names if any are missing the field.
#
# Configuration:
#   CONSTELLATION_CUTOFF_DATE  ISO date string (YYYY-MM-DD), default 2026-05-15.
#                              Override via environment to shift the window.

set -euo pipefail

CUTOFF_DATE="${CONSTELLATION_CUTOFF_DATE:-2026-05-15}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TASKS_DIR="$SCRIPT_DIR/../.local/tasks"

IGNORE_FILES=(
  # task-1071.md is the file for this task itself.  The original task spec
  # referred to it as task-1050.md but the actual filename is task-1071.md;
  # ignoring by the real filename is correct.
  "task-1071.md"
)

missing=()

for file in "$TASKS_DIR"/*.md; do
  [[ -f "$file" ]] || continue
  filename="$(basename "$file")"

  skip=0
  for ignored in "${IGNORE_FILES[@]}"; do
    if [[ "$filename" == "$ignored" ]]; then
      skip=1
      break
    fi
  done
  [[ $skip -eq 1 ]] && continue

  file_date="$(stat -c "%y" "$file" 2>/dev/null | cut -c1-10 || true)"
  if [[ -z "$file_date" ]]; then
    file_date="$(stat -f "%Sm" -t "%Y-%m-%d" "$file" 2>/dev/null || true)"
  fi

  if [[ -n "$file_date" && "$file_date" < "$CUTOFF_DATE" ]]; then
    continue
  fi

  if ! awk 'BEGIN{fm=0} /^---/{fm++; if(fm==2) exit} fm==1 && /^constellation:/{found=1} END{exit !found}' "$file"; then
    missing+=("$filename")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  echo ""
  echo "constellation-check: FAILED"
  echo "The following task files are missing a 'constellation:' field in their YAML front-matter:"
  echo ""
  for f in "${missing[@]}"; do
    echo "  - $f"
  done
  echo ""
  echo "Add 'constellation:' to each file's --- front-matter block. Example:"
  echo ""
  echo "  ---"
  echo "  title: My task title"
  echo "  constellation: Codetry"
  echo "  ---"
  echo ""
  echo "Valid constellations:"
  echo "  Codetry / Pioneer Path / Word Walk / The Gate & The Standby / Headwaters Platform"
  echo "  807 Benefits / Bright Side / Library / Print Marketing / Deer Lake"
  echo "  Agency Operations / Saltbox / Practitioner's Guide V2"
  echo ""
  echo "To grandfather files created before the convention, lower CONSTELLATION_CUTOFF_DATE"
  echo "(current value: $CUTOFF_DATE)."
  echo ""
  exit 1
fi

echo "constellation-check: passed (cutoff: $CUTOFF_DATE)"
exit 0
