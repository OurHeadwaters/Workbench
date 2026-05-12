/**
 * IndexPage — Now cockpit.
 *
 * ADHD-first design (five rules):
 *  1. One decision at the door — single primary action visible immediately.
 *  2. Re-entry in under 5 s — re-entry card shows where you left off.
 *  3. Time estimates on every action — time blindness is real.
 *  4. Visible momentum — "Done today" block persisted to localStorage.
 *  5. Rate-to-life translation — $175/hr × 3 hr = real family outcomes.
 *
 * See docs/design/progressive-disclosure.md for the canonical pattern rule.
 */

import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useScenario } from "@/lib/scenario";
import { ProvisionalBanner } from "@/components/ProvisionalBanner";
import { FOCUS_AREAS, type FocusArea, type TimeEstimate } from "@/data/whatsNext";
import {
  Handshake,
  ChevronRight,
  Clock,
  CheckCircle2,
  RotateCcw,
  HelpCircle,
  Gift,
  AlertCircle,
  DollarSign,
  CheckSquare,
  Plus,
  X,
  Wallet,
} from "lucide-react";

const FOCUS_STORAGE_KEY = "pgv2.whatsnext.focus";
const DONE_TODAY_KEY = "pgv2.done-today";
const REENTRY_KEY = "pgv2.reentry";

// ─── Helpers ────────────────────────────────────────────────────────────────

function readActiveFocus(): FocusArea | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(FOCUS_STORAGE_KEY);
  return FOCUS_AREAS.find((a) => a.id === v) ?? null;
}

interface ReentryState {
  focusId: FocusArea["id"] | null;
  stepIndex: number;
  ts: number;
}

function readReentry(): ReentryState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(REENTRY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReentryState;
  } catch {
    return null;
  }
}

interface DoneItem {
  id: string;
  text: string;
}

function readDoneToday(): DoneItem[] {
  if (typeof window === "undefined") return [];
  try {
    const todayKey = new Date().toDateString();
    const raw = window.localStorage.getItem(`${DONE_TODAY_KEY}.${todayKey}`);
    if (!raw) return [];
    return JSON.parse(raw) as DoneItem[];
  } catch {
    return [];
  }
}

function saveDoneToday(items: DoneItem[]) {
  if (typeof window === "undefined") return;
  const todayKey = new Date().toDateString();
  window.localStorage.setItem(`${DONE_TODAY_KEY}.${todayKey}`, JSON.stringify(items));
}

// ─── Time estimate badge ──────────────────────────────────────────────────────

function TimeBadge({ estimate }: { estimate: TimeEstimate }) {
  const styles: Record<TimeEstimate, string> = {
    "15 min": "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "1 hr": "bg-blue-50 text-blue-700 border border-blue-200",
    "half day": "bg-amber-50 text-amber-700 border border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[estimate]}`}
    >
      <Clock className="h-3 w-3" />
      {estimate}
    </span>
  );
}

// ─── Re-entry card ────────────────────────────────────────────────────────────

