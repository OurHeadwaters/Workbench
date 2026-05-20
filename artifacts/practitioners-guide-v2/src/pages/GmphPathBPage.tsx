/**
 * GmphPathBPage — GMPH Revenue-Share Proposal (Path B)
 *
 * Path B frames the $72,000 balance as a revenue-share partnership:
 * GMPH receives 100% of Legacy Asset Manager funnel revenue until $72k
 * is recovered, then retains ongoing upside with no further obligation.
 *
 * This page is designed to be sent directly to a GMPH contact.
 * It is plain-language, honest about projections, and PDF-printable.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Home,
  Brain,
  Users,
  Bell,
  Sun,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Mail,
  Printer,
  ChevronDown,
  ChevronUp,
  Handshake,
  Pencil,
  Save,
  RotateCcw,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

const DEBT_TOTAL = 72_000;

const TOOLS = [
  {
    id: "homebase-ops",
    icon: Home,
    name: "Homebase Ops",
    tagline: "Operations dashboard for care home directors",
    audience: "Directors, administrators, facility managers",
    problem:
      "Running a care home means tracking dozens of moving parts every day — staffing, rooms, schedules, daily barriers. Most of that coordination still happens in email and paper.",
    solution:
      "Homebase Ops gives the person in charge a single, calm screen: who's here today, what needs to clear before end of shift, and what's upcoming. No charts, no noise — just the things that actually need attention.",
    pricing: "$79 / facility / month",
    pricingNote: "One flat rate per facility. No per-user fees.",
    accent: "#1F5B3F",
    accentSoft: "#d1fae5",
  },
  {
    id: "memory-lane",
    icon: Brain,
    name: "Memory Lane",
    tagline: "Resident life history — without a medical chart",
    audience: "Families, care aides, recreation staff",
    problem:
      "Every resident has a story. Most of it lives in a family member's head and never makes it to care staff. When it does, it ends up in a clinical chart that recreation staff can't easily access.",
    solution:
      "Memory Lane lets families contribute favourite moments, lifelong interests, and meaningful memories in plain language — no forms, no medical vocabulary. Staff see what matters to a resident before they walk in the room.",
    pricing: "$29 / facility / month",
    pricingNote: "Add-on to Homebase Ops or standalone.",
    accent: "#6d28d9",
    accentSoft: "#ede9fe",
  },
  {
    id: "wander-together",
    icon: Users,
    name: "Wander Together",
    tagline: "Shared tablet mode for resident check-ins",
    audience: "Care aides, visiting volunteers, recreation staff",
    problem:
      "Shared facility tablets are a headache: no one logs out, resident data gets mixed, and hygiene on shared screens is an afterthought.",
    solution:
      "Wander Together is a kiosk-style mode that auto-clears between residents after a set timer, keeps context clean, and makes it easy for any staff member to pull up the right person quickly.",
    pricing: "Included with Homebase Ops",
    pricingNote: "No additional charge.",
    accent: "#1A5FA8",
    accentSoft: "#dbeafe",
  },
  {
    id: "hallway-notice",
    icon: Bell,
    name: "Hallway Notice",
    tagline: "Shift-to-shift handoff feed for care teams",
    audience: "Nurses, PSWs, team leads",
    problem:
      "Critical information between shifts gets communicated verbally, in notebooks, or in a chat app that nobody has the same access to. Things get missed. Staff spend the first 20 minutes of every shift playing catch-up.",
    solution:
      "Hallway Notice is a chronological shift feed — staff post updates, tag what needs following up, and tap 'I've got this' to acknowledge alerts. Nothing clinical, nothing that belongs in a chart. Just the communication layer that care teams already need.",
    pricing: "$19 / facility / month",
    pricingNote: "Add-on or standalone.",
    accent: "#b45309",
    accentSoft: "#fef3c7",
  },
  {
    id: "bright-side",
    icon: Sun,
    name: "Bright Side",
    tagline: "Recreation therapy coordination for LTC",
    audience: "Recreation therapists, activity coordinators, RT managers",
    problem:
      "Recreation therapy staff in long-term care track resident participation, document outcomes, and report to care teams — in spreadsheets, paper forms, or software built for clinical billing, not for RT workflow.",
    solution:
      "Bright Side is purpose-built for recreation therapy in LTC. Staff log joy moments, track engagement, and produce the documentation they need without adapting clinical software to a non-clinical job.",
    pricing: "$149 / facility / month",
    pricingNote: "Includes director dashboard and staff app.",
    accent: "#c2410c",
    accentSoft: "#fee2e2",
  },
];

const BUNDLE_PRICE = 199; // combined suite per facility
const CONSERVATIVE_SUBSCRIBERS = [5, 10, 20, 30, 50];

function money(n: number) {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

function monthsToClear(monthlyRevenue: number): number {
  if (monthlyRevenue <= 0) return 0;
  return Math.ceil(DEBT_TOTAL / monthlyRevenue);
}

function clearanceDate(months: number): string {
  const d = new Date(2025, 4 + months); // Start May 2025 as reference
  return d.toLocaleDateString("en-CA", { month: "long", year: "numeric" });
}

const TRACKER_KEY = "gmph-balance-tracker-v1";

interface TrackerState {
  collected: number;
  monthlyRate: number;
  lastUpdated: string;
}

function loadTracker(): TrackerState {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    if (raw) return JSON.parse(raw) as TrackerState;
  } catch {
    // ignore
  }
  return { collected: 0, monthlyRate: 0, lastUpdated: "" };
}

function saveTracker(state: TrackerState) {
  localStorage.setItem(TRACKER_KEY, JSON.stringify(state));
}

function BalanceTracker() {
  const [saved, setSaved] = useState<TrackerState>(() => loadTracker());
  const [editing, setEditing] = useState(false);
  const [draftCollected, setDraftCollected] = useState(String(saved.collected));
  const [draftRate, setDraftRate] = useState(String(saved.monthlyRate));

  useEffect(() => {
    setDraftCollected(String(saved.collected));
    setDraftRate(String(saved.monthlyRate));
  }, [saved]);

  function handleEdit() {
    setEditing(true);
  }

  function handleSave() {
    const collected = Math.max(0, Math.min(DEBT_TOTAL, Number(draftCollected) || 0));
    const monthlyRate = Math.max(0, Number(draftRate) || 0);
    const next: TrackerState = {
      collected,
      monthlyRate,
      lastUpdated: new Date().toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    saveTracker(next);
    setSaved(next);
    setEditing(false);
  }

  function handleReset() {
    const next: TrackerState = { collected: 0, monthlyRate: 0, lastUpdated: "" };
    saveTracker(next);
    setSaved(next);
    setEditing(false);
  }

  const remaining = Math.max(0, DEBT_TOTAL - saved.collected);
  const pct = Math.min(100, (saved.collected / DEBT_TOTAL) * 100);
  const monthsLeft =
    saved.monthlyRate > 0 ? Math.ceil(remaining / saved.monthlyRate) : null;
  const cleared = remaining === 0;

  const clearDateStr = (() => {
    if (monthsLeft === null) return null;
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthsLeft);
    return d.toLocaleDateString("en-CA", { month: "long", year: "numeric" });
  })();

  return (
    <div
      className="rounded-xl border-2 overflow-hidden"
      style={{
        borderColor: cleared ? "#065f46" : "#1f3d2e",
        background: "hsl(var(--card))",
      }}
    >
      <div
        className="px-5 py-3 flex items-center justify-between gap-3"
        style={{ background: cleared ? "#065f46" : "#1f3d2e" }}
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-200" />
          <span className="text-sm font-semibold text-white">
            {cleared ? "Balance cleared — $72,000 recovered" : "Live balance tracker · $72,000 to recover"}
          </span>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          {!editing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
              style={{ background: "#ffffff20", color: "#fff" }}
            >
              <Pencil className="h-3 w-3" />
              Update numbers
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium"
                style={{ background: "#d1fae5", color: "#065f46" }}
              >
                <Save className="h-3 w-3" />
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium"
                style={{ background: "#ffffff20", color: "#fff" }}
              >
                Cancel
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleReset}
            title="Reset to zero"
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
            style={{ background: "#ffffff14", color: "#d1fae580" }}
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
            <span>{money(saved.collected)} collected</span>
            <span>{pct.toFixed(1)}%</span>
            <span>{money(DEBT_TOTAL)} target</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "#d1fae5" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: cleared ? "#065f46" : "#1f3d2e",
              }}
            />
          </div>
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "#d1fae5" }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-emerald-700 mb-1">
              Collected
            </p>
            {editing ? (
              <input
                type="number"
                min={0}
                max={72000}
                value={draftCollected}
                onChange={(e) => setDraftCollected(e.target.value)}
                className="w-full text-center text-lg font-bold tabular-nums bg-white rounded-lg border px-2 py-0.5"
                style={{ borderColor: "#6ee7b7", color: "#065f46" }}
              />
            ) : (
              <p className="text-xl font-bold tabular-nums text-emerald-900">
                {money(saved.collected)}
              </p>
            )}
          </div>

          <div
            className="rounded-xl p-3 text-center"
            style={{ background: cleared ? "#d1fae5" : "#fef3c7" }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-[0.16em] mb-1"
              style={{ color: cleared ? "#065f46" : "#b45309" }}
            >
              Remaining
            </p>
            <p
              className="text-xl font-bold tabular-nums"
              style={{ color: cleared ? "#065f46" : "#92400e" }}
            >
              {cleared ? "—" : money(remaining)}
            </p>
          </div>

          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "hsl(var(--muted)/0.5)" }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-1">
              Monthly rate
            </p>
            {editing ? (
              <input
                type="number"
                min={0}
                value={draftRate}
                onChange={(e) => setDraftRate(e.target.value)}
                className="w-full text-center text-lg font-bold tabular-nums bg-white rounded-lg border px-2 py-0.5"
                style={{ borderColor: "hsl(var(--card-border))", color: "hsl(var(--foreground))" }}
              />
            ) : (
              <p className="text-xl font-bold tabular-nums text-foreground">
                {saved.monthlyRate > 0 ? money(saved.monthlyRate) : "—"}
              </p>
            )}
          </div>

          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "hsl(var(--muted)/0.5)" }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-1">
              Months to clear
            </p>
            <p className="text-xl font-bold tabular-nums text-foreground">
              {cleared ? "Done" : monthsLeft !== null ? `~${monthsLeft}` : "—"}
            </p>
          </div>
        </div>

        {/* Clear-by date */}
        {!cleared && clearDateStr && (
          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: "#dbeafe" }}
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-700" />
            <p className="text-sm text-blue-900">
              At the current run rate, the $72,000 balance clears by{" "}
              <strong>{clearDateStr}</strong>.
            </p>
          </div>
        )}

        {cleared && (
          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: "#d1fae5" }}
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-700" />
            <p className="text-sm text-emerald-900 font-semibold">
              The $72,000 balance has been fully recovered. GMPH retains ongoing revenue with no further obligation.
            </p>
          </div>
        )}

        {!cleared && saved.collected === 0 && !editing && (
          <p className="text-[11px] text-muted-foreground text-center">
            No revenue recorded yet. Click <strong>Update numbers</strong> to enter the first payment received.
          </p>
        )}

        {saved.lastUpdated && (
          <p className="text-[10px] text-muted-foreground text-right">
            Last updated: {saved.lastUpdated}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
      {children}
    </p>
  );
}

