import {
  outreachCircles,
  outreachTargets,
  reframedPitch,
  timelineMilestones,
  triggerConditions,
  workSplitBuckets,
  workSplitItems,
  type Confidence,
  type WorkSplitItem,
} from "@/data/planB";
// Funder slots are imported from a single named export so this page can
// later be swapped to consume a feed from the grants-finder artifact
// without touching anything else here. See planBFunders.ts for the
// future integration point.
import { planBFunders, type FunderStatus } from "@/data/planBFunders";

const accentByConfidence: Record<Confidence, string> = {
  seed: "#7a5c1f",
  confirmed: "#1f3d2e",
};

function ConfidencePill({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className="inline-flex items-center font-mono uppercase tracking-[0.18em] text-[7pt] font-semibold px-[5pt] py-[1pt] rounded-full border"
      style={{
        color: accentByConfidence[confidence],
        borderColor: accentByConfidence[confidence],
        background: "#faf6ec",
      }}
    >
      {confidence === "seed" ? "Seed" : "Confirmed"}
    </span>
  );
}

function formatStatus(status: FunderStatus): {
  label: string;
  color: string;
  background: string;
} {
  switch (status.kind) {
    case "open":
      return {
        label: status.closesOn ? `Open · closes ${status.closesOn}` : "Open",
        color: "#1f3d2e",
        background: "#dbe7d2",
      };
    case "opens":
      return {
        label: `Opens ${status.on}`,
        color: "#7a5c1f",
        background: "#fbeed1",
      };
    case "closed":
      return {
        label: status.reopens ? `Closed · reopens ${status.reopens}` : "Closed",
        color: "#7a3030",
        background: "#f7d7c9",
      };
  }
}

function SectionHeader({
  num,
  kicker,
  title,
}: {
  num: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="mb-[6pt]">
      <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#b85a3e] font-semibold">
        §{num} · {kicker}
      </div>
      <h2 className="font-display text-[16pt] leading-[1.1] text-[#1f3d2e] font-semibold tracking-tight mt-[2pt]">
        {title}
      </h2>
    </div>
  );
}

function WorkSplitItemRow({ item }: { item: WorkSplitItem }) {
  const linkProps = item.artifactPath
    ? item.external
      ? {
          href: item.artifactPath,
          target: "_blank" as const,
          rel: "noreferrer noopener",
        }
      : { href: item.artifactPath }
    : null;

  return (
    <li className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] bg-[#faf6ec]">
      <div className="flex items-baseline justify-between gap-[8pt] mb-[2pt]">
        <div className="font-display text-[10.5pt] text-[#1f3d2e] font-semibold leading-tight">
          {linkProps ? (
            <a
              {...linkProps}
              className="underline decoration-[#c8bfa7] underline-offset-2 hover:decoration-[#1f3d2e]"
            >
              {item.name}
            </a>
          ) : (
            item.name
          )}
        </div>
        <ConfidencePill confidence={item.confidence} />
      </div>
      <div className="font-body text-[9pt] text-[#2a2520] leading-[1.4]">
        {item.rationale}
      </div>
      {item.artifactPath && (
        <div className="mt-[3pt] font-mono text-[7.5pt] text-[#6b7665]">
          {item.artifactPath}
        </div>
      )}
    </li>
  );
}

