import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  dateForDayInWeek,
  formatShortDate,
  formatWeekRange,
  getCurrentWeekNumber,
  getTodayISO,
  dayShortOf,
} from "../lib/dateMath";
import {
  getPhaseForWeek,
  getWeekPlan,
  type DayPlan,
} from "../data/plan2026";
import { useAppState, useAppStateActions } from "../lib/storage";
import { findCarriedFromPriorWeeks } from "../lib/carryover";
import { StepCard } from "../components/StepCard";

const DAY_LABELS: Array<{ short: DayPlan["dayShort"]; label: string }> = [
  { short: "mon", label: "Monday" },
  { short: "tue", label: "Tuesday" },
  { short: "wed", label: "Wednesday" },
  { short: "thu", label: "Thursday" },
  { short: "fri", label: "Friday" },
  { short: "sat", label: "Saturday" },
  { short: "sun", label: "Sunday" },
];

function readWParam(): number | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("w");
  if (raw === null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return Math.max(1, Math.min(52, n));
}

export default function Week() {
  const [location, navigate] = useLocation();
  const initialWeek = readWParam() ?? getCurrentWeekNumber();
  const [weekNumber, setWeekNumber] = useState<number>(initialWeek);

  // Re-read ?w= when wouter's pathname changes (e.g., link from /year).
  useEffect(() => {
    const next = readWParam();
    if (next !== null && next !== weekNumber) setWeekNumber(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  function goToWeek(n: number) {
    setWeekNumber(n);
    navigate(`/week?w=${n}`);
  }

  const week = getWeekPlan(weekNumber);
  const phase = getPhaseForWeek(weekNumber);
  const todayShort = dayShortOf(getTodayISO()) as DayPlan["dayShort"];
  const todayWeek = getCurrentWeekNumber();
  const isCurrentWeek = weekNumber === todayWeek;
  const state = useAppState();
  const { setWeekNote, reopenWeek } = useAppStateActions();
  const note = state.weekNotes[String(weekNumber)] ?? "";
  const closeOut = state.weekCloseOuts[String(weekNumber)];
  const closed = !!closeOut;

  // Day-1 roll-forward: shared with Today via lib/carryover.
  const carriedItems = findCarriedFromPriorWeeks(state, weekNumber);

  const totalSteps =
    week.days?.reduce((acc, d) => acc + d.steps.length, 0) ?? 0;
  const doneSteps =
    week.days?.reduce(
      (acc, d) => acc + d.steps.filter((s) => state.doneSteps[s.id]).length,
      0,
    ) ?? 0;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-stone-500">
          {phase.title}
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
              Week {weekNumber}
            </h1>
            <p className="text-sm text-stone-600">
              {formatWeekRange(weekNumber)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToWeek(Math.max(1, weekNumber - 1))}
              disabled={weekNumber <= 1}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => goToWeek(todayWeek)}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => goToWeek(Math.min(52, weekNumber + 1))}
              disabled={weekNumber >= 52}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <p className="max-w-2xl text-base text-stone-800">{week.theme}</p>
        {week.description && (
          <p className="max-w-2xl text-sm text-stone-600">{week.description}</p>
        )}
        {totalSteps > 0 && (
          <p className="text-xs text-stone-500">
            {doneSteps} of {totalSteps} steps done this week
          </p>
        )}
        {closed && (
          <p className="text-xs text-stone-500">
            Closed out{" "}
            {new Date(closeOut.closedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            . {closeOut.carriedStepIds.length} item
            {closeOut.carriedStepIds.length === 1 ? "" : "s"} rolled forward.
          </p>
        )}
      </header>

      {!week.days && (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-sm text-stone-600">
          <p>
            No detailed steps yet for this week. The theme above is the anchor
            — fill in the day-by-day plan as the week gets closer.
          </p>
          <p className="mt-3 text-xs text-stone-500">
            Detailed plans are kept for the current week and the next two.
          </p>
        </div>
      )}

      {week.days && (
        <div className="space-y-6">
          {DAY_LABELS.map(({ short, label }) => {
            const day = week.days!.find((d) => d.dayShort === short);
            const date = dateForDayInWeek(weekNumber, short);
            const isToday = isCurrentWeek && short === todayShort;
            const steps = day?.steps ?? [];
            const isMonday = short === "mon";
            return (
              <section key={short} className="space-y-3">
                <div className="flex items-baseline justify-between border-b border-stone-200 pb-2">
                  <div className="flex items-baseline gap-3">
                    <h2
                      className={
                        "text-base font-semibold " +
                        (isToday ? "text-stone-900" : "text-stone-700")
                      }
                    >
                      {label}
                    </h2>
                    <span className="text-xs text-stone-500">
                      {formatShortDate(date)}
                    </span>
                    {isToday && (
                      <span className="rounded-sm bg-stone-900 px-1.5 py-0.5 text-xs font-medium text-stone-50">
                        Today
                      </span>
                    )}
                  </div>
                  {steps.length > 0 && (
                    <span className="text-xs text-stone-500">
                      {steps.filter((s) => state.doneSteps[s.id]).length} of{" "}
                      {steps.length}
                    </span>
                  )}
                </div>
                {isMonday && carriedItems.length > 0 && (
                  <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50/60 p-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-amber-900">
                      Carried over
                    </p>
                    <div className="space-y-2">
                      {carriedItems.map(({ fromWeek, step }) => (
                        <StepCard
                          key={`carry-${step.id}`}
                          step={step}
                          carriedFromWeek={fromWeek}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {steps.length === 0 ? (
                  <p className="text-sm italic text-stone-400">
                    Nothing scheduled.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {steps.map((step) => (
                      <StepCard key={step.id} step={step} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <section className="space-y-3 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
          Notes for this week
        </h2>
        <textarea
          value={note}
          onChange={(e) => setWeekNote(weekNumber, e.target.value)}
          rows={4}
          placeholder="What's on your mind for this week. Carry-overs, blockers, anything to remember."
          className="w-full resize-y rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-700"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-500">
            {closed
              ? "This week is closed. Anything not done has been rolled into next week."
              : "Close out the week when you're done. Anything not done rolls forward."}
          </p>
          {closed ? (
            <button
              type="button"
              onClick={() => reopenWeek(weekNumber)}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
            >
              Reopen week
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(`/week/close-out?w=${weekNumber}`)}
              disabled={!week.days}
              className="rounded-md border border-stone-700 bg-stone-900 px-3 py-1.5 text-sm text-stone-50 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close out this week
            </button>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <Link
          href="/year"
          className="text-sm text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline"
        >
          See the full year →
        </Link>
      </div>
    </div>
  );
}
