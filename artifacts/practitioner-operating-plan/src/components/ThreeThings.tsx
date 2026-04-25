import { useEffect, useMemo, useState } from "react";

import { PHASE_LABELS } from "@/lib/phases";
import { useAppState, useAppStateActions } from "@/lib/storage";
import {
  countActive,
  countDone,
  isItemActive,
  phaseSlotMatchesActive,
  readDailyThree,
  readPhaseThree,
  yesterdayISO,
} from "@/lib/threeThings";
import { getTodayISO, formatShortDate } from "@/lib/dateMath";

// "My Three Things" — credit to Nicole Sauce. Two stacked surfaces:
//   1. Today's 3 (global, doesn't change shape regardless of phase)
//   2. 3 to move [Phase] forward (resets when the practitioner enters
//      a new phase)
// Plus a small read-only "yesterday" section so honest accountability
// is one glance away without a separate navigation.
export function ThreeThings() {
  const state = useAppState();
  const {
    setDailyThing,
    toggleDailyThing,
    setPhaseThing,
    togglePhaseThing,
    resetPhaseThree,
  } = useAppStateActions();

  // Recompute today on focus / day rollover so the rows reset at local
  // midnight without requiring a manual refresh.
  const [todayISO, setTodayISO] = useState(() => getTodayISO());
  useEffect(() => {
    const recompute = () => setTodayISO(getTodayISO());
    const onFocus = () => recompute();
    const onVisibility = () => {
      if (document.visibilityState === "visible") recompute();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    // Also poll once a minute so a long-open tab rolls over near midnight.
    const interval = window.setInterval(recompute, 60_000);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
    };
  }, []);

  const yISO = useMemo(() => yesterdayISO(new Date(todayISO + "T12:00:00")), [
    todayISO,
  ]);
  const todayItems = readDailyThree(state, todayISO);
  const yesterdayItems = readDailyThree(state, yISO);

  const activePhase = state.currentPhase;
  const { items: phaseItems, matchesActive: phaseMatches } = readPhaseThree(
    state,
    activePhase,
  );
  // Soft prompt fires whenever the stored phase-3 slot belongs to a
  // different phase (or doesn't exist yet).
  const showPhasePrompt = !phaseSlotMatchesActive(
    state.phaseThree,
    activePhase,
  );

  const todayDone = countDone(todayItems);
  const todayActive = countActive(todayItems);
  const yActive = countActive(yesterdayItems);
  const yDone = countDone(yesterdayItems);

  return (
    <section
      className="space-y-6 rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
      aria-labelledby="three-things-heading"
      data-testid="card-three-things"
    >
      {/* Today's 3 ----------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h2
              id="three-things-heading"
              className="text-sm font-semibold uppercase tracking-wider text-stone-700"
            >
              My Three Things
            </h2>
            <p className="text-xs text-stone-500">
              Three things to do today, period.
            </p>
          </div>
          <span
            className="text-xs font-medium text-stone-500"
            data-testid="text-today-three-count"
          >
            {todayDone}/{Math.max(3, todayActive || 3)} done
          </span>
        </div>
        <ol className="space-y-2">
          {todayItems.map((item, idx) => (
            <ThreeRow
              key={`today-${idx}`}
              idx={idx}
              item={item}
              ariaLabel={`Today's thing ${idx + 1}`}
              onToggle={(done) => toggleDailyThing(todayISO, idx, done)}
              onText={(text) => setDailyThing(todayISO, idx, text)}
              testId={`three-today-${idx}`}
            />
          ))}
        </ol>
      </div>

      {/* Phase-scoped 3 ------------------------------------------------ */}
      <div className="space-y-3 border-t border-stone-200 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
              3 to move {PHASE_LABELS[activePhase]} forward
            </h3>
            <p className="text-xs text-stone-500">
              Three things to advance the current phase. Carries day-to-day
              until the phase changes.
            </p>
          </div>
          {phaseMatches && (
            <span className="text-xs font-medium text-stone-500">
              {countDone(phaseItems)}/
              {Math.max(3, countActive(phaseItems) || 3)} done
            </span>
          )}
        </div>
        {showPhasePrompt && (
          <div
            className="flex items-start justify-between gap-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900"
            data-testid="prompt-phase-three-set-new"
          >
            <p>
              You're in <span className="font-semibold">{PHASE_LABELS[activePhase]}</span>{" "}
              now. Set three things to move this phase forward.
            </p>
            <button
              type="button"
              onClick={() => resetPhaseThree(activePhase)}
              className="shrink-0 rounded bg-amber-900 px-2 py-1 text-[11px] font-medium text-amber-50 hover:bg-amber-800"
              data-testid="button-phase-three-set-new"
            >
              Start fresh
            </button>
          </div>
        )}
        <ol className="space-y-2">
          {phaseItems.map((item, idx) => (
            <ThreeRow
              key={`phase-${activePhase}-${idx}`}
              idx={idx}
              item={item}
              disabled={false}
              ariaLabel={`${PHASE_LABELS[activePhase]} thing ${idx + 1}`}
              onToggle={(done) => togglePhaseThing(activePhase, idx, done)}
              onText={(text) => setPhaseThing(activePhase, idx, text)}
              testId={`three-phase-${idx}`}
            />
          ))}
        </ol>
      </div>

      {/* Yesterday ----------------------------------------------------- */}
      <div className="space-y-2 border-t border-stone-200 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Yesterday
          </h3>
          <span className="text-[11px] text-stone-500">
            {formatShortDate(yISO)} ·{" "}
            {yActive === 0 ? "no entries" : `${yDone}/${yActive} done`}
          </span>
        </div>
        {yActive === 0 ? (
          <p className="text-xs italic text-stone-400">
            Nothing logged yesterday. New day, fresh start.
          </p>
        ) : (
          <ol className="space-y-1.5" data-testid="list-yesterday-three">
            {yesterdayItems.map((item, idx) => {
              if (!isItemActive(item)) return null;
              return (
                <li
                  key={`y-${idx}`}
                  className="flex items-center gap-2 text-sm"
                  data-testid={`row-yesterday-${idx}`}
                >
                  <span
                    aria-hidden
                    className={
                      "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border " +
                      (item.done
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-stone-300 bg-stone-50")
                    }
                  >
                    {item.done ? "✓" : ""}
                  </span>
                  <span
                    className={
                      "flex-1 " +
                      (item.done
                        ? "text-stone-500 line-through"
                        : "text-stone-700")
                    }
                  >
                    {item.text}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <p className="border-t border-stone-100 pt-3 text-[10px] uppercase tracking-widest text-stone-400">
        "My Three Things" — credit to Nicole Sauce
      </p>
    </section>
  );
}

type ThreeRowProps = {
  idx: number;
  item: { text: string; done: boolean };
  ariaLabel: string;
  onToggle: (done: boolean) => void;
  onText: (text: string) => void;
  testId: string;
  disabled?: boolean;
};

function ThreeRow({
  idx,
  item,
  ariaLabel,
  onToggle,
  onText,
  testId,
  disabled,
}: ThreeRowProps) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-4 shrink-0 text-xs font-medium text-stone-400">
        {idx + 1}.
      </span>
      <input
        type="checkbox"
        checked={item.done}
        disabled={disabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-stone-300"
        aria-label={`Mark ${ariaLabel} done`}
        data-testid={`${testId}-checkbox`}
      />
      <input
        type="text"
        value={item.text}
        disabled={disabled}
        onChange={(e) => onText(e.target.value)}
        placeholder="Type one thing…"
        aria-label={ariaLabel}
        className={
          "flex-1 rounded border border-transparent bg-transparent px-2 py-1 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-300 focus:bg-stone-50 focus:outline-none " +
          (item.done && item.text.trim().length > 0
            ? "text-stone-500 line-through"
            : "")
        }
        data-testid={`${testId}-text`}
      />
    </li>
  );
}
