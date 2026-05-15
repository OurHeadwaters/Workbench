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
 *
 * CSV column-rename detection: when the bookkeeper pastes a full CSV export
 * (Square/Shopify/Shippo/Timesheet), parseImport() resolves columns using a
 * synonym fallback list and fires a ColumnAlert if the critical column header
 * changed from last month's persisted baseline, blocking the apply until the
 * bookkeeper confirms the swap is intentional.
 *
 * Column baseline storage key: "salt-import-header-baseline-v1"
 */

// ─── Text-paste types (summary parsers) ──────────────────────────────────────

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

// ─── Cash / manual ────────────────────────────────────────────────────────────
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

// ─── CSV column-rename detection ──────────────────────────────────────────────

export type SourceKey = "square" | "shopify" | "shippo" | "timesheet";

export interface ColumnDef {
  field: string;
  label: string;
  defaultHeader: string;
  synonyms: string[];
}

export interface MatchedColumn {
  field: string;
  resolvedHeader: string;
  isDefault: boolean;
}

export interface ColumnAlert {
  source: SourceKey;
  sourceLabel: string;
  field: string;
  fieldLabel: string;
  previousHeader: string;
  resolvedHeader: string;
}

export interface ParseResult {
  source: SourceKey;
  sourceLabel: string;
  criticalValue: number | null;
  matchedColumns: MatchedColumn[];
  alerts: ColumnAlert[];
  rowCount: number;
  warnings: string[];
}

// ─── Source definitions ───────────────────────────────────────────────────────

interface SourceDef {
  key: SourceKey;
  label: string;
  critical: ColumnDef;
  allColumns: ColumnDef[];
}

const CSV_SOURCES: SourceDef[] = [
  {
    key: "square",
    label: "Square",
    critical: {
      field: "revenue",
      label: "Revenue",
      defaultHeader: "Net Sales",
      synonyms: ["Gross Sales", "Total Sales", "Total Collected", "Amount", "Revenue", "Subtotal"],
    },
    allColumns: [
      {
        field: "revenue",
        label: "Revenue",
        defaultHeader: "Net Sales",
        synonyms: ["Gross Sales", "Total Sales", "Total Collected", "Amount", "Revenue", "Subtotal"],
      },
      {
        field: "transactions",
        label: "Transactions",
        defaultHeader: "Transactions",
        synonyms: ["Transaction Count", "# Transactions", "Count"],
      },
    ],
  },
  {
    key: "shopify",
    label: "Shopify",
    critical: {
      field: "lineitem_price",
      label: "Lineitem price",
      defaultHeader: "Lineitem price",
      synonyms: ["Line Item Price", "Item Price", "lineitem_price", "Price", "Line Price", "Unit Price"],
    },
    allColumns: [
      {
        field: "lineitem_price",
        label: "Lineitem price",
        defaultHeader: "Lineitem price",
        synonyms: ["Line Item Price", "Item Price", "lineitem_price", "Price", "Line Price", "Unit Price"],
      },
      {
        field: "lineitem_quantity",
        label: "Lineitem quantity",
        defaultHeader: "Lineitem quantity",
        synonyms: ["Line Item Quantity", "Quantity", "lineitem_quantity", "Qty"],
      },
      {
        field: "subtotal",
        label: "Subtotal",
        defaultHeader: "Subtotal",
        synonyms: ["Order Subtotal", "Sub Total", "Net Revenue"],
      },
    ],
  },
  {
    key: "shippo",
    label: "Shippo",
    critical: {
      field: "cost",
      label: "Cost",
      defaultHeader: "Cost",
      synonyms: ["Rate", "Total Cost", "Shipment Cost", "Label Cost", "Price", "Amount"],
    },
    allColumns: [
      {
        field: "cost",
        label: "Cost",
        defaultHeader: "Cost",
        synonyms: ["Rate", "Total Cost", "Shipment Cost", "Label Cost", "Price", "Amount"],
      },
      {
        field: "status",
        label: "Status",
        defaultHeader: "Status",
        synonyms: ["Shipment Status", "Tracking Status"],
      },
    ],
  },
  {
    key: "timesheet",
    label: "Timesheet",
    critical: {
      field: "hours",
      label: "Hours",
      defaultHeader: "Hours",
      synonyms: ["Duration", "Total Hours", "Time", "Hours Worked", "Hrs", "Billable Hours"],
    },
    allColumns: [
      {
        field: "hours",
        label: "Hours",
        defaultHeader: "Hours",
        synonyms: ["Duration", "Total Hours", "Time", "Hours Worked", "Hrs", "Billable Hours"],
      },
      {
        field: "employee",
        label: "Employee",
        defaultHeader: "Employee",
        synonyms: ["Name", "Worker", "Staff", "Person", "Team Member"],
      },
    ],
  },
];

