/**
 * budgetScenarios.ts
 *
 * Single source of truth for all budget numbers used across the deck,
 * one-pager, and closing slide.
 *
 * Edit here. Nowhere else.
 *
 * Files that import from this module:
 *   src/pages/slides/Budget.tsx
 *   src/pages/slides/CashFlow.tsx
 *   src/pages/slides/CaseForRate.tsx
 *   src/pages/slides/Closing.tsx
 *   src/pages/OnePager.tsx
 */

// ── Scenario B (Recommended) — individual monthly line items ─────────
//
// These are the rows the contractor's CFO can audit line-by-line.
// Changing any value here propagates to every slide and the one-pager.
//
export const B_LINES = {
  practitioner:   18_000,  // Engagement owner — loaded monthly take
  opsManager:      8_500,  // Dryden, on-site · ~40 hrs/wk @ $40/hr loaded
  itTech:          9_500,  // Servers, privacy phones, transparency stack, store IT
  bookkeeper:      2_500,  // Remote ~10 hrs/wk · CRA, invoicing, monthly close
  foodHandler:     5_000,  // Headwaters-owned, embedded at Deer Lake store from Day 1
  cdAssociate:     7_500,  // Engagement #2 readiness — the seat that makes Pilot #2 real
  juniorAnalyst:   6_500,  // Data, household lookups, fieldwork
  lifeSupports:    2_100,  // Cleaner $500 + tutor $900 + handyman $700
  aggregationHub:  3_000,  // Dad-warehouse · $2,200 rent + utilities all-in · /lease-tooling
  tooling:         2_500,  // Operating overhead — agency licenses and software stack
  recurringTech:   2_200,  // Cloud, phone plans, monitoring — 9-server fleet monthly
  buffer:          2_400,  // Statutory + variance — holds the cost basis when payroll taxes jump
} as const satisfies Record<string, number>;

// ── Scenario A (Floor) — individual monthly line items ───────────────
//
// Subset of B: no cdAssociate, juniorAnalyst, or buffer.
// Practitioner take is reduced for the floor scenario; aggregationHub is
// partially allocated.  Values sum to COST_BASIS.a (48,200).
//
export const A_LINES = {
  practitioner:   15_200,  // Floor take — reduced vs B ($18k) in the floor scenario
  opsManager:      8_500,  // Same as B · Dryden on-site
  itTech:          9_500,  // Same as B · servers, phones, stack
  bookkeeper:      2_500,  // Same as B · remote admin
  foodHandler:     5_000,  // Same as B · embedded at Deer Lake store Day 1
  lifeSupports:    2_100,  // Same as B · cleaner, tutor, handyman
  aggregationHub:    800,  // Partial hub allocation for the floor scenario
  tooling:         2_500,  // Same as B · agency licenses
  recurringTech:   2_100,  // Slightly below B's $2,200 at floor
} as const satisfies Record<string, number>;
// Sum: 15200+8500+9500+2500+5000+2100+800+2500+2100 = 48,200 ✓

// ── Scenario C (Scale) — additions above Scenario B ──────────────────
//
// These lines are added on top of B_LINES to reach COST_BASIS.c.
// The lifeSupportsDelta reflects expanded household supports at scale
// (C uses $5,000/mo vs B's $2,100).
// Total addition = srEngineer2 + regionalOutreach + trainer + lifeSupportsDelta
//               = 15,000 + 6,500 + 5,000 + 2,900 = 29,400
//               = COST_BASIS.c − COST_BASIS.b (99,100 − 69,700) ✓
//
export const C_ADDITIONAL_LINES = {
  srEngineer2:       15_000,  // Senior Engineer #2 — server resilience at scale
  regionalOutreach:   6_500,  // Regional Outreach — Pilot #2 community sourcing
  trainer:            5_000,  // Council Trainer — training cohorts at receiving bands
  lifeSupportsDelta:  2_900,  // Expanded life supports at scale (C $5,000 vs B $2,100)
} as const satisfies Record<string, number>;
// Sum: 15000+6500+5000+2900 = 29,400 = COST_BASIS.c − COST_BASIS.b ✓

// ── Monthly cost basis by scenario ───────────────────────────────────
//
// A = floor (practitioner core only — no CD associate, junior analyst, or buffer)
// B = recommended — computed live from B_LINES above
// C = scale — adds Sr Engineer #2, Regional Outreach, Trainer, and expanded life supports
//
export const COST_BASIS = {
  a: (Object.values(A_LINES) as number[]).reduce((sum, v) => sum + v, 0),  // 48,200
  b: (Object.values(B_LINES) as number[]).reduce((sum, v) => sum + v, 0),  // 69,700
  c: (Object.values(B_LINES) as number[]).reduce((sum, v) => sum + v, 0)
     + (Object.values(C_ADDITIONAL_LINES) as number[]).reduce((sum, v) => sum + v, 0), // 99,100
} as const;

// ── Headline monthly ask (contract price) ────────────────────────────
export const ASK = {
  floor:       60_000,  // Scenario A
  recommended: 90_000,  // Scenario B
  scale:      125_000,  // Scenario C
} as const;

