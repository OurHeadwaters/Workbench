/**
 * HiringBookkeeper.tsx
 *
 * Overview slide for the Bookkeeper role.
 * Covers: NDA requirement, access scope cap, and first-day checklist.
 */

export default function HiringBookkeeper() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Hiring — Bookkeeper
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Paperwork Pack
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.8vw] leading-[1] tracking-tight text-paper mb-[0.6vh]">
          Bookkeeper — three documents, one boundary.
        </h1>
        <div className="font-display italic text-[1.3vw] text-muted mb-[3vh] max-w-[65vw]">
          Remote, ~10 hrs/wk. Access to numbers is wide; access to identity is narrow.
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[2vw] overflow-hidden">

          {/* NDA requirement */}
          <div className="border border-rule rounded-[4px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-accent mb-[0.2vh]">
              Step 1 — NDA (sign before access)
            </div>
            <p className="font-body text-[0.85vw] text-paper leading-[1.55]">
              The Mutual NDA covers three categories of information the bookkeeper will
              unavoidably see:
            </p>
            <ul className="font-body text-[0.85vw] text-paper leading-[1.55] space-y-[0.4vh] list-none">
              {[
                "Client community names and nation identifiers",
                "Monthly contract values and invoice amounts",
                "Internal operating methodology and cost structure",
              ].map((item) => (
                <li key={item} className="flex items-start gap-[0.5vw]">
                  <span className="text-accent mt-[0.1vh] shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-body text-[0.8vw] text-muted leading-[1.4] mt-auto">
              Two-year obligation. Mutual — the practitioner's business information is
              equally protected. Sign at the same time as the contractor agreement.
            </p>
          </div>

          {/* Scope cap */}
          <div className="border border-rule rounded-[4px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.2vh]">
              Step 2 — Scope cap (in the contractor agreement)
            </div>
            <div className="font-body text-[0.85vw] text-paper leading-[1.55] space-y-[0.8vh]">
              <div>
                <div className="font-semibold text-paper mb-[0.2vh]">In scope</div>
                <ul className="space-y-[0.3vh]">
                  {[
                    "QuickBooks file — read + write",
                    "Invoicing and accounts receivable",
                    "CRA remittances and payroll summaries",
                    "Monthly close reports to the practitioner",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-[0.5vw]">
                      <span className="text-accent shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-semibold text-muted mb-[0.2vh]">Out of scope</div>
                <ul className="space-y-[0.3vh]">
                  {[
                    "Bank login credentials",
                    "Community household data or contact lists",
                    "Server or software administration",
                    "Any communication with clients directly",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-[0.5vw]">
                      <span className="text-muted shrink-0">✗</span>
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* First-day checklist */}
          <div className="border border-rule rounded-[4px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.2vh]">
              First-day checklist
            </div>
            <div className="flex-1 space-y-[0.5vh]">
              {[
                { done: false, item: "Contractor agreement signed (both parties)" },
                { done: false, item: "NDA signed (both parties)" },
                { done: false, item: "QuickBooks access provisioned with named login" },
                { done: false, item: "Scope cap walkthrough completed verbally" },
                { done: false, item: "Monthly close schedule agreed and calendared" },
                { done: false, item: "Practitioner emergency contact confirmed" },
                { done: false, item: "HST # or exemption confirmed in writing" },
                { done: false, item: "Invoice template reviewed and accepted" },
                { done: false, item: "First invoice date agreed" },
              ].map(({ item }) => (
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
