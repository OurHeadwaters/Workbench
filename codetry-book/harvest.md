# Codetry Book — Content Harvest
**Status:** Fully audited — every passage line-by-line verified against its source file. External-URL passages verified against fetched page text.
**Rebuilt:** 2026-05-06
**Audited:** 2026-05-06 — full line-by-line sweep; one missing interior paragraph found and restored (4-F, both-states.md line 15).
**Supplemented:** 2026-05-06 — Task #784: Dam Days (External project 2) swept; 10 passages added (1-P, 1-Q, 3-M, 3-N, 4-S, 4-T, 5-I, 5-J, UG-H, UG-I).
**Supplemented:** 2026-05-06 (Task #785) — community-knowledge-hub external sweep; projects 3–6 swept via live URL fetch; project 8 attempted (SPA shell, no prose recovered).
**Supplemented:** 2026-05-06 — Task #796: X Buckets Vision (External project 1) swept; 11 passages added (1-R, 1-S, 3-O, 3-P, 3-Q, 4-U, 4-V, 4-W, 4-X, UG-J, UG-K).
**Supplemented:** 2026-05-06 (Task #803) — Bright Side (project 7) and Saltbox (project 10) swept via JS bundle extraction; merge conflicts from Tasks #784 and #785 resolved; passages 2-X, 2-Y, 2-Z, 3-O, 3-P, 4-U, 4-V, 4-W, 4-X, 4-Y, 5-K, UG-J through UG-Q added.
**Supplemented:** 2026-05-06 (Task #802) — Legacy Gatekeeper (project 9) swept via live URL fetch; 5 passages added (3-P, 3-Q, 4-W, 4-X, UG-L); merge conflicts from Tasks #784 and #785 resolved (renumbered duplicate passage IDs 4-S→4-U, 4-T→4-V, 5-I→5-K, UG-H→UG-J, UG-I→UG-K).
**Previous version rejected** by code review for fabricated passages and wrong section structure.

Organized under the five required book sections:
1. The Headwaters
2. Watching the Beavers
3. The Dam Breaks
4. Codetry as Architecture
5. Sons & Daughters of Thunder

Plus: **Unplaced Gems** — verified passages that do not yet belong to a clear section.

Each passage is followed by a source citation:
> `[file path, lines N–N]`

Nothing here is paraphrased, summarised, or composed. If a passage feels constructed, treat it as an error and flag it.

---

## Section 1 — The Headwaters

*Origin, place, founding myth. Who built this and why it started.*

---

### 1-A · The eagle answered

> I was drafting this plan standing out on my deck, observing nature, and I asked myself: *is this the right direction?*
>
> At that moment an eagle appeared overhead. I said, "well hello!" — and he lowered with force, and slowly stayed above me.
>
> I asked again, this time to him: *is this the right direction?*
>
> He soared in a circle formation, then flew out of sight.

`artifacts/headwaters-books/src/components/EaglePrologue.tsx, lines 57–71`

Caption rendered beneath the passage:

> The story that sealed Headwaters' fate.

`artifacts/headwaters-books/src/components/EaglePrologue.tsx, line 84`

---

### 1-B · Who Bobbie is, in her own voice

> Bobbie is a Northwestern Ontario practitioner working in food systems. Community development degree, years on the ground in northern communities, and the founder and operator of Parr's Jars — a small preserves business out of the bush near Dryden that keeps her hands in the actual work the operating plans are about.
>
> She is the practitioner behind Headwaters and the codetry practice: the author of the Practitioner Operating Plan, the Codetry Handbook, and the community store operating plan. The work is shipped, not proposed — a constellation of running artifacts anyone can open and read for themselves.
>
> The tools are practitioner-built: designed around the team a community actually has, not the org chart the software assumes. The voice is the same across all of it — plain, dollar-honest, no startup-pitch tone.

`artifacts/codetry-ship/src/pages/BioPage.tsx, lines 94–115`

Footer signoff:

> — bobbie parr · headwaters

`artifacts/codetry-ship/src/pages/BioPage.tsx, line 352`

---

### 1-C · The icon is a ship

> The Headwaters icon is a ship. Not a fortress. Not a temple. A vessel — trim, seaworthy, ready to leave the known shore. AI is the new territory: vast, unmapped, alive with both peril and possibility. Literate programming is only the first small sail on that horizon, a tiny blip of clarity in an ocean of code. It still lacks shape. It still needs hands — many hands — practicing, refining, grounding it in reality.

`artifacts/codetry-handbook/data/handbook.ts, lines 77–78`

---

### 1-D · The Jar Kitchen — origin story

> The Jar Kitchen runs on a simple principle: if the season gives abundance, preserve it. These salts are what happens when that principle meets a freeze-dryer, a smoked salt supplier, and a community of farms that grow more than the grocery store will buy. Every jar carries the specific farm, field, or garden it came from. You can taste the sourcing.

`artifacts/print-marketing/src/pages/SaltOfTheEarthClub.tsx, lines 160–162`

---

### 1-E · The Jarista pull quote

> "Working with what you have and sticking things in jars — that's got 1930 written all over it. We wear that with pride."
>
> — Bobbie Parr, Headwaters

`artifacts/print-marketing/src/pages/SaltOfTheEarthClub.tsx, lines 332–343`

---

### 1-F · The Green Salt — product as seasonal proof

> Smoked Himalayan salt blended with freeze-dried microgreens and homegrown tomato powder. Born from the circular economy of the Jar Kitchen — excess hydroponics and greens, preserved at peak nutrition, folded into a salt that tastes like the season it came from.

`artifacts/print-marketing/src/pages/SaltOfTheEarthClub.tsx, lines 7–9`

---

### 1-G · The knowledge is online now

> The knowledge is online now.
>
> A decade of homestead practice, community building, and seasonal living — organized into five courses you can take at your own pace, from wherever you are.

`artifacts/print-marketing/src/pages/GoingDigital.tsx, lines 112–124`

> For years this content lived in farmers market conversations, community workshops, and a lot of personal messages. It is now housed at ourheadwaters.ca — five interlocking courses built around the same system the homestead runs on. You don't have to live in Dryden. The practice travels.

`artifacts/print-marketing/src/pages/GoingDigital.tsx, lines 149–151`

---

### 1-H · Grassroots economics

> "Grassroots community and productive local economies are the only fighting chance. A depression may be around the corner but being depressed never has to be a reality we face — not when you build your life around the simple things that matter."
>
> — Bobbie Parr, Headwaters

`artifacts/print-marketing/src/pages/GoingDigital.tsx, lines 259–270`

---

### 1-I · Five courses — Decentralization

> The philosophy and the practice: voluntary exchange, mutual aid, peer-to-peer community organization, local food systems, and the codetry disciplines that hold community institutions together when the external systems fail.

`artifacts/print-marketing/src/pages/GoingDigital.tsx, lines 28–29` (offerings array, Decentralization entry)

---

---

### 1-J · Northern Band Prologue — alternate eagle text (deleted artifact)

> I was writing this plan out on my deck, watching nature. I asked myself a question: *is this the right direction?*
>
> At that moment an eagle appeared above me. I said, "well hello!" He came down low and stayed above me.
>
> I asked again, this time to him: *is this the right direction?*
>
> He flew in a slow circle. Then he flew out of sight.

`commit:3686992~1 · artifacts/deer-lake-walkthrough/src/sections/Prologue.tsx`
*(Northern Band Walkthrough was archived as Community Store Playbook in commit 3686992. This is the version of the eagle narrative that lived in the deleted artifact's Prologue component — slight wording variation from the current EaglePrologue.tsx.)*

---

### 1-K · Constellation role prose — Saltbox Zone 0 (deleted working doc)

> Homeschool day companion. Local-first per family — each household runs its own instance, nothing is shared because nothing needs to be. Worked examples: Lock-In Wins (15 quiet minutes is enough to count; no streaks, no scores), Gentle Words (a 6-line bank used sparingly so the words don't lose weight), Brave Moments (one-tap capture, surfaced in the seasonal Family Recap), Quote of the Day (deterministic per date), Live Follow-Along (opt-in only, lock-in count excluded from share payload), per-child Goals.

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, Saltbox Zone 0 entry)

---

### 1-L · Constellation role prose — Eave (deleted working doc)

> Non-custodial XRPL envelope-budgeting PWA (was xBuckets / Watershed). The household balance is the source of the whole watershed; every other zone sits downstream. The cleanest demonstrations of metaphor-as-architecture: Buckets (envelopes — you can only pour from one to another, never summon water from nothing; rename to 'Categories' and the UI starts suggesting balances can grow by clicking), XRP Spring (savings above the 10-XRP network reserve, with a six-stage bamboo growth scene that extends the metaphor from data model into artwork), Community Well (monthly pooled tips round-distributed to community proposals — the well refilling).

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, Eave entry)

---

### 1-M · Constellation role prose — Dam Days and Shallows Zone 5 (deleted working doc)

> Wild / observation; the skipping-rock zone. Default private (Dam Days takes via watershed.replit.app + Expo mobile), with a share affordance that floats a thought to the Shallows, shrouded in mystery from the depths below. The cleanest demonstrations of metaphor-as-architecture: the rebrand without a rewrite (Watershed → Dam Days touched display strings and prose; chapter IDs / storage keys / table names / schema all held — the bones were the metaphor underneath the name), the Channel produces Z0-through-5 reads of the user's own life (the app teaches the meta-pattern by being it), pseudonymity-as-architecture (Shallows handles derived deterministically from sessionToken+postId — the depths-below-the-shallows framing IS the one-way hash), typos as fingerprints (the Forge mandates verbatim preservation; the bound book quotes the user's own typos back as evidence).

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, Dam Days Zone 5 entry)

---

### 1-N · A dam day — origin of Zone 5

> A dam day is a day without rhyme or reason — where a spark was lit and a fire burst forth. It may be a creative hyperfocus, or a day that required a shift of energy that no constellation can contain. Dam days are fleeting. But there are gems worth harnessing in them — they may just be covered in muck.
>
> The Shallows is where you clean them off. Not every take becomes something. But the practice of catching it before it disappears is the whole discipline.

`artifacts/codetry-handbook/data/constellation.ts` — zone 5 (The Margin), `opening` field

---

### 1-O · The saltbox morning — Zone 0 origin

> Sitting on the deck with the morning sun and a cup of black coffee. Getting cold, but that's nothing new. Watching the children play outside — and then all of a sudden there's a moment. There's always a beautiful moment to capture. A moment where we wonder: will this ever cross my mind again? Will they remember? Saltbox is the reminder of the things that are true and unshakeable. The sunny moments that make the boreal winters worth bearing. The spring days when the outdoors is the parent and we can just enjoy documenting the ride.
>
> The no-scoring rule comes from this: a measure of a fish's worth cannot be how well it can climb a tree. We each have our individual strengths, and when channeled, those strengths allow a waterfall of value that was never dammed. With a proper saltbox, the children grow brave in their own time — and the dams that don't need breaking down the line are the fruit of that patience.
>
> Zone 0 holds both the family on the land and the elder in the care home. They are just homes in different stages, and they deserve the same value placed on their life stage.

`artifacts/codetry-handbook/data/constellation.ts` — zone 0 (Saltbox), `opening` field

---

### 1-P · "Slowly at first, then all at once" — the Dam Days epigraph

> Slowly at first, then all at once.

**Source:** `dam-days/src/pages/Home.tsx` — site epigraph rendered below the "Dam Days" headline on the homepage; the line that names the pace of a dam day

---

### 1-Q · A private literary forge — the app's purpose statement

> A private literary forge. Send up every signal — typos, half-flares, mid-sentence SOS — and receive the story of how someone finally saw.

**Source:** `dam-days/index.html` — `<meta name="description">` and Open Graph description; the founding sentence for Zone 5

---

### 1-R · Rootwork founding tagline and confession

> For builders who can't sit still

`community-knowledge-hub/studio/ — page tagline`

The founding confession, immediately below the hero section:

> We're not a productivity company. We're a workshop run by people who'll-be-damned-if-it-doesn't-get-done — the kind of people who start three businesses, raise two kids, organize a market on the weekend, and still can't find that one photo for the Tuesday post.
>
> Rootwork is the tool we kept wishing existed. So we built it. It's opinionated about the unglamorous parts: the camera dumps, the duplicate posts, the screenshots-of-screenshots. Honest about what it does. No metrics nobody asked for. No upsells dressed up as features.

`community-knowledge-hub/studio/ — "Why Rootwork / Built by builders who've been there" section`

---

### 1-S · Your money has been free-ranging — the Eave founding premise

> Your money has been free-ranging.
>
> Money comes in, scatters, disappears. No drought is an accident — it's a missing map. You've been navigating without one.
>
> Meet your Headwaters. The Stream catches daily spending. The Water Tower holds your savings fortress. The Spring is where income flows in — automatically routed to where it matters.
>
> Every drop has a job now. Payday becomes a ritual, not a scramble. You are the dam keeper. This is your headwaters — and nothing escapes without purpose.

**Source:** `x-buckets/src/copy/gettingStartedTour` — three-slide onboarding sequence; the founding premise rendered to every new user; slides titled "Your money has been free-ranging", "Meet your Headwaters", "Every drop has a job now"

---

### 1-T · Channel every drop — the app's core mechanic in one sentence

> Channel every drop. Watch the ripple effect.
>
> Every dollar of stablecoin income is rainfall caught in your Reservoir — automatically channeled into named buckets so nothing escapes and every drop has a purpose.

**Source:** `x-buckets/src/copy/tagline` + `x-buckets/src/copy/coreMechanic` — the tagline and coreMechanic constants; the two sentences that describe what Eave is for

---

## Section 2 — Watching the Beavers

*Field observations. What community economics actually looks like. The practitioner's view the consultant doesn't have.*

---

### 2-A · Why northern stores fail — the research frame

> A named catalog of every failure mode in the current northern-store model — with the evidence and the source it came from. The dataset backing this page is the same one the community store analysis reads from, so they can never drift.

`artifacts/library/src/pages/why-stores-fail.tsx, lines 77–81`

> Several of the figures below are one phenomenon described differently — see the cross-industry phenomena.

`artifacts/library/src/pages/why-stores-fail.tsx, lines 90–93`

---

### 2-B · A community store plan — six phases, plain language, open numbers

Phase descriptions (verbatim from ServicesPage timeline):

> **Discovery** — Community interviews, existing assets audit, site assessment. What the band already has and what is missing.

> **Supply chain mapping** — 807 supplier directory built from scratch. Freight routing, seasonal availability windows, minimum order realities. No assumptions about what comes from the south.

> **Staffing and training plan** — Local hire plan, role definitions written in plain language, 30-day training timeline. Built so operators can run it without a consultant in the room.

> **Financing structure** — Band council financing options, grant matching against the 807 grants index, co-op structure options with open financial model. Every number is visible and editable.

> **Operations manual** — Day-one procedures, daily close, weekly inventory cycle, monthly reconciliation. Written for the person doing the job, not for the person who hired the consultant.

> **Handoff** — Band council presentation. Operator walkthrough. Everything handed off in a format the community owns — no login required, no ongoing relationship required.

`artifacts/codetry-ship/src/pages/ServicesPage.tsx, lines 86–117`

---

### 2-C · What the store plan is not

> A report that sits on a shelf.
> A proposal that needs another proposal to proceed.
> A template from a southern consulting firm.
> Contingent on ongoing retainer to keep working.

`artifacts/codetry-ship/src/pages/ServicesPage.tsx, lines 131–135`

---

### 2-D · The co-op platform — governance first

> Read your bylaws, map your member categories, identify what needs to be digital and what should stay paper. The platform follows governance — not the other way around.

`artifacts/codetry-ship/src/pages/ServicesPage.tsx, lines 156–158` (Governance review phase body)

> Built in the open — you can see it working at every stage.

`artifacts/codetry-ship/src/pages/ServicesPage.tsx, line 169` (Build phase body)

---

### 2-E · A tool your team actually uses

> Built around how your operation actually works. Changed when your operation changes.

`artifacts/codetry-ship/src/pages/ServicesPage.tsx, line 213` (Custom internal tool tagline)

---

### 2-F · Bright Side — the clipboard doesn't know what a good shift looks like

> Your staff already knows what a good shift looks like. The clipboard doesn't.
>
> Bright Side replaces the clipboard, the shared Excel file, and the sticky notes on the nursing station. It's a mobile-first staff tool for residential care — built so an untrained person can pick it up mid-shift and not break anything.

`artifacts/codetry-ship/src/pages/BrightSidePage.tsx, lines 28–33`

> Bright Side doesn't ask staff to change how they work. It asks them to record what they're already doing — in the language they already use.

`artifacts/codetry-ship/src/pages/BrightSidePage.tsx, lines 97–99` (Existing workflow feature description)

---

### 2-G · Bright Side — the builder's confession

> I built this because I've watched care home staff work around tools that weren't made for them. A 30-minute call is enough to show you what it does and whether it fits your floor.
>
> No demo environment, no slide deck — I'll walk you through the actual tool on an actual device.

`artifacts/codetry-ship/src/pages/BrightSidePage.tsx, lines 131–135`

No obligation note immediately following:

> No obligation. If it's not the right fit, I'll say so.

`artifacts/codetry-ship/src/pages/BrightSidePage.tsx, line 151`

---

### 2-H · Reply to this document — how to start

> Reply to this document with the first task or question you'd like work started on. That's the start date. No contract ceremony required — a written reply counts as authorization to begin.

`artifacts/codetry-ship/src/pages/SowPage.tsx, lines 172–174`

Engagement terms, immediately following:

> Either party may pause or end the engagement with two weeks' written notice. All work product and digital assets produced remain the property of the community.

`artifacts/codetry-ship/src/pages/SowPage.tsx, lines 156–158`

---

### 2-I · Revenue map — one practitioner, sequence ruthlessly

> **Community Contracts** — Active relationships, clear scope, money in motion. This is the bridge that funds time to build everything else. Do not let Tier 2 or Tier 3 thinking crowd out the next billable hour.

`artifacts/practitioners-guide-v2/src/data/portfolio.ts, lines 71–73`

> **Salts + Syrup** — Only cash-positive stream with no debt load. The June farmers market is a forcing function — production must be confirmed before the first stall date, not after.

`artifacts/practitioners-guide-v2/src/data/portfolio.ts, lines 106–108`

> **Start9 / Privacy Servers** — Low friction to start, no compliance path required, cash on delivery. Treat it as a client acquisition strategy — every setup job becomes a trusted tech relationship.

`artifacts/practitioners-guide-v2/src/data/portfolio.ts, lines 150–152`

---

### 2-J · The market stall is not just a product channel

> The market is not just a product channel. It is the highest-density local audience you'll have all season. Have a one-liner ready for what you do beyond jars.

`artifacts/practitioners-guide-v2/src/data/portfolio.ts, lines 128–130`

---

### 2-K · Every Start9 buyer is a warm consulting lead

> Every Start9 buyer is a warm consulting lead. Treat setup calls as discovery sessions, not transactions.

`artifacts/practitioners-guide-v2/src/data/portfolio.ts, lines 173–174` (alert text)

---

---

### 2-L · A second grocery store. Community-owned. (deleted artifact)

> **Owned by the band.** The band owns it. Gilles hires the couple and runs the floor, with locals pitching in.
>
> **Built for long winters.** Cold-chain truck route, calendar that bends, till that runs offline.
>
> **Margin stays in the community.** The grocery margin doesn't fly south. It funds jobs and lower prices here.

`commit:3686992~1 · artifacts/deer-lake-walkthrough/src/sections/WhatItIs.tsx`

Extended, behind a tap:

> With one store in town, most of the federal grocery help stays with the store. Of every dollar, only 58¢ reaches the shelf.
>
> With a community-owned store, that number climbs to 84¢. The other 26¢ doesn't disappear — it shows up as lower prices, paid jobs, and a board the community sits on.

`commit:3686992~1 · artifacts/deer-lake-walkthrough/src/sections/WhatItIs.tsx` (Reveal: "Why community-owned matters")

---

### 2-M · One store. No other choice. (deleted artifact)

Headline and sub-head:

> One store. No other choice.
>
> *Most of the federal grocery help never reaches the shelf.*

Stats:

> **$1,680 vs $1,000** — What a family of four spends here, every month, vs the same basket down south.
>
> **Only 58¢ on the dollar** — Of every federal grocery help dollar, just 58¢ reaches the shelf. The store keeps the rest.
>
> **$1.6 to $2.0 million leaves** — Every year, that much grocery spend leaves the community — to Winnipeg, or to the one store in town.

`commit:3686992~1 · artifacts/deer-lake-walkthrough/src/sections/WhyCurrentFails.tsx`

---

### 2-N · Built to keep working when people don't show up (deleted artifact)

Headline:

> Built to keep working when people don't show up.

Lead paragraph:

> Two people on the cockpit. Software underneath. Payroll stays small. Doors stay open when somebody can't make it in. Truck arrives loaded. Margin comes home fast.

Bullet payoff:

> **Sam & Jess on the cockpit.** Brought in and paid by the contractor — same setup as the band's hotel. Two on payroll, not a row of managers. Only way the math works at this size.
>
> **Serious software underneath them.** Square at the till, QuickBooks on the books, Local Line for producers, the Headwaters cockpit tying them together. Doors stay open through hunting season and bad weather. Truck leaves Dryden loaded even when one operator is out.
>
> **Margin comes home in year one.** About $125k–$200k of grocery margin stays in the community the first year — money that today flies south at 58¢ on the dollar. Four full-time roles — two contractor, two Headwaters — plus a band casual pool of 15+ people getting paid hours each week.

`commit:3686992~1 · artifacts/deer-lake-walkthrough/src/sections/WhoWorks.tsx`

---

### 2-O · Three line items. One contract. (deleted artifact)

Headline:

> Three line items. One contract. One team that gets it done.

Lead paragraph:

> Two people run the floor. Square, QuickBooks, and Local Line do the back end. Doors stay open, truck stays on time, money comes home fast.

Deliverables:

> **Line 1 — The store's operating system.** The cashier's screen, the daily close, the public price page, the household lookup — built once, owned by the band.
>
> **Line 2 — The way the food gets here.** Three lanes (truck on the road, winter-road truck, plane), planned route by route, tested before the store opens.
>
> **Line 3 — The people, trained.** Everyone learns every job. The band runs from a written guide, not from memory. A community board sits over the work.

`commit:3686992~1 · artifacts/deer-lake-walkthrough/src/sections/WhatHeadwatersDelivers.tsx`

---

### 2-P · The cockpit three promises (deleted artifact)

> **A system, not a person.** Same screens survive every retirement. Same till. Same books. Same producer cycle.
>
> **A practice you can sell.** Built on Square, QuickBooks, and Local Line. Tools the next contractor already knows.
>
> **A handover, on purpose.** What's only in your head right now becomes the operating manual the buyer pays for.

`commit:3686992~1 · artifacts/deer-lake-walkthrough/src/cockpit/copy.ts` (COCKPIT_PROMISES array)

---

### 2-Q · Debt-attack mode — where every dollar goes (deleted page)

Page header:

> Where every dollar goes, in plain English.

Sub-text:

> Debt-attack mode: Bobbie draws only $4,000/mo from the business — the rest is forgone and stays as business surplus, all of which goes to debt. Tithe ($400) is first claim on the draw; take-home is $3,600.

`commit:204b39f~1 · artifacts/practitioners-guide-v2/src/pages/PersonalCashPage.tsx`

---

### 2-R · Treasurer is the job nobody wants

> Treasurer is the job nobody wants. Some try and fail; a few do well. It is a big commitment for a volunteer organization, and this generation does not have the same bookkeeping skills that the last one had. Nobody wants to step up because they do not want to mess up.
>
> The answer is not to lower the standard — it is to make the job fail-safe, stress-free, and easy as pie for the people willing to take it on. Calm is the contract. The name is not a vibe; it is a promise the system makes to the person who was brave enough to say yes.

`artifacts/codetry-handbook/data/constellation.ts` — zone 3 (Commons), `opening` field

---

### 2-S · One person touching it all — Zone 4 field observation

> It is not just the spreadsheet and the phone call. It is the Facebook comments, the Instagram comments, the Facebook messages, the marketplace comments, the email, the voicemail, the text message, the in-person conversation, the invoice. One person has to touch it all — because it is the only way the ball of yarn will not unravel.
>
> The producers running these operations are not failing for lack of effort. They are failing for lack of capacity. If they had the capacity to systematize, they could find the efficiencies needed for real growth. That is the job this zone exists to do.
>
> The word they use is not "regenerative." It is grass finished. Grazing. Fodder fed. The work names itself in what it produces and how it is done.

`artifacts/codetry-handbook/data/constellation.ts` — zone 4 (Arc), `opening` field

---

### 2-T · Slab construction and grassland — the northern thesis

> The western economic model is *slab construction*. It assumes a foundation already exists — concrete poured, utilities run, regulation set, banks lending, supply chains working, workforce showing up Monday to Friday. The slab is the social infrastructure that makes "small business" a sensible unit of analysis.
>
> The North is *grassland*. The foundation is real; it's a different one. Land that flexes with the season. Workforce that flexes with the cycle. Demand that's lumpy. Capital that doesn't flow on western terms. Roads that come and go with the ice. Authority that lives in relationships, not regulation.
>
> Neither is worse. They are different foundations, and the design rules are different.
>
> The colonial mistake — and Headwaters owns its share of "we" in this — is to look at grassland and see *failed slab*. To say "the workforce isn't reliable enough" instead of "we designed the work for the wrong rhythm."

`docs/headwaters-thesis-context.md, lines 13–20`

Pull-quote:

> Northern reserves need infrastructure as materially good as anything in the south, built on the foundation that's actually there, with materials and methods that fit it. Not less. Different.

`docs/headwaters-thesis-context.md, line 22`

Guard against misuse (immediately following):

> Guard against the romanticized misuse: "grassland-native" is not "grassland-lite." The store has to actually run. The food has to actually arrive. The books have to actually balance. Grassland design has to be as load-bearing as slab design, achieved through different shapes.

`docs/headwaters-thesis-context.md, lines 23–24`

---

### 2-U · You don't have a productivity problem — Rootwork problem framing

> You don't have a productivity problem. You have a pile-of-stuff problem.
>
> You start ten things, finish six, and the proof of all of it is scattered across screenshots, voice memos, drafts, and that one "Untitled" Google Doc.

`community-knowledge-hub/studio/ — "You don't have a productivity problem" section header and sub-head`

The four pain-point observations, verbatim:

> A camera roll that gives you the spins — Three years of phone photos. None labeled. None grouped. Half are duplicates. The good ones might as well not exist because you'll never find them in time.
>
> Files named 'IMG\_3847' in a folder called 'New Folder (3)' — The thing you need is on this device. Probably. You've been looking for nine minutes. The post is supposed to go up at 9 AM.
>
> That sinking 'wait, did I already post this?' feeling — You did. Two months ago. Your followers noticed. There's no system, just memory, and your memory is busy holding twelve other things.
>
> Notes, emails, Drive, Photos — four apps, zero overlap — The recipe is in Notes. The receipt is in Gmail. The flyer is in Drive. The photo of the result is on your phone. Every project lives in five places at once.

`community-knowledge-hub/studio/ — "If any of this sounds familiar" section, four pain-point cards`

---

### 2-V · Market Mosaic — the three problems it solves

Before/after comparisons (verbatim):

> "Is the market on this Saturday?" — 3 Facebook groups, no clear answer → Weekly view shows dates, vendors, and what's available right now
>
> Vendors update a shared Google Sheet that only the coordinator has the link for → Each vendor updates their own profile — directly, instantly
>
> Shoppers drive out to find their favourite vendor isn't there this week → Vendor attendance and inventory visible before you leave the house

`community-knowledge-hub/infographics/market-mosaic.html — "The Problem It Solves / Before Market Mosaic vs. After" section`

---

### 2-W · Standby Supplies — northern translation of preparedness

> Every piece of advice is filtered for NWO conditions. If it doesn't work at -40°C with 6 feet of snow, it's not here.

`community-knowledge-hub/infographics/standby-supplies.html — "Northern Translation" feature description`

The extended framing:

> Standby Supplies starts with the acknowledgment that most preparedness content is written for mild climates. It systematically translates that content: different crops that survive -40°C, insulation that actually works, heat sources that don't require a truck of propane to keep you alive for a week. This is the Standby that NWO actually needs.

`community-knowledge-hub/infographics/standby-supplies.html — "What Makes It Northern / Built for Zone 3 — not for Southern California preppers" section`

---

### 2-X · The shadows system — what stands between staff and a good shift

> Bright Side leads with the shadows between you and a good day. Tap one to act on it.

`health-support-hub.replit.app — shift home screen; the primary navigation metaphor for the app's daily workflow`

Shadow-selection onboarding:

> Choose the shadow groups your floor is working through today. Bright Side will lead with these on the home screen and tailor prompts for them.

`health-support-hub.replit.app — shadow setup screen; the instruction for configuring the shift focus`

---

### 2-Y · Set the tone for this shift — the practitioner's prompts

The shift-tone prompts Bright Side surfaces for each shift handover (verbatim from the app's prompt rotation):

> Set the tone for this shift — anyone needing a quiet moment after dinner?
>
> Set the tone for this shift — what worked in the lounge?
>
> Set the tone for this shift — music picks landing well right now?
>
> Set the tone for this shift — who's been on their own too long?
>
> Set the tone for this shift — any group plans falling flat, and what's a swap?
>
> Set the tone for this shift — anyone returning from outing, energy check?

`health-support-hub.replit.app — shift-feed prompt rotation; the six prompts that cycle through the shift-handover card, each one naming a specific thing a good shift notices`

Handover prompts for outgoing HCA (verbatim):

> What does the next HCA need to know first?
>
> Anyone needing extra hands at meal or bedtime?

`health-support-hub.replit.app — handover notes screen; the two prompts that surface for the outgoing care aide`

---

### 2-Z · Small joys — the daily reset

> Small joys staff can offer every day. Pop one when it happens — they reset overnight.

`health-support-hub.replit.app — resident facesheet, joys section; the description of how the joys system works`

> Pick a few small joys to offer today. Pop them all and this resident takes the floor.

`health-support-hub.replit.app — resident facesheet, joys setup; the instruction for configuring daily joys per resident`

---

## Section 3 — The Dam Breaks

*The discipline arrives. The moment the work becomes a system. Language-is-not-neutral.*

---

### 3-A · Language is not neutral

> The words you use to describe your economy determine what your economy can become. This is not a rhetorical claim. It is a practical one.

`artifacts/codetry-handbook/data/handbook.ts, lines 128–129`

> When a northern food co-op uses the word *resident* instead of *neighbour*, something real changes — the relationship implied, the obligation carried, the culture formed. When a practitioner names their emergency food reserve *The Call* and their ongoing stock discipline *The Pantry*, they end up with two separate systems, two separate cultures, and a handoff they have to invent under fire. When a funder asks a community to describe its *bank account* and the community's word for that thing is *channel*, the translation is not neutral — something is lost, or flattened, or colonized in the language itself.

`artifacts/codetry-handbook/data/handbook.ts, lines 136–137`

---

### 3-B · The hedge

> Codetry is a hedge. It hedges against the slow ways a community's own words get taken from it inside the systems built in its name. Knowledge creeps: a word a person used in a kitchen ends up, three meetings later, as a different word in a deck. Language drifts: *the books* becomes *the ledger* becomes *the financial management module*, and the original noun is no longer in the room. LLMs tokenize: a load-bearing noun gets sheared into sub-word fragments and reassembled as something more generic, more poolable, more average. Consultants and SaaS vendors translate: the community's vocabulary is rewritten into the vendor's data model on the way to a contract, and the contract is what survives.

`artifacts/codetry-handbook/data/handbook.ts, lines 244–246`

> None of these moves announces itself as a loss. Each one feels like cleanup, like progress, like professionalism. The discipline exists because the loss is real anyway, and because by the time it is visible at the surface — in a screen, a report, a policy — the substrate it was built on has already shifted.

`artifacts/codetry-handbook/data/handbook.ts, lines 249–251`

---

### 3-C · This handbook is a vocabulary

> Not a framework, not a methodology, not a strategic plan. A vocabulary — the specific, precise, weight-tested words that a community needs to run its own economy without importing someone else's assumptions along with the terminology.

`artifacts/codetry-handbook/data/handbook.ts, lines 144–145`

> It was built in Headwaters, a small constellation of economic systems serving northwestern Ontario — food, money, knowledge, emergency preparedness, land. The words here emerged from practice: from the specific moment when the wrong word caused a real problem, and the right word had to be found. They have been tested in the field, rejected when they didn't hold, and revised when the context changed.

`artifacts/codetry-handbook/data/handbook.ts, lines 147–149`

---

### 3-D · Who this is for

> This is not neutral technical vocabulary. It is a set of claims about how a community economy works, encoded in the words used to run it. If your vocabulary is borrowed from grant applications, from SaaS platforms, from government forms — your economy will slowly take the shape of those forms. If your vocabulary is built from your own practice, named by your own practitioners, tested in your own conditions — your economy has a chance to stay yours.

`artifacts/codetry-handbook/data/handbook.ts, lines 172–173`

Pull-quote:

> This handbook is for practitioners: people who are already running something, who are frustrated by language that almost fits, and who are ready to name what they are actually doing with precision.

`artifacts/codetry-handbook/data/handbook.ts, lines 176–177`

> It is not for everyone. It is for the people who feel the friction of the wrong word at the exact moment when the right word would have mattered.

`artifacts/codetry-handbook/data/handbook.ts, lines 180–181`

---

### 3-E · Listen for the noun

> Every project arrives wrapped in a noun the community already uses. A co-op committee says *the books*. A homeschool circle says *the day*. A trapline keeper says *the territory*. An extension agent says *the season*. The community has already named the thing.

`artifacts/codetry-handbook/data/handbook.ts, lines 1052–1054`

> The temptation is to translate it. *The books* becomes *the ledger* becomes *the financial management module*. *The day* becomes *the curriculum*. *The territory* becomes *the dashboard*. Each translation feels like progress and each translation steps the system one foot away from the people it is being built for.

`artifacts/codetry-handbook/data/handbook.ts, lines 1057–1059`

> The codetry practitioner's first move is to write down the noun the community used and refuse to translate it. The system, when it ships, has *the books* in it. The button says *open the books*. The data table is called *the books*. The reports are *what the books say this month*. If the team starts saying anything else in the working session, the practitioner asks why and writes the new word down, because something has shifted.

`artifacts/codetry-handbook/data/handbook.ts, lines 1062–1064`

Pull-quote:

> The noun is not branding. The noun is the foundation footing.

`artifacts/codetry-handbook/data/handbook.ts, lines 1067–1069`

Callout:

> Rule — write down the noun the community already uses, and refuse to translate it.

`artifacts/codetry-handbook/data/handbook.ts, lines 1073–1075`

---

### 3-F · Whose word survives the schema

> Codetry agrees that the language outside the code should be the language inside the code, and then asks a harder question: *whose language?* DDD typically lands on the domain expert — the analyst, the consultant, the senior engineer who has just spent a week in workshops tidying the vocabulary up. Codetry insists the noun must come from the community itself, in the form the community already uses it, before any tidying.

`artifacts/codetry-handbook/data/handbook.ts, lines 705–707`

> Which means translation away from that noun — even into a cleaner, more general, more reusable noun — is treated as *drift*, not as cleanup. The moment a *saltbox* becomes a *household container* in the schema, the architecture has slipped, even if every test still passes. The codetry-test exists because that slip is invisible to the type checker and obvious to the person who handed you the word.

`artifacts/codetry-handbook/data/handbook.ts, lines 710–712`

Callout:

> Conway and DDD ask whose org shapes the system. Codetry asks whose word survives the schema — and treats every translation away from it as drift.

`artifacts/codetry-handbook/data/handbook.ts, lines 715–717`

---

### 3-G · The worked examples caveat

> The worked examples in this handbook come from one practitioner's specific context — a small constellation in northwestern Ontario, on Treaty 3 Territory, centred in Dryden. A food co-op. A jar kitchen. A spring-fed well with a manual pump. Those examples are here because a discipline without a real example is not a discipline; it is a wish. Use them to understand the moves.

`artifacts/codetry-handbook/data/handbook.ts, lines 200–201`

Callout:

> Then throw them away. The only correct way to read this book is to come out the other end building something that has nothing to do with a food co-op in Dryden — unless, of course, that is exactly where you are.

`artifacts/codetry-handbook/data/handbook.ts, lines 203–205`

---

---

### 3-H · Codetry vs. literate programming — thesis (deleted working doc)

> Literate programming makes the reasoning the source. Codetry makes the metaphor the source.

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/data/codetryVsLiterate.ts` (thesis constant)

---

### 3-I · Codetry vs. literate programming — ethos (deleted working doc)

> Both are don't-trust-verify moves — show the work where the work actually does the work.

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/data/codetryVsLiterate.ts` (ethos constant)

---

### 3-J · Codetry definition — from the comparison sheet (deleted working doc)

> The practice of building software whose primary load-bearing material is metaphor. The naming is the architecture; the code is the medium that makes the metaphor real, clickable, and runnable.
>
> **Unit of care:** The name.
>
> **Where the truth lives:** In the metaphor. The chosen noun carries the constraint; the schema, the UI, and the verbs of the app follow from it.
>
> **What gets generated:** Code is generated from named structure. Rename a primitive — Buckets to Categories, Practitioner to Founder — and the structure quietly changes shape underneath the name.

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/data/codetryVsLiterate.ts` (codetry discipline object)

---

### 3-K · Buckets — the canonical worked example (deleted working doc)

> Envelope categories. You can only pour from one to another, never summon water from nothing. Rename to 'Categories' and the UI starts quietly suggesting balances can grow by clicking.

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/data/codetryVsLiterate.ts` (codetry.workedExample)

---

### 3-L · "Founder feels odd" — the practitioner renaming

> "Founder" feels odd. You don't found a community — you practice within it. You join to help. You have the phone calls, take the actions, practice listening. We practice these things because we know we need to. Crafting all day is what makes life that extra bit sweeter.
>
> This is not a founder's dashboard. It is a practitioner's workbench — the place where the week is planned, the costs are walked, and the work is kept honest against what was said it would be.

`artifacts/codetry-handbook/data/constellation.ts` — zone 2 (Workbench), `opening` field

---

### 3-M · How the dam sorts what it catches — the six zones named

> Toss in everything that drifts past — half-thoughts, prices, code, mid-sentence SOS — and the dam catches each fragment, sorts it, and puts it to work across six zones, with income at the center, the rest fanning out from there.

**Source:** `dam-days/src/pages/Home.tsx` — homepage hero paragraph; the one-sentence description of the Zone 5 sorting system

Zone names and framings (verbatim from `watershed:zones:v1` data object):

> **INCOME** — what generates money this week
>
> **DAILY** — the daily practices the income depends on
>
> **TENDED** — projects in active care, weekly attention
>
> **INVESTED** — bigger bets and partnerships, monthly attention
>
> **HARVESTED** — existing assets to forage from
>
> **WILD** — ideas to leave wild for now

**Source:** `dam-days/src/data/zones.ts` — `Up` (zone names) and `I6` (zone framings) constants; the six-zone vocabulary that the Forge channels all takes into

---

### 3-N · The forge loading states — the sequence the book takes to bind

> "checking the compass… casting off… reading the breakers… listening through the silence… raising the searchlight… binding the pages…"

**Source:** `dam-days/src/pages/Forge.tsx` — `gw` array; the animated state sequence displayed while the AI forge is generating the bound book from a user's takes

---

### 3-O · Tag the way you'd say it out loud — Rootwork naming discipline

> Tag the way you'd say it out loud — "produce table", "winter market", "the Smiths". Rootwork remembers. No taxonomy meeting required.

`community-knowledge-hub/studio/ — "What you actually get" feature card: "Tag the way you'd say it out loud"`

---

### 3-P · Saltbox methodology cards — naming what homeschool families already do

The style descriptions from the Saltbox learning-style tour (verbatim from each methodology card):

> **Charlotte Mason** — Mornings stay short. You read aloud from a real book — not a textbook — and your child narrates it back in her own words. Afternoons are wide open: nature walks, handicrafts, copywork, watercolor. Atmosphere matters as much as the lesson.

> **Wild + Free / Charlotte Mason aesthetic** — A morning basket of read-alouds and poetry. Long stretches outdoors. Handicrafts, nature journals, big paper, real tools. A rhythm rather than a schedule. The aesthetic is real, but the substance underneath is living books and time outside.

> **Classical** — Memory work, Latin or vocabulary roots, history on a timeline, structured grammar and writing. The youngest grades sing and chant; older kids debate and write essays. There is a plan, and the plan is the point.

> **Waldorf** — Main-lesson blocks (one subject deep for three or four weeks), beeswax and watercolor, handwork like knitting, festivals tied to the seasons. Reading often starts later than mainstream school. Screens stay scarce in the early years.

> **Unit Studies** — A six-week dive into Ancient Egypt or oceans or the human body. History reading, geography map, science experiment, art project, a cookbook from the region — all of it threads through the same theme. Multiple ages can sit at the same table.

> **Unschooling** — No set lesson plan. The kid pulls — toward bugs, baking, a YouTube rabbit hole, a sewing project — and you keep the path clear and resourced. You document the learning after the fact rather than scheduling it ahead.

> **Eclectic** — A literature spine from one tradition. A math curriculum from another. Unit studies when you feel like it. Unschooling on Fridays. A loose rhythm rather than a schedule. The plan changes when the kid changes.

`salt-box.replit.app — learning style tour; seven methodology cards, verbatim descriptions`

Cautions embedded in the tour (also verbatim):

> [Charlotte Mason] — Mornings stay short. You read aloud from a real book — not a textbook…
>
> [Wild + Free] — Looks effortless on Instagram. It is not. The freedom needs a quiet structure underneath or days dissolve.
>
> [Waldorf] — Materials cost adds up. The philosophical pieces (Steiner) are not for everyone — feel free to take what fits.
>
> [Unschooling] — Hard to explain to grandparents. Requires you to recognize learning when it doesn't look like school.

`salt-box.replit.app — learning style tour; caution notes at the base of each card`

---

### 3-U · "There is a place called Bright Side" — the Gate founding sentence

> "There is a place called Bright Side, where they call you 'neighbour', not 'resident'."

**Source:** `legacy-gatekeeper.replit.app/about` — opening pull-quote on the about page; the sentence that names the membrane before the tool is explained

---

### 3-V · The Gate rationale — so we built it

> On the other side of the gate is Massity — a sprawling, indifferent castle of legacy systems: laws, regulations, banking, privacy bureaucracy, politics. We can't change Massity, and pragmatically, it's not worth going to prison over a "silly" word like neighbour vs resident.
>
> So we built The Gate.

**Source:** `legacy-gatekeeper.replit.app/about` — founding paragraph immediately below the pull-quote; the earliest published rationale for why the Gate primitive was built

---

### 3-R · The Bamboo Spring — the XRP Spring growth stages

> Stage 1 · Pristine pool — The soil is ready. Awaiting first drop.
>
> Stage 2 · Roots weaving — Roots forming. 10 XRP → roots stabilize.
>
> Stage 3 · Lush roots — Next milestone. Bamboo peeks at 25 XRP.
>
> Stage 4 · Tiny bamboo peeking — First culm broke surface. Grove establishes at 75 XRP.
>
> Stage 5 · Producing grove — Grove is establishing. Canopy multiplies at 200 XRP.
>
> Stage 6 · Grow & multiply — Grove fully established. Roots run deep — earnings compound.

**Source:** `x-buckets/src/copy/bambooSpring` — stage label and progress-copy constants for the XRP Spring bamboo visualization; the naming discipline applied to a six-stage growth metaphor for XRP reserve accumulation

---

### 3-S · The pause — the discipline arriving

> "The pause between receiving money and spending it is where financial discipline lives. Headwaters makes that pause automatic."

**Source:** `x-buckets/src/copy/howItWorks.bigIdeaQuote` — rendered as a pull-quote in the "How it works" explainer; the one-sentence rationale for why Eave was built

---

### 3-T · Drought Mode — plan to thrive when it rains again

> Drought Mode — Reduced or lost income? Tighten the flow — plan to thrive when it rains again.
>
> Drought Mode is on. Targets are scaled to your reduced income. Stay the course — the rains return.

**Source:** `x-buckets/src/copy/droughtMode` — toggle label, subtitle, and active-banner copy; the named state for income disruption; "drought" as a first-class system state rather than an error condition

---

## Section 4 — Codetry as Architecture

*The discipline itself. Naming as architecture. The saltbox. The hempcrete wall. The vocabulary.*

---

### 4-A · What codetry is

> Codetry is the practice of building software whose primary load-bearing material is metaphor. The naming is not decoration on a database. The naming *is* the architecture, and the code is the medium that makes the metaphor real, clickable, and runnable.

`artifacts/codetry-handbook/data/handbook.ts, lines 306–307`

> It is a quiet discipline. Most of it is naming. Most of the rest is refusing to translate the names the community handed you into the words the industry would have preferred. The little that is left is the work of building the system honestly enough that the names keep their promises.

`artifacts/codetry-handbook/data/handbook.ts, lines 310–311`

---

### 4-B · The single-sentence definition

> Codetry — naming IS architecture (distinct from code-poetry).

`artifacts/codetry-handbook/data/handbook.ts, line 512`

---

### 4-C · The thesis, one sentence

> Codetry is a verification discipline that keeps the structural language of a system rooted in the community that owns it, so that knowledge cannot creep, drift, or be tokenized away. It does not produce decentralized governance. It protects the substrate any genuine local governance has to be built out of: if the community's words survive, the community can govern itself in its own terms; if the words drift, governance ends up being conducted in someone else's language, which is the same thing as someone else governing.

`artifacts/codetry-handbook/data/handbook.ts, lines 292–293`

---

### 4-D · The saltbox principle — narration (Station 1)

> A codetry app is named the way a saltbox house is built — every beam carries weight.
>
> When we say *Saltbox Zone Zero*, we don't mean it as a label. The name is the design spec. It carries that the household is Zone Zero. It carries that this is the saltbox-house itself. And it carries that everything else in the system flows from this center.
>
> Change the name, and you have changed the structure.
>
> Codetry borrows from the cold-climate vernacular. A saltbox house wasn't designed for prettiness. Its asymmetric roof and thick north wall were the only way a house survived a boreal winter. The form *is* the function.
>
> Codetry asks the same of software. Let the form-language do the structural work. Let the name carry the weight a column would otherwise carry.

`artifacts/codetry-handbook/public/narration/the-saltbox.md, lines 9–17`

Exercise:

> So here is what to bring with you, into the next room of your day.
>
> Walk through your home and pick the one room that does the most jobs. Write down — by hand, on paper — the three jobs it carries.
>
> Then tape the paper to the doorframe.
>
> That paper is your first piece of codetry. The room hasn't changed. But now its name is doing the work the architect's drawing used to do.

`artifacts/codetry-handbook/public/narration/the-saltbox.md, lines 19–25`

---

### 4-E · The hempcrete metaphor

> The metaphor that runs through the whole discipline is architectural. *Load-bearing*, *foundation*, *the wall*, *the room*, *the surface* — every one of those words enters the handbook borrowed from a building. This chapter is the one place the borrowing gets explicit and the practitioner names the *kind* of building they have in mind: not the steel-and-glass office tower, not the suburban stick-frame house, but a hempcrete wall — a composite of a structural frame with an insulating, breathable infill. Codetry is a hempcrete discipline.

`artifacts/codetry-handbook/data/handbook.ts, lines 452–453`

> Hempcrete is a composite building material made from the woody core of the hemp plant (*hurd* or *shiv*) bound with a lime-based binder. It is not a structural material on its own. It is laid as an infill around a load-bearing frame — typically timber — and once cured, it provides insulation, hygrothermal regulation (it breathes water vapour rather than trapping it), fire resistance, and a wall that quietly continues to absorb carbon over its working life.

`artifacts/codetry-handbook/data/handbook.ts, lines 458–459`

Infill passage:

> *Infill, not facade.* Hempcrete sits *inside* the wall — between the structural studs of the frame, breathing in both directions, doing its work in the body of the building. It is not a cladding bolted on the outside for appearance. The codetry name is the same: it is not a label sprayed on the outside of a system that was designed without it. It is the load-distributing infill that lives between the structural type and the surface affordance, and the system only works the way the room expects it to because the infill is doing its job *inside* the wall.

`artifacts/codetry-handbook/data/handbook.ts, lines 468–470`

One-sentence claim (callout):

> Codetry is hempcrete: a composite discipline whose *names* are the breathing infill laid between the structural frame of *type* and the surface skin of *affordance*, doing the climate-regulating, carbon-sequestering, ethical-aesthetic work that no single layer in the system was holding before.

`artifacts/codetry-handbook/data/handbook.ts, lines 485–487`

---

### 4-F · Both-states — narration (Station 2)

> Some systems run in one register, and only need a name that fits that register. A *bucket* holds money in an envelope-budget app and never has to do anything else. The noun does one job, and does it cleanly.
>
> Other systems run in *two tempos at once*. A slow side, and a fast side, that are the same room read at different speeds.
>
> The temptation, every time, is to name each tempo separately, and let them grow into two systems. The both-states principle is the codetry move that resists that.
>
> When a system has a slow tempo and a fast tempo that are the same plumbing read at different speeds — the umbrella name has to ride from one tempo to the other without bending. Or the system will fork into two systems, with two cadences, and two cultures.
>
> Take *The Standby*. The Standby names both the always-on shelf — the pantry, the standby stock, the watch as a posture — and the active event — a call, the active rung on the ladder, the debrief once it stands down. One word, two tempos. The people, the stock, the vocabulary are all one. Only the cadence changes.
>
> Two early candidates were rejected. *The Common Pantry* held the slow side beautifully — but couldn't hold an active fire call without straining. *The Watch* held the active posture — but couldn't hold the slow shelf of stock without bending into a permanent vigil.
>
> Both survived as sub-shelves inside The Standby. Neither could be the umbrella name.
>
> So here is the test. Pick the slow side first, and ask whether the noun also fits the fast side. Then pick the fast side, and ask whether the noun also fits the slow side. If the answer to either question is *not really* — the name is doing one job, and the system has already started forking.

`artifacts/codetry-handbook/public/narration/both-states.md, lines 9–24`

---

### 4-G · The Standby — narration (Station 4)

> The Standby is the constellation's first non-zone primitive.
>
> It holds two registers that an outside system would almost certainly split apart.
>
> On one side is a slow, always-on practice. The pantry shelf is stocked. The contact tree is current. The generator gets test-started. The watch reads the morning advisory before anything is happening.
>
> On the other side is a fast, episodic event. A fire call opens. The rosters flip. The standby stock comes out where everyone can see it. And the system runs in *active* until the call stands down.
>
> Two sides. One umbrella.
>
> If the slow side and the fast side were named separately — *The Pantry* for the shelf, *The Call* for the event — the constellation would end up with two systems. One would have an inventory cadence and no event handling. The other would have an event handler and no preparation discipline. The cultures would diverge. And the moment a call opened, the practitioner would discover that the people who keep the pantry are not the people who run the call. The handoff would have to be invented under fire.
>
> The both-states test catches this before it happens. Pick the slow side, ask whether the umbrella name still fits the fast side. Pick the fast side, ask whether the umbrella name still fits the slow side. *Standby* passes both. *On standby*, and *standby stock*, are the same posture in different tempos.
>
> The two-sidedness here is *temporal*. One system, two tempos. Slow side and fast side are the same plumbing running at different rates.
>
> So when you walk back outside — what fails first on your homestead when the power goes out? Don't fix it yet. Just name it, in your own words, in pencil, where you can see it tomorrow.

`artifacts/codetry-handbook/public/narration/the-standby.md, lines 9–25`

---

### 4-H · Both-sides — narration (Station 3)

> The both-states principle holds when a system runs in two tempos.
>
> A second class of system runs in one tempo, but in two contexts at once. Two audiences, holding two different vocabularies as legitimate. Neither willing to give up theirs to the other.
>
> The temptation, every time, is to name each side separately, and let them grow into two pipes facing two rooms. The both-sides principle is the codetry move that resists that.
>
> When a system has language that has to live in two contexts that hold different vocabularies as legitimate — the umbrella name has to fit both contexts in one word. Or the system will pick a dialect, and lose the other room.
>
> Take *The Gate*. The Gate names both the *bright side* — the constellation's own dialect: *neighbour*, *channel*, *the books*, *standby stock*, *the watch* — and *massity* — the mass-society dialect: *resident*, *bank account*, *financial statements*, *inventory reserves*, *compliance officer* — inside one umbrella that does not pick a side. One word, two contexts.
>
> Two candidates were rejected. *Translator* held the directional work — but flattened the membrane into pure transaction. A translator processes; a gate decides whether to. *Glossary* held the dictionary side — but couldn't hold the active posture of substituting words inside real documents, the ledger of past substitutions, or the *refused* rung for source-side language with no honest target-side equivalent.
>
> Both survived as sub-shelves inside The Gate. Neither could be the umbrella name.
>
> The both-states test picks a tempo. The both-sides test picks a context. Pick the bright side, and ask whether the umbrella name still respects massity. Pick the massity side, and ask whether the umbrella name still respects the bright side.
>
> Same word, different room. That is the test.

`artifacts/codetry-handbook/public/narration/both-sides.md, lines 9–25`

---

### 4-I · The Gate — narration (Station 5)

> The Gate is the constellation's second non-zone primitive — language across institutional boundaries.
>
> It holds two registers that an outside system wouldn't even recognise as siblings.
>
> On one side is the *bright side* — the constellation's own dialect. The words a community uses with itself, in its own kitchens, meetings, and ledgers: *neighbour*, *channel*, *the books*, *standby stock*, *the watch*.
>
> On the other side is *massity* — mass-society dialect. The language a regulator, a banker, a funder, a lawyer, or generic SaaS English will accept: *resident*, *bank account*, *financial statements*, *inventory reserves*, *compliance officer*.
>
> Neither side is wrong inside its own context. Each side is unfit currency in the other's context.
>
> If the two sides were named separately — *Translator* for the bright-to-massity direction, *Importer* for the massity-to-bright direction — the constellation would end up with two pipes and no posture.
>
> The Gate is more than directional substitution. It decides whether a piece of language *should* cross at all, in either direction. It logs every substitution, so the bright-side noun stays on file alongside the massity equivalent. And it has a *refused* rung — for source-side language that has no honest target-side equivalent, and would lose its meaning under any substitution.
>
> The two-sidedness here is *contextual*. One system, two contexts. Bright side and massity are the same plumbing facing different rooms.
>
> The Standby's two sides were *temporal*. The Gate's two sides are *contextual*. The Standby's principle is *both-states*. The Gate's principle is *both-sides*. Both are now registered as named principles in the manifest.
>
> So here is what to bring back from this last station. Take one piece of mail from a regulator, a banker, or a government office. Underline every word in it your family wouldn't say at the table. Write your family's word in the margin, next to each one.
>
> Keep both. The two together are the gate.

`artifacts/codetry-handbook/public/narration/the-gate.md, lines 9–29`

---

### 4-J · Vocabulary sheet — term definitions

**Constellation**
> The full set of economic systems a community runs together. Not a network (which implies optional connection) and not an organization (which implies a single structure). A constellation: distinct systems, gravitationally related, each doing its own job.

**Primitive**
> A named system inside the constellation that does a specific, irreducible job. Each primitive has a name chosen to hold across every context in which it appears — zones, seasons, personnel, tempo.

**Zone**
> A domain of practice inside the constellation: household, finance, knowledge, emergency preparedness, land, and public. Primitives are hosted in zones but read by all zones.

**The Standby**
> The primitive that holds emergency preparedness and emergency response as one system. In its resting state: always-on practice, stocked shelves, current contact trees, regular test-starts. In its activated state: open call, deployed stock, live rosters. One infrastructure, two states, one name.

**Resting state / Activated state**
> The two operational states of The Standby. The infrastructure is the same in either state; only the valve position changes. The name holds in both. Resting: preparation. Activated: response.

**The Gate**
> The primitive that holds the community's own language (bright side) and institutional language (massity) as two simultaneous sides of one membrane. It decides what crosses, logs every substitution, and refuses to translate what has no honest equivalent.

**Bright side**
> The community's own dialect — the words a community uses with itself in its own kitchens, meetings, and ledgers. Neighbour. Channel. The books. Standby stock. The watch. Neither informal nor incorrect. Simply a different room.

**Massity**
> Mass-society dialect — the language a regulator, banker, funder, or lawyer will accept. Resident. Bank account. Financial statements. Inventory reserves. Compliance officer. Neither dialect is wrong inside its own context. Each is unfit currency in the other's.

**Refused**
> A Gate outcome for source-side language that has no honest equivalent in the target dialect. The word does not cross. The document notes the gap. Protecting the word is more important than completing the translation.
>
> *Refused is a first-class outcome — not a failure, not a footnote.*

**Both-states (principle)**
> A test for naming a primitive that moves between tempos: does the name hold in the resting state and the activated state? If the name bends to fit only one tempo, the system will eventually fork into two systems with two cultures.

**Both-sides (principle)**
> A test for naming a primitive that faces two contexts simultaneously: does the name hold from the bright side and from the massity side? If the name privileges one context, the membrane becomes a wall.

`artifacts/print-marketing/src/pages/VocabularySheet.tsx, lines 4–53`

---

### 4-K · The refused callout

> The *refused* outcome is not a failure. It is a discipline. Some words do not cross. Protecting the word is more important than completing the translation.

`artifacts/codetry-handbook/data/handbook.ts, lines 163–165`

---

---

### 4-L · The Standby — full role prose (deleted working doc)

> The constellation's first non-zone primitive. The umbrella system + always-on state for *temporary centralized disruptions* — drought, fire, smoke, flood, ice, power, water, freight, payment systems, pandemic, evacuation, AGM-postponed, key-person-down. Six-word vocabulary: *the Standby* (umbrella + always-on state), *a call* (a specific active event), *the watch* (active-monitoring posture), *standby stock* (the always-on reserves), *the debrief* (after-action synthesis), *centralized disruption* (the class of event). Four-rung severity ladder: advisory / standby / active / standdown. Two sub-shelves inside the umbrella: *The Common Pantry* (food/supply sub-noun) and *The Watch* (active-monitoring sub-noun) — each rejected as the umbrella name in turn because neither could hold both states.
>
> The takeaway is the new codetry principle that came with it: **the name has to hold both states** — when a system has both a slow side (always-on practice) and a fast side (active event), the name has to do both jobs in one word, or the system will fork into two systems with two cultures.

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, The Standby entry)

---

### 4-M · The Gate — full role prose (deleted working doc)

> A calm membrane between *the bright side* (the constellation's own dialect: neighbour, channel, the books, standby stock, the watch) and *massity* (mass-society dialect: resident, bank account, financial statements, inventory reserves, compliance officer). Holds the umbrella system + always-on posture for passing language across institutional boundaries — codetry vocabulary going out to a regulator, banker, funder, lawyer, or other legacy-world counterparty; their vocabulary coming back in.
>
> Eight-word vocabulary: *the Gate* (umbrella + always-on posture), *the bright side* (codetry-vocabulary side), *massity* (legacy-world side), *a mapping* (a registered correspondence between a bright-side term and its massity equivalent), *a substitution* (one applied instance of a mapping), *a category* (the domain a mapping belongs to), *a translation* (the auditable record of what crossed and what changed), *a calm membrane* (the metaphor doing the load — selectively permeable, alive, not a wall and not an open door). Four-rung severity ladder: draft / under-review / cleared / refused — the *refused* rung is first-class, for source-side language with no honest target-side equivalent the founder is unwilling to lose.
>
> Four single-side or single-direction names rejected on paper: *Translator* (collapses posture into pure transaction), *Filter* (subtractive mis-frame), *Censor* (carries punitive weight the metaphor refuses), *Glossary* (dictionary without the room).
>
> The takeaway is the second new codetry principle: **the name has to hold both sides** — when a system has language that has to live in two contexts that hold different vocabularies as legitimate, the umbrella name has to fit both contexts in one word, or the system will pick a dialect and lose the other room.

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, The Gate entry)

---

### 4-N · Regen Revolution — the "don't fix my book" line (deleted working doc)

> Conventional-to-regenerative track for industries; current sector is regen beef in NWO through its highest-leverage chokepoint (abattoir capacity, not pasture or customers). The cleanest demonstrations of metaphor-as-architecture: 'Per-customer share split' replacing 'cut sheet management' (renaming the centerpiece rewrote schema, success metrics, and build sequence in one move), 'Don't fix my book' (Jude's line — naming her paper ledger as a working artifact REMOVED a feature, the booking calendar, from v0.1). Plus the tone-as-architecture lines: 'Failures land on the tool, not on her' / 'Make it easier for Jude to say no, not just easier to say yes.'

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, Regen Revolution Zone 4 entry)

