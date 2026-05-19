/**
 * stonemason.ts
 *
 * Zone 3 / Headwaters Stonemason three-layer revenue model.
 *
 * Headwaters = platform vendor.  807 = first tenant / licensee.
 * No SaaS fees from communities.  No equity.  807's revenue stays with 807.
 */

// ── Three layers ──────────────────────────────────────────────────────────────

export const LAYERS = [
  {
    id: "commons",
    label: "Commons",
    tagline: "The platform infrastructure",
    description:
      "Headwaters owns and maintains the Codetry/Deadhead tech stack. Licensed to 807 as first tenant. Communities pay nothing — no SaaS fees, no licensing.",
  },
  {
    id: "practitioner",
    label: "Practitioner",
    tagline: "The deployment engagement",
    description:
      "The practitioner (Headwaters) charges a fixed engagement fee to stand up the system inside a community. Discovery → Full Launch → Ongoing Stewardship.",
  },
  {
    id: "guild",
    label: "Guild",
    tagline: "The certification network",
    description:
      "Other practitioners certified to deploy the model. $1,200–$1,800/person cohort. 8% tithe back to the founding practitioner for the life of their certification.",
  },
] as const;

// ── Practitioner-layer pricing ────────────────────────────────────────────────

export interface PractitionerTier {
  id: string;
  label: string;
  price: string;
  note: string;
}

export const PRACTITIONER_TIERS: PractitionerTier[] = [
  { id: "discovery",   label: "Discovery Call",       price: "$500",        note: "90-min scoped discovery. Credited toward any package." },
  { id: "foundation",  label: "Foundation Build",      price: "$2,500",      note: "System setup, integrations, training walk-through." },
  { id: "training",    label: "Training Day",          price: "$1,200",      note: "On-site or virtual full-day implementation session." },
  { id: "full-launch", label: "Full Launch Package",   price: "$6,000",      note: "Discovery + Foundation Build + Training + 30-day support." },
  { id: "stewardship", label: "Ongoing Stewardship",   price: "$400 / mo",   note: "Monthly check-in, system updates, priority support." },
  { id: "emergency",   label: "Emergency Support",     price: "$350 / day",  note: "Same-day or next-day on-demand engagement." },
];

// ── Guild pricing ─────────────────────────────────────────────────────────────

export const GUILD_COHORT_MIN  = 1_200;  // $ per person
export const GUILD_COHORT_MAX  = 1_800;  // $ per person
export const GUILD_TITHE_PCT   = 8;      // % of fee back to founding practitioner

// ── Deadhead SaaS (live proof point) ─────────────────────────────────────────

export const DEADHEAD_MONTHLY   = 9;    // $/mo
export const DEADHEAD_ANNUAL    = 90;   // $/yr
export const DEADHEAD_TRIAL_DAYS = 14;  // day free trial
export const DEADHEAD_POS       = "Square";

// ── Income projections ────────────────────────────────────────────────────────

export interface IncomeYear {
  label: string;
  low: number;
  high: number;
  sources: { label: string; amount: string }[];
}

export const INCOME_YEARS: IncomeYear[] = [
  {
    label: "Year 1",
    low:  28_000,
    high: 48_000,
    sources: [
      { label: "1–2 practitioner engagements",     amount: "$6,000–$12,000" },
      { label: "Stewardship retainers (2–3 clients)", amount: "$9,600–$14,400" },
      { label: "Discovery calls (5–10)",            amount: "$2,500–$5,000" },
      { label: "Grant positioning / consulting",    amount: "$8,000–$12,000" },
      { label: "Guild pilot cohort (4–6 people)",   amount: "$4,800–$10,800" },
    ],
  },
  {
    label: "Year 2",
    low:  72_000,
    high: 115_000,
    sources: [
      { label: "3–5 new engagements",               amount: "$18,000–$30,000" },
      { label: "Stewardship retainers (6–8 clients)", amount: "$28,800–$38,400" },
      { label: "Guild cohort (8–12 people)",         amount: "$9,600–$21,600" },
      { label: "Guild tithe income (Year 1 grads)",  amount: "$960–$2,160" },
      { label: "Grant fees + consulting",            amount: "$15,000–$24,000" },
    ],
  },
  {
    label: "Year 3+",
    low:  130_000,
    high: 220_000,
    sources: [
      { label: "5–8 new engagements / yr",          amount: "$30,000–$48,000" },
      { label: "Stewardship retainers (10–16)",      amount: "$48,000–$76,800" },
      { label: "Guild cohort (12–20 people / yr)",   amount: "$14,400–$36,000" },
      { label: "Guild tithe (compounding)",          amount: "$3,000–$12,000" },
      { label: "Grant + consulting fees",            amount: "$24,000–$40,000" },
    ],
  },
];

