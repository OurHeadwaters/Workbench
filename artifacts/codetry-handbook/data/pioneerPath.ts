// Headwaters: The Pioneer Path
//
// The Path is the same source material as the handbook, walked instead of
// read. Each station names a load-bearing piece of the codetry corpus and
// asks the reader to *do* one thing on the ground before the next station
// unlocks. This file is the only data file the Path screens read.
//
// Vocabulary discipline: station ids match the constellation primitive
// ids where one exists (the-standby, the-gate). Excerpts are drawn from
// the existing handbook chapters so the prose has a single source of
// truth — see pioneerPathStationExcerpt() below.

import { CHAPTERS, type Block } from "./handbook";
import { constellation } from "./constellation";

// A sponsor or expert who has visited a station along the path. The
// distinction matters: §5.8 names sponsors as those who stand behind
// the work materially, and experts as those who stand beside the work
// in their own discipline. The two roles are kept separate so a
// sponsor whose money becomes the basis on which their expertise is
// then accepted — the §5.6 inspector-standing failure mode — stays
// visible and refusable rather than collapsed into a single "supporter".
export type PioneerVisitor = {
  // Stable slug-cased id used for keyed React renders.
  id: string;
  // Display name in the visitor's preferred form.
  name: string;
  // §5.8 distinction. Sponsor = stands behind materially. Expert = stands
  // beside in their own discipline. The chapter resists collapsing them.
  role: "sponsor" | "expert";
  // Single short note in the visitor's own voice, left at this station.
  // Bounded by §5.8: one station, one note, in their own voice.
  note: string;
};

export type PioneerStation = {
  id: string;
  ordinal: number; // 1-indexed position on the trail
  name: string; // display name on the trail marker
  subtitle: string; // one-line caption shown under the marker
  // The chapter in the existing handbook this station is drawn from.
  // Used both for the "Read" excerpt and for the "From the library"
  // deep-link at the bottom of the station screen.
  sourceChapterId: string;
  // The single tangible action the station asks the reader to perform.
  // One action, not a checklist. Keep it doable in an afternoon.
  doPrompt: string;
  // Stable filename slug for the narration MP3. The audio file is
  // expected at public/narration/<narrationSlug>.mp3 — drop a new MP3
  // with this name and the player picks it up automatically on next
  // load. No code change required to publish a recording.
  narrationSlug: string;
  // Optional list of sponsors and experts who have visited this
  // station, per §5.8 ("Sponsors and experts — base first, then
  // networking outward"). Empty/undefined by design at the time of
  // writing — the absence is the §5.8 argument made visible. Real
  // visitors are added one at a time as the base walks the path and
  // earns the standing to invite.
  visitors?: PioneerVisitor[];
};

// Resolve a constellation primitive's auto-generated chapter id. The
// founding-primitive chapters are generated at handbook build time as
// `3-{zoneCount + i + 1}`; rather than recompute that arithmetic here we
// look them up by primitive name in the chapter title, the same trick
// app/standby/index.tsx uses. Returns the first Part III chapter as a
// fallback so a missing primitive never crashes the trail at module
// load time — the station screens can render with the wrong source
// chapter rather than the whole app failing to mount.
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
  {
    id: "the-saltbox",
    ordinal: 1,
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
    name: "Both-States",
    subtitle: "One word, two tempos",
    sourceChapterId: "1-3",
    doPrompt:
      "Pick one thing on your homestead that runs in two tempos — a pump that's mostly off but sometimes everything, a pantry that's mostly still but sometimes a kitchen. Write its name down. Then write the second name you almost gave it before you settled on one.",
    narrationSlug: "both-states",
  },
  {
    id: "both-sides",
    ordinal: 3,
    name: "Both-Sides",
    subtitle: "One word, two rooms",
    sourceChapterId: "1-4",
    doPrompt:
      "Find one form, letter, or invoice on your kitchen table that uses words your family doesn't. On a sticky note, write the family's word for the same thing next to the form's word. Leave both visible.",
    narrationSlug: "both-sides",
  },
  {
    id: "the-standby",
    ordinal: 4,
    name: "The Standby",
    subtitle: "Always-on, until it isn't",
    sourceChapterId: findPrimitiveChapterId("the-standby"),
    doPrompt:
      "Walk your property and write down the three things that fail first when the power goes out. Don't fix them yet — just name them, in your own words, in pencil, where you can see them tomorrow.",
    narrationSlug: "the-standby",
  },
  {
    id: "the-gate",
    ordinal: 5,
    name: "The Gate",
    subtitle: "A calm passage between two dialects",
    sourceChapterId: findPrimitiveChapterId("the-gate"),
    doPrompt:
      "Take one piece of mail from a regulator, banker, or government office. Underline every word in it your family wouldn't say at the table. Write your family's word in the margin next to each one. Keep both.",
    narrationSlug: "the-gate",
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

// Pull the Read excerpt for a station from the existing handbook chapter
// content — the handbook chapters are the single source of truth for the
// prose, so the Path never carries its own copy that could drift from
// the book. We collect the first few prose blocks (paragraphs, pulls,
// callouts) up to a soft character budget and hand them back as the
// rendered Block[] the existing ChapterBlock component already knows
// how to draw.
export function pioneerPathStationExcerpt(stationId: string): Block[] {
  const station = getPioneerStation(stationId);
  if (!station) return [];
  const chapter = CHAPTERS.find((ch) => ch.id === station.sourceChapterId);
  if (!chapter) return [];

  const out: Block[] = [];
  let chars = 0;
  const SOFT_BUDGET = 1400;

  for (const block of chapter.blocks) {
    // Skip the auto-generated principle citation blocks and meta
    // small-text blocks at the top of founding-primitive chapters; the
    // Path wants prose, not the chapter's eyebrow metadata.
    if (block.kind === "small") continue;

    out.push(block);

    // Accumulate text length for budget tracking.
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