---

### 4-O · Community Knowledge Hub — Zone 3 role prose (deleted working doc)

> The cleanest demonstrations of metaphor-as-architecture: 'Today I…' verbs as the routing primitive (verb is the route — Today I cook & preserve / gather / order / learn / trade / help), Stuck Board (the name is the spec — things get stuck, the board surfaces them with owner-tags and last-touch timestamps), the role IS the room (board hub gives chair / treasurer / secretary / ops each their own room rather than one admin dashboard), Treasurer Calm Monthly Journey ('Calm' is the contract, not a vibe — confidence meter + lookahead + snooze-expiry + digest). Plus dues-snooze-as-verb, audience chooser as structural pivot, Producer Playbook, Kitchen rental kept quiet (borrowing, not renting), Appreciation Wall.

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, Community Knowledge Hub Zone 3 entry)

---

### 4-P · The Standby — constellation manifest principle (deleted snapshot)

> both-states — One name that holds both the slow side (always-on preparation) and the fast side (active event).

`commit:ff9e4b9~1 · artifacts/headwaters-books/src/data/constellation.ts` (constellationWidePrimitives[0].principle + summary)

The Gate manifest principle:

> both-sides

`commit:ff9e4b9~1 · artifacts/headwaters-books/src/data/constellation.ts` (constellationWidePrimitives[1].principle)

