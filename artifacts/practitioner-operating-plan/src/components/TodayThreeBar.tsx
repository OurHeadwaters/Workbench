import { useEffect, useState } from "react";
import { Link } from "wouter";

import { useAppState, useAppStateActions } from "@/lib/storage";
import {
  countActive,
  countDone,
  readDailyThree,
} from "@/lib/threeThings";
import { getTodayISO } from "@/lib/dateMath";

// Compact, always-on editable Today's 3 surface. Lives in the global
// AppLayout above the page content so the practitioner can capture or
// check off a daily commitment from any page in the book — not only
// /today. The richer card on /today (with phase-scoped 3, yesterday,
// streak) is the home base; this is the always-reachable hand.
export function TodayThreeBar() {
  const state = useAppState();
  const { setDailyThing, toggleDailyThing } = useAppStateActions();

  // Recompute today on focus / visibility change / minute tick so the
  // bar rolls over at local midnight without a manual refresh.
  const [todayISO, setTodayISO] = useState(() => getTodayISO());
  useEffect(() => {
    const recompute = () => setTodayISO(getTodayISO());
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

  const items = readDailyThree(state, todayISO);
  const done = countDone(items);
  const active = countActive(items);
  const denom = Math.max(3, active || 3);
  const allDone = active === 3 && done === 3;

  return (
    <section
      aria-label="My Three Things — today"
      className="border-b border-stone-200 bg-stone-100/70"
      data-testid="bar-today-three"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:gap-4">
        <Link
          href="/today"
          className="flex shrink-0 items-baseline gap-2"
          data-testid="link-today-three-home"
          title="Go to Today"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
            Today's 3
          </span>
          <span
            className={
              "rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums " +
              (allDone
                ? "bg-emerald-100 text-emerald-900"
                : "bg-stone-200 text-stone-700")
            }
            data-testid="text-today-three-bar-count"
          >
            {done}/{denom}
          </span>
        </Link>
        <ol className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.done}
                onChange={(e) =>
                  toggleDailyThing(todayISO, idx, e.target.checked)
                }
                aria-label={`Mark today's thing ${idx + 1} done`}
                className="h-4 w-4 shrink-0 rounded border-stone-300"
                data-testid={`bar-today-three-${idx}-checkbox`}
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) =>
                  setDailyThing(todayISO, idx, e.target.value)
                }
                placeholder={`Thing ${idx + 1}…`}
                aria-label={`Today's thing ${idx + 1}`}
                className={
                  "min-w-0 flex-1 rounded border border-transparent bg-white/60 px-2 py-1 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-300 focus:bg-white focus:outline-none " +
                  (item.done && item.text.trim().length > 0
                    ? "text-stone-500 line-through"
                    : "")
                }
                data-testid={`bar-today-three-${idx}-text`}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
