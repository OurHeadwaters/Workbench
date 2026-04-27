import {
  codetryTest,
  lastReviewed,
  type TypeCheckOutcome,
  type Verdict,
} from "@/data/codetryTest";
import { formatLongDate } from "@/lib/dateMath";

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

const typeCheckLabel: Record<TypeCheckOutcome, string> = {
  yes: "type-checker can't see it",
  no: "type-checker would catch it",
  "n-a": "no rename trialed",
};

const typeCheckColor: Record<
  TypeCheckOutcome,
  { bg: string; text: string; border: string }
> = {
  // The §2.4 case — flagged in the same warm-warning palette as drift to
  // show that this is the slip a typed model can't see.
  yes: { bg: "#fbe9d6", text: "#7a3030", border: "#b85a3e" },
  // Type checker would catch the rename — quiet green to say "compiler
  // already has your back here."
  no: { bg: "#dee9d8", text: "#1f3d2e", border: "#1f3d2e" },
  // Meta entries — neutral parchment.
  "n-a": { bg: "#f4ede0", text: "#6b7665", border: "#c8bfa7" },
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
        if (entry.wouldTypeCheck === "yes") acc.typeCheckBlind += 1;
        acc.total += 1;
      }
      return acc;
    },
    { "load-bearing": 0, decorative: 0, drift: 0, typeCheckBlind: 0, total: 0 } as Record<
      Verdict | "typeCheckBlind" | "total",
      number
    >,
  );

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[5pt] print:mb-[6pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Working doc · Codetry Handbook §4.2 applied · §2.4 column
              added · Last reviewed {formatLongDate(lastReviewed)}
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
            rename · per-entry verdict + type-checker reading + footer
            tally. Names settled by Task #232; method from Codetry
            Handbook §4.2; type-checker column from §2.4.
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
          <p>
            New since the last review:{" "}
            <a
              href="/codetry-handbook/chapter/2-4"
              className="font-semibold text-[#1f3d2e] underline decoration-[#c8bfa7] decoration-2 underline-offset-2 hover:decoration-[#1f3d2e]"
            >
              §2.4 (&ldquo;Different from type-driven design&rdquo;)
            </a>{" "}
            says a perfectly typed model with the wrong noun has still
            drifted, and the type checker can&rsquo;t see it &mdash;
            the section&rsquo;s example is{" "}
            <span className="italic">saltbox</span> renamed to{" "}
            <span className="italic">HouseholdContainer</span>: same
            shape, identical type, drifted noun. Each entry below now
            also carries a{" "}
            <span className="font-mono uppercase tracking-[0.16em] text-[8.5pt]">
              type-checker
            </span>{" "}
            reading: would a typed model of the same shape still pass
            after the trial rename? Entries marked{" "}
            <TypeCheckPill outcome="yes" /> are the §2.4 case
            &mdash; the codetry test is the only thing that catches
            that slip.
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

          <Subhead>The type-checker reading (§2.4)</Subhead>
          <ul className="space-y-[3pt] print:space-y-[2pt] list-none pl-0">
            <li>
              <TypeCheckPill outcome="yes" />{" "}
              <span className="text-[#2a2520]">
                drift the type checker can&rsquo;t see &mdash; a typed
                model of the same shape would still pass; only the
                codetry test catches the slip.
              </span>
            </li>
            <li>
              <TypeCheckPill outcome="no" />{" "}
              <span className="text-[#2a2520]">
                the rename forces the schema itself to change &mdash; a
                typed model would also flag it; codetry and types agree.
              </span>
            </li>
            <li>
              <TypeCheckPill outcome="n-a" />{" "}
              <span className="text-[#2a2520]">
                no single rename was trialed (cross-artifact name
                collision or deliberate metaphor reuse).
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
                {group.entries.map((entry) => {
                  const isTypeCheckBlind = entry.wouldTypeCheck === "yes";
                  return (
                    <li
                      key={entry.name}
                      className={`pl-[10pt] print:break-inside-avoid border-l-2 ${
                        isTypeCheckBlind
                          ? "border-[#b85a3e]"
                          : "border-[#c8bfa7]"
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-[8pt] mb-[2pt] flex-wrap">
                        <span className="font-display font-semibold text-[#1f3d2e] text-[12pt] print:text-[10.5pt] leading-[1.2]">
                          {entry.name}
                        </span>
                        <span className="flex items-center gap-[4pt] flex-wrap">
                          <VerdictPill verdict={entry.verdict} />
                          <TypeCheckPill outcome={entry.wouldTypeCheck} />
                        </span>
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
                      <div
                        className={`mt-[4pt] text-[9.5pt] leading-[1.45] rounded px-[8pt] py-[5pt] border print:text-[8.5pt] print:py-[3pt] ${
                          isTypeCheckBlind
                            ? "bg-[#fbe9d6] border-[#b85a3e] text-[#2a2520]"
                            : "bg-[#f4ede0] border-[#c8bfa7] text-[#2a2520]"
                        }`}
                      >
                        <span
                          className={`font-mono uppercase tracking-[0.16em] text-[7.5pt] mr-[4pt] print:text-[6.5pt] ${
                            isTypeCheckBlind
                              ? "text-[#7a3030]"
                              : "text-[#1f3d2e]"
                          }`}
                        >
                          Type-checker (§2.4)
                        </span>
                        {entry.typeCheckNote}
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
                  );
                })}
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
          <div
            className="border rounded px-[8pt] py-[6pt] mb-[6pt] flex items-baseline justify-between gap-[8pt] print:py-[4pt]"
            style={{
              background: typeCheckColor.yes.bg,
              borderColor: typeCheckColor.yes.border,
            }}
          >
            <div>
              <div
                className="font-mono uppercase tracking-[0.16em] text-[7.5pt] print:text-[6.5pt]"
                style={{ color: typeCheckColor.yes.text, opacity: 0.85 }}
              >
                §2.4 · drift the type checker can&rsquo;t see
              </div>
              <div className="text-[9pt] mt-[1pt] text-[#2a2520] leading-[1.35] print:text-[8pt]">
                Renames a typed model would still accept &mdash; only the
                codetry test catches them.
              </div>
            </div>
            <div
              className="font-display font-semibold text-[18pt] leading-[1] print:text-[14pt] whitespace-nowrap"
              style={{ color: typeCheckColor.yes.text }}
            >
              {tally.typeCheckBlind} / {tally.total}
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
            cross-referencing each other. The §2.4 column shows a
            second, larger pattern: nearly every load-bearing name
            here would survive its trial rename in a typed model
            unchanged &mdash; the meaning sits in the noun, not the
            shape, which is why a type checker alone isn&rsquo;t
            enough.
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
          (&ldquo;Test the name by trying to rename it&rdquo;); the
          type-checker column on each entry is grounded in{" "}
          <a
            href="/codetry-handbook/chapter/2-4"
            className="text-[#1f3d2e] underline decoration-[#c8bfa7] underline-offset-2 hover:decoration-[#1f3d2e]"
          >
            §2.4 (&ldquo;Different from type-driven design&rdquo;)
          </a>
          . The names tested are the ones settled by Task #232 across
          the three financial artifacts. This page is the audit; the
          live decks are unchanged. If a verdict here says{" "}
          <span className="italic">decorative</span> or{" "}
          <span className="italic">drift</span>, the next move belongs in
          a follow-up task &mdash; not a quiet rename.
        </div>

        <div className="mt-[10pt] pt-[8pt] border-t border-[#c8bfa7] text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[7.5pt] print:mt-[7pt] print:pt-[5pt] print:break-inside-avoid">
          <span className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#1f3d2e] mr-[4pt] print:text-[6.5pt]">
            Adding a new entry
          </span>
          When a new canonical name lands &mdash; a new registry id,
          a new slide title, a new shared piece of vocabulary &mdash;
          open{" "}
          <span className="font-mono text-[#1f3d2e]">
            src/data/codetryTest.ts
          </span>{" "}
          and append an entry to the right artifact group. Each entry
          needs seven things: the <span className="italic">name</span>,
          where it <span className="italic">lives</span> (every surface
          it appears on), the{" "}
          <span className="italic">rename</span> you trialed, what
          would actually <span className="italic">change</span> if the
          rename were accepted, the{" "}
          <span className="italic">type-checker reading</span> (§2.4
          &mdash; would a typed model of the same shape still pass after
          the rename?), the matching one-line{" "}
          <span className="italic">type-checker note</span>, and a{" "}
          <span className="italic">verdict</span>. Bump{" "}
          <span className="font-mono text-[#1f3d2e]">lastReviewed</span>{" "}
          in the same commit so the eyebrow date and the Year-page
          ritual stay honest. Per handbook §4.3 (&ldquo;the test
          isn&rsquo;t a one-time thing &mdash; it&rsquo;s a
          posture&rdquo;), the audit gets re-walked at least quarterly
          from the Year page even when no new entries have been
          added.
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

function TypeCheckPill({ outcome }: { outcome: TypeCheckOutcome }) {
  const c = typeCheckColor[outcome];
  return (
    <span
      className="font-mono uppercase tracking-[0.16em] text-[7.5pt] px-[5pt] py-[1pt] rounded border whitespace-nowrap print:text-[6.5pt]"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
      title="Handbook §2.4 — would a typed model of the same shape still pass after the trial rename?"
    >
      §2.4 · {typeCheckLabel[outcome]}
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
