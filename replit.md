# Overview

This project is a pnpm workspace monorepo using TypeScript, designed to support various applications related to the "Northern Food Systems Research Library" and operational planning for a product company. The overarching goal is to provide tools and platforms for research, knowledge sharing, and strategic planning, with a strong emphasis on decentralization, permaculture principles, and operational flexibility for Indigenous communities in Canada.

Key capabilities include:
- A React + Vite "Northern Food Systems Research Library" with drag-and-drop functionality, URL ingestion, SHA-256 file deduplication, tokenized share-links, and a needs-review queue.
- An Express 5 API for library data management and secure storage operations.
- A hybrid app and slide deck for practitioner operating plans, focusing on a deal-flow approach (Idea → Pitch → Contract → Fulfillment → Impact) with detailed weekly steps, cost review mechanisms, and a "Codetry" philosophy grounding.
- An Expo (React Native + web) reader for the "Codetry Practitioner's Handbook," installable as a PWA, Expo Go app, or native binary, ensuring offline access.

The project embodies a vision of empowering communities through accessible knowledge and self-sufficient operational models, moving away from traditional agency-based services towards a product-centric approach that prioritizes local control and value delivery.

# User Preferences

I prefer iterative development with clear validation steps. If a typecheck fails on a critical package, it should block task completion. I need to be able to regenerate API hooks and Zod schemas on demand. Database schema changes should be easy to push in development. I want to ensure that specific hardcoded values for corridor keys are not accidentally reintroduced into the Deer Lake store plan. I also require a mechanism to automatically update a bundled snapshot of the constellation manifest in the Codetry Handbook whenever the canonical source changes, and for typecheck/build processes to fail if these diverge, showing an actionable diff.

# System Architecture

The project is structured as a pnpm workspace monorepo utilizing Node.js 24 and TypeScript 5.9.

**Monorepo Tools & Build:**
- **Monorepo tool**: pnpm workspaces
- **Package manager**: pnpm
- **Build**: esbuild (CJS bundle)
- **Typechecking**: `pnpm run typecheck:gated` for critical paths, with `pnpm run typecheck` for the full workspace.

**API & Data Layer:**
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)

**UI/UX & Feature Specifications:**

- **Northern Food Systems Research Library (`artifacts/library`)**:
    - Built with React + Vite.
    - Features SHA-256 file deduplication, URL paste ingestion (Microlink for metadata, Cheerio for fallback), tokenized contributor share-links, a needs-review queue, search/filter, and stable per-entry URLs.
    - Public `/share/:token` upload portal.

- **Practitioner Operating Plan (`artifacts/practitioner-operating-plan`)**:
    - Hybrid app + slides deck, rebuilt as a 6-slide V3 deck focusing on a product company model (software + tech stack + training).
    - Core deal-flow: Idea → Pitch → Contract → Fulfillment → Impact.
    - Routes include `/today`, `/week`, `/year` (working surfaces), `/plan` (operating slide viewer), `/lifestyle` (lifestyle philosophy viewer), `/slide{N}` (operating editor), `/lifestyle/slide{N}` (lifestyle editor), `/allslides` (export).
    - All user state (checked steps, week notes, snapshots, cost-review approvals) stored in browser `localStorage` (`pop:v1`).
    - Integrated cost review system with `useCostValue`, `useCostReview` hooks, and a modal for approving/editing costs.
    - `/codetry` page defines the "metaphor-as-architecture" practice, crediting Jack Spirko, Joel Salatin, Nicole Sauce, and the Freedom Cells movement as foundational influences for design decisions (solution-shaped, regen-ag/permaculture, peer-to-peer).
    - Constellation definition (`public/constellation.json`) lists locked permaculture zones (0-5) and serves as a machine-readable manifest.
    - Slide cross-reference guardrail (`pnpm run check-slide-refs`) to prevent broken links after deck reorders.

- **Codetry Practitioner's Handbook (`artifacts/codetry-handbook`)**:
    - Expo (React Native + web) reader.
    - Installable as a PWA (cache-first service worker, version-keyed cache, precaching), Expo Go app, and native binaries (iOS/Android).
    - `app.config.js` uses `EXPO_PUBLIC_BASE_URL` for base path configuration across environments.
    - `AsyncStorage` namespace `codetry-handbook:v1` for persistent reader state across platforms (web maps to `localStorage`).
    - Part III of the handbook is built from an auto-generated, bundled snapshot of the constellation manifest from `practitioner-operating-plan`, with build-time validation to prevent staleness.

- **Deer Lake Store Plan (`artifacts/deer-lake-store-plan`)**:
    - Slides deck for operational plan, including financial models.
    - Sources default values for its cross-reserve corridor calculator from `@workspace/cross-reserve-corridor`.
    - A guard script `scripts/check-corridor-defaults.ts` prevents reintroduction of local numeric literals for corridor keys.

