# Chapter 3 — The Dam Breaks

*First full draft · assembled from harvest.md Section 3 passages · for founder review*
*Draft date: 2026-05-06 · Status: UNEDITED — return to founder before any further revision*

---

The discipline arrives here.

Not as a theory. As a problem that kept happening and needed a name.

---

The words you use to describe your economy determine what your economy can become. This is not a rhetorical claim. It is a practical one.

When a northern food co-op uses the word *resident* instead of *neighbour*, something real changes — the relationship implied, the obligation carried, the culture formed. When a practitioner names their emergency food reserve *The Call* and their ongoing stock discipline *The Pantry*, they end up with two separate systems, two separate cultures, and a handoff they have to invent under fire. When a funder asks a community to describe its *bank account* and the community's word for that thing is *channel*, the translation is not neutral — something is lost, or flattened, or colonized in the language itself.

---

This is what Codetry hedges against.

It hedges against the slow ways a community's own words get taken from it inside the systems built in its name. Knowledge creeps: a word a person used in a kitchen ends up, three meetings later, as a different word in a deck. Language drifts: *the books* becomes *the ledger* becomes *the financial management module*, and the original noun is no longer in the room. LLMs tokenize: a load-bearing noun gets sheared into sub-word fragments and reassembled as something more generic, more poolable, more average. Consultants and SaaS vendors translate: the community's vocabulary is rewritten into the vendor's data model on the way to a contract, and the contract is what survives.

None of these moves announces itself as a loss. Each one feels like cleanup, like progress, like professionalism. The discipline exists because the loss is real anyway, and because by the time it is visible at the surface — in a screen, a report, a policy — the substrate it was built on has already shifted.

---

So this handbook is a vocabulary.

Not a framework, not a methodology, not a strategic plan. A vocabulary — the specific, precise, weight-tested words that a community needs to run its own economy without importing someone else's assumptions along with the terminology.

It was built in Headwaters, a small constellation of economic systems serving northwestern Ontario — food, money, knowledge, emergency preparedness, land. The words here emerged from practice: from the specific moment when the wrong word caused a real problem, and the right word had to be found. They have been tested in the field, rejected when they didn't hold, and revised when the context changed.

---

This is not neutral technical vocabulary. It is a set of claims about how a community economy works, encoded in the words used to run it. If your vocabulary is borrowed from grant applications, from SaaS platforms, from government forms — your economy will slowly take the shape of those forms. If your vocabulary is built from your own practice, named by your own practitioners, tested in your own conditions — your economy has a chance to stay yours.

This handbook is for practitioners: people who are already running something, who are frustrated by language that almost fits, and who are ready to name what they are actually doing with precision.

It is not for everyone. It is for the people who feel the friction of the wrong word at the exact moment when the right word would have mattered.

---

The practitioner's first move is not to build. It is to listen.

Every project arrives wrapped in a noun the community already uses. A co-op committee says *the books*. A homeschool circle says *the day*. A trapline keeper says *the territory*. An extension agent says *the season*. The community has already named the thing.

The temptation is to translate it. *The books* becomes *the ledger* becomes *the financial management module*. *The day* becomes *the curriculum*. *The territory* becomes *the dashboard*. Each translation feels like progress and each translation steps the system one foot away from the people it is being built for.

The codetry practitioner's first move is to write down the noun the community used and refuse to translate it. The system, when it ships, has *the books* in it. The button says *open the books*. The data table is called *the books*. The reports are *what the books say this month*. If the team starts saying anything else in the working session, the practitioner asks why and writes the new word down, because something has shifted.

> The noun is not branding. The noun is the foundation footing.

> *Rule — write down the noun the community already uses, and refuse to translate it.*

---

The discipline agrees with Domain-Driven Design this far: the language outside the code should be the language inside the code.

Then it asks a harder question. *Whose language?*

DDD typically lands on the domain expert — the analyst, the consultant, the senior engineer who has just spent a week in workshops tidying the vocabulary up. Codetry insists the noun must come from the community itself, in the form the community already uses it, before any tidying.

