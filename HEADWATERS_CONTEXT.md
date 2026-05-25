# Headwaters / Codetry — Project Context File
Last updated: 2026-05-24

---

## What this project is

A pnpm monorepo containing the full digital infrastructure for Bobbie Parr's Headwaters practice (Wabigoon, Northwestern Ontario): a public website, a mobile field journal, a financial learning hub, a research library, an operator cockpit, a bookkeeping tool, a print marketing suite, and a shared API server — all organized around the same permaculture zone logic and economic model.

---

## Repository structure

```
artifacts/          One directory per deployable artifact
lib/                Shared libraries used across artifacts
scripts/            Build and sync scripts (including handbook sync)
pnpm-workspace.yaml Workspace manifest
```

Package manager: pnpm only. Never use npm or yarn.
Run a single artifact: `pnpm --filter @workspace/<artifact-name> run dev`
Run all tests: the "test" workflow in Replit.

---

## Artifacts

### codetry-ship — Public site (ourheadwaters.ca)
Directory: artifacts/codetry-ship
Path prefix: /
Framework: React + Vite + Wouter

Routes:
- /                 The Shore. Public landing page. Hero with water-cycle circuit, glassmorphic service panel, intake form, practitioner bio, footer watershed statement.
- /odyssey          Timeline of the Headwaters journey and the arc of Bobbie's work.
- /story            Immersive narrative of the project's origin.
- /what-is-codetry  Explainer for the Codetry methodology.
- /the-work         Portfolio of past and current projects.
- /the-window       Case studies.
- /economy          Economic model overview.
- /economy/wallet   Digital credit / asset management interface.
- /map              Zone map. Permaculture Z0-Z5 watershed layout with concentric-ring SVG diagram (WatershedMap component), zone quiz, zone cards with terrain taglines, "How the Watershed Works" section.
- /compass          Orientation tool connecting zone identity to practical action. Shows Z0-Z5 terrain taglines. "The Compass and the Map read the same ground."
- /bright-side      Bright-side naming tracker. Translates gatekeeping language into honest systems language.
- /manifest         Crew manifest: active contributors and their commitments.
- /sow              Statement of Work and service agreement templates.
- /sign-on          Onboarding flow for new contributors.
- /listen           Listen page (audio / storytelling).

Canonical data: `src/data/zones.ts` — the single source of truth for all zone definitions (Z0-Z5). See shared data section.

---

### codetry-handbook — Mobile field journal
Directory: artifacts/codetry-handbook
Framework: Expo Router / React Native
Dev URL: separate Expo domain ($REPLIT_EXPO_DEV_DOMAIN) — not proxied through the shared path router.

Screens:
- /                 Front page. Hero ("Headwaters / How a Community Runs Its Own Economy" + Codetry one-liner). Start/continue reading CTA, returning reader dashboard with daily prompt, practice tools, and book navigation.
- /contents         Full table of contents.
- /chapter/[id]     Chapter reader (93 chapters total, sourced from handbook.ts).
- /part/[roman]     Part-level landing page.
- /bookmarks        Saved chapters.
- /path             Pioneer Path: 20 structured learning stations with progress tracking.
- /path/station/[id] Individual Pioneer Path station.
- /path/journal     Pioneer Path reflection journal.
- /daily-prompt     One question drawn from the reader's constellation, rotated daily.
- /stack/[id]       Practice cards (Word Pile flashcard-style review).
- /rename-test      Load-bearing vs. decorative naming tester.
- /gate-log         Bright-side names with systems-language translations.
- /constellation-builder Name your six zones in your own vocabulary.
- /author/[zone]    Author's desk: write your constellation in your own words.
- /glossary         Searchable formally defined terms.
- /night-sky        Visual overview of interconnected concept constellations.
- /shared-vision/[id] Collaborative metaphor alignment tool.
- /driver/[id]      Driver (motivational force) profiles.
- /standby          Seasonal transition and operational readiness tracker.
- /print/[id]       Print-format output for specific content.
- /tales (via router) Children's Tales section (TALES data array in data/tales.ts).
- /story-path       Youth Odyssey narrative learning trail.

