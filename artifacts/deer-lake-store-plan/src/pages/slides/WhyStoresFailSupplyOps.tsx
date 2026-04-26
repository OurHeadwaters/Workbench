import {
  failureModesByTheme,
  sourcesFooterLine,
  type FailureMode,
} from "@workspace/why-stores-fail";

export default function WhyStoresFailSupplyOps() {
  const grouped = failureModesByTheme();
  const supply: FailureMode[] = grouped["supply-chain"];
  const operations: FailureMode[] = grouped["operations"];
  const sources = sourcesFooterLine([...supply, ...operations]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div className="max-w-[78%]">
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              01b · Why current stores fail · Themes 02 + 03 of 04
            </div>
            <h2 className="font-display text-[3.4vw] leading-[1.05] tracking-tight text-primary font-medium">
              Supply chain & operations.
              <span className="italic font-normal text-accent">
                {" "}
                How freight breaks the shelf and a southern playbook breaks the store.
              </span>
            </h2>
          </div>
          <div className="text-right shrink-0 pl-[2vw]">
            <div className="font-display text-[4vw] leading-none text-accent font-semibold">
              {supply.length + operations.length}
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[0.95vw] text-muted mt-[0.6vh]">
              named failure modes
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.5vw] min-h-0">
          <ThemeColumn number="02" label="Supply chain" modes={supply} tone="paper" />
          <ThemeColumn number="03" label="Operations" modes={operations} tone="primary" />
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

function ThemeColumn({
  number,
  label,
  modes,
  tone,
}: {
  number: string;
  label: string;
  modes: FailureMode[];
  tone: "paper" | "primary";
}) {
  const isPrimary = tone === "primary";
  return (
    <div
      className="rounded-[0.4vw] p-[1.6vw] flex flex-col min-h-0"
      style={{
        background: isPrimary ? "var(--slide-primary)" : "var(--slide-paper)",
        color: isPrimary ? "var(--slide-bg)" : "inherit",
      }}
    >
      <div className="flex items-baseline justify-between mb-[1.2vh] pb-[1.2vh] border-b border-rule/40">
        <div>
          <div
            className="font-mono uppercase tracking-[0.22em] text-[1vw] mb-[0.3vh]"
            style={{ opacity: isPrimary ? 0.75 : 1 }}
          >
            Theme {number}
          </div>
          <div
            className={`font-display text-[2vw] font-medium leading-tight ${
              isPrimary ? "" : "text-primary"
            }`}
          >
            {label}
          </div>
        </div>
        <div
          className="font-display text-[2.4vw] font-semibold"
          style={{ color: isPrimary ? "#e9c8a8" : "var(--slide-accent)" }}
        >
          {modes.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-[0.7vh] min-h-0 overflow-hidden">
        {modes.map((mode) => {
          const headlineFig = mode.figures[0];
          return (
            <div
              key={mode.id}
              className="rounded-[0.3vw] px-[1vw] py-[0.8vh]"
              style={{
                background: isPrimary
                  ? "rgba(255,255,255,0.08)"
                  : "var(--slide-bg)",
              }}
            >
              <div className="flex items-baseline justify-between gap-[1vw] mb-[0.3vh]">
                <div
                  className={`font-display text-[1.15vw] leading-tight font-medium flex-1 ${
                    isPrimary ? "" : "text-primary"
                  }`}
                >
                  {mode.shortName}
                </div>
                {headlineFig && (
                  <div
                    className="font-mono text-[1vw] font-semibold whitespace-nowrap"
                    style={{ color: isPrimary ? "#e9c8a8" : "var(--slide-accent)" }}
                  >
                    {headlineFig.value}
                  </div>
                )}
              </div>
              <div
                className={`font-body text-[0.82vw] leading-[1.35] ${
                  isPrimary ? "opacity-85" : "text-muted"
                }`}
              >
                {mode.summary}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
