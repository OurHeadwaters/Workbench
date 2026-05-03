const EMBEDS = [
  { id: "open-records", tag: "Screen 1 · Open-records ledger", head: "What the band sees, any time.", caption: "Running totals and recent postings, by cost centre. No login. Open it on a phone.", src: "/headwaters-books/embed/open-records" },
  { id: "daily-close", tag: "Screen 2 · Daily close", head: "Five minutes at end-of-day.", caption: "Count the drawer, drop the deposit, kick anything tricky to the bookkeeper for the morning.", src: "/headwaters-books/embed/daily-close" },
  { id: "month-end", tag: "Screen 3 · Month-end pack", head: "What council reads at the monthly meeting.", caption: "Cost-centre P&L on top, top variances below, sign-off line at the foot. A council pack, not a dashboard screenshot.", src: "/headwaters-books/embed/month-end" },
];

export default function BookkeepingProof() {
  return (
    <section id="cs-bookkeeping-proof" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>The books, in the page</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          Don't take a claim.
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>Look at the books.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>Three real screens from the books, loaded right here. Numbers are samples. Scroll inside any one to use it like an operator would.</p>
        <div className="mt-7 space-y-5">
          {EMBEDS.map((e) => (
            <article key={e.id} data-testid={`cs-bookkeeping-embed-${e.id}`} className="rounded-2xl overflow-hidden border" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
              <header className="px-5 pt-4 pb-3">
                <div className="text-[10.5px] uppercase tracking-[0.18em] mb-1" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{e.tag}</div>
                <div className="text-[18px] leading-[1.3] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{e.head}</div>
                <div className="text-[14.5px] leading-[1.45] mt-1.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{e.caption}</div>
              </header>
              <div className="border-t" style={{ borderColor: "var(--cs-rule)" }}>
                <iframe src={e.src} title={e.head} loading="lazy" className="block w-full bg-white h-[520px] sm:h-[640px]" style={{ border: 0 }} />
              </div>
            </article>
          ))}
        </div>
        <p className="text-[12px] uppercase tracking-[0.16em] mt-6" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
          Open in another tab ·{" "}
          <a href="/headwaters-books/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:no-underline" style={{ color: "var(--cs-accent-warm)" }}>/headwaters-books</a>
        </p>
      </div>
    </section>
  );
}
