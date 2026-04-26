export default function PeoplePrinciples() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · People &amp; Retention · 01 — Two governing principles
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Two principles.
              <span className="italic font-normal text-accent"> Everything else is a downstream choice.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            Wages alone don't keep capable people in the north.{" "}
            <span className="text-primary font-semibold">
              Cost-of-living attack and life-event protection do.
            </span>{" "}
            The buckets that follow are downstream of these two rules.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.9vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              Principle 01
            </div>
            <div className="font-display text-[2vw] leading-tight font-medium mb-[1.2vh]">
              Direct attack on cost-of-living
              <span className="block italic font-normal opacity-90 mt-[0.4vh]">
                beats wage bumps for felt-value and retention.
              </span>
            </div>
            <div className="font-body text-[1.05vw] leading-[1.5] opacity-95 mb-[1.5vh]">
              A $200/mo grocery share felt-values at $400 to a household
              already paying $1,400 at the only store in town. A $200 raise
              gets eaten by inflation, taxed, and never noticed.{" "}
              <span className="font-semibold" style={{ color: "#e9c8a8" }}>
                The dollar I spend on the cost of their life is worth more
                to them than the dollar I add to their cheque.
              </span>
            </div>
            <div
              className="mt-auto pt-[1.2vh] border-t font-body text-[0.95vw] leading-[1.45] opacity-95"
              style={{ borderColor: "rgba(244,237,224,0.3)" }}
            >
              And the Headwaters food-handler advantage is exactly this:
              embedded at the Deer Lake store from Day 1, the grocery share
              for the crew costs us less than its felt value lands.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold mb-[1vh]">
              Principle 02
            </div>
            <div className="font-display text-[2vw] leading-tight text-primary font-medium mb-[1.2vh]">
              Predictability + protection during life events
              <span className="block italic font-normal text-accent mt-[0.4vh]">
                beats magnitude.
              </span>
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.5] mb-[1.5vh]">
              People don't leave because their pay is small. They leave
              because the parent gets sick, the truck dies in February, the
              kid needs a tutor and the bank account is empty.{" "}
              <span className="text-primary font-semibold">
                The structure that catches them on those weeks is what they
                remember in year five.
              </span>
            </div>
            <div
              className="mt-auto pt-[1.2vh] border-t font-body text-[0.95vw] text-text leading-[1.45]"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              HSA, sick bank, family/community leave, a mental-health
              stipend, a sabbatical bank, equipment transfer, RRSP step-up —
              none of these cost as much as a $5k raise, and all of them
              outweigh it on the weeks that decide whether someone stays.
            </div>
          </div>
        </div>

        <div
          className="mt-[2vh] pt-[1.2vh] border-t font-display italic text-[1.3vw] text-muted leading-[1.4] max-w-[80vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          In a cost-of-living crisis,{" "}
          <span className="text-primary font-semibold not-italic">
            capable people with good judgment will follow whichever bone
            you give them.
          </span>{" "}
          The whole comp design is choosing which bone.
        </div>
      </div>
    </div>
  );
}