export default function PlanB() {
  const orderedTargets = [...outreachTargets].sort((a, b) => a.rank - b.rank);

  return (
    <div className="onepager-screen">
      <div className="onepager-sheet">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[12pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt]">
              Practitioner Operating Plan · Plan B
            </div>
            <h1 className="font-display text-[20pt] leading-[1.05] tracking-tight text-[#1f3d2e] font-semibold">
              If Deer Lake doesn't sign, here's the page that catches you.
            </h1>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
            Sits next to Plan A
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              Read-only briefing
            </div>
          </div>
        </div>

        <div className="text-[9.5pt] leading-[1.4] text-[#2a2520] mb-[14pt]">
          One page that answers, in one sitting: what triggers Plan B, who
          you call instead, what you pitch them, what you do with the 807
          work, and where the runway money comes from in the meantime.
          Nothing here replaces the Deer Lake one-pager — Plan B sits next
          to Plan A, not on top of it. Items marked{" "}
          <ConfidencePill confidence="seed" /> are placeholders to sharpen;
          items marked <ConfidencePill confidence="confirmed" /> are
          signed off against intel in <span className="font-mono">docs/partnerships/</span>.
        </div>

        {/* §1 Trigger conditions */}
        <section className="mb-[16pt]">
          <SectionHeader
            num="1"
            kicker="Trigger conditions"
            title="What flips Plan A → Plan B, and on what date."
          />
          <ul className="list-none p-0 m-0 grid grid-cols-1 gap-[6pt]">
            {triggerConditions.map((trig) => (
              <li
                key={trig.label}
                className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] bg-[#faf6ec]"
              >
                <div className="flex items-baseline justify-between gap-[8pt] mb-[2pt]">
                  <div className="font-display text-[10.5pt] text-[#1f3d2e] font-semibold leading-tight">
                    {trig.label}
                  </div>
                  <ConfidencePill confidence={trig.confidence} />
                </div>
                <div className="font-body text-[9pt] text-[#2a2520] leading-[1.4] mb-[3pt]">
                  <span className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#b85a3e] font-semibold mr-[3pt]">
                    Signal
                  </span>
                  {trig.signal}
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-[8pt] text-[9pt] text-[#2a2520] leading-[1.4]">
                  <div>
                    <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#b85a3e] font-semibold">
                      Decision date
                    </div>
                    <div>{trig.decisionDate}</div>
                  </div>
                  <div>
                    <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#b85a3e] font-semibold">
                      Then do
                    </div>
                    <div>{trig.thenDo}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* §2 Reframed pitch */}
        <section className="mb-[16pt]">
          <SectionHeader
            num="2"
            kicker="Reframed pitch"
            title="Store-in-a-box for any small northern community."
          />
          <div className="border border-[#c8bfa7] rounded-[3pt] p-[12pt] bg-[#ebe2d0]">
            <div className="flex justify-end mb-[3pt]">
              <ConfidencePill confidence={reframedPitch.confidence} />
            </div>
            {reframedPitch.paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-body text-[10pt] text-[#2a2520] leading-[1.5] mb-[8pt] last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
          <div className="mt-[3pt] font-body italic text-[8.5pt] text-[#6b7665] leading-[1.4]">
            Written so a tribal council procurement officer can read it cold.
            No internal vocabulary, no Deer Lake-specific framing.
          </div>
        </section>

        {/* §3 Outreach concentric circles */}
        <section className="mb-[16pt]">
          <SectionHeader
            num="3"
            kicker="Outreach concentric circles"
            title="Who to call instead — warm to cold, ranked."
          />
          {outreachCircles.map((circle) => {
            const inCircle = orderedTargets.filter(
              (t) => t.circle === circle.id,
            );
            if (inCircle.length === 0) return null;
            return (
              <div key={circle.id} className="mb-[10pt] last:mb-0">
                <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#1f3d2e] font-semibold">
                  {circle.label}
                </div>
                <div className="font-body italic text-[8.5pt] text-[#6b7665] leading-[1.4] mb-[4pt]">
                  {circle.description}
                </div>
                <ol className="list-none p-0 m-0 grid grid-cols-1 gap-[5pt]">
                  {inCircle.map((target) => (
                    <li
                      key={target.rank}
                      className="border border-[#c8bfa7] rounded-[3pt] p-[6pt] bg-[#faf6ec]"
                    >
                      <div className="flex items-baseline gap-[6pt] mb-[2pt]">
                        <span className="font-mono text-[9pt] text-[#b85a3e] font-semibold">
                          {String(target.rank).padStart(2, "0")}
                        </span>
                        <span className="font-display text-[10pt] text-[#1f3d2e] font-semibold leading-tight grow">
                          {target.name}
                        </span>
                        <ConfidencePill confidence={target.confidence} />
                      </div>
                      <div className="grid grid-cols-2 gap-[8pt] text-[8.5pt] text-[#2a2520] leading-[1.4]">
                        <div>
                          <div className="font-mono uppercase tracking-[0.18em] text-[7pt] text-[#b85a3e] font-semibold">
                            Why them
                          </div>
                          <div>{target.whyThem}</div>
                        </div>
                        <div>
                          <div className="font-mono uppercase tracking-[0.18em] text-[7pt] text-[#1f3d2e] font-semibold">
                            Lead with
                          </div>
                          <div>{target.leadWith}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </section>

        {/* §4 The 807 work split */}
        <section className="mb-[16pt]">
          <SectionHeader
            num="4"
            kicker="The 807 work split"
            title="Sort every workstream into a fundable bucket."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[8pt]">
            {workSplitBuckets.map((bucket) => {
              const inBucket = workSplitItems.filter(
                (item) => item.bucket === bucket.id,
              );
              return (
                <div
                  key={bucket.id}
                  className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] bg-[#ebe2d0]"
                >
                  <div className="font-mono uppercase tracking-[0.2em] text-[8pt] text-[#1f3d2e] font-semibold mb-[2pt]">
                    {bucket.label}
                  </div>
                  <div className="font-body italic text-[8.5pt] text-[#6b7665] leading-[1.4] mb-[6pt]">
                    {bucket.description}
                  </div>
                  <ul className="list-none p-0 m-0 grid grid-cols-1 gap-[5pt]">
                    {inBucket.map((item) => (
                      <WorkSplitItemRow key={item.name} item={item} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* §5 Top 5 funder slots */}
        <section className="mb-[16pt]">
          <SectionHeader
            num="5"
            kicker="Top 5 funder slots"
            title="Where the runway money comes from in the meantime."
          />
          <ul className="list-none p-0 m-0 grid grid-cols-1 gap-[6pt]">
            {planBFunders.map((slot, idx) => {
              const status = formatStatus(slot.status);
              return (
                <li
                  key={`${slot.programName}-${idx}`}
                  className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] bg-[#faf6ec]"
                >
                  <div className="flex items-baseline justify-between gap-[8pt] mb-[2pt]">
                    <div className="font-display text-[10.5pt] text-[#1f3d2e] font-semibold leading-tight">
                      {slot.programName}
                    </div>
                    <div className="flex items-center gap-[5pt]">
                      <span
                        className="inline-flex items-center font-mono uppercase tracking-[0.16em] text-[7pt] font-semibold px-[6pt] py-[1pt] rounded-full"
                        style={{
                          color: status.color,
                          background: status.background,
                        }}
                      >
                        {status.label}
                      </span>
                      <ConfidencePill confidence={slot.confidence} />
                    </div>
                  </div>
                  <div className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#6b7665] mb-[3pt]">
                    {slot.funder}
                  </div>
                  <div className="font-body text-[9pt] text-[#2a2520] leading-[1.4] mb-[3pt]">
                    {slot.fitRationale}
                  </div>
                  <div className="grid grid-cols-[2fr_1fr] gap-[8pt] text-[8.5pt] text-[#2a2520] leading-[1.4]">
                    <div>
                      <div className="font-mono uppercase tracking-[0.18em] text-[7pt] text-[#b85a3e] font-semibold">
                        Application window
                      </div>
                      <div>{slot.applicationWindow}</div>
                    </div>
                    {slot.link && (
                      <div className="text-right">
                        <div className="font-mono uppercase tracking-[0.18em] text-[7pt] text-[#1f3d2e] font-semibold">
                          Program page
                        </div>
                        <a
                          href={slot.link}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-mono text-[7.5pt] text-[#1f3d2e] underline decoration-[#c8bfa7] underline-offset-2 break-all"
                        >
                          {slot.link.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-[4pt] font-body italic text-[8.5pt] text-[#6b7665] leading-[1.4]">
            Source data lives in{" "}
            <span className="font-mono">src/data/planBFunders.ts</span> as a
            single named export — when the grants-finder artifact exposes a
            stable feed, that file is the one (and only) swap.
          </div>
        </section>

        {/* §6 Runway & decision dates timeline */}
        <section className="mb-[10pt]">
          <SectionHeader
            num="6"
            kicker="Runway & decision dates"
            title="What you do, on what date, in what order."
          />
          <ol className="list-none p-0 m-0 relative border-l-2 border-[#c8bfa7] pl-[12pt]">
            {timelineMilestones.map((m) => (
              <li key={m.date} className="relative mb-[8pt] last:mb-0">
                <span
                  aria-hidden
                  className="absolute -left-[18pt] top-[6pt] w-[8pt] h-[8pt] rounded-full bg-[#1f3d2e] border-2 border-[#faf6ec]"
                />
                <div className="border border-[#c8bfa7] rounded-[3pt] p-[8pt] bg-[#faf6ec]">
                  <div className="flex items-baseline justify-between gap-[8pt] mb-[1pt]">
                    <div>
                      <span className="font-mono text-[9pt] text-[#b85a3e] font-semibold tracking-[0.16em] mr-[6pt]">
                        {m.date}
                      </span>
                      <span className="font-display text-[10.5pt] text-[#1f3d2e] font-semibold leading-tight">
                        {m.label}
                      </span>
                    </div>
                    <ConfidencePill confidence={m.confidence} />
                  </div>
                  <div className="font-body text-[9pt] text-[#2a2520] leading-[1.4]">
                    {m.action}
                  </div>
                  {m.triggerLabel && (
                    <div className="mt-[2pt] font-mono uppercase tracking-[0.18em] text-[7pt] text-[#6b7665]">
                      Pairs with §1 trigger · {m.triggerLabel}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="border-t border-[#c8bfa7] mt-[10pt] pt-[6pt] flex items-center justify-between text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665]">
          <div>
            Plan B sits next to Plan A · same operating system · different
            customer · same template.
          </div>
          <div className="text-[#1f3d2e] font-semibold">
            Practitioner Operating Plan · Plan B
          </div>
        </div>
      </div>
    </div>
  );
}
