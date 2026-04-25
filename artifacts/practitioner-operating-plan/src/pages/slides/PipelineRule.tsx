export default function PipelineRule() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              IV · 01 — The hard rule
            </div>
            <h2
              className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              No contract closes
              <span className="italic font-normal text-accent"> without the next one named.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.05vw] text-muted leading-[1.4]">
            Same voice, same weight as the Non-Negotiables and the Two
            Hard Rules. The rule that keeps the highway from running out
            of asphalt three months after the cheque clears.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.9vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              The rule
            </div>
            <div className="font-display text-[2.2vw] leading-tight font-medium mb-[1.5vh]">
              Before the current contract closes, the next one is named —
              client, scope, signed term, start date.
            </div>
            <div className="font-body text-[1.05vw] leading-[1.5] opacity-95 mb-[1.5vh]">
              "Named" means more than warm. It means a verbal yes, a draft
              scope on file, a date on the calendar, and a row in the
              pipeline map graded against the non-negotiables. If those
              four don't exist when the current contract enters its final
              60 days, the team holds — no new household commitments, no
              new salt experiments, nothing that assumes the next cheque.
            </div>
            <div
              className="mt-auto pt-[1.2vh] border-t font-mono uppercase tracking-[0.22em] text-[0.85vw]"
              style={{ borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }}
            >
              Checked at every monthly close · enforced by the bookkeeper
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.9vw] text-accent font-semibold mb-[1vh]">
              Why this is a hard rule, not a goal
            </div>
            <div className="font-display text-[1.7vw] leading-tight text-primary font-medium mb-[1.2vh]">
              The pipeline gap is what kills agencies — not bad work, not bad clients.
            </div>
            <div className="font-body text-[1.05vw] text-text leading-[1.5]">
              The Deer Lake contract pays the freight. The 60-day pay
              cycle, the team payroll, the depot rent — all of it assumes
              the next contract starts inside 90 days of this one ending.
              A six-month dead air between contracts collapses the
              structure. Treating "find the next one" as a soft priority
              loses to the loose-ends trap every time. So it gets the
              same enforcement weight as the non-negotiables and the two
              hard rules: it is checked, it is reported on, and the day
              it slips is the day other things stop.
            </div>
          </div>
        </div>

        <div
          className="mt-[2vh] rounded-[0.4vw] px-[2vw] py-[1.5vh] font-display italic text-[1.25vw] leading-[1.4] text-bg"
          style={{ background: "var(--slide-primary)" }}
        >
          <span className="font-mono uppercase tracking-[0.22em] text-[0.9vw] not-italic opacity-80 mr-[1vw]">
            Plain-language version
          </span>
          The day Deer Lake ends, Pilot #2 has a name, a date, and a
          signed scope. Or we don't get to call it agency yet.
        </div>
      </div>
    </div>
  );
}
