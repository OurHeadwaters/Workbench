import { useState, type ReactNode } from "react";
import { ROUTES, type SustainabilityPage } from "@/lib/paths";
import { useRoute } from "@/lib/route";

function ShareButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      data-testid="sustain-header-share"
      onClick={async () => {
        if (typeof window === "undefined") return;
        const url = window.location.href;
        try {
          if (navigator.share) {
            await navigator.share({
              title: "Community Store Sustainability Playbook",
              url,
            });
            return;
          }
        } catch {
          // user cancelled the share sheet — fall through to copy
        }
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          // clipboard unavailable; nothing else to do
        }
      }}
      className="mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none focus-visible:ring-2"
      style={{
        color: "var(--color-primary)",
        borderColor: "var(--color-rule)",
        background: "rgba(31,61,46,0.04)",
      }}
      title="Share this playbook"
    >
      {copied ? "Copied" : "Share"}
    </button>
  );
}

/**
 * Top chrome for the sustainability playbook. The playbook is a long
 * read for the chief, the council, the contractor, and the operator
 * couples — eight pages, phone-first, single-column. The header brand
 * pill says which document is open; the section nav lets a reader jump
 * between pages without losing place. The exit chip drops back to the
 * walkthrough.
 *
 * Lives at /sustainability and seven sub-paths. The visual language
 * matches the rest of the walkthrough (Lora serif, oat-paper bg,
 * evergreen ink, warm tan accent) — not the cockpit's IBM Plex /
 * Fraunces stack — because the playbook is a *reading* surface, not an
 * operator surface.
 */

const PAGES: Array<{
  id: SustainabilityPage;
  num: string;
  label: string;
  href: string;
}> = [
  { id: "index", num: "00", label: "The pattern", href: ROUTES.sustainability },
  { id: "model", num: "01", label: "One model · two buildings", href: ROUTES.sustainabilityModel },
  { id: "roles", num: "02", label: "Roles & bench depth", href: ROUTES.sustainabilityRoles },
  { id: "handover", num: "03", label: "Band takes the wheel", href: ROUTES.sustainabilityHandover },
  { id: "burnout", num: "04", label: "Burnout early-warning", href: ROUTES.sustainabilityBurnout },
  { id: "renewal", num: "05", label: "Renewal & turnover", href: ROUTES.sustainabilityRenewal },
  { id: "tooling", num: "06", label: "Tools that survive", href: ROUTES.sustainabilityTooling },
  { id: "indicators", num: "07", label: "How we know it works", href: ROUTES.sustainabilityIndicators },
];

export function SustainabilityShell({
  page,
  children,
}: {
  page: SustainabilityPage;
  children: ReactNode;
}) {
  const { navigate } = useRoute();
  const currentIdx = PAGES.findIndex((p) => p.id === page);
  const prev = currentIdx > 0 ? PAGES[currentIdx - 1] : null;
  const next = currentIdx < PAGES.length - 1 ? PAGES[currentIdx + 1] : null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)" }}
    >
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm print:static print:border-0"
        style={{
          background: "rgba(244,237,224,0.94)",
          borderColor: "var(--color-rule)",
          borderTopWidth: "4px",
          borderTopStyle: "solid",
          borderTopColor: "var(--color-accent-warm)",
        }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.sustainability)}
            data-testid="sustain-header-home"
            className="flex items-center gap-2.5 group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-warm)]"
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
                Sustainability playbook
              </p>
              <p
                className="mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "var(--color-muted)" }}
              >
                Store · Hotel · One model
              </p>
            </div>
          </button>
          <div className="flex-1" />
          <ShareButton />
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") window.print();
            }}
            data-testid="sustain-header-print"
            className="mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-rule)",
              background: "rgba(31,61,46,0.04)",
            }}
            title="Print this playbook"
          >
            Print
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.walkthrough)}
            data-testid="sustain-header-back"
            className="mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-md border transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-rule)",
              background: "rgba(31,61,46,0.04)",
            }}
          >
            ← Walk
          </button>
        </div>

        {/* Page rail — horizontal scroll on phone, full row at sm+. */}
        <nav
          className="max-w-3xl mx-auto px-5 sm:px-6 pb-3 flex items-stretch gap-1.5 overflow-x-auto no-scrollbar print:hidden"
          data-testid="sustain-nav"
          aria-label="Playbook pages"
        >
          {PAGES.map((p) => {
            const active = p.id === page;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(p.href)}
                data-testid={`sustain-nav-${p.id}`}
                data-active={active ? "true" : "false"}
                className="px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 text-left focus:outline-none focus-visible:ring-2 transition-colors"
                style={{
                  background: active
                    ? "var(--color-primary)"
                    : "rgba(31,61,46,0.04)",
                  color: active ? "var(--color-bg)" : "var(--color-primary)",
                  border: `1px solid ${
                    active ? "var(--color-primary)" : "var(--color-rule)"
                  }`,
                }}
              >
                <span
                  className="mono text-[10px] tracking-[0.18em] block"
                  style={{
                    color: active
                      ? "var(--color-accent)"
                      : "var(--color-accent-warm)",
                  }}
                >
                  {p.num}
                </span>
                <span className="serif text-[12.5px] leading-tight font-medium block">
                  {p.label}
                </span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 min-w-0">{children}</main>

      {/* Page-to-page footer nav — gives a thumb-sized "next" target on
          phone so the playbook reads like a sequence, not a sitemap. */}
      <nav
        className="max-w-[36rem] mx-auto w-full px-5 sm:px-6 pb-10 pt-2 flex items-stretch gap-3 print:hidden"
        data-testid="sustain-footer-nav"
      >
        {prev ? (
          <button
            type="button"
            onClick={() => navigate(prev.href)}
            data-testid="sustain-prev"
            className="flex-1 rounded-xl p-4 text-left border focus:outline-none focus-visible:ring-2"
            style={{
              background: "var(--color-paper)",
              borderColor: "var(--color-rule)",
              color: "var(--color-primary)",
            }}
          >
            <div
              className="mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent-warm)" }}
            >
              ← {prev.num} · previous
            </div>
            <div className="serif text-[15px] leading-tight font-medium mt-1">
              {prev.label}
            </div>
          </button>
        ) : (
          <div className="flex-1" />
        )}
        {next && (
          <button
            type="button"
            onClick={() => navigate(next.href)}
            data-testid="sustain-next"
            className="flex-1 rounded-xl p-4 text-left border focus:outline-none focus-visible:ring-2"
            style={{
              background: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              color: "var(--color-bg)",
            }}
          >
            <div
              className="mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              {next.num} · next →
            </div>
            <div className="serif text-[15px] leading-tight font-medium mt-1">
              {next.label}
            </div>
          </button>
        )}
      </nav>

      <footer
        className="border-t py-6 text-center mono text-[10.5px] uppercase tracking-[0.2em]"
        style={{
          borderColor: "var(--color-rule)",
          color: "var(--color-muted)",
          background: "var(--color-bg)",
        }}
      >
        Headwaters · Sustainability playbook · Store + Hotel
      </footer>
    </div>
  );
}
