// Full-year salt batch calendar — surfaced on the Year, Week, and
// WeekCloseOut pages so the bench rotation lives on the operating
// calendar, not just on the SaltBench slide. Names + dates here are
// the seed roster from `src/pages/slides/SaltBench.tsx` (VI · 02b);
// changing one means changing both. The standby paid shift is its own
// line so the $1,200/yr standby cost surfaces in operations, not only
// in the bench cost table.

import { dateForDayInWeek, formatShortDate } from "../lib/dateMath";

export type BenchSeat = {
  name: string;
  base: string;
};

// Mirrors the names + bases on the SaltBench slide. Source of truth for the
// "who shows up" question on a batch week.
export const BENCH: Record<string, BenchSeat> = {
  marie: { name: "Marie T.", base: "Dryden — 7 min from depot" },
  devin: { name: "Devin A.", base: "Wabigoon — 22 min" },
  jess: { name: "Jess W.", base: "Sioux Lookout — 45 min" },
  roger: { name: "Roger S.", base: "Eagle River — 30 min" },
};

export type BenchSeatId = keyof typeof BENCH;

// Stable ordering for the swap dropdown. Mirrors the order the seats are
// declared above so the OM sees the same roster every time.
export const BENCH_SEAT_IDS = Object.keys(BENCH) as BenchSeatId[];

export function isBenchSeatId(id: string): id is BenchSeatId {
  return Object.prototype.hasOwnProperty.call(BENCH, id);
}

// Casual labour rate — same $30/hr applies to both the primary's
// pick + pack hours and the standby's Friday paid shift. Centralized
// here so a future rate change updates every line in one place.
export const CASUAL_HOURLY_RATE = 30;

// Primary works Tue (pick, 6 hrs) + Wed (pack, 8 hrs) = 14 hrs casual.
// Mirrors the SaltRunbook slide; book to SALT-01-LBR.
export const PRIMARY_HOURS_PER_BATCH = 14;
export const PRIMARY_PAID_PER_BATCH =
  PRIMARY_HOURS_PER_BATCH * CASUAL_HOURLY_RATE;

// Standby pay: 1 standby per batch × 4 hrs × $30 = $120 per batch.
// Nine batches across Q2–Q4 × $120 = $1,080 in paid standby shifts;
// the $1,200/yr line on the SaltBench cost table also carries a $120
// cancellation reserve for the one batch a year where the primary
// drops at T-1 and the standby is bumped up.
export const STANDBY_HOURS = 4;
export const STANDBY_RATE = CASUAL_HOURLY_RATE;
export const STANDBY_PAID_PER_BATCH = STANDBY_HOURS * STANDBY_RATE;

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export type BatchAssignment = {
  // Week in plan2026 the batch lands in. Mon = receive, Tue = pick,
  // Wed = pack DTC, Thu = label & manifest, Fri = ship & close.
  weekNumber: number;
  // Quarter label used in the calendar header.
  quarter: Quarter;
  // 1-indexed batch number within the quarter. The bench slide uses
  // "Apr / May / Jun" prose; we keep the month for the page UI.
  monthLabel: string;
  // Thursday "label & manifest" date — this is the operations anchor
  // shown on the SaltBench slide as "next slot". The batch actually
  // ships Friday (the day after); use `getShipISO` for that.
  manifestISO: string;
  primary: keyof typeof BENCH;
  // Standby is paid even when the batch ships without calling them in.
  // Rotation distributes standby across the bench so no one carries it
  // every batch — Roger is the seed standby on Apr 30 because he's the
  // freight-day backup on the SaltBench slide.
  standby: keyof typeof BENCH;
};

// Full-year batch schedule — one batch per month, every 4th plan
// week (Q1 is Foundation phase, no batches yet). Q2 primaries match
// the "next slot" column on SaltBench:
//   Apr 30 → Marie · May 28 → Devin · Jun 25 → Jess · Apr 30 backup → Roger.
// Q3/Q4 continue the A → B → C → D rotation policy from the slide,
// distributing primary + standby load across the four bench seats so
// each works 4–5 batches/yr (~2–3 primary, ~2–3 standby). Year-end
// tally: Marie 3P+2S, Devin 2P+2S, Jess 2P+3S, Roger 2P+2S.
export const BATCHES: BatchAssignment[] = [
  {
    weekNumber: 17,
    quarter: "Q2",
    monthLabel: "April",
    manifestISO: "2026-04-30",
    primary: "marie",
    standby: "roger",
  },
  {
    weekNumber: 21,
    quarter: "Q2",
    monthLabel: "May",
    manifestISO: "2026-05-28",
    primary: "devin",
    standby: "jess",
  },
  {
    weekNumber: 25,
    quarter: "Q2",
    monthLabel: "June",
    manifestISO: "2026-06-25",
    primary: "jess",
    standby: "marie",
  },
  {
    weekNumber: 29,
    quarter: "Q3",
    monthLabel: "July",
    manifestISO: "2026-07-23",
    primary: "roger",
    standby: "devin",
  },
  {
    weekNumber: 33,
    quarter: "Q3",
    monthLabel: "August",
    manifestISO: "2026-08-20",
    primary: "marie",
    standby: "jess",
  },
  {
    weekNumber: 37,
    quarter: "Q3",
    monthLabel: "September",
    manifestISO: "2026-09-17",
    primary: "devin",
    standby: "roger",
  },
  {
    weekNumber: 41,
    quarter: "Q4",
    monthLabel: "October",
    manifestISO: "2026-10-15",
    primary: "marie",
    standby: "jess",
  },
  {
    weekNumber: 45,
    quarter: "Q4",
    monthLabel: "November",
    manifestISO: "2026-11-12",
    primary: "roger",
    standby: "devin",
  },
  {
    weekNumber: 49,
    quarter: "Q4",
    monthLabel: "December",
    manifestISO: "2026-12-10",
    primary: "jess",
    standby: "marie",
  },
];

