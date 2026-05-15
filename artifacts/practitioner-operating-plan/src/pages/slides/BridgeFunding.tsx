/**
 * BridgeFunding.tsx — "How to fund the $41k bridge" slide
 *
 * All dollar figures are imported from @/data/budgetScenarios.
 * Do NOT hardcode any cost-basis or bridge numbers in this file.
 */

import { HALF_LOAD_LINES, HALF_LOAD_TOTAL, BRIDGE, fmt, fmtK } from "@/data/budgetScenarios";

const OPTIONS = [
  {
    id: "mob",
    tag: "Recommended",
    title: "Mobilisation payment",
    detail: "Negotiate one month's operating cost (~$41k) payable before work begins, held in trust and drawn down as invoices clear.",
    cost: "No interest — zero financing cost.",
    risk: "Contractor must say yes upfront; non-starter if procurement rules prohibit advance payments.",
    who: "Contractor's CFO",
    highlight: true,
  },
  {
    id: "loc",
    tag: "Strong backup",
    title: "Operating line of credit",
    detail: "Open a $50k–$60k secured business line of credit with the agency's bank, using the signed contract as the primary collateral.",
    cost: "Prime + 1–2% on drawn balance (~$200–$400/mo while drawn). Closed once M3 invoice clears.",
    risk: "Requires 2–3 weeks to underwrite; personal guarantee likely needed if the agency is early-stage.",
    who: "Agency's bank or credit union",
    highlight: false,
  },
  {
    id: "milestone",
    tag: "Structural option",
    title: "Front-loaded milestone billing",
    detail: "Restructure the contract so a milestone payment (~$41k) triggers on project kick-off rather than net-60, with subsequent invoices returning to the standard cycle.",
    cost: "No financing cost. Reduces the net-60 exposure permanently for month 1.",
    risk: "Requires contract amendment; some procurement teams won't accept milestone billing on a retainer.",
    who: "Contractor's contract officer",
    highlight: false,
  },
  {
    id: "owner",
    tag: "Last resort",
    title: "Owner / family short-term loan",
    detail: "Practitioner or agency owner covers the gap personally (or via a family loan) at documented market rate, repaid at M3 when the first net-60 invoice clears.",
    cost: "Opportunity cost of ~45 days of capital. If documented as an arm's-length loan, CRA-compliant.",
    risk: "Mixes personal and business exposure. Only appropriate if LOC and mobilisation payment both fail.",
    who: "Practitioner / agency owner",
    highlight: false,
  },
];

const HALF_LOAD_ROWS = [
  { label: "Practitioner",       value: HALF_LOAD_LINES.practitioner,      note: "$150/hr · 40 hrs/wk" },
  { label: "Tyler subcontract",  value: HALF_LOAD_LINES.tylerSubcontract,  note: "$70/hr through Tyler's business" },
  { label: "IT / Support",       value: HALF_LOAD_LINES.itSupport,         note: "Partial allocation, month 1" },
  { label: "Overhead",           value: HALF_LOAD_LINES.overhead,          note: "Operating overhead" },
];

