import { Reveal } from "../plannerReveal";

export default function WhyThisTeam() {
  const claims = [
    { tag: "Claim 1 · We've already written this plan", head: "The operating plan exists.", body: "Not a proposal — a real operational plan, dollar-honest, slide by slide. Read it before the meeting.", links: ["/practitioners-guide-v2/workbench"] },
    { tag: "Claim 2 · We've already built the software", head: "The bookkeeping system is live.", body: "The same patterns used for the community store till. Open it in another tab — the work isn't theoretical.", links: ["/headwaters-books/", "/library/"] },
    { tag: "Claim 3 · We work with northern communities, not at them", head: "The method is written down.", body: "Headwaters has a practice with a name — codetry — and a handbook anyone can read. Seven parts, written down end to end.", links: ["/codetry-handbook/"] },
  ];

  return (
    <section id="cs-why-this-team" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Why this team</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          Open the work.
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>Read it for yourself.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>Don't take a pitch. Take three links. Each one opens in another tab and shows real work already shipped for northern food systems.</p>

        <div className="mt-7 rounded-2xl border-2 p-5" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-accent-warm)" }}>
          <div className="text-[10.5px] uppercase tracking-[0.22em] mb-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Hotel precedent · already running</div>
          <h3 className="text-[22px] leading-[1.2] font-semibold" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>You've proved this model at the hotel.</h3>
          <p className="text-[15.5px] leading-[1.5] mt-3" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>Same setup as the band's hotel today. The contractor brings the couple. The band pays the contractor. The building works.</p>
          <p className="text-[15.5px] leading-[1.5] mt-3" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>The store is harder — fresh food, faster turnover. That's why the contractor brings Headwaters in. Same setup, new food side.</p>
        </div>

        <div className="mt-7 space-y-3">
          {claims.map((c) => (
            <div key={c.tag} className="rounded-xl p-4 border-l-4" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-accent-warm)" }}>
              <div className="text-[10.5px] uppercase tracking-[0.18em] mb-1.5" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{c.tag}</div>
              <div className="text-[18px] leading-[1.3] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{c.head}</div>
              <div className="text-[15.5px] leading-[1.45] mt-1.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{c.body}</div>
              <div className="text-[10.5px] uppercase tracking-[0.16em] mt-3" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
                Open in another tab ·{" "}
                {c.links.map((href, i) => (
                  <span key={href}>{i > 0 ? " · " : ""}<a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:no-underline" style={{ color: "var(--cs-accent-warm)" }}>{href}</a></span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="rounded-2xl p-6 border-2" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-accent-warm)" }}>
            <div className="text-[11px] uppercase tracking-[0.22em] mb-2" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>The artifact to open · Practitioner Operating Plan</div>
            <h3 className="text-[24px] leading-[1.15] font-semibold" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>$60,000 a month or more is real money. Here's where it goes.</h3>
            <p className="text-[16px] leading-[1.5] mt-3" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>The one-pager lists every cost: Practitioner (software), Distribution Lead (Thunder Bay → community, in person), IT/Assistant (domains, bookkeeping, distribution support), contractor couple, overhead, and the 1-ton truck.</p>
            <div className="text-[11px] uppercase tracking-[0.18em] mt-4" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
              Open the one-pager ·{" "}
              <a href="/practitioners-guide-v2/workbench" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:no-underline" style={{ color: "var(--cs-accent-warm)" }}>/practitioners-guide-v2/workbench</a>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Reveal label="What's inside the software">
            <p><span className="font-semibold">Headwaters Books.</span> The bookkeeping the agency uses for its own books — same patterns the community store till will use.</p>
            <p><span className="font-semibold">Northern Food Systems Research Library.</span> A working library on northern food systems — already shipped.</p>
          </Reveal>
          <Reveal label="What's inside the method" variant="ink">
            <p>The codetry handbook — <span className="italic">Headwaters: How a Community Runs Its Own Economy</span>. Seven parts. Read it on a phone.</p>
            <p>Same method used at the kitchen table in Dryden, Thunder Bay, anywhere Headwaters works. Not a slide deck — a practice.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