Canonical data: `data/handbook.ts` — the single source of truth for all chapters and pioneer stations. The API server syncs this to JSON at build time. Do not edit the JSON files directly.

---

### field-guide-finance — Headwaters Learning
Directory: artifacts/field-guide-finance
Path prefix: /headwaters-learning/
Framework: React + Vite + Wouter

Routes:
- /                 Hub page. "Zone 1 / The Spring / Daily Tools" eyebrow + Permaculture tag. Two course cards with practical takeaway callouts. "Practical on mobile?" tester prompt.
- /finance          Field Guide Finance course: plain-language financial guidance for NWO food entrepreneurs.
- /finance/lesson/[id] Individual lesson reader.
- /forge            The Forge / Crypto Castle: blockchain architecture as preparedness, organized by five elemental primitives.
- /forge/modules    Module list. Five modules (Fire, Water, Earth, Air, Aether). Each row has Start/Review button and "Take it outside" secondary CTA pointing to /forge/build.
- /forge/module/[id] Individual module lesson content.
- /forge/build      Free-build area in The Forge.
- /forge/battle     The Reckoning (battle feed / assessment).
- /forge/blueprints Blueprint library.
- /forge/great-hall Social hub for Forge participants.
- /forge/shallows   Reflection and integration space.
- /forge/progress   Learner progress tracker.

---

### library — Northern Food Systems Research Library
Directory: artifacts/library
Path prefix: /library/
Framework: React + Vite + Wouter + Tailwind

Routes:
- /login            Public landing. "Knowledge rises cold and clean here." tagline. Public vs. owner section breakdown. Sign-in overlay. "Why Stores Fail" spotlight with public share link. Contributor share link explanation.
- /                 Authenticated home.
- /entries          All research entries tagged by subject, producer, and project bucket.
- /entries/[id]     Individual entry detail.
- /entries/new      Submit a new entry.
- /producers        Directory of organizations and researchers.
- /producers/[slug] Individual producer profile.
- /subjects         Subject tag browser (food sovereignty, supply chain, infrastructure, governance, etc.).
- /buckets          Research grouped by active project workstream.
- /share-links      Generate and manage contributor read-only share links.
- /share/[token]    Public share link landing page.
- /share/why-stores-fail Public share for the Why Stores Fail synthesis.
- /why-stores-fail  Full interactive synthesis (authenticated): named catalog of every failure mode in the northern-store model.
- /needs-review     Moderation queue for pending entries.
- /contributors     Contributor directory.
- /phenomena        Cross-industry structural findings tracker.
- /reverse-test     Reverse Test tool for validating library claims.
- /team             Curator management.
- /confidential/queue Confidential intake queue.
- /nursery          Nursery: idea incubator for early-stage community concepts.
- /nursery/onboarding Nursery participant onboarding.
- /nursery/garden   Garden floor: active nursery ideas.
- /nursery/ideas/[id] Individual idea brief.
- /privacy          Privacy policy.

Auth model: Owner access via email/password or passphrase (POST /api/library/owner/login, returns a token stored in localStorage). Contributor share links give read-only access without sign-in. There is no public authenticated user tier.

---

### north-star — Tester Portal / Operator Cockpit
Directory: artifacts/north-star
Path prefix: /north-star/
Port: 9000 (explicit, set in workflow command)
Framework: React + Vite + Wouter

Routes:
- /                 Redirects to /today.
- /onboarding       Setup wizard for new operators (configures zones, statement, profile).
- /today            Daily dashboard: morning triage, today's tasks, River Smith status.
- /zones            Zone management. Tab per zone (Z0-Z5) with terrain tagline in header band and tab tooltip. ZONE_LABELS mirrors terrain taglines from zones.ts.
- /guide            Digital operational guide. Includes collapsible Money Machine diagram toggle.
- /guide/stomping-path Stomping Path reference within the guide.
- /money-machine    Standalone Money Machine plumbing diagram (animated SVG component).
- /weekly           Weekly review interface.
- /seasonal         Seasonal debrief.
- /triage           Incoming request and alert handling.
- /council          Kitchen Table governance discussions.
- /meeting-kit      Meeting templates and facilitation resources.
- /settings         Operator profile and system configuration.
- /zone-diagram     Permaculture zone diagram (Z1-Z3 inner core, with context note linking to the full /map on codetry-ship).

