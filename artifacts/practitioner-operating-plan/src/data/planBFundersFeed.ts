// Plan B · live grants feed
//
// This module models the "currently-open programs" feed that the
// grants-finder artifact is intended to expose. Each entry describes
// a funding program in terms of its dated application windows (not a
// pre-baked status pill). Status — open / opens [date] / closed — is
// derived in `planBFunders.ts` against the current date so that
// slots auto-flip as windows roll over without anyone editing data.
//
// FUTURE INTEGRATION POINT (named, not dated): when the grants-finder
// artifact ships a stable feed in this same shape, replace the body
// of `liveFunderPrograms` with an import from that feed. The derive
// + fallback wrapper in `planBFunders.ts` does not need to change.

import type { Confidence } from "./planB";

export type FunderProgramWindow = {
  /** ISO date (YYYY-MM-DD) the application window opens. */
  opensOn: string;
  /** ISO date (YYYY-MM-DD) the window closes. Omit for "stays open". */
  closesOn?: string;
};

export type FunderProgram = {
  /** Program name as the funder lists it. */
  programName: string;
  /** Funder / agency name. */
  funder: string;
  /** Why this fits Headwaters' Plan B specifically — one sentence. */
  fitRationale: string;
  /** Application window in plain English (e.g. "intake on rolling basis"). */
  applicationWindow: string;
  /** Optional public program URL for reference. */
  link?: string;
  /**
   * True when intake is continuous / rolling and there is no fixed
   * window. Status will read "Open" until the program is paused.
   */
  rolling?: boolean;
  /**
   * Known dated windows (past, present, and announced future). Used
   * to derive an "Open / Opens MM/YYYY / Closed" status against the
   * current date.
   */
  windows?: FunderProgramWindow[];
  /** Lower number = higher priority for the top-5 slot ordering. */
  priority: number;
  /**
   * Same discriminated union as the rest of Plan B: `seed` items
   * name (in `needs`) the specific intel that would let them flip;
   * `confirmed` items name (in `source`) the file in
   * `docs/partnerships/` they were verified against.
   */
  confidence: Confidence;
};

/**
 * Live program data. In production this would be replaced by an
 * import from the grants-finder artifact's feed. Until then, the
 * shape and date math are the same so the swap is body-only.
 */
