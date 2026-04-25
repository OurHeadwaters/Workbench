type ConstellationEntry = {
  name: string;
  role: string;
};

const constellation: ConstellationEntry[] = [
  {
    name: "Saltbox Zone 0 (decentralized)",
    role: "Homeschool day companion. Local-first per family — each household runs its own instance, nothing is shared because nothing needs to be. Worked examples: Lock-In Wins (15 quiet minutes is enough to count; no streaks, no scores), Gentle Words (a 6-line bank used sparingly so the words don't lose weight), Brave Moments (one-tap capture, surfaced in the seasonal Family Recap), Quote of the Day (deterministic per date), Live Follow-Along (opt-in only, lock-in count excluded from share payload), per-child Goals.",
  },
  {
    name: "Bright Side Zone 0 (centralized)",
    role: "Care institutions and centralized homes. The cultivated microclimate sheltered against the winds — the bright-frame name for the institutional dwelling. Awaiting agent context-pack.",
  },
  {
    name: "Headwaters Zone 1 (parent)",
    role: "Non-custodial XRPL envelope-budgeting PWA (was xBuckets / Watershed). The household balance is the source of the whole watershed; every other zone sits downstream. The cleanest demonstrations of metaphor-as-architecture: Buckets (envelopes — you can only pour from one to another, never summon water from nothing; rename to 'Categories' and the UI starts suggesting balances can grow by clicking), XRP Spring (savings above the 10-XRP network reserve, with a six-stage bamboo growth scene that extends the metaphor from data model into artwork), Community Well (monthly pooled tips round-distributed to community proposals — the well refilling). Plus Drip Harvester, Giving Well, Surplus Pool, Payday Planner.",
  },
  {
    name: "Family Buckets Zone 1 (sibling)",
    role: "Kid-allowance + courage extension of Headwaters. XRPL-direct, non-custodial. Bucket kinds savings + memory; Courage Bucket as named preset; allowance modes manual / auto_planner / auto_xrpl with the parent always signing in-wallet. Automation never bypasses the signing hand.",
  },
  {
    name: "Practitioner Operating Plan Zone 2",
    role: "Business / operating workbench (this site). Deal-flow, weekly steps, cost review, this codetry working-doc, cross-zone synthesis. Reads state from neighbor zones, writes back as memos, never mutates other zones.",
  },
  {
    name: "Community Knowledge Hub / 807 Benefits Zone 3",
    role: "Community production for Northwestern Ontario food systems — Dryden's 807 Food Co-op members portal. The honest baseline of what NWO actually offers without coddling. Awaiting agent context-pack for cadence and load-bearing surfaces.",
  },
  {
    name: "Regen Revolution Zone 4",
    role: "Conventional-to-regenerative track for industries. Multi-year transition work at sector scale; soil-building so cultivation can feed the river back instead of mining it. Awaiting agent context-pack.",
  },
  {
    name: "Dam Days and Shallows Zone 5",
    role: "Private memory holder with an impromptu public share. Where thoughts go that don't fit any other zone — the rock you skip a few times to see how it lands. Default private; the share button lets a thought float to the shallows for all to see, shrouded in mystery from the depths below.",
  },
  {
    name: "Brainstorm Library (pre-zone)",
    role: "The seed bank. Where ideas live before they're sorted into a zone.",
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
            <span className="italic">Saltbox Zone 0</span> surfaces
            day-to-day as a homeschool companion, but the name is the
            design spec: it carries that the household is Zone 0, that
            this is the saltbox-house itself, and that everything else
            in the system flows from this center. Change the name and
            you have changed the structure.
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
            boreal winter. The form{" "}
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

          <p className="mt-[6pt] print:mt-[4pt] text-[8pt] text-[#6b7665] leading-[1.4] print:text-[7pt]">
            <span className="font-mono uppercase tracking-[0.18em] text-[7pt] text-[#1f3d2e] mr-[4pt]">
              Manifest
            </span>
            <span className="font-mono">/constellation.json</span>{" "}
            &mdash; machine-readable mirror of the worked-examples list.
            The constellation&rsquo;s other agents fetch this to stay
            aligned on what is named and where.
          </p>
        </div>

        <div className="mt-[14pt] pt-[8pt] border-t border-[#c8bfa7] text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[7.5pt] print:mt-[10pt] print:pt-[5pt] print:break-inside-avoid">
          <span className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#1f3d2e] mr-[4pt]">
            Grounding
          </span>
          This constellation is built on regenerative agriculture and
          permaculture as living disciplines, not as metaphors. Its
          specific shaping comes from a small constellation of teachers
          held in daily rotation since 2011: Jack Spirko&rsquo;s{" "}
          <span className="italic">The Survival Podcast</span> &mdash;
          whose tagline,{" "}
          <span className="italic">
            &ldquo;for if times get tough or even if they don&rsquo;t,&rdquo;
          </span>{" "}
          has been the working frame; Joel Salatin&rsquo;s{" "}
          <span className="italic">The Lunatic Farmer</span> &mdash;{" "}
          <span className="italic">
            &ldquo;frequent meditations on food and farming that bring a
            wise and humble conscience to practice, policy, and
            participation&rdquo;
          </span>
          ; Nicole Sauce&rsquo;s{" "}
          <span className="italic">Living Free in Tennessee</span>{" "}
          &mdash;{" "}
          <span className="italic">
            &ldquo;build the life you choose on your terms&rdquo;
          </span>
          ; and the peer-to-peer community-organization logic of the
          Freedom Cells movement. The working axiom across all of them
          is that{" "}
          <span className="italic">
            there is no shortage of problems, but when we look for
            solutions it all becomes a little easier.
          </span>{" "}
          Every app here is solution-shaped because of that axiom. The
          original layer on top &mdash; the saltbox-house principle, the
          Zone 0&ndash;5 reading of northwestern Ontario, and codetry as
          the naming method &mdash; is the local contribution. The
          disciplines underneath are not.
        </div>

        <div className="mt-[10pt] pt-[8pt] border-t border-[#c8bfa7] text-[8.5pt] text-[#6b7665] leading-[1.4] print:text-[7.5pt] print:mt-[7pt] print:pt-[5pt] print:break-inside-avoid">
          <span className="font-mono uppercase tracking-[0.18em] text-[7.5pt] text-[#1f3d2e] mr-[4pt]">
            Lineage
          </span>
          Code poetry as a movement is acknowledged and respected;
          codetry is a distinct discipline from code poetry &mdash;
          adjacent, sharing the conviction that words placed
          deliberately can do structural work, doing different jobs.
          The single-word coinage{" "}
          <span className="italic">codetry</span> has scattered prior
          life (notably a 2017 self-published book of the same name on
          an unrelated subject); the meaning loaded into it here &mdash;
          metaphor-first software design where naming carries the
          architectural weight &mdash; is the contribution of this
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
