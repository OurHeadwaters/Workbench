import { useEffect, useMemo, useState } from "react";
import {
  parseShippoExport,
  parseShopifyExport,
  parseSquareExport,
  parseTimesheet,
  type ChannelTotals,
  type ImportSource,
  type ParsedTotals,
  type SkuMapping,
  type TimesheetParse,
} from "../lib/saltImports";

const STORAGE_KEY = "headwaters-salt-monthly-close-v1";
// Per-source "last applied" snapshot. Same prefix as the close so a
// `clear` of the close namespace also wipes the snapshots; keyed by
// upstream source so re-pasting Square doesn't disturb the Shopify diff.
const SNAPSHOT_KEY_PREFIX = `${STORAGE_KEY}:snapshot:`;
const IMPORT_SOURCES: ImportSource[] = ["square", "shopify", "shippo"];
// Filed monthly closes live in a separate blob alongside the in-progress
// state. Kept separate so the lightweight reader in `lib/saltClose.ts`
// (which only cares about the latest in-progress numbers) doesn't need
// to know anything about the history shape.
const FILED_HISTORY_KEY = "headwaters-salt-monthly-close-history-v1";

type ChannelKey = "wholesale" | "customLabels" | "dtcBatch" | "markets";

const CHANNELS: { key: ChannelKey; code: string; label: string; cmFloor: number | null }[] = [
  { key: "wholesale", code: "4400.10", label: "Wholesale", cmFloor: 50 },
  { key: "customLabels", code: "4400.20", label: "Custom labels", cmFloor: 60 },
  { key: "dtcBatch", code: "4400.30", label: "DTC batch", cmFloor: 30 },
  { key: "markets", code: "4400.40", label: "Markets (PR)", cmFloor: null },
];

const DEFAULT_SKU_MAPPING: SkuMapping[] = [
  { sku: "SALT-WHL-", channel: "wholesale" },
  { sku: "SALT-CL-", channel: "customLabels" },
  { sku: "SALT-DTC-", channel: "dtcBatch" },
  { sku: "SALT-MKT-", channel: "markets" },
];

type ChannelLine = {
  revenue: number;
  cogs: number;
  freight: number;
  packaging: number;
};

type QuarterlyRollup = {
  // Sum of the prior months in the same quarter (0–2 months, depending on
  // where in the quarter we are). Bookkeeper carries these forward from the
  // earlier filed monthly close reports.
  priorRevenue: number;
  priorCmDollars: number;
  // Set from the *prior quarter's* filed report — not from memory — so the
  // two-quarters-in-a-row check can't be silently skipped. Mirrors the
  // pattern the hours-by-pillar template uses.
  prevQuarterUnder: boolean;
};

type State = {
  month: string;
  monthInQuarter: 1 | 2 | 3;
  preparedBy: string;
  preparedOn: string;
  channels: Record<ChannelKey, ChannelLine>;
  quarterly: Record<ChannelKey, QuarterlyRollup>;
  omHours: number;
  omRate: number;
  casualHours: number;
  casualRate: number;
  depotAllocation: number;
  notes: string;
  // SKU → channel routing the bookkeeper maintains. Persisted so the
  // map carries forward month over month and only needs editing when a
  // new SKU appears in the upstream exports.
  skuMapping: SkuMapping[];
};

const EMPTY_LINE: ChannelLine = {
  revenue: 0,
  cogs: 0,
  freight: 0,
  packaging: 0,
};

const EMPTY_ROLLUP: QuarterlyRollup = {
  priorRevenue: 0,
  priorCmDollars: 0,
  prevQuarterUnder: false,
};

const DEFAULT_STATE: State = {
  month: "",
  monthInQuarter: 3,
  preparedBy: "",
  preparedOn: "",
  channels: {
    wholesale: { ...EMPTY_LINE },
    customLabels: { ...EMPTY_LINE },
    dtcBatch: { ...EMPTY_LINE },
    markets: { ...EMPTY_LINE },
  },
  quarterly: {
    wholesale: { ...EMPTY_ROLLUP },
    customLabels: { ...EMPTY_ROLLUP },
    dtcBatch: { ...EMPTY_ROLLUP },
    markets: { ...EMPTY_ROLLUP },
  },
  omHours: 0,
  omRate: 53,
  casualHours: 0,
  casualRate: 25,
  depotAllocation: 300,
  notes: "",
  skuMapping: DEFAULT_SKU_MAPPING,
};

const OM_HOURS_CAP = 12;

function parseChannels(raw: unknown): Record<ChannelKey, ChannelLine> {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return CHANNELS.reduce((acc, c) => {
    const ch = (src[c.key] && typeof src[c.key] === "object" ? src[c.key] : {}) as Record<
      string,
      unknown
    >;
    acc[c.key] = {
      revenue: numOr0(ch.revenue),
      cogs: numOr0(ch.cogs),
      freight: numOr0(ch.freight),
      packaging: numOr0(ch.packaging),
    };
    return acc;
  }, {} as Record<ChannelKey, ChannelLine>);
}

function parseQuarterly(raw: unknown): Record<ChannelKey, QuarterlyRollup> {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return CHANNELS.reduce((acc, c) => {
    const q = (src[c.key] && typeof src[c.key] === "object" ? src[c.key] : {}) as Record<
      string,
      unknown
    >;
    acc[c.key] = {
      priorRevenue: numOr0(q.priorRevenue),
      priorCmDollars: Number.isFinite(Number(q.priorCmDollars))
        ? Number(q.priorCmDollars)
        : 0,
      prevQuarterUnder: Boolean(q.prevQuarterUnder),
    };
    return acc;
  }, {} as Record<ChannelKey, QuarterlyRollup>);
}

function copyChannels(src: Record<ChannelKey, ChannelLine>): Record<ChannelKey, ChannelLine> {
  return CHANNELS.reduce((acc, c) => {
    acc[c.key] = { ...src[c.key] };
    return acc;
  }, {} as Record<ChannelKey, ChannelLine>);
}

function copyQuarterly(
  src: Record<ChannelKey, QuarterlyRollup>,
): Record<ChannelKey, QuarterlyRollup> {
  return CHANNELS.reduce((acc, c) => {
    acc[c.key] = { ...src[c.key] };
    return acc;
  }, {} as Record<ChannelKey, QuarterlyRollup>);
}