// ── 24-month quarterly runway map (Q1 2026 → Q2 2027) ────────────────────────

export interface RunwayQuarter {
  id: string;
  label: string;
  focus: string;
  target: string;
  revenueMin: number;
  revenueMax: number;
}

export const RUNWAY_QUARTERS: RunwayQuarter[] = [
  {
    id: "q1-2026",
    label: "Q1 2026",
    focus: "Foundation & proof",
    target: "First discovery + Deadhead live",
    revenueMin: 3_000,
    revenueMax: 8_000,
  },
  {
    id: "q2-2026",
    label: "Q2 2026",
    focus: "First engagements",
    target: "2 full-launch packages closed",
    revenueMin: 8_000,
    revenueMax: 16_000,
  },
  {
    id: "q3-2026",
    label: "Q3 2026",
    focus: "Retainer base + Guild pilot",
    target: "4 stewardship clients + pilot cohort launched",
    revenueMin: 14_000,
    revenueMax: 24_000,
  },
  {
    id: "q4-2026",
    label: "Q4 2026",
    focus: "Scale outreach",
    target: "2 more engagements + grant positioning active",
    revenueMin: 18_000,
    revenueMax: 30_000,
  },
  {
    id: "q1-2027",
    label: "Q1 2027",
    focus: "Guild expansion",
    target: "Second cohort, 6–8 retainers, tithe income starts",
    revenueMin: 24_000,
    revenueMax: 38_000,
  },
  {
    id: "q2-2027",
    label: "Q2 2027",
    focus: "Self-sustaining base",
    target: "Guild tithe compounding; retainers cover operating floor",
    revenueMin: 32_000,
    revenueMax: 52_000,
  },
];

// ── Computed income + runway from overrideable driver values ──────────────────
//
// Call these with a values map from loadOverrideValues() (stonemasonOverrides.ts).
// The ZONE3_INPUTS defaults in stonemasonOverrides.ts are calibrated so that
// computeIncomeYears(ZONE3_DEFAULTS) approximates the static INCOME_YEARS
// baseline ranges. Exact match is not guaranteed — the static ranges were
// hand-authored; these are derived from discrete driver midpoints.

function fmtRange(lo: number, hi: number): string {
  const f = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");
  return lo === hi ? f(lo) : `${f(lo)}–${f(hi)}`;
}

