import {
  failureModesByTheme,
  sourcesFooterLine,
  type FailureMode,
} from "@workspace/why-stores-fail";

export default function WhyStoresFailMarket() {
  const grouped = failureModesByTheme();
  const modes: FailureMode[] = grouped["market-structure"];
  const sources = sourcesFooterLine(modes);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div className="max-w-[78%]">
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              Why northern stores fail · who owns the store
            </div>
            <h2 className="font-display text-[3.6vw] leading-[1.05] tracking-tight text-primary font-medium">
              Who owns the store.
              <span className="italic font-normal text-accent">
                {" "}
                That decides where the money goes.
              </span>
            </h2>
          </div>
          <div className="text-right shrink-0 pl-[2vw] max-w-[24vw]">
            <div className="font-display text-[1.6vw] leading-tight text-primary font-medium">
              Ways stores break
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.95vw] text-muted mt-[0.6vh]">
              <span className="text-accent font-semibold">{modes.length}</span> in this group
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.5vw] min-h-0">
          {modes.map((mode, i) => (
            <ModeCard key={mode.id} mode={mode} index={i} />
          ))}
        </div>

        <div className="mt-[2.5vh] pt-[1.5vh] border-t border-rule">
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
      className="rounded-[0.4vw] p-[1.6vw] flex flex-col min-h-0"
      style={{
        background: isPrimary ? "var(--slide-primary)" : "var(--slide-paper)",
        color: isPrimary ? "var(--slide-bg)" : "inherit",
      }}
    >
      <div className="flex items-baseline justify-between gap-[1vw] mb-[1.2vh] pb-[1vh] border-b border-rule/30">
        <div
          className={`font-display text-[1.6vw] leading-tight font-medium flex-1 ${
            isPrimary ? "" : "text-primary"
          }`}
        >
          {mode.shortName}
        </div>
        {headlineFig && (
          <div className="text-right shrink-0">
            <div
              className="font-display text-[1.7vw] font-semibold leading-none"
              style={{ color: isPrimary ? "#e9c8a8" : "var(--slide-accent)" }}
            >
              {headlineFig.value}
            </div>
            <div
              className={`font-mono uppercase tracking-[0.14em] text-[0.7vw] mt-[0.3vh] max-w-[14vw] ${
                isPrimary ? "opacity-70" : "text-muted"
              }`}
            >
              {headlineFig.label}
            </div>
          </div>
        )}
      </div>
      <div
        className={`font-body text-[1.1vw] leading-[1.5] flex-1 ${
          isPrimary ? "opacity-95" : "text-primary"
        }`}
      >
        {mode.summary}
      </div>
    </div>
  );
}
