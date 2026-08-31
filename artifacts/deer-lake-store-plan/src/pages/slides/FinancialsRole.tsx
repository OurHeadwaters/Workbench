export default function FinancialsRole() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            05 · Financials · timeline · role
          </div>
          <h2 className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium">
            What it costs.
            <span className="italic font-normal"> When it opens.</span>
            <span className="italic font-normal text-accent"> Who builds it.</span>
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.6vw] min-h-0">

          {/* Column 1: Financial Sketch */}
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">
              FINANCIAL SKETCH
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted mb-[1.4vh]">
              Planning-grade · refine in feasibility stage
            </div>
            <div className="space-y-[1.2vh] font-body text-[1.05vw] leading-[1.4]">
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">
                  Community grocery spend
                </div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">
                  ~$1.6–2.0M / yr
                </div>
                <div className="text-muted text-[1.1vw]">~870 residents at Northern price points</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">
                  Year-1 target market share
                </div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">
                  30–40%
                </div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">
                  Blended gross margin
                </div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">
                  22–28%
                </div>
                <div className="text-muted text-[1.1vw]">Lower than NWC by design</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">
                  Opening capex band
                </div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">
                  $400–700k
                </div>
                <div className="text-muted text-[1.1vw]">
                  Fit-out, freezers, racking, opening inventory, POS, signage
                </div>
              </div>
              <div
                className="rounded-[0.3vw] p-[1vw]"
                style={{ background: "rgba(31,61,46,0.07)" }}
              >
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted mb-[0.3vh]">
                  Codetry annual engagement
                </div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">
                  $20,000 / year
                </div>
                <div className="text-muted text-[1.05vw] leading-[1.35] mt-[0.3vh]">
                  Year 1: Codetry + base build using the current strategic plan. Year 2:
                  separate additional layer + new annual strategic plan for board and training
                  implementation.
                </div>
                <div className="text-muted text-[0.96vw] leading-[1.32] mt-[0.45vh]">
                  Normal $6,000 operating fee → $0 only during a qualifying active annual
                  engagement; not added to Year 2.
                </div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">
                  Funding mix
                </div>
                <div className="text-text text-[1vw] leading-[1.4]">
                   Proposed grant-supported project work: FedNor NODP · Community Futures · ISC
                   CCP · LFFC partnership · band capital. No award or sponsorship implied.
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Gantt */}
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">
              6–9 MONTH GANTT
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted mb-[2vh]">
              Site to handoff
            </div>
            <div className="space-y-[1.1vh] font-body text-[1vw] leading-[1.35]">
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Site + suppliers + POS config</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div
                    className="absolute h-full rounded-sm"
                    style={{ left: "0%", width: "20%", background: "var(--slide-primary)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Fit-out oversight</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div
                    className="absolute h-full rounded-sm"
                    style={{ left: "12%", width: "26%", background: "var(--slide-primary)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Hire + train rotation 1</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div
                    className="absolute h-full rounded-sm"
                    style={{ left: "20%", width: "26%", background: "var(--slide-primary)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Local-hire pipeline</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div
                    className="absolute h-full rounded-sm"
                    style={{ left: "20%", width: "78%", background: "var(--slide-muted)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Soft open</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div
                    className="absolute h-full rounded-sm"
                    style={{ left: "44%", width: "8%", background: "var(--slide-accent)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Opening week</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div
                    className="absolute h-full rounded-sm"
                    style={{ left: "52%", width: "6%", background: "var(--slide-accent)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">90-day stabilisation</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div
                    className="absolute h-full rounded-sm"
                    style={{ left: "58%", width: "30%", background: "var(--slide-primary)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Local manager handoff</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div
                    className="absolute h-full rounded-sm"
                    style={{ left: "84%", width: "16%", background: "var(--slide-primary)" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] mt-[1vh] font-mono text-[1vw] text-muted">
                <div className="col-span-4" />
                <div className="col-span-8 grid grid-cols-9 text-center">
                  <div>M1</div>
                  <div>M2</div>
                  <div>M3</div>
                  <div>M4</div>
                  <div>M5</div>
                  <div>M6</div>
                  <div>M7</div>
                  <div>M8</div>
                  <div>M9</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Who Builds It */}
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono text-[1.05vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              WHO BUILDS IT
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[1vw] opacity-75 mb-[1.6vh]">
              Two options. Pick after you read the room.
            </div>
            <div
              className="rounded-[0.3vw] p-[1.4vw] mb-[1.4vh]"
              style={{ background: "rgba(244,237,224,0.10)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.16em] text-[1vw]"
                style={{ color: "#e9c8a8" }}
              >
                Recommended
              </div>
              <div className="font-display text-[1.7vw] leading-tight font-medium mt-[0.4vh] mb-[1vh]">
                807 Store Launch Lead · 6–9 months
              </div>
              <div className="font-body text-[1vw] leading-[1.45] opacity-95">
                Fixed-term build/launch GM. Day-rate + band-housing + per-diem + success fee on
                opening + 90-day metrics. Fits inside the store's launch capex; clean exit to
                advisory.
              </div>
            </div>
            <div
              className="rounded-[0.3vw] p-[1.4vw]"
              style={{ background: "rgba(244,237,224,0.04)" }}
            >
              <div className="font-mono uppercase tracking-[0.16em] text-[1vw] opacity-75">
                Alternative
              </div>
              <div className="font-display text-[1.4vw] leading-tight font-medium mt-[0.4vh] mb-[0.8vh] opacity-95">
                Embedded GM · 18–24 months
              </div>
              <div className="font-body text-[1.1vw] leading-[1.45] opacity-85">
                Higher revenue, harder exit. Right if the band wants the launch lead to stay through
                the second winter.
              </div>
            </div>
            <div className="mt-auto pt-[1.4vh] font-body text-[1.05vw] opacity-75 leading-[1.4]">
              Both shown for transparency. The contractor and council pick after reading the room.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
