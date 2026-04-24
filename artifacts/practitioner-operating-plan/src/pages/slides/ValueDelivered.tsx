export default function ValueDelivered() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              IV · 03 — Value delivered
            </div>
            <h2
              className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              What you get
              <span className="italic font-normal text-accent"> for the rate.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw] font-body text-[1.15vw] text-muted leading-[1.4]">
            Four deliverables. Each one independently worth the line item next
            to it.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-baseline gap-[1vw] mb-[1vh]">
              <div className="font-mono text-accent font-semibold text-[1.1vw]">01</div>
              <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
                Optimized food-price model
              </div>
            </div>
            <div className="font-display text-[1.85vw] leading-tight text-primary font-medium mb-[1vh]">
              Subsidy pass-through, real cost transparency, defensible margins.
            </div>
            <div className="font-body text-[1.1vw] text-text leading-[1.5]">
              Pricing the community can read line by line and the band council
              can defend in front of anyone. Nutrition North dollars actually
              landing on the shelf instead of disappearing into incumbent
              margin.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-baseline gap-[1vw] mb-[1vh]">
              <div className="font-mono text-accent font-semibold text-[1.1vw]">02</div>
              <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
                Delivery execution that holds in winter
              </div>
            </div>
            <div className="font-display text-[1.85vw] leading-tight text-primary font-medium mb-[1vh]">
              Three lanes, two backups, one calendar.
            </div>
            <div className="font-body text-[1.1vw] text-text leading-[1.5]">
              The 807 producer lane, the ice road, and the air freight — each
              with a fallback. Run by a manager who lives 90 minutes from the
              depot, not 2,000 km from it.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-baseline gap-[1vw] mb-[1vh]">
              <div className="font-mono text-accent font-semibold text-[1.1vw]">03</div>
              <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
                Coordinator infrastructure that scales
              </div>
            </div>
            <div className="font-display text-[1.85vw] leading-tight text-primary font-medium mb-[1vh]">
              Built for Deer Lake. Reusable for the next two.
            </div>
            <div className="font-body text-[1.1vw] text-text leading-[1.5]">
              The 11am / 4pm rhythm, the depot, the back office — all designed
              so contract two doesn't restart from zero. Your dollar funds an
              asset, not just a service.
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div className="flex items-baseline gap-[1vw] mb-[1vh]">
              <div
                className="font-mono font-semibold text-[1.1vw]"
                style={{ color: "#e9c8a8" }}
              >
                04
              </div>
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-80"
              >
                Base stability — no single point of failure
              </div>
            </div>
            <div className="font-display text-[1.85vw] leading-tight font-medium mb-[1vh]">
              A partner who is rested enough to do the job for years.
            </div>
            <div className="font-body text-[1.1vw] leading-[1.5] opacity-95">
              The structure exists so the work doesn't depend on one tired
              person. You aren't betting on someone's stamina; you're betting
              on a system that keeps performing whether or not any one person
              has a bad week.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
