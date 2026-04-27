import { constellation, type WorkedExample } from "./constellation";

export type Block =
  | { kind: "para"; text: string }
  | { kind: "subhead"; text: string }
  | { kind: "small"; text: string }
  | { kind: "pull"; text: string }
  | { kind: "callout"; text: string }
  | { kind: "examples"; items: WorkedExample[] }
  | { kind: "list"; items: string[] }
  | { kind: "ordered"; items: string[] }
  | { kind: "rule" };

export type Chapter = {
  id: string;
  number: string;
  title: string;
  partLabel: string;
  partRoman: string;
  blocks: Block[];
};

export type Part = {
  roman: string;
  title: string;
  blurb: string;
  chapters: Chapter[];
};

const partI: Part = {
  roman: "I",
  title: "The Discipline",
  blurb: "Why codetry exists, and what it is, in four short chapters.",
  chapters: [
    {
      id: "1-0",
      number: "1.0",
      partRoman: "I",
      partLabel: "I · The Discipline",
      title: "Why codetry exists",
      blocks: [
        {
          kind: "para",
          text:
            "Before the mechanics — the naming, the drift detection, the saltbox principle, the naming session — it is worth saying plainly what this discipline is hedging against, and what it is not claiming to do.",
        },
        {
          kind: "subhead",
          text: "The hedge.",
        },
        {
          kind: "para",
          text:
            "Codetry is a hedge. It hedges against the slow ways a community's own words get taken from it inside the systems built in its name. Knowledge creeps: a word a person used in a kitchen ends up, three meetings later, as a different word in a deck. Language drifts: *the books* becomes *the ledger* becomes *the financial management module*, and the original noun is no longer in the room. LLMs tokenize: a load-bearing noun gets sheared into sub-word fragments and reassembled as something more generic, more poolable, more average. Consultants and SaaS vendors translate: the community's vocabulary is rewritten into the vendor's data model on the way to a contract, and the contract is what survives.",
        },
        {
          kind: "para",
          text:
            "None of these moves announces itself as a loss. Each one feels like cleanup, like progress, like professionalism. The discipline exists because the loss is real anyway, and because by the time it is visible at the surface — in a screen, a report, a policy — the substrate it was built on has already shifted.",
        },
        {
          kind: "subhead",
          text: "Practice is not governance.",
        },
        {
          kind: "para",
          text:
            "Codetry serves *practice*. Practice is what people already do — the relational, kinship-anchored, often invisible work of keeping a household, a homeschool, a co-op, a season, a territory. Practice doesn't need permission to exist; it is already there before the software arrives.",
        },
        {
          kind: "para",
          text:
            "Governance is something else. Governance is formal authority — Chief and Council, hereditary leadership, treaty relationships, band council resolutions, election cycles, the legal and political channels through which a community speaks for itself. Governance has its own carriers, its own language, its own time.",
        },
        {
          kind: "para",
          text:
            "Codetry does not produce governance. It does not design it, replace it, route around it, or stand in for it. On a reserve in particular, conflating the two is a political mistake the practitioner must not make. The discipline protects the substrate any genuine local governance has to be built out of: if the community's words survive, the community can govern itself in its own terms; if the words drift, governance ends up being conducted in someone else's language, which is the same thing as someone else governing.",
        },
        {
          kind: "subhead",
          text: "What the practitioner is, and is not.",
        },
        {
          kind: "para",
          text:
            "The practitioner is a steward of practice. Not a designer of governance. Not a consultant arriving with a framework. Not an author writing the community's story back to it.",
        },
        {
          kind: "para",
          text:
            "The work is small and specific. The practitioner listens for the noun the community already uses. They refuse to translate it into something cleaner. They verify, when in doubt, against the human who handed them the word — not against the literature, not against the model, not against their own better idea. The discipline is built so that this is enough.",
        },
        {
          kind: "subhead",
          text: "The thesis, in one sentence.",
        },
        {
          kind: "callout",
          text:
            "Codetry is a verification discipline that keeps the structural language of a system rooted in the community that owns it, so that knowledge cannot creep, drift, or be tokenized away. It does not produce decentralized governance. It protects the substrate any genuine local governance has to be built out of: if the community's words survive, the community can govern itself in its own terms; if the words drift, governance ends up being conducted in someone else's language, which is the same thing as someone else governing.",
        },
      ],
    },
    {
      id: "1-1",
      number: "1.1",
      partRoman: "I",
      partLabel: "I · The Discipline",
      title: "What codetry is",
      blocks: [
        {
          kind: "para",
          text:
            "Codetry is the practice of building software whose primary load-bearing material is metaphor. The naming is not decoration on a database. The naming *is* the architecture, and the code is the medium that makes the metaphor real, clickable, and runnable.",
        },
        {
          kind: "para",
          text:
            "It is a quiet discipline. Most of it is naming. Most of the rest is refusing to translate the names the community handed you into the words the industry would have preferred. The little that is left is the work of building the system honestly enough that the names keep their promises.",
        },
      ],
    },
    {
      id: "1-2",
      number: "1.2",
      partRoman: "I",
      partLabel: "I · The Discipline",
      title: "The saltbox principle",
      blocks: [
        {
          kind: "para",
          text:
            "A codetry app is named the way a saltbox house is built — every beam carries weight. *Saltbox Zone 0* surfaces day-to-day as a homeschool companion, but the name is the design spec: it carries that the household is Zone 0, that this is the saltbox-house itself, and that everything else in the system flows from this center. Change the name and you have changed the structure.",
        },
        {
          kind: "para",
          text:
            "Codetry borrows from the cold-climate vernacular. A saltbox house wasn't designed for prettiness — its asymmetric roof and thick north wall were the only way a house survived a boreal winter. The form *is* the function. Codetry asks the same of software: let the form-language do the structural work. Let the name carry weight a column would otherwise carry.",
        },
        {
          kind: "pull",
          text:
            "Let the name carry weight a column would otherwise carry.",
        },
      ],
    },
    {
      id: "1-3",
      number: "1.3",
      partRoman: "I",
      partLabel: "I · The Discipline",
      title: "The single-sentence definition",
      blocks: [
        {
          kind: "para",
          text:
            "Codetry — naming IS architecture (distinct from code-poetry).",
        },
        {
          kind: "small",
          text: "From the constellation manifest, grammar.practice.",
        },
        {
          kind: "para",
          text:
            "That is the whole discipline in one line. The rest of this handbook unfolds it: the disciplines codetry is *not*, the worked examples that happen to be in front of the practitioner who first named it, the practice itself, and the teachers behind the practice.",
        },
      ],
    },
  ],
};

