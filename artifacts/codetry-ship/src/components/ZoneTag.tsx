const ZONE_COLORS: Record<number | string, { bg: string; fg: string }> = {
  0: { bg: "#0f2318", fg: "rgba(244,237,224,0.75)" },
  1: { bg: "#345c45", fg: "#f4ede0" },
  2: { bg: "#1A5FA8", fg: "#f4ede0" },
  3: { bg: "#b85a3e", fg: "#f4ede0" },
  4: { bg: "#2a4d36", fg: "#f4ede0" },
  5: { bg: "#c97c2e", fg: "#f4ede0" },
  Aquifer: { bg: "#0f2318", fg: "rgba(244,237,224,0.75)" },
};

interface ZoneTagProps {
  zone: number | "Aquifer";
  label: string;
  className?: string;
}

export function ZoneTag({ zone, label, className }: ZoneTagProps) {
  const colors = ZONE_COLORS[zone] ?? ZONE_COLORS[2];
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35em",
        background: colors.bg,
        color: colors.fg,
        borderRadius: "3px",
        padding: "0.22em 0.65em",
        fontSize: "0.67rem",
        fontFamily: "var(--font-mono, monospace)",
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        lineHeight: 1.4,
        border: `1px solid ${colors.bg === "#0f2318" ? "rgba(244,237,224,0.12)" : `${colors.bg}55`}`,
      }}
      aria-label={`Zone ${zone} — ${label}`}
    >
      <span style={{ opacity: 0.72 }}>Zone {zone}</span>
      <span style={{ opacity: 0.35 }}>·</span>
      <span>{label}</span>
    </span>
  );
}
