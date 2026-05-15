/**
 * costRegistry.ts
 *
 * Canonical list of every cost line item, with planning defaults sourced
 * directly from budgetScenarios.ts.  This is the single place CostReviewModal
 * and costReview.ts look up labels, descriptions, and default values.
 *
 * Only scenario-B values are used as the "planning default" for review
 * purposes — B is the recommended scenario and the one the founder actively
 * plans against.  C-specific lines carry their own defaults.
 */

import {
  B_LINES,
  A_LINES,
  C_ADDITIONAL_LINES,
} from "@/data/budgetScenarios";

export type CostScenario = "A" | "B" | "C";

export interface CostItem {
  /** Stable key — matches a key in B_LINES / A_LINES / C_ADDITIONAL_LINES */
  key: string;
  label: string;
  description: string;
  /** Which scenario this line first appears in */
  scenario: CostScenario;
  /**
   * Planning default for the "review" scenario.
   * For A and B lines this is the B value (B is the plan).
   * For C-specific lines this is the C additional value.
   * For A-only lines (present in A but not B) this is the A value.
   */
  defaultValue: number;
  /** Raw A-scenario value, null if not in A */
  aValue: number | null;
  /** Raw B-scenario value, null if not in B */
  bValue: number | null;
  /** Raw C-additional value, null if not in C */
  cValue: number | null;
}

export const COST_REGISTRY: CostItem[] = [
  {
    key: "practitioner",
    label: "Practitioner / Lead",
    description: "Engagement owner — loaded monthly take",
    scenario: "A",
    defaultValue: B_LINES.practitioner,
    aValue: A_LINES.practitioner,
    bValue: B_LINES.practitioner,
    cValue: null,
  },
  {
    key: "opsManager",
    label: "Operations Manager",
    description: "Dryden, on-site · ~40 hrs/wk @ $40/hr loaded",
    scenario: "A",
    defaultValue: B_LINES.opsManager,
    aValue: A_LINES.opsManager,
    bValue: B_LINES.opsManager,
    cValue: null,
  },
  {
    key: "itTech",
    label: "IT / Tech",
    description: "Servers, privacy phones, transparency stack, store IT",
    scenario: "A",
    defaultValue: B_LINES.itTech,
    aValue: A_LINES.itTech,
    bValue: B_LINES.itTech,
    cValue: null,
  },
  {
    key: "bookkeeper",
    label: "Bookkeeper / Admin",
    description: "Remote ~10 hrs/wk · CRA, invoicing, monthly close",
    scenario: "A",
    defaultValue: B_LINES.bookkeeper,
    aValue: A_LINES.bookkeeper,
    bValue: B_LINES.bookkeeper,
    cValue: null,
  },
  {
    key: "foodHandler",
    label: "Food Handler (embedded at DL)",
    description: "Headwaters-owned, on the store floor Day 1",
    scenario: "A",
    defaultValue: B_LINES.foodHandler,
    aValue: A_LINES.foodHandler,
    bValue: B_LINES.foodHandler,
    cValue: null,
  },
  {
    key: "lifeSupports",
    label: "Life supports + overhead",
    description: "Cleaner $500/mo + tutor $900/mo + handyman $700/mo",
    scenario: "A",
    defaultValue: B_LINES.lifeSupports,
    aValue: A_LINES.lifeSupports,
    bValue: B_LINES.lifeSupports,
    cValue: C_ADDITIONAL_LINES.lifeSupportsDelta,
  },
  {
    key: "aggregationHub",
    label: "Aggregation hub (Dad-warehouse)",
    description: "$2,200 rent + utilities all-in · /lease-tooling",
    scenario: "A",
    defaultValue: B_LINES.aggregationHub,
    aValue: A_LINES.aggregationHub,
    bValue: B_LINES.aggregationHub,
    cValue: null,
  },
  {
    key: "tooling",
    label: "Tooling, SaaS, insurance",
    description: "Operating overhead — agency licenses and software stack",
    scenario: "A",
    defaultValue: B_LINES.tooling,
    aValue: A_LINES.tooling,
    bValue: B_LINES.tooling,
    cValue: null,
  },
  {
    key: "recurringTech",
    label: "Recurring tech ops",
    description: "Cloud, phone plans, monitoring — 9-server fleet monthly",
    scenario: "A",
    defaultValue: B_LINES.recurringTech,
    aValue: A_LINES.recurringTech,
    bValue: B_LINES.recurringTech,
    cValue: null,
  },
  {
    key: "cdAssociate",
    label: "Community Dev. Associate",
    description: "Pilot #2 readiness; community-facing engagement",
    scenario: "B",
    defaultValue: B_LINES.cdAssociate,
    aValue: null,
    bValue: B_LINES.cdAssociate,
    cValue: null,
  },
  {
    key: "juniorAnalyst",
    label: "Junior Analyst / Field",
    description: "Data, household price lookups, fieldwork",
    scenario: "B",
    defaultValue: B_LINES.juniorAnalyst,
    aValue: null,
    bValue: B_LINES.juniorAnalyst,
    cValue: null,
  },
  {
    key: "buffer",
    label: "Buffer (statutory + variance)",
    description: "Holds cost basis when payroll taxes or insurance jump",
    scenario: "B",
    defaultValue: B_LINES.buffer,
    aValue: null,
    bValue: B_LINES.buffer,
    cValue: null,
  },
  {
    key: "srEngineer2",
    label: "Sr Engineer #2",
    description: "Server resilience at scale — second senior engineer for the 9-server fleet",
    scenario: "C",
    defaultValue: C_ADDITIONAL_LINES.srEngineer2,
    aValue: null,
    bValue: null,
    cValue: C_ADDITIONAL_LINES.srEngineer2,
  },
  {
    key: "regionalOutreach",
    label: "Regional Outreach",
    description: "Pilot #2 community sourcing — the seat that makes the second engagement ready",
    scenario: "C",
    defaultValue: C_ADDITIONAL_LINES.regionalOutreach,
    aValue: null,
    bValue: null,
    cValue: C_ADDITIONAL_LINES.regionalOutreach,
  },
  {
    key: "trainer",
    label: "Council Trainer",
    description: "Training cohorts at receiving bands — knowledge transfer at scale",
    scenario: "C",
    defaultValue: C_ADDITIONAL_LINES.trainer,
    aValue: null,
    bValue: null,
    cValue: C_ADDITIONAL_LINES.trainer,
  },
];

/** Look up a registry item by key.  Returns undefined if not found. */
export function getCostItem(key: string): CostItem | undefined {
  return COST_REGISTRY.find((item) => item.key === key);
}
