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
  kind?: "spine" | "backMatter" | "frontMatter";
};

// Prologue — sits before Part I. Holds the Pioneer-training invocation
// at the start so the reader meets it as a motivator before the first
// technical chapter. The same material is also kept in §5.7 (Open
// Questions) where the rest of the discipline cross-references it as
// the "calm before the storm" framing — additive only, nothing moved.
const partPrologue: Part = {
  roman: "P",
  title: "Prologue",
  blurb: "Pioneer training — the calm before the storm, and who this work is for.",
  kind: "frontMatter",
  chapters: [
    {
      id: "0-1",
      number: "P.1",
      partRoman: "P",
      partLabel: "P · Prologue",
      title: "Pioneer training",
      blocks: [
        {
          kind: "small",
          text: "Prologue · who this work is for · the calm before the storm.",
        },
        {
          kind: "para",
          text: "This is the calm before the storm.",
        },
        {
          kind: "subhead",
          text: "Sons and daughters of thunder.",
        },
        {
          kind: "para",
          text:
            "We are the sons and daughters of thunder — those who have stood for years at the headwaters, holding back the flood not to stop it, but to learn its rhythm, its force, its promise. We did not dam the future; we studied it. We prepared.",
        },
        {
          kind: "subhead",
          text: "The icon is a ship.",
        },
        {
          kind: "para",
          text:
            "The Headwaters icon is a ship. Not a fortress. Not a temple. A vessel — trim, seaworthy, ready to leave the known shore. AI is the new territory: vast, unmapped, alive with both peril and possibility. Literate programming is only the first small sail on that horizon, a tiny blip of clarity in an ocean of code. It still lacks shape. It still needs hands — many hands — practicing, refining, grounding it in reality.",
        },
        {
          kind: "subhead",
          text: "Who the work belongs to.",
        },
        {
          kind: "para",
          text:
            "This work belongs to well-grounded individuals who prize self-sovereignty and refuse aggression. It calls to big hearts, restless minds, and artists who understand that the most powerful tools are also the most beautiful when shaped by care.",
        },
        {
          kind: "callout",
          text:
            "We are not late to this frontier. We are the ones who kept the headwaters while the world slept. Now we launch.",
        },
        {
          kind: "subhead",
          text: "What follows.",
        },
        {
          kind: "para",
          text:
            "Five parts follow. Part I names what the discipline is and what it is hedging against. Parts III, IV, V build the practice — the constellation of seven zones and two primitives, the moves the practitioner makes, and the grounding the moves rest on. Part VI keeps the open questions open, in writing, so the discipline cannot quietly resolve them by attrition. Part II — Adjacent Disciplines — sits behind the spine as a reference: what codetry is not, named precisely, so the work it is doing stays its own.",
        },
        {
          kind: "para",
          text:
            "The chapter you are reading now returns later, in §5.7, in a different register — there as the open question of who this work is for, named structurally rather than spoken aloud. The two readings are meant to bracket the discipline: the invocation at the front, the kept-open question at the back, and the practice in between.",
        },
      ],
    },
    {
      id: "0-2",
      number: "P.2",
      partRoman: "P",
      partLabel: "P · Prologue",
      title: "What this is",
      blocks: [
        {
          kind: "small",
          text: "Prologue · for the practitioner who found this · the front door.",
        },
        {
          kind: "para",
          text: "The words you use to describe your economy determine what your economy can become. This is not a rhetorical claim. It is a practical one.",
        },
        {
          kind: "subhead",
          text: "Language is not neutral.",
        },
        {
          kind: "para",
          text: "When a northern food co-op uses the word *resident* instead of *neighbour*, something real changes — the relationship implied, the obligation carried, the culture formed. When a practitioner names their emergency food reserve *The Call* and their ongoing stock discipline *The Pantry*, they end up with two separate systems, two separate cultures, and a handoff they have to invent under fire. When a funder asks a community to describe its *bank account* and the community's word for that thing is *channel*, the translation is not neutral — something is lost, or flattened, or colonized in the language itself.",
        },
        {
          kind: "subhead",
          text: "This handbook is a vocabulary.",
        },
        {
          kind: "para",
          text: "Not a framework, not a methodology, not a strategic plan. A vocabulary — the specific, precise, weight-tested words that a community needs to run its own economy without importing someone else's assumptions along with the terminology.",
        },
        {
          kind: "para",
          text: "It was built in Headwaters, a small constellation of economic systems serving northwestern Ontario — food, money, knowledge, emergency preparedness, land. The words here emerged from practice: from the specific moment when the wrong word caused a real problem, and the right word had to be found. They have been tested in the field, rejected when they didn't hold, and revised when the context changed.",
        },
        {
          kind: "subhead",
          text: "What a primitive is.",
        },
        {
          kind: "para",
          text: "The vocabulary is organized around *primitives* — named systems that do a specific job inside the constellation. Each primitive has a name chosen to hold across every context in which it appears. The Standby, for instance, is not a pantry and not an emergency callout. It is the single system that holds both — in its resting state, an always-on preparation discipline; in its activated state, a fast collective response. One word. Both states. The name does not bend.",
        },
        {
          kind: "para",
          text: "The Gate is not a translator and not a filter. It is the membrane between the community's own language — *neighbour, channel, standby stock, the watch* — and the language that regulators, funders, and bankers will accept. The Gate holds both sides simultaneously, all the time, and it knows when a word has no honest equivalent in the other language and refuses to substitute.",
        },
        {
          kind: "callout",
          text: "The *refused* outcome is not a failure. It is a discipline. Some words do not cross. Protecting the word is more important than completing the translation.",
        },
        {
          kind: "subhead",
          text: "Who this is for.",
        },
        {
          kind: "para",
          text: "This is not neutral technical vocabulary. It is a set of claims about how a community economy works, encoded in the words used to run it. If your vocabulary is borrowed from grant applications, from SaaS platforms, from government forms — your economy will slowly take the shape of those forms. If your vocabulary is built from your own practice, named by your own practitioners, tested in your own conditions — your economy has a chance to stay yours.",
        },
        {
          kind: "pull",
          text: "This handbook is for practitioners: people who are already running something, who are frustrated by language that almost fits, and who are ready to name what they are actually doing with precision.",
        },
        {
          kind: "para",
          text: "It is not for everyone. It is for the people who feel the friction of the wrong word at the exact moment when the right word would have mattered.",
        },
      ],
    },
  ],
};

const partI: Part = {
  roman: "I",
  title: "The Discipline",
  blurb: "The discipline itself — what it is, where it lives, and why the words you choose carry structural weight. The Grounding section laid the roots; this part names the moves.",
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
      title: "The both-states principle — names that hold one system across two states",
      blocks: [
        {
          kind: "para",
          text:
            "Some systems run in one register and only need a name that fits that register. A *bucket* holds money in an envelope-budget app and never has to do anything else; the noun does one job and does it cleanly.",
        },
        {
          kind: "para",
          text:
            "Other systems are one piece of infrastructure that moves between two operational states — resting and activated, quiet and live, the gas line closed and the gas line open. The infrastructure does not change; the state does. The temptation, every time, is to name each state separately and let them grow into two systems. The both-states principle is the codetry move that resists that.",
        },
        {
          kind: "callout",
          text:
            "When a system is one piece of infrastructure that moves between a resting state and an activated state, the umbrella name has to name the infrastructure — not the state it is currently in. A name that names the state will force a fork the moment the other state arrives.",
        },
        { kind: "subhead", text: "The Standby as the worked example." },
        {
          kind: "para",
          text:
            "*The Standby* (worked out in §2.10) is the cleanest worked example so far. The Standby names both the always-on shelf (preparation, *standby stock*, *the watch* as a posture) and the active event (a *call*, the *active* rung on the ladder, the *debrief* once it stands down). One word, two states — resting and activated. The people, the stock, the vocabulary are all one — only the cadence changes.",
        },
        {
          kind: "para",
          text:
            "Two early candidate names were rejected for failing the test. *The Common Pantry* held the resting state beautifully — a pantry is by definition always-on — but could not hold an active fire call without straining. *The Watch* held the activated posture but could not hold the resting shelf of stock without bending into a permanent vigil. Both survived as *sub-shelves* inside The Standby; neither could be the umbrella name. If either had been adopted as the umbrella, the constellation would now have two systems — one for *the pantry* and one for *the call* — with two cultures, two cadences, and two vocabularies for the same underlying thing.",
        },
        { kind: "subhead", text: "How to spot a both-states name." },
        {
          kind: "para",
          text:
            "Pick the resting state first and ask whether the noun also holds in the activated state, then pick the activated state and ask whether the noun also holds in the resting state. If the answer to either question is *not really*, the name is doing one job and the system has already started forking. If the answer to both is *yes — same word, different rung*, the name is holding both states and the system is one system.",
        },
        {
          kind: "para",
          text:
            "The principle is registered in the constellation manifest as `principles.both-states` and is cited every time a new primitive is asked to hold two operational states at once. The companion principle — for systems that face two contexts simultaneously rather than moving between two states — is taken up next.",
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
            "The both-states principle holds when a system moves between two operational states over time. A different class of problem does not move at all — it faces two rooms simultaneously, always, from the moment it is named. Two audiences hold two different vocabularies as legitimate, neither willing to give up theirs to the other, and both look at the same membrane at the same time. The temptation is to name each side separately and let them grow into two pipes facing two rooms. The both-sides principle is the codetry move that resists that.",
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
            "The constellation's second non-zone primitive — *The Gate* (worked out in §2.11) — is the cleanest worked example of this principle so far. The Gate names both the *bright side* (the constellation's own dialect — *neighbour*, *channel*, *the books*, *standby stock*, *the watch*) and *massity* (mass-society dialect — *resident*, *bank account*, *financial statements*, *inventory reserves*, *compliance officer*) inside one umbrella that does not pick a side. One word, two contexts.",
        },
        {
          kind: "para",
          text:
            "Two early candidate names were rejected for failing the principle. *Translator* held the directional work but flattened the membrane into pure transaction — a translator processes; a gate decides whether to. *Glossary* held the dictionary side beautifully — a glossary is by definition a registered correspondence — but could not hold the active posture of substituting in real documents, the ledger of past substitutions, or the *refused* rung for source-side language with no honest target-side equivalent. Both survived as *sub-shelves* inside The Gate (Mappings, Substitutions); neither could be the umbrella name. If either had been adopted as the umbrella, the constellation would now have a one-way pipe and a shelf of words — with no posture deciding whether language *should* cross at all, and no record kept that both names exist for the same thing.",
        },
        { kind: "subhead", text: "Every bar passes its own test." },
        {
          kind: "para",
          text:
            "The both-sides test does not stop at the umbrella name. Every function — every bar — added to the Gate after the frame has been named must pass the same test independently. The Gate is a gate because each bar faces both rooms. A bar that only faces one room is not a bar; it is a wall panel, and a Gate built of wall panels is a wall. The principle runs on the frame and then repeats, bar by bar, as the primitive grows.",
        },
        {
          kind: "para",
          text:
            "*Refused* — the sub-shelf for source-side language that has no honest equivalent on the other side — is the sharpest bar-level worked example. From the bright side: Refused records that a word in the constellation's dialect cannot be translated without distorting it, and so will not be. From the massity side: Refused records that a word in mass-society dialect has been examined and found to have no honest landing point in the constellation's vocabulary. The finding is the same finding read from two directions. Both rooms are served by knowing the Gate will not invent false equivalents. Refused passes the both-sides test and earns its place as a bar.",
        },
        { kind: "subhead", text: "How the tempo test and the context test differ." },
        {
          kind: "para",
          text:
            "Both tests are pick-one-then-the-other, but the axis is different. The both-states test picks a *state*: pick the resting state first and ask whether the noun also holds in the activated state, then pick the activated state and ask whether the noun also holds in the resting state. The both-sides test picks a *context*: pick the bright side and ask whether the umbrella name still respects massity, then pick the massity side and ask whether the umbrella name still respects the bright side. In both tests, if the answer to either question is *not really*, the system has already started forking — into two cultures (both-states) or into two pipes (both-sides). If the answer to both is *yes — same word, different rung* (both-states) or *yes — same word, different room* (both-sides), the name is holding and the system is one system.",
        },
        {
          kind: "para",
          text:
            "The Standby's two *states* are temporal — the system moves between them, and the name has to hold in either. The Gate's two *sides* are contextual — both face the system at once, and the name has to hold from either direction. A future primitive may need a third axis (densities? scales? jurisdictions?); the constellation manifest's `principles` array is open-ended on purpose — the discipline travels, the worked examples accumulate.",
        },
        {
          kind: "para",
          text:
            "The principle is registered in the constellation manifest as `principles.both-sides` and is cited every time a new primitive is asked to hold two contexts at once.",
        },
      ],
    },
    {
      id: "5-5",
      number: "1.5",
      partRoman: "I",
      partLabel: "I · The Discipline",
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
            "*A composite, not a monolith.* Hempcrete is two things doing two jobs: the timber frame holds the load; the hemp-and-lime infill holds the climate. Neither alone is the wall. Codetry is the same shape: the *names* hold the metaphor; the *system* holds the mechanics; neither alone is the discipline. §5.1's type/name/token stack is a hempcrete diagram — three layers, three jobs, one wall. The frequent error in software discourse is to argue about which single material is *the* right material (the type system as the only truth, the documentation as the only truth, the test suite as the only truth); the codetry move, like the hempcrete move, is to refuse the choice and put the materials in the relationship that makes the wall work.",
        },
        {
          kind: "para",
          text:
            "*Infill, not facade.* Hempcrete sits *inside* the wall — between the structural studs of the frame, breathing in both directions, doing its work in the body of the building. It is not a cladding bolted on the outside for appearance. The codetry name is the same: it is not a label sprayed on the outside of a system that was designed without it. It is the load-distributing infill that lives between the structural type and the surface affordance, and the system only works the way the room expects it to because the infill is doing its job *inside* the wall. Strip the infill and the frame still stands — but the wall stops regulating, the room stops being habitable in the same way, and the mechanics that were quietly held by the composite now have to be shouted by signage and policy.",
        },
        {
          kind: "para",
          text:
            "*Ethical-aesthetic, not just technical.* Hempcrete is chosen, where it is chosen, for a bundle of reasons that no one of which is sufficient: it works thermally, it sequesters carbon, it is locally grown, it is non-toxic, it ages honestly, it is beautiful in a way that pre-cast concrete is not. The choice is technical and ethical and aesthetic at the same time, and the practitioner who tries to defend it on any one of those grounds alone will sound like they are leaving the other reasons out. Codetry has the same compound character. The rename test of §3.2 is technical (it catches drift the type system misses); the protection of community vocabulary is ethical (the people who live in the place are the ones whose words the system runs on); the insistence that the name on the button keep its promise is aesthetic (the wall is honest about what it is). The discipline does not survive being reduced to any one of those grounds. The hempcrete metaphor is the shortest sentence the handbook has for that.",
        },
        { kind: "subhead", text: "Where the strain on the metaphor is honest." },
        {
          kind: "para",
          text:
            "Hempcrete is not perfect. It needs a frame to hold any real load; it cures slowly; the modern revival is small relative to the cement industry it would have to displace; the lime binder is less ecologically clean than the hemp suggests; in some climates the hygrothermal advantages diminish. Codetry has analogous strains: it needs an existing system to hold any real load (the discipline is not a build pattern, it is a discipline applied to a build); the practice cures slowly (a renamed system takes weeks of conversation to settle into the team's mouths, §3.3); the discipline is small relative to the architectural and product-management traditions it would have to displace; the rename test depends on a practitioner who can tell load-bearing from decorative, and that practitioner's judgment is itself a binder whose composition matters. The metaphor is not flattering by accident. The hempcrete wall is the kind of wall the practitioner is trying to build *because* it is honest about what it can and cannot carry.",
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
            "There is a second material the practice keeps reaching for, alongside hempcrete, that the handbook has been politely vague about until now. It is *bamboo* — specifically, the bamboo field of the xBuckets XRP-spring artwork, where six growth stages of a planted grove serve as the visual register for savings accumulating above the network reserve. The bamboo metaphor is doing the same kind of work as the hempcrete one (a living material chosen for a bundle of technical, ecological, and aesthetic reasons that no one of which is sufficient), but in a different room: where hempcrete is the metaphor for the *discipline*, bamboo is a *register* the discipline carries on a particular surface. The two are not interchangeable. §FL.3 records the test that ruled out bamboo as a register on the wallet/XRP-swap chip — bamboo is the right material for the spring artwork and the wrong material for the swap chip, and the test that drew that line is one of the load-bearing entries in the test ledger the Field Ledger collects.",
        },
        {
          kind: "small",
          text:
            "Cross-reference: §FL.3 (Codetry Test 003 — bamboo-field on the wallet chip) for the test that named *one register per screen* and rejected the bamboo register on a surface the water register had already claimed.",
        },
      ],
    },
    {
      id: "1-5",
      number: "1.6",
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
    {
        id: "1-7",
        number: "1.7",
        partRoman: "I",
        partLabel: "I · The Discipline",
        title: "Nearest neighbors — the disciplines codetry is not",
        blocks: [
          {
            kind: "para",
            text:
              "Codetry sits next to a small family of older disciplines that share its concerns about words doing structural work. None of them is codetry, and each of them is honoured. Naming the neighbours up front, in the same breath as naming codetry itself, spares the reader the work of asking, every chapter, *isn't this just X?* Each contrast below is the one-paragraph form; the full treatment of each neighbour lives in the back-matter Deep Dives, and the §DD reference at the end of each paragraph is the door.",
          },
          { kind: "subhead", text: "Code poetry." },
          {
            kind: "para",
            text:
              "*Code poetry* is the older tradition of programs that are also valid verse — Perl in the late 1980s, the Stanford Code Poetry Slam, Mez Breeze, Nick Montfort, Ishac Bertran's *code {poems}* anthology. The poem in code poetry lives *inside* the source: the lines on the screen are the artwork, arranged for sound or terseness or shape. Codetry's poem lives *as* the architecture, and the source is what makes it run. The source of a codetry system is rarely the artefact a reader is meant to admire; the artefact is the way the same noun shows up on the button, in the schema, in the test fixture, and in the conversation in the room, and the source's job is to keep that single noun honest in all of those places at once. §DD.1 walks the contrast in full.",
          },
          { kind: "subhead", text: "Literate programming." },
          {
            kind: "para",
            text:
              "*Literate programming* — Donald Knuth, 1984, WEB and CWEB, with Org-mode Babel, Jupyter, R Markdown, and Quarto as its modern descendants — makes the *document* the source. Prose explains; code is generated from the prose; the unit of care is the explanation, and the typeset essay is what the discipline is for. Codetry makes the *metaphor* the source: the unit of care is the name, and the code is the medium that makes the metaphor real, clickable, runnable. Both are *don't trust; verify* moves — show your work in the medium where the work actually lives — but they verify against different witnesses: literate programming exposes the reasoning; codetry exposes the noun. §DD.2 (with §5.1) draws out why the discipline that holds the names is a precondition for the woven document rather than a sibling to it: the woven essay only does what its prose says it does to the extent that the names inside the source carry the metaphor the prose claims they carry.",
          },
          { kind: "subhead", text: "Domain-driven design and Conway's Law." },
          {
            kind: "para",
            text:
              "*Domain-driven design* (Eric Evans, 2003), with *Conway's Law* (Melvin Conway, 1968) and the bounded-context, ubiquitous-language tradition behind it, is codetry's closest sibling. Both accept the uncomfortable premise that structure outside the code shapes structure inside the code, and both refuse the older arrangement where the language of the domain is paraphrased into engineer-speak on the way into the schema. DDD typically lands on the *domain expert* — the analyst, the consultant, the senior engineer who has just spent a week in workshops tidying the vocabulary up. Codetry insists the noun must come from the community itself, in the form the community already uses it, before any tidying — and treats every translation away from that noun, even into a cleaner, more general, more reusable noun, as *drift* rather than cleanup. §DD.3 (with §4.2) names DDD as one of the *roots* codetry sits on top of, not only a sibling, and reads the *ubiquitous language* clause as the closest single phrase in the prior literature to the move codetry asks of every individual noun.",
          },
          { kind: "subhead", text: "Type-driven design." },
          {
            kind: "para",
            text:
              "*Type-driven design* — *make illegal states unrepresentable*, with Yaron Minsky's Jane Street essays, Richard Feldman's Elm work, and Scott Wlaschin's *Domain Modeling Made Functional* in the room — pushes every invariant the domain demands into the type signature. A non-empty list is its own type; a validated email is its own type; an *Order* that has been *Paid* is structurally different from an *Order* that has not, so the function that ships it cannot be called on the unpaid one. The compiler becomes the first reader of the domain, and the bugs that slip past it are the only bugs left. Codetry agrees that the model carries the architecture, and then asks the harder question: *whose word is on the type?* A perfectly typed `HouseholdContainer` with a non-empty `Items` list and an immutable `CreatedAt` is, by every type-driven measure, a beautiful model; by codetry's measure it is drifted, because the community said *saltbox*. §DD.4: type-driven design verifies the model against the compiler; codetry verifies the model against the person who handed you the word, and treats a perfectly typed model with the wrong word as drift the type checker can't see.",
          },
          { kind: "subhead", text: "Capital allocation at scale." },
          {
            kind: "para",
            text:
              "*Capital allocation at scale* is the founder-as-allocator school — Mises in 1920, Hayek after, the modern entrepreneur lineage that runs through Silicon Valley — that treats capital allocation as the highest economic act and reads profit as the signal the bet was right. Codetry agrees with the calculation point: the information that decides where the next dollar should go lives in the room where the work happens, not in a head office. The two part ways at the exit. The school's success story is the founder who allocates well and *keeps* allocating, on a bigger and bigger pile, for as long as they live; the community around the founder is a counterparty, not a successor. The codetry exit is handover, not compound — the practitioner is paid to write the method down so the community can run the work without them, and a successful practitioner is one the community no longer needs in the chair. §DD.5: both schools agree profit is a signal; they disagree on who reads it — capital allocation at scale reads it at the cap table; codetry insists the signal must also be readable at the kitchen table.",
          },
          { kind: "rule" },
          {
            kind: "para",
            text:
              "Each of the paragraphs above is the one-paragraph form of a contrast that takes a full chapter to hold honestly. The full chapters are §DD.1 through §DD.5 in the back-matter Deep Dives; that is where the codetry / neighbour distinction is worked out at the length the neighbour deserves. The point of naming the family here, at the close of Part I, is the inverse — to put it on the table once and in one place, so the rest of the handbook can name *what codetry is* without having to keep saying *what it isn't*.",
          },
          {
            kind: "small",
            text: "Continue to the Deep Dives → §DD.1.",
          },
        ],
      },
  ],
};

