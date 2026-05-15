/**
 * saltImports.ts
 *
 * Types, parsers, and snapshot persistence for the SALT-01 channel import
 * tool. The bookkeeper pastes raw Square/Shopify export text and the parser
 * extracts gross-sales, refunds, and net totals for each source.
 *
 * Snapshots are saved to localStorage so the "Δ vs last applied" diff is
 * available across page refreshes within the same browser session.
 */

export type ImportSource = "square" | "shopify" | "cash";

export interface ParsedTotals {
  source: ImportSource;
  grossSales: number;
  refunds: number;
  net: number;
  rawText: string;
  parsedAt: string;
}

export interface AppliedSnapshot {
  source: ImportSource;
  grossSales: number;
  refunds: number;
  net: number;
  appliedAt: string;
}

// ─── Snapshot persistence ───────────────────────────────────────────────────

const snapshotKey = (source: ImportSource) =>
  `salt-import-snapshot-v1:${source}`;

export function loadSnapshot(source: ImportSource): AppliedSnapshot | null {
  try {
    const raw = localStorage.getItem(snapshotKey(source));
    if (!raw) return null;
    return JSON.parse(raw) as AppliedSnapshot;
  } catch {
    return null;
  }
}

export function saveSnapshot(snap: AppliedSnapshot): void {
  localStorage.setItem(snapshotKey(snap.source), JSON.stringify(snap));
}

// ─── Amount extraction ───────────────────────────────────────────────────────

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

// ─── Square parser ───────────────────────────────────────────────────────────

/**
 * Parse a Square export paste. Handles summary rows from the Square
 * Transactions CSV or the "Sales Summary" copy-paste (tab-separated or
 * colon-separated).
 *
 * Falls back to treating the paste as a single net total when no labelled
 * rows are found.
 */
export function parseSquare(text: string): ParsedTotals | null {
  if (!text.trim()) return null;

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

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

  // Fall back: if we only parsed one or two bare numbers, treat the largest
  // positive as gross and the last as net.
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
    source: "square",
    grossSales,
    refunds,
    net,
    rawText: text,
    parsedAt: new Date().toISOString(),
  };
}

// ─── Shopify parser ──────────────────────────────────────────────────────────

/**
 * Parse a Shopify Finances Summary or Orders CSV paste.
 * Same fallback logic as Square.
 */
export function parseShopify(text: string): ParsedTotals | null {
  if (!text.trim()) return null;

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

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
    source: "shopify",
    grossSales,
    refunds,
    net,
    rawText: text,
    parsedAt: new Date().toISOString(),
  };
}

// ─── Cash / manual ──────────────────────────────────────────────────────────

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

// ─── Source metadata ─────────────────────────────────────────────────────────

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
