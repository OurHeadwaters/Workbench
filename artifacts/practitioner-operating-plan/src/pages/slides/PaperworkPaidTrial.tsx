/**
 * PaperworkPaidTrial.tsx
 *
 * Paid-trial offer letter.
 * Plain language. Covers length, rate, decision date,
 * and what "no" means — making parting clean.
 * White/paper background — designed to print cleanly.
 *
 * Practitioner fills in the bracketed fields before printing.
 */

export default function PaperworkPaidTrial() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f9f6f0" }}>
      <div className="w-full h-full px-[8vw] py-[5vh] flex flex-col" style={{ color: "#1a1a1a" }}>

        {/* Deck label */}
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.75vw]" style={{ color: "#888" }}>
            Headwaters — Onboarding Paperwork Pack
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.75vw]" style={{ color: "#888" }}>
            Paid-Trial Offer Letter — Template
          </div>
        </div>

        {/* Document */}
        <div
          className="flex-1 flex flex-col"
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "3.5vh 4vw",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          }}
        >
          {/* Letterhead */}
          <div className="flex items-start justify-between mb-[2.5vh]">
            <div>
              <div className="font-mono uppercase tracking-[0.2em] text-[0.8vw] mb-[0.3vh]" style={{ color: "#666" }}>
                Headwaters Food Systems Inc.
              </div>
              <div className="font-body text-[0.82vw]" style={{ color: "#444", lineHeight: 1.5 }}>
                [Practitioner mailing address]<br />
                [City, Province, Postal Code]<br />
                [Phone] · [Email]
              </div>
            </div>
            <div className="text-right font-body text-[0.82vw]" style={{ color: "#444", lineHeight: 1.5 }}>
              Date: [DD Month YYYY]
            </div>
          </div>

          <div style={{ borderTop: "1px solid #ddd", marginBottom: "1.8vh" }} />

          {/* Recipient */}
          <div className="font-body text-[0.85vw] mb-[2vh]" style={{ color: "#333", lineHeight: 1.5 }}>
            <div>[Candidate Full Name]</div>
            <div>[Address or "delivered by email"]</div>
          </div>

          {/* Subject */}
          <div className="font-semibold font-body text-[0.9vw] mb-[2vh] underline" style={{ color: "#111" }}>
            Re: Paid Trial Offer — [Role Title] with Headwaters Food Systems Inc.
          </div>

          {/* Body */}
          <div className="font-body text-[0.87vw] leading-[1.7] space-y-[1.4vh] flex-1" style={{ color: "#222" }}>
            <p>Dear [Candidate First Name],</p>

            <p>
              Following our conversations, I am pleased to offer you a paid trial engagement with
              Headwaters Food Systems Inc. for the role of <strong>[Role Title]</strong>.
              This letter sets out the terms of the trial clearly so that both of us can
              make a well-informed decision.
            </p>

            {/* Key terms box */}
            <div
              style={{
                background: "#f5f3ef",
                border: "1px solid #ddd",
                borderRadius: "3px",
                padding: "1.5vh 1.5vw",
              }}
            >
              <div className="font-semibold mb-[1vh]" style={{ color: "#111" }}>Trial terms at a glance</div>
              <div className="grid grid-cols-2 gap-x-[3vw] gap-y-[0.6vh] text-[0.82vw]">
                {[
                  ["Start date", "[DD Month YYYY]"],
                  ["Length", "2 weeks (10 business days). May be extended once by mutual agreement to 4 weeks."],
                  ["Rate", "$[rate]/hr, invoiced at the end of the trial period. HST added if you are HST-registered."],
                  ["Hours", "Approximately [X] hrs/wk. We will confirm the schedule before the start date."],
                  ["Decision date", "[DD Month YYYY] — I will communicate my decision on or before this date."],
                  ["What you are evaluating", "Whether this role fits your skills, availability, and working style."],
                  ["What I am evaluating", "Whether the scope and your approach are a match for the team's needs."],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-[0.5vw] items-start">
                    <span className="font-semibold shrink-0" style={{ color: "#444", minWidth: "9vw" }}>{label}:</span>
                    <span style={{ color: "#333" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <p>
              <strong>If the answer is yes</strong> on the decision date, we will sign a contractor agreement
              and an NDA at that time. Your trial pay is not conditional on a yes — you will be paid in full
              regardless of outcome.
            </p>

            <p>
              <strong>If the answer is no</strong> — from either side — your final invoice will be paid within
              5 business days of the decision date. There are no further obligations on either party.
              You are free to accept other work immediately. I will provide a brief written note confirming
              the trial is complete and payment has been sent, in case you need it for your records.
            </p>

            <p>
              Please confirm your acceptance of this offer by replying to this letter in writing (email is fine)
              by <strong>[acceptance deadline date]</strong>.
            </p>

            <p>
              I am looking forward to working together. If you have questions before the start date, please
              don't hesitate to reach out.
            </p>
          </div>

          {/* Signature block */}
          <div className="mt-[2vh] pt-[1.5vh]" style={{ borderTop: "1px solid #ddd" }}>
            <div className="grid grid-cols-2 gap-[4vw] font-body text-[0.82vw]" style={{ color: "#333" }}>
              <div>
                <div style={{ marginBottom: "0.4vh" }}>Sincerely,</div>
                <div style={{ borderTop: "1px solid #999", width: "14vw", margin: "2.5vh 0 0.5vh" }} />
                <div>[Practitioner Name]</div>
                <div>Headwaters Food Systems Inc.</div>
              </div>
              <div>
                <div style={{ marginBottom: "0.4vh" }}>Accepted by candidate:</div>
                <div style={{ borderTop: "1px solid #999", width: "14vw", margin: "2.5vh 0 0.5vh" }} />
                <div>[Candidate Name]</div>
                <div style={{ color: "#888" }}>Date: _______________________</div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-[1.2vh] font-body text-[0.7vw]" style={{ color: "#999", lineHeight: 1.4 }}>
            This letter creates a short-term independent contractor engagement only.
            It does not create an employment relationship or any obligation to offer ongoing work.
            Retain a signed copy for your records.
          </div>

        </div>

      </div>
    </div>
  );
}