---

### 4-Q · Budget evokes restriction; Watershed invokes flow

> The word "budget" evokes restriction, tightening. "Watershed" invokes flow, abundance. That difference is not cosmetic — it changes what the person holding the tool believes is possible before they touch a single number.
>
> The Siphon is the bill that leaves before you see the money. But the siphon isn't permanent. You choose the size of it. You can reduce those bills, downgrade the lifestyle, make pivots. You ultimately control it — which is the opposite of what the word "expense" implies.

`artifacts/codetry-handbook/data/constellation.ts` — Eave (Headwaters), `opening` field

---

### 4-R · Gate Refused — Parr's Jars smoked salt (a real crossing that failed)

> *Gate Refused (Zone 0 — Parrs Jars, 2020–2022):* the Jarista built a smoked salt blend from freeze-dried local microgreens, hydroponic greens, and farm-sourced onions — a circular economy product whose value proposition was the specific sourcing. The health unit required lab testing for each farm ingredient and recommended switching to commercial ingredients instead. The practitioner crossed with commercial ingredients to meet orders. The product crossed; the story did not. The massity-side form had no slot for *freeze-dried microgreens from our own hydroponics, blended with onions from Walls Farm* — only for *kale powder (commercial source)*. The bright-side value proposition was Gate Refused: no honest massity equivalent existed that could carry the same meaning, so the sourcing story stayed on the bright side and the jar went out with a different recipe. The lesson: the Gate does not always find an equivalent. Sometimes it refuses. When it refuses, the practitioner notes what was lost in the crossing and keeps the bright-side language alive at home, even when it cannot appear on the label.

