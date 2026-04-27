import { fmtMonthYear, monthsBetween, pct } from "./dates";

export type GanttBar = {
  label: string;
  start: string;
  end: string;
  tone: "primary" | "warm" | "tan";
};

export type GanttGate = {
  label: string;
  date: string;
  tone: "primary" | "warm" | "tan";
};

/**
 * One Gantt strip = one project phase. Renders the date range as a
 * horizontal axis, then stacks bars and pin-shaped gates against it.
 *
 * Layout deliberately keeps the label column narrow (40% on phone) so
 * the bars themselves get most of the screen. Phone-first; on desktop
 * the strip stays the same width because the planner is meant for hands.
 */
export function PhaseGantt({
  title,
  caption,
  rangeStart,
  rangeEnd,
  bars,
  gates,
  todayMarker,
}: {
  title: string;
  caption: string;
  rangeStart: string;
  rangeEnd: string;
  bars: GanttBar[];
  gates: GanttGate[];
  todayMarker?: string;
}) {
  const totalMonths = monthsBetween(rangeStart, rangeEnd);

  return (
    <section
      className="w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 py-6">
        <div
          className="mono text-[10px] uppercase tracking-[0.22em] mb-2"
          style={{ color: "var(--color-accent-warm)" }}
        >
          {title}
        </div>
        <p
          className="serif text-[16px] leading-[1.4] mb-4"
          style={{ color: "var(--color-text)" }}
        >
          {caption}
        </p>

        <div
          className="rounded-xl border p-4"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-rule)",
          }}
        >
          {/* Axis row */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="mono text-[10px] uppercase tracking-[0.16em]"
              style={{ color: "var(--color-muted)" }}
            >
              {fmtMonthYear(rangeStart)}
            </span>
            <span
              className="mono text-[10px] uppercase tracking-[0.16em]"
              style={{ color: "var(--color-muted)" }}
            >
              {totalMonths.toFixed(0)} months
            </span>
            <span
              className="mono text-[10px] uppercase tracking-[0.16em]"
              style={{ color: "var(--color-muted)" }}
            >
              {fmtMonthYear(rangeEnd)}
            </span>
          </div>

          <div className="flex flex-col gap-2.5" data-testid="gantt-bars">
            {bars.map((b, i) => (
              <BarRow
                key={i}
                bar={b}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                todayMarker={todayMarker}
              />
            ))}
          </div>

          {gates.length > 0 ? (
            <div
              className="mt-4 pt-3 border-t"
              style={{ borderColor: "var(--color-rule)" }}
            >
              <p
                className="mono text-[10px] uppercase tracking-[0.18em] mb-2"
                style={{ color: "var(--color-muted)" }}
              >
                Gates
              </p>
              <div className="flex flex-col gap-2">
                {gates.map((g, i) => (
                  <GateRow
                    key={i}
                    gate={g}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function toneColor(tone: GanttBar["tone"]): string {
  switch (tone) {
    case "primary":
      return "var(--color-primary)";
    case "warm":
      return "var(--color-accent-warm)";
    case "tan":
      return "var(--color-accent)";
  }
}

function BarRow({
  bar,
  rangeStart,
  rangeEnd,
  todayMarker,
}: {
  bar: GanttBar;
  rangeStart: string;
  rangeEnd: string;
  todayMarker?: string;
}) {
  const left = pct(bar.start, rangeStart, rangeEnd);
  const right = pct(bar.end, rangeStart, rangeEnd);
  // If the user drags an anchor into a pathological order (start after end)
  // we don't fake a span — render an empty track so the misconfiguration
  // is visually honest instead of a misleading 2.5% bar.
  const rawWidth = right - left;
  const width = rawWidth <= 0 ? 0 : Math.max(2.5, rawWidth);
  const todayLeft =
    todayMarker !== undefined
      ? pct(todayMarker, rangeStart, rangeEnd)
      : null;

  return (
    <div className="grid grid-cols-[40%_1fr] gap-3 items-center">
      <p
        className="serif text-[13px] leading-[1.25]"
        style={{ color: "var(--color-text)" }}
      >
        {bar.label}
      </p>
      <div
        className="relative h-6 rounded-md"
        style={{
          background: "rgba(31, 61, 46, 0.06)",
        }}
      >
        {width > 0 ? (
          <div
            className="absolute top-0 bottom-0 rounded-md"
            style={{
              left: `${left}%`,
              width: `${width}%`,
              background: toneColor(bar.tone),
              opacity: 0.92,
            }}
          />
        ) : null}
        {todayLeft !== null && todayLeft > 0 && todayLeft < 100 ? (
          <div
            aria-hidden="true"
            className="absolute top-[-2px] bottom-[-2px] w-[2px]"
            style={{
              left: `${todayLeft}%`,
              background: "var(--color-accent-warm)",
              opacity: 0.55,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function GateRow({
  gate,
  rangeStart,
  rangeEnd,
}: {
  gate: GanttGate;
  rangeStart: string;
  rangeEnd: string;
}) {
  const left = pct(gate.date, rangeStart, rangeEnd);
  return (
    <div className="grid grid-cols-[40%_1fr] gap-3 items-center">
      <p
        className="serif text-[13px] leading-[1.25] italic"
        style={{ color: "var(--color-primary)" }}
      >
        {gate.label}
      </p>
      <div className="relative h-4">
        <div
          className="absolute top-0 -translate-x-1/2"
          style={{ left: `${left}%` }}
        >
          <div
            className="grid place-items-center font-bold mono text-[10px]"
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "999px",
              background: toneColor(gate.tone),
              color: "var(--color-bg)",
            }}
          >
            ▼
          </div>
        </div>
      </div>
    </div>
  );
}
