// Headwaters Field Journal — Design Tokens
// Northern, luminous, professional yet warm.

export const J = {
  // ── Palette ──────────────────────────────────────────────────────────
  color: {
    // Deep northern greens
    forest:       "#0F1C18",
    canopy:       "#1C3A2F",
    evergreen:    "#1f3d2e",
    moss:         "#2d5240",

    // Warm amber — primary accent
    amber:        "#D9A066",
    amberDim:     "#C4874A",
    amberGlow:    "rgba(217,160,102,0.18)",
    amberShadow:  "rgba(217,160,102,0.28)",

    // Icy blues — secondary accent
    iceBlue:      "#A8C4CC",
    iceBlueDim:   "rgba(168,196,204,0.35)",

    // Soft cream / paper
    cream:        "#f4ede0",
    parchment:    "#ede4d2",
    sand:         "#c8bfa7",

    // Northern syntax highlighting
    syntaxBg:     "#0d1f18",
    syntaxGreen:  "#7ec8a0",
    syntaxBlue:   "#88c0d0",
    syntaxAmber:  "#D9A066",
    syntaxMuted:  "#6b9080",

    // Rust (kept for backward compat)
    rust:         "#b85a3e",

    // Transparency helpers
    overlayLight: "rgba(15,28,24,0.55)",
    overlayDeep:  "rgba(15,28,24,0.80)",
  },

  // ── Typography ───────────────────────────────────────────────────────
  font: {
    serif:        "Fraunces_400Regular",
    serifItalic:  "Fraunces_400Regular_Italic",
    serifBold:    "Fraunces_700Bold",
    mono:         "JetBrainsMono_500Medium",
  },

  // ── Type Scale ───────────────────────────────────────────────────────
  size: {
    heroDisplay:  60,
    heroSub:      20,
    h1:           28,
    h2:           22,
    h3:           17,
    body:         17,
    small:        13,
    micro:        10,
    lineBody:     1.75,
    lineHeading:  1.25,
  },

  // ── Spacing ──────────────────────────────────────────────────────────
  space: {
    xs:   4,
    sm:   8,
    md:   16,
    lg:   24,
    xl:   32,
    xxl:  48,
    page: 22,
  },

  // ── Shadows (elevation) ──────────────────────────────────────────────
  shadow: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 4,
    },
    lift: {
      shadowColor: "#D9A066",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 12,
      elevation: 6,
    },
  },

  // ── Border Radius ────────────────────────────────────────────────────
  radius: {
    sm:  3,
    md:  6,
    lg:  10,
    pill: 24,
  },
} as const;
