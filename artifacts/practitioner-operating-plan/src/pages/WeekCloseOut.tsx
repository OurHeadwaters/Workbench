import { useMemo, useState } from "react";
import { useLocation, Link } from "wouter";
import { getWeekPlan, type Step } from "../data/plan2026";
import {
  PRIMARY_HOURS_PER_BATCH,
  PRIMARY_PAID_PER_BATCH,
  STANDBY_HOURS,
  STANDBY_PAID_PER_BATCH,
  STANDBY_RATE,
  getBatchForWeek,
  getEffectiveBatch,
} from "../data/saltBench";
import { useAppState, useAppStateActions } from "../lib/storage";
import { findCarriedFromPriorWeeks } from "../lib/carryover";
import { formatLongDate, formatWeekRange, getCurrentWeekNumber } from "../lib/dateMath";
import { useToast } from "../components/Toast";

// Single-screen week close-out summary. Shows what was finished, what's
// rolling forward into next week's day-1, lets the user uncheck items
// that should NOT roll forward, and finalizes with one click.
export default function WeekCloseOut() {
  const [, navigate] = useLocation();
  const wParamRaw =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("w")
      : null;
  const weekNumber = wParamRaw
    ? Math.max(1, Math.min(52, Number(wParamRaw)))
    : getCurrentWeekNumber();
  const week = getWeekPlan(weekNumber);
  const state = useAppState();
  const { closeWeek } = useAppStateActions();
  const { show } = useToast();

  const weekSteps: Step[] = useMemo(() => {
    if (!week.days) return [];
    return week.days.flatMap((d) => d.steps);
  }, [week]);

  // Carried items count as part of this week's close-out so the chain
  // continues if they're still undone after this week.
  const carriedIn = useMemo(
    () => findCarriedFromPriorWeeks(state, weekNumber),
    [state, weekNumber],
  );

  const allSteps: Step[] = useMemo(() => {
    const seen = new Set<string>();
    const out: Step[] = [];
    for (const s of weekSteps) {
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      out.push(s);
    }
    for (const { step } of carriedIn) {
      if (seen.has(step.id)) continue;
      seen.add(step.id);
      out.push(step);
    }
    return out;
  }, [weekSteps, carriedIn]);

  const doneInWeek = allSteps.filter((s) => state.doneSteps[s.id]);
  const undoneInWeek = allSteps.filter((s) => !state.doneSteps[s.id]);

  // Default: roll every undone step forward; user unchecks any to drop.
  const [rollForwardIds, setRollForwardIds] = useState<Record<string, boolean>>(
    () => Object.fromEntries(undoneInWeek.map((s) => [s.id, true])),
  );

  function toggleRoll(id: string) {
    setRollForwardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const isLastWeek = weekNumber >= 52;

  // Salt batch close: if this week is one of the named Q2 batch weeks,
  // pull the bench assignment so the standby paid shift surfaces here as
  // its own line — that's the cost the bookkeeper books when the OM
  // closes the week. Otherwise the standby cost lives only on the
  // SaltBench cost table and slips out of the operating calendar.
  // Apply any per-batch override the OM recorded on the Week page so
  // the cost is attributed to whoever actually worked the batch, not
  // to the seed roster name.
  const batch = getBatchForWeek(weekNumber);
  const batchOverride = state.benchOverrides[String(weekNumber)];
  const effective = batch ? getEffectiveBatch(batch, batchOverride) : null;
  const batchPrimary = effective?.primary ?? null;
  const batchStandby = effective?.standby ?? null;

  function onConfirm() {
    const carried = undoneInWeek
      .filter((s) => rollForwardIds[s.id])
      .map((s) => s.id);
    closeWeek(weekNumber, carried);
    if (carried.length === 0) {
      show("Week closed. Nothing rolled forward.");
    } else if (isLastWeek) {
      show(
        `Week closed. ${carried.length} item${carried.length === 1 ? "" : "s"} left unfinished at year end.`,
      );
    } else {
      show(
        `Week closed. ${carried.length} item${carried.length === 1 ? "" : "s"} rolled into week ${weekNumber + 1}.`,
      );
    }
    navigate("/week");
  }

  if (!week.days && carriedIn.length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Close out week {weekNumber}
          </h1>
        </header>
        <p className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
          This week has no detailed steps yet, so there's nothing to roll
          forward.{" "}
          <Link href="/week" className="underline">
            Back to the week
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-stone-500">
          Closing out · Week {weekNumber} · {formatWeekRange(weekNumber)}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          What rolled, what slipped, what closes
        </h1>
        <p className="max-w-2xl text-sm text-stone-700">
          {isLastWeek
            ? "This is the final week of 2026. Anything left checked below " +
              "will be recorded as unfinished at year end. Uncheck the items " +
              "you're consciously letting go."
            : `Anything you leave checked below will land on Monday of week ${
                weekNumber + 1
              } as a carry-over. Uncheck the items you're consciously letting go.`}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Total steps
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {allSteps.length}
          </p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Finished
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {doneInWeek.length}
          </p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Unfinished
          </p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">
            {undoneInWeek.length}
          </p>
        </div>
      </section>

      {batch && batchPrimary && batchStandby && (
        <section
          className="space-y-3 rounded-lg border border-rose-200 bg-rose-50/60 p-4"
          data-testid="section-salt-batch-close"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-900">
                Salt batch — bookkeeper close
              </h2>
            </div>
            <p className="text-xs text-rose-900/80">
              {batch.monthLabel} batch · manifested {formatLongDate(batch.manifestISO)} · shipped Fri
            </p>
          </div>
          <ul
            className="divide-y divide-rose-100 overflow-hidden rounded-md border border-rose-100 bg-white text-sm"
            data-testid="salt-batch-close-lines"
          >
            <li
              className="flex flex-wrap items-baseline justify-between gap-2 px-3 py-2"
              data-testid="salt-batch-close-primary"
            >
              <span>
                <span className="font-medium text-stone-900">
                  Primary · {batchPrimary.seat.name}
                </span>
                <span className="text-stone-500">
                  {" "}
                  · {PRIMARY_HOURS_PER_BATCH} hrs casual · pick + pack
                </span>
                {batchPrimary.originalSeat && (
                  <span
                    className="ml-2 italic text-amber-800"
                    data-testid="salt-batch-close-primary-swap-note"
                  >
                    swapped from {batchPrimary.originalSeat.name}
                  </span>
                )}
              </span>
              <span className="font-mono text-stone-900">
                ${PRIMARY_PAID_PER_BATCH.toLocaleString("en-US")}
              </span>
            </li>
            <li
              className="flex flex-wrap items-baseline justify-between gap-2 bg-amber-50/60 px-3 py-2"
              data-testid="salt-batch-close-standby"
            >
              <span>
                <span className="font-medium text-stone-900">
                  Standby (paid) · {batchStandby.seat.name}
                </span>
                <span className="text-stone-500">
                  {" "}
                  · {STANDBY_HOURS} hrs × ${STANDBY_RATE} · paid even if
                  not called
                </span>
                {batchStandby.originalSeat && (
                  <span
                    className="ml-2 italic text-amber-800"
                    data-testid="salt-batch-close-standby-swap-note"
                  >
                    swapped from {batchStandby.originalSeat.name}
                  </span>
                )}
              </span>
              <span className="font-mono text-stone-900">
                ${STANDBY_PAID_PER_BATCH}
              </span>
            </li>
          </ul>
          <p className="text-xs text-rose-900/70">
            Both lines book to <code>SALT-01-LBR</code>. The standby line is
            visible here so the $1,200/yr standby cost on the SaltBench
            slide doesn't slip out of the operating calendar.
          </p>
        </section>
      )}

      {undoneInWeek.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            {isLastWeek
              ? "Unfinished at year end"
              : `Unfinished — roll into week ${weekNumber + 1}?`}
          </h2>
          <ul className="space-y-2">
            {undoneInWeek.map((step) => {
              const checked = !!rollForwardIds[step.id];
              return (
                <li
                  key={step.id}
                  className="flex items-start gap-3 rounded-md border border-stone-200 bg-white p-3"
                >
                  <input
                    id={`roll-${step.id}`}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRoll(step.id)}
                    className="mt-0.5 h-4 w-4 cursor-pointer accent-stone-900"
                  />
                  <label
                    htmlFor={`roll-${step.id}`}
                    className="flex-1 cursor-pointer space-y-1"
                  >
                    <p className="text-sm font-medium text-stone-900">
                      {step.title}
                    </p>
                    {step.details && (
                      <p className="text-xs text-stone-600">{step.details}</p>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-600">
          Everything was done this week. Nothing to roll forward.
        </section>
      )}

      {doneInWeek.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            Finished this week
          </h2>
          <ul className="space-y-1.5 rounded-md border border-stone-200 bg-stone-50 p-3">
            {doneInWeek.map((step) => (
              <li
                key={step.id}
                className="text-sm text-stone-600 line-through decoration-stone-400"
              >
                {step.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex items-center justify-end gap-2">
        <Link
          href="/week"
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md border border-stone-700 bg-stone-900 px-4 py-1.5 text-sm text-stone-50 hover:bg-stone-800"
        >
          Close out week {weekNumber}
        </button>
      </div>
    </div>
  );
}
