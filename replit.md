# Overview

This project is a pnpm workspace monorepo using TypeScript, designed to support various applications related to the "Northern Food Systems Research Library" and operational planning for a product company. Its core purpose is to provide tools and platforms for research, knowledge sharing, and strategic planning, emphasizing decentralization, permaculture principles, and operational flexibility for Indigenous communities in Canada. The project aims to empower communities through accessible knowledge and self-sufficient operational models, shifting from traditional agency-based services to a product-centric approach that prioritizes local control and value delivery.

Key capabilities include:
- A React + Vite "Northern Food Systems Research Library" with drag-and-drop, URL ingestion, SHA-256 deduplication, tokenized share-links, and a needs-review queue.
- An Express 5 API for library data management and secure storage.
- A hybrid app and slide deck for practitioner operating plans, structured around a deal-flow approach (Idea → Pitch → Contract → Fulfillment → Impact) with detailed weekly steps and cost review mechanisms.
- An Expo (React Native + web) reader for the "Codetry Practitioner's Handbook," installable as a PWA, Expo Go app, or native binary, ensuring offline access.

# Constellation Context (standing instruction)

**Every agent reads `.local/constellation-map.md` before scoping or starting any task.** Before writing a plan, name which constellation(s) the task belongs to. If the task crosses two constellations, name both and note the seam. If a task doesn't belong to any named constellation, flag it to the founder before proceeding.

The constellation map is the connective layer: it tells you why the work matters, which revenue layer it serves, what other work it connects to, and which standing instructions protect it. Executing without reading it produces isolated tasks instead of compounding ones.

Cross-project context from SALT BOX can be pulled into the map using the prompt at `.local/docs/saltbox-sync-prompt.md`. Sync is manual (copy-paste); automated sync is out of scope.

**Standing update rule — keep the map current:** Whenever a new task is added to the backlog, the planning agent must (1) add the task title to the relevant constellation's "Active / recent tasks" list in `.local/constellation-map.md`, and (2) bump the `_Last updated_` date at the top of that file. This is a one-line diff — low friction by design. Do not rewrite the whole map; only touch the entry that changed.

**At the start of every planning session, check `CAPTURE.md` for unfiled entries.** An unfiled entry is any block under `## Entries` that does not yet have a task number in square brackets next to its heading. For each unfiled entry, convert it using this sequence:
1. Read the raw thought and identify which constellation it belongs to (or flag "Unsure" to the founder).
2. Open `.local/constellation-map.md` to confirm the constellation and surface related tasks and artifacts.
3. Scope it into a properly-formed task: write a one-sentence objective, a "Done looks like" list, ordered steps, relevant files, and which revenue layer it serves.
4. Check the existing task backlog for overlaps or dependencies — merge or link rather than duplicate.
5. Propose the scoped task to the founder before adding it to the queue. Do not self-approve.
6. Once the founder approves, note the assigned task number in square brackets next to the entry heading in `CAPTURE.md` (e.g. `## My thought [#1042]`). Do not delete the entry.

Entries with a task number are already filed — skip them.

# Business Strategy (standing reminder)

**Target markets:** Aboriginal organizations (band councils, First Nations EDCs, health authorities, friendship centres, Métis orgs) and co-ops. Both segments are underserved, access government funding streams, and make collective decisions — the bounded-scope trial model fits both perfectly. The niche is specific enough to raise rates as the track record builds.

**Three revenue layers:**
1. **Consulting at $175/hr** (primary, now) — bounded scope, trial-period-first, relationship-driven, fits life in Dryden with family. This is the core.
2. **807 Benefits partnership** (passive, now) — 20% of non-food platform revenue, referral code system. For locals: point them to 807 membership, don't sell tools direct.
3. **Co-op platform white-label** (B2B, future) — scope it as a consulting engagement when a real co-op buyer appears. Separate Replit project ("the Workbench") when cash flow allows and a buyer is in front of you, not speculatively.

**Explicitly not the model:** Consumer SaaS subscriptions for non-locals — requires marketing volume, churn management, and a sales motion that competes with family time and relationship strengths. Skip until there's hired help for that motion specifically.

**Agent reminders:** When scoping new features, ask which layer it serves. When copy mentions "subscribers," "free trial funnels," or "self-serve," check against `.local/docs/headwaters-business-strategy.md`. When pricing appears anywhere, ensure it does not undercut the 807 membership value. The co-op platform separation is a "real buyer present" decision — do not propose it proactively. Full strategy doc: `.local/docs/headwaters-business-strategy.md`.

