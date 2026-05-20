// The Z0 household Standby checklist — the smallest runnable instance of
// The Standby (a constellation-wide primitive hosted by Z3, read by every
// zone). The four rungs and the two sub-shelf names are sourced from
// constellation.constellationWidePrimitives so the household vocabulary
// cannot drift from the co-op's. This file owns only the household-side
// items themselves; it borrows everything else from the manifest.

import { constellation } from "./constellation";

export type RungId = "advisory" | "standby" | "active" | "standdown";
export type SubShelfId = "common-pantry" | "watch";

export type StandbyItem = {
  id: string;
  rung: RungId;
  subShelf: SubShelfId;
  text: string;
  detail?: string;
};

const STANDBY_PRIMITIVE_ID = "the-standby";

function findStandbyPrimitive() {
  const p = constellation.constellationWidePrimitives.find(
    (x) => x.id === STANDBY_PRIMITIVE_ID,
  );
  if (!p) {
    throw new Error(
      "The Standby primitive is missing from the bundled constellation snapshot.",
    );
  }
  return p;
}

const standbyPrimitive = findStandbyPrimitive();

// The four rungs come straight from the manifest's severity ladder so
// the rung name and meaning the household sees match the co-op exactly.
// Order is preserved — advisory → standby → active → standdown.
export type RungInfo = {
  id: RungId;
  name: string;
  meaning: string;
};

const RUNG_ORDER: RungId[] = ["advisory", "standby", "active", "standdown"];

function rungIdFromName(rung: string): RungId {
  const id = rung.trim().toLowerCase();
  if (
    id === "advisory" ||
    id === "standby" ||
    id === "active" ||
    id === "standdown"
  ) {
    return id;
  }
  throw new Error(
    `Unknown rung name "${rung}" in constellation severity ladder.`,
  );
}

export const RUNGS: RungInfo[] = (() => {
  const ladder = standbyPrimitive.severityLadder ?? [];
  if (ladder.length === 0) {
    throw new Error(
      "The Standby primitive has no severity ladder in the bundled constellation snapshot.",
    );
  }
  const byId = new Map<RungId, RungInfo>();
  for (const r of ladder) {
    const id = rungIdFromName(r.rung);
    byId.set(id, { id, name: r.rung, meaning: r.meaning });
  }
  return RUNG_ORDER.map((id) => {
    const info = byId.get(id);
    if (!info) {
      throw new Error(
        `Severity ladder is missing the "${id}" rung in the bundled constellation snapshot.`,
      );
    }
    return info;
  });
})();

// The two sub-shelves — The Common Pantry and The Watch — are also
// pulled from the manifest so a rename in the constellation propagates
// here without a second edit.
export type SubShelfInfo = {
  id: SubShelfId;
  name: string;
  role: string;
};

function subShelfIdFromName(name: string): SubShelfId {
  const n = name.trim().toLowerCase();
  if (n.includes("pantry")) return "common-pantry";
  if (n.includes("watch")) return "watch";
  throw new Error(
    `Sub-shelf "${name}" does not match a known household sub-shelf.`,
  );
}

export const SUB_SHELVES: SubShelfInfo[] = (() => {
  const shelves = standbyPrimitive.subShelves ?? [];
  if (shelves.length === 0) {
    throw new Error(
      "The Standby primitive has no sub-shelves in the bundled constellation snapshot.",
    );
  }
  const out: SubShelfInfo[] = [];
  const seen = new Set<SubShelfId>();
  for (const s of shelves) {
    const id = subShelfIdFromName(s.name);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, name: s.name, role: s.role });
  }
  if (!seen.has("common-pantry") || !seen.has("watch")) {
    throw new Error(
      "Expected both Common Pantry and Watch sub-shelves in the bundled constellation snapshot.",
    );
  }
  // Pantry first, Watch second — matches the manifest's listing order.
  out.sort((a, b) => (a.id === "common-pantry" ? -1 : b.id === "common-pantry" ? 1 : 0));
  return out;
})();

// Vocabulary lookup — surfaces the manifest's exact role text for the
// nouns the checklist uses inline (a call, the watch, standby stock,
// the debrief).
export type StandbyVocab = {
  call: string;
  watch: string;
  standbyStock: string;
  debrief: string;
  centralizedDisruption: string;
};

