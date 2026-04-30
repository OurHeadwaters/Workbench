# codetry-handbook · data/ · source-of-truth contract

This directory is the **single source of truth** for the four shared
data artefacts of the Headwaters constellation:

| File | What it carries |
|---|---|
| `constellation.json` | The canonical constellation manifest — version, grammar, principles, constellation-wide primitives (The Standby, The Gate, …), teachers, and zones. Hand-authored JSON. |
| `constellation.ts` | An auto-generated TypeScript snapshot of `constellation.json`, rebuilt by `scripts/sync-constellation.js`. Do **not** edit by hand. |
| `handbook.ts` | The codetry handbook chapters (Parts I–VII). Hand-authored. |
| `foundingExamples.ts` | The Three Founding Examples Part of the handbook. Hand-authored. |
| `standby.ts` | The Standby store types and seed entries used by both web and mobile surfaces. Hand-authored. |
| `pioneerPath.ts` | The mobile Pioneer Path stations, derived from `handbook.ts` and `constellation.ts`. Hand-authored. |

## Who reads these files

- **codetry-handbook (mobile + Expo web export)** — reads them directly
  (relative imports inside the same package).
- **headwaters-books (Vite web)** — reads `constellation.ts` via the
  workspace package import `@workspace/codetry-handbook/data/constellation`.
- **practitioner-operating-plan (Vite web)** — reads
  `constellation.json` at build time. The artifact's `build` and
  `typecheck` scripts run `scripts/publish-constellation.cjs`, which
  copies `artifacts/codetry-handbook/data/constellation.json` byte-for-byte
  to `artifacts/practitioner-operating-plan/public/constellation.json` so
  the deployed site can fetch it. The `public/` copy is a **build
  artifact** — never edit it by hand.

## How to make a change

1. Edit `constellation.json` here (or the relevant `.ts` file).
2. Run `pnpm --filter @workspace/codetry-handbook run sync-constellation`
   to regenerate `constellation.ts` from the JSON.
3. Run `pnpm --filter @workspace/codetry-handbook run typecheck` and
   `pnpm --filter @workspace/codetry-handbook run test` to verify the
   structural locks still hold.
4. Build any downstream artifact (`pnpm --filter @workspace/headwaters-books run build`,
   `pnpm --filter @workspace/practitioner-operating-plan run build`) — the
   change propagates automatically. There is no separate sync step in any
   downstream artifact.

## What used to live elsewhere

Before Task #562 the canonical JSON manifest lived at
`artifacts/practitioner-operating-plan/public/constellation.json`, and
the books site carried its own hand-checked-in
`src/data/constellation.ts` plus a `sync-constellation.cjs` script. Both
sites now read directly from this directory; the old plumbing has been
removed.