function ToolCard({ tool }: { tool: (typeof TOOLS)[0] }) {
  const [open, setOpen] = useState(false);
  const Icon = tool.icon;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
    >
      <div className="h-1" style={{ backgroundColor: tool.accent }} />
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="h-10 w-10 rounded-lg grid place-items-center flex-shrink-0"
            style={{ backgroundColor: tool.accentSoft, color: tool.accent }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-base font-semibold" style={{ fontFamily: "var(--app-font-serif)" }}>
                  {tool.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{tool.tagline}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold" style={{ color: tool.accent }}>
                  {tool.pricing}
                </p>
                <p className="text-[10px] text-muted-foreground">{tool.pricingNote}</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">For: </span>
              {tool.audience}
            </p>

            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="mt-3 flex items-center gap-1 text-xs font-medium transition-colors print:hidden"
              style={{ color: tool.accent }}
            >
              {open ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" /> Less detail
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" /> What it does
                </>
              )}
            </button>

            <div
              data-print-expand=""
              className={`mt-3 space-y-2 text-sm${open ? "" : " hidden"}`}
            >
              <div className="rounded-lg p-3" style={{ background: tool.accentSoft + "60" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: tool.accent }}>
                  The problem
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">{tool.problem}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "hsl(var(--muted)/0.4)" }}>
                <p className="text-xs font-semibold mb-1 text-foreground">What it does</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{tool.solution}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueCalculator() {
  const [subscribers, setSubscribers] = useState(10);
  const [pricePerMonth, setPricePerMonth] = useState(BUNDLE_PRICE);

  const monthlyRevenue = subscribers * pricePerMonth;
  const months = monthsToClear(monthlyRevenue);
  const clearDate = clearanceDate(months);

  const milestones = [
    { label: "5 facilities", subs: 5 },
    { label: "10 facilities", subs: 10 },
    { label: "20 facilities", subs: 20 },
    { label: "30 facilities", subs: 30 },
    { label: "50 facilities", subs: 50 },
  ];

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
    >
      <div className="h-1 bg-emerald-600" />
      <div className="p-5 space-y-5">
        <div data-print-hide="">
          <p className="text-xs font-semibold text-foreground mb-1">
            Monthly price per facility
          </p>
          <div className="flex flex-wrap gap-2">
            {[79, 149, 199, 249].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPricePerMonth(p)}
                className="px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all border"
                style={
                  pricePerMonth === p
                    ? { background: "#065f46", color: "#fff", borderColor: "#065f46" }
                    : { borderColor: "hsl(var(--card-border))", color: "hsl(var(--muted-foreground))" }
                }
              >
                {money(p)}/mo
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            $199 is the bundled-suite rate. $79 = Homebase Ops only. $149 = Bright Side only. $249 = full suite with Hallway Notice.
          </p>
        </div>

        <div data-print-hide="">
          <p className="text-xs font-semibold text-foreground mb-1">
            Number of subscribing facilities
          </p>
          <input
            type="range"
            min={1}
            max={100}
            value={subscribers}
            onChange={(e) => setSubscribers(Number(e.target.value))}
            className="w-full accent-emerald-700"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-0.5">
            <span>1</span>
            <span className="font-bold text-foreground">{subscribers} facilities</span>
            <span>100</span>
          </div>
        </div>

        <div
          className="rounded-xl p-4 grid grid-cols-3 gap-4"
          style={{ background: "#d1fae5" }}
        >
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-emerald-700 mb-1">
              Monthly revenue
            </p>
            <p className="text-xl font-bold tabular-nums text-emerald-900">
              {money(monthlyRevenue)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-emerald-700 mb-1">
              Months to clear
            </p>
            <p className="text-xl font-bold tabular-nums text-emerald-900">
              ~{months}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-emerald-700 mb-1">
              Balance clear by
            </p>
            <p className="text-sm font-bold text-emerald-900 leading-tight">
              {clearDate}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground mb-2">
            Scenario table · {money(pricePerMonth)}/mo per facility
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "hsl(var(--card-border))" }}>
                  <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">
                    Facilities
                  </th>
                  <th className="text-right py-2 pr-4 text-xs font-medium text-muted-foreground">
                    Monthly
                  </th>
                  <th className="text-right py-2 pr-4 text-xs font-medium text-muted-foreground">
                    Months
                  </th>
                  <th className="text-right py-2 text-xs font-medium text-muted-foreground">
                    Annual run-rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONSERVATIVE_SUBSCRIBERS.map((s) => {
                  const rev = s * pricePerMonth;
                  const mo = monthsToClear(rev);
                  const isActive = s === subscribers;
                  return (
                    <tr
                      key={s}
                      className="border-b last:border-0 cursor-pointer"
                      style={{
                        borderColor: "hsl(var(--card-border))",
                        background: isActive ? "#d1fae580" : undefined,
                      }}
                      onClick={() => setSubscribers(s)}
                    >
                      <td className="py-2 pr-4 font-medium" style={{ color: isActive ? "#065f46" : undefined }}>
                        {s}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums">{money(rev)}</td>
                      <td className="py-2 pr-4 text-right tabular-nums font-mono">~{mo}</td>
                      <td className="py-2 text-right tabular-nums text-muted-foreground">
                        {money(rev * 12)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            These are projections, not guarantees. The $72k balance is fixed — the timeline compresses
            as subscriber count grows. After clearance, 100% of ongoing revenue stays with GMPH.
          </p>
        </div>
      </div>
    </div>
  );
}

function AgreementTerm({
  number,
  heading,
  body,
}: {
  number: string;
  heading: string;
  body: string;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="h-7 w-7 rounded-full grid place-items-center flex-shrink-0 text-xs font-bold font-mono"
        style={{ background: "#1f3d2e", color: "#fff" }}
      >
        {number}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{heading}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{body}</p>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export function GmphPathBPage() {
  return (
    <div className="space-y-10 max-w-3xl print:max-w-none" data-testid="page-gmph-path-b">
      {/* Back link — hidden when printing */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors print:hidden"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Workspace
      </Link>

      {/* Print / send action — hidden when printing */}
      <div className="flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{ borderColor: "hsl(var(--card-border))", color: "hsl(var(--muted-foreground))" }}
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
      </div>

      {/* ── Header ── */}
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="h-10 w-10 rounded-lg grid place-items-center flex-shrink-0"
            style={{ background: "#1f3d2e", color: "#d1fae5" }}
          >
            <Handshake className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Headwaters → GMPH · Path B · May 2025
            </p>
            <h1
              className="text-3xl font-semibold leading-tight"
              style={{ fontFamily: "var(--app-font-serif)" }}
            >
              A revenue-share offer,<br />
              not a debt negotiation.
            </h1>
          </div>
        </div>

        <div
          className="rounded-xl border-l-4 p-4"
          style={{ borderColor: "#1f3d2e", background: "hsl(var(--muted)/0.4)" }}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            The direct software-for-debt conversation didn't land. That's fine — this is a different
            offer entirely. Headwaters has built five care-home tools that are ready to publish as
            a public product. We're proposing that <strong className="text-foreground">GMPH receives 100% of that
            revenue until $72,000 is recovered.</strong> After that, GMPH keeps ongoing upside with
            no further obligation to Headwaters. No cash outlay from either party. No lawyers
            required to understand it.
          </p>
        </div>
      </header>

      {/* ── The tools ── */}
      <section>
        <SectionLabel>The Legacy Asset Manager suite · five tools for care homes and families</SectionLabel>
        <div className="space-y-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        <div
          className="mt-4 rounded-xl border p-4 flex gap-3"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
        >
          <TrendingUp className="h-5 w-5 flex-shrink-0 text-emerald-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Combined bundle pricing</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              All five tools together: <strong className="text-foreground">$199 / facility / month.</strong>{" "}
              Individual tools are available à la carte. The bundle gives a care home everything for
              the price of one staff scheduling shift.
            </p>
          </div>
        </div>
      </section>

      {/* ── How the funnel works ── */}
      <section>
        <SectionLabel>How the funnel works · plain language</SectionLabel>
        <div className="space-y-3">
          {[
            {
              icon: TrendingUp,
              color: "#1A5FA8",
              heading: "Headwaters publishes the tools publicly",
              body: "The Legacy Asset Manager suite goes live as a real product — care homes, family members, and recreation therapists can subscribe directly. Headwaters handles all technical maintenance, customer support, and product updates.",
            },
            {
              icon: DollarSign,
              color: "#065f46",
              heading: "100% of subscription revenue flows to GMPH",
              body: "Every dollar collected from subscribers goes to GMPH — not a percentage, not a royalty. The full amount, until the $72,000 balance is reached. GMPH receives monthly statements showing exactly what came in and where the balance sits.",
            },
            {
              icon: Handshake,
              color: "#1f3d2e",
              heading: "GMPH actively promotes the tools",
              body: "GMPH has existing relationships with care homes, LTC operators, and family services networks. When GMPH promotes the suite, both sides benefit directly — faster clearance for GMPH, broader distribution for Headwaters.",
            },
            {
              icon: CheckCircle2,
              color: "#6d28d9",
              heading: "At $72,000: the balance is cleared, GMPH keeps the revenue stream",
              body: "Once $72,000 is recovered, the debt obligation is fully discharged. GMPH keeps receiving its negotiated share of ongoing revenue — or the parties agree to a clean termination with no further strings.",
            },
          ].map(({ icon: Icon, color, heading, body }) => (
            <div
              key={heading}
              className="rounded-xl border p-4 flex gap-4"
              style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
            >
              <div
                className="h-9 w-9 rounded-lg grid place-items-center flex-shrink-0"
                style={{ background: color + "18", color }}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{heading}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Revenue calculator ── */}
      <section>
        <SectionLabel>Revenue projection · adjust the sliders to see what's realistic</SectionLabel>
        <RevenueCalculator />
      </section>

      {/* ── Live balance tracker ── */}
      <section>
        <SectionLabel>Recovery tracker · actual progress against the $72k balance</SectionLabel>
        <BalanceTracker />
      </section>

      {/* ── Agreement structure ── */}
      <section>
        <SectionLabel>The agreement · plain language, no lawyers needed to follow this</SectionLabel>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
        >
          <div className="h-1" style={{ backgroundColor: "#1f3d2e" }} />
          <div className="p-5 space-y-4">
            <AgreementTerm
              number="01"
              heading="Headwaters publishes and maintains the Legacy Asset Manager suite"
              body="All technical work, customer support, hosting, security, and product updates are Headwaters' responsibility and cost. GMPH has no operating obligation."
            />
            <div className="border-t" style={{ borderColor: "hsl(var(--card-border))" }} />
            <AgreementTerm
              number="02"
              heading="Revenue flows to GMPH until $72,000 is reached"
              body="GMPH receives 100% of gross subscription revenue collected each month. Headwaters provides a monthly statement by the 5th business day of the following month showing subscriber count, gross revenue, and running balance. No deductions for processing fees or operational costs — gross revenue, full stop."
            />
            <div className="border-t" style={{ borderColor: "hsl(var(--card-border))" }} />
            <AgreementTerm
              number="03"
              heading="After $72,000: the balance is clear"
              body="When the running total hits $72,000, the debt obligation is fully discharged. GMPH and Headwaters agree in advance on what happens next — either GMPH retains an ongoing revenue share (to be negotiated), or the relationship terminates cleanly with no further obligation on either side."
            />
            <div className="border-t" style={{ borderColor: "hsl(var(--card-border))" }} />
            <AgreementTerm
              number="04"
              heading="GMPH may promote the tools through its networks"
              body="This is an option, not an obligation. If GMPH chooses to promote the suite to care home networks, municipal partners, or family services organizations, that directly accelerates the clearance timeline. Headwaters will credit any referral attribution GMPH provides."
            />
            <div className="border-t" style={{ borderColor: "hsl(var(--card-border))" }} />
            <AgreementTerm
              number="05"
              heading="No minimum subscribers. No penalty if revenue is slow."
              body="If the funnel takes longer than projected, the balance clears later — not faster, not differently. GMPH assumes no financial risk. Headwaters assumes all operational and market risk. The only variable is time."
            />
            <div className="border-t" style={{ borderColor: "hsl(var(--card-border))" }} />
            <AgreementTerm
              number="06"
              heading="Either party may terminate with 30 days' notice"
              body="If this arrangement no longer makes sense for GMPH, a 30-day notice terminates the revenue-share obligation. Any revenue received to date is credited against the $72k balance — the remaining balance is not accelerated or called due."
            />
          </div>
        </div>
      </section>

      {/* ── Why this works for GMPH ── */}
      <section>
        <SectionLabel>Why this works for GMPH</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              heading: "No cash outlay",
              body: "GMPH doesn't spend a dollar. The tools are built, the infrastructure is running, and the first subscriber pays before GMPH has to do anything.",
              color: "#065f46",
              bg: "#d1fae5",
            },
            {
              heading: "No technical responsibility",
              body: "Headwaters owns all technical operations. GMPH is a distribution partner and a revenue beneficiary — not an operator.",
              color: "#1A5FA8",
              bg: "#dbeafe",
            },
            {
              heading: "Turns a stale balance into active upside",
              body: "A $72k receivable that isn't moving is worth less every month it sits. This turns it into a revenue stream with a clear clearing mechanism.",
              color: "#6d28d9",
              bg: "#ede9fe",
            },
            {
              heading: "Upside continues after clearance",
              body: "The negotiated share doesn't stop at $72k if GMPH wants to keep participating. That's a separate conversation — but the option exists.",
              color: "#b45309",
              bg: "#fef3c7",
            },
          ].map(({ heading, body, color, bg }) => (
            <div
              key={heading}
              className="rounded-xl p-4"
              style={{ background: bg }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color }}>
                {heading}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Call to action ── */}
      <section>
        <SectionLabel>Next step · one response is all it takes to start</SectionLabel>
        <div
          className="rounded-xl border-2 p-6 text-center space-y-4"
          style={{ borderColor: "#1f3d2e", background: "#f0fdf4" }}
        >
          <div
            className="h-12 w-12 rounded-full grid place-items-center mx-auto"
            style={{ background: "#1f3d2e", color: "#d1fae5" }}
          >
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2
              className="text-xl font-semibold"
              style={{ fontFamily: "var(--app-font-serif)", color: "#1f3d2e" }}
            >
              Ready to talk?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Reply to this message — or send an email — with one of three responses:
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-left">
            {[
              {
                option: "A",
                label: "Let's do it",
                body: "We'll draft a one-page term sheet and send it within 48 hours for review.",
                color: "#065f46",
                bg: "#d1fae5",
              },
              {
                option: "B",
                label: "I have questions",
                body: "Send your questions by email or request a 30-minute call. We'll answer everything before any paperwork.",
                color: "#1A5FA8",
                bg: "#dbeafe",
              },
              {
                option: "C",
                label: "Not the right fit",
                body: "That's a useful answer too. Reply with any alternative you'd prefer and we'll respond honestly.",
                color: "#6d28d9",
                bg: "#ede9fe",
              },
            ].map(({ option, label, body, color, bg }) => (
              <div key={option} className="rounded-xl p-3" style={{ background: bg }}>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1" style={{ color }}>
                  Option {option}
                </p>
                <p className="text-sm font-semibold mb-1" style={{ color }}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-lg p-3 text-sm"
            style={{ background: "#d1fae580" }}
          >
            <span className="font-medium text-emerald-900">Contact: </span>
            <span className="text-emerald-800">Bobbie Parr · Headwaters · </span>
            <a
              href="mailto:bobbie@headwaters.ca"
              className="font-medium underline underline-offset-2 text-emerald-900"
            >
              bobbie@headwaters.ca
            </a>
          </div>
        </div>
      </section>

      {/* ── Print footer ── */}
      <div className="hidden print:block pt-8 border-t text-xs text-muted-foreground">
        <p>Headwaters · GMPH Path B Proposal · Generated {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>
        <p className="mt-1">This is a plain-language term sheet, not a legal contract. A formal agreement will be prepared upon mutual confirmation.</p>
      </div>

      {/* ── Bottom spacing ── */}
      <div className="h-8 print:hidden" />
    </div>
  );
}
