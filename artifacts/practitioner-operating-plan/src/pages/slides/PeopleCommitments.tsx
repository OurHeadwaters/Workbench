type Commitment = {
  n: string;
  title: string;
  what: string;
  why: string;
};

const commitments: Commitment[] = [
  {
    n: "01",
    title: "Annual pay adjustment lands on a fixed date — before anyone has to ask.",
    what:
      "Every role's wage and bucket sizing is reviewed once a year, on the same calendar week, against an open formula. The cheque changes before the conversation happens. No private negotiation, no counter-offer culture, no one ever has to threaten to leave to get raised.",
    why:
      "The moment a raise depends on asking — or worse, on threatening — the comp design has already failed. Predictable cadence, public formula, money moves first: that's what makes the floor real instead of rhetorical.",
  },
  {
    n: "02",
    title: "Show up at the hard moments — funeral, hospital, breakdown in February.",
    what:
      "When a parent dies, when the kid is in the hospital, when the truck breaks down in -35 and there's no fix until next week — I show up. Time off without counting it. The cheque early. A covered shift. Sometimes just sitting on the porch with coffee. Funerals, family illness, vehicle breakdown — these are the named ones; the unnamed ones get the same treatment.",
    why:
      "Resilience and HSA dollars (bucket 03) are the structure. Showing up in person is the proof the structure means anything. People don't remember the policy line — they remember who actually came.",
  },
  {
    n: "03",
    title: "Once a quarter, name out loud what each person is worth and why.",
    what:
      "Every quarter, every person on the crew gets a private, specific, written note from the practitioner naming exactly what they're worth to the agency and why. The judgment they showed in week 7. The careful work that didn't make a spreadsheet. The thing only they would have caught. Same day each quarter. No skipping. No 'I'll get to it.'",
    why:
      "Capable people will leave a place where the work is good but the seeing is absent. Naming the worth is the cheapest, most-skipped retention tool there is — and the one that makes everything else in the waterfall feel earned instead of transactional.",
  },
];

export default function PeopleCommitments() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              V · People &amp; Retention · 07 — Three behavioural commitments
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Three commitments.
              <span className="italic font-normal text-accent"> Posted, repeated, and used as the test for every future deviation.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw] font-body text-[0.95vw] text-muted leading-[1.4]">
            The buckets above are the structure.{" "}
            <span className="text-primary font-semibold">
              These three rules are how the practitioner behaves inside it
            </span>{" "}
            — and what a future board has to keep doing after me.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.2vw] min-h-0">
          {commitments.map((c, i) => (
            <div
              key={c.n}
              className="rounded-[0.4vw] p-[1.4vw] flex flex-col"
              style={
                i === 1
                  ? { background: "var(--slide-primary)", color: "var(--slide-bg)" }
                  : { background: "var(--slide-paper)" }
              }
            >
              <div className="flex items-baseline gap-[0.7vw] mb-[1vh]">
                <div
                  className="font-mono text-[0.95vw] font-semibold"
                  style={
                    i === 1
                      ? { color: "#e9c8a8" }
                      : { color: "var(--slide-accent)" }
                  }
                >
                  {c.n}
                </div>
                <div
                  className="font-display text-[1.4vw] leading-tight font-medium"
                  style={i === 1 ? undefined : { color: "var(--slide-primary)" }}
                >
                  {c.title}
                </div>
              </div>
              <div
                className="font-body text-[0.95vw] leading-[1.45] mb-[1.2vh]"
                style={i === 1 ? { opacity: 0.95 } : { color: "var(--slide-text)" }}
              >
                <span
                  className="font-mono uppercase tracking-[0.18em] text-[0.7vw] block mb-[0.4vh]"
                  style={
                    i === 1
                      ? { color: "#e9c8a8", opacity: 0.85 }
                      : { color: "var(--slide-muted)" }
                  }
                >
                  What it means in practice
                </span>
                {c.what}
              </div>
              <div
                className="mt-auto pt-[1vh] border-t font-body text-[0.85vw] leading-[1.4]"
                style={
                  i === 1
                    ? { borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }
                    : { borderColor: "var(--slide-rule)", color: "var(--slide-muted)" }
                }
              >
                <span
                  className="font-mono uppercase tracking-[0.18em] text-[0.7vw] block mb-[0.3vh]"
                  style={
                    i === 1
                      ? { color: "#e9c8a8", opacity: 0.75 }
                      : { color: "var(--slide-muted)" }
                  }
                >
                  Why it's load-bearing
                </span>
                {c.why}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-[2vh] pt-[1.2vh] border-t font-display italic text-[1.3vw] text-muted leading-[1.4] max-w-[80vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          The buckets are the dollars.{" "}
          <span className="text-primary font-semibold not-italic">
            The commitments are the trust.
          </span>{" "}
          A 10-year crew needs both — and notices, in the first 90 days,
          which one is missing.
        </div>
      </div>
    </div>
  );
}
