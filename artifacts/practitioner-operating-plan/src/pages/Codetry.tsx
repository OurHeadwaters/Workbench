type ConstellationEntry = {
  name: string;
  role: string;
};

const constellation: ConstellationEntry[] = [
  {
    name: "Headwaters / Buckets",
    role: "The dam infrastructure. Channels every drop of income into named pools. Non-custodial because you keep your own salt.",
  },
  {
    name: "Dam Days and Shallows",
    role: "The held-water gauge. Reads the slow days the system is doing its quiet work, and the shallow bays where life actually happens.",
  },
  {
    name: "SaltBox Zone 1",
    role: "The survival floor. What you preserved, cellared, salted. What does not depend on the season.",
  },
  {
    name: "807 Benefits Zone 3",
    role: "The honest baseline. What this climate truly offers without coddling.",
  },
  {
    name: "Regen Revolution Zone 4",
    role: "The perennial layer. Work that builds soil over years, so cultivation can feed the river back instead of mining it.",
  },
  {
    name: "Bright Side Zone 5",
    role: "The cultivated microclimate. What you can grow on top of regenerated Zone 4 soil, sheltered against Zone 3 winds.",
  },
  {
    name: "Brainstorm Library",
    role: "The seed bank. Where ideas are captured before they're sorted into a zone.",
  },
];

export default function Codetry() {
  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="onepager-screen checklist">
      <div className="onepager-sheet">
        <div className="flex items-baseline justify-between border-b border-[#c8bfa7] pb-[8pt] mb-[10pt] print:pb-[5pt] print:mb-[6pt]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[8pt] text-[#6b7665] mb-[3pt] print:text-[7pt] print:mb-[2pt]">
              Working doc · Design philosophy
            </div>
            <h1 className="font-display text-[26pt] leading-[1.0] tracking-tight text-[#1f3d2e] font-semibold print:text-[20pt]">
              Codetry
            </h1>
            <p className="mt-[4pt] font-body text-[10.5pt] italic text-[#2a2520] leading-[1.4] max-w-[44em] print:text-[9pt] print:leading-[1.25] print:mt-[2pt]">
              Metaphor as system architecture.
            </p>
          </div>
          <div className="text-right text-[8pt] font-mono uppercase tracking-[0.18em] text-[#6b7665] print:text-[7pt]">
            <div>Mirror of</div>
            <div className="mt-[2pt] text-[#1f3d2e] font-semibold tracking-[0.16em]">
              Dam Days and Shallows
            </div>
          </div>
        </div>

        <div className="print-hide flex items-center justify-between gap-[8pt] mb-[10pt] text-[9pt]">
          <div className="text-[#6b7665] max-w-[60%]">
            Definition page for the practice the constellation is built in.
            Lives here as the version-controlled paper trail; the live page
            lives in Dam Days and Shallows.
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
            Codetry is the practice of building software whose primary
            load-bearing material is metaphor. The naming is not decoration
            on a database. The naming{" "}
            <span className="font-semibold">is</span> the architecture, and
            the code is the medium that makes the metaphor real, clickable,
            and runnable.
          </p>

          <p>
            A codetry app is named the way a saltbox house is built — every
            beam carries weight.{" "}
            <span className="italic">SaltBox Zone 1</span> is not a clever
            rename of an emergency-fund tracker. The name is the design
            spec. It tells you what the surface is for, what climate it
            lives in, and what other parts of the system it sits beside.
            Change the name and you have changed the structure.
          </p>

          <Subhead>Different from code poetry</Subhead>
          <p>
            There is a real, decades-old tradition called{" "}
            <span className="italic">code poetry</span> — going back to
            Perl in the late 1980s, through the Stanford Code Poetry Slam,
            Mez Breeze, Nick Montfort, and Ishac Bertran&rsquo;s{" "}
            <span className="italic">code {`{poems}`}</span> anthology.
            That tradition is about the source code itself being a poem:
            programs that are also valid verse, lines arranged for sound
            or terseness, the aesthetics of what is on the page in the
            editor. Beautiful tradition. Adjacent and respected.
          </p>
          <p>
            But the poem in code poetry lives{" "}
            <span className="italic">inside</span> the source. In codetry
            the poem lives <span className="italic">as</span> the
            architecture, and the source is what makes it run.
          </p>

          <Subhead>The saltbox principle</Subhead>
          <p>
            Codetry borrows from the cold-climate vernacular. A saltbox
            house wasn&rsquo;t designed for prettiness — its asymmetric
            roof and thick north wall were the only way a house survived a
            Zone 1 winter. The form{" "}
            <span className="font-semibold">is</span> the function.
            Codetry asks the same of software: let the form-language do
            the structural work. Let the name carry weight a column would
            otherwise carry.
          </p>

          <Subhead>Worked examples — this constellation, so far</Subhead>
          <ul className="space-y-[5pt] print:space-y-[3pt] list-none pl-0 print:break-inside-avoid">
            {constellation.map((entry) => (
              <li
                key={entry.name}
                className="border-l-2 border-[#c8bfa7] pl-[8pt] print:break-inside-avoid"
              >
                <span className="font-display font-semibold text-[#1f3d2e] text-[11pt] print:text-[10pt]">
                  {entry.name}
                </span>
                <span className="text-[#6b7665]"> &mdash; </span>
                <span>{entry.role}</span>
              </li>
            ))}
          </ul>

          <p className="mt-[10pt] print:mt-[6pt] italic text-[#1f3d2e]">
            Together, the constellation is one lifestyle map for charting
            a course in northwestern Ontario — drawn in the grammar of
            the land it&rsquo;s drawn for.
          </p>
        </div>

        <div className="mt-[14pt] pt-[8pt] border-t border-[#c8bfa7] text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[7.5pt] print:mt-[10pt] print:pt-[5pt] print:break-inside-avoid">
          <span className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#1f3d2e] mr-[4pt]">
            Lineage
          </span>
          Code poetry as a movement is acknowledged and respected;
          codetry is a distinct discipline in the way regenerative
          agriculture is distinct from permaculture — adjacent, sharing
          roots, doing different work. The single-word coinage{" "}
          <span className="italic">codetry</span> has scattered prior
          life (notably a 2017 self-published book of the same name on
          an unrelated subject); the meaning loaded into it here —
          metaphor-first software design where naming carries the
          architectural weight — is the contribution of this
          constellation.
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