const partII: Part = {
  roman: "II",
  title: "Adjacent Disciplines",
  blurb:
    "Four older disciplines codetry gets confused with — all honoured, all doing different work.",
  chapters: [
    {
      id: "2-1",
      number: "2.1",
      partRoman: "II",
      partLabel: "II · Adjacent Disciplines",
      title: "Different from code poetry",
      blocks: [
        {
          kind: "para",
          text:
            "There is a real, decades-old tradition called *code poetry* — going back to Perl in the late 1980s, through the Stanford Code Poetry Slam, Mez Breeze, Nick Montfort, and Ishac Bertran's *code {poems}* anthology. That tradition is about the source code itself being a poem: programs that are also valid verse, lines arranged for sound or terseness, the aesthetics of what is on the page in the editor. Beautiful tradition. Adjacent and respected.",
        },
        {
          kind: "para",
          text:
            "But the poem in code poetry lives *inside* the source. In codetry the poem lives *as* the architecture, and the source is what makes it run.",
        },
        {
          kind: "callout",
          text:
            "Code poetry: the source is the poem. Codetry: the naming is the architecture, and the source is what makes the naming hold.",
        },
      ],
    },
    {
      id: "2-2",
      number: "2.2",
      partRoman: "II",
      partLabel: "II · Adjacent Disciplines",
      title: "Different from literate programming",
      blocks: [
        {
          kind: "para",
          text:
            "The other discipline codetry gets confused with — and the one that has more pull on serious readers — is literate programming. Donald Knuth named it in 1984. He built WEB and CWEB, the tangle and weave tools that let prose and source live in one document and be extracted into either a typeset article or a working program. Org-mode Babel, Jupyter, R Markdown, and Quarto are its modern descendants.",
        },
        {
          kind: "para",
          text:
            "Both disciplines insist that words around the code do load-bearing work. What each one names as the load-bearing word, and where each one places the unit of care, is the contrast worth drawing here; §6.1 returns to the relationship between the two disciplines once that contrast is on the page, and finds it less symmetric than this chapter first allows.",
        },
        {
          kind: "subhead",
          text: "Literate programming makes the document the source.",
        },
        {
          kind: "para",
          text:
            "Prose explains; code is generated from the prose. The unit of care is the explanation. The reader is meant to read the program the way they would read an essay, and the typeset output is what the discipline is for.",
        },
        {
          kind: "subhead",
          text: "Codetry makes the metaphor the source.",
        },
        {
          kind: "para",
          text:
            "Naming carries the architecture; the code is the medium that makes the metaphor real, clickable, runnable. The unit of care is the name. The reader is meant to *use* the program and find that the metaphor is doing structural work — that the name a user types is the same name a column in the database carries, the same name the test fixture asserts on.",
        },
        {
          kind: "para",
          text:
            "Knuth's discipline is named here with the same respect already extended to code poetry. It is older, it is deeper in the literature, and both it and codetry are *don't trust; verify* moves: show your work in the medium where the work actually lives. Literate programming verifies by exposing the reasoning. Codetry verifies by making the metaphor inspectable in the name itself. The temptation in this chapter is to leave it there, with the two disciplines doing parallel work in adjacent rooms — and the contrast above does hold at the level of *what each discipline is for*. The relationship between them is taken up again, less politely, in §6.1: the woven document only does what its prose says it does to the extent that the names inside the source carry the metaphor the prose claims they carry, which makes the discipline that holds those names a precondition for the weave rather than a sibling to it.",
        },
      ],
    },
    {
      id: "2-3",
      number: "2.3",
      partRoman: "II",
      partLabel: "II · Adjacent Disciplines",
      title: "Different from DDD and Conway's Law",
      blocks: [
        {
          kind: "para",
          text:
            "The third discipline codetry gets confused with — and the one that has the deepest pull on readers from the mainstream software-engineering tradition — is the lineage that runs from Conway's Law to domain-driven design. Melvin Conway named the law in 1968: any system reflects the communication structure of the organisation that built it. Eric Evans named domain-driven design in his 2003 book; Vaughn Vernon, the ThoughtWorks crowd, and the bounded-context, ubiquitous-language vocabulary that came after are all in this room.",
        },
        {
          kind: "para",
          text:
            "Codetry shares ancestry with both. All three accept the same uncomfortable premise: structure outside the code shapes structure inside the code, and pretending otherwise is how systems quietly go wrong.",
        },
        {
          kind: "subhead",
          text: "Conway's Law observes the mirror.",
        },
        {
          kind: "para",
          text:
            "Conway's move was descriptive. He noticed that the shape of a team prints itself onto the shape of its software, whether anyone meant it to or not. The discipline that grew from that — inverse Conway, team topologies — is the practice of arranging the org chart on purpose so the system you get is the system you wanted.",
        },
        {
          kind: "subhead",
          text: "Domain-driven design works the mirror.",
        },
        {
          kind: "para",
          text:
            "DDD takes the next step and says: name the model after the language the domain experts already use. The *ubiquitous language* is meant to live in the conversation, the whiteboard, and the code at once. Bounded contexts mark where one such language ends and another begins. Done well, this is real respect for the world the software is for.",
        },
        {
          kind: "subhead",
          text: "Codetry takes the stricter stance.",
        },
        {
          kind: "para",
          text:
            "Codetry agrees that the language outside the code should be the language inside the code, and then asks a harder question: *whose language?* DDD typically lands on the domain expert — the analyst, the consultant, the senior engineer who has just spent a week in workshops tidying the vocabulary up. Codetry insists the noun must come from the community itself, in the form the community already uses it, before any tidying.",
        },
        {
          kind: "para",
          text:
            "Which means translation away from that noun — even into a cleaner, more general, more reusable noun — is treated as *drift*, not as cleanup. The moment a *saltbox* becomes a *household container* in the schema, the architecture has slipped, even if every test still passes. The codetry-test exists because that slip is invisible to the type checker and obvious to the person who handed you the word.",
        },
        {
          kind: "callout",
          text:
            "Conway and DDD ask whose org shapes the system. Codetry asks whose word survives the schema — and treats every translation away from it as drift.",
        },
      ],
    },
    {
      id: "2-4",
      number: "2.4",
      partRoman: "II",
      partLabel: "II · Adjacent Disciplines",
      title: "Different from type-driven design",
      blocks: [
        {
          kind: "para",
          text:
            "The fourth discipline codetry gets confused with — and the one that has the strongest pull on readers from the typed-functional tradition — is type-driven design and its rallying cry, *make illegal states unrepresentable*. Yaron Minsky's essays out of Jane Street, Richard Feldman's Elm work, and Scott Wlaschin's *Domain Modeling Made Functional* are all in this room. The conviction is the same across the lineage: the model is the architecture, and the model is whatever the type system lets you say.",
        },
        {
          kind: "para",
          text:
            "Codetry shares that conviction. Both disciplines accept that the model carries the weight, and both refuse the older arrangement where the model is a thin layer of records and the architecture lives in the procedures around them.",
        },
        {
          kind: "subhead",
          text: "Type-driven design puts the load on the type.",
        },
        {
          kind: "para",
          text:
            "The discipline pushes every invariant the domain demands into the type signature. A non-empty list is its own type. A validated email is its own type. An *Order* that has been *Paid* is structurally different from an *Order* that has not, so the function that ships it cannot be called on the unpaid one. The type checker becomes the first reader of the domain, and the bugs that slip past it are the only bugs left.",
        },
        {
          kind: "subhead",
          text: "Codetry puts the load on the name.",
        },
        {
          kind: "para",
          text:
            "Codetry agrees that the model carries the architecture, and then asks the harder question: *whose word is on the type?* A perfectly typed `HouseholdContainer` with a non-empty `Items` list and an immutable `CreatedAt` is, by every type-driven measure, a beautiful model. It is also, by codetry's measure, drifted — because the community said *saltbox*, and the type system has quietly translated the word into something more general on the way to making the invariants legible. The illegal state was made unrepresentable; the load-bearing noun was made unrecognisable.",
        },
        {
          kind: "para",
          text:
            "Type-driven design verifies the model against the compiler. Codetry verifies the model against the person who handed you the word. Both are *don't trust; verify* moves; they verify against different witnesses.",
        },
        {
          kind: "callout",
          text:
            "Type-driven design makes illegal states unrepresentable. Codetry makes drifted nouns unshippable — and treats a perfectly typed model with the wrong word as drift the type checker can't see.",
        },
      ],
    },
  ],
};

