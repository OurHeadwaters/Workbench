import { resolveColors } from "./colors";

export interface ZoneDotProps {
  zone: number | "Aquifer";
  /** Diameter in pixels. Defaults to 10. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** A small filled circle carrying the canonical zone colour. */
export function ZoneDot({ zone, size = 10, className, style }: ZoneDotProps) {
  const { bg } = resolveColors(zone);
  return (
    <span
      className={className}
      aria-hidden
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
