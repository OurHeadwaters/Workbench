/**
 * StrategicLedgerPage — the true north document.
 *
 * Imports from @workspace/codetry-public — the single source of truth
 * shared with the Ship site's public window. When the shared data changes,
 * both this page and The Window update automatically.
 *
 * This page renders the FULL internal view:
 *   - Full destination (with blockchain framing)
 *   - Internal filter question text
 *   - All engagements (public + private)
 *   - Status badges, type tags, honest status notes
 *   - Proven vs. needs-proof accounting
 *
 * The Ship site's TheWindowPage renders only the public fields.
 */

import { Link } from "wouter";
import { CheckCircle2, Circle, AlertCircle, ArrowLeft } from "lucide-react";
import {
  CODETRY_DESTINATION,
  CODETRY_FILTER_QUESTIONS,
  CODETRY_ENGAGEMENTS,
  PROVEN_ITEMS,
  NEEDS_PROOF_ITEMS,
  OBJECTIVE_LABELS,
  type ProofStatus,
  type EngagementType,
} from "@workspace/codetry-public";

const ACCENT = "#1f3d2e";
const ACCENT_SOFT = "#e8f0ec";
const ACCENT_INK = "#1a2e22";
const RUST = "#b85a3e";
const RUST_SOFT = "#fdf0ec";

// ─── Filter question card ─────────────────────────────────────────────────────

function FilterQuestion({ n, question, note }: { n: string; question: string; note: string }) {
  return (
    <div
      className="flex items-start gap-4 rounded-xl border p-4"
      style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT_SOFT }}
    >
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold flex-shrink-0 mt-0.5"
        style={{ backgroundColor: ACCENT, color: "#f4ede0" }}
      >
        {n}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug" style={{ color: ACCENT_INK }}>
          {question}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}

// ─── Engagement log ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProofStatus }) {
  if (status === "proven") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}>
        <CheckCircle2 className="h-3 w-3" />
        Proven
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: RUST_SOFT, color: RUST }}>
        <Circle className="h-3 w-3" />
        Building proof
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
      <AlertCircle className="h-3 w-3" />
      Needs proof
    </span>
  );
}

function TypeTag({ type }: { type: EngagementType }) {
  if (type === "paid") {
    return (
      <span className="text-[10px] uppercase tracking-[0.15em] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}>
        Paid
      </span>
    );
  }
  if (type === "unpaid") {
    return (
      <span className="text-[10px] uppercase tracking-[0.15em] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
        Unpaid
      </span>
    );
  }
  return (
    <span className="text-[10px] uppercase tracking-[0.15em] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: RUST_SOFT, color: RUST }}>
      In development
    </span>
  );
}

