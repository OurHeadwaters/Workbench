/**
 * PaperworkContractor.tsx
 *
 * One-page Ontario Independent Contractor Agreement.
 * Plain language. Covers rate, scope, termination, IP.
 * White/paper background — designed to print cleanly.
 *
 * Practitioner fills in the bracketed fields before printing.
 */

export default function PaperworkContractor() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f9f6f0" }}>
      <div className="w-full h-full px-[8vw] py-[5vh] flex flex-col" style={{ color: "#1a1a1a" }}>

        {/* Deck label */}
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.75vw]" style={{ color: "#888" }}>
            Headwaters — Onboarding Paperwork Pack
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.75vw]" style={{ color: "#888" }}>
            Independent Contractor Agreement — Ontario · Template
          </div>
        </div>

        {/* Document */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "3vh 4vw",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          }}
        >
          {/* Title */}
          <div className="text-center mb-[2vh]">
            <div className="font-body font-bold text-[1.1vw] mb-[0.3vh]" style={{ color: "#111" }}>
              INDEPENDENT CONTRACTOR AGREEMENT
            </div>
            <div className="font-body text-[0.8vw]" style={{ color: "#666" }}>
              Ontario · Effective Date: [DD Month YYYY]
            </div>
          </div>

          <div style={{ borderTop: "1px solid #ddd", marginBottom: "1.5vh" }} />

          {/* Parties */}
          <div className="font-body text-[0.82vw] mb-[1.4vh]" style={{ color: "#333", lineHeight: 1.6 }}>
            This Agreement is between{" "}
            <strong>Headwaters Food Systems Inc.</strong>{" "}
            ("[Practitioner Name]"; "Headwaters"; "Client") and{" "}
            <strong>[Contractor Full Legal Name]</strong>{" "}
            ("[Contractor]"). Together the "Parties".
          </div>

          {/* Body */}
          <div className="flex-1 grid grid-cols-2 gap-x-[3vw] gap-y-[1.1vh] font-body text-[0.8vw] leading-[1.6]" style={{ color: "#222" }}>

            <div>
              <div className="font-semibold mb-[0.25vh]" style={{ color: "#111" }}>1. Services</div>
              <p>
                The Contractor will perform: [brief scope — e.g. "day-to-day operations at the Deer Lake store,
                including community liaison, Square POS oversight, and on-site phone-holder duties"]. Specific
                tasks may be agreed in writing from time to time.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.25vh]" style={{ color: "#111" }}>2. Rate &amp; Payment</div>
              <p>
                <strong>$[rate]/hr</strong>, invoiced bi-weekly. HST is added if the Contractor is registered.
                Headwaters will pay within <strong>5 business days</strong> of receiving a correct invoice.
                No source deductions will be made — the Contractor is responsible for their own tax obligations.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.25vh]" style={{ color: "#111" }}>3. Term</div>
              <p>
                This Agreement begins on the Effective Date and continues until terminated under Section 4.
                There is no guaranteed minimum number of hours or duration.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.25vh]" style={{ color: "#111" }}>4. Termination</div>
              <p>
                Either Party may end this Agreement by giving <strong>30 days' written notice</strong>.
                Headwaters may terminate immediately for cause (including dishonesty, serious misconduct,
                or breach of the NDA). On termination, the Contractor will be paid for all hours worked
                up to the termination date.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.25vh]" style={{ color: "#111" }}>5. Intellectual Property</div>
              <p>
                Any work product created by the Contractor in the course of providing Services — including
                reports, data analysis, processes, and documents — belongs to Headwaters on creation.
                The Contractor's pre-existing tools, knowledge, and materials are excluded.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.25vh]" style={{ color: "#111" }}>6. Independent Contractor Status</div>
              <p>
                The Contractor is an independent contractor, not an employee. The Contractor controls how
                the Services are performed, supplies their own tools where reasonable, and may work for
                other clients unless doing so conflicts with this Agreement.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.25vh]" style={{ color: "#111" }}>7. Confidentiality</div>
              <p>
                The Contractor agrees to keep all of Headwaters' Confidential Information private and to
                use it only to perform the Services. A separate Mutual NDA is signed simultaneously with
                this Agreement and is incorporated by reference.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.25vh]" style={{ color: "#111" }}>8. Governing Law</div>
              <p>
                This Agreement is governed by the laws of the Province of Ontario and the federal laws
                of Canada applicable therein. Disputes will first be addressed in good faith between the
                Parties before any formal process.
              </p>
            </div>

          </div>

          {/* Signatures */}
          <div style={{ borderTop: "1px solid #ddd", marginTop: "1.5vh", paddingTop: "1.5vh" }}>
            <div className="grid grid-cols-2 gap-[4vw] font-body text-[0.8vw]" style={{ color: "#333" }}>
              <div>
                <div className="font-semibold mb-[0.3vh]">Headwaters Food Systems Inc.</div>
                <div style={{ borderTop: "1px solid #999", width: "14vw", margin: "2.5vh 0 0.5vh" }} />
                <div>[Practitioner Name], [Title]</div>
                <div style={{ color: "#888" }}>Date: _______________________</div>
              </div>
              <div>
                <div className="font-semibold mb-[0.3vh]">[Contractor Full Legal Name]</div>
                <div style={{ borderTop: "1px solid #999", width: "14vw", margin: "2.5vh 0 0.5vh" }} />
                <div>[Contractor Name]</div>
                <div style={{ color: "#888" }}>Date: _______________________</div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-[1.2vh] font-body text-[0.7vw]" style={{ color: "#999", lineHeight: 1.4 }}>
            This template is reviewed against Ontario small-business norms as of 2025. It is not a substitute for legal advice.
            Ontario courts have found contractor agreements invalid when the working relationship resembles employment — if in doubt, consult an employment lawyer.
          </div>

        </div>

      </div>
    </div>
  );
}
