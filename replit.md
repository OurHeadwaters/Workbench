# Overview

This project is a pnpm workspace monorepo using TypeScript, designed to support various applications related to the "Northern Food Systems Research Library" and operational planning for a product company. Its core purpose is to provide tools and platforms for research, knowledge sharing, and strategic planning, emphasizing decentralization, permaculture principles, and operational flexibility for Indigenous communities in Canada.

Key capabilities include:
- A React + Vite "Northern Food Systems Research Library" with drag-and-drop, URL ingestion, SHA-256 deduplication, tokenized share-links, and a needs-review queue.
- An Express 5 API for library data management and secure storage.
- A hybrid app and slide deck for practitioner operating plans, structured around a deal-flow approach (Idea → Pitch → Contract → Fulfillment → Impact) with detailed weekly steps and cost review mechanisms.
- An Expo (React Native + web) reader for the "Codetry Practitioner's Handbook," installable as a PWA, Expo Go app, or native binary, ensuring offline access.

The project aims to empower communities through accessible knowledge and self-sufficient operational models, shifting from traditional agency-based services to a product-centric approach that prioritizes local control and value delivery.

# User Preferences

I prefer iterative development with clear validation steps. If a typecheck fails on a critical package, it should block task completion. I need to be able to regenerate API hooks and Zod schemas on demand. Database schema changes should be easy to push in development. I want to ensure that specific hardcoded values for corridor keys are not accidentally reintroduced into the Deer Lake store plan. I also require a mechanism to automatically update a bundled snapshot of the constellation manifest in the Codetry Handbook whenever the canonical source changes, and for typecheck/build processes to fail if these diverge, showing an actionable diff.

**Standing instruction — relabeling money flows:** Whenever I propose to rename, recharacterize, or reframe a money flow (e.g. "call this a bonus instead of capital recovery", "treat this as a draw instead of a dividend", "reclassify this expense as a contractor payment", "move this from the business books to personal", etc.), the agent MUST proactively flag any tax, legal, banking, payroll-withholding, CRA-reasonableness, related-party-attribution, or covenant implications BEFORE implementing the change. The agent's default is to guide me toward the wisest decision, not the one that just helps me understand. If a relabel would change CRA treatment (income vs debt repayment vs gift vs dividend vs distribution), withholding obligations, deductibility, or banker-readable balance-sheet/P&L treatment, the agent must surface the dollar-cost difference and propose alternatives that preserve the visual/conceptual clarity I want without the wallet hit. This applies across all artifacts (practitioners-guide-v2, deer-lake-store-plan, codetry-handbook, headwaters-books, etc.).

