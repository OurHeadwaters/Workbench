/**
 * Canonical zone pill colours.
 *
 * bg  — pill background (also used as the ZoneDot fill)
 * fg  — pill foreground text
 *
 * Key 0 and "Aquifer" both map to the Aquifer dark-green entry.
 */
export interface ZoneColorEntry {
  bg: string;
  fg: string;
}

export const ZONE_COLORS: Record<number | string, ZoneColorEntry> = {
  0: { bg: "#0f2318", fg: "rgba(244,237,224,0.75)" },
  1: { bg: "#345c45", fg: "#f4ede0" },
  2: { bg: "#1A5FA8", fg: "#f4ede0" },
  3: { bg: "#b85a3e", fg: "#f4ede0" },
  4: { bg: "#2a4d36", fg: "#f4ede0" },
  5: { bg: "#c97c2e", fg: "#f4ede0" },
  Aquifer: { bg: "#0f2318", fg: "rgba(244,237,224,0.75)" },
};

/** Resolve colours for a zone key, defaulting to Zone 2 (blue) if unknown. */
export function resolveColors(zone: number | string): ZoneColorEntry {
  return ZONE_COLORS[zone] ?? ZONE_COLORS[2];
}
