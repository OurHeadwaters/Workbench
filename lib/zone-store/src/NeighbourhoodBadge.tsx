import { useZone } from "./index";

const MAP_URL = "/map";

interface NeighbourhoodBadgeProps {
  zoneId: number;
}

export function NeighbourhoodBadge({ zoneId }: NeighbourhoodBadgeProps) {
  const { number, name, standby } = useZone(zoneId);
  return (
    <a
      href={MAP_URL}
      title={`Zone ${number} — ${name} · View the neighbourhood map`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 8px 3px 5px",
        borderRadius: 999,
        border: "1px solid rgba(200,191,167,0.55)",
        background: "rgba(244,237,224,0.80)",
        textDecoration: "none",
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: standby ? "#b85a3e" : "#1f3d2e",
          fontFamily: "monospace",
          fontSize: 8,
          fontWeight: 900,
          color: "#f4ede0",
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#4a4035",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 7,
          color: standby ? "#b85a3e" : "#7a7a6e",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {standby ? "Standby" : "Good Times"}
      </span>
    </a>
  );
}