function EngagementCard({ name, type, objectives, codetryValue, status, statusNote, isPublic }: {
  name: string;
  type: EngagementType;
  objectives: string[];
  codetryValue: string;
  status: ProofStatus;
  statusNote: string;
  isPublic: boolean;
}) {
  return (
    <div
      className="rounded-xl border bg-card p-4 space-y-3"
      style={{ borderLeftWidth: "3px", borderLeftColor: ACCENT }}
    >
      <div className="flex items-start gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <TypeTag type={type} />
            {isPublic && (
              <span className="text-[10px] uppercase tracking-[0.12em] font-medium px-1.5 py-0.5 rounded border" style={{ borderColor: ACCENT + "40", color: ACCENT }}>
                Public
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{codetryValue}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {objectives.map((n) => (
          <span
            key={n}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
          >
            {OBJECTIVE_LABELS[n] ?? `Q${n}`}
          </span>
        ))}
      </div>

      <p className="text-xs text-muted-foreground border-t pt-2" style={{ borderColor: "hsl(var(--card-border))" }}>
        <span className="font-medium text-foreground">Honest status: </span>
        {statusNote}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function StrategicLedgerPage() {
  const paidCount = CODETRY_ENGAGEMENTS.filter((e) => e.type === "paid").length;
  const unpaidCount = CODETRY_ENGAGEMENTS.filter((e) => e.type === "unpaid" || e.type === "in-development").length;
  const provenCount = CODETRY_ENGAGEMENTS.filter((e) => e.status === "proven").length;

  return (
    <div className="space-y-8" data-testid="page-strategic-ledger">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        data-testid="back-to-dashboard"
      >
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>

      {/* ── Page header ── */}
      <header className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className="h-10 w-10 rounded-md grid place-items-center flex-shrink-0"
            style={{ backgroundColor: ACCENT, color: "#f4ede0" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Codetry — strategic ledger
            </p>
            <h1 className="mt-1 text-3xl font-semibold" style={{ fontFamily: "var(--app-font-serif)" }}>
              The long game.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Open this page at the start of any new project. It names where Codetry is going,
              gives you a filter to evaluate any piece of work against that destination,
              and keeps an honest log of what's been proven and what still needs proof.
            </p>
            <div
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs"
              style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_INK }}
            >
              Source of truth — shared with the Ship site's public window. Engagements marked
              <span className="font-semibold ml-1">Public</span> appear there.
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Paid engagements", value: paidCount },
            { label: "Practice / development", value: unpaidCount },
            { label: "Proven on the ledger", value: provenCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border bg-card px-4 py-3"
              style={{ borderTopWidth: "3px", borderTopColor: ACCENT }}
            >
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}>
                {value}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ── Section 1: The destination ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          The destination
        </h2>
        <div
          className="rounded-xl border p-6 space-y-4"
          style={{ borderLeftWidth: "4px", borderLeftColor: ACCENT, backgroundColor: ACCENT_SOFT }}
        >
          <p className="text-lg leading-relaxed" style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK }}>
            {CODETRY_DESTINATION.p1}
          </p>
          <p className="text-base leading-relaxed" style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK, opacity: 0.85 }}>
            {CODETRY_DESTINATION.p2}
          </p>
          <p className="text-base leading-relaxed" style={{ fontFamily: "var(--app-font-serif)", color: ACCENT_INK, opacity: 0.85 }}>
            {CODETRY_DESTINATION.p3}
          </p>
          <div className="border-t pt-4" style={{ borderColor: ACCENT + "40" }}>
            <p className="text-xs text-muted-foreground italic">
              This is not a mission statement. It is the navigational fixed point.
              When the day's work feels unmoored, read this paragraph first.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: The 5-question filter ── */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            The decision filter
          </h2>
          <p className="text-xs text-muted-foreground">
            Any piece of work — paid or unpaid — that answers yes to at least one belongs on the ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CODETRY_FILTER_QUESTIONS.map((q) => (
            <FilterQuestion
              key={q.n}
              n={q.n}
              question={q.internal}
              note={q.internalNote}
            />
          ))}
        </div>

        <div
          className="rounded-lg border px-4 py-3 text-sm leading-relaxed"
          style={{ borderColor: RUST + "40", backgroundColor: RUST_SOFT, color: RUST }}
        >
          <span className="font-semibold">The unpaid work doctrine: </span>
          If a piece of work has no contract but answers yes to at least one question above,
          it belongs on the ledger as practice and testing with a practical application.
          Name which question it answers. That naming is what separates purposeful unpaid
          work from drift. Work that answers none of the five questions may still be worth
          doing — call it cash flow, not trajectory, and budget for it accordingly.
        </div>
      </section>

      {/* ── Section 3: The engagement log ── */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Engagement log
          </h2>
          <p className="text-xs text-muted-foreground">
            Every piece of work, mapped to the five objectives. Honest status — no smoothing.
            Engagements marked Public surface on the Ship site.
          </p>
        </div>

        <div className="space-y-3">
          {CODETRY_ENGAGEMENTS.map((e) => (
            <EngagementCard key={e.name} {...e} />
          ))}
        </div>
      </section>

      {/* ── Section 4: Proven vs. needs proof ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          The honest accounting
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-xl border bg-card p-5 space-y-3"
            style={{ borderTopWidth: "3px", borderTopColor: ACCENT }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" style={{ color: ACCENT }} />
              <p className="text-sm font-semibold" style={{ color: ACCENT_INK }}>What's been proven</p>
            </div>
            <ul className="space-y-2">
              {PROVEN_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: ACCENT }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-xl border bg-card p-5 space-y-3"
            style={{ borderTopWidth: "3px", borderTopColor: RUST }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" style={{ color: RUST }} />
              <p className="text-sm font-semibold" style={{ color: RUST }}>What still needs proof</p>
            </div>
            <ul className="space-y-2">
              {NEEDS_PROOF_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: RUST }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Footer note ── */}
      <div
        className="rounded-lg border px-4 py-3 text-xs text-muted-foreground leading-relaxed"
        style={{ borderColor: "hsl(var(--card-border))" }}
      >
        <span className="font-medium text-foreground">How to use this page: </span>
        When starting a new project, open this page first and ask whether the work answers at least
        one of the five filter questions. If yes — name which one, log the engagement, and proceed.
        If no — name it as cash flow and budget the time accordingly. Update the engagement log as
        proof accumulates. The honest accounting section should make you slightly uncomfortable.
        That discomfort is the discipline working.
      </div>
    </div>
  );
}
