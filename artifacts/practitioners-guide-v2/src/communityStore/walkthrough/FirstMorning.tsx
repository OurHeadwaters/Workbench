import { Reveal } from "../plannerReveal";

export default function FirstMorning({ onOpenCockpit }: { onOpenCockpit: () => void }) {
  const bullets = [
    { tag: "Works offline", body: "Drops the internet? Till keeps taking sales. Catches up later." },
    { tag: "End-of-day in one slip", body: "Prints clean. Goes straight into the books. No spreadsheet." },
    { tag: "Locked changes", body: "Bank, till, and price changes are tied to a named person. Nothing moves anonymously." },
  ];

  return (
    <section id="cs-first-morning" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>The first morning</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          Walk in on your first morning.
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>Use the till without any training.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>Big buttons. No menus. No business words. The couple opens the till in twenty minutes. Doors still open the next day if one of them is at a funeral — software does the back end.</p>
        <div className="mt-7 space-y-3">
          {bullets.map((b) => (
            <div key={b.tag} className="rounded-xl p-4 border" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
              <div className="text-[10.5px] uppercase tracking-[0.18em] mb-1.5" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{b.tag}</div>
              <div className="text-[15.5px] leading-[1.45]" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{b.body}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <Reveal label="Reorder reminders, in one screen">
            <p>The till tells the manager when the next truck date hits. One screen tells the manager what's on the shelf, what's on the next truck, and what to reorder today.</p>
            <p>No spreadsheets, no phone calls south.</p>
          </Reveal>
          <Reveal label="Honest pricing on every tag" variant="ink">
            <p>Shipping is added by the system, by category — the cashier never does it at the till.</p>
            <p>Items without help money show their shipping on the tag. People see what they pay for, and why.</p>
            <p>The federal grocery help claim builds itself from daily sales, sent once a month. Spoiled food is logged, not absorbed.</p>
          </Reveal>
        </div>
        <div className="mt-8 rounded-xl p-5 border-2" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-accent-warm)" }}>
          <div className="text-[10.5px] uppercase tracking-[0.20em] mb-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Click through it yourself</div>
          <div className="text-[18px] leading-[1.35] font-medium mb-3" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>See the operator-couple cockpit on top of your 40×80 box.</div>
          <p className="text-[14.5px] leading-[1.5] mb-4" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>Four screens. Floor plan. Morning home screen. A working till. The line between what operators can do and what's locked to the band.</p>
          <button type="button" onClick={onOpenCockpit} data-testid="cs-firstmorning-open-cockpit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold text-[14px] transition-transform hover:-translate-y-[1px]" style={{ background: "var(--cs-primary)", color: "var(--cs-bg)", fontFamily: "'Fraunces', Georgia, serif" }}>Open the cockpit mockup →</button>
        </div>
      </div>
    </section>
  );
}
