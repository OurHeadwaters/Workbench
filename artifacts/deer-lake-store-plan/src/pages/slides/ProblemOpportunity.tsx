export default function ProblemOpportunity() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[4.5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              Where we are today
            </div>
            <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
              Grocery money is leaving Deer Lake.
              <span className="italic font-normal text-accent"> Most of it can stay home.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              Leaving Deer Lake each year
            </div>
            <div className="font-display text-[2.6vw] leading-tight text-primary font-medium">
              Spent in Winnipeg or kept by the one store in town
            </div>
            <div className="font-mono text-[1.1vw] text-accent mt-[0.6vh] font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
              about $1.6 million a year
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[3vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[3vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-center gap-[0.8vw] mb-[2vh]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-muted" />
              <div className="font-mono uppercase tracking-[0.22em] text-[1.1vw] text-muted">
                Today
              </div>
            </div>
            <div className="font-display text-[1.95vw] leading-tight text-primary mb-[1.2vh] font-medium">
              One store, no other choice. Most of the federal grocery help stays with the store.
            </div>
            {/* See docs/spiritual-imagery-rule.md before editing this block. */}
            <div
              className="mb-[1.5vh] p-[1vw] rounded-[0.3vw] font-mono uppercase tracking-[0.16em] text-[0.95vw] leading-[1.4] text-muted"
              style={{
                border: "1px dashed var(--slide-accent)",
                background: "rgba(184,90,62,0.06)",
              }}
            >
              Needs guidance from elders / wisdom keepers — placeholder, not
              for delivery. Will hold imagery + a sourced, attributed account
              of how the current store feels to people in Deer Lake. See
              docs/spiritual-imagery-flags.md.
            </div>
            <div className="space-y-[1.1vh] font-body text-[1.3vw] leading-[1.35]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  Most fly-in First Nations in Ontario have just one grocery store. <span className="font-semibold">Deer Lake is one of them.</span> <span className="font-mono text-[0.95vw] text-muted">(87 of every 100)</span>
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  Feeding a family of four costs much more here than down south. <span className="font-mono text-[0.95vw] text-muted">($1,680 a month vs. $1,000)</span>
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  Of every dollar of federal grocery help, the store keeps 42¢. Only 58¢ reaches the shelf. <span className="font-mono text-[0.95vw] text-muted">(58¢ on the shelf · 42¢ to the store)</span>
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  One company, the North West Company, owns most northern stores. It takes more than half of the federal grocery help each year. <span className="font-mono text-[0.95vw] text-muted">(over half of $144.8 million)</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[3vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div className="flex items-center gap-[0.8vw] mb-[2vh]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full" style={{ background: "#e9c8a8" }} />
              <div className="font-mono uppercase tracking-[0.22em] text-[1.1vw] opacity-80">
                A store the community owns
              </div>
            </div>
            <div className="font-display text-[1.95vw] leading-tight mb-[1.5vh] font-medium">
              The community owns the second store. More of every dollar stays home. Jobs come with it.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.4vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  More federal grocery help reaches the shelf. More money back to families. <span className="font-mono text-[0.95vw] opacity-80">(84¢ instead of 58¢)</span>
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  Not an experiment. <span className="font-semibold">Arctic Co-operatives</span> already runs community-owned stores up north. The <span className="font-semibold">Meechum store in Mistissini</span> serves a Cree community of similar size. <span className="font-mono text-[0.95vw] opacity-80">(32 stores · ~4,000 people)</span>
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  Headwaters is paid for software and training. <span className="font-semibold">We take no cut of the groceries.</span> The store's grocery margin stays in Deer Lake.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  Over two years the store grows into <span className="font-semibold">jobs for Deer Lake people</span>. <span className="font-mono text-[0.95vw] opacity-80">(17 to 20 jobs)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
