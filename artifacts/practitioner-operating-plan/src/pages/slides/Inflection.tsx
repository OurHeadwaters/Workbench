export default function Inflection() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div
        className="absolute top-0 left-0 h-full w-[42vw]"
        style={{
          background:
            "linear-gradient(180deg, var(--slide-paper) 0%, var(--slide-bg) 100%)",
        }}
      />
      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] grid grid-cols-12 gap-[3vw]">
        <div className="col-span-5 flex flex-col justify-between">
          <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted">
            00 · Why this matters
          </div>
          <div>
            <div
              className="font-display font-light italic text-[3.6vw] leading-[1.05] text-primary"
              style={{ textWrap: "balance" }}
            >
              The first contract big enough to change the shape of the next ten
              years.
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Said quietly, to myself, before saying yes.
          </div>
        </div>

        <div className="col-span-7 flex flex-col justify-center">
          <h2
            className="font-display text-[4.6vw] leading-[1.02] tracking-tight text-primary font-medium mb-[3vh]"
            style={{ textWrap: "balance" }}
          >
            This contract is the
            <span className="italic font-normal text-accent"> inflection point.</span>
          </h2>

          <div className="space-y-[2vh] font-body text-[1.55vw] leading-[1.5] text-text max-w-[44vw]">
            <div>
              Real money. Real legitimacy. The seed capital that turns a
              practitioner into an agency.
            </div>
            <div className="text-muted text-[1.4vw]">
              And — if I take it the wrong way — the thing that swallows the
              mornings with the kids, the evenings with my own head, and the
              version of me that anyone wants working on year three.
            </div>
            <div className="pt-[1.5vh] border-t border-rule text-primary font-semibold">
              So the only honest question is:&nbsp;
              <span className="italic font-normal">
                what does the yes have to look like to stay a yes?
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
