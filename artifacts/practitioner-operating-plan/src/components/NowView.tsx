import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";

import { PHASE_LABELS } from "@/lib/phases";
import { useAppState, useAppStateActions } from "@/lib/storage";
import type { ThreeThingTriple } from "@/lib/storage";
import {
  countActive,
  countDone,
  currentWeekKey,
  getNextUndone,
  isItemActive,
  readDailyThree,
  readPhaseThree,
  readWeekThree,
  yesterdayISO,
  type NextUndone,
  type NextUndoneKind,
} from "@/lib/threeThings";
import {
  formatLongDate,
  formatShortDate,
  getTodayISO,
} from "@/lib/dateMath";
import { CostReviewButton } from "./CostReviewButton";
import { PhaseIndicator } from "./PhaseIndicator";

export function NowView() {
  const state = useAppState();
  const {
    setDailyThing,
    toggleDailyThing,
    setWeeklyThing,
    toggleWeeklyThing,
    setPhaseThing,
    togglePhaseThing,
  } = useAppStateActions();

  // Recompute today / this-week on focus, visibility, and a 60s tick
  // so keys roll over at local midnight / Monday without a manual refresh.
  const [todayISO, setTodayISO] = useState(() => getTodayISO());
  const [weekKey, setWeekKey] = useState(() => currentWeekKey());
  useEffect(() => {
    const recompute = () => {
      setTodayISO(getTodayISO());
      setWeekKey(currentWeekKey());
    };
    const onFocus = () => recompute();
    const onVisibility = () => {
      if (document.visibilityState === "visible") recompute();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    const interval = window.setInterval(recompute, 60_000);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
    };
  }, []);

  const activePhase = state.currentPhase;
  const dailyItems = readDailyThree(state, todayISO);
  const weeklyItems = readWeekThree(state, weekKey);
  const { items: phaseItems } = readPhaseThree(state, activePhase);
  const next = getNextUndone(dailyItems, weeklyItems, phaseItems);

  // Re-key the focal wrapper on (kind,idx,text) so the slide-in
  // animation fires whenever we advance to a different slot.
  const focalKey = useMemo(
    () =>
      next === null
        ? "all-done"
        : `${next.kind}-${next.idx}-${next.item.text}`,
    [next],
  );

  const allDone = next === null;

  function setText(kind: NextUndoneKind, idx: number, text: string) {
    if (kind === "day") setDailyThing(todayISO, idx, text);
    else if (kind === "week") setWeeklyThing(weekKey, idx, text);
    else setPhaseThing(activePhase, idx, text);
  }
  function toggleDone(kind: NextUndoneKind, idx: number, done: boolean) {
    if (kind === "day") toggleDailyThing(todayISO, idx, done);
    else if (kind === "week") toggleWeeklyThing(weekKey, idx, done);
    else togglePhaseThing(activePhase, idx, done);
  }

  return (
    <div className="space-y-6 pb-12 pt-2" data-testid="now-view">
      {/* Chrome is hidden in the all-done state so the close-the-book
          message stands alone. */}
      {!allDone && <ChromeChevron todayISO={todayISO} weekKey={weekKey} />}

      <FocalCard
        focalKey={focalKey}
        next={next}
        allDone={allDone}
        onSave={setText}
        onDone={(kind, idx) => toggleDone(kind, idx, true)}
      />

      {!allDone && (
        <div className="space-y-5">
          <Block
            title="Today's 3"
            kind="day"
            items={dailyItems}
            onText={(idx, text) => setDailyThing(todayISO, idx, text)}
            onToggle={(idx, done) => toggleDailyThing(todayISO, idx, done)}
            highlight={next?.kind === "day" ? next.idx : null}
          />
          <Block
            title="This Week's 3"
            kind="week"
            items={weeklyItems}
            onText={(idx, text) => setWeeklyThing(weekKey, idx, text)}
            onToggle={(idx, done) => toggleWeeklyThing(weekKey, idx, done)}
            highlight={next?.kind === "week" ? next.idx : null}
          />
          <Block
            title={`This Phase's 3 — ${PHASE_LABELS[activePhase]}`}
            kind="phase"
            items={phaseItems}
            onText={(idx, text) => setPhaseThing(activePhase, idx, text)}
            onToggle={(idx, done) =>
              togglePhaseThing(activePhase, idx, done)
            }
            highlight={next?.kind === "phase" ? next.idx : null}
          />
        </div>
      )}
    </div>
  );
}

const PILL_LABELS: Record<NextUndoneKind, string> = {
  day: "Day",
  week: "Week",
  phase: "Phase",
};

