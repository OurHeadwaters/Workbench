/**
 * saltImports.ts
 *
 * Types, parsers, and snapshot persistence for the SALT-01 monthly close
 * channel import tool.
 *
 * Snapshot architecture (Task #91):
 *   Snapshots are scoped to a (source, month) pair so that changing the Month
 *   field — or forgetting to reset between months — can never cause the diff
 *   column to compare one month's paste against a different month's snapshot.
 *
 *   Key format: `headwaters-salt-monthly-close-v1:snapshot:<source>:<YYYY-MM>`
 *
 * Parser architecture (Task #90):
 *   Each source has a dedicated summary parser (parseSquare, parseShopify,
 *   parseCash) that extracts gross-sales, refunds, and net from a pasted
 *   export. parsePaste is a generic row-level fallback.
 */

export type ImportSource = "square" | "shopify" | "cash";

// ─── Source metadata ──────────────────────────────────────────────────────────

export const SOURCE_META: Record<
  ImportSource,
  { label: string; hint: string; placeholder: string }
> = {
  square: {
    label: "Square",
    hint: "Paste from Square → Reports → Sales Summary (or the Transactions CSV totals row)",
    placeholder: `Gross Sales\t$3,240.00\nRefunds\t($45.00)\nNet Sales\t$3,195.00`,
  },
  shopify: {
    label: "Shopify",
    hint: "Paste from Shopify → Analytics → Finances Summary",
    placeholder: `Gross revenue\t$1,500.00\nReturns\t($50.00)\nNet revenue\t$1,450.00`,
  },
  cash: {
    label: "Cash / Other",
    hint: "Enter the cash-sales net total for the month",
    placeholder: "e.g. 480",
  },
};

/** Convenience alias — just the display labels. */
export const SOURCE_LABELS: Record<ImportSource, string> = {
  square:  SOURCE_META.square.label,
  shopify: SOURCE_META.shopify.label,
  cash:    SOURCE_META.cash.label,
};

// ─── Snapshot persistence (month-scoped) ─────────────────────────────────────

export const SNAPSHOT_KEY_PREFIX = "headwaters-salt-monthly-close-v1:snapshot";

function snapshotKey(source: ImportSource, month: string): string {
  return `${SNAPSHOT_KEY_PREFIX}:${source}:${month}`;
}

export interface SnapshotRow {
  /** Stable content-hash of the raw line — used for diff identity. */
  id: string;
  amount: number;
  raw: string;
}

export interface AppliedSnapshot {
  source: ImportSource;
  /** "YYYY-MM" — the close month this snapshot belongs to. */
  month: string;
  rows: SnapshotRow[];
  total: number;
  appliedAt: string;
}

export function loadSnapshot(source: ImportSource, month: string): AppliedSnapshot | null {
  try {
    const raw = localStorage.getItem(snapshotKey(source, month));
    if (!raw) return null;
    return JSON.parse(raw) as AppliedSnapshot;
  } catch {
    return null;
  }
}

export function saveSnapshot(
  source: ImportSource,
  month: string,
  rows: SnapshotRow[],
): void {
  const snap: AppliedSnapshot = {
    source,
    month,
    rows,
    total: rows.reduce((s, r) => s + r.amount, 0),
    appliedAt: new Date().toISOString(),
  };
  localStorage.setItem(snapshotKey(source, month), JSON.stringify(snap));
}

/** Clears snapshots for ALL sources for the given month. */
export function clearAllSnapshots(month: string): void {
  const sources: ImportSource[] = ["square", "shopify", "cash"];
  for (const src of sources) {
    localStorage.removeItem(snapshotKey(src, month));
  }
}

// ─── Row-level paste parser ───────────────────────────────────────────────────

/**
 * Parses a TSV/CSV paste into rows. Looks for any line that contains a
 * numeric dollar value; skips lines with no extractable amount.
 */
export function parsePaste(text: string): SnapshotRow[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const rows: SnapshotRow[] = [];

  for (const line of lines) {
    const match = line.match(/\$?\s*([\d,]+(?:\.\d{1,2})?)/);
    if (!match) continue;
    const amount = parseFloat(match[1].replace(/,/g, ""));
    if (isNaN(amount) || amount <= 0) continue;
    const id = stableId(line);
    rows.push({ id, amount, raw: line });
  }

  return rows;
}