export const VOCAB: StandbyVocab = (() => {
  const v = standbyPrimitive.vocabulary ?? [];
  const get = (term: string): string => {
    const hit = v.find((x) => x.term.trim().toLowerCase() === term.toLowerCase());
    return hit?.role ?? "";
  };
  return {
    call: get("a call"),
    watch: get("the watch"),
    standbyStock: get("standby stock"),
    debrief: get("the debrief"),
    centralizedDisruption: get("centralized disruption"),
  };
})();

// The household items themselves. Each item is tagged with which rung
// it becomes load-bearing on and which sub-shelf it sits inside —
// supplies & physical reserves on the Common Pantry, monitoring &
// people-side moves on the Watch. The five anchor items called out in
// the Z0 saltbox manifest entry — water on hand, fuel, meds, kid-care
// plan, contact tree — appear at the standby rung where they first
// matter.
export const ITEMS: StandbyItem[] = [
  // ─── Advisory ────────────────────────────────────────────────────
  {
    id: "adv-pantry-glance",
    rung: "advisory",
    subShelf: "common-pantry",
    text: "Glance at standby stock — what would we draw on first?",
    detail:
      "Open the cupboard, the freezer, the medicine drawer. No re-stock yet — just see what's there.",
  },
  {
    id: "adv-pantry-low",
    rung: "advisory",
    subShelf: "common-pantry",
    text: "Note what's running low (water, fuel, meds, batteries).",
  },
  {
    id: "adv-watch-read",
    rung: "advisory",
    subShelf: "watch",
    text: "Read the latest advisory from the agency that issued it.",
    detail:
      "One source, read fully. Don't doomscroll — pick the issuing agency and stay there.",
  },
  {
    id: "adv-watch-tell",
    rung: "advisory",
    subShelf: "watch",
    text: "Tell the household, in one sentence, what's forming.",
    detail: "Kids included. The advisory is informed; the posture hasn't changed yet.",
  },

  // ─── Standby ─────────────────────────────────────────────────────
  {
    id: "stb-pantry-water",
    rung: "standby",
    subShelf: "common-pantry",
    text: "Top up water on hand — 4 L per person per day for at least 3 days.",
    detail: "Drinking, cooking, basic hygiene. Fill jugs and the bath if a shutoff is plausible.",
  },
  {
    id: "stb-pantry-fuel",
    rung: "standby",
    subShelf: "common-pantry",
    text: "Verify fuel for heat and the generator — and test-start the generator.",
    detail: "Wood stacked, propane tank weight, jerry can full. A generator that won't start is not standby stock.",
  },
  {
    id: "stb-pantry-meds",
    rung: "standby",
    subShelf: "common-pantry",
    text: "Refill meds you're low on — keep a 7-day buffer for everyone in the house.",
    detail: "Prescription and over-the-counter. Note expiry on anything in the kit.",
  },
  {
    id: "stb-pantry-firstaid",
    rung: "standby",
    subShelf: "common-pantry",
    text: "Check the first-aid kit, headlamps, batteries, hand-crank radio.",
  },
  {
    id: "stb-pantry-cash",
    rung: "standby",
    subShelf: "common-pantry",
    text: "Set aside small bills (cash) in case payment systems are down.",
  },
  {
    id: "stb-watch-kids",
    rung: "standby",
    subShelf: "watch",
    text: "Confirm the kid-care plan — who picks up if school closes mid-day.",
    detail: "Primary, backup, and the third name if both are at work. Tell the kids who.",
  },
  {
    id: "stb-watch-tree",
    rung: "standby",
    subShelf: "watch",
    text: "Print the contact tree — who calls whom, on paper, not just in phones.",
    detail: "Stick it on the fridge. Phones die; the fridge does not.",
  },
  {
    id: "stb-watch-meet",
    rung: "standby",
    subShelf: "watch",
    text: "Agree on a meeting place if the household gets separated.",
    detail: "One indoor, one outdoor. Tell every person, not just the adults.",
  },
  {
    id: "stb-watch-charge",
    rung: "standby",
    subShelf: "watch",
    text: "Charge phones and the backup battery; queue a paper map of the route out.",
  },
  {
    id: "stb-watch-pets",
    rung: "standby",
    subShelf: "watch",
    text: "Pet & livestock plan — food, water, and an evacuation route for them too.",
  },
  {
    id: "stb-watch-neighbour",
    rung: "standby",
    subShelf: "watch",
    text: "Name the neighbour who'd struggle most — the elder, the household alone with kids.",
    detail: "Decide who in your household checks on them when a call opens.",
  },

  // ─── Active ──────────────────────────────────────────────────────
  {
    id: "act-pantry-open",
    rung: "active",
    subShelf: "common-pantry",
    text: "Open the call: pull standby stock out where the household can see it.",
    detail: "Counter, table, hallway. What's hidden in a cupboard is not in the call.",
  },
  {
    id: "act-pantry-ration",
    rung: "active",
    subShelf: "common-pantry",
    text: "Ration water at 4 L per person per day; log what's used.",
    detail: "A line on a sheet of paper is enough. The log is for the debrief.",
  },
  {
    id: "act-pantry-gen",
    rung: "active",
    subShelf: "common-pantry",
    text: "Run the generator on a schedule — don't leave it on or run the tank dry.",
  },
  {
    id: "act-pantry-meds",
    rung: "active",
    subShelf: "common-pantry",
    text: "Take meds at normal times. A call is not a reason to skip a dose.",
  },
  {
    id: "act-watch-tree",
    rung: "active",
    subShelf: "watch",
    text: "Trigger the contact tree once — not five times.",
    detail: "One message, the named callers make their named calls.",
  },
  {
    id: "act-watch-account",
    rung: "active",
    subShelf: "watch",
    text: "Confirm everyone is at the meeting place — or accounted for by name.",
  },
  {
    id: "act-watch-channel",
    rung: "active",
    subShelf: "watch",
    text: "Stay on one weather/agency channel; mute the rest.",
    detail: "Pick the agency that issued the advisory. Information overload is a posture problem.",
  },
  {
    id: "act-watch-neighbour",
    rung: "active",
    subShelf: "watch",
    text: "Check on the neighbour you named at standby.",
  },

  // ─── Standdown ───────────────────────────────────────────────────
  {
    id: "sdn-pantry-replenish",
    rung: "standdown",
    subShelf: "common-pantry",
    text: "Replenish standby stock — water, meds, fuel, batteries, first-aid.",
    detail: "Replace what was used before the call closes in your head, or it won't get done.",
  },
  {
    id: "sdn-pantry-restock",
    rung: "standdown",
    subShelf: "common-pantry",
    text: "Reset the fridge contact-tree printout if it got drawn on or torn.",
  },
  {
    id: "sdn-watch-close",
    rung: "standdown",
    subShelf: "watch",
    text: "Close the contact tree — one message: standdown.",
  },
  {
    id: "sdn-watch-debrief",
    rung: "standdown",
    subShelf: "watch",
    text: "Write the debrief: what worked, what didn't, what we'd reset.",
    detail: "Five lines is plenty. The debrief is the artifact the household keeps.",
  },
  {
    id: "sdn-watch-share",
    rung: "standdown",
    subShelf: "watch",
    text: "Send the debrief to the co-op so the cross-zone record holds.",
    detail: "Optional, never required. The household keeps a copy either way.",
  },
];

export function itemsForRung(rung: RungId): StandbyItem[] {
  return ITEMS.filter((it) => it.rung === rung);
}

export function itemsForRungBySubShelf(
  rung: RungId,
  subShelf: SubShelfId,
): StandbyItem[] {
  return ITEMS.filter((it) => it.rung === rung && it.subShelf === subShelf);
}

export const STANDBY_PRIMITIVE = standbyPrimitive;
export const STANDBY_PRIMITIVE_NAME = standbyPrimitive.name;
export const STANDBY_PRIMITIVE_SUMMARY = standbyPrimitive.summary;

// Two-sides frame — the canonical positioning statement for the Standby model.
// Built and proven on reserves and in northern communities (the origin and
// ongoing priority). The discipline travels: any household or community running
// a decentralized economy can run the same standby model. Surfaced in the UI
// as "Local roots · Global pattern" so practitioners anywhere know the model
// belongs to them.
export const STANDBY_TWO_SIDES_FRAME = {
  label: "Local roots · Global pattern",
  body: "Built and proven on reserves and in northern communities. The discipline travels — any household or community running a decentralized economy can run the same standby model.",
} as const;
