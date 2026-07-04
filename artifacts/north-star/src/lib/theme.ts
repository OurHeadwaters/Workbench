// ── North Star canonical theme ──────────────────────────────────────────────
// One dark, handcrafted palette used across every page. Fraunces for display
// type, system sans for body copy. Do not introduce new one-off colors —
// add them here if a page genuinely needs a new tone.

export const BG = "#0B0905";
export const SURFACE = "#141210";
export const SURFACE_2 = "#1A1714";
export const BORDER = "rgba(237,232,213,0.08)";
export const BORDER_STRONG = "rgba(237,232,213,0.15)";

export const TEXT = "#EDE8D5";
export const TEXT_2 = "rgba(237,232,213,0.55)";
export const TEXT_3 = "rgba(237,232,213,0.35)";

export const AMBER = "#C8923A";
export const AMBER_LIGHT = "#F0B855";
export const AMBER_WASH = "rgba(200,146,58,0.12)";

export const GREEN = "#4ADE80";
export const RED = "rgba(239,68,68,0.7)";

export const FONT_DISPLAY = "Fraunces, Georgia, serif";

export const cardStyle = {
  backgroundColor: SURFACE,
  border: `1px solid ${BORDER}`,
} as const;

export const pageHeaderStyle = {
  backgroundColor: BG,
  borderBottom: `1px solid ${BORDER}`,
} as const;
