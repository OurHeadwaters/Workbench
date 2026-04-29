import { constellation, type WorkedExample } from "./constellation";
import { findFoundingExampleCommentary } from "./foundingExamples";

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
      title: "The two-sidedness principles — names that hold both faces of one system",
      blocks: [
        {
          kind: "para",
          text:
            "Some systems run in one register and only need a name that fits that register. A *bucket* holds money in an envelope-budget app and never has to do anything else; the noun does one job and does it cleanly.",
        },
        {
          kind: "para",
          text:
            "Other systems live in two registers at once. They have two sides, and the name either holds both or it doesn't. The temptation, every time, is to name each side separately and let them grow into two systems. The two-sidedness principles are the codetry moves that resist that.",
        },
        {
          kind: "callout",
          text:
            "When a system has two sides at once, the name has to do both jobs in one word, or the system will fork into two systems with two cultures.",
        },
        {
          kind: "para",
          text:
            "The constellation has discovered, so far, two distinct kinds of two-sidedness. They are siblings, not subtypes — each was named after a different worked example refused to collapse into the other.",
        },
        { kind: "subhead", text: "Both-states — the temporal kind." },
        {
          kind: "para",
          text:
            "Some systems are two-sided in *tempo*. They have a slow side — a shelf, a posture, a practice that is always-on, mostly quiet, sometimes ignored — and a fast side, an event that flips the system into action and then stands it down. The two sides are the *same room* read at different speeds; the people, the stock, the vocabulary are all one. The name has to ride from one tempo to the other without bending.",
        },
        {
          kind: "para",
          text:
            "*The Standby* (worked out in §3.10) is the worked example. The Standby names both the always-on shelf (preparation, *standby stock*, *the watch* as a posture) and the active event (a *call*, the *active* rung on the ladder, the *debrief* once it stands down). One word, two tempos. Two early candidate names were rejected for failing the test. *The Common Pantry* held the slow side beautifully — a pantry is by definition always-on — but could not hold an active fire call without straining. *The Watch* held the active-monitoring posture but could not hold the slow shelf of stock without bending into a permanent vigil. Both survived as *sub-shelves* inside The Standby; neither could be the umbrella name. If either had been adopted as the umbrella, the constellation would now have two systems — one for *the pantry* and one for *the call* — with two cultures, two cadences, and two vocabularies for the same underlying thing.",
        },
        { kind: "subhead", text: "Both-sides — the contextual kind." },
        {
          kind: "para",
          text:
            "Other systems are two-sided in *context*. They have a side fully legitimate inside one room and a side fully legitimate inside another, and the two rooms don't trust each other's language. Neither side is the slow or fast version of the other; they are simultaneous, equally real, and unfit currency in each other's territory. The name has to be the membrane that lets each room keep its own dialect while still allowing communication across — including a posture for source-side language with no honest target equivalent (a *refused* rung, not a forced translation).",
        },
        {
          kind: "para",
          text:
            "*The Gate* is the worked example. The Gate names the membrane between the *inside* (the constellation's own dialect — *neighbour*, *channel*, *the books*) and *massity* (regulator-banker-funder English — *resident*, *bank account*, *financial statements*). Each is fully legitimate inside its room and unfit currency in the other's. Two early candidate names were rejected for failing the test. *The Translator* collapsed the work into directional substitution and lost the posture that some source-side language has no honest target equivalent. *The Importer* read as one-way and lost the bidirectional symmetry. Both survived as *verbs* inside The Gate; neither could be the umbrella. If either had been adopted, the constellation would now treat the inside as the *raw* material the outside *processes*, instead of two equally legitimate dialects with a membrane between them.",
        },
        { kind: "subhead", text: "How to spot a two-sided name in the wild." },
        {
          kind: "para",
          text:
            "A two-sided name passes a small test, in either flavour. Pick one side first and ask whether the noun also fits the other side, then pick the other side and ask whether the noun also fits the first. If the answer to either question is *not really*, the name is doing one job and the system has already started forking. If the answer to both is *yes — same word, different rung* (both-states) or *yes — same word, different room* (both-sides), the name is holding both faces and the system is one system.",
        },
        {
          kind: "para",
          text:
            "The two principles are registered in the constellation manifest as `principles.both-states` and `principles.both-sides`. Each is cited on the primitive whose two-sidedness it names; both-states is cited on The Standby, both-sides on The Gate. A new primitive that does double duty must declare which kind of two-sidedness it carries — and may, in time, name a third.",
        },
        { kind: "subhead", text: "Why two principles instead of one." },
        {
          kind: "para",
          text:
            "Both kinds answer the same family of question — *one system or two?* — but on different axes. Both-states asks the question on the *time* axis (slow tempo vs fast tempo, same room). Both-sides asks the question on the *legitimacy* axis (one room's dialect vs another room's dialect, same phenomenon). Collapsing them into one principle would have lost both the temporal-vs-contextual distinction and the cross-zone-reads test that separates them when an umbrella name is being chosen. The constellation keeps the family open: a future primitive may carry a third kind of two-sidedness — across densities, scales, jurisdictions, or some axis not yet named — and that primitive's chapter is where the third principle would be registered.",
        },
      ],
    },
    {
      id: "1-4",
      number: "1.4",
      partRoman: "I",
      partLabel: "I · The Discipline",
      title: "The both-sides principle — names that hold each context's dialect",
      blocks: [
        {
          kind: "para",
          text:
            "The both-states principle holds when a system runs in two tempos. A second class of system runs in one tempo but in two contexts at once — two audiences holding two different vocabularies as legitimate, neither willing to give up theirs to the other. The temptation, every time, is to name each side separately and let them grow into two pipes facing two rooms. The both-sides principle is the codetry move that resists that.",
        },
        {
          kind: "callout",
          text:
            "When a system has language that has to live in two contexts that hold different vocabularies as legitimate, the umbrella name has to fit both contexts in one word, or the system will pick a dialect and lose the other room.",
        },
        { kind: "subhead", text: "The Gate as the worked example." },
        {
          kind: "para",
          text:
            "The constellation's second non-zone primitive — *The Gate* (worked out in §3.11) — is the cleanest worked example of this principle so far. The Gate names both the *bright side* (the constellation's own dialect — *neighbour*, *channel*, *the books*, *standby stock*, *the watch*) and *massity* (mass-society dialect — *resident*, *bank account*, *financial statements*, *inventory reserves*, *compliance officer*) inside one umbrella that does not pick a side. One word, two contexts.",
        },
        {
          kind: "para",
          text:
            "Two early candidate names were rejected for failing the principle. *Translator* held the directional work but flattened the membrane into pure transaction — a translator processes; a gate decides whether to. *Glossary* held the dictionary side beautifully — a glossary is by definition a registered correspondence — but could not hold the active posture of substituting in real documents, the ledger of past substitutions, or the *refused* rung for source-side language with no honest target-side equivalent. Both survived as *sub-shelves* inside The Gate (Mappings, Substitutions); neither could be the umbrella name. If either had been adopted as the umbrella, the constellation would now have a one-way pipe and a shelf of words — with no posture deciding whether language *should* cross at all, and no record kept that both names exist for the same thing.",
        },
        { kind: "subhead", text: "How the two two-sided tests differ." },
        {
          kind: "para",
          text:
            "Both tests are pick-one-side-then-the-other, but the axis is different. The both-states test picks a *tempo*: pick the slow side first and ask whether the noun also fits the fast side, then pick the fast side and ask whether the noun also fits the slow side. The both-sides test picks a *context*: pick the bright side and ask whether the umbrella name still respects massity, then pick the massity side and ask whether the umbrella name still respects the bright side. In both tests, if the answer to either question is *not really*, the system has already started forking — into two cultures (both-states) or into two pipes (both-sides). If the answer to both is *yes — same word, different rung* (both-states) or *yes — same word, different room* (both-sides), the name is holding both sides and the system is one system.",
        },
        {
          kind: "para",
          text:
            "The Standby's two sides are *temporal* — the same plumbing in slow and fast tempo. The Gate's two sides are *contextual* — the same plumbing facing two audiences that hold different vocabularies as legitimate. A future primitive may need a third axis (densities? scales? jurisdictions?); the constellation manifest's `principles` array is open-ended on purpose — the discipline travels, the worked examples accumulate.",
        },
        {
          kind: "para",
          text:
            "The principle is registered in the constellation manifest as `principles.both-sides` and is cited every time a new primitive is asked to hold two contexts at once.",
        },
      ],
    },
    {
      id: "1-5",
      number: "1.5",
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
          kind: "para",
          text:
            "The relationship between codetry and DDD is taken up again, less politely, in §5.2: DDD is not only a sibling discipline but one of the *roots* codetry sits on top of, and the *ubiquitous language* clause is the closest single phrase in the prior literature to the move codetry asks of every individual noun.",
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

// Where each registered principle in the constellation manifest has its
// home chapter in Part I. Used to generate the back-citation at the top
// of each Part-III primitive chapter, so a reader who lands on the
// worked example can tap straight back to the principle that explains
// why the umbrella name had to do double duty. New principle ids must
// be added here when they are registered in the manifest; the lookup
// throws otherwise, the same discipline foundingExamples.ts uses to
// refuse silent defaults.
const PRINCIPLE_CHAPTER_NUMBERS: Record<string, string> = {
  "both-states": "1.3",
  "both-sides": "1.4",
};

function principleCitationBlock(primitiveId: string, principleId: string): Block {
  const principle = constellation.principles.find((pr) => pr.id === principleId);
  if (!principle) {
    throw new Error(
      `Primitive "${primitiveId}" cites principle "${principleId}", but no such principle is registered in the constellation manifest's principles array.`,
    );
  }
  const sectionNumber = PRINCIPLE_CHAPTER_NUMBERS[principleId];
  if (!sectionNumber) {
    throw new Error(
      `No Part-I chapter number registered for principle "${principleId}". Add an entry to PRINCIPLE_CHAPTER_NUMBERS in data/handbook.ts.`,
    );
  }
  return {
    kind: "small",
    text: `Worked example for the *${principleId}* principle, introduced in §${sectionNumber}.`,
  };
}

// Founding-primitive chapters in Part III. One chapter per
// constellation-wide primitive registered in the bundled manifest. The
// manifest carries each primitive's vocabulary, severity ladder, sub-
// shelves, and rejected alternatives; the per-primitive *commentary*
// (title suffix, why-this-is-two-sided exploration, cross-zone reads,
// takeaway, open questions) is authored in data/foundingExamples.ts and
// looked up by primitive id. The lookup throws if a primitive ships in
// the snapshot without commentary, the same discipline standby.ts uses
// to refuse silent defaults.
const foundingPrimitiveChapters: Chapter[] =
  constellation.constellationWidePrimitives.map((p, i) => {
    const num = `3.${zoneCount + i + 1}`;
    const commentary = findFoundingExampleCommentary(p.id);
    const blocks: Block[] = [
      { kind: "small", text: "Constellation-wide primitive · non-zone" },
    ];
    if (p.principle) {
      blocks.push(principleCitationBlock(p.id, p.principle));
    }
    blocks.push({ kind: "para", text: p.summary });
    if (p.hostZoneRationale) {
      blocks.push({ kind: "para", text: p.hostZoneRationale });
    }
    blocks.push(...commentary.whyTwoSided);
    if (p.vocabulary && p.vocabulary.length > 0) {
      blocks.push({ kind: "subhead", text: "Vocabulary" });
      blocks.push({
        kind: "list",
        items: p.vocabulary.map((v) => `${v.term} — ${v.role}`),
      });
    }
    if (p.severityLadder && p.severityLadder.length > 0) {
      blocks.push({ kind: "subhead", text: "Severity ladder" });
      blocks.push({
        kind: "ordered",
        items: p.severityLadder.map((r) => `${r.rung} — ${r.meaning}`),
      });
    }
    if (p.subShelves && p.subShelves.length > 0) {
      blocks.push({ kind: "subhead", text: "Sub-shelves inside the umbrella" });
      blocks.push({
        kind: "list",
        items: p.subShelves.map((s) => `${s.name} — ${s.role}`),
      });
    }
    if (p.rejectedAlternatives && p.rejectedAlternatives.length > 0) {
      blocks.push({ kind: "subhead", text: "Rejected alternatives" });
      blocks.push({
        kind: "list",
        items: p.rejectedAlternatives.map((r) => `${r.name} — ${r.reason}`),
      });
    }
    blocks.push({ kind: "subhead", text: "Cross-zone reads" });
    blocks.push({ kind: "list", items: commentary.crossZoneReads });
    blocks.push({ kind: "subhead", text: "The takeaway" });
    blocks.push({ kind: "pull", text: commentary.takeaway.pull });
    blocks.push({ kind: "para", text: commentary.takeaway.closingPara });
    blocks.push({ kind: "subhead", text: "Open questions" });
    blocks.push({ kind: "list", items: commentary.openQuestions });
    return {
      id: `3-${zoneCount + i + 1}`,
      number: num,
      partRoman: "III",
      partLabel: "III · The Constellation as Founding Examples",
      title: `${p.name} — ${commentary.titleSuffix}`,
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
    ...foundingPrimitiveChapters,
    {
      id: `3-${zoneCount + foundingPrimitiveChapters.length + 1}`,
      number: `3.${zoneCount + foundingPrimitiveChapters.length + 1}`,
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
            "Every project arrives wrapped in a noun the community already uses. A co-op committee says *the books*. A homeschool circle says *the day*. A trapline keeper says *the territory*. An extension agent says *the season*. The community has already named the thing.",
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
          kind: "small",
          text:
            "From the ledger — Tests 001, 002, 009, and 010 (the two 010 entries — shortfall CTA and swap-sheet header) all turn on the rename test of this chapter. §7.1 catches *bank* trying to displace the watershed verbs on the Payday CTA. §7.2 locks the Zone 1 word map and rejects three specific generic-noun renames at once. §7.9 graduates *Top up reservoir from XRP* on the demoted swap chip by running this test against the production wording *Convert XRP → RLUSD*. The two §7.10 entries — *Top up reservoir from XRP · cover the shortfall* on the loud amber CTA, and *Top up your reservoir* on the swap-sheet header — extend the same test to a loud surface and to a transactional sheet's title-level register. See §7 for the full ledger.",
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
        {
          kind: "small",
          text:
            "From the ledger — §7.1 (Codetry Test 001) is this chapter at work on a single button: two sightings on the Payday CTA, one of *bank* trying to displace *channel*, the other of a stale *Surplus Pool* parenthetical drifting in a daily drop, both caught by reading the surfaces cold and naming the slip as a slip. The two sightings are the cleanest worked example of *catch the slippage early and name it as slippage* the handbook has on hand.",
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
        {
          kind: "small",
          text:
            "From the ledger — §7.3 (Codetry Test 003) and §7.5 (Codetry Test 005) both run this distinction at the surface level. §7.3 rules out the bamboo-field metaphor on the wallet/XRP-swap chip not because bamboo is a bad metaphor, but because the chip's *medium* — a wallet/swap surface inside the Zone 1 water register — already belongs to a different metaphor, and the rule *one register per screen* protects the medium from carrying two competing metaphors at once. §7.5 graduates the *Park / Public Park / Private Park* renames for the Earn surface (later renamed to *Lake* by Task #849, recorded in this entry) — the rename was specifically about choosing the medium-correct noun for the destination of an Earn flow inside the Zone 1 watershed dialect.",
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
        {
          kind: "small",
          text:
            "From the ledger — §7.2 (Test 002), §7.4 (Test 004), and the §7.6/§7.8 pair (Test 006 and the second-numbered Test 008) read as a working family of verification instruments. §7.2 is the locked Zone 1 word map itself — the table the rename test of §4.2 runs against. §7.4 names the temperature rule (calm states earn their loudness) — the verification that a name's typographic volume matches the work the name is doing. §7.6 and §7.8 install the Drip Harvester sense-distinction across Earn surfaces — verification by pinning down two senses of one noun rather than letting the bare word drift between them.",
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
  blurb: "The four teachers, the axiom, the lineage, the hempcrete chapter, and the colophon.",
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
            "Codetry sits in a lineage of disciplines that take naming seriously. The roots are deeper than the prior chapter implied — most of what codetry does load-bearingly was already practised, in pieces, by people who were not calling it codetry. This chapter names the roots honestly and then names the smaller thing that is genuinely new on top of them.",
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
        { kind: "subhead", text: "Domain-driven design (Evans, 2003)" },
        {
          kind: "para",
          text:
            "Eric Evans' *Domain-Driven Design* and the bounded-context, ubiquitous-language vocabulary it seeded. DDD's *ubiquitous language* is the closest single phrase in the prior literature to what codetry asks of a name: a word that has to live in the conversation, the whiteboard, and the code at once, with no translation step in between. §2.3 already named DDD as a sibling discipline to codetry; this chapter names it as a *root*. The rename test of §4.2 is the same move DDD's bounded-context boundary already half-described — codetry's contribution is to make the test sharp at the level of the individual noun rather than the bounded context, and to apply it outside enterprise software, in community institutions where the *domain experts* are the people who live in the place.",
        },
        { kind: "subhead", text: "Beck and the XP/agile vocabulary (1999 →)" },
        {
          kind: "para",
          text:
            "Kent Beck's *Extreme Programming Explained* and the agile lineage that grew from it built one of the most consequential pieces of codetry-shaped work in the prior literature without naming it as such: the metaphor *system metaphor* itself. XP's original twelve practices included *system metaphor* as a load-bearing element — the team agrees on a shared overarching metaphor for the system, and the metaphor disciplines naming throughout. The practice quietly fell out of fashion in the agile mainstream (it was the first XP practice most teams dropped), but the underlying claim — that a single chosen metaphor can constrain a system's structure across a whole codebase — is the bet codetry generalises into community institutions.",
        },
        { kind: "subhead", text: "Brooks and *No Silver Bullet* (1986)" },
        {
          kind: "para",
          text:
            "Fred Brooks' *No Silver Bullet — Essence and Accident in Software Engineering* drew the line codetry's whole verification standard rests on. Brooks distinguished between *essence* — the irreducible conceptual structure of the software — and *accident* — the parts that exist only because of the substrate. Codetry's claim that *the metaphor must be inspectable in the name itself* (§4.6) is a claim about *essence*: the name is not an accident of the substrate (a label, a string field, a UI affordance), it is part of the system's essential structure, and a discipline that does not protect it is leaving the load-bearing layer undefended. Brooks did not write about names. He drew the line that says names *can* belong to essence rather than accident, which is the line codetry walks across.",
        },
        { kind: "subhead", text: "Nielsen, heuristic #2 — *match between system and the real world* (1994)" },
        {
          kind: "para",
          text:
            "Jakob Nielsen's second usability heuristic: *the system should speak the users' language, with words, phrases, and concepts familiar to the user.* The HCI tradition has carried this rule for thirty years and it is the most under-cited root of codetry. Nielsen's framing is descriptive (a usability principle, evaluated heuristically); codetry's contribution is to make it constructive (a design discipline whose load-bearing test is the rename of §4.2) and to extend it from interface copy into the *system structure* the names enact. Heuristic #2 is what made the move legible to UX practitioners; codetry says the same move has architectural consequences the UX framing did not yet claim.",
        },
        { kind: "subhead", text: "Lakoff and Johnson — *Metaphors We Live By* (1980)" },
        {
          kind: "para",
          text:
            "George Lakoff and Mark Johnson's *Metaphors We Live By* is the philosophical root underneath the entire discipline. Their claim — that conceptual metaphor is not decorative language but the substrate of human cognition, and that the metaphors a community lives by shape what that community can think — is the claim codetry treats as a working assumption. The reason renaming *Buckets* to *Categories* lets the UI quietly suggest balances can grow by clicking (§4.2) is the Lakoff/Johnson claim playing out at software scale: the metaphor was structuring thought, the new word structures different thought, and the system shifts to match. Codetry is what the Lakoff/Johnson observation looks like once it is treated as a constraint on building, not just a description of speaking.",
        },
        { kind: "subhead", text: "GOV.UK content design and the Mailchimp voice tradition" },
        {
          kind: "para",
          text:
            "The two clearest practical traditions in the prior literature for *holding a vocabulary across a system* are GOV.UK's content design discipline (Sarah Richards' *Content Design* and the GOV.UK style guide that followed) and the long line of voice-and-tone style guides that Mailchimp's open-sourced voice guide popularised. Both treat the words on the surface as load-bearing — a benefit form that uses the wrong noun for *household income* fails for users in ways that a redesigned visual layout cannot fix — and both build organisational discipline around protecting that vocabulary. Codetry's contribution is to extend the same protection one floor deeper, into the *names in the source code* that the surface words rest on, so the discipline is not lost the moment the work crosses from the content team to the engineering team.",
        },
        { kind: "subhead", text: "Knuth and the Karlton line — *the two hard things*" },
        {
          kind: "para",
          text:
            "Phil Karlton's line — *there are only two hard things in computer science: cache invalidation and naming things* — has been a folk axiom of the field for thirty years. The line is usually quoted as a joke. It is also a complete inheritance: the field has *known*, in its own folk wisdom, that naming is one of the two genuinely hard problems, and has built almost no discipline around it. Codetry is what it would look like to take the second half of Karlton's line as seriously as the field has taken the first half. (Knuth's literate programming, named above, is the largest existing piece of work in the field that did take it seriously — most of the rest of the lineage in this chapter sits between Karlton's joke and Knuth's discipline.)",
        },
        { kind: "rule" },
        { kind: "subhead", text: "What is genuinely new on top of those roots" },
        {
          kind: "para",
          text:
            "The honest claim is small. Almost everything codetry asks a practitioner to do has been asked, in pieces, by one of the disciplines named above. What codetry adds is four specific moves the prior literature did not put together, named here so the reader can hold the discipline at its actual size:",
        },
        {
          kind: "ordered",
          items: [
            "*A constructive rename test for individual nouns.* Nielsen's heuristic #2 evaluates the match between system and real-world language descriptively. DDD's bounded-context boundary tests vocabulary at the context level. Codetry's §4.2 rename test is the same family of move, sharpened to the individual noun and made constructive: hold the rest of the system constant, swap the word, read what shifts. The test is small enough to fit on a workbench page and falsifiable enough to settle a disagreement at the kitchen table.",
            "*The discipline applied outside enterprise software.* DDD's *domain experts* are usually a product manager and three subject-matter specialists in a corporate setting. Codetry's *domain experts* are the people who live in the place — the fishing camp, the food co-op, the neighbourhood clinic — and the *ubiquitous language* is whatever they already say to each other before a software person enters the room. The discipline is the same; the room it is practised in is older and slower than the one DDD was written for.",
            "*Drift detection as a continuous practice, not a project phase.* Lakoff/Johnson observed that conceptual metaphor shifts under social pressure; codetry's §4.3 and §4.6 install that observation as a routine check — audit pages, build-time version checks, vocabulary sweeps run on a cadence. The closest prior practice is the GOV.UK / Mailchimp style-guide tradition; codetry extends the cadence into source code and version control so the metaphor and the system cannot disagree without something visibly breaking.",
            "*Verification by inspection of the name on the surface.* The XP system-metaphor practice, the literate-programming weave, and the Brooks essence/accident line each get to the edge of this claim without making it. Codetry makes it explicit: the verification standard is that a user reading the name on the button can predict what happens when they press it, because the metaphor the name carries is enacted by the system underneath. Verification lives in the place the user already looks. This is the move §4.6 names and the falsifier the rest of the practice is built around.",
          ],
        },
        {
          kind: "callout",
          text:
            "Codetry's claim is that those four moves, taken together as a single discipline rather than scattered across the prior literature, are worth a name. The roots above are worth more than the new layer. The honest framing is: a small load-bearing rearrangement on top of decades of work the field did not yet know to call by one name.",
        },
        { kind: "subhead", text: "Falsifier for the lineage claim" },
        {
          kind: "para",
          text:
            "The lineage above is falsifiable. If a discipline already in the prior literature can be shown to do all four moves named in *what is genuinely new* — the constructive rename test at the noun level, the application outside enterprise software, drift detection as a continuous practice, and verification by inspection of the surface name — codetry is not a new discipline; it is a renaming of that one. The practitioner who finds the prior discipline that does all four is owed the credit and this chapter owes them the rewrite. Until then, the four moves taken together is the smallest claim this handbook is willing to make on its own behalf.",
        },
      ],
    },
    {
      id: "5-3",
      number: "5.3",
      partRoman: "V",
      partLabel: "V · Grounding",
      title: "What kind of thing codetry is (Hempcrete)",
      blocks: [
        {
          kind: "para",
          text:
            "The metaphor that runs through the whole discipline is architectural. *Load-bearing*, *foundation*, *the wall*, *the room*, *the surface* — every one of those words enters the handbook borrowed from a building. This chapter is the one place the borrowing gets explicit and the practitioner names the *kind* of building they have in mind: not the steel-and-glass office tower, not the suburban stick-frame house, but a hempcrete wall — a composite of a structural frame with an insulating, breathable infill. Codetry is a hempcrete discipline.",
        },
        { kind: "subhead", text: "What hempcrete actually is, briefly." },
        {
          kind: "para",
          text:
            "Hempcrete is a composite building material made from the woody core of the hemp plant (*hurd* or *shiv*) bound with a lime-based binder. It is not a structural material on its own. It is laid as an infill around a load-bearing frame — typically timber — and once cured, it provides insulation, hygrothermal regulation (it breathes water vapour rather than trapping it), fire resistance, and a wall that quietly continues to absorb carbon over its working life. The material is older than concrete by centuries in some regional traditions and newer than concrete by a century in its modern revival; it sits in the interesting place where the deepest possible historical roots and the most current decarbonisation conversation meet.",
        },
        { kind: "subhead", text: "Why the metaphor fits codetry, three ways." },
        {
          kind: "para",
          text:
            "*A composite, not a monolith.* Hempcrete is two things doing two jobs: the timber frame holds the load; the hemp-and-lime infill holds the climate. Neither alone is the wall. Codetry is the same shape: the *names* hold the metaphor; the *system* holds the mechanics; neither alone is the discipline. §6.1's type/name/token stack is a hempcrete diagram — three layers, three jobs, one wall. The frequent error in software discourse is to argue about which single material is *the* right material (the type system as the only truth, the documentation as the only truth, the test suite as the only truth); the codetry move, like the hempcrete move, is to refuse the choice and put the materials in the relationship that makes the wall work.",
        },
        {
          kind: "para",
          text:
            "*Infill, not facade.* Hempcrete sits *inside* the wall — between the structural studs of the frame, breathing in both directions, doing its work in the body of the building. It is not a cladding bolted on the outside for appearance. The codetry name is the same: it is not a label sprayed on the outside of a system that was designed without it. It is the load-distributing infill that lives between the structural type and the surface affordance, and the system only works the way the room expects it to because the infill is doing its job *inside* the wall. Strip the infill and the frame still stands — but the wall stops regulating, the room stops being habitable in the same way, and the mechanics that were quietly held by the composite now have to be shouted by signage and policy.",
        },
        {
          kind: "para",
          text:
            "*Ethical-aesthetic, not just technical.* Hempcrete is chosen, where it is chosen, for a bundle of reasons that no one of which is sufficient: it works thermally, it sequesters carbon, it is locally grown, it is non-toxic, it ages honestly, it is beautiful in a way that pre-cast concrete is not. The choice is technical and ethical and aesthetic at the same time, and the practitioner who tries to defend it on any one of those grounds alone will sound like they are leaving the other reasons out. Codetry has the same compound character. The rename test of §4.2 is technical (it catches drift the type system misses); the protection of community vocabulary is ethical (the people who live in the place are the ones whose words the system runs on); the insistence that the name on the button keep its promise is aesthetic (the wall is honest about what it is). The discipline does not survive being reduced to any one of those grounds. The hempcrete metaphor is the shortest sentence the handbook has for that.",
        },
        { kind: "subhead", text: "Where the strain on the metaphor is honest." },
        {
          kind: "para",
          text:
            "Hempcrete is not perfect. It needs a frame to hold any real load; it cures slowly; the modern revival is small relative to the cement industry it would have to displace; the lime binder is less ecologically clean than the hemp suggests; in some climates the hygrothermal advantages diminish. Codetry has analogous strains: it needs an existing system to hold any real load (the discipline is not a build pattern, it is a discipline applied to a build); the practice cures slowly (a renamed system takes weeks of conversation to settle into the team's mouths, §4.3); the discipline is small relative to the architectural and product-management traditions it would have to displace; the rename test depends on a practitioner who can tell load-bearing from decorative, and that practitioner's judgment is itself a binder whose composition matters. The metaphor is not flattering by accident. The hempcrete wall is the kind of wall the practitioner is trying to build *because* it is honest about what it can and cannot carry.",
        },
        { kind: "subhead", text: "The one-sentence claim." },
        {
          kind: "callout",
          text:
            "Codetry is hempcrete: a composite discipline whose *names* are the breathing infill laid between the structural frame of *type* and the surface skin of *affordance*, doing the climate-regulating, carbon-sequestering, ethical-aesthetic work that no single layer in the system was holding before.",
        },
        { kind: "rule" },
        { kind: "subhead", text: "Coda — the bamboo field." },
        {
          kind: "para",
          text:
            "There is a second material the practice keeps reaching for, alongside hempcrete, that the handbook has been politely vague about until now. It is *bamboo* — specifically, the bamboo field of the xBuckets XRP-spring artwork, where six growth stages of a planted grove serve as the visual register for savings accumulating above the network reserve. The bamboo metaphor is doing the same kind of work as the hempcrete one (a living material chosen for a bundle of technical, ecological, and aesthetic reasons that no one of which is sufficient), but in a different room: where hempcrete is the metaphor for the *discipline*, bamboo is a *register* the discipline carries on a particular surface. The two are not interchangeable. §7.3 records the test that ruled out bamboo as a register on the wallet/XRP-swap chip — bamboo is the right material for the spring artwork and the wrong material for the swap chip, and the test that drew that line is one of the load-bearing entries in the test ledger §7 collects.",
        },
        {
          kind: "small",
          text:
            "Cross-reference: §7.3 (Codetry Test 003 — bamboo-field on the wallet chip) for the test that named *one register per screen* and rejected the bamboo register on a surface the water register had already claimed.",
        },
      ],
    },
    {
      id: "5-4",
      number: "5.4",
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
          kind: "para",
          text:
            "The §1.0 distinction holds here without amendment. Codetry serves practice, not governance, and the chapter is not arguing that the discipline should expand to design what a community does with its votes, its shares, or its council seat. The hazard is to the noun *substrate* such governance is laid over once that substrate goes on-chain, and the open question is the same §1.0 hedge — protect the words the community already uses — asked at a layer where the words enact authority rather than describe practice. Whether that hedge is held by codetry, by a successor trade (§6.3), or by neither is part of what is open here.",
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
            "Open question, kept open. There is no settled name-layer practice for on-chain governance primitives, and the gap is the technocracy hazard §6.1 named. Whether the practice that fills the gap belongs inside codetry or, more honestly, in the successor trade §6.3 takes up — codetry feeding it as one tributary, not extending itself into governance — is itself part of the open question. This chapter exists to be returned to: when the substrate changes, when a registry pattern earns its place, when a community's practice of authoring the noun-as-primitive becomes specific enough to write down.",
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


const partVII: Part = {
  roman: "VII",
  title: "The Codetry Test Ledger",
  blurb:
    "Eleven worked codetry tests, in chronological order. Each one is a small piece of the practice — a question about a name, what was on the screen before, the intervention tried, the rule discovered, the falsifier the rule lives or dies by, and the verdict. The ledger is here so the discipline can be inspected against its own examples rather than only against its rules.",
  chapters: [
    {
      id: "7-1",
      number: "7.1",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 001 — Payday: words bearing weight",
      blocks: [
        { kind: "small", text: "Date 2026-04-26 · Zone 1 / xBuckets Payday tab · status: graduated." },
        { kind: "subhead", text: "The finding." },
        {
          kind: "para",
          text:
            "The first formal codetry test. The xBuckets Payday tab surfaced three CTAs all dressed in the same water language with no priority signal. The rain word was being asked to do three jobs and so did none of them.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Three actions, one metaphor, no hierarchy: *Let's make it rain* (the hero), *Convert XRP → RLUSD* (the wallet/swap chip beside it at peer-of-CTA volume), and a *Full rain / 90% / 75% / 50% / Custom* percentage chip cluster that scaled how much of the plan to pour. A user, asked to read the screen cold, froze: which CTA do I tap, and what does *full rain* mean if *let's make it rain* is also a button?",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "Variant A on the canvas collapsed the rain word back to a single referent and gave every other step in the flow its own word: a *Today's rainfall* card replaces the percentage chips, a flow ribbon makes Rainfall → Siphon → Reservoir visible with dollar values at each node, *Channel the rainfall · $1,200 ready · every drop into a bucket* becomes the only CTA, and the wallet/XRP-swap chip is demoted to plumbing typography below it. Each word, one job. None overlap.",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "One word → one referent. In codetry, every metaphor word in the surface UI must point to exactly one thing in the architecture. The moment a word names two actions, it names neither.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "If holding one-word-one-referent across the constellation reduces ambiguity at decision points, then a user looking at Variant A without prior context should be able to tell from the words alone what the single next action is. Falsified if the user still cannot.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. Variant A shipped in `PaydayTab.tsx` / `PaydayPlanner.tsx`. Two later sightings on the same surface complicated the verdict. *Sighting 1 (the catch in the wild).* A fresh screenshot of the live Payday tab caught a banking word — *Stays in bank (bills)* — quietly displacing the locked Zone 1 verb *Siphon* on the catchment-plan card. A one-line rename in the two parallel surfaces restored *Siphoned out for bills*. The diagnostic move named in this chapter (*when a word feels off, look for one doing two jobs or one belonging to a different register*) found the defect immediately, and the locked map of §7.2 supplied the exact replacement word with no design discussion needed. *Sighting 2 (the rebase that silently un-did the fix).* Two days later, a search of the codebase showed `PaydayPlanner.tsx` had reverted to *Stays in bank (bills)* — Task #806 (the calm rest view) had branched from a pre-rebase tree, and a tangled merge resolved by pulling the planner card forward from the pre-rebase branch silently restored the older banking word. Nothing in the merge process flagged it. The fix here was to restore the locked word and add the smallest possible mechanical witness — a single unit test asserting the catchment card reads *Siphoned out for bills* and not anything containing *Stays in bank*.",
        },
        {
          kind: "callout",
          text:
            "A discipline degrades on every rebase, every long branch, every fast merge. A contract doesn't. The locked map needs at least one machine-checked witness on every surface it owns.",
        },
      ],
    },
    {
      id: "7-2",
      number: "7.2",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 002 — Zone 1: the word map locked",
      blocks: [
        { kind: "small", text: "Date 2026-04-26 · Zone 1 / xBuckets, every surface · status: graduated." },
        { kind: "subhead", text: "The finding." },
        {
          kind: "para",
          text:
            "Test 001 proved the rule on a single screen. Test 002 paid the cost of holding the rule across the whole zone. *Reservoir* had been used three different ways (the wallet, the long-term savings vehicle, the emergency fund); *Channel* had been used four different ways (bucket distribution, the Bridge sheet, the Drainage lesson, the Earn routing); *Compound Rainfall* was the lesson title for tax-advantaged compounding, but the body actually described two referents (a weather pattern and a tax-sheltered vehicle); the hero label field was named `masterBucketLabel` in code, a holdover that no longer matched the surface word. Three words doing eleven jobs.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Across every Zone 1 surface (Payday tab, Earn tab, Buckets tab, lessons, hero card, settings), the same loose vocabulary leaked into different jobs on different surfaces. The Bridge sheet used *channel*; the debt lesson used *channel*; the Earn routing used *channel*; the bucket distribution used *channel*. Same word, four meanings. Same problem for *reservoir*. The locked map did not yet exist, and the absence was where the drift lived.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "Lock the word map for the whole zone — one word, one referent, in EN and FR, in every surface, in every lesson, and in the code field-names. Where one word was doing two jobs, a second word was coined or recovered so each job has a name of its own. The Bridge sheet was rewritten to use *Bridge* (not *Channel*); the debt-channeling lesson became *debt-drainage*; the *compound-rainfall* lesson became *cloud-cover* and introduced *Glacier* explicitly as the tax-sheltered vehicle; the *Reservoir* field was renamed in `TenantConfig` from `masterBucketLabel` to `reservoirLabel`. A separate decision recorded in the test (Task #851) rephrased three remaining surface uses of the bare verb *park* to *set aside* / *keep* so the retired metaphor word never appears on a Zone 1 surface at all.",
        },
        { kind: "subhead", text: "The locked map." },
        {
          kind: "list",
          items: [
            "Rainfall — the income arriving on payday from work or other sources",
            "Siphon — the verb that diverts a portion of rainfall toward bills before any bucket fills",
            "Reservoir — the wallet that holds RLUSD between rainfall and channelling into buckets",
            "Channel (verb) — the move from Reservoir into Buckets on payday, never used for anything else",
            "Bucket — a single named savings goal the household assigns rainfall to",
            "Cloud Cover — tax-sheltered compounding (formerly *Compound Rainfall*); the weather, not the vehicle",
            "Rain Barrel — a household's working emergency-fund bucket, distinct from Reservoir",
            "Aquifer — the long-horizon savings vehicle below working-life buckets",
            "Glacier — the tax-sheltered long-horizon vehicle (TFSA / RRSP / equivalent) sitting under Cloud Cover",
            "Watershed — the whole household-finance system viewed as one catchment area",
            "Bridge (verb) — the cross-currency move on the Bridge sheet, never *Channel*",
            "Public Lake — a public AMM pool",
            "Private Lake — a tenant-curated AMM pool routed to by a Drip Harvester",
            "Lake current — the swap fee a Lake collects (renamed from *Park toll* by Task #849)",
            "Fill (verb) — the move from Reservoir into a Lake (parking RLUSD to earn Lake currents)",
            "Drainage — the verb for paying down debt, never *Channel*",
          ],
        },
        {
          kind: "para",
          text:
            "Naming note. *Reservoir* in this zone is the household stablecoin wallet — the place RLUSD sits between rainfall and channelling into buckets. It is a different object from the *Reserve* line in the Practitioner's Guide V2 ContractsPage (a 75% hold-back of post-tithe agency surplus that funds the next reserve / next pilot). Same metaphor family — both are *what is held back so the system can run again* — but the household wallet is downstream of the household's own income, not of an agency's surplus. A reader moving between the two artifacts should not conflate them.",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "One word → one referent, held across the whole zone. Test 001 named the rule on one screen. Test 002 is what it costs to honour the rule across a constellation.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "If the locked map holds, a new user reading any Zone 1 surface should be able to describe the architecture using the same nouns the lessons teach — without translation. Falsified if a user encounters a word and asks *which one do you mean?* The map is small enough to teach in a single breath, and that is the measure: if the map cannot be taught in a breath, it is not locked.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. The 16 locked nouns above have been honoured across `copy.en.ts` / `copy.fr.ts`, the lesson modules, and the field-names in `TenantConfig`. All 16 also appear as worked-example entries on the Zone 1 page of the constellation map (the companion artifact), each with the rule that holds it in place.",
        },
      ],
    },
    {
      id: "7-3",
      number: "7.3",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 003 — Bamboo field on the wallet chip",
      blocks: [
        { kind: "small", text: "Date 2026-04-26 · Zone 1 / xBuckets Payday tab · status: rejected." },
        { kind: "subhead", text: "The question." },
        {
          kind: "para",
          text:
            "The first formally *rejected* test. The handbook's hempcrete chapter (§5.3) names XRP as *the bamboo field* in its coda. Does the word *bamboo field* earn a place on the wallet/XRP-swap chip — the quiet plumbing chip Test 001 demoted below the *Channel the rainfall* CTA — or does it stay as a meta-doc reference only?",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Three chip wordings were tried on the canvas, sitting beneath the real graduated CTA from Test 001. Variant 0 (control): *412 XRP unconverted ⇄ Swap to ~$420 RLUSD* — mechanical, register-neutral. Variant A (full metaphor): *Bamboo field standing ✂ Cut ~$420 into rainfall* — wallet becomes field, swap becomes cut, no XRP word visible. Variant B (half-metaphor): *Bamboo field · 412 XRP ⇄ Swap to ~$420 RLUSD* — XRP retained as anchor noun, bamboo field added as label.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "The test was: read each chip cold, with the rainfall language sitting right above it, and ask whether the user can tell what the chip does from the chip alone. Variant 0 reads as plumbing, exactly as Test 001 left it. Variant A breaks: *Bamboo field standing* leaves the cold reader with no idea what the chip touches, and *Cut into rainfall* asks the reader to hold biological cutting and atmospheric rainfall in the same gesture — the metaphor cracks at the verb. The screen now has two unreconciled registers (water and plant) competing for the reader's attention. Variant B is the most interesting failure: *Bamboo field · 412 XRP* doesn't crack, it just adds noise. The XRP word still does all the load-bearing work; *Bamboo field* sits as a nickname that gives the reader nothing they didn't already have.",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "One register per screen. The Test 001 rule (one word → one referent) extends to the screen as a whole: a single product surface should carry a single metaphor register, not two competing ones. A metaphor that lives honestly in the lineage doc may still be the wrong word for a surface, if that surface already belongs to a different register.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "*Bamboo field* earns the chip if a cold reader, with no prior context, can tell from the chip alone what the chip does. It fails if the bamboo word lands as a non-sequitur next to rainfall / channel / bucket — i.e. if the metaphor word does a second job and so does neither cleanly.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Rejected for the wallet chip. The bamboo-field metaphor stays as a meta-doc reference (§5.3). The chip on the Payday tab continues to read as the quiet plumbing chip Test 001 demoted it to. The canvas variants are preserved as a counter-test artefact. The verdict would change only if a bamboo-only surface is built (the upstream gets its own screen, no rainfall language nearby) or if the water register is replaced wholesale on the Payday tab — neither of which is on the table from this test.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§5.3 (What kind of thing codetry is — Hempcrete) coda — the bamboo-field metaphor that this test refused on the wallet chip. §7.1 (Test 001) — the test that demoted the wallet chip to plumbing in the first place." },
      ],
    },
    {
      id: "7-4",
      number: "7.4",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 004 — Calm states earn their loudness back",
      blocks: [
        { kind: "small", text: "Date 2026-04-26 · Zone 1 / xBuckets Payday tab · status: graduated on arrival." },
        { kind: "subhead", text: "The finding." },
        {
          kind: "para",
          text:
            "The first temperature-family rule, and the first rule named from a *convergence* rather than from a single test. Two independent design moves on the same screen — Test 001's *Wobble targets* escape hatch and Task #806's *Tinker with the plan* disclosure — arrived at the same shape: a calm primary surface with the loud controls retreating behind a quiet, summonable text-link. Two unrelated authors converging on one shape isn't a coincidence; it's a rule asking to be named.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Both surfaces cut the same silhouette. *Precedent 1 — Wobble targets* (Test 001 graduation): the percentage-chip cluster was retired, and the custom-scale control retreated behind a single quiet text-link sitting under the flow ribbon (`PaydayPlanner.tsx` ~line 1631). When tapped, the wobble panel unfolds in place and the user can dial. *Precedent 2 — Tinker with the plan* (Task #806): the *all funded* rest view takes the screen, and a single quiet disclosure button sits at its foot (`PaydayRestCard.tsx` ~line 237); the wired controls are conditionally rendered exactly when the user asks for them. Same shape: calm primary surface, quiet text-link with a chevron, summon-on-demand panel — different originating task, different copy, identical geometry.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "There is no code change here. The intervention is the act of recognition: seeing that the two surfaces are instances of one rule, and writing the rule down so the next surface that needs the same shape can reach for it deliberately rather than rediscover it accidentally.",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "Surface state mirrors cycle state, and calm states earn their loudness back. A calm state is the default surface for any architectural state that doesn't require user action. The loud controls don't disappear — they retreat behind a quiet, named disclosure that the user can summon on demand. The default is calm; loudness has to earn itself back by being asked for.",
        },
        {
          kind: "para",
          text:
            "This is a different rule family from one-word-one-referent (§7.1) and one-register-per-screen (§7.3). Those rules govern the *vocabulary* of the surface — which words appear, in which dialect. This rule governs the *temperature* of the surface — which controls appear, at what loudness, given the architectural state behind the screen. The two families compose: a locked vocabulary doesn't help if every control is shouting at peer volume; a calm layout doesn't help if the words are doing two jobs each. Both have to hold for the surface to feel right.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "Falsified if a Zone 1 surface in a calm architectural state still presents loud active controls by default (failure mode A: pre-loud), or if a surface hides a loud control so successfully that a power user who knows the control exists cannot find it within one tap from the calm default (failure mode B: hidden, not retreated). The rule sits between those two failure modes — *retreat, not removal*.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated on arrival. Unlike Tests 001–003, this rule was not discovered on the canvas and then graduated to production — it was *shipped twice* in production before being named, by two unrelated tasks, and only then recognised as a single rule. The codetry test here is the naming, not the shipping. No production code or copy ships from this test.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§7.1 (Test 001) — the vocabulary rule the Wobble-targets escape hatch shipped from. §7.3 (Test 003) — the one-register-per-screen rule, complementary to the temperature rule named here." },
      ],
    },
    {
      id: "7-5",
      number: "7.5",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 005 — Drip Harvester reads as DeFi noise",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Earn surface · status: graduated." },
        { kind: "subhead", text: "The finding." },
        {
          kind: "para",
          text:
            "The Earn surface speaks two languages at once. The locked Zone 1 water vocabulary (§7.2) covers four of the words on screen. The other seventeen are imported from DevOps, naval, finance, and crypto-Twitter registers — and the cold reader has to translate every one of them to understand what the screen does.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "A cold read of the Earn tab as it shipped surfaced seventeen distinct vocabulary defects on a single screen, clustered into four foreign registers. *DevOps / robot register* — *agent*, *fleet*, *deploy*, *Drip Harvester Fleet*, *2 harvesters deployed*, *Deploy another agent*. *DeFi / protocol register* — *AMM pools*, *LP Position*, *LP tokens*, *pool shares*, *Est. APR*, *trading fees*, *swap*. *Broom register* — *sweep*, *auto-sweeps*, *sweep threshold*, *Routing drip to cistern*. *Crypto-Twitter register* — *no rug pulls*, *no moonshots*, *24/7*. And one direct violation of the Zone 1 lock: the surface used *cistern* where Test 002 locked the word to *Bucket*.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "Four canvas variants were built. Variant A (vocabulary sweep) replaces every word the locked map does not sanction — *Drip Harvester* becomes the only word for the actor (DevOps register dropped); *Private Park* becomes the destination noun (later renamed to *Private Lake* by Task #849, recorded here); *Park toll* (later *Lake current*) is coined as the new noun for the swap fee a Park collects; pool labels sweep to Park labels; APR is reframed to plain monthly dollars (*$X / month per $100 parked*); the channel verb is restored to its locked use (*drips to savings*, not *channelled to savings*); *drip* becomes the only verb for the Drip Harvester → Bucket move; *bucket* replaces *cistern* wherever cistern crept in; the crypto-Twitter defensiveness is dropped. Variant B (register honesty — gloss the foreign words inline) was predicted-rejected and rejected. Variant C (a flow ribbon at the top of the Earn tab) was scoped out as a heavier production change and recorded as a follow-up test.",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "Vocabulary defects compound where the metaphor is most asked to do work. Silence about the metaphor is permission for DeFi.",
        },
        {
          kind: "para",
          text:
            "Foreign registers fill unmapped territory the same way weeds fill unplanted soil. The Earn surface inherited the agent/fleet/deploy/LP/AMM/sweep register not because anyone designed it that way but because nobody held the locked map there.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "If the Variant A graduation holds, a cold-read of the Earn tab should describe what the screen does using only the locked Zone 1 words plus *Drip Harvester* and *Park toll* (the two new sanctioned nouns). Falsified if a cold reader still reaches for *deploy* or *LP* or *sweep* to describe what they see.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. Variant A shipped to `copy.en.ts` (Earn block) and the affected JSX strings in `EarnTab.tsx`; critical strings mirrored to `copy.fr.ts`. *Park toll* added to the locked Zone 1 map. *Side note on the practice.* This was the first codetry test to graduate twice in one session — once as a draft, then again after code-review caught defect leakage (APR/pool/trading-fee phrasing and the *Channelled to savings* locked-word violation still leaked the first time). A third leak — *Not funded yet* on the Drip Harvester card, where *funded* read as *broken/halted* to a household reader — was caught from the live phone surface, not from review, and replaced with *No RLUSD parked yet*. The pattern: *the locked map is the test*, and *graduated* is only true when a strict surface scan finds no leaks — including the user's pocket, not just the diff.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§7.2 (Test 002) — the locked map this test was held to. §7.6 (Test 006) — the flow-ribbon follow-up scoped out of this test. §7.7 (Test 007) — the structural test that found the LP-position card had survived this vocabulary sweep." },
      ],
    },
    {
      id: "7-6",
      number: "7.6",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 006 — Earn flow ribbon graduates (three stations)",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Earn surface · status: graduated, later superseded by §7.8." },
        { kind: "subhead", text: "The claim." },
        {
          kind: "para",
          text:
            "If a flow ribbon at the top of the Payday tab kept three CTAs from fighting for one word, then a flow ribbon at the top of the Earn tab will keep four foreign DeFi registers from filling the silence around the topology of how a Drip Harvester actually moves money.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "After the §7.5 vocabulary sweep, the Earn surface speaks one language consistently — the locked Zone 1 water map plus *Drip Harvester* and *Park toll*. But the *topology* is still implicit. A cold reader who lands on the Earn tab sees, in order: an XRP Spring card, a Drip Harvester intro card, an LP-position card (when one exists), a list of Private Parks, and a Learn accordion. Nothing on the surface tells them, in one read, where their money currently sits and how it moves between stations.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "An `<EarnFlowRibbon />` component was added to `EarnTab.tsx` and rendered near the top of the surface. It shipped with three nodes connected by chevrons: *Reservoir → Private Park → Buckets*, with the Drip Harvester drawn as a small badge sitting on the Park → Buckets edge — *not* as its own node. The Test 006 reasoning was that the Drip Harvester is *the verb that moves Park earnings into a Bucket* and so does not deserve a station on a topology picture. Active state on the Park node when at least one Drip Harvester is running; pulse on the Drip Harvester badge when a sweep is ready.",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "Topology earns its place at the top of the surface when the stations the money passes through cannot be inferred from the cards below. Anywhere the metaphor is asked to do work across more than one card, the surface earns a flow ribbon at its top.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "If Variant C's graduation holds, a cold reader landing on the Earn tab should be able to point at the ribbon and say, in one sentence, where their money currently sits and where it will move to next — even before reading any of the cards beneath it. A second falsifier: if a cold reader treats the ribbon as decoration (skips it on first read) or asks *why is this picture here?*, the visual weight is wrong and the ribbon needs to be louder, not softer.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated, then superseded by §7.8 (Test 008). Two cold reads after Test 006 shipped found the three-station design hid the Drip Harvester's noun-sense behind its verb-sense and lost the reader's ability to point at the earner wallet on the topology picture. §7.8 restored the four-station ribbon and added a position read-out underneath. Test 006 is preserved here for the practice record — including the moment the rule held and the moment it didn't.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§7.5 (Test 005) — Variant C of which this test graduated. §7.8 (Test 008) — supersedes this three-station design with a four-station ribbon and a position read-out." },
      ],
    },
    {
      id: "7-7",
      number: "7.7",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 007 — The LP-position card survived the vocabulary sweep",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Earn surface, LP-position card · status: graduated." },
        { kind: "subhead", text: "The finding." },
        {
          kind: "para",
          text:
            "The vocabulary sweep from §7.5 cleaned every word on the LP-position card and left the card itself untouched — and the layout it had been hiding behind those words turned out to be three structural defects stacked on top of each other.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "*Defect 1 — no impermanent-loss disclosure on the card.* The card promised a steady drip and never told the household what happens if RLUSD and XRP drift apart in price. The honest *you might end up with less RLUSD than you parked* lived in a Learn accordion three taps away. *Defect 2 — multi-card density.* Six visual blocks fought for the same square inch of attention with no hierarchy and no answer to *what should the eye look at first when this card loads?* *Defect 3 — no toll-drop cadence.* *Drip rate $0.27 / month* read as a constant — a number stamped on the card the way an interest rate is stamped on a bond — but the Park toll moves with trading volume, and a household coming back to a $0.13 drip rate in two weeks had no reference point for telling normal weather from something wrong.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "Variant A (hierarchy + IL + toll history) graduates. A single hero block opens the card (*Drip earned so far · +$2.40 RLUSD* / *next drip at $25.00*, with the progress bar directly under it and a one-line footer *10% of the way · then $22.50 lands in Vacation*); two stats survive in a sub-row below (*Parked* and *Drip rate*), with *Your share* and *Today's drip* cut as DeFi-derived metrics the household never asked for; a `TollBand` helper sits under the sub-row showing the Park toll as a band labelled honestly as a *typical range* (production does not yet snapshot tolls over time, so the band is derived from the current toll ±35%, with a follow-up to record real history); an amber IL heads-up earns the bottom of the card next to the parked money, with a link out to the Learn module §7.5 already rewrote to be honest. Variant B (stability band) and Variant C (single story) recorded as rejected.",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "A vocabulary sweep cleans words; it does not clean layout. Clean words on a noisy card still read as a noisy card. Vocabulary tests do not graduate layout; layout tests do.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "If the graduation holds, a cold reader on the LP-position card should (1) read the hero block and know within one sentence what they parked, what they have earned, and how far they are from the next drip; (2) see the IL warning without scrolling past it or tapping into Learn; and (3) describe the drip rate as *about $0.27 a month right now, but it moves with the toll* rather than as a constant. Falsified if a cold reader still says *I see four numbers, I don't know which one matters* or quotes the rate with no qualifier.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. Variant A shipped to the LP-position branch of `JoinPoolSection` in `EarnTab.tsx` and the new `lp*` copy keys in `copy.en.ts` (mirrored in `copy.fr.ts`). The new `TollBand` helper lives in `EarnTab.tsx` next to `RISK_STYLE`. Real Park-toll history is recorded as a follow-up task; Variant A ships an honest *typical range* band today. *Side note on the practice.* The Earn surface now has two distinct kinds of test — *what does the surface say* (§7.5's vocabulary sweep) and *what does the surface put first* (this test's hierarchy + disclosure). They catch different defects on the same card.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§7.5 (Test 005) — the vocabulary sweep that this test found the layout had survived. §7.8 (Test 008) — the parallel structural test on the Earn flow ribbon." },
      ],
    },
    {
      id: "7-8",
      number: "7.8",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 008 — The Earn flow ribbon becomes four stations",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Earn surface · status: graduated, supersedes §7.6." },
        { kind: "subhead", text: "The claim." },
        {
          kind: "para",
          text:
            "If the ribbon is supposed to answer *where in the system am I?* then every station the money passes through has to be a thing the reader can point at — the Drip Harvester is one of those things, so it graduates from a verb on an arrow (§7.6) to its own circle in the chain, and the ribbon grows a one-line position read-out underneath that names where the household actually is.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Two cold reads after §7.6 shipped showed its three-station ribbon had a hole. *The Drip Harvester is also a wallet* — *an earner wallet that holds RLUSD before it is parked* was already named, repeatedly, in the locked map and the intro card — and drawing the Drip Harvester only as an edge verb left the cold reader unable to point at *the wallet itself* on the topology picture. *The ribbon answered topology but not position.* Test 001's Payday-tab ribbon shows changing dollar values at each station; §7.6's Earn ribbon could not (the Earn-tab values move on a weekly-to-monthly cadence) and shipped labels-only — meaning the ribbon answered *the chain in the abstract* without ever answering *where the household currently is on it*. A reader with no Drip Harvester yet, a reader with one set up but no parked RLUSD, a reader with a parked Lake collecting currents, and a reader with a sweep-ready harvester all saw the same picture.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "Two changes from §7.6, both restoring something the canvas Variant C of §7.5 already had. *Four nodes, not three.* The Drip Harvester gets its own circle on the ribbon, between Reservoir and Private Lake, with the sub-label *earner wallet*. The §7.6 reasoning (Drip Harvester is a verb, not a noun) was true and irrelevant: the Drip Harvester *is* a verb (the move from Lake to Bucket) **and also** a wallet (the place RLUSD sits while the move is happening). The ribbon is a topology, and topology asks *what are the places?*, not *what are the verbs?* The verb sense survives in the prose under the ribbon. *A one-line position read-out under the ribbon* names the most forward station the household has actually reached: four states, each later state implying all earlier ones.",
        },
        { kind: "subhead", text: "The position read-out." },
        {
          kind: "list",
          items: [
            "No Drip Harvester yet — *Your reservoir is the only stop with anything in it — set up a Drip Harvester to push the drip forward.*",
            "Drip Harvester set up, nothing parked — *Your Drip Harvester is set up but nothing's parked yet — fill a Private Lake with idle RLUSD to start collecting Lake currents.*",
            "Parked RLUSD, harvester earning — *You've parked RLUSD in a Private Lake — your Drip Harvester is earning Lake currents.*",
            "Sweep ready — *Your Drip Harvester has earned enough — the next drip is ready to land in a Bucket.*",
          ],
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "Topology is a noun-game. Every station the money passes through must be drawn as a station, even when the same thing is also a verb in the prose. Put the noun on the ribbon; let the verb live in the sentence underneath. Corollary: topology earns position when it names where the reader currently is, not just what the chain looks like — the ribbon stops being a static diagram and becomes a status line.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "If the graduation holds, a cold reader landing on the Earn tab should be able to (1) point at four labelled circles and say *this is where my money goes through*, (2) point at the highlighted circles and say *this is where it currently is*, and (3) read the sentence under the ribbon and say what happens next — without scrolling past the ribbon. Falsified if a cold reader still asks *where is the Drip Harvester?* after looking at the ribbon, or if the *empty* state of the read-out is read as *broken* rather than as *you are at the start of the chain*.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. Variant C (canvas) restored as the live ribbon: four nodes, Drip Harvester between Reservoir and Lake. Position read-out shipped under the ribbon, EN in `copy.en.ts`, FR mirror in `copy.fr.ts`. Active-station emphasis upgraded from a 2px ring to a saturated tone-fill + ring. Drip Harvester pulse on sweep-ready preserved from §7.6, now on the Drip Harvester station itself rather than on the Lake → Buckets edge. §7.6 superseded; its `flowEdgeHarvester` string removed.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§7.6 (Test 006) — the previous (three-station) shipping of this same intervention, kept in the ledger because the moment a rule held wrong is part of the practice record. §7.7 (Test 007) — the parallel structural test on the LP-position card." },
      ],
    },
    {
      id: "7-9",
      number: "7.9",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 009 — Water-register wordings on the wallet chip",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Payday tab · status: graduated." },
        { kind: "subhead", text: "The question." },
        {
          kind: "para",
          text:
            "§7.3 ruled out the bamboo-field metaphor on the wallet/XRP-swap chip on the grounds of *one register per screen* — bamboo (biological) was fighting rainfall (water) on the same surface. The rejection was clean, but it only proved bamboo doesn't belong here. It did not prove that the production wording — *Convert XRP → RLUSD* — is the best the chip can be. This test asks: can the chip speak the same water register the rest of the screen already uses, without inflating itself back to peer-of-CTA volume?",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Three water-register variants were tried alongside Variant 0 (*412 XRP unconverted ⇄ Swap to ~$420 RLUSD*). Variant A: *Top up reservoir from XRP · ~$420* — verbal-only, *Reservoir* doing the wallet work the locked map of §7.2 says it should. Variant B: *Add to reservoir · 412 XRP ⇄ $420* — same locked word, slightly cooler verb, with the explicit ⇄ arrow and concrete numbers retained. Variant C: *412 XRP standing by · refill reservoir* — the calmest verb, source-leads, action-follows.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "Each variant rendered at the actual production typography (10px white/25 underlined text-link, sitting under the *Channel the rainfall* CTA) and read cold. The question was double: does the chip still tell the user mechanically what it does, *and* does it remain demoted relative to the hero CTA above it.",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "Demotion by typography is not the same as demotion by vocabulary. The locked map (§7.2) covers vocabulary; the temperature rule (§7.4) covers loudness. A chip can be typographically quiet and still break the screen's register — and that break can hide for cycles precisely because the typography says *don't look here*.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "A water-register wording earns the chip if both hold: (1) *mechanical clarity preserved* — a cold reader can still tell from the chip alone what the chip does, specifically that XRP gets exchanged for stablecoins added to the wallet (the same falsifier as §7.3); and (2) *demotion preserved* — at the actual production typography (10px white/25 underlined text-link), the new wording does not feel louder than the control, i.e. it does not pull the eye away from the *Channel the rainfall* CTA above it.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. Variant A — *Top up reservoir from XRP* — ships as the new wording, same typography, same demoted text-link, same surface position. The chip remains plumbing; it now also speaks the locked Zone 1 dialect. Variant B is rejected for unnecessary visual weight (the arrow + numbers buy nothing the locked dialect doesn't already give). Variant C is rejected for losing mechanical precision (poetic but uninformative — a cold reader can't tell the chip swaps).",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§7.3 (Test 003) — rejected the bamboo-field metaphor on the same chip on the grounds of *one register per screen*. §7.10 / §7.11 (Test 010) — the loud-twin and the deeper-room moves of the same closing-out arc on this surface stack." },
      ],
    },
    {
      id: "7-10",
      number: "7.10",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 010 — Water-register wordings on the shortfall CTA",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets wallet-confirm sheet · status: graduated." },
        { kind: "subhead", text: "The question." },
        {
          kind: "para",
          text:
            "§7.9 graduated the *demoted* XRP-swap chip from *Convert XRP → RLUSD* to *Top up reservoir from XRP*, finally bringing it into the locked Zone 1 water dialect. That chip has a *loud* twin — the prominent amber CTA in the wallet-confirm sheet that appears when the wallet is short of plan total. It still said *Convert XRP → RLUSD to cover shortfall*. Same action, same destination, same protocol-noun register-break. This test asks: can the loud chip speak the same dialect as its quiet sibling without losing the urgency the amber card is built to express?",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Three variants alongside Variant 0 (*Convert XRP → RLUSD to cover shortfall*). Variant A — *Top up reservoir from XRP* (a direct port of §7.9's graduate). Variant B — *Top up reservoir from XRP · cover the shortfall* (§7.9's graduate as the action, then a separator, then the urgency tail naming what the amber card is shouting about). Variant C — *Refill reservoir from XRP · cover the shortfall* (same shape as B but with *refill* instead of *top up*).",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "Each variant rendered in the actual amber-CTA treatment of the wallet-confirm sheet, with the surrounding amber alert text intact, and read cold. The question was: does the new dialect rhyme with the quiet sibling on the Payday tab *and* still read as the answer to the alert above it, not as an aside that happens to live in the same card?",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "When a chip has a *quiet* sibling and a *loud* sibling that do the same thing, the loud one should rhyme with the quiet one in dialect, then add whatever the loud surface needs. Test 003's *one register per screen* held even on a typographically demoted surface (§7.9); this test extends it to a *loud* surface — the amber CTA was hiding behind its urgency the way the demoted chip was hiding behind its typography.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "A water-register wording earns the loud amber CTA if both hold: (1) *mechanical clarity preserved* (same falsifier as §7.3 and §7.9); and (2) *urgency preserved* — the cold reader still understands this is a *fix-the-shortfall* action, not a casual top-up. The chip should read as the answer to the amber alert above it, not as an aside that happens to live in the same card.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. Variant B — *Top up reservoir from XRP · cover the shortfall* — ships, same amber CTA treatment, same surface position, same icon. Variant A is rejected for dropping *shortfall* and leaving the urgency in the amber card alone with no echo on the chip. Variant C is rejected for *refill* implying a state of fullness the reservoir never had this cycle (the same word §7.9 had already flagged as wrong-temperature on the demoted twin). Variant B's structure — *(§7.9's exact graduate) · (purpose-of-this-surface)* — gives the two chips a shared spine, mirroring the existing graduated hero CTA from §7.1 (*Channel the rainfall · $1,200 ready · every drop into a bucket*).",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§7.9 (Test 009) — the quiet sibling on the Payday tab whose dialect this loud twin now rhymes with. §7.11 (the second-filed Test 010) — the deeper-room move on the swap-sheet header that closes out the arc this test opened." },
      ],
    },
    {
      id: "7-11",
      number: "7.11",
      partRoman: "VII",
      partLabel: "VII · The Codetry Test Ledger",
      title: "Test 010 (second entry) — Water-register wording on the swap-sheet header",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets ConvertXrpSheet · status: graduated." },
        {
          kind: "callout",
          text:
            "Numbering note. This is the second entry filed as *Test 010* in the ledger, and it has been left at its original number rather than renumbered to 011 — both because the duplicate is itself part of the practice record (two tests on the same wallet/XRP-swap stack landed on the same date and were filed as 010 in error, and the ledger preserves that), and because the first 010 (§7.10) and this entry (§7.11) are the loud-twin and the deeper-room moves of one closing-out arc on the same surface stack and read better as a pair than as 010 / 011 across a renumbering boundary. Future ledger entries are expected to start at 011, leaving §7.10 / §7.11 as the one anomaly the numbering preserves.",
        },
        { kind: "subhead", text: "The question." },
        {
          kind: "para",
          text:
            "§7.9 graduated the wallet/XRP-swap chip into the locked Zone 1 dialect (*Top up reservoir from XRP*), and explicitly *deferred* the same question one surface deeper — the sheet that opens when the user taps the chip. This test asks whether `convertXrp.title` should follow the chip into the locked dialect, or earn its protocol nouns because the user has crossed into a transactional room. The defence in §7.9 was specific (*the swap interface is allowed its own register because by then the user has crossed into a different room*), defensible, and possibly right — but it was an agent decision made in passing, with no falsifier and no cold read. It deserves its own test.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Four variants. Variant 0 (control): eyebrow *Tap the Headwaters* (already in dialect, locked by §7.2), title *Convert XRP → RLUSD* (protocol). Variant A: title *Top up your reservoir* — pure dialect, mirrors §7.9's graduated verb. Variant B: title *Refill the reservoir from your headwaters* — both locked nouns, most poetic. Variant C: title *Top up your reservoir* with a small grey subheading *XRP → RLUSD* underneath — hybrid.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "Each variant rendered as the live `ConvertXrpSheet` would render it, with the body line-items (XRP balance, RLUSD to receive, slippage in XRP, *Convert in Xaman* on the CTA) intact. The question: at the title level, does dialect or protocol read as honest *given the rest of the sheet already names the assets*?",
        },
        { kind: "subhead", text: "The rule discovered." },
        {
          kind: "pull",
          text:
            "Register zoning works vertically as well as horizontally. Test 002 zones registers across screens (§7.2); this test shows the same kind of zoning *inside* a single component: the title-level register can speak dialect while the line-item register speaks protocol, as long as each register lives at the level it is best at. Dialect names the *kind of action*; protocol names the *assets the action moves*; the CTA verb names *what the wallet will sign*. Three registers, three jobs, one sheet, no register-break.",
        },
        {
          kind: "para",
          text:
            "This is not a new general rule — it is §7.2's locked map applied with one extra grain of resolution: not just *which words* per screen, but *which words at which level inside a screen*. Worth naming because it unblocks a class of cases (transactional sheets with poetic frames) where the *moment of honesty needs protocol* fear was load-bearing for the conservative call in §7.9.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "A water-register sheet title earns the surface if both hold: (1) *transactional clarity preserved* — a cold reader, having tapped the chip on the Payday tab, can still tell from the sheet header alone that this is the XRP-to-RLUSD swap they just opened, without having to scroll to the line-items to confirm; and (2) *honest at sign-time* — the title sits inside the locked dialect without making the moment of signing feel evasive about which assets are moving. Protocol nouns are still present on the surface — in the line-items below the title and on the CTA — so dialect at the title level is *demotion of mechanics*, not *withholding* of them.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. Variant A — *Top up your reservoir* — ships as the new title, same eyebrow, same body line-items, same CTA. The chip-tap → sheet-open transition is now a *handoff* in one language, not a gear-change between two. Variant B is rejected for stuttering with its own eyebrow (*Headwaters* appears twice inside ten words). Variant C is rejected for replicating, badly, the title/body register separation the sheet already does well.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§7.9 (Test 009) — the chip whose graduation this test extends one surface deeper. §7.10 (the first-filed Test 010) — the loud-twin chip on the wallet-confirm sheet that opened the arc this test closes." },
      ],
    },
  ],
};

export const PARTS: Part[] = [partI, partII, partIII, partIV, partV, partVI, partVII];

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
