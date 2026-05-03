/**
 * Server-side parser and writer for the Practitioner's Guide rename-map.
 *
 * Reads `artifacts/practitioners-guide-v2/docs/rename-map.md` from the
 * filesystem, parses the pipe-delimited table, and can write a single row's
 * status back by doing a targeted string replacement — preserving all other
 * file content exactly.
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the rename-map path in both dev (src/) and production (dist/) layouts.
const _srcPath = join(__dirname, "../../../../artifacts/practitioners-guide-v2/docs/rename-map.md");
const _distPath = join(__dirname, "../../../artifacts/practitioners-guide-v2/docs/rename-map.md");
export const RENAME_MAP_PATH = existsSync(_srcPath) ? _srcPath : _distPath;

export type RenameStatus = "proposed" | "approved" | "rejected" | "deferred" | "applied";
export type DriftSymbol = "G" | "U" | "D" | "A";

export interface RenameRow {
  id: number;
  term: string;
  whereItAppears: string;
  drift: DriftSymbol[];
  proposedReplacement: string;
  secondOrderEffects: string;
  status: RenameStatus;
}

const STATUS_WORDS = new Set<RenameStatus>([
  "proposed",
  "approved",
  "rejected",
  "deferred",
  "applied",
]);

function isStatus(s: string): s is RenameStatus {
  return STATUS_WORDS.has(s as RenameStatus);
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

export function parseRenameMap(raw: string): RenameRow[] {
  const lines = raw.split(/\r?\n/);
  const rows: RenameRow[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith("| #") && line.includes("Term") && line.includes("Status")) {
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
          if ((ch === "G" || ch === "U" || ch === "D" || ch === "A") && !drift.includes(ch)) {
            drift.push(ch);
          }
        }
        const statusCell = cells[6].trim().toLowerCase();
        const status: RenameStatus = isStatus(statusCell) ? statusCell : "proposed";

        rows.push({
          id: num,
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

export function readRenameMap(): RenameRow[] {
  const raw = readFileSync(RENAME_MAP_PATH, "utf-8");
  return parseRenameMap(raw);
}

/**
 * Update a single row's status in the markdown file.
 * Finds the data row by its 1-based id and replaces only the last cell (status).
 * All other content is preserved byte-for-byte.
 */
export function writeRowStatus(rowId: number, newStatus: RenameStatus): void {
  const raw = readFileSync(RENAME_MAP_PATH, "utf-8");
  const lines = raw.split(/\r?\n/);

  let updated = false;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed.startsWith("|")) continue;
    if (/^\|\s*-+/.test(trimmed)) continue;
    const cells = splitMarkdownRow(trimmed);
    if (cells.length >= 7) {
      const numRaw = cells[0].trim();
      if (Number(numRaw) === rowId) {
        // Replace only the last status cell, preserving whitespace in the line.
        // Strategy: find the position of the last ` | <status> |` and replace it.
        const original = lines[i];
        // The last cell in the pipe row: everything after the second-to-last `|`.
        const lastPipeIdx = original.lastIndexOf("|");
        if (lastPipeIdx === -1) continue;
        const beforeLastPipe = original.slice(0, lastPipeIdx);
        const secondLastPipeIdx = beforeLastPipe.lastIndexOf("|");
        if (secondLastPipeIdx === -1) continue;
        const prefix = original.slice(0, secondLastPipeIdx + 1);
        const oldStatusCell = original.slice(secondLastPipeIdx + 1, lastPipeIdx);
        // Preserve leading/trailing whitespace of the cell.
        const leadWs = oldStatusCell.match(/^(\s*)/)?.[1] ?? " ";
        const trailWs = oldStatusCell.match(/(\s*)$/)?.[1] ?? " ";
        lines[i] = `${prefix}${leadWs}${newStatus}${trailWs}|`;
        updated = true;
        break;
      }
    }
  }

  if (!updated) {
    throw new Error(`Row ${rowId} not found in rename-map.md`);
  }

  const separator = raw.includes("\r\n") ? "\r\n" : "\n";
  writeFileSync(RENAME_MAP_PATH, lines.join(separator), "utf-8");
}
