/**
 * HiringOpsManager.tsx
 *
 * Overview slide for the Operations Manager role.
 * Covers: paid-trial letter pattern, contractor agreement summary,
 * NDA requirement, and first-day checklist.
 */

export default function HiringOpsManager() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Hiring — Operations Manager
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Paperwork Pack
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.8vw] leading-[1] tracking-tight text-paper mb-[0.6vh]">
          Ops Manager — trial first, then the contract.
        </h1>
        <div className="font-display italic text-[1.3vw] text-muted mb-[3vh] max-w-[65vw]">
          Dryden, on-site, ~40 hrs/wk. High-trust role. The paid trial is not a formality — it's a real decision point.
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[2vw] overflow-hidden">

          {/* Paid-trial pattern */}
          <div className="border border-rule rounded-[4px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-accent mb-[0.2vh]">
              Paid-trial pattern
            </div>
            <div className="space-y-[0.9vh]">
              {[
                {
                  label: "Length",
                  value: "2 weeks (10 business days), extendable once by mutual agreement to 4 weeks.",
                },
                {
                  label: "Rate during trial",
                  value: "Full contracted rate — same as post-trial. No reduced-rate trial.",
                },
                {
                  label: "Decision date",
                  value: 'Named explicitly in the letter: e.g. "Decision will be communicated by [Date]."',
                },
                {
                  label: "If yes",
                  value: "Contractor agreement takes effect on the decision date. Trial pay rolls into it seamlessly.",
                },
                {
                  label: "If no",
                  value: "Final invoice paid within 5 business days. No further obligation on either side. No \"reason required\" language.",
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-[1vw]">
                  <div className="font-mono uppercase tracking-[0.12em] text-[0.72vw] text-muted w-[8vw] shrink-0 pt-[0.1vh]">
                    {label}
                  </div>
                  <div className="font-body text-[0.85vw] text-paper leading-[1.45] border-l border-rule pl-[0.8vw]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-[1vh] border-t border-rule font-body text-[0.75vw] text-muted leading-[1.35]">
              The paid-trial letter is the only document during the trial period.
              The contractor agreement is not signed until the "yes" decision.
            </div>
          </div>

          {/* Contractor agreement summary */}
          <div className="border border-rule rounded-[4px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.2vh]">
              Contractor agreement — key terms
            </div>
            <div className="space-y-[0.9vh]">
              {[
                {
                  label: "Rate",
                  value: "$40/hr, invoiced bi-weekly. HST added if registered.",
                },
                {
                  label: "Scope",
                  value: "Day-to-day store operations, Deer Lake on-site presence, community liaison, phone-holder duties.",
                },
                {
                  label: "Termination",
                  value: "30-day written notice, either party. Immediate termination for cause (defined in agreement).",
                },
                {
                  label: "IP",
                  value: "Work product created in scope belongs to Headwaters. Personal tools and pre-existing knowledge excluded.",
                },
                {
                  label: "Independence",
                  value: "Contractor supplies own tools where reasonable. Not an employee — no source deductions.",
                },
                {
                  label: "Confidentiality",
                  value: "NDA is a separate document — sign simultaneously with this agreement.",
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-[1vw]">
                  <div className="font-mono uppercase tracking-[0.12em] text-[0.72vw] text-muted w-[8vw] shrink-0 pt-[0.1vh]">
                    {label}
                  </div>
                  <div className="font-body text-[0.85vw] text-paper leading-[1.45] border-l border-rule pl-[0.8vw]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* First-day checklist */}
          <div className="border border-rule rounded-[4px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.2vh]">
              First-day checklist (post-trial)
            </div>
            <div className="flex-1 space-y-[0.5vh]">
              {[
                "Contractor agreement signed (both parties)",
                "NDA signed (both parties)",
                "Square POS login created and tested",
                "Store keys / access codes transferred",
                "Emergency contact and on-call protocol reviewed",
                "Weekly reporting schedule agreed and calendared",
                "Practitioner escalation path walked through",
                "Community liaison introduction plan confirmed",
                "HST # or exemption status confirmed in writing",
                "First invoice date agreed",
              ].map((item) => (
                <div key={item} className="flex items-start gap-[0.8vw]">
                  <div className="w-[0.9vw] h-[0.9vw] mt-[0.1vh] rounded-[2px] border border-muted shrink-0" />
                  <span className="font-body text-[0.82vw] text-paper leading-[1.4]">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-[1vh] border-t border-rule font-body text-[0.75vw] text-muted leading-[1.35]">
              Print this column. Check boxes in pen on day one. File with signed documents.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
