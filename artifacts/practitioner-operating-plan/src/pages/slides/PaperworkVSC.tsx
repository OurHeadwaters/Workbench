/**
 * PaperworkVSC.tsx
 *
 * Printable Vulnerable Sector Check request letter template.
 * Candidate takes this to Dryden Police Service or OPP.
 * White/paper background — designed to read like an actual document.
 *
 * Practitioner fills in the bracketed fields before printing.
 */

export default function PaperworkVSC() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f9f6f0" }}>
      <div className="w-full h-full px-[8vw] py-[5vh] flex flex-col" style={{ color: "#1a1a1a" }}>

        {/* Deck label */}
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.75vw]" style={{ color: "#888" }}>
            Headwaters — Onboarding Paperwork Pack
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.75vw]" style={{ color: "#888" }}>
            Template — fill bracketed fields before printing
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

          <div className="mb-[1.8vh]" style={{ borderTop: "1px solid #ddd" }} />

          {/* Recipient */}
          <div className="font-body text-[0.85vw] mb-[1.8vh]" style={{ color: "#333", lineHeight: 1.5 }}>
            <div className="font-semibold mb-[0.3vh]">Dryden Police Service</div>
            25 Van Horne Ave, Dryden, ON  P8N 2B2<br />
            Tel: (807) 223-2201
          </div>

          {/* Subject */}
          <div className="font-semibold font-body text-[0.9vw] mb-[1.8vh] underline" style={{ color: "#111" }}>
            Re: Vulnerable Sector Check Request — [Full Legal Name of Applicant]
          </div>

          {/* Body */}
          <div className="font-body text-[0.87vw] leading-[1.65] space-y-[1.2vh] flex-1" style={{ color: "#222" }}>
            <p>
              To Whom It May Concern,
            </p>
            <p>
              Headwaters Food Systems Inc. is requesting a Vulnerable Sector Check for the individual named above.
              This person has applied for engagement as an independent contractor in a capacity that involves
              regular presence in a private residence where children reside.
            </p>
            <p>
              Under Ontario's Child, Youth and Family Services Act and our internal child-safety policy, a clear
              Vulnerable Sector Check is required before this individual may work unsupervised in the home.
            </p>

            <div
              style={{
                background: "#f5f3ef",
                border: "1px solid #ddd",
                borderRadius: "3px",
                padding: "1.2vh 1.2vw",
              }}
            >
              <div className="font-semibold mb-[0.6vh]" style={{ color: "#111" }}>Applicant Information</div>
              <div className="grid grid-cols-2 gap-x-[2vw] gap-y-[0.4vh]">
                {[
                  ["Full legal name", "[Last, First Middle]"],
                  ["Date of birth", "[DD/MM/YYYY]"],
                  ["Current address", "[Full address, City, Province, Postal Code]"],
                  ["Previous address (if < 5 yrs at current)", "[Address or N/A]"],
                  ["Phone", "[Phone number]"],
                  ["Email", "[Email address]"],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-[0.4vw]">
                    <span className="font-mono text-[0.72vw] shrink-0 mt-[0.05vh]" style={{ color: "#666" }}>{label}:</span>
                    <span className="text-[0.82vw]" style={{ color: "#444" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <p>
              The cost of this check is covered by Headwaters Food Systems Inc. Please contact the practitioner
              at the address above if a fee or additional form is required.
            </p>
            <p>
              Please direct the completed report to the applicant, who will provide it to the practitioner directly.
              Results should not be sent by email to the applicant.
            </p>
            <p>
              Thank you for your service to our community.
            </p>
          </div>

          {/* Signature block */}
          <div className="mt-[2vh] pt-[1.5vh]" style={{ borderTop: "1px solid #ddd" }}>
            <div className="grid grid-cols-2 gap-[4vw]">
              <div>
                <div className="font-body text-[0.82vw] mb-[2.5vh]" style={{ color: "#333" }}>Sincerely,</div>
                <div style={{ borderTop: "1px solid #999", width: "14vw", marginBottom: "0.4vh" }} />
                <div className="font-body text-[0.82vw]" style={{ color: "#333" }}>
                  [Practitioner Name]<br />
                  Headwaters Food Systems Inc.
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono uppercase tracking-[0.15em] text-[0.68vw] mb-[0.4vh]" style={{ color: "#888" }}>
                  Annual re-check date
                </div>
                <div className="font-body text-[0.82vw]" style={{ color: "#444" }}>
                  Set calendar reminder for [same date + 1 year].<br />
                  Keep this letter on file — the re-check letter is identical.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