// ── Day-one tech CAPEX (one-time, not in monthly cost basis) ─────────
export const CAPEX = {
  a:      0,   // Floor scenario — no new hardware day one
  b: 42_000,   // 3 servers · 3 privacy phones · 5 computers · networking
  c: 60_000,   // 6 servers · 6 phones · 8 computers · full rack
} as const;

// ── Derived: reinvestment = ask − cost basis ─────────────────────────
//
// Percentage is vs cost basis (not vs ask) — how much above cost
// the practitioner is investing back into the agency each month.
//
export const REINVEST = {
  b: {
    amount: ASK.recommended - COST_BASIS.b,       // 20,300
    pct:    Math.round(
      ((ASK.recommended - COST_BASIS.b) / COST_BASIS.b) * 100
    ),                                             // 29
  },
  c: {
    amount: ASK.scale - COST_BASIS.c,             // 25,900
    pct:    Math.round(
      ((ASK.scale - COST_BASIS.c) / COST_BASIS.c) * 100
    ),                                             // 26
  },
} as const;

// ── Derived: day-one bridge = (2 × monthly cost basis) + CAPEX ───────
//
// Two months of outflow covers the net-60 invoice cycle before the
// first payment clears.  CAPEX is the hardware needed on Day 1.
//
export const BRIDGE = {
  a: COST_BASIS.a * 2 + CAPEX.a,  // 96,400  ≈ $96k
  b: COST_BASIS.b * 2 + CAPEX.b,  // 181,400 ≈ $181k
  c: COST_BASIS.c * 2 + CAPEX.c,  // 258,200 ≈ $258k
} as const;

// ── Clearance month (month bridge capital is fully recovered) ─────────
//
// At the recommended ask, the first net-60 invoice arrives at M3.
// Two consecutive payments (M3 + M4) retire the two-month bridge.
// CAPEX is recovered once the M3 invoice clears (M4 cash arrives).
//
export const CLEARANCE_MONTH = {
  a: 3,  // M3: first invoice clears
  b: 4,  // M4: second invoice clears, bridge retired
  c: 4,
} as const;

// ── Half-load ramp operating cost (month-one bridge analysis) ────────
//
// When the team ramps at half-load in month 1 (practitioner + Tyler
// subcontract only, minimal IT and overhead), the day-one bridge
// requirement is ~$41k — one month of this smaller footprint.
// This is the correct basis for the bridge-funding conversation.
//
export const HALF_LOAD_LINES = {
  practitioner:      26_000,  // $150/hr × ~173 hrs/mo (40 hrs/wk)
  tylerSubcontract:   9_100,  // $70/hr through Tyler's business (~130 hrs/mo)
  itSupport:            900,  // Partial IT/Support allocation, month 1
  overhead:           5_000,  // Operating overhead
} as const satisfies Record<string, number>;

export const HALF_LOAD_TOTAL = (
  Object.values(HALF_LOAD_LINES) as number[]
).reduce((sum, v) => sum + v, 0);  // 41,000

// ── Y1 revenue and gap (Scenario B, Deer Lake only) ──────────────────
export const Y1 = {
  revenue:         446_598,  // Signed Layer-1 + tech-stack fee + 807 CDP grant + Salts
  cost:            573_800,  // 12 months of loaded cost basis (B) + people & retention
  gap:            -127_202,  // revenue − cost
  capitalRecovery: 112_000,  // V2 balance outstanding — reduces effective gap
} as const;

// ── Formatting helpers ────────────────────────────────────────────────

/** "$69,700" */
export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

/** "~$181k" */
export function fmtK(n: number): string {
  const k = Math.round(n / 1_000);
  return "~$" + k + "k";
}

/** "29%" */
export function fmtPct(n: number): string {
  return Math.round(n) + "%";
}

// ── Scenario table rows (used by Budget, OnePager, Closing) ──────────
export interface ScenarioRow {
  id:         "a" | "b" | "c";
  label:      string;
  tag:        string;
  costBasis:  number;
  reinvest:   number;
  reinvestPct: number;
  ask:        number;
  bridge:     number;
}

export const SCENARIO_ROWS: ScenarioRow[] = [
  {
    id:          "a",
    label:       "A — floor",
    tag:         "Practitioner core only",
    costBasis:   COST_BASIS.a,
    reinvest:    ASK.floor - COST_BASIS.a,
    reinvestPct: Math.round(((ASK.floor - COST_BASIS.a) / COST_BASIS.a) * 100),
    ask:         ASK.floor,
    bridge:      BRIDGE.a,
  },
  {
    id:          "b",
    label:       "B — recommended",
    tag:         "Full six-person team",
    costBasis:   COST_BASIS.b,
    reinvest:    REINVEST.b.amount,
    reinvestPct: REINVEST.b.pct,
    ask:         ASK.recommended,
    bridge:      BRIDGE.b,
  },
  {
    id:          "c",
    label:       "C — scale",
    tag:         "Pilot #2 + three concurrent reserves",
    costBasis:   COST_BASIS.c,
    reinvest:    REINVEST.c.amount,
    reinvestPct: REINVEST.c.pct,
    ask:         ASK.scale,
    bridge:      BRIDGE.c,
  },
];
