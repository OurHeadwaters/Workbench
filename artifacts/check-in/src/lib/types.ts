// Wire format for snapshots returned by /api/check-in/snapshots.  The server
// flattens drizzle's numeric strings to plain numbers before responding.
export type Snapshot = {
  id: string;
  year: number;
  takenAt: string; // ISO timestamp
  watershedArr: number;
  ownerTakeHome: number;
  portfolioValue: number;
  xrpBalance: number;
  xrpPriceUsd: number;
  annualLivingExpenses: number;
  notes: string | null;
};
