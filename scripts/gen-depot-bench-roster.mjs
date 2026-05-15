/**
 * gen-depot-bench-roster.mjs
 * Generates depot-bench-roster.xlsx with three sheets:
 *   1. Roster       — one row per bench member, contact + compliance columns
 *   2. Batch History — log of individual batch participation
 *   3. Rotation     — formula-driven A→B→C→D schedule for next 12 batches
 *                     OM changes the Start Date cell (B3) and all 12 rows update.
 */

import * as XLSX from "xlsx";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(
  __dirname,
  "../artifacts/practitioner-operating-plan/public/depot-bench-roster.xlsx",
);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Return Excel date serial (days since 1899-12-30). */
function excelSerial(dateStr) {
  const d = new Date(dateStr + "T00:00:00Z");
  const epoch = new Date("1899-12-30T00:00:00Z").getTime();
  return Math.round((d.getTime() - epoch) / 86400000);
}

/** Set a string cell. */
function s(v) { return { t: "s", v: String(v) }; }

/** Set a number cell. */
function n(v) { return { t: "n", v: Number(v) }; }

/** Set a date cell (numeric serial, formatted). */
function dt(dateStr) {
  return { t: "n", v: excelSerial(dateStr), z: "YYYY-MM-DD" };
}

/**
 * Set a formula cell with a cached value so Excel shows something immediately
 * and SheetJS preserves the formula on write.
 */
function formula(f, cachedValue, type = "s") {
  return { t: type, f, v: cachedValue };
}

/**
 * Write an array-of-rows into a blank worksheet object.
 * row/col are 0-indexed; converts to Excel A1 notation.
 */
function buildSheet(rows) {
  const ws = {};
  let maxRow = 0;
  let maxCol = 0;
  rows.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if (cell === null || cell === undefined || cell === "") {
        ws[cellAddr(ri, ci)] = { t: "s", v: "" };
        return;
      }
      ws[cellAddr(ri, ci)] = typeof cell === "object" ? cell : s(String(cell));
      if (ri > maxRow) maxRow = ri;
      if (ci > maxCol) maxCol = ci;
    });
    if (ri > maxRow) maxRow = ri;
  });
  ws["!ref"] = `A1:${colLetter(maxCol)}${maxRow + 1}`;
  return ws;
}

function colLetter(ci) {
  // supports A-Z only (26 cols is plenty here)
  return String.fromCharCode(65 + ci);
}

function cellAddr(ri, ci) {
  return `${colLetter(ci)}${ri + 1}`;
}

const NAMES = ["Marie T.", "Devin A.", "Jess W.", "Roger S."];

/** CHOOSE formula that rotates names by `offset` positions for a given Excel row. */
function rotationFormula(offset, excelRow) {
  const nameList = NAMES.map(n => `"${n}"`).join(",");
  const f = `CHOOSE(MOD(ROW()-7+${offset},4)+1,${nameList})`;
  const cached = NAMES[(offset % 4 + (excelRow - 7) % 4) % 4] ??
    NAMES[(offset + (excelRow - 7)) % 4];
  return formula(f, cached, "s");
}

/** Date formula for a batch row: =$B$3 + $B$4 * (ROW()-7). */
function dateCellFormula(excelRow, startSerial, intervalDays) {
  const f = `$B$3+$B$4*(ROW()-7)`;
  const cached = startSerial + intervalDays * (excelRow - 7);
  return { t: "n", f, v: cached, z: "YYYY-MM-DD" };
}

// ── Sheet 1: Roster ───────────────────────────────────────────────────────────

const rosterRows = [
  [
    "Name", "Base / Community", "Phone", "Email",
    "SIN on File (Y/N)", "Banking on File (Y/N)",
    "WSIB Clearance #", "WSIB Expiry",
    "Signed SOP Date", "Hire Date", "Status", "Notes",
  ],
  ["Marie T.", "Dryden", "", "", "Y", "Y", "", "", "", "", "Active",  "Primary lead; completed 6 batches"],
  ["Devin A.", "Dryden", "", "", "Y", "Y", "", "", "", "", "Active",  ""],
  ["Jess W.", "Dryden",  "", "", "N", "N", "", "", "", "", "Standby", "SIN + banking to be collected before first batch"],
  ["Roger S.", "Dryden", "", "", "N", "N", "", "", "", "", "Standby", "SIN + banking to be collected before first batch"],
];

const rosterWS = buildSheet(rosterRows);

rosterWS["!cols"] = [
  { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 26 },
  { wch: 18 }, { wch: 20 }, { wch: 18 }, { wch: 14 },
  { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 44 },
];

// ── Sheet 2: Batch History ────────────────────────────────────────────────────

const batchRows = [
  [
    "Person Name", "Batch #", "Batch Date",
    "Role (Primary / Standby / Paid-out)", "Hours Worked", "Pay ($)", "Notes",
  ],
  // Seed: Batch 1 — 2025-11-15
  ["Marie T.", n(1), "2025-11-15", "Primary (lead)",    n(8), n(200), ""],
  ["Devin A.", n(1), "2025-11-15", "Primary (support)", n(8), n(200), ""],
  ["Jess W.",  n(1), "2025-11-15", "Standby",           n(0), n(50),  "Paid $50 flat standby fee; did not attend"],
  ["Roger S.", n(1), "2025-11-15", "Standby",           n(0), n(50),  "Paid $50 flat standby fee; did not attend"],
  ["", "", "", "", "", "", ""],
  ["← Add new batch blocks below. Copy the four rows above for each new batch.", "", "", "", "", "", ""],
];

const batchWS = buildSheet(batchRows);

batchWS["!cols"] = [
  { wch: 18 }, { wch: 9 }, { wch: 14 },
  { wch: 34 }, { wch: 14 }, { wch: 10 }, { wch: 52 },
];