export const liveFunderPrograms: FunderProgram[] = [
  {
    programName: "Local Food Infrastructure Fund (LFIF) — follow-on stream",
    funder: "Agriculture and Agri-Food Canada",
    fitRationale:
      "807 Co-op infrastructure (cold storage, hub equipment, distribution rigging) is exactly the asset class LFIF was built to fund; a follow-on application leans on Headwaters' existing relationship and prior submission record.",
    applicationWindow:
      "Annual intake window; most recent rounds opened spring → summer.",
    link: "https://agriculture.canada.ca/en/programs/local-food-infrastructure-fund",
    windows: [
      { opensOn: "2026-05-15", closesOn: "2026-07-30" },
      { opensOn: "2027-04-15", closesOn: "2027-07-15" },
    ],
    priority: 1,
    confidence: {
      kind: "seed",
      needs:
        "Window dates (opensOn 2026-05-15 / closesOn 2026-07-30) and the 'follow-on stream' framing both assume the 2026 intake calendar matches recent years. Needs: verification against the LFIF program page on the day this is read, plus any practitioner intel on the prior submission (was it funded? declined with feedback? withdrawn?). Drop into `docs/partnerships/funders.md` under an LFIF heading.",
    },
  },
  {
    programName: "Community Economic Development & Diversification (CEDP)",
    funder: "FedNor (Innovation, Science and Economic Development Canada)",
    fitRationale:
      "CEDP funds community-led economic infrastructure in Northern Ontario — the cross-reserve store-in-a-box template and Dryden hub fall squarely inside the program's eligibility envelope, and Northwestern Ontario projects have a strong recent track record.",
    applicationWindow:
      "Continuous intake; advisor pre-screen recommended before submission.",
    link: "https://fednor.canada.ca/en/community-economic-development-and-diversification",
    rolling: true,
    priority: 2,
    confidence: {
      kind: "seed",
      needs:
        "Continuous-intake claim and 'strong recent track record' are general program facts, not Headwaters-specific intel. Needs: name of the FedNor advisor for Northwestern Ontario (the pre-screen call is the actual first step, not the application), plus any prior FedNor relationship Headwaters has on file. Note in `docs/partnerships/funders.md` (FedNor heading).",
    },
  },
  {
    programName: "People & Talent stream",
    funder: "Northern Ontario Heritage Fund Corporation (NOHFC)",
    fitRationale:
      "Funds wage subsidies for new hires inside Northern Ontario — directly underwrites the Operations Manager / Bookkeeper / CD Associate roles in the cost basis if Deer Lake doesn't carry them, and keeps the team intact through Plan B's outreach window.",
    applicationWindow:
      "Continuous intake; decisions typically within ~12 weeks of complete application.",
    link: "https://nohfc.ca/en/pages/programs/people-talent-program",
    rolling: true,
    priority: 3,
    confidence: {
      kind: "seed",
      needs:
        "Stream eligibility for Headwaters specifically (private-sector employer in Northern Ontario hiring into specified roles) needs verification — NOHFC's eligible employer rules are stricter than 'located in the North'. Needs: a yes/no from NOHFC on whether Headwaters qualifies as the applicant employer, or whether the application has to come through the 807 Co-op as employer of record. Drop the answer into `docs/partnerships/funders.md` (NOHFC heading).",
    },
  },
  {
    programName: "Indigenous Community Business Fund (ICBF)",
    funder: "Indigenous Services Canada",
    fitRationale:
      "Designed for First Nation–owned or –operated businesses; the cross-reserve corridor model and a co-pitched store-in-a-box with a band partner can apply jointly, with the band as proponent and Headwaters as service partner.",
    applicationWindow:
      "Intake re-confirmed periodically; verify with regional ISC office before submitting.",
    link: "https://www.sac-isc.gc.ca/eng/1596809415775/1596809469296",
    windows: [
      { opensOn: "2026-06-01", closesOn: "2026-09-30" },
      { opensOn: "2027-06-01", closesOn: "2027-09-30" },
    ],
    priority: 4,
    confidence: {
      kind: "seed",
      needs:
        "ICBF's status as an active program (vs. wound-down post-COVID) and the projected 2026/2027 intake windows are both unverified. Needs: a current call to the regional ISC office — most important is whether ICBF is still accepting new applications at all, or whether the equivalent envelope has rolled into a successor program. The whole entry (windows included) may need to be replaced once that's checked.",
    },
  },
  {
    programName: "Co-operative Development Program (CoopStart-style stream)",
    funder: "Co-operatives First (with prairie / northern partners)",
    fitRationale:
      "Funds early-stage co-operative development — directly applicable to the 807 Co-op infrastructure layer and to a second co-op forking the same template (the multi-tenant seam already exists in the Z3 codebase).",
    applicationWindow:
      "Rolling cohorts; check current cohort calendar before drafting.",
    link: "https://cooperativesfirst.com/",
    windows: [
      { opensOn: "2026-04-01", closesOn: "2026-05-31" },
      { opensOn: "2026-09-01", closesOn: "2026-10-31" },
      { opensOn: "2027-03-01", closesOn: "2027-04-30" },
    ],
    priority: 5,
    confidence: {
      kind: "seed",
      needs:
        "Co-operatives First works prairie-first; their formal coverage of Northwestern Ontario is unclear. Needs: a direct contact at Co-operatives First confirming whether 807 (or a forked second co-op in Northwestern Ontario) is in-scope, and the actual program name (the 'CoopStart-style' framing is the executor's gloss — replace with the real stream name once known).",
    },
  },
];

/**
 * ISO date the live feed snapshot was last refreshed. When the
 * grants-finder artifact is wired in, this should come from the
 * feed's metadata, not from a hand-edited string.
 */
export const liveFundersGeneratedAt: string = "2026-04-29";
