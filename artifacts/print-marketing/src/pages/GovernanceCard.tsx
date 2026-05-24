import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

function buildPlainText(): string {
  return [
    "HEADWATERS · COMMUNITY MONEY MACHINE",
    "Governance Quick-Reference Card",
    "Post this where your Kitchen Table meets.",
    "",
    "---",
    "",
    "DECISION AUTHORITY MATRIX",
    "",
    "Steward decides alone:",
    "  Cost Basis — routine expenses already in the agreed Cost Basis; pay practitioners at agreed rate; flag variances under 5% without a meeting",
    "  Reserve — monitor balance and report monthly only (no draws without a vote)",
    "  Reinvestment — spends up to the single-spend ceiling (default $2,500 CAD or 10% of monthly Cost Basis, whichever is lower)",
    "  Eave Flow — confirm overflow conditions are met; cannot redirect to a new recipient without a vote",
    "",
    "Kitchen Table must vote on:",
    "  1. Any change to monthly Cost Basis (up or down)",
    "  2. Any draw on the Reserve — no exceptions",
    "  3. Any Reinvestment spend above the single-spend ceiling",
    "  4. Any change to bucket percentages or split structure",
    "  5. Any new Eave Flow recipient",
    "  6. Any income stream exceeding 25% of total monthly income",
    "  7. Any partnership or contract creating a new recurring obligation",
    "  8. Annual audit findings — acknowledged before considered closed",
    "  9. Declaration of income failure (triggers Reserve access)",
    "",
    "---",
    "",
    "QUORUM",
    "Table = 4 bucket stewards + at least 1 witness (minimum 5 seats)",
    "Quorum = ¾ of named seats (4 of 5 for a standard table)",
    "Format = in person, on a live call, or written consent submitted before the meeting",
    "Witness counts toward quorum but cannot be the deciding vote on a Reserve draw or Cost Basis change.",
    "",
    "If quorum cannot be reached within 7 days of a trigger:",
    "  - 48-hour written consent window opens",
    "  - Default if still short: no change — machine holds current course",
    "  - Reserve draws always require a live meeting — no written-consent exception",
    "",
    "VOTING THRESHOLDS",
    "Simple majority — most decisions",
    "Two-thirds — Cost Basis increase >15%, any Reserve draw, bucket structure changes, Eave Flow recipient changes",
    "Unanimous — wind-down, ownership transfer, permanent removal of a member's stake",
    "",
    "---",
    "",
    "RESERVE RAID PROTOCOL — 5 STEPS",
    "",
    "Step 1 — Income Failure Declaration",
    "  Cost Basis steward documents that revenue has fallen below Cost Basis for two consecutive months (or a single month >50% shortfall). Sends written notice to all table members.",
    "",
    "Step 2 — All-Hands Table Meeting",
    "  Within 5 calendar days of the declaration. Live meeting required — cannot be replaced by written consent. Agenda: is a draw necessary, and how much?",
    "  Before authorizing: confirm all Cost Basis expenses reviewed for cuts, no Reinvestment spending, no Eave Flow, and failure is not due to a governance violation.",
    "",
    "Step 3 — Authorization",
    "  Two-thirds majority vote required. Every member's position recorded in the governance log.",
    "  Draw amount = minimum necessary to cover the confirmed shortfall. Not a round number. Not a buffer.",
    "",
    "Step 4 — Draw and Notification",
    "  Reserve steward executes the draw within 2 business days. All members receive written confirmation.",
    "  Machine immediately returns to Building State regardless of prior state.",
    "  Reserve must be rebuilt before Reinvestment or Eave Flow resumes.",
    "",
    "Step 5 — Replenishment Obligation",
    "  Within 30 days, the table meets to establish a replenishment plan naming:",
    "  — Monthly replenishment amount once Cost Basis is covered",
    "  — Target date to restore Reserve to pre-draw level",
    "  — Income recovery actions to prevent another failure",
    "  A Reserve draw not followed by a replenishment plan within 30 days is a governance violation.",
    "",
    "---",
    "",
    "ourheadwaters.ca",
    "bobbie@ourheadwaters.ca · 807 220 3654",
    "Dryden, Ontario · Treaty 3 Territory",
    "Version 1 · Anchored May 2026",
  ].join("\n");
}

