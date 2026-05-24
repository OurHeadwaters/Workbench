/**
 * Community Money Machine — Governance Rules Data
 *
 * Canonical source for the structured governance content rendered on the
 * MoneyMachineBlueprintPage. Prose definitions and full context live in:
 *   shared/community-money-machine-governance.md
 *
 * Keep these constants in sync with that document.
 */

export interface BucketAuthority {
  bucket: string;
  accent: string;
  stewardCan: string[];
  tableRequired: string[];
}

export interface ReserveRaidStep {
  label: string;
  detail: string;
}

export const GOVERNANCE_AUTHORITY: BucketAuthority[] = [
  {
    bucket: "1 — Cost Basis",
    accent: "#1F5B3F",
    stewardCan: [
      "Approve routine expenses already in the agreed Cost Basis",
      "Pay practitioners at the agreed rate",
      "Flag variances under 5% of monthly Cost Basis without a meeting",
    ],
    tableRequired: [
      "Any change to the monthly Cost Basis (up or down)",
      "Any new recurring obligation against the Cost Basis",
    ],
  },
  {
    bucket: "2 — Reserve",
    accent: "#1A5FA8",
    stewardCan: [
      "Monitor balance and report monthly",
    ],
    tableRequired: [
      "Any draw on the Reserve — no exceptions (see Reserve Raid Protocol)",
    ],
  },
  {
    bucket: "3 — Reinvestment",
    accent: "#B45309",
    stewardCan: [
      "Approve spends up to the table-set single-spend ceiling (default: $2,500 CAD or 10% of monthly Cost Basis, whichever is lower)",
      "Confirm the ownership-increase test before any spend",
    ],
    tableRequired: [
      "Any Reinvestment spend above the single-spend ceiling",
    ],
  },
  {
    bucket: "4 — Eave Flow",
    accent: "#6d28d9",
    stewardCan: [
      "Confirm that overflow conditions are met before any Eave Flow is released",
    ],
    tableRequired: [
      "Any new Eave Flow recipient — where the overflow goes is a table decision",
    ],
  },
];

export const TABLE_TRIGGERS: string[] = [
  "Any change to the monthly Cost Basis (up or down)",
  "Any draw on the Reserve (no exceptions)",
  "Any Reinvestment spend above the single-spend ceiling",
  "Any change to bucket percentages or the split structure",
  "Any new Eave Flow recipient",
  "Any income stream crossing 25% of total monthly income — gaining or losing it",
  "Any partnership or contract creating a new recurring Cost Basis obligation",
  "Annual audit findings — reviewed and acknowledged by the full table",
  "Declaration of income failure (the Reserve draw trigger)",
];

export const RESERVE_RAID_STEPS: ReserveRaidStep[] = [
  {
    label: "Income Failure Declaration",
    detail:
      "Cost Basis steward documents two consecutive months below Cost Basis (or a single month with >50% shortfall) and sends written notice to all table members. This notice is the formal trigger.",
  },
  {
    label: "All-Hands Table Meeting",
    detail:
      "Full table meets live within five calendar days — in person or synchronous call. No written-consent substitute. The table reviews every available cut before authorizing a draw.",
  },
  {
    label: "Authorization Vote",
    detail:
      "Two-thirds majority required. Every member's position is recorded in the governance log. Draw amount is the minimum to cover the confirmed shortfall — not a round number, not a buffer.",
  },
  {
    label: "Draw and Notification",
    detail:
      "Reserve steward executes the draw within two business days. All members receive written confirmation. Machine state immediately returns to Building State — Reinvestment and Eave Flow pause.",
  },
  {
    label: "Replenishment Obligation",
    detail:
      "Within 30 days, the table establishes a replenishment plan naming a monthly replenishment amount, a target return date, and income recovery actions. Reviewed every quarter until the Reserve is restored. A draw with no replenishment plan within 30 days is a governance violation.",
  },
];