- **Deer Lake Walkthrough (`artifacts/deer-lake-walkthrough`)**:
    - React + Vite. Hosts two sibling surfaces sharing palette and shell: the **walkthrough** (council read) at `/` and the **Phase Planner** (contractor decision tool) at `/planner`.
    - Walkthrough mirrors the Practitioner's Guide v2 mobile shell pattern: full-bleed eagle prologue hoisted above the shell, then a sticky branded header (`AppShell.tsx`) over a continuous-scroll stack of nine sections (`prologue`, `what-it-is`, `why-current-fails`, `cold-chain`, `who-works`, `first-morning`, `what-stays`, `ask`, `recap`).
    - No swipe-deck, no fixed bottom chrome — anchor IDs + global `scroll-behavior: smooth` make in-page jumps (header brand → top, header chip → recap, prologue Continue → first content section) feel uniform.
    - Recap section bleeds full-width with the deep evergreen background so the contractor can screenshot it as a one-screen summary.
    - **Phase Planner (`src/planner/`)** — mobile-first decision tool. Mode-aware throughout: **grants** mode (Optimistic / Realistic / Slippage scenarios) drives 5 anchors (contract-one start, cold-chain pilot start, LFIF intake, council decision, ISC decision) and gates the funding-secured trigger on the federal stack (LFIF + FedNor + ISC). **Self-fund** mode (Self-fund scenario) drives 4 anchors (contract-one start, cold-chain pilot start, council decision, truck-LFIF intake) and gates the trigger on a council vote to spend reserve capital — the only grant in play is the Fall-2026 LFIF window for the 807-partnership ice-road truck, which gates the vehicle but not the store. The `mode` field on each scenario discriminates which set of bars, gates, pegs, off-ramp text, and key-dates rows render. Two stacked Gantt strips (Phase 1 design+pilot+application, Phase 2 build+handover), a derived "What falls out" panel, and a council-decision off-ramp callout. State (including `mode`) persisted in `localStorage` namespace `dlpp:v1` with a backwards-compat shim that infers `mode` from `scenarioId` and injects a default `truckLfifIntake` for older saves. Uses native `<input type="date">` for touch-friendly anchor editing. Pure UTC date math in `src/planner/dates.ts` keeps the timeline timezone-stable. E2e covered by `tests/deer-lake-planner/planner.spec.ts` (6 specs).
    - Tiny client-side router in `src/lib/route.ts` (custom `useRoute()` hook with `popstate` + custom event, no react-router) switches between walkthrough and planner without a full reload. `src/lib/paths.ts` centralises route constants so both shells link cleanly to each other.
    - Hosted at `/deer-lake-walkthrough/` and `/deer-lake-walkthrough/planner` because the project is at the artifact cap (9 of 7) and a fresh artifact could not be created — the planner is a sibling surface, not a separate product.

- **`artifacts/api-server`**:
    - Express 5 API mounting `/api/library` (CRUD, stats) and `/api/storage` (presigned uploads, public-objects).
    - Public-objects route includes a local-filesystem fallback for `attached_assets/<filename>`.

- **`artifacts/mockup-sandbox`**: Internal design canvas.

- **Wordpile (`artifacts/wordpile`)**:
    - Standalone React + Vite + Tailwind v4 web tool routed at `/wordpile/`, no backend, all state in `localStorage` (`wordpile:v1` for piles/words; `wordpile:draft:<pileId>` for per-pile draft text).
    - Per-community word inventory with three buckets (load-bearing / interior / avoid) plus an "unsorted" bucket; supports free-entry, paste-to-extract, in-place editing, and safer-alternative copy on avoid words.
    - "Check my draft" view tokenizes a pasted draft and inline-flags avoid words (with safer alternatives in tooltips), highlights load-bearing words used, and lists missing load-bearing words.
    - Wouter routing: `/wordpile/`, `/wordpile/pile/:id`, `/wordpile/pile/:id/check`. Visual identity matches the Codetry Handbook (cream `#f4ede0`, ink `#1f3d2e`, Lora serif, JetBrains Mono).
    - Reachable from a "COMPANION TOOLS · Wordpile" tile on the Codetry Handbook front page.
    - Note: localPort is pinned to `25433` because manually-created artifacts must reuse a port already mapped in `.replit` `[[ports]]` (cannot edit `.replit`).

**Database Schema (`lib/db/src/schema/library.ts`):**
- `subjects`, `project_buckets`, `producers`, `contributors` (taxonomies).
- `library_entries` (unique partial index on `content_hash`).
- `entry_subjects`, `entry_buckets`.
- `share_links` (tokenized contributor upload portals).

**Seeding:**
- `pnpm --filter @workspace/scripts exec tsx ./src/seedLibrary.ts` provides an idempotent seed for development, cataloging files in `attached_assets/` and provisioning sample data.

# External Dependencies

- **Microlink**: Used by the library for URL metadata and screenshot generation during ingestion.
- **Cheerio**: Used as a fallback for URL metadata parsing in the library.
- **Expo**: For building the Codetry Practitioner's Handbook as a cross-platform application (PWA, Expo Go, native iOS/Android).
- **PostgreSQL**: Primary database for the API and library data.
- **Drizzle ORM**: Object-relational mapper for database interactions.
- **Express 5**: Web application framework for the API server.
- **Zod**: Schema declaration and validation library.
- **Orval**: API client code generator from OpenAPI specifications.