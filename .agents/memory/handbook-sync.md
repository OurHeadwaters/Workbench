---
name: Handbook sync rule
description: Any edit to handbook.ts requires two follow-on commands or typecheck fails
---

After editing `artifacts/codetry-handbook/data/handbook.ts`:

1. `cd artifacts/api-server && node scripts/sync-chapters.mjs`
2. `pnpm --filter @workspace/codetry-handbook run export-book`

**Why:** chapters.json is generated from handbook.ts. The typecheck gated run includes a `--check` flag that fails if chapters.json is out of sync with handbook.ts. The export-book step validates the chapter structure.

**How to apply:** Any session touching handbook.ts content must run both commands before marking work done.
