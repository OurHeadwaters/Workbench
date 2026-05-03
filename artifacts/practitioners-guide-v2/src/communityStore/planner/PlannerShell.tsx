import type { ReactNode } from "react";

export function PlannerShell({
  children,
  onBack,
}: {
  children: ReactNode;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--cs-bg)" }}>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{
          background: "rgba(244,237,224,0.92)",
          borderColor: "var(--cs-rule)",
          borderTopWidth: "4px",
          borderTopStyle: "solid",
          borderTopColor: "var(--cs-accent-warm)",
        }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-3 flex items-center gap-4">
          <button
            type="button"
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2"
            data-testid="planner-header-home"
          >
            <div
              className="h-8 w-8 rounded-md grid place-items-center font-bold text-[11px]"
              style={{
                background: "var(--cs-primary)",
                color: "var(--cs-bg)",
                letterSpacing: "0.04em",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              }}
            >
              CS
            </div>
            <div className="leading-tight text-left">
              <p className="text-[14px] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>
                Phase planner
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                Decision tool · mobile
              </p>
            </div>
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onBack}
            data-testid="planner-header-jump-walkthrough"
            className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none"
            style={{
              color: "var(--cs-primary)",
              borderColor: "var(--cs-rule)",
              background: "rgba(31,61,46,0.04)",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
          >
            Walkthrough →
          </button>
        </div>
      </header>

      <main className="flex-1 min-w-0">{children}</main>

      <footer
        className="border-t py-6 text-center text-[10.5px] uppercase tracking-[0.2em]"
        style={{
          borderColor: "var(--cs-rule)",
          color: "var(--cs-muted)",
          background: "var(--cs-bg)",
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        }}
      >
        Community store phase planner
      </footer>
    </div>
  );
}