**Standing instruction — codetry handbook edits are additive only:** When editing the codetry handbook (`artifacts/codetry-handbook` — `data/handbook.ts`, `data/foundingExamples.ts`, `data/constellation.ts`, the constellation manifest at `artifacts/practitioner-operating-plan/public/constellation.json`, `app/index.tsx`, and any chapter/principle/primitive copy that derives from them), the agent MUST preserve every existing idea. Format may be reworked (sentence length, voice, reading level, paragraph order within a chapter, layout, headings, typography, the visible vs. small-text split). Ideas may be ADDED. Ideas may NOT be removed, softened past recognition, collapsed into other ideas, or silently dropped — including: named primitives and principles, chapter/section titles and numbers, load-bearing nouns (codetry, Saltbox, Headwaters, Watershed, Family Buckets, Practitioner Operating Plan, Community Knowledge Hub, 807 Benefits, Regen Revolution, Dam Days, Shallows, Brainstorm Library, The Standby, The Gate, both-states, both-sides, bright side, massity, four teachers, axiom, every member of the worked-examples lineage), every kind:"examples" block (these are spec-protected), every test entry in Part VII, every footnote, every citation, every cross-reference (§X.Y), every rejected-alternative naming list (e.g. The Gate's Translator/Filter/Censor/Glossary), every rung name in any severity ladder, every sub-shelf, and every concrete example or anecdote even if it reads as "just colour." Before any handbook edit larger than a typo, the agent must (a) name what's being kept verbatim, (b) name what's being reworded vs. what's being structurally moved, (c) name any net-new ideas being introduced, and (d) confirm the diff adds-or-equals — never subtracts. If the agent is unsure whether something is an idea or just framing, treat it as an idea and preserve it. After any handbook edit, the agent must re-run the codetry-handbook test suite (which already locks structure, primitive ids, examples blocks, and the Standby titleSuffix) AND eyeball the diff for silently-dropped paragraphs, lost example clauses, or recombined sentences that swallowed a distinction.

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

- **Northern Food Systems Research Library (`artifacts/library`)**: React + Vite application featuring SHA-256 file deduplication, URL paste ingestion, tokenized contributor share-links, a needs-review queue, search/filter, and public upload portal.
- **Practitioner Operating Plan (`artifacts/practitioner-operating-plan`)**: Hybrid app + slides deck, focused on a product company model. It implements a core deal-flow (Idea → Pitch → Contract → Fulfillment → Impact), includes integrated cost review, and stores user state in `localStorage`. Features a `/codetry` page defining a "metaphor-as-architecture" practice and a `constellation.json` manifest for permaculture zones.
- **Codetry Practitioner's Handbook (`artifacts/codetry-handbook`)**: Expo (React Native + web) reader. Installable as a PWA, Expo Go app, or native binaries with offline access. Uses `AsyncStorage` for persistent state and includes a save-status pill. Part III is built from an auto-generated, bundled snapshot of the constellation manifest.
- **Deer Lake Store Plan (`artifacts/deer-lake-store-plan`)**: Slides deck for operational plan, including financial models. It sources values from `@workspace/cross-reserve-corridor` and includes a guard script to prevent hardcoded corridor keys.
- **Deer Lake Walkthrough (`artifacts/deer-lake-walkthrough`)**: React + Vite application hosting a walkthrough (`/`) and a mobile-first Phase Planner (`/planner`). The walkthrough features a continuous-scroll design with sticky header and in-page jumps. The Phase Planner is a decision tool with "grants" and "self-fund" modes, persisting state in `localStorage` and using UTC date math. It uses a tiny client-side router.
- **`artifacts/api-server`**: Express 5 API mounting `/api/library` (CRUD, stats) and `/api/storage` (presigned uploads, public-objects with local filesystem fallback).
- **Headwaters Books (`artifacts/headwaters-books`)**: React + Vite bookkeeping front-end for the Headwaters agency, gated by Clerk for the ledger surfaces. Hosts two public sibling dashboards for the constellation-wide primitives, both reading their vocabulary, severity ladder, sub-shelves, and rejected alternatives verbatim from a bundled snapshot of the constellation manifest at `src/data/constellation.ts` (regenerated by `pnpm --filter @workspace/headwaters-books run sync-constellation`, verified by `… run check-constellation`):
  - **The Standby** at `/standby` — runnable steward dashboard. Four-rung ladder (advisory/standby/active/standdown) and two sub-shelves (The Common Pantry, The Watch). Calls (open → walk the ladder → log who's on the watch → draw down standby stock → close with a debrief) persist in browser localStorage under `z3.standby.v1`.
  - **The Gate** at `/gate` — runnable bright-side ↔ massity translation surface, replacing the previously external tool at `legacy-gatekeeper.replit.app` (still linked from the page footer for historical reference). Four-rung ladder (draft/under-review/cleared/refused) and three sub-shelves (Mappings, Substitutions, Categories). Substitutions (direction, bright-side noun, massity equivalent, category, optional document/note/logged-by) persist in browser localStorage under `z3.gate.v1`. Per the Standby-leaks-into-Gate audit note (Task #473), each primitive owns its own page file; nothing is genericized across primitives.
- **Wordpile (`artifacts/wordpile`)**: React + Vite + Tailwind web tool for community word inventories. Supports free-entry, paste-to-extract, "Check my draft" view, and import/export of word piles. Implements optional cloud sync via Clerk + Postgres with a sync queue and status pill. Supports share-links (client-side fragment-only or server-stored short links). The pile editor includes a "Build" page (`/pile/:pileId/build`) — a single Stacker prototype where load-bearing words become frame studs (3 = "It stands."), interior words become trim, and avoid words crack. The Build page persists per-pile lifetime stats (`wordpile:build-stats:v1:<pileId>`), supports a sound toggle (`wordpile:build-audio-muted`), a one-time onboarding overlay (`wordpile:build-onboard:v1`), and a 1200×900 share-image PNG export. Old per-pile build votes are migrated once to `wordpile:build-vote-archive:v1`.

**Database Schema (`lib/db/src/schema/library.ts`):**
Includes tables for `subjects`, `project_buckets`, `producers`, `contributors`, `library_entries` (with unique partial index on `content_hash`), `entry_subjects`, `entry_buckets`, and `share_links`.

**Seeding:**
`pnpm --filter @workspace/scripts exec tsx ./src/seedLibrary.ts` provides an idempotent seed for development.

# External Dependencies

- **Microlink**: For URL metadata and screenshot generation in the library.
- **Cheerio**: Fallback for URL metadata parsing in the library.
- **Expo**: For cross-platform application development of the Codetry Practitioner's Handbook.
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: For database interactions.
- **Express 5**: For the API server.
- **Zod**: For schema declaration and validation.
- **Orval**: For API client code generation.
- **Clerk**: For user authentication and cloud synchronization in Wordpile.