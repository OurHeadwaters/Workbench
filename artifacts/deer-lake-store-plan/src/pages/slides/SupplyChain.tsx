export default function SupplyChain() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            02 · Supply chain
          </div>
          <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
            Three lanes in.
            <span className="italic font-normal text-accent"> One curated shelf.</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-[1.5vw] mb-[3vh]">
          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="flex items-center gap-[0.6vw] mb-[1.2vh]">
              <div className="font-mono text-[1.05vw] text-accent font-semibold">LANE 1</div>
              <div className="flex-1 h-[1px] bg-rule" />
              <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted">Existing</div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
              Tbay → Sioux Lookout → Dryden
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.4]">
              807's bi-weekly producer lane. Refurbished cold trailer + paid driver, formalising May 2026 (AGM capital project).
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="flex items-center gap-[0.6vw] mb-[1.2vh]">
              <div className="font-mono text-[1.05vw] text-accent font-semibold">LANE 2</div>
              <div className="flex-1 h-[1px] bg-rule" />
              <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted">Proposed</div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
              Dryden → Deer Lake (ice-road truck)
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.4]">
              Ice-road-rated second vehicle. LFIF (when reopens) via LFFC partnership — deliberately a separate envelope from Lane 1.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="flex items-center gap-[0.6vw] mb-[1.2vh]">
              <div className="font-mono text-[1.05vw] text-accent font-semibold">LANE 3</div>
              <div className="flex-1 h-[1px] bg-rule" />
              <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted">Shoulder season</div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
              Air freight (Apr–Nov)
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.4]">
              Wasaya, Bearskin, North Star Air for perishables when the winter road is closed. Buffer inventory carries the gap.
            </div>
          </div>
        </div>

        <div
          className="flex-1 rounded-[0.4vw] p-[2.4vw] grid grid-cols-12 gap-[2vw] min-h-0"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div className="col-span-4">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] opacity-75 mb-[1vh]">
              The shelf
            </div>
            <div className="font-display text-[2.2vw] leading-tight font-medium mb-[1.5vh]">
              Local first. Regional second. Northern brand basics direct.
            </div>
            <div className="font-body text-[1.05vw] opacity-85 leading-[1.5]">
              Nutrition North-eligible items priced after subsidy pass-through. Ineligible items show transparent freight cost on the shelf tag — no hidden markups.
            </div>
          </div>

          <div className="col-span-8 grid grid-cols-2 gap-x-[2vw] gap-y-[1.6vh]">
            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[1.05vw] mb-[0.6vh]" style={{ color: "#e9c8a8" }}>
                Local · Deer Lake
              </div>
              <div className="font-body text-[1.15vw] leading-[1.4] opacity-95">
                Onboarded onto 807's platform. Carry local first; community recognises the shelf.
              </div>
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[1.05vw] mb-[0.6vh]" style={{ color: "#e9c8a8" }}>
                Fresh · 807 producers
              </div>
              <div className="font-body text-[1.15vw] leading-[1.4] opacity-95">
                Slate River Dairy, Thunder Oak, Belluz, Sleepy G, eggs, meat, baked.
              </div>
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[1.05vw] mb-[0.6vh]" style={{ color: "#e9c8a8" }}>
                Broadline staples
              </div>
              <div className="font-body text-[1.15vw] leading-[1.4] opacity-95">
                Sysco Canada, GFS Canada, Federated Co-operatives — pallet-economics SKUs.
              </div>
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[1.05vw] mb-[0.6vh]" style={{ color: "#e9c8a8" }}>
                Northern brand basics
              </div>
              <div className="font-body text-[1.15vw] leading-[1.4] opacity-95">
                Robin Hood flour 10kg, Carnation, Klik, Tang, Kraft Dinner, Bimbo bread.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
