/**
 * generate-cashflow-xlsx.mjs
 * Generates public/headwaters-cashflow-model.xlsx.
 * Run: node scripts/generate-cashflow-xlsx.mjs
 */

import * as XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../public/headwaters-cashflow-model.xlsx");

const col  = (c)    => XLSX.utils.encode_col(c);
const addr = (r, c) => XLSX.utils.encode_cell({ r, c });
const xr   = (r)    => r + 1;

const DG   = "FF1F3D2E";
const AM   = "FFB85A3E";
const LG   = "FFD6E8CD";
const WH   = "FFFFFFFF";
const PA   = "FFFDE8E0";
const PG   = "FFE8F4E3";
const YW   = "FFFFFBE6";
const MR   = "FFC8BFA7";

function thin(c = MR) {
  const s = { style: "thin", color: { argb: c } };
  return { top: s, bottom: s, left: s, right: s };
}

function titleCell(v) {
  return { v, t: "s", s: { font: { name: "Calibri", sz: 13, bold: true, color: { argb: WH } }, fill: { patternType: "solid", fgColor: { argb: DG } }, alignment: { horizontal: "left" } } };
}
function bgCell(argb) {
  return { v: "", t: "s", s: { fill: { patternType: "solid", fgColor: { argb: argb } } } };
}
function secHdr(v) {
  return { v, t: "s", s: { font: { name: "Calibri", sz: 11, bold: true, color: { argb: AM } } } };
}
function colHdr(v, center = false) {
  return { v, t: "s", s: { font: { name: "Calibri", sz: 10, bold: true, color: { argb: WH } }, fill: { patternType: "solid", fgColor: { argb: DG } }, alignment: { horizontal: center ? "center" : "left" }, border: thin() } };
}
function lbl(v, bold = false, indent = 0) {
  return { v, t: "s", s: { font: { name: "Calibri", sz: 10, bold }, alignment: { horizontal: "left", indent }, border: thin() } };
}
function inp(v, numFmt = "#,##0") {
  return { v, t: "n", s: { font: { name: "Calibri", sz: 10 }, fill: { patternType: "solid", fgColor: { argb: YW } }, numFmt, alignment: { horizontal: "right" }, border: thin(AM) } };
}
function note(v) {
  return { v, t: "s", s: { font: { name: "Calibri", sz: 9, italic: true, color: { argb: "FF6B7665" } }, alignment: { horizontal: "left", wrapText: true } } };
}
function fml(f, v, numFmt = "#,##0", bold = false, bg = null) {
  const s = { font: { name: "Calibri", sz: 10, bold }, numFmt, alignment: { horizontal: "right" }, border: thin() };
  if (bg) s.fill = { patternType: "solid", fgColor: { argb: bg } };
  return { f, v, t: "n", s };
}
function netFml(f, v) {
  return { f, v, t: "n", s: { font: { name: "Calibri", sz: 10, color: { argb: v < 0 ? AM : DG } }, numFmt: "$#,##0", alignment: { horizontal: "right" }, border: thin() } };
}
function cashFml(f, v) {
  return { f, v, t: "n", s: { font: { name: "Calibri", sz: 10, bold: true, color: { argb: v < 0 ? AM : DG } }, numFmt: "$#,##0", alignment: { horizontal: "right" }, fill: { patternType: "solid", fgColor: { argb: v < 0 ? PA : PG } }, border: thin() } };
}

// Default inputs
const PRAT_RATE  = 150;
const TYLER_RATE = 70;
const PRAT_HRS   = 37;
const TYLER_HRS  = 37;
const IT         = 900;
const OVERHEAD   = 5_000;
const CONTRACT   = 90_000;
const LAG        = 2;
const CAPEX      = 42_000;
const WPM        = 4.333;

const PRAT_MO  = Math.round(PRAT_RATE  * PRAT_HRS  * WPM);
const TYLER_MO = Math.round(TYLER_RATE * TYLER_HRS * WPM);
const TOTAL_MO = PRAT_MO + TYLER_MO + IT + OVERHEAD;
const BRIDGE   = TOTAL_MO * 2 + CAPEX;

// Absolute input cell references
const rPRAT  = "$B$6";
const rTYLER = "$B$7";
const rPHRS  = "$B$8";
const rTHRS  = "$B$9";
const rIT    = "$B$10";
const rOH    = "$B$11";
const rCON   = "$B$12";
const rLAG   = "$B$13";
const rTOT   = "$B$21";
const rBRG   = "$B$23";

function buildCache(lag) {
  let cum = -BRIDGE;
  return Array.from({ length: 12 }, (_, i) => {
    const m      = i + 1;
    const inflow = m > lag ? CONTRACT : 0;
    const net    = inflow - TOTAL_MO;
    cum += net;
    return { inflow, outflow: TOTAL_MO, net, cum };
  });
}

