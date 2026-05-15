import { useState } from "react";
import { Link } from "wouter";
import { downloadAsPdf } from "@/lib/pdf";
import { CodetryIntroLetterPage } from "./CodetryIntroLetter";
import { CodetryFundingBriefPage } from "./CodetryFundingBrief";
import { CodetryOnePagerPage } from "./CodetryOnePager";
import { CodetryPilotProposalPage } from "./CodetryPilotProposal";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";

const docs = [
  { label: "Intro Letter", href: "/codetry-intro-letter" },
  { label: "Partnership & Funding Brief", href: "/codetry-funding-brief" },
  { label: "Economic Development One-Pager", href: "/codetry-one-pager" },
  { label: "Pilot Proposal Outline", href: "/codetry-pilot-proposal" },
];

export default function NANOutreachPacket() {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      await downloadAsPdf("nan-packet-target", "headwaters-nan-outreach-packet.pdf", {
        format: "letter",
        orientation: "portrait",
        paginate: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#d8d2c8" }}>

      {/* Nav bar */}
      <div
        className="screen-nav no-print"
        style={{ flexDirection: "column", gap: "0.5rem", alignItems: "stretch" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" className="no-print">← Back to suite</Link>
          <button
            className="btn-print no-print"
            onClick={handleDownload}
            disabled={loading}
            style={{ fontSize: "0.9rem", padding: "0.4rem 1.2rem" }}
          >
            {loading ? "⏳ Generating PDF…" : "⬇ Download full packet (4 pages)"}
          </button>
        </div>
      </div>

      {/* Packet description card */}
      <div
        className="no-print"
        style={{
          maxWidth: "8.5in",
          margin: "0 auto 1.5rem",
          padding: "0 2rem",
        }}
      >
        <div style={{
          background: EVERGREEN,
          borderRadius: 8,
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.6)",
              marginBottom: "0.3rem",
            }}>
              NAN Outreach — Combined packet
            </p>
            <h2 style={{
              fontFamily: "var(--font-serif, Fraunces, Georgia, serif)",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: CREAM,
              margin: "0 0 0.5rem",
              lineHeight: 1.2,
            }}>
              Download all four documents as one PDF
            </h2>
            <p style={{
              fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
              fontSize: "0.82rem",
              color: "rgba(244,237,224,0.75)",
              margin: 0,
              lineHeight: 1.6,
            }}>
              One click produces a single letter-size PDF ready to attach to an email: intro letter,
              partnership &amp; funding brief, economic development one-pager, and pilot proposal outline.
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={loading}
            style={{
              flexShrink: 0,
              background: loading ? "rgba(244,237,224,0.25)" : RUST,
              color: CREAM,
              border: "none",
              borderRadius: 6,
              padding: "0.55rem 1.3rem",
              fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
          >
            {loading ? "⏳ Generating…" : "⬇ Download packet"}
          </button>
        </div>

        {/* Individual doc links */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginTop: "0.75rem",
          padding: "0.6rem 0.75rem",
          background: "rgba(31,61,46,0.08)",
          borderRadius: 6,
          fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
          fontSize: "0.76rem",
          color: MUTED,
          alignItems: "center",
        }}>
          <span style={{ color: EVERGREEN, fontWeight: 600, marginRight: "0.25rem" }}>
            Included:
          </span>
          {docs.map((d, i) => (
            <span key={d.href} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link
                href={d.href}
                style={{ color: EVERGREEN, textDecoration: "underline", textUnderlineOffset: "2px" }}
              >
                {d.label}
              </Link>
              {i < docs.length - 1 && (
                <span style={{ color: "rgba(31,61,46,0.3)" }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Hidden render target — all four pages as siblings for paginate mode */}
      <div id="nan-packet-target">
        <CodetryIntroLetterPage />
        <CodetryFundingBriefPage />
        <CodetryOnePagerPage />
        <CodetryPilotProposalPage />
      </div>

    </div>
  );
}
