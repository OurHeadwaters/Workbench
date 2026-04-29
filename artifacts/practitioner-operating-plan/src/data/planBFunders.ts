// Plan B · funder slots
//
// Static seed for the "Top 5 funder slots" section on /plan-b. The page
// imports the single named export `planBFunders` below; swapping this
// file's body for a feed from the grants-finder artifact is a one-file
// change — the page does not import any of these types or constants
// from anywhere else.
//
// FUTURE INTEGRATION POINT (named, not dated): when the grants-finder
// artifact exposes a stable feed of program slots in the same shape, the
// only edit required to switch over is replacing the body of
// `planBFunders` (and optionally the type) with an import from that
// feed. Do not add behaviour to this file — it is a data seam.

export type FunderStatus =
  | { kind: "open"; closesOn?: string }
  | { kind: "opens"; on: string }
  | { kind: "closed"; reopens?: string };

export type FunderSlot = {
  /** Program name as the funder lists it. */
  programName: string;
  /** Funder / agency name. */
  funder: string;
  /** Why this fits Headwaters' Plan B specifically — one sentence. */
  fitRationale: string;
  /** Application window in plain English (e.g. "intake on rolling basis"). */
  applicationWindow: string;
  /** Status pill — open / opens MM/YYYY / closed. */
  status: FunderStatus;
  /** Optional public program URL for reference. */
  link?: string;
  /**
   * "seed" → placeholder written from project context, treat as a
   * starting point. "confirmed" → practitioner has signed off the line
   * against current funder pages or intel in docs/partnerships/.
   */
  confidence: "seed" | "confirmed";
};

export const planBFunders: FunderSlot[] = [
  {
    programName: "Local Food Infrastructure Fund (LFIF) — follow-on stream",
    funder: "Agriculture and Agri-Food Canada",
    fitRationale:
      "807 Co-op infrastructure (cold storage, hub equipment, distribution rigging) is exactly the asset class LFIF was built to fund; a follow-on application leans on Headwaters' existing relationship and prior submission record.",
    applicationWindow:
      "Intake windows announced annually; most recent rounds opened spring → summer.",
    status: { kind: "opens", on: "05/2026" },
    link: "https://agriculture.canada.ca/en/programs/local-food-infrastructure-fund",
    confidence: "seed",
  },
  {
    programName: "Community Economic Development & Diversification (CEDP)",
    funder: "FedNor (Innovation, Science and Economic Development Canada)",
    fitRationale:
      "CEDP funds community-led economic infrastructure in Northern Ontario — the cross-reserve store-in-a-box template and Dryden hub fall squarely inside the program's eligibility envelope, and Northwestern Ontario projects have a strong recent track record.",
    applicationWindow:
      "Continuous intake; advisor pre-screen recommended before submission.",
    status: { kind: "open" },
    link: "https://fednor.canada.ca/en/community-economic-development-and-diversification",
    confidence: "seed",
  },
  {
    programName: "People & Talent stream",
    funder: "Northern Ontario Heritage Fund Corporation (NOHFC)",
    fitRationale:
      "Funds wage subsidies for new hires inside Northern Ontario — directly underwrites the Operations Manager / Bookkeeper / CD Associate roles in the cost basis if Deer Lake doesn't carry them, and keeps the team intact through Plan B's outreach window.",
    applicationWindow:
      "Continuous intake; decisions typically within ~12 weeks of complete application.",
    status: { kind: "open" },
    link: "https://nohfc.ca/en/pages/programs/people-talent-program",
    confidence: "seed",
  },
  {
    programName: "Indigenous Community Business Fund (ICBF)",
    funder: "Indigenous Services Canada",
    fitRationale:
      "Designed for First Nation–owned or –operated businesses; the cross-reserve corridor model and a co-pitched store-in-a-box with a band partner can apply jointly, with the band as proponent and Headwaters as service partner.",
    applicationWindow:
      "Intake and eligibility re-confirmed periodically; verify with regional ISC office before submitting.",
    status: { kind: "opens", on: "06/2026" },
    link: "https://www.sac-isc.gc.ca/eng/1596809415775/1596809469296",
    confidence: "seed",
  },
  {
    programName: "Co-operative Development Program (CoopStart-style stream)",
    funder: "Co-operatives First (with prairie / northern partners)",
    fitRationale:
      "Funds early-stage co-operative development — directly applicable to the 807 Co-op infrastructure layer and to a second co-op forking the same template (the multi-tenant seam already exists in the Z3 codebase).",
    applicationWindow:
      "Rolling cohorts; check current cohort calendar before drafting.",
    status: { kind: "open" },
    link: "https://cooperativesfirst.com/",
    confidence: "seed",
  },
];