function buildSheet() {
  const ws  = {};
  let maxR  = 0;
  const C   = 13;

  function set(r, c, cell) {
    ws[addr(r, c)] = cell;
    if (r > maxR) maxR = r;
  }

  // Title
  set(0, 0, titleCell("Headwaters Cash-Flow Model  |  CFO Input Workbook"));
  for (let c = 1; c <= C; c++) set(0, c, bgCell(DG));

  set(1, 0, note(
    "Yellow cells are INPUTS — edit them and every formula below recalculates automatically. " +
    "Scenario 1 revenue uses the editable payment-lag cell (B13); Scenarios 2–3 are fixed stress tests."
  ));

  // Inputs section
  set(3, 0, secHdr("INPUTS — Edit these yellow cells to model your scenario"));
  set(4, 0, colHdr("Input"));
  set(4, 1, colHdr("Default value"));
  set(4, 2, colHdr("Notes"));

  // r=5→B6  r=6→B7  r=7→B8  r=8→B9  r=9→B10  r=10→B11  r=11→B12  r=12→B13
  const inputs = [
    ["Practitioner hourly rate ($/hr)",            PRAT_RATE,  "$/hr — loaded monthly take"],
    ["Tyler subcontract hourly rate ($/hr)",        TYLER_RATE, "$/hr — two hands through Tyler's business"],
    ["Practitioner hours / week",                  PRAT_HRS,   "hrs/wk → × 4.333 = monthly hours"],
    ["Tyler hours / week (combined, both hands)",  TYLER_HRS,  "hrs/wk combined → × 4.333 = monthly hours"],
    ["IT / Support ($/mo)",                        IT,         "Servers, privacy phones, stack — partial allocation"],
    ["Overhead ($/mo)",                            OVERHEAD,   "Agency overhead — insurance, SaaS, admin"],
    ["Contract monthly value ($/mo)",              CONTRACT,   "What Deer Lake pays each month"],
    ["Payment lag — base scenario (months)",       LAG,        "2 = net-60 · 3 = net-90 · 4 = net-120 — drives Scenario 1"],
  ];
  inputs.forEach(([label, val, n], i) => {
    const r = 5 + i;
    set(r, 0, lbl(label));
    set(r, 1, inp(val));
    set(r, 2, note(n));
  });

  // Derived totals
  // r=14 section, r=15 colhdrs, r=16→B17 … r=20→B21, r=22→B23
  set(14, 0, secHdr("DERIVED TOTALS — Calculated from inputs above"));
  set(15, 0, colHdr("Line item"));
  set(15, 1, colHdr("Monthly cost"));
  set(15, 2, colHdr("Formula / notes"));

  set(16, 0, lbl("Practitioner monthly cost", false, 1));
  set(16, 1, fml(`${rPRAT}*${rPHRS}*4.333`, PRAT_MO, "$#,##0"));
  set(16, 2, note(`rate × hrs/wk × 4.333 (${PRAT_RATE} × ${PRAT_HRS} × 4.333 ≈ $${PRAT_MO.toLocaleString("en-US")} at defaults)`));

  set(17, 0, lbl("Tyler monthly cost (two hands combined)", false, 1));
  set(17, 1, fml(`${rTYLER}*${rTHRS}*4.333`, TYLER_MO, "$#,##0"));
  set(17, 2, note(`rate × hrs/wk × 4.333 (${TYLER_RATE} × ${TYLER_HRS} × 4.333 ≈ $${TYLER_MO.toLocaleString("en-US")} at defaults)`));

  set(18, 0, lbl("IT / Support", false, 1));
  set(18, 1, fml(rIT, IT, "$#,##0"));
  set(18, 2, note("from input above"));

  set(19, 0, lbl("Overhead", false, 1));
  set(19, 1, fml(rOH, OVERHEAD, "$#,##0"));
  set(19, 2, note("from input above"));

  set(20, 0, lbl("TOTAL MONTHLY OPERATING COST", true));
  set(20, 1, fml("SUM(B17:B20)", TOTAL_MO, "$#,##0", true, LG));
  set(20, 2, note(`Defaults: $${TOTAL_MO.toLocaleString("en-US")}/mo · annual run rate $${(TOTAL_MO * 12).toLocaleString("en-US")}/yr`));

  set(22, 0, lbl("Day-one bridge capital required", true));
  set(22, 1, fml("B21*2+42000", BRIDGE, "$#,##0", true, PA));
  set(22, 2, note(`2 × monthly cost + $${CAPEX.toLocaleString("en-US")} tech CAPEX. Defaults: $${BRIDGE.toLocaleString("en-US")}. Recovered when net-60 invoices clear.`));

  // Three 12-month scenario tables
  const scenarios = [
    { label: "SCENARIO 1 — Base (payment lag driven by input B13, default net-60)", lagF: rLAG, lagN: LAG },
    { label: "SCENARIO 2 — net-90 stress test (payment lag: 3 months — fixed)",    lagF: "3",  lagN: 3 },
    { label: "SCENARIO 3 — net-120 stress test (payment lag: 4 months — fixed)",   lagF: "4",  lagN: 4 },
  ];

  let sR = 24;
  for (const { label, lagF, lagN } of scenarios) {
    const cache = buildCache(lagN);
    let r = sR;

    set(r, 0, secHdr(label)); r++;
    set(r, 0, colHdr("Row"));
    for (let m = 1; m <= 12; m++) set(r, m, colHdr(`M${m}`, true));
    r++;

    const REV_R = r;
    set(r, 0, lbl("Revenue (contract inflow)", false, 1));
    for (let m = 1; m <= 12; m++) set(r, m, fml(`IF(${m}>${lagF},${rCON},0)`, cache[m-1].inflow, "$#,##0"));
    r++;

    const OUT_R = r;
    set(r, 0, lbl("Operating cost (outflow)", false, 1));
    for (let m = 1; m <= 12; m++) set(r, m, fml(rTOT, TOTAL_MO, "$#,##0"));
    r++;

    const NET_R = r;
    set(r, 0, lbl("Net cash (inflow − outflow)", false, 1));
    for (let m = 1; m <= 12; m++) {
      set(r, m, netFml(`${col(m)}${xr(REV_R)}-${col(m)}${xr(OUT_R)}`, cache[m-1].net));
    }
    r++;

    const CUM_R = r;
    set(r, 0, lbl("Cumulative cash position", true));
    for (let m = 1; m <= 12; m++) {
      const f = m === 1
        ? `-${rBRG}+${col(1)}${xr(NET_R)}`
        : `${col(m-1)}${xr(CUM_R)}+${col(m)}${xr(NET_R)}`;
      set(r, m, cashFml(f, cache[m-1].cum));
    }
    r++;

    set(r, 0, note(
      `Bridge $${BRIDGE.toLocaleString("en-US")} deployed Day 0. Revenue begins M${lagN + 1}. ` +
      (lagF === rLAG ? `Change ${rLAG} in Inputs to shift when revenue starts.` : "Lag is fixed for this stress-test scenario.")
    ));
    r += 2;

    sR = r;
  }

  ws["!cols"] = [{ wch: 46 }, { wch: 16 }, { wch: 56 }, ...Array(10).fill({ wch: 13 })];
  ws["!freeze"] = { xSplit: 1, ySplit: 1 };
  ws["!ref"] = XLSX.utils.encode_range({ r: 0, c: 0 }, { r: maxR + 5, c: C });
  return ws;
}