Which means translation away from that noun — even into a cleaner, more general, more reusable noun — is treated as *drift*, not as cleanup. The moment a *saltbox* becomes a *household container* in the schema, the architecture has slipped, even if every test still passes. The codetry-test exists because that slip is invisible to the type checker and obvious to the person who handed you the word.

> Conway and DDD ask whose org shapes the system. Codetry asks whose word survives the schema — and treats every translation away from it as drift.

---

The principle applies to the practitioner's own tools too.

"Founder" feels odd. You don't found a community — you practice within it. You join to help. You have the phone calls, take the actions, practice listening. We practice these things because we know we need to. Crafting all day is what makes life that extra bit sweeter.

This is not a founder's dashboard. It is a practitioner's workbench — the place where the week is planned, the costs are walked, and the work is kept honest against what was said it would be.

The rename happened because the word was wrong. That is a codetry move on your own work.

---

Here is the definition the discipline lands on.

Codetry is the practice of building software whose primary load-bearing material is metaphor. The naming is the architecture; the code is the medium that makes the metaphor real, clickable, and runnable.

The unit of care is the name. The truth lives in the metaphor — the chosen noun carries the constraint; the schema, the UI, and the verbs of the app follow from it. Code is generated from named structure. Rename a primitive — *Buckets* to *Categories*, *Practitioner* to *Founder* — and the structure quietly changes shape underneath the name.

It relates to literate programming this way: literate programming makes the reasoning the source; codetry makes the metaphor the source. Both are don't-trust-verify moves — show the work where the work actually does the work. But the point of departure is the noun, not the argument.

---

The clearest worked example is small enough to hold in one sentence.

*Buckets.* Envelope categories. You can only pour from one to another — you cannot summon water from nothing. Rename to *Categories* and the UI starts quietly suggesting balances can grow by clicking. The name was doing structural work. The rename was not neutral. The constraint that protected the community's money lived in the word.

That is what the dam breaks means. Not a collapse. A moment of clarity about what has been holding.

---

The worked examples in this handbook come from one practitioner's specific context — a small constellation in northwestern Ontario, on Treaty 3 Territory, centred in Dryden. A food co-op. A jar kitchen. A spring-fed well with a manual pump. Those examples are here because a discipline without a real example is not a discipline; it is a wish. Use them to understand the moves.

Then throw them away. The only correct way to read this book is to come out the other end building something that has nothing to do with a food co-op in Dryden — unless, of course, that is exactly where you are.

---

*End of Chapter 3 draft.*

---

## Editorial notes for founder review

