export default function StaffingModel() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              03 · Staffing
            </div>
            <h2 className="font-display text-[4vw] leading-[1] tracking-tight text-primary font-medium">
              The Outback model.
              <span className="italic font-normal text-accent"> Adapted for Deer Lake.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[34vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              Project's biggest single risk
            </div>
            <div className="font-body text-[1.25vw] text-primary leading-[1.35]">
              Staffing won't solve itself locally on day one — and depending on it to is how Northern stores collapse. The fix is pre-built elsewhere.
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-[1.4vw] min-h-0 mb-[2.5vh]">
          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">01 · SETUP</div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              4-on / 2-off rotations
            </div>
            <div className="font-body text-[1vw] text-muted leading-[1.45]">
              Free band-provided housing as part of comp. Banked hours, no overhead. The housing problem becomes the recruiting hook.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">02 · THE PITCH</div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              Working-holiday economics
            </div>
            <div className="font-body text-[1vw] text-muted leading-[1.45]">
              Same shape as outback Australia mining work. Sample: $25/hr × 60 hr/wk × 9 rotations ≈ <span className="text-primary font-semibold">$54k banked, rent paid for</span>.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">03 · WIND-DOWN</div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              Year-1 mix flips
            </div>
            <div className="font-body text-[1vw] text-muted leading-[1.45]">
              Month 1: ~80% rotational / 20% local. Month 12: ~20% rotational / 80% local. Local-hire training pipeline runs continuously from month 2.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.6vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[1.05vw] text-accent font-semibold mb-[1vh]">04 · WHY IT WORKS</div>
            <div className="font-display text-[1.55vw] leading-tight text-primary font-medium mb-[1vh]">
              Bench depth without a wait
            </div>
            <div className="font-body text-[1vw] text-muted leading-[1.45]">
              Rotational outsider <span className="text-primary font-semibold">is</span> the trainer. Local hire <span className="text-primary font-semibold">is</span> the future manager. Solves what NWC's local-only model can't.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[2vw]"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div className="flex items-center justify-between mb-[1.4vh]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] opacity-80">
              12-month staffing wind-down
            </div>
            <div className="font-mono text-[1.05vw] opacity-70">
              <span style={{ color: "#e9c8a8" }}>■</span> Rotational outsider · <span className="opacity-80">■</span> Local hire
            </div>
          </div>
          <div className="grid grid-cols-12 gap-[0.8vw] items-end h-[12vh]">
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "80%", background: "#e9c8a8" }} /><div style={{ height: "20%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M1</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "78%", background: "#e9c8a8" }} /><div style={{ height: "22%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M2</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "72%", background: "#e9c8a8" }} /><div style={{ height: "28%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M3</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "65%", background: "#e9c8a8" }} /><div style={{ height: "35%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M4</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "58%", background: "#e9c8a8" }} /><div style={{ height: "42%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M5</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "52%", background: "#e9c8a8" }} /><div style={{ height: "48%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M6</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "46%", background: "#e9c8a8" }} /><div style={{ height: "54%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M7</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "40%", background: "#e9c8a8" }} /><div style={{ height: "60%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M8</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "34%", background: "#e9c8a8" }} /><div style={{ height: "66%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M9</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "28%", background: "#e9c8a8" }} /><div style={{ height: "72%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M10</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "24%", background: "#e9c8a8" }} /><div style={{ height: "76%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M11</div></div>
            <div className="flex flex-col items-center gap-[0.6vh]"><div className="w-full flex flex-col h-full justify-end"><div style={{ height: "20%", background: "#e9c8a8" }} /><div style={{ height: "80%", background: "rgba(244,237,224,0.35)" }} /></div><div className="font-mono text-[1vw] opacity-75">M12</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
