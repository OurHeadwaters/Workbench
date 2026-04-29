# Practitioner's Guide V2 — Rename map

A single, term-by-term inventory of names in this guide that may have drifted away from
codetry-aligned vocabulary, with proposed replacements for the founder to accept,
reject, or amend one row at a time.

> **Format note for maintainers:** the `/codetry` page in the guide reads this file
> verbatim and re-renders the table below. The parser (`src/lib/renameMap.ts`) expects
> the data table to have exactly 7 pipe-delimited columns in this order:
> `# | Term | Where it appears | Drift | Proposed replacement | Second-order effects | Status`.
> The `Drift` cell is a sequence of single letters drawn from `G`, `U`, `D`, `A` (an em-dash
> `—` means no drift); the `Status` cell must be one of the canonical words below. Adding new
> rows is fine — keep the row number monotonically increasing so the worked-example references
> in `CodetryDisciplinePage.tsx` stay stable. If you reorder or remove rows, the worked-example
> alignment tests will fail and the page will surface an amber warning until the references are
> updated.

**Nothing in this map has been applied.** Every status is `proposed`. The founder
walks the table, sets each row to `approved`, `rejected`, or `deferred`, and only
then does a follow-up task perform the renames on the `approved` rows.

### Status state machine

Canonical statuses (use these exact words, no others):

| Status | Meaning |
|---|---|
| `proposed` | The starting state for every row in this map. |
| `approved` | Founder has accepted the proposed replacement; safe for the implementation pass to apply. |
| `rejected` | Founder has decided not to rename; row is preserved here as a record of what was considered and walked past. |
| `deferred` | Founder hasn't decided yet, or the rename belongs to a later pass (e.g. project-wide sweep). Re-review next round. |
| `applied` | Set by the implementation pass *after* the rename has actually landed in the codebase. Only `approved` rows transition to `applied`. |

Transition rule: rows start `proposed`; the founder sets `approved` / `rejected` /
`deferred`; the implementation pass updates only `approved` rows to `applied`. No
other transitions are valid.

---

## Scope

**In scope:** every user-visible noun, label, heading, tag, bucket name, page
title, and component name inside `artifacts/practitioners-guide-v2/`.

**Out of scope (do not propose changes for these):**

- Renames in any other artifact (codetry-handbook, books, library, deer-lake,
  slides, etc.). A separate "project-wide sweep" task handles cross-artifact
  consistency.
- The "How we do codetry here" guidebook section (a separate downstream task
  builds it on top of this map).
- Any change to financial figures, scenario shapes, or math. This is a vocabulary
  audit only.

**Load-bearing metaphors preserved (do not propose renaming):**

- **Salts** / **Parr's Jars** — the bucket and its product.
- **Community Contracts** — the bucket name (the agency engagement).
- **Brightside** — the product name.
- **Eagle prologue** / `EaglePrologue` — the naming-of-the-eagle opening.
- **Confirmed tags** / `ConfirmedTag` — the dot-and-tooltip provenance system.

---

## Drift symptom legend

| Symbol | Drift type |
|---|---|
| **G** | Generic accounting / SaaS / MBA word where a codetry word would carry weight |
| **U** | UI-framework leak (Card, Banner, KPI, Workspace, Compare) |
| **D** | Duplicate metaphor — the same noun doing two jobs, or two nouns doing one job |
| **A** | Abbreviation / acronym hiding a metaphor |

---

## The map