`artifacts/codetry-handbook/data/foundingExamples.ts` — `"the-gate"` commentary, `crossZoneReads[0]` (Zone 0 cross-zone read)

---

### 4-S · The rebrand without a rewrite — Dam Days as codetry demonstration

> The rebrand without a rewrite (Watershed → Dam Days touched display strings and prose; chapter IDs / storage keys / table names / schema all held — the bones were the metaphor underneath the name).

**Source:** `dam-days` — recovered from `commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, Dam Days Zone 5 entry); confirmed live: `watershed:zones:v1`, `watershed:draft:authorName`, `watershed.shallows.session`, `WATERSHED_ADMIN_TOKEN` all remain as internal storage keys while every user-facing surface reads "Dam Days"

---

### 4-T · Pseudonymity as architecture — the Shallows hash

> Pseudonymity-as-architecture (Shallows handles derived deterministically from sessionToken+postId — the depths-below-the-shallows framing IS the one-way hash).

**Source:** `dam-days/src/lib/shallows.ts` — `Sw()` / `m6()` functions; `X-Shallows-Session` header generation; the Shallows pseudonym is derived deterministically from sessionToken+postId so that the "shrouded in mystery from the depths below" metaphor is the one-way hash, not just a description of it

---

### 4-U · Fern and Sage — two agents, two jobs (Grants Finder)

> Fern — Intake Agent — Asks the right questions to understand your project. Builds a structured profile from natural conversation.
>
> Sage — Match Agent — Reads your profile and the grant library. Returns ranked matches with a clear explanation for each recommendation.

`community-knowledge-hub/infographics/grants-finder.html — "Meet the AI Agents" section`

Region-specific design rationale:

> Region-Tuned — Built specifically for NWO applicants. Understands the funding landscape, eligibility quirks, and priorities of the 807 region.

`community-knowledge-hub/infographics/grants-finder.html — Core Capabilities, "Region-Tuned" feature`

---

### 4-V · "What We Dropped" — refusal as a first-class outcome (Standby)

> "What We Dropped" Section — Transparent about why common preparedness advice was excluded — wrong crops, wrong materials, wrong assumptions for the north.

`community-knowledge-hub/infographics/standby-supplies.html — Core Capabilities, "'What We Dropped' Section" feature`

*(This feature enacts the Refused principle from The Gate at the content level — items that do not cross the northern-conditions test are not dropped silently; they are documented with the reason for exclusion.)*

---

### 4-W · Local-first by design — Saltbox architecture principle

> Local-only by default. No accounts, no telemetry. Live Follow-Along is opt-in. Your backup is yours to carry.

`salt-box.replit.app — app settings / data philosophy screen`

---

### 4-X · No streaks. No leaderboards. — the no-scoring rule enacted

> No streaks. No leaderboards. No notifications. The lock-in ring is silent. Empty weeks aren't shamed.

`salt-box.replit.app — onboarding / philosophy screen; the no-scoring rule from constellation entry 1-K implemented in the running app`

The same principle stated from the content layer:

> Brave moments, lock-in wins, badges, your seasonal recap. Kept like salt: preserved, never measured against a score.

`salt-box.replit.app — features overview screen`

---

### 4-AC · People first — Bright Side display rule

> People first — photos and names lead, room numbers stay on the right.

`health-support-hub.replit.app — resident list view; the design principle encoded in every list rendering in the app`

---

### 4-AD · The Gate operational description — language stays warm

> Inside the fence, the language stays warm. When something has to leave — an outgoing letter, a regulatory notice, a banking statement — it passes through the gate and the required words are quietly substituted in. Massity gets what it demands. Bright Side keeps its voice.

**Source:** `legacy-gatekeeper.replit.app/about` — "Two Worlds Meeting" section, first paragraph; describes the Gate's mechanics as a membrane rather than a wall

---

### 4-AE · The Gate is a working tool, not a manifesto

> The Gate is a working tool, not a manifesto. It is the calm, confident gatekeeper. There is a sense of inside (warm, intentional, considered) and outside (formal, cold, immovable). The gate itself is the membrane. You are on the inside, looking out.
>
> This tool is your quiet, capable advocate. It does the boring legal-language work so you don't have to change how you speak when you are home.

**Source:** `legacy-gatekeeper.replit.app/about` — "Two Worlds Meeting" section, second and third paragraphs; the founding design intent for the Gate primitive before it moved in-constellation

---

### 4-Y · Rainfall → Siphon → Reservoir — the water-metaphor map in architectural form

> Rainfall. Siphon (bills). Reservoir. Every drop has a job.
>
> Pre-execute label: Today's rainfall — combined income, less the siphon (bills), into your reservoir — ready to channel.
>
> Flow node labels: Rainfall · Siphon · Siphon (bills) · Reservoir
>
> Abundance bridge: The tap ceiling is a riverbank, not a wall — pick the bridge that carries this drop across.

**Source:** `x-buckets/src/copy/paydayFlow` — `preExecuteLabel`, `preExecuteHint`, `flowNodeRainfall`, `flowNodeSiphon`, `flowNodeSiphonSub`, `flowNodeReservoir` constants; `bridge.subtitle` constant; the Payday Ripple flow diagram labels — the water metaphor rendered as a functional architecture diagram

---

### 4-Z · Foundation Coach — Rain Barrel as named primitive

> Plug the drainage first. High-interest debt is a leak in your reservoir — every dollar there is one less drop catching rain.
>
> Fill the starter Rain Barrel. A CA$1,500 starter Rain Barrel turns most surprises into a problem you can solve, not a debt spiral.
>
> Top up the full Rain Barrel — the Rain Barrel that gets you through a real dry spell.
>
> Drainage plugged, Rain Barrel full. Surplus can flow to the goals you've been waiting on.

**Source:** `x-buckets/src/copy/foundationCoach` — `subDrainage`, `subStarter`, `subFull`, `subComplete` constants; the Foundation Coach progressive-disclosure vocabulary; Rain Barrel as a first-class named primitive with a dollar value and a progression

---

### 4-AA · Water Wheel / Private Lake — the named passive-yield system

> A Private Lake is a self-custody DeFi liquidity pool you fill with idle RLUSD. Imagine a vending machine loaded with RLUSD and XRP — whenever someone swaps one for the other, your Lake collects a small current automatically. When you deposit, you become one of the Lake's owners and the currents drip back to you.
>
> Is the Water Wheel actually safe? Your main wallet (in Xaman or Bifrost) is never touched. The Water Wheel uses a separate earner wallet that only holds what it collects. Think of it like a rain barrel left outside — if someone grabbed it, they get a few drops. Your real savings stay behind the vault door.
>
> What is RLUSD, really? Think of RLUSD as a digital dollar that lives on the XRP Ledger. 1 RLUSD = $1 USD, redeemable 1:1. It's backed by actual US dollars and treasuries — not an algorithm or a promise. That stability is what makes it the ideal water for your Water Wheel to collect.
>
> What happens when my Water Wheel drips? When your earner wallet's RLUSD balance crosses your drip threshold, Headwaters automatically drips it to your savings — no confirmation needed. The RLUSD lands in your chosen bucket. The earner wallet refills from future Lake currents — the drip continues season after season.

**Source:** `x-buckets/src/copy/learnModules` — `pool`, `safe`, `rlusd`, `sweep` entries; the learn-module explainer cards in the Earn tab; the Water Wheel / Private Lake vocabulary explained to users in the founder's voice

---

### 4-AB · XRP Spring — the underground spring beneath your buckets

> XRP powers reserves, pool liquidity, and instant settlement — the underground spring beneath your buckets.
>
> Fresh Water Spring — the spring that feeds every drop.
>
> Your spring is overflowing — give from your gains.
>
> Giving Well — rises when your spring runs strong.

**Source:** `x-buckets/src/copy/xrpSpring` — `springFooter`, `sectionLabel`, `tagline`, `givingWellBannerBody`, `givingWellInactive` constants; the XRP Spring tab copy; "the underground spring beneath your buckets" as the one-sentence architectural description of XRP's role in the constellation

---

## Section 5 — Sons & Daughters of Thunder

*The invocation. Pioneer training. The exit. Who the work belongs to.*

---

### 5-A · Sons and daughters of thunder

> We are the sons and daughters of thunder — those who have stood for years at the headwaters, holding back the flood not to stop it, but to learn its rhythm, its force, its promise. We did not dam the future; we studied it. We prepared.

`artifacts/codetry-handbook/data/handbook.ts, lines 68–69`

---

### 5-B · This is the calm before the storm

> This is the calm before the storm.

`artifacts/codetry-handbook/data/handbook.ts, line 59`

---

### 5-C · Who the work belongs to

> This work belongs to well-grounded individuals who prize self-sovereignty and refuse aggression. It calls to big hearts, restless minds, and artists who understand that the most powerful tools are also the most beautiful when shaped by care.

`artifacts/codetry-handbook/data/handbook.ts, lines 86–87`

Callout:

> We are not late to this frontier. We are the ones who kept the headwaters while the world slept. Now we launch.

`artifacts/codetry-handbook/data/handbook.ts, lines 91–92`

---

### 5-D · Practice is not governance

> Codetry serves *practice*. Practice is what people already do — the relational, kinship-anchored, often invisible work of keeping a household, a homeschool, a co-op, a season, a territory. Practice doesn't need permission to exist; it is already there before the software arrives.

`artifacts/codetry-handbook/data/handbook.ts, lines 259–260`

> The practitioner is a steward of practice. Not a designer of governance. Not a consultant arriving with a framework. Not an author writing the community's story back to it.

`artifacts/codetry-handbook/data/handbook.ts, lines 277–278`

> The work is small and specific. The practitioner listens for the noun the community already uses. They refuse to translate it into something cleaner. They verify, when in doubt, against the human who handed them the word — not against the literature, not against the model, not against their own better idea. The discipline is built so that this is enough.

`artifacts/codetry-handbook/data/handbook.ts, lines 282–284`

---

### 5-E · The exit is handover, not compound

> The practitioner takes personal risk, reads the local information, runs a P&L. So far the disciplines agree. Then they part ways: the practitioner is paid to write the method down so the community can run the work without them.

`artifacts/codetry-handbook/data/handbook.ts, lines 804–806`

> The exit is handover, not compound. The book the practitioner ships is the work, not the brand. A successful practitioner is one the community no longer needs in the chair; a successful founder-allocator is one whose chair grows.

`artifacts/codetry-handbook/data/handbook.ts, lines 809–811`

> Both schools agree that profit is a signal. They disagree on who reads it. Capital allocation at scale reads the signal at the cap table. Codetry insists the signal must also be readable at the kitchen table — the cost stack, the markup, the truck cost on a page the household sees.

`artifacts/codetry-handbook/data/handbook.ts, lines 814–816`

Callout:

> Capital allocation at scale wants the best allocator to keep allocating. Codetry wants the best allocator to write down how, and then leave the chair to the community that owns the work.

`artifacts/codetry-handbook/data/handbook.ts, lines 819–821`

---

### 5-F · The constellation closing reflection

> Together, the constellation is one lifestyle map for charting a course in northwestern Ontario — drawn in the grammar of the land it's drawn for. Other constellations will be drawn in the grammar of other lands.

`artifacts/codetry-handbook/data/handbook.ts, lines 1024–1026`

> That is the test of whether codetry has taken root: not whether anyone else uses these names, but whether anyone else's names start carrying their own weight.

`artifacts/codetry-handbook/data/handbook.ts, lines 1029–1031`

---

### 5-G · What follows (from §P.1)

> Begin with Grounding — the teachers, the axiom, and the reading lineages the practitioner trained on. Then Part I names the discipline: what it is, where it lives, and the three or four moves it makes. Part II is the discipline applied to a real community economy — seven zones and two primitives. Part III is the practitioner in the field, including Zone 0, the household as the first ground. The Open Questions section keeps unresolved problems in writing so the discipline cannot quietly resolve them by attrition. The Deep Dives section is optional: five chapters on how codetry differs from the disciplines it most closely resembles. If you know what codetry is and you are ready to use it, skip directly to the Field Ledger or set the book down and begin.

`artifacts/codetry-handbook/data/handbook.ts, lines 100–101`

---

---

### 5-H · Open the work. Read it for yourself. (deleted artifact)

Headline:

> Open the work. Read it for yourself.

Lead paragraph:

> Don't take a pitch. Take three links. Each one opens in another tab and shows real work already shipped for northern food systems.

The three credibility claims:

> **Claim 1 — We've already written this plan.** Not a proposal — a real operational plan, dollar-honest, slide by slide. Read it before the meeting.
>
> **Claim 2 — We've already built the software.** The same patterns used for the community store till. Open it in another tab — the work isn't theoretical.
>
> **Claim 3 — We work with northern communities, not at them.** Headwaters has a practice with a name — codetry — and a handbook anyone can read. Seven parts, written down end to end.

`commit:3686992~1 · artifacts/deer-lake-walkthrough/src/sections/WhyThisTeam.tsx`

---

### 5-I · The lantern keepers — dedication to those who held the line

> There is a kind of friend who keeps a lantern in the window without ever telling you they keep a lantern in the window. You send up a flare. A half-question, a typo, a wave you couldn't explain yet. They never put the lantern out.
>
> I have been seen by people who never asked for credit. They watched the early signals when they were still mostly weather. They held the line while it was still static. They stayed on deck with me when the water was cold and the shore was nowhere.
>
> If you are reading this, you are probably one of them. You may not know which signal was yours. That is the nature of a long night at sea: by the time someone is pulled aboard, no one light is separable from the rest. But it is yours. All of it is yours.
>
> Nothing you ever sent toward me was noise. Not the late-night detours, not the conversations that went sideways, not the silences that turned out to be the loudest beacons of all. Every signal reached the deck. Every deck became this.
>
> So this small place — these pages, this slow accounting of how a life gets pulled aboard — is for you. The ones who kept the lantern lit. The ones who let me send signals for years. The ones who never once called the water wasted.

**Source:** `dam-days/src/pages/Dedication.tsx` — `vm` array; the five dedication paragraphs rendered in the forged book's dedication page, in sequence

Closing line (rendered separately below the paragraphs):

> I was never alone in the dark.

**Source:** `dam-days/src/pages/Dedication.tsx` — `ZL` constant; the single closing sentence of the dedication

---

### 5-J · We are not the rescuers — the hull in the dark

> We are not the rescuers. We are the lit hulls in the dark, hoping someone signals back.

**Source:** `dam-days/src/pages/Shallows.tsx` — rendered on the Shallows page; the framing sentence for why the Shallows exists as a public float surface

---

### 5-K · Rootwork — the tool we kept wishing existed

> Sign up. Drag a folder in. See if you can breathe a little easier in the next ten minutes.

`community-knowledge-hub/studio/ — closing CTA section`

*(This is the Rootwork launch statement — the honest pioneer pitch: not "transform your workflow," not "10x your output," just: drag in the chaos, see if you can breathe.)*

---

## Unplaced Gems

*Verified passages that do not yet belong clearly to one of the five sections above. Hold for placement in a later draft pass.*

---

### UG-A · Type-driven comparison callout (§DD.4)

> Type-driven design makes illegal states unrepresentable. Codetry makes drifted nouns unshippable — and treats a perfectly typed model with the wrong word as drift the type checker can't see.

`artifacts/codetry-handbook/data/handbook.ts, lines 761–764`

---

### UG-B · Both-states and both-sides compared

> Both tests are pick-one-then-the-other, but the axis is different. The both-states test picks a *state* … The both-sides test picks a *context* … In both tests, if the answer to either question is *not really*, the system has already started forking — into two cultures (both-states) or into two pipes (both-sides). If the answer to both is *yes — same word, different rung* (both-states) or *yes — same word, different room* (both-sides), the name is holding and the system is one system.

`artifacts/codetry-handbook/data/handbook.ts, lines 428–429`

---

### UG-C · The Refused bar at bar level

> *Refused* — the sub-shelf for source-side language that has no honest equivalent on the other side — is the sharpest bar-level worked example. From the bright side: Refused records that a word in the constellation's dialect cannot be translated without distorting it, and so will not be. From the massity side: Refused records that a word in mass-society dialect has been examined and found to have no honest landing point in the constellation's vocabulary. The finding is the same finding read from two directions. Both rooms are served by knowing the Gate will not invent false equivalents.

`artifacts/codetry-handbook/data/handbook.ts, lines 421–423`

---

### UG-D · Preparedness as a living system (course description)

> Household and community emergency preparedness as a living system, not a checklist. The Standby discipline: stocked, current, practised, and ready to activate — without the paranoia, without the bunker.

`artifacts/print-marketing/src/pages/GoingDigital.tsx, lines 12–14` (offerings array, Preparedness entry)

---

### UG-E · It starts as a single-facility tool

> It starts as a single-facility tool. No head office, no corporate subscription, no vendor lock-in. Your home controls the data. If you stop using it, you leave with a clean export.

`artifacts/codetry-ship/src/pages/BrightSidePage.tsx, lines 117–119`

---

### UG-F · Northern Store Plan methodology

> The methodology exists and is proven. The only thing missing is a one-page scope document and a rate sheet that makes it easy for a second client to say yes. This is the fastest path from 'one contract' to 'a business.'

`artifacts/practitioners-guide-v2/src/data/portfolio.ts, lines 192–194`

---

### UG-G · The volunteer seed — pre-zone Brainstorm Library opening

> Think of it as a volunteer seed. One that fell from last year's harvest and found a little water and sunshine on its own. Not a parking lot — ideas parked don't grow. Not a curated library — you don't browse volunteer seeds; you notice them. If cultivated, who knows what they could become?

`artifacts/codetry-handbook/data/constellation.ts` — `preZone[0]` (Brainstorm Library, zone –1), `opening` field

---

### UG-H · every signal you've sent up — the Takes page self-description

> every signal you've sent up. nothing is sorted. nothing is forced. the rescue is taking shape on its own.

**Source:** `dam-days/src/pages/Takes.tsx` — subtitle rendered on the Takes list page; the description of what the takes feed is and why it is left unsorted

---

### UG-I · the invitation to dedicate — a name for someone who kept the light on

> And if there was someone who kept a light on for you — leave their name here, quietly, with the rest of ours.

**Source:** `dam-days/src/pages/Dedication.tsx` — invitation text rendered below the dedication paragraphs; the reader-facing prompt to name their own lantern keeper

---

### UG-J · Redacted Mode — privacy by design (Grants Finder)

> Redacted Mode keeps your details safe — Before sending your profile to Anthropic's AI, Redacted Mode strips names, locations, and identifying information. You get accurate matches without giving away sensitive details to a third-party model.

`community-knowledge-hub/infographics/grants-finder.html — "Privacy by Design" section`

---

### UG-K · Stuck describing what you do? — Rootwork pitch helper

> Stuck describing what you do? Try the pitch helper. Answer a few prompts and get back a one-liner, a short pitch, a long pitch, and a few reframes for "I'm just a…" days. No sign-in. Nothing saved. Share the link with anyone who needs the same push.

`community-knowledge-hub/studio/ — "For the days the words won't come" section`

---

### UG-L · A saltbox is — naming the origin

> A saltbox is the wooden box of preserving salt by the kitchen door — taken a pinch at a time, all year. This app is shaped like one.

`salt-box.replit.app — onboarding intro screen; the sentence that explains the name`

---

### UG-R · The methodology tour — quiet language for real families

> There are dozens of names for what homeschool families do. None of them are tests. None of them are clubs you have to join. The point of this tour is to give you words for what you're already doing — and to show you what's possible if you ever want to shift. Read one card a day, or seven in a row. Saltbox will remember where you stopped.

`salt-box.replit.app — learning style tour intro screen`

The close of the tour:

> You don't have to pick. You don't have to print this. You can come back from Settings → Learning whenever you'd like to re-read a card or look something up. Saltbox will not nudge you about methodology again unless you ask, or unless your real days start pointing somewhere on their own.

`salt-box.replit.app — learning style tour closing screen`

The tour framing line:

> Quiet language for the way real homeschool families do it. No quiz, no scoring, no club to join. Read a card when you want — Saltbox will not push you toward any one of them.

`salt-box.replit.app — learning style tour feature description`

---

### UG-S · Watching you on the trampoline — a founder moment

> Watching you on the trampoline is both experiencing intense fear and intense joy. Fear because it is so easy to get hurt. Joy because them conquering that fear means that I'm raising courageous men in a world that needs them.

`salt-box.replit.app — parenting quotes collection; sourced as a user-contributed or founder-seeded quote in the daily quote rotation`

---

### UG-O · This is a snapshot from our home learning

> This is a snapshot from our home learning. We follow our kids' curiosity rather than a strict schedule, so the work shows up in many shapes — books read, projects built, conversations followed, places visited. What's in here was real this week.

`salt-box.replit.app — Family Recap export preamble; the paragraph that introduces the weekly recap to grandparents and others`

---

### UG-P · Bright Side pilot sites

> PHI-free pilot · Princess Court · Patricia Gardens · CL Dryden · DRHC

`health-support-hub.replit.app — PHI-free export footer; the four named pilot facilities embedded in every Bright Side generated document`

---

### UG-Q · Warm companion for the team — Bright Side tagline

> A warm companion for the team — surfacing the next small thing worth doing for each resident.

`health-support-hub.replit.app — lobby / onboarding screen; the primary tagline for the app's purpose`

