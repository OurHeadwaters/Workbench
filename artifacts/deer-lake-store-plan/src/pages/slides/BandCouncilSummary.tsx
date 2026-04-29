export default function BandCouncilSummary() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
              The whole plan on one page · for council
            </div>
            <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium">
              A community-owned grocery store.
              <span className="italic font-normal text-accent"> Read in a minute. Carry into the meeting.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.4vh]">
              Leaving Deer Lake each year
            </div>
            <div
              className="font-mono text-[1.6vw] text-accent font-semibold leading-tight"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              $1.6 to $2.0 million
            </div>
            <div className="font-body text-[0.85vw] text-muted leading-[1.3] mt-[0.3vh]">
              Most of it can stay home.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[1.4vw] min-h-0">
          <div
            className="col-span-4 rounded-[0.4vw] p-[1.4vw] flex flex-col min-h-0"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[0.6vh]">
              WHAT THIS IS
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] text-muted mb-[1vh]">
              In plain words
            </div>

            <div className="font-display text-[1.4vw] leading-[1.25] text-primary font-medium mb-[1.2vh]">
              A second grocery store. The band owns it. A two-person operator couple sits on top of Square, QuickBooks, Local Line, and the Headwaters cockpit — that's the cost-control story.
            </div>

            <div className="space-y-[0.8vh] font-body text-[0.92vw] leading-[1.35]">
              <div className="flex gap-[0.7vw]">
                <div className="font-mono text-accent text-[0.95vw] pt-[0.1vh] shrink-0">→</div>
                <div>
                  More of every grocery dollar stays home.{" "}
                  <span className="font-mono text-[0.82vw] text-muted">(84¢ on the shelf, not 58¢)</span>
                </div>
              </div>
              <div className="flex gap-[0.7vw]">
                <div className="font-mono text-accent text-[0.95vw] pt-[0.1vh] shrink-0">→</div>
                <div>Family-run cold truck through Dryden. Air freight when the winter road closes.</div>
              </div>
              <div className="flex gap-[0.7vw]">
                <div className="font-mono text-accent text-[0.95vw] pt-[0.1vh] shrink-0">→</div>
                <div>
                  Headwaters is paid for software and training. <span className="font-semibold">No cut of the groceries.</span>
                </div>
              </div>
              <div className="flex gap-[0.7vw]">
                <div className="font-mono text-accent text-[0.95vw] pt-[0.1vh] shrink-0">→</div>
                <div>
                  Not an experiment. Arctic Co-ops and the Mistissini Meechum store already do this up north.
                </div>
              </div>
              <div className="flex gap-[0.7vw]">
                <div className="font-mono text-accent text-[0.95vw] pt-[0.1vh] shrink-0">→</div>
                <div>
                  Same operator-couple model already running at the band's hotel — same contractor extending it to the store.
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-span-4 rounded-[0.4vw] p-[1.4vw] flex flex-col min-h-0"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[0.6vh]">
              THE NUMBERS
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] text-muted mb-[1vh]">
              Early estimates · firmed up before any money is spent
            </div>

            <div className="space-y-[1vh] font-body text-[0.92vw] leading-[1.3]">
              <div>
                <div className="font-display text-[1vw] text-primary font-semibold leading-tight">
                  Cost to open the doors
                </div>
                <div
                  className="font-mono text-[0.95vw] text-accent mt-[0.2vh] font-semibold"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  $400,000 to $700,000
                </div>
                <div className="text-muted text-[0.78vw] mt-[0.1vh]">
                  Build-out, freezers, shelving, first stock. Grant-stack: FedNor, Community Futures, ISC Community Capital, band contribution.
                </div>
              </div>

              <div>
                <div className="font-display text-[1vw] text-primary font-semibold leading-tight">
                  What Headwaters charges each month
                </div>
                <div
                  className="font-mono text-[0.95vw] text-accent mt-[0.2vh] font-semibold"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  $90,000 a month · recommended plan
                </div>
                <div className="text-muted text-[0.78vw] mt-[0.1vh]">
                  Replaces today's $35k/mo software-only contract. Full team, accountability, 35% put back into the store.
                </div>
              </div>

              <div>
                <div className="font-display text-[1vw] text-primary font-semibold leading-tight">
                  Day-one gap money
                </div>
                <div
                  className="font-mono text-[0.95vw] text-accent mt-[0.2vh] font-semibold"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  about $181,000
                </div>
                <div className="text-muted text-[0.78vw] mt-[0.1vh]">
                  Covers two months of our costs plus day-one equipment until the first band invoice clears. ISC takes ~60 days.
                </div>
              </div>

              <div>
                <div className="font-display text-[1vw] text-primary font-semibold leading-tight">
                  Jobs at full run
                </div>
                <div
                  className="font-mono text-[0.95vw] text-accent mt-[0.2vh] font-semibold"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  17 to 20 jobs for Deer Lake people
                </div>
                <div className="text-muted text-[0.78vw] mt-[0.1vh]">
                  The store grows into them over two years.
                </div>
              </div>

              <div>
                <div className="font-display text-[1vw] text-primary font-semibold leading-tight">
                  What stays in Deer Lake year one
                </div>
                <div
                  className="font-mono text-[0.95vw] text-accent mt-[0.2vh] font-semibold"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  about $125,000 to $200,000
                </div>
                <div className="text-muted text-[0.78vw] mt-[0.1vh]">
                  Grocery margin that today flies south. 84¢ on the shelf instead of 58¢, on year-one sales mix.
                </div>
              </div>
            </div>
          </div>

          <div
            className="col-span-4 rounded-[0.4vw] p-[1.4vw] flex flex-col min-h-0"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono text-[0.95vw] font-semibold mb-[0.6vh]"
              style={{ color: "#e9c8a8" }}
            >
              WHO RUNS WHAT · THE ASK
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.78vw] opacity-75 mb-[1vh]">
              Two jobs split clearly
            </div>

            <div
              className="rounded-[0.3vw] p-[0.9vw] mb-[0.7vh]"
              style={{ background: "rgba(244,237,224,0.08)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.14em] text-[0.78vw]"
                style={{ color: "#e9c8a8" }}
              >
                The band runs the store
              </div>
              <div className="font-body text-[0.85vw] leading-[1.4] opacity-95 mt-[0.3vh]">
                Owns the store outright. The contractor installs and pays the operator couple and the local on-call group — already running the band's hotel under this same model. A two-person operator couple runs the floor day to day. Council member on oversight from day one.
              </div>
            </div>

            <div
              className="rounded-[0.3vw] p-[0.9vw] mb-[0.7vh]"
              style={{ background: "rgba(244,237,224,0.08)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.14em] text-[0.78vw]"
                style={{ color: "#e9c8a8" }}
              >
                Headwaters delivers the cockpit underneath them
              </div>
              <div className="font-body text-[0.85vw] leading-[1.4] opacity-95 mt-[0.3vh]">
                Square + QuickBooks + Local Line, composed into one cockpit the band owns. Training, monthly visits, public price dashboard. That's why a couple can do it. No one from Headwaters works the floor. Contracted by the contractor as the store-specialist sub.
              </div>
            </div>

            <div
              className="rounded-[0.3vw] p-[0.95vw] mb-[0.7vh]"
              style={{ background: "rgba(244,237,224,0.10)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.14em] text-[0.78vw] mb-[0.4vh]"
                style={{ color: "#e9c8a8" }}
              >
                The ask, in one line
              </div>
              <div className="font-display text-[1.15vw] leading-[1.25] font-medium">
                One hour with the contractor. An honest opinion. An introduction to the council when the contractor is ready.
              </div>
            </div>

            <div
              className="rounded-[0.3vw] px-[0.9vw] py-[0.7vh]"
              style={{ background: "rgba(244,237,224,0.04)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.14em] text-[0.72vw] opacity-75 mb-[0.3vh]"
              >
                Worth less than what we charged?
              </div>
              <div className="font-body text-[0.8vw] leading-[1.35] opacity-90">
                We credit the difference back. In writing. Outside reviewer every year.
              </div>
            </div>

            <div
              className="font-display italic text-[0.85vw] mt-[0.8vh] pt-[0.6vh] border-t"
              style={{ borderColor: "rgba(244,237,224,0.25)", color: "#e9c8a8" }}
            >
              — Headwaters. The work is paid for. The value comes back. Deer Lake earns it.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
