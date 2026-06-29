# Zone 2 Workbench — Build Brief
*Headwaters Development Services · Bobbie Parr · Wabigoon ON, Treaty 3*
*Last updated: June 2026*

---

## What the Workbench is

Zone 2 is where the practitioner works, sells, and accounts. It holds both family conversations and sales pitches — curtains drawn by default, opened intentionally.

This repo is the Workbench. It is not a product. It is the bench where products are built, tested, and handed off. The tools on this bench serve two purposes:

1. **Bobbie's own operating system** — North Star, Kitchen Table, the cockpit, the window
2. **The shelf** — a set of composable modules a practitioner assembles into a client build, then hands off completely

---

## The Zone Model (trust gradient)

```
Z0 — Saltbox / Household    Identity, voice, the mark before anything moves
Z1 — Kitchen Table / Circle  Mutual aid, internal coordination, closest circle
Z2 — Workbench / The Deck   Where the practitioner works, sells, accounts (THIS REPO)
Z3 — Picnic Table / Market   Public-facing, third-party, broader world
```

The Eave Rule is poured concrete: no Z1 household data crosses into Z3 — ever. The Workbench holds both sides but never lets them touch.

---

## What's already built in this repo

### Bobbie's operating system (North Star)
- **Kitchen Table** — AI deliberation council. Six named seats (Saltbox, Smith, Systems, Community, Codetry, Ishmael) + 2 configurable. Full Codetry philosophy baked in as system context. This is Bobbie's thinking process, live.
- **Cockpit / Today / This Week / Weekly / Seasonal** — daily and weekly operating cadence
- **Window Page** — Z3 public transparency portal. Controlled eave flow. Shows "how a community can own its store," engagement pricing, three tests, honest numbers. Already live.
- **Money Machine / Model Page** — four buckets financial engine
- **Constellation tracking** — clients and projects mapped to zones, with contracts and daily picks
- **Workbench Plan** — already in the data model (`WorkbenchPlan` type in `types.ts`)
- **Practitioner Application / Review** — practitioner pipeline management

### Proof-of-concept client build (k-pizza, in Workbench-Tools repo)
The Konstantinos Pizza build is the first full proof of the shelf concept. It has:
- Full admin operating suite (menu, orders, specials, promos, producers, Market Mosaic, settings, catering, school program, hotel program)
- Public website that reflects admin changes (the window pattern)
- Community layer (fundraisers, lunch club, feed-your-team)
- Lead capture and management
- Producer/co-op network management
- Market Mosaic — community market coordination with drag-and-drop ordering

This is the sandman stack in working form. One action in the admin → stacked results across the public site.

---

## The Shelf — what it is

The shelf is a set of composable modules a practitioner (Bobbie, or a licensed practitioner) assembles into a base build for a client. After handoff, the client runs it themselves. The practitioner steps back.

### Design principles for the shelf

**Square-first, manual fallback.** Most businesses in the 807 corridor use Square. Shelf modules have two input modes:
- **Sync mode** — reads from Square automatically. Zero extra work for the owner.
- **Manual mode** — owner enters data directly through a simple admin panel. Same output. No Square required.

The public window doesn't know or care which mode fed it. It just displays.

**The window never goes stale.** The public site is a live reflection of the operating app. The owner manages their business; the website follows. They can publish immediately or schedule a date and time. No developer needed after handoff.

**The story layer is always manual.** Square knows hours, products, prices. It does not know mission, producers, community programs, or grant narrative. Those are always entered by the owner — once, updated as needed.

### Core shelf modules

| Module | What it does | Square syncs? |
|---|---|---|
| **Hours** | Business hours on public site | ✅ Yes |
| **Menu / Products** | Products, categories, prices | ✅ Yes |
| **Active Promo** | Weekly special, event, offer | Partial (owner writes the story) |
| **Story / Mission** | Who you are, why you exist | ❌ Always manual |
| **Producers / Partners** | Local supplier network, credited publicly | ❌ Always manual |
| **Community Programs** | Lunch clubs, fundraisers, school programs | ❌ Always manual |
| **Market Mosaic** | Community market coordination layer | ❌ Always manual |
| **Proof Layer** | Living grant/tax/funding document (see below) | Pulls from all of the above |

### The sandman stack — one action, stacked results

When an owner updates something in their operating app:

```
Owner action (e.g. adds a new product)
  → Public website updates (window reflects it)
  → Proof Layer updates (live data refreshes)
  → Market Mosaic entry suggested (if applicable)
  → Promo template becomes available
  → Print materials flagged as outdated (if applicable)
```

No extra steps. No developer call. No stale website.

---

## The Proof Layer — the most important module

### What it is

A living document that auto-updates as the business operates. It is always current. When the owner needs to write a grant, file taxes, meet with a funder, or report to a board — they open the Proof Layer and generate whatever they need.

### Dual-language design

Every metric in the Proof Layer is written in two registers simultaneously:

> **Plain language** (owner reads this):
> "Your food sales grew 34% this summer, mostly from the lunch program."
>
> **Professional language** (funder/accountant reads the same entry):
> "Q3 revenue increased 34% YoY; primary driver: institutional food service (lunch program), representing 41% of gross revenue."

Same data. Same document. Both parties understand at the gate. The owner doesn't feel talked past. The funder doesn't ask for clarification. No translator needed.

