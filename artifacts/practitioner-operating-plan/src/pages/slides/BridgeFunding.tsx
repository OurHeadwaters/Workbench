/**
 * BridgeFunding.tsx — Phase 1 mobilisation / bridge slide
 *
 * Phase 1 is $28,000 flat. The key funding question is:
 * can Phase 1 be invoiced with a mobilisation payment up front?
 */

import { PHASE_COSTS, fmt } from "@/data/budgetScenarios";

const phase1 = PHASE_COSTS[0];

const OPTIONS = [
  {
    id: "mob",
    tag: "Recommended",
    title: "50% up front · 50% on delivery",
    detail: "Phase 1 is scoped and priced. Half on signing, half when the plan is delivered. Covers practitioner time while work is in progress.",
    cost: "No financing cost.",
    risk: "Contractor must agree to milestone billing.",
    who: "Contractor's CFO",
    highlight: true,
  },
  {
    id: "full",
    tag: "Simple",
    title: "Full fee on delivery",
    detail: `${fmt(phase1.phase.feeFlat!)} payable within 30 days of Phase 1 deliverable package being submitted.`,
    cost: "Practitioner carries ~6 weeks of float.",
    risk: "Practitioner cash exposure during the engagement.",
    who: "Contractor's contract officer",
    highlight: false,
  },
  {
    id: "grant",
    tag: "Parallel track",
    title: "Grant pre-approval before Phase 1",
    detail: "Confirm 807 grant or other funder approval before Phase 1 begins, so Phase 2 funding is already in motion.",
    cost: "No additional cost — just lead time.",
    risk: "Delays start if approval takes longer than expected.",
    who: "Band council + 807 / funder",
    highlight: false,
  },
];

export default function BridgeFunding() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-center justify-between mb-[1.8vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Phase 1 — payment structure
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            {fmt(phase1.phase.feeFlat!)} flat · 6 weeks · full handoff
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.6vw] leading-[1] tracking-tight text-paper mb-[0.5vh]">
          How does Phase 1 get paid?
        </h1>
        <div className="font-display italic text-[1.2vw] text-muted mb-[2.5vh] max-w-[70vw]">
          Phase 1 is a fixed-fee engagement — {fmt(phase1.phase.feeFlat!)} for the full plan, delivered in 6 weeks.
          The question is structure: when does money move?
        </div>

        <div className="flex-1 grid grid-cols-[1fr_1.8fr] gap-[2.5vw] min-h-0">
          <div className="flex flex-col gap-[1.5vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.72vw] text-muted mb-[0.5vh]">
              Phase 1 cost to deliver
            </div>
            <div className="rounded-[6px] border border-rule bg-paper overflow-hidden">
              {[
                { label: "Labour", value: phase1.laborCost, note: `${phase1.phase.practDays} days × 7 hrs × $175/hr` },
                { label: "Travel", value: phase1.travelCost, note: `${phase1.phase.travelVisits} site visit` },
              ].map((row, i, arr) => (
                <div key={row.label} className="flex items-baseline justify-between px-[1.2vw] py-[0.9vh]"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--slide-rule)" : undefined }}>
                  <div>
                    <div className="font-body text-[0.88vw] text-primary font-medium">{row.label}</div>
                    <div className="font-mono text-[0.65vw] text-muted">{row.note}</div>
                  </div>
                  <div className="font-display font-semibold text-[1.05vw] text-paper tabular-nums">{fmt(row.value)}</div>
                </div>
              ))}
              <div className="flex items-center justify-between px-[1.2vw] py-[1vh]"
                style={{ borderTop: "1.5px solid var(--slide-rule)", background: "rgba(31,61,46,0.06)" }}>
                <div className="font-mono uppercase tracking-[0.14em] text-[0.72vw] text-primary font-semibold">Total cost</div>
                <div className="font-display font-semibold text-[1.3vw] text-paper tabular-nums">{fmt(phase1.totalCost)}</div>
              </div>
              <div className="flex items-center justify-between px-[1.2vw] py-[1vh]"
                style={{ borderTop: "1.5px solid var(--slide-rule)", background: "rgba(184,90,62,0.07)" }}>
                <div className="font-mono uppercase tracking-[0.14em] text-[0.72vw] text-accent font-semibold">Client fee</div>
                <div className="font-display font-semibold text-[1.3vw] text-accent tabular-nums">{fmt(phase1.phase.feeFlat!)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[1.2vw] min-h-0">
            {OPTIONS.map((opt) => (
              <div key={opt.id} className="rounded-[6px] border flex flex-col px-[1.3vw] py-[1.3vh]"
                style={{ borderColor: opt.highlight ? "var(--slide-accent)" : "var(--slide-rule)", background: opt.highlight ? "rgba(184,90,62,0.07)" : "transparent" }}>
                <div className="flex items-center justify-between mb-[0.4vh]">
                  <div className="font-mono uppercase tracking-[0.16em] text-[0.62vw] font-semibold"
                    style={{ color: opt.highlight ? "var(--slide-accent)" : "var(--slide-muted)" }}>{opt.tag}</div>
                </div>
                <div className="font-display font-semibold text-[1vw] leading-[1.2] mb-[0.5vh]"
                  style={{ color: opt.highlight ? "var(--slide-accent)" : "var(--slide-paper)" }}>{opt.title}</div>
                <div className="font-body text-[0.76vw] text-muted leading-[1.4] mb-[0.6vh] flex-1">{opt.detail}</div>
                <div className="flex flex-col gap-[0.25vh] border-t pt-[0.5vh]" style={{ borderColor: "var(--slide-rule)" }}>
                  <div className="font-body text-[0.7vw] text-muted"><span className="font-semibold text-paper">Cost:</span> {opt.cost}</div>
                  <div className="font-body text-[0.7vw] text-muted"><span className="font-semibold text-paper">Risk:</span> {opt.risk}</div>
                  <div className="font-body text-[0.7vw]" style={{ color: "var(--slide-accent)" }}><span className="font-semibold">Who says yes:</span> {opt.who}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