# User Preferences

**Direct links in chat:** Whenever a new page, tool, or file is deployed and accessible via URL, always post the full direct link in the chat so it can be tapped immediately on a phone. Do not describe where to navigate — just give the link.

**Photography — standing rule:** All photos used across every artifact must come from the founder's own library. No stock photos, no AI-generated images used as photos. Nature and outdoor activity photos are fair game to use freely. Any photo that includes a recognizable face must be checked with the user before use. The founder will add photos to the project as they go; use what's available and ask when something specific is needed.

**Design — section headings:** Always use bold filled bars for section headings, never subtle small-caps or muted text labels. The pattern: solid background color (EVERGREEN, RUST, or BLUE depending on context), rounded corners (3px), padding ~0.045in vertical / 0.12–0.14in horizontal, `display: inline-block`, uppercase text at 0.62–0.72rem, fontWeight 800, cream/white color, letterSpacing 0.13em. Think store aisle signs — readable at a glance, not a footnote.

I prefer iterative development with clear validation steps. If a typecheck fails on a critical package, it should block task completion. I need to be able to regenerate API hooks and Zod schemas on demand. Database schema changes should be easy to push in development. I want to ensure that specific hardcoded values for corridor keys are not accidentally reintroduced into the Deer Lake store plan. I also require a mechanism to automatically update a bundled snapshot of the constellation manifest in the Codetry Handbook whenever the canonical source changes, and for typecheck/build processes to fail if these diverge, showing an actionable diff.

