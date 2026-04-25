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
- **`artifacts/practitioner-operating-plan`** — Hybrid app + slides deck. The front door is now a Today / Week / Year working surface (`/today`, `/week`, `/year`), and the deck (`/plan` operating + `/lifestyle` philosophy) and printable one-pager (`/onepager`) are linked from the top nav. The 2026 plan is encoded in `src/data/plan2026.ts` as four phases (Foundation, Team Assembly, Pilot Execution, Year-End Audit) and 52 weeks; the current week + next two are detailed step-by-step. Each step has optional copy-AI-prompt and copy-Replit-task-brief buttons. The Year tab houses the annual check-in (dashboard, new snapshot, history) — the same green/yellow/red plan-curve logic from the standalone `artifacts/check-in` app, ported in. **The deck is now re-spined around a deal-flow: Idea → Pitch → Contract → Fulfillment → Impact** (see `src/lib/phases.ts`). `/plan` lands at the current phase's section-opener slide, not slide 1; `/lifestyle` preserves the original 38-slide ordering as a stable Lifestyle Design Philosophy view. Five new operating-only opener slides at positions 39–43 (one per phase) are excluded from the lifestyle view. A `PhaseIndicator` in the global nav shows the active phase, lets the practitioner manually override it, and exposes a milestone checklist (pitch sent / verbal yes / contract signed / first invoice paid / first impact moment) that auto-suggests phase advancement as a soft nudge — manual override always wins. Phase override + milestones + dismissed suggestions persist in `localStorage` under `pop:v1` (schema v2). Routes: `/plan` (operating SlideViewer), `/lifestyle` (lifestyle SlideViewer), `/slide{N}` (operating-order editor), `/lifestyle/slide{N}` (lifestyle-order editor), `/allslides` (export). All user state (checked steps, week notes, snapshots, dismissed carry-overs, closed weeks, phase state) lives in browser localStorage under the single key `pop:v1`; no backend, no auth. Unfinished steps from past weeks roll forward as "Carried over" on Today. The standalone `artifacts/check-in` artifact is intentionally left running for the moment.
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
