import { ArrowRight } from "lucide-react";
import { COCKPIT_PROMISES } from "../cockpit/copy";

export default function CockpitTeaser({ onOpenCockpit }: { onOpenCockpit: () => void }) {
  return (
    <section id="cs-cockpit-teaser" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>The operator-couple cockpit</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          What a non-trained couple
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>actually runs from, day one.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>A phone-friendly mockup of the operator-couple tablet. Square, QuickBooks, Local Line — one screen. Band money locked away from the operators.</p>
        <ul className="mt-7 space-y-3 list-none pl-0">
          {COCKPIT_PROMISES.map((p) => (
            <li key={p.id} className="rounded-xl p-4 border" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
              <div className="text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{p.audience}</div>
              <div className="text-[18px] leading-[1.3] font-medium" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{p.line}</div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onOpenCockpit}
          data-testid="cs-cockpit-teaser-link"
          className="mt-8 inline-flex items-center justify-between gap-3 rounded-xl px-5 py-4 transition-transform hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ background: "var(--cs-primary)", color: "var(--cs-bg)" }}
        >
          <span className="text-left">
            <span className="block text-[10.5px] uppercase tracking-[0.22em]" style={{ color: "#e9c8a8", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Open the cockpit</span>
            <span className="block text-[18px] leading-[1.2] font-medium mt-1" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Walk the four screens.</span>
          </span>
          <ArrowRight size={22} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