// Build Part III dynamically from the bundled constellation.
const allZones = [...constellation.zones, ...constellation.preZone];
const zoneCount = allZones.length;

const zoneChapters: Chapter[] = allZones.map((z, i) => {
  const num = `3.${i + 1}`;
  const zoneLabel =
    z.zone < 0 ? "Pre-zone" : `Zone ${z.zone}${z.slot ? ` · ${z.slot}` : ""}`;
  const blocks: Block[] = [
    { kind: "small", text: zoneLabel },
    { kind: "para", text: z.domain },
  ];
  if (z.tagline) blocks.push({ kind: "pull", text: z.tagline });
  if (z.formerNames && z.formerNames.length > 0) {
    blocks.push({
      kind: "small",
      text: `Formerly: ${z.formerNames.join(", ")}`,
    });
  }
  if (z.url) {
    blocks.push({ kind: "small", text: z.url });
  }
  if (z.workedExamples && z.workedExamples.length > 0) {
    blocks.push({ kind: "subhead", text: "Worked examples" });
    blocks.push({ kind: "examples", items: z.workedExamples });
  } else {
    blocks.push({ kind: "rule" });
    blocks.push({
      kind: "callout",
      text:
        z.context ??
        "Worked examples not yet written. The slot is named; the carpentry is still ahead.",
    });
  }
  return {
    id: `3-${i + 1}`,
    number: num,
    partRoman: "III",
    partLabel: "III · The Constellation as Founding Examples",
    title: z.name,
    blocks,
  };
});

const partIII: Part = {
  roman: "III",
  title: "The Constellation as Founding Examples",
  blurb:
    "The worked examples that happened to be in front of the practitioner when codetry got named.",
  chapters: [
    {
      id: "3-0",
      number: "3.0",
      partRoman: "III",
      partLabel: "III · The Constellation as Founding Examples",
      title: "How to read these",
      blocks: [
        {
          kind: "para",
          text:
            "The constellation is not the canon. It is the *founding set* — the worked examples that happened to be in front of the practitioner when codetry got named. They are recorded here so the reader can see naming-as-architecture working in the field, not as a definition.",
        },
        {
          kind: "para",
          text:
            "The reader's own constellation will look nothing like this one. That is correct. The discipline travels; the examples don't.",
        },
        {
          kind: "small",
          text: `Snapshot: constellation v${constellation.version} · ${constellation.lastUpdated}.`,
        },
      ],
    },
    ...zoneChapters,
    {
      id: `3-${zoneCount + 1}`,
      number: `3.${zoneCount + 1}`,
      partRoman: "III",
      partLabel: "III · The Constellation as Founding Examples",
      title: "Closing reflection",
      blocks: [
        {
          kind: "para",
          text:
            "Together, the constellation is one lifestyle map for charting a course in northwestern Ontario — drawn in the grammar of the land it's drawn for. Other constellations will be drawn in the grammar of other lands.",
        },
        {
          kind: "para",
          text:
            "That is the test of whether codetry has taken root: not whether anyone else uses these names, but whether anyone else's names start carrying their own weight.",
        },
      ],
    },
  ],
};

