/**
 * HiringHandyman.tsx
 *
 * Overview slide for the Handyman role.
 * Covers: VSC requirement, supervision rules before VSC clears,
 * the standing "tell me anything weird" conversation script with
 * the kids, annual re-check reminder, and first-day checklist.
 */

export default function HiringHandyman() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Hiring — Handyman
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Paperwork Pack
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.8vw] leading-[1] tracking-tight text-paper mb-[0.6vh]">
          Handyman — before day one.
        </h1>
        <div className="font-display italic text-[1.3vw] text-muted mb-[2.5vh] max-w-[65vw]">
          This role is in the home around children. Three gates must close before keys change hands.
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[2.5vw] overflow-hidden">

          {/* Left column */}
          <div className="flex flex-col gap-[1.2vh]">

            {/* Gate 1 — VSC */}
            <div className="border border-rule rounded-[4px] px-[1.5vw] py-[1.2vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-accent mb-[0.6vh]">
                Gate 1 — Vulnerable Sector Check
              </div>
              <ul className="font-body text-[0.85vw] text-paper leading-[1.5] space-y-[0.3vh]">
                <li>Candidate takes the VSC Request Letter (see next slide) to Dryden Police Service or OPP.</li>
                <li>Processing time: 1–3 weeks for Dryden residents; up to 6 weeks if RCMP national search is triggered.</li>
                <li>Cost paid by practitioner — keep receipt.</li>
                <li><span className="text-accent font-semibold">Not negotiable</span>: no unsupervised home access until clean result in hand.</li>
              </ul>
            </div>

            {/* Gate 2 — Supervision rules */}
            <div className="border border-rule rounded-[4px] px-[1.5vw] py-[1.2vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.6vh]">
                Gate 2 — Supervision while VSC is pending
              </div>
              <ul className="font-body text-[0.85vw] text-paper leading-[1.5] space-y-[0.3vh]">
                <li>Practitioner or another known adult is present for every visit.</li>
                <li>Candidate does not enter rooms children occupy alone.</li>
                <li>No exceptions for "quick" tasks — if it takes 5 minutes, the adult stays.</li>
                <li>If scheduling makes supervision impossible, delay the task.</li>
              </ul>
            </div>

            {/* Annual re-check */}
            <div className="border border-rule rounded-[4px] px-[1.5vw] py-[1.2vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.6vh]">
                Annual re-check reminder
              </div>
              <p className="font-body text-[0.85vw] text-paper leading-[1.5]">
                Set a calendar reminder for the same date each year. VSC is a snapshot, not a lifetime pass.
                The re-check letter is identical to the first — keep a copy in the paperwork folder and ask
                the contractor to take it in by the anniversary date.
              </p>
            </div>

            {/* First-day checklist */}
            <div className="border border-rule rounded-[4px] px-[1.5vw] py-[1.2vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.6vh]">
                First-day checklist
              </div>
              <div className="space-y-[0.4vh]">
                {[
                  "VSC result confirmed in hand (clean)",
                  "Contractor agreement signed (both parties)",
                  "Supervision rules walked through verbally",
                  "Household walkthrough completed with practitioner",
                  '"Tell me anything weird" conversation had with kids',
                  "Annual re-check date calendared",
                  "Payment terms and invoice process confirmed",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-[0.7vw]">
                    <div className="w-[0.85vw] h-[0.85vw] mt-[0.1vh] rounded-[2px] border border-muted shrink-0" />
                    <span className="font-body text-[0.78vw] text-paper leading-[1.35]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-[0.8vh] pt-[0.7vh] border-t border-rule font-body text-[0.7vw] text-muted leading-[1.3]">
                Print this panel. Check boxes in pen. File with signed documents.
              </div>
            </div>
          </div>

          {/* Right column — "Tell me anything weird" script */}
          <div className="border border-rule rounded-[4px] px-[1.5vw] py-[1.5vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-accent mb-[0.8vh]">
              Gate 3 — Standing conversation script with the kids
            </div>
            <p className="font-body text-[0.85vw] text-muted italic mb-[1.2vh]">
              Have this conversation before the contractor's first day, and repeat it casually every few months.
              Keep it natural — not an interrogation.
            </p>

            <div className="flex-1 space-y-[1.4vh]">
              {[
                {
                  cue: "Open",
                  line: '"[Name] is going to be helping us with the house. You\'ll probably see them doing stuff like fixing things or moving things around."',
                },
                {
                  cue: "Permission to tell",
                  line: '"If anything ever feels weird or uncomfortable — even something small — I want you to tell me. You won\'t be in trouble and I won\'t be mad. There\'s no wrong answer."',
                },
                {
                  cue: "Name it plainly",
                  line: '"That means: if they ask you to do something that feels strange, if they say something that bothers you, or if anything just feels off — that\'s worth telling me."',
                },
                {
                  cue: "Close the loop",
                  line: '"I ask because I care about you, not because I think something is wrong. Okay?"',
                },
                {
                  cue: "Leave the door open",
                  line: '"Any time — not just today. You can always come tell me."',
                },
              ].map(({ cue, line }) => (
                <div key={cue} className="flex gap-[1vw]">
                  <div className="font-mono uppercase tracking-[0.12em] text-[0.7vw] text-muted w-[10vw] shrink-0 pt-[0.15vh]">
                    {cue}
                  </div>
                  <div className="font-body text-[0.85vw] text-paper leading-[1.5] border-l border-rule pl-[1vw]">
                    {line}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-[1.5vh] pt-[1.2vh] border-t border-rule font-body text-[0.8vw] text-muted leading-[1.4]">
              Note: This script is for household safety awareness only and does not replace any professional child-protection
              obligation the practitioner holds in their professional capacity.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
