import {
  failureModesByTheme,
  sourcesFooterLine,
  COUNTER_EXAMPLES,
  type FailureMode,
} from "@workspace/why-stores-fail";

export default function WhyStoresFailFinancing() {
  const grouped = failureModesByTheme();
  const modes: FailureMode[] = grouped["producer-financing"];
  const sources = sourcesFooterLine(modes);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div className="max-w-[78%]">
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              01c · Why current stores fail · Theme 04 of 04
            </div>
            <h2 className="font-display text-[3.6vw] leading-[1.05] tracking-tight text-primary font-medium">
              Producer & financing side.
              <span className="italic font-normal text-accent">
                {" "}
                Why the small farms and harvesters who could supply it never get a chance.
              </span>
            </h2>
          </div>
          <div className="text-right shrink-0 pl-[2vw]">
            <div className="font-display text-[4vw] leading-none text-accent font-semibold">
              {modes.length}
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.95vw] text-muted mt-[0.6vh]">
              named failure modes
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[1.5vw] mb-[2.5vh]">
          {modes.map((mode, i) => (
            <ModeCard key={mode.id} mode={mode} index={i} />
          ))}
        </div>

        <div
          className="rounded-[0.4vw] p-[1.6vw] grid grid-cols-12 gap-[1.5vw] mb-[2vh]"
          style={{ background: "var(--slide-paper)" }}
        >
          <div className="col-span-3">
            <div className="font-mono uppercase tracking-[0.22em] text-[1vw] text-muted mb-[0.6vh]">
              It doesn't have to fail
            </div>
            <div className="font-display text-[1.5vw] leading-tight text-primary font-medium">
              Two working counter-examples — both community-owned.
            </div>
          </div>
          {COUNTER_EXAMPLES.map((ex) => (
            <div key={ex.name} className="col-span-4 flex flex-col">
              <div className="font-display text-[1.4vw] leading-tight text-accent font-semibold mb-[0.6vh]">
                {ex.name}
              </div>
              <div className="font-body text-[0.95vw] leading-[1.4] text-muted">
                {ex.detail}
              </div>
            </div>
          ))}
          <div className="col-span-1 flex items-end justify-end">
            <div className="font-mono text-[0.85vw] uppercase tracking-[0.18em] text-muted opacity-70 text-right leading-tight">
              Next →<br />
              Supply chain
            </div>
          </div>
        </div>

        <div className="mt-auto pt-[1.5vh] border-t border-rule">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.6vh]">
            Sources
          </div>
          <div className="font-mono text-[0.95vw] text-primary leading-[1.5]">
            {sources}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeCard({ mode, index }: { mode: FailureMode; index: number }) {
  const isPrimary = index % 2 === 1;
  const headlineFig = mode.figures[0];
  return (
    <div
      className="rounded-[0.4vw] p-[1.4vw] flex flex-col"
      style={{
        background: isPrimary ? "var(--slide-primary)" : "var(--slide-paper)",
        color: isPrimary ? "var(--slide-bg)" : "inherit",
      }}
    >
      <div className="flex items-baseline justify-between gap-[1vw] mb-[1vh] pb-[0.8vh] border-b border-rule/30">
        <div
          className={`font-display text-[1.4vw] leading-tight font-medium flex-1 ${
            isPrimary ? "" : "text-primary"
          }`}
        >
          {mode.shortName}
        </div>
        {headlineFig && (
          <div
            className="font-display text-[1.4vw] font-semibold leading-none whitespace-nowrap"
            style={{ color: isPrimary ? "#e9c8a8" : "var(--slide-accent)" }}
          >
            {headlineFig.value}
          </div>
        )}
      </div>
      <div
        className={`font-body text-[1vw] leading-[1.45] flex-1 ${
          isPrimary ? "opacity-95" : "text-primary"
        }`}
      >
        {mode.summary}
      </div>
    </div>
  );
}
