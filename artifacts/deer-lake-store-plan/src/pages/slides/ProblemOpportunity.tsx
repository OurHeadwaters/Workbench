export default function ProblemOpportunity() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              01 · Situation
            </div>
            <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
              Where the money is going.
              <span className="italic font-normal text-accent"> Where it could go instead.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              Estimated annual leakage
            </div>
            <div className="font-display text-[5vw] leading-none text-accent font-semibold">
              ~$1.6M
            </div>
            <div className="font-body text-[1vw] text-muted mt-[0.4vh]">
              Deer Lake → outside the community
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
            <div className="font-display text-[2.2vw] leading-tight text-primary mb-[2.5vh] font-medium">
              One incumbent. No competition. The federal subsidy mostly stays with the retailer.
            </div>
            <div className="space-y-[1.8vh] font-body text-[1.45vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  <span className="font-semibold">87%</span> of Ontario fly-in communities have <span className="font-semibold">no competing grocery</span> — the highest of any province.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  Northern food basket runs <span className="font-semibold">~$1,680 / month</span> for a family of four — vs. <span className="font-semibold">~$1,000</span> in southern Ontario.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  Where there is no competition, only <span className="font-semibold">58¢</span> of every Nutrition North subsidy dollar reaches the shelf. The other <span className="font-semibold">42¢</span> stays with the retailer.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-accent text-[1.2vw] pt-[0.4vh] shrink-0">→</div>
                <div>
                  The North West Co. takes <span className="font-semibold">more than half</span> of the federal <span className="font-semibold">$144.8M</span> Nutrition North subsidy annually.
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
                A community-owned alternative
              </div>
            </div>
            <div className="font-display text-[2.2vw] leading-tight mb-[2.5vh] font-medium">
              Pass-through climbs. Margin recirculates. The store reads as the community's, not the retailer's.
            </div>
            <div className="space-y-[1.8vh] font-body text-[1.45vw] leading-[1.4]">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  With a competing local store the pass-through climbs to <span className="font-semibold">~84¢ on the dollar</span> — a measured ~26¢ swing per subsidy dollar back to households.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  Community-owned models are not theory. <span className="font-semibold">Arctic Co-operatives Ltd.</span> runs 32 community-owned stores; <span className="font-semibold">Mistissini's Meechum</span> anchors a 4,000-person Cree community.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  807 supplies at wholesale with no margin extracted from Deer Lake — covered by the same ~10% commission charged to producers across the network.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1.2vw] pt-[0.4vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>
                  Local hire pipeline turns the store into <span className="font-semibold">17–20 community jobs</span> over two years. Replaces leakage with employment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