export function computeIncomeYears(ov: Record<string, number>): IncomeYear[] {
  const retainerRate      = ov["retainer_rate"]         ?? 400;
  const fullLaunchFee     = ov["full_launch_fee"]        ?? 6_000;
  const guildPricePerPerson = ov["guild_price_per_person"] ?? 1_500;
  const guildTithePct     = ov["guild_tithe_pct"]        ?? 8;
  const discoveryFee      = ov["discovery_fee"]          ?? 500;

  // ── Year 1 ──
  const y1e  = ov["y1_engagements"]     ?? 1;
  const y1r  = ov["y1_retainers"]       ?? 2;
  const y1gc = ov["y1_guild_cohort"]    ?? 5;
  const y1d  = ov["y1_discovery_calls"] ?? 7;
  const y1g  = ov["y1_grant"]           ?? 10_000;

  const y1EngagementIncome  = y1e * fullLaunchFee;
  const y1RetainerIncome    = y1r * retainerRate * 12;
  const y1GuildIncome       = y1gc * guildPricePerPerson;
  const y1DiscoveryIncome   = y1d * discoveryFee;
  const y1Total             = y1EngagementIncome + y1RetainerIncome + y1GuildIncome + y1DiscoveryIncome + y1g;

  // ── Year 2 ──
  const y2e  = ov["y2_engagements"]  ?? 4;
  const y2r  = ov["y2_retainers"]    ?? 7;
  const y2gc = ov["y2_guild_cohort"] ?? 10;
  const y2g  = ov["y2_grant"]        ?? 19_500;

  // Guild tithe: Year 1 graduates × price × tithe%
  const y2TitheIncome       = Math.round(y1gc * guildPricePerPerson * (guildTithePct / 100));
  const y2EngagementIncome  = y2e * fullLaunchFee;
  const y2RetainerIncome    = y2r * retainerRate * 12;
  const y2GuildIncome       = y2gc * guildPricePerPerson;
  const y2Total             = y2EngagementIncome + y2RetainerIncome + y2GuildIncome + y2TitheIncome + y2g;

  // ── Year 3 ──
  const y3e  = ov["y3_engagements"]  ?? 7;
  const y3r  = ov["y3_retainers"]    ?? 13;
  const y3gc = ov["y3_guild_cohort"] ?? 16;
  const y3g  = ov["y3_grant"]        ?? 32_000;

  // Tithe compounds: Years 1+2 graduates
  const y3TitheIncome       = Math.round((y1gc + y2gc) * guildPricePerPerson * (guildTithePct / 100));
  const y3EngagementIncome  = y3e * fullLaunchFee;
  const y3RetainerIncome    = y3r * retainerRate * 12;
  const y3GuildIncome       = y3gc * guildPricePerPerson;
  const y3Total             = y3EngagementIncome + y3RetainerIncome + y3GuildIncome + y3TitheIncome + y3g;

  return [
    {
      label: "Year 1",
      low:   Math.round(y1Total * 0.75),
      high:  Math.round(y1Total * 1.25),
      sources: [
        { label: `${y1e} practitioner engagement${y1e !== 1 ? "s" : ""}`,   amount: fmtRange(y1EngagementIncome * 0.9, y1EngagementIncome * 1.1) },
        { label: `Stewardship retainers (${y1r} clients)`,                  amount: fmtRange(y1RetainerIncome * 0.9,   y1RetainerIncome * 1.1) },
        { label: `Discovery calls (${y1d})`,                                amount: fmtRange(y1DiscoveryIncome, y1DiscoveryIncome) },
        { label: "Grant positioning / consulting",                           amount: fmtRange(y1g * 0.9, y1g * 1.1) },
        { label: `Guild pilot cohort (${y1gc} people)`,                     amount: fmtRange(y1GuildIncome * 0.9, y1GuildIncome * 1.1) },
      ],
    },
    {
      label: "Year 2",
      low:   Math.round(y2Total * 0.8),
      high:  Math.round(y2Total * 1.2),
      sources: [
        { label: `${y2e} new engagement${y2e !== 1 ? "s" : ""}`,            amount: fmtRange(y2EngagementIncome * 0.9, y2EngagementIncome * 1.1) },
        { label: `Stewardship retainers (${y2r} clients)`,                  amount: fmtRange(y2RetainerIncome * 0.9,   y2RetainerIncome * 1.1) },
        { label: `Guild cohort (${y2gc} people)`,                           amount: fmtRange(y2GuildIncome * 0.9, y2GuildIncome * 1.1) },
        { label: "Guild tithe income (Year 1 grads)",                       amount: fmtRange(y2TitheIncome * 0.9, y2TitheIncome * 1.1) },
        { label: "Grant fees + consulting",                                  amount: fmtRange(y2g * 0.9, y2g * 1.1) },
      ],
    },
    {
      label: "Year 3+",
      low:   Math.round(y3Total * 0.8),
      high:  Math.round(y3Total * 1.2),
      sources: [
        { label: `${y3e} new engagement${y3e !== 1 ? "s" : ""} / yr`,       amount: fmtRange(y3EngagementIncome * 0.9, y3EngagementIncome * 1.1) },
        { label: `Stewardship retainers (${y3r})`,                          amount: fmtRange(y3RetainerIncome * 0.9,   y3RetainerIncome * 1.1) },
        { label: `Guild cohort (${y3gc} people / yr)`,                      amount: fmtRange(y3GuildIncome * 0.9, y3GuildIncome * 1.1) },
        { label: "Guild tithe (compounding)",                               amount: fmtRange(y3TitheIncome * 0.9, y3TitheIncome * 1.1) },
        { label: "Grant + consulting fees",                                  amount: fmtRange(y3g * 0.9, y3g * 1.1) },
      ],
    },
  ];
}

/**
 * Scale quarterly runway targets proportionally to the computed Year-1 total.
 * This keeps the runway map live when income assumptions change.
 */