/** Deterministic short hash for a string, used as a stable row identity. */
function stableId(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }
  return (h >>> 0).toString(36);
}

/** Returns only the rows whose id is NOT already in the snapshot. */
export function diffRows(
  parsed: SnapshotRow[],
  snapshot: AppliedSnapshot | null,
): SnapshotRow[] {
  if (!snapshot) return parsed;
  const seen = new Set(snapshot.rows.map((r) => r.id));
  return parsed.filter((r) => !seen.has(r.id));
}

// ─── Summary-level parsers ────────────────────────────────────────────────────

export interface ParsedTotals {
  source: ImportSource;
  grossSales: number;
  refunds: number;
  net: number;
  rawText: string;
  parsedAt: string;
}

/**
 * Extract the first dollar-ish value from a text fragment.
 * Handles "$1,234.56", "1234.56", "(1,234.56)" (parenthetical negatives).
 */
function extractAmount(fragment: string): number | null {
  const m = fragment.match(/\(?\$?([\d,]+(?:\.\d{1,2})?)\)?/);
  if (!m) return null;
  const val = parseFloat(m[1].replace(/,/g, ""));
  if (isNaN(val)) return null;
  const isParenNeg = fragment.trim().startsWith("(") && fragment.includes(")");
  return isParenNeg ? -val : val;
}

function isRefundLine(line: string): boolean {
  const l = line.toLowerCase();
  return l.includes("refund") || l.includes("return") || l.includes("void");
}

function isGrossLine(line: string): boolean {
  const l = line.toLowerCase();
  return (
    l.includes("gross sales") ||
    l.includes("gross revenue") ||
    l.includes("total sales") ||
    l.includes("total revenue") ||
    l.includes("total collected")
  );
}

function isNetLine(line: string): boolean {
  const l = line.toLowerCase();
  return (
    l.includes("net sales") ||
    l.includes("net revenue") ||
    l.includes("net total") ||
    l.includes("net amount")
  );
}

function parseSummaryLines(
  source: ImportSource,
  text: string,
): ParsedTotals | null {
  if (!text.trim()) return null;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let grossSales = 0;
  let refunds = 0;
  let net: number | null = null;

  for (const line of lines) {
    const amount = extractAmount(line);
    if (amount === null) continue;

    if (isNetLine(line)) {
      net = amount;
    } else if (isGrossLine(line)) {
      grossSales = amount;
    } else if (isRefundLine(line)) {
      refunds = -Math.abs(amount);
    }
  }

  // Fallback: treat the largest positive as gross and the last as net.
  if (net === null && grossSales === 0) {
    const amounts = lines
      .map((l) => extractAmount(l))
      .filter((a): a is number => a !== null);

    if (amounts.length === 1) {
      grossSales = amounts[0];
      net = amounts[0];
    } else if (amounts.length >= 2) {
      const positives = amounts.filter((a) => a > 0);
      grossSales = positives.length > 0 ? Math.max(...positives) : 0;
      net = amounts[amounts.length - 1];
    }
  }

  if (net === null) net = grossSales + refunds;

  return {
    source,
    grossSales,
    refunds,
    net,
    rawText: text,
    parsedAt: new Date().toISOString(),
  };
}

/**
 * Parse a Square export paste (Sales Summary or Transactions CSV totals row).
 * Falls back to treating the paste as a single net total when no labelled
 * rows are found.
 */
export function parseSquare(text: string): ParsedTotals | null {
  return parseSummaryLines("square", text);
}

/**
 * Parse a Shopify Finances Summary or Orders CSV paste.
 */
export function parseShopify(text: string): ParsedTotals | null {
  return parseSummaryLines("shopify", text);
}

/**
 * "Parse" a manual cash entry — just a single number.
 */
export function parseCash(text: string): ParsedTotals | null {
  const amount = extractAmount(text.trim());
  if (amount === null || isNaN(amount)) return null;
  return {
    source: "cash",
    grossSales: amount,
    refunds: 0,
    net: amount,
    rawText: text,
    parsedAt: new Date().toISOString(),
  };
}