function buildReadme() {
  return XLSX.utils.aoa_to_sheet([
    ["Headwaters Cash-Flow Model — README"],
    [""],
    ["PURPOSE"],
    ["This workbook lets the contractor's CFO stress-test the financial model"],
    ["without being locked into the static numbers in the operating-plan deck."],
    [""],
    ["HOW TO USE"],
    ["1. Go to the 'Cash-Flow Model' tab."],
    ["2. Edit any yellow cell (rates, hours, contract value, payment lag)."],
    ["3. All derived totals and 12-month scenario tables recalculate automatically."],
    [""],
    ["INPUT CELLS (column B, yellow)"],
    ["  B6  Practitioner hourly rate       $150/hr"],
    ["  B7  Tyler subcontract hourly rate  $70/hr (two hands through Tyler's business)"],
    ["  B8  Practitioner hours/week        37 hrs/wk"],
    ["  B9  Tyler hours/week (combined)    37 hrs/wk"],
    ["  B10 IT / Support                  $900/mo"],
    ["  B11 Overhead                       $5,000/mo"],
    ["  B12 Contract monthly value         $90,000/mo"],
    ["  B13 Payment lag – base scenario    2 months (2=net-60 · 3=net-90 · 4=net-120)"],
    [""],
    ["DEFAULT OPERATING COST  ~$41,170/mo"],
    [""],
    ["THREE STRESS-TEST SCENARIOS"],
    ["  Scenario 1  Base — payment lag from B13 (default net-60)"],
    ["  Scenario 2  net-90 — fixed lag 3 months"],
    ["  Scenario 3  net-120 — fixed lag 4 months"],
    [""],
    ["NOTE: Verify the total monthly cost is approximately $41,000 before sharing."],
    ["Source: Headwaters Development Services · Confidential"],
  ]);
}

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, buildSheet(), "Cash-Flow Model");
XLSX.utils.book_append_sheet(wb, buildReadme(), "README");
XLSX.writeFile(wb, OUT);

console.log(`✓  Written → ${OUT}`);
console.log(`   Total monthly cost : $${TOTAL_MO.toLocaleString("en-US")}/mo`);
console.log(`   Day-one bridge     : $${BRIDGE.toLocaleString("en-US")}`);
