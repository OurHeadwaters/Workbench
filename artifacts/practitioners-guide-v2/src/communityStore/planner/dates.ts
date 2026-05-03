export type ScenarioMode = "grants" | "self-fund";

export type AnchorKey =
  | "contractOneStart"
  | "coldChainPilotStart"
  | "lfifIntake"
  | "councilDecision"
  | "iscDecision"
  | "truckLfifIntake";

export type Anchors = Record<AnchorKey, string>;

export const TODAY: string = "2026-05-03";

export const DEFAULT_TRUCK_LFIF_INTAKE = "2026-10-15";

const ANCHOR_LABELS: Record<AnchorKey, string> = {
  contractOneStart: "Contract one starts",
  coldChainPilotStart: "Cold-chain pilot starts",
  lfifIntake: "LFIF intake opens",
  councilDecision: "Council commits to applications",
  iscDecision: "ISC Community Capital decision",
  truckLfifIntake: "Truck LFIF intake (807 partnership)",
};

const ANCHOR_HINTS: Record<AnchorKey, string> = {
  contractOneStart: "Design phase + grant prep begins.",
  coldChainPilotStart: "Pilot truck running with the existing store.",
  lfifIntake: "Load-bearing federal date. Drives everything downstream.",
  councilDecision: "Council says yes to filing the application package.",
  iscDecision: "Longest grant cycle. Often gates the trigger.",
  truckLfifIntake: "Fall 2026 LFIF window. Funds the ice-road truck only.",
};

export function anchorLabel(key: AnchorKey, mode: ScenarioMode): string {
  if (mode === "self-fund" && key === "councilDecision") {
    return "Council commits to private spend";
  }
  return ANCHOR_LABELS[key];
}

export function anchorHint(key: AnchorKey, mode: ScenarioMode): string {
  if (mode === "self-fund" && key === "councilDecision") {
    return "Council votes to spend reserve capital — no grant package needed.";
  }
  return ANCHOR_HINTS[key];
}

export function anchorOrder(mode: ScenarioMode): AnchorKey[] {
  if (mode === "self-fund") {
    return [
      "contractOneStart",
      "coldChainPilotStart",
      "councilDecision",
      "truckLfifIntake",
    ];
  }
  return [
    "contractOneStart",
    "coldChainPilotStart",
    "lfifIntake",
    "councilDecision",
    "iscDecision",
  ];
}

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

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
  fundingSecured: string;
  contractTwoActivates: string;
  buildM1: string;
  buildSoftOpen: string;
  doorsOpen: string;
  buildHandover: string;
  nncFiled: string;
  nncFirstClaim: string;
  totalMonths: number;
  applicationsFiled?: string;
  lfifDecision?: string;
  fedNorDecision?: string;
  truckLfifIntake?: string;
  truckLfifDecision?: string;
  truckArrives?: string;
};

export function derive(a: Anchors, mode: ScenarioMode): Derived {
  const pilotData90 = addDays(a.coldChainPilotStart, 90);

  let fundingSecured: string;
  const grantOnly: Partial<Derived> = {};
  const selfFundOnly: Partial<Derived> = {};

  if (mode === "self-fund") {
    fundingSecured = addDays(a.councilDecision, 30);
    const truckLfifIntake = a.truckLfifIntake;
    const truckLfifDecision = addDays(truckLfifIntake, 150);
    const truckArrives = addDays(truckLfifDecision, 90);
    selfFundOnly.truckLfifIntake = truckLfifIntake;
    selfFundOnly.truckLfifDecision = truckLfifDecision;
    selfFundOnly.truckArrives = truckArrives;
  } else {
    const applicationsFiled = a.lfifIntake;
    const lfifDecision = addDays(a.lfifIntake, 150);
    const fedNorDecision = addDays(applicationsFiled, 150);
    fundingSecured = maxDate([lfifDecision, fedNorDecision, a.iscDecision]);
    grantOnly.applicationsFiled = applicationsFiled;
    grantOnly.lfifDecision = lfifDecision;
    grantOnly.fedNorDecision = fedNorDecision;
  }

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
    fundingSecured,
    contractTwoActivates,
    buildM1,
    buildSoftOpen,
    doorsOpen,
    buildHandover,
    nncFiled,
    nncFirstClaim,
    totalMonths,
    ...grantOnly,
    ...selfFundOnly,
  };
}

export function pct(date: string, start: string, end: string): number {
  const s = new Date(start + "T00:00:00Z").getTime();
  const e = new Date(end + "T00:00:00Z").getTime();
  const d = new Date(date + "T00:00:00Z").getTime();
  if (e <= s) return 0;
  return Math.max(0, Math.min(100, ((d - s) / (e - s)) * 100));
}
