export default function DailyRhythm() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              III · 02 — Daily rhythm
            </div>
            <h2 className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium">
              Same shape, different season.
              <span className="italic font-normal text-accent"> Winter is the part that breaks plans.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.1vw] text-muted leading-[1.4]">
            Pent-up kids, wet gear, three mess resets a day. If the schedule
            doesn't survive February, it doesn't survive the year.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.6vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="flex items-baseline justify-between mb-[1.5vh]">
              <div className="font-mono uppercase tracking-[0.24em] text-[1.05vw] text-accent font-semibold">
                Summer rhythm
              </div>
              <div className="font-mono text-[0.95vw] text-muted">
                May → September
              </div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[2vh]">
              Long light. Outside is the third parent.
            </div>
            <div className="space-y-[1.3vh] text-[1.1vw] text-text leading-[1.45] font-body">
              <div className="flex gap-[1vw]">
                <div className="font-mono text-primary font-semibold w-[5.5vw] shrink-0">
                  6:30
                </div>
                <div>Up alone. Coffee. One page in the journal.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-primary font-semibold w-[5.5vw] shrink-0">
                  7–10
                </div>
                <div>
                  Kids. Slow breakfast, schoolwork in short bursts, outside by 9.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-primary font-semibold w-[5.5vw] shrink-0">
                  10:30–4
                </div>
                <div>Work block. Calls bookended, no afternoon creep.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-primary font-semibold w-[5.5vw] shrink-0">
                  4 onward
                </div>
                <div>Dinner already prepped. Outside until tired.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div className="font-mono text-primary font-semibold w-[5.5vw] shrink-0">
                  Evening
                </div>
                <div>Phone parked. Read, write, or nothing at all.</div>
              </div>
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div className="flex items-baseline justify-between mb-[1.5vh]">
              <div
                className="font-mono uppercase tracking-[0.24em] text-[1.05vw] font-semibold"
                style={{ color: "#e9c8a8" }}
              >
                Winter rhythm
              </div>
              <div className="font-mono text-[0.95vw] opacity-70">
                November → April
              </div>
            </div>
            <div className="font-display text-[1.7vw] leading-tight font-medium mb-[2vh]">
              Short light. The house is the field of play.
            </div>
            <div className="space-y-[1.3vh] text-[1.1vw] leading-[1.45] font-body opacity-95">
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono font-semibold w-[5.5vw] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  6:30
                </div>
                <div>Same. The dark hour belongs to me before anyone else.</div>
              </div>
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono font-semibold w-[5.5vw] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  7–10
                </div>
                <div>
                  Kids — but with the tutor in the room two mornings a week.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono font-semibold w-[5.5vw] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  10:30–6
                </div>
                <div>
                  Longer work block. Dryden absorbs the field calls so I don't
                  have to.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono font-semibold w-[5.5vw] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  4 onward
                </div>
                <div>
                  Housecleaner Tuesdays — so the mess reset isn't on me.
                </div>
              </div>
              <div className="flex gap-[1vw]">
                <div
                  className="font-mono font-semibold w-[5.5vw] shrink-0"
                  style={{ color: "#e9c8a8" }}
                >
                  Evening
                </div>
                <div>
                  Lights low, board games, books. No second wind of email.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
