export default function FinancialsRole() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4.5vh] flex flex-col">
        <div className="mb-[2vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            05 · The numbers, the schedule, who runs it
          </div>
          <h2 className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium">
            What it costs.
            <span className="italic font-normal"> When it opens.</span>
            <span className="italic font-normal text-accent"> Who runs it.</span>
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.6vw] min-h-0">
          <div className="rounded-[0.4vw] p-[1.8vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">THE NUMBERS</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted mb-[0.8vh]">Early estimates · firmed up before any money is spent</div>

            <div className="space-y-[1vh] font-body text-[1.05vw] leading-[1.35]">
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">What Deer Lake spends on groceries each year</div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">~$1.6–2.0M / yr</div>
                <div className="text-muted text-[1.1vw]">About 870 people, at northern prices</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">What we aim to sell in year one</div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">30–40%</div>
                <div className="text-muted text-[1.1vw]">Of the community's grocery spending</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">What the store keeps on each dollar of sales</div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">22–28%</div>
                <div className="text-muted text-[1.1vw]">Less than the current store — on purpose, so prices are lower</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">What it costs to open the doors</div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">$400–700k</div>
                <div className="text-muted text-[1.1vw]">Build-out, freezers, shelving, first round of stock, signage</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">Operations lead (full-time, 6–9 months)</div>
                <div className="font-display text-[1.6vw] text-primary font-semibold leading-tight">$80–120k</div>
                <div className="text-muted text-[1.1vw]">807 contracts Parr's Jars; own line in the quote</div>
              </div>
              <div>
                <div className="font-mono uppercase tracking-[0.16em] text-[1vw] text-muted">Where the opening money comes from</div>
                <div className="text-text text-[0.9vw] leading-[1.3]">Federal/regional grants (FedNor NODP, Community Futures, ISC CCP), LFFC partnership, band contribution.</div>
              </div>
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.8vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">THE SCHEDULE</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted mb-[2vh]">From signing on to handing the keys to a Deer Lake manager</div>

            <div className="space-y-[1.1vh] font-body text-[1vw] leading-[1.35]">
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Pick the building, line up suppliers, set up the till</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "0%", width: "20%", background: "var(--slide-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Build out the inside of the store</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "12%", width: "26%", background: "var(--slide-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Hire and train the first crew</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "20%", width: "26%", background: "var(--slide-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Train Deer Lake staff (continuous)</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "20%", width: "78%", background: "var(--slide-muted)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Quiet trial run</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "44%", width: "8%", background: "var(--slide-accent)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Doors open to everyone</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "52%", width: "6%", background: "var(--slide-accent)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">First 90 days — sort out the bumps</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "58%", width: "30%", background: "var(--slide-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Hand the store to a Deer Lake manager</div>
                <div className="col-span-8 h-[1.5vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "84%", width: "16%", background: "var(--slide-primary)" }} />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-[0.4vw] mt-[1vh] font-mono text-[1vw] text-muted">
                <div className="col-span-4" />
                <div className="col-span-8 grid grid-cols-9 text-center">
                  <div>M1</div><div>M2</div><div>M3</div><div>M4</div><div>M5</div><div>M6</div><div>M7</div><div>M8</div><div>M9</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.8vw] flex flex-col" style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}>
            <div className="font-mono text-[1.05vw] font-semibold mb-[1vh]" style={{ color: "#e9c8a8" }}>WHO RUNS IT</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[1vw] opacity-75 mb-[1.6vh]">Two ways. The contractor and the council pick after seeing both.</div>

            <div className="rounded-[0.3vw] p-[1.4vw] mb-[1.4vh]" style={{ background: "rgba(244,237,224,0.10)" }}>
              <div className="font-mono uppercase tracking-[0.16em] text-[1vw]" style={{ color: "#e9c8a8" }}>What we'd recommend</div>
              <div className="font-display text-[1.7vw] leading-tight font-medium mt-[0.4vh] mb-[1vh]">
                807 brings in a full-time operations lead through Parr's Jars for 6–9 months
              </div>
              <div className="font-body text-[1vw] leading-[1.45] opacity-95">
                One dedicated hire — fully committed, not split across clients. Community development background with an Indigenous focus. Up in Deer Lake regularly; back at base building the tools the store runs on: till, reorder rules, clean daily books, a bank no one untrusted can touch. Cost is its own line in the project quote (<span className="font-semibold">$80–120k</span>, on the left). Off the payroll by month 9.
              </div>
            </div>

            <div className="rounded-[0.3vw] p-[1.4vw]" style={{ background: "rgba(244,237,224,0.04)" }}>
              <div className="font-mono uppercase tracking-[0.16em] text-[1vw] opacity-75">The other way</div>
              <div className="font-display text-[1.4vw] leading-tight font-medium mt-[0.4vh] mb-[0.8vh] opacity-95">
                A manager who lives in Deer Lake for 18–24 months
              </div>
              <div className="font-body text-[1.1vw] leading-[1.45] opacity-85">
                Costs more, and harder for the band to take back later. Worth it if the council wants the same person through the second winter.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
