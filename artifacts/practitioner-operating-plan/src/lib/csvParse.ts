// Tiny CSV / TSV parser used by the SALT-01 monthly close to ingest the
// upstream exports the bookkeeper grabs from Square, Shopify, Shippo and
// the depot timesheet. Handles quoted fields (with embedded commas, quotes
// and newlines), tab-or-comma delimiters, and the usual money / percent
// formatting noise ($, commas, parentheses for negatives).

export type ParsedCsv = {
  headers: string[];
  rows: Record<string, string>[];
};

export function parseCsv(text: string): ParsedCsv {
  const trimmed = text.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return { headers: [], rows: [] };

  // First pass: tokenize the whole document, respecting quotes so newlines
  // inside quoted cells don't terminate a row.
  const records: string[][] = [];
  let cur = "";
  let row: string[] = [];
  let inQ = false;
  let delim: "," | "\t" | null = null;

  const pushCell = () => {
    row.push(cur);
    cur = "";
  };
  const pushRow = () => {
    pushCell();
    records.push(row);
    row = [];
  };

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === '"') {
      if (inQ && trimmed[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      inQ = !inQ;
      continue;
    }
    if (!inQ) {
      if (delim === null && (ch === "," || ch === "\t")) {
        // Lock in the delimiter from the first separator we see in the
        // header row so a header like "Item,Name\tQty" can't trip us up.
        delim = ch;
      }
      if (delim !== null && ch === delim) {
        pushCell();
        continue;
      }
      if (ch === "\n") {
        pushRow();
        continue;
      }
      if (ch === "\r") {
        continue;
      }
    }
    cur += ch;
  }
  pushRow();

  // Drop empty trailing rows from a stray newline at end of paste.
  while (records.length && records[records.length - 1].every((c) => c.trim() === "")) {
    records.pop();
  }

  if (records.length === 0) return { headers: [], rows: [] };

  const headers = records[0].map((h) => h.trim());
  const rows = records.slice(1).map((cells) => {
    const r: Record<string, string> = {};
    headers.forEach((h, idx) => {
      r[h] = (cells[idx] ?? "").trim();
    });
    return r;
  });

  return { headers, rows };
}

export function findHeader(headers: string[], candidates: string[]): string | null {
  const lower = headers.map((h) => h.toLowerCase().trim());
  // Exact match first
  for (const cand of candidates) {
    const idx = lower.indexOf(cand.toLowerCase().trim());
    if (idx !== -1) return headers[idx];
  }
  // Substring match second — Square calls one column "Net Sales" but the
  // bookkeeper might paste a "Net Sales (Excl. Tax)" variant.
  for (const cand of candidates) {
    const c = cand.toLowerCase().trim();
    const idx = lower.findIndex((h) => h.includes(c));
    if (idx !== -1) return headers[idx];
  }
  return null;
}

export function parseMoney(s: string | undefined): number {
  if (!s) return 0;
  let str = s.trim();
  if (!str) return 0;
  // Accounting-style negatives: ($1,234.56)
  let negative = false;
  if (str.startsWith("(") && str.endsWith(")")) {
    negative = true;
    str = str.slice(1, -1);
  }
  if (str.startsWith("-")) {
    negative = true;
    str = str.slice(1);
  }
  const cleaned = str.replace(/[$,\s]/g, "").replace(/[A-Za-z]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return 0;
  return negative ? -n : n;
}

export function parseNumber(s: string | undefined): number {
  if (!s) return 0;
  const cleaned = s.replace(/[,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}