// ── Sheet 3: Rotation — formula-driven ───────────────────────────────────────
//
// Layout (1-indexed Excel rows):
//   Row 1  — instruction banner
//   Row 2  — blank
//   Row 3  — "Start Date" label  |  B3: date input (pre-filled 2026-06-06)  |  …  |  note
//   Row 4  — "Batch interval"   |  B4: 42                                   |  …  |  note
//   Row 5  — blank
//   Row 6  — column headers
//   Rows 7–18 — 12 formula-driven batch rows (dates + A/B/C/D names)
//   Rows 20+ — instructions and rotation logic notes

const START_DATE = "2026-06-06";
const INTERVAL   = 42; // days between batches
const startSerial = excelSerial(START_DATE);

// Build the sheet cell-by-cell so formula cells come out correctly.
const rotationWS = {};

// Row 1 — instruction banner
rotationWS["A1"] = s(
  "ROTATION SCHEDULE — change cell B3 (Start Date) and all 12 batch rows recalculate automatically."
);

// Row 3 — start date config
rotationWS["A3"] = s("Start Date");
rotationWS["B3"] = dt(START_DATE);           // ← OM edits this cell
rotationWS["G3"] = s("← Change this date. All 12 batch rows recalculate automatically.");

// Row 4 — interval config
rotationWS["A4"] = s("Batch interval (days)");
rotationWS["B4"] = n(INTERVAL);
rotationWS["G4"] = s("← Change to adjust spacing between batches (default: 42 days / 6 weeks).");

// Row 6 — headers
const rotHeaders = [
  "Batch #",
  "Batch Date",
  "A – Primary (lead)",
  "B – Primary (support)",
  "C – Standby (on-call)",
  "D – Off-rotation",
  "Notes / Compliance Reminder",
];
rotHeaders.forEach((h, ci) => {
  rotationWS[`${colLetter(ci)}6`] = s(h);
});

// Rows 7–18 — 12 batch rows, all formula-driven
const batchNotes = {
  0: "Confirm 2 weeks before: WSIB current for A, B, C; SIN + banking on file for A and B.",
  3: "After this batch, everyone has held the A (lead) slot once.",
  7: "Mid-year check: confirm all WSIB certificates are still current.",
  11: "End of 12-batch cycle — review roster and confirm all compliance docs are renewed.",
};

for (let i = 0; i < 12; i++) {
  const r = 7 + i; // Excel row number (1-indexed)

  rotationWS[`A${r}`] = n(i + 1);                          // Batch #
  rotationWS[`B${r}`] = dateCellFormula(r, startSerial, INTERVAL); // Date (formula)
  rotationWS[`C${r}`] = rotationFormula(0, r);             // A slot
  rotationWS[`D${r}`] = rotationFormula(1, r);             // B slot
  rotationWS[`E${r}`] = rotationFormula(2, r);             // C slot
  rotationWS[`F${r}`] = rotationFormula(3, r);             // D slot
  rotationWS[`G${r}`] = s(batchNotes[i] ?? "");            // Notes
}

// Rows 20+ — instructions
const instrRows = [
  ["HOW TO USE THIS SHEET"],
  ["1. Change cell B3 (Start Date) — all 12 batch date rows recalculate automatically."],
  ["2. Change cell B4 (Batch interval) if batches run more or less frequently than every 6 weeks."],
  ["3. If a person is unavailable, swap them with whoever is in column F (D – Off-rotation) for that batch."],
  ["4. Before each batch confirm: WSIB clearance current for A, B, C; SIN + banking on file for A and B."],
  ["5. After each batch, add the actual hours and pay to the Batch History sheet."],
  [""],
  ["ROTATION LOGIC"],
  ['Each batch shifts all four positions forward by one. After 4 batches, everyone has held the A (lead) slot once.'],
  ['Formula used in columns C–F: =CHOOSE(MOD(ROW()-7+[slot_offset],4)+1,"Marie T.","Devin A.","Jess W.","Roger S.")'],
  ["To add a fifth person: update the CHOOSE formulas in columns C–F and change the MOD divisor from 4 to 5."],
];

instrRows.forEach((row, idx) => {
  rotationWS[`A${20 + idx}`] = s(row[0] ?? "");
});

// Set sheet ref to cover everything
rotationWS["!ref"] = `A1:G${20 + instrRows.length - 1}`;

rotationWS["!cols"] = [
  { wch: 22 }, // A — Batch # / label
  { wch: 14 }, // B — Date / value
  { wch: 20 }, // C — A slot
  { wch: 20 }, // D — B slot
  { wch: 22 }, // E — C slot
  { wch: 20 }, // F — D slot
  { wch: 72 }, // G — Notes / instruction text
];

// ── Assemble workbook ─────────────────────────────────────────────────────────

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, rosterWS,  "Roster");
XLSX.utils.book_append_sheet(wb, batchWS,   "Batch History");
XLSX.utils.book_append_sheet(wb, rotationWS, "Rotation");

const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
writeFileSync(OUT, buf);
console.log("✓ Written:", OUT);

// ── Verification ──────────────────────────────────────────────────────────────

const wb2 = XLSX.read(buf, { type: "buffer", cellFormula: true });
const ws  = wb2.Sheets["Rotation"];
const fCells = Object.keys(ws).filter(k => !k.startsWith("!") && ws[k] && ws[k].f);
console.log(`✓ Formula cells in Rotation sheet: ${fCells.length}`);
if (fCells.length > 0) {
  console.log("  Sample formulas:");
  fCells.slice(0, 6).forEach(k => console.log(`    ${k}: ${ws[k].f}  (cached: ${ws[k].v})`));
} else {
  console.error("✗ No formula cells found — check SheetJS write path.");
  process.exit(1);
}
