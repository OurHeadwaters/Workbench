/**
 * Pure date math for the Deer Lake Phase Planner.
 *
 * Five user-adjustable anchors drive every other date in the project.
 * The planner trades complexity for legibility — there is no calendar
 * arithmetic engine, just day arithmetic against ISO YYYY-MM-DD strings.
 *
 * Today (in the project's working environment) is April 27, 2026. The
 * Fall 2026 LFIF intake window is the load-bearing date the whole
 * timeline hangs on.
 */

export type AnchorKey =
  | "contractOneStart"
  | "coldChainPilotStart"
  | "lfifIntake"
  | "councilDecision"
  | "iscDecision";

export type Anchors = Record<AnchorKey, string>;

export const TODAY: string = "2026-04-27";

export const ANCHOR_LABELS: Record<AnchorKey, string> = {
  contractOneStart: "Contract one starts",
  coldChainPilotStart: "Cold-chain pilot starts",
  lfifIntake: "LFIF intake opens",
  councilDecision: "Council commits to applications",
  iscDecision: "ISC Community Capital decision",
};

export const ANCHOR_HINTS: Record<AnchorKey, string> = {
  contractOneStart: "Design phase + grant prep begins.",
  coldChainPilotStart: "Pilot truck running with the existing store.",
  lfifIntake: "Load-bearing federal date. Drives everything downstream.",
  councilDecision: "Council says yes to filing the application package.",
  iscDecision: "Longest grant cycle. Often gates the trigger.",
};

// Day-only arithmetic, no timezone games. UTC keeps things deterministic.
export function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function diffDays(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86_400_000);
}

export function maxDate(dates: string[]): string {
  return dates.reduce((acc, d) => (d > acc ? d : acc), dates[0]);
}

export function monthsBetween(a: string, b: string): number {
  const days = diffDays(a, b);
  return Math.round((days / 30.4375) * 10) / 10;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function fmtShort(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function fmtMonthYear(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export type Derived = {
  pilotData90: string;
  applicationsFiled: string;
  lfifDecision: string;
  fedNorDecision: string;
  fundingSecured: string;
  contractTwoActivates: string;
  buildM1: string;
  buildSoftOpen: string;
  doorsOpen: string;
  buildHandover: string;
  nncFiled: string;
  nncFirstClaim: string;
  totalMonths: number;
};

export function derive(a: Anchors): Derived {
  const pilotData90 = addDays(a.coldChainPilotStart, 90);
  const applicationsFiled = a.lfifIntake;
  const lfifDecision = addDays(a.lfifIntake, 150);
  const fedNorDecision = addDays(applicationsFiled, 150);
  const fundingSecured = maxDate([lfifDecision, fedNorDecision, a.iscDecision]);
  const contractTwoActivates = addDays(fundingSecured, 30);
  const buildM1 = contractTwoActivates;
  const buildSoftOpen = addDays(buildM1, 120);
  const doorsOpen = addDays(buildM1, 150);
  const buildHandover = addDays(buildM1, 240);
  const nncFiled = addDays(doorsOpen, 60);
  const nncFirstClaim = addDays(nncFiled, 60);
  const totalMonths = monthsBetween(TODAY, nncFirstClaim);

  return {
    pilotData90,
    applicationsFiled,
    lfifDecision,
    fedNorDecision,
    fundingSecured,
    contractTwoActivates,
    buildM1,
    buildSoftOpen,
    doorsOpen,
    buildHandover,
    nncFiled,
    nncFirstClaim,
    totalMonths,
  };
}

/**
 * For a horizontal Gantt strip, map an ISO date to a 0-100 percentage of
 * the strip's range. Clamps to [0, 100] so a date that falls slightly
 * outside the visible range still pins to an edge instead of vanishing.
 */
export function pct(date: string, start: string, end: string): number {
  const s = new Date(start + "T00:00:00Z").getTime();
  const e = new Date(end + "T00:00:00Z").getTime();
  const d = new Date(date + "T00:00:00Z").getTime();
  if (e <= s) return 0;
  return Math.max(0, Math.min(100, ((d - s) / (e - s)) * 100));
}