const partIV: Part = {
  roman: "IV",
  title: "The Practice",
  blurb:
    "Six moves the codetry practitioner makes — in the field, with people, in the working language of the room.",
  chapters: [
    {
      id: "4-1",
      number: "4.1",
      partRoman: "IV",
      partLabel: "IV · The Practice",
      title: "Listen for the noun",
      blocks: [
        {
          kind: "para",
          text:
            "Every project arrives wrapped in a noun the community already uses. A co-op committee says *the books*. A homeschool circle says *the day*. A band council says *the territory*. An extension agent says *the season*. The community has already named the thing.",
        },
        {
          kind: "para",
          text:
            "The temptation is to translate it. *The books* becomes *the ledger* becomes *the financial management module*. *The day* becomes *the curriculum*. *The territory* becomes *the dashboard*. Each translation feels like progress and each translation steps the system one foot away from the people it is being built for.",
        },
        {
          kind: "para",
          text:
            "The codetry practitioner's first move is to write down the noun the community used and refuse to translate it. The system, when it ships, has *the books* in it. The button says *open the books*. The data table is called *the books*. The reports are *what the books say this month*. If the team starts saying anything else in the working session, the practitioner asks why and writes the new word down, because something has shifted.",
        },
        {
          kind: "pull",
          text:
            "The noun is not branding. The noun is the foundation footing.",
        },
      ],
    },
    {
      id: "4-2",
      number: "4.2",
      partRoman: "IV",
      partLabel: "IV · The Practice",
      title: "Test the name by trying to rename it",
      blocks: [
        {
          kind: "para",
          text:
            "Once a name is in place, the test is to try to take it out.",
        },
        {
          kind: "para",
          text:
            "Imagine the same system with a generic noun in the same slot. *Buckets* becomes *Categories*. *The territory* becomes *The Service Area*. *Calm* becomes *Easy*. *Stuck* becomes *Overdue*. Hold the rest of the system constant and read what changes.",
        },
        {
          kind: "callout",
          text:
            "If renaming the thing changes the structure, the name was load-bearing. If renaming changes nothing, the name was decoration.",
        },
        {
          kind: "para",
          text:
            "*Buckets* renamed to *Categories* lets the UI quietly suggest balances can grow by clicking. The rule that you can only pour from one bucket into another, never summon water from nothing, is held by the word *bucket* and disappears the moment the word does. *Stuck* renamed to *Overdue* turns a cross-domain aging-item aggregator into a deadline list and quietly removes the owner-tag and the last-touch timestamp because deadlines don't need them. The test catches both before the name leaves the wall.",
        },
        {
          kind: "para",
          text:
            "A name that survives this test is a name a system can be built on. A name that doesn't is a label.",
        },
        {
          kind: "examples",
          items: [
            {
              name: "User-gesture listeners",
              rule:
                "A list called *unlockListeners* gated something the code never named — the rule that only events counting as a user gesture may unlock audio — and quietly grew to include *pointermove*, *focus*, and *visibilitychange*, none of which require a real gesture; combined with a one-shot flag, the first stray event silently burned the only unlock attempt and the audio refused to autoplay for weeks. Rename to *userGestureListeners* and ask whether those entries still hold: they don't, and the load-bearing rule the original name had hidden surfaces in the same breath. The honest fix is to name the rule out loud and keep the listeners attached until a real gesture is confirmed to have unlocked the system.",
            },
          ],
        },
        { kind: "rule" },
        { kind: "subhead", text: "From the field" },
        {
          kind: "para",
          text:
            "In the practitioner operating plan workbench there is a page called */codetry-test*. It is this chapter, made operational. The practitioner walks every load-bearing name in the constellation's three financial artifacts down the rename test and writes the verdict next to it: *load-bearing*, *decorative*, or *drift*. Each entry records the rename tried, what would change if the rename were taken seriously, and — where the verdict is drift — the follow-up that resolves it. The page is print-friendly, so the audit can sit on the wall, and it carries a *last reviewed* date so the next walk-through has a starting line.",
        },
        {
          kind: "small",
          text:
            "Open /codetry-test alongside this chapter to see the test running on real names.",
        },
      ],
    },
    {
      id: "4-3",
      number: "4.3",
      partRoman: "IV",
      partLabel: "IV · The Practice",
      title: "Detect drift",
      blocks: [
        {
          kind: "para",
          text:
            "The names slip. Always. *Member* becomes *user* on a slide deck because the deck was made in a hurry. *The day* becomes *the curriculum* in an email because the recipient was a school board. *The books* becomes *the financials* in a grant application because the funder uses that word. None of these are bad faith. All of them are drift.",
        },
        {
          kind: "para",
          text:
            "Drift is not cosmetic. The metaphor was doing structural work, and the moment the working language slips, the structure starts shifting underneath it. Two weeks of *user* in the team's mouths and someone proposes a *user dashboard* and the codebase grows a route that does not belong to anyone in particular.",
        },
        {
          kind: "para",
          text:
            "The practitioner's job is to catch the slippage early and name it as slippage. Not as a brand violation. As a structural issue. *We started saying user. Did we mean to? If we meant to, what changes about the thing being built?* If the answer is *nothing changes*, the team was tired and the right move is to put the original word back in everyone's mouth. If the answer is *something does change*, then the team has been telling the practitioner something the practitioner hadn't yet heard, and the discipline is to follow the new word back to the structure it implies and decide on purpose.",
        },
        { kind: "rule" },
        { kind: "subhead", text: "From the field — drift caught at the gate" },
        {
          kind: "para",
          text:
            "The constellation carries a version number. This handbook keeps an offline copy of the constellation so it can sit on a phone in a fishing camp with no signal. When the constellation gained a new entry — a glossary line that named two distinct meanings of the bare word *cost* and asked the practitioner to use the long forms when both meanings were in the same room — its version moved. The handbook's offline copy did not.",
        },
        {
          kind: "para",
          text:
            "A check built into the handbook's build refused to ship until the offline copy caught up. The practitioner reached to publish a routine update and the publish failed. The error printed the version on each side, the path to the file that needed regenerating, and the one-line command that would resolve it. The fix took the time it takes to read the message.",
        },
        {
          kind: "para",
          text:
            "The check did its job. The metaphor and the offline mirror of the metaphor are not allowed to disagree, and the system enforced that. The lesson worth keeping is the timing. The slippage was small, the fix was a single command, and the cost was still paid at the most expensive moment — at the gate, with the practitioner already reaching for the publish button. Drift detection works wherever it is installed. It is cheaper installed earlier.",
        },
        {
          kind: "pull",
          text:
            "Drift caught at the gate is drift caught. Drift caught at the bench is drift caught cheaply.",
        },
        {
          kind: "para",
          text:
            "The instruments that catch drift — the audit pages, the long-form glossaries, the build-time checks, the cross-deck assertions — are taken up again, as a family, in §4.6.",
        },
      ],
    },
    {
      id: "4-4",
      number: "4.4",
      partRoman: "IV",
      partLabel: "IV · The Practice",
      title: "Run a naming session",
      blocks: [
        {
          kind: "para",
          text:
            "Before any system gets built, the practitioner sits down with the people the system is for and surfaces the nouns and verbs that should carry weight.",
        },
        {
          kind: "para",
          text:
            "A naming session is not a brainstorm and it is not a logo workshop. It is a quiet conversation in the working language of the people in the room.",
        },
        { kind: "subhead", text: "The shape of the session" },
        {
          kind: "ordered",
          items: [
            "Ask the group to describe a typical week, in their own words. Take dictation. Don't paraphrase. The practitioner's job in this opening half-hour is to be a careful stenographer.",
            "Read back what was written and circle every noun and verb that the group used more than once. These are candidates. The community has already said which words it leans on.",
            "For each candidate, ask: *what would change if we used a different word here?* If nothing changes, the word is decoration; uncircle it. If something changes, the word is load-bearing; underline it.",
            "Lay the underlined words on the table together. Notice which are nouns (things the system will hold) and which are verbs (things people will do). The system being built will be a structure of those nouns and a workflow of those verbs.",
            "Ask one final question: *is anyone in this room embarrassed by any of these words?* If a word was useful in the meeting but the group does not want to see it on a screen, it has not yet earned its place. Either find a more honest word for the same load, or accept that the group does not want this load named at all and design around the absence.",
          ],
        },
        {
          kind: "para",
          text:
            "The session produces a one-page list of nouns and verbs in the community's own language. That list is the spec. Everything that follows in the build has to load against it.",
        },
        {
          kind: "small",
          text:
            "Suitable for printing from the share sheet — five steps fit on one side of a letter page.",
        },
      ],
    },
    {
      id: "4-5",
      number: "4.5",
      partRoman: "IV",
      partLabel: "IV · The Practice",
      title: "Distinguish the metaphor from the technology",
      blocks: [
        {
          kind: "para",
          text:
            "A codetry app can be paper. A codetry app can be a database. A codetry app can be a pickup-truck route, a phone tree, a clipboard on a wall, an SMS reply form, a SaaS dashboard, an Excel sheet with named ranges. The medium serves the metaphor.",
        },
        {
          kind: "para",
          text:
            "The error is to assume that the technology determines the discipline. It does not. A paper ledger named honestly — *the books*, with columns called *what we owe* and *what we are owed* — is more codetry than a SaaS dashboard with rows called *Account Receivable Aging Report*. The first one carries weight in its names. The second one carries weight nowhere; the names are scaffolding for the database, not the other way around.",
        },
        {
          kind: "para",
          text:
            "When the practitioner is choosing the medium for a codetry build, the question is not *what is the most modern stack.* The question is *what medium will let the names hold.* Sometimes that is software. Sometimes that is not. The discipline is the same either way.",
        },
      ],
    },
    {
      id: "4-6",
      number: "4.6",
      partRoman: "IV",
      partLabel: "IV · The Practice",
      title: "The instruments of verification",
      blocks: [
        {
          kind: "para",
          text:
            "Codetry's standard for verification is not external. It is internal to the artifact: the metaphor must be inspectable in the name itself.",
        },
        {
          kind: "para",
          text:
            "*Don't trust; verify* — the older line — is the family the codetry verification belongs to. Where related disciplines verify by exposing the source, by exposing the test suite, by exposing the audit log, codetry verifies by exposing the metaphor in the place a user already looks: the name on the button, the noun in the title, the verb in the menu.",
        },
        {
          kind: "para",
          text:
            "A user who reads *bucket* and reaches for the system to redistribute funds and finds that the system will only let them pour from one bucket into another has verified the metaphor with their hands. The name made a promise; the system kept it. That is the codetry verification, and it is happening every time the system gets used.",
        },
        {
          kind: "pull",
          text:
            "If the name keeps its promise the next time someone uses it, the verification holds. If the name has to be explained, the verification has failed and the work is to find the name that doesn't.",
        },
      ],
    },
    {
      id: "4-7",
      number: "4.7",
      partRoman: "IV",
      partLabel: "IV · The Practice",
      title: "Teaching codetry to communities",
      blocks: [
        {
          kind: "para",
          text:
            "Sooner or later the practitioner has to explain codetry to a room of people who did not come to learn a software discipline. They came to talk about a store, a clinic, a road, a co-op. The practitioner's job in that room is not to teach codetry as theory. It is to surface the principle the room has been using its whole life and put a name on it, so the work that follows can be done together.",
        },
        {
          kind: "para",
          text:
            "The example to teach with is architecture itself. Not architecture as analogy — architecture as *source*. The principle codetry generalises into the world of words is the same principle that holds when the material is wood, concrete, or hempcrete: some parts carry the load, others do not, and the parts that carry the load cannot be quietly renamed without the structure shifting underneath. The audience already knows this. They have spent their lives in buildings. The teaching move is not to introduce a new idea. It is to make a familiar idea visible in a place they had not yet looked: the words.",
        },
        {
          kind: "subhead",
          text: "The shape of the teaching",
        },
        {
          kind: "ordered",
          items: [
            "Point at the room. *What is holding this roof up? What happens if you take that wall out?* Everyone knows. Nobody needs the vocabulary taught. The room already speaks the language of *load-bearing*, *foundation*, *what holds the thing up*.",
            "Cross the threshold once. *In the things you and I build out of words — a store name, a grant proposal, a co-op's bylaws, a clinic's intake form — there are also load-bearing parts. They look the same as the decorative parts on the page. They are not the same.* This is the only sentence that does the abstract work. After it, return immediately to the concrete.",
            "Do the rename test on a word the room cares about. Not *saltbox*. Theirs. Take the name of their store, their road, their proposal, their committee, and try to rename it on the table in front of them. *Watch what cracks.* Let the room feel the difference between a rename that changes nothing and a rename that takes the structure with it.",
          ],
        },
        {
          kind: "subhead",
          text: "The flinch is the proof.",
        },
        {
          kind: "para",
          text:
            "If the room flinches when the practitioner offers to rename their thing — a small physical recoil, a sharp *no, that's not what we are* — the principle has been transmitted. The flinch is the audience verifying for itself that the word was load-bearing. No further explanation is required. The discipline has not been taught at the audience; it has been recovered from the audience and named in their hearing.",
        },
        {
          kind: "para",
          text:
            "If there is no flinch — if the rename lands and nothing in the room reacts — the word was decoration, and the practitioner has just done a piece of useful diagnostic work in public. Either is a good outcome. Both are codetry.",
        },
        {
          kind: "subhead",
          text: "Why hempcrete teaches better than concrete",
        },
        {
          kind: "para",
          text:
            "Concrete teaches load-bearing, but it teaches only one thing at once. Hempcrete teaches the codetry-specific point: a single material can be *load-bearing and insulating and breathable and community-buildable and locally legal* all at the same time. One name, multiple structural jobs. That is exactly what a load-bearing noun does in software. *Saltbox* carries climate-response and household-defaultness and vernacular-respect in one word. *Headwaters* carries source-of-the-water and small-and-upstream and what-flows-from-here in one word. The community member who has thought about hempcrete versus concrete already understands that picking the material is itself an architectural decision, not a budget decision. *Picking the word* then reads as the same kind of decision, not as marketing.",
        },
        {
          kind: "para",
          text:
            "Where the room already has live opinions on the material — and in northern Ontario, hempcrete is a real conversation, not a hypothetical — the teaching recruits engagement that already exists rather than generating it from scratch.",
        },
        { kind: "rule" },
        { kind: "subhead", text: "The first room" },
        {
          kind: "para",
          text:
            "The teaching is most honest when the example is also a real decision the room is about to make. A naming session for an actual store, an actual clinic, an actual road. The practitioner walks the room through the three moves above on the room's own live problem, and what comes out the other side is not a workshop demonstration. It is the community doing codetry on themselves, with a name that is going to go on a sign, on a building, on a grant cover page. The discipline is transmitted in the same hour the work gets done.",
        },
        {
          kind: "callout",
          text:
            "Don't teach codetry as theory. Show the audience the principle they have already been using in buildings, then let them feel it on a word they care about. The flinch is the proof; the named decision is the receipt.",
        },
      ],
    },
  ],
};

