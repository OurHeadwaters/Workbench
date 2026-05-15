/**
 * saltClose.ts
 *
 * Manages the SALT-01 monthly close history stored in localStorage.
 *
 * Each filed month is stored as an immutable record keyed by its month
 * string (YYYY-MM). Filing the same month twice updates that month's
 * record (the bookkeeper can correct a mistake), but does NOT touch any
 * other month's record.
 *
 * Planning baseline: the net the salt operation is expected to return
 * after the food-handler cost and direct material expenses are covered.
 * This is intentionally separate from the B_LINES.foodHandler cost so
 * that the one-pager can compare actual filed nets against the plan.
 */

export const SALT_BASELINE_NET = 1_800; // planning-assumption net $/month

const STORAGE_KEY = "salt-monthly-close-v1";

/** Per-channel revenue snapshot captured at filing time. */
export interface ChannelSnapshot {
  grossSales: number;
  refunds: number;  // negative or zero
  net: number;
}

export interface SaltCloseRecord {
  month: string;    // "YYYY-MM"
  revenue: number;  // gross salt revenue for the month
  expenses: number; // direct expenses (materials, packaging, labour outside food handler)
  net: number;      // revenue − expenses  (computed on save, stored for quick reads)
  note?: string;    // optional bookkeeper note
  filedAt: string;  // ISO timestamp of last save
  /** Per-channel breakdown captured from the import tool at filing time. */
  channels?: {
    square?: ChannelSnapshot;
    shopify?: ChannelSnapshot;
    cash?: ChannelSnapshot;
  };
}

type HistoryStore = Record<string, SaltCloseRecord>;

function load(): HistoryStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as HistoryStore;
  } catch {
    return {};
  }
}