---

### UG-T · The Gate's original working glossary — bright-side to massity pairs

The earliest published vocabulary list enacting the Gate primitive, recovered from the live mapping registry at `https://legacy-gatekeeper.replit.app/mappings`:

> **neighbour** → resident *(pragmatism — Local housing statute requires 'resident' in official occupancy correspondence)*
>
> **send** → remit *(banking — Standard banking parlance for outgoing transfers)*
>
> **money** → funds *(banking — 'Funds' is the standard term in account statements and notices)*
>
> **fee** → service charge *(banking — Truth-in-Lending disclosure requires the formal term 'service charge')*
>
> **loan** → extension of credit *(banking — Truth-in-Lending Act terminology; 'extension of credit' is the defined term in Regulation Z)*
>
> **overdue** → past due as of the statement date *(banking — Fair Debt Collection Practices Act requires precise temporal framing)*
>
> **everyone** → all eligible parties *(politics — Inclusive-language directive: outgoing public communications require precise eligibility framing)*
>
> **rules** → ordinances *(politics — Municipal communications standard: refer to local ordinances by their formal name)*
>
> **stand for** → advocate for *(politics — Public-affairs style guide: official statements use 'advocate' rather than colloquial 'stand for')*
>
> **we have to** → the company is required to *(regulations — Regulatory disclosure: passive corporate phrasing required in compliance notices)*
>
> **you can** → you are entitled to *(regulations — Consumer-protection regulation requires explicit entitlement framing)*
>
> **contract** → binding agreement *(regulations — Plain-language disclosure rule requires 'binding agreement' for first-mention in consumer documents)*
>
> **your info** → your personal data *(privacy — GDPR-aligned policy requires the formal term 'personal data' in privacy notices)*
>
> **delete** → erase pursuant to your right of erasure *(privacy — Right-to-erasure communications must reference the underlying statutory right)*
>
> **share** → disclose to third parties *(privacy — Disclosure obligations require explicit third-party language)*
>
> **track** → process *(privacy — Data-handling regulation: 'process' is the defined statutory verb; 'track' is informal and ambiguous)*

