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
  blurb: "What codetry is, in three short chapters.",
  chapters: [
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
    "Two older disciplines codetry gets confused with — both honoured, both doing different work.",
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
            "Both disciplines insist that words around the code do load-bearing work. They are doing different jobs.",
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
            "Knuth's discipline is named here with the same respect already extended to code poetry. It is older, it is deeper in the literature, and it sits across the room from codetry doing related but separate work. Both are *don't trust; verify* moves: show your work in the medium where the work actually lives. Literate programming verifies by exposing the reasoning. Codetry verifies by making the metaphor inspectable in the name itself.",
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
            "Donald Knuth's WEB and CWEB; Org-mode Babel, Jupyter, R Markdown, and Quarto carry the practice today. Document is the source; code is woven from prose. The closest sibling discipline to codetry, doing different work — verifying by exposing the reasoning rather than by making the metaphor inspectable.",
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

export const PARTS: Part[] = [partI, partII, partIII, partIV, partV];

export const CHAPTERS: Chapter[] = PARTS.flatMap((p) => p.chapters);

export function getChapter(id: string | undefined): Chapter | undefined {
  if (!id) return undefined;
  return CHAPTERS.find((c) => c.id === id);
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