const teacherList: Block[] = constellation.teachers.map((t) => ({
  kind: "para" as const,
  text:
    `*${t.name}*` +
    (t.channel ? ` — ${t.channel}.` : ".") +
    ` ${t.tagline}.`,
}));

const partV: Part = {
  roman: "V",
  title: "Grounding",
  blurb: "The four teachers, the axiom, the lineage, and the colophon.",
  chapters: [
    {
      id: "5-1",
      number: "5.1",
      partRoman: "V",
      partLabel: "V · Grounding",
      title: "The four teachers and the axiom",
      blocks: [
        {
          kind: "para",
          text:
            "Codetry is not a school of thought. It is a practice that grew up listening to four teachers in particular. They are named here, in their own words where possible, because the discipline cannot be honestly read without them.",
        },
        ...teacherList,
        { kind: "rule" },
        { kind: "subhead", text: "The axiom" },
        { kind: "pull", text: constellation.grammar.axiom },
        {
          kind: "small",
          text: "From the constellation manifest, grammar.axiom.",
        },
      ],
    },
    {
      id: "5-2",
      number: "5.2",
      partRoman: "V",
      partLabel: "V · Grounding",
      title: "Lineage",
      blocks: [
        {
          kind: "para",
          text:
            "Codetry sits in a lineage of disciplines that take naming seriously.",
        },
        { kind: "subhead", text: "Code poetry (1980s →)" },
        {
          kind: "para",
          text:
            "From Perl in the late 1980s to the Stanford Code Poetry Slam, Mez Breeze, Nick Montfort, and Ishac Bertran's *code {poems}* anthology — a tradition of source code as poem. Adjacent and respected.",
        },
        { kind: "subhead", text: "Literate programming (Knuth, 1984)" },
        {
          kind: "para",
          text:
            "Donald Knuth's WEB and CWEB; Org-mode Babel, Jupyter, R Markdown, and Quarto carry the practice today. Document is the source; code is woven from prose. The discipline closest to codetry in this lineage — and, on the reading §6.1 lands on, the discipline codetry sits one floor underneath rather than across the room from: literate programming verifies by exposing the reasoning, but the woven program only does what its prose says it does to the extent that the names inside the source carry the metaphor the prose claims, and holding those names is the move codetry is for.",
        },
        { kind: "subhead", text: "The earlier book (2017)" },
        {
          kind: "para",
          text:
            "The practitioner's prior book on codetry was written in 2017 from inside an industry context. It named the impulse but did not yet have a constellation to draw the discipline against. This handbook is the same impulse, nine years later, with the worked examples now in front of it.",
        },
        { kind: "subhead", text: "Don't trust; verify" },
        {
          kind: "para",
          text:
            "The older line that codetry's verification belongs to. Show your work in the medium where the work actually lives. For codetry, the medium is the name on the button.",
        },
      ],
    },
    {
      id: "5-3",
      number: "5.3",
      partRoman: "V",
      partLabel: "V · Grounding",
      title: "Colophon",
      blocks: [
        {
          kind: "para",
          text:
            "This handbook was authored in 2026 alongside the constellation it draws its founding examples from. The constellation lives at the practitioner's working URL; the canonical Codetry working-doc lives at /practitioner-operating-plan/codetry; the machine-readable constellation manifest, frozen as a snapshot in this app, lives at /practitioner-operating-plan/constellation.json.",
        },
        {
          kind: "para",
          text:
            "Voice and editorial decisions follow the constellation's own quiet, declarative register. No marketing.",
        },
        {
          kind: "para",
          text:
            "The discipline named here is offered in the spirit of the four teachers above and the axiom alongside them.",
        },
        { kind: "rule" },
        {
          kind: "para",
          text:
            "For the community development practitioners who pick this up: the names will be your own. Use the discipline; throw away the examples. That is the only correct way to read this book.",
        },
        {
          kind: "small",
          text: `Snapshot v${constellation.version} · ${constellation.lastUpdated}. Offline-readable. State held under codetry-handbook:v1.`,
        },
      ],
    },
  ],
};

