import { useEffect, useState } from "react";

// Shared reader for the bookkeeper's monthly SALT-01 close.
//
// The SaltMonthlyClose page (`/salt-monthly-close`) writes its full
// state to localStorage on every edit; this module re-reads that same
// blob, computes the same monthly net + wholesale CM% the close
// surfaces, and exposes a single "OK / watch / reprice" status the
// agency one-pager (and the budget slide footer) can show without
// having to open the close template.
//
// The shape mirrors `SaltMonthlyClose.tsx`. When that file's schema
// changes, update both. Backend-backed later — for now, localStorage.

export const SALT_CLOSE_STORAGE_KEY = "headwaters-salt-monthly-close-v1";

// Planning baseline used when no live close has been filed yet.
// Sourced from the Part VI Salt P&L slide (~$61k/yr net) and the
// wholesale floor in the chart of accounts.
export const SALT_PLANNING_BASELINE = {
  annualNet: 61000,
  monthlyNet: Math.round(61000 / 12), // ~$5,083
  wholesaleCmPct: 63,
};

export const WHOLESALE_CM_FLOOR = 50;

export type SaltCloseStatus = "ok" | "watch" | "reprice";

export type LatestSaltClose = {
  month: string;
  preparedBy: string;
  preparedOn: string;
  monthInQuarter: 1 | 2 | 3;
  revenue: number;
  net: number;
  // Wholesale this-month CM% (revenue − cogs − freight − packaging) ÷ revenue.
  wholesaleCmPct: number | null;
  // Wholesale QTD CM%, or null when there's no wholesale revenue yet
  // this month or accumulated in the quarter.
  wholesaleQtdCmPct: number | null;
  status: SaltCloseStatus;
  // Why the status landed where it did — short human-readable phrase
  // the one-pager can show as a subtitle.
  statusReason: string;
};

type RawChannelLine = {
  revenue?: unknown;
  cogs?: unknown;
  freight?: unknown;
  packaging?: unknown;
};

type RawQuarterly = {
  priorRevenue?: unknown;
  priorCmDollars?: unknown;
  prevQuarterUnder?: unknown;
};

type RawState = {
  month?: unknown;
  monthInQuarter?: unknown;
  preparedBy?: unknown;
  preparedOn?: unknown;
  channels?: Record<string, RawChannelLine>;
  quarterly?: Record<string, RawQuarterly>;
  omHours?: unknown;
  omRate?: unknown;
  casualHours?: unknown;
  casualRate?: unknown;
  depotAllocation?: unknown;
};

const CHANNEL_KEYS = ["wholesale", "customLabels", "dtcBatch", "markets"] as const;
type ChannelKey = (typeof CHANNEL_KEYS)[number];

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function clampMonthInQuarter(v: unknown): 1 | 2 | 3 {
  const n = Number(v);
  if (n === 1) return 1;
  if (n === 2) return 2;
  return 3;
}

