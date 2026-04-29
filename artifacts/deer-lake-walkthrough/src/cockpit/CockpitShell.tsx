import type { ReactNode } from "react";
import { ROUTES, type CockpitScreen } from "@/lib/paths";
import { useRoute } from "@/lib/route";

/**
 * Top chrome for the cockpit: brand pill on the left, four screen tabs
 * across the middle, exit-to-walkthrough chip on the right. Sticky so
 * the contractor can flip between screens from anywhere.
 *
 * The cockpit pages are styled with the deck's Fraunces / IBM Plex
 * stack so they read as one package with the slide deck. The .cockpit
 * class wraps every page so those font swaps stay scoped to this
 * surface and don't leak into the rest of the walkthrough.
 */

const TABS: Array<{ id: CockpitScreen; label: string; sub: string; href: string }> = [
  {
    id: "pitch",
    label: "0 · Why",
    sub: "Tonight's pitch",
    href: ROUTES.cockpit,
  },
  {
    id: "floor",
    label: "1 · The 40×80 floor",
    sub: "What goes where",
    href: ROUTES.cockpitFloor,
  },
  {
    id: "home",
    label: "2 · Operator home",
    sub: "Morning unlock",
    href: ROUTES.cockpitHome,
  },
  {
    id: "till",
    label: "3 · The till",
    sub: "Try it yourself",
    href: ROUTES.cockpitTill,
  },
  {
    id: "locks",
    label: "4 · Open vs. locked",
    sub: "Who can do what",
    href: ROUTES.cockpitLocks,
  },
];

export function CockpitShell({
  screen,
  children,
}: {
  screen: CockpitScreen;
  children: ReactNode;
}) {
  const { navigate } = useRoute();

  return (
    <div
      className="cockpit min-h-screen flex flex-col"
      style={{
        background: "var(--cockpit-bg, #f4ede0)",
        color: "var(--cockpit-text, #18201b)",
        fontFamily:
          "'IBM Plex Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{
          background: "rgba(244,237,224,0.96)",
          borderColor: "rgba(31,61,46,0.18)",
          borderTopWidth: "4px",
          borderTopStyle: "solid",
          borderTopColor: "#b85a3e",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-7 py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={() => navigate(ROUTES.cockpit)}
            data-testid="cockpit-header-home"
            title="Cockpit landing"
            className="flex items-center gap-2.5 group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ outlineColor: "#b85a3e" }}
          >
            <div
              className="h-9 w-9 rounded-md grid place-items-center font-bold text-[11px]"
              style={{
                background: "#1f3d2e",
                color: "#f4ede0",
                letterSpacing: "0.04em",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              }}
            >
              DL
            </div>
            <div className="leading-tight text-left">
              <p
                className="text-[15px] font-semibold"
                style={{
                  color: "#1f3d2e",
                  fontFamily:
                    "'Fraunces', Georgia, 'Times New Roman', serif",
                }}
              >
                Operator cockpit
              </p>
              <p
                className="text-[10px] uppercase tracking-[0.20em]"
                style={{
                  color: "#6b7665",
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}
              >
                Mockup · iPad surface
              </p>
            </div>
          </button>

          <nav
            className="flex flex-1 min-w-0 items-stretch gap-0 overflow-x-auto"
            data-testid="cockpit-tabs"
          >
            {TABS.map((t) => {
              const active = t.id === screen;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => navigate(t.href)}
                  data-testid={`cockpit-tab-${t.id}`}
                  data-active={active ? "true" : "false"}
                  className="px-3 py-2 text-left rounded-md transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    background: active ? "rgba(31,61,46,0.08)" : "transparent",
                    color: active ? "#1f3d2e" : "#6b7665",
                  }}
                >
                  <div
                    className="text-[12px] font-semibold whitespace-nowrap"
                    style={{
                      fontFamily:
                        "'IBM Plex Mono', ui-monospace, monospace",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-[0.16em] whitespace-nowrap mt-[2px]"
                    style={{ opacity: 0.75 }}
                  >
                    {t.sub}
                  </div>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => navigate(ROUTES.walkthrough)}
            data-testid="cockpit-header-back"
            className="text-[10px] uppercase tracking-[0.20em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              color: "#1f3d2e",
              borderColor: "rgba(31,61,46,0.20)",
              background: "rgba(31,61,46,0.04)",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
          >
            ← Walkthrough
          </button>
        </div>
      </header>

      <main className="flex-1 min-w-0">{children}</main>

      <footer
        className="text-[10px] uppercase tracking-[0.20em] text-center py-3"
        style={{
          color: "#6b7665",
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        }}
      >
        Visual mockup · Square + QuickBooks underneath · Headwaters layer on top
      </footer>
    </div>
  );
}
