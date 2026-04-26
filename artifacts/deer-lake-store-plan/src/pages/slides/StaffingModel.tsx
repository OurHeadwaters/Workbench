export default function StaffingModel() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              Who works the store
            </div>
            <h2 className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium">
              The store is built to keep working
              <span className="italic font-normal text-accent"> when people don't show up.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[34vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              The honest design constraint
            </div>
            <div className="font-body text-[1.25vw] text-primary leading-[1.35]">
              Hunting season, funerals, hockey tournaments, bad weather days. Northern stores collapse when the operating model assumes everyone shows up every day. This one assumes the opposite.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[1.6vw] mb-[2vh] flex items-center justify-between gap-[2vw]"
          style={{ background: "var(--slide-paper)", borderLeft: "0.4vw solid var(--slide-accent)" }}
        >
          <div className="shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[0.4vh]">
              Whose store this is
            </div>
            <div className="font-display text-[1.5vw] leading-tight text-primary font-medium">
              The band runs the store. Headwaters delivers the operating system.
            </div>
          </div>
          <div className="font-body text-[1vw] text-text leading-[1.45] max-w-[52vw]">
            Hiring, scheduling, day-to-day decisions, ownership — the band's. Software, training, the transparency stack, monthly visits — Headwaters'. The freight on the route — the family-run refrigerated truck already operating Thunder Bay → Sioux Lookout → Dryden every two weeks. <span className="text-primary font-semibold">Nobody flies in to run the store. Nobody needs to.</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-5 gap-[1.2vw] min-h-0 mb-[2vh]">
          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">PODS, NOT ROLES</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              Everyone can cover the floor
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              The till, the cooler, the stockroom, the daily books at a basic level. When two people don't show up on a Tuesday, the store still opens.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">CASUAL LOCAL POD</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              Paid by the job, on call
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              A small group of community members called in for batch days, market tables, big restocks. Local employment line. No imported labour. No flown-in embed.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">SOFTWARE COVERS THE GAPS</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              The store runs when nobody's there
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              Reorder rules, end-of-day, freight tracking, daily books — automated where they can be. The till works offline. The manager doesn't need to be in the building to know what's happening.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">SHIFT AS A MARKET</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              Open shifts go to whoever picks them up
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              The board posts what needs covering and what it pays. People grab what fits their week. Nobody is on the hook for a shift they couldn't make — and the store doesn't go dark waiting for them.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">CALENDAR THAT BENDS</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              Built around community life
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              Hunting season, funerals, hockey tournaments, treaty days. Hours flex by default — nothing about the store assumes a southern work week.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] px-[1.6vw] py-[1.2vw] grid grid-cols-12 gap-[1.4vw] items-start"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div className="col-span-3">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] mb-[0.4vh]" style={{ color: "#e9c8a8" }}>
              The Headwaters team that delivers
            </div>
            <div className="font-display text-[1.25vw] leading-tight font-medium">
              On the ground often enough to keep it real, not so often the band starts depending on us.
            </div>
          </div>
          <div className="col-span-9 grid grid-cols-3 gap-x-[1.2vw] gap-y-[0.5vh] font-body text-[0.78vw] leading-[1.35] opacity-95">
            <div>
              <span className="font-semibold">Practitioner</span> — software, training delivery, monthly Deer Lake visit. Carries the relationship and the codebase.
            </div>
            <div>
              <span className="font-semibold">Dryden hub operator</span> — based at the Dryden shop. Salt + piecework + Deer Lake order coordination + phone. Absorbs Food Handler and Ops Manager from earlier drafts.
            </div>
            <div>
              <span className="font-semibold">Bookkeeper, part-time, remote</span> — reconciliation, monthly close, payroll prep. Off the store's payroll.
            </div>
            <div>
              <span className="font-semibold">Technical advisor on retainer</span> — quarterly architecture review, code review on money-touching merges. Hedge against solo-developer risk.
            </div>
            <div>
              <span className="font-semibold">Training &amp; curriculum partner</span> — Indigenous educator voice. Three cohorts a year. Train-the-trainer is the design, not a stretch goal.
            </div>
            <div>
              <span className="font-semibold">Casual local pod in Deer Lake</span> — paid by the job for batch days and market tables. Local employment line. No flown-in embed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
