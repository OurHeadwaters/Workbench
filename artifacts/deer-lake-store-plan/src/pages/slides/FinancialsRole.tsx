export default function FinancialsRole() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="mb-[1.8vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
            The numbers, the schedule, who runs it
          </div>
          <h2 className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium">
            What it costs.
            <span className="italic font-normal"> When it opens.</span>
            <span className="italic font-normal text-accent"> Who runs it.</span>
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.4vw] min-h-0">
          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col min-h-0 overflow-hidden" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[0.6vh]">THE NUMBERS</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[0.8vh]">Early estimates · firmed up before any money is spent</div>

            <div className="space-y-[0.8vh] font-body text-[0.92vw] leading-[1.3]">
              <div>
                <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw] text-muted">What Deer Lake spends on groceries each year</div>
                <div className="font-display text-[1.4vw] text-primary font-semibold leading-tight">~$1.6–2.0M / yr</div>
                <div className="text-muted text-[0.85vw]">About 870 people, at northern prices</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw] text-muted">What we aim to sell in year one</div>
                <div className="font-display text-[1.4vw] text-primary font-semibold leading-tight">30–40%</div>
                <div className="text-muted text-[0.85vw]">Of the community's grocery spending</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw] text-muted">What the store keeps on each dollar of sales</div>
                <div className="font-display text-[1.4vw] text-primary font-semibold leading-tight">22–28%</div>
                <div className="text-muted text-[0.85vw]">Less than the current store — on purpose, so prices are lower</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw] text-muted">What it costs to open the doors</div>
                <div className="font-display text-[1.4vw] text-primary font-semibold leading-tight">$400–700k</div>
                <div className="text-muted text-[0.85vw]">Build-out, freezers, shelving, first round of stock, signage</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw] text-muted">Where the opening money comes from</div>
                <div className="text-text text-[0.82vw] leading-[1.3]">Federal/regional grants (FedNor's Northern Ontario Development Program, Community Futures, Indigenous Services Canada's Community Capital Program), LFFC (Local Food and Farm Co-operatives) partnership, band contribution.</div>
              </div>
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col min-h-0 overflow-hidden" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[0.6vh]">THE SCHEDULE</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[1.6vh]">From signing on to handing the keys to a Deer Lake manager</div>

            <div className="space-y-[1vh] font-body text-[0.95vw] leading-[1.3]">
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Pick the building, line up suppliers, set up the till</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "0%", width: "20%", background: "var(--slide-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Build out the inside of the store</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "12%", width: "26%", background: "var(--slide-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Hire and train the first crew</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "20%", width: "26%", background: "var(--slide-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Train Deer Lake staff (continuous)</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "20%", width: "78%", background: "var(--slide-muted)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Quiet trial run</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "44%", width: "8%", background: "var(--slide-accent)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Doors open to everyone</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "52%", width: "6%", background: "var(--slide-accent)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">First 90 days — sort out the bumps</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "58%", width: "30%", background: "var(--slide-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Hand the store to a Deer Lake manager</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "84%", width: "16%", background: "var(--slide-primary)" }} />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-[0.4vw] mt-[0.8vh] font-mono text-[0.9vw] text-muted">
                <div className="col-span-4" />
                <div className="col-span-8 grid grid-cols-9 text-center">
                  <div>M1</div><div>M2</div><div>M3</div><div>M4</div><div>M5</div><div>M6</div><div>M7</div><div>M8</div><div>M9</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col min-h-0 overflow-hidden" style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}>
            <div className="font-mono text-[0.95vw] font-semibold mb-[0.6vh]" style={{ color: "#e9c8a8" }}>WHO RUNS IT · WHAT HEADWATERS CHARGES</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] opacity-75 mb-[1vh]">Two jobs drawn cleanly · cost basis × 1.35 reinvestment markup</div>

            <div className="rounded-[0.3vw] p-[0.9vw] mb-[0.8vh]" style={{ background: "rgba(244,237,224,0.08)" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw]" style={{ color: "#e9c8a8" }}>Inside the store</div>
              <div className="font-body text-[0.85vw] leading-[1.4] opacity-95 mt-[0.3vh]">
                <span className="font-semibold">The band staffs and runs it.</span> Contractor or store manager hired by the band, plus the casual local pod paid by the job. Pods, not roles.
              </div>
            </div>

            <div className="rounded-[0.3vw] p-[0.9vw] mb-[0.8vh]" style={{ background: "rgba(244,237,224,0.08)" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw]" style={{ color: "#e9c8a8" }}>What Headwaters delivers</div>
              <div className="font-body text-[0.85vw] leading-[1.4] opacity-95 mt-[0.3vh]">
                <span className="font-semibold">Software, the tech stack, training. That's it.</span> No headcount on the floor. Practitioner visits monthly.
              </div>
            </div>

            <div className="rounded-[0.3vw] p-[0.9vw] mb-[0.8vh]" style={{ background: "rgba(244,237,224,0.10)" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw] mb-[0.5vh]" style={{ color: "#e9c8a8" }}>Cost basis · reinvestment · bill · bridge — full-stack agency engagement (replaces today's $35k/mo Layer-1 software-only contract)</div>
              <div className="font-mono text-[0.78vw] leading-[1.55] opacity-95" style={{ fontVariantNumeric: "tabular-nums" }}>
                <div className="grid grid-cols-12 gap-x-[0.4vw] pb-[0.3vh] opacity-70 border-b" style={{ borderColor: "rgba(244,237,224,0.18)" }}>
                  <div className="col-span-3">tier</div>
                  <div className="col-span-3 text-right">cost</div>
                  <div className="col-span-3 text-right">bill</div>
                  <div className="col-span-3 text-right">bridge</div>
                </div>
                <div className="grid grid-cols-12 gap-x-[0.4vw] pt-[0.3vh]">
                  <div className="col-span-3">A · floor</div>
                  <div className="col-span-3 text-right">$48.2k</div>
                  <div className="col-span-3 text-right">$60k</div>
                  <div className="col-span-3 text-right">~$96k</div>
                </div>
                <div className="grid grid-cols-12 gap-x-[0.4vw]" style={{ background: "rgba(233,200,168,0.10)" }}>
                  <div className="col-span-3 font-semibold">B · recommended</div>
                  <div className="col-span-3 text-right">$69.7k</div>
                  <div className="col-span-3 text-right font-semibold">$90k</div>
                  <div className="col-span-3 text-right">~$181k</div>
                </div>
                <div className="grid grid-cols-12 gap-x-[0.4vw]">
                  <div className="col-span-3">C · scale</div>
                  <div className="col-span-3 text-right">$99.1k</div>
                  <div className="col-span-3 text-right">$125k</div>
                  <div className="col-span-3 text-right">~$258k</div>
                </div>
              </div>
              <div className="font-body text-[0.72vw] leading-[1.4] opacity-80 mt-[0.5vh]">
                35% reinvestment target audited yearly. Bridge = M2 trough on the 60-day Indigenous Services Canada (ISC) pay cycle. Tier selection TBD pending council conversation. Precedent for written commitments: the $22k payback memo from V2.
              </div>
            </div>

            <div className="rounded-[0.3vw] p-[0.85vw]" style={{ background: "rgba(244,237,224,0.04)" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw] opacity-75">The freight</div>
              <div className="font-body text-[0.82vw] leading-[1.35] mt-[0.2vh] opacity-90">
                A family-run refrigerated route through Dryden, on the same corridor Deer Lake's truck already uses. Not a Headwaters line item.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
