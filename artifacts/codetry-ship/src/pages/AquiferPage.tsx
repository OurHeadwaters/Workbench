import { ZoneTag } from "@/components/ZoneTag";

export function AquiferPage() {
  const BASE = import.meta.env.BASE_URL;

  return (
    <main
      style={{
        background: "#02040a",
        minHeight: "100vh",
        color: "#d4c3a8",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(56,189,248,0.12)",
          padding: "48px 0 36px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: "rgba(56,189,248,0.55)",
                margin: 0,
              }}
            >
              Headwaters
            </p>
            <ZoneTag zone="Aquifer" label="Identity Infrastructure" />
          </div>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#f0e8d8",
              margin: "0 0 12px",
              letterSpacing: "-0.01em",
            }}
          >
            The Aquifer — Identity Infrastructure
          </h1>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "rgba(212,195,168,0.50)",
              letterSpacing: "0.12em",
              margin: 0,
            }}
          >
            XRPL-anchored identity layer · SHA-256 hash witnessing · DID-compatible record architecture
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── 1. Mechanism ── */}
        <section style={{ paddingTop: 52 }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.6)",
              marginBottom: 20,
            }}
          >
            01 · Mechanism
          </p>

          <div
            style={{
              borderRadius: 6,
              border: "1px solid rgba(56,189,248,0.18)",
              background: "rgba(56,189,248,0.035)",
              padding: "28px 28px 24px",
              marginBottom: 0,
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(56,189,248,0.50)",
                marginBottom: 20,
              }}
            >
              Data flow
            </p>

            {[
              {
                label: "Document",
                sub: "Practitioner-issued record",
                note: null,
                connector: true,
              },
              {
                label: "SHA-256 hash",
                sub: "Deterministic fingerprint of the original",
                note: "The plaintext never leaves the holder's custody",
                connector: true,
              },
              {
                label: "XRPL transaction memo field",
                sub: "Hash written into an immutable on-chain memo",
                note: null,
                connector: true,
              },
              {
                label: "Immutable ledger entry",
                sub: "Transaction hash anchored at a specific ledger index",
                note: "Timestamp is the ledger's, not Headwaters'",
                connector: true,
              },
              {
                label: "Verifiable by anyone",
                sub: "Original document + hash + public XRPL transaction",
                note: "Headwaters is not in the verification path",
                connector: false,
              },
            ].map(({ label, sub, note, connector }) => (
              <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: 20,
                    paddingTop: 3,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "rgba(56,189,248,0.7)",
                      flexShrink: 0,
                    }}
                  />
                  {connector && (
                    <div
                      style={{
                        width: 1,
                        flexGrow: 1,
                        minHeight: 26,
                        background: "rgba(56,189,248,0.18)",
                        margin: "3px 0",
                      }}
                    />
                  )}
                </div>
                <div style={{ paddingBottom: connector ? 0 : 0, marginBottom: connector ? 4 : 0 }}>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#f0e8d8",
                      letterSpacing: "0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      color: "rgba(212,195,168,0.52)",
                      marginTop: 2,
                      marginBottom: note ? 4 : 14,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {sub}
                  </div>
                  {note && (
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: "rgba(56,189,248,0.55)",
                        letterSpacing: "0.06em",
                        marginBottom: 14,
                        paddingLeft: 8,
                        borderLeft: "2px solid rgba(56,189,248,0.2)",
                      }}
                    >
                      {note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div
          style={{
            margin: "44px 0",
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(212,195,168,0.10), transparent)",
          }}
        />

        {/* ── 2. Trust model ── */}
        <section>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.6)",
              marginBottom: 20,
            }}
          >
            02 · Trust Model
          </p>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              lineHeight: 1.75,
              color: "rgba(240,232,216,0.82)",
              margin: "0 0 16px",
            }}
          >
            No central authority holds the record. Verification requires only the original document, its hash, and the public XRPL transaction — all independently checkable by anyone with access to an XRPL explorer.
          </p>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              lineHeight: 1.75,
              color: "rgba(240,232,216,0.82)",
              margin: "0 0 16px",
            }}
          >
            The person controls who holds the plaintext. The ledger only ever sees the hash. Headwaters issues the practitioner stamp and writes the transaction — but cannot alter the ledger entry after the fact, and is not a required participant in any future verification.
          </p>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              lineHeight: 1.75,
              color: "rgba(240,232,216,0.82)",
              margin: 0,
            }}
          >
            The record belongs to the person. The hash is the witness. The ledger is the notary.
          </p>
        </section>

        <div
          style={{
            margin: "44px 0",
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(212,195,168,0.10), transparent)",
          }}
        />

        {/* ── 3. What it carries vs. what it is not ── */}
        <section>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.6)",
              marginBottom: 24,
            }}
          >
            03 · Scope
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: 16,
            }}
          >
            {/* What the ledger carries */}
            <div
              style={{
                borderRadius: 6,
                border: "1px solid rgba(56,189,248,0.20)",
                background: "rgba(56,189,248,0.03)",
                padding: "22px 22px 20px",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(56,189,248,0.65)",
                  marginBottom: 16,
                }}
              >
                What the ledger carries
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {[
                  { title: "Document hashes", body: "Anchored in XRPL transaction memo fields" },
                  { title: "DID fragments", body: "Identity records owned by the person, not the issuer" },
                  { title: "Practitioner stamps", body: "Named, witnessed lifecycle crossings" },
                  { title: "Learning handoffs", body: "Student-owned school-year records with teacher attestation" },
                ].map(({ title, body }) => (
                  <li key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: "rgba(56,189,248,0.55)",
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    <div>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#f0e8d8",
                          letterSpacing: "0.04em",
                          display: "block",
                          marginBottom: 2,
                        }}
                      >
                        {title}
                      </span>
                      <span style={{ fontSize: 12, color: "rgba(212,195,168,0.52)", lineHeight: 1.4, display: "block" }}>
                        {body}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* What it is not */}
            <div
              style={{
                borderRadius: 6,
                border: "1px solid rgba(212,195,168,0.10)",
                background: "rgba(212,195,168,0.025)",
                padding: "22px 22px 20px",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(212,195,168,0.40)",
                  marginBottom: 16,
                }}
              >
                What it is not
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {[
                  { title: "Not a token or financial instrument", body: "No asset issuance, no tokenization." },
                  { title: "Not a DeFi protocol or asset issuance layer", body: "No liquidity pools, no yield mechanics, no AMM layer." },
                  { title: "Not a speculative position on XRP price", body: "The ledger is used as a write-once memo store. XRP price is not a variable in this system." },
                  { title: "Not in scope for payment system regulation", body: "The Clarity Act's reach into identity layers is an open question we're watching." },
                ].map(({ title, body }) => (
                  <li key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: "rgba(212,195,168,0.30)",
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </span>
                    <div>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "rgba(240,232,216,0.65)",
                          letterSpacing: "0.04em",
                          display: "block",
                          marginBottom: 2,
                        }}
                      >
                        {title}
                      </span>
                      <span style={{ fontSize: 12, color: "rgba(212,195,168,0.40)", lineHeight: 1.4, display: "block" }}>
                        {body}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div
          style={{
            margin: "44px 0",
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(212,195,168,0.10), transparent)",
          }}
        />

        {/* ── 4. Governance dependency ── */}
        <section>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.6)",
              marginBottom: 20,
            }}
          >
            04 · Governance Dependency
          </p>

          <div
            style={{
              borderRadius: 6,
              border: "1.5px solid rgba(56,189,248,0.28)",
              background: "rgba(56,189,248,0.05)",
              padding: "24px 26px",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(56,189,248,0.55)",
                marginBottom: 14,
              }}
            >
              Architectural dependency — dUNL integrity
            </p>
            <p
              style={{
                fontSize: "clamp(0.9rem, 2.2vw, 1rem)",
                lineHeight: 1.75,
                color: "rgba(240,232,216,0.80)",
                margin: 0,
              }}
            >
              Who controls the default validator list controls the notary. The dUNL's integrity is an infrastructure dependency for this build — not a regulatory question, an architectural one. Validator diversity is not optional when the ledger is load-bearing infrastructure for identity records.
            </p>
          </div>
        </section>

        <div
          style={{
            margin: "44px 0",
            height: 1,
            background: "linear-gradient(to right, transparent, rgba(212,195,168,0.10), transparent)",
          }}
        />

        {/* ── 5. What's being built ── */}
        <section>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.6)",
              marginBottom: 24,
            }}
          >
            05 · What's Being Built
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                label: "The Founding Drift DID",
                body: "A community identity record anchored at genesis. The first hash written to the ledger establishes the community's presence — witnessed, timestamped, owned by no vendor.",
              },
              {
                label: "The Threshold App",
                body: "Lifecycle crossing records — birth, school transitions, care transitions — hashed and witnessed by a practitioner. Each crossing is a named event with a named witness. The record travels with the person.",
              },
              {
                label: "The Learning Identity Architecture",
                body: "Student-owned learning records with teacher handoffs at the XRPL/DID layer. When a student moves schools or completes a phase, the outgoing teacher writes a handoff hash. The ledger holds the chain of custody. The student holds the plaintext.",
              },
            ].map(({ label, body }) => (
              <div
                key={label}
                style={{
                  borderRadius: 6,
                  border: "1px solid rgba(212,195,168,0.10)",
                  padding: "18px 20px",
                  background: "rgba(212,195,168,0.02)",
                }}
              >
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "clamp(0.95rem, 2.2vw, 1.05rem)",
                    fontWeight: 700,
                    color: "#f0e8d8",
                    margin: "0 0 8px",
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.7,
                    color: "rgba(212,195,168,0.60)",
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Watch the Origin Story CTA ── */}
        <div
          style={{
            marginTop: 64,
            borderRadius: 8,
            border: "1.5px solid rgba(56,189,248,0.28)",
            background: "rgba(56,189,248,0.06)",
            padding: "36px 32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(56,189,248,0.55)",
                marginBottom: 10,
                margin: "0 0 10px",
              }}
            >
              The Clearing
            </p>
            <p
              style={{
                fontSize: "clamp(1.1rem, 2.8vw, 1.4rem)",
                fontWeight: 700,
                color: "#f0e8d8",
                margin: "0 0 8px",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              Watch the origin story
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: "rgba(212,195,168,0.60)",
                margin: 0,
                maxWidth: 400,
              }}
            >
              The origin story behind the system — why this community economy
              needed a clearing at its centre.
            </p>
          </div>
          <a
            href={`${BASE}headwaters`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#02040a",
              background: "rgba(56,189,248,0.85)",
              borderRadius: 4,
              padding: "12px 22px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
          >
            Watch the video →
          </a>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid rgba(212,195,168,0.08)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: "rgba(212,195,168,0.28)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            ourheadwaters.ca/aquifer/ · Headwaters · Northwestern Ontario · Treaty 3
          </p>
          <a
            href={`${BASE}`}
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(212,195,168,0.38)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(212,195,168,0.14)",
              paddingBottom: 1,
              transition: "color 0.15s",
            }}
          >
            ← ourheadwaters.ca
          </a>
        </div>

      </div>
    </main>
  );
}
