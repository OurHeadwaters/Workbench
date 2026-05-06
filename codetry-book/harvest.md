# Codetry Book — Content Harvest
**Status:** Fully audited — every passage line-by-line verified against its source file.
**Rebuilt:** 2026-05-06
**Audited:** 2026-05-06 — full line-by-line sweep; one missing interior paragraph found and restored (4-F, both-states.md line 15).
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

### 1-J · Deer Lake Prologue — alternate eagle text (deleted artifact)

> I was writing this plan out on my deck, watching nature. I asked myself a question: *is this the right direction?*
>
> At that moment an eagle appeared above me. I said, "well hello!" He came down low and stayed above me.
>
> I asked again, this time to him: *is this the right direction?*
>
> He flew in a slow circle. Then he flew out of sight.

`commit:3686992~1 · artifacts/deer-lake-walkthrough/src/sections/Prologue.tsx`
*(Deer Lake Walkthrough was archived as Community Store Playbook in commit 3686992. This is the version of the eagle narrative that lived in the deleted artifact's Prologue component — slight wording variation from the current EaglePrologue.tsx.)*

---

### 1-K · Constellation role prose — Saltbox Zone 0 (deleted working doc)

> Homeschool day companion. Local-first per family — each household runs its own instance, nothing is shared because nothing needs to be. Worked examples: Lock-In Wins (15 quiet minutes is enough to count; no streaks, no scores), Gentle Words (a 6-line bank used sparingly so the words don't lose weight), Brave Moments (one-tap capture, surfaced in the seasonal Family Recap), Quote of the Day (deterministic per date), Live Follow-Along (opt-in only, lock-in count excluded from share payload), per-child Goals.

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, Saltbox Zone 0 entry)

---

### 1-L · Constellation role prose — Headwaters Zone 1 (deleted working doc)

> Non-custodial XRPL envelope-budgeting PWA (was xBuckets / Watershed). The household balance is the source of the whole watershed; every other zone sits downstream. The cleanest demonstrations of metaphor-as-architecture: Buckets (envelopes — you can only pour from one to another, never summon water from nothing; rename to 'Categories' and the UI starts suggesting balances can grow by clicking), XRP Spring (savings above the 10-XRP network reserve, with a six-stage bamboo growth scene that extends the metaphor from data model into artwork), Community Well (monthly pooled tips round-distributed to community proposals — the well refilling).

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, Headwaters Zone 1 entry)

---

### 1-M · Constellation role prose — Dam Days and Shallows Zone 5 (deleted working doc)

> Wild / observation; the skipping-rock zone. Default private (Dam Days takes via watershed.replit.app + Expo mobile), with a share affordance that floats a thought to the Shallows, shrouded in mystery from the depths below. The cleanest demonstrations of metaphor-as-architecture: the rebrand without a rewrite (Watershed → Dam Days touched display strings and prose; chapter IDs / storage keys / table names / schema all held — the bones were the metaphor underneath the name), the Channel produces Z0-through-5 reads of the user's own life (the app teaches the meta-pattern by being it), pseudonymity-as-architecture (Shallows handles derived deterministically from sessionToken+postId — the depths-below-the-shallows framing IS the one-way hash), typos as fingerprints (the Forge mandates verbatim preservation; the bound book quotes the user's own typos back as evidence).

`commit:ea059b3~1 · artifacts/practitioner-operating-plan/src/pages/Codetry.tsx` (constellation array, Dam Days Zone 5 entry)

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

> Conventional-to-regenerative track for industries; current sector is regen beef in NWO through its highest-leverage chokepoint (abattoir capacity, not pasture or customers). The cleanest demonstrations of metaphor-as-architecture: 'Per-customer share split' replacing 'cut sheet management' (renaming the centerpiece rewrote schema, success metrics, and build sequence in one move), 'Don't fix my book' (Karen's line — naming her paper ledger as a working artifact REMOVED a feature, the booking calendar, from v0.1). Plus the tone-as-architecture lines: 'Failures land on the tool, not on her' / 'Make it easier for Karen to say no, not just easier to say yes.'

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

---

## Sweep Metadata

**Sweep date:** 2026-05-06
**Sweep type:** Full — live codebase + git history deleted files

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

**Total passages:** 59 (sections 1–5 + Unplaced Gems)
**Git sweeps:** 4 deletion commits checked; 11 prose-bearing deleted files recovered; 0 false positives included.
**Conversation history:** Not accessible from this environment.

*All passages confirmed verbatim. No synthesis or composition.*