const partII: Part = {
  roman: "DD",
  title: "Deep Dives",
  blurb:
    "Optional deeper reading — you do not need this section to begin practising. If you understand what codetry is and you are ready to use it, go directly to the Field Ledger or set the book down and begin. These five chapters are here for practitioners who want to know exactly how codetry differs from the disciplines it most closely resembles. Return when a question of intellectual lineage arises.",
  kind: "backMatter",
  chapters: [
    {
      id: "2-1",
      number: "DD.1",
      partRoman: "DD",
      partLabel: "Deep Dives",
      title: "Different from code poetry",
      blocks: [
        {
          kind: "callout",
          text: "You have permission to skip this section entirely. If you understand what codetry is and you are ready to practise it, the Field Ledger is the next stop — or set the book down and begin. These chapters are for the practitioner who wants to know precisely how codetry stands in relation to the disciplines it most resembles. They are not required reading; they are a depth resource to return to when a question of lineage arises.",
        },
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
      number: "DD.2",
      partRoman: "DD",
      partLabel: "Deep Dives",
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
            "Both disciplines insist that words around the code do load-bearing work. What each one names as the load-bearing word, and where each one places the unit of care, is the contrast worth drawing here; §5.1 returns to the relationship between the two disciplines once that contrast is on the page, and finds it less symmetric than this chapter first allows.",
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
            "Knuth's discipline is named here with the same respect already extended to code poetry. It is older, it is deeper in the literature, and both it and codetry are *don't trust; verify* moves: show your work in the medium where the work actually lives. Literate programming verifies by exposing the reasoning. Codetry verifies by making the metaphor inspectable in the name itself. The temptation in this chapter is to leave it there, with the two disciplines doing parallel work in adjacent rooms — and the contrast above does hold at the level of *what each discipline is for*. The relationship between them is taken up again, less politely, in §5.1: the woven document only does what its prose says it does to the extent that the names inside the source carry the metaphor the prose claims they carry, which makes the discipline that holds those names a precondition for the weave rather than a sibling to it.",
        },
      ],
    },
    {
      id: "2-3",
      number: "DD.3",
      partRoman: "DD",
      partLabel: "Deep Dives",
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
            "The relationship between codetry and DDD is taken up again, less politely, in §4.2: DDD is not only a sibling discipline but one of the *roots* codetry sits on top of, and the *ubiquitous language* clause is the closest single phrase in the prior literature to the move codetry asks of every individual noun.",
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
      number: "DD.4",
      partRoman: "DD",
      partLabel: "Deep Dives",
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
    {
      id: "2-5",
      number: "DD.5",
      partRoman: "DD",
      partLabel: "Deep Dives",
      title: "Different from capital allocation at scale",
      blocks: [
        {
          kind: "para",
          text:
            "The fifth discipline codetry gets confused with comes from finance, not software. It is the founder-as-allocator school that treats capital allocation as the highest economic act — Mises in 1920, Hayek after, and the modern entrepreneur lineage that runs through Silicon Valley sit in this room.",
        },
        {
          kind: "para",
          text:
            "The conviction is sharp. Resources are finite; uses are infinite. The person closest to a real problem, taking real risk on their own balance sheet, allocates better than a committee that does not. Profit is the signal that the bet was right; a loss is the signal it was wrong.",
        },
        {
          kind: "para",
          text:
            "Codetry agrees with the calculation point. A central planner cannot see what the people on the ground see. The information that decides where the next dollar should go lives in the room where the work happens, not in a head office. Both disciplines accept that the local reader sees what the distant planner cannot.",
        },
        {
          kind: "subhead",
          text: "Capital allocation at scale wants the allocator to keep allocating.",
        },
        {
          kind: "para",
          text:
            "The school's success story is the founder who allocates well and then keeps allocating, on a bigger and bigger pile, for as long as they live. The exit is to compound. The community around the founder is a counterparty, not a successor.",
        },
        {
          kind: "subhead",
          text: "Codetry wants the allocator to make themselves replaceable.",
        },
        {
          kind: "para",
          text:
            "The practitioner takes personal risk, reads the local information, runs a P&L. So far the disciplines agree. Then they part ways: the practitioner is paid to write the method down so the community can run the work without them.",
        },
        {
          kind: "para",
          text:
            "The exit is handover, not compound. The book the practitioner ships is the work, not the brand. A successful practitioner is one the community no longer needs in the chair; a successful founder-allocator is one whose chair grows.",
        },
        {
          kind: "para",
          text:
            "Both schools agree that profit is a signal. They disagree on who reads it. Capital allocation at scale reads the signal at the cap table. Codetry insists the signal must also be readable at the kitchen table — the cost stack, the markup, the truck cost on a page the household sees.",
        },
        {
          kind: "callout",
          text:
            "Capital allocation at scale wants the best allocator to keep allocating. Codetry wants the best allocator to write down how, and then leave the chair to the community that owns the work.",
        },
      ],
    },
  ],
};

// Build the Constellation part (now spine Part II) dynamically from the bundled constellation.
const allZones = [...constellation.zones, ...constellation.preZone];
const zoneCount = allZones.length;

const zoneChapters: Chapter[] = allZones.map((z, i) => {
  const num = `2.${i + 1}`;
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
    partRoman: "II",
    partLabel: "II · The Constellation: 7 Zones and 2 Primitives",
    title: z.name,
    blocks,
  };
});

// Where each registered principle in the constellation manifest has its
// home chapter in Part I. Used to generate the back-citation at the top
// of each Part-II primitive chapter, so a reader who lands on the
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

// Founding-primitive chapters in Part II. One chapter per
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
    const num = `2.${zoneCount + i + 1}`;
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
      partRoman: "II",
      partLabel: "II · The Constellation: 7 Zones and 2 Primitives",
      title: `${p.name} — ${commentary.titleSuffix}`,
      blocks,
    };
  });