function ReentryCard({ focus }: { focus: FocusArea }) {
  const reentry = readReentry();
  const stepIndex = reentry?.focusId === focus.id ? reentry.stepIndex : 0;
  const step = focus.steps[stepIndex] ?? focus.steps[0];

  return (
    <div
      className="rounded-xl border-2 p-4"
      style={{ borderColor: focus.accent, backgroundColor: focus.accentSoft }}
      data-testid="reentry-card"
    >
      <div className="flex items-start gap-3">
        <div
          className="h-8 w-8 rounded-md grid place-items-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: focus.accent, color: "#fff" }}
        >
          <RotateCcw className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide mb-0.5"
            style={{ color: focus.accentInk, opacity: 0.7 }}>
            You were working on
          </p>
          <p className="text-sm font-semibold" style={{ color: focus.accentInk }}>
            {focus.title}
          </p>
          <p className="text-xs mt-1" style={{ color: focus.accentInk, opacity: 0.85 }}>
            Step {stepIndex + 1}: {step.action}
          </p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <TimeBadge estimate={step.timeEstimate} />
            <Link
              href="/what-next"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md"
              style={{ backgroundColor: focus.accent, color: "#fff" }}
              data-testid="reentry-pick-up"
            >
              Pick up here <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Primary action block ─────────────────────────────────────────────────────

function PrimaryAction({ focus }: { focus: FocusArea }) {
  const step = focus.steps[0];
  return (
    <div
      className="rounded-xl border-2 p-5"
      style={{ borderColor: focus.accent + "88" }}
      data-testid="primary-action-block"
    >
      <div className="flex items-start gap-3">
        <div
          className="h-9 w-9 rounded-md grid place-items-center flex-shrink-0 text-white"
          style={{ backgroundColor: focus.accent }}
        >
          <span className="text-base font-bold">1</span>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: focus.accent }}
          >
            {focus.title}
          </p>
          <p className="text-base font-semibold leading-snug">{step.action}</p>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{step.detail}</p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <TimeBadge estimate={step.timeEstimate} />
            <Link
              href="/what-next"
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md border"
              style={{ borderColor: focus.accent + "55", color: focus.accentInk, backgroundColor: focus.accentSoft }}
              data-testid="primary-action-open"
            >
              Open all steps <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contracts pipeline status ────────────────────────────────────────────────

const DEAL_PHASES = ["Idea", "Pitch", "Contract", "Fulfillment", "Impact"] as const;
type DealPhase = (typeof DEAL_PHASES)[number];
const CURRENT_PHASE: DealPhase = "Pitch";
const CURRENT_PHASE_IDX = DEAL_PHASES.indexOf(CURRENT_PHASE);

function DealFlowBar() {
  return (
    <div className="space-y-2" data-testid="deal-flow-bar">
      <div className="flex items-center gap-1">
        {DEAL_PHASES.map((phase, i) => {
          const isPast = i < CURRENT_PHASE_IDX;
          const isCurrent = i === CURRENT_PHASE_IDX;
          const isFuture = i > CURRENT_PHASE_IDX;
          return (
            <div key={phase} className="flex items-center gap-1 flex-1">
              <div className="flex-1">
                <div
                  className={`h-1.5 rounded-full ${isPast ? "opacity-100" : isCurrent ? "opacity-100" : "opacity-30"}`}
                  style={{ backgroundColor: isFuture ? "#CBD5E1" : "#1A5FA8" }}
                />
                <p
                  className={`text-[10px] mt-1 font-medium truncate ${isCurrent ? "text-[#1A5FA8]" : "text-muted-foreground"}`}
                  style={{ fontWeight: isCurrent ? 700 : 400 }}
                >
                  {isCurrent && "● "}{phase}
                </p>
              </div>
              {i < DEAL_PHASES.length - 1 && (
                <div className="w-2 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContractsPipelineBlock() {
  return (
    <Link
      href="/contracts"
      className="block rounded-xl border bg-card overflow-hidden hover:shadow-sm transition-shadow"
      style={{ borderTopColor: "#1A5FA8", borderTopWidth: "4px" }}
      data-testid="contracts-pipeline-block"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="h-8 w-8 rounded-md grid place-items-center flex-shrink-0"
            style={{ backgroundColor: "#EBF3FB", color: "#1A5FA8" }}
          >
            <Handshake className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-sm font-semibold">Community Contracts</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                <AlertCircle className="h-3 w-3" />
                Open action
              </span>
            </div>

            <div className="mt-3">
              <DealFlowBar />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Current phase</p>
                <p className="font-semibold text-[#1A5FA8]">Pitch → Trial</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next gate</p>
                <p className="font-semibold">Council date booked</p>
              </div>
            </div>

            <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 px-3 py-2">
              <p className="text-xs text-orange-800 font-medium">
                Open action: Facilitate 807 grants → benefits plan
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <TimeBadge estimate="1 hr" />
              </div>
            </div>

            <p
              className="mt-3 text-xs text-[#1A5FA8] font-medium inline-flex items-center gap-1"
            >
              Open Contracts detail <ChevronRight className="h-3 w-3" />
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Startup budget card ──────────────────────────────────────────────────────

const STARTUP_LS_KEY = "pgv2.startup-expenses.actuals";
const STARTUP_BUDGET_TOTAL = 28_000;
// Aggregate low / high across all non-Deer-Lake line items (mirrors StartupExpensesPage)
const STARTUP_ESTIMATE_LOW = 8_030;
const STARTUP_ESTIMATE_HIGH = 16_290;

function readStartupActuals(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STARTUP_LS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function sumActuals(actuals: Record<string, string>): number {
  return Object.values(actuals).reduce((sum, v) => {
    const n = parseFloat(v.replace(/[$,]/g, ""));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
}

function fmtMoney(n: number) {
  return "$" + Math.abs(n).toLocaleString("en-CA");
}

function StartupBudgetCard() {
  const [actuals, setActuals] = useState<Record<string, string>>({});

  useEffect(() => {
    setActuals(readStartupActuals());

    function onStorage(e: StorageEvent) {
      if (e.key === STARTUP_LS_KEY) {
        setActuals(readStartupActuals());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const hasActuals = Object.values(actuals).some((v) => v.trim() !== "");
  const actualSpend = sumActuals(actuals);
  const midpoint = Math.round((STARTUP_ESTIMATE_LOW + STARTUP_ESTIMATE_HIGH) / 2);
  const spendForRunway = hasActuals ? actualSpend : midpoint;
  const runway = STARTUP_BUDGET_TOTAL - spendForRunway;
  const overBudget = runway < 0;
  const runwayPct = Math.max(0, Math.min(100, (runway / STARTUP_BUDGET_TOTAL) * 100));

  return (
    <Link
      href="/startup-expenses"
      className="block rounded-xl border p-4 hover:shadow-sm transition-shadow"
      style={{ borderColor: "#1A5FA8" + "44", backgroundColor: "#EBF3FB" }}
      data-testid="startup-budget-card"
    >
      <div className="flex items-start gap-3">
        <div
          className="h-8 w-8 rounded-md grid place-items-center flex-shrink-0"
          style={{ backgroundColor: "#1A5FA8", color: "#fff" }}
        >
          <Wallet className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0F3460] opacity-70">
              Startup budget
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1A5FA8]">
              Details <ChevronRight className="h-3 w-3" />
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <p className="text-[10px] text-[#0F3460] opacity-60 mb-0.5">Budget</p>
              <p className="text-sm font-bold text-[#0F3460] tabular-nums">
                {fmtMoney(STARTUP_BUDGET_TOTAL)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#0F3460] opacity-60 mb-0.5">
                {hasActuals ? "Actual spend" : "Est. spend"}
              </p>
              <p className="text-sm font-bold text-[#0F3460] tabular-nums">
                {hasActuals
                  ? fmtMoney(actualSpend)
                  : `${fmtMoney(STARTUP_ESTIMATE_LOW)}–${fmtMoney(STARTUP_ESTIMATE_HIGH)}`}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#0F3460] opacity-60 mb-0.5">Runway left</p>
              <p
                className="text-sm font-bold tabular-nums"
                style={{ color: overBudget ? "#DC2626" : "#065F46" }}
              >
                {overBudget ? "–" : ""}{fmtMoney(runway)}
              </p>
            </div>
          </div>

          <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${100 - runwayPct}%`,
                backgroundColor: overBudget ? "#DC2626" : "#1A5FA8",
              }}
            />
          </div>
          <p className="text-[10px] text-[#0F3460] opacity-50 mt-1">
            {hasActuals
              ? `${Math.round(runwayPct)}% of budget remaining (actual)`
              : `~${Math.round(runwayPct)}% remaining (est. midpoint)`}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Rate-to-life widget ──────────────────────────────────────────────────────

const LEAD_RATE = 175;
const FOCUS_HOURS = 3;
const FOCUS_EARNINGS = LEAD_RATE * FOCUS_HOURS;

const LIFE_MILESTONES = [
  { threshold: 600, label: "a week of groceries for the family" },
  { threshold: 400, label: "two weeks of household groceries" },
  { threshold: 300, label: "a month of phone + internet bills" },
  { threshold: 200, label: "a tank of gas and then some" },
];

function getRateToLife(earnings: number): string {
  const match = LIFE_MILESTONES.find((m) => earnings >= m.threshold);
  if (match) return match.label;
  return "a meaningful contribution to household costs";
}

function RateToLifeWidget() {
  const lifeLabel = getRateToLife(FOCUS_EARNINGS);
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "#1A5FA8" + "44", backgroundColor: "#EBF3FB" }}
      data-testid="rate-to-life-widget"
    >
      <div className="flex items-start gap-3">
        <div
          className="h-8 w-8 rounded-md grid place-items-center flex-shrink-0"
          style={{ backgroundColor: "#1A5FA8", color: "#fff" }}
        >
          <DollarSign className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0F3460] opacity-70 mb-0.5">
            Today's focus block
          </p>
          <p className="text-lg font-semibold text-[#0F3460]">
            ${FOCUS_EARNINGS.toLocaleString()}
          </p>
          <p className="text-sm text-[#0F3460] mt-0.5">
            At ${LEAD_RATE}/hr × {FOCUS_HOURS} hours ={" "}
            <span className="font-semibold">{lifeLabel}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Decision tree ────────────────────────────────────────────────────────────

type Q1 = "yes" | "no";
type Q2 = "delivery" | "sales";
type Q3 = "yes" | "no";

function getDecisionAction(q1: Q1, q2: Q2, q3: Q3): { focusId: FocusArea["id"]; stepIdx: number } {
  if (q3 === "yes") return { focusId: "contracts", stepIdx: 3 };
  if (q1 === "yes" && q2 === "delivery") return { focusId: "contracts", stepIdx: 2 };
  if (q1 === "yes" && q2 === "sales") return { focusId: "contracts", stepIdx: 1 };
  if (q1 === "no" && q2 === "sales") return { focusId: "contracts", stepIdx: 0 };
  return { focusId: "salts", stepIdx: 0 };
}

function DecisionTree() {
  const [open, setOpen] = useState(false);
  const [q1, setQ1] = useState<Q1 | null>(null);
  const [q2, setQ2] = useState<Q2 | null>(null);
  const [q3, setQ3] = useState<Q3 | null>(null);

  function reset() {
    setQ1(null);
    setQ2(null);
    setQ3(null);
  }

  const showResult = q1 !== null && q2 !== null && q3 !== null;
  let resultFocus: FocusArea | undefined;
  let resultStep: FocusArea["steps"][0] | undefined;
  if (showResult) {
    const { focusId, stepIdx } = getDecisionAction(q1!, q2!, q3!);
    resultFocus = FOCUS_AREAS.find((a) => a.id === focusId);
    resultStep = resultFocus?.steps[stepIdx];
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--card-border))" }}
      data-testid="decision-tree"
    >
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          reset();
        }}
        className="w-full flex items-center justify-between px-4 py-3 text-sm bg-card hover:bg-muted/30 transition-colors"
      >
        <span className="flex items-center gap-2 font-medium">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          I don't know what to do right now
        </span>
        <ChevronRight
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <div
          className="border-t px-4 py-4 space-y-5 bg-card"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          {!showResult ? (
            <>
              {/* Q1 */}
              <div>
                <p className="text-sm font-medium mb-2">
                  1. Do I have an active contract right now?
                </p>
                <div className="flex gap-2">
                  {(["yes", "no"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setQ1(v)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                        q1 === v
                          ? "bg-[#1A5FA8] text-white border-[#1A5FA8]"
                          : "bg-card border-card-border text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {v === "yes" ? "Yes" : "Not yet"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div>
                <p className="text-sm font-medium mb-2">
                  2. Am I in delivery mode or sales mode?
                </p>
                <div className="flex gap-2">
                  {(["delivery", "sales"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setQ2(v)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                        q2 === v
                          ? "bg-[#1A5FA8] text-white border-[#1A5FA8]"
                          : "bg-card border-card-border text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {v === "delivery" ? "Delivery — doing the work" : "Sales — finding the work"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <p className="text-sm font-medium mb-2">
                  3. Is there an overdue open action I've been avoiding?
                </p>
                <div className="flex gap-2">
                  {(["yes", "no"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setQ3(v)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                        q3 === v
                          ? "bg-[#1A5FA8] text-white border-[#1A5FA8]"
                          : "bg-card border-card-border text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {v === "yes" ? "Yes, honestly" : "No, I'm clear"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            resultFocus && resultStep && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Do this one thing
                </p>
                <div
                  className="rounded-lg border p-4"
                  style={{
                    borderColor: resultFocus.accent + "66",
                    backgroundColor: resultFocus.accentSoft,
                  }}
                  data-testid="decision-result"
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: resultFocus.accentInk, opacity: 0.7 }}
                  >
                    {resultFocus.title}
                  </p>
                  <p className="text-sm font-semibold leading-snug" style={{ color: resultFocus.accentInk }}>
                    {resultStep.action}
                  </p>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: resultFocus.accentInk, opacity: 0.85 }}>
                    {resultStep.detail}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <TimeBadge estimate={resultStep.timeEstimate} />
                    <Link
                      href="/what-next"
                      className="text-xs font-medium inline-flex items-center gap-1 underline"
                      style={{ color: resultFocus.accentInk }}
                    >
                      See all steps <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Try again
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── Done today ───────────────────────────────────────────────────────────────

function DoneToday() {
  const [items, setItems] = useState<DoneItem[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setItems(readDoneToday());
  }, []);

  function addItem() {
    const text = input.trim();
    if (!text) return;
    const newItems = [
      ...items,
      { id: Date.now().toString(), text },
    ];
    setItems(newItems);
    saveDoneToday(newItems);
    setInput("");
  }

  function removeItem(id: string) {
    const newItems = items.filter((i) => i.id !== id);
    setItems(newItems);
    saveDoneToday(newItems);
  }

  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "hsl(var(--card-border))" }}
      data-testid="done-today"
    >
      <div className="flex items-center gap-2 mb-3">
        <CheckSquare className="h-4 w-4 text-emerald-600" />
        <p className="text-sm font-semibold">Done today</p>
        {items.length > 0 && (
          <span className="ml-auto text-xs text-emerald-700 font-medium">
            {items.length} thing{items.length !== 1 ? "s" : ""} done
          </span>
        )}
      </div>

      {items.length > 0 && (
        <ul className="space-y-1.5 mb-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              <span className="flex-1 truncate">{item.text}</span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addItem();
          }}
          placeholder="What did you just finish?"
          className="flex-1 text-sm px-3 py-1.5 rounded-md border bg-background outline-none focus:ring-1 focus:ring-emerald-400"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="done-today-input"
        />
        <button
          type="button"
          onClick={addItem}
          className="p-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex-shrink-0"
          aria-label="Add"
          data-testid="done-today-add"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function IndexPage() {
  const { scenario } = useScenario();
  const [activeFocus, setActiveFocus] = useState<FocusArea | null>(null);

  useEffect(() => {
    setActiveFocus(readActiveFocus());
  }, []);

  const contractsFocus = FOCUS_AREAS.find((a) => a.id === "contracts")!;
  const primaryFocus = activeFocus ?? contractsFocus;
  const hasReentry = activeFocus !== null;

  return (
    <div className="space-y-6" data-testid="page-index">
      {/* ── Re-entry card (if returning user has a focus set) ── */}
      {hasReentry && <ReentryCard focus={activeFocus!} />}

      {/* ── Contracts Pipeline — first visible content ── */}
      <ContractsPipelineBlock />

      {/* ── Primary action (one thing to do) ── */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          {hasReentry ? "Your current focus" : "Start here"}
        </p>
        <PrimaryAction focus={primaryFocus} />
      </section>

      {/* ── Rate-to-life ── */}
      <RateToLifeWidget />

      {/* ── Startup budget runway ── */}
      <StartupBudgetCard />

      {/* ── Decision tree ── */}
      <DecisionTree />

      {/* ── Done today ── */}
      <DoneToday />

      {/* ── Nav shortcuts (Pipeline / Money / Reference only — not re-listing Now content) ── */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: "hsl(var(--card-border))" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Navigate
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Link
            href="/contracts"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border bg-card hover:bg-muted/30 transition-colors"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <Handshake className="h-3.5 w-3.5 text-[#1A5FA8]" />
            Pipeline detail
          </Link>
          <Link
            href="/startup-expenses"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border bg-card hover:bg-muted/30 transition-colors"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <Wallet className="h-3.5 w-3.5 text-[#1A5FA8]" />
            Startup Budget
          </Link>
          <Link
            href="/debt-attack"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border bg-card hover:bg-muted/30 transition-colors"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <span className="text-[#6d28d9] font-bold text-base leading-none">↓</span>
            Money — Debt
          </Link>
          <Link
            href="/engagement-pricing"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border bg-card hover:bg-muted/30 transition-colors"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <span className="text-[#1F5B3F] font-bold text-base leading-none">$</span>
            Engagement Pricing
          </Link>
          <Link
            href="/what-next"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border bg-card hover:bg-muted/30 transition-colors"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <span className="text-[#0F766E] font-bold text-base leading-none">→</span>
            All focus areas
          </Link>
          <Link
            href="/archetypes"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border bg-card hover:bg-muted/30 transition-colors"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <span className="text-muted-foreground font-bold text-base leading-none">≡</span>
            Reference
          </Link>
        </div>
      </div>
    </div>
  );
}
