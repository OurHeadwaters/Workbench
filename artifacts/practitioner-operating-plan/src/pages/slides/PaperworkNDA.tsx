/**
 * PaperworkNDA.tsx
 *
 * One-page Mutual Non-Disclosure Agreement.
 * Ontario small-business norm — plain language.
 * White/paper background — designed to print cleanly.
 *
 * Practitioner fills in the bracketed fields before printing.
 */

export default function PaperworkNDA() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f9f6f0" }}>
      <div className="w-full h-full px-[8vw] py-[5vh] flex flex-col" style={{ color: "#1a1a1a" }}>

        {/* Deck label */}
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.75vw]" style={{ color: "#888" }}>
            Headwaters — Onboarding Paperwork Pack
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.75vw]" style={{ color: "#888" }}>
            Mutual NDA — Ontario · Template
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
              MUTUAL NON-DISCLOSURE AGREEMENT
            </div>
            <div className="font-body text-[0.8vw]" style={{ color: "#666" }}>
              Ontario · Effective Date: [DD Month YYYY]
            </div>
          </div>

          <div style={{ borderTop: "1px solid #ddd", marginBottom: "1.6vh" }} />

          {/* Parties */}
          <div className="font-body text-[0.82vw] mb-[1.5vh]" style={{ color: "#333", lineHeight: 1.6 }}>
            This Agreement is between{" "}
            <strong>Headwaters Food Systems Inc.</strong>{" "}
            ("[Practitioner Name]", "Headwaters") and{" "}
            <strong>[Contractor Full Legal Name]</strong>{" "}
            ("[Contractor]"), together the "Parties".
          </div>

          {/* Body */}
          <div className="flex-1 grid grid-cols-2 gap-x-[3vw] gap-y-[1.2vh] font-body text-[0.8vw] leading-[1.6]" style={{ color: "#222" }}>

            <div>
              <div className="font-semibold mb-[0.3vh]" style={{ color: "#111" }}>1. Purpose</div>
              <p>
                The Parties may share confidential information in connection with the Contractor's engagement
                with Headwaters. Each Party agrees to protect the other's confidential information on the
                terms below.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.3vh]" style={{ color: "#111" }}>2. Confidential Information</div>
              <p>
                "Confidential Information" means any non-public information shared by either Party, including:
                client community names and nation identifiers; contract and invoice amounts; internal operating
                methodology; cost structure; and any information marked "confidential" or that a reasonable
                person would understand to be sensitive.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.3vh]" style={{ color: "#111" }}>3. Obligations</div>
              <p>
                Each Party will: (a) keep the other's Confidential Information strictly private;
                (b) use it only for the purpose of the engagement; (c) not disclose it to any third party
                without prior written consent; and (d) apply at least the same care as it uses to protect
                its own confidential information (never less than reasonable care).
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.3vh]" style={{ color: "#111" }}>4. Exceptions</div>
              <p>
                These obligations do not apply to information that: (a) is or becomes publicly known through
                no breach of this Agreement; (b) was already known to the receiving Party before disclosure;
                (c) is independently developed without use of Confidential Information; or (d) must be
                disclosed by law or court order (in which case the disclosing Party will give prompt written
                notice where legally permitted).
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.3vh]" style={{ color: "#111" }}>5. Term</div>
              <p>
                Obligations under this Agreement begin on the Effective Date and continue for{" "}
                <strong>two (2) years</strong>, whether or not the engagement continues. Return or destruction
                of Confidential Information may be requested by either Party at the end of the engagement.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.3vh]" style={{ color: "#111" }}>6. No Licence or Employment</div>
              <p>
                This Agreement grants no licence to any intellectual property and does not create an
                employment relationship. Nothing herein limits either Party's right to pursue similar
                business activities, provided Confidential Information is not used to do so.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.3vh]" style={{ color: "#111" }}>7. Governing Law</div>
              <p>
                This Agreement is governed by the laws of the Province of Ontario and the federal laws
                of Canada applicable therein.
              </p>
            </div>

            <div>
              <div className="font-semibold mb-[0.3vh]" style={{ color: "#111" }}>8. Entire Agreement</div>
              <p>
                This Agreement is the complete agreement between the Parties on confidentiality and
                supersedes any prior discussions. It may be amended only in writing signed by both Parties.
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
            For engagements involving personal health information or Indigenous data sovereignty, consult a lawyer before use.
          </div>

        </div>

      </div>
    </div>
  );
}
