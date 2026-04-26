export default function SlabVsGrassland() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Foundation thesis · 01
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Why V3 reads differently from V2
          </div>
        </div>

        <h1 className="font-display font-medium text-[5.4vw] leading-[0.98] tracking-tight text-primary mb-[1.5vh]" style={{ textWrap: "balance" }}>
          The slab cracks.
          <span className="block italic font-normal text-accent">The grassland holds.</span>
        </h1>
        <div className="font-display italic text-[1.7vw] text-muted mb-[4vh] max-w-[68vw]">
          V2 priced one slab of work for one client. V3 plants something with roots — three revenue layers, many band relationships, a system that survives any one person leaving.
        </div>

        <div className="grid grid-cols-2 gap-[2.5vw] flex-1">
          <div className="border-l-[4px] border-rule pl-[2vw] flex flex-col">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[1vh]">
              The slab — what V3 isn't
            </div>
            <h2 className="font-display text-[2.6vw] leading-[1.05] text-primary mb-[2.5vh]">
              One client. One contract. One person carries it.
            </h2>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text mb-[1.4vh]">
              <span className="text-accent font-semibold">·</span> One revenue stream, sized to fund everything alone
            </div>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text mb-[1.4vh]">
              <span className="text-accent font-semibold">·</span> Headwaters runs the store; the band watches
            </div>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text mb-[1.4vh]">
              <span className="text-accent font-semibold">·</span> Brittle to a single departure or burnout
            </div>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text mb-[1.4vh]">
              <span className="text-accent font-semibold">·</span> Margin from staffing, not from a system
            </div>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text">
              <span className="text-accent font-semibold">·</span> Capital Recovery only when the slab holds
            </div>
          </div>

          <div className="border-l-[4px] border-primary pl-[2vw] flex flex-col bg-paper rounded-r-[8px] py-[2.5vh] pr-[2vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-primary mb-[1vh]">
              The grassland — what V3 is
            </div>
            <h2 className="font-display text-[2.6vw] leading-[1.05] text-primary mb-[2.5vh]">
              Three product layers. Many bands. A system with roots.
            </h2>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text mb-[1.4vh]">
              <span className="text-primary font-semibold">·</span> Software, tech stack at markup, training — sold three ways
            </div>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text mb-[1.4vh]">
              <span className="text-primary font-semibold">·</span> Band staffs and runs the store; Headwaters builds the system
            </div>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text mb-[1.4vh]">
              <span className="text-primary font-semibold">·</span> Roots that hold when any one role moves on
            </div>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text mb-[1.4vh]">
              <span className="text-primary font-semibold">·</span> Real value built into software the band owns
            </div>
            <div className="font-body text-[1.35vw] leading-[1.55] text-text">
              <span className="text-primary font-semibold">·</span> Margin from the system, scales with every band added
            </div>
          </div>
        </div>

        <div className="mt-[3vh] flex items-center justify-between border-t border-rule pt-[2vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            V3 is the grassland thesis
          </div>
          <div className="font-display italic text-[1.4vw] text-muted">
            Every locked number that follows is sized for it.
          </div>
        </div>
      </div>
    </div>
  );
}
