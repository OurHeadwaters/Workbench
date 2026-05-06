# Chapter 3 — The Dam Breaks

*Second pass · founder-reviewed · decisions applied 2026-05-06*
*Continuity pass 2026-05-06 — no text changes required. Explicit Ch2 callback at line 13 ("In Chapter 2, you watched the dam being built") confirmed present and correct. "Primitive" used at line 83 before its formal Ch4 definition — confirmed as intentional forward reference consistent with the chapter's role as a conceptual bridge. "Constellation" used at line 103 in the same forward-reference register as Ch1. Definition of codetry at end of chapter (line 81–83) correctly anticipates and sets up Ch4 §Codetry as Architecture. Tone: philosophical — appropriate as the pivot chapter between fieldwork (Ch2) and formal architecture (Ch4).*

---

When a northern food co-op uses the word *resident* instead of *neighbour*, something real changes — the relationship implied, the obligation carried, the culture formed. When a practitioner names their emergency food reserve *The Call* and their ongoing stock discipline *The Pantry*, they end up with two separate systems, two separate cultures, and a handoff they have to invent under fire. When a funder asks a community to describe its *bank account* and the community's word for that thing is *channel*, the translation is not neutral — something is lost, or flattened, or colonized in the language itself.

The words you use to describe your economy determine what your economy can become. This is not a rhetorical claim. It is a practical one.

---

In Chapter 2, you watched the dam being built — the infrastructure of a northern community economy: the store, the food systems, the seasonal rhythms, the practitioner's workbench. Here is the moment it becomes a system. Not through a breakthrough. Through a name.

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

(Domain-Driven Design — DDD — is a software practice that says your code should be named to match the world it models: a banking app uses *account* and *transaction*, not *record* and *event*. The field has been standard in software since the early 2000s.)

Then the discipline asks a harder question. *Whose language?*

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

It relates to literate programming this way:

> Literate programming makes the reasoning the source. Codetry makes the metaphor the source.

> Both are don't-trust-verify moves — show the work where the work actually does the work.

The point of departure is the noun, not the argument.

---

The clearest worked example is small enough to hold in one sentence.

*Buckets.* Envelope categories. You can only pour from one to another — you cannot summon water from nothing. Rename to *Categories* and the UI starts quietly suggesting balances can grow by clicking. The name was doing structural work. The rename was not neutral. The constraint that protected the community's money lived in the word.

That is what the dam breaks means. Not a collapse. A moment of clarity about what has been holding — the realization that the name was load-bearing all along, and always had been. The dam didn't break. You finally saw what it was made of.

---

The worked examples in this handbook come from one practitioner's specific context — a small constellation in northwestern Ontario, on Treaty 3 Territory, centred in Dryden. A food co-op. A jar kitchen. A spring-fed well with a manual pump. Those examples are here because a discipline without a real example is not a discipline; it is a wish. Use them to understand the moves.

Then throw them away. The only correct way to read this book is to come out the other end building something that has nothing to do with a food co-op in Dryden — unless, of course, that is exactly where you are.

---

*End of Chapter 3.*
