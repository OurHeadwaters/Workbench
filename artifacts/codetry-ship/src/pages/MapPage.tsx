import { useState } from "react";
import { ZONES } from "@/data/zones";
import type { ZoneData, ZoneTool } from "@/data/zones";

const CREAM = "#f4ede0";
const FOREST = "#1f3d2e";
const MUTED = "#7a7a6e";
const RULE = "rgba(200,191,167,0.35)";

function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: `1px solid ${RULE}`,
        borderRadius: 999,
        background: CREAM,
        padding: 3,
        gap: 0,
      }}
      role="group"
      aria-label="Toggle view mode"
    >
      <button
        type="button"
        onClick={() => onChange(false)}
        style={{
          padding: "4px 14px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          fontFamily: "monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          background: !value ? FOREST : "transparent",
          color: !value ? CREAM : MUTED,
          transition: "all 0.15s",
        }}
      >
        Good Times
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        style={{
          padding: "4px 14px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          fontFamily: "monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          background: value ? "#b85a3e" : "transparent",
          color: value ? "#fff" : MUTED,
          transition: "all 0.15s",
        }}
      >
        Standby
      </button>
    </div>
  );
}

function ToolPill({ tool }: { tool: ZoneTool }) {
  const isExternal = !tool.url.startsWith("/") || tool.url === "#";
  const disabled = tool.url === "#";

  return (
    <a
      href={disabled ? undefined : tool.url}
      target={isExternal && !disabled ? "_blank" : undefined}
      rel={isExternal && !disabled ? "noopener noreferrer" : undefined}
      style={{
        display: "block",
        padding: "10px 13px",
        borderRadius: 8,
        border: `1px solid ${RULE}`,
        background: disabled ? "rgba(200,191,167,0.15)" : "rgba(255,253,248,0.80)",
        textDecoration: "none",
        cursor: disabled ? "default" : "pointer",
        transition: "border-color 0.15s, background 0.15s",
        opacity: disabled ? 0.55 : 1,
      }}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 2,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#2a2520",
          }}
        >
          {tool.name}
        </span>
        {tool.zoneAddress && (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: MUTED,
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            {tool.zoneAddress}
          </span>
        )}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: MUTED,
          lineHeight: 1.45,
        }}
      >
        {tool.tagline}
      </p>
      {!tool.inThisProject && tool.url !== "#" && (
        <span
          style={{
            display: "inline-block",
            marginTop: 4,
            fontFamily: "monospace",
            fontSize: 8,
            color: MUTED,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          External ↗
        </span>
      )}
    </a>
  );
}

function ZoneCard({
  zone,
  standby,
}: {
  zone: ZoneData;
  standby: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${RULE}`,
        overflow: "hidden",
        background: "#faf7f2",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: zone.color,
          padding: "14px 18px 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                fontFamily: "monospace",
                fontSize: 13,
                fontWeight: 900,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {zone.number}
            </span>
            <div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 1,
                }}
              >
                Zone {zone.number}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                {zone.name}
              </div>
            </div>
          </div>

          {/* State indicator */}
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 999,
              background: standby
                ? "rgba(184,90,62,0.85)"
                : "rgba(255,255,255,0.15)",
              fontFamily: "monospace",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fff",
              flexShrink: 0,
              alignSelf: "flex-start",
            }}
          >
            {standby ? "Standby" : zone.rootLabel}
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "rgba(255,255,255,0.72)",
            fontStyle: "italic",
            lineHeight: 1.45,
          }}
        >
          {zone.metaphor}
        </p>
      </div>

      {/* State description */}
      <div
        style={{
          padding: "12px 18px",
          background: standby
            ? "rgba(184,90,62,0.06)"
            : "rgba(31,61,46,0.04)",
          borderBottom: `1px solid ${RULE}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "#4a4035",
            lineHeight: 1.55,
          }}
        >
          {standby ? zone.standbyDesc : zone.goodTimesDesc}
        </p>
      </div>

      {/* Tools */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
        {zone.tools.length === 0 ? (
          <p style={{ margin: 0, fontSize: 11, color: MUTED, fontStyle: "italic", padding: "4px 4px" }}>
            No tools in this project for this zone yet.
          </p>
        ) : (
          zone.tools.map((tool) => <ToolPill key={tool.zoneAddress ?? tool.name} tool={tool} />)
        )}
      </div>

      {/* Gate */}
      <div
        style={{
          margin: "0 14px 14px",
          padding: "10px 13px",
          borderRadius: 8,
          border: `1px dashed rgba(200,191,167,0.6)`,
          background: "transparent",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: zone.color,
            marginBottom: 3,
          }}
        >
          Gate → {zone.gateName}
        </div>
        <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.45 }}>
          {zone.gateDesc}
        </p>
      </div>
    </div>
  );
}

export function MapPage() {
  const [standby, setStandby] = useState(false);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: CREAM,
        color: "#2a2520",
      }}
    >
      {/* Topographic texture */}
      <div
        aria-hidden
        className="od-topo pointer-events-none"
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.055,
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 820,
          margin: "0 auto",
          padding: "48px 20px 80px",
        }}
      >
        {/* Orientation header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: 10,
            }}
          >
            Headwaters · Neighbourhood Map
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 700,
              color: FOREST,
              lineHeight: 1.15,
              margin: "0 0 14px",
            }}
          >
            Six zones. One neighbourhood.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: MUTED,
              lineHeight: 1.65,
              maxWidth: 560,
              margin: "0 0 16px",
            }}
          >
            If you just arrived — from The Train, a shared link, or a QR code on a poster — this is the map. Each zone is a different kind of place. Pick the door that matches what you need.
          </p>

          {/* Pre-Odyssey framing block */}
          <div
            style={{
              borderRadius: 10,
              border: `1px solid rgba(212,160,23,0.35)`,
              background: "rgba(212,160,23,0.06)",
              padding: "16px 20px",
              marginBottom: 24,
              maxWidth: 560,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#b85a3e",
                marginBottom: 7,
              }}
            >
              Make your map before the Odyssey
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#4a4035", lineHeight: 1.6 }}>
              The best travellers orient before they set out. This map shows the six zones of the Headwaters neighbourhood — the terrain you'll be navigating. Understand the shape of it here, then pack your kit and begin.
            </p>
            <a
              href="/odyssey"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: FOREST,
                textDecoration: "none",
                borderBottom: `1.5px solid ${FOREST}`,
                paddingBottom: 1,
                transition: "opacity 0.15s",
              }}
            >
              Begin the Odyssey →
            </a>
          </div>

          {/* Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <ToggleSwitch value={standby} onChange={setStandby} />
            <span style={{ fontSize: 11, color: MUTED }}>
              {standby
                ? "Standby view — what each zone does when something is moving."
                : "Good Times view — what each zone does on a normal day."}
            </span>
          </div>
        </div>

        {/* Zone grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
            gap: 16,
          }}
        >
          {ZONES.map((zone) => (
            <ZoneCard key={zone.number} zone={zone} standby={standby} />
          ))}
        </div>

        {/* Footer — Odyssey CTA */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${RULE}`,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>
            Six zones. One neighbourhood. Each zone is a different kind of place — pick the door that matches what you need.
          </p>
          <a
            href="/odyssey"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 20px",
              borderRadius: 6,
              background: FOREST,
              color: "#f4ede0",
              fontFamily: "monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Pack your kit — Begin the Odyssey →
          </a>
        </div>
      </div>
    </main>
  );
}