const PILL_CLASSES: Record<NextUndoneKind, string> = {
  day: "bg-stone-900 text-stone-50",
  week: "bg-emerald-700 text-emerald-50",
  phase: "bg-amber-700 text-amber-50",
};

function FocalCard({
  focalKey,
  next,
  allDone,
  onSave,
  onDone,
}: {
  focalKey: string;
  next: NextUndone | null;
  allDone: boolean;
  onSave: (kind: NextUndoneKind, idx: number, text: string) => void;
  onDone: (kind: NextUndoneKind, idx: number) => void;
}) {
  return (
    <div
      key={focalKey}
      className="animate-now-slide-in"
      data-testid="focal-card"
    >
      {allDone ? <FocalAllDone /> : <FocalActive next={next!} onSave={onSave} onDone={onDone} />}
    </div>
  );
}

export { FocalActive, FocalAllDone };

function FocalAllDone() {
  return (
    <section
      className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center shadow-sm"
      data-testid="focal-card-all-done"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
        All 9 done
      </p>
      <p
        className="mt-3 font-serif text-2xl leading-snug text-emerald-900"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        You're done for today. Close the book.
      </p>
    </section>
  );
}

function FocalActive({
  next,
  onSave,
  onDone,
}: {
  next: NextUndone;
  onSave: (kind: NextUndoneKind, idx: number, text: string) => void;
  onDone: (kind: NextUndoneKind, idx: number) => void;
}) {
  const filled = isItemActive(next.item);
  const pillClass = PILL_CLASSES[next.kind];
  const pillLabel = PILL_LABELS[next.kind];

  return (
    <section
      className="rounded-2xl border border-stone-200 bg-white px-5 py-6 shadow-sm"
      data-testid={`focal-card-${next.kind}-${next.idx}`}
    >
      <span
        className={
          "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest " +
          pillClass
        }
        data-testid="focal-card-pill"
      >
        {pillLabel}
      </span>

      {filled ? (
        <FocalFilled item={next.item} onDone={() => onDone(next.kind, next.idx)} />
      ) : (
        <FocalEmpty
          kind={next.kind}
          onSave={(text) => onSave(next.kind, next.idx, text)}
        />
      )}
    </section>
  );
}

function FocalFilled({
  item,
  onDone,
}: {
  item: { text: string; done: boolean };
  onDone: () => void;
}) {
  return (
    <>
      <p
        className="mt-4 break-words font-serif text-3xl leading-snug text-stone-900"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        data-testid="focal-card-text"
      >
        {item.text}
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-6 block w-full rounded-xl bg-stone-900 py-5 text-base font-semibold uppercase tracking-widest text-stone-50 shadow-sm active:bg-stone-700"
        data-testid="focal-card-done"
      >
        Done
      </button>
    </>
  );
}

function FocalEmpty({
  kind,
  onSave,
}: {
  kind: NextUndoneKind;
  onSave: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const prompt =
    kind === "day"
      ? "What's the next thing for today?"
      : kind === "week"
        ? "What's the next thing for this week?"
        : "What's the next thing for this phase?";
  function save() {
    const trimmed = draft.trim();
    if (trimmed.length === 0) return;
    onSave(trimmed);
    setDraft("");
  }
  return (
    <>
      <p
        className="mt-4 break-words font-serif text-2xl leading-snug text-stone-700"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        data-testid="focal-card-prompt"
      >
        {prompt}
      </p>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            save();
          }
        }}
        placeholder="Type one thing…"
        autoFocus={false}
        className="mt-5 block w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-4 text-base text-stone-900 placeholder-stone-400 focus:border-stone-700 focus:bg-white focus:outline-none"
        data-testid="focal-card-input"
      />
      <button
        type="button"
        onClick={save}
        disabled={draft.trim().length === 0}
        className="mt-4 block w-full rounded-xl bg-stone-900 py-5 text-base font-semibold uppercase tracking-widest text-stone-50 shadow-sm active:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        data-testid="focal-card-save"
      >
        Save
      </button>
    </>
  );
}

