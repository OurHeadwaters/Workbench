# Codetry — cross-artifact rename map

A single, term-by-term inventory of names that drift across the project's
artifacts, with proposed replacements and a status the founder marks one row
at a time. Rows start as `proposed`. The founder walks the table and sets
each row to `approved`, `rejected`, or `deferred`; only then does a
follow-up pass perform the renames on the `approved` rows. The current
tally lives in the **Summary** block below — the per-row Status column is
the source of truth, and the Summary aggregates it.

This is the **project-wide** sweep. The single-artifact baseline is
`artifacts/practitioners-guide-v2/docs/rename-map.md` (the audit's output),
and the rows below begin from the vocabulary that map locks in.

---

## Summary (after the sweep)

- **Inventoried artifacts:** Practitioner's Guide V2, Headwaters Books, the
  Northern Food Systems Research Library, the Practitioner Operating Plan,
  the Deer Lake Store — Operational Plan, the Deer Lake Walkthrough, Wordpile,
  the codetry-handbook, and the API Server.
- **Same-phenomenon clusters identified:** 8 (rows P-1 through P-8 below).
  These are concepts that already have two or more names in the wild — the
  proposed replacement collapses each cluster to a single name.
- **Cross-artifact UI-framework leaks:** 4 (rows U-1 through U-4) — all
  recurring across three or more artifacts.
- **Cross-artifact abbreviations:** 5 (rows A-1 through A-5).
- **Borderline rows walked past intentionally:** 3 (rows B-1 through B-3).
  Listed so the founder sees what was *considered and not proposed*.
- **Out-of-scope rows imported from the guide's map:** 2 (rows X-1 and X-2 —
  the `pilotReserve` and `techCapex/toolingSubs/trainingRnD` ids that live in
  `@workspace/headwaters-pricing`).
- **Applied so far:** 8 (P-3, P-5, P-6, P-7, P-8, A-1, A-2, A-5 — Tier 1 batch).
  **Approved so far:** 0 currently outstanding (Tier 1 was approved + applied in
  the same pass; Tier 2 rows P-1, P-4, A-4, U-4, X-1, X-2 still `proposed` and
  awaiting founder review). **Deferred so far:** 0. **Rejected so far:** 3
  (B-1, B-2, B-3 — borderlines walked past intentionally per their `Why`
  columns). The founder updates this line as rows land.
- **Status-cell reconciliation (2026-04-29):** the Tier 1 batch was applied in
  an earlier pass, and the Summary tally above was kept current, but the
  per-row Status column on those rows had been left at `proposed`. Today's
  reconciliation flipped P-3, P-5, P-6, P-7, P-8, A-1, A-2, A-5 to `applied`
  (each spot-checked against the live code) and B-1, B-2, B-3 to `rejected`,
  so the per-row column now matches the Summary. No code, copy, or
  constellation entries changed in that reconciliation — only the Status
  column. Rows P-1, P-2, P-4, U-1…U-4, A-3, A-4, X-1, X-2 remain `proposed`
  and continue to await the founder's per-row decision.

### Coverage / selection rule

The task asks for "every drifted term" across the project. Because some
single-artifact rename maps already exist, this cross-artifact map honours
that requirement by **partitioning the work** rather than duplicating it:

- **In scope here (this map):** every drifted term whose drift pattern is
  *cross-artifact* — same noun appearing in two or more artifacts under
  different names (the same-phenomenon clusters), UI-framework leaks
  recurring across three or more artifacts, abbreviations recurring across
  three or more artifacts, and the borderline / out-of-scope rows that the
  founder should still see in writing.
- **In scope, but in the per-artifact map:** single-artifact drift that
  only affects one artifact's vocabulary. The Practitioner's Guide V2's
  drift is already inventoried row-by-row at
  `artifacts/practitioners-guide-v2/docs/rename-map.md` (30 rows, status
  column already present). Those rows are *referenced* from this map where
  they coordinate with a cross-artifact row, but they are not restated —
  the founder approves them in their own document.
