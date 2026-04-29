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
            That's the signature of unsecured planning.
          </span>
        </h2>

        <p
          className="serif text-[18px] leading-[1.55] mt-6 max-w-md"
          style={{ color: "var(--color-text)" }}
        >
          A door that's an inch too narrow is never really about the door.
          It's about a brief that wasn't locked before the wall went up.
          That's the work Headwaters secures upstream, so the build only
          ever happens once.
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
              A door framed for a standard pallet, then re-framed because
              the cold-chain spec arrived after the wall went up. A floor
              plan that fits the till, then doesn't fit the back-of-house
              freezer. A staff room sized for two roles that turn into
              four. None of these are construction mistakes. They are
              planning gaps that the construction work absorbs.
            </p>
            <p>
              Each one of these is a decision that could have been locked
              before the saw came out — if anyone owned the brief.
            </p>
          </Reveal>

          <Reveal label="Why the planning process has no rhyme or reason">
            <p>
              The current process has no single owner of the operational
              brief. The chief is asked to ratify decisions; the band
              office is asked to administer them; the contractor is asked
              to build them. Nobody is asked to keep them.
            </p>
            <p>
              That's why decisions get reopened. There's no artifact the
              contractor can point to and say: "this was settled on the
              fourteenth, here's the page, here's who signed it." So the
              same conversation gets had again, and the wall gets moved
              again, and the doors get built too small.
            </p>
          </Reveal>

          <Reveal label="What 'secured planning' actually means here" variant="ink">
            <p>
              Headwaters owns the operational brief end-to-end. Before
              each construction phase, the brief is locked: the floor
              plan, the cold-chain spec, the till and back-of-house
              placement, the role design that decides where the walls
              go. Once locked, a decision doesn't get reopened on a
              Tuesday because somebody remembered something.
            </p>
            <p>
              The artifacts the contractor can point to are already
              shipped. The store operating plan carries the dollar-honest
              cost basis. The practitioner one-pager carries the locked
              role design — including the Headwaters-owned Food Handler
              embedded at the store from day one. The cockpit is the
              tablet surface the operator couple actually runs from, so
              the brief survives contact with day-one operations.
            </p>
            <p
              className="mono text-[12px] uppercase tracking-[0.16em] mt-2"
              style={{ color: "rgba(244,237,224,0.7)" }}
            >
              Open in another tab ·{" "}
              <a
                href="/deer-lake-store-plan/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "rgba(244,237,224,0.95)" }}
              >
                /deer-lake-store-plan
              </a>{" "}
              ·{" "}
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