**Narrative arc:**
The chapter follows this arc: the practitioner claim (language is not neutral) → what Codetry hedges against (the four modes of vocabulary loss: creep, drift, tokenization, vendor translation) → the invisible nature of each loss → what this handbook is, and isn't (vocabulary, not framework) → where it was built (Headwaters, Treaty 3, practice) → who it's for (the practitioner who feels the friction) → the first move (listen for the noun, refuse to translate it) → the harder question DDD doesn't ask (whose word survives the schema?) → drift as a technical failure, not just a cultural one → the principle applied to the practitioner's own tools (Founder → Practitioner rename) → the definition (naming IS architecture) → the relationship to literate programming (metaphor-source, not reasoning-source) → the canonical worked example (Buckets/Categories) → the dam breaks image → worked-examples caveat (throw Dryden away, unless you're there).

**Passages included from harvest.md Section 3:**
3-A (language is not neutral + resident/neighbour + channel/bank account), 3-B (the hedge — four modes of loss + invisible until too late), 3-C (this handbook is a vocabulary + built in Headwaters + tested in the field), 3-D (non-neutral vocabulary + who this is for + the friction of the wrong word), 3-E (listen for the noun + translation temptation + practitioner's first move + noun-is-foundation pull-quote + rule callout), 3-F (DDD vs. Codetry + saltbox drift + codetry-test callout), 3-L (Founder feels odd — the practitioner renaming her own tool), 3-J (Codetry definition — naming is architecture, unit of care, where truth lives, rename changes structure), 3-H (thesis — metaphor-source vs. reasoning-source), 3-I (both are don't-trust-verify), 3-K (Buckets canonical example), 3-G (worked examples caveat + throw them away callout).

**Passages held back:**
None — all twelve sub-sections (3-A through 3-L) are represented. 3-H and 3-I are brief and folded into a single bridging paragraph rather than quoted verbatim, since standing alone they read as notes rather than prose.

**Ordering decisions:**
- 3-A opens the chapter because the claim (language is not neutral) is the thesis from which everything follows.
- 3-B follows immediately — the claim needs the evidence of what actually happens when you ignore it.
- 3-C and 3-D define the object (the handbook) and the reader (the practitioner) — placed here so the practitioner knows what they're holding before the how-to material arrives.
- 3-E (listen for the noun) is the first concrete move — comes after the stakes are established.
- 3-F (whose word survives the schema) deepens 3-E with the DDD comparison — moves from practice to theory, in that order, not the reverse.
- 3-L (Founder → Practitioner rename) appears immediately after 3-F as a first-person demonstration of the schema-drift principle applied to the practitioner's own tool. Placing it here grounds the abstract comparison in a concrete, personal example before the formal definition arrives.
- 3-J, 3-H, 3-I (definition + literate programming) appear after the practitioner examples, not before — the definition earns its precision from the examples, rather than requiring the reader to accept it on faith.
- 3-K (Buckets) is the demonstration — one worked example, as close to the definition as possible.
- 3-G (caveat) closes the chapter because it is permission to leave: don't carry Dryden with you unless you're there.

**Bridging copy added (not from harvest):**
- Opening ("The discipline arrives here. Not as a theory. As a problem that kept happening and needed a name.")
- "So this handbook is a vocabulary" (transition into 3-C)
- "The practitioner's first move is not to build. It is to listen." (transition into 3-E)
- "The discipline agrees with Domain-Driven Design this far" (transition into 3-F — sets up the comparison without quoting the DDD section verbatim)
- "Here is the definition the discipline lands on." (transition into 3-J)
- The literate-programming paragraph bridge (connecting 3-J → 3-H/3-I)
- "The clearest worked example is small enough to hold in one sentence." (transition into 3-K)
- "That is what the dam breaks means. Not a collapse. A moment of clarity about what has been holding." (closing image — new copy, not from harvest)

**Decisions for the founder:**
1. **The dam breaks image:** The closing line ("Not a collapse. A moment of clarity about what has been holding.") interprets the chapter title metaphorically. If the title is meant to carry a different weight — e.g., referring specifically to the moment the system becomes real, or to a beaver-dam callback from Chapter 2 — the close may need adjustment.
2. **DDD framing:** The passage comparing Codetry to Domain-Driven Design assumes the reader has at least passing familiarity with DDD. If this chapter is aimed at non-technical community practitioners, the comparison could be cut or collapsed to a single sentence. If it stays, a one-line gloss on DDD ("DDD is the software practice of naming your code to match the business domain") may be worth adding.
3. **Tone register check at opening:** "Not as a theory. As a problem that kept happening and needed a name." is declarative and plain but slightly more abstract than Chapter 2's opening ("You don't understand a food system by reading about it"). If Chapter 3 should open with a concrete scene rather than a claim, the 3-A resident/neighbour passage could open the chapter instead, and the claim could follow.
4. **3-H and 3-I handling:** The two literate-programming passages are folded into paraphrase rather than quoted. If the founder prefers them verbatim (for precision or attribution reasons), they can be set off as pull-quotes rather than woven into the bridge paragraph.
5. **Chapter 2 callback:** "The dam breaks" may carry an echo of Chapter 2's beaver-dam imagery. A one-sentence callback could be added near the opening if that resonance is intentional — e.g., "In Chapter 2, you watched the dam being built. Here is the moment it becomes a system." Currently the chapter stands alone; the callback is optional.