Known issue: /money-machine has a hardcoded back-link to /north-star/guide rather than using base-aware routing. Low priority.
Known issue: `statement: undefined` on fresh install (onboarding edge case, not blocking).

---

### practitioners-guide-v2 — Practitioner's Guide V2
Directory: artifacts/practitioners-guide-v2
Path prefix: /practitioners-guide-v2/
Framework: React + Vite + Wouter

Routes:
- /                 Main operator workspace / dashboard.
- /stomping-path    Stomping Path reference page.
- /salts            Salt/milestone tracker.
- /contracts        Project agreement library.
- /brightside       Success and momentum tracker.
- /workflow         Operational flow visualizer.
- /startup-expenses Capital requirements and burn tracker.
- /community-store  Community retail store planning module.
- /sarge            High-level command center view.
- /strategic-ledger Core financial and strategic records.
- /money-machine    Money Machine blueprint and tracking.

---

### practitioner-operating-plan — Practitioner's Operating Plan
Directory: artifacts/practitioner-operating-plan
Path prefix: /practitioner-operating-plan/
Framework: React + Vite + Wouter

Routes:
- /lobby            Entry point for the daily operating rhythm.
- /deck             Presentation deck player for project orientation.
- /debrief          Morning and evening ritual / status update interface.
- /plan             Annual project phase and milestone overview.
- /plan/today       Step-by-step task list for the current operating day.
- /one-pager        High-level project summary and value proposition.
- /annual-check-in  Year-end check-in page (API route: /api/annual-check-in — was /api/check-in before task #1120).
- /tools            Operational tools index.
- /tools/bench      Staff and bench capacity tracker.

---

### headwaters-books — Bookkeeping
Directory: artifacts/headwaters-books
Path prefix: /headwaters-books/
Framework: React + Vite + Wouter

Routes:
- /                 Financial dashboard: P&L, accounts, key metrics.
- /transactions     Searchable transaction ledger.
- /receipts         Digital receipt inbox and processing area.
- /reconciliation   Bank statement matching and reconciliation tool.
- /accounts         Bank account configuration and status.
- /standby          Financial reserve and pantry readiness tracker.
- /submit           Operator document upload portal.
- /embed/open-records Public-facing transparent financial data embed (no auth required).

---

### print-marketing — Print Marketing Suite
Directory: artifacts/print-marketing
Path prefix: /print-marketing/
Framework: React + Vite + Wouter

Routes:
- /                 Suite index listing all print tools.
- /price-list       Retail/service price sheet generator.
- /poster/[type]    Poster templates (services, markets, etc.).
- /capability-statement Professional service capability document builder.
- /brand            Brand guide: logos, colors, typography.
- /engine-one-pager Pitch document template for specific project engines.
- /vocabulary       Brand terminology consistency sheet.
- /internal         Private index of sensitive project documentation.

---

### api-server — Shared API Server
Directory: artifacts/api-server
Port: 8081 (internal)
Framework: Express + TypeScript + Drizzle ORM + PostgreSQL

All web artifacts call this server. Artifacts do not connect to the database directly.
The River Smith scheduler arms on startup and runs automated background tasks.

API route groups:
- /api/library/*            Library entries, auth, producers, subjects, buckets, share links, review queue.
- /api/bookkeeper/*         Transactions, accounts, P&L, reconciliation, receipt processing.
- /api/handbook/*           Chapter and pioneer-path JSON (pre-synced from handbook.ts at build time).
- /api/wordpile/*           Practice card (Word Pile) state for the handbook app.
- /api/word-walk/*          Word Walk mobile learning state.
- /api/ship-manifest/*      Crew manifest entries.
- /api/sarge/*              Sarge command center data.
- /api/pgv2/*               Practitioner's Guide V2 backend data.
- /api/annual-check-in/*    Operating plan check-in (renamed from /api/check-in in task #1120).
- /api/nursery/*            Library nursery: idea briefs and invitations.
- /api/triage/*             North Star triage queue.
- /api/council/*            Kitchen Table / Council discussions.
- /api/gord/*               Gord owl widget: message-in-a-bottle feedback submissions.
- /api/odyssey/*            Odyssey timeline data.
- /api/river-smith/*        River Smith scheduler status and control.
- /api/gatekeeper/*         Gatekeeper access control.
- /api/intake/*             Practitioner intake form submissions (codetry-ship contact form).
- /api/membership/*         Membership management.
- /api/waitlist/*           Waitlist management.
- /api/capture/*            Content capture endpoint.
- /api/helping-hands/*      Helping Hands program data.
- /api/youth-path/*         Youth Odyssey path data.
- /api/inbox/*              Agent inbox / feedback items.
- /api/settings/*           Operator settings.
- /api/sandbox/*            Development sandbox endpoints.
- /api/storage/*            Object storage (App Storage) proxy.
- /api/media/*              Media asset management.
- /api/pdf/*                PDF generation.
- /api/subcontract/*        Subcontract management.
- /api/refund-invocation/*  Refund invocation flow.
- /api/deadhead/*           Expired content cleanup.
- /api/health               Health check.

---

## Shared libraries (lib/)

- lib/db                    Drizzle ORM schema and PostgreSQL client. Single database shared by all artifacts via the API server.
- lib/api-spec              Shared TypeScript interfaces for all API request/response shapes.
- lib/api-client-react      React hooks wrapping the API spec for use in web artifacts.
- lib/api-zod               Zod validation schemas for API payloads.
- lib/zone-store            Shared zone state (Z0-Z5 definitions, zone-aware UI helpers).
- lib/codetry-public        Public-facing handbook content helpers and constellation data.
- lib/gord-widget           Gord the owl feedback widget component. Floats bottom-right. Submits to /api/gord/.
- lib/kitchen-table-client  Client library for Kitchen Table / Council discussion data.
- lib/why-stores-fail       "Why Stores Fail" synthesis data (failure modes, sources). Used by library and codetry-ship.
- lib/locked-fees           Locked fee calculation logic shared between operating plan and practitioners guide.
- lib/cross-reserve-corridor Cross-reserve data structures.
- lib/headwaters-pricing    Pricing tier calculations.
- lib/odyssey               Odyssey timeline data and types.
- lib/object-storage-web    Replit App Storage client for web artifacts.
- lib/integrations          Third-party integration helpers.
- lib/integrations-anthropic-ai Anthropic AI via Replit proxy.

---

## Shared data relationships

zones.ts
  Canonical: artifacts/codetry-ship/src/data/zones.ts
  Contains: All zone definitions Z0-Z5 (name, slug, terrain tagline, color, flowsTo, metaphor, tools, corner).
  Used by: codetry-ship (MapPage, CompassPage, HomePage), north-star (ZONE_LABELS in utils.ts mirrors terrain taglines), field-guide-finance (HubPage zone framing).
  Rule: Any change to zone names, numbers, terrain taglines, or colors must start in zones.ts and propagate to north-star/src/lib/utils.ts ZONE_LABELS.

handbook.ts
  Canonical: artifacts/codetry-handbook/data/handbook.ts
  Contains: All 93 handbook chapters and 20 Pioneer Path stations.
  Sync: API server build step runs scripts/generate-manuscript.mjs and a chapters sync, writing artifacts/api-server/src/data/handbook/chapters.json and pioneer-path.json.
  Rule: Never edit chapters.json or pioneer-path.json directly. Edit handbook.ts and run a build or the sync script.

Why Stores Fail
  Canonical data: lib/why-stores-fail
  Surfaces in: library /why-stores-fail (full authenticated view), library /login (public spotlight), library /share/why-stores-fail (public share link).

The FORGE_MODULES array in field-guide-finance drives all Forge module content (five modules: Fire, Water, Earth, Air, Aether). Module IDs and structure are stable — do not renumber.

The TALES array in codetry-handbook/data/tales.ts provides all Children's Tales content. The front page displays the first tale as the featured excerpt.

River Smith arms automatically on API server startup. Log line "river-smith: scheduler armed" is intentional — not an error.

---

## What a new agent must know before editing

1. pnpm only. No npm, no yarn. Every command uses pnpm or pnpm --filter.

2. Path-based routing. Each artifact has a unique path prefix set at build time via BASE_URL (Vite: import.meta.env.BASE_URL). Never use root-relative URLs like /api/... in artifact code. Prepend BASE_URL or use the api-client-react hooks. The preview is a proxied iframe — hardcoded localhost will not work.

3. PORT from environment. Artifacts read the PORT env var. Do not hardcode ports in vite.config.ts. Exceptions: north-star (PORT=9000) and mockup-sandbox (PORT=8080) are set explicitly in their workflow commands.

4. Database access goes through the API server only. Artifacts never import from lib/db or connect to Postgres directly. If you need new data, add an API route.

5. Zone language is load-bearing. The permaculture zone model (Z0 Hearth, Z1 Spring, Z2 Worn Path, Z3 Clearing, Z4 Market Square, Z5 Ridge) is pervasive and intentional. Terrain taglines are canonical. Do not invent new zone names or renumber zones without updating zones.ts and propagating everywhere.

5a. The Capital Conversion Gate Principle (Amendment to the Eave Rule): No capital may be converted from a lower zone into a higher zone without an explicit gate decision — a conscious ceremony of consent, not a market transaction. Rooted in the 8 Forms of Capital (Roland & Landua): Living/Material/Experiential/Cultural capital originates at Z0–Z1; Social capital is structural to Z1 (The Eave); Intellectual capital spans Z2–Z3; Financial capital is native to Z3+. Each zone boundary is therefore also a capital-type boundary. The Eave Overhang (constitutional hard seam): no Z3+ identity or financial capital may compose directly into a Z0 or Z1 record without a documented gate decision. Full treatment in docs/zones-gates-reference.md.

6. Naming conventions are deliberate. Terms like Saltbox, Lodge, Standby, Stomping Path, Gord, River Smith, Bright Side, Gate Log, Pioneer Path, Reckoning, and Shallows are project vocabulary, not informal placeholders. Do not normalize them to generic equivalents.

7. Codetry is not Headwaters. Codetry = methodology and tooling layer (hands-on coding, digital sovereignty, blockchain-as-preparedness). Headwaters = practice and community layer (food economy, watershed, community ownership). They overlap but serve distinct purposes.

8. The Gord widget (lib/gord-widget) is a floating owl that appears on select pages. It routes feedback to /api/gord/. Do not remove it without verifying the host page's intent.

9. Expo / React Native rules. The codetry-handbook is a React Native app. It does not support HTML elements or CSS classes. Use View, Text, Pressable, StyleSheet, etc. It runs on a separate Expo dev domain, not the shared path proxy. Do not apply web-only patterns to it.

10. handbook.ts is the source of truth. Never edit chapters.json or pioneer-path.json. Run the build or sync script after editing handbook.ts.

11. /api/annual-check-in was /api/check-in before task #1120. If you encounter /check-in in older code, update it.

12. The deployed domain is northern-store-plan.replit.app (legacy Repl name, cannot be changed). Content is branded as ourheadwaters.ca and Headwaters. Do not reference the northern-store-plan name in new content.

13. Clerk auth is installed but configured via Replit-managed tenant. Do not send users to dashboard.clerk.com. Use the clerk-auth skill for any auth changes.

14. NURSERY_COOKIE_SECRET is the one active environment secret. It is used by the library nursery session logic.

15. Google Mail integration is installed and configured. Use the integrations skill before attempting any email-related work — do not add a second email setup.
