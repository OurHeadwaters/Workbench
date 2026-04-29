/**
 * Read-only parser for the audit's rename map. The source of truth is
 * `docs/rename-map.md` — imported as raw text and parsed at build time so
 * the in-guide drift map stays in sync with whatever the maintainer last
 * wrote there.
 */

import renameMapMarkdown from "../../docs/rename-map.md?raw";

export type RenameStatus =
  | "proposed"
  | "approved"
  | "rejected"
  | "deferred"
  | "applied";

export type DriftSymbol = "G" | "U" | "D" | "A";

export interface RenameRow {
  /** 1-based row number from the table's first column. */
  num: number;
  /** Raw markdown for the term, where it appears, replacement, etc. */
  term: string;
  whereItAppears: string;
  /**
   * Drift symbols listed in the table's "Drift" column. Empty array when the
   * cell is "—" (the row is listed for reference, not because it drifted).
   */
  drift: DriftSymbol[];
  proposedReplacement: string;
  secondOrderEffects: string;
  status: RenameStatus;
}

const STATUS_WORDS: Record<string, RenameStatus> = {
  proposed: "proposed",
  approved: "approved",
  rejected: "rejected",
  deferred: "deferred",
  applied: "applied",
};

export function parseRenameMap(raw: string): RenameRow[] {
  const lines = raw.split(/\r?\n/);
  const rows: RenameRow[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (
      line.startsWith("| #") &&
      line.includes("Term") &&
      line.includes("Status")
    ) {
      break;
    }
    i += 1;
  }
  if (i >= lines.length) return rows;

  i += 2;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line.startsWith("|")) break;
    if (/^\|\s*-+/.test(line)) {
      i += 1;
      continue;
    }
    const cells = splitMarkdownRow(line);
    if (cells.length >= 7) {
      const numRaw = cells[0].trim();
      const num = Number(numRaw);
      if (!Number.isNaN(num)) {
        const driftCell = cells[3].trim();
        const drift: DriftSymbol[] = [];
        for (const ch of driftCell) {
          if (ch === "G" || ch === "U" || ch === "D" || ch === "A") {
            if (!drift.includes(ch)) drift.push(ch);
          }
        }
        const statusCell = cells[6].trim().toLowerCase();
        const knownStatus = STATUS_WORDS[statusCell];
        if (!knownStatus && statusCell.length > 0 && typeof console !== "undefined") {
          console.warn(
            `[renameMap] Unknown status "${cells[6].trim()}" on row ${num}; falling back to "proposed". Update STATUS_WORDS in src/lib/renameMap.ts if a new status word was added.`,
          );
        }
        const status: RenameStatus = knownStatus ?? "proposed";

        rows.push({
          num,
          term: cells[1].trim(),
          whereItAppears: cells[2].trim(),
          drift,
          proposedReplacement: cells[4].trim(),
          secondOrderEffects: cells[5].trim(),
          status,
        });
      }
    }
    i += 1;
  }

  return rows;
}

function splitMarkdownRow(line: string): string[] {
  const parts: string[] = [];
  let buf = "";
  let escaped = false;
  const trimmed = line.replace(/^\|/, "").replace(/\|$/, "");
  for (let k = 0; k < trimmed.length; k += 1) {
    const ch = trimmed[k];
    if (escaped) {
      buf += ch;
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === "|") {
      parts.push(buf);
      buf = "";
      continue;
    }
    buf += ch;
  }
  parts.push(buf);
  return parts;
}

export const RENAME_MAP: RenameRow[] = parseRenameMap(renameMapMarkdown);

export const DRIFT_SYMBOL_MEANINGS: Record<DriftSymbol, string> = {
  G: "Generic accounting / SaaS / MBA word where a codetry word would carry weight",
  U: "UI-framework leak (Card, Banner, KPI, Workspace, Compare)",
  D: "Duplicate metaphor — same noun doing two jobs, or two nouns doing one job",
  A: "Abbreviation / acronym hiding a metaphor",
};

export const STATUS_MEANINGS: Record<RenameStatus, string> = {
  proposed: "On the table — the founder hasn't decided yet.",
  approved:
    "Founder accepted the replacement; safe for the implementation pass to apply.",
  rejected:
    "Founder decided not to rename; preserved here as a record of what was considered.",
  deferred:
    "Decision belongs to a later pass (e.g. project-wide sweep). Re-review next round.",
  applied: "The rename has landed in the codebase.",
};

export type InlineSegment =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "italic"; text: string }
  | { kind: "code"; text: string };

export function parseInline(input: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let i = 0;
  let buf = "";

  const flush = () => {
    if (buf.length > 0) {
      segments.push({ kind: "text", text: buf });
      buf = "";
    }
  };

  while (i < input.length) {
    const rest = input.slice(i);

    if (rest.startsWith("**")) {
      const end = input.indexOf("**", i + 2);
      if (end !== -1) {
        flush();
        segments.push({ kind: "bold", text: input.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (rest.startsWith("`")) {
      const end = input.indexOf("`", i + 1);
      if (end !== -1) {
        flush();
        segments.push({ kind: "code", text: input.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (rest.startsWith("*")) {
      const end = input.indexOf("*", i + 1);
      if (end !== -1) {
        flush();
        segments.push({ kind: "italic", text: input.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    buf += input[i];
    i += 1;
  }
  flush();
  return segments;
}