const partVI: Part = {
  roman: "VI",
  title: "Open Questions",
  blurb:
    "A handbook needs a place where the questions live before they have answers. The chapters in this part are written to be returned to. Each one names a thing the discipline is being asked that the discipline has not yet finished thinking through.",
  chapters: [
    {
      id: "6-1",
      number: "6.1",
      partRoman: "VI",
      partLabel: "VI · Open Questions",
      title: "Tokenization, and what it does to the noun",
      blocks: [
        {
          kind: "small",
          text: "Open question · returned to as the answer changes.",
        },
        {
          kind: "para",
          text:
            "Codetry's thesis is that the noun carries the architectural weight. The handbook so far has assumed a human reader: a person whose eye lands on the word *saltbox* and loads the metaphor in one beat. That assumption is becoming partial. The reader codetry's code now has to share itself with — increasingly, the dominant reader by volume — is a model that does not see the word at all. It sees a sequence of sub-word fragments. The question this chapter exists to keep open is what tokenization does to a discipline whose load-bearing material is the whole noun.",
        },
        {
          kind: "para",
          text:
            "The lineage to honour is short and recent. Sennrich, Haddow, and Birch's 2016 paper introduced byte-pair encoding to neural machine translation. SentencePiece generalised it. The GPT line and its descendants made it the default reading layer of the industry. Andrej Karpathy's diagnostic posts on tokenisation made the strange visible — the way `\" the\"` and `\"the\"` are different tokens, the way leading whitespace re-shapes meaning, the way numbers fragment in ways no human reader would tolerate. The discipline of tokenisation and the discipline of codetry both treat sub-word patterns as structural, but from opposite directions. Tokenisation extracts statistical structure out of fragments. Codetry composes structural meaning into a whole.",
        },
        {
          kind: "subhead",
          text: "The challenge is real.",
        },
        {
          kind: "para",
          text:
            "Tokenisation is the most aggressive *translate the noun* operation that exists. It is sharper than the boundary translations of §2.3 and stricter than the type-level abstractions of §2.4 because it operates *below the word*. *Saltbox* becomes `[\"Salt\", \"box\"]`. *Headwaters* may become `[\"Head\", \"waters\"]` or `[\"He\", \"ad\", \"waters\"]` depending on what the tokeniser learned. *Watershed* fragments. *Codetry*, being a coined word, fragments hardest of all. The load-bearing weight of a noun-as-noun does not survive the token layer. To the model reading the code, the word is no longer a word.",
        },
        {
          kind: "subhead",
          text: "The challenge is asymmetric.",
        },
        {
          kind: "para",
          text:
            "The fragmenting breaks the noun into pieces. It does not break the relationship between the noun and the structure underneath. Models train on enormous bodies of code in which well-named symbols predict well-shaped implementations. The token cluster `[\"Salt\", \"box\"]` appearing inside a class definition correlates, statistically, with properties consistent with the saltbox metaphor — not because the model knows what a saltbox is, but because it has read enough saltbox-named code to associate the cluster with metaphor-consistent downstream patterns. Codetry survives the token layer through a back door: it makes the noun-to-structure correlation denser and more reliable than generic naming does, and that density is exactly what statistical reading is good at. The discipline does not survive the way it survives a human reader; it survives because the corpus does the recognising on the model's behalf.",
        },
        {
          kind: "subhead",
          text: "Where it actually breaks.",
        },
        {
          kind: "para",
          text:
            "Two places, both worth naming early. The first is the rename test of §4.2. To a human, *Saltbox* → *HouseholdContainer* surfaces drift in one beat — the metaphor dies on contact. To a tokeniser, the rename is one token cluster swapped for another; the model will happily continue with whatever the new cluster's neighbourhood predicts. The discipline's enforcement mechanism does not survive at the token layer. This is the §2.4 problem one floor down: drift the tokeniser cannot see. The second is corpus-dependence. The back-door survival described above holds only as long as the training corpus retains enough metaphor-respectful code to keep the statistical pattern alive. If the corpus drifts toward generic naming — through autoformatters that strip metaphor, AI-generated boilerplate that defaults to the average word, or *clean code* conventions that punish poetry — the back door narrows. Codetry's machine-readability is, at present, an ecosystem position rather than a self-sufficient property.",
        },
        {
          kind: "para",
          text:
            "What the discipline owes itself in return is unfinished. A token-level rename test that flags drift the type checker and the tokeniser both miss. A corpus-level practice — share the named work openly, refuse the autoformatter's translation, keep the metaphor alive in the public training set. A clearer answer to the question of whether codetry is fundamentally a human-reader discipline whose machine-readability is a happy side effect, or a discipline that should be re-grounded for a tokenised reading layer. None of those answers are written yet. This chapter exists so the question has a home in the handbook rather than living only in the practitioner's head.",
        },
        {
          kind: "subhead",
          text: "Foundational to literate programming, not parallel to it.",
        },
        {
          kind: "para",
          text:
            "There is a move waiting in this chapter the rest of the handbook has been polite about. §2.2 frames literate programming as the nearest sibling discipline, and §5.2 places it in the lineage codetry honours its work from — both framings are true, and both are too generous to codetry's modesty about its own role. Codetry is, in the harder sense, *foundational* to successful literate programming: not a sibling, but a precondition. Knuth's discipline weaves prose and source into a single document so the reader can follow the reasoning in the medium where the work actually lives — but the woven program only does what its prose says it does to the extent that the *names* inside the source carry the metaphor the prose claims they carry. Without the codetry move, the prose narrates one architecture and the names enact another, and *literate programming* degrades into prose *about* code that has already drifted away from the prose. The rename test of §4.2 is what makes the weave hold; without it, the document is honest about its reasoning and dishonest about its execution at the same time, and the discipline that was supposed to verify by exposing the reasoning ends up exposing reasoning the code no longer obeys.",
        },
        {
          kind: "subhead",
          text: "Name is the layer between type and token.",
        },
        {
          kind: "para",
          text:
            "It is worth being precise about where the discipline actually stands. *Type* lives in the compiler — the layer §2.4 already names — and is enforced by a machine that does not read English. *Token* lives in the model, the layer this chapter has been circling, and is enforced by a tokeniser that does not read meaning. *Name* sits in the space between them, and is the only layer in the stack where a human author is still the deciding party: the compiler will check what the name is *of*, the tokeniser will fragment what the name is *spelled like*, and only the author chooses what the name *is*. If name is treated as decoration on top of type — as the type system's pet, renameable on a whim because the type is what carries the truth — the in-between layer collapses upward, and the discipline has nothing to do that §2.4 does not already do. If name is treated as raw material for the tokeniser to chew — as fuel for the statistical reader, valuable only in proportion to how often the cluster `[\"Salt\", \"box\"]` appears in the corpus — the in-between layer collapses downward, and the discipline has nothing to do that the model's pre-training does not already do. The codetry claim is that the in-between layer is real, that it is the load-bearing one, and that it is the only place where authorship of the system's nouns is still possible at all.",
        },
        {
          kind: "callout",
          text:
            "Type is the compiler's. Token is the model's. Name is the only layer the human author still owns — and the discipline has nowhere to stand if that layer is not defended.",
        },
        {
          kind: "subhead",
          text: "The token has two meanings, and both rhyme.",
        },
        {
          kind: "para",
          text:
            "The chapter has so far used *token* in the narrow sense the tokeniser gives it: a sub-word fragment, a `[\"Salt\", \"box\"]` cluster, a unit the model reads in the place a word used to be. The word has a second meaning the discipline cannot pretend not to know about. *Token* in the on-chain sense — the unit a community's nouns are turned into when its assets, memberships, votes, or shares of a co-op are placed on a blockchain — is the same word doing structurally analogous work in another domain, and the same hazard rhymes across both. When a community's nouns are tokenised on-chain without a name-layer discipline, the resulting governance primitives are legible only to the people fluent in the substrate: the wallet UIs, the contract addresses, the function signatures, the gas-priced enactments of decisions whose underlying nouns the community never named for itself. That is the precise definition of *technocracy*: rule by those who can read the layer the rest of the community can't. Codetry's bet on the noun is, by extension, a bet against technocratic capture of community-owned systems — the §1.0 hedge against language drift, generalised one floor up to where the drifted words are the ones with formal authority attached. Without *name* as widely-adopted architecture in the blockchain world, the on-chain token does to a community's *governance* what the LLM token does to its prose: shears the load-bearing noun into fragments only the substrate can read, then reassembles it into a primitive the substrate can act on. The discipline has no ready answer to that move yet, either.",
        },
        {
          kind: "callout",
          text:
            "Tokenisation shreds the noun — the model's tokenisation, and the chain's. The discipline's answer, on both fronts, is not yet written. This chapter is a place to keep the question — and to return to it as the tokenisers, the training corpora, the on-chain primitives, and the practice itself change shape.",
        },
      ],
    },
    {
      id: "6-2",
      number: "6.2",
      partRoman: "VI",
      partLabel: "VI · Open Questions",
      title: "Name as architecture, when the noun goes on-chain",
      blocks: [
        {
          kind: "small",
          text: "Open question · returned to as the answer changes.",
        },
        {
          kind: "para",
          text:
            "§6.1 closed by naming a second tokenisation, structurally analogous to the first: the *token* the chain mints when a community's assets, memberships, votes, or shares of a co-op are placed on a blockchain. The argument there ended on a hazard rather than an answer — that without a name-layer discipline, on-chain primitives become legible only to the people fluent in the substrate, which is the precise definition of technocracy. That paragraph deserves a chapter of its own. It is not a tail to the LLM-tokenisation argument; it is a separate open question, in the same shape, that the discipline owes itself a place to keep returning to. This is that place.",
        },
        {
          kind: "subhead",
          text: "What the on-chain hazard actually is.",
        },
        {
          kind: "para",
          text:
            "The on-chain version of the §6.1 problem is not that the chain is hostile to names. It is that the chain's load-bearing identifiers are addresses and signatures — a contract is `0x` followed by forty hex characters; an interface is `transfer(address,uint256)`; a vote is a transaction whose meaning is whatever the function dispatched at that address happens to do. Names exist on top of this layer as conveniences: an ENS record, a token symbol, a label in a wallet UI, a string field inside a contract that the contract itself does not have to honour. The relationship between *name* and *primitive* on-chain is the inverse of the codetry relationship — the primitive is authoritative, the name is a label on top of it, and the label is replaceable without the primitive shifting underneath. The §2.4 collapse — *the type is what carries the truth, the name is just decoration* — is the chain's default state, not its failure mode.",
        },
        {
          kind: "para",
          text:
            "What this does to a community whose governance has been placed on such a substrate is exactly what §6.1 named. The members can read *the token*, *the vote*, *the share* in their own kitchen-language. The chain reads `0xa0b8...`, `castVote(uint256,uint8)`, `balanceOf(address)`. When the two readings disagree — when the wallet UI says *yes* and the contract dispatches *no*, when the documentation calls a primitive *the council seat* and the bytecode treats it as a transferable ERC-721 — the chain's reading is the one that enacts. The community's noun loses, quietly, on every disagreement. The drift is invisible to anyone who is not fluent in the substrate, which is most of the community by design. That is the technocratic failure §6.1 named, made concrete.",
        },
        {
          kind: "subhead",
          text: "What a name-layer discipline would have to do.",
        },
        {
          kind: "para",
          text:
            "It is worth being honest about how little of this is settled. A name-layer discipline for on-chain governance would, at minimum, have to answer three questions the codetry move already answers in source code, and re-answers under harder constraints here. *Who authors the name.* In source code the answer is the practitioner sitting with the community at the kitchen table; on-chain it is unclear whether the name lives in the contract's metadata, in a registry the community controls, in a wallet UI the community does not control, or in a governance document the chain cannot read. *What the name is bound to.* In source code the binding is enforced by the rename test of §4.2 — change the name, and the metaphor breaks loud enough to hear. On-chain, the binding between *the council seat* and the ERC-721 dispatched at `0xa0b8...` is conventional rather than enforced; nothing in the substrate fails when the two drift. *How the name survives a fork.* Source code forks rarely and visibly; chains fork routinely, and a community whose governance noun is *the share* may wake up to find two chains, two contracts, two `share` tokens, and no discipline that says which of the two carries the noun the community originally named.",
        },
        {
          kind: "callout",
          text:
            "On-chain, *type is the chain's, token is the chain's, and name has nowhere obvious to live*. The §6.1 stack — type, name, token — collapses into two layers, both belonging to the substrate. The name layer is the one the discipline would have to build.",
        },
        {
          kind: "subhead",
          text: "Why this is its own chapter and not a footnote.",
        },
        {
          kind: "para",
          text:
            "§6.1 is about what tokenisation does to a noun the practitioner *wrote*. This chapter is about what tokenisation does to a noun the community *enacts authority through*, which is a different stake. The first hazard is that the discipline's reading public shifts from human to model and the noun-as-architecture move has to survive a statistical reader; the second hazard is that the community's reading public shifts from member to substrate and the noun-as-architecture move has to survive a *technocratic* reader — one whose fluency in the layer is itself the asymmetry of power. The first is a question about whether codetry's machine-readability holds. The second is a question about whether codetry's *bet against drift* — the §1.0 hedge — extends to the layer where drifted words have formal authority attached. They rhyme. They are not the same chapter.",
        },
        {
          kind: "para",
          text:
            "There is a temptation, when the answer is unknown, to fold the question back into a chapter that has more developed material around it. §6.1 is the more developed chapter — it has the rename-test analogy, the corpus-dependence argument, the type/name/token stack — and it would be easy to keep the on-chain thread as a closing movement there. Part VI exists to refuse that move. Open questions get their own chapters here precisely so they can be returned to as the answer changes, not so they can be domesticated as tails on the chapters that almost-but-not-quite address them. When a name-layer discipline for on-chain governance does start to take shape — in a registry pattern, in a contract convention, in a community's actual practice of binding the noun to the primitive — the place to record it is here, not appended to §6.1.",
        },
        {
          kind: "callout",
          text:
            "Open question, kept open. The discipline does not yet have a name-layer practice for on-chain governance primitives, and the gap is the technocracy hazard §6.1 named. This chapter exists to be returned to — when the substrate changes, when a registry pattern earns its place, when a community's practice of authoring the noun-as-primitive becomes specific enough to write down.",
        },
      ],
    },
    {
      id: "6-3",
      number: "6.3",
      partRoman: "VI",
      partLabel: "VI · Open Questions",
      title: "Name as a trade, practiced through the wisdom keepers",
      blocks: [
        {
          kind: "small",
          text: "Open question · returned to as the answer changes.",
        },
        {
          kind: "para",
          text:
            "§6.2 closed by saying the discipline does not yet have a name-layer practice for on-chain governance primitives, and that the chapter exists to be returned to when a community's practice of authoring the noun-as-primitive becomes specific enough to write down. The chapter before this one named the *site* and the *wall*. The chapter that follows it has to name the *worker* — what kind of work building a name-layer practice would actually be, and who would do it. If the name layer is the one the discipline would have to build (§6.2), the prior question is what shape the building would take: a credential, a role inside an existing profession, a community elder's extra duty, or a *trade* in the older sense of the word. This chapter is a place to keep the question of the shape of the work itself.",
        },
        {
          kind: "subhead",
          text: "A trade, in the sense bricklaying is a trade.",
        },
        {
          kind: "para",
          text:
            "A trade is what emerges when several industries' outputs only cohere in a *built thing*, and the built thing only holds if one pair of hands knows how all of them behave under load. Bricklaying is the example worth keeping in front of this chapter. The bricklayer is not a brick-maker, not a chemist, not a structural engineer, and not a site planner — but the trade absorbed enough brick chemistry, mortar chemistry, structural reading, site interface, and apprenticeship pedagogy that the wall it builds holds. A name-layer trade would absorb in the same shape, from at least four tributaries. *Codetry*: the rename test of §4.2, the discipline of choosing a metaphor that constrains the system rather than decorates it, the refusal to let the name collapse upward into the type or downward into the token. *Literate programming*, framed by §6.1 as the precondition the practice rests on rather than the sibling working in the next room: document-as-source, prose as the medium of work, names inside the source carrying the metaphor the prose claims they carry. *Wisdom keeping*: the only existing profession that already does multi-generation name maintenance — knowing who named a place, what the name binds to, what happens to the name when the river reroutes, the clan splits, or the treaty is broken. *Community development*: the practice of asking who is in the room when a noun gets coined, who is not, and what the downstream cost of those absences is. None of those four are the trade. The trade is where their outputs cohere in a wall — the wall being the names a community's institutions and on-chain primitives are bound to, authored and maintained with the intent that those names survive the substrate they were laid on.",
        },
        {
          kind: "subhead",
          text: "Through the wisdom keepers, not by them.",
        },
        {
          kind: "para",
          text:
            "There is a temptation, when naming a practice that has to survive seven generations, to assign the practice to the people who already carry that horizon — the wisdom keepers, the elders, the lineage holders themselves. The temptation should be refused, for the same reason a bricklaying trade is not assigned to master masons: the master mason is not the one laying courses anymore. The master walks the job and catches the wandering line at three courses, not thirty. *By* the wisdom keepers makes the trade their job, which dumps a fresh technical apprenticeship — chains, schemas, registries, fork mechanics, source control, literate-programming tooling — on people already carrying full loads, and risks the trade dying with the keepers because the technical surface moves faster than any one generation can absorb. *Through* the wisdom keepers makes them the source of authority and review, while the day-to-day craft is the apprentice's hands: younger, with the chain literacy and the tooling already in their fingers, but accountable to a master who can say *that name does not sit right with what we know about that creek* and send the apprentice back to relay the course. That is the only version of the trade that scales past the keepers themselves, and it is the only version in which the seven-generation horizon survives the generation that opens it.",
        },
        {
          kind: "callout",
          text:
            "The substrate is the site, not the material. Chains are the soil; the names are the wall. The trade is what builds walls that outlast the chain they were laid on.",
        },
        {
          kind: "subhead",
          text: "Calibrated to seven generations, which means refusing the substrate currently in fashion.",
        },
        {
          kind: "para",
          text:
            "A bricklayer's wall is expected to outlast its builder by a century or more. Software's working assumption is that the substrate gets rewritten within a decade, which is why every existing software role is calibrated to the platform currently in fashion — the framework, the chain, the model, the cloud. A name-layer trade calibrated to seven generations would have to refuse that calibration. Not because the substrate is unimportant — §6.2 spent its length making the opposite case — but because the trade's job is to author names that *survive* the substrate, not to specialise in any one of them. The lineage that pedagogy would inherit from is therefore not computer science. The closer analogues are older. *Cartography*: place names that outlast the empires that drew the maps. *Constitutional drafting*: the bind between *the assembly* and the institution it names, across the generations the institution is supposed to last. *Oral lineage itself*: the discipline that already knows how to carry a noun across centuries by holding the practice of who tells it next. §5.2 honours literate programming as the closest sibling in the *technical* lineage codetry sits inside, and that placement is correct for that lineage. The trade lineage — the one a name-layer profession would inherit its pedagogy from — is older than the technical one, and §6.3 is the chapter that owes it the acknowledgement.",
        },
        {
          kind: "callout",
          text:
            "Open question, kept open. The trade has no first apprentice yet. Bricklaying did not become a trade by manifesto; it became one because someone laid a course, then a thousand more, under someone who kept calling out the wandering line. The chapter stays open until the apprenticeship begins, and is the place to record what it looks like when it does.",
        },
      ],
    },
  ],
};

