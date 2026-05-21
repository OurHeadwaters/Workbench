const palette = {
  // Northern deep greens
  forest:    "#0F1C18",
  canopy:    "#1C3A2F",
  ink:       "#1f3d2e",
  moss:      "#2d5240",

  // Warm amber accent
  amber:     "#D9A066",
  amberDim:  "#C4874A",

  // Icy blue accent
  iceBlue:   "#A8C4CC",

  // Paper / cream tones
  cream:     "#f4ede0",
  parchment: "#ede4d2",
  sand:      "#c8bfa7",
  stone:     "#6b7665",

  // Legacy rust (kept for backward compat)
  rust:      "#b85a3e",
};

const colors = {
  light: {
    text:                palette.ink,
    tint:                palette.ink,
    background:          palette.cream,
    foreground:          palette.ink,
    card:                palette.parchment,
    cardForeground:      palette.ink,
    primary:             palette.ink,
    primaryForeground:   palette.cream,
    secondary:           palette.parchment,
    secondaryForeground: palette.ink,
    muted:               palette.sand,
    mutedForeground:     palette.stone,
    accent:              palette.amber,
    accentForeground:    palette.cream,
    destructive:         "#7a2e2e",
    destructiveForeground: palette.cream,
    border:              palette.sand,
    input:               palette.sand,
    rule:                "#d4ccb6",
    pullQuote:           palette.stone,
    chrome:              "rgba(244,237,224,0.96)",
    chromeBorder:        "rgba(31,61,46,0.10)",
    rust:                palette.rust,
    amber:               palette.amber,
    iceBlue:             palette.iceBlue,
  },
  dark: {
    text:                "#e8e0cf",
    tint:                "#e8e0cf",
    background:          "#0e1a14",
    foreground:          "#e8e0cf",
    card:                "#16261d",
    cardForeground:      "#e8e0cf",
    primary:             "#e8e0cf",
    primaryForeground:   "#0e1a14",
    secondary:           "#16261d",
    secondaryForeground: "#e8e0cf",
    muted:               "#3b554a",
    mutedForeground:     "#9aa89c",
    accent:              palette.amber,
    accentForeground:    "#0e1a14",
    destructive:         "#c87878",
    destructiveForeground: "#0e1a14",
    border:              "#2a3d33",
    input:               "#2a3d33",
    rule:                "#26382e",
    pullQuote:           "#9aa89c",
    chrome:              "rgba(14,26,20,0.96)",
    chromeBorder:        "rgba(232,224,207,0.10)",
    rust:                "#c97055",
    amber:               palette.amber,
    iceBlue:             palette.iceBlue,
  },
  radius: 4,
};

export default colors;