This is sovereignty at the table.

### Output formats

The owner can generate:
- **PDF report** — snapshot of current state, formatted for a specific purpose (grant, tax, investor, board)
- **Live URL** — a funder can bookmark and view anytime; always reflects current data
- **Print-ready summary** — for the meeting folder

### Report types (configurable)

- Grant application support (matches common NNC/ISC/provincial grant language)
- Annual business summary (plain language + CRA-ready numbers)
- Community impact report (outputs for band councils, co-op boards)
- Investor / lender pitch (honest numbers in the Headwaters format)
- Internal practitioner review (Bobbie's view — full operational picture)

---

## The base build — what every client gets

Every client build assembled from the shelf includes:

1. **Public window** — the website. Connected to the operating app. Never stale.
2. **Operating app** — the admin. Square sync or manual. Simple enough to hand off.
3. **Proof Layer** — living document. Auto-updates. Generates on demand.
4. **Story layer** — mission, producers, programs. Written once, updated as needed.
5. **Community hook** — at least one community-facing program (lunch club, fundraiser, producer credits, etc.)

The community hook is not optional. It is what separates a Headwaters build from a regular website. Every build has a way for the community to touch it.

---

## The k-pizza build as reference

k-pizza (Konstantinos Pizza & Wings, Dryden ON) is the proof case. It is the most complete shelf build. When developing new shelf modules, build to the k-pizza standard:

- Admin pages in `artifacts/k-pizza/src/pages/admin/`
- Public pages in `artifacts/k-pizza/src/pages/`
- Data layer via `@workspace/api-client-react` hooks
- Square integration: targeted — sync hours and products, owner writes the story

When bringing k-pizza into this repo, the admin pattern is the template. The API coupling (`@workspace/api-client-react`) needs to be made data-source-agnostic so each client build can have its own backend or use Square directly.

---

## The hinterland build as the simple template

Hinterland & Co. is the minimal shelf build — a clean design template for Square-based businesses with no operational complexity. One public page. Square syncs the basics. Owner writes the story once.

Use hinterland as the starting point for new builds. Add shelf modules on top.

---

## North Star's role in the shelf system

North Star is Bobbie's OS, not a client tool. Its role in the shelf system:

- **Kitchen Table** — where Bobbie deliberates about a new client build (what modules, what scope, what price)
- **Constellation tracking** — each client build is a Constellation in North Star, mapped to its zone
- **Window Page** — Bobbie's own public-facing proof layer (how communities can own their store)
- **Workbench Plan** — Bobbie's view of what's on the bench right now

North Star never gets handed off. It stays on the bench.

---

## The 807-shop — Zone 3

The 807 Food Co-op Producer Storefront belongs in Zone 3 (the market layer), not here. It is a community-owned commerce tool, not a practitioner workbench tool. Move it to Zone 3 when that repo is ready.

The 807-shop's producer management model (the `admin/producers` pattern from k-pizza) is a shelf module — it can be snapped into any Headwaters build that has a producer or partner network.

---

## What needs to be built next

In priority order:

### 1. Bring k-pizza and hinterland into this repo
Copy `artifacts/k-pizza` and `artifacts/hinterland` from `OurHeadwaters/Workbench-Tools` into this repo. Register as artifacts. Do not bring the Workbench-Tools `api-server` — each client build will use this repo's `api-server` or be static.

### 2. Decouple k-pizza admin from its API client
The k-pizza admin uses `@workspace/api-client-react` hooks tightly coupled to its original backend. Abstract the data layer so each module can accept a data source (Square adapter, manual store, or API client).

### 3. Build the Square adapter
A thin sync layer: reads Square Catalog (products), Square Hours, Square Locations. Writes to the local data store. Runs on a schedule or webhook. Owner connects Square once; sync runs automatically.

### 4. Build the Proof Layer (MVP)
Start with a single report type: **annual business summary** (plain language + CRA numbers). Live URL output first, PDF export second. Pull from operating app data. Dual-language rendering.

### 5. Build the publish control
Owner can choose: **Publish now** or **Schedule (date + time)**. Applies to any content update (menu item, special, hours, story). Public site reflects the scheduled state at the right time.

---

## Eave Rule reminders for all shelf builds

- No Z1 household data in any client build
- Square credentials are Z2 (operating layer) — never exposed to Z3 public pages
- Grant/proof documents live at Z2 — generated on demand, never auto-published to Z3 without owner action
- The public window is Z3 — it sees only what the owner explicitly published

---

## Vocabulary (load-bearing — use precisely)

| Term | Meaning |
|---|---|
| The shelf | Composable module library a practitioner assembles into a client build |
| The window | The public website — always reflects the operating app |
| The operating app | The admin the business owner uses day-to-day |
| The proof layer | Living grant/tax/funding document, auto-updated, dual-language |
| Sync mode | Square (or other POS) feeds the data automatically |
| Manual mode | Owner enters data directly — no POS required |
| Sandman stack | One owner action → stacked results across window + proof + community |
| Constellation | A client or project tracked in North Star, mapped to its zone |
| Handoff | The moment Bobbie steps back and the client runs it themselves — the goal of every build |
| Community hook | The mandatory community-facing program in every build |

---

*"Build it. Hand it off. Community runs it."*
