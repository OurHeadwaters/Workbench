/**
 * WhatNextPage — Business coaching "What's Next" view.
 *
 * PROGRESSIVE DISCLOSURE PATTERN (see docs/design/progressive-disclosure.md):
 *   - "Where You Are" summary panel: always visible (3 signal rows).
 *   - Focus-area cards: always visible at card level.
 *   - Step detail: collapses inside each card (accordion).
 *   - Selected focus is persisted to localStorage.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Handshake,
  Wrench,
  Zap,
  TrendingUp,
  Flame,
} from "lucide-react";
import { PageAnchor } from "@/components/PageAnchor";
import { FOCUS_AREAS, type FocusArea, type EffortPayoff, type TimeEstimate } from "@/data/whatsNext";
import { useScenario } from "@/lib/scenario";
import { money } from "@/lib/format";
import { PRACTITIONER_RATES, ACTIVE_FEES } from "@workspace/codetry-public";

const STORAGE_KEY = "pgv2.whatsnext.focus";
const REENTRY_KEY = "pgv2.reentry";

function readStoredFocus(): FocusArea["id"] | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "contracts" || v === "gmph") return v;
  return null;
}

function saveStoredFocus(id: FocusArea["id"] | null) {
  if (typeof window === "undefined") return;
  if (id === null) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, id);
  }
}

function saveReentry(focusId: FocusArea["id"], stepIndex: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    REENTRY_KEY,
    JSON.stringify({ focusId, stepIndex, ts: Date.now() }),
  );
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

// ─── Effort / payoff badge ────────────────────────────────────────────────────

function EffortBadge({ ep, label }: { ep: EffortPayoff; label: string }) {
  const styles: Record<EffortPayoff, string> = {
    "fast-low-risk": "bg-emerald-50 text-emerald-800 border border-emerald-200",
    "medium-high-payoff": "bg-blue-50 text-blue-800 border border-blue-200",
    "slow-burn-high-upside": "bg-violet-50 text-violet-800 border border-violet-200",
  };
  const Icon: Record<EffortPayoff, typeof Zap> = {
    "fast-low-risk": Zap,
    "medium-high-payoff": TrendingUp,
    "slow-burn-high-upside": Flame,
  };
  const I = Icon[ep];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[ep]}`}
    >
      <I className="h-3 w-3" />
      {label}
    </span>
  );
}

// ─── Focus area icon map ──────────────────────────────────────────────────────

const AREA_ICONS: Record<FocusArea["id"], typeof Handshake> = {
  contracts: Handshake,
  gmph: Wrench,
};

// ─── Focus area card ─────────────────────────────────────────────────────────

function FocusCard({
  area,
  selected,
  expanded,
  onSelect,
  onToggleExpand,
  onStepFocus,
}: {
  area: FocusArea;
  selected: boolean;
  expanded: boolean;
  onSelect: (id: FocusArea["id"] | null) => void;
  onToggleExpand: (id: FocusArea["id"]) => void;
  onStepFocus: (id: FocusArea["id"], stepIndex: number) => void;
}) {
  const Icon = AREA_ICONS[area.id];

  function handleSelect() {
    if (selected) {
      onSelect(null);
    } else {
      onSelect(area.id);
    }
  }

  return (
    <div
      className="rounded-xl border bg-card overflow-hidden transition-shadow"
      style={{
        borderTopColor: area.accent,
        borderTopWidth: "4px",
        borderColor: selected ? area.accent : undefined,
        boxShadow: selected ? `0 0 0 2px ${area.accent}33` : undefined,
      }}
      data-testid={`focus-card-${area.id}`}
    >
      {/* Card header — always visible */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="h-9 w-9 rounded-md grid place-items-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: area.accentSoft, color: area.accentInk }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-sm font-semibold">{area.title}</p>
                <p className="text-xs text-muted-foreground">{area.subtitle}</p>
              </div>
              {selected && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: area.accentSoft,
                    color: area.accentInk,
                    borderColor: area.accent + "55",
                  }}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Your focus
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {area.whyNow}
            </p>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <EffortBadge ep={area.effortPayoff} label={area.effortLabel} />
              <span className="text-xs text-muted-foreground">{area.payoffLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action row */}
      <div
        className="border-t px-4 py-2.5 flex items-center justify-between gap-3"
        style={{ borderColor: "hsl(var(--card-border))" }}
      >
        <button
          type="button"
          onClick={handleSelect}
          className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
          style={
            selected
              ? { backgroundColor: area.accent, color: "#fff" }
              : { backgroundColor: area.accentSoft, color: area.accentInk }
          }
          data-testid={`focus-select-${area.id}`}
        >
          {selected ? "Clear focus" : "Make this my focus"}
        </button>
        <button
          type="button"
          onClick={() => onToggleExpand(area.id)}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid={`focus-expand-${area.id}`}
        >
          {expanded ? (
            <>
              Hide steps <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Show {area.steps.length} next steps <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Steps — expanded */}
      {expanded && (
        <div
          className="border-t px-4 pb-4 pt-3 space-y-3"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid={`focus-steps-${area.id}`}
        >
          {area.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <button
                type="button"
                title={`Mark step ${i + 1} as where you left off`}
                onClick={() => onStepFocus(area.id, i)}
                className="flex-shrink-0 h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold mt-0.5 transition-opacity hover:opacity-70 cursor-pointer"
                style={{ backgroundColor: area.accentSoft, color: area.accentInk }}
              >
                {i + 1}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <p className="text-sm font-medium">{step.action}</p>
                  <TimeBadge estimate={step.timeEstimate} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Where You Are summary ────────────────────────────────────────────────────
//
// ADHD-first restructure: core tension leads (most actionable signal).
// Confirmed + in-motion details collapse under "Full picture" toggle —
// they're useful context but not the starting point on hard days.
//
// Content is derived from the current scenario state via useScenario().
// Two values are confirmed constants sourced from v7.ts.
const PORTAL_FEE = ACTIVE_FEES.portalDevelopment;
const LEAD_RATE = PRACTITIONER_RATES.lead;
const SUPPORT_RATE = PRACTITIONER_RATES.support;

function WhereYouAre() {
  const { scenario } = useScenario();
  const [fullPicture, setFullPicture] = useState(false);

  const a = scenario.contracts.agency;
  const s = scenario.salts;
  const contractConfirmed = a.feeTag.kind === "confirmed";
  const saltsIsProvisional = s.pAndL.tag.kind !== "confirmed";

  const confirmedItems: string[] = [
    `${money(PORTAL_FEE)} 807 portal development fee — confirmed revenue, the bridge that opens the trial window.`,
    `Agency rates set at $${LEAD_RATE}/hr lead · $${SUPPORT_RATE}/hr support${contractConfirmed ? " — under contract." : " — contract not yet signed."}`,
    `Salts ${saltsIsProvisional ? "cash-positive at model" : "cash-positive"}: ~${money(s.pAndL.netCash)}/yr${saltsIsProvisional ? " on planning targets" : ""}.`,
  ];

  const inMotionItems: string[] = [
    contractConfirmed
      ? `Northern Band contract active — ${money(a.fee)}/mo engagement starting ${a.startDate}.`
      : "Northern Band trial: posture set, scope not yet defined, council date not yet booked.",
    "807 grants → benefits plan: open action item, grant not yet identified.",
  ];

  const tension = contractConfirmed
    ? `The agency waterfall is running — ${money(a.monthlySurplusSepOnward)}/mo business surplus attacking ${money(a.capitalRecoveryAmount)} in capital recovery.`
    : `One confirmed number ($12k portal fee) and a wide-open trial window. The business needs a signed contract to activate the ${money(a.monthlySurplusJunAug)}–${money(a.monthlySurplusSepOnward)}/mo agency surplus — and the runway clock is running.`;

  return (
    <div
      className="rounded-xl border border-card-border bg-card overflow-hidden"
      data-testid="where-you-are-panel"
    >
      {/* Core tension — always first, always visible */}
      <div
        className="px-5 pt-5 pb-4"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Where you are right now
        </p>
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
          data-testid="core-tension"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 flex items-center gap-1.5 mb-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            The core tension right now
          </p>
          <p className="text-sm text-amber-900 leading-relaxed">{tension}</p>
        </div>
      </div>

      {/* Full picture toggle */}
      <div
        className="border-t px-5 py-2.5"
        style={{ borderColor: "hsl(var(--card-border))" }}
      >
        <button
          type="button"
          onClick={() => setFullPicture((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="full-picture-toggle"
        >
          {fullPicture ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Hide full picture
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Show full picture — what's confirmed and what's in motion
            </>
          )}
        </button>
      </div>

      {/* Collapsible detail */}
      {fullPicture && (
        <div
          className="border-t px-5 pb-5 pt-4 space-y-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="full-picture-detail"
        >
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              What's confirmed
            </p>
            <ul className="space-y-1 pl-5">
              {confirmedItems.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground list-disc leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              What's in motion
            </p>
            <ul className="space-y-1 pl-5">
              {inMotionItems.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground list-disc leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function WhatNextPage() {
  const [activeFocus, setActiveFocus] = useState<FocusArea["id"] | null>(
    () => readStoredFocus(),
  );
  // Centrally track which card is expanded so selecting a new card auto-collapses others.
  // On first render, auto-expand the persisted selected card if one exists.
  const [expandedId, setExpandedId] = useState<FocusArea["id"] | null>(
    () => readStoredFocus(),
  );

  useEffect(() => {
    saveStoredFocus(activeFocus);
  }, [activeFocus]);

  function handleSelect(id: FocusArea["id"] | null) {
    setActiveFocus(id);
    if (id !== null) {
      setExpandedId(id); // selecting a card expands it and collapses others
      saveReentry(id, 0);
    }
  }

  function handleToggleExpand(id: FocusArea["id"]) {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      if (next !== null) saveReentry(next, 0);
      return next;
    });
  }

  const activeArea = activeFocus
    ? FOCUS_AREAS.find((a) => a.id === activeFocus) ?? null
    : null;

  return (
    <div className="space-y-8" data-testid="page-what-next">
      {/* ── Back ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      {/* ── Page anchor ── */}
      <PageAnchor
        storageKey="what-next"
        whenToBeHere="You're lost on what to do next, or you need to reset your focus after a context switch or interruption."
        theOneThing="Read the core tension — it names exactly where the business is stuck. Then pick one focus area and expand its steps."
        accentColor="#0F766E"
      />

      {/* ── Header ── */}
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Practitioner's Guide · Coaching
        </p>
        <h1
          className="mt-2 text-3xl sm:text-4xl font-semibold leading-tight"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          What's next?
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">
          A plain-language read of where the business is right now, and 2–3 concrete focus
          areas with specific next steps. Pick one and come back to it — your choice is saved.
        </p>
        {activeArea && (
          <div
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: activeArea.accentSoft, color: activeArea.accentInk }}
            data-testid="active-focus-banner"
          >
            Active focus:{" "}
            <strong>{activeArea.title}</strong>
          </div>
        )}
      </header>

      {/* ── Where You Are ── */}
      <WhereYouAre />

      {/* ── Focus areas ── */}
      <section>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          Choose a focus area
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select one area to work on. Each card shows what's realistic given current momentum.
          Expand any card to see specific next steps.
        </p>
        <div className="space-y-4">
          {FOCUS_AREAS.map((area) => (
            <FocusCard
              key={area.id}
              area={area}
              selected={activeFocus === area.id}
              expanded={expandedId === area.id}
              onSelect={handleSelect}
              onToggleExpand={handleToggleExpand}
              onStepFocus={(id, stepIndex) => saveReentry(id, stepIndex)}
            />
          ))}
        </div>
      </section>

      {/* ── Return prompt ── */}
      {activeFocus && (
        <div
          className="rounded-xl border border-card-border bg-muted/40 p-4 text-sm text-muted-foreground"
          data-testid="focus-return-prompt"
        >
          Your focus is saved. When you return to this page, you'll land back here with{" "}
          <strong className="text-foreground">
            {activeArea?.title}
          </strong>{" "}
          still selected.
        </div>
      )}
    </div>
  );
}
