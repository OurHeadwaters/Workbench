import { useAppState } from "../../lib/storage";
import {
  resolveCost,
  BASE_PAYROLL_IDS,
  PEOPLE_BUCKET_KEYS,
  type PeopleBucketKey,
} from "../../lib/budgetMath";
import { CostReviewButton } from "../../components/CostReviewButton";

// Single source of truth — the same arrays the Budget slide uses for
// its "% of base payroll" denominator (see budgetMath.ts).
const PAYROLL_IDS = BASE_PAYROLL_IDS;

// Display data + per-bucket sub-targets for each bucket, keyed off the
// same PEOPLE_BUCKET_KEYS that drive the registry id derivation in
// budgetMath. Bucket membership lives in budgetMath; only the
// labels / hints / per-bucket sub-targets live here.
const BUCKET_DISPLAY: Record<
  PeopleBucketKey,
  { label: string; hint: string; targetPct: number }
> = {
  costOfLiving: {
    label: "02 · Cost-of-living offset",
    hint: "Grocery share · fuel · winter heat · phone",
    targetPct: 7.0,
  },
  resilience: {
    label: "03 · Resilience",
    hint: "HSA · sick bank · family leave · mental-health stipend",
    targetPct: 3.25,
  },
  retention: {
    label: "04 · Retention milestones",
    hint: "RRSP step-up · anniversary cash · sabbatical · equipment transfer",
    targetPct: 2.25,
  },
  appreciation: {
    label: "05 · Appreciation",
    hint: "Crew meal · gear allowance · paid birthday · spot bonuses",
    targetPct: 1.5,
  },
  growth: {
    label: "06 · Growth",
    hint: "Tuition / certs · paid mentorship time",
    targetPct: 0.75,
  },
};

const bucketRows = PEOPLE_BUCKET_KEYS.map((key) => ({
  label: BUCKET_DISPLAY[key].label,
  hint: BUCKET_DISPLAY[key].hint,
  targetPct: BUCKET_DISPLAY[key].targetPct,
  ids: {
    a: `people.a.${key}`,
    b: `people.b.${key}`,
    c: `people.c.${key}`,
  },
}));

const DRIFT_TOLERANCE_PT = 1;

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

function PctChip({
  pct,
  target,
  bucket,
}: {
  pct: number;
  target: number;
  bucket: string;
}) {
  const drift = pct - target;
  const off = Math.abs(drift) > DRIFT_TOLERANCE_PT;
  const driftLabel =
    (drift >= 0 ? "+" : "−") + Math.abs(drift).toFixed(1) + "pt";
  const tooltip =
    bucket +
    " · target ~" +
    target.toFixed(2).replace(/\.?0+$/, "") +
    "% of base payroll · live " +
    pct.toFixed(1) +
    "% (" +
    driftLabel +
    " vs target)";
  if (!off) {
    return (
      <span
        title={tooltip}
        className="font-mono text-[0.7vw] text-muted block mt-[0.1vh] tabular-nums"
      >
        {pct.toFixed(1)}%
      </span>
    );
  }
  return (
    <span
      title={tooltip}
      className="font-mono text-[0.68vw] font-semibold inline-block mt-[0.2vh] px-[0.35vw] py-[0.05vh] rounded-[0.25vw] tabular-nums"
      style={{
        background: "rgba(184, 90, 62, 0.16)",
        color: "var(--slide-accent)",
      }}
    >
      {pct.toFixed(1)}% · {driftLabel}
    </span>
  );
}

