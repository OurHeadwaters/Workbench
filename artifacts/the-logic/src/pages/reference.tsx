import { BookOpen } from 'lucide-react';

export default function Reference() {
  return (
    <div className="relative z-10 w-full">
      {/* Decorative top border */}
      <div className="h-1.5 w-full bg-primary" />
      
      {/* Header */}
      <header className="pt-24 pb-16 md:pt-32 md:pb-20 px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 mb-8 text-primary tracking-[0.2em] uppercase text-xs font-semibold">
          <div className="w-12 h-[1px] bg-primary/40"></div>
          <BookOpen className="w-4 h-4" />
          Doctrine Instrument
          <div className="w-12 h-[1px] bg-primary/40"></div>
        </div>
        
        <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-tight text-foreground">
          The Logic
        </h1>
        
        <p className="text-xl md:text-3xl text-muted-foreground font-serif italic max-w-xl font-light">
          Zone 5 Doctrine Instruments
        </p>
        
        <nav className="mt-20 flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
          <a 
            href="#reality-core" 
            className="text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-2"
          >
            RealityCore
          </a>
          <a 
            href="#fallacy-map" 
            className="text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-2"
          >
            Fallacy Map
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pb-32">
        <div className="ornament">
          <div className="ornament-icon">
            <div className="w-2 h-2 rotate-45 bg-primary"></div>
          </div>
        </div>

        {/* ── RealityCore ─────────────────────────────────────────── */}
        <section id="reality-core" className="scroll-mt-32 mb-24">
          <div className="flex flex-col gap-8">
            <header>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                RealityCore
              </h2>
              <div className="w-16 h-[2px] bg-primary/80"></div>
            </header>
            
            <p className="text-xl md:text-2xl leading-loose md:leading-loose text-foreground/90 drop-cap text-justify">
              RealityCore is the practitioner's tool for checking whether a claim about the bright side or the systems side is grounded in fact or is a narrative the speaker has mistaken for one. Before the Gate can pass or refuse a piece of language, the practitioner needs this prior discipline: the ability to separate what is real from what is story. A Gate operated without RealityCore is guessing.
            </p>

            {/* ── The Formal Test ── */}
            <div className="mt-4">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4 tracking-tight">
                The Formal Test
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-6">
                Apply these four questions to any claim before the Gate acts on it. A claim that cannot survive all four questions is a story, not a fact, and must be held on the bright side until it earns passage.
              </p>
              <ol className="flex flex-col gap-6 list-none pl-0">
                {[
                  {
                    num: "1",
                    title: "What is the evidence?",
                    body: "Can the speaker point to an observation — something that happened, was recorded, was measured, was received — that is independent of the speaker's interpretation of it? If the only evidence is the speaker's own conviction, the claim is a story. If the evidence is a number, a document, a third-party account, or a physical outcome, the claim may be a fact. The evidence does not have to be formal; a neighbour's account is evidence. The speaker's certainty is not.",
                  },
                  {
                    num: "2",
                    title: "Would a skeptic with the same access reach the same conclusion?",
                    body: "Hand the evidence to someone who does not share the speaker's interest in the claim. Would they read it the same way? If the evidence only supports the claim through a chain of interpretation the skeptic would not follow, the claim is a story dressed as a fact. This question is not asking whether the claim is wrong — the claim may be correct — it is asking whether the path from evidence to conclusion is honest.",
                  },
                  {
                    num: "3",
                    title: "Has the claim been tested by friction?",
                    body: "A fact survives contact with the world outside the speaker's head. Has the claim been contradicted by anyone with standing to contradict it? Has it been checked against a record? Has it been put in writing and sent somewhere it could come back revised? A claim that has only ever circulated inside a group that agrees with it has not been tested. Untested claims are stories until the friction comes.",
                  },
                  {
                    num: "4",
                    title: "What would have to be true for this claim to be false?",
                    body: "If the speaker cannot name a condition under which the claim would be false, the claim is unfalsifiable — it is a belief, not a fact. Facts have limits. A fact about last quarter's revenue can be falsified by the bank statement. A story about the community's resilience cannot be falsified by anything the speaker will accept. The Gate can work with falsifiable claims. It cannot work with unfalsifiable ones, and should refuse to act on them.",
                  },
                ].map(({ num, title, body }) => (
                  <li key={num} className="flex gap-5">
                    <span className="font-serif text-3xl font-bold text-primary/40 leading-none mt-1 select-none w-6 shrink-0">{num}</span>
                    <div>
                      <p className="font-semibold text-foreground mb-2 text-base md:text-lg tracking-tight">{title}</p>
                      <p className="text-base md:text-lg leading-relaxed text-foreground/75">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* ── Story vs. Fact Checklist ── */}
            <div className="mt-8 border border-border rounded-sm p-6 bg-muted/30">
              <h3 className="font-serif text-xl font-bold text-foreground mb-5 tracking-tight uppercase text-sm tracking-[0.12em]">
                Story-vs-Fact Field Checklist
              </h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Run this checklist in the field when you do not have time for the full formal test. Any "story" column answer is a flag; three flags in a row means hold the claim before the Gate acts.
              </p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-foreground/70 uppercase tracking-wider text-xs w-1/2">Sounds like a fact when…</th>
                    <th className="text-left py-2 font-semibold text-foreground/70 uppercase tracking-wider text-xs w-1/2">Sounds like a story when…</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    ["Someone outside the room could verify it independently.", "Verification requires trusting the speaker's account of what happened."],
                    ["It holds if the speaker is replaced by a stranger.", "It depends on who is telling it."],
                    ["It comes with a date, a record, or a named source.", "It comes with \"everyone knows\" or \"it's obvious.\""],
                    ["A skeptic could prove it wrong if it were wrong.", "No one can name a condition that would disprove it."],
                    ["It was already in circulation before this conversation.", "It appeared fully formed in this conversation."],
                    ["It is the same claim in the morning as in the evening.", "It changes with the audience."],
                  ].map(([fact, story], i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4 text-foreground/75 align-top leading-snug">{fact}</td>
                      <td className="py-3 text-foreground/75 align-top leading-snug">{story}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Worked Examples ── */}
            <div className="mt-8">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4 tracking-tight">
                Worked Examples
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-8">
                Each example below shows a claim as it arrived at the Gate, the RealityCore verdict, and what the practitioner did with it.
              </p>

              <div className="flex flex-col gap-10">

                {/* Example 1 */}
                <div className="border-l-2 border-primary/30 pl-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Example 1 — Eave / Grant Application</p>
                  <blockquote className="font-serif italic text-lg text-foreground/90 mb-4">
                    "Our members saved an estimated $80,000 last year by buying together."
                  </blockquote>
                  <div className="flex flex-col gap-3 text-sm text-foreground/75 leading-relaxed">
                    <p><span className="font-semibold text-foreground">Evidence test:</span> The co-op had bulk-purchase receipts and could compare the per-unit price to retail prices from the same period. The arithmetic was reproducible.</p>
                    <p><span className="font-semibold text-foreground">Skeptic test:</span> An outside accountant applied a conservative retail comparison and arrived at $71,000 — a different number, but in the same order of magnitude and using the same method.</p>
                    <p><span className="font-semibold text-foreground">Friction test:</span> The number appeared in an audited report the previous year; no funder or auditor had disputed the methodology.</p>
                    <p><span className="font-semibold text-foreground">Falsifiability test:</span> If the retail comparison showed a higher per-unit price for the co-op, the claim would collapse. That condition is testable.</p>
                    <p className="mt-2 font-medium text-foreground"><span className="text-primary">Verdict: Fact.</span> The Gate passed the claim with a note that the exact figure should be cited as an estimate derived from the methodology, not as an audited total.</p>
                  </div>
                </div>

                {/* Example 2 */}
                <div className="border-l-2 border-primary/30 pl-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Example 2 — Zone 3 / Community Meeting</p>
                  <blockquote className="font-serif italic text-lg text-foreground/90 mb-4">
                    "The community has always supported this kind of initiative."
                  </blockquote>
                  <div className="flex flex-col gap-3 text-sm text-foreground/75 leading-relaxed">
                    <p><span className="font-semibold text-foreground">Evidence test:</span> No record of prior votes, meeting minutes, or surveys was produced. The speaker was describing a feeling of support, not a documented history of it.</p>
                    <p><span className="font-semibold text-foreground">Skeptic test:</span> A member who had voted against a similar initiative two years earlier was in the room. The claim as stated would exclude her experience.</p>
                    <p><span className="font-semibold text-foreground">Friction test:</span> The claim had never been put in writing and had never been tested against the record.</p>
                    <p><span className="font-semibold text-foreground">Falsifiability test:</span> The speaker, when asked what would disprove the claim, said "nothing — the community always comes together." An unfalsifiable claim.</p>
                    <p className="mt-2 font-medium text-foreground"><span className="text-primary">Verdict: Story.</span> The Gate held the claim. The practitioner reframed it: "We have seen strong support for similar initiatives in the past, and we are asking for the same here." The reframed version is gateable; the original was not.</p>
                  </div>
                </div>

                {/* Example 3 */}
                <div className="border-l-2 border-primary/30 pl-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Example 3 — Zone 4 / Funder Report</p>
                  <blockquote className="font-serif italic text-lg text-foreground/90 mb-4">
                    "This model has been proven to work in remote northern communities."
                  </blockquote>
                  <div className="flex flex-col gap-3 text-sm text-foreground/75 leading-relaxed">
                    <p><span className="font-semibold text-foreground">Evidence test:</span> Two case studies existed — one from a community with road access that operated at a scale ten times larger, one from a fly-in community that had since wound down. Both were real. Neither matched the current context.</p>
                    <p><span className="font-semibold text-foreground">Skeptic test:</span> A skeptic reviewing both cases would say "proven in some contexts under some conditions" — which is weaker than "proven to work."</p>
                    <p><span className="font-semibold text-foreground">Friction test:</span> The claim had appeared in previous grant applications without challenge. That is not the same as having been tested.</p>
                    <p><span className="font-semibold text-foreground">Falsifiability test:</span> Falsifiable in principle — a study showing it does not work would disprove it — but the current evidence did not actually support the claim as worded.</p>
                    <p className="mt-2 font-medium text-foreground"><span className="text-primary">Verdict: Story masquerading as fact.</span> The Gate revised the claim to: "Case studies from comparable communities suggest this model is viable at the scale we are proposing." That claim is supportable by the evidence that exists.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* ── Practitioner's Note ── */}
            <div className="mt-6 border border-border/60 rounded-sm p-6 bg-muted/20">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">Practitioner's Note</p>
              <p className="text-base leading-relaxed text-foreground/80">
                RealityCore does not determine whether a claim is good or bad for the community. It determines only whether the claim is real — whether it describes the world as it is, or the world as the speaker hopes or fears it to be. Stories are not failures; they are indispensable for mobilising people and sustaining culture. But stories that cross the Gate as facts will be contradicted by the systems, and the contradiction will land on the community, not on the story. The Gate's job is to know the difference before that happens.
              </p>
            </div>

          </div>
        </section>

        <div className="ornament">
          <div className="ornament-icon text-muted-foreground font-serif italic text-xl">
            §
          </div>
        </div>

        {/* ── Fallacy Map ─────────────────────────────────────────── */}
        <section id="fallacy-map" className="scroll-mt-32">
          <div className="flex flex-col gap-8">
            <header>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Fallacy Map
              </h2>
              <div className="w-16 h-[2px] bg-primary/80"></div>
            </header>
            
            <p className="text-xl md:text-2xl leading-loose md:leading-loose text-foreground/90 drop-cap text-justify">
              The Fallacy Map is the named catalogue of reasoning errors practitioners catch in the field: the common moves that make a false crossing look honest, a refusal look cowardly, or a substitution look like an equivalent when it is not. Together with RealityCore, it forms the epistemological backbone the Gate rests on.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Each entry below names the fallacy, describes the move it makes, and gives a field example from Gate practice. The names are working names — they are chosen to be memorable in a meeting, not to match a philosophy textbook. If a fallacy in this catalogue shows up in a Gate decision, it should be named by name in the record.
            </p>

            {/* ── Fallacy List ── */}
            <div className="flex flex-col gap-12 mt-4">

              {[
                {
                  name: "The Bright-Side Slide",
                  tag: "False universalisation",
                  description: "Treating language that is legitimate inside the community as though it is also legitimate in the outside world, without checking whether a crossing has actually occurred. The speaker uses a bright-side term in a systems context and, when challenged, says the systems should simply understand what the community means.",
                  signal: "The claim requires the outside reader to already know what the community means in order to understand the document.",
                  example: "A grant application describes the organisation's governance as run by \"the circle\" — a meaningful term inside the co-op, rooted in a specific decision-making discipline — without any systems-side equivalent. The funder's reviewer flags it as informal and declines to assess the governance section. The practitioner had assumed the term would translate itself. It did not. The bright-side term needed a Gate crossing before it appeared in the application, not after the rejection.",
                  gatecall: "The Gate should have been invoked before the application went out. The move to make: hold the bright-side term on the bright side, cross it as \"consensus-based board governance\" in the application, and keep the bright-side term alive in the co-op's own minutes.",
                },
                {
                  name: "The Systems Capture",
                  tag: "Dialect replacement under pressure",
                  description: "Allowing the outside world's language to replace the community's own language inside the community's own documents — not just in documents going out, but in the internal meeting notes, the ledgers, the handbooks. The systems-side equivalent has crossed in the wrong direction and taken the room.",
                  signal: "The community's own members have started using the systems-side term with each other, and nobody remembers what the original term was.",
                  example: "A co-op that ran its own internal credit system originally called member advances \"draws from the channel.\" After three years of grant reporting, where \"draw\" was translated as \"short-term member loan,\" the board began writing \"short-term member loan\" in its own minutes. A new member asked what the channel was; nobody in the room remembered the metaphor. The bright-side infrastructure had been captured. What crossed out came back in — and what came back in displaced what was there.",
                  gatecall: "The Gate is directional: bright-to-systems on the way out, systems-to-bright on the way in. When the systems-side language crosses inward and stays, the Gate has failed. The correction is to go back to the origin record, find the original term, and restore it formally in the internal vocabulary — even if the systems-side word continues to appear in outgoing documents.",
                },
                {
                  name: "The Honest Equivalent",
                  tag: "Substitution that flatters",
                  description: "Choosing a systems-side translation that makes the bright-side reality sound better than it is, rather than choosing the translation that is most accurate. The equivalent is technically defensible but its connotation changes the meaning in the reader's favour of the speaker.",
                  signal: "The systems-side term would lead a reader to assume a higher degree of formality, scale, or compliance than the reality warrants.",
                  example: "A kitchen operation serving twenty households a week describes itself in a funder application as a \"regional food hub.\" The practitioners know that the systems-side reader will picture a warehouse operation with cold-chain capacity and multiple distribution routes. The operation has none of these things. \"Regional food hub\" is technically not false — the practitioners interpret their work as regional and as a hub — but the translation flatters. A more honest equivalent is \"community food redistribution operation serving a twenty-household catchment.\" Less impressive; more honest.",
                  gatecall: "The Gate asks: would the reader, on visiting, feel misled? If yes, the translation is not honest. The substitution should be the most accurate equivalent the practitioner can find — not the most advantageous one.",
                },
                {
                  name: "The Refusal Dodge",
                  tag: "Refusal used as avoidance",
                  description: "Using the Gate's refusal function — the formal right to hold a term on the bright side because no honest equivalent exists — as a way to avoid the work of finding a translation, rather than as a genuine conclusion that no honest equivalent is available.",
                  signal: "The practitioner reaches for refusal quickly, without exhausting the translation options, and the result is that the document goes out with a gap where a translation could have been.",
                  example: "A cooperative's books use the term \"the quiet shelf\" for a reserve that is held outside the formal accounts and drawn on only in specific community-defined circumstances. When a regulatory filing required disclosure of all reserves, the practitioner declared the term \"untranslatable\" and left the shelf out of the filing. In fact, the shelf had an honest systems-side equivalent — \"discretionary community reserve, governed by member vote\" — and the omission created a compliance problem that cost the co-op more than the translation would have.",
                  gatecall: "Refusal is the Gate's last move, not its first. The checklist is: (1) find the most accurate equivalent; (2) check whether the equivalent is honest; (3) check whether the equivalent can be clarified with a note; (4) only if none of these work, refuse. A refused crossing should always note what was lost and why no equivalent existed.",
                },
                {
                  name: "The Missing Slot",
                  tag: "Assuming absence of category",
                  description: "Concluding that a concept cannot cross because the systems-side form or vocabulary has no obvious slot for it, without checking whether the slot exists somewhere else in the form, whether the concept can be described in a notes field, or whether the form can be supplemented with an attachment.",
                  signal: "The practitioner says \"there's no box for it\" and stops looking.",
                  example: "A band-operated food program tried to report its fish-sharing distribution under a nutrition-program grant. The grant's reporting template had categories for \"purchased food\" and \"donated food\" but no category for food obtained through customary harvesting rights. The practitioner declared the distribution unreportable. The grant manager, when asked, confirmed that a supplementary narrative describing the food's origin and the distribution method was acceptable and had been used by other recipients. The slot existed; it just wasn't on the form.",
                  gatecall: "When the form has no obvious slot, the Gate's job is to find the closest available slot and supplement it with a narrative. If the systems genuinely have no slot and no supplement pathway, refusal is appropriate. \"No box on this form\" is not the same as \"no slot in the system.\"",
                },
                {
                  name: "The Both-Ways Error",
                  tag: "Simultaneous dialect use",
                  description: "Running the same term in both the bright-side and systems-side registers at the same time, in the same document or conversation, without telling either audience which register is active. The reader encounters the term and cannot tell which meaning applies.",
                  signal: "The same word appears twice in the same document with different meanings, or the same word is used in a meeting where some participants are using the bright-side meaning and others are using the systems-side meaning.",
                  example: "A proposal to a government program used the word \"members\" to mean co-op members (voting shareholders with full membership rights) in the governance section and also to mean community households served by the program (non-voting participants with no legal membership) in the program-impact section. The reviewer read the impact figures as applying to voting shareholders and concluded the program reached far fewer people than it actually did. The word had crossed the Gate in both directions simultaneously and landed in two different rooms at once.",
                  gatecall: "The Gate enforces consistency within a document. Once a term is assigned a systems-side equivalent for a given document, that assignment holds for the entire document. If two bright-side concepts share a systems-side word, one of them must be renamed or the document must disambiguate.",
                },
                {
                  name: "The Urgency Override",
                  tag: "Skipping the Gate under time pressure",
                  description: "Sending language across the Gate without a Gate decision because the deadline is close, the meeting is about to start, or the form needs to be submitted today. The Gate is bypassed, not refused — the practitioner did not conclude no crossing was needed; they simply did not stop to check.",
                  signal: "The practitioner later says \"I didn't have time to think about how to phrase it\" or \"I just used whatever came out.\"",
                  example: "A practitioner submitting a funding renewal under a one-hour deadline copied language from a previous application that had been written by a different person for a different program. The language passed the previous Gate; it had not been checked against the current program's requirements. The renewal was approved, but one term — \"food-security programming\" — triggered a compliance question six months later because the current program defined food-security programming differently from the previous one. The bypass cost more time than the Gate would have taken.",
                  gatecall: "The Gate is not a long process for routine crossings. A practitioner who knows the constellation's vocabulary can make a Gate call in minutes for familiar terms. Urgency justifies a fast Gate, not a bypassed one. If the deadline is genuinely incompatible with any Gate review, the document should go out with a note that the language is provisional pending a Gate review — not presented as settled.",
                },
                {
                  name: "The Narrative Lock",
                  tag: "Story treated as load-bearing fact",
                  description: "A community story — accurate, meaningful, and important — that has been used so often in external communications that it has begun to function as evidence rather than as context. The practitioners believe it so completely that they no longer apply RealityCore to it. When the systems ask for the underlying facts, the story is offered instead.",
                  signal: "The claim has appeared in so many grant applications, presentations, and annual reports that everyone in the room treats it as self-evidencing.",
                  example: "A co-op's origin story described how twelve founding households had pooled resources during a freight disruption and kept the community fed for three weeks. The story was true. Over eight years it became the opening of every grant application and the first line of every board chair's welcome. When a researcher asked for documentation of the founding event for an academic study, no one in the room could produce a date, a list of names, or a record of what was pooled. The story was factually accurate but had never been documented. The gap was not a problem for the community — the story held. It was a problem for the systems, which needed the underlying facts the story was about.",
                  gatecall: "Stories that cross the Gate regularly should have their underlying facts documented at least once — even informally — so that when the systems ask for the facts, the practitioner can produce them. The Gate can pass a story as a story (framed as community history or origin narrative); it cannot pass a story as evidence. If the story is being used as evidence, RealityCore applies before the Gate does.",
                },
              ].map(({ name, tag, description, signal, example, gatecall }) => (
                <div key={name} className="flex flex-col gap-4">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                      <h3 className="font-serif text-2xl font-bold text-foreground tracking-tight">{name}</h3>
                      <span className="text-xs uppercase tracking-[0.15em] text-primary font-semibold">{tag}</span>
                    </div>
                    <div className="w-8 h-[1px] bg-primary/40"></div>
                  </div>

                  <p className="text-base md:text-lg leading-relaxed text-foreground/80">{description}</p>

                  <div className="flex gap-3 items-start">
                    <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-semibold shrink-0 mt-1 w-16">Signal</span>
                    <p className="text-sm leading-relaxed text-foreground/70 italic">{signal}</p>
                  </div>

                  <div className="border-l-2 border-muted pl-5 ml-2">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-semibold mb-2">Field Example</p>
                    <p className="text-sm leading-relaxed text-foreground/75">{example}</p>
                  </div>

                  <div className="flex gap-3 items-start bg-muted/25 border border-border/50 rounded-sm p-4">
                    <span className="text-xs uppercase tracking-[0.12em] text-primary font-semibold shrink-0 mt-0.5 w-20">Gate Call</span>
                    <p className="text-sm leading-relaxed text-foreground/80">{gatecall}</p>
                  </div>
                </div>
              ))}

            </div>

            {/* ── Map Note ── */}
            <div className="mt-8 border border-border/60 rounded-sm p-6 bg-muted/20">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">On Naming</p>
              <p className="text-base leading-relaxed text-foreground/80">
                The names in this map are working names chosen for fieldwork. They are meant to be sayable in a meeting: "that looks like the Bright-Side Slide" is a usable intervention; a citation to a logic text is not. When a new fallacy pattern shows up repeatedly in Gate decisions and does not fit any of the above categories, it should be named and added — the map is not closed. The discipline is to name the move, not just to notice it.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-border mt-12 relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-2 h-2 rotate-45 bg-muted mx-auto mb-6"></div>
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">
            Headwaters &middot; Zone 5
          </p>
        </div>
      </footer>
    </div>
  );
}
