import { Reveal } from "../plannerReveal";

export default function ColdChain() {
  const lanes = [
    { tag: "Lane 1 · The truck already on the road", head: "Thunder Bay → Sioux Lookout → Dryden", body: "A family-run cold truck. Already on this road every two weeks. The community joins the route." },
    { tag: "Lane 2 · The winter-road truck we add", head: "Dryden → community (winter road)", body: "A second truck for the winter road. Funded by the federal Local Food Infrastructure Fund. Kept separate on purpose." },
    { tag: "Lane 3 · Plane when the road is closed", head: "Flown in (April to November)", body: "Wasaya, Bearskin, and North Star Air. Extra stock on the shelf covers the gap weeks." },
  ];

  return (
    <section id="cs-cold-chain" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>How groceries get here</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          Three lanes in.
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>One shelf, planned out carefully.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>The operator couple loads each truck from Local Line. The cockpit watches lead times, weather, and the road status — so the truck still leaves Dryden on time the week one of them is at a funeral.</p>
        <div className="mt-7 space-y-3">
          {lanes.map((lane) => (
            <div key={lane.tag} className="rounded-2xl p-5 border" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
              <div className="text-[10.5px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{lane.tag}</div>
              <div className="text-[20px] leading-[1.25] font-medium" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{lane.head}</div>
              <div className="text-[15.5px] leading-[1.5] mt-2" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{lane.body}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <Reveal label="Why two trucks instead of one">
            <p>The two trucks are kept separate on purpose. If one truck breaks down, the other still runs. A single truck is a single point of failure for the whole shelf.</p>
          </Reveal>
          <Reveal label="What's on the shelf" variant="ink">
            <p><span className="font-semibold">Local first.</span> Local food goes on the shelf first. People know it comes from home.</p>
            <p><span className="font-semibold">Regional next.</span> Slate River Dairy, Thunder Oak, Belluz, Sleepy G. Eggs, meat, and baked goods on the same route.</p>
            <p><span className="font-semibold">Big brands direct.</span> Sysco, Gordon Food Service, Federated Co-operatives. Big orders keep the price low.</p>
            <p><span className="font-semibold">Northern household brands.</span> Robin Hood flour, Carnation, Klik, Tang, Kraft Dinner, Bimbo bread. The brands people already buy.</p>
          </Reveal>
          <Reveal label="How shipping shows up on the price tag">
            <p>The federal grocery help shows up on the price tag. Shipping cost is printed where you can see it.</p>
            <p>Items without help money show their shipping on the tag. People see what they pay for, and why.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
