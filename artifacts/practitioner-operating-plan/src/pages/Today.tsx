import { Link } from "wouter";
import { useMemo } from "react";
import {
  formatLongDate,
  formatShortDate,
  getCurrentWeekNumber,
  getTodayISO,
  dayShortOf,
  dateForDayInWeek,
} from "../lib/dateMath";
import {
  getPhaseForWeek,
  getStepsForDay,
  getWeekPlan,
  type DayPlan,
} from "../data/plan2026";
import { useAppState } from "../lib/storage";
import { findCarriedFromPriorWeeks } from "../lib/carryover";
import { StepCard } from "../components/StepCard";
import { ThreeThings } from "../components/ThreeThings";
import { WeekStreak } from "../components/WeekStreak";
import { CostReviewButton } from "../components/CostReviewButton";

const REMAINING_DAY_LABELS: Record<DayPlan["dayShort"], string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
const ORDERED_DAYS: DayPlan["dayShort"][] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export default function Today() {
  const todayISO = getTodayISO();
  const weekNumber = getCurrentWeekNumber();
  const dayShort = dayShortOf(todayISO) as DayPlan["dayShort"];
  const phase = getPhaseForWeek(weekNumber);
  const week = getWeekPlan(weekNumber);
  const todaySteps = getStepsForDay(weekNumber, dayShort);
  const state = useAppState();

  const carried = useMemo(
    () => findCarriedFromPriorWeeks(state, weekNumber),
    [state, weekNumber],
  );

  // Remaining days of the current week, condensed beneath today's cards.
  const todayIdx = ORDERED_DAYS.indexOf(dayShort);
  const remainingDays = useMemo(() => {
    if (!week.days) return [];
    return ORDERED_DAYS.slice(todayIdx + 1).map((short) => {
      const day = week.days?.find((d) => d.dayShort === short);
      return {
        short,
        label: REMAINING_DAY_LABELS[short],
        date: dateForDayInWeek(weekNumber, short),
        steps: day?.steps ?? [],
      };
    });
  }, [week.days, todayIdx, weekNumber]);

  const totalToday = todaySteps.length;
  const doneToday = todaySteps.filter((s) => state.doneSteps[s.id]).length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-stone-500">
              {phase.title} · Week {weekNumber} of 52
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
              {formatLongDate(todayISO)}
            </h1>
          </div>
          <CostReviewButton variant="primary" />
        </div>
        <p className="max-w-2xl text-base text-stone-700">{week.theme}</p>
        {week.description && (
          <p className="max-w-2xl text-sm text-stone-600">{week.description}</p>
        )}
      </header>

      <ThreeThings />

      {carried.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-900">
              Carried over
            </h2>
            <span className="text-xs text-stone-500">
              {carried.length} item{carried.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Rolled forward automatically from a previous week.
          </p>
          <div className="space-y-3">
            {carried.map(({ fromWeek, step }) => (
              <StepCard
                key={`carry-${step.id}`}
                step={step}
                carriedFromWeek={fromWeek}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            Today
          </h2>
          <span className="text-xs text-stone-500">
            {doneToday} of {totalToday} done
          </span>
        </div>
        {todaySteps.length === 0 ? (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
            Nothing scheduled for today. Use the day for the carry-overs above,
            or look ahead at the rest of the week below.
          </div>
        ) : (
          <div className="space-y-3">
            {todaySteps.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>
        )}
      </section>

      {remainingDays.length > 0 && (
        <section className="space-y-3" data-testid="section-this-week-strip">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
              The rest of this week
            </h2>
            <Link
              href="/week"
              className="text-xs text-stone-600 hover:text-stone-900 hover:underline"
            >
              Open full week
            </Link>
          </div>
          <ol className="divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200 bg-white">
            {remainingDays.map(({ short, label, date, steps }) => {
              const doneCount = steps.filter(
                (s) => state.doneSteps[s.id],
              ).length;
              return (
                <li
                  key={short}
                  className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm"
                  data-testid={`row-this-week-${short}`}
                >
                  <Link
                    href="/week"
                    className="flex min-w-0 flex-1 items-baseline gap-3 hover:underline"
                  >
                    <span className="w-24 shrink-0 text-stone-700">
                      {label}
                    </span>
                    <span className="hidden w-24 shrink-0 text-xs text-stone-500 sm:inline">
                      {formatShortDate(date)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-stone-600">
                      {steps.length === 0
                        ? "Nothing scheduled."
                        : steps[0].title +
                          (steps.length > 1
                            ? ` · +${steps.length - 1} more`
                            : "")}
                    </span>
                  </Link>
                  <span className="shrink-0 text-xs text-stone-500">
                    {steps.length === 0
                      ? "—"
                      : `${doneCount}/${steps.length}`}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <WeekStreak />

      <section className="rounded-lg border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
              Looking ahead
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Scan the year or open the source plan deck.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/year"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
            >
              The year
            </Link>
            <Link
              href="/plan"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
            >
              Source plan
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
          Working docs
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Single-page checklists for the work that lives outside the deck.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              href="/checklist"
              className="text-stone-800 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700"
            >
              Headwaters naming &amp; registration →
            </Link>
          </li>
          <li>
            <Link
              href="/lease-tooling"
              className="text-stone-800 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700"
            >
              Dad-lease CRA tooling →
            </Link>
          </li>
          <li>
            <Link
              href="/payback-memo"
              className="text-stone-800 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700"
            >
              Headwaters ↔ 807 payback memorandum (Slide II · 22) →
            </Link>
          </li>
          <li>
            <Link
              href="/studio-wind-down"
              className="text-stone-800 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700"
            >
              Studio wind-down (close bobbieparr.studio to new work) →
            </Link>
          </li>
          <li>
            <Link
              href="/hours"
              className="text-stone-800 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700"
            >
              Quarterly hours-by-pillar report (Hard Rule 02) →
            </Link>
          </li>
          <li>
            <Link
              href="/inquiry-triage"
              className="text-stone-800 underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700"
            >
              Inquiry triage (is this a real Carve-out A lead?) →
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
