import { useState } from "react";
import { ZONES, AQUIFER_ZONE, IN_REPO_ARTIFACT_INDEX } from "@/data/zones";
import type { ZoneData, ZoneTool } from "@/data/zones";

const CREAM = "#f4ede0";
const MUTED = "#7a7a6e";
const RULE = "rgba(200,191,167,0.35)";

const BASE = import.meta.env.BASE_URL;

function ToolRow({ tool }: { tool: ZoneTool }) {
  const isExternal = !tool.inRepo || tool.url.startsWith("http");
  const isDisabled = tool.url === "#";
  const isPlanned = tool.status === "planned";

  return (
    <a
      href={isDisabled ? undefined : tool.url}
      target={isExternal && !isDisabled ? "_blank" : undefined}
      rel={isExternal && !isDisabled ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "9px 12px",
        borderRadius: 6,
        border: `1px solid ${RULE}`,
        background: isPlanned ? "rgba(200,191,167,0.08)" : "rgba(255,253,248,0.6)",
        textDecoration: "none",
        cursor: isDisabled ? "default" : "pointer",
        opacity: isPlanned ? 0.65 : 1,
        transition: "background 0.15s",
      }}
      onClick={isDisabled ? (e) => e.preventDefault() : undefined}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: isPlanned ? "transparent" : "#2a2520",
          marginTop: 5,
          flexShrink: 0,
          border: isPlanned ? `1px dashed ${MUTED}` : "none",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 1,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#2a2520",
            }}
          >
            {tool.name}
          </span>
          {isPlanned && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: MUTED,
                border: `1px dashed ${RULE}`,
                borderRadius: 999,
                padding: "1px 5px",
              }}
            >
              planned
            </span>
          )}
          {isExternal && !isDisabled && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                color: MUTED,
                letterSpacing: "0.08em",
              }}
            >
              ↗
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
          {tool.tagline}
        </p>
        {!isDisabled && (
          <p
            style={{
              margin: "2px 0 0",
              fontFamily: "monospace",
              fontSize: 9,
              color: "rgba(122,122,110,0.55)",
              wordBreak: "break-all",
            }}
          >
            {tool.url}
          </p>
        )}
      </div>
      {tool.zoneAddress && (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: MUTED,
            flexShrink: 0,
            letterSpacing: "0.06em",
            paddingTop: 1,
          }}
        >
          {tool.zoneAddress}
        </span>
      )}
    </a>
  );
}