function persist(store: HistoryStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Save (or overwrite) the close record for a specific month. */
export function saveMonthClose(
  month: string,
  revenue: number,
  expenses: number,
  note?: string,
  channels?: SaltCloseRecord["channels"],
): SaltCloseRecord {
  const store = load();
  const record: SaltCloseRecord = {
    month,
    revenue,
    expenses,
    net: revenue - expenses,
    note: note?.trim() || undefined,
    filedAt: new Date().toISOString(),
    ...(channels && Object.keys(channels).length > 0 ? { channels } : {}),
  };
  store[month] = record;
  persist(store);
  return record;
}

/** Returns all filed months sorted oldest-first. */
export function getMonthHistory(): SaltCloseRecord[] {
  const store = load();
  return Object.values(store).sort((a, b) => a.month.localeCompare(b.month));
}

/** Returns the most recently filed close, or null if none. */
export function getLatestClose(): SaltCloseRecord | null {
  const history = getMonthHistory();
  return history.length > 0 ? history[history.length - 1] : null;
}

/** Returns the last N months of history (most recent N, oldest-first). */
export function getRecentHistory(n = 6): SaltCloseRecord[] {
  const history = getMonthHistory();
  return history.slice(-n);
}

/** Clears ALL filed closes. Used by the reset action. */
export function resetAllCloses(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Merge imported records into existing history.
 * Existing months are left untouched; only months not already present are added.
 */
export function mergeCloses(incoming: SaltCloseRecord[]): void {
  const store = load();
  for (const rec of incoming) {
    if (!store[rec.month]) {
      store[rec.month] = rec;
    }
  }
  persist(store);
}

/**
 * Replace all history with the imported records.
 * Equivalent to resetAllCloses() + saving each record.
 */
export function replaceCloses(incoming: SaltCloseRecord[]): void {
  const store: HistoryStore = {};
  for (const rec of incoming) {
    store[rec.month] = rec;
  }
  persist(store);
}

/**
 * Validate that a parsed value looks like a SaltCloseRecord array.
 * Returns the array on success, throws a descriptive Error on failure.
 */
export function parseImportedJSON(raw: unknown): SaltCloseRecord[] {
  if (!Array.isArray(raw)) throw new Error("Expected a JSON array of close records.");
  const records: SaltCloseRecord[] = [];
  for (const item of raw) {
    if (
      typeof item !== "object" || item === null ||
      typeof (item as Record<string, unknown>).month !== "string" ||
      typeof (item as Record<string, unknown>).revenue !== "number" ||
      typeof (item as Record<string, unknown>).expenses !== "number" ||
      typeof (item as Record<string, unknown>).net !== "number" ||
      typeof (item as Record<string, unknown>).filedAt !== "string"
    ) {
      throw new Error(`Record is missing required fields: ${JSON.stringify(item)}`);
    }
    records.push(item as SaltCloseRecord);
  }
  return records;
}

const CHANNEL_LABELS: Record<string, string> = {
  square:  "Square",
  shopify: "Shopify",
  cash:    "Cash / Other",
};

/**
 * Build a CSV string from the full history.
 *
 * Column schema: Month, MQ, Channel, Revenue, COGS, Freight, Packaging, CM$, CM%
 *
 * When a filed close has per-channel snapshots (captured from the import tool),
 * it emits one data row per channel. When no channel data is present (legacy
 * records filed before this feature), it emits a single summary row labelled
 * "Total" using the aggregate revenue and a blank COGS/freight/packaging.
 *
 * COGS, freight, and packaging are not tracked at the channel level — the
 * filed `expenses` total covers all three. These columns are therefore blank on
 * individual channel rows; the "Total" summary row carries the full expenses
 * figure in the COGS column so the audit spreadsheet can compute the overall
 * contribution margin.
 */
export function buildCSV(records: SaltCloseRecord[]): string {
  const header = ["Month", "MQ", "Channel", "Revenue", "COGS", "Freight", "Packaging", "CM$", "CM%"];

  const esc = (v: string | number | undefined | null): string => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const pct = (cm: number, rev: number): string =>
    rev > 0 ? (cm / rev * 100).toFixed(1) + "%" : "";

  const dataRows: string[] = [];

  for (const r of records) {
    const mq = SALT_BASELINE_NET;

    if (r.channels && Object.keys(r.channels).length > 0) {
      // One row per channel
      for (const [src, snap] of Object.entries(r.channels) as [string, ChannelSnapshot][]) {
        dataRows.push([
          esc(r.month),
          esc(mq),
          esc(CHANNEL_LABELS[src] ?? src),
          esc(snap.grossSales),
          esc(""),           // COGS not tracked per channel
          esc(""),           // Freight not tracked
          esc(""),           // Packaging not tracked
          esc(snap.net),
          esc(pct(snap.net, snap.grossSales)),
        ].join(","));
      }
      // Summary row with expenses in COGS column
      dataRows.push([
        esc(r.month),
        esc(mq),
        esc("Total"),
        esc(r.revenue),
        esc(r.expenses),    // all direct costs in COGS for the total row
        esc(""),
        esc(""),
        esc(r.net),
        esc(pct(r.net, r.revenue)),
      ].join(","));
    } else {
      // Legacy record — no channel breakdown; emit one summary row
      dataRows.push([
        esc(r.month),
        esc(mq),
        esc("Total"),
        esc(r.revenue),
        esc(r.expenses),
        esc(""),
        esc(""),
        esc(r.net),
        esc(pct(r.net, r.revenue)),
      ].join(","));
    }
  }

  return [header.join(","), ...dataRows].join("\r\n");
}

/** Health status based on net vs baseline. */
export type SaltStatus = "healthy" | "watch" | "below";

export function getStatus(net: number): SaltStatus {
  if (net >= SALT_BASELINE_NET) return "healthy";
  if (net >= SALT_BASELINE_NET * 0.7) return "watch";
  return "below";
}

// ---------------------------------------------------------------------------
// Channel aggregation — merges per-source parsed rows into close totals
// ---------------------------------------------------------------------------

/**
 * A single row as emitted by one of the four source parsers.
 *
 * DTC freight deduplication rule:
 *   - Shopify DTC rows set `shippingCollected` (what the customer paid for
 *     shipping). This is revenue, not a freight expense.
 *   - Shippo rows set `freight` (the carrier label cost).
 *   - A single DTC order appears in both: shippingCollected → revenue,
 *     freight → freight expense. Neither field crosses into the other bucket.
 */
export interface ParsedRow {
  source: "square" | "shopify" | "shippo" | "timesheet";
  channel: "dtc" | "wholesale" | "markets" | "corporate";
  revenue: number;
  shippingCollected?: number; // Shopify DTC only — goes into revenue, not freight
  cogs: number;
  freight: number;   // Shippo label cost only
  packaging: number;
  labor: number;
}

export interface ChannelClose {
  channel: string;
  revenue: number;
  cogs: number;
  freight: number;
  packaging: number;
  labor: number;
  expenses: number; // cogs + freight + packaging + labor
  net: number;      // revenue − expenses
}

export interface MonthlyAggregation {
  channels: ChannelClose[];
  totalRevenue: number;
  totalExpenses: number;
  totalNet: number;
}

/**
 * Merge per-source rows into per-channel close totals.
 * shippingCollected adds to revenue; freight adds to freight expense.
 * The two fields are source-exclusive (Shopify vs Shippo) so they
 * never double-count the same shipping cost.
 */
export function aggregateMonth(rows: ParsedRow[]): MonthlyAggregation {
  const acc = new Map<
    string,
    { revenue: number; cogs: number; freight: number; packaging: number; labor: number }
  >();

  for (const row of rows) {
    const entry = acc.get(row.channel) ?? {
      revenue: 0, cogs: 0, freight: 0, packaging: 0, labor: 0,
    };
    entry.revenue   += row.revenue + (row.shippingCollected ?? 0);
    entry.cogs      += row.cogs;
    entry.freight   += row.freight;
    entry.packaging += row.packaging;
    entry.labor     += row.labor;
    acc.set(row.channel, entry);
  }

  const channels: ChannelClose[] = Array.from(acc.entries())
    .map(([channel, t]) => {
      const expenses = t.cogs + t.freight + t.packaging + t.labor;
      return { channel, ...t, expenses, net: t.revenue - expenses };
    })
    .sort((a, b) => a.channel.localeCompare(b.channel));

  const totalRevenue  = channels.reduce((s, c) => s + c.revenue,  0);
  const totalExpenses = channels.reduce((s, c) => s + c.expenses, 0);
  return { channels, totalRevenue, totalExpenses, totalNet: totalRevenue - totalExpenses };
}
