import type { ReactNode } from "react";

export type SustainabilityPage =
  | "index"
  | "model"
  | "roles"
  | "handover"
  | "burnout"
  | "renewal"
  | "tooling"
  | "indicators";

const TABS: Array<{ id: SustainabilityPage; label: string; sub: string }> = [
  { id: "index",      label: "00 · Pattern",   sub: "The slab, the grassland" },
  { id: "model",      label: "01 · Model",      sub: "Same playbook · two buildings" },
  { id: "roles",      label: "02 · Roles",      sub: "Bench depth" },
  { id: "handover",   label: "03 · Handover",   sub: "Band takes the wheel" },
  { id: "burnout",    label: "04 · Burnout",    sub: "Early-warning" },
  { id: "renewal",    label: "05 · Renewal",    sub: "Three doors" },
  { id: "tooling",    label: "06 · Tools",      sub: "Square stays" },
  { id: "indicators", label: "07 · Indicators", sub: "Six leading" },
];

export function SustainabilityShell({
  page,
  onNavigate,
  onBack,
  children,
}: {
  page: SustainabilityPage;
  onNavigate: (p: SustainabilityPage) => void;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--cs-bg)", color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}
    >
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{
          background: "rgba(244,237,224,0.96)",
          borderColor: "rgba(31,61,46,0.18)",
          borderTopWidth: "4px",
          borderTopStyle: "solid",
          borderTopColor: "var(--cs-primary)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={() => onNavigate("index")}
            data-testid="sustainability-header-home"
            className="flex items-center gap-2.5 group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <div className="h-9 w-9 rounded-md grid place-items-center font-bold text-[11px]"
              style={{ background: "var(--cs-primary)", color: "var(--cs-bg)", letterSpacing: "0.04em", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
              SS
            </div>
            <div className="leading-tight text-left">
              <p className="text-[15px] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>Sustainability playbook</p>
              <p className="text-[10px] uppercase tracking-[0.20em]" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Store & hotel · One model</p>
            </div>
          </button>

          <nav className="flex flex-1 min-w-0 items-stretch gap-0 overflow-x-auto" data-testid="sustainability-tabs">
            {TABS.map((t) => {
              const active = t.id === page;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onNavigate(t.id)}
                  data-testid={`sustainability-tab-${t.id}`}
                  data-active={active ? "true" : "false"}
                  className="px-3 py-2 text-left rounded-md transition-colors focus:outline-none focus-visible:ring-2"
                  style={{ background: active ? "rgba(31,61,46,0.08)" : "transparent", color: active ? "var(--cs-primary)" : "var(--cs-muted)" }}
                >
                  <div className="text-[12px] font-semibold whitespace-nowrap" style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.04em" }}>{t.label}</div>
                  <div className="text-[10px] uppercase tracking-[0.16em] whitespace-nowrap mt-[2px]" style={{ opacity: 0.75, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{t.sub}</div>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={onBack}
            data-testid="sustainability-header-back"
            className="text-[10px] uppercase tracking-[0.20em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none focus-visible:ring-2"
            style={{ color: "var(--cs-primary)", borderColor: "rgba(31,61,46,0.20)", background: "rgba(31,61,46,0.04)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
          >
            ← Walkthrough
          </button>
        </div>
      </header>

      <main className="flex-1 min-w-0">
        <div className="max-w-[44rem] mx-auto px-5 py-8">{children}</div>
      </main>

      <footer className="text-[10px] uppercase tracking-[0.20em] text-center py-3" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
        Community Store Playbook · Sustainability section
      </footer>
    </div>
  );
}