function Block({
  title,
  kind,
  items,
  onText,
  onToggle,
  highlight,
}: {
  title: string;
  kind: NextUndoneKind;
  items: ThreeThingTriple;
  onText: (idx: number, text: string) => void;
  onToggle: (idx: number, done: boolean) => void;
  highlight: number | null;
}) {
  const done = countDone(items);
  const active = countActive(items);
  const denom = Math.max(3, active || 3);
  return (
    <section
      className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
      data-testid={`now-block-${kind}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-700">
          {title}
        </h2>
        <span className="font-mono text-[11px] tabular-nums text-stone-500">
          {done}/{denom}
        </span>
      </div>
      <ol className="mt-3 space-y-1">
        {items.map((item, idx) => (
          <BlockRow
            key={idx}
            idx={idx}
            kind={kind}
            item={item}
            isFocus={highlight === idx}
            onText={(text) => onText(idx, text)}
            onToggle={(done) => onToggle(idx, done)}
          />
        ))}
      </ol>
    </section>
  );
}

function BlockRow({
  idx,
  kind,
  item,
  isFocus,
  onText,
  onToggle,
}: {
  idx: number;
  kind: NextUndoneKind;
  item: { text: string; done: boolean };
  isFocus: boolean;
  onText: (text: string) => void;
  onToggle: (done: boolean) => void;
}) {
  return (
    <li
      className={
        "flex items-center gap-3 rounded-md px-2 py-2 " +
        (isFocus ? "bg-stone-100" : "")
      }
      data-testid={`now-block-${kind}-row-${idx}`}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={(e) => onToggle(e.target.checked)}
        className="h-6 w-6 shrink-0 rounded border-stone-400"
        aria-label={`Mark ${kind} thing ${idx + 1} done`}
        data-testid={`now-block-${kind}-${idx}-checkbox`}
      />
      <input
        type="text"
        value={item.text}
        onChange={(e) => onText(e.target.value)}
        placeholder={`Thing ${idx + 1}…`}
        className={
          "min-w-0 flex-1 rounded border border-transparent bg-transparent px-2 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-300 focus:bg-stone-50 focus:outline-none " +
          (item.done && item.text.trim().length > 0
            ? "text-stone-500 line-through"
            : "")
        }
        aria-label={`${kind} thing ${idx + 1}`}
        data-testid={`now-block-${kind}-${idx}-text`}
      />
    </li>
  );
}

// Chrome chevron — closed by default on every page load. Surfaces
// date, week, phase, cost-review, nav links, and yesterday's items
// so the practitioner isn't stranded on /today.
function ChromeChevron({
  todayISO,
  weekKey,
}: {
  todayISO: string;
  weekKey: string;
}) {
  const [open, setOpen] = useState(false);
  const state = useAppState();
  const yISO = useMemo(
    () => yesterdayISO(new Date(todayISO + "T12:00:00")),
    [todayISO],
  );
  const yItems = readDailyThree(state, yISO);
  const yActive = countActive(yItems);
  const yDone = countDone(yItems);

  return (
    <div data-testid="now-chrome">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2 text-xs uppercase tracking-widest text-stone-600 shadow-sm"
        aria-expanded={open}
        data-testid="now-chrome-toggle"
      >
        <span>{open ? "Less" : "More"}</span>
        <span aria-hidden className={open ? "rotate-180" : ""}>
          ⌄
        </span>
      </button>
      {open && (
        <div
          className="mt-2 space-y-3 rounded-md border border-stone-200 bg-white p-3 text-sm shadow-sm"
          data-testid="now-chrome-panel"
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs uppercase tracking-widest text-stone-500">
              Week {weekKey} of 52
            </p>
            <PhaseIndicator />
          </div>
          <p className="font-medium text-stone-900">
            {formatLongDate(todayISO)}
          </p>
          <div>
            <CostReviewButton variant="compact" />
          </div>

          <nav className="flex flex-wrap gap-2 border-t border-stone-100 pt-3 text-xs">
            <Link
              href="/week"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-100"
            >
              Week
            </Link>
            <Link
              href="/year"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-100"
            >
              Year
            </Link>
            <Link
              href="/plan"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-100"
            >
              Plan
            </Link>
            <Link
              href="/onepager"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-100"
            >
              One-Pager
            </Link>
          </nav>

          <div className="border-t border-stone-100 pt-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
              Yesterday · {formatShortDate(yISO)}
            </p>
            {yActive === 0 ? (
              <p className="mt-1 text-xs italic text-stone-400">
                Nothing logged yesterday.
              </p>
            ) : (
              <ol className="mt-1 space-y-1">
                {yItems.map((it, i) =>
                  isItemActive(it) ? (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm"
                      data-testid={`now-chrome-yesterday-${i}`}
                    >
                      <span
                        aria-hidden
                        className={
                          "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border " +
                          (it.done
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-stone-300 bg-stone-50")
                        }
                      >
                        {it.done ? "✓" : ""}
                      </span>
                      <span
                        className={
                          it.done ? "text-stone-500 line-through" : "text-stone-700"
                        }
                      >
                        {it.text}
                      </span>
                    </li>
                  ) : null,
                )}
                <li className="text-[10px] uppercase tracking-widest text-stone-400">
                  {yDone}/{yActive} done
                </li>
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

