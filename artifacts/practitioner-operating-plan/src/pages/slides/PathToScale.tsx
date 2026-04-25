import { useBudgetTotals } from "../../lib/budgetMath";
import { CostReviewButton } from "../../components/CostReviewButton";

type Stage = {
  year: string;
  headline: string;
  body: string;
  cost: string;
};

// Annualised costs are derived from the live recommended ask so an edit
// to that single number on Budget restages this whole slide.
function buildStages(askReco: number): Stage[] {
  const annualMillions = (n: number) =>
    "~$" + (n / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 }) + "M";
  const yr1 = askReco * 12;
  const yr2 = askReco * 12 * 2;
  const yr3 = askReco * 12 * 5;
  return [
    {
      year: "Year 1",
      headline: "Deer Lake pilot",
      body: "Stand up the team, ship all six modules, deliver the contract, document everything as we go. The transparency stack is live by M9.",
      cost: `1 contract · ${annualMillions(yr1)} annualised`,
    },
    {
      year: "Year 2",
      headline: "Pilot #2 — second reserve",
      body: "Marginal cost of the second contract is mostly just the practitioner's time. Back office, tech infrastructure, hiring runbook and accountability framework are already built. Pilot #2 doesn't wait for grants — it draws from year-1 reinvestment reserve.",
      cost: `2 concurrent contracts · ${annualMillions(yr2)} annualised`,
    },
    {
      year: "Year 3",
      headline: "3–5 contracts running concurrently",
      body: "The agency is the deliverable. Two CD Associates run engagement-side; IT/Tech and senior engineer run the infrastructure. Each pilot ships the same six modules with reserve-specific adaptations.",
      cost: `Up to 5 contracts · ${annualMillions(yr3)}+ annualised`,
    },
    {
      year: "Year 5",
      headline: "The template is open",
      body: "Other community development practitioners run their own pilots with the playbook — on our agency or independent. Reserves no longer have to invent the model from scratch. Transparency tooling is the new baseline expectation, not a luxury.",
      cost: "Open template · scale uncapped",
    },
  ];
}

export default function PathToScale() {
  const { askReco } = useBudgetTotals();
  const stages = buildStages(askReco);
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div className="absolute top-[1vh] right-[1.4vw] z-20">
        <CostReviewButton variant="slide-corner" />
      </div>
      <div
        className="absolute -right-[10vw] top-[10vh] w-[40vw] h-[40vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.16)" }}
      />
      <div
        className="absolute -left-[6vw] bottom-[-6vh] w-[28vw] h-[28vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.05)" }}
      />

      <div className="relative z-10 w-full h-full px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div
              className="font-mono uppercase tracking-[0.28em] text-[1vw] mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              V · 03 — The path
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight font-medium"
              style={{ textWrap: "balance" }}
            >
              Deer Lake earns it.
              <span className="italic font-normal block opacity-90" style={{ color: "#e9c8a8" }}>
                Then so does every reserve.
              </span>
            </h2>
          </div>
          <div
            className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] leading-[1.4] opacity-85"
          >
            Five-year arc. The math compounds because the second pilot inherits
            five of six modules. The reserve doesn't pay for what we already
            built for someone else.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-[1.2vw] min-h-0">
          {stages.map((s, i) => (
            <div
              key={s.year}
              className="rounded-[0.4vw] p-[1.4vw] flex flex-col relative"
              style={{ background: "rgba(244,237,224,0.08)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold mb-[0.8vh]"
                style={{ color: "#e9c8a8" }}
              >
                {s.year}
              </div>
              <div
                className="font-display text-[1.5vw] leading-tight font-medium mb-[1vh]"
                style={{ color: "#f4ede0" }}
              >
                {s.headline}
              </div>
              <div className="font-body text-[0.95vw] leading-[1.5] opacity-95 flex-1">
                {s.body}
              </div>
              <div
                className="mt-[1vh] pt-[0.8vh] border-t font-mono text-[0.78vw] leading-[1.35]"
                style={{ borderColor: "rgba(244,237,224,0.25)", color: "#e9c8a8" }}
              >
                {s.cost}
              </div>
              {i < stages.length - 1 && (
                <div
                  className="absolute right-[-0.9vw] top-[50%] w-[1.2vw] h-[1px] opacity-50"
                  style={{ background: "#e9c8a8" }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-[2vh] pt-[1.5vh] border-t flex items-end justify-between"
          style={{ borderColor: "rgba(244,237,224,0.25)" }}
        >
          <div className="max-w-[64vw]">
            <div
              className="font-display text-[2.2vw] leading-[1.15] font-medium"
              style={{ textWrap: "balance" }}
            >
              The reserve needs transparency right now. They need guidance and
              support.
              <span className="italic font-normal block mt-[0.6vh]" style={{ color: "#e9c8a8" }}>
                We have the tools to deliver at scale — with Deer Lake as the
                pilot.
              </span>
            </div>
          </div>
          <div className="text-right shrink-0 pl-[3vw]">
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.85vw] mb-[0.4vh]"
              style={{ color: "#e9c8a8" }}
            >
              The closing commitment
            </div>
            <div className="font-display text-[1.4vw] leading-tight">
              Practitioner Operating Plan
              <div className="font-body font-light text-[0.92vw] opacity-80 mt-[0.3vh]">
                v2 · Spring 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
