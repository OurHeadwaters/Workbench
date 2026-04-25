# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- **`artifacts/api-server`** — Express 5 API. Mounts `/api/library` (CRUD + stats/recent/from-url/share-links/needs-review) and `/api/storage` (presigned uploads + public-objects). The public-objects route has a local-filesystem fallback for `attached_assets/<filename>` so seeded entries can be served without re-uploading to object storage.
- **`artifacts/library`** — React + Vite "Northern Food Systems Research Library" at `/library/`. Drag-and-drop research library for Bobbie's NWO food-systems work (Deer Lake co-op store, LFIF cold-transport pilot, 807/NWO Hub). Features: SHA-256 file dedup, paste-URL ingestion (Microlink for metadata + screenshot, cheerio fallback), tokenized contributor share-links, needs-review queue, search/filter, stable per-entry URLs, public `/share/:token` upload portal.
- **`artifacts/deer-lake-store-plan`** — Slides deck for the Deer Lake store operational plan (8 slides). Includes an "Operations & Technology Partner" slide describing the $90k/mo agency engagement (cost basis + 35% reinvestment) and what stays with the band (servers, privacy phones, public price dashboard, household lookup, six-module playbook, year-end value-delivered audit).
- **`artifacts/practitioner-operating-plan`** — Hybrid app + slides deck. The front door is now a Today / Week / Year working surface (`/today`, `/week`, `/year`), and the deck (`/plan` operating + `/lifestyle` philosophy) and printable one-pager (`/onepager`) are linked from the top nav. The 2026 plan is encoded in `src/data/plan2026.ts` as four phases (Foundation, Team Assembly, Pilot Execution, Year-End Audit) and 52 weeks; the current week + next two are detailed step-by-step. Each step has optional copy-AI-prompt and copy-Replit-task-brief buttons. The Year tab houses the annual check-in (dashboard, new snapshot, history) — the same green/yellow/red plan-curve logic from the standalone `artifacts/check-in` app, ported in. **The deck is now re-spined around a deal-flow: Idea → Pitch → Contract → Fulfillment → Impact** (see `src/lib/phases.ts`). `/plan` lands at the current phase's section-opener slide, not slide 1; `/lifestyle` preserves the original 38-slide ordering as a stable Lifestyle Design Philosophy view. Five new operating-only opener slides at positions 39–43 (one per phase) are excluded from the lifestyle view. A `PhaseIndicator` in the global nav shows the active phase, lets the practitioner manually override it, and exposes a milestone checklist (pitch sent / verbal yes / contract signed / first invoice paid / first impact moment) that auto-suggests phase advancement as a soft nudge — manual override always wins. Phase override + milestones + dismissed suggestions persist in `localStorage` under `pop:v1` (schema v2). Routes: `/plan` (operating SlideViewer), `/lifestyle` (lifestyle SlideViewer), `/slide{N}` (operating-order editor), `/lifestyle/slide{N}` (lifestyle-order editor), `/allslides` (export). All user state (checked steps, week notes, snapshots, dismissed carry-overs, closed weeks, phase state, **and cost-review approvals**) lives in browser localStorage under the single key `pop:v1`; no backend, no auth. Unfinished steps from past weeks roll forward as "Carried over" on Today. **Cost review walkthrough**: ~70 dollar figures across the deck (Budget, CashFlow, Reinvestment, CaseForRate, Closing, SaltBench, SaltPL, PlatformBillPayback, PaybackMemo) are registered in `src/data/costRegistry.ts` with id/label/defaultValue/unit/context/slides[]/rank. Storage migrates v4→v5 to add `costReview: Record<id, {status, editedValue?, notes?, reviewedAt}>`. Hooks: `useCostValue(id)` returns the live value (edited override or default), plus `useCostReview(id)`, `useCostReviewActions()`, `useCostReviewSummary()`. The modal (`CostReviewModal.tsx`) walks one item at a time in importance order with Approve/Edit/Skip + private notes, plus a Summary view filterable by status. Entry button (`CostReviewButton.tsx`) appears on Today (header, primary variant) and on each cost-bearing slide (corner, slide-corner variant). Edits propagate immediately to all slides via `useCostValue`. **`/codetry` is a printable working-doc definition page** (`src/pages/Codetry.tsx`, linked from Today's Working docs) for the metaphor-as-architecture practice the constellation is built in. Its Grounding section credits the four teachers whose work shapes every design decision: **Jack Spirko (*The Survival Podcast*), Joel Salatin (*The Lunatic Farmer*), Nicole Sauce (*Living Free in Tennessee*), and the Freedom Cells movement.** These voices are to be channeled when shaping new apps, naming choices, or strategy decisions across any artifact in this constellation — solution-shaped (Spirko axiom: *"there is no shortage of problems, but when we look for solutions it all becomes a little easier"*), regen-ag/permaculture as foundation not metaphor, peer-to-peer over centralized. **Locked permaculture zones 0–5 (April 2026)**: Z0 = Saltbox (decentralized homes, homeschool day companion, local-first) + Bright Side (centralized homes, care institutions); Z1 = Headwaters/xBuckets (household budget, non-custodial; live at x-buckets-vision.replit.app) + Family Buckets (kid-allowance + courage sibling, XRPL-direct); Z2 = this site (the workbench); Z3 = Community Knowledge Hub / 807 Benefits (Dryden 807 Food Co-op members portal; live at community-knowledge-hub.replit.app); Z4 = Regen Revolution (conventional-to-regenerative track for industries); Z5 = Dam Days and Shallows (private memory holder + impromptu anonymous public-share); pre-zone = Brainstorm Library (seed bank). The locked roster is mirrored in `public/constellation.json` (served at `/practitioner-operating-plan/constellation.json`) as a machine-readable manifest other constellation agents fetch to stay aligned. Pending agent context-packs: Bright Side, CKH (cadence detail), Regen Revolution, Dam Days, Brainstorm Library. The standalone `artifacts/check-in` artifact is intentionally left running for the moment. **Slide cross-reference guardrail**: `pnpm --filter @workspace/practitioner-operating-plan run check` (or `pnpm --filter ... run check-slide-refs` directly) walks every slide under `src/pages/slides`, parses each eyebrow (`V · 03 — …`, `Part VIII · …`), and fails the build on stale cross-refs after a deck reorder — missing `(Part X · NN)` targets, missing `Part X` / `Parts X–Y` references, eyebrow numbering that doesn't match the manifest's part-contiguous order, and `(next slide)` / `(previous slide)` calls on the first/last slide. Plain `(next slide)` / `(previous slide)` hits are surfaced as a non-failing review list with the adjacent slide's title so a human can spot-check narrative breakage.
- **`artifacts/mockup-sandbox`** — Internal design canvas.

## Library schema

Drizzle tables in `lib/db/src/schema/library.ts`:
- `subjects`, `project_buckets`, `producers`, `contributors` — taxonomies
- `library_entries` (unique partial idx on `content_hash`), `entry_subjects`, `entry_buckets`
- `share_links` — tokenized contributor upload portals

## Seed

`pnpm --filter @workspace/scripts exec tsx ./src/seedLibrary.ts` — idempotent seed that catalogues all 88 files in `attached_assets/`, creates the producer/subject/bucket/contributor taxonomies, and provisions a sample share-link for Jen Springett. Producer notes:
- `Crazy Good Spices` is flagged `uncertain` (operating status unknown)
- `Shumaka Dust` substitutes for it in current planning
