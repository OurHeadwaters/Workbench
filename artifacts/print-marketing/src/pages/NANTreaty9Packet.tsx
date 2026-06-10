import { useState } from "react";
import { Link } from "wouter";
import { downloadAsPdf } from "@/lib/pdf";
import { CodetryIntroLetterPage } from "./CodetryIntroLetter";
import { CodetryFundingBriefPage } from "./CodetryFundingBrief";
import { CodetryOnePagerPage } from "./CodetryOnePager";
import { NANTreaty9ContextBriefPage } from "./NANTreaty9ContextBrief";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const RUST = "#b85a3e";
const MUTED = "#6b7665";
const FOREST = "#2e5a3f";

const base = import.meta.env.BASE_URL;

function buildPersonalizedUrl(slug: string, community: string): string {
  return `${window.location.origin}${base}${slug}?community=${encodeURIComponent(community)}`;
}

const personalizedDocs = [
  { label: "Intro Letter", slug: "codetry-intro-letter" },
  { label: "Pilot Proposal", slug: "codetry-pilot-proposal" },
];

const docs = [
  { label: "Intro Letter — NAN Generic", href: "/codetry-intro-letter" },
  { label: "Partnership & Funding Brief", href: "/codetry-funding-brief" },
  { label: "Economic Development One-Pager", href: "/codetry-one-pager" },
  { label: "Treaty 9 Context Brief", href: "/nan-treaty9-context-brief" },
];

export default function NANTreaty9Packet() {
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    try {
      await downloadAsPdf("nan-treaty9-packet-target", "headwaters-nan-treaty9-outreach-packet.pdf", {
        format: "letter",
        orientation: "portrait",
        paginate: true,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(slug: string) {
    const url = buildPersonalizedUrl(slug, community.trim());
    navigator.clipboard.writeText(url).then(() => {
      setCopied(slug);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      setCopied(`error:${slug}`);
      setTimeout(() => setCopied(null), 2500);
    });
  }

  const trimmed = community.trim();

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
        {/* Territory badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.75rem",
          padding: "0.4rem 0.75rem",
          background: "rgba(46,90,63,0.12)",
          borderRadius: 5,
          width: "fit-content",
        }}>
          <span style={{
            fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: FOREST,
          }}>
            Treaty 9 Territory — Nishnawbe Aski Nation
          </span>
        </div>

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
              Treaty 9 / NAN Outreach — Combined packet
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
              Intro letter through NAN leadership, partnership &amp; funding brief, economic
              development one-pager, and a Treaty 9 context brief covering Nishnawbe Aski Nation
              geography and the Standby supply model.
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

        {/* What's different callout */}
        <div style={{
          marginTop: "0.75rem",
          padding: "0.75rem 1rem",
          background: "rgba(46,90,63,0.07)",
          borderLeft: `3px solid ${FOREST}`,
          borderRadius: "0 6px 6px 0",
        }}>
          <p style={{
            fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
            fontSize: "0.73rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: FOREST,
            margin: "0 0 0.3rem",
          }}>
            What's different from the generic NAN packet
          </p>
          <p style={{
            fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
            fontSize: "0.8rem",
            color: "#3a3a3a",
            margin: 0,
            lineHeight: 1.6,
          }}>
            This packet replaces the Pilot Proposal Outline with a Treaty 9 Context Brief — a single
            page covering the territory, NAN as the introduction pathway, remote food infrastructure
            realities, and the Standby supply model. Use it for communities not yet reached through
            the existing NAN outreach cycle.
          </p>
        </div>

        {/* Personalized link generator */}
        <div style={{
          marginTop: "0.75rem",
          padding: "1rem 1.25rem",
          background: "white",
          borderRadius: 8,
          border: "1px solid rgba(31,61,46,0.14)",
        }}>
          <p style={{
            fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: EVERGREEN,
            margin: "0 0 0.6rem",
          }}>
            Generate a personalized link
          </p>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <input
              type="text"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              placeholder="e.g. Kashechewan First Nation"
              style={{
                flex: "1 1 220px",
                padding: "0.45rem 0.75rem",
                fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
                fontSize: "0.88rem",
                border: "1px solid rgba(31,61,46,0.25)",
                borderRadius: 5,
                outline: "none",
                color: "#1a1a1a",
                background: "#fafaf8",
              }}
            />
            <span style={{
              fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
              fontSize: "0.76rem",
              color: MUTED,
              flexShrink: 0,
            }}>
              {trimmed ? `Personalizing for: ${trimmed}` : "Type a community name above"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {personalizedDocs.map((d) => {
              const url = trimmed ? buildPersonalizedUrl(d.slug, trimmed) : null;
              const isCopied = copied === d.slug;
              return (
                <div key={d.slug} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.45rem 0.65rem",
                  background: "rgba(31,61,46,0.04)",
                  borderRadius: 5,
                  flexWrap: "wrap",
                }}>
                  <span style={{
                    fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: EVERGREEN,
                    flexShrink: 0,
                    minWidth: "5.5rem",
                  }}>
                    {d.label}
                  </span>
                  <span style={{
                    flex: 1,
                    fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
                    fontSize: "0.74rem",
                    color: url ? "#1a6b3c" : MUTED,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontStyle: url ? "normal" : "italic",
                  }}>
                    {url ?? "—"}
                  </span>
                  <button
                    onClick={() => trimmed && handleCopy(d.slug)}
                    disabled={!trimmed}
                    style={{
                      flexShrink: 0,
                      background: isCopied ? EVERGREEN : (trimmed ? RUST : "rgba(31,61,46,0.15)"),
                      color: trimmed ? CREAM : MUTED,
                      border: "none",
                      borderRadius: 4,
                      padding: "0.3rem 0.7rem",
                      fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      cursor: trimmed ? "pointer" : "default",
                      transition: "background 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isCopied ? "✓ Copied" : copied === `error:${d.slug}` ? "Copy failed" : "Copy link"}
                  </button>
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flexShrink: 0,
                        fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
                        fontSize: "0.74rem",
                        color: EVERGREEN,
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Preview →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hidden render target — all four pages as siblings for paginate mode */}
      <div id="nan-treaty9-packet-target">
        <CodetryIntroLetterPage />
        <CodetryFundingBriefPage />
        <CodetryOnePagerPage />
        <NANTreaty9ContextBriefPage />
      </div>

    </div>
  );
}
