import { codetryTest, type Verdict } from "@/data/codetryTest";

const verdictLabel: Record<Verdict, string> = {
  "load-bearing": "load-bearing",
  decorative: "decorative",
  drift: "drift",
};

const verdictColor: Record<Verdict, { bg: string; text: string; border: string }> = {
  "load-bearing": { bg: "#ebe2d0", text: "#1f3d2e", border: "#1f3d2e" },
  decorative: { bg: "#f4ede0", text: "#6b7665", border: "#c8bfa7" },
  drift: { bg: "#f4ede0", text: "#7a3030", border: "#b85a3e" },
};

export default function CodetryTest() {
  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  // Tally — flat scan across every artifact group.
  const tally = codetryTest.reduce(
    (acc, group) => {
      for (const entry of group.entries) {
        acc[entry.verdict] += 1;
        acc.total += 1;
      }
      return acc;
    },
    { "load-bearing": 0, decorative: 0, drift: 0, total: 0 } as Record<
      Verdict | "total",
      number
    >,
  );

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[5pt] print:mb-[6pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Working doc · Codetry Handbook §4.2 applied
            </div>
            <h1 className="font-display text-[26pt] leading-[1.0] tracking-tight text-[#1f3d2e] font-semibold print:text-[20pt]">
              The Codetry Test
            </h1>
            <p className="mt-[4pt] font-body text-[10.5pt] italic text-[#2a2520] leading-[1.4] max-w-[44em] print:text-[9pt] print:leading-[1.25] print:mt-[2pt]">
              Trying to rename the canonical names — and watching what
              breaks. Audit only; nothing renamed in the live decks.
            </p>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>Companion to</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              /codetry
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665] max-w-[60%]">
            Three artifacts · {tally.total} canonical names tested by trial
            rename · per-entry verdict + footer tally. Names settled by
            Task #232; method from Codetry Handbook §4.2.
          </div>
          <div className="flex gap-[6pt]">
            <button
              type="button"
              onClick={onPrint}
              className="font-mono uppercase tracking-[0.16em] text-[8pt] px-[8pt] py-[4pt] rounded bg-[#1f3d2e] text-[#f4ede0] hover:opacity-90"
            >
              Print
            </button>
          </div>
        </div>

        <div className="font-body text-[10.5pt] text-[#2a2520] leading-[1.55] print:text-[9.5pt] print:leading-[1.4] space-y-[10pt] print:space-y-[6pt]">
          <p>
            <a
              href="/codetry-handbook/chapter/4-2"
              className="font-semibold text-[#1f3d2e] underline decoration-[#c8bfa7] decoration-2 underline-offset-2 hover:decoration-[#1f3d2e]"
            >
              §4.2 of the Codetry Practitioner&rsquo;s Handbook
            </a>{" "}
            says: to find out whether a name is doing structural work,
            try to rename it. If nothing in the system bends or breaks,
            the name was decorative. If the surrounding logic, copy,
            schema, or argument has to be rewritten to absorb the
            rename, the name was load-bearing &mdash; and was carrying
            weight a column would otherwise have to carry.
          </p>
          <p>
            This sheet runs that trial against the canonical names that
            Task #232 settled across three financial artifacts &mdash; the
            Practitioner Operating Plan, the Deer Lake Store Plan, and
            Headwaters Books. Each entry: the canonical name, where it
            lives, the rename we trialed, what would actually have to
            change downstream, and a verdict.
          </p>

          <Subhead>The three verdicts</Subhead>
          <ul className="space-y-[3pt] print:space-y-[2pt] list-none pl-0">
            <li>
              <VerdictPill verdict="load-bearing" />{" "}
              <span className="text-[#2a2520]">
                rename forces real structural change &mdash; leave the
                name; it&rsquo;s holding weight.
              </span>
            </li>
            <li>
              <VerdictPill verdict="decorative" />{" "}
              <span className="text-[#2a2520]">
                rename changes nothing material &mdash; either propose a
                cleaner name, or rewrite the surroundings so the name
                actually carries weight.
              </span>
            </li>
            <li>
              <VerdictPill verdict="drift" />{" "}
              <span className="text-[#2a2520]">
                the team has already slipped to a different word in some
                surface &mdash; decide whether to put the canonical name
                back or follow the new word everywhere.
              </span>
            </li>
          </ul>

          {codetryTest.map((group) => (
            <div key={group.artifact} className="print:break-inside-avoid">
              <Subhead>{group.artifact}</Subhead>
              <p className="font-body italic text-[9.5pt] text-[#6b7665] leading-[1.4] mb-[6pt] print:text-[8.5pt] print:mb-[4pt]">
                {group.framing}
              </p>
              <ul className="space-y-[8pt] print:space-y-[5pt] list-none pl-0">
                {group.entries.map((entry) => (
                  <li
                    key={entry.name}
                    className="border-l-2 border-[#c8bfa7] pl-[10pt] print:break-inside-avoid"
                  >
                    <div className="flex items-baseline justify-between gap-[8pt] mb-[2pt]">
                      <span className="font-display font-semibold text-[#1f3d2e] text-[12pt] print:text-[10.5pt] leading-[1.2]">
                        {entry.name}
                      </span>
                      <VerdictPill verdict={entry.verdict} />
                    </div>
                    <div className="text-[8.5pt] text-[#6b7665] mb-[3pt] leading-[1.35] print:text-[7.5pt]">
                      <span className="font-mono uppercase tracking-[0.16em] text-[7.5pt] text-[#1f3d2e] mr-[4pt] print:text-[6.5pt]">
                        Lives at
                      </span>
                      <span className="font-mono">{entry.livesAt}</span>
                    </div>
                    <div className="text-[10pt] mb-[3pt] leading-[1.45] print:text-[9pt]">
                      <span className="font-mono uppercase tracking-[0.16em] text-[7.5pt] text-[#1f3d2e] mr-[4pt] print:text-[6.5pt]">
                        Trial rename
                      </span>
                      <span className="italic text-[#2a2520]">
                        {entry.renameCandidate}
                      </span>
                    </div>
                    <div className="text-[10pt] leading-[1.5] text-[#2a2520] print:text-[9pt]">
                      <span className="font-mono uppercase tracking-[0.16em] text-[7.5pt] text-[#1f3d2e] mr-[4pt] print:text-[6.5pt]">
                        What would change
                      </span>
                      {entry.whatWouldChange}
                    </div>
                    {entry.followUp ? (
                      <div className="mt-[4pt] text-[9.5pt] leading-[1.45] text-[#2a2520] bg-[#f4ede0] border border-[#c8bfa7] rounded px-[8pt] py-[5pt] print:text-[8.5pt] print:py-[3pt]">
                        <span className="font-mono uppercase tracking-[0.16em] text-[7.5pt] text-[#7a3030] mr-[4pt] print:text-[6.5pt]">
                          {entry.verdict === "drift"
                            ? "Drift note"
                            : "Follow-up"}
                        </span>
                        {entry.followUp}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="mt-[10pt] print:mt-[6pt] italic text-[#1f3d2e]">
            The point of running the trial isn&rsquo;t to find names to
            change. It&rsquo;s to find out which names are quietly doing
            architectural work &mdash; so we know which beams not to
            knock out the next time we&rsquo;re tempted to tidy the
            language.
          </p>
        </div>

        <div className="mt-[14pt] pt-[8pt] border-t border-[#c8bfa7] print:mt-[10pt] print:pt-[5pt] print:break-inside-avoid">
          <div className="font-mono uppercase tracking-[0.18em] text-[8pt] text-[#1f3d2e] mb-[4pt] print:text-[7pt]">
            Tally
          </div>
          <div className="grid grid-cols-4 gap-[8pt] mb-[6pt] print:gap-[6pt]">
            <TallyCell verdict="load-bearing" count={tally["load-bearing"]} />
            <TallyCell verdict="decorative" count={tally.decorative} />
            <TallyCell verdict="drift" count={tally.drift} />
            <div className="border border-[#1f3d2e] rounded px-[8pt] py-[6pt] bg-[#1f3d2e] text-[#f4ede0] flex flex-col">
              <div className="font-mono uppercase tracking-[0.16em] text-[7.5pt] opacity-80 print:text-[6.5pt]">
                Tested
              </div>
              <div className="font-display font-semibold text-[18pt] leading-[1] mt-[2pt] print:text-[14pt]">
                {tally.total}
              </div>
              <div className="font-body text-[8pt] opacity-80 mt-[1pt] print:text-[7pt]">
                canonical names
              </div>
            </div>
          </div>
          <div className="text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[7.5pt]">
            <span className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#1f3d2e] mr-[4pt] print:text-[6.5pt]">
              Read
            </span>
            Most of what Task #232 settled is doing structural work. The
            single drift entry isn&rsquo;t broken language &mdash;
            it&rsquo;s a fork the team should resolve on purpose: either
            fold the OnePager&rsquo;s Food Handler line into Hub
            Operator, or document the cost-basis-arithmetic reason it
            stays separate. The forward-looking risk to head off next
            is the cost-centre / cost-registry name collision, before
            Headwaters Books and the Practitioner cost registry start
            cross-referencing each other.
          </div>
        </div>

        <div className="mt-[10pt] pt-[8pt] border-t border-[#c8bfa7] text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[7.5pt] print:mt-[7pt] print:pt-[5pt] print:break-inside-avoid">
          <span className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#1f3d2e] mr-[4pt] print:text-[6.5pt]">
            Method
          </span>
          The trial is the one in{" "}
          <a
            href="/codetry-handbook/chapter/4-2"
            className="text-[#1f3d2e] underline decoration-[#c8bfa7] underline-offset-2 hover:decoration-[#1f3d2e]"
          >
            §4.2 of the Codetry Practitioner&rsquo;s Handbook
          </a>{" "}
          (&ldquo;Test the name by trying to rename it&rdquo;). The
          names tested are the ones settled by Task #232 across the
          three financial artifacts. This page is the audit; the live
          decks are unchanged. If a verdict here says{" "}
          <span className="italic">decorative</span> or{" "}
          <span className="italic">drift</span>, the next move belongs in
          a follow-up task &mdash; not a quiet rename.
        </div>
      </div>
    </div>
  );
}

function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono uppercase tracking-[0.18em] text-[9pt] text-[#1f3d2e] mt-[6pt] mb-[-2pt] print:text-[8pt] print:mt-[4pt]">
      {children}
    </h2>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const c = verdictColor[verdict];
  return (
    <span
      className="font-mono uppercase tracking-[0.16em] text-[7.5pt] px-[5pt] py-[1pt] rounded border whitespace-nowrap print:text-[6.5pt]"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {verdictLabel[verdict]}
    </span>
  );
}

function TallyCell({ verdict, count }: { verdict: Verdict; count: number }) {
  const c = verdictColor[verdict];
  return (
    <div
      className="border rounded px-[8pt] py-[6pt] flex flex-col"
      style={{ background: c.bg, borderColor: c.border }}
    >
      <div
        className="font-mono uppercase tracking-[0.16em] text-[7.5pt] print:text-[6.5pt]"
        style={{ color: c.text, opacity: 0.85 }}
      >
        {verdictLabel[verdict]}
      </div>
      <div
        className="font-display font-semibold text-[18pt] leading-[1] mt-[2pt] print:text-[14pt]"
        style={{ color: c.text }}
      >
        {count}
      </div>
    </div>
  );
}
