export default function FinancialsRole() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="mb-[1.8vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
            The numbers, the schedule, who runs it
          </div>
          <h2 className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium">
            A two-person operator couple, on top of serious software.
            <span className="italic font-normal"> That's why the payroll line is small,</span>
            <span className="italic font-normal text-accent"> and why ~$125k–$200k of margin comes home year one.</span>
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.4vw] min-h-0">
          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col min-h-0 overflow-hidden" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[0.6vh]">THE NUMBERS</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[0.8vh]">Early estimates · firmed up before any money is spent</div>

            <div className="space-y-[0.9vh] font-body text-[0.92vw] leading-[1.3]">
              <div>
                <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight">Deer Lake's grocery spend each year</div>
                <div className="font-mono text-[0.88vw] text-accent mt-[0.2vh]" style={{ fontVariantNumeric: "tabular-nums" }}>$1.6 to $2.0 million a year</div>
                <div className="text-muted text-[0.82vw] mt-[0.1vh]">About 870 people, at northern prices</div>
              </div>
              <div>
                <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight">What we plan to sell in year one</div>
                <div className="font-mono text-[0.88vw] text-accent mt-[0.2vh]" style={{ fontVariantNumeric: "tabular-nums" }}>30 to 40 percent of it</div>
              </div>
              <div>
                <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight">Margin we keep on each dollar</div>
                <div className="font-mono text-[0.88vw] text-accent mt-[0.2vh]" style={{ fontVariantNumeric: "tabular-nums" }}>22 to 28 cents</div>
                <div className="text-muted text-[0.82vw] mt-[0.1vh]">Lower than the current store. On purpose.</div>
              </div>
              <div>
                <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight">What stays in Deer Lake year one</div>
                <div className="font-mono text-[0.88vw] text-accent mt-[0.2vh]" style={{ fontVariantNumeric: "tabular-nums" }}>about $125,000 to $200,000</div>
                <div className="text-muted text-[0.82vw] mt-[0.1vh]">Grocery margin that today flies south. 84¢ on the shelf instead of 58¢, on the year-one sales mix.</div>
              </div>
              <div>
                <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight">Cost to open the doors</div>
                <div className="font-mono text-[0.88vw] text-accent mt-[0.2vh]" style={{ fontVariantNumeric: "tabular-nums" }}>$400,000 to $700,000</div>
                <div className="text-muted text-[0.82vw] mt-[0.1vh]">Build-out, freezers, shelving, first stock</div>
              </div>
              <div>
                <div className="font-display text-[1.05vw] text-primary font-semibold leading-tight">Where the opening money comes from</div>
                <ul className="text-text text-[0.78vw] leading-[1.35] mt-[0.2vh] pl-[0.9vw] list-disc space-y-[0.2vh]">
                  <li><span className="font-semibold">FedNor</span> — the federal economic agency for northern Ontario. Runs the Northern Ontario Development Program.</li>
                  <li><span className="font-semibold">Community Futures</span> — local development corporations that lend to small business.</li>
                  <li><span className="font-semibold">Indigenous Services Canada Community Capital</span> — a federal program that helps fund community-owned businesses.</li>
                  <li><span className="font-semibold">Local Food and Farm Co-operatives</span> — our partner on the federal food-infrastructure grant.</li>
                  <li><span className="font-semibold">Band contribution</span> — Deer Lake's own share.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col min-h-0 overflow-hidden" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[0.6vh]">THE SCHEDULE</div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.85vw] text-muted mb-[1.6vh]">From signing on to passing the store to a Deer Lake manager</div>

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
                <div className="col-span-4 text-text">Keep training Deer Lake staff (all the way through)</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "20%", width: "78%", background: "var(--slide-muted)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Soft opening · invited shoppers only</div>
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
                <div className="col-span-4 text-text">First 90 days. Sort out the rough spots.</div>
                <div className="col-span-8 h-[1.4vh] rounded-sm relative bg-rule">
                  <div className="absolute h-full rounded-sm" style={{ left: "58%", width: "30%", background: "var(--slide-primary)" }} />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-[0.4vw] items-center">
                <div className="col-span-4 text-text">Pass the store to a Deer Lake manager</div>
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
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] opacity-75 mb-[1vh]">Two jobs split clearly · cost plus 35% reinvestment</div>

            <div className="rounded-[0.3vw] p-[0.9vw] mb-[0.8vh]" style={{ background: "rgba(244,237,224,0.08)" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw]" style={{ color: "#e9c8a8" }}>Inside the store</div>
              <div className="font-body text-[0.85vw] leading-[1.4] opacity-95 mt-[0.3vh]">
                <span className="font-semibold">A two-person operator couple runs the floor.</span> Installed and paid by the contractor — same model already running the band's hotel today. Local on-call group on the contractor's payroll too. The payroll line stays a couple, not a manager bench.
              </div>
            </div>

            <div className="rounded-[0.3vw] p-[0.9vw] mb-[0.8vh]" style={{ background: "rgba(244,237,224,0.08)" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw]" style={{ color: "#e9c8a8" }}>What Headwaters delivers</div>
              <div className="font-body text-[0.85vw] leading-[1.4] opacity-95 mt-[0.3vh]">
                <span className="font-semibold">Square + QuickBooks + Local Line, composed into one cockpit.</span> Training, monthly visits. That's how a couple keeps the doors open long hours and the truck on time. Contracted by the contractor as the store-specialist sub.
              </div>
            </div>

            <div className="rounded-[0.3vw] p-[0.9vw] mb-[0.8vh]" style={{ background: "rgba(244,237,224,0.10)" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw] mb-[0.5vh]" style={{ color: "#e9c8a8" }}>Three plans for the council. Replaces today's $35k/mo software-only contract.</div>
              <div className="font-mono text-[0.78vw] leading-[1.55] opacity-95" style={{ fontVariantNumeric: "tabular-nums" }}>
                <div className="grid grid-cols-12 gap-x-[0.4vw] pb-[0.3vh] opacity-70 border-b" style={{ borderColor: "rgba(244,237,224,0.18)" }}>
                  <div className="col-span-3">plan</div>
                  <div className="col-span-3 text-right">our cost</div>
                  <div className="col-span-3 text-right">what we charge</div>
                  <div className="col-span-3 text-right">gap money</div>
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
                We put 35% of what you pay back into building the store. An outside accountant checks this every year. The "gap money" covers two months of our costs plus day-one equipment ($0 / $42k / $60k). We get it back when the last two band bills get paid. Indigenous Services Canada (the federal department that pays the band) takes about 60 days. Council picks the plan. Written payback promise on file from last time, $22,000.
              </div>
            </div>

            <div className="rounded-[0.3vw] p-[0.85vw]" style={{ background: "rgba(244,237,224,0.04)" }}>
              <div className="font-mono uppercase tracking-[0.14em] text-[0.78vw] opacity-75">Shipping</div>
              <div className="font-body text-[0.82vw] leading-[1.35] mt-[0.2vh] opacity-90">
                Family-run cold truck through Dryden. Headwaters does not charge for this.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
