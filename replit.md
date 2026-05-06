# Overview

This project is a pnpm workspace monorepo using TypeScript, designed to support various applications related to the "Northern Food Systems Research Library" and operational planning for a product company. Its core purpose is to provide tools and platforms for research, knowledge sharing, and strategic planning, emphasizing decentralization, permaculture principles, and operational flexibility for Indigenous communities in Canada. The project aims to empower communities through accessible knowledge and self-sufficient operational models, shifting from traditional agency-based services to a product-centric approach that prioritizes local control and value delivery.

Key capabilities include:
- A React + Vite "Northern Food Systems Research Library" with drag-and-drop, URL ingestion, SHA-256 deduplication, tokenized share-links, and a needs-review queue.
- An Express 5 API for library data management and secure storage.
- A hybrid app and slide deck for practitioner operating plans, structured around a deal-flow approach (Idea → Pitch → Contract → Fulfillment → Impact) with detailed weekly steps and cost review mechanisms.
- An Expo (React Native + web) reader for the "Codetry Practitioner's Handbook," installable as a PWA, Expo Go app, or native binary, ensuring offline access.

# Business Strategy (standing reminder)

**Target markets:** Aboriginal organizations (band councils, First Nations EDCs, health authorities, friendship centres, Métis orgs) and co-ops. Both segments are underserved, access government funding streams, and make collective decisions — the bounded-scope trial model fits both perfectly. The niche is specific enough to raise rates as the track record builds.

**Three revenue layers:**
1. **Consulting at $175/hr** (primary, now) — bounded scope, trial-period-first, relationship-driven, fits life in Dryden with family. This is the core.
2. **807 Benefits partnership** (passive, now) — 20% of non-food platform revenue, referral code system. For locals: point them to 807 membership, don't sell tools direct.
3. **Co-op platform white-label** (B2B, future) — scope it as a consulting engagement when a real co-op buyer appears. Separate Replit project ("the Workbench") when cash flow allows and a buyer is in front of you, not speculatively.

**Explicitly not the model:** Consumer SaaS subscriptions for non-locals — requires marketing volume, churn management, and a sales motion that competes with family time and relationship strengths. Skip until there's hired help for that motion specifically.

**Agent reminders:** When scoping new features, ask which layer it serves. When copy mentions "subscribers," "free trial funnels," or "self-serve," check against `.local/docs/headwaters-business-strategy.md`. When pricing appears anywhere, ensure it does not undercut the 807 membership value. The co-op platform separation is a "real buyer present" decision — do not propose it proactively. Full strategy doc: `.local/docs/headwaters-business-strategy.md`.

# User Preferences

I prefer iterative development with clear validation steps. If a typecheck fails on a critical package, it should block task completion. I need to be able to regenerate API hooks and Zod schemas on demand. Database schema changes should be easy to push in development. I want to ensure that specific hardcoded values for corridor keys are not accidentally reintroduced into the Deer Lake store plan. I also require a mechanism to automatically update a bundled snapshot of the constellation manifest in the Codetry Handbook whenever the canonical source changes, and for typecheck/build processes to fail if these diverge, showing an actionable diff.

