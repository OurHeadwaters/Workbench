export default function Winter() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VIII · 09 — Winter contingency
            </div>
            <h2
              className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              The plan that
              <span className="italic font-normal text-accent"> bends without breaking.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.15vw] text-muted leading-[1.4]">
            Pent-up kids, two mess resets a day, dark by 4:30. The structure
            absorbs it — I don't.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1vh]">
              What scales up
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1.5vh]">
              The team works harder so I don't.
            </div>
            <div className="space-y-[1.2vh] font-body text-[1.1vw] text-text leading-[1.45]">
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">→</div><div>Tutor: 2 hrs/wk → 10 hrs/wk. Two real mornings, two real afternoons.</div></div>
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">→</div><div>Ops manager absorbs more delivery coordination — winter freight is unforgiving.</div></div>
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">→</div><div>Housecleaner adds a half-day in the worst weeks. Same rate, more value.</div></div>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1vh]">
              What gets dropped
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1.5vh]">
              Without guilt. On purpose.
            </div>
            <div className="space-y-[1.2vh] font-body text-[1.1vw] text-text leading-[1.45]">
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">→</div><div>Optional weekend deep-work block: default no, no exceptions.</div></div>
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">→</div><div>Travel north that isn't on the contract. The flights aren't worth it in February.</div></div>
              <div className="flex gap-[0.8vw]"><div className="text-accent w-[1vw]">→</div><div>The "ambitious office day." Three solid hours of real work beats a fake eight.</div></div>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.95vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              What stays exactly the same
            </div>
            <div className="font-display text-[1.7vw] leading-tight font-medium mb-[1.5vh]">
              The non-negotiables.
            </div>
            <div className="space-y-[1.2vh] font-body text-[1.1vw] leading-[1.45] opacity-95">
              <div className="flex gap-[0.8vw]"><div style={{ color: "#e9c8a8" }} className="w-[1vw]">→</div><div>Phone-free until 10am.</div></div>
              <div className="flex gap-[0.8vw]"><div style={{ color: "#e9c8a8" }} className="w-[1vw]">→</div><div>The 7–10am window with the kids.</div></div>
              <div className="flex gap-[0.8vw]"><div style={{ color: "#e9c8a8" }} className="w-[1vw]">→</div><div>Dinner already prepared.</div></div>
              <div className="flex gap-[0.8vw]"><div style={{ color: "#e9c8a8" }} className="w-[1vw]">→</div><div>Two daily check-ins, no exceptions.</div></div>
            </div>
            <div
              className="mt-[2vh] pt-[1.5vh] border-t font-mono text-[0.95vw] opacity-80"
              style={{ borderColor: "rgba(244,237,224,0.3)" }}
            >
              If winter breaks any of these, the structure has failed — not me.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
