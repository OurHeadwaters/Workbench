import { useCostValue } from "../../lib/costReview";
import { CostReviewButton } from "../../components/CostReviewButton";

export default function RoleBookkeeper() {
  const rate = useCostValue("rate.bookkeeper");
  const monthly = useCostValue("role.monthly.bookkeeper");
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · Role 02 — Bookkeeper / Agency Admin
            </div>
            <h2
              className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              The back office.
              <span className="italic font-normal text-accent"> Built once, used for years.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
              Engagement
            </div>
            <div className="font-display text-[1.7vw] text-primary leading-tight font-medium">
              Remote · part-time
            </div>
            <div className="font-body text-[1.05vw] text-muted mt-[0.5vh] leading-[1.4]">
              The agency's first hired role — paid for by this contract, used
              by every contract after.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[1.4vw] min-h-0">
          <div
            className="col-span-7 rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[1vw] text-accent font-semibold mb-[1.5vh]">
              What this takes off my plate
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.2vw] leading-[1.45] text-text">
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  Invoicing on a schedule, not on a Sunday night when I
                  remember.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  Contracts: drafting, tracking, renewal calendar.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  CRA: HST, payroll remittances, year-end. No surprises in
                  March.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="text-accent font-semibold w-[1.2vw] shrink-0">
                  →
                </div>
                <div>
                  Reconciliation. The books are clean every month, not every
                  fiscal year.
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-5 flex flex-col gap-[1.2vw]">
            <div
              className="rounded-[0.4vw] p-[1.6vw]"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
                Hours
              </div>
              <div className="font-display text-[2.6vw] text-primary font-medium leading-none">
                10 / week
              </div>
              <div className="font-body text-[1.05vw] text-muted mt-[0.6vh] leading-[1.4]">
                Heavier at month-end and quarter-end. Light otherwise.
              </div>
            </div>

            <div
              className="rounded-[0.4vw] p-[1.6vw]"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[0.5vh]">
                Rate
              </div>
              <div className="font-display text-[2.6vw] text-primary font-medium leading-none">
                ${rate} / hr
              </div>
              <div className="font-body text-[1.05vw] text-muted mt-[0.6vh] leading-[1.4]">
                Capable bookkeeper with small-business experience — not a
                discount résumé.
              </div>
            </div>

            <div
              className="rounded-[0.4vw] p-[1.6vw]"
              style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.95vw] mb-[0.5vh]"
                style={{ color: "#e9c8a8" }}
              >
                Monthly
              </div>
              <div className="font-display text-[2.8vw] font-medium leading-none">
                ~${monthly.toLocaleString("en-US")}
              </div>
              <div className="font-body text-[1.05vw] mt-[0.6vh] leading-[1.4] opacity-85">
                Cheapest insurance against the kind of mistake that costs a year
                of credibility.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
