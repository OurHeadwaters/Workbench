// Q2 salt batch calendar — surfaced on the Year, Week, and WeekCloseOut
// pages so the bench rotation lives on the operating calendar, not just on
// the SaltBench slide. Names + dates here are the seed roster from
// `src/pages/slides/SaltBench.tsx` (VI · 02b); changing one means changing
// both. The standby paid shift is its own line so the $1,200/yr standby
// cost surfaces in operations, not only in the bench cost table.

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
// Three Q2 batches × $120 = $360 in Q2 (full-year line is $1,200 on
// the SaltBench cost table — the per-batch line shown here is what
// actually books to the cost-centre when the OM closes the week).
export const STANDBY_HOURS = 4;
export const STANDBY_RATE = CASUAL_HOURLY_RATE;
export const STANDBY_PAID_PER_BATCH = STANDBY_HOURS * STANDBY_RATE;

export type BatchAssignment = {
  // Week in plan2026 the batch lands in. Mon = receive, Tue = pick,
  // Wed = pack DTC, Thu = label & manifest, Fri = ship & close.
  weekNumber: number;
  // Quarter label used in the calendar header.
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
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

// Q2 schedule. Primaries match the "next slot" column on SaltBench:
//   Apr 30 → Marie · May 28 → Devin · Jun 25 → Jess · Apr 30 backup → Roger.
// Standbys are then distributed so each seat picks up roughly one paid
// standby per quarter, matching the cost line on the SaltBench slide.
export const Q2_BATCHES: BatchAssignment[] = [
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
];

// Friday ship date — one day after the Thursday manifest anchor.
// Cheaper than carrying a second field; the Friday is always the
// next day in the same week per `getBatchDays`.
export function getShipISO(batch: BatchAssignment): string {
  return dateForDayInWeek(batch.weekNumber, "fri");
}

export function getBatchForWeek(weekNumber: number): BatchAssignment | undefined {
  return Q2_BATCHES.find((b) => b.weekNumber === weekNumber);
}

export function isBatchWeek(weekNumber: number): boolean {
  return Q2_BATCHES.some((b) => b.weekNumber === weekNumber);
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
