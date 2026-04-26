export default function ThreeRevenueLayers() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Three revenue layers · 03
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            The product, sold three ways
          </div>
        </div>

        <h1 className="font-display font-medium text-[4.4vw] leading-[0.98] tracking-tight text-primary mb-[1vh]" style={{ textWrap: "balance" }}>
          Headwaters is a product company.
        </h1>
        <div className="font-display italic text-[1.55vw] text-muted mb-[3vh] max-w-[70vw]">
          One company, three revenue layers. The software is the spine. The tech stack scales with every band added. The training programs travel.
        </div>

        <div className="grid grid-cols-3 gap-[1.8vw] flex-1">
          <div className="bg-paper px-[1.8vw] py-[2.5vh] flex flex-col rounded-[6px]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-primary mb-[0.8vh] font-semibold">
              Layer One · Software
            </div>
            <div className="font-display text-[2.1vw] leading-[1.05] text-primary mb-[1.5vh]">
              Deer Lake recurring contract
            </div>
            <div className="font-display font-semibold text-[3vw] text-primary leading-[1] mb-[0.4vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $420,000
            </div>
            <div className="font-mono text-[1vw] text-muted mb-[2vh]">
              /yr · $35,000/mo · locked
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text mb-[1.5vh]">
              Bundled deliverable: license, ongoing dev, practitioner advisory, monthly visit, Dryden Hub coordination, three training cohorts.
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text">
              <span className="text-primary font-semibold">Software is owned by the band</span> and reused across every band that adopts it.
            </div>
          </div>

          <div className="bg-paper px-[1.8vw] py-[2.5vh] flex flex-col rounded-[6px] border-t-[3px] border-accent">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-accent mb-[0.8vh] font-semibold">
              Layer Two · Tech Stack at Markup
            </div>
            <div className="font-display text-[2.1vw] leading-[1.05] text-primary mb-[1.5vh]">
              Hybrid pricing, tiered hardware
            </div>
            <div className="font-display font-semibold text-[3vw] text-accent leading-[1] mb-[0.4vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              ~$5,000
            </div>
            <div className="font-mono text-[1vw] text-muted mb-[2vh]">
              /yr Y1 · scales hard with bands
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text mb-[1.5vh]">
              Pass-through SaaS at cost + tiered hardware kit (3 / 6 / 12 devices, scales with team) + $400/mo managed-services fee.
            </div>
            <div className="font-body text-[1.2vw] leading-[1.5] text-text">
              <span className="text-primary font-semibold">Loss is baked into the kit pricing.</span> Stuff gets lent and goes missing — the system honours that, not the other way around.
            </div>
          </div>

          <div className="bg-paper px-[1.8vw] py-[2.5vh] flex flex-col rounded-[6px]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-primary mb-[0.8vh] font-semibold">
              Layer Three · Training & cross-reserve install
            </div>
            <div className="font-display text-[2.1vw] leading-[1.05] text-primary mb-[1.5vh]">
              In-Deer-Lake cohorts + premium installs at the next reserves
            </div>
            <div className="font-display font-semibold text-[3vw] text-primary leading-[1] mb-[0.4vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              $5,500
            </div>
            <div className="font-mono text-[1vw] text-muted mb-[1.5vh]">
              /cohort · 3/yr in Deer Lake bundle · curriculum partner on retainer
            </div>
            <div className="font-body text-[1.15vw] leading-[1.45] text-text mb-[1.2vh]">
              <span className="text-primary font-semibold">Cross-reserve install (premium):</span> the practitioner — not a Deer Lake grad — travels reserve to reserve to install the Codetry discipline. Receiving reserve pays <span className="font-semibold">$3,500/on-site day · $1,800/remote day · $30,000/yr discipline-keeper retainer</span>. Travel, lodging, food are passed through at cost.
            </div>
            <div className="font-body text-[1.15vw] leading-[1.5] text-text">
              <span className="text-primary font-semibold">~$148,500 per new reserve install + $30k/yr ongoing.</span> Successor is local <em>to each receiving reserve</em>, after the practitioner has installed the discipline there — Deer Lake grads steward Deer Lake; they don't get sent on the road.
            </div>
          </div>
        </div>

        <div className="mt-[2.5vh] flex items-center justify-between border-t border-rule pt-[1.5vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted">
            Carry-over from V2
          </div>
          <div className="font-body text-[1.05vw] text-muted">
            Salts $1,298/yr net · 807 CDP grant $20,500 one-time when collected
          </div>
        </div>
      </div>
    </div>
  );
}
