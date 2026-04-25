import { useBudgetTotals } from "../../lib/budgetMath";
import { CostReviewButton } from "../../components/CostReviewButton";

const fmtK1 = (n: number) =>
  "$" + (n / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "k";

export default function Closing() {
  const { askReco, costBasisB, reinvestB, reinvestBPct, bridgeB } =
    useBudgetTotals();

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div
        className="absolute -right-[10vw] -top-[10vh] w-[45vw] h-[45vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.18)" }}
      />
      <div
        className="absolute -left-[6vw] bottom-[-8vh] w-[35vw] h-[35vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.05)" }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-85">
              IV · 04 — Naming the deal
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-65">
            In the language we agreed on
          </div>
        </div>

        <div className="max-w-[80vw]">
          <h1
            className="font-display text-[5.4vw] leading-[1.02] tracking-tight font-medium mb-[3vh]"
            style={{ textWrap: "balance" }}
          >
            No free lunches.
            <span className="block italic font-normal" style={{ color: "#e9c8a8" }}>
              Capital deployed properly.
            </span>
            <span className="block">Value out the other end — for Deer Lake first, the next reserve next.</span>
          </h1>

          <div
            className="font-body text-[1.5vw] leading-[1.55] opacity-95 max-w-[72vw] border-l pl-[1.6vw]"
            style={{ borderColor: "#e9c8a8" }}
          >
            <span className="font-semibold" style={{ color: "#e9c8a8" }}>
              ${askReco.toLocaleString("en-US")} a month
            </span>
            , twelve-month engagement, reviewed at month six.{" "}
            <span className="font-semibold">~{fmtK1(costBasisB)} cost basis</span> — the
            team that delivers the work, plus the Dad-warehouse aggregation
            hub.{" "}
            <span className="font-semibold">~{fmtK1(reinvestB)} reinvestment</span>{" "}
            (~{reinvestBPct.toFixed(0)}%) —
            tech infrastructure, training, and the seed for pilot #2. Audited
            annually against savings delivered to Deer Lake. Day-one bridge
            ask: <span className="font-semibold">~${Math.round(bridgeB / 1000)}k</span>.
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="max-w-[58vw]">
            <div
              className="h-[1px] mb-[2vh] w-[18vw]"
              style={{ background: "rgba(244,237,224,0.45)" }}
            />
            <div
              className="font-display italic text-[1.7vw] leading-[1.35] opacity-95"
              style={{ textWrap: "balance" }}
            >
              "Don't short-change yourself." This is what not short-changing
              looks like — costed, structured, accountable, and built to
              outlast this contract.
            </div>
            <div
              className="mt-[2vh] font-mono uppercase tracking-[0.25em] text-[0.95vw] opacity-70"
              style={{ color: "#e9c8a8" }}
            >
              Reviewed over the next two weeks · Named when you're home from Deer Lake
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] opacity-70 mb-[0.8vh]">
              For the contractor
            </div>
            <div className="font-display text-[1.8vw] leading-tight">
              Practitioner Operating Plan
              <div className="font-body font-light text-[1vw] opacity-80 mt-[0.4vh]">
                v2 · Spring 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
