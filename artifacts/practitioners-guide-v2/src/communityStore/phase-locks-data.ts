export interface PhaseLockEntry {
  number: string;
  tag: string;
  headline: string;
  summary: string;
  decisions: string[];
  proofLabel: string;
}

export const PHASE_LOCKS: PhaseLockEntry[] = [
  {
    number: "01",
    tag: "Phase 1 · Pre-frame",
    headline: "Before the walls go up.",
    summary:
      "Floor plan, cold-chain footprint, role design. Locked together — so the door is wide enough for the freezer, and the freezer is sized for the truck.",
    decisions: [
      "Floor plan — door widths, aisle widths, public-records counter.",
      "Cold-chain footprint — freezer + cooler dimensions, dock placement, receiving aisle.",
      "Role design — operator-couple seats, flex roles, food-safety presence on day one.",
    ],
    proofLabel: "Phase 1 · Pre-frame — what gets locked, who signs, where the proof lives",
  },
  {
    number: "02",
    tag: "Phase 2 · Pre-electrical",
    headline: "Before the conduit gets pulled.",
    summary:
      "Till position, back-of-house placement, public-records hardware. Locked before the electrician decides where the outlets live.",
    decisions: [
      "Till station — exact position, counter height, customer-facing screen.",
      "Back-of-house — receiving desk, manager workstation, cold-chain readout.",
      "Public-records hardware — open-records terminal, daily-close station, household-lookup screen.",
    ],
    proofLabel: "Phase 2 · Pre-electrical — what gets locked, who signs, where the proof lives",
  },
  {
    number: "03",
    tag: "Phase 3 · Pre-finish",
    headline: "Before the sign goes on the building.",
    summary:
      "Signage, public price page, opening-day staffing. Locked before opening week — so day one isn't the day the community first sees the price list.",
    decisions: [
      "Signage — exterior name, hours panel, food-safety contact.",
      "Public price page — every SKU, every price, readable on a phone.",
      "Opening-day staffing — operator couple + practitioner food-safety person, hour by hour.",
    ],
    proofLabel: "Phase 3 · Pre-finish — what gets locked, who signs, where the proof lives",
  },
];

export const SIGNOFF_COLUMNS = [
  "Chief / Band council",
  "Headwaters practitioner",
  "Contractor foreman",
] as const;