| # | Term | Where it appears | Drift | Proposed replacement | Second-order effects | Status |
|---|---|---|---|---|---|---|
| 1 | **Compare page** / `ComparePage` / route `/compare` | `src/pages/ComparePage.tsx`, `AppShell` nav, page testIds (`page-compare`, `compare-scenario-*`, `compare-activate-*`) | U | **Turn-out** (page) — "the page where the founder turns a scenario out on the table". `TurnOutPage`, route `/turn-out`. | Renames the route (bookmark break for the founder, low blast radius), the testId prefix `compare-` → `turn-out-`, and the nav label. The internal `GitCompareArrows` icon still reads correctly. | proposed |
| 2 | **Operating framework workspace** / "Workspace" / `<SectionCard title="Workspace">` | `ComparePage.tsx` header eyebrow, "Workspace" SectionCard, "What this workspace is for" SectionCard, the prose docstring at the top of `ComparePage` and `lib/altRealities.ts` | U + G | **The locked map** (matches the codetry-handbook's recurring noun for V3). The page eyebrow becomes "The locked map"; the SectionCard becomes "Locked map vs alternatives". | "Operating framework" appears in *prose* across pages (Index, Replication) describing V3 as "the locked default operating framework" — those readouts stay intact (they're descriptive sentences, not labels). Only the labelled UI nouns change. | proposed |
| 3 | **Alternative reality** / **Alt reality** / `AltReality` / `AltRealityState` / `altRealities.ts` / `PGV2_ALT_REALITIES_KEY` / "New alternative reality" button / `defaultNewName` "Alt #N" | `lib/altRealities.ts` (whole file), `ComparePage.tsx` (button labels, prose, V4 seed name) | U + G | **Sketch** — "a sketch is a try at the table; you can throw it away". File: `sketches.ts`. Type: `Sketch` / `SketchState`. UI: "New sketch", "V4 — Right-priced (seed sketch)". localStorage key: `pgv2.sketches`. | localStorage key change orphans the existing key on the founder's machine — needs a one-time migration read (try new key, fall back to old key, write to new) so the founder doesn't lose their open sketches. The prose uses the phrase "alternative reality" several times in user-facing copy; each occurrence rewrites to "sketch" / "a sketch of the next turn". | proposed |
| 4 | **Δ-vs-V3** / "Δ-vs-V3 cell" | `ComparePage.tsx` prose, `altRealities.ts` docstring | U | **"vs locked" column** (or **"how this differs from V3"** in prose). Drop the Δ glyph from prose; keep it in the column header where it's a visual shorthand. | Column header stays compact (`Δ`); reading-the-page prose reads "how this differs from V3" instead of "the Δ-vs-V3 cell". | proposed |
| 5 | **MoneyKpi** (component) / "KPI" semantics / testId `kpi-*` (if any) | `src/components/MoneyKpi.tsx`, every page that imports it | U | **HeadlineNumber** — every page already calls these "headline numbers" in surrounding prose. Component: `HeadlineNumber`. File: `HeadlineNumber.tsx`. | Pure code rename; no user-visible string changes. Affects ~6 import sites (Salts, Contracts, Brightside, PersonalCash, Index, Compare). | proposed |
| 6 | **ProvisionalBanner** (component name) | `src/components/ProvisionalBanner.tsx`, testId `provisional-banner` | U | **NotYetLockedNotice** — the metaphor is the not-yet-locked status, not the banner shape. Component: `NotYetLockedNotice`. testId: `not-yet-locked`. | The on-screen string "X numbers are provisional, not yet locked by the founder" already carries the metaphor; only the component / testId names change. | proposed |
| 7 | **SectionCard** (component name) | `src/components/SectionCard.tsx` and ~all pages | U | *Borderline — leave or rename to `Section`.* "Card" is shadcn vocabulary; the component is just a titled section with an accent stripe. Recommend: `Section`. | Pure code rename. ~30+ import sites. Marginal benefit; flag for the founder to weigh against churn. | proposed |
| 8 | **Phase 1 / Phase 2 / Phase 3** | `data/v3.ts`, `data/v4.ts`, `data/contractsLedger.ts`, `ContractsPage.tsx`, footnotes, ledger sheet rows, `altRealities.ts` bucket key "Agency — Phase 3 splits" | G | **Drop the `Phase N —` numeric prefix.** The phases already have names. Use **Capital Recovery**, **Brightside Launch**, **Reserve / Innovation** as the labels in their own right. Where ordering matters in a header, the visual order in the page already conveys it. | Footnotes that read "Phase 3 split" become "Reserve / Innovation split"; the ledger sheet "Agency — surplus phases" stays useful but the rows lose the "Phase 1 —" / "Phase 2 —" / "Phase 3 —" prefix. The bucket key in `altRealities.ts` ("Agency — Phase 3 splits") becomes "Agency — Reserve / Innovation splits". | proposed |
| 9 | **Reserve** / `reservePct` / `reserveMonthly` / `reserveTotal` / "Reserve (75%)" headline | `data/v3.ts`, `data/v4.ts`, `data/contractsLedger.ts`, `altRealities.ts` METRICS, `ContractsPage.tsx`, footnotes | G | *Borderline — keep.* The codetry-handbook uses *Reservoir* for the holding pool in its envelope-budget app, but in this guide "Reserve" is a board-pack-readable accounting word the founder uses in conversation with the buyer. Recommend keep, flag for the founder. | If accepted as-is: no change. If renamed to *Reservoir*: ripples into ~15 ledger rows, ~6 metric labels, the Phase 3 split row in totals18mo, and every footnote that uses "Reserve". | proposed |
| 10 | **Innovation / R&D** / `innovationPct` / `innovationMonthly` / "Innovation (25%)" / "Agency Innovation / R&D (Phase 3)" downside-coverage source | `data/v3.ts`, `data/v4.ts`, `data/contractsLedger.ts`, `data/shared.ts` (downside coverage source bucket), `altRealities.ts`, `ContractsPage.tsx` | G + A | **Brightside Capital** — that is what this bucket actually funds (the source for the Brightside follow-on, named directly in `shared.ts`'s downside coverage row). Drops the "R&D" abbreviation and names the destination instead of the activity. | Renames `innovationPct` / `innovationMonthly` / `innovationTotal` → `brightsideCapital*`. The downside-coverage source bucket string "Agency Innovation / R&D (Phase 3)" becomes "Agency Brightside Capital (Reserve / Innovation split)". The Phase 3 split bucket in `altRealities.ts` becomes "Agency — Reserve / Brightside Capital". Worth weighing because it makes the Brightside↔contracts coupling explicit on every page. | proposed |
| 11 | **Bucket** (used in two jobs) — (a) the three top-level streams in `data/buckets.ts` (`BUCKETS`, `BUCKET_ORDER`, `BucketId`); (b) the four reinvestment sub-allocations in `ReinvestmentBucketsInteractive.tsx` (testIds `bucket-*`, `bucket-card-*`, `bucket-value-*`, `bucket-slider-*`, `bucket-reset`, `bucket-reserve`); (c) `lib/altRealities.ts` "bucket" field on `MetricDef` ("Agency — monthly", "Agency — 18-month totals", "Agency — Phase 3 splits", "Personal cash") | All three sites listed | D | Distinguish the three jobs with three different nouns: (a) **Stream** for the three top-level streams (`STREAMS`, `STREAM_ORDER`, `StreamId`) — already how Index calls them in prose ("the three streams"); (b) **Bucket** stays for the reinvestment sub-allocations (the codetry-handbook's load-bearing use of *bucket* — "every drop into a bucket"); (c) **Group** (or just leave the field unnamed) for the `MetricDef.bucket` grouping field — it's purely a UI grouping key, not a financial bucket. | The shift here is that *bucket* gets *narrower*, not broader: it earns its codetry weight by referring only to the four reinvestment buckets, where the rule "you can only pour from one bucket into another, never summon water from nothing" actually holds (the slider implementation enforces it via the auto-balancing reserve). Renaming the top-level streams ripples through `BUCKETS`, `BUCKET_ORDER`, `BucketId`, every `Bucket` import, the URL routes (`/contracts` etc. unchanged but page header eyebrows that say "Bucket" change to "Stream"), and the export-ledger filenames if they carry "bucket" (they don't today). | proposed |
| 12 | **Software, Hardware & Training** (bucket display name) vs **Brightside** (the metaphor word, currently the *tagline*) | `data/buckets.ts` BUCKETS.brightside.name = "Software, Hardware & Training", tagline = "Brightside RT-LTC" | D | **Swap them.** Bucket name: **Brightside**. Tagline: "Software, hardware & training — the Brightside RT-LTC product". | This is the inverse of how Salts and Community Contracts already work (metaphor word as the name, descriptor in the tagline). After the swap, all three streams read consistently. The `id` stays `brightside`. AppShell nav label changes from "Software, Hardware & Training" to "Brightside". | proposed |
| 13 | **RT-LTC** (acronym) | `data/buckets.ts` brightside tagline; `data/brightsideLedger.ts` docstring; possibly Brightside page copy | A | **Long-term care** (spelled out). "Brightside — long-term care software" instead of "Brightside RT-LTC". | Loses ~6 chars from a tagline; gains readability for a board reader who isn't already inside the acronym. Files affected: ~3. | proposed |
| 14 | **`pilotReserve`** (id) / **"Saved for the next reserve"** (label) — name and id disagree | `ReinvestmentBucketsInteractive.tsx` (RESERVE_BUCKET, ZERO_CONSEQUENCE.pilotReserve, etc.); the `REINVESTMENT_BUCKETS` definition lives in `@workspace/headwaters-pricing` (out of scope) | D | **Out of scope here** — the canonical id lives in `@workspace/headwaters-pricing`. Flag for the project-wide sweep: `pilotReserve` → `nextReserve` (matches the on-page label "Saved for the next reserve" and removes the leftover "pilot" framing the founder no longer uses). | This row exists so the founder sees the inconsistency; do not change anything in this artifact until the workspace package row lands. | proposed |
| 15 | **`techCapex`, `toolingSubs`, `trainingRnD`** (reinvestment bucket ids) and their labels | `ReinvestmentBucketsInteractive.tsx` ZERO_CONSEQUENCE / ABOVE_DEFAULT keys; canonical labels from `@workspace/headwaters-pricing` | A + G | **Out of scope here** — these ids and labels live in the workspace package. Flag for the project-wide sweep: drop the `Capex` / `Subs` / `RnD` abbreviations and use the on-page consequence prose's words (e.g. `techCapex` → `ownedKit`; `toolingSubs` → `toolsWeRunOn`; `trainingRnD` → `trainingAndTheGuide`). | Same as #14 — do not change here; flag for the founder to take to the package. | proposed |
| 16 | **Cost basis** | `data/v3.ts`, `data/v4.ts`, `data/contractsLedger.ts` ("Cost basis" sheet rows), `data/shared.ts`, `altRealities.ts` METRICS ("Monthly cost basis (Sep+)"), `ContractsPage.tsx` | G | *Borderline — keep.* "Cost basis" is the founder's actual word in conversation with the buyer (it appears in the renegotiation-trigger prose and the agency P&L). The codetry replacement would be **what it costs to keep the lights on**, but no shorter noun lands harder. Recommend keep; flag for review. | If accepted as-is: no change. If renamed: every "Cost basis" cell in 4 ledgers and ~3 page surfaces. | proposed |
| 17 | **Surplus deployed** / **Surplus deployment** | `data/v3.ts`, `data/v4.ts`, `data/contractsLedger.ts` ("Total surplus deployed (post-tithe)" row), `data/brightsideLedger.ts` (entire "Surplus deployment" sheet), `altRealities.ts` METRICS, `ContractsPage.tsx`, `BrightsidePage.tsx` | G | **Surplus, where it goes** (in prose) and **Surplus** (as a metric label, with the destination row immediately below). The verb *deploy* is corporate and hides the waterfall; the page already shows the destinations stacked underneath. | Affects the Phase 3 totals header ("Total surplus deployed (post-tithe)" → "Surplus, after tithe and cost basis"), the Brightside ledger sheet "Surplus deployment" → "Surplus, where it goes", and ~2 metric labels. | proposed |
| 18 | **Operating margin** (prose only) | `data/v3.ts`, `data/v4.ts` description strings; possibly Compare / Index | G | *Keep.* This is the founder's word in conversation with the buyer about what fee level lands the engagement in the 35–40% band. Renaming would make the buyer-facing prose harder, not easier. | None. | proposed |
| 19 | **TBD** (visible badge text from `Num` and any "TBD" badge UI) / `tbd` tag kind | `src/components/Num.tsx` (`title = "TBD…"`), `src/data/tags.ts` (`kind: "tbd"`), the visible "TBD" badge inferred from contracts overhead rows | A | Visible string: **"not yet decided"** (or **"to be decided"**) instead of "TBD". Internal `kind: "tbd"` tag stays — it's a code-level discriminant, not a UI string. | Affects only the tooltip / aria title strings produced by `Num` and the inferred badge in `ContractsPage` overheads. ~2 prose locations. | proposed |
| 20 | **P&L** / **COGS** (sheet names and column headers in CSV/XLSX exports) | `data/saltLedger.ts` ("Salts P&L" sheet, "COGS @ $5.50" column, "TOTAL per-jar COGS" row), `data/contractsLedger.ts`, `data/brightsideLedger.ts` | A | *Keep.* These are the words a board reader expects on a board pack tab. The export is the one surface where accounting vocabulary helps, not hurts. | None. Flag included so the founder sees we considered it. | proposed |
| 21 | **Personal cash transparency** / `PersonalCashPage` page eyebrow / nav label | `src/pages/PersonalCashPage.tsx`, AppShell nav | G | **What the founder takes home** (page eyebrow / nav). Page filename / route can stay (`/personal-cash`). | Affects nav label and page eyebrow only; no testId churn. | proposed |
| 22 | **Replication** / `ReplicationPage` page title / nav label | `src/pages/ReplicationPage.tsx`, AppShell nav | G | *Borderline.* "Replication" is genuinely the verb the founder uses for *standing the same machine up in another community*. Recommend keep; flag for the founder. | None unless renamed. If renamed, candidate: **Standing it up elsewhere**. | proposed |
| 23 | **Hub Coordinator (Dryden)** | `data/v3.ts`, `data/v4.ts` roster | — | *Keep.* This is a load-bearing named role decided in the 2026-04-28 Deer Lake roster sync; it is not drift. Listed so the founder sees we walked past it intentionally. | None. | proposed |
| 24 | **Shadow labour** | `data/v3.ts`, `data/v4.ts` salts P&L row, `data/saltLedger.ts` Salts P&L sheet | — | *Keep.* This is itself the codetry-aligned name (it carries the metaphor — labour the books don't see). Listed for the same reason as #23. | None. | proposed |
| 25 | **Reset to defaults** (button) / "default" (used to mean "the locked V3 anchor" on Compare and to mean "the year-1 reinvestment default" on the bucket sliders) | `ReinvestmentBucketsInteractive.tsx` "Reset to defaults" button + per-slider "default {amount}" caption; `ComparePage.tsx` "default" pill on the V3 ScenarioCard | D | Distinguish the two jobs: (a) on the bucket sliders, keep **default** (it's a slider's standard verb); (b) on Compare, replace the "default" pill on V3's card with **locked** (which is already the word the rest of the page uses for V3). | The Compare ScenarioCard `<Lock>` icon already shows "default" — the icon is a lock, the word should match. Affects one pill string and the `subtitle` that calls V3 the "locked default operating framework" (consider "the locked map" per #2). | proposed |
| 26 | **`buildLedger` / "Export ledger"** (button + props) | `ExportLedgerButtons.tsx`, `saltLedger.ts`, `contractsLedger.ts`, `brightsideLedger.ts` | — | *Keep.* "Ledger" is the founder's word for the line-by-line backing data; this is a load-bearing noun, not drift. Listed so the founder sees we walked past it intentionally. | None. | proposed |
| 27 | **Footnote** / "Footnotes" heading / `footnote-*` testIds / `FootnoteList` component | `src/components/FootnoteList.tsx`, `data/footnotes.ts`, every page that uses footnotes | — | *Keep.* "Footnote" is the founder's word for the mid-page provenance notes; load-bearing. Listed so the founder sees we walked past it. | None. | proposed |
| 28 | **Scenario** / `ScenarioToggle` / `useScenario` / `ScenarioId` | `data/types.ts`, `data/scenarios.ts`, `lib/scenario.tsx`, `ScenarioToggle.tsx`, every page | G | *Borderline — keep.* The codetry replacement would be **turn** (a "turn" of the engagement is V3 vs V4 vs whatever comes next) — and indeed `ComparePage` prose already uses "talk a turn out". A full rename would touch every page. Recommend keep; flag for the founder to weigh. | If renamed: scenario.tsx → turns.tsx, ScenarioToggle → TurnToggle, ScenarioId → TurnId, etc. ~25 sites. High churn for marginal codetry gain. | proposed |
| 29 | **Provisional** (status word and tag kind) | `data/tags.ts` `kind: "provisional"`, `ProvisionalBanner.tsx`, on-screen "X numbers are provisional, not yet locked by the founder" | — | *Keep.* "Provisional" reads cleanly next to "confirmed" and "TBD" and the founder uses the word in conversation. Listed so the founder sees we walked past it. | None. | proposed |
| 30 | **AppShell** (component) | `src/components/AppShell.tsx` | U | *Borderline — keep.* "Shell" is a UI-framework word, but this is a top-level chrome component and the rename gives nothing. Listed for the same reason as #7. | None. | proposed |

---

## How to use this map

1. **Founder walks the table top to bottom**, setting each row's status to `approved`, `rejected`, or `deferred`. If the proposed replacement is close-but-not-quite, the founder edits the **Proposed replacement** cell in place and then sets the status to `approved` — `approved` always means "apply *what's currently in the cell*".
2. Borderline rows (#7, #9, #16, #18, #22, #28, #30) are listed explicitly so the founder sees what was *considered* and walked past, not just what was *proposed*. Most are likely to land as `rejected` or `deferred`.
3. Out-of-scope rows (#14, #15) belong to the project-wide sweep — set them to `deferred` here so the sweep task picks them up, and *do not apply them in this artifact*.
4. Once the table is marked up, a separate implementation task applies **only the `approved` rows**, in dependency order, and sets each one to `applied` after the rename lands:
   - First the load-bearing word swaps (#11, #12) since they ripple into ids, testIds, and nav.
   - Then the abbreviation expansions (#13, #19) and label cleanups (#8, #17, #21).
   - Then the component / page renames (#1, #2, #3, #5, #6).
   - The localStorage migration in #3 (`pgv2.altRealities` → `pgv2.sketches`) ships in the same change so the founder doesn't lose open work.

Until the founder has set rows to `approved`, **do not apply any rename**. `rejected` and `deferred` rows stay in the document as a record — they are never applied and never transition to `applied`.