**Constellation sync (Task #762):** `artifacts/codetry-handbook/data/constellation.json` is the single source of truth. After editing it, run `pnpm --filter @workspace/codetry-handbook run sync-constellation` — this regenerates both `artifacts/codetry-handbook/data/constellation.ts` (TypeScript snapshot) AND `artifacts/practitioner-operating-plan/public/constellation.json` (JSON mirror). Never edit the mirror by hand. The `--check` flag (`pnpm --filter @workspace/codetry-handbook run check-constellation`) verifies both outputs are in sync and exits non-zero if either has drifted.

**Standing instruction — relabeling money flows:** Whenever I propose to rename, recharacterize, or reframe a money flow (e.g. "call this a bonus instead of capital recovery", "treat this as a draw instead of a dividend", "reclassify this expense as a contractor payment", "move this from the business books to personal", etc.), the agent MUST proactively flag any tax, legal, banking, payroll-withholding, CRA-reasonableness, related-party-attribution, or covenant implications BEFORE implementing the change. The agent's default is to guide me toward the wisest decision, not the one that just helps me understand. If a relabel would change CRA treatment (income vs debt repayment vs gift vs dividend vs distribution), withholding obligations, deductibility, or banker-readable balance-sheet/P&L treatment, the agent must surface the dollar-cost difference and propose alternatives that preserve the visual/conceptual clarity I want without the wallet hit. This applies across all artifacts (practitioners-guide-v2, codetry-handbook, headwaters-books, etc.).

**Codetry canonical framework concepts — Founding mode and Reclamation mode:**
- **Founding mode** — building from personal sovereignty with Codetry from the first pour. Hempcrete from day one. Generationally durable. The house gets stronger while you live in it. The toolkit is additive from scratch.
- **Reclamation mode** — board-by-board sovereignty recovery within a house someone else built. Cannot demolish while people are living inside. Each replaced board must carry the weight of the ones around it while the old ones come out. The goal is a house that is yours; the path is repair, not demolition.
- The mistake is handing a founding-mode toolkit to someone in reclamation mode, or vice versa. Read the site before you mix.

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
- **North Star (`artifacts/north-star`)**: The unified single front door. Absorbs the Practitioner Operating Plan and Practitioners Guide V2 into one artifact. Five nav tabs: Today (daily picks, live money strip, triage, log) | Cockpit (all ops tools — client roster, debrief, year plan, money, hiring, Deer Lake docs, constellation session) | Model (V7 financial scenarios, Phase 1/2 math, kit pricing, runway — benefit-first framing) | Zones (constellation manager) | More (Guide, Reviews, Kitchen Table, Window, Settings). The /window route is the controlled Eave Flow leak — Z3 (Greenhouse)-only public portal. Eave Rule and Zone model are load-bearing and untouched. The LiveMoneyStrip on the Today page shows Deer Lake countdown (days to June 15), phase badge, and draw progress without opening any other tool. Kitchen Table is the decision engine (/council). The Operating Plan and Guide V2 artifacts remain live but their work has been absorbed — they are candidates for retirement.
- **Practitioner Operating Plan (`artifacts/practitioner-operating-plan`)**: Hybrid app + slides deck. Work absorbed into North Star (Cockpit tab). Candidate for retirement after Bobbie confirms she no longer needs it as a standalone.
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

# Public Folder Audit Log

**Task #1137 — May 2026:** All `public/` folders across artifacts were audited for orphaned image assets. Files were cross-referenced against source code (`src/`) and `index.html` references. The following stale files were removed:

- `artifacts/codetry-ship/public/`: `eagle-circle.png`, `eagle-circle-transparent.png`, `eagle-halo.png`, `headwaters-logo-preview.png`, `headwaters-logo.svg`, `og-image.jpeg`, `opengraph.jpg`, `bobbie-store.jpeg`, `thumb-books.jpg`, `thumb-brightside.png`, `thumb-damdays.png`, `thumb-finance.png`, `thumb-grants.png`, `thumb-store.png` (14 files)
- `artifacts/print-marketing/public/`: `gilles-brand.jpeg` (1 file)

Artifacts with clean public folders (nothing removed): `practitioners-guide-v2`, `headwaters-books`, `library`, `codetry-handbook`, `print-marketing` (minus the one above).
# "Put it on the kitchen table" — protocol (standing instruction)

When the user says **"put it on the kitchen table"** (or close variants — "add to the kitchen table", "drop it on the table", "kitchen-table this"), do this, in order:

1. Identify the **source artifact** — the artifact the user is currently working in (e.g. `artifacts/north-star`, `artifacts/library`, `artifacts/codetry-ship`). This becomes the `source` tag.
2. Use the shared helper from `@workspace/kitchen-table-client` — never hand-roll a POST to `/api/tasks`. **The helper auto-derives `source` from `import.meta.env.BASE_URL`** (every web artifact mounts at `/<slug>/`, so `source` becomes `artifacts/<slug>` automatically). You only pass `source` explicitly in non-Vite contexts (Expo / React Native, scripts) or to override:

   ```ts
   import { putOnKitchenTable } from "@workspace/kitchen-table-client";
   // Auto-derived source — works in any web artifact:
   await putOnKitchenTable({
     title: "<one-line statement of what to discuss>",
     sourceRef: "<page path or doc id, optional>",
   });
   // Expo / scripts — pass explicitly:
   await putOnKitchenTable({ title: "…", source: "artifacts/codetry-handbook" });
   ```

   React: `import { KitchenTableButton, useKitchenTable } from "@workspace/kitchen-table-client/react";` — `<KitchenTableButton />` is mounted in every web artifact's `App.tsx` and needs no props.
3. **Auth posture** (already enforced server-side, don't bypass): the drop is open (`POST /api/tasks` requires no token). Decision-cap routes (`PATCH /api/deadhead/intake/:id`, intake list) stay gated by `x-library-owner-token`. The helper does not set it.
4. Existing rows pre-dating this protocol carry `source = 'unknown'` — that is the expected backfill value, not a bug.

The point: when Bobbie convenes the AI council in the north-star KitchenTablePage, items are grouped artifact-by-artifact, so the round-table can move through one artifact's questions at a time instead of a flat blob. Per-artifact `AGENTS.md` files repeat the locally relevant `source` value so agents working inside a single artifact don't need to re-derive it.

## Headwaters Kits — Naming Decisions

Decided at the Kitchen Table, May 25 2026.

- **Collective name: Headwaters Kits** (not "Watershed Kits" — Headwaters is the brand).
- **Load-bearing word: Kit** (not Bundle/Package — "Kit" keeps the maker/owner register).
- **Rule: single word + one modifier maximum.** No stacked descriptors.
- **"Economy Kit"** is the public name for what was previously "Community Money Machine Kit" (two bounded things in one name fails the Saltbox test).
- The Arc steward registration note appears in Economy Kit and Community Economy Kit delivery emails. It is a plain text instruction pointing buyers to self-register at ourheadwaters.ca/arc — no integration, no auto-link.

Full kit list (canonical IDs in `artifacts/api-server/src/lib/kitsRegistry.ts`):

| ID | Public name |
|---|---|
| economy-kit | Economy Kit |
| family-kit | Family Kit |
| homeschool-kit | Homeschool Kit |
| community-economy-kit | Community Economy Kit |
| engagement-kit | Engagement Kit |
| practitioner-kit | Practitioner Kit |
| standby-kit | Standby Kit |
| field-guide-finance-kit | Field Guide Finance Kit |
| pioneer-path-kit | Pioneer Path Kit |
| handbook-kit | Handbook Kit |

---

## Buy-a-Kit Loop Closure

Implemented May 25 2026. Closes Decision 3 (Arc stays sovereign) + Decision 4 (TSP sells, zone apps deliver).

**How it works:**
1. TSP fires `POST /api/kits/purchase-webhook` with `{ kit_id, buyer_email, buyer_name, purchase_id }` + `X-Webhook-Secret` header.
2. api-server generates a 30-day access token, persists it to `data/kit-tokens.json`, sends the delivery email via google-mail.
3. Buyer receives a plain-text email with their access URL (`GET /api/kits/access/:token`).
4. For Economy Kit and Community Economy Kit, the email includes a plain-text Arc self-registration note — no webhook, no integration.

**Key files:**
- `artifacts/api-server/src/lib/kitsRegistry.ts` — kit definitions + naming decisions
- `artifacts/api-server/src/lib/kitsMailer.ts` — delivery email via google-mail connector
- `artifacts/api-server/src/routes/kits.ts` — three endpoints (purchase-webhook, access/:token, registry)

**Required env var:** `KIT_WEBHOOK_SECRET` — shared secret between TSP and this server. Set it and give TSP the same value. Without it, the webhook endpoint returns 401.

**Optional env var:** `API_BASE_URL` — base URL for the access link in the delivery email (e.g. `https://api.ourheadwaters.ca`). Falls back to `REPLIT_DEV_DOMAIN`.

**TSP integration checklist** (what TSP needs to do):
- After a confirmed Stripe/Zaprite payment, POST to `/api/kits/purchase-webhook`
- Set `X-Webhook-Secret: <KIT_WEBHOOK_SECRET>` header
- Map Stripe product IDs → `kit_id` slugs (e.g. `price_xxx` → `economy-kit`)
- On `201` response, record `token` + `access_url` in `kit_purchases` table

---

## Strategic Decisions

Documented May 25, 2026. Decided by Bobbie Parr at the Kitchen Table with full seat deliberation.

### Decision 1 — Official Headwaters front door
**Answer: C — ourheadwaters.ca is the branded front door, landing on Clearing (Zone 4).**

Single URL you give a stranger. The domain is owned outright — no leased sovereignty, no platform subfolder dependency. Clearing already carries the weight of the origin story; the domain makes that entry point findable and claimable. The Shore becomes a deeper practitioner resource.

Table was unanimous on C. Sealing reason from Smith: "only an owned domain keeps us from becoming tenants on the very machine we claim to build."

*Follow-up: configure ourheadwaters.ca redirect → the Clearing artifact.*

---

### Decision 2 — One canonical Kitchen or two
**Answer: C — both Kitchens serve genuinely distinct audiences. Document the distinction.**

salt-box Kitchen = family's day-to-day hub, tightly coupled to Hearth (same repo, same DB).
creative-hub Kitchen = richer feature set, Cast Iron Rack launcher, Shelf/Cupboard, constellation map.

These are not duplicates — they are different rings of the zone model. Document the distinction so future agents don't re-litigate it.

*Follow-up: write a short AGENTS.md note in each Kitchen artifact naming the audience and what makes it distinct.*

---

### Decision 3 — Should The Arc connect to the main watershed
**Answer: A — Stay fully sovereign. No integration.**

The Arc keeps its own auth, its own DB, and its one-way outbound stance. Stewards self-register. Machines are self-reported. No kit purchase signals are wired in. No machine health is exposed elsewhere.

The table split 3–3 (Saltbox/Smith/Codetry → A; Systems/Community/Ishmael → C). Bobbie broke the tie: A.

The sealing principle: a one-way webhook is still a seam. Seams widen. The Watershed Compact prohibits leased sovereignty — and sovereignty is the anvil, not a feature to be traded for a closed loop. The buy-a-kit loop will be closed another way, without touching The Arc's boundary.

*Follow-up: identify how the buy-a-kit loop closes without an Arc integration (e.g. welcome email sequence, manual steward onboarding, or a separate lightweight tracker).*

---

### Decision 4 — Where does kit sales and delivery live
**Answer: C — TSP sells, zone apps deliver.**

TSP (xrpl-design-hub.replit.app) already has Stripe + Zaprite rails and the kit_purchases table. Zone apps already have the content. The missing piece is a post-purchase routing signal from TSP to the relevant zone app. No duplication of infrastructure required.

*Follow-up: design the post-purchase webhook payload and routing logic from TSP → zone content apps.*
