/**
 * StartupExpensesPage — Phase 1 startup budget tracker.
 *
 * Three sections: one-time hardware & setup, one-time business setup,
 * and monthly ongoing costs — all tracked against the $28,000 startup figure.
 *
 * ADHD-first design:
 *  1. Scannable sections, clear labels, no clutter.
 *  2. Actuals + notes persisted to localStorage — enter once, available always.
 *  3. Summary bar stays pinned at the top so runway is always visible.
 *  4. Deer Lake items flagged as excluded so the budget stays honest.
 *  5. Notes field hidden behind an expand toggle to keep the list scannable.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Download,
  Laptop,
  Printer,
  Briefcase,
  Shield,
  Phone,
  Users,
  Plane,
  Scale,
  Calculator,
  Monitor,
  Package,
  ChevronDown,
  ChevronUp,
  PencilLine,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface LineItem {
  id: string;
  label: string;
  note?: string;
  low: number;
  high: number;
  icon: typeof Laptop;
  deerLake?: boolean;
}

interface Section {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  colorSoft: string;
  colorInk: string;
  items: LineItem[];
}

// ── Budget baseline ───────────────────────────────────────────────────────────

const BUDGET_TOTAL = 28_000;

// ── Line item definitions ─────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "hardware",
    title: "One-time — Hardware & Setup",
    subtitle: "Purchased once. Depreciated over time.",
    color: "#1A5FA8",
    colorSoft: "#EBF3FB",
    colorInk: "#0F3460",
    items: [
      {
        id: "laptop",
        label: "Laptop",
        note: "Primary work machine — refurb or mid-range new",
        low: 800,
        high: 1_400,
        icon: Laptop,
      },
      {
        id: "desk-setup",
        label: "Desk setup",
        note: "Monitor, keyboard, mouse, docking station",
        low: 400,
        high: 800,
        icon: Monitor,
      },
      {
        id: "label-printer",
        label: "Label printer",
        note: "Dymo or Brother — used for Parr's Jars production",
        low: 80,
        high: 160,
        icon: Printer,
      },
      {
        id: "laser-printer",
        label: "Laser printer",
        note: "Documents, contracts, invoices",
        low: 150,
        high: 350,
        icon: Printer,
      },
      {
        id: "start9-unit",
        label: "Start9 server unit (own use)",
        note: "Privacy server for internal ops — not a resale unit",
        low: 400,
        high: 600,
        icon: Shield,
      },
    ],
  },
  {
    id: "bizsetup",
    title: "One-time — Business Setup",
    subtitle: "Legal, accounting, and compliance groundwork.",
    color: "#065F46",
    colorSoft: "#D1FAE5",
    colorInk: "#022C22",
    items: [
      {
        id: "legal",
        label: "Legal — incorporation & shareholder agreement",
        note: "Lawyer review of structure, minute book, register",
        low: 1_200,
        high: 2_500,
        icon: Scale,
      },
      {
        id: "accounting-setup",
        label: "Accounting — setup & first-year filing",
        note: "Chart of accounts, HST registration, opening balance",
        low: 800,
        high: 1_500,
        icon: Calculator,
      },
      {
        id: "branding",
        label: "Branding & domain",
        note: "Logo, business cards, domain registration, email",
        low: 300,
        high: 700,
        icon: Package,
      },
    ],
  },
  {
    id: "monthly",
    title: "Monthly Ongoing",
    subtitle: "Recurring costs shown as first-6-month total.",
    color: "#6d28d9",
    colorSoft: "#F0EAFA",
    colorInk: "#2A0F5A",
    items: [
      {
        id: "privacy-software",
        label: "Privacy software (6 mo)",
        note: "Proton suite or equivalent — mail, VPN, drive",
        low: 6 * 10,
        high: 6 * 20,
        icon: Shield,
      },
      {
        id: "phone-plan",
        label: "Phone plan (6 mo)",
        note: "Business line — data plan for field work",
        low: 6 * 50,
        high: 6 * 80,
        icon: Phone,
      },
      {
        id: "part-time-hire",
        label: "Part-time help (6 mo)",
        note: "Admin / production support — 10–20 hrs/mo",
        low: 6 * 400,
        high: 6 * 900,
        icon: Users,
      },
      {
        id: "travel-buffer",
        label: "Travel buffer — 807 region (6 mo)",
        note: "Client visits, market days, Dryden area travel",
        low: 6 * 150,
        high: 6 * 300,
        icon: Plane,
      },
      {
        id: "software-tools",
        label: "Software tools & subscriptions (6 mo)",
        note: "Cloud storage, accounting software, project tools",
        low: 6 * 40,
        high: 6 * 80,
        icon: Briefcase,
      },
    ],
  },
];

const DEER_LAKE_NOTE =
  "Deer Lake hardware, travel, and site costs are excluded from this budget — those are covered by Deer Lake directly as part of the Northern Band engagement.";

// ── localStorage helpers ──────────────────────────────────────────────────────

const LS_KEY_ACTUALS = "pgv2.startup-expenses.actuals";
const LS_KEY_NOTES = "pgv2.startup-expenses.notes";

function loadActuals(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY_ACTUALS);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveActuals(actuals: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY_ACTUALS, JSON.stringify(actuals));
}

function loadNotes(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY_NOTES);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY_NOTES, JSON.stringify(notes));
}

// ── Math helpers ──────────────────────────────────────────────────────────────

function money(n: number) {
  return "$" + n.toLocaleString("en-CA");
}

function parseActual(v: string): number {
  const n = parseFloat(v.replace(/[$,]/g, ""));
  return isNaN(n) ? 0 : n;
}

function sectionTotals(section: Section, actuals: Record<string, string>) {
  let low = 0;
  let high = 0;
  let actual = 0;
  let anyActual = false;
  for (const item of section.items) {
    if (item.deerLake) continue;
    low += item.low;
    high += item.high;
    const a = parseActual(actuals[item.id] ?? "");
    actual += a;
    if (actuals[item.id]) anyActual = true;
  }
  return { low, high, actual, anyActual };
}

function grandTotals(actuals: Record<string, string>) {
  let low = 0;
  let high = 0;
  let actual = 0;
  for (const section of SECTIONS) {
    const t = sectionTotals(section, actuals);
    low += t.low;
    high += t.high;
    actual += t.actual;
  }
  return { low, high, actual };
}

// ── HTML escape helper ────────────────────────────────────────────────────────

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Print / Save PDF ──────────────────────────────────────────────────────────

function printExpenses(
  actuals: Record<string, string>,
  notes: Record<string, string>
) {
  const { low, high, actual } = grandTotals(actuals);
  const hasActuals = Object.values(actuals).some((v) => v.trim() !== "");
  const midpoint = Math.round((low + high) / 2);
  const runway = BUDGET_TOTAL - (hasActuals ? actual : midpoint);
  const today = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sectionRows = SECTIONS.map((section) => {
    const itemRows = section.items
      .map((item) => {
        const actualVal = item.deerLake
          ? ""
          : actuals[item.id]
          ? money(parseActual(actuals[item.id]))
          : "";
        const memoVal = item.deerLake ? "" : escHtml(notes[item.id] ?? "");
        return `
          <tr class="item-row">
            <td class="item-label">
              ${item.label}${item.deerLake ? ' <span class="tag">Deer Lake — excluded</span>' : ""}
              ${item.note ? `<div class="item-desc">${item.note}</div>` : ""}
            </td>
            <td class="num">${item.deerLake ? "—" : money(item.low)}</td>
            <td class="num">${item.deerLake ? "—" : money(item.high)}</td>
            <td class="num actual">${actualVal || "—"}</td>
            <td class="memo" style="white-space:pre-wrap">${memoVal}</td>
          </tr>`;
      })
      .join("");

    const st = sectionTotals(section, actuals);
    return `
      <tr class="section-header">
        <td colspan="5" style="background:${section.colorSoft};color:${section.colorInk};border-left:3px solid ${section.color}">
          ${section.title}
          <span class="section-sub">${section.subtitle}</span>
        </td>
      </tr>
      ${itemRows}
      <tr class="section-total">
        <td>Section total</td>
        <td class="num">${money(st.low)}</td>
        <td class="num">${money(st.high)}</td>
        <td class="num actual">${st.anyActual ? money(st.actual) : "—"}</td>
        <td></td>
      </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Startup Expenses — Headwaters Practitioner</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 11pt;
      color: #111;
      padding: 32pt 40pt;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 { font-size: 20pt; margin-bottom: 4pt; }
    .meta { font-size: 9pt; color: #555; font-family: Arial, sans-serif; margin-bottom: 20pt; }
    .summary-box {
      border: 1.5pt solid #1A5FA8;
      border-radius: 6pt;
      padding: 12pt 16pt;
      background: #EBF3FB;
      margin-bottom: 20pt;
      display: flex;
      gap: 24pt;
      flex-wrap: wrap;
    }
    .summary-item { }
    .summary-label { font-size: 8pt; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.08em; color: #0F3460; opacity: 0.7; margin-bottom: 2pt; }
    .summary-value { font-size: 15pt; font-weight: bold; color: #0F3460; font-family: Georgia, serif; }
    .summary-sub { font-size: 8pt; color: #0F3460; opacity: 0.6; font-family: Arial, sans-serif; }
    table { width: 100%; border-collapse: collapse; font-size: 10pt; }
    th {
      background: #1A5FA8;
      color: white;
      text-align: left;
      padding: 6pt 8pt;
      font-family: Arial, sans-serif;
      font-size: 9pt;
      font-weight: 600;
    }
    th.num, td.num { text-align: right; white-space: nowrap; }
    td { padding: 5pt 8pt; vertical-align: top; border-bottom: 0.5pt solid #e5e7eb; }
    .section-header td {
      font-family: Arial, sans-serif;
      font-size: 9.5pt;
      font-weight: 700;
      padding: 7pt 8pt 5pt;
      border-bottom: none;
    }
    .section-sub {
      font-weight: 400;
      font-size: 8.5pt;
      opacity: 0.7;
      margin-left: 8pt;
    }
    .section-total td {
      font-family: Arial, sans-serif;
      font-size: 9pt;
      font-weight: 600;
      background: #f8fafc;
      border-top: 0.5pt solid #cbd5e1;
      color: #334155;
    }
    .grand-total td {
      font-family: Arial, sans-serif;
      font-size: 10pt;
      font-weight: 700;
      background: #0F3460;
      color: white;
      border: none;
      padding: 7pt 8pt;
    }
    .budget-row td {
      font-family: Arial, sans-serif;
      font-size: 9pt;
      font-weight: 600;
      background: #EBF3FB;
      color: #0F3460;
      border-bottom: none;
    }
    .item-label { font-size: 10pt; }
    .item-desc { font-size: 8.5pt; color: #555; font-family: Arial, sans-serif; margin-top: 1pt; }
    .actual { color: #065F46; font-weight: 600; }
    .memo { font-size: 8.5pt; font-family: Arial, sans-serif; color: #374151; max-width: 180pt; }
    .tag {
      display: inline-block;
      font-size: 7.5pt;
      font-family: Arial, sans-serif;
      background: #e2e8f0;
      color: #64748b;
      border-radius: 3pt;
      padding: 1pt 4pt;
      margin-left: 4pt;
      font-weight: 400;
    }
    .deer-lake-note {
      margin-top: 16pt;
      border: 0.5pt solid #cbd5e1;
      border-radius: 4pt;
      padding: 9pt 12pt;
      font-size: 9pt;
      color: #374151;
      font-family: Arial, sans-serif;
    }
    .deer-lake-note strong { color: #111; }
    @media print {
      body { padding: 16pt 20pt; }
      @page { margin: 12mm 14mm; }
    }
  </style>
</head>
<body>
  <h1>Startup Expenses</h1>
  <p class="meta">Headwaters Practitioner · Phase 1 working budget · Printed ${today}</p>

  <div class="summary-box">
    <div class="summary-item">
      <div class="summary-label">Startup Budget</div>
      <div class="summary-value">${money(BUDGET_TOTAL)}</div>
      <div class="summary-sub">Phase 1 baseline</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Estimated range</div>
      <div class="summary-value">${money(low)} – ${money(high)}</div>
      <div class="summary-sub">low / high</div>
    </div>
    ${hasActuals ? `
    <div class="summary-item">
      <div class="summary-label">Actual spent</div>
      <div class="summary-value">${money(actual)}</div>
      <div class="summary-sub">entered so far</div>
    </div>` : ""}
    <div class="summary-item">
      <div class="summary-label">Runway remaining</div>
      <div class="summary-value" style="color:${runway < 0 ? "#DC2626" : "#1A5FA8"}">${runway < 0 ? "–" : ""}${money(Math.abs(runway))}</div>
      <div class="summary-sub">${hasActuals ? "vs actual" : "vs midpoint estimate"}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th class="num">Est. Low</th>
        <th class="num">Est. High</th>
        <th class="num">Actual</th>
        <th>Memo / Notes</th>
      </tr>
    </thead>
    <tbody>
      ${sectionRows}
      <tr class="grand-total">
        <td>Grand Total</td>
        <td class="num">${money(low)}</td>
        <td class="num">${money(high)}</td>
        <td class="num">${hasActuals ? money(actual) : "—"}</td>
        <td></td>
      </tr>
      <tr class="budget-row">
        <td>Budget (Phase 1)</td>
        <td></td>
        <td></td>
        <td class="num">${money(BUDGET_TOTAL)}</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <div class="deer-lake-note">
    <strong>Deer Lake — excluded from this budget</strong><br/>
    ${DEER_LAKE_NOTE}
  </div>

  <script>window.onload = function(){ window.print(); };<\/script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

// ── CSV export ────────────────────────────────────────────────────────────────

function exportCsv(
  actuals: Record<string, string>,
  notes: Record<string, string>
) {
  const rows: string[][] = [
    ["Section", "Item", "Description", "Est. Low", "Est. High", "Actual", "Notes"],
  ];

  for (const section of SECTIONS) {
    for (const item of section.items) {
      const actual = item.deerLake ? "" : (parseActual(actuals[item.id] ?? "") || "").toString();
      rows.push([
        section.title,
        item.label + (item.deerLake ? " (Deer Lake — excluded)" : ""),
        item.note ?? "",
        item.deerLake ? "" : String(item.low),
        item.deerLake ? "" : String(item.high),
        actual === "0" && !actuals[item.id] ? "" : actual,
        item.deerLake ? "" : (notes[item.id] ?? ""),
      ]);
    }
  }

  const totals = grandTotals(actuals);
  const hasAnyActual = Object.values(actuals).some((v) => v.trim() !== "");
  rows.push([]);
  rows.push([
    "TOTALS", "", "",
    totals.low.toString(),
    totals.high.toString(),
    hasAnyActual ? totals.actual.toString() : "",
    "",
  ]);
  rows.push(["Budget", "", "", "", "", BUDGET_TOTAL.toString(), ""]);

  const csv = rows
    .map((row) =>
      row
        .map((cell) => (cell.includes(",") || cell.includes('"') || cell.includes("\n") ? `"${cell.replace(/"/g, '""')}"` : cell))
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "startup-expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Summary bar ───────────────────────────────────────────────────────────────

function SummaryBar({
  actuals,
  notes,
}: {
  actuals: Record<string, string>;
  notes: Record<string, string>;
}) {
  const { low, high, actual } = grandTotals(actuals);
  const hasActuals = Object.values(actuals).some((v) => v.trim() !== "");
  const midpoint = Math.round((low + high) / 2);
  const runway = BUDGET_TOTAL - (hasActuals ? actual : midpoint);
  const runwayPct = Math.max(0, Math.min(100, (runway / BUDGET_TOTAL) * 100));
  const overBudget = runway < 0;

  return (
    <div
      className="rounded-xl border-2 p-5 mb-8"
      style={{ borderColor: "#1A5FA8", background: "#EBF3FB" }}
      data-testid="summary-bar"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F3460] opacity-70 mb-1">
            Startup Budget
          </p>
          <p className="text-3xl font-bold text-[#0F3460]" style={{ fontFamily: "var(--app-font-serif)" }}>
            {money(BUDGET_TOTAL)}
          </p>
          <p className="text-xs text-[#0F3460] opacity-70 mt-0.5">Phase 1 baseline</p>
        </div>

        <div className="flex gap-6 flex-wrap items-start">
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F3460] opacity-70 mb-1">
              Estimated range
            </p>
            <p className="text-lg font-bold text-[#0F3460]">
              {money(low)} – {money(high)}
            </p>
            <p className="text-xs text-[#0F3460] opacity-70">low / high</p>
          </div>
          {hasActuals && (
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0F3460] opacity-70 mb-1">
                Actual spent
              </p>
              <p className="text-lg font-bold text-[#0F3460]">{money(actual)}</p>
              <p className="text-xs text-[#0F3460] opacity-70">entered so far</p>
            </div>
          )}
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F3460] opacity-70 mb-1">
              Runway remaining
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: overBudget ? "#DC2626" : "#1A5FA8" }}
            >
              {overBudget ? "–" : ""}{money(Math.abs(runway))}
            </p>
            <p className="text-xs text-[#0F3460] opacity-70">
              {hasActuals ? "vs actual" : "vs midpoint estimate"}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-end pb-0.5">
            <button
              onClick={() => exportCsv(actuals, notes)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors"
              style={{
                borderColor: "#1A5FA8",
                color: "#1A5FA8",
                backgroundColor: "white",
              }}
              data-testid="export-csv-btn"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-[#0F3460] opacity-60">
          <span>$0</span>
          <span>{money(BUDGET_TOTAL)}</span>
        </div>
        <div className="h-3 rounded-full bg-white/60 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${100 - runwayPct}%`,
              backgroundColor: overBudget ? "#DC2626" : "#1A5FA8",
            }}
          />
        </div>
        <p className="text-[10px] text-[#0F3460] opacity-60 text-right">
          {hasActuals
            ? `${Math.round(((BUDGET_TOTAL - actual) / BUDGET_TOTAL) * 100)}% of budget remaining (actual)`
            : `~${Math.round(runwayPct)}% of budget remaining (estimated midpoint)`}
        </p>
      </div>
    </div>
  );
}

// ── Line item row ─────────────────────────────────────────────────────────────

function LineItemRow({
  item,
  color,
  colorSoft,
  colorInk,
  actual,
  memo,
  onActualChange,
  onMemoChange,
}: {
  item: LineItem;
  color: string;
  colorSoft: string;
  colorInk: string;
  actual: string;
  memo: string;
  onActualChange: (id: string, value: string) => void;
  onMemoChange: (id: string, value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const Icon = item.icon;
  const actualNum = parseActual(actual);
  const hasActual = actual.trim() !== "";
  const withinRange = hasActual && actualNum >= item.low && actualNum <= item.high;
  const overHigh = hasActual && actualNum > item.high;
  const hasMemo = memo.trim() !== "";
  const needsMemo = hasActual && !hasMemo;

  function openMemo() {
    setExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  return (
    <div
      className={`py-3 border-b last:border-b-0 ${item.deerLake ? "opacity-50" : ""}`}
      style={{ borderColor: colorSoft }}
      data-testid={`line-item-${item.id}`}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-7 w-7 rounded-md grid place-items-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: colorSoft, color: colorInk }}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug">
                {item.label}
                {item.deerLake && (
                  <span className="ml-2 text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    Deer Lake — excluded
                  </span>
                )}
              </p>
              {item.note && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.note}</p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Estimate</p>
                <p className="text-sm font-semibold tabular-nums" style={{ color }}>
                  {money(item.low)}–{money(item.high)}
                </p>
              </div>

              {!item.deerLake && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Actual</p>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="—"
                      value={actual}
                      onChange={(e) => onActualChange(item.id, e.target.value)}
                      className="w-24 pl-5 pr-2 py-1 text-sm rounded-md border text-right tabular-nums focus:outline-none focus:ring-2"
                      style={{
                        borderColor: hasActual
                          ? overHigh
                            ? "#DC2626"
                            : withinRange
                            ? "#16A34A"
                            : color + "99"
                          : "hsl(var(--card-border))",
                        backgroundColor: hasActual
                          ? overHigh
                            ? "#FEF2F2"
                            : withinRange
                            ? "#F0FDF4"
                            : "white"
                          : "white",
                      }}
                      data-testid={`actual-input-${item.id}`}
                    />
                  </div>
                </div>
              )}

              {!item.deerLake && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  title={expanded ? "Hide memo" : hasMemo ? "Show memo" : "Add memo"}
                  className="mt-4 flex-shrink-0 h-7 w-7 rounded-md grid place-items-center border transition-colors hover:bg-slate-50"
                  style={{
                    borderColor: hasMemo ? color + "88" : "hsl(var(--card-border))",
                    color: hasMemo ? color : "hsl(var(--muted-foreground))",
                  }}
                  data-testid={`memo-toggle-${item.id}`}
                >
                  {expanded ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {needsMemo && (
            <button
              onClick={openMemo}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors hover:opacity-80"
              style={{
                borderColor: "#D97706",
                color: "#92400E",
                backgroundColor: "#FFFBEB",
              }}
              data-testid={`memo-nudge-${item.id}`}
            >
              <PencilLine className="h-3 w-3" />
              add memo
            </button>
          )}

        </div>
      </div>

      {!item.deerLake && expanded && (
        <div className="mt-2 ml-10">
          <textarea
            ref={textareaRef}
            rows={2}
            placeholder="What was actually purchased? Which vendor, model, or provider?"
            value={memo}
            onChange={(e) => onMemoChange(item.id, e.target.value)}
            className="w-full text-xs rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 leading-relaxed"
            style={{
              borderColor: hasMemo ? color + "88" : "hsl(var(--card-border))",
              backgroundColor: hasMemo ? colorSoft + "88" : "white",
            }}
            data-testid={`memo-input-${item.id}`}
          />
        </div>
      )}
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({
  section,
  actuals,
  notes,
  onActualChange,
  onNoteChange,
}: {
  section: Section;
  actuals: Record<string, string>;
  notes: Record<string, string>;
  onActualChange: (id: string, value: string) => void;
  onNoteChange: (id: string, value: string) => void;
}) {
  const { low, high, actual, anyActual } = sectionTotals(section, actuals);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: section.color + "44" }}
      data-testid={`section-${section.id}`}
    >
      <div className="h-1" style={{ backgroundColor: section.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
          <div>
            <h2
              className="text-base font-semibold leading-tight"
              style={{ fontFamily: "var(--app-font-serif)", color: section.colorInk }}
            >
              {section.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{section.subtitle}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-muted-foreground">Section total</p>
            <p className="text-sm font-bold tabular-nums" style={{ color: section.color }}>
              {money(low)}–{money(high)}
            </p>
            {anyActual && (
              <p className="text-xs font-semibold tabular-nums text-emerald-700">
                {money(actual)} actual
              </p>
            )}
          </div>
        </div>

        <div className="mt-3">
          {section.items.map((item) => (
            <LineItemRow
              key={item.id}
              item={item}
              color={section.color}
              colorSoft={section.colorSoft}
              colorInk={section.colorInk}
              actual={actuals[item.id] ?? ""}
              memo={notes[item.id] ?? ""}
              onActualChange={onActualChange}
              onMemoChange={onNoteChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function StartupExpensesPage() {
  const [actuals, setActuals] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setActuals(loadActuals());
    setNotes(loadNotes());
  }, []);

  const handleActualChange = useCallback((id: string, value: string) => {
    setActuals((prev) => {
      const next = { ...prev, [id]: value };
      saveActuals(next);
      return next;
    });
  }, []);

  const handleNoteChange = useCallback((id: string, value: string) => {
    setNotes((prev) => {
      const next = { ...prev, [id]: value };
      saveNotes(next);
      return next;
    });
  }, []);

  return (
    <div className="space-y-6 pb-12" data-testid="startup-expenses-page">
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold leading-tight"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            Startup Expenses
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Phase 1 working budget — tracked against the $28,000 startup figure.
            Enter actuals as you spend; they're saved automatically.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => printExpenses(actuals, notes)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border"
            style={{ borderColor: "#1A5FA8", color: "#1A5FA8", backgroundColor: "white" }}
            data-testid="print-pdf-button"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </button>
          <button
            onClick={() => exportCsv(actuals, notes)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#1A5FA8", color: "white" }}
            data-testid="export-csv-button"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </div>
      </div>

      <SummaryBar actuals={actuals} notes={notes} />

      <div className="space-y-5">
        {SECTIONS.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            actuals={actuals}
            notes={notes}
            onActualChange={handleActualChange}
            onNoteChange={handleNoteChange}
          />
        ))}
      </div>

      <div
        className="rounded-xl border p-4 text-sm text-muted-foreground leading-relaxed"
        style={{ borderColor: "hsl(var(--card-border))", backgroundColor: "hsl(var(--card))" }}
        data-testid="deer-lake-note"
      >
        <p className="font-semibold text-foreground mb-1">Deer Lake — excluded from this budget</p>
        <p>{DEER_LAKE_NOTE}</p>
      </div>
    </div>
  );
}
