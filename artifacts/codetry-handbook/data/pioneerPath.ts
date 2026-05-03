// Headwaters: The Pioneer Path — 20 stations, five phases.
//
// The Path is the same source material as the handbook, walked instead of
// read. Each station names a load-bearing piece of the codetry corpus and
// asks the reader to *do* one thing on the ground before the next station
// unlocks. This file is the only data file the Path screens read.
//
// Five phases:
//   I   — Read Your Community     (stations 1–5)   diagnose what's already there
//   II  — Name Your Model         (stations 6–9)   identify the right shape
//   III — Make Your First Agreement (stations 10–13) translate and commit
//   IV  — Build the Floor         (stations 14–16) buffer · tithe · reserve
//   V   — Hold the Line           (stations 17–20) renegotiate · replicate · hand off
//
// Vocabulary discipline: station ids match the constellation primitive
// ids where one exists (the-standby, the-gate). Excerpts are drawn from
// the existing handbook chapters so the prose has a single source of
// truth — see pioneerPathStationExcerpt() below.

import { CHAPTERS, type Block } from "./handbook";
import { constellation } from "./constellation";

// A sponsor or expert who has visited a station along the path.
export type PioneerVisitor = {
  id: string;
  name: string;
  role: "sponsor" | "expert";
  note: string;
};

export type PioneerPhase = {
  number: number;         // 1–5
  label: string;          // display label
  description: string;    // one-line description shown above the phase's stations
};

export type PioneerStation = {
  id: string;
  ordinal: number;        // 1-indexed position on the full trail (1–20)
  phase: number;          // which phase this station belongs to (1–5)
  name: string;
  subtitle: string;
  sourceChapterId: string;
  doPrompt: string;
  narrationSlug: string;
  visitors?: PioneerVisitor[];
};

// The five phases — used by the path index to group stations visually.
export const PIONEER_PHASES: PioneerPhase[] = [
  {
    number: 1,
    label: "Read Your Community",
    description: "Before building anything, see what's already there.",
  },
  {
    number: 2,
    label: "Name Your Model",
    description: "Identify the right shape before you commit to a structure.",
  },
  {
    number: 3,
    label: "Make Your First Agreement",
    description: "Practice the translation, then make one real commitment.",
  },
  {
    number: 4,
    label: "Build the Floor",
    description: "Establish the stability mechanisms before you grow.",
  },
  {
    number: 5,
    label: "Hold the Line",
    description: "Build the habits that make the model last past the first person.",
  },
];

function findPrimitiveChapterId(primitiveId: string): string {
  const primitive = constellation.constellationWidePrimitives.find(
    (p) => p.id === primitiveId,
  );
  if (primitive) {
    const target = primitive.name.toLowerCase();
    const hit = CHAPTERS.find(
      (ch) =>
        ch.partRoman === "III" && ch.title.toLowerCase().startsWith(target),
    );
    if (hit) return hit.id;
  }
  const partIII = CHAPTERS.find((ch) => ch.partRoman === "III");
  return partIII?.id ?? CHAPTERS[0]?.id ?? "1-1";
}