const partIII: Part = {
  roman: "II",
  title: "The Constellation: 7 Zones and 2 Primitives",
  blurb:
    "The discipline applied to a real community economy. Seven zones and two primitives, each name chosen by the rules Part I named. These are the worked examples that were in front of the practitioner when codetry got named. The list is open; your own constellation will look different.",
  chapters: [
    {
      id: "3-0",
      number: "2.0",
      partRoman: "II",
      partLabel: "II · The Constellation: 7 Zones and 2 Primitives",
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
      number: `2.${zoneCount + foundingPrimitiveChapters.length + 1}`,
      partRoman: "II",
      partLabel: "II · The Constellation: 7 Zones and 2 Primitives",
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
  roman: "III",
  title: "The Practice",
  blurb:
    "The practitioner in the field. Six moves for working with communities, then Zone 0 — the household as the first and most durable ground. Bobbie's practice is the example here. Yours will be the proof.",
  chapters: [
    {
      id: "4-1",
      number: "3.1",
      partRoman: "III",
      partLabel: "III · The Practice",
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
        { kind: "rule" },
        {
          kind: "callout",
          text:
            "Rule — write down the noun the community already uses, and refuse to translate it.",
        },
        {
          kind: "small",
          text:
            "From the ledger — §FL.2 (Codetry Test 002) is this rule made permanent: the Zone 1 word map locks in the watershed nouns the community had already been using and refuses to swap them for generic equivalents. §FL.5 (Codetry Test 005) records the same rule pulling the Earn destination back to the community-native *Lake* after several generic candidates were tried.",
        },
      ],
    },
    {
      id: "4-2",
      number: "3.2",
      partRoman: "III",
      partLabel: "III · The Practice",
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
            "From the ledger — Tests 001, 002, 009, and 010 (the two 010 entries — shortfall CTA and swap-sheet header) all turn on the rename test of this chapter. §FL.1 catches *bank* trying to displace the watershed verbs on the Payday CTA. §FL.2 locks the Zone 1 word map and rejects three specific generic-noun renames at once. §FL.9 graduates *Top up reservoir from XRP* on the demoted swap chip by running this test against the production wording *Convert XRP → RLUSD*. The two §FL.10 entries — *Top up reservoir from XRP · cover the shortfall* on the loud amber CTA, and *Top up your reservoir* on the swap-sheet header — extend the same test to a loud surface and to a transactional sheet's title-level register. See the Field Ledger for the full ledger.",
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
        { kind: "rule" },
        {
          kind: "callout",
          text:
            "Rule — a name that survives the rename test is load-bearing; one that doesn't is decoration. Reject generic-noun renames at the gate.",
        },
        {
          kind: "small",
          text:
            "From the ledger — §FL.1, §FL.2, §FL.9, §FL.10 are the rule at work; the §FL.10 pair extends it to a loud-amber CTA and a transactional sheet's title-level register.",
        },
      ],
    },
    {
      id: "4-3",
      number: "3.3",
      partRoman: "III",
      partLabel: "III · The Practice",
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
            "The instruments that catch drift — the audit pages, the long-form glossaries, the build-time checks, the cross-deck assertions — are taken up again, as a family, in §3.6.",
        },
        {
          kind: "small",
          text:
            "From the ledger — §FL.1 (Codetry Test 001) is this chapter at work on a single button: two sightings on the Payday CTA, one of *bank* trying to displace *channel*, the other of a stale *Surplus Pool* parenthetical drifting in a daily drop, both caught by reading the surfaces cold and naming the slip as a slip. The two sightings are the cleanest worked example of *catch the slippage early and name it as slippage* the handbook has on hand.",
        },
        { kind: "rule" },
        {
          kind: "callout",
          text:
            "Rule — drift is structural, not cosmetic. Catch the slippage early and name it as slippage; install the check at the bench, not at the gate.",
        },
        {
          kind: "small",
          text:
            "From the ledger — §FL.1 names the gate-vs-bench timing the rule turns on; the §FL.1 sightings of *bank* and *Surplus Pool* are the slip caught and named.",
        },
      ],
    },
    {
      id: "4-4",
      number: "3.4",
      partRoman: "III",
      partLabel: "III · The Practice",
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
        { kind: "rule" },
        {
          kind: "callout",
          text:
            "Rule — the session's output is a one-page list of nouns and verbs in the community's own language. Print it; the print is the spec.",
        },
        {
          kind: "small",
          text:
            "From the ledger — §FL.2 (Codetry Test 002) is the locked Zone 1 word map: a one-page table of nouns and verbs the practitioner committed to as the spec for the watershed dialect, born of exactly the kind of session this chapter describes.",
        },
      ],
    },
    {
      id: "4-5",
      number: "3.5",
      partRoman: "III",
      partLabel: "III · The Practice",
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
            "From the ledger — §FL.3 (Codetry Test 003) and §FL.5 (Codetry Test 005) both run this distinction at the surface level. §FL.3 rules out the bamboo-field metaphor on the wallet/XRP-swap chip not because bamboo is a bad metaphor, but because the chip's *medium* — a wallet/swap surface inside the Zone 1 water register — already belongs to a different metaphor, and the rule *one register per screen* protects the medium from carrying two competing metaphors at once. §FL.5 graduates the *Park / Public Park / Private Park* renames for the Earn surface (later renamed to *Lake* by Task #849, recorded in this entry) — the rename was specifically about choosing the medium-correct noun for the destination of an Earn flow inside the Zone 1 watershed dialect.",
        },
        { kind: "rule" },
        {
          kind: "callout",
          text:
            "Rule — one register per screen. The medium serves the metaphor; never let two metaphors compete on the same surface.",
        },
        {
          kind: "small",
          text:
            "From the ledger — §FL.3 enforces *one register per screen* on the Zone 1 wallet/swap chip; §FL.5 lands the medium-correct noun (*Lake*) on the Earn destination after the discipline rejects the off-register candidates.",
        },
      ],
    },
    {
      id: "4-6",
      number: "3.6",
      partRoman: "III",
      partLabel: "III · The Practice",
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
            "From the ledger — §FL.2 (Test 002), §FL.4 (Test 004), and the §FL.6/§FL.8 pair (Test 006 and the second-numbered Test 008) read as a working family of verification instruments. §FL.2 is the locked Zone 1 word map itself — the table the rename test of §3.2 runs against. §FL.4 names the temperature rule (calm states earn their loudness) — the verification that a name's typographic volume matches the work the name is doing. §FL.6 and §FL.8 install the Drip Harvester sense-distinction across Earn surfaces — verification by pinning down two senses of one noun rather than letting the bare word drift between them.",
        },
        { kind: "rule" },
        {
          kind: "callout",
          text:
            "Rule — one word, one referent. Pin each noun to a single sense; let the typographic volume match the work the name is doing.",
        },
        {
          kind: "small",
          text:
            "From the ledger — §FL.6 and §FL.8 hold *one word, one referent* on the Drip Harvester noun across Earn surfaces; §FL.4 holds the calm-states temperature rule.",
        },
      ],
    },
    {
      id: "4-7",
      number: "3.7",
      partRoman: "III",
      partLabel: "III · The Practice",
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
        { kind: "subhead", text: "The fable version" },
        {
          kind: "para",
          text: "Not every room thinks in buildings. Some rooms think in stories. The Ant and the Grasshopper is the teaching move for those rooms — the same principle, running in the grammar of a fable rather than the grammar of a construction site.",
        },
        {
          kind: "para",
          text: "The grasshopper's argument is internally coherent: abundance is everywhere, anytime he grows hungry he can hop through the field, there's no use doing extra work when the time could be better spent. The ant does not argue. The ant keeps working — storing a little extra each day, reading the pattern of the seasons, preparing for the weather he knows will come. History repeats itself, after all.",
        },
        {
          kind: "para",
          text: "When winter arrives, the grasshopper watches the last blade of grass disappear. The fable's lesson is not *be afraid*. It is *the pattern was legible, the preparation was available, and the name for what the ant was doing is the same name the Jarista uses: Preservation Season*. The ant was a Zone 0 practitioner running the Standby. The field was the supply chain. Winter was the activated state.",
        },
        {
          kind: "callout",
          text: "The fable teaches what the building teaches. The ant is not paranoid — the ant is reading the pattern. Winter is coming is not a threat; it is a calendar.",
        },
        { kind: "rule" },
        { kind: "subhead", text: "The garden version" },
        {
          kind: "para",
          text: "A third room thinks in gardens. For that room: designing community is like designing a garden. You need intentional placement of boundaries and intentional facilitation of interactions. Forcing community is like designing a garden in a swamp — you can do everything else right, but you're always going to be covered in muck.",
        },
        {
          kind: "para",
          text: "The garden metaphor reaches the voluntarist principle without naming it as such. Voluntary interactions and clear boundaries are what let grassroots community flourish — the same principle the architect states through load-bearing walls and the fable states through winter storage. Three entry points, one discipline.",
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
    {
      id: "4-8",
      number: "3.8",
      partRoman: "III",
      partLabel: "III · The Practice",
      title: "Zone 0 — The Household",
      blocks: [
        {
          kind: "small",
          text: "Zone 0 · the ground · where everything else in the constellation flows from.",
        },
        {
          kind: "para",
          text: "The constellation has six zones and two constellation-wide primitives. Zone 0 is not where the work starts — it is what the work is for. Every other zone, every primitive, every gate and standby and ledger in the system exists to protect what happens in Zone 0: the household, the family, the daily practice of keeping people warm and fed and free.",
        },
        {
          kind: "para",
          text: "Zone 0 in the permaculture sense is the human body and the home. In the Headwaters constellation it is both: the household as the economic and relational unit that every other zone is downstream of. *The household balance is the source of the whole watershed.* Zone 1 (Headwaters) is downstream. Zone 3 (the co-op) is downstream. Even Zone 4 (the land) is downstream from the household that is tending it. Get Zone 0 right and every other zone has a stable source to draw from.",
        },
        {
          kind: "subhead",
          text: "What the practitioner does in Zone 0.",
        },
        {
          kind: "para",
          text: "The six moves of §3.1–§3.7 all apply in Zone 0. Listen for the noun: the household practitioner says *the pantry*, *the jar kitchen*, *the seasonal shelf*, *the canning season* — not *food storage*, not *meal prep*, not *inventory management*. Write those nouns down and refuse to translate them. Test the name by trying to rename it. Hold the metaphor to the medium. Run the both-states test when the system has two tempos (the resting shelf and the harvest push).",
        },
        {
          kind: "para",
          text: "The chapters that follow are not a how-to guide. They are the vocabulary of Zone 0 practice — the named systems a household runs, the nouns those systems load their weight onto, and the tests that tell the practitioner when a name is doing real work versus when it is decoration. The practices themselves — fermentation, canning, cold storage, bulk sourcing, seasonal meal planning — are older than codetry and will survive it. What codetry adds is the naming discipline that keeps those practices legible to the people inside them and resistant to the generic vocabulary that would slowly erase what makes them specific.",
        },
        {
          kind: "callout",
          text: "Zone 0 is not the smallest zone. It is the source zone. Everything else is downstream.",
        },
      ],
    },
    {
      id: "4-9",
      number: "3.9",
      partRoman: "III",
      partLabel: "III · The Practice",
      title: "The Jarista",
      blocks: [
        {
          kind: "small",
          text: "Zone 0 · the named practitioner · bright-side identity.",
        },
        {
          kind: "para",
          text: "Every practice needs a named practitioner. *Jarista* is the bright-side name for the household practitioner who runs a jar-centred, seasonally-organized food system. Not a home cook, not a food preservationist, not a homesteader. A Jarista — the person who has built the jar into the infrastructure of the household rather than treating preservation as a seasonal hobby.",
        },
        {
          kind: "subhead",
          text: "Why this name and not another.",
        },
        {
          kind: "para",
          text: "The rename test: replace *Jarista* with *home cook*. What changes? *Home cook* describes someone who prepares meals. It carries no information about preservation, about seasonal sourcing, about the long-game of building a household that can run independently of the grocery store for weeks or months. Replace *Jarista* with *food preservationist* and you keep the preservation dimension but lose the daily kitchen practice — the Jarista cooks from jars, not just into jars. The word holds both directions in one.",
        },
        {
          kind: "para",
          text: "It is also a bright-side word with no massity equivalent. When a Jarista speaks to a grant officer, a public health inspector, or a food hub coordinator, they use whatever language the context requires — *home food producer*, *small-scale preservationist*, *food security practitioner*. But at home, in the kitchen, in the co-op's training program, the word is *Jarista*. The Gate logs the translation; the bright-side noun stays unchanged.",
        },
        {
          kind: "callout",
          text: "The Jarista is a both-sides word: the household practitioner in their own language on the bright side; *food producer* or *preservationist* on the massity side. The Gate holds the translation. The name stays.",
        },
        {
          kind: "subhead",
          text: "Who the Jarista is in the constellation.",
        },
        {
          kind: "para",
          text: "The Jarista is not a certification. It is a posture — the household practitioner who has decided that the jar is the unit of measure for their food system, the season is the calendar they plan by, and the shelf is the first line of resilience when supply chains tighten. In a constellation context, the Jarista is the Zone 0 counterpart of the Zone 2 practitioner who runs the Operating Plan. Both are named practitioners. Both are running a system. The Zone 2 practitioner names and protects the vocabulary of the constellation's institutions; the Jarista names and protects the vocabulary of the household that the constellation exists to serve.",
        },
        {
          kind: "subhead",
          text: "Where the name came from.",
        },
        {
          kind: "para",
          text: "Before *Jarista* there was *Parrs Jars* — the product business that grew from a household practice of freeze-drying excess hydroponics and microgreens, blending them into smoked salts, and sourcing from local farms. *Parrs Jars* named the product. It did not name the practitioner or the practice behind it. The business name held the jars; it did not hold the system.",
        },
        {
          kind: "para",
          text: "Before that, the practitioner called it a *depression business* — a phrase that arrived precisely: working with what you have and sticking things in jars, that's got 1930 written all over it. The depression business framing held the ethos (make-do, preserve, extend, waste nothing) but pointed backward toward scarcity rather than forward toward practice. The rename test: if the business is called a *depression business*, it is defined by what it is prepared for rather than by what it does. *Jarista* names the doer. The posture travels even when the depression doesn't arrive.",
        },
        {
          kind: "para",
          text: "The constellation also had a prior umbrella name: *Above Parr Solutions* — a name for an organization that offered community development services and preparedness content. Run the rename test: replace *Headwaters* with *Above Parr Solutions* and ask what changes. *Above Parr* is a personal reference (the practitioner's own surname), a wordplay on *par*, and a qualifier (*above*) that implies the baseline is scarcity. *Headwaters* carries source, upstream, small-and-first, and the whole watershed metaphor in one word — and it carries none of the practitioner's name, which means it belongs to the community rather than to its founder. The rename from *Above Parr Solutions* to *Headwaters* is the codetry move applied to the constellation's own umbrella: the word that fits the structure replaced the word that fit the person.",
        },
        {
          kind: "callout",
          text: "Parrs Jars named the product. Depression business named the ethos. Jarista names the practitioner and the practice. Above Parr Solutions named the founder. Headwaters names the system. The rename is the discipline working on itself.",
        },
      ],
    },
    {
      id: "4-10",
      number: "3.10",
      partRoman: "III",
      partLabel: "III · The Practice",
      title: "The Jar Kitchen",
      blocks: [
        {
          kind: "small",
          text: "Zone 0 · the named space · the infrastructure of seasonal living.",
        },
        {
          kind: "para",
          text: "The Jar Kitchen is not a kitchen that happens to have jars in it. It is a kitchen where the jar is the primary unit of storage — the default container that the Jarista thinks and plans around. Tupperware is a visitor. The jar is the resident.",
        },
        {
          kind: "subhead",
          text: "The rename test.",
        },
        {
          kind: "para",
          text: "Rename *The Jar Kitchen* to *The Kitchen*. What changes? The principle disappears — that this kitchen is organized around a specific container, a specific preservation posture, a specific relationship between what is grown this season and what will be eaten next February. *The Kitchen* is every kitchen. *The Jar Kitchen* is a named system with a named organizing principle.",
        },
        {
          kind: "para",
          text: "Rename it to *The Pantry*. What changes? The pantry is where food is stored; the jar kitchen is also where food is prepared, transformed, and preserved. The pantry is static; the jar kitchen is active. The pantry receives; the jar kitchen produces. The name carries the direction of movement, not just the location.",
        },
        {
          kind: "subhead",
          text: "What the Jar Kitchen holds.",
        },
        {
          kind: "list",
          items: [
            "*Wide-mouth jars* — the standard unit. Pints for single-meal portions, quarts for soups and stocks and fruit, half-pints for ferments and condiments. The size vocabulary is consistent across the whole system.",
            "*The Seasonal Shelf* — the always-changing inventory of what was preserved this season and is being drawn down through the year. Not a static pantry. A living shelf.",
            "*The Bulk Corner* — dry goods in jars: grains, legumes, spices, nuts. Sourced in bulk, stored in the same container system, requiring no translation between storage and use.",
            "*Fermentation station* — the active culture corner. Crocks, airlocks, cloth-covered jars of something alive. The Jar Kitchen has a living edge that most kitchens do not.",
            "*Immersion blender, wide-mouth lids, jar tongs* — the tools specific to the Jar Kitchen. Not interchangeable with the general kitchen toolkit. Named by their function in the system.",
          ],
        },
        {
          kind: "callout",
          text: "The Jar Kitchen is a design decision, not a decorating style. The jar is load-bearing: rename it out and the whole system of seasonal storage, portion planning, and bulk sourcing has to be redesigned around whatever container replaced it.",
        },
        {
          kind: "subhead",
          text: "The three properties.",
        },
        {
          kind: "para",
          text: "The jar holds its place in the Jar Kitchen for three reasons, all structural: it is resilient, versatile, and honest.",
        },
        {
          kind: "list",
          items: [
            "*Resilient* — jars don't break under pressure. They seal against air, moisture, and contamination. The Jarista who builds a food system around jars is building around a container that was designed for exactly the conditions preservation creates: heat, acid, pressure, time. A jar full of tomatoes from August will still be a jar full of tomatoes in February. That is not a property of a plastic tub or a zip-lock bag.",
            "*Versatile* — the same jar serves as a drinking glass, a ferment vessel, a dry-goods container, a sprouting jar, a portioned lunch, and a gift. The container system does not require translation between functions. The pint jar that held last summer's salsa holds this morning's overnight oats. The system runs on one container vocabulary.",
            "*Honest* — you can see what's inside. The Seasonal Shelf is auditable at a glance: what month things came in, what colour they are, how much is left. The jar does not hide its contents. This is an architectural property, not an aesthetic one: a shelf you can read without opening anything is a shelf you can manage without a spreadsheet.",
          ],
        },
        {
          kind: "subhead",
          text: "The circular economy origin.",
        },
        {
          kind: "para",
          text: "The Parrs Jars product line — the green salt, the Salty Onion — was born from the Jar Kitchen's circular economy logic. The household was growing microgreens and hydroponics and ending up with more than the kitchen could use fresh. Freeze-drying the excess preserved the nutrition without the jar. Mixing the freeze-dried greens into smoked Himalayan salt with homegrown tomato powder produced a product: the green salt. The Salty Onion followed from the same logic — a massive harvest of onions and greens from Walls Farm and the garden, freeze-dried and blended. The jar held the output; the circular economy produced the input.",
        },
        {
          kind: "para",
          text: "The product line was a Zone 0 practice producing Zone 3 commercial output. The Jar Kitchen didn't start as a business. It started as a household system that generated abundance — and the abundance had to go somewhere. That is the direction the Jar Kitchen runs: from abundance toward meals, toward products, toward community, not from market demand backward into production.",
        },
      ],
    },
    {
      id: "4-11",
      number: "3.11",
      partRoman: "III",
      partLabel: "III · The Practice",
      title: "Sourcing",
      blocks: [
        {
          kind: "small",
          text: "Zone 0 · farm to jar · bright-side sourcing in a northern food system.",
        },
        {
          kind: "para",
          text: "The Jarista does not shop. They source. The distinction is not semantic decoration — it is the load-bearing difference between a household that takes what is available and a household that builds relationships with what is grown nearby and plans around what the season will offer.",
        },
        {
          kind: "subhead",
          text: "The vocabulary of sourcing.",
        },
        {
          kind: "list",
          items: [
            "*The Bulk Round* — the seasonal sourcing run. Not a grocery trip, not a shopping day. A round: a planned circuit of farms, markets, and co-op pickups that brings the season's abundance home in one efficient move. The naming carries the shape of the thing — a route, not a transaction.",
            "*The Farm Gate* — the direct producer relationship. Buying at the farm gate rather than through a retailer keeps the multiplier local: research on northern food systems suggests that every dollar spent at the farm gate generates up to $2.30 in the wider local economy, compared to a fraction of that when the same dollar flows through a distant supply chain.",
            "*The Market Table* — the farmers market as a sourcing channel. Distinct from the Farm Gate in that it is curated by season and geography: what is on the table this week is what is ready this week in this territory.",
            "*Wild harvest* — hunting, trapping, fishing, and foraging as sourcing channels. Not hobbies. Not supplements to a grocery habit. Named as primary sourcing channels that the Jarista plans the year around.",
            "*The Canning Club* — the shared-production arrangement where several Jarsitas pool a production kitchen, labour, and bulk sourcing to process seasonal abundance more efficiently than any one household could alone.",
          ],
        },
        {
          kind: "subhead",
          text: "Sourcing in a northern food system.",
        },
        {
          kind: "para",
          text: "In northwestern Ontario, the season for local fresh produce is short and the distances between producers are long. The Jarista's sourcing practice is built for this specific geography: a short, intense harvest window, a long storage season, a preference for wild harvest over tender annual crops, and a co-op supply network that extends what any one household can source on its own. The names of the sourcing channels carry this geography — they are not imports from a southern growing culture.",
        },
        {
          kind: "callout",
          text: "Sourcing is not the same as shopping. Shopping is reactive — you take what the supply chain offers. Sourcing is intentional — you build relationships with what the territory produces and plan your preservation season around the calendar of the land.",
        },
      ],
    },
    {
      id: "4-12",
      number: "3.12",
      partRoman: "III",
      partLabel: "III · The Practice",
      title: "The Seasonal Shelf",
      blocks: [
        {
          kind: "small",
          text: "Zone 0 · the living pantry · seasonal rhythm made visible.",
        },
        {
          kind: "para",
          text: "The Seasonal Shelf is not a pantry. A pantry is static — you stock it and draw from it and restock it when it runs low. The Seasonal Shelf is a living inventory that moves with the year: full in October after the harvest push, drawn down through winter and spring, nearly empty by May, and beginning to fill again when the first summer crops arrive. The trajectory is the system.",
        },
        {
          kind: "subhead",
          text: "The rename test.",
        },
        {
          kind: "para",
          text: "Rename *Seasonal Shelf* to *Pantry*. The trajectory disappears. A pantry is managed to stay full; the Seasonal Shelf is managed to cycle. The Jarista who calls it a pantry will manage it like a pantry — buying to replace what is gone, without reference to the season. The Jarista who names it a Seasonal Shelf will manage it differently: watching the trajectory, planning the preservation season to refill at the right moment, drawing down intentionally in late spring to make room for the next season's abundance.",
        },
        {
          kind: "subhead",
          text: "What the Seasonal Shelf tracks.",
        },
        {
          kind: "list",
          items: [
            "*Preserved goods* — jars of what was processed at peak season: tomatoes in August, berries in July, beans in September, venison from November. The shelf's language is the month things came in, not the month they were purchased.",
            "*Dry storage* — grains, legumes, nuts, dried mushrooms, dehydrated vegetables. The bulk round's non-perishable output. Stored in the jar system, rotated by date.",
            "*The Freezer Register* — the Seasonal Shelf has a cold counterpart: the harvest hold in the freezer, tracked with the same seasonal vocabulary. Blanched and frozen beans from August. Rendered fat from the fall slaughter. Smoked fish from the spring run.",
            "*Gap tracking* — the Jarista watches what runs out before the next season rather than what they forgot to buy. The gaps in the Seasonal Shelf at April are the planning inputs for the next harvest push.",
          ],
        },
        {
          kind: "para",
          text: "Whole food prep in the Jar Kitchen is organized around the Seasonal Shelf. The week's meals are drawn from what is on the shelf and the freezer register, not from a meal plan built against a grocery flyer. The planning direction is reversed: from abundance toward meals, not from meals toward shopping.",
        },
        {
          kind: "callout",
          text: "The Seasonal Shelf is managed to cycle, not to stay full. A shelf at zero in May means the system worked. A shelf that never empties means the rotation has stalled and something is aging past its best.",
        },
      ],
    },
    {
      id: "4-13",
      number: "3.13",
      partRoman: "III",
      partLabel: "III · The Practice",
      title: "The Harvest Hold",
      blocks: [
        {
          kind: "small",
          text: "Zone 0 · the freezer system · holding seasonal abundance across the year.",
        },
        {
          kind: "para",
          text: "The freezer is not a backup refrigerator. In the Jar Kitchen it is the Harvest Hold — a deliberately managed seasonal reserve that is stocked during the harvest push and drawn down through the year. The name carries the purpose: *hold* is active, not passive; *harvest* ties it to the season that filled it.",
        },
        {
          kind: "subhead",
          text: "The rename test.",
        },
        {
          kind: "para",
          text: "Rename *Harvest Hold* to *Freezer*. You have named an appliance. Rename it to *Frozen Storage* and you have named a function but not a system. The Harvest Hold is a managed reserve with a fill cycle, a draw-down trajectory, a rotation discipline, and a seasonal calendar. The word *freezer* carries none of this. A freezer is where leftovers go. The Harvest Hold is where the season goes.",
        },
        {
          kind: "subhead",
          text: "How the Harvest Hold works.",
        },
        {
          kind: "list",
          items: [
            "*Flash freezing* — freezing individual portions on a sheet before bagging, so the Harvest Hold contains loose usable portions rather than a solid brick that has to be thawed whole. The technique is named; it is not just a tip.",
            "*Year-round inventory* — the Harvest Hold is tracked with the same discipline as the Seasonal Shelf. What came in when, in what quantity, at what stage of processing. The register is the discipline.",
            "*Rotation* — oldest items forward, newest behind. The Harvest Hold that is not rotated is not a hold; it is an accumulation. Rotation is what makes the hold a system rather than a pile.",
            "*Pressure canning as an alternative* — some things the Harvest Hold stores in the freezer could instead be shelf-stable in the jar system. Pressure-canned meats and stocks move from the freezer column to the Seasonal Shelf column, reducing the Harvest Hold's load and extending the household's resilience beyond a power outage.",
          ],
        },
        {
          kind: "para",
          text: "The Harvest Hold and the Seasonal Shelf together are the household's two-sided reserve: one cold and perishable in an infrastructure sense, one shelf-stable and infrastructure-independent. The Standby principle applies at the household scale — the name that holds both the Harvest Hold and the Seasonal Shelf together is *the reserve*, and a household that manages both as one system is more resilient than one that manages them separately.",
        },
        {
          kind: "callout",
          text: "The Harvest Hold is filled once a year and drawn down all year. A freezer is used every week. The difference is a management posture, not an appliance.",
        },
      ],
    },
    {
      id: "4-14",
      number: "3.14",
      partRoman: "III",
      partLabel: "III · The Practice",
      title: "Preservation Season",
      blocks: [
        {
          kind: "small",
          text: "Zone 0 · the activated state · when the household Standby fills itself.",
        },
        {
          kind: "para",
          text: "Preservation Season is the activated state of Zone 0. The resting state is the Seasonal Shelf being slowly drawn down, the Harvest Hold running its rotation, the Jarista cooking from what is there. Preservation Season is when the bulk round returns full, the jars come out of storage, the lids are ordered, and the Jar Kitchen runs at full capacity for days or weeks. Same infrastructure, different tempo. Both states have a name.",
        },
        {
          kind: "subhead",
          text: "The both-states test at household scale.",
        },
        {
          kind: "para",
          text: "The name *Preservation Season* holds both states only if the Jarista carries both in one posture — the shelf is being maintained even when Preservation Season is not active, and the seasonal push is anticipated during the long draw-down of winter. A Jarista who only preserves and never draws down has a hoard. A Jarista who only draws down and never preserves has an empty shelf by March. The system requires both states to be named and practiced.",
        },
        {
          kind: "subhead",
          text: "The techniques of Preservation Season.",
        },
        {
          kind: "list",
          items: [
            "*Water bath canning* — for high-acid foods: tomatoes, fruits, pickles, fermented vegetables. The entry-level preservation technique; the one that fills most of the Seasonal Shelf.",
            "*Pressure canning* — for low-acid foods: meats, stocks, beans, corn. Requires a pressure canner. Produces shelf-stable jars of what would otherwise have to live in the Harvest Hold.",
            "*Fermentation and pickling* — small-batch, live-culture preservation. Sauerkraut, kimchi, brine pickles, kvass. The ferment station's output. Not the same as canning — ferments are alive and managed, not sealed and static.",
            "*Dehydrating* — mushrooms, herbs, berries, apple rings, jerky. Low-tech, energy-efficient, and the technique most compatible with a wood-heated household during a power outage.",
            "*Rendering and smoking* — fat, lard, smoked fish, smoked meat. The traditional preservation techniques of the territory, carried forward in the Jar Kitchen because they work in this climate and with these species.",
          ],
        },
        {
          kind: "subhead",
          text: "Preservation Season and the Household Standby.",
        },
        {
          kind: "para",
          text: "Preservation Season is the household's annual activation of its own Standby. The co-op's Standby (Zone 3) runs the same both-states discipline at the community scale. The household Jarista and the co-op's Standby practitioner are running the same system at different scales, in the same vocabulary, on the same calendar. When the Standby activates at the co-op level — a freight disruption, a weather event, a supply-chain failure — the Jarista's Preservation Season work is exactly what the household draws on to stay fed while the community-level response mobilizes.",
        },
        {
          kind: "subhead",
          text: "The verification signal.",
        },
        {
          kind: "para",
          text: "The codetry practitioner has the rename test. The Jarista has the ping. When a jar seals properly — the lid pulled down by the vacuum formed as the hot contents cool — it produces a single sharp sound. That ping is the verification signal: the jar sealed, the work held, the preserve is shelf-stable. There is no ambiguity. The lid either pings or it doesn't. If it doesn't, the jar goes in the fridge and gets eaten this week. The batch that pings goes on the Seasonal Shelf.",
        },
        {
          kind: "para",
          text: "Self-sufficiency measured as a percentage starts with that ping. A household at 5% self-sufficiency — a backyard garden and a few jars — hears that sound occasionally. A household at 85% — growing year-round, collaborating with the community, preserving the season's abundance, and changing eating habits to suit the territory rather than the grocery flyer — hears it through the whole of Preservation Season. The percentage climbs ping by ping.",
        },
        {
          kind: "callout",
          text: "There's nothing like the ping of a lid sealing to make you feel accomplished. It is the discipline's verification in the plainest possible form: the work held.",
        },
        { kind: "rule" },
        {
          kind: "para",
          text: "A note from the territory: the farmers market attendance in Dryden has been declining. Producers are exiting because the regulatory barriers are high and the customer base is thin. If the Seasonal Shelf matters — if the Jarista's practice matters — then buying locally is not a preference. It is maintenance. A community that does not support its local producers will one day find that no local producers remain. The Jarista's shelf and the farmer's market table are the same system, viewed from two directions.",
        },
      ],
    },
    {
      id: "4-15",
      number: "3.15",
      partRoman: "III",
      partLabel: "III · The Practice",
      title: "Zone 0 — The Homestead",
      blocks: [
        {
          kind: "small",
          text: "Zone 0 · physical infrastructure · the ground beneath the Jar Kitchen.",
        },
        {
          kind: "para",
          text: "The Jar Kitchen sits inside a larger system: the homestead. The homestead is Zone 0's physical infrastructure — the named systems that keep the household running when external systems fail. The Jar Kitchen preserves the food. The homestead keeps the house warm, the water flowing, and the growing going regardless of what the grid, the supply chain, or the season is doing.",
        },
        {
          kind: "para",
          text: "Self-sufficiency as a percentage is the honest metric for Zone 0 infrastructure. Not *are you prepared* — a yes/no that has no calibration — but *what percentage of your household's needs can you meet from within your own systems right now*. A backyard garden and a jar or two is 5%. Three heating systems, a spring-fed well with a manual pump, year-round indoor growing, and a full Seasonal Shelf is closer to 85%. The gap between those two numbers is the infrastructure build — and it is a decade of work, not a weekend project.",
        },
        {
          kind: "subhead",
          text: "The named systems of the homestead.",
        },
        {
          kind: "list",
          items: [
            "*Three heating systems* — not one. The load-bearing rule for Zone 0 in a northern climate: no single heating system is the only heating system. A wood fireplace, a backup propane or oil furnace, and a passive solar or radiant floor arrangement each carry a different part of the load. When one fails — in a power outage, in a fuel shortage, in a mechanical breakdown — the others hold the house. The third system is the one that runs when neither of the first two can.",
            "*Gravity-fed septic* — waste management that does not require electricity or a pump to function. The infrastructure that continues to work when the power is out. Most homeowners in the city never think about the pump that runs their septic; the Zone 0 practitioner makes sure the system works without one.",
            "*Manual well pump for the spring-fed well* — drinking water that does not require the grid. The spring-fed source and the manual pump together are the household's water independence: the pump operates when the power is out, the spring replenishes when the aquifer is whole. Named as two systems working together, not as a single appliance.",
            "*Gardens and indoor growing systems* — the Jar Kitchen's supply chain, located on the homestead. Outdoor gardens for summer abundance; kratky hydroponics and indoor growing systems for year-round production. The indoor system extends the growing season past what the northern Ontario climate allows outside, and produces the microgreens and greens that feed the Jar Kitchen's circular economy.",
            "*Pantry rotation systems* — the organizational discipline that connects the Harvest Hold and the Seasonal Shelf into one managed reserve. First-in-first-out, dated labels, gap tracking. The system that turns a storage space into a working pantry.",
          ],
        },
        {
          kind: "subhead",
          text: "Infrastructure before skills.",
        },
        {
          kind: "para",
          text: "The infrastructure is not the most valuable thing the homestead builds. The skills are. The heating systems, the well pump, the gardens — these are capital. The knowledge of how to use them, repair them, extend them, and teach them is the compounding asset. A household with three heating systems and no one who knows how to tend a wood fire is less resilient than a household with one heating system and three people who know how to use it. Infrastructure names the capability. Skills hold it.",
        },
        {
          kind: "callout",
          text: "Start where you are, with what you have. 5% is a beginning, not a failure. The homestead build is a decade of compounding decisions, not a single preparedness purchase.",
        },
      ],
    },
    {
      id: "4-16",
      number: "3.16",
      partRoman: "III",
      partLabel: "III · The Practice",
      title: "From scared to prepared",
      blocks: [
        {
          kind: "small",
          text: "Zone 0 · the practitioner's arc · 2011 to present.",
        },
        {
          kind: "para",
          text: "It was spring 2020. The practitioner was walking a baby's stroller around the yard, watching a three-year-old move through the grass. The world was in disarray, and underneath the noise of it was one clear question: what would happen to this region if the truckers went on strike? At that moment the local co-op was gone, the farmers market was uncertain, and the grocery stores' shelves ran on three days of just-in-time supply. The answer to the question was not acceptable. So the practitioner started planning a business.",
        },
        {
          kind: "para",
          text: "That moment in March 2020 was not the beginning. It was the activation. The beginning was 2011, when learning how money works led to a decade of quieter preparation: building the homestead's three heating systems, installing the manual well pump for the spring-fed well, expanding the gardens, learning hydroponics and microgreens, tripling down on food preservation, acquiring chickens. Working during the time of abundance for the time of hardship the patterns suggested was coming.",
        },
        {
          kind: "para",
          text: "The practitioner called it a *depression business* from the start — working with what you have and sticking things in jars, that's got 1930 written all over it. The business had a name: *Parrs Jars*. The umbrella organization had a name: *Above Parr Solutions*. Both names were honest about their moment. Neither was built to carry the full weight of what came next.",
        },
        {
          kind: "subhead",
          text: "The naming arc.",
        },
        {
          kind: "para",
          text: "By July 2020 the business was running. By the time the constellation had taken shape, the names had all been tested. *Parrs Jars* named the product; *Jarista* named the practitioner and the practice. *Above Parr Solutions* named the organization after its founder; *Headwaters* named it after the system — the source that feeds the whole watershed. The rename test had been run on the practitioner's own prior work, and the constellation had come out the other side.",
        },
        {
          kind: "para",
          text: "The five courses Bobbie had been building — Preservation, Preparedness, Permaculture, Seasonal Living, Decentralization — turned out to be the zone practices, waiting for the architecture that would let them stand together as a system rather than as a product list. Same content. New structure. The naming gave the content its shape.",
        },
        {
          kind: "subhead",
          text: "What grassroots community is for.",
        },
        {
          kind: "para",
          text: "The 807 Food Co-op was built from the same logic as the Jar Kitchen: start the cart rolling. Knowing that a local food hub would not be the final answer — but also knowing that forward motion is easier to redirect than stillness — the practitioner built the infrastructure and began pursuing distribution. Collaborators arrived. The co-op took shape. The Zone 0 household practice had generated Zone 3 infrastructure.",
        },
        {
          kind: "para",
          text: "The regulatory walls were real. The health unit required lab testing for each farm ingredient in the freeze-dried salt blends, and recommended switching to commercial ingredients instead — which was done, to meet orders, and which cost the product its story. The co-op lost its farmers market exempt status after three years of building the model to meet those regulations. Grant applications for food safety equipment were denied. The in-person market attendance fell. The juice, for many local producers, stopped being worth the squeeze.",
        },
        {
          kind: "para",
          text: "None of that changed the thesis. *Grassroots community and productive local economies are the only fighting chance.* The Jarista does not wait for the regulatory environment to become favourable before building the Seasonal Shelf. The community does not wait for grant approval before learning to preserve. The work is done during the time of abundance, before anyone knows whether the activated state is coming. That is the Standby principle, applied to a practitioner's own life.",
        },
        {
          kind: "subhead",
          text: "What the practitioner commits to.",
        },
        {
          kind: "list",
          items: [
            "Building food skills — the compounding asset of the homestead.",
            "Inspiring community — showing up, because community makes everything easier and developing community is not easy.",
            "Helping others — mentorship, the co-op's incubation program, sharing the decade of learning.",
            "Productive hobbies — hunting, fishing, foraging, trapping. Not hobbies in the leisure sense. Named as primary sourcing channels.",
            "Raising good men who think for themselves and practice empathy — the multi-generational frame. The constellation is not built for this generation alone.",
          ],
        },
        {
          kind: "callout",
          text: "A depression may be around the corner but being depressed never has to be a reality we face. The world is your oyster in good times and bad when you build your life around the simple things that matter.",
        },
        { kind: "rule" },
        {
          kind: "para",
          text: "Freedom is not granted. Freedom is claimed — one Preservation Season at a time, one jar at a time, one community institution at a time. The discipline codetry adds is small: name the thing correctly, test the name by trying to rename it, and refuse to let the generic vocabulary quietly erase what makes the practice specific. The Jarista, the Jar Kitchen, the Seasonal Shelf, the Harvest Hold, the Bulk Round, Preservation Season — these names are the practice made legible. Keep them.",
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
  roman: "G",
  title: "Grounding",
  blurb: "Start here. The teachers whose thinking this practice grows from, the axiom it runs on, and the reading lineages that trained the practitioner's ear. Understand the roots and the discipline in Part I will make immediate sense. Understand the soil before you plant.",
  chapters: [
    {
      id: "5-1",
      number: "4.1",
      partRoman: "G",
      partLabel: "Grounding",
      title: "The four teachers and the axiom",
      blocks: [
        {
          kind: "para",
          text:
            "Codetry is not a school of thought. It is a practice that grew up listening to four teachers in particular. They are named here, in their own words where possible, because the discipline cannot be honestly read without them.",
        },
        ...teacherList,
        { kind: "rule" },
        { kind: "subhead", text: "One more — from further back." },
        {
          kind: "para",
          text: "Lao Tzu is not in the constellation manifest. He predates the discipline by about 2,500 years and he did not run a podcast. But the *Tao Te Ching*'s twenty-second chapter is the oldest statement the practitioner knows of the principle that codetry practices: *Yield and overcome. Bend and be straight. Empty and be full. Wear out and be new. Have little and gain. Have much and be confused.* The way that names naming is not the eternal naming. That is not a paradox to escape — it is the first instruction. The name is always downstream of the thing. The discipline is keeping the name close enough to the thing that the distance between them is survivable.",
        },
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
      number: "4.2",
      partRoman: "G",
      partLabel: "Grounding",
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
            "Donald Knuth's WEB and CWEB; Org-mode Babel, Jupyter, R Markdown, and Quarto carry the practice today. Document is the source; code is woven from prose. The discipline closest to codetry in this lineage — and, on the reading §5.1 lands on, the discipline codetry sits one floor underneath rather than across the room from: literate programming verifies by exposing the reasoning, but the woven program only does what its prose says it does to the extent that the names inside the source carry the metaphor the prose claims, and holding those names is the move codetry is for.",
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
            "Eric Evans' *Domain-Driven Design* and the bounded-context, ubiquitous-language vocabulary it seeded. DDD's *ubiquitous language* is the closest single phrase in the prior literature to what codetry asks of a name: a word that has to live in the conversation, the whiteboard, and the code at once, with no translation step in between. §DD.3 already named DDD as a sibling discipline to codetry; this chapter names it as a *root*. The rename test of §3.2 is the same move DDD's bounded-context boundary already half-described — codetry's contribution is to make the test sharp at the level of the individual noun rather than the bounded context, and to apply it outside enterprise software, in community institutions where the *domain experts* are the people who live in the place.",
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
            "Fred Brooks' *No Silver Bullet — Essence and Accident in Software Engineering* drew the line codetry's whole verification standard rests on. Brooks distinguished between *essence* — the irreducible conceptual structure of the software — and *accident* — the parts that exist only because of the substrate. Codetry's claim that *the metaphor must be inspectable in the name itself* (§3.6) is a claim about *essence*: the name is not an accident of the substrate (a label, a string field, a UI affordance), it is part of the system's essential structure, and a discipline that does not protect it is leaving the load-bearing layer undefended. Brooks did not write about names. He drew the line that says names *can* belong to essence rather than accident, which is the line codetry walks across.",
        },
        { kind: "subhead", text: "Nielsen, heuristic #2 — *match between system and the real world* (1994)" },
        {
          kind: "para",
          text:
            "Jakob Nielsen's second usability heuristic: *the system should speak the users' language, with words, phrases, and concepts familiar to the user.* The HCI tradition has carried this rule for thirty years and it is the most under-cited root of codetry. Nielsen's framing is descriptive (a usability principle, evaluated heuristically); codetry's contribution is to make it constructive (a design discipline whose load-bearing test is the rename of §3.2) and to extend it from interface copy into the *system structure* the names enact. Heuristic #2 is what made the move legible to UX practitioners; codetry says the same move has architectural consequences the UX framing did not yet claim.",
        },
        { kind: "subhead", text: "Lakoff and Johnson — *Metaphors We Live By* (1980)" },
        {
          kind: "para",
          text:
            "George Lakoff and Mark Johnson's *Metaphors We Live By* is the philosophical root underneath the entire discipline. Their claim — that conceptual metaphor is not decorative language but the substrate of human cognition, and that the metaphors a community lives by shape what that community can think — is the claim codetry treats as a working assumption. The reason renaming *Buckets* to *Categories* lets the UI quietly suggest balances can grow by clicking (§3.2) is the Lakoff/Johnson claim playing out at software scale: the metaphor was structuring thought, the new word structures different thought, and the system shifts to match. Codetry is what the Lakoff/Johnson observation looks like once it is treated as a constraint on building, not just a description of speaking.",
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
            "*A constructive rename test for individual nouns.* Nielsen's heuristic #2 evaluates the match between system and real-world language descriptively. DDD's bounded-context boundary tests vocabulary at the context level. Codetry's §3.2 rename test is the same family of move, sharpened to the individual noun and made constructive: hold the rest of the system constant, swap the word, read what shifts. The test is small enough to fit on a workbench page and falsifiable enough to settle a disagreement at the kitchen table.",
            "*The discipline applied outside enterprise software.* DDD's *domain experts* are usually a product manager and three subject-matter specialists in a corporate setting. Codetry's *domain experts* are the people who live in the place — the fishing camp, the food co-op, the neighbourhood clinic — and the *ubiquitous language* is whatever they already say to each other before a software person enters the room. The discipline is the same; the room it is practised in is older and slower than the one DDD was written for.",
            "*Drift detection as a continuous practice, not a project phase.* Lakoff/Johnson observed that conceptual metaphor shifts under social pressure; codetry's §3.3 and §3.6 install that observation as a routine check — audit pages, build-time version checks, vocabulary sweeps run on a cadence. The closest prior practice is the GOV.UK / Mailchimp style-guide tradition; codetry extends the cadence into source code and version control so the metaphor and the system cannot disagree without something visibly breaking.",
            "*Verification by inspection of the name on the surface.* The XP system-metaphor practice, the literate-programming weave, and the Brooks essence/accident line each get to the edge of this claim without making it. Codetry makes it explicit: the verification standard is that a user reading the name on the button can predict what happens when they press it, because the metaphor the name carries is enacted by the system underneath. Verification lives in the place the user already looks. This is the move §3.6 names and the falsifier the rest of the practice is built around.",
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
      number: "4.3",
      partRoman: "G",
      partLabel: "Grounding",
      title: "The reading lineage — fiction",
      blocks: [
        {
          kind: "para",
          text:
            "The lineage chapter that just preceded this one named the *disciplines* codetry sits inside. This chapter names the *books* that trained the practitioner's own ear for the kind of pattern recognition codetry depends on. The two are separate inheritances. The disciplines name the moves; the books taught the listening that lets a practitioner notice when a move is needed in the field.",
        },
        {
          kind: "para",
          text:
            "*This chapter is not training data for an AI on a corpus. It is the reading list that trained one human mind to hear what codetry is for.* The distinction matters because the framing keeps drifting in conversations about contemporary writing — it is now common to read a list of influences as if its purpose were to ground a model in a tradition. The purpose here is older and smaller: to be honest about which authors taught the practitioner to recognise *load-bearing story* when it is in front of them, and to give a future reader of this handbook a way to walk the same path on foot if they choose. There is no claim that reading these books produces the discipline. There is only the claim that, for this practitioner, the discipline was unreachable without them.",
        },
        { kind: "subhead", text: "Why fiction first." },
        {
          kind: "para",
          text:
            "Codetry is a discipline about story being load-bearing — about names whose job is to carry the metaphor a community lives by, into the system that community runs on. The clearest place to learn what *load-bearing story* feels like is the place where story bears the most weight: a novel. Fiction is where a single chosen noun decides what is thinkable inside the world the reader enters; where renaming a thing renames the room around it; where a metaphor either holds the chapter together or quietly collapses it. Theory can describe those moves after the fact, and is useful when a practitioner needs to argue for the discipline at the policy table. But theory ossifies the diagnosis without teaching the ear. The practitioner who has only read theory can name *what kind of capture* a vocabulary is performing and cannot reliably notice the capture happening in the room they are standing in. The practitioner who has read the seven books named below has been trained, repeatedly and for a long time, in the muscle of *hearing the load-bearing word being swapped out before the swap is announced*. That muscle is what codetry asks for in the field. Fiction is where it is built.",
        },
        {
          kind: "para",
          text:
            "The seven works below are grouped into three clusters. Each cluster teaches something the books in it teach together that no single one of them teaches alone.",
        },
        { kind: "rule" },
        {
          kind: "subhead",
          text: "The language-is-the-cage cluster — *1984*, *Animal Farm*, *Brave New World*.",
        },
        {
          kind: "para",
          text:
            "These three are read here as one triangle. *1984* names the *fast capture* of a vocabulary — Newspeak as the deliberate, top-down compression of what can be said and therefore thought. *Animal Farm* names the *slow capture* — the painted commandments on the barn quietly rewritten in the night, where the drift is so gradual that no single reading catches it but the comparison across years is unanswerable. *Brave New World* names the *soft capture* — a vocabulary so comfortable that the cage is welcomed in and the question of whether one is inside it never arises. The triangle teaches that capture has at least three speeds and that a practitioner who is only watching for one will miss the other two; the rename test of §3.2 is sharp against fast capture, the drift detection of §3.3 is sharp against slow capture, and the protection of community vocabulary against generic professional English is the move sharpest against the third.",
        },
        { kind: "subhead", text: "*1984* — Orwell." },
        {
          kind: "para",
          text:
            "*1984* is the foundational text. Newspeak is the clearest fictional rendering ever made of a system in which a community's available vocabulary is engineered top-down so that whole moves of thought become unsayable, and over time, unthinkable. Orwell's appendix on the principles of Newspeak — written in the past tense, as if the language has already passed away — is the single passage in twentieth-century fiction that comes closest to a working specification of the discipline codetry is built to *resist*. The Party's project is not to ban dissenting thoughts; it is to remove the words the dissent would have to be assembled from.",
        },
        {
          kind: "para",
          text:
            "The diagnostic the book gave the practitioner is a method, not a mood. If Newspeak is the deliberate compression of a vocabulary so that load-bearing thought becomes impossible, then the rename test of §3.2 is the same operation run in reverse: hold the system constant, swap the noun, and read what becomes thinkable that was not thinkable a moment ago. The test surfaces the words a system is quietly relying on by removing them and watching what the system can no longer say. Orwell built the negative case at civilisational scale; codetry runs the positive version at the scale of a single button on a single screen, on the working assumption that a community whose buttons keep their words has not yet had its Newspeak written for it.",
        },
        {
          kind: "para",
          text:
            "*The rename test is Newspeak run in reverse: instead of removing a word so a thought becomes unsayable, remove it so the system tells us which thought it was quietly carrying.*",
        },
        { kind: "subhead", text: "*Animal Farm* — Orwell." },
        {
          kind: "para",
          text:
            "*Animal Farm* is the slow companion to *1984*. Where Newspeak compresses overnight, the painted commandments on the barn wall change a syllable at a time, between visits, while everyone is busy with the harvest. *All animals are equal* becomes *all animals are equal, but some animals are more equal than others* and no one in the barn quite remembers when. The book is a manual in the *cadence* of vocabulary drift: the words on the wall are not policed in the moment they shift; they are policed by the comparison between this season's reading and last season's, by the practitioner who keeps a record and notices the syllable that was added.",
        },
        {
          kind: "para",
          text:
            "This is exactly the drift codetry §3.3 is built to hedge against, and the worked examples it gives are the *Animal Farm* shape: a benefit form's category label *household* quietly becoming *qualifying household*; a savings envelope quietly being called *reserve* in the next sprint; a *neighbour* quietly becoming a *resident* on the third revision of the document. None of these are Newspeak; all of them are the painted-commandment move. The audit page, the build-time vocabulary check, the version-controlled glossary — these are the practitioner's equivalent of standing in the barn at night with a lantern and reading the wall against a written copy held in the pocket. The book's quiet horror is the threat profile codetry's drift practices are calibrated to.",
        },
        {
          kind: "para",
          text:
            "*If the only check on the wall is the wall, the wall has been rewritten by morning. The discipline is the lantern and the copy in the pocket.*",
        },
        { kind: "subhead", text: "*Brave New World* — Huxley." },
        {
          kind: "para",
          text:
            "*Brave New World* is the third side of the triangle and the most quietly damaging of the three. Huxley's World State does not compress vocabulary by force or rewrite the wall at night; it makes the existing vocabulary *comfortable*, conditioned, soothing. *Soma*, *the feelies*, *community-identity-stability* — the words land easily, they sound forward-looking, they belong to a register that no one in the world wants to argue against because to argue against them would be to argue against feeling well. The capture is soft. The cage has cushions.",
        },
        {
          kind: "para",
          text:
            "This is the strongest critique fiction has yet produced of the kind of *generic professional vocabulary* that has come to dominate the rooms codetry works in: *sustainability*, *engagement*, *impact*, *resilience*, *empowerment*, *innovation*. The words are not malevolent and they are not, in any single instance, deceptive. They are comfortable. They register as forward-looking. They flatten the specific, place-rooted noun the community already had into a generic that the funder, the regulator, and the consultant all recognise — and the cost of the flattening is invisible because nothing in the room sounds wrong. Huxley's contribution to the practitioner's ear is the alarm that *nothing sounding wrong* is itself a diagnostic, often the most important one. The room that is too easy to talk in has usually had a vocabulary slipped under it.",
        },
        {
          kind: "para",
          text:
            "*When no word in the meeting room registers as wrong, the meeting room has been carpeted in a vocabulary the people in it did not write. Listen for the specific noun the carpeting replaced.*",
        },
        { kind: "rule" },
        {
          kind: "subhead",
          text: "The method-must-survive-the-person cluster — *Lord of the Flies*, *Ishmael*.",
        },
        {
          kind: "para",
          text:
            "These two are the books that taught the practitioner that a discipline's life is decided by whether it can be handed off, not by whether it can be performed. *Lord of the Flies* is the book of what handover failure looks like at close range; *Ishmael* is the book of what a discipline that has survived handover for thousands of generations looks like, and the closest single literary ancestor to the *Practitioner* role this handbook is named for. Together they teach that the question every codetry practitioner is eventually asked — *who carries this when you stop* — is the question that decides whether the discipline ever existed.",
        },
        { kind: "subhead", text: "*Lord of the Flies* — Golding." },
        {
          kind: "para",
          text:
            "The conch on Ralph's beach is the cleanest worked example in twentieth-century fiction of a *load-bearing noun*. The shell is a physical object; it is also a rule; it is also a posture. Whoever holds it speaks. The boys who agree to the conch agree to one another; the boys who shatter the conch shatter the agreement. The book's whole argument turns on a single named object that the community has invested with the discipline of taking turns. When the conch shatters in the final chapters, the discipline does not slowly degrade — it is gone in the same instant. That is the *Saltbox Principle* of §1.3 played out in the worst case: a method whose load is held by a single fragile noun, and a method that goes when the noun goes.",
        },
        {
          kind: "para",
          text:
            "The book is also, read at field strength, the cleanest possible illustration of why the *Practitioner* role of this handbook is defined the way it is. The Practitioner's job is *handover* — the deliberate practice of arranging the discipline so that no single person, no single shell, no single founder, holds the load alone. A Practitioner role that ends with the Practitioner is the conch on the rock. The whole architecture of §5 — the wisdom keepers, the inspector standing, the seven-generation horizon — is the corpus's answer to the Golding question: *what arrangement of names and people would mean that the conch is replaceable before it shatters?*",
        },
        {
          kind: "para",
          text:
            "*If the conch shatters, the method shatters with it; this is why the Practitioner's whole job is handover.*",
        },
        { kind: "subhead", text: "*Ishmael* — Quinn." },
        {
          kind: "para",
          text:
            "*Ishmael* is the cleanest single literary influence on codetry's posture. Quinn's *Leavers and Takers* framing — the long line of cultures that left the world running on its own terms versus the short, recent culture that takes the world apart and runs it on rewritten terms — is the lineage codetry's *Practitioner* role inherits from. The Leavers are not romanticised in the book; they are presented as people whose discipline is *to remember the older arrangement long enough to keep the option open* of returning to it. That is the posture codetry asks of the practitioner. The handbook's *Standby* primitive in the constellation manifest is, read honestly, a Leaver-shaped institution: the always-on shelf that keeps the older arrangement available against the day the newer one fails.",
        },
        {
          kind: "para",
          text:
            "Quinn's *Mother Culture* — the voice that whispers the Taker premises into the room before any conscious thought is spoken — is the other contribution. Codetry's *massity* names the same thing one floor closer to the working surface: the legacy-world dialect that arrives in the room without being invited and substitutes its nouns for the local ones unless the practitioner is listening. The *Gate* primitive in the constellation is the practitioner's working answer to Mother Culture in real time: a passage that lets the legacy-world vocabulary cross when it must, but logs the substitution so the original noun is never silently lost.",
        },
        {
          kind: "para",
          text:
            "*Quinn's Leavers are the lineage ancestor of the Practitioner role; Mother Culture is the older name for what codetry calls massity, and the Gate is the practitioner's answer to it.*",
        },
        { kind: "rule" },
        {
          kind: "subhead",
          text: "The perception-is-the-substrate cluster — *The Doors of Perception*, *Blueprints of the Afterlife*.",
        },
        {
          kind: "para",
          text:
            "The third cluster is the one that keeps the discipline humble. The first two clusters establish that names hold load and that methods must outlive their carriers. This cluster establishes the prior condition the other two depend on — that *what a person can register as real is decided by the vocabulary already inside their head before they look* — and the matched humility that no naming discipline survives every kind of break. Together the two works teach: name carefully, *and* know what naming cannot save.",
        },
        { kind: "subhead", text: "*The Doors of Perception* — Huxley." },
        {
          kind: "para",
          text:
            "Huxley's book-length essay on perception names the *reducing valve*: the thesis that ordinary consciousness is not a window onto the world but a narrow filter that admits only the slice of reality the organism needs to act. The valve is constructed largely out of language — the categories, names, and habits the mind has internalised over a lifetime decide which signals are admitted as *real* and which are dismissed as noise before any conscious processing happens. What the practitioner takes from this is not the chemistry of the essay but its model: *the names a community lives inside decide what the community can register as real*. Rename a thing and you have widened or narrowed the valve for everyone who passes through it. This is why the rename test of §3.2 has the consequences it has — because the noun on the button is also, at substrate level, deciding what the user is *able to see* about the system the button sits on.",
        },
        {
          kind: "para",
          text:
            "Huxley is filed alongside *Brave New World* by the rest of his readership, and that filing is correct, but the *Doors* essay is the deeper of the two for codetry's purposes. *Brave New World* warned about the comfort of a captured vocabulary; *The Doors of Perception* explained the mechanism by which the capture happens — that vocabulary is not decorative on top of perception, it is upstream of it. The handbook treats the essay, not the novel, as the load-bearing Huxley contribution to the practitioner's ear, which is why both works are listed and the essay sits in this cluster rather than the first.",
        },
        {
          kind: "para",
          text:
            "*The names a community lives inside decide what that community can register as real; widen or narrow the valve, and you have widened or narrowed what is visible from inside the room.*",
        },
        { kind: "subhead", text: "*Blueprints of the Afterlife* — Boudinot." },
        {
          kind: "para",
          text:
            "Boudinot's novel sits at the end of the cluster as the humility check against everything the other six have just argued. The book is set after a civilisational discontinuity so total that the names from the world before survive only as half-remembered fragments inside characters who can no longer reliably tell their own memories from another's; one of its central characters is hired to clone the cathedrals of a ruined coast, full-scale, knowing the cathedrals' meanings have not survived to be cloned along with them. The book is unsentimental about the limits of what naming can preserve when the substrate the names lived in is gone. A discipline that has been told over and over that names hold load needs, at intervals, to read a book that takes the same claim and asks honestly *what kind of break the names cannot carry across*, and to sit with the answer.",
        },
        {
          kind: "para",
          text:
            "The contribution to the practitioner's ear is calibrating. Codetry is a discipline for the long, slow, *continuous* horizon — the horizon in which the conch can be passed and the wall can be re-read. It is not a discipline that promises to save anything across a discontinuity. The seven-generation framing of §5 is itself a humility: it is the longest horizon the practice claims competence over, not the longest horizon the world will run on. *Blueprints* is the book the practitioner reads when the temptation arrives to claim the discipline is more than that.",
        },
        {
          kind: "para",
          text:
            "*Name carefully for the continuous horizon; do not pretend a name will carry across a break the substrate did not survive.*",
        },
        { kind: "rule" },
        { kind: "subhead", text: "Why nonfiction is a separate chapter." },
        {
          kind: "para",
          text:
            "The nonfiction reading lineage is drafted as its own chapter at §4.4. The separation is deliberate, not editorial. Fiction trained the *ear* — the muscle for hearing load-bearing language as it is being spoken; nonfiction sharpened the *vocabulary* — the precision that lets the practitioner name the move once it has been heard. Conflating the two would flatten both contributions: it would let the nonfiction works look like they had taught a listening they did not teach, and it would let the fiction works look like reference material rather than the long, slow training the chapter above is honest about. The companion chapter is owed to the reader and §4.4 pays that debt with the same care.",
        },
        { kind: "subhead", text: "Falsifier for the reading-lineage claim." },
        {
          kind: "para",
          text:
            "The chapter above makes a strong claim: that the seven works listed taught the practitioner to *hear* what codetry depends on, and that the practitioner who has not read them — but has read theory and practice notes — would not reliably hear the same thing. The claim is falsifiable. *If a reader who has never read any of these books, asked to walk the rename test of §3.2 across a real constellation of named systems, produces verdicts indistinguishable from the verdicts of a reader who has read all seven, the chapter's claim fails.* The claim survives only as long as the trained ear is detectably better than the untrained one in the field. The practitioner who finds the counter-example is owed the credit and this chapter owes them the rewrite. Until then, the seven works above are the smallest reading list this handbook is willing to claim trained the discipline.",
        },
      ],
    },
    {
      id: "5-4",
      number: "4.4",
      partRoman: "G",
      partLabel: "Grounding",
      title: "The reading lineage — nonfiction",
      blocks: [
        {
          kind: "para",
          text:
            "The chapter that just preceded this one named the books that trained the practitioner's ear for load-bearing language. This chapter names the books that sharpened the practitioner's vocabulary once that ear was already listening. The two are not redundant. The fiction works above taught the muscle of *hearing the swap* as it is being made; the nonfiction works below taught the precision of *naming the move once it has been heard*. A practitioner with the ear and no vocabulary registers that something is wrong in the room and cannot say what; a practitioner with the vocabulary and no ear can name a move that was never made. The discipline asks for both, and the two reading lineages are kept separate so neither flattens the contribution of the other.",
        },
        {
          kind: "para",
          text:
            "*This chapter, like the one above, is not training data for an AI on a corpus. It is the reading list that gave one human practitioner the precise nouns for the moves the fiction works had taught the ear to notice.* The framing keeps drifting in conversations about contemporary nonfiction — an *influences* list is now read as if its purpose were to show which traditions the practitioner had been trained to perform. The purpose here is older and more specific. These works are named because they are the rocks the practitioner could not skip in the stream — small, flat, locally precise volumes that lodged on the shelf because each one supplied a noun the practice could not have functioned without. There is no claim that reading them produces the discipline. There is only the claim that, for this practitioner, the precise vocabulary of the discipline was unreachable without them.",
        },
        { kind: "subhead", text: "Why nonfiction next." },
        {
          kind: "para",
          text:
            "Fiction is where load-bearing language is most easily *heard*; nonfiction is where load-bearing language is most patiently *named*. The practical-skills literature in particular — the field guides, the lifespan textbooks, the trust treatises, the habit manuals, the recreation-programming texts, the working herbals — is the literature that has done the unglamorous work of putting the right noun on the right move and defending it against drift, decade after decade. It is the corpus codetry's vocabulary inherits from. Where the fiction lineage trained the practitioner to flinch at the word that does not belong, the nonfiction lineage supplied the words that do. The two together are what makes the rename test of §3.2 possible at all: the ear catches the substitution; the vocabulary names what was substituted out. A practitioner with only one half of this inheritance cannot run the test to completion.",
        },
        {
          kind: "para",
          text:
            "The shelf below is grouped into three clusters. Each cluster names a kind of vocabulary the practice depends on: the discipline of the self, the substrate of the community, and the grounding of the land and the body. The grouping is the practitioner's, not the literature's — these are the rocks that lodged in the order they lodged, and the clusters describe what the rocks turned out to be doing once the shelf was full. Through-line: each entry below was an *early or ongoing reading* that supplied the protective instinct and the threat vocabulary the practitioner was eventually going to need to defend the noun on a button — and without which codetry would not have been possible to write down.",
        },
        { kind: "rule" },
        {
          kind: "subhead",
          text:
            "The self-is-the-first-protocol cluster — *Atomic Habits*, *The 7 Habits of Highly Effective People*, *How to Win Friends and Influence People*.",
        },
        {
          kind: "para",
          text:
            "These three sit together as the practitioner-development triangle. *Atomic Habits* names the *compound layer* — the small repeated act that decides what kind of system the practitioner becomes over years. *The 7 Habits of Highly Effective People* names the *principle layer* — the constant the practitioner aligns the day to before the day's first decision is made. *How to Win Friends and Influence People* names the *relational layer* — the discipline of bringing other people into shared work without manipulation, leverage, or the friendlier varieties of control. The triangle teaches that the practitioner is the first system the discipline has to operate on, and that a discipline whose practitioner has not done this work has nowhere to stand. The constellation manifest's *Practitioner* role is the institution-level version of what these three books work out at the personal level: a role whose habits, principles, and relations are themselves the load-bearing infrastructure the discipline runs on.",
        },
        { kind: "subhead", text: "*Atomic Habits* — Clear." },
        {
          kind: "para",
          text:
            "Clear's central claim is that systems beat goals — that the small repeated act, run thousands of times, builds the person; the dramatic resolution at the start of the year does not. The book gives the practitioner the vocabulary to name *the compound* — the slow, daily layering that decides what kind of practitioner is in the room a decade from now, not what kind of practitioner intends to be there. The cure-time argument of §3.3 (that a renamed system takes weeks of conversation to settle into the team's mouths) is the same shape one floor up: codetry is itself an atomic-habits discipline, applied to a community's nouns rather than to a person's daily practice, and it is run in the compound register or it does not run.",
        },
        {
          kind: "para",
          text:
            "What the book gave the practitioner that nothing else had was the *unflattering precision* of the time horizon. The dystopia codetry resists is rarely built by a single deliberate act of vocabulary capture; more often it is built by the unwatched accumulation of small misalignments the practitioner did not name early enough — a generic *user* swapped in for *neighbour* on one screen, then on a second, then on the form, until the system the community runs is not a system the community recognises. *Atomic Habits* taught the practitioner to read the small misalignment as if it were the dystopia in compound form, because in the time horizons codetry cares about, it is.",
        },
        {
          kind: "para",
          text:
            "*Habits are sovereign code: the small repeated act either authors the practitioner or the legacy-world authors them in its place.*",
        },
        { kind: "subhead", text: "*The 7 Habits of Highly Effective People* — Covey." },
        {
          kind: "para",
          text:
            "Covey's contribution is the *principle-centred* frame — the move of locating the practitioner's reliable ground inside the practitioner rather than inside the platform, the role, the funder, or the latest method. The book's central language — *be proactive*, *begin with the end in mind*, *put first things first*, *think win-win* — supplies the vocabulary for a posture that does not depend on conditions outside the practitioner's control to remain stable. That posture is the one the constellation's *Practitioner* role inherits and the one §5.3's wisdom-keeper standing presupposes: a person whose principles are upstream of the platform, not downstream of it.",
        },
        {
          kind: "para",
          text:
            "The book also names, in plain language, the failure mode codetry's discourse most often falls into when its principles are not yet settled. *Reactive dependence* — Covey's term — is the disposition that lets the loudest dialect in the room set the practitioner's vocabulary by default. The practitioner who has not done the principle-centred work will arrive at the policy table speaking the funder's *engagement*, the regulator's *compliance*, the consultant's *innovation*, because nothing inside the practitioner is holding a different word steady against the room's gravitational pull. Covey is the book that supplied the vocabulary for what that failure is, before the rename test of §3.2 supplied the operation that catches it.",
        },
        {
          kind: "para",
          text:
            "*Principles are upstream of platforms; the practitioner whose principles drift with the platform has no name to hold a button to.*",
        },
        { kind: "subhead", text: "*How to Win Friends and Influence People* — Carnegie." },
        {
          kind: "para",
          text:
            "Carnegie's book is the oldest in this cluster and is the one most often misread. The title sounds like a manual for manipulation; the contents are nearly the opposite — a long, patient training in the discipline of being genuinely interested in the other person, of remembering the name, of listening for the thing the other person is actually trying to say rather than for the cue to begin one's own next sentence. What Carnegie taught the practitioner to name is *influence without coercion*: the move of bringing another person into shared work through earned attention rather than through pressure, leverage, or any of the friendlier varieties of control.",
        },
        {
          kind: "para",
          text:
            "The book matters to codetry because the discipline's most demanding rooms are not technical rooms; they are rooms where the practitioner is asking a community to keep its own noun on a button instead of accepting the funder's or the platform's substitution. The room responds to the practitioner the way it responds to any person asking it to do something it is not yet sure it wants to do, and the question the practitioner has to be ready to answer is whether they are present in the room as someone the room has reason to trust, or as someone running a method on the room. Carnegie supplied the vocabulary for the difference. The practitioner who has not done this work will sound, however gently, like a method; the practitioner who has will sound like a person, and the room will give them the noun.",
        },
        {
          kind: "para",
          text:
            "*Influence without coercion is the only kind of influence the discipline is allowed to use; anything else is the substitution it claims to refuse.*",
        },
        { kind: "rule" },
        {
          kind: "subhead",
          text:
            "The community-is-the-substrate cluster — *Health Promotion Strategies Through the Lifespan*, *Teach Your Children Well*, *The 10 Laws of Trust*, *Recreation Programming: Designing Leisure Experiences*.",
        },
        {
          kind: "para",
          text:
            "These four are the books that taught the practitioner that the substrate the discipline runs on is not the codebase, the platform, or the institution; it is the community of actual people across actual generations whose lives the system touches. *Health Promotion Strategies Through the Lifespan* names the longest of those time horizons — the human life as the design constraint the practice answers to. *Teach Your Children Well* names the handover horizon — what the next generation inherits from the system the current one builds. *The 10 Laws of Trust* names the present-tense substrate — the trust between people in real time, without which no protocol survives the first hard decision. *Recreation Programming: Designing Leisure Experiences* names the substrate's working conditions — the deliberate craft of designing the in-person experience the trust is built and rebuilt inside. The cluster teaches together that codetry's load is held by a community, that the community is multi-generational, and that the discipline's job is to keep the substrate readable to the people standing on it.",
        },
        { kind: "subhead", text: "*Health Promotion Strategies Through the Lifespan* — Murray & Zentner." },
        {
          kind: "para",
          text:
            "Murray and Zentner's textbook does what no shorter framing of public health does: it walks the reader through the entire arc of a human life — infancy, childhood, adolescence, young adulthood, middle adulthood, late adulthood, the dying — and names the developmental tasks, the threats, and the community supports that belong to each stage. What the book gave the practitioner was the vocabulary for *lifespan as a design constraint*. A system designed for one stage of life — the system whose default user is a working-age adult on a smartphone, for instance — has quietly excluded six other stages and has called the exclusion *targeting*. The textbook supplies the noun for the missing stages so the system's quietness about them becomes audible.",
        },
        {
          kind: "para",
          text:
            "The book also names the cumulative shape of *disconnection* — from body, from seasons, from community — as a public-health threat in itself, not as a side effect of other threats. That framing is the one codetry's protection of community vocabulary inherits from. The funder-friendly noun (*engagement*) is comfortable in part because the more honest noun (*reconnection*) names a longer arc and a deeper deficit; the textbook's vocabulary is the longer arc made unmissable. The constellation manifest's insistence on *Standby* and *Gate* primitives — institutions that hold the older arrangement available across the lifespan of the people using them — is the textbook's claim restated at the architecture level.",
        },
        {
          kind: "para",
          text:
            "*Lifespan is the ultimate design constraint; the system that defaults to one stage has silently exiled the other six.*",
        },
        { kind: "subhead", text: "*Teach Your Children Well* — Levine." },
        {
          kind: "para",
          text:
            "Levine's book is the shortest and clearest case in the practical-parenting literature for the proposition that the next generation inherits the *system* it grew up inside, not the *intentions* the current generation had for it. The argument against over-protection and performance culture is, at root, an argument for letting children develop the competence, struggle-tolerance, and real-world skill that an antifragile adult needs — and the argument is made in the precise vocabulary of *what is being taken from the child by the well-meant substitution*. The substitution itself is well-meant; the child loses the noun the substitution replaced.",
        },
        {
          kind: "para",
          text:
            "This is the §1.0 hedge stated at the family scale: a generation can lose a vocabulary of competence by having it kindly replaced with the appearance of competence over the course of a single childhood, and the loss does not announce itself because nothing in the child's environment sounds wrong. The handbook's commitment to handover — to a Practitioner role whose whole job is to leave the discipline behind it for the next person to use — is the same commitment Levine names at the developmental scale. The discipline that does not raise its successors antifragile has not handed the discipline over; it has handed over the appearance of it.",
        },
        {
          kind: "para",
          text:
            "*Raising antifragile humans is the generational-scale rename test: the kind substitution that takes the noun the child needed.*",
        },
        { kind: "subhead", text: "*The 10 Laws of Trust* — Peterson." },
        {
          kind: "para",
          text:
            "Peterson's book names the architecture trust actually has — that high-trust environments are not the result of personality or culture in the loose sense; they are the result of specific, repeated, demonstrable behaviours arranged into a small number of *laws* the participants have internalised. What the book gave the practitioner was the vocabulary for *trust as a protocol* — a thing with a structure, a thing that can be specified, audited, and rebuilt, not a thing that has to be hoped for. That framing is the one codetry's insistence on *readable, ownable, forkable* tools depends on: the readability is what makes the trust verifiable; the ownership is what gives the community the authority to demand the verification; the forkability is the always-available exit that makes the trust voluntary rather than captive.",
        },
        {
          kind: "para",
          text:
            "The book also names the failure mode the rest of the trust literature is too polite about. Low-trust systems do not stay low-trust; they convert the missing trust into *control*. The control then has to be paid for — in surveillance, in compliance overhead, in the friction of every transaction that a high-trust environment would have settled in a sentence. Codetry's whole bet against the technocratic capture §5.1 and §5.2 keep open is the bet that a community whose nouns it can read is a community whose protocol is a trust protocol rather than a control protocol; Peterson is the book that supplied the vocabulary for what is at stake in losing that distinction.",
        },
        {
          kind: "para",
          text:
            "*Trust is a protocol, not a feeling; when the protocol fails, control fills the space, and the community pays for the control with everything it had in surplus.*",
        },
        { kind: "subhead", text: "*Recreation Programming: Designing Leisure Experiences* — Rossman & Schlatter." },
        {
          kind: "para",
          text:
            "Rossman and Schlatter's textbook is, on the surface, a practical guide for community recreation professionals on how to design and run leisure experiences — youth nights, festivals, drop-ins, programs. What the book gave the practitioner was the vocabulary for *deliberate group flow* — the recognition that the in-person, embodied, shared experience is itself a designed thing, with components and stages and craft, and that the trust and culture a community runs on are built and rebuilt inside those experiences far more than inside any of its formal institutions. The textbook supplies the nouns for the components — interaction, experience, animation, debrief — so the practice of designing them stops being inherited as instinct and starts being inherited as discipline.",
        },
        {
          kind: "para",
          text:
            "The book is in this cluster because it names the *working conditions* the trust of the previous entry is built under. *The 10 Laws of Trust* explains why a high-trust community runs on a protocol; *Recreation Programming* explains where the protocol gets practised. In an environment where most of the public's communal life has been displaced onto isolated screens, the textbook's claim — that the in-person group experience is a designable, defendable, non-substitutable cultural good — is a load-bearing one. Codetry's commitment to leave room for the campfire, not just the cursor — to refuse to design any system that quietly displaces the community's in-person practice — inherits from this book the vocabulary for what is being displaced.",
        },
        {
          kind: "para",
          text:
            "*Leisure is the cultural immune response; a community that has lost the discipline of its own in-person experience has lost the room the trust protocol gets practised in.*",
        },
        { kind: "rule" },
        {
          kind: "subhead",
          text:
            "The land-and-the-body-are-the-base cluster — *Ancient Remedies Revived*, *Laws of Life*, the works of Thomas J. Elpel, the practical field guides.",
        },
        {
          kind: "para",
          text:
            "These four entries are the base layer of the shelf and the base layer of the practice. *Ancient Remedies Revived* names the body's inheritance — the plant, animal, and seasonal knowledge that older communities held as a working literacy and that industrial systems quietly relocated into specialist domains. *Laws of Life* names the refusal — the practitioner's stance of declining the legacy-world's offered dependencies and rebuilding the working capability outside them. *Botany in a Day* and the rest of the Elpel corpus name the *pattern recognition* — the discipline of reading the land as a system whose own grammar repeats across scales, the way codetry asks the practitioner to read named software. The practical field guides — foraging, fishing, crafts, cooking, gardening, community development — name the *embodied competence* the rest of the cluster defends. Together the four teach that codetry's discipline does not float above the substrate it claims to serve. It begins where the practitioner's hands and the place they stand in begin, or it begins nowhere.",
        },
        { kind: "subhead", text: "*Ancient Remedies Revived* — Greef & Willow." },
        {
          kind: "para",
          text:
            "Greef and Willow's book is in the lineage of the working herbal — a record of plant remedies, food medicines, and seasonal practices that older communities held as ordinary household literacy and that industrial medicine quietly relocated into the consultancy of pharmacists, physicians, and packaged-product manufacturers. What the book gave the practitioner was the vocabulary for *the body's literacy* — the recognition that the knowledge of one's plants, one's seasons, and one's household remedies is a *language*, not a hobby, and that its loss is a vocabulary loss in the technical sense the rest of the handbook uses that phrase.",
        },
        {
          kind: "para",
          text:
            "This is §1.0's drift hazard stated at the bodily scale. A community that no longer knows the names of its medicines has not chosen to forget; it has had the names slipped under it by the same generic-professional vocabulary that does the work in every other domain — *wellness*, *self-care*, *natural products*. The book's contribution to the practitioner's vocabulary is the older noun. The constellation manifest's insistence that the community's working language survive the platform that runs on top of it is the same insistence Greef and Willow make at the kitchen scale: the named remedy is what the household runs on, and the household that has lost it has lost the protocol the lifespan textbook above is calibrated to.",
        },
        {
          kind: "para",
          text:
            "*Remedies are resistance: the body's vocabulary is the first vocabulary the legacy-world replaces, and the last one the discipline gets back.*",
        },
        { kind: "subhead", text: "*Laws of Life: Ditch the System, Design Your Life* — Spirko." },
        {
          kind: "para",
          text:
            "Spirko's book is the most practical and the least patient of the cluster, and that is its contribution. The book is straight talk — no fluff, no theoretical apparatus — on building real, working capability outside the systems most people are expected to depend on: food, energy, money, communication, learning, security. What it gave the practitioner was the vocabulary for *the refusal* — the disposition of declining the legacy-world's offered dependencies not as a posture or an ideology but as a working practice with concrete steps, materials, and skills that have to be built before they are needed.",
        },
        {
          kind: "para",
          text:
            "The book matters to codetry's pioneer-toned register because it names the difference between *opting out* (a stance the practitioner takes that requires nothing further from them) and *building out* (a long, embodied practice that requires the practitioner to acquire the skills the dependency was hiding). The discipline asks for the second, not the first. The constellation's *Standby* primitive — the always-on shelf that keeps the older arrangement available — is the institution-level version of Spirko's claim at the household level: the alternative arrangement only exists if it has been built and is in working order before the moment the dependency fails.",
        },
        {
          kind: "para",
          text:
            "*Ditch the system, design the life — the refusal is a practice with materials, not a posture with vocabulary.*",
        },
        { kind: "subhead", text: "*Botany in a Day*, *Participating in Nature*, and related works — Elpel." },
        {
          kind: "para",
          text:
            "Elpel's corpus is the closest single body of work in the practical literature to what codetry asks of a practitioner. *Botany in a Day* teaches plant identification not by memorising species but by reading *families* — by learning the small number of structural patterns that, once recognised, let the practitioner read a plant they have never seen before and know what kind of thing it is. *Participating in Nature* extends the same posture to the whole landscape: the river, the hillside, the meadow are read as a system whose grammar is repeating at multiple scales, and the practitioner's job is to learn the grammar so the next encounter with an unfamiliar instance is an act of recognition rather than an act of looking-up.",
        },
        {
          kind: "para",
          text:
            "This is the deepest single contribution of the cluster to codetry. The discipline asks the practitioner to read a system's nouns the way Elpel asks the reader to read a meadow: not as a list of items but as a small number of structural patterns whose recognition lets an unfamiliar instance be read on first sight. The rename test of §3.2 is the same operation in software. The pattern-recognition discipline §5.1 names — the practitioner who can tell load-bearing from decorative — is the same practitioner Elpel has been training in the meadow. The book's quiet claim, that nature is itself the first literate text and that learning to read it is a transferable literacy, is the claim codetry is making about software at one floor up.",
        },
        {
          kind: "para",
          text:
            "*Nature is the first literate programming; the practitioner who can read a meadow's grammar can read a system's, and the discipline depends on the transfer.*",
        },
        { kind: "subhead", text: "*The practical field guides* — foraging, fishing, crafts, cooking, gardening, community development." },
        {
          kind: "para",
          text:
            "This entry is categorical, not titular. It names the layer of the shelf the practitioner could not stop adding to: the small, locally precise volume on how to clean a fish, how to identify the edible shelf-fungus, how to lay a stone wall, how to make the bread, how to start the seedling, how to run the community kitchen. The works are individually unglamorous and collectively load-bearing. What they gave the practitioner was the vocabulary for *embodied competence* — the recognition that the person who can do the thing with their hands is not the same person as the one who has read about the thing, and that no quantity of the second turns into the first.",
        },
        {
          kind: "para",
          text:
            "This is the cluster's argument made literal. Codetry's pioneer-toned register is the register of a practice whose practitioner is expected to be able to *make things*, not only to think about making them. The constellation manifest's whole bet — that a community runs on the names it can author — is impossible to keep without practitioners who themselves know the difference between the named act and the performed one, and the field guides are the literature that taught the practitioner that difference. A discipline whose practitioners have not done embodied work tends to drift, slowly and politely, toward systems that talk competently about a world none of their authors are still in. The shelf of practical guides is the standing refusal of that drift.",
        },
        {
          kind: "para",
          text:
            "*Skill is the root of sovereignty; the discipline whose practitioners cannot make things by hand will, in time, design systems for a world none of them still inhabit.*",
        },
        { kind: "rule" },
        { kind: "subhead", text: "Falsifier for the reading-lineage claim." },
        {
          kind: "para",
          text:
            "The chapter above makes a strong claim: that the eleven entries on this shelf taught the practitioner the precise vocabulary the rename test of §3.2 needs in the field, and that the practitioner who has read the seven fiction works of §4.3 but none of the practical-skills, lifespan, trust, recreation, herbal, refusal, or Elpel-style pattern-reading work above would catch the *substitution* but would not reliably *name* what was substituted out. The claim is falsifiable. *If a reader who has built the ear from the fiction lineage but has done none of the nonfiction shelf above is shown to produce diagnoses indistinguishable in precision from a reader who has done all of it, the chapter's claim fails.* The claim survives only as long as the trained vocabulary is detectably more precise than the untrained one in the field. The practitioner who finds the counter-example is owed the credit and this chapter owes them the rewrite. Until then, the shelf above is the smallest nonfiction reading list this handbook is willing to claim sharpened the discipline.",
        },
      ],
    },
  ],
};

const partVI: Part = {
  roman: "V",
  title: "Open Questions",
  blurb:
    "A handbook needs a place where the questions live before they have answers. The chapters in this part are written to be returned to. Each one names a thing the discipline is being asked that the discipline has not yet finished thinking through.",
  chapters: [
    {
      id: "6-1",
      number: "5.1",
      partRoman: "V",
      partLabel: "V · Open Questions",
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
            "Tokenisation is the most aggressive *translate the noun* operation that exists. It is sharper than the boundary translations of §DD.3 and stricter than the type-level abstractions of §DD.4 because it operates *below the word*. *Saltbox* becomes `[\"Salt\", \"box\"]`. *Headwaters* may become `[\"Head\", \"waters\"]` or `[\"He\", \"ad\", \"waters\"]` depending on what the tokeniser learned. *Watershed* fragments. *Codetry*, being a coined word, fragments hardest of all. The load-bearing weight of a noun-as-noun does not survive the token layer. To the model reading the code, the word is no longer a word.",
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
            "Two places, both worth naming early. The first is the rename test of §3.2. To a human, *Saltbox* → *HouseholdContainer* surfaces drift in one beat — the metaphor dies on contact. To a tokeniser, the rename is one token cluster swapped for another; the model will happily continue with whatever the new cluster's neighbourhood predicts. The discipline's enforcement mechanism does not survive at the token layer. This is the §DD.4 problem one floor down: drift the tokeniser cannot see. The second is corpus-dependence. The back-door survival described above holds only as long as the training corpus retains enough metaphor-respectful code to keep the statistical pattern alive. If the corpus drifts toward generic naming — through autoformatters that strip metaphor, AI-generated boilerplate that defaults to the average word, or *clean code* conventions that punish poetry — the back door narrows. Codetry's machine-readability is, at present, an ecosystem position rather than a self-sufficient property.",
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
            "There is a move waiting in this chapter the rest of the handbook has been polite about. §DD.2 frames literate programming as the nearest sibling discipline, and §4.2 places it in the lineage codetry honours its work from — both framings are true, and both are too generous to codetry's modesty about its own role. Codetry is, in the harder sense, *foundational* to successful literate programming: not a sibling, but a precondition. Knuth's discipline weaves prose and source into a single document so the reader can follow the reasoning in the medium where the work actually lives — but the woven program only does what its prose says it does to the extent that the *names* inside the source carry the metaphor the prose claims they carry. Without the codetry move, the prose narrates one architecture and the names enact another, and *literate programming* degrades into prose *about* code that has already drifted away from the prose. The rename test of §3.2 is what makes the weave hold; without it, the document is honest about its reasoning and dishonest about its execution at the same time, and the discipline that was supposed to verify by exposing the reasoning ends up exposing reasoning the code no longer obeys.",
        },
        {
          kind: "subhead",
          text: "Name is the layer between type and token.",
        },
        {
          kind: "para",
          text:
            "It is worth being precise about where the discipline actually stands. *Type* lives in the compiler — the layer §DD.4 already names — and is enforced by a machine that does not read English. *Token* lives in the model, the layer this chapter has been circling, and is enforced by a tokeniser that does not read meaning. *Name* sits in the space between them, and is the only layer in the stack where a human author is still the deciding party: the compiler will check what the name is *of*, the tokeniser will fragment what the name is *spelled like*, and only the author chooses what the name *is*. If name is treated as decoration on top of type — as the type system's pet, renameable on a whim because the type is what carries the truth — the in-between layer collapses upward, and the discipline has nothing to do that §DD.4 does not already do. If name is treated as raw material for the tokeniser to chew — as fuel for the statistical reader, valuable only in proportion to how often the cluster `[\"Salt\", \"box\"]` appears in the corpus — the in-between layer collapses downward, and the discipline has nothing to do that the model's pre-training does not already do. The codetry claim is that the in-between layer is real, that it is the load-bearing one, and that it is the only place where authorship of the system's nouns is still possible at all.",
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
      number: "5.2",
      partRoman: "V",
      partLabel: "V · Open Questions",
      title: "Name as architecture, when the noun goes on-chain",
      blocks: [
        {
          kind: "small",
          text: "Open question · returned to as the answer changes.",
        },
        {
          kind: "para",
          text:
            "§5.1 closed by naming a second tokenisation, structurally analogous to the first: the *token* the chain mints when a community's assets, memberships, votes, or shares of a co-op are placed on a blockchain. The argument there ended on a hazard rather than an answer — that without a name-layer discipline, on-chain primitives become legible only to the people fluent in the substrate, which is the precise definition of technocracy. That paragraph deserves a chapter of its own. It is not a tail to the LLM-tokenisation argument; it is a separate open question, in the same shape, that the discipline owes itself a place to keep returning to. This is that place.",
        },
        {
          kind: "para",
          text:
            "The §1.0 distinction holds here without amendment. Codetry serves practice, not governance, and the chapter is not arguing that the discipline should expand to design what a community does with its votes, its shares, or its council seat. The hazard is to the noun *substrate* such governance is laid over once that substrate goes on-chain, and the open question is the same §1.0 hedge — protect the words the community already uses — asked at a layer where the words enact authority rather than describe practice. Whether that hedge is held by codetry, by a successor trade (§5.3), or by neither is part of what is open here.",
        },
        {
          kind: "subhead",
          text: "What the on-chain hazard actually is.",
        },
        {
          kind: "para",
          text:
            "The on-chain version of the §5.1 problem is not that the chain is hostile to names. It is that the chain's load-bearing identifiers are addresses and signatures — a contract is `0x` followed by forty hex characters; an interface is `transfer(address,uint256)`; a vote is a transaction whose meaning is whatever the function dispatched at that address happens to do. Names exist on top of this layer as conveniences: an ENS record, a token symbol, a label in a wallet UI, a string field inside a contract that the contract itself does not have to honour. The relationship between *name* and *primitive* on-chain is the inverse of the codetry relationship — the primitive is authoritative, the name is a label on top of it, and the label is replaceable without the primitive shifting underneath. The §DD.4 collapse — *the type is what carries the truth, the name is just decoration* — is the chain's default state, not its failure mode.",
        },
        {
          kind: "para",
          text:
            "What this does to a community whose governance has been placed on such a substrate is exactly what §5.1 named. The members can read *the token*, *the vote*, *the share* in their own kitchen-language. The chain reads `0xa0b8...`, `castVote(uint256,uint8)`, `balanceOf(address)`. When the two readings disagree — when the wallet UI says *yes* and the contract dispatches *no*, when the documentation calls a primitive *the council seat* and the bytecode treats it as a transferable ERC-721 — the chain's reading is the one that enacts. The community's noun loses, quietly, on every disagreement. The drift is invisible to anyone who is not fluent in the substrate, which is most of the community by design. That is the technocratic failure §5.1 named, made concrete.",
        },
        {
          kind: "subhead",
          text: "What a name-layer discipline would have to do.",
        },
        {
          kind: "para",
          text:
            "It is worth being honest about how little of this is settled. A name-layer discipline for on-chain governance would, at minimum, have to answer three questions the codetry move already answers in source code, and re-answers under harder constraints here. *Who authors the name.* In source code the answer is the practitioner sitting with the community at the kitchen table; on-chain it is unclear whether the name lives in the contract's metadata, in a registry the community controls, in a wallet UI the community does not control, or in a governance document the chain cannot read. *What the name is bound to.* In source code the binding is enforced by the rename test of §3.2 — change the name, and the metaphor breaks loud enough to hear. On-chain, the binding between *the council seat* and the ERC-721 dispatched at `0xa0b8...` is conventional rather than enforced; nothing in the substrate fails when the two drift. *How the name survives a fork.* Source code forks rarely and visibly; chains fork routinely, and a community whose governance noun is *the share* may wake up to find two chains, two contracts, two `share` tokens, and no discipline that says which of the two carries the noun the community originally named.",
        },
        {
          kind: "callout",
          text:
            "On-chain, *type is the chain's, token is the chain's, and name has nowhere obvious to live*. The §5.1 stack — type, name, token — collapses into two layers, both belonging to the substrate. The name layer is the one the discipline would have to build.",
        },
        {
          kind: "subhead",
          text: "Why this is its own chapter and not a footnote.",
        },
        {
          kind: "para",
          text:
            "§5.1 is about what tokenisation does to a noun the practitioner *wrote*. This chapter is about what tokenisation does to a noun the community *enacts authority through*, which is a different stake. The first hazard is that the discipline's reading public shifts from human to model and the noun-as-architecture move has to survive a statistical reader; the second hazard is that the community's reading public shifts from member to substrate and the noun-as-architecture move has to survive a *technocratic* reader — one whose fluency in the layer is itself the asymmetry of power. The first is a question about whether codetry's machine-readability holds. The second is a question about whether codetry's *bet against drift* — the §1.0 hedge — extends to the layer where drifted words have formal authority attached. They rhyme. They are not the same chapter.",
        },
        {
          kind: "para",
          text:
            "There is a temptation, when the answer is unknown, to fold the question back into a chapter that has more developed material around it. §5.1 is the more developed chapter — it has the rename-test analogy, the corpus-dependence argument, the type/name/token stack — and it would be easy to keep the on-chain thread as a closing movement there. Part VI exists to refuse that move. Open questions get their own chapters here precisely so they can be returned to as the answer changes, not so they can be domesticated as tails on the chapters that almost-but-not-quite address them. When a name-layer discipline for on-chain governance does start to take shape — in a registry pattern, in a contract convention, in a community's actual practice of binding the noun to the primitive — the place to record it is here, not appended to §5.1.",
        },
        {
          kind: "callout",
          text:
            "Open question, kept open. There is no settled name-layer practice for on-chain governance primitives, and the gap is the technocracy hazard §5.1 named. Whether the practice that fills the gap belongs inside codetry or, more honestly, in the successor trade §5.3 takes up — codetry feeding it as one tributary, not extending itself into governance — is itself part of the open question. This chapter exists to be returned to: when the substrate changes, when a registry pattern earns its place, when a community's practice of authoring the noun-as-primitive becomes specific enough to write down.",
        },
      ],
    },
    {
      id: "6-3",
      number: "5.3",
      partRoman: "V",
      partLabel: "V · Open Questions",
      title: "Name as a trade, practiced through the wisdom keepers",
      blocks: [
        {
          kind: "small",
          text: "Open question · returned to as the answer changes.",
        },
        {
          kind: "para",
          text:
            "§5.2 closed by saying the discipline does not yet have a name-layer practice for on-chain governance primitives, and that the chapter exists to be returned to when a community's practice of authoring the noun-as-primitive becomes specific enough to write down. The chapter before this one named the *site* and the *wall*. The chapter that follows it has to name the *worker* — what kind of work building a name-layer practice would actually be, and who would do it. If the name layer is the one the discipline would have to build (§5.2), the prior question is what shape the building would take: a credential, a role inside an existing profession, a community elder's extra duty, or a *trade* in the older sense of the word. This chapter is a place to keep the question of the shape of the work itself.",
        },
        {
          kind: "subhead",
          text: "A trade, in the sense bricklaying is a trade.",
        },
        {
          kind: "para",
          text:
            "A trade is what emerges when several industries' outputs only cohere in a *built thing*, and the built thing only holds if one pair of hands knows how all of them behave under load. Bricklaying is the example worth keeping in front of this chapter. The bricklayer is not a brick-maker, not a chemist, not a structural engineer, and not a site planner — but the trade absorbed enough brick chemistry, mortar chemistry, structural reading, site interface, and apprenticeship pedagogy that the wall it builds holds. A name-layer trade would absorb in the same shape, from at least four tributaries. *Codetry*: the rename test of §3.2, the discipline of choosing a metaphor that constrains the system rather than decorates it, the refusal to let the name collapse upward into the type or downward into the token. *Literate programming*, framed by §5.1 as the precondition the practice rests on rather than the sibling working in the next room: document-as-source, prose as the medium of work, names inside the source carrying the metaphor the prose claims they carry. *Wisdom keeping*: the only existing profession that already does multi-generation name maintenance — knowing who named a place, what the name binds to, what happens to the name when the river reroutes, the clan splits, or the treaty is broken. *Community development*: the practice of asking who is in the room when a noun gets coined, who is not, and what the downstream cost of those absences is. None of those four are the trade. The trade is where their outputs cohere in a wall — the wall being the names a community's institutions and on-chain primitives are bound to, authored and maintained with the intent that those names survive the substrate they were laid on.",
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
            "A bricklayer's wall is expected to outlast its builder by a century or more. Software's working assumption is that the substrate gets rewritten within a decade, which is why every existing software role is calibrated to the platform currently in fashion — the framework, the chain, the model, the cloud. A name-layer trade calibrated to seven generations would have to refuse that calibration. Not because the substrate is unimportant — §5.2 spent its length making the opposite case — but because the trade's job is to author names that *survive* the substrate, not to specialise in any one of them. The lineage that pedagogy would inherit from is therefore not computer science. The closer analogues are older. *Cartography*: place names that outlast the empires that drew the maps. *Constitutional drafting*: the bind between *the assembly* and the institution it names, across the generations the institution is supposed to last. *Oral lineage itself*: the discipline that already knows how to carry a noun across centuries by holding the practice of who tells it next. §4.2 honours literate programming as the closest sibling in the *technical* lineage codetry sits inside, and that placement is correct for that lineage. The trade lineage — the one a name-layer profession would inherit its pedagogy from — is older than the technical one, and §5.3 is the chapter that owes it the acknowledgement.",
        },
        {
          kind: "callout",
          text:
            "Open question, kept open. The trade has no first apprentice yet. Bricklaying did not become a trade by manifesto; it became one because someone laid a course, then a thousand more, under someone who kept calling out the wandering line. The chapter stays open until the apprenticeship begins, and is the place to record what it looks like when it does.",
        },
      ],
    },
    {
      id: "6-4",
      number: "5.4",
      partRoman: "V",
      partLabel: "V · Open Questions",
      title: "Where the flames held and where the corpus burned",
      blocks: [
        {
          kind: "small",
          text: "Open question · trailblazer's burn line · the §5.1 problem read from a third angle.",
        },
        {
          kind: "para",
          text:
            "On 29 April 2026 the practitioner ran a deliberate boundary test against the corpus. The test was simple in shape and aggressive on purpose: rewrite every chapter into plain grade-9 language, install a banned-vocabulary list — *substrate*, *primitive*, *membrane*, *load-bearing*, *cross-zone*, *vernacular*, *tokenize*, *reify* — replace each banned term inline with a plainer substitute, and ratchet the longest-sentence cap downward in successive passes (110 → 50 → 40 → 35 words) to see how far the prose would compress before something structural gave way. A scanner enforced the constraints. Every chapter passed every check the new infrastructure imposed. The book also stopped being the book the practitioner had been writing — and *that*, not the passing scanner, was the data the test was run to surface. Trailblazing leaves a burn line. The point of lighting one is to read what survives the flame.",
        },
        {
          kind: "para",
          text:
            "The finding the chapter exists to log is sharp and worth the burn. The eight banned words are not academic decoration on top of a craft that could just as well be described in everyday speech. They are the named primitives the craft is built on. *Load-bearing* is what §1.0 means when it says the noun carries the weight of the building; the metaphor *is* the discipline. *Substrate* is the word §5.1 reaches for when it has to distinguish the layer the cutter eats from the layer the author writes. *Membrane* is what §1.4 calls the gate between rooms before it earns the name *Gate*; *primitive* is the registered category of named pieces in the constellation manifest. Stripping the words and leaving the prose was not a translation; it was a controlled removal of the foundational vocabulary the prose stood on. The new prose was lighter to read because there was less holding it up — which is exactly the structural answer the test was built to surface, and which no amount of in-register inspection of the academic source could have produced. Some non-negotiables only show themselves when you remove them and watch the building lean.",
        },
        {
          kind: "subhead",
          text: "Why this is the §5.1 problem read from a third angle.",
        },
        {
          kind: "para",
          text:
            "§5.1 names a hazard from below: the cutter shreds the noun into sub-word fragments the model can read but the human author cannot author into. §5.2 names the same hazard one floor down: the chain shreds the noun into addresses the bytecode can read but the community cannot author into. The 29 April pass surfaced the same hazard from above: a substitution rule, applied uniformly across the corpus, shredded the named primitives into everyday synonyms the new reader could decode but the discipline could no longer be built out of. A layer that could read at one resolution forced a transformation on a layer authored at another, and the authored layer lost. That is the §5.1 frame, observed from a third angle the practice did not have on paper before the test. The chapter belongs in Part VI for the same reason §5.1 and §5.2 do: the discipline now knows the hazard exists at this third angle and does not yet have a settled answer for it.",
        },
        {
          kind: "subhead",
          text: "What the test established.",
        },
        {
          kind: "para",
          text:
            "Three findings the discipline did not have on paper before the burn. *First*, the eight terms are non-negotiable in the academic register — not because the practitioner is attached to them but because each one carries structural work that no plainer substitute carried after substitution; the building leaned where the named piece had been removed. *Second*, the plain-language register is a *derivative* artifact, not a *replacement* one. The §1.0 line about the kitchen table still holds, and the practitioner still owes the community a book it can sit with — but the academic register is where the craft's nouns are authored, defined, cross-referenced, and tested against each other, and the plain-language register is what gets carried out of that workshop into the community room. *Third*, authoring the plain register first by stripping the academic one collapses the workshop into the room and leaves nothing in the workshop to carry anything else out of, ever again. The §3.2 rename test catches drift inside a single register. It does not catch the deeper drift the test surfaced — the drift introduced when one register is asked to do the work of two. That is a new test the practice now knows it owes itself.",
        },
        {
          kind: "subhead",
          text: "Two registers, one foundation.",
        },
        {
          kind: "para",
          text:
            "The unfinished work this chapter exists to keep open is the discipline of authoring two registers of the same craft without letting one cannibalise the other. A first sketch, written from the burn's findings: the academic handbook (this volume) is the source, and is allowed — required, in fact — to use *substrate*, *primitive*, *membrane*, *load-bearing*, *cross-zone*, *vernacular*, *tokenize*, and *reify* as named pieces of the craft. A second handbook — the everyday volume the practitioner owes the kitchen table — is authored against the first as a translation, with each named piece carrying a worked-out plain-speech alias and a back-pointer to the academic chapter where the primitive is defined. The plain volume is shorter on purpose. It loses fidelity on purpose. The point is that the loss is *known*, *cited*, and *reversible* — the reader who wants the foundation can follow the back-pointer and find it intact. The hazard the test surfaced is exactly that, in a single-register collapse, the foundation is not preserved anywhere; it is overwritten in place. That is a kind of loss the craft has no recovery move for, except the one the post-test revert just performed.",
        },
        {
          kind: "para",
          text:
            "What the craft owes itself in return is also unfinished, and the next set of boundary tests is already visible. A test that catches a register-collapse before it ships — the §3.2 rename test, lifted one floor up to the level of *which named pieces still live in the corpus at all*. A protocol for the everyday volume's authorship — what gets aliased, what stays in academic form, what is allowed to be dropped, and how the dropping is logged so a future reader can find what the alias is hiding. A clearer answer to whether the academic volume is the correct ground at all, or whether the craft's nouns belong somewhere even more durable — a glossary, a manifest, an oral lineage held by named carriers — that both volumes refer back to. None of those answers are written yet. They are the boundary tests the practice now knows it has to run. This chapter is here so the finding is *in* the handbook — logged in the ledger of what has been deliberately set alight to find out what the discipline is actually made of.",
        },
        {
          kind: "callout",
          text:
            "The trailblazer's rule, written from the 29 April burn: the non-negotiables of codetry are found by lighting up the boundary and reading what survives the flame. Eight named primitives — *substrate*, *primitive*, *membrane*, *load-bearing*, *cross-zone*, *vernacular*, *tokenize*, *reify* — are the beams that held. The single-register simplification rule is the structure that burned. The next move is not to fear the next burn but to log this one in the ledger, restore the foundation it tested, and author the everyday volume separately on top of the restored academic source — knowing now, on evidence, that the academic register cannot be the everyday register's substrate by being replaced into it.",
        },
      ],
    },
    {
      id: "6-5",
      number: "5.5",
      partRoman: "V",
      partLabel: "V · Open Questions",
      title: "The inspector and the act that has two faces",
      blocks: [
        {
          kind: "small",
          text: "Open question · the role the discipline has been doing without naming · two-sided act in the gate/standby family.",
        },
        {
          kind: "para",
          text:
            "§5.4 closed by saying the next set of boundary tests is already visible and the practice owes itself a name for what runs them. The work has been done in the corpus from the beginning — *the rename test* of §3.2, the trailblazer's burn of §5.4, the bricklayer's master of §5.3 calling out the wandering line three courses in — but the role doing the work has not been named. This chapter names it. The role is *the inspector*. The act the inspector performs has the same structural shape as *the gate* (§2.11) and *the standby* (§2.10): one named primitive, two faces. Where the standby's two *states* are temporal — the infrastructure is constant; the system moves between resting and activated — and the gate's two *sides* are contextual — both face the membrane at once, each from its own legitimate vocabulary — the inspector's two faces are *operational*. The inspector certifies a name is load-bearing *by* pulling on it, and pulls on a name *in order to* certify what holds. The pull is the certification. The bind is the result of a successful pull. One inspection, two readings.",
        },
        {
          kind: "subhead",
          text: "Why the role is called the inspector and not something else.",
        },
        {
          kind: "para",
          text:
            "The construction-trade resonance is the one the corpus is reaching for. *Inspector* in §1.5's hempcrete frame is the trade member who walks the wall, taps the cured course to hear whether it sounds bound, presses against the infill to read whether the lime took, and certifies the wall as load-bearing on the strength of those acts. The regulatory connotation — the building-code official sent from outside to confirm the work meets a published standard — is not the reading wanted here. The inspector named in this chapter is internal to the trade: the practitioner certifying their own and their peers' courses, accountable to the §5.3 wisdom keepers above and to the seven-generation horizon those keepers carry. The trade's discipline is what registers the certification; the regulator's stamp does not. Near-variants — *the keeper*, *the journeyman*, *the wall-reader* — were considered and set aside for losing the construction-trade resonance §1.5 already commits the corpus to. *Inspector* keeps the resonance and is disambiguated here in one paragraph rather than worked around.",
        },
        {
          kind: "subhead",
          text: "The inspector's act in three intensities.",
        },
        {
          kind: "para",
          text:
            "The same act presents in three calibrated intensities the corpus already has worked examples for. *Light pull* — the §3.2 rename test. The inspector substitutes one word for the named primitive, watches what shifts in the surrounding mechanics, and certifies the bind on the strength of what failed and what held. The intensity is low because the substrate around the test is intact; the test is a single course poked. *Sustained pull* — the §5.3 master walking the apprentice's job and calling out the wandering line three courses in. The intensity is steady, low-grade, and continuous; the certification is the apprentice being sent back to relay the course. *Aggressive pull* — the §5.4 burn. The inspector substitutes against an entire register of named primitives at corpus scale, watches the wall lean, and certifies — by the leaning — which terms were binder and which were decoration. The intensity is the highest the trade has language for; the recovery is the §5.4 revert and the chapter that records what the test surfaced. Three intensities, one act, one role.",
        },
        {
          kind: "subhead",
          text: "Three drift types and the three responses.",
        },
        {
          kind: "para",
          text:
            "The wall the inspector walks is built to last seven generations, which is a horizon long enough that drift has time to take three structurally distinct shapes. *Slow drift* is entropy: the lime binder thinning at the joins, the prose around a named primitive going un-re-pointed for a season, the team's shared sense of what *the standby* is certified to mean drifting half a degree off true with each handoff. The inspector's response is the everyday one — re-point the binder, refresh the surrounding prose, run the rename test as routine maintenance rather than as event. *Kind drift* is well-meaning maintenance done without trade knowledge: the vapour barrier installed on the wrong face of the wall, the modern acrylic painted over the lime render, the simplification rule applied across the corpus by a practitioner who did not read the wall as hempcrete first. §5.4 is the corpus's first formally logged instance. The inspector's response is to intercept at the brief — to veto the kind-but-wrong move before it ships, with the trade reasoning written down so the next inspector inherits both the veto and the why. *Adversarial drift* is rarer and louder: the deliberate renaming of a load-bearing primitive for political or commercial advantage, the wholesale substitution of an acquirer's vocabulary over the corpus, the regime change that wraps the wall in vinyl siding until the hempcrete underneath does no work. The inspector's response is *witnessing* — documenting in a form the §5.3 trade lineage can carry across the regime change, so the wall's load-bearing structure is recoverable by a future generation that comes back to it.",
        },
        {
          kind: "callout",
          text:
            "The discipline does not fail to vandals. It fails to kind people without trade knowledge, and to the slow weather of years no one was re-pointing against.",
        },
        {
          kind: "subhead",
          text: "The role the gate plays, precisely.",
        },
        {
          kind: "para",
          text:
            "§2.11 names *the gate* as the membrane between *the bright side* and *massity* — two legitimate vocabularies meeting at a controlled crossing. §3.3 already closes by saying *drift caught at the gate is drift caught*, which is the corpus saying — without yet naming the role — that the gate is the most expensive but most reliable place to catch a kind-drift edit on its way out. The relationship the corpus has been carrying without naming is structural: the gate is a *location*, and the inspector is the *role* that makes the gate function as a gate rather than a door. Without an inspector standing at it, the gate decays into a doorway anyone can walk through. The two are paired; neither alone is the defense. A gate without an inspector catches no drift. An inspector without a gate has nowhere along the wall to stand and read what is crossing. §2.11 and this chapter are reading the same primitive from two angles — the gate names where the membrane is; this chapter names who certifies what crosses through it.",
        },
        {
          kind: "subhead",
          text: "Where the inspector comes from.",
        },
        {
          kind: "para",
          text:
            "The inspector role is not acquired by reading. It is acquired by the kind of generalist apprenticeship that puts a practitioner through enough terrain to recognise, when a load-bearing piece appears, that it is load-bearing. §5.3 names the trade lineage the role would inherit pedagogy from — cartography, constitutional drafting, oral lineage — and refuses the temptation to assign the trade to the wisdom keepers themselves. What §5.3 leaves open is the prior question this chapter is the right place to answer: where the apprenticeship that produces the apprentice's hands actually comes from. Codetry's first inspector apprenticed for fifteen years to *Jack Spirko* — *Son of Thunder*, *The Survival Podcast* — already named first in §IV's four teachers. What that apprenticeship transmitted is not a checklist and not a worldview. It is a sense of control and empowerment held against the everyday assumption that control belongs upward. It is a pattern-recognition lens trained across enough subjects — preparedness, food, energy, shelter, communication, finance, community organisation — that the *shape* of a load-bearing piece becomes legible across terrains that look unrelated to a specialist eye. And it is the discipline of using *the computer between the ears* over a fifteen-year horizon to hold questions and patterns in a working set the practitioner cannot always articulate but can return to when the surrounding tools catch up. Spirko's tagline — *for if times get tough or even if they don't* — is §1.3's *both-states* principle written into time itself, applied not to the plumbing of a single primitive but to the historical conditions under which the discipline has to keep working. The handbook named in this volume is what the questions held in the back of the practitioner's mind for fifteen years grew into when the surrounding computational and authorship tools finally surfaced enough to put them on paper. The lineage is owed the acknowledgement here, in the chapter where the role doing the work is finally named.",
        },
        {
          kind: "subhead",
          text: "Who the inspector serves.",
        },
        {
          kind: "para",
          text:
            "The discipline does not exist to recruit the practitioner into a politics. It exists to give the practitioner — and the practitioners working alongside them in the same lineage since 2009 — practical tools for rebuilding the substance of the institutions they live in, on terms they themselves set, in places they already are. The base the practice is most directly accountable to has been doing this work for a decade and a half: building food systems, building shelter, building local money, building peer-to-peer organisation, building family-scale resilience under whatever political weather the surrounding country was running. The shortage was never problems. The shortage was tools — and specifically, tools at the *name layer* of the institutions being built, which is the layer the surrounding software and policy traditions have left chronically under-served. The handbook is for those people first. It is grounding rather than agitating, practical rather than ideological, solution-oriented rather than position-taking. The choice between *anarchism*, *libertarianism*, *conservatism*, *agorism*, and any neighbouring posture is one the discipline has no authority to make and no interest in making. Those are choices about what to be; codetry is the substance choices of any of those shapes have to be built out of if they are meant to last more than one generation of the people holding them. The inspector serves the wall, not the politics the wall is enclosing.",
        },
        {
          kind: "subhead",
          text: "Open question, kept open.",
        },
        {
          kind: "callout",
          text:
            "The trade has its first inspector — the practitioner authoring this handbook. The chapter is open until the apprenticeship of the second one begins. Whether inspector standing transfers through the §5.3 wisdom-keeper line, through peer certification inside the four-teacher lineage, through some formal pedagogy the trade has not yet built, or through some combination of the three is the open question this chapter exists to be returned to. What the chapter establishes for the record now: the role exists, the act has two faces, the three drift types each call for a different response, the gate is the structural location and the inspector is the role that makes it function, and the apprenticeship is generalist before it is specific.",
        },
      ],
    },
    {
      id: "6-6",
      number: "5.6",
      partRoman: "V",
      partLabel: "V · Open Questions",
      title: "Inspector standing — the right that cannot be negotiated away",
      blocks: [
        {
          kind: "small",
          text: "Open question · second-order non-negotiable · entrenchment of the inspection itself.",
        },
        {
          kind: "para",
          text:
            "§5.5 names the inspector as the role that certifies a named piece holds by pulling on it. This chapter names the second-order condition that role depends on. Codetry has two tiers of non-negotiability, and both are load-bearing. *First-order non-negotiables* are the binder spec — the eight named primitives §5.4 burned to surface (*substrate*, *primitive*, *membrane*, *load-bearing*, *cross-zone*, *vernacular*, *tokenize*, *reify*), the third-actor frame, the additive-only posture, the academic register as the workshop floor for the craft's nouns, and *verify, don't trust* as the working stance toward proposed additions. These are *what* the binder is made of. *Second-order non-negotiable* — singular — is *inspector standing*: the inspector's right to maintain the first-order list, to add to it as new failure modes are discovered, and to refuse to negotiate the right itself away under pressure, persuasion, or convenience. This is not what the binder is made of; it is *who is permitted to specify what the binder is made of*, and the answer the discipline now writes down is *the inspector, and the right cannot be surrendered*. *Cannot be surrendered* and *cannot be passed on* are different claims; this chapter is about the first. Succession to the next inspector — how the right travels from one trade member to the next when the trade is working as intended — is the open question this chapter holds for §5.6's closing callout. The non-negotiability is against giving the right away under pressure, persuasion, or convenience, not against the trade's own succession protocol.",
        },
        {
          kind: "subhead",
          text: "Why the second tier matters more than the first.",
        },
        {
          kind: "para",
          text:
            "Most failed disciplines fail at the second-order tier. People rarely vote to remove their non-negotiables outright; the loss of attention required to assemble that vote is too visible and the resistance is too organised. What people do vote for, often unanimously and often with the best of intentions, is the removal of the inspector's standing to enforce them — *just for this case*, *just for this quarter*, *just while the funding closes*, *just until the new owner settles in*. The downstream effect is the same as removing the binder spec outright: the inspector cannot intercept the next kind-drift edit, cannot witness against the next adversarial substitution, cannot re-point the next slow-drift weathering, because the standing to do any of those acts has been temporarily — and then, by precedent, permanently — surrendered. The second tier is where the real defense sits. An attacker who can defeat it does not need to fight the first tier; the first tier dissolves on its own once the role with standing to maintain it is gone.",
        },
        {
          kind: "subhead",
          text: "Additive-only as a second-order non-negotiable hiding in plain sight.",
        },
        {
          kind: "para",
          text:
            "The handbook's standing rule for edits — *additive only* — is not a stylistic preference. It is a second-order non-negotiable the corpus has been carrying for some time without flagging as such. The binder spec can grow but cannot quietly shrink. New primitives can be added; existing ones cannot be removed by single-pass edit. This is what makes *verify, don't trust* safe to add as a working stance: the addition is permanent in the sense that no later substitution can dissolve it without an inspection trail visible enough for a future inspector to read what was removed and why. *Additive-only* is the structural property that protects the binder spec from kind drift attacking it one item at a time. It belongs in this chapter rather than in §5.5 because it is not an act the inspector performs; it is a property of the standing the inspector holds — a property that travels with the role and that a later inspector inherits intact.",
        },
        {
          kind: "subhead",
          text: "Standing as the precondition for all three responses at once.",
        },
        {
          kind: "para",
          text:
            "§5.5 names three drift types — slow, kind, adversarial — and three responses — re-point, veto, witness. Each of the three responses is conditional on the inspector's standing to perform it. *Re-pointing* requires the standing to spend trade time on a wall the surrounding institution does not visibly need re-pointed; without standing, the re-pointing is the first activity cut when budgets tighten. *Vetoing a kind-but-wrong edit* requires the standing to refuse a change everyone in the room agrees would be an improvement; without standing, the veto is overruled by collegiality. *Witnessing against an adversarial substitution* requires the standing to keep documenting what was load-bearing after the new vocabulary has shipped; without standing, the witness is dismissed as backward-looking. Inspector standing is not a defense against one drift type. It is the precondition for *any* of the three responses to be available at all. That is why it sits at the second tier: it is the load-bearing piece holding all three first-tier responses up.",
        },
        {
          kind: "subhead",
          text: "The §5.4 finding restated through standing.",
        },
        {
          kind: "para",
          text:
            "§5.4 logged the 29 April burn as a recoverable lapse in the academic register. The chapter's surface finding is that the eight named primitives are non-negotiable; the deeper finding, available now from the vantage of this chapter, is that the lapse was recoverable *only* because the second-order tier was held intact. The practitioner who applied the simplification rule was the same practitioner who reverted it — the standing to revert had not been surrendered, and so the revert was a single act inside the inspector's existing authority rather than a campaign requiring permission from somewhere else. The discipline survived its own most aggressive test against itself because the right to inspect the test's outcome had not been surrendered before the test was run. The chapter lesson §5.6 owes the corpus is the inverse: a single permanent surrender of the second-order tier ends the discipline regardless of what the first-tier list says, because the list cannot defend itself.",
        },
        {
          kind: "callout",
          text:
            "The right to inspect cannot be negotiated away, because giving it away is the failure mode the inspection exists to prevent. Inspector standing is the second-order non-negotiable the first-order non-negotiables depend on; surrender of the second tier ends the discipline whether the first-tier list is amended or not.",
        },
        {
          kind: "subhead",
          text: "What standing protects, for the people the discipline serves.",
        },
        {
          kind: "para",
          text:
            "The base the discipline is most directly accountable to — the practitioners who have been building food, shelter, money, and community since 2009, on terms they themselves set, in places they already live — does not need a politics imposed from above and is not asking for one. What that base needs, and has been short of, is *the right to author and maintain the substance of the institutions they are building, in vocabulary they themselves set, across the generations the institutions are meant to last*. That right is what inspector standing names. It is not a political position; it is the structural condition under which any political position the practitioners might choose — *anarchism*, *libertarianism*, *conservatism*, *agorism*, or any other — has a chance of staying bound to its meaning across more than one generation of the people holding it. The discipline does not pick the politics. The discipline keeps the binder cured so the wall the politics is built into stays a wall. The lineage's standing observation is *push a free man hard enough and watch what he does*; the discipline's structural answer is *keep the right to inspect his own substance unsurrendered, and watch what he builds*.",
        },
        {
          kind: "subhead",
          text: "Open question, kept open.",
        },
        {
          kind: "callout",
          text:
            "The chapter records the structure now — two tiers, second tier load-bearing, additive-only as the property that protects the first-tier list from quiet erosion — and leaves open the question of how second-tier standing transfers to the trade's next inspector. §5.3 names the wisdom-keeper line as the source of authority and review for the first-tier list; §5.5 names the generalist apprenticeship as the source of the inspector's hands. Whether second-tier standing — the *right* itself, distinct from the trade skill — transfers through the same two channels, through a third the trade has not built yet, or through some combination, is the open question this chapter exists to be returned to as the answer becomes available.",
        },
      ],
    },
    {
      id: "6-7",
      number: "5.7",
      partRoman: "V",
      partLabel: "V · Open Questions",
      title: "Pioneer training",
      blocks: [
        {
          kind: "small",
          text: "Open question · who this work is for · the calm before the storm.",
        },
        {
          kind: "para",
          text: "This is the calm before the storm.",
        },
        {
          kind: "subhead",
          text: "Sons and daughters of thunder.",
        },
        {
          kind: "para",
          text:
            "We are the sons and daughters of thunder — those who have stood for years at the headwaters, holding back the flood not to stop it, but to learn its rhythm, its force, its promise. We did not dam the future; we studied it. We prepared.",
        },
        {
          kind: "subhead",
          text: "The icon is a ship.",
        },
        {
          kind: "para",
          text:
            "The Headwaters icon is a ship. Not a fortress. Not a temple. A vessel — trim, seaworthy, ready to leave the known shore. AI is the new territory: vast, unmapped, alive with both peril and possibility. Literate programming is only the first small sail on that horizon, a tiny blip of clarity in an ocean of code. It still lacks shape. It still needs hands — many hands — practicing, refining, grounding it in reality.",
        },
        {
          kind: "subhead",
          text: "Who the work belongs to.",
        },
        {
          kind: "para",
          text:
            "This work belongs to well-grounded individuals who prize self-sovereignty and refuse aggression. It calls to big hearts, restless minds, and artists who understand that the most powerful tools are also the most beautiful when shaped by care.",
        },
        {
          kind: "callout",
          text:
            "We are not late to this frontier. We are the ones who kept the headwaters while the world slept. Now we launch.",
        },
      ],
    },
    {
      id: "6-8",
      number: "5.8",
      partRoman: "V",
      partLabel: "V · Open Questions",
      title: "Sponsors and experts — base first, then networking outward",
      blocks: [
        {
          kind: "small",
          text: "Open question · how the trade grows without losing its ground.",
        },
        {
          kind: "para",
          text:
            "The pioneer journey will at some point be visited. Sponsors will offer to stand behind the work materially; experts will offer to stand beside the work in their own discipline. The question this chapter exists to keep open is when that traffic begins, in what order, and what the standing rule is for letting it in. The discipline records the pattern now, before the visitors arrive, so the order is structural rather than improvised.",
        },
        {
          kind: "subhead",
          text: "The base is people, not infrastructure.",
        },
        {
          kind: "para",
          text:
            "The base the chapter refers to is not a follower count, a subscriber list, or a marketing channel. It is the practitioner's own circle — the people already doing the work in the same physical territory, on terms they themselves set, in lineage with the four teachers §4.1 names. That base earns the right to extend invitation by walking the path themselves first, and only then inviting a second cohort whose completion of the same stations will, in turn, earn the standing to issue further invitations. Base now; cohort as the path is walked; only then the visitors who arrive on the standing the cohort has built. The phrasing is *base, then cohort, then visitors*, in that order, and the order is the discipline.",
        },
        {
          kind: "subhead",
          text: "Sponsors stand behind. Experts stand beside.",
        },
        {
          kind: "para",
          text:
            "A sponsor stands behind the work materially — funding, materials, a workshop floor, time off another job, the loan of a tool the trade does not yet own. An expert stands beside the work in their own discipline — a builder who has spent thirty years framing, a midwife who has caught a thousand babies, an accountant who has kept a small business honest across three recessions. The two roles are not the same and the chapter resists collapsing them. A sponsor whose money becomes the basis on which their expertise is then accepted is the failure mode §5.6 named about inspector standing being negotiated away under pressure; the discipline records the names separately so the failure mode can be named separately, and so the inspector can refuse the conflation when it is offered.",
        },
        {
          kind: "subhead",
          text: "What 'visit' means on the path.",
        },
        {
          kind: "para",
          text:
            "A visit is bounded. A visitor leaves a single short note at one station — not a tour of all of them, not a curriculum, not a relationship the path conscripts on the practitioner's behalf. The note is in the visitor's own voice, attributed to the visitor and to the role (sponsor or expert), and visible to anyone walking that station thereafter. The bounded surface is the structural protection: a visitor cannot accidentally become the path's primary voice because there is no place on the path for a primary visitor voice to live. The path is the practitioner's; the visit is the visitor's; the line between the two stays drawn.",
        },
        {
          kind: "subhead",
          text: "Phasing is not optional.",
        },
        {
          kind: "para",
          text:
            "The temptation, once the pattern is named, is to network early — to invite sponsors before the base has walked the path, on the reasoning that visible sponsorship will draw the base in. The chapter records this as the failure mode the chapter exists to name. Networking before the base is real produces the inverse of the intended effect: the base reads sponsor-first as a recruitment campaign and stays away, the path is then walked primarily by visitors with no base, and the discipline loses the people whose practice it was supposed to be in service of. The §5.7 framing of *holding the headwaters back while the world slept* is the same pattern in a different register — the calm came first, the launch comes second, and the order cannot be reversed without surrendering the calm.",
        },
        {
          kind: "subhead",
          text: "What the path records now.",
        },
        {
          kind: "para",
          text:
            "The Pioneer Path data structure now carries an optional *visitors* slot on every station, capable of holding a list of named sponsors and experts with their role and a single short note in their own voice. The slot is empty on every station at the time of writing. The empty state is the chapter's argument made visible: there are no visitors yet because the base has not yet walked the path, and the discipline records the absence rather than papering over it with placeholder names. As the base walks the stations and earns the standing to invite, real visitors will be added one at a time, and the populated state will be the discipline's milestone — recorded in the same field the empty state is recorded in now.",
        },
        {
          kind: "callout",
          text:
            "The visitor surface is empty by design. Sponsors and experts are added as the practitioner's own circle walks the path and earns the standing to invite the second cohort, and as that cohort in turn earns the standing to host visitors. The empty state is the discipline; the populated state is the milestone.",
        },
      ],
    },
  ],
};


const partVII: Part = {
  roman: "FL",
  title: "Field Ledger",
  blurb:
    "Eleven worked codetry tests, in chronological order. Each one is a small piece of the practice — a question about a name, what was on the screen before, the intervention tried, the rule discovered, the falsifier the rule lives or dies by, and the verdict. The ledger is here so the discipline can be inspected against its own examples rather than only against its rules.",
  kind: "backMatter",
  chapters: [
    {
      id: "7-1",
      number: "FL.1",
      partRoman: "FL",
      partLabel: "Field Ledger",
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
            "Graduated. Variant A shipped in `PaydayTab.tsx` / `PaydayPlanner.tsx`. Two later sightings on the same surface complicated the verdict. *Sighting 1 (the catch in the wild).* A fresh screenshot of the live Payday tab caught a banking word — *Stays in bank (bills)* — quietly displacing the locked Zone 1 verb *Siphon* on the catchment-plan card. A one-line rename in the two parallel surfaces restored *Siphoned out for bills*. The diagnostic move named in this chapter (*when a word feels off, look for one doing two jobs or one belonging to a different register*) found the defect immediately, and the locked map of §FL.2 supplied the exact replacement word with no design discussion needed. *Sighting 2 (the rebase that silently un-did the fix).* Two days later, a search of the codebase showed `PaydayPlanner.tsx` had reverted to *Stays in bank (bills)* — Task #806 (the calm rest view) had branched from a pre-rebase tree, and a tangled merge resolved by pulling the planner card forward from the pre-rebase branch silently restored the older banking word. Nothing in the merge process flagged it. The fix here was to restore the locked word and add the smallest possible mechanical witness — a single unit test asserting the catchment card reads *Siphoned out for bills* and not anything containing *Stays in bank*.",
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
      number: "FL.2",
      partRoman: "FL",
      partLabel: "Field Ledger",
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
      number: "FL.3",
      partRoman: "FL",
      partLabel: "Field Ledger",
      title: "Test 003 — Bamboo field on the wallet chip",
      blocks: [
        { kind: "small", text: "Date 2026-04-26 · Zone 1 / xBuckets Payday tab · status: rejected." },
        { kind: "subhead", text: "The question." },
        {
          kind: "para",
          text:
            "The first formally *rejected* test. The handbook's hempcrete chapter (§1.5) names XRP as *the bamboo field* in its coda. Does the word *bamboo field* earn a place on the wallet/XRP-swap chip — the quiet plumbing chip Test 001 demoted below the *Channel the rainfall* CTA — or does it stay as a meta-doc reference only?",
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
            "Rejected for the wallet chip. The bamboo-field metaphor stays as a meta-doc reference (§1.5). The chip on the Payday tab continues to read as the quiet plumbing chip Test 001 demoted it to. The canvas variants are preserved as a counter-test artefact. The verdict would change only if a bamboo-only surface is built (the upstream gets its own screen, no rainfall language nearby) or if the water register is replaced wholesale on the Payday tab — neither of which is on the table from this test.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§1.5 (What kind of thing codetry is — Hempcrete) coda — the bamboo-field metaphor that this test refused on the wallet chip. §FL.1 (Test 001) — the test that demoted the wallet chip to plumbing in the first place." },
      ],
    },
    {
      id: "7-4",
      number: "FL.4",
      partRoman: "FL",
      partLabel: "Field Ledger",
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
            "This is a different rule family from one-word-one-referent (§FL.1) and one-register-per-screen (§FL.3). Those rules govern the *vocabulary* of the surface — which words appear, in which dialect. This rule governs the *temperature* of the surface — which controls appear, at what loudness, given the architectural state behind the screen. The two families compose: a locked vocabulary doesn't help if every control is shouting at peer volume; a calm layout doesn't help if the words are doing two jobs each. Both have to hold for the surface to feel right.",
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
        { kind: "small", text: "§FL.1 (Test 001) — the vocabulary rule the Wobble-targets escape hatch shipped from. §FL.3 (Test 003) — the one-register-per-screen rule, complementary to the temperature rule named here." },
      ],
    },
    {
      id: "7-5",
      number: "FL.5",
      partRoman: "FL",
      partLabel: "Field Ledger",
      title: "Test 005 — Drip Harvester reads as DeFi noise",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Earn surface · status: graduated." },
        { kind: "subhead", text: "The finding." },
        {
          kind: "para",
          text:
            "The Earn surface speaks two languages at once. The locked Zone 1 water vocabulary (§FL.2) covers four of the words on screen. The other seventeen are imported from DevOps, naval, finance, and crypto-Twitter registers — and the cold reader has to translate every one of them to understand what the screen does.",
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
        { kind: "small", text: "§FL.2 (Test 002) — the locked map this test was held to. §FL.6 (Test 006) — the flow-ribbon follow-up scoped out of this test. §FL.7 (Test 007) — the structural test that found the LP-position card had survived this vocabulary sweep." },
      ],
    },
    {
      id: "7-6",
      number: "FL.6",
      partRoman: "FL",
      partLabel: "Field Ledger",
      title: "Test 006 — Earn flow ribbon graduates (three stations)",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Earn surface · status: graduated, later superseded by §FL.8." },
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
            "After the §FL.5 vocabulary sweep, the Earn surface speaks one language consistently — the locked Zone 1 water map plus *Drip Harvester* and *Park toll*. But the *topology* is still implicit. A cold reader who lands on the Earn tab sees, in order: an XRP Spring card, a Drip Harvester intro card, an LP-position card (when one exists), a list of Private Parks, and a Learn accordion. Nothing on the surface tells them, in one read, where their money currently sits and how it moves between stations.",
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
            "Graduated, then superseded by §FL.8 (Test 008). Two cold reads after Test 006 shipped found the three-station design hid the Drip Harvester's noun-sense behind its verb-sense and lost the reader's ability to point at the earner wallet on the topology picture. §FL.8 restored the four-station ribbon and added a position read-out underneath. Test 006 is preserved here for the practice record — including the moment the rule held and the moment it didn't.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§FL.5 (Test 005) — Variant C of which this test graduated. §FL.8 (Test 008) — supersedes this three-station design with a four-station ribbon and a position read-out." },
      ],
    },
    {
      id: "7-7",
      number: "FL.7",
      partRoman: "FL",
      partLabel: "Field Ledger",
      title: "Test 007 — The LP-position card survived the vocabulary sweep",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Earn surface, LP-position card · status: graduated." },
        { kind: "subhead", text: "The finding." },
        {
          kind: "para",
          text:
            "The vocabulary sweep from §FL.5 cleaned every word on the LP-position card and left the card itself untouched — and the layout it had been hiding behind those words turned out to be three structural defects stacked on top of each other.",
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
            "Variant A (hierarchy + IL + toll history) graduates. A single hero block opens the card (*Drip earned so far · +$2.40 RLUSD* / *next drip at $25.00*, with the progress bar directly under it and a one-line footer *10% of the way · then $22.50 lands in Vacation*); two stats survive in a sub-row below (*Parked* and *Drip rate*), with *Your share* and *Today's drip* cut as DeFi-derived metrics the household never asked for; a `TollBand` helper sits under the sub-row showing the Park toll as a band labelled honestly as a *typical range* (production does not yet snapshot tolls over time, so the band is derived from the current toll ±35%, with a follow-up to record real history); an amber IL heads-up earns the bottom of the card next to the parked money, with a link out to the Learn module §FL.5 already rewrote to be honest. Variant B (stability band) and Variant C (single story) recorded as rejected.",
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
            "Graduated. Variant A shipped to the LP-position branch of `JoinPoolSection` in `EarnTab.tsx` and the new `lp*` copy keys in `copy.en.ts` (mirrored in `copy.fr.ts`). The new `TollBand` helper lives in `EarnTab.tsx` next to `RISK_STYLE`. Real Park-toll history is recorded as a follow-up task; Variant A ships an honest *typical range* band today. *Side note on the practice.* The Earn surface now has two distinct kinds of test — *what does the surface say* (§FL.5's vocabulary sweep) and *what does the surface put first* (this test's hierarchy + disclosure). They catch different defects on the same card.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§FL.5 (Test 005) — the vocabulary sweep that this test found the layout had survived. §FL.8 (Test 008) — the parallel structural test on the Earn flow ribbon." },
      ],
    },
    {
      id: "7-8",
      number: "FL.8",
      partRoman: "FL",
      partLabel: "Field Ledger",
      title: "Test 008 — The Earn flow ribbon becomes four stations",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Earn surface · status: graduated, supersedes §FL.6." },
        { kind: "subhead", text: "The claim." },
        {
          kind: "para",
          text:
            "If the ribbon is supposed to answer *where in the system am I?* then every station the money passes through has to be a thing the reader can point at — the Drip Harvester is one of those things, so it graduates from a verb on an arrow (§FL.6) to its own circle in the chain, and the ribbon grows a one-line position read-out underneath that names where the household actually is.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Two cold reads after §FL.6 shipped showed its three-station ribbon had a hole. *The Drip Harvester is also a wallet* — *an earner wallet that holds RLUSD before it is parked* was already named, repeatedly, in the locked map and the intro card — and drawing the Drip Harvester only as an edge verb left the cold reader unable to point at *the wallet itself* on the topology picture. *The ribbon answered topology but not position.* Test 001's Payday-tab ribbon shows changing dollar values at each station; §FL.6's Earn ribbon could not (the Earn-tab values move on a weekly-to-monthly cadence) and shipped labels-only — meaning the ribbon answered *the chain in the abstract* without ever answering *where the household currently is on it*. A reader with no Drip Harvester yet, a reader with one set up but no parked RLUSD, a reader with a parked Lake collecting currents, and a reader with a sweep-ready harvester all saw the same picture.",
        },
        { kind: "subhead", text: "The intervention." },
        {
          kind: "para",
          text:
            "Two changes from §FL.6, both restoring something the canvas Variant C of §FL.5 already had. *Four nodes, not three.* The Drip Harvester gets its own circle on the ribbon, between Reservoir and Private Lake, with the sub-label *earner wallet*. The §FL.6 reasoning (Drip Harvester is a verb, not a noun) was true and irrelevant: the Drip Harvester *is* a verb (the move from Lake to Bucket) **and also** a wallet (the place RLUSD sits while the move is happening). The ribbon is a topology, and topology asks *what are the places?*, not *what are the verbs?* The verb sense survives in the prose under the ribbon. *A one-line position read-out under the ribbon* names the most forward station the household has actually reached: four states, each later state implying all earlier ones.",
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
            "Graduated. Variant C (canvas) restored as the live ribbon: four nodes, Drip Harvester between Reservoir and Lake. Position read-out shipped under the ribbon, EN in `copy.en.ts`, FR mirror in `copy.fr.ts`. Active-station emphasis upgraded from a 2px ring to a saturated tone-fill + ring. Drip Harvester pulse on sweep-ready preserved from §FL.6, now on the Drip Harvester station itself rather than on the Lake → Buckets edge. §FL.6 superseded; its `flowEdgeHarvester` string removed.",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§FL.6 (Test 006) — the previous (three-station) shipping of this same intervention, kept in the ledger because the moment a rule held wrong is part of the practice record. §FL.7 (Test 007) — the parallel structural test on the LP-position card." },
      ],
    },
    {
      id: "7-9",
      number: "FL.9",
      partRoman: "FL",
      partLabel: "Field Ledger",
      title: "Test 009 — Water-register wordings on the wallet chip",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets Payday tab · status: graduated." },
        { kind: "subhead", text: "The question." },
        {
          kind: "para",
          text:
            "§FL.3 ruled out the bamboo-field metaphor on the wallet/XRP-swap chip on the grounds of *one register per screen* — bamboo (biological) was fighting rainfall (water) on the same surface. The rejection was clean, but it only proved bamboo doesn't belong here. It did not prove that the production wording — *Convert XRP → RLUSD* — is the best the chip can be. This test asks: can the chip speak the same water register the rest of the screen already uses, without inflating itself back to peer-of-CTA volume?",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Three water-register variants were tried alongside Variant 0 (*412 XRP unconverted ⇄ Swap to ~$420 RLUSD*). Variant A: *Top up reservoir from XRP · ~$420* — verbal-only, *Reservoir* doing the wallet work the locked map of §FL.2 says it should. Variant B: *Add to reservoir · 412 XRP ⇄ $420* — same locked word, slightly cooler verb, with the explicit ⇄ arrow and concrete numbers retained. Variant C: *412 XRP standing by · refill reservoir* — the calmest verb, source-leads, action-follows.",
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
            "Demotion by typography is not the same as demotion by vocabulary. The locked map (§FL.2) covers vocabulary; the temperature rule (§FL.4) covers loudness. A chip can be typographically quiet and still break the screen's register — and that break can hide for cycles precisely because the typography says *don't look here*.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "A water-register wording earns the chip if both hold: (1) *mechanical clarity preserved* — a cold reader can still tell from the chip alone what the chip does, specifically that XRP gets exchanged for stablecoins added to the wallet (the same falsifier as §FL.3); and (2) *demotion preserved* — at the actual production typography (10px white/25 underlined text-link), the new wording does not feel louder than the control, i.e. it does not pull the eye away from the *Channel the rainfall* CTA above it.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. Variant A — *Top up reservoir from XRP* — ships as the new wording, same typography, same demoted text-link, same surface position. The chip remains plumbing; it now also speaks the locked Zone 1 dialect. Variant B is rejected for unnecessary visual weight (the arrow + numbers buy nothing the locked dialect doesn't already give). Variant C is rejected for losing mechanical precision (poetic but uninformative — a cold reader can't tell the chip swaps).",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§FL.3 (Test 003) — rejected the bamboo-field metaphor on the same chip on the grounds of *one register per screen*. §FL.10 / §FL.11 (Test 010) — the loud-twin and the deeper-room moves of the same closing-out arc on this surface stack." },
      ],
    },
    {
      id: "7-10",
      number: "FL.10",
      partRoman: "FL",
      partLabel: "Field Ledger",
      title: "Test 010 — Water-register wordings on the shortfall CTA",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets wallet-confirm sheet · status: graduated." },
        { kind: "subhead", text: "The question." },
        {
          kind: "para",
          text:
            "§FL.9 graduated the *demoted* XRP-swap chip from *Convert XRP → RLUSD* to *Top up reservoir from XRP*, finally bringing it into the locked Zone 1 water dialect. That chip has a *loud* twin — the prominent amber CTA in the wallet-confirm sheet that appears when the wallet is short of plan total. It still said *Convert XRP → RLUSD to cover shortfall*. Same action, same destination, same protocol-noun register-break. This test asks: can the loud chip speak the same dialect as its quiet sibling without losing the urgency the amber card is built to express?",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Three variants alongside Variant 0 (*Convert XRP → RLUSD to cover shortfall*). Variant A — *Top up reservoir from XRP* (a direct port of §FL.9's graduate). Variant B — *Top up reservoir from XRP · cover the shortfall* (§FL.9's graduate as the action, then a separator, then the urgency tail naming what the amber card is shouting about). Variant C — *Refill reservoir from XRP · cover the shortfall* (same shape as B but with *refill* instead of *top up*).",
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
            "When a chip has a *quiet* sibling and a *loud* sibling that do the same thing, the loud one should rhyme with the quiet one in dialect, then add whatever the loud surface needs. Test 003's *one register per screen* held even on a typographically demoted surface (§FL.9); this test extends it to a *loud* surface — the amber CTA was hiding behind its urgency the way the demoted chip was hiding behind its typography.",
        },
        { kind: "subhead", text: "Falsifiable claim." },
        {
          kind: "para",
          text:
            "A water-register wording earns the loud amber CTA if both hold: (1) *mechanical clarity preserved* (same falsifier as §FL.3 and §FL.9); and (2) *urgency preserved* — the cold reader still understands this is a *fix-the-shortfall* action, not a casual top-up. The chip should read as the answer to the amber alert above it, not as an aside that happens to live in the same card.",
        },
        { kind: "subhead", text: "Status." },
        {
          kind: "para",
          text:
            "Graduated. Variant B — *Top up reservoir from XRP · cover the shortfall* — ships, same amber CTA treatment, same surface position, same icon. Variant A is rejected for dropping *shortfall* and leaving the urgency in the amber card alone with no echo on the chip. Variant C is rejected for *refill* implying a state of fullness the reservoir never had this cycle (the same word §FL.9 had already flagged as wrong-temperature on the demoted twin). Variant B's structure — *(§FL.9's exact graduate) · (purpose-of-this-surface)* — gives the two chips a shared spine, mirroring the existing graduated hero CTA from §FL.1 (*Channel the rainfall · $1,200 ready · every drop into a bucket*).",
        },
        { kind: "subhead", text: "See also." },
        { kind: "small", text: "§FL.9 (Test 009) — the quiet sibling on the Payday tab whose dialect this loud twin now rhymes with. §FL.11 (the second-filed Test 010) — the deeper-room move on the swap-sheet header that closes out the arc this test opened." },
      ],
    },
    {
      id: "7-11",
      number: "FL.11",
      partRoman: "FL",
      partLabel: "Field Ledger",
      title: "Test 010 (second entry) — Water-register wording on the swap-sheet header",
      blocks: [
        { kind: "small", text: "Date 2026-04-27 · Zone 1 / xBuckets ConvertXrpSheet · status: graduated." },
        {
          kind: "callout",
          text:
            "Numbering note. This is the second entry filed as *Test 010* in the ledger, and it has been left at its original number rather than renumbered to 011 — both because the duplicate is itself part of the practice record (two tests on the same wallet/XRP-swap stack landed on the same date and were filed as 010 in error, and the ledger preserves that), and because the first 010 (§FL.10) and this entry (§FL.11) are the loud-twin and the deeper-room moves of one closing-out arc on the same surface stack and read better as a pair than as 010 / 011 across a renumbering boundary. Future ledger entries are expected to start at 011, leaving §FL.10 / §FL.11 as the one anomaly the numbering preserves.",
        },
        { kind: "subhead", text: "The question." },
        {
          kind: "para",
          text:
            "§FL.9 graduated the wallet/XRP-swap chip into the locked Zone 1 dialect (*Top up reservoir from XRP*), and explicitly *deferred* the same question one surface deeper — the sheet that opens when the user taps the chip. This test asks whether `convertXrp.title` should follow the chip into the locked dialect, or earn its protocol nouns because the user has crossed into a transactional room. The defence in §FL.9 was specific (*the swap interface is allowed its own register because by then the user has crossed into a different room*), defensible, and possibly right — but it was an agent decision made in passing, with no falsifier and no cold read. It deserves its own test.",
        },
        { kind: "subhead", text: "What was on screen." },
        {
          kind: "para",
          text:
            "Four variants. Variant 0 (control): eyebrow *Tap the Headwaters* (already in dialect, locked by §FL.2), title *Convert XRP → RLUSD* (protocol). Variant A: title *Top up your reservoir* — pure dialect, mirrors §FL.9's graduated verb. Variant B: title *Refill the reservoir from your headwaters* — both locked nouns, most poetic. Variant C: title *Top up your reservoir* with a small grey subheading *XRP → RLUSD* underneath — hybrid.",
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
            "Register zoning works vertically as well as horizontally. Test 002 zones registers across screens (§FL.2); this test shows the same kind of zoning *inside* a single component: the title-level register can speak dialect while the line-item register speaks protocol, as long as each register lives at the level it is best at. Dialect names the *kind of action*; protocol names the *assets the action moves*; the CTA verb names *what the wallet will sign*. Three registers, three jobs, one sheet, no register-break.",
        },
        {
          kind: "para",
          text:
            "This is not a new general rule — it is §FL.2's locked map applied with one extra grain of resolution: not just *which words* per screen, but *which words at which level inside a screen*. Worth naming because it unblocks a class of cases (transactional sheets with poetic frames) where the *moment of honesty needs protocol* fear was load-bearing for the conservative call in §FL.9.",
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
        { kind: "small", text: "§FL.9 (Test 009) — the chip whose graduation this test extends one surface deeper. §FL.10 (the first-filed Test 010) — the loud-twin chip on the wallet-confirm sheet that opened the arc this test closes." },
      ],
    },
  ],
};


const partColophon: Part = {
  roman: "C",
  title: "Colophon",
  blurb:
    "How this handbook was authored, and the spirit in which it is offered.",
  kind: "backMatter",
  chapters: [
    {
      id: "5-6",
      number: "C",
      partRoman: "C",
      partLabel: "Colophon",
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

export const PARTS: Part[] = [partPrologue, partV, partI, partIII, partIV, partVI, partII, partVII, partColophon];

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
