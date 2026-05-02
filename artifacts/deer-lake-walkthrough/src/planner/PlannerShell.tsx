import type { ReactNode } from "react";
import { ROUTES } from "@/lib/paths";
import { useRoute } from "@/lib/route";

/**
 * Mirror of AppShell's chrome, retuned for the planner: brand pill says
 * "DL · Phase planner" and the right-side chip swaps from "Recap ↓" to
 * "Walkthrough →". Sticky header, paper background, small footer line.
 */
export function PlannerShell({ children }: { children: ReactNode }) {
  const { navigate } = useRoute();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)" }}
    >
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
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-warm)]"
            data-testid="planner-header-home"
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
            <div className="leading-tight text-left">
              <p
                className="serif text-[14px] font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                Phase planner
              </p>
              <p
                className="mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "var(--color-muted)" }}
              >
                Decision tool · mobile
              </p>
            </div>
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => navigate(ROUTES.walkthrough)}
            data-testid="planner-header-jump-walkthrough"
            className="mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-warm)]"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-rule)",
              background: "rgba(31,61,46,0.04)",
            }}
          >
            Walkthrough →
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
        Headwaters · Community store phase planner · for the contractor
      </footer>
    </div>
  );
}
