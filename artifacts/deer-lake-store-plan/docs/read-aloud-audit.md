# Deer Lake deck — read-aloud audit

**Status:** Agent's pre-read pass. **Not** a substitute for the real session
with a band-council member or the contractor.

## What this document is

The companion task asks for a working session where a band-council member or
the contractor reads the deck out loud, slide by slide, and we capture the
specific sentences that confuse them. That session has not happened yet — it
needs a real person from Deer Lake or the contractor's team. Faking it would
be worse than useless.

What this file *is*: a careful pre-read by an outside editor (the agent),
flagging every sentence I'd expect the real session to surface. It serves
two purposes:

1. **A first cut for a follow-up code task.** Items marked `agent: edit` are
   ones where I'd just go ahead and rewrite if asked. Items marked
   `agent: ask reader` are ones where the call belongs to a Deer Lake reader,
   not me.
2. **A starting list for the live session.** When the founder sits down with
   a band-council member, this list gives the reader something to react to —
   "do these phrases bother you, or are they fine?" — instead of starting
   from a blank page.

The companion file `read-aloud-worksheet.md` in this folder is the
slide-by-slide form the founder should fill in *during* the live session.

## How items are tagged

- **`agent: edit`** — I think this should be rewritten. Specific replacement
  suggested. Apply if the reader confirms (or just apply, if no objection
  is likely).
- **`agent: ask reader`** — Could be jargon, could be fine. The Deer Lake
  reader's reaction decides.
- **`agent: gloss`** — The phrase is correct/needed but should carry an inline
  explanation in parentheses, the way "Nutrition North → the federal grocery
  help money for the north" is already glossed elsewhere.
- **`agent: leave`** — Looked at it, decided it's fine. Listed for
  completeness so the reader can disagree.

## Cross-cutting observations

1. **The "why current stores fail" slides (4, 5, 6) pull text from
   `lib/why-stores-fail/src/index.ts`.** That catalog is still written in
   research voice — phrases like *"subsidy capture & opaque pass-through,"*
   *"single-trailer fragility,"* *"backhaul economics,"* *"PeopleTrap
   compensation,"* *"HACCP / processing gap,"* *"shrink & stock-outs."* The
   on-slide titles and `summary` strings need a plain-language pass before
   the live read-aloud session, otherwise the reader will hit a wall in the
   middle of the deck. **This is the single biggest remaining jargon
   pocket.** A follow-up code task should rewrite the `shortName`, `title`,
   and `summary` fields in that catalog (the longer `evidence` field can
   keep its research voice — it's footer/source material).

2. **"Nutrition North" is glossed in some places and bare in others.**
   ProblemOpportunity slide carries the gloss "*Nutrition North, the
   federal grocery help program for the north*"; PosOps refers to "*the
   Nutrition North claim*" with no gloss. Pick one approach: either gloss
   on first mention only and use the program name afterward, or always
   write "the federal grocery help money" and never use the program name
   on-slide. Current state is mixed.

3. **Dense parenthetical numbers read badly out loud.** Multiple lines
   shaped like *"(58¢ on the shelf, 42¢ kept by the store, per dollar from
   Nutrition North, the federal grocery help program for the north)"* are
   five facts in one parenthesis. They scan fine on screen, they tumble
   when spoken. The live reader will tell us how much of this they want
   broken into a separate caption line.

4. **Federal-program clusters are the worst single sentence in the deck.**
   The FinancialsRole "Where the opening money comes from" block names
   *FedNor*, *Northern Ontario Development Program*, *Community Futures*,
   *Indigenous Services Canada Community Capital Program*, and *Local
   Food and Farm Co-operatives* in one paragraph. Even with the gloss for
   FedNor, that paragraph is unreadable out loud. Almost certainly an
   `edit` candidate after the live session — bullet it instead of running
   it as one sentence.

---

## Slide 1 — Prologue ("The eagle answered")

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 1.1 | The eagle story itself, attributed to the founder | None — attributed first-person voice. Reads aloud well. | `agent: leave` |
| 1.2 | "*The story that sealed Headwaters' fate.*" | Slightly literary. Likely fine — but a Deer Lake reader may find "sealed Headwaters' fate" a touch dramatic. | `agent: ask reader` |

