export default function ProblemOpportunity() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[4.5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              01 · Where we are today
            </div>
            <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
              Deer Lake's grocery money is leaving.
              <span className="italic font-normal text-accent"> Most of it can stay home.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              Money leaving Deer Lake each year
            </div>
            <div className="font-display text-[5vw] leading-none text-accent font-semibold">
              ~$1.6M
            </div>
            <div className="font-body text-[1vw] text-muted mt-[0.4vh]">
              Spent on groceries in Winnipeg or kept by the current store's owners
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
              One store, no other choice. The federal subsidy mostly stays with the owners — not on the shelf.
            </div>
            <div className="border-l-[0.25vw] border-accent pl-[1vw] mb-[1.5vh] font-display italic text-[1.25vw] leading-[1.3] text-primary">
              "Less like a local store — different clientele — more like a Walmart."
              <div className="font-mono not-italic uppercase tracking-[0.18em] text-[0.85vw] text-muted mt-[0.3vh]">
                Heard in Deer Lake
              </div>
            </div>
            <div className="space-y-[1.1vh] font-body text-[1.3vw] leading-[1.35]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  <span className="font-semibold">87%</span> of Ontario fly-in communities have <span className="font-semibold">only one grocery store</span> — the highest of any province. Deer Lake is one of them.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  Feeding a family of four up here costs about <span className="font-semibold">$1,680 a month</span>. The same groceries in southern Ontario cost about <span className="font-semibold">$1,000</span>.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  With only one store, just <span className="font-semibold">58¢</span> of every Nutrition North dollar reaches the shelf — the other <span className="font-semibold">42¢</span> the store keeps.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  The North West Company alone takes <span className="font-semibold">more than half</span> of the <span className="font-semibold">$144.8M</span> federal Nutrition North budget each year.
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
              More of every dollar stays here. The store feels like yours. Jobs come with it.
            </div>
            <div className="space-y-[1.4vh] font-body text-[1.4vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  Once Deer Lake has a second store of its own, about <span className="font-semibold">84¢</span> of every Nutrition North dollar reaches the shelf instead of 58¢ — about <span className="font-semibold">26¢ more per dollar</span> coming back to families.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  This isn't an experiment. <span className="font-semibold">Arctic Co-operatives Ltd.</span> already runs 32 community-owned stores up north, and <span className="font-semibold">Mistissini's Meechum</span> store serves a Cree community of 4,000 people.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  807 sells groceries to the store at cost — we don't take a cut from Deer Lake. We get paid the same ~10% the producers on our route already pay us.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  Over two years the store grows into <span className="font-semibold">17–20 jobs for people who live in Deer Lake</span>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
