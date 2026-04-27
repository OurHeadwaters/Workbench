export default function SupplyChain() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
            How groceries get here
          </div>
          <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
            Three ways in.
            <span className="italic font-normal text-accent"> One shelf, planned out carefully.</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-[1.5vw] mb-[3vh]">
          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="flex items-center gap-[0.6vw] mb-[1.2vh]">
              <div className="font-mono text-[1.05vw] text-accent font-semibold">WAY 1</div>
              <div className="flex-1 h-[1px] bg-rule" />
              <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted">The truck already on the route</div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
              Thunder Bay → Sioux Lookout → Dryden
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.4]">
              A family-run cold truck and driver. They already move food on this road every two weeks. Deer Lake joins the route in May 2026.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="flex items-center gap-[0.6vw] mb-[1.2vh]">
              <div className="font-mono text-[1.05vw] text-accent font-semibold">WAY 2</div>
              <div className="flex-1 h-[1px] bg-rule" />
              <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted">The winter-road truck we will add</div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
              Dryden → Deer Lake (winter road truck)
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.4]">
              A second truck built for the winter road. Paid for by the federal Local Food Infrastructure Fund (a grant program for food projects) when it opens up again. Our partner on it is Local Food and Farm Co-operatives. We keep it separate from the Thunder Bay truck on purpose. If one truck breaks down, the other still runs.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="flex items-center gap-[0.6vw] mb-[1.2vh]">
              <div className="font-mono text-[1.05vw] text-accent font-semibold">WAY 3</div>
              <div className="flex-1 h-[1px] bg-rule" />
              <div className="font-mono uppercase tracking-[0.18em] text-[1vw] text-muted">Flying it in when the road is closed</div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1vh]">
              Flown in (April to November)
            </div>
            <div className="font-body text-[1.05vw] text-muted leading-[1.4]">
              Wasaya, Bearskin, and North Star Air bring fresh food in by plane. They cover the months the winter road can not be used. We keep extra food on the shelf for the weeks in between.
            </div>
          </div>
        </div>

        <div
          className="flex-1 rounded-[0.4vw] p-[2.4vw] grid grid-cols-12 gap-[2vw] min-h-0"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div className="col-span-4">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] opacity-75 mb-[1vh]">
              What's on the shelf
            </div>
            <div className="font-display text-[2.2vw] leading-tight font-medium mb-[1.5vh]">
              Local food first. Regional food next. Big brands direct.
            </div>
            <div className="font-body text-[1.05vw] opacity-85 leading-[1.5]">
              The federal grocery help money shows up in the shelf price. For items that do not qualify for the help money, the shipping cost is printed on the tag. Nothing is hidden. Families stop flying to Winnipeg for what should be here at home.
            </div>
          </div>

          <div className="col-span-8 grid grid-cols-2 gap-x-[2vw] gap-y-[1.6vh]">
            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[1.05vw] mb-[0.6vh]" style={{ color: "#e9c8a8" }}>
                From Deer Lake itself
              </div>
              <div className="font-body text-[1.15vw] leading-[1.4] opacity-95">
                Local food goes on the shelf first. People know what they are picking up because it comes from home.
              </div>
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[1.05vw] mb-[0.6vh]" style={{ color: "#e9c8a8" }}>
                Fresh from regional farms
              </div>
              <div className="font-body text-[1.15vw] leading-[1.4] opacity-95">
                Slate River Dairy, Thunder Oak, Belluz, Sleepy G. Plus eggs, meat, and baked goods picked up on the same route.
              </div>
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[1.05vw] mb-[0.6vh]" style={{ color: "#e9c8a8" }}>
                Everyday staples by the pallet
              </div>
              <div className="font-body text-[1.15vw] leading-[1.4] opacity-95">
                Sysco Canada, Gordon Food Service, and Federated Co-operatives bring the everyday items in by the pallet. Buying in big amounts keeps the price low.
              </div>
            </div>
            <div>
              <div className="font-mono uppercase tracking-[0.18em] text-[1.05vw] mb-[0.6vh]" style={{ color: "#e9c8a8" }}>
                Northern household brands
              </div>
              <div className="font-body text-[1.15vw] leading-[1.4] opacity-95">
                Robin Hood flour 10kg, Carnation, Klik, Tang, Kraft Dinner, Bimbo bread. The brands people already buy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