// ─── CSV parser ───────────────────────────────────────────────────────────────

function parseCSV(raw: string): string[][] {
  const lines = raw.trim().split(/\r?\n/);
  return lines.map((line) => {
    const cells: string[] = [];
    let inQuote = false;
    let cell = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (ch === "," && !inQuote) {
        cells.push(cell.trim());
        cell = "";
      } else {
        cell += ch;
      }
    }
    cells.push(cell.trim());
    return cells;
  });
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? "";
    });
    return obj;
  });
}

// ─── Column resolution ────────────────────────────────────────────────────────

function normalise(s: string): string {
  return s.toLowerCase().replace(/[\s_-]+/g, " ").trim();
}

function resolveColumn(
  headers: string[],
  def: ColumnDef,
): { header: string; isDefault: boolean } | null {
  const normHeaders = headers.map(normalise);

  const defIdx = normHeaders.indexOf(normalise(def.defaultHeader));
  if (defIdx !== -1) return { header: headers[defIdx], isDefault: true };

  for (const syn of def.synonyms) {
    const idx = normHeaders.indexOf(normalise(syn));
    if (idx !== -1) return { header: headers[idx], isDefault: false };
  }

  return null;
}

/**
 * Returns true when text looks like a CSV export (first non-empty line has
 * at least 2 commas — enough to have a header row with multiple columns).
 */
export function looksLikeCSV(text: string): boolean {
  const firstLine = text.trim().split(/\r?\n/)[0] ?? "";
  return (firstLine.match(/,/g) ?? []).length >= 2;
}

// ─── Header baseline (localStorage) ──────────────────────────────────────────

const BASELINE_KEY = "salt-import-header-baseline-v1";

export interface HeaderBaseline {
  [sourceKey: string]: {
    [field: string]: string;
  };
}

