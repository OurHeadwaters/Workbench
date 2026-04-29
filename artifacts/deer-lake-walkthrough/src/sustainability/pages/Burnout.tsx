import { Reveal } from "@/components/Reveal";
import { PageFrame } from "../components/PageFrame";

/**
 * Burnout early-warning protocol. The leading indicators, the
 * thresholds, the response, and explicit ownership of "who is
 * responsible for noticing". Written so the operator can self-flag
 * before breaking.
 */

interface Indicator {
  id: string;
  name: string;
  watch: string;
  green: string;
  yellow: string;
  red: string;
  response: string;
}

const INDICATORS: Indicator[] = [
  {
    id: "hours",
    name: "Hours worked per week",
    watch: "By the operator on shift, in their own log; reviewed weekly",
    green: "≤ 50 hrs",
    yellow: "51 – 60 hrs",
    red: "> 60 hrs for 2 weeks",
    response: "Yellow → call relief shifts. Red → contractor on-call covers a full day off this week.",
  },
  {
    id: "backup",
    name: "Days without a real backup on-site",
    watch: "By the schedule. Counts a day where only the primary is qualified to run the function.",
    green: "0 – 3 days/mo",
    yellow: "4 – 7 days/mo",
    red: "≥ 8 days/mo",
    response: "Yellow → cross-train another pod member this month. Red → freeze the function until bench is real.",
  },
  {
    id: "complaints",
    name: "Customer complaint trend",
    watch: "By the operator. One sticky note per complaint, dropped in a jar by the till / front desk.",
    green: "< 1 / week",
    yellow: "2 – 3 / week",
    red: "≥ 4 / week, or 1 about money",
    response: "Yellow → operator + community liaison sit down. Red → contractor visit within 7 days.",
  },
  {
    id: "errors",
    name: "Money-touching errors",
    watch: "By the bookkeeper. Counted per month: voids over $20, float-off-by, deposit mismatches.",
    green: "0 – 1 / month",
    yellow: "2 – 3 / month",
    red: "≥ 4, or any single error > $200",
    response: "Yellow → re-run the till training. Red → manager-only mode on the till until reviewed.",
  },
];

const RESPONSE_LADDER = [
  {
    step: "Self-flag",
    body: "Operator names the yellow or red themselves, in the weekly log. No shame; the protocol assumes everyone hits yellow eventually.",
  },
  {
    step: "Relief shift",
    body: "On-call pod (store) or named band relief (hotel) covers an immediate day off. No paperwork.",
  },
  {
    step: "Role rotation",
    body: "For the next two weeks, the primary swaps a heavy function (till / front desk) with a lighter one (ordering / back office) so the load actually changes.",
  },
  {
    step: "Paid time off",
    body: "Two paid days, on the operator's choice of calendar. The replacement runs the operation. The operator does not check in.",
  },
  {
    step: "Contractor on-call",
    body: "Contractor flies in or video-supervises a band-led relief team for one full week. Used on red flags only.",
  },
];