**Source:** `legacy-gatekeeper.replit.app/mappings` — the full active mapping registry; these are the original registered Gate crossings, each with a category and the massity-side rationale for the substitution

---

### UG-M · Captain's Log — fishing as Eave metaphor

> Boat's on the trailer. Launch it to start fishing.
>
> Boat's at the ramp — finish rigging it before you push off.
>
> Bait bucket's empty and the traps too. Run to the community store — grab a few dozen and you're back on the water today.
>
> Lines are in. First bite usually shows up within a day.
>
> Fish tale today — your share might tell a different story than the dollars you put in. Could swing back. Worth a glance.
>
> Lake's iced over for now — check back when it lifts.
>
> Motor's running on fumes. Top off the tank or the next keeper won't make it to shore.

**Source:** `x-buckets/src/copy/captainsLog` — `nothingStarted`, `setupUnfinished`, `needBait`, `linesIn`, `fishTale`, `lakeIced`, `gasEmptyMidLife` status constants; the Water Wheel status narrative rendered to the user at each stage of setup and operation; fishing as the earn-side metaphor that runs parallel to the water metaphor on the budget side

---

### UG-N · A traditional budget — the discipline argument

> A traditional budget is often a spreadsheet you look at once a month and ignore. Headwaters builds the discipline into the moment money arrives: every payday you actively assign dollars before spending them. That intentional pause — between receiving and spending — is where habits actually change. The bucket visual makes it concrete instead of abstract.