**Constellation sync (Task #762):** `artifacts/codetry-handbook/data/constellation.json` is the single source of truth. After editing it, run `pnpm --filter @workspace/codetry-handbook run sync-constellation` — this regenerates both `artifacts/codetry-handbook/data/constellation.ts` (TypeScript snapshot) AND `artifacts/practitioner-operating-plan/public/constellation.json` (JSON mirror). Never edit the mirror by hand. The `--check` flag (`pnpm --filter @workspace/codetry-handbook run check-constellation`) verifies both outputs are in sync and exits non-zero if either has drifted.

**Standing instruction — relabeling money flows:** Whenever I propose to rename, recharacterize, or reframe a money flow (e.g. "call this a bonus instead of capital recovery", "treat this as a draw instead of a dividend", "reclassify this expense as a contractor payment", "move this from the business books to personal", etc.), the agent MUST proactively flag any tax, legal, banking, payroll-withholding, CRA-reasonableness, related-party-attribution, or covenant implications BEFORE implementing the change. The agent's default is to guide me toward the wisest decision, not the one that just helps me understand. If a relabel would change CRA treatment (income vs debt repayment vs gift vs dividend vs distribution), withholding obligations, deductibility, or banker-readable balance-sheet/P&L treatment, the agent must surface the dollar-cost difference and propose alternatives that preserve the visual/conceptual clarity I want without the wallet hit. This applies across all artifacts (practitioners-guide-v2, codetry-handbook, headwaters-books, etc.).

**Standing instruction — the third-actor frame (codetry's allocator stance):** Codetry's allocator stance is not founder-as-rent-compounder, and not committee-as-redistributor. The practitioner is the third actor: takes personal risk, runs a P&L, reads the local information, and is paid to write the method down so the community can run the work without them. The exit is handover, not compound. Profit is a signal, but the signal must be readable at the kitchen table — the cost stack, the markup, the truck cost on a page the household sees — not just at the cap table. When framing money flows, capital allocation, succession language, exit conditions, or who-owns-what across artifacts, the agent must default to this stance. See codetry handbook §2.5 *Different from capital allocation at scale* for the doctrine and `artifacts/library/docs/sources/musk-resource-allocation.md` for the source it argues against.

**Standing instruction — codetry handbook edits are additive only:** When editing the codetry handbook (`artifacts/codetry-handbook` — `data/handbook.ts`, `data/foundingExamples.ts`, `data/constellation.ts`, the canonical constellation manifest at `artifacts/codetry-handbook/data/constellation.json`, `app/index.tsx`, and any chapter/principle/primitive copy that derives from them), the agent MUST preserve every existing idea. Format may be reworked (sentence length, voice, reading level, paragraph order within a chapter, layout, headings, typography, the visible vs. small-text split). Ideas may be ADDED. Ideas may NOT be removed, softened past recognition, collapsed into other ideas, or silently dropped — including: named primitives and principles, chapter/section titles and numbers, load-bearing nouns (codetry, Saltbox, Headwaters, Watershed, Family Buckets, Practitioner Operating Plan, Community Knowledge Hub, 807 Benefits, Regen Revolution, Dam Days, Shallows, Brainstorm Library, The Standby, The Gate, both-states, both-sides, bright side, massity, four teachers, axiom, every member of the worked-examples lineage), every kind:"examples" block (these are spec-protected), every test entry in Part VII, every footnote, every citation, every cross-reference (§X.Y), every rejected-alternative naming list (e.g. The Gate's Translator/Filter/Censor/Glossary), every rung name in any severity ladder, every sub-shelf, and every concrete example or anecdote even if it reads as "just colour." Before any handbook edit larger than a typo, the agent must (a) name what's being kept verbatim, (b) name what's being reworded vs. what's being structurally moved, (c) name any net-new ideas being introduced, and (d) confirm the diff adds-or-equals — never subtracts. If the agent is unsure whether something is an idea or just framing, treat it as an idea and preserve it. After any handbook edit, the agent must re-run the codetry-handbook test suite (which already locks structure, primitive ids, examples blocks, and the Standby titleSuffix) AND eyeball the diff for silently-dropped paragraphs, lost example clauses, or recombined sentences that swallowed a distinction.

# System Architecture

The project is structured as a pnpm workspace monorepo using Node.js 24 and TypeScript 5.9.

**Monorepo Tools & Build:**
- Monorepo tool: pnpm workspaces
- Package manager: pnpm
- Build: esbuild (CJS bundle)
- Typechecking: `pnpm run typecheck:gated` for critical paths, with `pnpm run typecheck` for the full workspace.

**API & Data Layer:**
- API framework: Express 5
- Database: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)

**UI/UX & Feature Specifications:**

- **Northern Food Systems Research Library (`artifacts/library`)**: React + Vite application featuring SHA-256 file deduplication, URL paste ingestion, tokenized contributor share-links, a needs-review queue, search/filter, and public upload portal.
- **Practitioner Operating Plan (`artifacts/practitioner-operating-plan`)**: Hybrid app + slides deck, focused on a product company model with a core deal-flow (Idea → Pitch → Contract → Fulfillment → Impact). Includes integrated cost review and a `/codetry` page defining a "metaphor-as-architecture" practice.
- **Codetry Practitioner's Handbook (`artifacts/codetry-handbook`)**: Expo (React Native + web) reader, installable as PWA, Expo Go app, or native binaries with offline access. Includes the **Pioneer Path** companion, an audio-narrated, action-gated mobile pilgrimage with five stations (The Saltbox, Both-States, Both-Sides, The Standby, The Gate). **Task #201 done**: `HandbookContentContext` (at `contexts/HandbookContentContext.tsx`) fetches live content from `api-server/api/handbook/*` on mount, with stale-while-revalidate via AsyncStorage. All chapter, part, pioneer-station, and standby screens use `useHandbookContent()` — editing chapter text in the API JSON files is live without rebuilding the app. **Task #655 done**: **Word Walk** companion tool added (`app/word-walk/index.tsx` hub + `app/word-walk/card.tsx` card screen, `hooks/useWordWalk.ts`). Surfaces 5 rename-map rows per day as full-screen colour-coded cards (G=amber/U=indigo/D=rose/A=teal); founder taps Approve/Defer/Reject and the decision writes back to `rename-map.md` via `POST /api-server/api/word-walk/decide`. Decisions are persisted to AsyncStorage and reflected on next open without a rebuild.
- **Deer Lake Walkthrough (`artifacts/deer-lake-walkthrough`)**: React + Vite application hosting a walkthrough (`/`), a mobile-first Phase Planner (`/planner`), an Operator-Couple Store Cockpit mockup (`/cockpit`), and a Sustainability & Succession Playbook (`/sustainability`). Features continuous-scroll design, decision tools, and phone-first layouts with specific font and color palettes.
- **`artifacts/api-server`**: Express 5 API mounting `/api/library` (CRUD, stats), `/api/storage` (presigned uploads, public-objects with local filesystem fallback), `/api/handbook` (4 GET routes serving handbook content JSON — `/chapters`, `/pioneer-path`, `/standby`, `/founding-examples`), and `/api/word-walk` (2 routes: `GET /words` returns all rename-map rows with statuses; `POST /decide` accepts `{rowId, verdict}` and writes the decision back to `rename-map.md`). The word-walk parser lives at `artifacts/api-server/src/lib/renameMap.ts` — it reads and writes `artifacts/practitioners-guide-v2/docs/rename-map.md` directly, making the markdown file the single source of truth. JSON files live at `artifacts/api-server/src/data/handbook/` and are served with `Cache-Control: public, max-age=300, stale-while-revalidate=86400`. To update chapter content without rebuilding the app, edit those JSON files directly. To regenerate them from the TypeScript source: `pnpm --filter @workspace/codetry-handbook run export-content`.
- **Headwaters Books (`artifacts/headwaters-books`)**: React + Vite bookkeeping front-end, gated by Clerk. Hosts two public sibling dashboards, **The Standby** (`/standby`) and **The Gate** (`/gate`), both reading vocabulary from the bundled constellation snapshot. This is an internal agency tool — not a client-facing product.
- **Codetry Ship (`artifacts/codetry-ship`)**: React + Vite bio/crew site. Key pages: `/bio` (Bobbie Parr bio, rate card, skills, selected work, contact), `/sow` (Deer Lake First Nation hourly statement of work — $80/hr, printable PDF), `/bright-side` (Bright Side residential-care staff tool intro page for lead outreach — earns a meeting, not a demo), `/manifest` (crew manifest), `/sign-on`.
- **Database Schema (`lib/db/src/schema/library.ts`):** Includes tables for `subjects`, `project_buckets`, `producers`, `contributors`, `library_entries` (with unique partial index on `content_hash`), `entry_subjects`, `entry_buckets`, and `share_links`.
- **Seeding:** `pnpm --filter @workspace/scripts exec tsx ./src/seedLibrary.ts` provides an idempotent seed for development.

# External Dependencies

- **Microlink**: For URL metadata and screenshot generation in the library.
- **Cheerio**: Fallback for URL metadata parsing in the library.
- **Expo**: For cross-platform application development.
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: For database interactions.
- **Express 5**: For the API server.
- **Zod**: For schema declaration and validation.
- **Orval**: For API client code generation.
- **Clerk**: For user authentication.