// Friday ship date — one day after the Thursday manifest anchor.
// Cheaper than carrying a second field; the Friday is always the
// next day in the same week per `getBatchDays`.
export function getShipISO(batch: BatchAssignment): string {
  return dateForDayInWeek(batch.weekNumber, "fri");
}

export function getBatchForWeek(weekNumber: number): BatchAssignment | undefined {
  return BATCHES.find((b) => b.weekNumber === weekNumber);
}

export function isBatchWeek(weekNumber: number): boolean {
  return BATCHES.some((b) => b.weekNumber === weekNumber);
}

export function getBatchesByQuarter(quarter: Quarter): BatchAssignment[] {
  return BATCHES.filter((b) => b.quarter === quarter);
}

// What the primary actually does on the batch week, day-by-day. Mirrors
// the SaltRunbook slide (VI · 02): casual labour comes in Tue (pick) and
// Wed (pack), ~14 hrs total.
export type BatchDayAssignment = {
  dayShort: "mon" | "tue" | "wed" | "thu" | "fri";
  dateISO: string;
  block: string;
  who: "primary" | "standby" | "om-only";
  hours: number; // bench hours (excludes OM-only days)
  note: string;
};

export function getBatchDays(batch: BatchAssignment): BatchDayAssignment[] {
  return [
    {
      dayShort: "mon",
      dateISO: dateForDayInWeek(batch.weekNumber, "mon"),
      block: "Receive & stage",
      who: "om-only",
      hours: 0,
      note: "OM pulls salt, jars, lids from depot shelves.",
    },
    {
      dayShort: "tue",
      dateISO: dateForDayInWeek(batch.weekNumber, "tue"),
      block: "Pick wholesale & custom labels",
      who: "primary",
      hours: 6,
      note: "Primary picks the 12 wholesale POs and the month's custom-label run.",
    },
    {
      dayShort: "wed",
      dateISO: dateForDayInWeek(batch.weekNumber, "wed"),
      block: "Pack DTC batch",
      who: "primary",
      hours: 8,
      note: "Primary packs the ~80 DTC orders accumulated over the prior 4 weeks.",
    },
    {
      dayShort: "thu",
      dateISO: dateForDayInWeek(batch.weekNumber, "thu"),
      block: "Label & manifest",
      who: "om-only",
      hours: 0,
      note: "OM runs Shippo labels and books the Friday pickup.",
    },
    {
      dayShort: "fri",
      dateISO: dateForDayInWeek(batch.weekNumber, "fri"),
      block: "Ship & close · standby on call",
      who: "standby",
      hours: STANDBY_HOURS,
      note: "Standby is paid the 4-hr shift even if the batch ships without them being called in.",
    },
  ];
}

export function formatBatchHeadline(batch: BatchAssignment): string {
  return `${batch.monthLabel} batch · manifest ${formatShortDate(batch.manifestISO)} · ships Fri ${formatShortDate(getShipISO(batch))}`;
}

export function getBenchSeat(id: keyof typeof BENCH): BenchSeat {
  return BENCH[id];
}

// Effective batch assignment after applying any per-batch override the
// OM has recorded (see lib/storage `benchOverrides`). Each role exposes:
//   - `id` / `seat`        — who is *actually* working this week
//   - `originalId` / `originalSeat` — the seed assignment, only set
//     when the role was swapped (so the UI can render the
//     "swapped from <original>" note and the bookkeeper can audit
//     the change after the fact)
// Stale or unknown override ids fall through to the seed assignment, so
// a seat removed from the BENCH map can never strand a batch week.
export type EffectiveBenchRole = {
  id: BenchSeatId;
  seat: BenchSeat;
  originalId?: BenchSeatId;
  originalSeat?: BenchSeat;
};

export type EffectiveBatch = {
  primary: EffectiveBenchRole;
  standby: EffectiveBenchRole;
};

export type BenchOverrideInput = {
  primary?: string;
  standby?: string;
};

function resolveRole(
  baseId: BenchSeatId,
  overrideId: string | undefined,
): EffectiveBenchRole {
  if (overrideId && isBenchSeatId(overrideId) && overrideId !== baseId) {
    return {
      id: overrideId,
      seat: BENCH[overrideId],
      originalId: baseId,
      originalSeat: BENCH[baseId],
    };
  }
  return { id: baseId, seat: BENCH[baseId] };
}

export function getEffectiveBatch(
  batch: BatchAssignment,
  override?: BenchOverrideInput,
): EffectiveBatch {
  return {
    primary: resolveRole(batch.primary, override?.primary),
    standby: resolveRole(batch.standby, override?.standby),
  };
}
