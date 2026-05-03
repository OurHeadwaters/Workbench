import { Reveal } from "../plannerReveal";

export default function ReworkRisk() {
  const claims = [
    { tag: "Claim 1 · The symptom", head: "The doors got built too small.", body: "Rework is the symptom, not the cause. Every backtrack on this build is a decision that wasn't locked before the saw came out." },
    { tag: "Claim 2 · The cause", head: "The planning process has no rhyme or reason.", body: "Requirements drift mid-build. Decisions get reopened next week. Nobody owns the brief the construction work depends on." },
    { tag: "Claim 3 · The fix", head: "Secure the plan. Build it once.", body: "The practitioner team owns the operational brief — locked phase by phase — so the contractor never has to backtrack to fix what the plan should have caught." },
  ];

  return (
    <section id="cs-rework-risk" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Why the build keeps breaking</div>
        <h2 className="text-[34px] leading-[1.1] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          The doors got built too small.
          <span className="italic font-normal block mt-2" style={{ color: "var(--cs-accent-warm)" }}>Because nobody owned the plan.</span>
        </h2>
        <p className="text-[18px] leading-[1.55] mt-6 max-w-md" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>A door that's an inch too narrow isn't about the door. It's about a plan that wasn't locked before the wall went up. The practitioner team locks the plan first — so the build only happens once.</p>
        <div className="mt-7 space-y-3">
          {claims.map((c) => (
            <div key={c.tag} className="rounded-xl p-4 border-l-4" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-accent-warm)" }}>
              <div className="text-[10.5px] uppercase tracking-[0.18em] mb-1.5" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{c.tag}</div>
              <div className="text-[18px] leading-[1.3] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{c.head}</div>
              <div className="text-[15.5px] leading-[1.45] mt-1.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{c.body}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <Reveal label="What rework actually looks like on this build">
            <p>A door re-framed because the cold-chain spec landed after the wall went up. A floor plan that fits the till but not the freezer. A staff room sized for two roles, then four. Not construction mistakes — planning gaps the crew has to absorb.</p>
            <p>Every one was a decision that could have been locked before the saw came out — if anyone owned the brief.</p>
          </Reveal>
          <Reveal label="Why the planning process has no rhyme or reason">
            <p>Nobody owns the brief. The chief ratifies decisions, the band office administers them, the contractor builds them. Nobody keeps them.</p>
            <p>So decisions get reopened. There's no page anyone can point to and say "this was settled on the fourteenth, here's who signed it." The conversation gets had again, the wall gets moved again, the doors get built too small.</p>
          </Reveal>
          <Reveal label="What 'locking the plan' actually means here" variant="ink">
            <p>The practitioner team owns the plan start to finish. Before each construction phase, the plan locks: floor plan, cold-chain, where the till and freezer go, who does which job. Once locked, no reopening next Tuesday because somebody remembered something.</p>
            <p>The work is already shipped. The cockpit is the actual tablet the operators run — so the plan still works the day the doors open.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