## Slide 2 — Cover

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 2.1 | "*A plan for the contractor and the band council to read together*" | Clear. | `agent: leave` |
| 2.2 | "*An operating plan you don't have to write yourself*" | "Operating plan" is mildly business-y, but the second half lands. | `agent: ask reader` |
| 2.3 | "*Treaty 5 · Northwestern Ontario*" | Treaty 5 is correct and recognised. Leave. | `agent: leave` |

## Slide 3 — The problem and the opportunity

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 3.1 | "*Most Ontario First Nations you can only reach by plane have just one grocery store. That is the highest of any province in Canada.*" | Reads aloud fine, but the syntax of "Most Ontario First Nations you can only reach by plane have…" is a near-stumble — three modifiers stack before the verb. Suggest: "*In Ontario, most fly-in First Nations have just one grocery store — the most of any province in Canada.*" | `agent: edit` ✅ applied (task #284) |
| 3.2 | "*(58¢ on the shelf, 42¢ kept by the store, per dollar from Nutrition North, the federal grocery help program for the north)*" | Five facts in one parenthesis. Suggest splitting into a separate caption beneath the bullet, or shortening to "*(58¢ reaches the shelf. 42¢ stays with the store.)*" | `agent: edit` ✅ applied (task #284) |
| 3.3 | "*Most of the federal grocery help money stays with the store. Not much reaches the shelf.*" | Excellent rewrite of "subsidy capture." Leave. | `agent: leave` |
| 3.4 | "*Arctic Co-operatives Ltd.*" | Proper noun, correct. The "Ltd." is awkward to say out loud. Suggest dropping it: "*Arctic Co-operatives*". | `agent: edit` ✅ applied (task #284) |
| 3.5 | "*The Meechum store in Mistissini*" | Pronunciation. Both Meechum and Mistissini may be unfamiliar. Likely fine to leave but worth confirming with the reader. | `agent: ask reader` |
| 3.6 | "*Headwaters gets paid for the software, training, and tools the store runs on. We do not take a cut of the groceries.*" | Strong, plain. Leave. | `agent: leave` |
| 3.7 | "*Over two years the store grows into 17 to 20 jobs for people who live in Deer Lake.*" | Clear. | `agent: leave` |

## Slides 4 + 5 + 6 — Why current stores fail (catalog-driven)

These three slides render text from `lib/why-stores-fail/src/index.ts`. The
agent flagged the entire catalog as the deck's biggest remaining
plain-language gap. Specific shortName / title fields likely to confuse
a Deer Lake reader:

| # | Catalog field | Current text | Suggested plain-language version | Tag |
|---|---|---|---|---|
| 4.1 | `subsidy-capture.shortName` | "Subsidy capture" | "Most of the help money stays with the store" | `agent: edit` |
| 4.2 | `subsidy-capture.title` | "Nutrition North subsidy capture & opaque pass-through" | "Most of the federal grocery help money never reaches the shelf" | `agent: edit` |
| 4.3 | `capital-leakage.shortName` | "Capital leakage" | "Money leaves the community" | `agent: edit` |
| 4.4 | `no-community-equity.shortName` | "No community equity" | "The community has no say" | `agent: edit` |
| 4.5 | `single-trailer-fragility.shortName` | "Single-trailer fragility" | "One truck. One breakdown empties the shelf." | `agent: edit` |
| 4.6 | `single-trailer-fragility.summary` | "*…on one 11×7 reefer trailer (or one weekly air-freight slot)…*" | Drop "11×7 reefer" — that's a spec, not a story. Say "one refrigerated trailer." | `agent: edit` |
| 4.7 | `no-backhaul.shortName` | "No backhaul economics" | "Trucks come back empty, so every load costs more" | `agent: edit` |
| 4.8 | `no-backhaul.summary` | "*Trucks run loaded north and empty south.*" | Reads OK; second sentence "*…the entire round-trip cost has to be recovered from one direction…*" is dense. Suggest: "*The store has to pay for the empty drive home, which lifts the shelf price.*" | `agent: edit` |
| 4.9 | `soft-infrastructure-gap.shortName` | "Soft infrastructure gap" | The phrase itself is meaningless to a non-academic reader. Suggest: "Nobody is coordinating the trucks" | `agent: edit` |
| 4.10 | `shrink-and-stockouts.shortName` | "Shrink & stock-outs" | "Food spoils. Shelves go empty." | `agent: edit` |
| 4.11 | `cost-of-living-gap.shortName` | "Cost-of-living gap" | "Food up here costs much more" | `agent: ask reader` (probably fine but blunt) |
| 4.12 | `haccp-processing-gap.shortName` | "HACCP / processing gap" | "No certified place to cut and pack local food" — and explain that HACCP is the federal food-safety rulebook, on first use. | `agent: edit` + `agent: gloss` |
| 4.13 | `producers-blocked.shortName` | "Producers blocked from wholesale" | "Small farms and harvesters can't sell to the store" | `agent: edit` |
| 4.14 | `capital-access-gap.shortName` | "Capital access gap" | "Small producers can't get a loan" | `agent: edit` |
| 4.15 | `peopletrap-compensation.shortName` | "PeopleTrap compensation" | The phrase is opaque even to a generalist editor. **Live reader almost certainly will not know what this means.** Needs a rewrite based on what the catalog actually means by it. | `agent: ask reader` (and likely `edit`) |

The corresponding `summary` strings carry similar phrasing and should be
revisited in the same code task.

## Slide 7 — Supply chain

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 7.1 | "*Paid for by the federal Local Food Infrastructure Fund when it opens up again, with our partner Local Food and Farm Co-operatives.*" | Two long proper nouns back-to-back. Suggest split: "*Paid for by the federal Local Food Infrastructure Fund (a grant program for food projects) when it opens up again. Our partner on it is Local Food and Farm Co-operatives.*" | `agent: edit` ✅ applied (task #284) — slide had already dropped the second proper noun; we added the "(a grant program for food projects)" gloss to LFIF. |
| 7.2 | "*Wasaya, Bearskin, and North Star Air bring fresh food in by plane.*" | Three local airlines. Familiar in NWO. Leave. | `agent: leave` |
| 7.3 | "*Slate River Dairy, Thunder Oak, Belluz, Sleepy G.*" | Regional brand list. Council members may know some, not others. Leave for now — but worth confirming with reader. | `agent: ask reader` |
| 7.4 | "*Sysco Canada, GFS Canada, and Federated Co-operatives*" | "GFS" is an acronym (Gordon Food Service) and is not spelled out. Suggest spelling out or dropping it. | `agent: edit` ✅ applied (task #284) — slide already says "Sysco, Gordon Food Service, and Federated Co-operatives." |
| 7.5 | "*Robin Hood flour 10kg, Carnation, Klik, Tang, Kraft Dinner, Bimbo bread.*" | Brand list — the brands northern families actually buy. Strong, leave. | `agent: leave` |
| 7.6 | "*The federal grocery help money shows up in the shelf price. For items that do not qualify for the help money, the shipping cost is printed on the tag.*" | Clear. Leave. | `agent: leave` |

## Slide 8 — The first morning (POS / ops)

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 8.1 | "*Pay-day tabs for community members can be turned on. But only after the band council writes a clear rule on how it works and who can use it.*" | "Tabs" is colloquial but probably understood. Leave. | `agent: leave` |
| 8.2 | "*The Nutrition North claim builds itself from the daily sales.*" | "Nutrition North" appears bare here while glossed elsewhere. Suggest: "*The federal grocery help money claim builds itself from the daily sales.*" | `agent: edit` ✅ applied (task #284) — slide now reads "The federal grocery help claim builds itself from daily sales." Cross-cutting note 2 also resolved: no bare "Nutrition North" remains anywhere in the deck source. |
| 8.3 | "*Same open-records system as the public price page and the household lookup. One set of records. One place to look.*" | "Open-records system" is plain. Leave. | `agent: leave` |
| 8.4 | "*The shipping cost is added to the price by the system, by category, when items are loaded in.*" | "By category, when items are loaded in" is a touch technical. Probably fine but worth confirming. | `agent: ask reader` |

## Slide 9 — Who works the store (StaffingModel)

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 9.1 | "*Hunting season. Funerals. Hockey tournaments. Bad weather days.*" | Excellent — names the actual rhythm. Leave. | `agent: leave` |
| 9.2 | "*Technical advisor on retainer.*" | "On retainer" is jargon. Suggest gloss: "*Technical advisor on retainer (we keep them paid so they're available when we need them).*" Or rephrase: "*A technical advisor we keep on call.*" | `agent: edit` ✅ applied (task #284) — slide now says "Technical advisor on call." |
| 9.3 | "*Reviews the software every three months. Checks any code that touches money before it goes live.*" | "Code that touches money" is vivid; will probably read OK. | `agent: ask reader` |
| 9.4 | "*Trains the trainers from the start.*" | Slogan-ish but clear. Leave. | `agent: leave` |
| 9.5 | "*Pay is part salary, part by the job.*" | Clear. Leave. | `agent: leave` |

## Slide 10 — The numbers, the schedule, who runs it (FinancialsRole)

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 10.1 | "*FedNor (the federal economic agency for northern Ontario) runs the Northern Ontario Development Program. Community Futures and the Indigenous Services Canada Community Capital Program also help. Plus a partnership with Local Food and Farm Co-operatives. Plus a contribution from the band.*" | **The single hardest paragraph in the deck to read aloud.** Five federal-program names in four sentences. Strongly suggest converting to a bullet list with one program per line, each on its own line with its own gloss. | `agent: edit` ✅ applied (task #284) — five-program paragraph is now a five-bullet list, each program with its own one-line gloss. |
| 10.2 | "*Quiet trial run*" (timeline label) | What is a "quiet trial run"? We mean soft opening — a few staff, friends-and-family, before doors open to everyone. Suggest tooltip or glosss: "*Quiet trial run — a few days where only some shoppers come in, so we can find problems before opening to everyone.*" | `agent: edit` (or `gloss`) |
| 10.3 | "*We get the gap money back when the last two invoices clear.*" | "Invoices clear" is finance-speak. Suggest: "*We get the gap money back when the last two bills get paid.*" | `agent: edit` ✅ applied (task #284) — "invoices clear" → "bills get paid" in the FinancialsRole footnote. |
| 10.4 | "*(Indigenous Services Canada is the federal department that pays the band. They take about 60 days to pay each invoice.)*" | Glossed. Leave. | `agent: leave` |
| 10.5 | "*We have a written payback promise on file from last time, for $22,000.*" | Reader will ask "what last time?" The deck doesn't say this elsewhere. Add one short sentence of context, or drop the line. | `agent: ask reader` |
| 10.6 | Table headers "*plan / our cost / what we charge / gap money*" | "Gap money" is defined nearby but lands quickly. Probably OK, but the reader should weigh in. | `agent: ask reader` |
| 10.7 | "*This replaces today's $35,000 a month software-only contract.*" | Clear. Leave. | `agent: leave` |

## Slide 11 — What Headwaters delivers (ServicePartner)

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 11.1 | "*we charge our cost plus 35% put back in*" (kicker) | "*35% put back in*" reads awkwardly aloud. Suggest: "*we charge our cost plus a 35% top-up that we put back into the store.*" | `agent: edit` ✅ applied (task #284) — kicker now reads "we charge our cost plus a 35% top-up that we put back into the store." |
| 11.2 | "*Three things the band buys. One of them stays.*" | Sharp, strong. Leave. | `agent: leave` |
| 11.3 | "*We do not invent what already exists. We resell the tools that we have tested up here. We bundle them into a system that works. Our markup sits in the open. There is no hidden charge in the monthly fee.*" | "*Markup sits in the open*" is mildly business-y. Reader call. | `agent: ask reader` |
| 11.4 | "*$69,700 a month is what it costs us + $24,300 a month (35%) we put back in = about $94,000 a month total.*" | Math equation. Reads as "sixty-nine seven hundred a month is what it costs us plus twenty-four three hundred a month, thirty-five percent, we put back in, equals about ninety-four thousand a month total." Suggest sentence form: "*It costs us $69,700 a month to run. We add $24,300 a month — that's the 35% we put back into the store. The total is about $94,000 a month.*" | `agent: edit` ✅ applied (task #284) — sentence-form rewrite on the ServicePartner kicker block. |
| 11.5 | The four reinvestment-bucket lines (sourced from `@workspace/headwaters-pricing`) | Worth checking the bucket labels and `shortDescription` fields against the same plain-language standard. Not visible from this slide alone. | `agent: edit` ✅ applied (task #336) — labels rewritten in `lib/headwaters-pricing/src/index.ts` from internal-accounting names ("Tech CAPEX", "Tooling subs", "Training & R&D", "Pilot reserve" / "Pilot #2 reserve") to plain language ("Computers and phones", "Software subscriptions", "Training and the written guide", "Saved for the next reserve"). The `shortDescription` / `longDescription` fields lost the jargon ("self-hosted servers", "privacy phones", "GIS", "secure comms", "playbook hours", "seeds the next reserve") in favour of phrases the read-aloud reader will recognise ("servers we run ourselves", "secure phones", "mapping", "secure messaging", "hours spent writing the guide", "kept in its own account"). Slide 11 of the deck and the Practitioner one-pager's "What the 35% reinvestment buys" table both pull from the same source so they update together. |

## Slide 12 — First reserve, then the next

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 12.1 | "*Reserve number two · year 1 total*" | The system word "corridor" is used here and below. A Deer Lake reader probably won't know what "corridor" means in this context. Consider on first use: "*your corridor (the route, the costs, and the trip pattern for the next reserve)*" or just rename throughout. | `agent: ask reader` |
| 12.2 | "*Your corridor · edits stay on this slide*" | Same as 12.1. | `agent: ask reader` |
| 12.3 | "*Planning estimate · ... · weeks × flight + days × (lodging + food)*" | The math formula is helpful on screen, hostile out loud. Suggest a plain-language version below it: "*we count one flight per install week, then add lodging and food for each on-site day.*" | `agent: edit` ✅ applied (task #284) — the slide carries an "In plain words: one return flight per install week, plus lodging and food for each on-site day." caption directly under the formula. |
| 12.4 | "*$3,500 on-site / $1,800 remote / $30k/yr retainer*" (from manifest description) | If this lands as on-screen text, the slash-separated rates need spacing out for read-aloud: "*$3,500 a day on-site, $1,800 a day remote, plus a $30,000-a-year retainer.*" | `agent: ask reader` |

## Slide 13 — Risks and the ask (RisksAsk)

| # | Quoted phrase | Concern | Tag |
|---|---|---|---|
| 13.1 | The seven risks list | Strong throughout. Leave. | `agent: leave` |
| 13.2 | "*A store the community owns is something the current store can never copy. That is our edge.*" | "Our edge" is mildly pitch-deck-y. Reader call. | `agent: ask reader` |
| 13.3 | "*An hour with the contractor. In person if possible. No slides. Just a conversation.*" | Excellent. Leave. | `agent: leave` |
| 13.4 | "*we bill $90,000 a month. It costs us $69,700 a month. This is for the full Headwaters team. It replaces today's $35,000-a-month software-only contract. Same client. Same software. With the full team and accountability around it. We put 35% of what you pay back into building the store. An outside reviewer checks this every year. Day-one ask: about $181,000 in money to cover the gap.*" | Long paragraph, lots of numbers. Reads OK because the sentences are short, but the reader will want to slow down. Worth confirming the gap-money sentence reads cleanly. | `agent: ask reader` |
| 13.5 | "*Supplier exclusivity*" | Jargon. Suggest: "*an agreement that locks the store into buying only from us.*" | `agent: edit` ✅ applied (task #284) — RisksAsk now reads "an agreement that locks the store into buying only from us." |
| 13.6 | "*— Headwaters. The work is paid for. The value comes back. Deer Lake earns it. Then every reserve does.*" | Strong sign-off. Leave. | `agent: leave` |

---

## Recommended order for the follow-up code task

If a follow-up code task acts on this list without waiting for the live
session, I'd do it in this order:

1. ✅ **Rewrite the `lib/why-stores-fail/src/index.ts` `shortName`, `title`,
   and `summary` fields** for the entries flagged in slide 4-6 above
   (rows 4.1 - 4.15). This is the single biggest plain-language gap.
   *Done in task #281.*
2. ✅ **Bullet the federal-program paragraph on FinancialsRole (10.1)** —
   one program per line, each glossed once. *Done in task #284.*
3. ✅ **Standardise "Nutrition North" usage** (cross-cutting note 2): pick
   one approach and apply consistently. Likely fix is at PosOps 8.2.
   *Done in task #284 — no bare "Nutrition North" remains in the deck
   source; the deck consistently uses "the federal grocery help (money)."*
4. ✅ **Apply the small `agent: edit` line-level rewrites** (3.1, 3.2, 3.4,
   7.1, 7.4, 9.2, 10.3, 11.1, 11.4, 12.3, 13.5). *Done in task #284 —
   each row above is annotated with the applied wording. A few of the
   line-level rewrites had already been picked up by earlier passes
   (3.1 / 3.2 / 3.4 / 7.4 / 8.2 / 9.2 / 11.1 / 12.3); task #284 confirmed
   them in place and applied the remainder.*
5. **Wait for the live session** to resolve the `agent: ask reader`
   items — these are the ones where my outsider judgement is not
   trustworthy and a Deer Lake reader's reaction is what matters.