export const PIONEER_STATIONS: PioneerStation[] = [

  // ── Phase I — Read Your Community ─────────────────────────────────────────

  {
    id: "the-saltbox",
    ordinal: 1,
    phase: 1,
    name: "The Saltbox",
    subtitle: "Where every beam carries weight",
    sourceChapterId: "1-2",
    doPrompt:
      "Walk through your home and pick the one room that does the most jobs. Write down — by hand, on paper — the three jobs it carries. Tape the paper to the doorframe.",
    narrationSlug: "the-saltbox",
  },
  {
    id: "both-states",
    ordinal: 2,
    phase: 1,
    name: "Both-States",
    subtitle: "One word, two tempos",
    sourceChapterId: "1-3",
    doPrompt:
      "Pick one thing in your community that runs in two tempos — mostly quiet but sometimes everything. Write its name. Then write the second name you almost gave it.",
    narrationSlug: "both-states",
  },
  {
    id: "the-ledger-walk",
    ordinal: 3,
    phase: 1,
    name: "The Ledger Walk",
    subtitle: "Follow the money before you move it",
    sourceChapterId: "4-3",
    doPrompt:
      "Go through one week of purchases in your community — groceries, fuel, building supplies, anything bought from outside. Write down where each dollar went. At the bottom, write one number: how much left your community that week. Keep the paper.",
    narrationSlug: "the-ledger-walk",
  },
  {
    id: "the-names",
    ordinal: 4,
    phase: 1,
    name: "The Names",
    subtitle: "The connective tissue you already have",
    sourceChapterId: "4-1",
    doPrompt:
      "Write down three names — real people in your community — who you would trust to hold a hard conversation honestly. Not a role, not a title. Three actual names. Fold the paper and keep it somewhere you'll find it. These are your connective tissue.",
    narrationSlug: "the-names",
  },
  {
    id: "the-gap",
    ordinal: 5,
    phase: 1,
    name: "The Gap",
    subtitle: "What leaves your community every week",
    sourceChapterId: "5-5",
    doPrompt:
      "Name one thing your community buys every week from somewhere outside — food, fuel, a service — that someone in your community could provide. Write the name of the thing. Next to it, write the name of one person in your community who already knows how to make or do it.",
    narrationSlug: "the-gap",
  },

  // ── Phase II — Name Your Model ─────────────────────────────────────────────

  {
    id: "the-archetype",
    ordinal: 6,
    phase: 2,
    name: "The Archetype",
    subtitle: "Which shape fits before you build it",
    sourceChapterId: "3-0",
    doPrompt:
      "Read the four shapes: The Store, The Agency, The Platform, The Cooperative. Write down which one your community is already closest to — even if it's informal and unnamed. Then write one sentence about why that shape fits. Don't pick the most ambitious one. Pick the truest one.",
    narrationSlug: "the-archetype",
  },
  {
    id: "the-first-trade",
    ordinal: 7,
    phase: 2,
    name: "The First Trade",
    subtitle: "What moves informally already",
    sourceChapterId: "4-2",
    doPrompt:
      "Name one exchange that already happens in your community without money changing hands — a favour, a barter, a standing agreement. Write: who gives, who receives, what moves, and what makes it work. Then write: what would change if that exchange had a name and a simple agreement behind it?",
    narrationSlug: "the-first-trade",
  },
  {
    id: "the-floor",
    ordinal: 8,
    phase: 2,
    name: "The Floor",
    subtitle: "The minimum before you think about growing",
    sourceChapterId: "1-5",
    doPrompt:
      "Write down the minimum monthly number that keeps your community's most critical function running — not thriving, just running. One number. Then write the three things that number has to cover. This is your floor. Post it somewhere visible.",
    narrationSlug: "the-floor",
  },
  {
    id: "the-waterfall",
    ordinal: 9,
    phase: 2,
    name: "The Waterfall",
    subtitle: "The order that makes a dollar last",
    sourceChapterId: "3-1",
    doPrompt:
      "On a piece of paper, draw a simple flow: if your community's first trade brought in $1,000, where would it go — in what order? Draw the sequence top to bottom. Each box gets one label in your community's own words. The order is the decision.",
    narrationSlug: "the-waterfall",
  },

  // ── Phase III — Make Your First Agreement ──────────────────────────────────

  {
    id: "both-sides",
    ordinal: 10,
    phase: 3,
    name: "Both-Sides",
    subtitle: "One word, two rooms",
    sourceChapterId: "1-4",
    doPrompt:
      "Find one form, letter, or invoice on your kitchen table that uses words your family doesn't. On a sticky note, write the family's word for the same thing next to the form's word. Leave both visible.",
    narrationSlug: "both-sides",
  },
  {
    id: "the-standby",
    ordinal: 11,
    phase: 3,
    name: "The Standby",
    subtitle: "Always-on, until it isn't",
    sourceChapterId: findPrimitiveChapterId("the-standby"),
    doPrompt:
      "Walk your property and write down the three things that fail first when the power goes out. Don't fix them yet — just name them, in your own words, in pencil, where you can see them tomorrow.",
    narrationSlug: "the-standby",
  },
  {
    id: "the-gate",
    ordinal: 12,
    phase: 3,
    name: "The Gate",
    subtitle: "A calm passage between two dialects",
    sourceChapterId: findPrimitiveChapterId("the-gate"),
    doPrompt:
      "Take one piece of mail from a regulator, banker, or government office. Underline every word in it your family wouldn't say at the table. Write your family's word in the margin next to each one. Keep both.",
    narrationSlug: "the-gate",
  },
  {
    id: "the-agreement",
    ordinal: 13,
    phase: 3,
    name: "The Agreement",
    subtitle: "The same thing, said two ways",
    sourceChapterId: "4-4",
    doPrompt:
      "Write one paragraph describing the first trade you named in Station 7. Write it twice: once in your community's own words, the way you'd explain it at a kitchen table. Once in the way you'd write it on a form or say it to a banker. Keep both. The gap between them is the work.",
    narrationSlug: "the-agreement",
  },

  // ── Phase IV — Build the Floor ─────────────────────────────────────────────

  {
    id: "the-buffer",
    ordinal: 14,
    phase: 4,
    name: "The Buffer",
    subtitle: "The firewall before the debt plan",
    sourceChapterId: "4-6",
    doPrompt:
      "How many months could your community's most critical function keep running if your main income stopped tomorrow? Write the honest number — not the optimistic one. If you don't know, write 'unknown.' That is also the answer. Now write one thing that would make that number one month longer.",
    narrationSlug: "the-buffer",
  },
  {
    id: "the-tithe",
    ordinal: 15,
    phase: 4,
    name: "The Tithe",
    subtitle: "First claim, not last",
    sourceChapterId: "0-1",
    doPrompt:
      "Name what your community already gives back — to the land, to elders, to those who have less, to the next generation. Write the practice down, even if it's informal and has no dollar amount attached. This is your tithe. It goes first, before the rest of the waterfall.",
    narrationSlug: "the-tithe",
  },
  {
    id: "the-reserve",
    ordinal: 16,
    phase: 4,
    name: "The Reserve",
    subtitle: "Where extra goes when there's extra",
    sourceChapterId: "4-5",
    doPrompt:
      "Write one rule for where extra goes when there's extra. Not a wish — a rule: 'When we have more than X, Y goes to Z.' If you don't have a rule yet, write the one that feels right. Write it in your community's language. Post it next to the waterfall you drew in Station 9.",
    narrationSlug: "the-reserve",
  },

  // ── Phase V — Hold the Line ────────────────────────────────────────────────

  {
    id: "the-renegotiation",
    ordinal: 17,
    phase: 5,
    name: "The Renegotiation",
    subtitle: "Name the trigger before you need it",
    sourceChapterId: "4-3",
    doPrompt:
      "Write down the three things that would have to change before you'd go back to the table and ask for different terms. Not feelings — conditions. 'When the store turns a profit for three months in a row.' 'When the grant runs out.' 'When the hours double.' Name the triggers before you need them.",
    narrationSlug: "the-renegotiation",
  },
  {
    id: "the-replication",
    ordinal: 18,
    phase: 5,
    name: "The Replication",
    subtitle: "Who walks this after you",
    sourceChapterId: "4-7",
    doPrompt:
      "Name one person in your community who could walk this path after you — who could run this model if you stepped back. Write their name. Write the one thing they would need to learn that they don't already know. That gap is your next teaching.",
    narrationSlug: "the-replication",
  },
  {
    id: "the-handoff",
    ordinal: 19,
    phase: 5,
    name: "The Handoff",
    subtitle: "Three load-bearing sentences for the next person",
    sourceChapterId: "1-7",
    doPrompt:
      "Write the three things the next person needs to know to pick this up if you're not there. Not the full plan — three load-bearing sentences: the floor number, the waterfall order, and the name of the gate person. One page, in plain language, somewhere they can find it.",
    narrationSlug: "the-handoff",
  },
  {
    id: "the-return",
    ordinal: 20,
    phase: 5,
    name: "The Return",
    subtitle: "What Tuesday morning looks like when it works",
    sourceChapterId: "1-0",
    doPrompt:
      "Write one paragraph: what does your community look like in five years if this works? Not a grant objective, not an economic development target. What does it actually feel like on a Tuesday morning? Write it in your own words, in the language your community uses at the table.",
    narrationSlug: "the-return",
  },
];

