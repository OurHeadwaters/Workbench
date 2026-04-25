export default function BrandIPLandscape() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              II · 03 — Brand & IP landscape
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              What's available, what's taken,
              <span className="italic font-normal text-accent"> and where the lanes are open.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            Domain WHOIS confirmed Apr 2026. Trademark counts from the indicative
            US/global index — not legal opinion. The point is the directional
            picture, not the filing.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1.2vh]">
              Domains — WHOIS Apr 2026
            </div>

            <div className="mb-[1.5vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] text-muted mb-[0.6vh]">
                Available — grab this week
              </div>
              <div className="font-mono text-[0.95vw] text-primary leading-[1.55]">
                <span className="font-semibold">headwaters.ca</span> · <span className="font-semibold">watershed.ca</span> · watershedhq.ca · watershedmoney.ca · watershedbudget.ca · headwatersmoney.com · watershed.app · headwaters.app
              </div>
            </div>

            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] text-muted mb-[0.6vh]">
                Taken — already owned by someone else
              </div>
              <div className="font-body text-[0.92vw] text-text leading-[1.5]">
                <span className="font-mono font-semibold">watershed.com</span> (Watershed Technology Inc.) · <span className="font-mono font-semibold">headwaters.com</span> (privately held since 1995) · <span className="font-mono">getwatershed.com</span> (parked since 2020) · <span className="font-mono">watershed.cash</span> · <span className="font-mono">watershed.money</span> · <span className="font-mono">headwaters.cash</span> · <span className="font-mono">headwaters.money</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.6vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1.2vh]">
              Trademarks — indicative index
            </div>

            <div className="mb-[1.4vh]">
              <div className="flex items-baseline justify-between mb-[0.5vh]">
                <div className="font-display text-[1.3vw] text-primary font-semibold">
                  Watershed
                </div>
                <div className="font-mono text-[0.85vw] text-muted">
                  191 active marks
                </div>
              </div>
              <div className="font-body text-[0.9vw] text-text leading-[1.45]">
                Nearest neighbours: <span className="font-semibold">Watershed Technology Inc.</span> (7 marks, software/SaaS — overlaps Class 9 / 42), <span className="font-semibold">Watershed Asset Management</span> (Class 36 financial services — institutional, not consumer), plus distillery, food, consulting, geosynthetics.
              </div>
            </div>

            <div className="mb-[1.4vh] pt-[1.2vh] border-t" style={{ borderColor: "var(--slide-rule)" }}>
              <div className="flex items-baseline justify-between mb-[0.5vh]">
                <div className="font-display text-[1.3vw] text-primary font-semibold">
                  Headwaters
                </div>
                <div className="font-mono text-[0.85vw] text-muted">
                  76 active marks
                </div>
              </div>
              <div className="font-body text-[0.9vw] text-text leading-[1.45]">
                Nearest neighbours: <span className="font-semibold">Simms Fishing Products</span> (Class 25 footwear, Class 18/28 bags), <span className="font-semibold">Hanley Center Foundation</span> (Class 41/44 addiction treatment), <span className="font-semibold">Coho Wines</span> (Class 33), <span className="font-semibold">Victory Brewing</span> (Class 32), <span className="font-semibold">EM Resources</span> (Class 19/37/39 coal byproducts).
              </div>
            </div>

            <div
              className="mt-auto p-[1vw] rounded-[0.3vw]"
              style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.18em] text-[0.78vw] mb-[0.4vh]"
                style={{ color: "#e9c8a8" }}
              >
                The line that matters
              </div>
              <div className="font-body text-[0.95vw] leading-[1.4]">
                <span className="font-semibold">No active mark found</span> in
                Class 36 (financial services) or Class 9 (consumer finance
                software) for Headwaters.
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-[1.5vh] p-[1.2vw] rounded-[0.3vw] flex items-baseline justify-between gap-[2vw]"
          style={{ background: "var(--slide-paper)", borderLeft: "0.3vw solid var(--slide-accent)" }}
        >
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-accent font-semibold mb-[0.4vh]">
              Recommendation
            </div>
            <div className="font-display text-[1.2vw] text-primary font-medium leading-[1.35]">
              Headwaters has the cleaner trademark runway in the classes we'd
              actually file in.
            </div>
          </div>
          <div className="font-body text-[0.9vw] text-muted leading-[1.4] max-w-[32vw] text-right shrink-0">
            Confirm with a Canadian trademark agent before filing — but the
            directional answer is clear.
          </div>
        </div>
      </div>
    </div>
  );
}