// Parse the raw localStorage blob into the same totals the close
// template renders. Returns null when the blob is missing/unparseable
// or when no actual revenue has been entered yet — in those cases the
// caller should fall back to the planning baseline.
export function readLatestSaltClose(): LatestSaltClose | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(SALT_CLOSE_STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let parsed: RawState;
  try {
    parsed = JSON.parse(raw) as RawState;
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;

  const channels = CHANNEL_KEYS.reduce((acc, k) => {
    const src = parsed.channels?.[k] ?? {};
    acc[k] = {
      revenue: Math.max(0, num(src.revenue)),
      cogs: Math.max(0, num(src.cogs)),
      freight: Math.max(0, num(src.freight)),
      packaging: Math.max(0, num(src.packaging)),
    };
    return acc;
  }, {} as Record<ChannelKey, { revenue: number; cogs: number; freight: number; packaging: number }>);

  const quarterly = CHANNEL_KEYS.reduce((acc, k) => {
    const src = parsed.quarterly?.[k] ?? {};
    acc[k] = {
      priorRevenue: Math.max(0, num(src.priorRevenue)),
      priorCmDollars: num(src.priorCmDollars),
      prevQuarterUnder: Boolean(src.prevQuarterUnder),
    };
    return acc;
  }, {} as Record<ChannelKey, { priorRevenue: number; priorCmDollars: number; prevQuarterUnder: boolean }>);

  const totalRevenue = CHANNEL_KEYS.reduce((s, k) => s + channels[k].revenue, 0);
  if (totalRevenue <= 0) {
    // Nothing's actually been filed yet — let the caller fall back to
    // the baseline. We deliberately do not return a half-empty close
    // record because the one-pager would otherwise show $0 net as if
    // the salt line collapsed.
    return null;
  }

  const totalVariable = CHANNEL_KEYS.reduce(
    (s, k) =>
      s + channels[k].cogs + channels[k].freight + channels[k].packaging,
    0,
  );
  const labour =
    Math.max(0, num(parsed.omHours)) * num(parsed.omRate, 53) +
    Math.max(0, num(parsed.casualHours)) * num(parsed.casualRate, 25);
  const depot = num(parsed.depotAllocation, 300);
  const net = totalRevenue - totalVariable - labour - depot;

  const ws = channels.wholesale;
  const wsVariable = ws.cogs + ws.freight + ws.packaging;
  const wsCmDollars = ws.revenue - wsVariable;
  const wholesaleCmPct = ws.revenue > 0 ? (wsCmDollars / ws.revenue) * 100 : null;

  const wsRoll = quarterly.wholesale;
  const wsQtdRevenue = ws.revenue + wsRoll.priorRevenue;
  const wsQtdCmDollars = wsCmDollars + wsRoll.priorCmDollars;
  const wholesaleQtdCmPct =
    wsQtdRevenue > 0 ? (wsQtdCmDollars / wsQtdRevenue) * 100 : null;

  const monthInQuarter = clampMonthInQuarter(parsed.monthInQuarter);
  const isQuarterEnd = monthInQuarter === 3;

  // Status: matches the wholesale logic in SaltMonthlyClose.
  // - reprice fires at quarter-end when QTD CM% is under 50% AND last
  //   quarter was also under (the actual hard-rule trigger).
  // - watch covers the softer signals: monthly CM% under floor in any
  //   month, or QTD under floor at quarter-end without the prev-Q box
  //   ticked yet.
  let status: SaltCloseStatus = "ok";
  let statusReason = "Wholesale at or above 50% floor.";
  const wholesaleReprice =
    isQuarterEnd &&
    wholesaleQtdCmPct !== null &&
    wholesaleQtdCmPct < WHOLESALE_CM_FLOOR &&
    wsRoll.prevQuarterUnder;
  const wholesaleQtdWatch =
    isQuarterEnd &&
    wholesaleQtdCmPct !== null &&
    wholesaleQtdCmPct < WHOLESALE_CM_FLOOR &&
    !wsRoll.prevQuarterUnder;
  const wholesaleMonthlyWatch =
    !isQuarterEnd &&
    wholesaleCmPct !== null &&
    wholesaleCmPct < WHOLESALE_CM_FLOOR;
  if (wholesaleReprice) {
    status = "reprice";
    statusReason = "Two quarters under 50% — reprice or drop wholesale.";
  } else if (wholesaleQtdWatch) {
    status = "watch";
    statusReason = "Wholesale QTD under floor — flag prev-Q for next quarter.";
  } else if (wholesaleMonthlyWatch) {
    status = "watch";
    statusReason = "Wholesale month under 50% — quarter still in progress.";
  }

  return {
    month: typeof parsed.month === "string" ? parsed.month : "",
    preparedBy: typeof parsed.preparedBy === "string" ? parsed.preparedBy : "",
    preparedOn: typeof parsed.preparedOn === "string" ? parsed.preparedOn : "",
    monthInQuarter,
    revenue: totalRevenue,
    net,
    wholesaleCmPct,
    wholesaleQtdCmPct,
    status,
    statusReason,
  };
}

// Subscribe to the same storage events the rest of the app uses so the
// one-pager updates the moment the bookkeeper saves a fresh close in
// another tab. Within the same tab the close template re-mounts on
// navigation so a normal re-read on mount picks up the change.
export function useLatestSaltClose(): LatestSaltClose | null {
  const [value, setValue] = useState<LatestSaltClose | null>(() =>
    readLatestSaltClose(),
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event: StorageEvent) => {
      if (event.key !== null && event.key !== SALT_CLOSE_STORAGE_KEY) return;
      setValue(readLatestSaltClose());
    };
    window.addEventListener("storage", handler);
    // Re-read on mount to catch any change that happened while the
    // component was unmounted (e.g. the bookkeeper edited the close,
    // navigated back to the one-pager).
    setValue(readLatestSaltClose());
    return () => window.removeEventListener("storage", handler);
  }, []);
  return value;
}