- **In scope, but no rename proposed:** the artifacts whose vocabulary was
  inventoried and found to have no qualifying cross-artifact drift. The
  **API Server** (`artifacts/api-server`) is the explicit example: its
  user-visible strings are HTTP error messages (`"Unauthorized"`, `"Pile
  not found"`, `"payload too large"`, `"Wait a moment before making another
  link."`) which are HTTP-protocol-aligned and not codetry-bearing. No row
  is proposed for it; this paragraph closes the loop.

If, while reading the rest of the project, the founder spots a drifted
term this map missed, it is added as a new row at the bottom of the
appropriate section (P-N+1, U-N+1, A-N+1, or B-N+1) with status
`proposed`. The map is the long-lived document; this section is the
contract for what belongs in it.

---

## Status state machine

Same canonical statuses as the guide's map (see
`artifacts/practitioners-guide-v2/docs/rename-map.md` for the full state
machine).

| Status | Meaning |
|---|---|
| `proposed` | Starting state for every row. |
| `approved` | Founder has accepted the proposed replacement; safe for the implementation pass. |
| `rejected` | Founder has decided not to rename; row is preserved as record. |
| `deferred` | Founder hasn't decided yet, or the rename belongs to a later pass. |
| `applied` | Set by the implementation pass *after* the rename has actually landed. |

Transition rule: `proposed` → (`approved` | `rejected` | `deferred`); only
`approved` → `applied`.

---

## Drift symptom legend

| Symbol | Drift type |
|---|---|
| **G** | Generic accounting / SaaS / MBA word where a codetry word would carry weight |
| **U** | UI-framework leak (Card, Banner, KPI, Workspace, Dashboard, Compare) |
| **D** | Duplicate metaphor — the same noun doing two jobs, or two nouns doing one job |
| **A** | Abbreviation / acronym hiding a metaphor |
| **S** | Same-phenomenon, different name across artifacts (the headline drift type for this map) |

---

## Same-phenomenon clusters

The eight rows in this section each describe a concept that already exists in
two or more artifacts under different names. The proposed replacement is the
single name the founder picks; the second-order column lists every site that
would update.