export function loadHeaderBaseline(): HeaderBaseline {
  try {
    const raw = localStorage.getItem(BASELINE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as HeaderBaseline;
  } catch {
    return {};
  }
}

export function saveHeaderBaseline(baseline: HeaderBaseline): void {
  localStorage.setItem(BASELINE_KEY, JSON.stringify(baseline));
}

/**
 * Update the baseline for a specific source + field.
 * Call this when the bookkeeper clicks "remember this header for next month".
 */
export function rememberHeader(
  sourceKey: SourceKey,
  field: string,
  header: string,
): void {
  const baseline = loadHeaderBaseline();
  if (!baseline[sourceKey]) baseline[sourceKey] = {};
  baseline[sourceKey][field] = header;
  saveHeaderBaseline(baseline);
}

/**
 * Persist the resolved critical-column header for a completed apply,
 * whether or not the bookkeeper clicked "remember". This ensures that
 * "previously-used header" is accurate from the very first paste rather
 * than only after an explicit remember action.
 *
 * Only writes when the header differs from what is already stored, so
 * repeated calls for the same header are cheap no-ops.
 */
export function autoSeedBaseline(result: ParseResult): void {
  const def = CSV_SOURCES.find((s) => s.key === result.source)!;
  if (!def) return;
  const criticalMatch = result.matchedColumns.find(
    (m) => m.field === def.critical.field,
  );
  if (!criticalMatch) return;
  const baseline = loadHeaderBaseline();
  const existing = baseline[result.source]?.[def.critical.field];
  if (existing === criticalMatch.resolvedHeader) return; // already up-to-date
  if (!baseline[result.source]) baseline[result.source] = {};
  baseline[result.source][def.critical.field] = criticalMatch.resolvedHeader;
  saveHeaderBaseline(baseline);
}

/**
 * Clear all stored baselines. Useful for testing or resetting.
 */
export function resetHeaderBaseline(): void {
  localStorage.removeItem(BASELINE_KEY);
}

// ─── Main CSV parse function ──────────────────────────────────────────────────

/**
 * Parse a raw CSV string for a given source.
 *
 * Returns a ParseResult containing:
 *   - criticalValue: the summed value of the critical column (revenue, cost, etc.)
 *   - matchedColumns: which header was resolved for each column def
 *   - alerts: blocking alerts for any critical column whose resolved header
 *             differs from the persisted baseline for that source
 *   - warnings: non-blocking notes (e.g. column not found at all)
 */
export function parseImport(source: SourceKey, raw: string): ParseResult {
  const def = CSV_SOURCES.find((s) => s.key === source)!;
  const baseline = loadHeaderBaseline();
  const sourceBaseline = baseline[source] ?? {};

  const rows2d = parseCSV(raw);
  if (rows2d.length < 2) {
    return {
      source,
      sourceLabel: def.label,
      criticalValue: null,
      matchedColumns: [],
      alerts: [],
      rowCount: 0,
      warnings: ["Paste appears empty or has no data rows."],
    };
  }

  const headers = rows2d[0];
  const dataRows = rowsToObjects(rows2d);
  const matchedColumns: MatchedColumn[] = [];
  const alerts: ColumnAlert[] = [];
  const warnings: string[] = [];

  for (const colDef of def.allColumns) {
    const resolved = resolveColumn(headers, colDef);
    if (!resolved) {
      if (colDef.field === def.critical.field) {
        warnings.push(
          `Critical column "${colDef.label}" not found in this CSV. ` +
            `Expected "${colDef.defaultHeader}" or a known synonym.`,
        );
      }
      continue;
    }

    matchedColumns.push({
      field: colDef.field,
      resolvedHeader: resolved.header,
      isDefault: resolved.isDefault,
    });

    if (colDef.field === def.critical.field) {
      const persistedHeader = sourceBaseline[colDef.field];
      if (persistedHeader && persistedHeader !== resolved.header) {
        alerts.push({
          source,
          sourceLabel: def.label,
          field: colDef.field,
          fieldLabel: colDef.label,
          previousHeader: persistedHeader,
          resolvedHeader: resolved.header,
        });
      } else if (!persistedHeader && !resolved.isDefault) {
        alerts.push({
          source,
          sourceLabel: def.label,
          field: colDef.field,
          fieldLabel: colDef.label,
          previousHeader: colDef.defaultHeader,
          resolvedHeader: resolved.header,
        });
      }
    }
  }

  let criticalValue: number | null = null;
  const criticalMatch = matchedColumns.find((m) => m.field === def.critical.field);
  if (criticalMatch) {
    let sum = 0;
    let parsed = 0;
    for (const row of dataRows) {
      const rawCell = (row[criticalMatch.resolvedHeader] ?? "").replace(/[$,\s]/g, "");
      const n = parseFloat(rawCell);
      if (!isNaN(n)) {
        sum += n;
        parsed++;
      }
    }
    if (parsed > 0) criticalValue = sum;
  }

  return {
    source,
    sourceLabel: def.label,
    criticalValue,
    matchedColumns,
    alerts,
    rowCount: dataRows.length,
    warnings,
  };
}

/** Return the CSV source definition (label, critical column) for UI rendering. */
export function getSourceDef(source: SourceKey) {
  return CSV_SOURCES.find((s) => s.key === source)!;
}

/** All available CSV source keys + labels for the source picker. */
export const SOURCE_OPTIONS: { key: SourceKey; label: string }[] = CSV_SOURCES.map(
  ({ key, label }) => ({ key, label }),
);
