export default function RisksAsk() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            06 · Risks + the ask
          </div>
          <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
            What can go wrong.
            <span className="italic font-normal text-accent"> What we're asking for.</span>
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-[2vw] min-h-0">
          <div className="col-span-7 rounded-[0.4vw] p-[2vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="flex items-baseline justify-between mb-[1.4vh]">
              <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted">
                Top six risks · with mitigation
              </div>
              <div className="font-mono text-[1vw] text-muted">Detailed risk register in appendix</div>
            </div>

            <div className="grid grid-cols-12 gap-x-[1.2vw] gap-y-[1.2vh] font-body text-[1vw] leading-[1.4]">
              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">01</div>
              <div className="col-span-5 text-primary font-semibold">Internet outages</div>
              <div className="col-span-6 text-muted">Offline POS · paper fallback SOP · weekly forced sync</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">02</div>
              <div className="col-span-5 text-primary font-semibold">Freight delays in shoulder seasons</div>
              <div className="col-span-6 text-muted">Buffer inventory · contracted air-freight contingency</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">03</div>
              <div className="col-span-5 text-primary font-semibold">Supplier minimums above store demand</div>
              <div className="col-span-6 text-muted">807 aggregates demand across the NW Ontario route</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">04</div>
              <div className="col-span-5 text-primary font-semibold">NWC competitive response</div>
              <div className="col-span-6 text-muted">Community-owned identity is the moat NWC cannot match</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">05</div>
              <div className="col-span-5 text-primary font-semibold">Local political risk inside the band</div>
              <div className="col-span-6 text-muted">Band-council seat on store oversight · transparent governance</div>

              <div className="col-span-12 h-px bg-rule" />

              <div className="col-span-1 font-mono text-accent text-[1.1vw] pt-[0.2vh]">06</div>
              <div className="col-span-5 text-primary font-semibold">Spoilage + housing liability</div>
              <div className="col-span-6 text-muted">Cold-chain SOP · commercial GL with rotational-housing rider</div>
            </div>
          </div>

          <div className="col-span-5 rounded-[0.4vw] p-[2vw] flex flex-col" style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}>
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] mb-[1vh]" style={{ color: "#e9c8a8" }}>
              The ask
            </div>
            <div className="font-display text-[2.2vw] leading-tight font-medium mb-[2vh]">
              One conversation. An honest read. An introduction on your timing.
            </div>

            <div className="space-y-[1.4vh] font-body text-[1.05vw] leading-[1.45] opacity-95">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>An hour with the contractor — in person if possible. No deck. No slides.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>An honest read on where this plan is right and where it's wrong.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-[1vw] pt-[0.3vh] shrink-0" style={{ color: "#e9c8a8" }}>→</div>
                <div>An introduction to the band council on the contractor's timing — never on ours.</div>
              </div>
            </div>

            <div className="mt-auto pt-[2vh] border-t" style={{ borderColor: "rgba(244,237,224,0.25)" }}>
              <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-70 mb-[0.5vh]">
                What we are not asking for
              </div>
              <div className="font-body text-[1.1vw] leading-[1.45] opacity-85">
                No cash up front. No equity. No exclusive supplier agreement before we've earned it. No commitment from the band before the contractor is ready.
              </div>
              <div className="font-display italic text-[1.1vw] mt-[1.4vh]" style={{ color: "#e9c8a8" }}>
                — 807 Food Co-operative Inc. · Operating Partner
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
