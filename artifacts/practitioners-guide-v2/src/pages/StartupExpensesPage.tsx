/**
 * StartupExpensesPage — Phase 1 startup budget tracker.
 *
 * Three sections: one-time hardware & setup, one-time business setup,
 * and monthly ongoing costs — all tracked against the $28,000 startup figure.
 *
 * ADHD-first design:
 *  1. Scannable sections, clear labels, no clutter.
 *  2. Actuals persisted to localStorage — enter once, available always.
 *  3. Summary bar stays pinned at the top so runway is always visible.
 *  4. Deer Lake items flagged as excluded so the budget stays honest.
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
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

const LS_KEY = "pgv2.startup-expenses.actuals";

function loadActuals(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveActuals(actuals: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(actuals));
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

// ── Summary bar ───────────────────────────────────────────────────────────────

function SummaryBar({ actuals }: { actuals: Record<string, string> }) {
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

        <div className="flex gap-6 flex-wrap">
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
  onActualChange,
}: {
  item: LineItem;
  color: string;
  colorSoft: string;
  colorInk: string;
  actual: string;
  onActualChange: (id: string, value: string) => void;
}) {
  const Icon = item.icon;
  const actualNum = parseActual(actual);
  const hasActual = actual.trim() !== "";
  const withinRange = hasActual && actualNum >= item.low && actualNum <= item.high;
  const overHigh = hasActual && actualNum > item.high;

  return (
    <div
      className={`flex items-start gap-3 py-3 border-b last:border-b-0 ${item.deerLake ? "opacity-50" : ""}`}
      style={{ borderColor: colorSoft }}
      data-testid={`line-item-${item.id}`}
    >
      <div
        className="h-7 w-7 rounded-md grid place-items-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: colorSoft, color: colorInk }}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
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

          <div className="flex items-center gap-3 flex-shrink-0">
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
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({
  section,
  actuals,
  onActualChange,
}: {
  section: Section;
  actuals: Record<string, string>;
  onActualChange: (id: string, value: string) => void;
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
              onActualChange={onActualChange}
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

  useEffect(() => {
    setActuals(loadActuals());
  }, []);

  const handleActualChange = useCallback((id: string, value: string) => {
    setActuals((prev) => {
      const next = { ...prev, [id]: value };
      saveActuals(next);
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

      <SummaryBar actuals={actuals} />

      <div className="space-y-5">
        {SECTIONS.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            actuals={actuals}
            onActualChange={handleActualChange}
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
