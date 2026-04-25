import { useBudgetTotals } from "../../lib/budgetMath";
import { useCostValue } from "../../lib/costReview";
import { CostReviewButton } from "../../components/CostReviewButton";

export default function CaseForTeam() {
  const { costBasisA, saltBenchAnnual } = useBudgetTotals();
  const benchRate = useCostValue("rate.benchSeat");
  const fmtKMo = (n: number) => "~$" + Math.round(n / 1000) + "k/mo";
  const fmtKYr = (n: number) => "~$" + Math.round(n / 1000) + "k/yr";
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VI · 02 — The case for the team
            </div>
            <h2
              className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              A team isn't a luxury.
              <span className="italic font-normal text-accent"> It's the responsible structure.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.15vw] text-muted leading-[1.4]">
            One phone, one inbox, one tired person is how every Northern
            contract you've ever heard of got into trouble. We're not doing
            that on purpose.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[1vh]">
              The "lean" version (no team)
            </div>
            <div className="font-display text-[1.9vw] leading-tight text-primary font-medium mb-[1.5vh]">
              Single point of failure on every line.
            </div>
            <div className="space-y-[1.2vh] font-body text-[1.1vw] text-text leading-[1.45]">
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">×</div><div>Ops failure when one person has a flu, a kid, or a flat tire.</div></div>
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">×</div><div>Books done in arrears — meaning every CRA touch is a fire.</div></div>
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">×</div><div>Phone always answered, so nothing else gets done.</div></div>
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">×</div><div>Burnout at month nine. You inherit the cleanup, not the win.</div></div>
            </div>
            <div
              className="mt-[2vh] pt-[1.5vh] border-t font-mono uppercase tracking-[0.22em] text-[0.9vw] text-muted"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              Saves {fmtKMo(costBasisA)} on paper. Costs the contract.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.95vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              The structured version (this plan)
            </div>
            <div className="font-display text-[1.9vw] leading-tight font-medium mb-[1.5vh]">
              Redundancy where it matters; lean where it doesn't.
            </div>
            <div className="space-y-[1.2vh] font-body text-[1.1vw] leading-[1.45] opacity-95">
              <div className="flex gap-[0.8vw]"><div style={{ color: "#e9c8a8" }} className="w-[1vw]">✓</div><div>Two people who can answer the phone in Dryden, not one.</div></div>
              <div className="flex gap-[0.8vw]"><div style={{ color: "#e9c8a8" }} className="w-[1vw]">✓</div><div>Books reconciled monthly. CRA filings boring, on time.</div></div>
              <div className="flex gap-[0.8vw]"><div style={{ color: "#e9c8a8" }} className="w-[1vw]">✓</div><div>Practitioner free to do the actual strategic work the contract pays for.</div></div>
              <div className="flex gap-[0.8vw]"><div style={{ color: "#e9c8a8" }} className="w-[1vw]">✓</div><div>A 4-seat depot bench (T4A, ${benchRate}/hr, ~600 hrs/yr) so the salt line never lands on the founder. Costed {fmtKYr(saltBenchAnnual)} in the salt P&amp;L, not invisible.</div></div>
              <div className="flex gap-[0.8vw]"><div style={{ color: "#e9c8a8" }} className="w-[1vw]">✓</div><div>The team that holds Deer Lake is the team that takes contract two.</div></div>
            </div>
            <div
              className="mt-[2vh] pt-[1.5vh] border-t font-mono uppercase tracking-[0.22em] text-[0.9vw]"
              style={{ borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }}
            >
              Costs {fmtKMo(costBasisA)} agency + {fmtKYr(saltBenchAnnual)} bench. Buys the contract — and the next one.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