| # | Cluster (current names + artifacts) | Drift | Proposed single name | Second-order effects | Status |
|---|---|---|---|---|---|
| **P-1** | **The person doing the work**: "Practitioner" (codetry-handbook, Wordpile eyebrow `Practitioner tool`, practitioner-operating-plan role label `Practitioner / Lead`, practitioners-guide-v2 prose), "Founder" (PG2 throughout — see exact file list below), "Curator" (library nav + `login.tsx` "Curator sign-in"), "Lead" (operating-plan secondary role label). PG2 lowercase `founder` occurrences (label/eyebrow + prose mixed) by file: `pages/CodetryDisciplinePage.tsx` (7), `pages/ComparePage.tsx` (4), `pages/ReplicationPage.tsx` (3), `pages/IndexPage.tsx` (3), `pages/ContractsPage.tsx` (3), `pages/BrightsidePage.tsx` (2), `pages/PersonalCashPage.tsx` (1), `pages/SaltsPage.tsx` (1), `components/AppShell.tsx` (1), `lib/renameMap.ts` (1) = **27**. PG2 capitalized `Founder` by file: `pages/BrightsidePage.tsx` (4), `pages/ReplicationPage.tsx` (2), `lib/renameMap.ts` (2), `data/footnotes.ts` (2), `lib/__tests__/altRealities.test.ts` (3), `pages/IndexPage.tsx` (1), `pages/ContractsPage.tsx` (1), `data/brightsideLedger.ts` (1), `data/shared.ts` (1) = **17**. Operating-plan "Practitioner / Lead" sites: `src/data/costRegistry.ts` lines 261/1042/1127, `src/pages/OnePager.tsx` line 186 = **4**. Library: `src/pages/login.tsx` ("Curator sign-in"), `src/components/Layout.tsx` (Curator nav + sign-out copy). | S + G | **Practitioner** is the codetry-aligned name and the one the handbook defines (Part I, §1.0 "What the practitioner is, and is not"). Use *practitioner* everywhere a single human-doing-the-work is meant. **Keep "Founder"** in PG2 prose where it specifically means *the person who started Headwaters as a company* (a narrower role than "practitioner"); flag every other "founder" in PG2 for replacement with "practitioner". **Keep "Curator"** in the library where it names a library-specific role (a curator is a kind of practitioner, not a synonym), but rename the library's "Curator sign-in" to "Practitioner sign-in" because the sign-in surface is shared. **Drop "Lead"** in the operating plan ("Practitioner / Lead" → "Practitioner"). | Touches the exact files counted above (10 PG2 lowercase, 9 PG2 capitalized — overlapping set), the library `src/pages/login.tsx` and `src/components/Layout.tsx` sign-in copy, the operating-plan role label in `src/data/costRegistry.ts` (3 sites) and `src/pages/OnePager.tsx` (1 site). No code identifiers change in this row — `useFounder` etc. are not in scope. The implementation pass walks each occurrence and decides whether it is *Founder* (Headwaters-the-company) or *founder* (generic practitioner-level noun) before applying. | proposed |
| **P-2** | **The envelope/category container**: "Bucket" used five different ways across the project — (a) library `buckets/index.tsx` "Project Buckets" (research initiatives), (b) PG2 `data/buckets.ts` `BUCKETS` (3 top-level revenue streams), (c) PG2 `ReinvestmentBucketsInteractive.tsx` (4 reinvestment sub-allocations), (d) PG2 `lib/altRealities.ts` `MetricDef.bucket` (UI grouping field), (e) codetry-handbook Z1 worked example `Buckets` (envelope-budget categories — "every drop into a bucket"). | S + D | **Reserve "Bucket" for the codetry-handbook's load-bearing use only** — envelope-budget categories where the rule "you can only pour from one bucket into another, never summon water from nothing" actually holds. Rename the others as PG2's row #11 already proposes: (b) → **Stream**, (c) keep as **Bucket** (this matches the handbook's load-bearing use), (d) → **Group**, (a) library "Project Buckets" → **Initiatives** (research initiatives is what they actually are; "bucket" leaks the implementation). | The library rename (a) is the new cross-artifact piece — `buckets/index.tsx` page title, the nav label in `Layout.tsx`, the home tile, `entries/new.tsx` form field "Bucket" → "Initiative", and the URL `/buckets`. The route rename is borderline; safer to keep `/buckets` and only change the label. PG2 rows (b)(c)(d) are already in PG2's own map (#11) and apply per that. The codetry-handbook keeps "Bucket" untouched. | proposed |
| **P-3** | **The dashboard / overview / home page**: "Dashboard" (headwaters-books page + nav, library nav `Overview` aliased to Dashboard, practitioner-operating-plan `Today` page sometimes prefixed "Dashboard"), "Overview" (library `home.tsx` "Library Overview" + nav `Overview`), "Today" (operating-plan home page `Today.tsx`) | S + U | **The first-screen-when-you-open-the-artifact has a different load-bearing name in each artifact, and that's correct** — but stop calling any of them "Dashboard". The handbook is unambiguous that "Dashboard" is a UI-framework leak. (a) headwaters-books: keep page filename `Dashboard.tsx` for the implementation pass to decide, but change page title and nav label from "Dashboard" to **"The books today"** (matches the artifact name and what the page actually shows). (b) library: keep "Library Overview" as the page title; rename the nav label `Overview` to **"Library"** so it matches the home page's actual subject. (c) operating plan: keep "Today" — it's already codetry-aligned. | (a) Affects `Layout.tsx` nav label, `Dashboard.tsx` page header. (b) Affects `Layout.tsx` nav label only. (c) No change. | applied |
| **P-4** | **"Bright Side" / "Brightside" used three different ways**: (a) codetry-handbook Z0-centralized zone `Bright Side` (the institutional saltbox: long-term care, recreation therapy), (b) The Gate vocabulary `the bright side` (= the codetry-vocabulary side of the membrane, opposite "massity"), (c) PG2 `Brightside` (the long-term care software product — same domain as (a) but written as one word). | S + D | **Three different concepts wearing the same word is the worst kind of drift.** Propose: (a) keep **"Bright Side"** (two words) for the Z0-centralized zone — it's the older noun and the metaphor (sunlight on a north wall) is load-bearing for the zone. (b) rename The Gate's "the bright side" to **"the inside"** (the codetry-side of the membrane, where the constellation's own dialect lives — "inside the gate" reads naturally and stops colliding with the zone name). (c) keep **"Brightside"** (one word) as the PG2 product name — "Brightside RT-LTC" is already a registered product noun and "Brightside" is the product brand the founder uses with buyers. The orthographic split (Bright Side vs Brightside) becomes load-bearing: two words = the zone; one word = the product. Document this rule in the codetry-handbook constellation manifest as a footnote on the Z0-centralized entry. | (b) is the only code/data change — the constellation manifest's `the-gate` primitive vocabulary entry "the bright side" → "the inside", and the `the-gate` summary line "between the bright side and massity" → "between the inside and massity". The codetry-handbook bundled snapshot in `data/constellation.ts` regenerates from the manifest. (a) and (c) are no-ops apart from the documentation footnote. | proposed |
| **P-5** | **"Watershed" used three different ways**: (a) codetry-handbook Z5 zone `Dam Days` / `Shallows` (formerly `Watershed`), (b) codetry-handbook Z1 worked example `Watershed` (= diversified income streams: "Three is a Watershed"), (c) the legacy xBuckets URL/storage namespace `watershed.replit.app` + `watershed:*` storage keys (still active per `formerNamesNote`). | S + D | **Same word, three jobs.** Propose: (a) keep **"Dam Days / Shallows"** as the Z5 noun (already the resolved name in the manifest); the `formerNames: ["Watershed"]` entry stays as the historical record. (b) keep **"Watershed"** for the Z1 income-diversification worked example — this is the strongest metaphor of the three (multiple feeder streams into one household), and it's the one printed on the side-income card. (c) flag the legacy URL/storage namespace `watershed.*` as **historical-only**: do not rename the URL or storage keys (breaking change for live data), but add a manifest note that the namespace is frozen and any new storage lives under the current Z1 product name (`headwaters` / `xbuckets`). | Documentation only — `constellation.ts` Z1 worked-example entry for "Watershed" gets a one-line note clarifying that this is *the income-diversification metaphor*, not the legacy product name. The Z5 entry already carries that disambiguation. No code identifier renames. | applied |
| **P-6** | **"Reserve" vs "Reservoir"**: (a) PG2 `data/v3.ts`/`v4.ts`/`contractsLedger.ts` "Reserve" (the 75% hold-back of agency surplus that funds the next reserve / next pilot), (b) codetry-handbook Z1 worked example `Reservoir` (the stablecoin wallet — "what's left after the Siphon"), (c) Z1 worked example `Aquifer` (long-term savings layer, formerly conflated with Reservoir). | S | **Different concepts, same metaphor family — keep both, but write the cross-reference down so neither slides into the other.** Propose: (a) keep **"Reserve"** in PG2 (it's a board-pack-readable accounting noun the founder uses with the buyer; PG2's own map row #9 walks past this intentionally). (b) keep **"Reservoir"** as the Z1 wallet (locked in `xBuckets` Tests 009/010). (c) keep **"Aquifer"** for long-term savings. **The cross-artifact move is to add a one-line footnote** in the PG2 ContractsPage and in the codetry-handbook Z1 chapter that says "*Reserve (PG2 / agency P&L) and Reservoir (Z1 / household wallet) are two different things; the household wallet is downstream of the household's own income, not of the agency's surplus.*" so a reader moving between the two artifacts doesn't conflate them. | Two prose insertions, no code/identifier renames. | applied |
| **P-7** | **"Phenomenon" / "Phenomena" vs "Primitive"**: (a) library `phenomena.tsx` "Phenomena" (cross-industry observed objects + the community noun for them), (b) codetry-handbook `constellationWidePrimitives` (`The Standby`, `The Gate` — load-bearing nouns with vocabulary, ladders, sub-shelves, principles). | S | **These are siblings, not duplicates** — a *phenomenon* in the library is the *raw observation* (a thing happening in multiple places, named differently in each); a *primitive* in the handbook is the *named structure* the practitioner builds on top of an observed phenomenon. Propose: keep both nouns, but add a one-line cross-reference on the library's `phenomena.tsx` page header that says "*A phenomenon, once it has a load-bearing name and rungs and a principle, becomes a* primitive *in the codetry-handbook's constellation. The library is upstream; the constellation is downstream.*" Do not rename either. | Single prose insertion in `phenomena.tsx`. No identifier renames. | applied |
| **P-8** | **"Submission" vs "Entry" vs "Pile"**: (a) headwaters-books `Submissions` (= receipts submitted by food handlers for review), (b) library `Entry` / `Library Entry` (= research documents added to the library), (c) wordpile `Pile` (= a community-specific collection of words). All three name "the unit a contributor adds to the system." | S + G | **Different domains, different content — but the verb pattern is identical (contributor adds → curator/reviewer approves → it joins the canonical collection), and "Submission" is the most generic of the three.** Propose: (a) rename **Submission → Receipt** in headwaters-books (the artifact is *Headwaters Books* — what's being submitted is literally a receipt; "Receipt" is the codetry-aligned noun the food handler uses in the kitchen, and the page already says "Submit Receipt"). The Submissions nav label and page title change to "Receipts"; the route can stay `/submit` for now. (b) keep **Entry** in the library — it's a library-specific noun and reads correctly. (c) keep **Pile** in Wordpile — load-bearing woodshop metaphor, already locked. | (a) is the only change: `Submissions.tsx` page title, the nav label "Submissions" in `Layout.tsx`, the page header in `Submit.tsx` if needed. Internal `submission` ids/types stay until a separate code-rename pass. | applied |

---

## Cross-artifact UI-framework leaks

These are UI words that have crept into three or more artifacts as
user-visible labels. Each row proposes one coordinated swap.

| # | Term | Where it appears | Drift | Proposed replacement | Second-order effects | Status |
|---|---|---|---|---|---|---|
| **U-1** | **"Dashboard"** as a page title or nav label | headwaters-books `Layout.tsx` nav + `Dashboard.tsx` page title; library `App.tsx` route `/dashboard` aliased; practitioner-operating-plan prose "Dashboard / NowView". (PG2 doesn't use it.) | U + S | **See P-3** for the per-artifact replacements. The cross-artifact rule: no user-visible string anywhere in the project says "Dashboard". Internal component filenames may still be `Dashboard.tsx` (deferred to the implementation pass). | Folds into P-3. | proposed |
| **U-2** | **"Workspace"** as a page noun | PG2 `ComparePage.tsx` ("Operating framework workspace" eyebrow, `<SectionCard title="Workspace">`); headwaters-books no occurrences in user-visible labels (internal only); library no occurrences in user-visible labels. | U + G | Already covered by PG2's own map row #2 (rename to "the locked map"). Cross-artifact note: do not introduce "Workspace" anywhere else in the project. | None — fold into PG2 row #2. | proposed |
| **U-3** | **"KPI" / "MoneyKpi"** (component name, not a user-visible string) | PG2 `MoneyKpi.tsx` (~6 import sites); headwaters-books `Dashboard.tsx` "Posted this month" pattern (no `MoneyKpi` import — uses inline numbers); library no occurrences. | U | Already covered by PG2's own map row #5 (`MoneyKpi` → `HeadlineNumber`). Cross-artifact note: if any other artifact later wants the same pattern, use **`HeadlineNumber`** to keep the noun consistent. | Folds into PG2 row #5; cross-artifact only as a forward rule. | proposed |
| **U-4** | **"Banner"** as a component-name suffix | PG2 `ProvisionalBanner.tsx`; codetry-handbook `SyncErrorBanner.tsx`, `UpdateAvailableBanner.tsx`; headwaters-books `UpdateAvailableBanner.tsx` (sibling-component pattern). | U | PG2's row #6 renames `ProvisionalBanner` → `NotYetLockedNotice`. Cross-artifact rule: prefer `*Notice` over `*Banner` for the same shape. **`UpdateAvailableBanner` and `SyncErrorBanner`** are borderline (the codetry-handbook context already calls them "notices" in prose) — recommend renaming to `UpdateAvailableNotice` / `SyncErrorNotice` in the same coordinated pass. | Two extra component renames in the codetry-handbook + headwaters-books on top of PG2's row #6. ~6 import sites total. | proposed |

---

## Cross-artifact abbreviations

These abbreviations appear in three or more artifacts. Each row proposes
spelling them out at every user-visible site (internal code identifiers may
keep the abbreviation per the implementation pass).

| # | Abbreviation | Where it appears | Drift | Proposed replacement | Second-order effects | Status |
|---|---|---|---|---|---|---|
| **A-1** | **POS** (= Point of Sale = the in-store till computer) | deer-lake-store-plan `PosOps.tsx` slide, deer-lake-walkthrough Recap, headwaters-books prose, codetry-handbook future references | A | **Till** — the deer-lake-store-plan already calls it "The till" in the slide subtitle; the abbreviation only survives in section headings and component file names. Rename every user-visible "POS" → "Till"; keep `PosOps.tsx` filename until a code-pass picks it up. | Affects 1 slide title and ~3 prose mentions across the two Deer Lake artifacts. | applied |
| **A-2** | **COGS** (= Cost of Goods Sold) | PG2 `data/saltLedger.ts` ("COGS @ $5.50" column, "TOTAL per-jar COGS" row); appears in deer-lake slides as "Grocery spend"; headwaters-books P&L Report uses "Cost basis" already | A | **Keep COGS in CSV/XLSX exports** (per PG2 row #20 — board readers expect it there). Rename every *on-screen* "COGS" → **"Per-jar cost"** (Salts) or **"Per-unit cost"** (everywhere else); never use "COGS" in a slide or page header. | One column header rename in `saltLedger.ts` (only the on-screen rendering, not the export sheet); ~2 prose mentions. | applied |
| **A-3** | **RT-LTC** (= recreation therapy in long-term care) | PG2 `buckets.ts` brightside tagline + `brightsideLedger.ts` docstring + Brightside page copy | A | Already covered by PG2's own map row #13 (spell out as "long-term care"). Cross-artifact rule: never use "RT-LTC" in any artifact's user-visible copy. | Folds into PG2 row #13. | proposed |
| **A-4** | **ISC / FedNor / LFIF / CRA / AGM** (federal agency / program / governance acronyms) by exact file. **ISC:** deer-lake-store-plan `src/__tests__/lockedNumbers.test.ts`, `src/pages/slides/BandCouncilSummary.tsx`; deer-lake-walkthrough `src/planner/PlannerApp.tsx`, `src/planner/scenarios.ts`, `src/planner/DatePegs.tsx`, `src/planner/dates.ts`. **FedNor:** deer-lake-walkthrough `src/planner/KeyDates.tsx`, `src/planner/dates.ts`; deer-lake-store-plan `docs/read-aloud-audit.md`, `docs/read-aloud-worksheet.md`, `src/pages/slides/FinancialsRole.tsx`, `src/pages/slides/BandCouncilSummary.tsx`. **LFIF:** deer-lake-walkthrough `src/planner/PlannerApp.tsx`, `src/planner/TodayCard.tsx`, `src/planner/OffRamp.tsx`, `src/planner/KeyDates.tsx`, `src/planner/DatePegs.tsx`, `src/planner/scenarios.ts`, `src/planner/dates.ts`, `src/sections/Ask.tsx`; deer-lake-store-plan `docs/read-aloud-audit.md`. **CRA:** codetry-handbook `data/constellation.ts`; practitioner-operating-plan `public/constellation.json`, `src/data/costRegistry.ts`, `src/pages/Today.tsx`, `scripts/export-pdfs.ts`, `src/pages/OnePager.tsx`, `src/pages/LeaseTooling.tsx`; headwaters-books `src/data/constellation.ts`. **AGM:** headwaters-books `src/data/constellation.ts`, `src/pages/Standby.tsx`; codetry-handbook `data/constellation.ts`; practitioner-operating-plan `src/pages/Codetry.tsx`, `public/constellation.json`. | A | **First-use spell-out, then the acronym in parens.** "Indigenous Services Canada (ISC)" on first appearance per slide / per page; "ISC" alone after that on the same surface. Same rule for FedNor (Federal Economic Development Agency for Northern Ontario), LFIF (Local Food Infrastructure Fund), CRA (Canada Revenue Agency), AGM (Annual General Meeting). | Affects ~16 first-use sites across the two Deer Lake artifacts (ISC: 2 user-visible, FedNor: 4 user-visible, LFIF: 8 user-visible — the rest are data files where the acronym is the canonical id and stays); ~6 first-use sites in the operating plan and headwaters-books for CRA and AGM (the constellation manifest entries are the canonical record and stay; the user-visible page surfaces get the spell-out). The codetry-handbook constellation entries that mention CRA / AGM in prose get the spell-out. | proposed |
| **A-5** | **PWA / SaaS / PHI / RLUSD / XRP / MBA** (industry / domain acronyms) | codetry-handbook `constellation.ts` Z0/Z1 entries, PG2 prose, deer-lake-walkthrough Recap | A | **Mixed.** PHI ("Protected Health Information") and RLUSD/XRP keep the acronym (domain readers know them). PWA → "installable web app" on first use. SaaS → keep (universally legible). MBA → keep where it appears in the handbook's adjacent-disciplines chapter (it's a tradition name, not a generic). | One first-use insertion per artifact for PWA. None for the others. | applied |

---

## Borderline rows (walked past intentionally)

These are listed so the founder can see what was *considered as a cross-artifact
rename and not proposed*, with the reason.

| # | Term | Why this is borderline | Recommendation | Status |
|---|---|---|---|---|
| **B-1** | **"Standby" vocabulary** (`call`, `watch`, `standby stock`, `debrief`, the four rungs, the two sub-shelves) — appears in codetry-handbook (source of truth), headwaters-books `Standby.tsx` (pulled from the manifest at runtime), Z0 saltbox manifest entry. | All occurrences already pull from `constellation.constellationWidePrimitives` via the bundled snapshot. There is *zero* drift here — the names match by construction. | **Walked past** — this is the worked example for *what cross-artifact discipline looks like when it works*. No row needed; founder is expected to mark this `rejected`. | rejected |
| **B-2** | **"Pantry"** — the codetry-handbook has "The Common Pantry" as a Standby sub-shelf; the deer-lake-store-plan and walkthrough have "What's on the shelf" / "the shelf" prose; headwaters-books surfaces "The Common Pantry" via the manifest. | These are not in conflict — "The Common Pantry" is a sub-shelf of The Standby (a household/community supply reserve); "the shelf" in the Deer Lake decks is the literal grocery store shelf. Different referents, no cluster. | **Walked past.** The two uses share metaphor family but not referent. Founder is expected to mark this `rejected`. | rejected |
| **B-3** | **"Frame"** — wordpile uses "Frame" as the structural area in the building game; HTML/UI also has `<iframe>` and "frame" as a generic UI term. | The wordpile use is load-bearing (woodshop metaphor) and the UI use never appears as a user-visible label in the project — the collision is only conceptual. | **Walked past.** Keep wordpile's "Frame". Founder is expected to mark this `rejected`. | rejected |

---

## Out-of-scope rows imported from the guide's map

These are rows that PG2's own map (#14, #15) flagged for the project-wide
sweep because the canonical ids live in `@workspace/headwaters-pricing`, not
in PG2 itself. They are restated here so the sweep picks them up.

| # | Term | Where it appears | Drift | Proposed replacement | Second-order effects | Status |
|---|---|---|---|---|---|---|
| **X-1** | **`pilotReserve`** (id) and label "Saved for the next reserve" | `@workspace/headwaters-pricing` (canonical `REINVESTMENT_BUCKETS` definition); read by PG2's `ReinvestmentBucketsInteractive.tsx` and by the practitioner-operating-plan's reinvestment surface | D + G | Rename id `pilotReserve` → **`nextReserve`**. Label stays "Saved for the next reserve". The leftover "pilot" framing is no longer load-bearing — the founder doesn't talk about "pilots" anymore; it's "the next reserve". | One id rename in `@workspace/headwaters-pricing`; one prop/key rename in PG2's `ReinvestmentBucketsInteractive.tsx` `ZERO_CONSEQUENCE` / `ABOVE_DEFAULT` and in any operating-plan surface that reads the same package. ~4 sites total. | proposed |
| **X-2** | **`techCapex` / `toolingSubs` / `trainingRnD`** (reinvestment bucket ids) and their labels | `@workspace/headwaters-pricing` (canonical labels); read by PG2's `ReinvestmentBucketsInteractive.tsx` and the operating plan | A + G | Drop the `Capex` / `Subs` / `RnD` abbreviations and use the on-page consequence prose's words: `techCapex` → **`ownedKit`**, `toolingSubs` → **`toolsWeRunOn`**, `trainingRnD` → **`trainingAndTheGuide`**. Visible labels follow the ids ("Owned kit", "Tools we run on", "Training and the guide"). | Three id renames in `@workspace/headwaters-pricing`; three prop/key updates in PG2; same in the operating plan if that surface reads the package. ~6 sites total. The `RnD` → `trainingAndTheGuide` rename also drops the "R&D" abbreviation that PG2 row #10 separately addresses for the Innovation bucket; the two are coordinated. | proposed |

---

## How to use this map

1. **Founder walks the table top to bottom**, setting each row's status to
   `approved`, `rejected`, or `deferred`. If the proposed replacement is
   close-but-not-quite, the founder edits the **Proposed single name** /
   **Proposed replacement** cell in place and then sets the status to
   `approved` — `approved` always means "apply *what's currently in the
   cell*".
2. **Same-phenomenon rows (P-1 … P-8) come first** because they decide what
   word survives. The UI-leak rows (U-1 … U-4) and abbreviation rows
   (A-1 … A-5) are mostly mechanical once the cluster names are settled.
3. **Borderline rows (B-1 … B-3) are recorded so the founder sees what was
   considered and walked past.** They will most likely land as `rejected`.
4. **Out-of-scope rows (X-1, X-2) belong to the project-wide sweep itself**
   (that is, this map). They are restated from the guide's map because that
   is where the founder asked them to live.
5. Once the table is marked up, a separate implementation task applies
   **only the `approved` rows**, in dependency order, and sets each one to
   `applied` after the rename lands. Recommended order:
   - **First:** P-2 (Bucket cluster) and P-4 (Bright Side / Brightside / the
     inside) — both ripple into ids and surface text in multiple artifacts.
   - **Then:** P-1 (Practitioner / Founder / Curator), P-3 (Dashboard), P-8
     (Submission → Receipt) — surface-text only, low-risk.
   - **Then:** the documentation-only rows P-5, P-6, P-7 (one-line
     footnotes / cross-references).
   - **Then:** the UI-framework rows U-1 … U-4 and the abbreviation rows
     A-1 … A-5 — mechanical sweeps.
   - **Last:** X-1 and X-2 (the `@workspace/headwaters-pricing` package
     renames) — touched after every consumer is on the new vocabulary.
6. After each `approved` row is applied, run `pnpm -r typecheck` and
   `pnpm -r build` from the root and spot-check the affected artifacts in
   the workspace preview. Update the row's status to `applied` only after
   the build is green.

Until the founder has set rows to `approved`, **do not apply any rename**.
`rejected` and `deferred` rows stay in the document as a record — they are
never applied and never transition to `applied`.