export default function PeopleSizing() {
  const state = useAppState();
  const sumIds = (ids: readonly string[]) =>
    ids.reduce((acc, id) => acc + resolveCost(state, id), 0);
  const payrollA = sumIds(PAYROLL_IDS.A);
  const payrollB = sumIds(PAYROLL_IDS.B);
  const payrollC = sumIds(PAYROLL_IDS.C);

  const resolved = bucketRows.map((r) => ({
    label: r.label,
    hint: r.hint,
    targetPct: r.targetPct,
    a: resolveCost(state, r.ids.a),
    b: resolveCost(state, r.ids.b),
    c: resolveCost(state, r.ids.c),
  }));
  const totalA = resolved.reduce((acc, r) => acc + r.a, 0);
  const totalB = resolved.reduce((acc, r) => acc + r.b, 0);
  const totalC = resolved.reduce((acc, r) => acc + r.c, 0);

  const pct = (n: number, d: number) => (d > 0 ? (n / d) * 100 : 0);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · People &amp; Retention · 06 — Sizing per scenario
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Buckets 02–06 sized to ~15% of base payroll.
              <span className="italic font-normal text-accent"> Bucket 07 is conditional and capped.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw] font-body text-[0.95vw] text-muted leading-[1.4]">
            Per-scenario monthly employer cost.{" "}
            <span className="text-primary font-semibold">
              Every bucket, base payroll &amp; % reflect cost-review edits
            </span>{" "}
            — buckets sit in the registry alongside the salary lines they
            sit on top of.
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[1.2vw] mb-[1.4vh]"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="flex items-baseline justify-between mb-[0.6vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold">
              People &amp; Retention buckets · monthly employer cost
            </div>
            <div className="font-mono text-[0.78vw] text-muted">
              ▼ Per scenario (A · floor) (B · recommended) (C · scale)
            </div>
          </div>
          <table
            className="w-full text-[0.92vw] font-body"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="text-left text-muted font-mono uppercase tracking-[0.16em] text-[0.72vw]">
                <th className="py-[0.4vh] pr-[0.6vw] w-[40%]">Bucket</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[14%]">A · $60k</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[14%]">B · $90k</th>
                <th className="py-[0.4vh] pr-[0.6vw] text-right w-[14%]">C · $125k</th>
                <th className="py-[0.4vh] text-muted text-[0.72vw] w-[18%]">Examples</th>
              </tr>
            </thead>
            <tbody>
              {resolved.map((r) => (
                <tr
                  key={r.label}
                  className="border-t align-top"
                  style={{ borderColor: "var(--slide-rule)" }}
                >
                  <td className="py-[0.4vh] pr-[0.6vw] text-text">
                    <div className="font-semibold">{r.label}</div>
                  </td>
                  <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono">
                    {fmt(r.a)}
                    <PctChip
                      pct={pct(r.a, payrollA)}
                      target={r.targetPct}
                      bucket={r.label}
                    />
                  </td>
                  <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono">
                    {fmt(r.b)}
                    <PctChip
                      pct={pct(r.b, payrollB)}
                      target={r.targetPct}
                      bucket={r.label}
                    />
                  </td>
                  <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono">
                    {fmt(r.c)}
                    <PctChip
                      pct={pct(r.c, payrollC)}
                      target={r.targetPct}
                      bucket={r.label}
                    />
                  </td>
                  <td className="py-[0.4vh] text-muted text-[0.78vw] leading-[1.25]">
                    <div>{r.hint}</div>
                    <div className="text-[0.7vw] text-muted/80 mt-[0.1vh]">
                      Target ~{r.targetPct.toFixed(2).replace(/\.?0+$/, "")}% of
                      base payroll
                    </div>
                  </td>
                </tr>
              ))}
              <tr
                className="border-t-2"
                style={{ borderColor: "var(--slide-primary)" }}
              >
                <td className="py-[0.5vh] pr-[0.6vw] font-display text-primary font-semibold text-[1vw]">
                  Total · buckets 02–06 / mo
                </td>
                <td className="py-[0.5vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[1vw]">
                  {fmt(totalA)}
                </td>
                <td className="py-[0.5vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[1vw]">
                  {fmt(totalB)}
                </td>
                <td className="py-[0.5vh] pr-[0.6vw] text-right font-display text-primary font-semibold text-[1vw]">
                  {fmt(totalC)}
                </td>
                <td />
              </tr>
              <tr
                className="border-t"
                style={{ borderColor: "var(--slide-rule)" }}
              >
                <td className="py-[0.4vh] pr-[0.6vw] text-muted">
                  Base payroll / mo (loaded)
                </td>
                <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono text-muted">
                  {fmt(payrollA)}
                </td>
                <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono text-muted">
                  {fmt(payrollB)}
                </td>
                <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono text-muted">
                  {fmt(payrollC)}
                </td>
                <td className="py-[0.4vh] text-muted text-[0.78vw] leading-[1.25]">
                  Sum of role lines on Budget · live
                </td>
              </tr>
              <tr
                className="border-t"
                style={{ borderColor: "var(--slide-rule)" }}
              >
                <td className="py-[0.4vh] pr-[0.6vw] text-accent font-semibold">
                  % of base payroll
                </td>
                <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono text-accent font-semibold">
                  {pct(totalA, payrollA).toFixed(1)}%
                </td>
                <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono text-accent font-semibold">
                  {pct(totalB, payrollB).toFixed(1)}%
                </td>
                <td className="py-[0.4vh] pr-[0.6vw] text-right font-mono text-accent font-semibold">
                  {pct(totalC, payrollC).toFixed(1)}%
                </td>
                <td className="py-[0.4vh] text-muted text-[0.78vw] leading-[1.25]">
                  Target ~15%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-[1.2vw] flex-1 min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.2vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-muted mb-[0.4vh]">
              Bucket 07 · Variable upside (conditional)
            </div>
            <div className="font-display text-[1.4vw] text-primary font-medium leading-tight mb-[0.6vh]">
              Capped at ~8–12% of any individual's annual comp in a good year.
            </div>
            <div className="font-body text-[0.85vw] text-text leading-[1.4]">
              Crew-wide profit share + outcome milestones + discretionary
              judgment bonus. Zero in a flat year — variable pay never
              becomes survival pay.
            </div>
          </div>
          <div
            className="rounded-[0.4vw] p-[1.2vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-muted mb-[0.4vh]">
              The principle, restated
            </div>
            <div className="font-display text-[1.4vw] text-primary font-medium leading-tight mb-[0.6vh]">
              ~15% on top of payroll buys a 10-year crew.
            </div>
            <div className="font-body text-[0.85vw] text-text leading-[1.4]">
              The arithmetic of a single $5k raise per person buys a year
              of restless calm. The same dollars distributed across the
              waterfall buy a decade of stay.
            </div>
          </div>
          <div
            className="rounded-[0.4vw] p-[1.2vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.78vw] mb-[0.4vh]"
              style={{ color: "#e9c8a8" }}
            >
              Where it sits in the budget
            </div>
            <div className="font-display text-[1.4vw] font-medium leading-tight mb-[0.6vh]">
              Inside cost basis. Visible. Audited.
            </div>
            <div className="font-body text-[0.85vw] leading-[1.4] opacity-95">
              Each bucket has an owner and an annual receipts audit. If a
              bucket isn't spent, it carries forward — never reclassified
              into margin. The crew can read the line. So can the CFO.
            </div>
          </div>
        </div>

        <div className="mt-[1vh] font-body text-[0.78vw] text-muted leading-[1.35]">
          Bucket figures are illustrative monthly sizing — every cell is
          a registry entry, so the practitioner and CFO can revise any
          bucket × scenario in cost review and the totals + % column
          recompute live alongside the role lines on the Budget slide.
        </div>
      </div>
    </div>
  );
}