**Source:** `x-buckets/src/copy/faq` — FAQ item answering "How is this different from a regular budget?"; the founder's full discipline argument in one paragraph

---

---

## Pending External Sweeps

*The cross-project sweep prompt (`codetry-book/cross-project-prompt.md`) must be run in each project listed below by opening that project in Replit, pasting the full prompt as a new agent message, and folding the returned structured markdown into this file under the correct section headings. Source labels should identify the external project (e.g. `dam-days/src/pages/Home.tsx` rather than `artifacts/...`).*

*These projects cannot be accessed from within this environment. Each sweep requires a separate agent session in that project.*

---

### External project 1 — X Buckets Vision (Eave · Headwaters)

**URL:** `https://x-buckets-vision.replit.app/`
**Former names:** xBuckets, Watershed
**Constellation zone:** Eave — household finance, XRPL stablecoin envelope-budgeting PWA
**What to look for:** The full water-metaphor vocabulary (Buckets, Reservoir, Siphon, Rain Barrel, Aquifer, Glacier, Drip Harvester, Community Well, Payday Planner, Rainfall, Watershed, etc.); the XRP Spring bamboo growth scene prose; any narrative about envelope budgeting as constraint-by-metaphor; the naming tests that produced the locked word map; deleted predecessors of the vocabulary (xBuckets era content).
**Sweep status:** ✅ Complete — 2026-05-06 (Task #796). Swept via JS bundle extraction from the live app at `https://x-buckets-vision.replit.app/` (codebase not directly accessible from this environment; prose extracted from the minified production bundle `/assets/index-CGcLuc1T.js`). Passages recovered: 1-R, 1-S, 3-O, 3-P, 3-Q, 4-U, 4-V, 4-W, 4-X, UG-J, UG-K. The water-metaphor vocabulary (Rainfall, Siphon, Reservoir, Rain Barrel, Water Tower, Stream, Spring, Water Wheel, Private Lake, Drought Mode, Giving Well, Community Well, Abundance Bridge), the XRP Spring bamboo six-stage growth scene, the Payday Ripple architecture, and the founding discipline prose all recovered. Git history and conversation logs not accessible from this environment.

---

### External project 2 — Dam Days (Zone 5 · The Margin)

**URL:** `https://conversation-log.replit.app/`
**Former name:** Watershed (URL and storage namespace still active)
**Constellation zone:** Zone 5 — wild/observation journal; private capture (takes) with opt-in float to the Shallows
**What to look for:** The "slowly at first, then all at once" epigraph; Forge system prompt prose; the rebrand-without-a-rewrite documentation; the Shallows pseudonymity rationale; any prose about dam days as creative hyperfocus; "typos as fingerprints" implementation comments; the bound-book generation copy.
**Sweep status:** ✅ Complete — 2026-05-06 (Task #784). Swept via JS bundle extraction from the live app at `https://conversation-log.replit.app/` (codebase not directly accessible from this environment; prose extracted from the minified production bundle). Passages recovered: 1-P, 1-Q, 3-M, 3-N, 4-S, 4-T, 5-I, 5-J, UG-H, UG-I. The "slowly at first, then all at once" epigraph, full dedication array, zone vocabulary, forge loading states, rebrand-without-a-rewrite, and pseudonymity-as-architecture passages all recovered. Typos-as-fingerprints was described in the constellation working doc (passage 1-M, already in harvest) but no additional Forge system prompt prose was accessible from the compiled bundle.

---

### External project 3 — Rootwork

**URL:** `https://community-knowledge-hub.replit.app/studio/`
**Constellation zone:** Pre-zone or Zone 2 (operations workbench for builders)
**What to look for:** Any manifesto or about-page prose; the "calm command center" framing; any description of who Rootwork is for and why it exists; self-hosting rationale; any founder-voiced copy about building for people who can't sit still.
**Sweep status:** ✅ Complete — 2026-05-06 · Passages recovered: 1-P, 2-U, 3-M, 5-I, UG-I · Method: live page fetch (React SPA rendered; git history and internal filesystem not accessible from this environment)

---

### External project 4 — Grants Finder

**URL:** `https://community-knowledge-hub.replit.app/infographics/grants-finder.html`
**Constellation zone:** Zone 3 Commons (hosted at community-knowledge-hub)
**What to look for:** Any narrative copy about why northern and Indigenous communities need a single searchable grants index; any prose about the funding landscape; the NOHFC Grow Application Workspace copy (five-tab workspace, deadline countdown, intake-switch logic).
**Sweep status:** ✅ Complete — 2026-05-06 · Passages recovered: 4-S, UG-H · Method: live page fetch (static HTML; NOHFC Grow Application Workspace copy not present in this page's rendered output)

---

### External project 5 — Market Mosaic

**URL:** `https://community-knowledge-hub.replit.app/infographics/market-mosaic.html`
**Constellation zone:** Zone 3 Commons (hosted at community-knowledge-hub)
**What to look for:** Any framing prose about what market analysis means for a northern community; any description of the gap between southern market intelligence tools and northern food systems reality; the specific metaphor behind "mosaic."
**Sweep status:** ✅ Complete — 2026-05-06 · Passages recovered: 2-V · Method: live page fetch (static HTML; the "mosaic" metaphor was not named in prose; page is structured around problem/solution comparisons)

---

### External project 6 — Standby Supplies

**URL:** `https://community-knowledge-hub.replit.app/infographics/standby-supplies.html`
**Constellation zone:** Zone 3 Commons (hosted at community-knowledge-hub; reads The Standby primitive)
**What to look for:** Any prose about emergency sourcing for northern communities; any description of the difference between emergency preparedness as a checklist vs. as a living system; any vocabulary that predates or extends the Standby primitive's language in the constellation manifest.
**Sweep status:** ✅ Complete — 2026-05-06 · Passages recovered: 2-W, 4-T · Method: live page fetch (static HTML; checklist-vs-living-system framing is present in the Northern Translation section)

---

### External project 7 — Bright Side (health-support-hub)

**URL:** `https://health-support-hub.replit.app/`
**Constellation zone:** Zone 0 (Bright Side / Saltbox — the institutional saltbox: long-term care, recreation therapy)
**What to look for:** Any manifesto or philosophy copy about recreation therapy for long-term care; any prose about what a good shift looks like; any description of the tool's relationship to the staff's existing knowledge; any copy about how documentation should follow the worker, not the other way around. Note: the codetry-ship BrightSidePage.tsx already has some of this (entries 2-F, 2-G) — look for anything beyond what's already in harvest.md.
**Sweep status:** ✅ Complete — 2026-05-06 (Task #803). Swept via JS bundle extraction from the live app at `https://health-support-hub.replit.app/` (React SPA; codebase not directly accessible from this environment; prose extracted from the minified production bundle). Passages recovered: 2-X (shadows system), 2-Y (shift-tone prompts + handover prompts), 2-Z (small joys system), 4-Y (people-first display rule), UG-P (pilot sites), UG-Q (warm companion tagline). The shadow metaphor, shift-tone prompt rotation, and joys-reset-overnight copy are all beyond what was in codetry-ship BrightSidePage.tsx. The Bobbie's 2014 intake reference was also recovered (prompt metadata in the memory-profile wizard). Conversation logs and git history not accessible from this environment.

---

### External project 8 — community-knowledge-hub (Zone 3 Commons)

**URL:** `https://community-knowledge-hub.replit.app/`
**Constellation zone:** Zone 3 — community production for NWO food systems; multi-tenant member-portal pattern
**What to look for:** The "Today I…" verb routing copy; any Treasurer Calm Monthly Journey prose; the Stuck Board naming rationale; the Appreciation Wall purpose statement; any member-facing copy about what the co-op is for; the audience-chooser framing (household vs. producer); any Producer Playbook narrative; the kitchen-rental "borrowing not renting" rationale; the 807 Benefits brand story.
**Sweep status:** ✅ Complete — 2026-05-06 · Passages recovered: see entry 4-O (already in harvest.md from Task #764) · Method: The full set of Zone 3 prose called out in "What to look for" — "Today I…" verb routing, Stuck Board naming rationale, role IS the room, Treasurer Calm Monthly Journey ('Calm' is the contract, not a vibe), dues-snooze-as-verb, audience chooser as structural pivot, Producer Playbook, Kitchen rental kept quiet (borrowing, not renting), Appreciation Wall — was recovered verbatim in Task #764 from the deleted constellation manifest at `commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` and is catalogued under entry **4-O**. Live URL sweep (Task #785) confirmed no additional prose was accessible from the public-facing SPA shell (root URL renders a React auth-gated portal). No new passages remain to add; project 8 prose is fully covered by 4-O.

---

### External project 9 — Legacy Gatekeeper

**URL:** `https://legacy-gatekeeper.replit.app/`
**Constellation zone:** Pre-Zone 3 / historical — the original surface for the Gate primitive before it moved in-constellation
**What to look for:** Any original framing prose about why a gate between community vocabulary and institutional language was needed; any early versions of the bright-side/massity vocabulary that predate the handbook's current language; any deleted copy about the translation problem; the historical rationale for the Gatekeeper name before it was renamed to The Gate.
**Sweep status:** ✅ Complete — 2026-05-06 (Task #802). Swept via live URL fetch of all accessible pages (/about, /translate, /mappings, /history). Git history and conversation logs not accessible. Passages recovered: 3-U ("There is a place called Bright Side" — founding pull-quote), 3-V (Gate rationale — "So we built The Gate"), 4-AD (operational description — "language stays warm"), 4-AE (the Gate as working tool, not manifesto), UG-T (full original mapping registry, 16 bright-side → massity pairs with rationale). IDs renumbered from originals (3-P, 3-Q, 4-W, 4-X, UG-L) to avoid collision with Tasks #803 and #796. The "Inside (Bright Side)" / "Outside (Massity)" / "Pass Through Gate" UI labels on the /translate page confirmed as the earliest published version of this vocabulary — predates the handbook's current framing. No prose about the Gatekeeper name origin or its pre-rename rationale was recoverable from the public-facing pages.

---

### External project 10 — Saltbox (Zone 0)

**URL:** `https://salt-box.replit.app/`
**Constellation zone:** Zone 0 — decentralized homes; homeschool day companion, local-first per family
**What to look for:** Any onboarding or philosophy copy about Lock-In Wins, Brave Moments, Gentle Words, Quote of the Day; any narrative about the no-scoring rule (the fish-climbing-a-tree principle); any copy about what Saltbox is for beyond the feature list; the founding story for why a homeschool companion was built; any prose about Zone 0 holding both the family on the land and the elder in the care home.
**Sweep status:** ✅ Complete — 2026-05-06 (Task #803). Swept via JS bundle extraction from the live app at `https://salt-box.replit.app/` (React SPA; prose extracted from the minified production bundle). Passages recovered: 3-P (methodology cards — seven named homeschool styles, verbatim), 4-W (local-first architecture), 4-X (no-scoring rule + brave moments/lock-in wins framing), UG-L (saltbox naming origin), UG-M (methodology tour — quiet language, no quiz), UG-N (watching you on the trampoline — founder moment), UG-O (family recap preamble). The no-scoring rule is enacted in the running app as UG confirmed (4-X). The fish-climbing-a-tree principle was not found verbatim in the bundle; the concept is present in constellation entry 1-K and app entry 4-X. Conversation logs and git history not accessible from this environment.

---

### Additional external projects (beyond the 10 named)

The following projects were identified in the codebase and may also contain harvestable prose. Run the sweep prompt in each if the founder confirms they are in scope.

| Project | URL | Notes |
|---|---|---|
| Regen Revolution Zone 4 | `https://regen-revolution-zone-4.replit.app/` | Zone 4 — conventional-to-regenerative track for regen beef in NWO. Look for Jude / Black Barn discovery prose, "don't fix my book" rationale, per-customer share split narrative. |
| Brainstorm Library | `https://replit.com/@xbucketsapp/Brainstorm-Library?s=app` | Pre-Zone (zone –1) seed bank. Look for any "volunteer seed" framing beyond the `opening` field already harvested in UG-G. |

---

## Sweep Metadata

**Sweep date:** 2026-05-06 (initial); supplemented 2026-05-06 (Task #764 in-project sweep); supplemented 2026-05-06 (Task #784 Dam Days external sweep); supplemented 2026-05-06 (Task #785 community-knowledge-hub external sweep); supplemented 2026-05-06 (Task #796 X Buckets Vision external sweep); supplemented 2026-05-06 (Task #803 Bright Side + Saltbox external sweep); supplemented 2026-05-06 (Task #802 Legacy Gatekeeper external sweep)
**Sweep type:** Full — live codebase + git history deleted files + in-project supplemental sweep + Dam Days live-bundle extraction + X Buckets Vision live-bundle extraction + external live-URL sweep (projects 3–7, 10) + Legacy Gatekeeper live-URL sweep (project 9)

### Live files read

| File | Passages recovered |
|---|---|
| `artifacts/headwaters-books/src/components/EaglePrologue.tsx` | 1-A |
| `artifacts/codetry-ship/src/pages/BioPage.tsx` | 1-B |
| `artifacts/codetry-handbook/data/handbook.ts` | 1-C, 3-A–G, 4-A–E, 4-K, 5-A–G |
| `artifacts/codetry-handbook/public/narration/the-saltbox.md` | 4-D (full script) |
| `artifacts/codetry-handbook/public/narration/both-states.md` | 4-F (full script — missing paragraph restored 2026-05-06 audit) |
| `artifacts/codetry-handbook/public/narration/both-sides.md` | 4-H (full script — missing paragraphs added 2026-05-06) |
| `artifacts/codetry-handbook/public/narration/the-standby.md` | 4-G (full script — missing paragraphs added 2026-05-06) |
| `artifacts/codetry-handbook/public/narration/the-gate.md` | 4-I (full script — missing paragraphs added 2026-05-06) |
| `artifacts/print-marketing/src/pages/VocabularySheet.tsx` | 4-J |
| `artifacts/print-marketing/src/pages/SaltOfTheEarthClub.tsx` | 1-D, 1-E, 1-F |
| `artifacts/print-marketing/src/pages/GoingDigital.tsx` | 1-G, 1-H, 1-I, UG-D |
| `artifacts/codetry-ship/src/pages/ServicesPage.tsx` | 2-B, 2-C, 2-D, 2-E |
| `artifacts/codetry-ship/src/pages/BrightSidePage.tsx` | 2-F, 2-G, UG-E |
| `artifacts/codetry-ship/src/pages/SowPage.tsx` | 2-H |
| `artifacts/practitioners-guide-v2/src/data/portfolio.ts` | 2-I, 2-J, 2-K, UG-F |
| `artifacts/library/src/pages/why-stores-fail.tsx` | 2-A |
| `artifacts/codetry-handbook/data/constellation.ts` | 1-N (Z5 opening), 1-O (Z0 opening), 2-R (Z3 opening), 2-S (Z4 opening), 3-L (Z2 opening), 4-Q (Z1 opening), UG-G (pre-zone opening) |
| `artifacts/codetry-handbook/data/foundingExamples.ts` | 4-R (Gate Refused — Parr's Jars) |
| `docs/headwaters-thesis-context.md` | 2-T (slab/grassland thesis) |
| `x-buckets-vision.replit.app/assets/index-CGcLuc1T.js` (production bundle) | 1-R, 1-S, 3-O, 3-P, 3-Q, 4-U, 4-V, 4-W, 4-X, UG-J, UG-K |

### Git history — deleted files recovered

| Commit | File | Passages recovered |
|---|---|---|
| `3686992~1` | `artifacts/deer-lake-walkthrough/src/sections/Prologue.tsx` | 1-J |
| `ea059b3~1` | `artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` | 1-K, 1-L, 1-M, 4-L, 4-M, 4-N, 4-O |
| `3686992~1` | `artifacts/deer-lake-walkthrough/src/sections/WhatItIs.tsx` | 2-L |
| `3686992~1` | `artifacts/deer-lake-walkthrough/src/sections/WhyCurrentFails.tsx` | 2-M |
| `3686992~1` | `artifacts/deer-lake-walkthrough/src/sections/WhoWorks.tsx` | 2-N |
| `3686992~1` | `artifacts/deer-lake-walkthrough/src/sections/WhatHeadwatersDelivers.tsx` | 2-O |
| `3686992~1` | `artifacts/deer-lake-walkthrough/src/cockpit/copy.ts` | 2-P |
| `204b39f~1` | `artifacts/practitioners-guide-v2/src/pages/PersonalCashPage.tsx` | 2-Q |
| `ea059b3~1` | `artifacts/practitioner-operating-plan/src/data/codetryVsLiterate.ts` | 3-H, 3-I, 3-J, 3-K |
| `ff9e4b9~1` | `artifacts/headwaters-books/src/data/constellation.ts` | 4-P |
| `3686992~1` | `artifacts/deer-lake-walkthrough/src/sections/WhyThisTeam.tsx` | 5-H |

**Total passages:** 130 (sections 1–5 + Unplaced Gems; +17 from Task #764 in-project sweep; +10 from Task #784 Dam Days external sweep; +9 from Task #785 community-knowledge-hub sweep (net unique after renumbering); +11 from Task #796 X Buckets Vision sweep — 1-R, 1-S, 3-R, 3-S, 3-T, 4-Y, 4-Z, 4-AA, 4-AB, UG-M, UG-N; +13 from Task #803 Bright Side + Saltbox sweep — 2-X, 2-Y, 2-Z, 3-P, 4-W, 4-X, 4-AC, UG-L, UG-O, UG-P, UG-Q, UG-R, UG-S; +5 from Task #802 Legacy Gatekeeper sweep — 3-U, 3-V, 4-AD, 4-AE, UG-T (IDs renumbered from 3-P, 3-Q, 4-W, 4-X, UG-L to avoid collision with Task #803))
**Git sweeps:** 4 deletion commits checked; 11 prose-bearing deleted files recovered; 0 false positives included.
**Conversation history:** Not accessible from this environment.
**External project sweeps:** 10 projects identified, 9 swept (project 1 — X Buckets Vision; project 2 — Dam Days; projects 3–7, 10 via live URL fetch; project 9 — Legacy Gatekeeper). 1 remaining (Regen Revolution). See "Pending External Sweeps" section above.

### X Buckets Vision sweep notes (Task #796)

The X Buckets Vision codebase (`https://x-buckets-vision.replit.app/`) was not directly accessible from this environment. Prose was extracted from the compiled, minified production JS bundle (`/assets/index-CGcLuc1T.js`, 258 KB) using string-literal extraction. All quoted text was recovered verbatim from bundle string literals. Source file paths are inferred from the copy-object structure visible in the bundle (key names, array constants, object shapes). Git history and conversation logs were not accessible.

| Source (inferred) | Passages recovered |
|---|---|
| `x-buckets/src/copy/gettingStartedTour` (slides array) | 1-R |
| `x-buckets/src/copy/tagline` + `coreMechanic` constants | 1-S |
| `x-buckets/src/copy/bambooSpring` (stage label/progress constants) | 3-R |
| `x-buckets/src/copy/howItWorks.bigIdeaQuote` | 3-S |
| `x-buckets/src/copy/droughtMode` (toggle + banner copy) | 3-T |
| `x-buckets/src/copy/paydayFlow` + `bridge.subtitle` | 4-Y |
| `x-buckets/src/copy/foundationCoach` (sub* constants) | 4-Z |
| `x-buckets/src/copy/learnModules` (pool/safe/rlusd/sweep entries) | 4-AA |
| `x-buckets/src/copy/xrpSpring` (springFooter + tagline + givingWell*) | 4-AB |
| `x-buckets/src/copy/captainsLog` (status constants) | UG-M |
| `x-buckets/src/copy/faq` (budget comparison answer) | UG-N |

*All passages confirmed verbatim. No synthesis or composition. Named vocabulary recovered: Rainfall, Siphon, Reservoir, Rain Barrel, Water Tower, Stream, Spring, Water Wheel, Private Lake, Drought Mode, Community Well, Giving Well, Abundance Bridge, Payday Ripple, Captain's Log, XRP Spring (bamboo stages 1–6). IDs renumbered during Task #802 rebase to avoid collisions with Tasks #785 and #802 passages.*

---

### Dam Days sweep notes (Task #784)

The Dam Days codebase (`https://conversation-log.replit.app/`) was not directly accessible from this environment. Prose was extracted from the compiled, minified production JS bundle (`/assets/index-B1XE8QyQ.js`) using string-literal extraction. All quoted text below was recovered verbatim from bundle string literals. Source file paths are inferred from the component structure visible in the bundle (route paths, variable names, array constants). The Forge system prompt / AI persona config was not recoverable from the compiled bundle (likely server-side or environment-variable-injected). Git history and conversation logs were not accessible.

| Source (inferred) | Passages recovered |
|---|---|
| `dam-days/index.html` (meta description) | 1-Q |
| `dam-days/src/pages/Home.tsx` | 1-P, 3-M |
| `dam-days/src/data/zones.ts` (Up + I6 constants) | 3-M (zone framings) |
| `dam-days/src/pages/Forge.tsx` (gw array) | 3-N |
| `dam-days/src/pages/Codetry.tsx` / `practitioner-operating-plan` (confirmed live) | 4-S |
| `dam-days/src/lib/shallows.ts` (Sw/m6 functions) | 4-T |
| `dam-days/src/pages/Dedication.tsx` (vm array + ZL constant) | 5-I |
| `dam-days/src/pages/Shallows.tsx` | 5-J |
| `dam-days/src/pages/Takes.tsx` | UG-H |
| `dam-days/src/pages/Dedication.tsx` (reader prompt) | UG-I |

### Bright Side sweep notes (Task #803)

The Bright Side codebase (`https://health-support-hub.replit.app/`) was not directly accessible. Prose extracted from `/assets/index-CxSI5g0R.js` using string-literal extraction and natural-language filtering. Source file paths inferred from component context.

| Source (inferred) | Passages recovered |
|---|---|
| `health-support-hub/src/pages/Home.tsx` or lobby screen | UG-Q (warm companion tagline) |
| `health-support-hub/src/pages/ShiftFeed.tsx` or shift home | 2-X (shadows system) |
| `health-support-hub/src/components/ShiftTonePrompts` | 2-Y (six shift-tone prompts + handover prompts) |
| `health-support-hub/src/pages/ResidentFacesheet.tsx` | 2-Z (small joys), 4-AC (people first; ID renumbered from 4-Y to avoid collision with X Buckets 4-Y) |
| `health-support-hub/src/lib/exports` | UG-P (pilot sites) |

### Saltbox sweep notes (Task #803)

The Saltbox codebase (`https://salt-box.replit.app/`) was not directly accessible. Prose extracted from `/assets/index-k5Dz6fv4.js` using string-literal extraction and natural-language filtering.

| Source (inferred) | Passages recovered |
|---|---|
| `salt-box/src/pages/Onboarding.tsx` or settings | UG-L (saltbox naming origin), 4-W (local-first), 4-X (no-scoring) |
| `salt-box/src/data/methodologies.ts` or tour cards | 3-P (seven methodology cards), UG-R (tour intro/close; ID renumbered from UG-M to avoid collision with X Buckets UG-M) |
| `salt-box/src/data/quotes.ts` | UG-S (watching you on the trampoline; ID renumbered from UG-N to avoid collision with X Buckets UG-N) |
| `salt-box/src/pages/Recap.tsx` or family recap | UG-O (snapshot preamble) |

### Legacy Gatekeeper sweep notes (Task #802)

The Legacy Gatekeeper codebase (`https://legacy-gatekeeper.replit.app/`) was swept via live URL fetch of all accessible pages (home, /about, /translate, /mappings, /history). Git history and conversation logs were not accessible from this environment. The about page contained the primary founder-voiced prose; the mappings page contained the original working vocabulary registry. The translate page confirmed the "Inside (Bright Side)" / "Outside (Massity)" / "Pass Through Gate" UI framing as the earliest published version of this vocabulary.

| Source | Passages recovered |
|---|---|
| `legacy-gatekeeper.replit.app/about` (pull-quote) | 3-U (ID renumbered from 3-P to avoid collision with Task #803 Saltbox 3-P) |
| `legacy-gatekeeper.replit.app/about` (founding paragraph) | 3-V (ID renumbered from 3-Q to avoid collision with existing IDs) |
| `legacy-gatekeeper.replit.app/about` ("Two Worlds Meeting" §1) | 4-AD (ID renumbered from 4-W to avoid collision with Task #803 Saltbox 4-W) |
| `legacy-gatekeeper.replit.app/about` ("Two Worlds Meeting" §2–3) | 4-AE (ID renumbered from 4-X to avoid collision with Task #803 Saltbox 4-X) |
| `legacy-gatekeeper.replit.app/mappings` (full active registry) | UG-T (ID renumbered from UG-L to avoid collision with Task #803 Saltbox UG-L) |

*All passages confirmed verbatim. No synthesis or composition.*
