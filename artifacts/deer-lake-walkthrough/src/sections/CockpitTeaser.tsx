import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/paths";
import { useRoute } from "@/lib/route";
import { COCKPIT_PROMISES } from "@/cockpit/copy";

/**
 * Cockpit teaser. Sits in the main scroll immediately after
 * WhatHeadwatersDelivers (see App.tsx) so a contractor reopening the
 * walkthrough spots the new cockpit work without hunting.
 *
 * One eyebrow, one headline, one short lede, three audience promises
 * (single-line condensations from `cockpit/copy.ts` — same source the
 * cockpit pitch uses, so the two surfaces can't drift), and a single
 * primary link into /cockpit. No inlined cockpit screens.
 */

export default function CockpitTeaser() {
  const { navigate } = useRoute();

  return (
    <section
      id="cockpit-teaser"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--color-accent-warm)" }}
        >
          The operator-couple cockpit
        </div>
        <h2
          className="serif font-medium text-[34px] leading-[1.1]"
          style={{ color: "var(--color-primary)", textWrap: "balance" }}
        >
          What a non-trained couple
          <span
            className="italic font-normal block mt-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            actually runs from, day one.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          A phone-friendly mockup of the operator-couple tablet.
          Square, QuickBooks, Local Line — one screen. Band money
          locked away from the operators.
        </p>

        <ul className="mt-7 space-y-3 list-none pl-0">
          {COCKPIT_PROMISES.map((p) => (
            <li
              key={p.id}
              className="rounded-xl p-4 border"
              style={{
                background: "var(--color-paper)",
                borderColor: "var(--color-rule)",
              }}
            >
              <div
                className="mono text-[10px] uppercase tracking-[0.18em] mb-1.5"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {p.audience}
              </div>
              <div
                className="serif text-[18px] leading-[1.3] font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                {p.line}
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => navigate(ROUTES.cockpit)}
          data-testid="cockpit-teaser-link"
          className="mt-8 inline-flex items-center justify-between gap-3 rounded-xl px-5 py-4 transition-transform hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-bg)",
          }}
        >
          <span className="text-left">
            <span
              className="block mono text-[10.5px] uppercase tracking-[0.22em]"
              style={{ color: "#e9c8a8" }}
            >
              Open the cockpit
            </span>
            <span
              className="block serif text-[18px] leading-[1.2] font-medium mt-1"
            >
              Walk the four screens.
            </span>
          </span>
          <ArrowRight size={22} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