export function computeRunwayQuarters(ov: Record<string, number>): RunwayQuarter[] {
  const computed = computeIncomeYears(ov);
  const computedY1Mid = (computed[0].low + computed[0].high) / 2;
  const staticY1Mid   = (INCOME_YEARS[0].low + INCOME_YEARS[0].high) / 2;
  const computedY2Mid = (computed[1].low + computed[1].high) / 2;
  const staticY2Mid   = (INCOME_YEARS[1].low + INCOME_YEARS[1].high) / 2;

  const scale = (quarter: RunwayQuarter, idx: number): RunwayQuarter => {
    // First 4 quarters scale off Year 1; last 2 off Year 2
    const ratio = idx < 4
      ? (staticY1Mid > 0 ? computedY1Mid / staticY1Mid : 1)
      : (staticY2Mid > 0 ? computedY2Mid / staticY2Mid : 1);
    return {
      ...quarter,
      revenueMin: Math.round(quarter.revenueMin * ratio),
      revenueMax: Math.round(quarter.revenueMax * ratio),
    };
  };

  return RUNWAY_QUARTERS.map((q, i) => scale(q, i));
}

// ── Grant programs ────────────────────────────────────────────────────────────

export interface GrantProgram {
  id: string;
  name: string;
  acronym: string;
  eligibility: string;
  fit: string;
}

export const GRANT_PROGRAMS: GrantProgram[] = [
  {
    id: "nohfc",
    name: "Northern Ontario Heritage Fund Corporation",
    acronym: "NOHFC",
    eligibility: "Northern Ontario-based businesses and organizations.",
    fit: "Platform infrastructure as economic development tool for northern communities.",
  },
  {
    id: "otf",
    name: "Ontario Trillium Foundation",
    acronym: "OTF",
    eligibility: "Non-profit and community benefit organizations.",
    fit: "Community food access + practitioner training as capacity-building.",
  },
  {
    id: "new-horizons",
    name: "New Horizons for Seniors",
    acronym: "New Horizons",
    eligibility: "Community-led projects engaging seniors.",
    fit: "Elder knowledge integration into food systems; rural food security.",
  },
  {
    id: "cdap",
    name: "Canada Digital Adoption Program",
    acronym: "CDAP",
    eligibility: "Small businesses adopting digital tools.",
    fit: "Deadhead SaaS + Codetry stack as digital adoption for northern food retailers.",
  },
];

// ── Rootwork pilot avatars ────────────────────────────────────────────────────

export const ROOTWORK_AVATARS = [
  { id: "a1", label: "The Returning Home-Steader",   note: "Left the city; needs a sustainable local income stream." },
  { id: "a2", label: "The Community Kitchen Director", note: "Runs a program but not a business. Wants the tools." },
  { id: "a3", label: "The Band EDO",                  note: "Economic Development Officer on a First Nation. Needs a proven model." },
  { id: "a4", label: "The Northern Dietitian",        note: "Healthcare mandate; food security is the actual intervention." },
  { id: "a5", label: "The Food Hub Entrepreneur",     note: "Has the relationships; needs the operating system." },
  { id: "a6", label: "The Retiring Farmer",           note: "Succession question; wants the land to keep feeding people." },
];

export const ROOTWORK_OPEN_DECISIONS = [
  "Pilot pricing — free, subsidised, or full rate?",
  "Which 2–3 avatars get warm outreach first?",
  "Geography — northern Ontario only, or national?",
];

// ── Cash-flow priorities ──────────────────────────────────────────────────────

export const CASHFLOW_PRIORITIES = [
  { order: 1, label: "Pay the founder first",         detail: "Practitioner draw before any other operating expense." },
  { order: 2, label: "Build retainers to 6–8",        detail: "Recurring stewardship income is the operating floor." },
  { order: 3, label: "Use grants for debt reduction",  detail: "Grant income retires operating LOC and founder loans first." },
  { order: 4, label: "Guild tithe as long-term insurance", detail: "8% for life of certification. Compounds quietly." },
];

// ── Out-of-scope declarations ─────────────────────────────────────────────────

export const OUT_OF_SCOPE = [
  "No SaaS fees from communities — communities pay nothing to use the platform.",
  "No equity — Headwaters does not take ownership in community enterprises.",
  "807's revenue stays with 807 — distribution income is 807's, not Headwaters'.",
];
