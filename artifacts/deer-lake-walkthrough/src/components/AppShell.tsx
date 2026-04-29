import type { ReactNode } from "react";
import { ROUTES } from "@/lib/paths";
import { useRoute } from "@/lib/route";

/**
 * The walkthrough's reading shell — mirrors the v2 Practitioner's Guide
 * mobile surface: a 4px accent top border, a sticky branded header, then
 * scrolling content, then a small footer line. No fixed bottom chrome,
 * no swipe-deck. The page is just the page.
 *
 * The brand pill on the left echoes v2's "H · Practitioner's Guide";
 * here it's "DL · Deer Lake walkthrough" so the contractor instantly
 * knows which document is open. The right-side has two chips: a
 * quiet jump-to-recap link (the screen the contractor screenshots
 * after the meeting) and a "Planner →" link to the decision tool that
 * lives at the same artifact's /planner route.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { navigate } = useRoute();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{
          background: "rgba(244,237,224,0.92)",
          borderColor: "var(--color-rule)",
          borderTopWidth: "4px",
          borderTopStyle: "solid",
          borderTopColor: "var(--color-accent-warm)",
        }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-3 flex items-center gap-4">
          <a
            href="#prologue"
            className="flex items-center gap-2.5 group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-warm)]"
            data-testid="header-home-link"
          >
            <div
              className="h-8 w-8 rounded-md grid place-items-center font-bold text-[11px] mono"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-bg)",
                letterSpacing: "0.04em",
              }}
            >
              DL
            </div>
            <div className="leading-tight">
              <p
                className="serif text-[14px] font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                Deer Lake walkthrough
              </p>
              <p
                className="mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "var(--color-muted)" }}
              >
                For council · Headwaters
              </p>
            </div>
          </a>
          <div className="flex-1" />
          <a
            href="#recap"
            data-testid="header-jump-recap"
            className="mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-warm)] hidden sm:inline-block"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-rule)",
              background: "rgba(31,61,46,0.04)",
            }}
          >
            Recap ↓
          </a>
          <button
            type="button"
            onClick={() => navigate(ROUTES.sustainability)}
            data-testid="header-jump-sustainability"
            className="mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-warm)]"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-rule)",
              background: "rgba(31,61,46,0.04)",
            }}
          >
            Playbook
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.planner)}
            data-testid="header-jump-planner"
            className="mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-warm)]"
            style={{
              color: "var(--color-bg)",
              borderColor: "var(--color-accent-warm)",
              background: "var(--color-accent-warm)",
            }}
          >
            Planner →
          </button>
        </div>
      </header>

      <main className="flex-1 min-w-0">{children}</main>

      <footer
        className="border-t py-6 text-center mono text-[10.5px] uppercase tracking-[0.2em]"
        style={{
          borderColor: "var(--color-rule)",
          color: "var(--color-muted)",
          background: "var(--color-bg)",
        }}
      >
        Headwaters · Deer Lake walkthrough · for the contractor
      </footer>
    </div>
  );
}
