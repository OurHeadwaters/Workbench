import { useState } from "react";
import { Link } from "wouter";
import { codetryTest, lastReviewed as codetryTestLastReviewed } from "../data/codetryTest";
import { PHASES, getPhaseForWeek, getWeekPlan } from "../data/plan2026";
import {
  BATCHES,
  STANDBY_PAID_PER_BATCH,
  getBatchesByQuarter,
  getEffectiveBatch,
  isBatchWeek,
  type BatchAssignment,
  type Quarter,
} from "../data/saltBench";
import {
  formatLongDate,
  formatWeekRange,
  getCurrentWeekNumber,
} from "../lib/dateMath";
import { useAppState, useAppStateActions } from "../lib/storage";

// Phase color treatment for the 52-week grid.
const PHASE_COLORS: Record<
  string,
  { bg: string; text: string; ring: string; dot: string; label: string }
> = {
  foundation: {
    bg: "bg-emerald-50",
    text: "text-emerald-900",
    ring: "ring-emerald-200",
    dot: "bg-emerald-400",
    label: "Foundation",
  },
  "team-assembly": {
    bg: "bg-amber-50",
    text: "text-amber-900",
    ring: "ring-amber-200",
    dot: "bg-amber-400",
    label: "Team Assembly",
  },
  "pilot-execution": {
    bg: "bg-sky-50",
    text: "text-sky-900",
    ring: "ring-sky-200",
    dot: "bg-sky-400",
    label: "Pilot Execution",
  },
  "year-end-audit": {
    bg: "bg-stone-100",
    text: "text-stone-800",
    ring: "ring-stone-300",
    dot: "bg-stone-500",
    label: "Year-End Audit",
  },
};

