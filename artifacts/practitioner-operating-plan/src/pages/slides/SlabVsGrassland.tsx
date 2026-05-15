export default function SlabVsGrassland() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-center gap-[1vw] mb-[3vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Foundation thesis
          </div>
        </div>
        <h1 className="font-display font-medium text-[5.4vw] leading-[0.98] tracking-tight text-paper mb-[1.5vh]" style={{ textWrap: "balance" }}>
          The slab cracks.
          <span className="block italic font-normal text-accent">The grassland holds.</span>
        </h1>
        <div className="font-display italic text-[1.7vw] text-muted mb-[4vh] max-w-[68vw]">
          V2 priced one slab of work for one client. V3 plants something with roots —
          three revenue layers, many band relationships, a system that survives any one person leaving.
        </div>
        <div className="grid grid-cols-2 gap-[2.5vw] flex-1">
          <div className="border-l-[4px] border-rule pl-[2vw] flex flex-col">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted mb-[1vh]">The slab — V2</div>
            <ul className="font-body text-[1.15vw] text-muted leading-[1.7] space-y-[0.8vh]">
              <li>One client. One contract.</li>
              <li>Capital Recovery only when the slab holds.</li>
              <li>One person carries everything.</li>
              <li>Brittle by design.</li>
            </ul>
          </div>
          <div className="border-l-[4px] border-primary pl-[2vw] flex flex-col bg-paper rounded-r-[8px] py-[2.5vh] pr-[2vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-primary mb-[1vh]">The grassland — V3</div>
            <ul className="font-body text-[1.15vw] text-text leading-[1.7] space-y-[0.8vh]">
              <li>Three revenue layers. Many band relationships.</li>
              <li>Software owned by the bands. Reused across every reserve.</li>
              <li>Six people. No single point of failure.</li>
              <li>Rooted — survives any one person leaving.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