export function getPioneerStation(id: string | undefined): PioneerStation | undefined {
  if (!id) return undefined;
  return PIONEER_STATIONS.find((s) => s.id === id);
}

export function getPioneerNeighbors(id: string): {
  prev?: PioneerStation;
  next?: PioneerStation;
} {
  const i = PIONEER_STATIONS.findIndex((s) => s.id === id);
  if (i < 0) return {};
  return {
    prev: i > 0 ? PIONEER_STATIONS[i - 1] : undefined,
    next: i < PIONEER_STATIONS.length - 1 ? PIONEER_STATIONS[i + 1] : undefined,
  };
}

export function pioneerPathStationExcerpt(stationId: string): Block[] {
  const station = getPioneerStation(stationId);
  if (!station) return [];
  const chapter = CHAPTERS.find((ch) => ch.id === station.sourceChapterId);
  if (!chapter) return [];

  const out: Block[] = [];
  let chars = 0;
  const SOFT_BUDGET = 1400;

  for (const block of chapter.blocks) {
    if (block.kind === "small") continue;

    out.push(block);

    if (
      block.kind === "para" ||
      block.kind === "callout" ||
      block.kind === "pull" ||
      block.kind === "subhead"
    ) {
      chars += block.text.length;
    } else if (block.kind === "list" || block.kind === "ordered") {
      chars += block.items.reduce((s, it) => s + it.length, 0);
    }

    if (chars >= SOFT_BUDGET) break;
  }

  return out;
}