export default function Year() {
  const currentWeek = getCurrentWeekNumber();
  const currentPhase = getPhaseForWeek(currentWeek);
  const state = useAppState();
  const {
    completeWeek,
    uncompleteWeek,
    shiftWeek,
    unshiftWeek,
  } = useAppStateActions();
  const [shiftEditing, setShiftEditing] = useState<number | null>(null);

  const allWeeks = Array.from({ length: 52 }, (_, i) => i + 1);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-500">
          The shape of 2026
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          The year, week by week
        </h1>
        <p
          className="max-w-2xl text-base text-stone-700"
          data-testid="text-current-position"
        >
          You are in Week {currentWeek}. Phase: {currentPhase.title}.
        </p>
      </header>

      {/* 52-week grid — calm, color-coded by phase, current week ringed. */}
      <section className="space-y-3" data-testid="section-week-grid">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
          Fifty-two weeks at a glance
        </h2>
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}
        >
          {allWeeks.map((wn) => {
            const phase = getPhaseForWeek(wn);
            const colors = PHASE_COLORS[phase.id] ?? PHASE_COLORS.foundation;
            const isCurrent = wn === currentWeek;
            const completed = !!state.completedWeeks[String(wn)];
            const shift = state.shiftedWeeks[String(wn)];
            const batchWeek = isBatchWeek(wn);
            return (
              <Link
                key={wn}
                href={`/week?w=${wn}`}
                title={
                  batchWeek
                    ? `Week ${wn} — ${phase.title} · salt batch week`
                    : `Week ${wn} — ${phase.title}`
                }
                data-testid={`cell-week-${wn}`}
                className={
                  "relative flex aspect-square items-center justify-center rounded-md text-xs font-mono transition " +
                  `${colors.bg} ${colors.text} ` +
                  "hover:opacity-100 hover:shadow-sm " +
                  (isCurrent
                    ? `ring-2 ring-stone-900 font-semibold `
                    : `ring-1 ${colors.ring} `) +
                  (completed ? "line-through opacity-60 " : "") +
                  (shift ? "italic " : "")
                }
              >
                {wn}
                {batchWeek && (
                  <span
                    aria-hidden="true"
                    title="Salt batch week"
                    data-testid={`marker-batch-${wn}`}
                    className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500"
                  />
                )}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-stone-600">
          {PHASES.map((p) => {
            const c = PHASE_COLORS[p.id] ?? PHASE_COLORS.foundation;
            return (
              <span key={p.id} className="flex items-center gap-1.5">
                <span className={`inline-block h-2.5 w-2.5 rounded-sm ${c.dot}`} />
                <span>
                  {p.title} · Wk {p.startWeek}–{p.endWeek}
                </span>
              </span>
            );
          })}
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
            <span>
              Salt batch week (Wk{" "}
              {BATCHES.map((b) => b.weekNumber).join(", ")})
            </span>
          </span>
        </div>
      </section>

      {/* Salt batch calendar — full-year bench rotation surfaced on
          the operating calendar, not just on the SaltBench slide.
          Names + dates here are sourced from src/data/saltBench.ts. */}
      <section className="space-y-4" data-testid="section-salt-batches">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            Salt batch calendar
          </h2>
          <p className="text-xs text-stone-500">
            {BATCHES.length} batches across Q2–Q4 · primary + paid standby
            per batch · ties to the depot bench roster
          </p>
        </div>
        {(["Q2", "Q3", "Q4"] as Quarter[]).map((q) => {
          const batches = getBatchesByQuarter(q);
          if (batches.length === 0) return null;
          const standbyCost = batches.length * STANDBY_PAID_PER_BATCH;
          return (
            <div
              key={q}
              className="space-y-2"
              data-testid={`section-batches-${q.toLowerCase()}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-600">
                  {q} · {batches.length} batches
                </h3>
                <p
                  className="font-mono text-xs text-stone-500"
                  data-testid={`text-${q.toLowerCase()}-standby-subtotal`}
                >
                  {q} standby · {batches.length} × ${STANDBY_PAID_PER_BATCH} ={" "}
                  ${standbyCost}
                </p>
              </div>
              <ol className="divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200 bg-white">
                {batches.map((b: BatchAssignment) => {
                  // Apply any per-batch override the OM recorded on the
                  // Week page so swaps surface here too — same
                  // `getEffectiveBatch` path used by Week and
                  // WeekCloseOut, keeping the bench rotation consistent
                  // across all three views.
                  const override = state.benchOverrides[String(b.weekNumber)];
                  const eff = getEffectiveBatch(b, override);
                  return (
                    <li
                      key={b.weekNumber}
                      className="px-4 py-3 text-sm"
                      data-testid={`row-batch-wk${b.weekNumber}`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <Link
                          href={`/week?w=${b.weekNumber}`}
                          className="flex items-baseline gap-3 hover:underline"
                        >
                          <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
                          <span className="font-mono text-xs text-stone-500">
                            Wk {b.weekNumber}
                          </span>
                          <span className="font-medium text-stone-900">
                            {b.monthLabel} batch · manifest{" "}
                            {formatLongDate(b.manifestISO)} · ships Fri
                          </span>
                        </Link>
                        <span className="font-mono text-xs text-stone-500">
                          {formatWeekRange(b.weekNumber)}
                        </span>
                      </div>
                      <dl className="mt-2 grid gap-2 pl-5 text-xs text-stone-700 sm:grid-cols-3">
                        <div data-testid={`batch-${b.weekNumber}-primary`}>
                          <dt className="font-mono uppercase tracking-wider text-stone-500">
                            Primary · Tue + Wed
                          </dt>
                          <dd className="mt-0.5 text-stone-900">
                            <span className="font-medium">
                              {eff.primary.seat.name}
                            </span>
                            <span className="text-stone-500">
                              {" "}
                              · {eff.primary.seat.base}
                            </span>
                            {eff.primary.originalSeat && (
                              <span
                                className="ml-1 italic text-amber-800"
                                data-testid={`batch-${b.weekNumber}-primary-swap-note`}
                              >
                                · swapped from {eff.primary.originalSeat.name}
                              </span>
                            )}
                          </dd>
                        </div>
                        <div data-testid={`batch-${b.weekNumber}-standby`}>
                          <dt className="font-mono uppercase tracking-wider text-stone-500">
                            Standby (paid) · Fri ship day
                          </dt>
                          <dd className="mt-0.5 text-stone-900">
                            <span className="font-medium">
                              {eff.standby.seat.name}
                            </span>
                            <span className="text-stone-500">
                              {" "}
                              · {eff.standby.seat.base}
                            </span>
                            {eff.standby.originalSeat && (
                              <span
                                className="ml-1 italic text-amber-800"
                                data-testid={`batch-${b.weekNumber}-standby-swap-note`}
                              >
                                · swapped from {eff.standby.originalSeat.name}
                              </span>
                            )}
                          </dd>
                        </div>
                        <div
                          data-testid={`batch-${b.weekNumber}-standbycost`}
                        >
                          <dt className="font-mono uppercase tracking-wider text-stone-500">
                            Standby paid shift
                          </dt>
                          <dd className="mt-0.5 font-mono text-stone-900">
                            ${STANDBY_PAID_PER_BATCH} · 4 hrs × $30 · paid
                            even if not called
                          </dd>
                        </div>
                      </dl>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
        <div
          className="rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-xs"
          data-testid="text-year-standby-total"
        >
          <p className="font-mono uppercase tracking-wider text-stone-500">
            Reconciles to the SaltBench $1,200/yr standby line
          </p>
          <ul className="mt-1.5 space-y-0.5 font-mono text-stone-700">
            {(["Q2", "Q3", "Q4"] as Quarter[]).map((q) => {
              const n = getBatchesByQuarter(q).length;
              return (
                <li
                  key={q}
                  className="flex items-baseline justify-between"
                  data-testid={`reconcile-${q.toLowerCase()}`}
                >
                  <span>
                    {q} standby · {n} × ${STANDBY_PAID_PER_BATCH}
                  </span>
                  <span>${n * STANDBY_PAID_PER_BATCH}</span>
                </li>
              );
            })}
            <li
              className="flex items-baseline justify-between text-stone-600"
              data-testid="reconcile-reserve"
            >
              <span>+ Cancellation reserve · 1 × ${STANDBY_PAID_PER_BATCH}</span>
              <span>${STANDBY_PAID_PER_BATCH}</span>
            </li>
            <li
              className="flex items-baseline justify-between border-t border-stone-300 pt-1 font-semibold text-stone-900"
              data-testid="reconcile-total"
            >
              <span>Full-year standby + reserve</span>
              <span>
                $
                {BATCHES.length * STANDBY_PAID_PER_BATCH +
                  STANDBY_PAID_PER_BATCH}
              </span>
            </li>
          </ul>
          <p className="mt-1.5 text-stone-500">
            The reserve covers the one batch a year where a primary drops at
            T-1 and the standby is bumped up to a full primary shift.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
              Annual check-in
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Once-a-year cadence. Portfolio, Watershed ARR, owner take-home,
              and the projection to age 50.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/year/check-in"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
            >
              Open dashboard
            </Link>
            <Link
              href="/year/check-in/new"
              className="rounded-md border border-stone-700 bg-stone-900 px-3 py-1.5 text-sm text-stone-50 hover:bg-stone-800"
            >
              New snapshot
            </Link>
          </div>
        </div>
        {state.snapshots.length > 0 && (
          <p className="mt-3 text-xs text-stone-500">
            {state.snapshots.length} snapshot
            {state.snapshots.length === 1 ? "" : "s"} on file.
          </p>
        )}
      </section>

      <CodetryTestRitualCard />


      {/* Detail list with mark-complete / shift controls per week. */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
          Week by week
        </h2>
        <ol className="divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200 bg-white">
          {allWeeks.map((wn) => {
            const week = getWeekPlan(wn);
            const phase = getPhaseForWeek(wn);
            const colors = PHASE_COLORS[phase.id] ?? PHASE_COLORS.foundation;
            const detailed = !!week.days;
            const isCurrent = wn === currentWeek;
            const isPast = wn < currentWeek;
            const completion = state.completedWeeks[String(wn)];
            const completed = !!completion;
            const shift = state.shiftedWeeks[String(wn)];
            const totalSteps =
              week.days?.reduce((acc, d) => acc + d.steps.length, 0) ?? 0;
            const doneSteps =
              week.days?.reduce(
                (acc, d) =>
                  acc +
                  d.steps.filter((s) => state.doneSteps[s.id]).length,
                0,
              ) ?? 0;
            const editingShift = shiftEditing === wn;
            const shiftOptions = Array.from(
              { length: Math.min(8, 52 - wn) },
              (_, i) => wn + 1 + i,
            );

            return (
              <li
                key={wn}
                className={
                  "px-4 py-3 text-sm " +
                  (isCurrent ? "bg-amber-50 " : "") +
                  (completed ? "opacity-70 " : "")
                }
              >
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href={`/week?w=${wn}`}
                    className="flex min-w-0 flex-1 items-baseline gap-3 hover:underline"
                  >
                    <span
                      className={`inline-block h-2 w-2 shrink-0 rounded-sm ${colors.dot}`}
                      aria-hidden="true"
                    />
                    <span className="w-16 shrink-0 font-mono text-xs text-stone-500">
                      Wk {wn}
                    </span>
                    <span className="hidden w-32 shrink-0 text-xs text-stone-500 sm:inline">
                      {formatWeekRange(wn)}
                    </span>
                    <span
                      className={
                        "min-w-0 flex-1 truncate text-stone-800 " +
                        (completed
                          ? "line-through decoration-stone-400"
                          : "")
                      }
                    >
                      {week.theme}
                    </span>
                  </Link>
                  <div className="flex shrink-0 items-center gap-2 text-xs">
                    {isCurrent && !completed && (
                      <span className="rounded-sm bg-stone-900 px-1.5 py-0.5 font-medium text-stone-50">
                        Now
                      </span>
                    )}
                    {completed && (
                      <span className="rounded-sm bg-emerald-700 px-1.5 py-0.5 font-medium text-stone-50">
                        Complete
                      </span>
                    )}
                    {shift && (
                      <span className="rounded-sm border border-amber-300 bg-amber-100 px-1.5 py-0.5 font-medium text-amber-900">
                        Shifted → Wk {shift.shiftedTo}
                      </span>
                    )}
                    {detailed && !completed && (
                      <span className="text-stone-500">
                        {doneSteps}/{totalSteps}
                      </span>
                    )}
                    {!detailed && (
                      <span className="italic text-stone-500">
                        {isPast ? "no detail" : "theme only"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 pl-9 text-xs">
                  {completed ? (
                    <button
                      type="button"
                      onClick={() => uncompleteWeek(wn)}
                      className="rounded-sm border border-stone-300 px-2 py-0.5 text-stone-600 hover:bg-stone-100"
                      data-testid={`button-uncomplete-week-${wn}`}
                    >
                      Mark not complete
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => completeWeek(wn)}
                      className="rounded-sm border border-stone-300 px-2 py-0.5 text-stone-600 hover:bg-stone-100"
                      data-testid={`button-complete-week-${wn}`}
                    >
                      Mark complete
                    </button>
                  )}
                  {shift ? (
                    <button
                      type="button"
                      onClick={() => unshiftWeek(wn)}
                      className="rounded-sm border border-stone-300 px-2 py-0.5 text-stone-600 hover:bg-stone-100"
                      data-testid={`button-unshift-week-${wn}`}
                    >
                      Cancel shift
                    </button>
                  ) : editingShift ? (
                    <span className="flex items-center gap-1.5">
                      <span className="text-stone-500">Shift to</span>
                      <select
                        onChange={(e) => {
                          const target = Number(e.target.value);
                          if (Number.isFinite(target) && target > wn) {
                            shiftWeek(wn, target);
                            setShiftEditing(null);
                          }
                        }}
                        defaultValue=""
                        className="rounded-sm border border-stone-300 bg-white px-1.5 py-0.5 text-xs"
                        data-testid={`select-shift-week-${wn}`}
                      >
                        <option value="" disabled>
                          Pick week…
                        </option>
                        {shiftOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            Wk {opt}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShiftEditing(null)}
                        className="text-stone-500 hover:text-stone-900"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    wn < 52 && (
                      <button
                        type="button"
                        onClick={() => setShiftEditing(wn)}
                        className="rounded-sm border border-stone-300 px-2 py-0.5 text-stone-600 hover:bg-stone-100"
                        data-testid={`button-shift-week-${wn}`}
                      >
                        Shift…
                      </button>
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

// Codetry test — quarterly ritual that surfaces the canonical-names
// audit on the Year page. The audit itself lives at /codetry-test;
// this card is the recurring trigger so the audit doesn't silently
// go stale (handbook §4.3 — "the test isn't a one-time thing — it's
// a posture"). Last-reviewed date and tally are read live from
// src/data/codetryTest.ts so editing the data file is the only place
// the practitioner has to update.
function CodetryTestRitualCard() {
  const tally = codetryTest.reduce(
    (acc, group) => {
      for (const entry of group.entries) {
        acc[entry.verdict] += 1;
        acc.total += 1;
      }
      return acc;
    },
    { "load-bearing": 0, decorative: 0, drift: 0, total: 0 } as {
      "load-bearing": number;
      decorative: number;
      drift: number;
      total: number;
    },
  );

  const reviewedDate = new Date(`${codetryTestLastReviewed}T00:00:00Z`);
  const reviewedLabel = reviewedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const today = new Date();
  const daysSince = Math.max(
    0,
    Math.floor(
      (today.getTime() - reviewedDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  // Quarterly cadence — flag when the audit has been untouched for
  // more than ~13 weeks. Soft warning, not a blocker.
  const quarterlyDue = daysSince >= 91;

  return (
    <section
      className="rounded-lg border border-stone-200 bg-white p-5"
      data-testid="section-codetry-test-ritual"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            Codetry test
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Quarterly cadence. Re-walk the canonical-names audit so
            vocabulary drift gets caught on a rhythm, not by accident.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/codetry-test"
            className="rounded-md border border-stone-700 bg-stone-900 px-3 py-1.5 text-sm text-stone-50 hover:bg-stone-800"
            data-testid="link-codetry-test"
          >
            Open the audit
          </Link>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-4">
        <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2">
          <dt className="font-mono uppercase tracking-wider text-stone-500">
            Last reviewed
          </dt>
          <dd
            className="mt-1 text-sm font-medium text-stone-900"
            data-testid="text-codetry-test-last-reviewed"
          >
            {reviewedLabel}
          </dd>
          <dd className="mt-0.5 text-xs text-stone-500">
            {daysSince === 0
              ? "today"
              : daysSince === 1
                ? "1 day ago"
                : `${daysSince} days ago`}
          </dd>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2">
          <dt className="font-mono uppercase tracking-wider text-stone-500">
            Load-bearing
          </dt>
          <dd className="mt-1 text-sm font-medium text-stone-900">
            {tally["load-bearing"]} / {tally.total}
          </dd>
          <dd className="mt-0.5 text-xs text-stone-500">
            names holding weight
          </dd>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2">
          <dt className="font-mono uppercase tracking-wider text-stone-500">
            Decorative
          </dt>
          <dd className="mt-1 text-sm font-medium text-stone-900">
            {tally.decorative}
          </dd>
          <dd className="mt-0.5 text-xs text-stone-500">propose a fix</dd>
        </div>
        <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2">
          <dt className="font-mono uppercase tracking-wider text-stone-500">
            Drift
          </dt>
          <dd className="mt-1 text-sm font-medium text-stone-900">
            {tally.drift}
          </dd>
          <dd className="mt-0.5 text-xs text-stone-500">resolve on purpose</dd>
        </div>
      </dl>
      {quarterlyDue ? (
        <p
          className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900"
          data-testid="text-codetry-test-due"
        >
          Quarterly review due — last walked {daysSince} days ago.
          Open the audit, re-trial each name, then bump{" "}
          <span className="font-mono">lastReviewed</span> in{" "}
          <span className="font-mono">src/data/codetryTest.ts</span>.
        </p>
      ) : (
        <p className="mt-3 text-xs text-stone-500">
          New canonical name landed since last review? Add an entry in{" "}
          <span className="font-mono text-stone-700">
            src/data/codetryTest.ts
          </span>{" "}
          and bump{" "}
          <span className="font-mono text-stone-700">lastReviewed</span>.
        </p>
      )}
    </section>
  );
}

