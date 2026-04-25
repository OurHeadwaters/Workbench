import { useAppState } from "@/lib/storage";
import { getLastSevenDays, shortWeekdayLabel } from "@/lib/threeThings";
import type { DayStatus } from "@/lib/threeThings";
import { formatShortDate } from "@/lib/dateMath";

const STATUS_STYLE: Record<
  DayStatus,
  { bg: string; ring: string; label: string }
> = {
  all: {
    bg: "bg-emerald-500 text-white",
    ring: "ring-emerald-600",
    label: "all 3 done",
  },
  partial: {
    bg: "bg-amber-300 text-amber-950",
    ring: "ring-amber-500",
    label: "partial",
  },
  missed: {
    bg: "bg-stone-200 text-stone-500",
    ring: "ring-stone-300",
    label: "missed",
  },
  empty: {
    bg: "bg-stone-50 text-stone-400 border border-dashed border-stone-300",
    ring: "ring-stone-200",
    label: "no entries",
  },
};

// Read-only honesty surface: last 7 calendar days as a strip of dots.
// No editing of past days — the streak isn't a scoring system, it's a
// glance-and-go check on consistency.
export function WeekStreak() {
  const state = useAppState();
  const days = getLastSevenDays(state);
  const hits = days.filter((d) => d.status === "all").length;
  const partial = days.filter((d) => d.status === "partial").length;

  return (
    <section
      className="space-y-3 rounded-lg border border-stone-200 bg-white p-5"
      aria-labelledby="week-streak-heading"
      data-testid="card-week-streak"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2
            id="week-streak-heading"
            className="text-sm font-semibold uppercase tracking-wider text-stone-700"
          >
            My Three Things — last 7 days
          </h2>
          <p className="text-xs text-stone-500">
            Honest at-a-glance, not a scoreboard.
          </p>
        </div>
        <span className="text-xs text-stone-500">
          {hits} hit · {partial} partial
        </span>
      </div>
      <ol
        className="grid grid-cols-7 gap-2"
        data-testid="list-week-streak-days"
      >
        {days.map((d) => {
          const style = STATUS_STYLE[d.status];
          return (
            <li
              key={d.dateISO}
              className="flex flex-col items-center gap-1 text-center"
              data-testid={`day-week-streak-${d.dateISO}`}
            >
              <span className="text-[10px] uppercase tracking-widest text-stone-400">
                {shortWeekdayLabel(d.dateISO)}
              </span>
              <span
                aria-label={`${formatShortDate(d.dateISO)}: ${style.label}`}
                title={`${formatShortDate(d.dateISO)} — ${style.label}${
                  d.active > 0 ? ` (${d.done}/${d.active})` : ""
                }`}
                className={
                  "inline-flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold " +
                  style.bg +
                  (d.isToday ? " ring-2 ring-offset-2 " + style.ring : "")
                }
              >
                {d.active === 0 ? "·" : `${d.done}/${d.active}`}
              </span>
              <span className="text-[10px] text-stone-500">
                {formatShortDate(d.dateISO).split(" ").slice(-1)[0]}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
        <Legend swatch="bg-emerald-500" label="all 3 done" />
        <Legend swatch="bg-amber-300" label="partial" />
        <Legend swatch="bg-stone-200" label="missed" />
        <Legend
          swatch="bg-stone-50 border border-dashed border-stone-300"
          label="no entries"
        />
      </div>
    </section>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className={"inline-block h-3 w-3 rounded-full " + swatch}
      />
      {label}
    </span>
  );
}