function ZoneBlock({ zone, isAquifer = false }: { zone: ZoneData; isAquifer?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const liveCount = zone.tools.filter((t) => t.status !== "planned").length;
  const plannedCount = zone.tools.filter((t) => t.status === "planned").length;

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${RULE}`,
        overflow: "hidden",
        background: "#faf7f2",
      }}
    >
      {/* Zone header */}
      <div style={{ background: zone.color, padding: "14px 18px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 4,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                marginBottom: 2,
              }}
            >
              {isAquifer ? "Aquifer" : `Zone ${zone.number}`} · {zone.terrain}
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              {zone.name}
            </div>
            <a
              href={`https://${zone.targetDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.75)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                paddingBottom: 1,
              }}
            >
              {zone.targetDomain} ↗
            </a>
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.7)",
              background: "rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "2px 8px",
              flexShrink: 0,
            }}
          >
            {liveCount} live{plannedCount > 0 ? ` · ${plannedCount} planned` : ""}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: "rgba(255,255,255,0.65)",
            fontStyle: "italic",
            lineHeight: 1.45,
          }}
        >
          {zone.metaphor}
        </p>
      </div>

      {/* Tool list — toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 18px",
          background: "none",
          border: "none",
          borderBottom: expanded ? `1px solid ${RULE}` : "none",
          cursor: "pointer",
          fontFamily: "monospace",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        <span>Tools ({zone.tools.length})</span>
        <span style={{ fontSize: 11 }}>{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div
          style={{
            padding: "10px 14px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {zone.tools.map((tool) => (
            <ToolRow key={tool.zoneAddress ?? tool.name} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ConstellationPage() {
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}${BASE}constellation`
    : "";
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  }

  return (
    <div style={{ minHeight: "100vh", background: CREAM, padding: "0 0 80px" }}>
      {/* Header */}
      <div style={{ background: "#1a1310", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.4)",
              marginBottom: 8,
            }}
          >
            Headwaters — Constellation Map
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 26,
              fontWeight: 700,
              color: CREAM,
              margin: "0 0 8px",
              lineHeight: 1.15,
            }}
          >
            Six zones. One ecosystem.
          </h1>
          <p
            style={{
              margin: "0 0 18px",
              fontSize: 13,
              color: "rgba(244,237,224,0.6)",
              lineHeight: 1.55,
              maxWidth: 480,
            }}
          >
            Every tool in the Headwaters universe placed by zone, domain, and build
            status. To add a new tool, drop it into the right zone in{" "}
            <code
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                background: "rgba(255,255,255,0.08)",
                padding: "1px 5px",
                borderRadius: 3,
              }}
            >
              zones.ts
            </code>{" "}
            and it appears here automatically.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: "rgba(244,237,224,0.35)",
                letterSpacing: "0.12em",
                wordBreak: "break-all",
              }}
            >
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                border: "1px solid rgba(244,237,224,0.2)",
                background: copied ? "rgba(74,222,128,0.15)" : "rgba(244,237,224,0.07)",
                color: copied ? "#4ADE80" : "rgba(244,237,224,0.6)",
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        </div>
      </div>

      {/* Zone navigation pill bar */}
      <div
        style={{
          background: "#111",
          borderBottom: `1px solid rgba(244,237,224,0.07)`,
          padding: "10px 24px",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "nowrap",
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          {[...ZONES, AQUIFER_ZONE].map((z) => (
            <a
              key={z.number}
              href={`#zone-${z.number}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 999,
                background: z.color,
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 8,
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.75)",
                  letterSpacing: "0.08em",
                }}
              >
                {z.number === 6 ? "AQ" : `Z${z.number}`}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}
              >
                {z.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Zone blocks */}
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "24px 20px 0",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {ZONES.map((zone) => (
          <div key={zone.number} id={`zone-${zone.number}`}>
            <ZoneBlock zone={zone} />
          </div>
        ))}

        {/* Aquifer — hidden infrastructure layer */}
        <div id="zone-6">
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: 8,
              paddingTop: 4,
              borderTop: `1px solid ${RULE}`,
              paddingLeft: 2,
            }}
          >
            ▼ Hidden infrastructure — below the zones
          </div>
          <ZoneBlock zone={AQUIFER_ZONE} isAquifer />
        </div>

        {/* In-repo artifact index — sourced from IN_REPO_ARTIFACT_INDEX in zones.ts */}
        <div
          style={{
            borderRadius: 10,
            border: `1px solid ${RULE}`,
            background: "#faf7f2",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 18px",
              borderBottom: `1px solid ${RULE}`,
              background: "rgba(200,191,167,0.12)",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#4a4035",
                marginBottom: 2,
              }}
            >
              In-repo artifact index
            </div>
            <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
              All artifacts registered in this monorepo — live and planned. Source:{" "}
              <code style={{ fontFamily: "monospace", fontSize: 10 }}>zones.ts → IN_REPO_ARTIFACT_INDEX</code>
            </p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "rgba(200,191,167,0.08)" }}>
                  {["Preview path", "Artifact dir", "Zone home", "Status"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "7px 14px",
                        textAlign: "left",
                        fontFamily: "monospace",
                        fontSize: 8,
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: MUTED,
                        borderBottom: `1px solid ${RULE}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {IN_REPO_ARTIFACT_INDEX.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: `1px solid ${RULE}`,
                      background: row.status === "planned" ? "rgba(200,191,167,0.06)" : "transparent",
                      opacity: row.status === "planned" ? 0.7 : 1,
                    }}
                  >
                    <td
                      style={{
                        padding: "7px 14px",
                        fontFamily: "monospace",
                        fontSize: 10,
                        color: "#2a2520",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.previewPath}
                    </td>
                    <td
                      style={{
                        padding: "7px 14px",
                        fontFamily: "monospace",
                        fontSize: 10,
                        color: MUTED,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.artifactDir}
                    </td>
                    <td style={{ padding: "7px 14px", fontSize: 11, color: MUTED }}>
                      {row.zoneHome}
                    </td>
                    <td style={{ padding: "7px 14px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          fontFamily: "monospace",
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "2px 6px",
                          borderRadius: 999,
                          background:
                            row.status === "live"
                              ? "rgba(16,185,129,0.12)"
                              : "rgba(200,191,167,0.2)",
                          color: row.status === "live" ? "#059669" : MUTED,
                          border: row.status === "planned" ? `1px dashed ${RULE}` : "none",
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <p
            style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: 8,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(122,122,110,0.5)",
            }}
          >
            Source of truth: codetry-ship/src/data/zones.ts · Authoritative map: .local/constellation-map.md
          </p>
        </div>
      </div>
    </div>
  );
}
