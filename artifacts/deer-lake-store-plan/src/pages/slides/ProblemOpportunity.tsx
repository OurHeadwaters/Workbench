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
              Deer Lake's grocery money is leaving.
              <span className="italic font-normal text-accent"> Most of it can stay home. The question is how.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              Money that leaves Deer Lake every year
            </div>
            <div className="font-display text-[2.6vw] leading-tight text-primary font-medium">
              Spent in Winnipeg, or kept by the store that is here today
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
              One store, no other choice. Most of the federal grocery help money stays with the store. Not much reaches the shelf.
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
                  Most Ontario First Nations you can only reach by plane have just one grocery store. That is the highest of any province in Canada. <span className="font-semibold">Deer Lake is one of them.</span>{" "}
                  <span className="font-mono text-[0.95vw] text-muted">(87 of every 100)</span>
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  Feeding a family of four up here costs much more than in southern Ontario.{" "}
                  <span className="font-mono text-[0.95vw] text-muted">(about $1,680 a month, vs. $1,000 down south)</span>
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  When there is only one store in town, most of the federal grocery help money never reaches the shelf. The store keeps the rest. <span className="font-mono text-[0.95vw] text-muted">(58¢ on the shelf, 42¢ kept by the store, per dollar from Nutrition North, the federal grocery help program for the north)</span>
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  One company, the North West Company, owns most northern stores in Canada. It takes more than half of the federal grocery help money each year. <span className="font-mono text-[0.95vw] text-muted">(over half of $144.8 million)</span>
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
              More of every dollar stays here. The store feels like home. Jobs come with it.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.4vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  When Deer Lake has its own second store, more of the federal grocery help money lands on the shelf. That is more money going back to families.{" "}
                  <span className="font-mono text-[0.95vw] opacity-80">(84¢ instead of 58¢, about 26¢ more per dollar)</span>
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  This is not an experiment. <span className="font-semibold">Arctic Co-operatives Ltd.</span> already runs 32 community-owned stores up north. The <span className="font-semibold">Meechum store in Mistissini</span> serves a Cree community of 4,000 people.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  Headwaters gets paid for the software, training, and tools the store runs on. <span className="font-semibold">We do not take a cut of the groceries.</span> The money the store makes on groceries stays with the store and the community.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  Over two years the store grows into <span className="font-semibold">17 to 20 jobs for people who live in Deer Lake</span>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