export default function BridgeFunding() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[1.8vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Day-one bridge — funding options
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Half-load ramp · {fmtK(HALF_LOAD_TOTAL)}/mo · net-60 cycle
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.6vw] leading-[1] tracking-tight text-paper mb-[0.5vh]">
          Where does the {fmtK(HALF_LOAD_TOTAL)} come from?
        </h1>
        <div className="font-display italic text-[1.2vw] text-muted mb-[2.5vh] max-w-[70vw]">
          At half-load ramp (practitioner + Tyler only), month-one exposure is{" "}
          <span className="text-paper font-semibold not-italic">{fmt(HALF_LOAD_TOTAL)}</span> — one month of operating cost before
          the first net-60 invoice clears. This is a subset of the full Scenario B bridge ({fmtK(BRIDGE.b)});
          funding the ramp first is the practical day-one ask. Four honest options — one clear recommendation.
        </div>

        <div className="flex-1 grid grid-cols-[1fr_1.8fr] gap-[2.5vw] min-h-0">

          {/* Left: cost breakdown */}
          <div className="flex flex-col gap-[1.5vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] text-muted mb-[0.5vh]">
              Month-1 half-load cost basis
            </div>
            <div className="rounded-[6px] border border-rule bg-paper overflow-hidden">
              {HALF_LOAD_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between px-[1.2vw] py-[0.9vh]"
                  style={{ borderBottom: i < HALF_LOAD_ROWS.length - 1 ? "1px solid var(--slide-rule)" : undefined }}
                >
                  <div>
                    <div className="font-body text-[0.88vw] text-primary font-medium">{row.label}</div>
                    <div className="font-mono text-[0.65vw] text-muted">{row.note}</div>
                  </div>
                  <div className="font-display font-semibold text-[1.05vw] text-paper tabular-nums">
                    {fmt(row.value)}
                  </div>
                </div>
              ))}
              <div
                className="flex items-center justify-between px-[1.2vw] py-[1vh]"
                style={{ borderTop: "1.5px solid var(--slide-rule)", background: "rgba(31,61,46,0.06)" }}
              >
                <div className="font-mono uppercase tracking-[0.14em] text-[0.72vw] text-primary font-semibold">
                  Total / month 1
                </div>
                <div className="font-display font-semibold text-[1.3vw] text-paper tabular-nums">
                  {fmt(HALF_LOAD_TOTAL)}
                </div>
              </div>
            </div>

            {/* Recovery note */}
            <div className="rounded-[6px] border border-rule px-[1.2vw] py-[1.2vh]" style={{ background: "rgba(180,210,170,0.08)" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw] text-muted mb-[0.5vh]">
                Recovery timeline
              </div>
              <div className="font-body text-[0.82vw] text-paper leading-[1.45]">
                First net-60 invoice clears at <strong>M3</strong>.
                Bridge is fully retired once the M3 payment lands —
                roughly <strong>45 days</strong> of float required.
              </div>
            </div>
          </div>

          {/* Right: funding options */}
          <div className="grid grid-cols-2 gap-[1.2vw] min-h-0">
            {OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="rounded-[6px] border flex flex-col px-[1.3vw] py-[1.3vh]"
                style={{
                  borderColor: opt.highlight ? "var(--slide-accent)" : "var(--slide-rule)",
                  background: opt.highlight ? "rgba(184,90,62,0.07)" : "transparent",
                }}
              >
                <div className="flex items-center justify-between mb-[0.6vh]">
                  <div
                    className="font-mono uppercase tracking-[0.16em] text-[0.62vw] font-semibold"
                    style={{ color: opt.highlight ? "var(--slide-accent)" : "var(--slide-muted)" }}
                  >
                    {opt.tag}
                  </div>
                </div>
                <div
                  className="font-display font-semibold text-[1.05vw] leading-[1.2] mb-[0.7vh]"
                  style={{ color: opt.highlight ? "var(--slide-accent)" : "var(--slide-paper)" }}
                >
                  {opt.title}
                </div>
                <div className="font-body text-[0.78vw] text-muted leading-[1.4] mb-[0.8vh] flex-1">
                  {opt.detail}
                </div>
                <div className="flex flex-col gap-[0.3vh] border-t pt-[0.6vh]" style={{ borderColor: "var(--slide-rule)" }}>
                  <div className="font-body text-[0.72vw] text-muted leading-[1.35]">
                    <span className="font-semibold text-paper">Cost:</span> {opt.cost}
                  </div>
                  <div className="font-body text-[0.72vw] text-muted leading-[1.35]">
                    <span className="font-semibold text-paper">Risk:</span> {opt.risk}
                  </div>
                  <div className="font-body text-[0.72vw] leading-[1.35]" style={{ color: "var(--slide-accent)" }}>
                    <span className="font-semibold">Who says yes:</span> {opt.who}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer recommendation bar */}
        <div
          className="mt-[2vh] rounded-[6px] px-[2vw] py-[1.2vh] flex items-center gap-[1.5vw]"
          style={{ background: "rgba(184,90,62,0.12)", border: "1px solid var(--slide-accent)" }}
        >
          <div className="font-mono uppercase tracking-[0.16em] text-[0.72vw] text-accent whitespace-nowrap">
            Default recommendation
          </div>
          <div className="w-[1px] h-[2vh] bg-accent opacity-30" />
          <div className="font-body text-[0.88vw] text-paper leading-[1.4]">
            Negotiate a <strong>mobilisation payment equal to one month's operating cost ({fmt(HALF_LOAD_TOTAL)})</strong> before
            work begins. Zero financing cost, fully recoverable at M3, and it tests whether the
            contractor is genuinely committed to the engagement before the practitioner's team is on the ground.
          </div>
        </div>

      </div>
    </div>
  );
}