export const PARTS: Part[] = [partI, partII, partIII, partIV, partV, partVI];

export const CHAPTERS: Chapter[] = PARTS.flatMap((p) => p.chapters);

export function getChapter(id: string | undefined): Chapter | undefined {
  if (!id) return undefined;
  return CHAPTERS.find((c) => c.id === id);
}

export function getPart(roman: string | undefined): Part | undefined {
  if (!roman) return undefined;
  return PARTS.find((p) => p.roman === roman);
}

export function chapterOpening(chapter: Chapter, max = 180): string {
  const firstPara = chapter.blocks.find((b) => b.kind === "para");
  if (!firstPara || firstPara.kind !== "para") return "";
  return chapterExcerpt(firstPara.text, max);
}

export function chapterSmallLine(chapter: Chapter): string | undefined {
  const small = chapter.blocks.find((b) => b.kind === "small");
  if (!small || small.kind !== "small") return undefined;
  return small.text;
}

export function getNeighbors(id: string): {
  prev: Chapter | undefined;
  next: Chapter | undefined;
  index: number;
} {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  if (i < 0) return { prev: undefined, next: undefined, index: -1 };
  return {
    prev: i > 0 ? CHAPTERS[i - 1] : undefined,
    next: i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : undefined,
    index: i,
  };
}

export function chapterExcerpt(text: string, max = 90): string {
  const trimmed = text
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max - 1).trimEnd() + "…";
}
