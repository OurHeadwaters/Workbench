import { resolveColors } from "./colors";

export interface ZoneTagProps {
  /**
   * Zone number(s) or "Aquifer".
   * Pass an array (e.g. [2, 4]) to render a multi-zone pill like "Zone 2 · Zone 4".
   */
  zone: number | "Aquifer" | number[];
  /** Human-readable label shown after the separator dot. */
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ZoneTag({ zone, label, className, style }: ZoneTagProps) {
  // For multi-zone pills, derive colours from the first zone.
  const primaryZone = Array.isArray(zone) ? zone[0] : zone;
  const colors = resolveColors(primaryZone);

  const zoneText = Array.isArray(zone)
    ? zone.map((z) => `Zone ${z}`).join(" · ")
    : `Zone ${zone}`;

  const ariaLabel = `${zoneText} — ${label}`;

  const borderColor =
    colors.bg === "#0f2318"
      ? "rgba(244,237,224,0.12)"
      : `${colors.bg}55`;

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
        border: `1px solid ${borderColor}`,
        flexShrink: 0,
        ...style,
      }}
      aria-label={ariaLabel}
    >
      <span style={{ opacity: 0.72 }}>{zoneText}</span>
      <span style={{ opacity: 0.35 }}>·</span>
      <span>{label}</span>
    </span>
  );
}