export default function Burnout() {
  return (
    <PageFrame
      eyebrow="04 · Burnout early-warning"
      title="Notice it on a Tuesday."
      italic="Not at the resignation."
      standfirst={
        <>
          The four indicators below catch a couple before they break. Each one
          has a green / yellow / red threshold and a written response. The
          operator on shift is the one responsible for noticing — the
          protocol is built so they can flag themselves without anyone losing
          face.
        </>
      }
    >
      {INDICATORS.map((ind) => (
        <article
          key={ind.id}
          className="rounded-xl border overflow-hidden"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-rule)",
          }}
        >
          <header className="p-4 border-b" style={{ borderColor: "var(--color-rule)" }}>
            <div
              className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1"
              style={{ color: "var(--color-accent-warm)" }}
            >
              Indicator
            </div>
            <div
              className="serif text-[18px] font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {ind.name}
            </div>
            <div
              className="mt-1.5 text-[13.5px] leading-[1.45]"
              style={{ color: "var(--color-text)" }}
            >
              {ind.watch}
            </div>
          </header>
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--color-rule)" }}>
            <Threshold tone="green" label="Green" value={ind.green} />
            <Threshold tone="yellow" label="Yellow" value={ind.yellow} />
            <Threshold tone="red" label="Red" value={ind.red} />
          </div>
          <div
            className="p-4 border-t"
            style={{
              borderColor: "var(--color-rule)",
              background: "var(--color-bg)",
            }}
          >
            <div
              className="mono text-[10px] uppercase tracking-[0.18em] mb-1"
              style={{ color: "var(--color-muted)" }}
            >
              Response
            </div>
            <div
              className="serif text-[14.5px] leading-[1.5]"
              style={{ color: "var(--color-text)" }}
            >
              {ind.response}
            </div>
          </div>
        </article>
      ))}

      <div
        className="rounded-xl p-4 border"
        style={{
          background: "var(--color-primary)",
          borderColor: "var(--color-primary)",
          color: "var(--color-bg)",
        }}
      >
        <div
          className="mono text-[10.5px] uppercase tracking-[0.18em] mb-2"
          style={{ color: "var(--color-accent)" }}
        >
          The response ladder
        </div>
        <ol className="list-none pl-0 space-y-3">
          {RESPONSE_LADDER.map((s, i) => (
            <li key={s.step} className="flex gap-3">
              <span
                className="mono text-[14px] tabular-nums shrink-0 leading-none pt-1"
                style={{ color: "var(--color-accent)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="serif text-[16px] font-semibold">{s.step}</div>
                <div
                  className="serif text-[14px] leading-[1.5] mt-0.5"
                  style={{ color: "rgba(244,237,224,0.85)" }}
                >
                  {s.body}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Reveal label="Who is responsible for noticing">
        <p>
          <span className="font-semibold">The operator on shift</span> is
          responsible for naming yellows and reds in the weekly log. The
          protocol assumes nobody will see them coming if they have to.
        </p>
        <p>
          <span className="font-semibold">The community liaison</span> is the
          backstop. They check the log every Monday morning. If a yellow has
          gone two weeks unflagged, they call it.
        </p>
        <p>
          <span className="font-semibold">The contractor</span> is the
          escalation. Reds reach the contractor within 48 hours by the
          existing on-call line; the contractor's job is to put the response
          ladder into motion, not to take over the function.
        </p>
      </Reveal>

      <Reveal label="Why self-flag is the design point">
        <p>
          A protocol that makes the operator confess to a manager doesn't get
          used. A protocol where naming yellow is the same paperwork as
          naming green — a single number in a weekly log — gets used.
        </p>
        <p>
          The relief shift, the role rotation, and the paid time off are
          pre-approved. The operator does not have to ask for them; they are
          on the schedule the moment the log shows yellow.
        </p>
      </Reveal>
    </PageFrame>
  );
}

const TONE: Record<
  "green" | "yellow" | "red",
  { bg: string; ink: string; dot: string }
> = {
  green: { bg: "rgba(59,110,74,0.12)", ink: "#22532f", dot: "#3b6e4a" },
  yellow: { bg: "rgba(184,143,62,0.14)", ink: "#7e5a25", dot: "#d18f3e" },
  red: { bg: "rgba(156,42,28,0.10)", ink: "#7a1f15", dot: "#9c2a1c" },
};

function Threshold({
  tone,
  label,
  value,
}: {
  tone: "green" | "yellow" | "red";
  label: string;
  value: string;
}) {
  const t = TONE[tone];
  return (
    <div
      className="p-3"
      style={{ background: t.bg, color: t.ink }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="inline-block rounded-full"
          style={{ width: 10, height: 10, background: t.dot }}
          aria-hidden
        />
        <span
          className="mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: t.ink }}
        >
          {label}
        </span>
      </div>
      <div
        className="serif text-[14.5px] font-semibold leading-tight"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
    </div>
  );
}
