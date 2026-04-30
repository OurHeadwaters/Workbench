import { Reveal } from "@/components/Reveal";
import { ROUTES } from "@/lib/paths";

/**
 * Rework risk — the contractor-pain section. Sits between WhyThisTeam
 * (the credibility wall) and WhyCurrentFails (the band's pain), so the
 * contractor reads "who we are → why your build keeps breaking → what
 * we lock down → why the current store fails the band".
 *
 * The argument names the pain the contractor is living right now
 * (rework: the doors got built too small) and frames Headwaters as the
 * thing that makes that pain stop — by securing the operational brief
 * upstream so the construction work only happens once.
 *
 * Three top-level bold claims, faithful to the editorial lock in
 * Reveal.tsx. Detail (rework triggers, what "secured planning" means,
 * pointers to the already-shipped artifacts) lives in the Reveals.
 */
export default function ReworkRisk() {
  const claims: Array<{
    tag: string;
    head: string;
    body: string;
  }> = [
    {
      tag: "Claim 1 · The symptom",
      head: "The doors got built too small.",
      body:
        "Rework is the symptom, not the cause. Every backtrack on this build is a decision that wasn't locked before the saw came out.",
    },
    {
      tag: "Claim 2 · The cause",
      head: "The planning process has no rhyme or reason.",
      body:
        "Requirements drift mid-build. Decisions get reopened next week. Nobody owns the brief the construction work depends on.",
    },
    {
      tag: "Claim 3 · The fix",
      head: "Secure the plan. Build it once.",
      body:
        "Headwaters owns the operational brief — locked phase by phase — so the contractor never has to backtrack to fix what the plan should have caught.",
    },
  ];

  return (
    <section
      id="rework-risk"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-12 pb-16 flex flex-col">
        <div
          className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
          style={{ color: "var(--color-accent-warm)" }}
        >
          Why the build keeps breaking
        </div>
        <h2
          className="serif font-medium text-[34px] leading-[1.1]"
          style={{ color: "var(--color-primary)", textWrap: "balance" }}
        >
          The doors got built too small.
          <span
            className="italic font-normal block mt-2"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Because nobody owned the plan.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          A door that's an inch too narrow isn't about the door.
          It's about a plan that wasn't locked before the wall went
          up. Headwaters locks the plan first — so the build only
          happens once.
        </p>

        <div className="mt-7 space-y-3">
          {claims.map((c) => (
            <div
              key={c.tag}
              className="rounded-xl p-4 border-l-4"
              style={{
                background: "var(--color-paper)",
                borderColor: "var(--color-accent-warm)",
              }}
            >
              <div
                className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1.5"
                style={{ color: "var(--color-accent-warm)" }}
              >
                {c.tag}
              </div>
              <div
                className="serif text-[18px] leading-[1.3] font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                {c.head}
              </div>
              <div
                className="serif text-[15.5px] leading-[1.45] mt-1.5"
                style={{ color: "var(--color-text)" }}
              >
                {c.body}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <Reveal label="What rework actually looks like on this build">
            <p>
              A door re-framed because the cold-chain spec landed
              after the wall went up. A floor plan that fits the till
              but not the freezer. A staff room sized for two roles,
              then four. Not construction mistakes — planning gaps the
              crew has to absorb.
            </p>
            <p>
              Every one was a decision that could have been locked
              before the saw came out — if anyone owned the brief.
            </p>
          </Reveal>

          <Reveal label="Why the planning process has no rhyme or reason">
            <p>
              Nobody owns the brief. Chief ratifies decisions, band
              office administers them, contractor builds them. Nobody
              keeps them.
            </p>
            <p>
              So decisions get reopened. There's no page anyone can
              point to and say "this was settled on the fourteenth,
              here's who signed it." The conversation gets had again,
              the wall gets moved again, the doors get built too
              small.
            </p>
          </Reveal>

          <Reveal label="What 'locking the plan' actually means here" variant="ink">
            <p>
              Headwaters owns the plan start to finish. Before each
              construction phase, the plan locks: floor plan,
              cold-chain, where the till and freezer go, who does
              which job. Once locked, no reopening next Tuesday
              because somebody remembered something.
            </p>
            <p>
              The work is already shipped. The practitioner one-pager
              shows who does what — including a Headwaters food-safety
              person on-site from day one. The cockpit is the actual
              tablet the operators run — so the plan still works the
              day the doors open.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "rgba(244,237,224,0.7)" }}
            >
              Open in another tab ·{" "}
              <a
                href="/practitioner-operating-plan/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                /practitioner-operating-plan
              </a>{" "}
              ·{" "}
              <a
                href={ROUTES.cockpit}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                /cockpit
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
