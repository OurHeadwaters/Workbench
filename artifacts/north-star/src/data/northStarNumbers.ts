// ── Canonical numbers for the unified North Star ─────────────────────────────
// Single source of truth for the live money strip and model page.
// All values are Z2/Z3 business layer — no Z1 household data here.

// Phase 1 — Deer Lake trial
export const PHASE1_FEE          = 28_000;
export const PHASE1_INSTALLMENT  = 14_000;
export const PHASE1_TITHE        =  2_800;
export const PHASE1_POST_TITHE   = 25_200;
export const PHASE1_WEEKS_MIN    =  6;
export const PHASE1_WEEKS_MAX    =  8;
export const PHASE1_BOBBIE_RATE  =   105; // net/hr after Tyler delta
export const PHASE1_HRS_PER_WEEK =    40;
// At 6 wks: cost = $25,200 = post-tithe → break-even
// At 8 wks: cost = $33,600 → −$8,400 intentional gap

// Phase 2 — Full engagement (12 months)
export const PHASE2_TOTAL_BILLED_MONTHLY  = 39_200;
export const PHASE2_BOBBIE_DRAW_MONTHLY   = 16_800;
export const PHASE2_TYLER_MONTHLY         = 11_200;
export const PHASE2_OVERHEADS_MONTHLY     =  1_292;
export const PHASE2_SURPLUS_MONTHLY       =  9_908;
export const PHASE2_SURPLUS_ANNUAL        = 118_896;
export const PHASE2_TERM_MONTHS           = 12;

// Project totals
export const TOTAL_PROJECT_REVENUE  = 498_400;
export const STARTUP_BUDGET         =  28_000;
export const COMPUTING_RUNWAY_807   =  12_000;

// Economy Kit
export const KIT_PRICE = 97;

// Key dates
export const DEER_LAKE_SOFT_DEADLINE = "2026-06-15";
export const OPERATING_CONTRACT_DEADLINE = "2026-07-31";