export default function GovernanceCard() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="headwaters-governance-card.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "var(--cream)",
          minHeight: "11in",
        }}
      >
        <div
          style={{
            position: "relative",
            minHeight: "11in",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Decorative background circle */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "0.5in",
                right: "-2in",
                width: "6in",
                height: "6in",
                borderRadius: "50%",
                background: "rgba(31,61,46,0.04)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "2in",
                left: "-1.5in",
                width: "4in",
                height: "4in",
                borderRadius: "50%",
                background: "rgba(212,160,23,0.04)",
              }}
            />
          </div>

          {/* ── HEADER BAND ─────────────────────────────────────────────── */}
          <div
            style={{
              background: "var(--evergreen)",
              padding: "0.32in 0.55in 0.28in",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.5)",
                marginBottom: "0.15rem",
              }}
            >
              Headwaters · Community Money Machine
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.2rem",
                    fontWeight: 900,
                    color: "var(--cream)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    marginBottom: "0.1rem",
                  }}
                >
                  Governance Quick-Reference
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.88rem",
                    fontStyle: "italic",
                    color: "rgba(212,160,23,0.9)",
                  }}
                >
                  Post this where your Kitchen Table meets.
                </p>
              </div>
              {/* Version tag */}
              <div
                style={{
                  textAlign: "right",
                  paddingBottom: "0.05rem",
                  flexShrink: 0,
                  marginLeft: "0.3in",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6rem",
                    color: "rgba(244,237,224,0.45)",
                    letterSpacing: "0.08em",
                    lineHeight: 1.6,
                  }}
                >
                  Version 1 · May 2026
                </p>
              </div>
            </div>
          </div>

          {/* ── BODY ────────────────────────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              padding: "0.28in 0.55in 0.22in",
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.2in",
            }}
          >
            {/* ── TOP ROW: Authority Matrix + Quorum/Voting ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "0.22in" }}>

              {/* ── DECISION AUTHORITY MATRIX ── */}
              <div>
                <SectionLabel>Decision Authority Matrix</SectionLabel>

                {/* Steward lane header */}
                <div
                  style={{
                    background: "rgba(31,61,46,0.07)",
                    borderRadius: "4px 4px 0 0",
                    padding: "0.06in 0.12in 0.05in",
                    borderLeft: "3px solid var(--evergreen)",
                    marginBottom: "1px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--evergreen)",
                    }}
                  >
                    Steward decides alone
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", marginBottom: "0.1in" }}>
                  {[
                    {
                      bucket: "1 — Cost Basis",
                      text: "Routine expenses already in the agreed Cost Basis. Pay practitioners at agreed rate. Flag variances under 5% without a meeting.",
                    },
                    {
                      bucket: "2 — Reserve",
                      text: "Monitor balance and report monthly. Cannot authorize any draw without a table vote.",
                    },
                    {
                      bucket: "3 — Reinvestment",
                      text: "Spends up to the single-spend ceiling (default $2,500 or 10% of monthly Cost Basis, whichever is lower). Must confirm ownership-increase test.",
                    },
                    {
                      bucket: "4 — Eave Flow",
                      text: "Confirm overflow conditions are met before release. Cannot redirect to a new recipient without table approval.",
                    },
                  ].map((row) => (
                    <div
                      key={row.bucket}
                      style={{
                        background: "rgba(31,61,46,0.04)",
                        padding: "0.07in 0.1in",
                        borderLeft: "2px solid rgba(31,61,46,0.25)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          color: "var(--evergreen)",
                          marginBottom: "0.06rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {row.bucket}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.62rem",
                          color: "#3a3a3a",
                          lineHeight: 1.5,
                        }}
                      >
                        {row.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Kitchen Table header */}
                <div
                  style={{
                    background: "rgba(176,57,30,0.1)",
                    borderRadius: "4px 4px 0 0",
                    padding: "0.06in 0.12in 0.05in",
                    borderLeft: "3px solid var(--rust)",
                    marginBottom: "0.06in",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--rust)",
                    }}
                  >
                    Kitchen Table must vote
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.04in 0.1in",
                  }}
                >
                  {[
                    "Any change to monthly Cost Basis (up or down)",
                    "Any draw on the Reserve — no exceptions",
                    "Any Reinvestment spend above the single-spend ceiling",
                    "Any change to bucket percentages or split structure",
                    "Any new Eave Flow recipient",
                    "Any income stream exceeding 25% of total monthly income",
                    "Any partnership or contract creating a new recurring obligation",
                    "Annual audit findings — acknowledged before considered closed",
                    "Declaration of income failure (triggers Reserve access)",
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "0.2rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          color: "var(--rust)",
                          flexShrink: 0,
                          marginTop: "0.05rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {i + 1}.
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.62rem",
                          color: "#3a3a3a",
                          lineHeight: 1.45,
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RIGHT COLUMN: Quorum + Voting ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.16in" }}>

                {/* QUORUM */}
                <div>
                  <SectionLabel>Quorum</SectionLabel>
                  <div
                    style={{
                      background: "rgba(31,61,46,0.05)",
                      borderLeft: "3px solid var(--evergreen)",
                      borderRadius: "0 4px 4px 0",
                      padding: "0.1in 0.12in",
                    }}
                  >
                    <QuorumRow label="Table seats">
                      4 bucket stewards + at least 1 witness (minimum 5)
                    </QuorumRow>
                    <QuorumRow label="Quorum threshold">
                      <strong>¾ of named seats</strong> — 4 of 5 for a standard table
                    </QuorumRow>
                    <QuorumRow label="Valid format">
                      In person · live call · written consent submitted before the meeting
                    </QuorumRow>
                    <QuorumRow label="Witness rule" last>
                      Counts toward quorum. Cannot be the deciding vote on a Reserve draw or Cost Basis change.
                    </QuorumRow>
                  </div>
                  <div style={{ marginTop: "0.08in" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        color: "#5a5a5a",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "0.04in",
                      }}
                    >
                      If quorum cannot be reached within 7 days
                    </p>
                    {[
                      "48-hour written consent window opens",
                      "Default if still short: no change — machine holds current course",
                      "Reserve draws always require a live meeting — no written-consent exception",
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.2rem", marginBottom: "0.04in" }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "var(--evergreen)", flexShrink: 0 }}>→</span>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "#3a3a3a", lineHeight: 1.45 }}>{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DIVIDER */}
                <div style={{ height: 1, background: "rgba(31,61,46,0.15)" }} />

                {/* VOTING THRESHOLDS */}
                <div>
                  <SectionLabel>Voting Thresholds</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.06in" }}>
                    {[
                      {
                        threshold: "Simple majority",
                        note: "Most decisions",
                        accent: "var(--evergreen)",
                        bg: "rgba(31,61,46,0.06)",
                      },
                      {
                        threshold: "Two-thirds",
                        note: "Cost Basis increase >15% · any Reserve draw · bucket structure changes · Eave Flow recipient changes",
                        accent: "#b8820a",
                        bg: "rgba(212,160,23,0.08)",
                      },
                      {
                        threshold: "Unanimous",
                        note: "Wind-down · ownership transfer · permanent removal of a member's stake",
                        accent: "var(--rust)",
                        bg: "rgba(176,57,30,0.07)",
                      },
                    ].map((row) => (
                      <div
                        key={row.threshold}
                        style={{
                          background: row.bg,
                          borderLeft: `3px solid ${row.accent}`,
                          padding: "0.06in 0.1in",
                          borderRadius: "0 3px 3px 0",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: row.accent,
                            lineHeight: 1.2,
                            marginBottom: "0.04rem",
                          }}
                        >
                          {row.threshold}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.6rem",
                            color: "#3a3a3a",
                            lineHeight: 1.45,
                          }}
                        >
                          {row.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── HAIRLINE DIVIDER ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ height: 1, background: "rgba(31,61,46,0.18)", flex: 1 }} />
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--rust)" }} />
              <div style={{ height: 1, background: "rgba(31,61,46,0.18)", flex: 1 }} />
            </div>

            {/* ── RESERVE RAID PROTOCOL ── */}
            <div>
              <SectionLabel>Reserve Raid Protocol — The Named Sequence</SectionLabel>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.1in" }}>
                {[
                  {
                    n: 1,
                    title: "Income Failure Declaration",
                    body: "Cost Basis steward documents revenue below Cost Basis for two consecutive months (or a single month >50% shortfall) and sends written notice to all table members.",
                    flag: "",
                  },
                  {
                    n: 2,
                    title: "All-Hands Table Meeting",
                    body: "Within 5 calendar days of the declaration. Live meeting required — no written-consent substitute. Agenda: is a draw necessary, and how much? Confirm all cuts reviewed, no Reinvestment, no Eave Flow.",
                    flag: "Live meeting only",
                  },
                  {
                    n: 3,
                    title: "Authorization",
                    body: "Two-thirds majority vote. Every member's position recorded. Draw = minimum necessary to cover the confirmed shortfall — not a round number, not a future buffer.",
                    flag: "⅔ vote required",
                  },
                  {
                    n: 4,
                    title: "Draw & Notification",
                    body: "Reserve steward executes the draw within 2 business days. All members receive written confirmation. Machine immediately returns to Building State — Reserve must be rebuilt before Reinvestment or Eave Flow resumes.",
                    flag: "→ Building State",
                  },
                  {
                    n: 5,
                    title: "Replenishment Plan",
                    body: "Within 30 days, the table meets and documents: monthly replenishment amount, target date to restore Reserve, and income recovery actions. A draw without a replenishment plan within 30 days is a governance violation.",
                    flag: "30-day deadline",
                  },
                ].map((step) => (
                  <div
                    key={step.n}
                    style={{
                      background: "rgba(31,61,46,0.05)",
                      borderTop: "3px solid var(--evergreen)",
                      borderRadius: "0 0 4px 4px",
                      padding: "0.09in 0.1in 0.08in",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.05in",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "1.05rem",
                          fontWeight: 900,
                          color: "var(--evergreen)",
                          lineHeight: 1,
                          opacity: 0.35,
                          flexShrink: 0,
                        }}
                      >
                        {step.n}
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          color: "var(--evergreen)",
                          lineHeight: 1.25,
                        }}
                      >
                        {step.title}
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.59rem",
                        color: "#3a3a3a",
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {step.body}
                    </p>
                    {step.flag && (
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.57rem",
                          fontWeight: 700,
                          color: "var(--rust)",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          lineHeight: 1.2,
                        }}
                      >
                        {step.flag}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div style={{ marginTop: "auto" }}>
              <div
                style={{
                  background: "var(--evergreen)",
                  borderRadius: 6,
                  padding: "0.16in 0.3in",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "var(--cream)",
                      marginBottom: "0.04rem",
                    }}
                  >
                    ourheadwaters.ca
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.62rem",
                      color: "rgba(244,237,224,0.65)",
                    }}
                  >
                    bobbie@ourheadwaters.ca · 807 220 3654
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.58rem",
                    fontStyle: "italic",
                    color: "rgba(244,237,224,0.5)",
                    maxWidth: "3.5in",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  These are not bylaws. They are the operating rules for a machine the community owns.
                  <br />
                  The machine's owners decide. The table records. The log is permanent.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.58rem",
                      color: "rgba(244,237,224,0.5)",
                      textAlign: "right",
                      lineHeight: 1.6,
                    }}
                  >
                    Dryden, Ontario
                    <br />
                    <span style={{ fontSize: "0.54rem", opacity: 0.75 }}>Treaty 3 Territory</span>
                  </p>
                  <QRCodeStamp light />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Small helpers ─────────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--evergreen)",
        marginBottom: "0.07in",
        borderBottom: "1.5px solid rgba(31,61,46,0.15)",
        paddingBottom: "0.04in",
      }}
    >
      {children}
    </p>
  );
}

function QuorumRow({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "0.9in 1fr",
        gap: "0.1in",
        paddingBottom: last ? 0 : "0.06in",
        marginBottom: last ? 0 : "0.06in",
        borderBottom: last ? "none" : "1px solid rgba(31,61,46,0.1)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.59rem",
          fontWeight: 700,
          color: "var(--evergreen)",
          lineHeight: 1.4,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.6rem",
          color: "#3a3a3a",
          lineHeight: 1.45,
        }}
      >
        {children}
      </p>
    </div>
  );
}
