import { useCostValue } from "../../lib/costReview";
import { CostReviewButton } from "../../components/CostReviewButton";

export default function RoleHandyman() {
  const rate = useCostValue("rate.handyman");
  const monthly = useCostValue("role.monthly.handyman");
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · Role 06 — Handyman-Housekeeper combo
            </div>
            <h2
              className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Practical first.
              <span className="italic font-normal text-accent"> Intentional second.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div
              className="inline-block font-mono uppercase tracking-[0.22em] text-[0.9vw] text-bg px-[0.8vw] py-[0.3vh] rounded-[0.2vw] mb-[1vh]"
              style={{ background: "var(--slide-accent)" }}
            >
              Consider · don't commit
            </div>
            <div className="font-body text-[1.1vw] text-muted leading-[1.4]">
              On the plan as an option. Goes live only if the right person
              clears every check below.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[1.4vw] min-h-0">
          <div
            className="col-span-4 rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1vh]">
              The practical case
            </div>
            <div className="font-display text-[1.6vw] leading-tight text-primary font-medium mb-[1vh]">
              Small jobs pile up.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              Storm windows, eavestroughs, the leaky tap, the snow that doesn't
              shovel itself, the dead bulb in the high fixture. Five hours a
              week of the things that erode a Saturday otherwise.
            </div>
          </div>

          <div
            className="col-span-4 rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1vh]">
              The intentional case
            </div>
            <div className="font-display text-[1.6vw] leading-tight text-primary font-medium mb-[1vh]">
              Positive male presence around the boys.
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.45]">
              A steady, capable adult man in the orbit of the house — fixing
              real things, modelling competence and patience. Worth naming
              honestly; worth being careful about.
            </div>
          </div>

          <div
            className="col-span-4 rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.95vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              Vetting · non-negotiable
            </div>
            <div className="font-display text-[1.6vw] leading-tight font-medium mb-[1vh]">
              References, paid trial, never alone with the kids early on.
            </div>
            <div className="font-body text-[1.05vw] leading-[1.45] opacity-90">
              Two professional references and one personal. Two paid trial
              weeks before any commitment. No solo childcare until trust is
              earned over months — this role is around the kids, not for the
              kids.
            </div>
          </div>
        </div>

        <div
          className="mt-[3vh] grid grid-cols-3 gap-[1.4vw]"
        >
          <div
            className="rounded-[0.4vw] p-[1.4vw]"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-muted mb-[0.4vh]">
              Hours
            </div>
            <div className="font-display text-[2.2vw] text-primary font-medium leading-none">
              5 / week
            </div>
          </div>
          <div
            className="rounded-[0.4vw] p-[1.4vw]"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-muted mb-[0.4vh]">
              Rate
            </div>
            <div className="font-display text-[2.2vw] text-primary font-medium leading-none">
              ${rate} / hr
            </div>
          </div>
          <div
            className="rounded-[0.4vw] p-[1.4vw]"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.9vw] mb-[0.4vh]"
              style={{ color: "#e9c8a8" }}
            >
              Monthly · if engaged
            </div>
            <div className="font-display text-[2.2vw] font-medium leading-none">
              ~${monthly.toLocaleString("en-US")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