function loadState(): State {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_STATE;
    const channels = parseChannels(parsed.channels);
    const quarterly = parseQuarterly(parsed.quarterly);
    const monthInQuarter = clampMonthInQuarter(parsed.monthInQuarter);
    const skuMapping: SkuMapping[] = Array.isArray(parsed.skuMapping)
      ? (parsed.skuMapping as unknown[]).reduce<SkuMapping[]>((acc, raw) => {
          if (!raw || typeof raw !== "object") return acc;
          const sku = String((raw as { sku?: unknown }).sku ?? "").trim();
          const channel = (raw as { channel?: unknown }).channel;
          if (!sku) return acc;
          if (
            channel !== "wholesale" &&
            channel !== "customLabels" &&
            channel !== "dtcBatch" &&
            channel !== "markets"
          )
            return acc;
          acc.push({ sku, channel });
          return acc;
        }, [])
      : DEFAULT_SKU_MAPPING;
    return {
      month: String(parsed.month ?? ""),
      monthInQuarter,
      preparedBy: String(parsed.preparedBy ?? ""),
      preparedOn: String(parsed.preparedOn ?? ""),
      channels,
      quarterly,
      omHours: numOr0(parsed.omHours),
      omRate: Number.isFinite(Number(parsed.omRate)) ? Number(parsed.omRate) : 53,
      casualHours: numOr0(parsed.casualHours),
      casualRate: Number.isFinite(Number(parsed.casualRate)) ? Number(parsed.casualRate) : 25,
      depotAllocation: Number.isFinite(Number(parsed.depotAllocation))
        ? Number(parsed.depotAllocation)
        : 300,
      notes: String(parsed.notes ?? ""),
      skuMapping: skuMapping.length > 0 ? skuMapping : DEFAULT_SKU_MAPPING,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function clampMonthInQuarter(v: unknown): 1 | 2 | 3 {
  const n = Number(v);
  if (n === 1) return 1;
  if (n === 2) return 2;
  return 3;
}

function numOr0(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function round0(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(0)}%`;
}

// ─── Per-source apply snapshots ─────────────────────────────────────────
// Each PasteCard remembers the parsed totals from its last successful
// apply. The diff between the *new* parsed totals and that snapshot is
// what the bookkeeper actually needs to reconcile when Square gets
// re-pulled mid-week — "what moved since the last apply" — without
// having to choose between Replace (lose other manual overrides) or Add
// (double-count the rows that didn't change).

export type AppliedSnapshot = {
  byChannel: Record<ChannelKey, ChannelTotals>;
  fields: (keyof ChannelTotals)[];
  appliedAt: string;
  rowCount: number;
};

function snapshotKey(source: ImportSource): string {
  return SNAPSHOT_KEY_PREFIX + source;
}

function loadSnapshot(source: ImportSource): AppliedSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(snapshotKey(source));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const byChannel = CHANNELS.reduce((acc, c) => {
      const src = (parsed.byChannel as Record<string, unknown>)?.[c.key] ?? {};
      const s = src as Record<string, unknown>;
      acc[c.key] = {
        revenue: Number(s.revenue) || 0,
        cogs: Number(s.cogs) || 0,
        freight: Number(s.freight) || 0,
        packaging: Number(s.packaging) || 0,
      };
      return acc;
    }, {} as Record<ChannelKey, ChannelTotals>);
    const allowedFields = new Set(["revenue", "cogs", "freight", "packaging"]);
    const fields: (keyof ChannelTotals)[] = Array.isArray(parsed.fields)
      ? (parsed.fields as unknown[]).filter(
          (f): f is keyof ChannelTotals =>
            typeof f === "string" && allowedFields.has(f),
        )
      : [];
    return {
      byChannel,
      fields,
      appliedAt: String(parsed.appliedAt ?? ""),
      rowCount: Number(parsed.rowCount) || 0,
    };
  } catch {
    return null;
  }
}

function saveSnapshot(source: ImportSource, snap: AppliedSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(snapshotKey(source), JSON.stringify(snap));
  } catch {
    // ignore quota / privacy-mode failures
  }
}

function clearAllSnapshots(): void {
  if (typeof window === "undefined") return;
  try {
    for (const s of IMPORT_SOURCES) {
      window.localStorage.removeItem(snapshotKey(s));
    }
  } catch {
    // ignore
  }
}

function fmtAppliedAt(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fmtDelta(n: number): string {
  if (!Number.isFinite(n) || Math.round(n) === 0) return "—";
  const sign = n > 0 ? "+" : "−";
  const abs = Math.abs(Math.round(n));
  return `${sign}$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

// ─── Filed-close history ─────────────────────────────────────────────
// A snapshot of the in-progress State at the moment the bookkeeper
// "files" the close. Stored in its own localStorage key so the
// lightweight reader in `lib/saltClose.ts` doesn't need to learn the
// history shape. Per-channel `revenue` + `cmDollars` (derived from the
// stored line) are what the prior-months-in-quarter rollup auto-suggest
// reads back, so the bookkeeper never has to retype last month's CM$.
type FiledClose = {
  id: string;
  filedAt: string; // ISO timestamp
  month: string;
  monthInQuarter: 1 | 2 | 3;
  preparedBy: string;
  preparedOn: string;
  channels: Record<ChannelKey, ChannelLine>;
  // Snapshot of the quarterly rollup as it was filed — needed so the
  // last-quarter-3 close can be replayed into a QTD CM% for the
  // auto-prev-quarter-under-floor signal.
  quarterly: Record<ChannelKey, QuarterlyRollup>;
  omHours: number;
  omRate: number;
  casualHours: number;
  casualRate: number;
  depotAllocation: number;
  notes: string;
};

function parseFiledClose(raw: unknown): FiledClose | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id =
    typeof r.id === "string" && r.id
      ? r.id
      : `f_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const filedAt =
    typeof r.filedAt === "string" && r.filedAt
      ? r.filedAt
      : new Date().toISOString();
  return {
    id,
    filedAt,
    month: typeof r.month === "string" ? r.month : "",
    monthInQuarter: clampMonthInQuarter(r.monthInQuarter),
    preparedBy: typeof r.preparedBy === "string" ? r.preparedBy : "",
    preparedOn: typeof r.preparedOn === "string" ? r.preparedOn : "",
    channels: parseChannels(r.channels),
    quarterly: parseQuarterly(r.quarterly),
    omHours: numOr0(r.omHours),
    omRate: Number.isFinite(Number(r.omRate)) ? Number(r.omRate) : 53,
    casualHours: numOr0(r.casualHours),
    casualRate: Number.isFinite(Number(r.casualRate)) ? Number(r.casualRate) : 25,
    depotAllocation: Number.isFinite(Number(r.depotAllocation))
      ? Number(r.depotAllocation)
      : 300,
    notes: typeof r.notes === "string" ? r.notes : "",
  };
}

function loadFiledHistory(): FiledClose[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FILED_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: FiledClose[] = [];
    for (const r of parsed) {
      const fc = parseFiledClose(r);
      if (fc) out.push(fc);
    }
    out.sort((a, b) => a.filedAt.localeCompare(b.filedAt));
    return out;
  } catch {
    return [];
  }
}

// Compute per-channel month CM$ + month revenue for a single filed
// close. Used both by the prior-months-in-quarter auto-suggest and by
// the prev-quarter-under-floor derivation.
function channelMonthMetrics(
  close: FiledClose,
): Record<ChannelKey, { revenue: number; cmDollars: number }> {
  return CHANNELS.reduce((acc, c) => {
    const line = close.channels[c.key];
    const variable = line.cogs + line.freight + line.packaging;
    acc[c.key] = {
      revenue: line.revenue,
      cmDollars: line.revenue - variable,
    };
    return acc;
  }, {} as Record<ChannelKey, { revenue: number; cmDollars: number }>);
}

// Walk filed in reverse chronological order looking for the contiguous
// chain of months that fill out the *current* quarter — i.e. for a
// month-3 in-progress close, find the month-2 then month-1 immediately
// before it. Stops at the first non-matching slot so a stray gap (a
// reset, a re-filing, jumping quarters) doesn't pull stale numbers.
function computePriorChain(
  filed: FiledClose[],
  monthInQuarter: 1 | 2 | 3,
): FiledClose[] {
  if (monthInQuarter === 1) return [];
  let expected: number = monthInQuarter - 1;
  const chain: FiledClose[] = [];
  for (let i = filed.length - 1; i >= 0; i--) {
    if (filed[i].monthInQuarter === expected) {
      chain.unshift(filed[i]);
      expected -= 1;
      if (expected < 1) break;
    } else {
      break;
    }
  }
  return chain;
}

export default function SaltMonthlyClose() {
  const [state, setState] = useState<State>(() => loadState());
  // Bump on every reset so each PasteCard knows to reload its snapshot
  // from localStorage. Without this, a card would keep showing a stale
  // "Last applied" indicator and an enabled "Apply diff only" button
  // even after the snapshot has been wiped — exactly the kind of
  // divergence between preview and apply behaviour that the diff
  // feature is supposed to prevent.
  const [snapshotResetCounter, setSnapshotResetCounter] = useState(0);
  const [filed, setFiled] = useState<FiledClose[]>(() => loadFiledHistory());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [justFiledId, setJustFiledId] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / privacy-mode failures
    }
  }, [state]);

  useEffect(() => {
    try {
      window.localStorage.setItem(FILED_HISTORY_KEY, JSON.stringify(filed));
    } catch {
      // ignore quota / privacy-mode failures
    }
  }, [filed]);

  const updateChannel = (key: ChannelKey, patch: Partial<ChannelLine>) => {
    setState((prev) => ({
      ...prev,
      channels: { ...prev.channels, [key]: { ...prev.channels[key], ...patch } },
    }));
  };

  const updateQuarterly = (key: ChannelKey, patch: Partial<QuarterlyRollup>) => {
    setState((prev) => ({
      ...prev,
      quarterly: { ...prev.quarterly, [key]: { ...prev.quarterly[key], ...patch } },
    }));
  };

  // Apply a parsed import. `fields` is the subset of the channel line we
  // own — Square owns revenue+cogs, Shopify owns revenue+cogs+freight,
  // Shippo owns freight+packaging. `mode` is one of:
  //   - "replace": overwrite the owned fields with the parsed totals
  //   - "add":     sum the parsed totals into the owned fields (useful
  //                when two sources contribute the same field for the
  //                same channel)
  //   - "diff":    apply only the change since the last apply for this
  //                source — i.e. cur += parsed − snapshot. Lets the
  //                bookkeeper re-paste a corrected Square export and
  //                only the lines that actually moved get touched, with
  //                manual overrides on other channels left alone.
  // After every apply (regardless of mode), the parsed totals become the
  // new snapshot for that source, so the next paste's diff is computed
  // against the freshest baseline.
  const applyImport = (
    parsed: ParsedTotals,
    fields: (keyof ChannelTotals)[],
    mode: "replace" | "add" | "diff",
  ) => {
    const snapshot = mode === "diff" ? loadSnapshot(parsed.source) : null;
    setState((prev) => {
      const next = { ...prev.channels } as Record<ChannelKey, ChannelLine>;
      for (const key of Object.keys(next) as ChannelKey[]) {
        const cur = { ...next[key] };
        const incoming = parsed.byChannel[key];
        for (const f of fields) {
          if (mode === "replace") {
            cur[f] = round0(incoming[f]);
          } else if (mode === "add") {
            cur[f] = round0(cur[f] + incoming[f]);
          } else {
            // diff: only apply the delta since the last snapshot. If
            // there's no prior snapshot, treat it as zero so the first
            // diff-apply behaves like an add (which is what the
            // bookkeeper expects from a fresh source).
            const prevSnap = snapshot?.byChannel[key]?.[f] ?? 0;
            cur[f] = round0(cur[f] + (incoming[f] - prevSnap));
          }
        }
        next[key] = cur;
      }
      return { ...prev, channels: next };
    });
    saveSnapshot(parsed.source, {
      byChannel: parsed.byChannel,
      fields,
      appliedAt: new Date().toISOString(),
      rowCount: parsed.rowCount,
    });
  };

  const updateSkuMapping = (next: SkuMapping[]) => {
    setState((prev) => ({ ...prev, skuMapping: next }));
  };

  const reset = () => {
    clearAllSnapshots();
    setSnapshotResetCounter((n) => n + 1);
    setState({ ...DEFAULT_STATE, skuMapping: state.skuMapping });
  };
  const resetIncludingSkuMapping = () => {
    clearAllSnapshots();
    setSnapshotResetCounter((n) => n + 1);
    setState(DEFAULT_STATE);
  };
  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  // File the current in-progress close as a snapshot. Re-filing the same
  // month (matched case-insensitively, after trimming) replaces the
  // previous snapshot so the bookkeeper can correct a mistake without
  // ending up with two competing copies of "Mar 2026" in the rollup.
  const fileClose = () => {
    if (typeof window !== "undefined") {
      const totalRev = CHANNELS.reduce(
        (s, c) => s + state.channels[c.key].revenue,
        0,
      );
      if (totalRev <= 0) {
        const ok = window.confirm(
          "No channel revenue entered. File this close anyway?",
        );
        if (!ok) return;
      }
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `f_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const monthKey = state.month.trim().toLowerCase();
    const snapshot: FiledClose = {
      id,
      filedAt: now,
      month: state.month,
      monthInQuarter: state.monthInQuarter,
      preparedBy: state.preparedBy,
      preparedOn: state.preparedOn,
      channels: copyChannels(state.channels),
      quarterly: copyQuarterly(state.quarterly),
      omHours: state.omHours,
      omRate: state.omRate,
      casualHours: state.casualHours,
      casualRate: state.casualRate,
      depotAllocation: state.depotAllocation,
      notes: state.notes,
    };
    setFiled((prev) => {
      const filtered = monthKey
        ? prev.filter((f) => f.month.trim().toLowerCase() !== monthKey)
        : prev.slice();
      filtered.push(snapshot);
      filtered.sort((a, b) => a.filedAt.localeCompare(b.filedAt));
      return filtered;
    });
    setJustFiledId(id);
    setHistoryOpen(true);
  };

  // Reopen a filed close: pull every field back into the in-progress
  // state and remove the snapshot from the list (so re-filing replaces
  // it cleanly instead of leaving an orphan duplicate). Skips the
  // confirm prompt when the in-progress state is the empty default.
  const reopenClose = (id: string) => {
    const close = filed.find((f) => f.id === id);
    if (!close) return;
    const hasInProgressData =
      state.month.trim() !== "" ||
      CHANNELS.some(
        (c) =>
          state.channels[c.key].revenue > 0 ||
          state.channels[c.key].cogs > 0 ||
          state.channels[c.key].freight > 0 ||
          state.channels[c.key].packaging > 0,
      );
    if (hasInProgressData && typeof window !== "undefined") {
      const ok = window.confirm(
        "Reopen this filed close? The current in-progress numbers will be replaced.",
      );
      if (!ok) return;
    }
    setState((prev) => ({
      ...prev,
      month: close.month,
      monthInQuarter: close.monthInQuarter,
      preparedBy: close.preparedBy,
      preparedOn: close.preparedOn,
      channels: copyChannels(close.channels),
      quarterly: copyQuarterly(close.quarterly),
      omHours: close.omHours,
      omRate: close.omRate,
      casualHours: close.casualHours,
      casualRate: close.casualRate,
      depotAllocation: close.depotAllocation,
      notes: close.notes,
    }));
    setFiled((prev) => prev.filter((f) => f.id !== id));
    setJustFiledId(null);
  };

  const deleteClose = (id: string) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "Delete this filed close? It can't be recovered (the prior-month rollup will fall back to manual entry).",
      );
      if (!ok) return;
    }
    setFiled((prev) => prev.filter((f) => f.id !== id));
    if (justFiledId === id) setJustFiledId(null);
  };

  // Monthly totals — what posts to the agency P&L this month.
  const totals = useMemo(() => {
    const rev = CHANNELS.reduce((s, c) => s + state.channels[c.key].revenue, 0);
    const cogs = CHANNELS.reduce((s, c) => s + state.channels[c.key].cogs, 0);
    const freight = CHANNELS.reduce((s, c) => s + state.channels[c.key].freight, 0);
    const pack = CHANNELS.reduce((s, c) => s + state.channels[c.key].packaging, 0);
    const variable = cogs + freight + pack;
    const labour = state.omHours * state.omRate + state.casualHours * state.casualRate;
    const depot = state.depotAllocation;
    const net = rev - variable - labour - depot;
    return { rev, cogs, freight, pack, variable, labour, depot, net };
  }, [state]);

  // Per-channel monthly CM (before labour & depot — same definition as the slide).
  const channelMetrics = useMemo(() => {
    return CHANNELS.map((c) => {
      const line = state.channels[c.key];
      const variable = line.cogs + line.freight + line.packaging;
      const cmDollars = line.revenue - variable;
      const cmPct = line.revenue > 0 ? (cmDollars / line.revenue) * 100 : 0;
      const belowFloor =
        c.cmFloor !== null && line.revenue > 0 && cmPct < c.cmFloor;
      return { channel: c, line, variable, cmDollars, cmPct, belowFloor };
    });
  }, [state.channels]);

  // The contiguous chain of filed closes that fill out the prior months
  // in *this* quarter. e.g. when the in-progress month is month-3, this
  // is [month-1 close, month-2 close] if both have been filed in order.
  const priorChain = useMemo(
    () => computePriorChain(filed, state.monthInQuarter),
    [filed, state.monthInQuarter],
  );

  // Sum of priorChain per channel — what the bookkeeper used to retype
  // by hand into the Prior months rev / Prior months CM $ fields.
  const autoPriorRollup = useMemo<
    Record<ChannelKey, { revenue: number; cmDollars: number }>
  >(() => {
    const acc = CHANNELS.reduce((a, c) => {
      a[c.key] = { revenue: 0, cmDollars: 0 };
      return a;
    }, {} as Record<ChannelKey, { revenue: number; cmDollars: number }>);
    for (const close of priorChain) {
      const m = channelMonthMetrics(close);
      for (const c of CHANNELS) {
        acc[c.key].revenue += m[c.key].revenue;
        acc[c.key].cmDollars += m[c.key].cmDollars;
      }
    }
    return acc;
  }, [priorChain]);

  // True when the manual rollup numbers already match the auto-suggest
  // (within $1 to absorb rounding). Used to disable the "Use these"
  // button so the bookkeeper isn't tempted to keep clicking it.
  const priorRollupMatches = useMemo(() => {
    if (priorChain.length === 0) return false;
    return CHANNELS.every((c) => {
      const sug = autoPriorRollup[c.key];
      const cur = state.quarterly[c.key];
      return (
        Math.abs(round0(sug.revenue) - round0(cur.priorRevenue)) <= 1 &&
        Math.abs(round0(sug.cmDollars) - round0(cur.priorCmDollars)) <= 1
      );
    });
  }, [priorChain.length, autoPriorRollup, state.quarterly]);

  // Most recent filed close that itself was a quarter-close (month 3).
  // Replayed into a QTD CM% to produce the auto "prev quarter under
  // floor?" signal. Excludes any month-3 close that's part of the
  // current quarter chain (would be a self-reference).
  const lastQuarterCloseEntry = useMemo<FiledClose | null>(() => {
    const chainIds = new Set(priorChain.map((f) => f.id));
    for (let i = filed.length - 1; i >= 0; i--) {
      const f = filed[i];
      if (f.monthInQuarter === 3 && !chainIds.has(f.id)) return f;
    }
    return null;
  }, [filed, priorChain]);

  const autoPrevQuarterUnder = useMemo<Record<ChannelKey, boolean> | null>(() => {
    if (!lastQuarterCloseEntry) return null;
    const out = {} as Record<ChannelKey, boolean>;
    for (const c of CHANNELS) {
      if (c.cmFloor === null) {
        out[c.key] = false;
        continue;
      }
      const line = lastQuarterCloseEntry.channels[c.key];
      const roll = lastQuarterCloseEntry.quarterly[c.key];
      const variable = line.cogs + line.freight + line.packaging;
      const monthCm = line.revenue - variable;
      const qtdRev = line.revenue + roll.priorRevenue;
      const qtdCm = monthCm + roll.priorCmDollars;
      const cmPct = qtdRev > 0 ? (qtdCm / qtdRev) * 100 : 0;
      out[c.key] = qtdRev > 0 && cmPct < c.cmFloor;
    }
    return out;
  }, [lastQuarterCloseEntry]);

  const usePriorChainSuggestion = () => {
    setState((prev) => {
      const next = copyQuarterly(prev.quarterly);
      for (const c of CHANNELS) {
        next[c.key] = {
          ...next[c.key],
          priorRevenue: round0(autoPriorRollup[c.key].revenue),
          priorCmDollars: round0(autoPriorRollup[c.key].cmDollars),
        };
      }
      return { ...prev, quarterly: next };
    });
  };

  // Per-channel quarter-to-date CM, computed as
  //   (this month CM$ + prior months in this quarter CM$)
  //   / (this month revenue + prior months revenue).
  // The "Reprice / drop" trigger only fires when the QTD CM% is under floor
  // AND the prior quarter's filed report was also under — i.e. two quarters
  // in a row, exactly as the Salt P&L slide says.
  const quarterlyMetrics = useMemo(() => {
    return channelMetrics.map((m) => {
      const roll = state.quarterly[m.channel.key];
      const qtdRevenue = m.line.revenue + roll.priorRevenue;
      const qtdCmDollars = m.cmDollars + roll.priorCmDollars;
      const qtdCmPct = qtdRevenue > 0 ? (qtdCmDollars / qtdRevenue) * 100 : 0;
      const isQuarterEnd = state.monthInQuarter === 3;
      const qtdBelowFloor =
        m.channel.cmFloor !== null && qtdRevenue > 0 && qtdCmPct < m.channel.cmFloor;
      const prevUnder = autoPrevQuarterUnder
        ? autoPrevQuarterUnder[m.channel.key]
        : roll.prevQuarterUnder;
      const triggersReprice = isQuarterEnd && qtdBelowFloor && prevUnder;
      return {
        ...m,
        qtdRevenue,
        qtdCmDollars,
        qtdCmPct,
        qtdBelowFloor,
        triggersReprice,
        prevUnder,
      };
    });
  }, [channelMetrics, state.quarterly, state.monthInQuarter, autoPrevQuarterUnder]);

  const omOverCap = state.omHours > OM_HOURS_CAP;
  const wholesale = quarterlyMetrics.find((m) => m.channel.key === "wholesale");
  const wholesaleReprice = Boolean(wholesale?.triggersReprice);
  const wholesaleQtdWatch = Boolean(
    wholesale?.qtdBelowFloor && state.monthInQuarter === 3 && !wholesaleReprice,
  );

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[5pt] print:mb-[6pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Headwaters · Cost-centre SALT-01 · monthly close
            </div>
            <h1 className="font-display text-[19pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold print:text-[15pt]">
              The bookkeeper&rsquo;s monthly reconciliation into channel-level CM.
            </h1>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>Filed Thursday of batch week</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              Slide VI · 03 reconciles to here
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665] max-w-[60%]">
            Paste the upstream exports below — Square / Shopify / Shippo /
            depot timesheet — and the channel splits drop straight into the
            SALT-01 chart of accounts. Monthly CM%, labour, depot allocation
            and the OM-hours-cap (Rule 01) calculate live from the parsed
            numbers. The wholesale reprice / drop trigger is{" "}
            <span className="font-semibold">quarterly</span>: it only fires at
            the end of a quarter when QTD CM% is under floor and last quarter
            was under too.
          </div>
          <div className="flex gap-[6pt] flex-wrap justify-end">
            <a
              href={`${import.meta.env.BASE_URL}salt-coa`}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#1f3d2e] hover:bg-[#ebe2d0]"
            >
              Open chart of accounts
            </a>
            <button
              type="button"
              onClick={() => setHistoryOpen((v) => !v)}
              title="Show / hide the list of filed monthly closes."
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#1f3d2e] hover:bg-[#ebe2d0]"
            >
              {historyOpen ? "Hide history" : `History (${filed.length})`}
            </button>
            <button
              type="button"
              onClick={reset}
              title="Clear this month's actuals (keeps the SKU map). Hold Shift to also reset the SKU map to the defaults."
              onClickCapture={(e) => {
                if (e.shiftKey) {
                  e.preventDefault();
                  resetIncludingSkuMapping();
                }
              }}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#6b7665] hover:bg-[#ebe2d0]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={fileClose}
              title="Save this close as a filed snapshot. Re-filing the same month replaces the previous snapshot."
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#1f3d2e] bg-[#ebe2d0] text-[#1f3d2e] hover:bg-[#dfd2b4]"
            >
              File this close
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
            >
              Print
            </button>
          </div>
        </div>

        {historyOpen && (
          <FiledCloseHistory
            filed={filed}
            channels={CHANNELS}
            justFiledId={justFiledId}
            currentMonthInQuarter={state.monthInQuarter}
            onReopen={reopenClose}
            onDelete={deleteClose}
          />
        )}

        <div className="grid grid-cols-4 gap-[8pt] mb-[10pt] text-[9pt] print:gap-[6pt] print:mb-[6pt]">
          <FieldBlock label="Month" hint="e.g. Jan 2026">
            <input
              type="text"
              value={state.month}
              onChange={(e) => setState((s) => ({ ...s, month: e.target.value }))}
              placeholder="MMM YYYY"
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            />
          </FieldBlock>
          <FieldBlock label="Month in quarter" hint="1, 2 or 3">
            <select
              value={state.monthInQuarter}
              onChange={(e) =>
                setState((s) => ({ ...s, monthInQuarter: clampMonthInQuarter(e.target.value) }))
              }
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            >
              <option value={1}>Month 1 of quarter</option>
              <option value={2}>Month 2 of quarter</option>
              <option value={3}>Month 3 (quarter close)</option>
            </select>
          </FieldBlock>
          <FieldBlock label="Prepared by" hint="Bookkeeper">
            <input
              type="text"
              value={state.preparedBy}
              onChange={(e) => setState((s) => ({ ...s, preparedBy: e.target.value }))}
              placeholder="Name"
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            />
          </FieldBlock>
          <FieldBlock label="Prepared on" hint="Date filed">
            <input
              type="text"
              value={state.preparedOn}
              onChange={(e) => setState((s) => ({ ...s, preparedOn: e.target.value }))}
              placeholder="YYYY-MM-DD"
              className="w-full bg-transparent font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
            />
          </FieldBlock>
        </div>

        <ImportSection
          skuMapping={state.skuMapping}
          onSkuMappingChange={updateSkuMapping}
          onApply={applyImport}
          snapshotResetCounter={snapshotResetCounter}
          onTimesheetApply={(parsed) =>
            // Keep decimal hours so the Rule 01 cap evaluates honestly
            // around the 12-hour threshold (10.6 hrs rounds to 11 and
            // hides a near-cap month).
            setState((prev) => ({
              ...prev,
              omHours: Number.isFinite(parsed.hours) ? Math.max(0, parsed.hours) : 0,
            }))
          }
        />

        <table
          className="w-full text-[9pt] border-collapse mb-[8pt] print:text-[8.5pt]"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold align-bottom">
              <th className="py-[4pt] pr-[3pt] w-[18%]">Channel · code</th>
              <th className="py-[4pt] px-[2pt] w-[12%] text-right">
                Revenue
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  4400.x
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[10%] text-right">
                COGS
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  5100
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[10%] text-right">
                Freight
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  5200
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[10%] text-right">
                Packaging
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  5300
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[10%] text-right">
                CM $
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  rev − vars
                </div>
              </th>
              <th className="py-[4pt] px-[2pt] w-[8%] text-right">
                CM %
                <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                  vs floor
                </div>
              </th>
              <th className="py-[4pt] pl-[2pt] w-[22%] text-left">Monthly status</th>
            </tr>
          </thead>
          <tbody className="text-[#2a2520] align-top">
            {channelMetrics.map(({ channel, line, cmDollars, cmPct, belowFloor }) => (
              <tr
                key={channel.key}
                className="border-b border-[#e3dac4]"
                style={{
                  background: belowFloor ? "#fbeed1" : "transparent",
                }}
              >
                <td className="py-[4pt] pr-[3pt]">
                  <div className="font-semibold text-[#1f3d2e] leading-tight">
                    {channel.label}
                  </div>
                  <div className="font-mono text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
                    {channel.code}
                    {channel.cmFloor !== null && ` · floor ${channel.cmFloor}%`}
                  </div>
                </td>
                <td className="py-[4pt] px-[2pt] text-right">
                  <NumberInput
                    value={line.revenue}
                    onChange={(v) => updateChannel(channel.key, { revenue: v })}
                    prefix="$"
                  />
                </td>
                <td className="py-[4pt] px-[2pt] text-right">
                  <NumberInput
                    value={line.cogs}
                    onChange={(v) => updateChannel(channel.key, { cogs: v })}
                    prefix="$"
                  />
                </td>
                <td className="py-[4pt] px-[2pt] text-right">
                  <NumberInput
                    value={line.freight}
                    onChange={(v) => updateChannel(channel.key, { freight: v })}
                    prefix="$"
                  />
                </td>
                <td className="py-[4pt] px-[2pt] text-right">
                  <NumberInput
                    value={line.packaging}
                    onChange={(v) => updateChannel(channel.key, { packaging: v })}
                    prefix="$"
                  />
                </td>
                <td className="py-[4pt] px-[2pt] text-right font-mono font-semibold text-[#1f3d2e]">
                  {line.revenue > 0 ? fmt(cmDollars) : "—"}
                </td>
                <td
                  className="py-[4pt] px-[2pt] text-right font-semibold"
                  style={{
                    color: line.revenue === 0
                      ? "#6b7665"
                      : belowFloor
                      ? "#a07a18"
                      : "#1f3d2e",
                  }}
                >
                  {line.revenue > 0 ? fmtPct(cmPct) : "—"}
                </td>
                <td className="py-[4pt] pl-[2pt] text-left text-[8.5pt] font-semibold print:text-[8pt]">
                  {belowFloor ? (
                    <span className="text-[#a07a18]">
                      Under floor — feeds quarterly
                    </span>
                  ) : line.revenue > 0 ? (
                    <span className="text-[#1f3d2e]">OK</span>
                  ) : (
                    <span className="text-[#6b7665] font-normal">—</span>
                  )}
                </td>
              </tr>
            ))}
            <tr className="border-b-2 border-[#1f3d2e] bg-[#ebe2d0]">
              <td className="py-[5pt] pr-[3pt] font-display text-[10.5pt] text-[#1f3d2e] font-semibold print:text-[10pt]">
                Salt line · this month
              </td>
              <td className="py-[5pt] px-[2pt] text-right font-mono font-semibold text-[#1f3d2e]">
                {fmt(totals.rev)}
              </td>
              <td className="py-[5pt] px-[2pt] text-right font-mono text-[#1f3d2e]">
                {fmt(totals.cogs)}
              </td>
              <td className="py-[5pt] px-[2pt] text-right font-mono text-[#1f3d2e]">
                {fmt(totals.freight)}
              </td>
              <td className="py-[5pt] px-[2pt] text-right font-mono text-[#1f3d2e]">
                {fmt(totals.pack)}
              </td>
              <td
                colSpan={3}
                className="py-[5pt] px-[2pt] text-right font-mono text-[#6b7665] text-[8.5pt] italic print:text-[8pt]"
              >
                Variable cost {fmt(totals.variable)} · before labour & depot
              </td>
            </tr>
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-[10pt] mb-[10pt] print:gap-[6pt] print:mb-[6pt]">
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[5pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold mb-[5pt] print:text-[7pt] print:mb-[3pt]">
              Allocated labour · 5400
            </div>
            <div className="space-y-[4pt] text-[9pt] print:text-[8.5pt]">
              <LabourRow
                label="OM hours this month"
                hint={`Cap ${OM_HOURS_CAP} hrs/mo (Rule 01)`}
                value={state.omHours}
                onChange={(v) => setState((s) => ({ ...s, omHours: v }))}
                rateValue={state.omRate}
                onRateChange={(v) => setState((s) => ({ ...s, omRate: v }))}
                flag={omOverCap ? "Over cap" : null}
              />
              <LabourRow
                label="Casual bench hours"
                hint="Loaded rate from depot bench"
                value={state.casualHours}
                onChange={(v) => setState((s) => ({ ...s, casualHours: v }))}
                rateValue={state.casualRate}
                onRateChange={(v) => setState((s) => ({ ...s, casualRate: v }))}
                flag={null}
              />
              <div className="flex items-baseline justify-between pt-[4pt] border-t border-[#e3dac4]">
                <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] print:text-[7pt]">
                  Labour total to 5400
                </div>
                <div className="font-display text-[13pt] text-[#1f3d2e] font-semibold print:text-[11pt]">
                  {fmt(totals.labour)}
                </div>
              </div>
            </div>
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] print:p-[5pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold mb-[5pt] print:text-[7pt] print:mb-[3pt]">
              Depot allocation · 5500
            </div>
            <div className="text-[9pt] text-[#2a2520] leading-[1.4] mb-[5pt] print:text-[8.5pt]">
              Default $300 / mo (10% of $3,000 / mo facility line). Override
              only if year-end review of the hours-by-pillar reports stepped
              the allocation up.
            </div>
            <div className="flex items-baseline justify-between pt-[4pt] border-t border-[#e3dac4]">
              <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] print:text-[7pt]">
                Posted to 5500
              </div>
              <div className="inline-flex items-baseline gap-[3pt]">
                <span className="font-mono text-[8pt] text-[#6b7665] print:text-[7.5pt]">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={50}
                  value={Number.isFinite(state.depotAllocation) ? state.depotAllocation : 0}
                  onChange={(e) => setState((s) => ({ ...s, depotAllocation: numOr0(e.target.value) }))}
                  className="w-[60pt] bg-transparent text-right font-display text-[13pt] text-[#1f3d2e] font-semibold border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0 print:text-[11pt]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-[10pt] print:mb-[6pt]">
          <div className="flex items-baseline justify-between mb-[4pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold print:text-[7.5pt]">
              Quarter-to-date rollup (Rule 02 reprice / drop trigger)
            </div>
            <div className="text-[8pt] text-[#6b7665] print:text-[7.5pt]">
              QTD CM% = (this month CM$ + prior months in quarter CM$) ÷ (this month rev + prior rev).
              Trigger fires only at month 3, when QTD &lt; floor and prev quarter was also under.
            </div>
          </div>
          <PriorChainBanner
            monthInQuarter={state.monthInQuarter}
            chain={priorChain}
            channels={CHANNELS}
            rollup={autoPriorRollup}
            matches={priorRollupMatches}
            onApply={usePriorChainSuggestion}
          />
          <table
            className="w-full text-[9pt] border-collapse print:text-[8.5pt]"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="border-b border-[#c8bfa7] text-left text-[#6b7665] font-semibold align-bottom">
                <th className="py-[4pt] pr-[3pt] w-[18%]">Channel</th>
                <th className="py-[4pt] px-[2pt] w-[14%] text-right">
                  Prior months rev
                  <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                    this quarter
                  </div>
                </th>
                <th className="py-[4pt] px-[2pt] w-[14%] text-right">
                  Prior months CM $
                  <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                    this quarter
                  </div>
                </th>
                <th className="py-[4pt] px-[2pt] w-[12%] text-right">
                  QTD CM %
                  <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                    incl. this month
                  </div>
                </th>
                <th className="py-[4pt] px-[2pt] w-[14%] text-center">
                  Prev quarter
                  <div className="font-normal text-[7.5pt] tracking-normal print:text-[7pt]">
                    under floor?
                  </div>
                </th>
                <th className="py-[4pt] pl-[2pt] w-[28%] text-left">Quarterly status</th>
              </tr>
            </thead>
            <tbody className="text-[#2a2520] align-top">
              {quarterlyMetrics.map((m) => {
                const roll = state.quarterly[m.channel.key];
                const isQuarterEnd = state.monthInQuarter === 3;
                const noFloor = m.channel.cmFloor === null;
                const autoPrev = autoPrevQuarterUnder
                  ? autoPrevQuarterUnder[m.channel.key]
                  : null;
                return (
                  <tr
                    key={m.channel.key}
                    className="border-b border-[#e3dac4]"
                    style={{
                      background: m.triggersReprice
                        ? "#f7d7c9"
                        : isQuarterEnd && m.qtdBelowFloor
                        ? "#fbeed1"
                        : "transparent",
                    }}
                  >
                    <td className="py-[4pt] pr-[3pt]">
                      <div className="font-semibold text-[#1f3d2e] leading-tight">
                        {m.channel.label}
                      </div>
                      <div className="font-mono text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
                        {noFloor ? "no floor (PR)" : `floor ${m.channel.cmFloor}%`}
                      </div>
                    </td>
                    <td className="py-[4pt] px-[2pt] text-right">
                      <NumberInput
                        value={roll.priorRevenue}
                        onChange={(v) => updateQuarterly(m.channel.key, { priorRevenue: v })}
                        prefix="$"
                      />
                    </td>
                    <td className="py-[4pt] px-[2pt] text-right">
                      <NumberInput
                        value={roll.priorCmDollars}
                        onChange={(v) => updateQuarterly(m.channel.key, { priorCmDollars: v })}
                        prefix="$"
                        allowNegative
                      />
                    </td>
                    <td
                      className="py-[4pt] px-[2pt] text-right font-semibold"
                      style={{
                        color: m.qtdRevenue === 0
                          ? "#6b7665"
                          : m.qtdBelowFloor
                          ? "#b85a3e"
                          : "#1f3d2e",
                      }}
                    >
                      {m.qtdRevenue > 0 ? fmtPct(m.qtdCmPct) : "—"}
                    </td>
                    <td className="py-[4pt] px-[2pt] text-center">
                      {autoPrev !== null ? (
                        <div className="flex flex-col items-center gap-[1pt]">
                          <span
                            aria-label={
                              autoPrev
                                ? "Prev quarter under floor (auto)"
                                : "Prev quarter at or above floor (auto)"
                            }
                            className={`inline-flex w-[12pt] h-[12pt] border items-center justify-center rounded-[1pt] ${
                              noFloor
                                ? "border-[#e3dac4] opacity-30"
                                : autoPrev
                                ? "bg-[#1f3d2e] border-[#1f3d2e] text-[#f4ede0]"
                                : "border-[#1f3d2e]"
                            }`}
                          >
                            {!noFloor && autoPrev && (
                              <span className="font-mono text-[8pt] leading-none">✓</span>
                            )}
                          </span>
                          {!noFloor && (
                            <span
                              className="font-mono uppercase tracking-[0.14em] text-[6.5pt] text-[#6b7665] leading-tight print:text-[6pt]"
                              title={`Auto-derived from filed close “${
                                lastQuarterCloseEntry?.month || "—"
                              }”`}
                            >
                              auto
                            </span>
                          )}
                        </div>
                      ) : (
                        <label className="inline-flex items-center justify-center cursor-pointer print:cursor-auto">
                          <input
                            type="checkbox"
                            checked={roll.prevQuarterUnder}
                            disabled={noFloor}
                            onChange={(e) =>
                              updateQuarterly(m.channel.key, {
                                prevQuarterUnder: e.target.checked,
                              })
                            }
                            className="print-hide w-[12pt] h-[12pt] accent-[#1f3d2e] disabled:opacity-30"
                          />
                          <span
                            aria-hidden
                            className="hidden print:inline-flex w-[10pt] h-[10pt] border border-[#1f3d2e] items-center justify-center"
                          >
                            {roll.prevQuarterUnder && (
                              <span className="font-mono text-[8pt] leading-none">✓</span>
                            )}
                          </span>
                        </label>
                      )}
                    </td>
                    <td className="py-[4pt] pl-[2pt] text-left text-[8.5pt] font-semibold print:text-[8pt]">
                      {noFloor ? (
                        <span className="text-[#6b7665] font-normal">PR · no trigger</span>
                      ) : m.triggersReprice ? (
                        <span className="text-[#b85a3e]">Reprice / drop</span>
                      ) : isQuarterEnd && m.qtdBelowFloor ? (
                        <span className="text-[#a07a18]">QTD under — flag prev Q box for next Q</span>
                      ) : !isQuarterEnd ? (
                        <span className="text-[#6b7665] font-normal">
                          QTD calculates; trigger fires at month 3
                        </span>
                      ) : m.qtdRevenue > 0 ? (
                        <span className="text-[#1f3d2e]">OK · at or above floor</span>
                      ) : (
                        <span className="text-[#6b7665] font-normal">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {lastQuarterCloseEntry && (
            <div className="mt-[3pt] text-[7.5pt] text-[#6b7665] italic leading-[1.4] print:text-[7pt]">
              Prev-quarter checkbox auto-set from the filed close
              {" "}
              <span className="font-mono text-[#1f3d2e]">
                {lastQuarterCloseEntry.month || "(unnamed)"}
              </span>{" "}
              · per-channel QTD CM% replayed from that snapshot. Reopen the
              close from the history drawer below to override the source data.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10pt] mb-[10pt] print:gap-[6pt] print:mb-[6pt]">
          <div
            className="rounded-[3pt] p-[10pt] print:p-[6pt]"
            style={{ background: "#1f3d2e", color: "#f4ede0" }}
          >
            <div
              className="font-mono uppercase tracking-[0.2em] text-[8pt] font-semibold mb-[3pt] print:text-[7pt] print:mb-[1pt]"
              style={{ color: "#e9c8a8" }}
            >
              Net contribution to 8400
            </div>
            <div className="font-display text-[24pt] leading-tight font-semibold print:text-[18pt]">
              {fmt(totals.net)}
            </div>
            <div className="text-[8.5pt] mt-[3pt] leading-[1.4] print:text-[8pt] print:leading-[1.3]">
              Revenue {fmt(totals.rev)} − variable {fmt(totals.variable)} −
              labour {fmt(totals.labour)} − depot {fmt(totals.depot)}. Posts as
              a single line to the agency P&amp;L.
            </div>
          </div>
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[10pt] print:p-[6pt]">
            <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold mb-[3pt] print:text-[7pt] print:mb-[1pt]">
              Status this close
            </div>
            <div className="font-display text-[14pt] text-[#1f3d2e] font-semibold leading-tight print:text-[12pt]">
              {wholesaleReprice
                ? "Reprice / drop wholesale"
                : omOverCap
                ? "Cancel next batch — OM over cap"
                : wholesaleQtdWatch
                ? "Watch — wholesale QTD under floor"
                : totals.rev > 0
                ? "Hard rules hold"
                : "—"}
            </div>
            <ul className="text-[8.5pt] text-[#2a2520] mt-[4pt] space-y-[2pt] leading-[1.4] print:text-[8pt] print:leading-[1.3] list-disc list-inside">
              <li>
                Rule 01 · OM salt hours{" "}
                <span className="font-mono">{state.omHours.toFixed(1)} / {OM_HOURS_CAP}</span>{" "}
                {omOverCap ? "— next batch cancelled, not absorbed." : "— within monthly cap."}
              </li>
              <li>
                Rule 02 · wholesale QTD CM%{" "}
                <span className="font-mono">
                  {wholesale && wholesale.qtdRevenue > 0
                    ? fmtPct(wholesale.qtdCmPct)
                    : "—"}
                </span>{" "}
                {wholesaleReprice
                  ? "— second quarter under 50%, channel repriced or dropped."
                  : state.monthInQuarter < 3
                  ? "— quarter still in progress; trigger evaluates at month 3."
                  : wholesaleQtdWatch
                  ? "— this quarter under 50%; if the prev-Q box gets ticked from this report next quarter and QTD is under again, the channel cuts."
                  : "— at or above floor."}
              </li>
              <li>
                Quarterly hours-by-pillar share rolls up from these OM hours —{" "}
                <a
                  href={`${import.meta.env.BASE_URL}hours`}
                  className="underline decoration-[#b85a3e] decoration-1 underline-offset-2 print:no-underline"
                >
                  see /hours
                </a>
                .
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-[8pt] print:mb-[5pt]">
          <div className="font-mono uppercase tracking-[0.2em] text-[8.5pt] text-[#b85a3e] font-semibold mb-[4pt] print:text-[7.5pt] print:mb-[2pt]">
            Bookkeeper&rsquo;s notes
          </div>
          <textarea
            value={state.notes}
            onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
            rows={3}
            placeholder="Anything the OM or contractor needs to know about this month — supplier price changes, slipped batches, freight surprises."
            className="w-full bg-transparent text-[9pt] text-[#2a2520] border border-[#c8bfa7] rounded-[2pt] p-[5pt] focus:outline-none focus:border-[#1f3d2e] print:text-[8.5pt] print:border-[#c8bfa7]"
          />
        </div>

        <div className="border-t border-[#c8bfa7] mt-[8pt] pt-[5pt] flex items-center justify-between text-[7.5pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:mt-[5pt] print:pt-[3pt] print:text-[6.5pt]">
          <div>
            Source: SALT-01 chart of accounts · slide VI · 03 (Salt P&amp;L line)
          </div>
          <div className="text-[#1f3d2e] font-semibold">
            Headwaters · SALT-01 monthly close
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldBlock({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono uppercase tracking-[0.2em] text-[7.5pt] text-[#b85a3e] font-semibold print:text-[6.5pt]">
        {label}
      </div>
      {children}
      {hint && (
        <div className="text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
          {hint}
        </div>
      )}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  allowNegative = false,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  allowNegative?: boolean;
}) {
  return (
    <div className="inline-flex items-baseline justify-end gap-[1pt] w-full">
      {prefix && (
        <span className="font-mono text-[8pt] text-[#6b7665] print:text-[7.5pt]">
          {prefix}
        </span>
      )}
      <input
        type="number"
        inputMode="decimal"
        min={allowNegative ? undefined : 0}
        step={1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (!Number.isFinite(next)) return onChange(0);
          if (!allowNegative && next < 0) return onChange(0);
          onChange(next);
        }}
        className="w-full bg-transparent text-right font-mono text-[9pt] text-[#1f3d2e] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
      />
      {suffix && (
        <span className="font-mono text-[8pt] text-[#6b7665] print:text-[7.5pt]">
          {suffix}
        </span>
      )}
    </div>
  );
}

function LabourRow({
  label,
  hint,
  value,
  onChange,
  rateValue,
  onRateChange,
  flag,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  rateValue: number;
  onRateChange: (v: number) => void;
  flag: string | null;
}) {
  const total = value * rateValue;
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-[6pt] items-baseline">
      <div>
        <div className="font-semibold text-[#1f3d2e]">{label}</div>
        {hint && (
          <div className="text-[7.5pt] text-[#6b7665] mt-[1pt] print:text-[7pt]">
            {hint}
          </div>
        )}
      </div>
      <div className="inline-flex items-baseline gap-[3pt]">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={0.5}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(numOr0(e.target.value))}
          className="w-[40pt] bg-transparent text-right font-mono text-[9pt] text-[#1f3d2e] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
        />
        <span className="font-mono text-[7.5pt] text-[#6b7665] print:text-[7pt]">hrs</span>
      </div>
      <div className="inline-flex items-baseline gap-[3pt]">
        <span className="font-mono text-[7.5pt] text-[#6b7665] print:text-[7pt]">@ $</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={1}
          value={Number.isFinite(rateValue) ? rateValue : 0}
          onChange={(e) => onRateChange(numOr0(e.target.value))}
          className="w-[34pt] bg-transparent text-right font-mono text-[9pt] text-[#1f3d2e] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e] print:border-0"
        />
        <span className="font-mono text-[7.5pt] text-[#6b7665] print:text-[7pt]">/hr</span>
      </div>
      <div
        className="font-mono font-semibold text-right min-w-[44pt]"
        style={{ color: flag ? "#b85a3e" : "#1f3d2e" }}
      >
        {fmt(total)}
        {flag && (
          <div className="text-[7.5pt] font-semibold text-[#b85a3e] print:text-[7pt]">
            {flag}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Import section ──────────────────────────────────────────────────────
// Sits above the channel table. Lets the bookkeeper paste each upstream
// export, see how it splits across channels, then commit the parsed totals
// to the channel inputs. Print-hidden — the printed close shows only the
// resulting numbers, not the paste boxes.

type ImportApply = (
  parsed: ParsedTotals,
  fields: (keyof ChannelTotals)[],
  mode: "replace" | "add" | "diff",
) => void;

function ImportSection({
  skuMapping,
  onSkuMappingChange,
  onApply,
  snapshotResetCounter,
  onTimesheetApply,
}: {
  skuMapping: SkuMapping[];
  onSkuMappingChange: (next: SkuMapping[]) => void;
  onApply: ImportApply;
  snapshotResetCounter: number;
  onTimesheetApply: (parsed: TimesheetParse) => void;
}) {
  const [open, setOpen] = useState(true);
  const [mappingOpen, setMappingOpen] = useState(false);

  return (
    <div className="print-hide border border-dashed border-[#c8bfa7] rounded-[3pt] mb-[10pt] bg-[#f7f1e3]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-baseline justify-between gap-[8pt] px-[10pt] py-[7pt] text-left hover:bg-[#ebe2d0] rounded-[3pt]"
      >
        <div>
          <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold">
            Paste exports & classify
          </div>
          <div className="text-[8.5pt] text-[#6b7665] mt-[1pt]">
            Square wholesale invoices · Shopify DTC payouts · Manitoulin /
            Shippo freight · depot timesheet. Channel split is driven by the
            SKU map below; rows that don&rsquo;t match a SKU rule fall to the
            export&rsquo;s default channel.
          </div>
        </div>
        <div className="font-mono text-[10pt] text-[#1f3d2e] shrink-0">
          {open ? "−" : "+"}
        </div>
      </button>

      {open && (
        <div className="px-[10pt] pb-[10pt] space-y-[8pt]">
          <div className="border border-[#c8bfa7] rounded-[3pt] bg-white">
            <button
              type="button"
              onClick={() => setMappingOpen((v) => !v)}
              className="w-full flex items-baseline justify-between gap-[8pt] px-[8pt] py-[5pt] text-left hover:bg-[#f7f1e3]"
            >
              <div>
                <span className="font-mono uppercase tracking-[0.18em] text-[8pt] text-[#1f3d2e] font-semibold">
                  SKU → channel map
                </span>
                <span className="ml-[6pt] text-[8pt] text-[#6b7665]">
                  {skuMapping.length} rule{skuMapping.length === 1 ? "" : "s"} ·
                  prefixes ending in “-” match every SKU starting with that
                  prefix
                </span>
              </div>
              <span className="font-mono text-[9pt] text-[#1f3d2e]">
                {mappingOpen ? "Hide" : "Edit"}
              </span>
            </button>
            {mappingOpen && (
              <SkuMappingEditor mapping={skuMapping} onChange={onSkuMappingChange} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[8pt]">
            <PasteCard
              title="Square — wholesale invoices & POS"
              subtitle="Items export. Posts to channel revenue (4400.x) + COGS (5100)."
              source="square"
              defaultChannel="wholesale"
              parser={(csv, mapping, channel) => parseSquareExport(csv, mapping, channel)}
              fields={["revenue", "cogs"]}
              fieldLabel="rev + COGS"
              skuMapping={skuMapping}
              onApply={onApply}
              snapshotResetCounter={snapshotResetCounter}
              hint='Headers expected: "SKU", "Net Sales" (or "Gross Sales"), "Cost of Goods Sold" (optional). Default channel catches unmapped rows.'
            />
            <PasteCard
              title="Shopify — DTC batch payouts"
              subtitle="Orders export. Posts to revenue (4400.x), COGS (5100), shipping → freight (5200)."
              source="shopify"
              defaultChannel="dtcBatch"
              parser={(csv, mapping, channel) => parseShopifyExport(csv, mapping, channel)}
              fields={["revenue", "cogs", "freight"]}
              fieldLabel="rev + COGS + ship"
              skuMapping={skuMapping}
              onApply={onApply}
              snapshotResetCounter={snapshotResetCounter}
              hint='Headers expected: "Lineitem sku", "Lineitem price", "Lineitem quantity", "Shipping" (per order), "Name" (order id). Refunds & discounts subtract from revenue.'
            />
            <PasteCard
              title="Shippo / Manitoulin — freight"
              subtitle="Shipping-label export. Posts to freight (5200) + packaging (5300)."
              source="shippo"
              defaultChannel="dtcBatch"
              parser={(csv, mapping, channel) => parseShippoExport(csv, mapping, channel)}
              fields={["freight", "packaging"]}
              fieldLabel="freight + pkg"
              skuMapping={skuMapping}
              onApply={onApply}
              snapshotResetCounter={snapshotResetCounter}
              hint='Headers expected: "Cost". Add a "Channel" column (W/CL/DTC/MK or 4400.x) to split, or a "Reference 1" that matches a SKU rule. Otherwise everything goes to the default channel.'
            />
            <TimesheetCard onApply={onTimesheetApply} />
          </div>
        </div>
      )}
    </div>
  );
}

function SkuMappingEditor({
  mapping,
  onChange,
}: {
  mapping: SkuMapping[];
  onChange: (next: SkuMapping[]) => void;
}) {
  const updateRow = (idx: number, patch: Partial<SkuMapping>) => {
    const next = mapping.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };
  const removeRow = (idx: number) => {
    const next = mapping.slice();
    next.splice(idx, 1);
    onChange(next);
  };
  const addRow = () => {
    onChange([...mapping, { sku: "", channel: "wholesale" }]);
  };
  return (
    <div className="border-t border-[#e3dac4] px-[8pt] py-[6pt]">
      <table className="w-full text-[8.5pt]" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr className="text-left text-[#6b7665] font-mono uppercase tracking-[0.16em] text-[7.5pt]">
            <th className="pb-[3pt] pr-[4pt] w-[55%]">SKU or prefix (ends in “-”)</th>
            <th className="pb-[3pt] px-[4pt] w-[35%]">Channel</th>
            <th className="pb-[3pt] pl-[4pt] w-[10%] text-right"></th>
          </tr>
        </thead>
        <tbody>
          {mapping.map((row, i) => (
            <tr key={i} className="border-t border-[#f0e7d2]">
              <td className="py-[3pt] pr-[4pt]">
                <input
                  type="text"
                  value={row.sku}
                  onChange={(e) => updateRow(i, { sku: e.target.value })}
                  placeholder="e.g. SALT-CL-  or  SALT-WHL-001"
                  className="w-full bg-transparent font-mono text-[9pt] text-[#1f3d2e] border-b border-[#e3dac4] focus:outline-none focus:border-[#1f3d2e]"
                />
              </td>
              <td className="py-[3pt] px-[4pt]">
                <select
                  value={row.channel}
                  onChange={(e) =>
                    updateRow(i, { channel: e.target.value as ChannelKey })
                  }
                  className="w-full bg-transparent font-mono text-[9pt] text-[#1f3d2e] border-b border-[#e3dac4] focus:outline-none focus:border-[#1f3d2e]"
                >
                  {CHANNELS.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label} ({c.code})
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-[3pt] pl-[4pt] text-right">
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="font-mono uppercase tracking-[0.14em] text-[7.5pt] text-[#b85a3e] hover:underline"
                  aria-label={`Remove row ${i + 1}`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {mapping.length === 0 && (
            <tr>
              <td colSpan={3} className="py-[6pt] text-center text-[#6b7665] italic">
                No SKU rules — every parsed row will go to the default channel.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addRow}
        className="mt-[4pt] font-mono uppercase tracking-[0.16em] text-[7.5pt] px-[6pt] py-[3pt] rounded border border-[#c8bfa7] text-[#1f3d2e] hover:bg-[#ebe2d0]"
      >
        + Add SKU rule
      </button>
    </div>
  );
}

function PasteCard({
  title,
  subtitle,
  source,
  defaultChannel,
  parser,
  fields,
  fieldLabel,
  skuMapping,
  onApply,
  snapshotResetCounter,
  hint,
}: {
  title: string;
  subtitle: string;
  source: ImportSource;
  defaultChannel: ChannelKey;
  parser: (csv: string, mapping: SkuMapping[], defaultChannel: ChannelKey) => ParsedTotals;
  fields: (keyof ChannelTotals)[];
  fieldLabel: string;
  skuMapping: SkuMapping[];
  onApply: ImportApply;
  snapshotResetCounter: number;
  hint: string;
}) {
  const [text, setText] = useState("");
  const [channel, setChannel] = useState<ChannelKey>(defaultChannel);
  const [mode, setMode] = useState<"replace" | "add">("replace");
  // Mirror the source's localStorage snapshot in component state so the
  // diff column re-renders the moment we apply (snapshot becomes the
  // freshly-applied paste, so the next paste's diff is computed against
  // it). null until the bookkeeper has applied this source at least once.
  const [snapshot, setSnapshot] = useState<AppliedSnapshot | null>(() =>
    loadSnapshot(source),
  );

  // Re-read the snapshot from localStorage whenever the parent bumps the
  // reset counter — i.e. when Reset / Reset-with-SKU-map is clicked.
  // Without this the card would keep showing a stale "Last applied"
  // indicator and an enabled "Apply diff only" button after a reset,
  // even though `applyImport` would (correctly) compute the diff against
  // the now-empty localStorage snapshot. Fixing it in one place keeps
  // the preview and the apply behaviour honest with each other.
  useEffect(() => {
    setSnapshot(loadSnapshot(source));
  }, [snapshotResetCounter, source]);

  const parsed = useMemo(() => {
    if (!text.trim()) return null;
    return parser(text, skuMapping, channel);
  }, [text, parser, skuMapping, channel]);

  const totalForFields = (line: ChannelTotals) =>
    fields.reduce((s, f) => s + line[f], 0);

  const totalAcrossChannels = parsed
    ? CHANNELS.reduce((s, c) => s + totalForFields(parsed.byChannel[c.key]), 0)
    : 0;

  // Per-channel/per-field deltas vs the last applied snapshot for this
  // source. Returns 0 when no snapshot exists yet so the column can stay
  // mounted but render dashes.
  const deltaFor = (key: ChannelKey, field: keyof ChannelTotals): number => {
    if (!snapshot || !parsed) return 0;
    const prev = snapshot.byChannel[key]?.[field] ?? 0;
    return parsed.byChannel[key][field] - prev;
  };

  // True if any owned field on any channel has actually moved since the
  // last apply. Used to gate the "Apply diff only" button — it's a
  // no-op when nothing's changed and we don't want the bookkeeper to
  // re-stamp the snapshot timestamp for nothing.
  const anyDelta = useMemo(() => {
    if (!parsed || !snapshot) return false;
    for (const c of CHANNELS) {
      for (const f of fields) {
        if (Math.round(deltaFor(c.key, f)) !== 0) return true;
      }
    }
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed, snapshot, fields]);

  const handleApply = (applyMode: "replace" | "add" | "diff") => {
    if (!parsed) return;
    onApply(parsed, fields, applyMode);
    // Reflect the new baseline immediately — saveSnapshot has already
    // written it inside onApply, but the localStorage read in setState
    // initializer doesn't auto-refresh.
    setSnapshot({
      byChannel: parsed.byChannel,
      fields,
      appliedAt: new Date().toISOString(),
      rowCount: parsed.rowCount,
    });
  };

  return (
    <div className="border border-[#c8bfa7] rounded-[3pt] bg-white p-[8pt]">
      <div className="flex items-baseline justify-between gap-[6pt] mb-[3pt]">
        <div>
          <div className="font-display text-[11pt] text-[#1f3d2e] font-semibold leading-tight">
            {title}
          </div>
          <div className="text-[8pt] text-[#6b7665] mt-[1pt]">{subtitle}</div>
        </div>
        <div className="text-[7.5pt] font-mono uppercase tracking-[0.14em] text-[#6b7665] shrink-0">
          {fieldLabel}
        </div>
      </div>

      {snapshot && (
        <div className="text-[7.5pt] text-[#6b7665] italic mb-[3pt] leading-[1.3]">
          Last applied{" "}
          <span className="font-mono not-italic text-[#1f3d2e]">
            {fmtAppliedAt(snapshot.appliedAt)}
          </span>{" "}
          · <span className="font-mono not-italic">{snapshot.rowCount}</span>{" "}
          row{snapshot.rowCount === 1 ? "" : "s"}. Re-paste to see what moved.
        </div>
      )}

      <div className="flex items-baseline gap-[6pt] mb-[4pt] text-[8pt]">
        <label className="text-[#6b7665]">
          Default channel:&nbsp;
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as ChannelKey)}
            className="bg-transparent font-mono text-[#1f3d2e] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e]"
          >
            {CHANNELS.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label} ({c.code})
              </option>
            ))}
          </select>
        </label>
        <label className="text-[#6b7665] ml-auto">
          On apply:&nbsp;
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "replace" | "add")}
            className="bg-transparent font-mono text-[#1f3d2e] border-b border-[#c8bfa7] focus:outline-none focus:border-[#1f3d2e]"
          >
            <option value="replace">Replace owned fields</option>
            <option value="add">Add to existing</option>
          </select>
        </label>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={`Paste the ${title.split(" — ")[0]} CSV / TSV here…`}
        className="w-full text-[8.5pt] font-mono text-[#2a2520] border border-[#c8bfa7] rounded-[2pt] p-[4pt] focus:outline-none focus:border-[#1f3d2e] bg-[#fafaf5]"
      />

      <div className="text-[7.5pt] text-[#6b7665] italic mt-[3pt] leading-[1.4]">
        {hint}
      </div>

      {parsed && (
        <div className="mt-[5pt]">
          {parsed.warnings.length > 0 && (
            <ul className="text-[8pt] text-[#a07a18] list-disc list-inside mb-[3pt] space-y-[1pt]">
              {parsed.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          <div className="text-[8pt] text-[#6b7665] mb-[2pt]">
            Parsed <span className="font-mono">{parsed.rowCount}</span> row
            {parsed.rowCount === 1 ? "" : "s"} · matched columns:{" "}
            {parsed.matchedColumns
              .map((m) => `${m.label}=${m.header ?? "—"}`)
              .join(" · ")}
          </div>
          <table className="w-full text-[8.5pt]" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="text-left text-[#6b7665] font-mono uppercase tracking-[0.14em] text-[7pt]">
                <th className="pb-[2pt] w-[28%]">Channel</th>
                {fields.map((f) => (
                  <th key={f} className="pb-[2pt] text-right">
                    {f}
                    {snapshot && (
                      <div className="font-normal normal-case text-[6.5pt] tracking-normal text-[#6b7665]">
                        Δ vs last
                      </div>
                    )}
                  </th>
                ))}
                <th className="pb-[2pt] text-right">
                  Total
                  {snapshot && (
                    <div className="font-normal normal-case text-[6.5pt] tracking-normal text-[#6b7665]">
                      Δ vs last
                    </div>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => {
                const line = parsed.byChannel[c.key];
                const total = totalForFields(line);
                const rowDeltas = fields.map((f) => deltaFor(c.key, f));
                const totalDelta = rowDeltas.reduce((s, d) => s + d, 0);
                const rowChanged = snapshot
                  ? rowDeltas.some((d) => Math.round(d) !== 0)
                  : false;
                if (
                  total === 0 &&
                  fields.every((f) => line[f] === 0) &&
                  !rowChanged
                )
                  return null;
                return (
                  <tr
                    key={c.key}
                    className="border-t border-[#f0e7d2]"
                    style={{
                      background: rowChanged ? "#fbeed1" : "transparent",
                    }}
                  >
                    <td className="py-[2pt]">
                      <span className="font-semibold text-[#1f3d2e]">{c.label}</span>{" "}
                      <span className="font-mono text-[7.5pt] text-[#6b7665]">{c.code}</span>
                    </td>
                    {fields.map((f, idx) => {
                      const d = rowDeltas[idx];
                      const dRound = Math.round(d);
                      return (
                        <td
                          key={f}
                          className="py-[2pt] text-right font-mono text-[#1f3d2e]"
                        >
                          {fmt(line[f])}
                          {snapshot && (
                            <div
                              className="text-[7pt] font-mono"
                              style={{
                                color: dRound === 0 ? "#a8a294" : "#b85a3e",
                              }}
                            >
                              {fmtDelta(d)}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-[2pt] text-right font-mono font-semibold text-[#1f3d2e]">
                      {fmt(total)}
                      {snapshot && (
                        <div
                          className="text-[7pt] font-mono font-semibold"
                          style={{
                            color: Math.round(totalDelta) === 0
                              ? "#a8a294"
                              : "#b85a3e",
                          }}
                        >
                          {fmtDelta(totalDelta)}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t border-[#1f3d2e]">
                <td className="py-[2pt] font-mono uppercase tracking-[0.14em] text-[7.5pt] text-[#1f3d2e]">
                  Total
                </td>
                {fields.map((f) => {
                  const totalForField = CHANNELS.reduce(
                    (s, c) => s + parsed.byChannel[c.key][f],
                    0,
                  );
                  const totalDeltaForField = snapshot
                    ? CHANNELS.reduce((s, c) => s + deltaFor(c.key, f), 0)
                    : 0;
                  return (
                    <td
                      key={f}
                      className="py-[2pt] text-right font-mono text-[#1f3d2e]"
                    >
                      {fmt(totalForField)}
                      {snapshot && (
                        <div
                          className="text-[7pt] font-mono"
                          style={{
                            color: Math.round(totalDeltaForField) === 0
                              ? "#a8a294"
                              : "#b85a3e",
                          }}
                        >
                          {fmtDelta(totalDeltaForField)}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="py-[2pt] text-right font-mono font-semibold text-[#1f3d2e]">
                  {fmt(totalAcrossChannels)}
                  {snapshot && (
                    <div
                      className="text-[7pt] font-mono font-semibold"
                      style={{
                        color: Math.round(
                          CHANNELS.reduce(
                            (s, c) =>
                              s +
                              fields.reduce(
                                (s2, f) => s2 + deltaFor(c.key, f),
                                0,
                              ),
                            0,
                          ),
                        ) === 0
                          ? "#a8a294"
                          : "#b85a3e",
                      }}
                    >
                      {fmtDelta(
                        CHANNELS.reduce(
                          (s, c) =>
                            s +
                            fields.reduce(
                              (s2, f) => s2 + deltaFor(c.key, f),
                              0,
                            ),
                          0,
                        ),
                      )}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {parsed.unmapped.length > 0 && (
            <div className="mt-[3pt] text-[8pt] text-[#a07a18] leading-[1.4]">
              <span className="font-semibold">Unmapped SKU{parsed.unmapped.length === 1 ? "" : "s"} (fell to default channel):</span>{" "}
              {parsed.unmapped
                .slice(0, 5)
                .map((u) => `${u.sku} (${u.rows}×, ${fmt(u.revenue)})`)
                .join(", ")}
              {parsed.unmapped.length > 5 && ` · +${parsed.unmapped.length - 5} more`}
              . Add a SKU rule above to route these next month.
            </div>
          )}

          {snapshot && !anyDelta && (
            <div className="mt-[3pt] text-[8pt] text-[#1f3d2e] italic leading-[1.4]">
              No channel/field has moved since the last apply on{" "}
              <span className="font-mono not-italic">
                {fmtAppliedAt(snapshot.appliedAt)}
              </span>
              . Diff-only apply will be a no-op.
            </div>
          )}

          <div className="mt-[5pt] flex items-center gap-[6pt] flex-wrap">
            <button
              type="button"
              onClick={() => handleApply(mode)}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
              disabled={parsed.rowCount === 0}
            >
              Apply to channel lines
            </button>
            {snapshot && (
              <button
                type="button"
                onClick={() => handleApply("diff")}
                disabled={parsed.rowCount === 0 || !anyDelta}
                title="Add only the change since the last apply for this source — leaves manual overrides on unchanged channels untouched."
                className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Apply diff only
              </button>
            )}
            <button
              type="button"
              onClick={() => setText("")}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#6b7665] hover:bg-[#ebe2d0]"
            >
              Clear paste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TimesheetCard({
  onApply,
}: {
  onApply: (parsed: TimesheetParse) => void;
}) {
  const [text, setText] = useState("");

  const parsed = useMemo(() => {
    if (!text.trim()) return null;
    return parseTimesheet(text);
  }, [text]);

  return (
    <div className="border border-[#c8bfa7] rounded-[3pt] bg-white p-[8pt]">
      <div className="flex items-baseline justify-between gap-[6pt] mb-[3pt]">
        <div>
          <div className="font-display text-[11pt] text-[#1f3d2e] font-semibold leading-tight">
            Depot timesheet — OM hours
          </div>
          <div className="text-[8pt] text-[#6b7665] mt-[1pt]">
            Replaces the OM-hours field below (Rule 01 cap of {OM_HOURS_CAP} hrs / mo evaluates from this).
          </div>
        </div>
        <div className="text-[7.5pt] font-mono uppercase tracking-[0.14em] text-[#6b7665] shrink-0">
          OM hours
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={`Paste the depot timesheet CSV here…\nExpected: "Hours" column + optional "Cost Code" filtered to SALT.\nOr just paste a list of numbers (one per line).`}
        className="w-full text-[8.5pt] font-mono text-[#2a2520] border border-[#c8bfa7] rounded-[2pt] p-[4pt] focus:outline-none focus:border-[#1f3d2e] bg-[#fafaf5]"
      />

      <div className="text-[7.5pt] text-[#6b7665] italic mt-[3pt] leading-[1.4]">
        Either a CSV with “Hours” (and optionally “Cost Code” containing SALT)
        or one decimal hours value per line.
      </div>

      {parsed && (
        <div className="mt-[5pt]">
          {parsed.warnings.length > 0 && (
            <ul className="text-[8pt] text-[#a07a18] list-disc list-inside mb-[3pt] space-y-[1pt]">
              {parsed.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          <div className="text-[8pt] text-[#6b7665]">
            Parsed <span className="font-mono">{parsed.rowCount}</span> row
            {parsed.rowCount === 1 ? "" : "s"} · matched columns:{" "}
            {parsed.matchedColumns.length > 0
              ? parsed.matchedColumns
                  .map((m) => `${m.label}=${m.header ?? "—"}`)
                  .join(" · ")
              : "(numeric tokens)"}
          </div>
          <div className="mt-[2pt] text-[10pt] text-[#1f3d2e] font-semibold">
            Total OM hours:{" "}
            <span className="font-mono">{parsed.hours.toFixed(1)}</span>
            {parsed.hours > OM_HOURS_CAP && (
              <span className="ml-[6pt] text-[#b85a3e] font-mono text-[9pt]">
                over Rule 01 cap of {OM_HOURS_CAP}
              </span>
            )}
          </div>
          <div className="mt-[5pt] flex items-center gap-[6pt]">
            <button
              type="button"
              onClick={() => onApply(parsed)}
              disabled={parsed.rowCount === 0 && parsed.hours === 0}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90 disabled:opacity-40"
            >
              Apply to OM hours
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded border border-[#c8bfa7] text-[#6b7665] hover:bg-[#ebe2d0]"
            >
              Clear paste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Prior-chain auto-suggest banner ─────────────────────────────────
// Sits above the QTD rollup table. When there are filed closes in the
// current quarter, suggests the prior-months rev / CM$ totals so the
// bookkeeper doesn't retype them. Print-hidden — the printed close
// shows only the resulting rollup numbers.

function PriorChainBanner({
  monthInQuarter,
  chain,
  channels,
  rollup,
  matches,
  onApply,
}: {
  monthInQuarter: 1 | 2 | 3;
  chain: FiledClose[];
  channels: { key: ChannelKey; label: string }[];
  rollup: Record<ChannelKey, { revenue: number; cmDollars: number }>;
  matches: boolean;
  onApply: () => void;
}) {
  if (monthInQuarter === 1) {
    return (
      <div className="print-hide mb-[5pt] text-[8pt] text-[#6b7665] italic leading-[1.4]">
        Month 1 of quarter — no prior months in this quarter to roll forward.
      </div>
    );
  }
  if (chain.length === 0) {
    return (
      <div className="print-hide mb-[5pt] text-[8pt] text-[#a07a18] italic leading-[1.4]">
        No filed closes in this quarter yet — fill the prior-months fields by
        hand below, then click <span className="font-semibold">File this close</span>{" "}
        once today&rsquo;s month is reconciled so next month&rsquo;s rollup can
        auto-suggest from the saved snapshot.
      </div>
    );
  }
  const monthList = chain.map((c) => c.month || "(unnamed)").join(" + ");
  const totalRev = channels.reduce((s, c) => s + rollup[c.key].revenue, 0);
  const totalCm = channels.reduce((s, c) => s + rollup[c.key].cmDollars, 0);
  return (
    <div
      className="print-hide mb-[6pt] border border-[#c8bfa7] rounded-[3pt] bg-[#f7f1e3] p-[6pt] text-[8.5pt] text-[#2a2520] leading-[1.4]"
      data-testid="prior-chain-banner"
    >
      <div className="flex items-baseline justify-between gap-[8pt]">
        <div>
          <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#1f3d2e] font-semibold mb-[2pt]">
            Suggested from filed closes — {monthList}
          </div>
          <div className="text-[8pt] text-[#6b7665]">
            Per-channel:{" "}
            {channels
              .map(
                (c) =>
                  `${c.label} ${fmt(round0(rollup[c.key].revenue))} rev / ${fmt(
                    round0(rollup[c.key].cmDollars),
                  )} CM`,
              )
              .join(" · ")}
            . Totals {fmt(round0(totalRev))} rev / {fmt(round0(totalCm))} CM.
          </div>
        </div>
        <button
          type="button"
          onClick={onApply}
          disabled={matches}
          className={`shrink-0 font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded ${
            matches
              ? "border border-[#c8bfa7] text-[#6b7665] bg-transparent cursor-default"
              : "bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
          }`}
          title={
            matches
              ? "Prior-months fields already match the filed closes."
              : "Fill all four channels' prior-months rev + CM$ from the filed closes."
          }
        >
          {matches ? "Matches filed closes" : "Use these"}
        </button>
      </div>
    </div>
  );
}

// ─── Filed-close history drawer ──────────────────────────────────────
// Lists every filed close newest first so the bookkeeper can reopen
// one (load it back into the in-progress state) or delete a misfiled
// snapshot. Print-hidden by intent — the printed close shows only the
// month being reconciled, not the history pane.

function FiledCloseHistory({
  filed,
  channels,
  justFiledId,
  currentMonthInQuarter,
  onReopen,
  onDelete,
}: {
  filed: FiledClose[];
  channels: { key: ChannelKey; label: string; cmFloor: number | null }[];
  justFiledId: string | null;
  currentMonthInQuarter: 1 | 2 | 3;
  onReopen: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const reverse = [...filed].reverse();
  return (
    <div className="print-hide border border-[#c8bfa7] rounded-[3pt] bg-[#f7f1e3] mb-[10pt] p-[8pt]">
      <div className="flex items-baseline justify-between mb-[5pt]">
        <div>
          <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#b85a3e] font-semibold">
            Filed monthly closes
          </div>
          <div className="text-[8pt] text-[#6b7665] mt-[1pt]">
            {filed.length === 0
              ? "Nothing filed yet — once you click File this close, snapshots collect here."
              : `${filed.length} filed close${
                  filed.length === 1 ? "" : "s"
                } · newest first. Reopen pulls a close back into the form for editing; Delete removes it from the rollup auto-suggest.`}
          </div>
        </div>
      </div>
      {filed.length > 0 && (
        <table className="w-full text-[8.5pt] border-collapse" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="text-left text-[#6b7665] font-mono uppercase tracking-[0.14em] text-[7pt] border-b border-[#c8bfa7]">
              <th className="py-[3pt] pr-[4pt] w-[18%]">Month · MQ</th>
              <th className="py-[3pt] px-[4pt] w-[16%]">Filed</th>
              <th className="py-[3pt] px-[4pt] w-[12%] text-right">Total rev</th>
              <th className="py-[3pt] px-[4pt] w-[12%] text-right">Total CM $</th>
              <th className="py-[3pt] px-[4pt] w-[26%]">Channels (rev / CM%)</th>
              <th className="py-[3pt] pl-[4pt] w-[16%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reverse.map((close) => {
              const m = channelMonthMetrics(close);
              const totalRev = channels.reduce((s, c) => s + m[c.key].revenue, 0);
              const totalCm = channels.reduce((s, c) => s + m[c.key].cmDollars, 0);
              const filedDate = (() => {
                try {
                  return new Date(close.filedAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                } catch {
                  return close.filedAt;
                }
              })();
              const isJust = close.id === justFiledId;
              const inCurrentQuarterChain =
                currentMonthInQuarter > close.monthInQuarter;
              return (
                <tr
                  key={close.id}
                  className="border-b border-[#e3dac4]"
                  style={{ background: isJust ? "#fbeed1" : "transparent" }}
                  data-testid="filed-close-row"
                >
                  <td className="py-[4pt] pr-[4pt] align-top">
                    <div className="font-semibold text-[#1f3d2e] leading-tight">
                      {close.month || "(unnamed)"}
                    </div>
                    <div className="font-mono text-[7.5pt] text-[#6b7665] mt-[1pt]">
                      MQ {close.monthInQuarter} of 3
                      {inCurrentQuarterChain && (
                        <span className="ml-[3pt] text-[#1f3d2e]">· in current Q</span>
                      )}
                    </div>
                  </td>
                  <td className="py-[4pt] px-[4pt] align-top text-[8pt] text-[#2a2520]">
                    {filedDate}
                    {close.preparedBy && (
                      <div className="text-[7.5pt] text-[#6b7665] mt-[1pt]">
                        by {close.preparedBy}
                      </div>
                    )}
                  </td>
                  <td className="py-[4pt] px-[4pt] align-top text-right font-mono text-[#1f3d2e]">
                    {fmt(round0(totalRev))}
                  </td>
                  <td className="py-[4pt] px-[4pt] align-top text-right font-mono text-[#1f3d2e]">
                    {fmt(round0(totalCm))}
                  </td>
                  <td className="py-[4pt] px-[4pt] align-top text-[7.5pt] text-[#2a2520] leading-[1.4]">
                    {channels
                      .map((c) => {
                        const cm = m[c.key];
                        const cmPct =
                          cm.revenue > 0 ? (cm.cmDollars / cm.revenue) * 100 : null;
                        const underFloor =
                          c.cmFloor !== null &&
                          cm.revenue > 0 &&
                          (cmPct ?? 0) < c.cmFloor;
                        return (
                          <span
                            key={c.key}
                            className={underFloor ? "text-[#a07a18]" : ""}
                          >
                            {c.label}{" "}
                            <span className="font-mono">
                              {fmt(round0(cm.revenue))}
                              {cmPct !== null && ` / ${fmtPct(cmPct)}`}
                            </span>
                          </span>
                        );
                      })
                      .reduce<React.ReactNode[]>((acc, el, i) => {
                        if (i > 0) acc.push(" · ");
                        acc.push(el);
                        return acc;
                      }, [])}
                  </td>
                  <td className="py-[4pt] pl-[4pt] align-top text-right">
                    <div className="inline-flex flex-col items-end gap-[2pt]">
                      <button
                        type="button"
                        onClick={() => onReopen(close.id)}
                        className="font-mono uppercase tracking-[0.14em] text-[7.5pt] px-[6pt] py-[2pt] rounded border border-[#1f3d2e] text-[#1f3d2e] hover:bg-[#ebe2d0]"
                      >
                        Reopen
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(close.id)}
                        className="font-mono uppercase tracking-[0.14em] text-[7.5pt] text-[#b85a3e] hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
