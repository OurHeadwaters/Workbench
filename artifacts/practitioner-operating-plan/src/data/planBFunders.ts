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
//
// Confidence flag uses the same discriminated union as the rest of
// Plan B (see `planB.ts`): `seed` items name the specific intel that
// would let them flip; `confirmed` items name the file in
// `docs/partnerships/` they were verified against.

import type { Confidence } from "./planB";

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
  confidence: Confidence;
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
    confidence: {
      kind: "seed",
      needs:
        "Status ('opens 05/2026') and the 'follow-on stream' framing both assume the 2026 intake calendar matches recent years. Needs: verification against the LFIF program page on the day this is read, plus any practitioner intel on the prior submission (was it funded? declined with feedback? withdrawn?). Drop into `docs/partnerships/funders.md` under an LFIF heading.",
    },
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
    status: { kind: "open" },
    link: "https://nohfc.ca/en/pages/programs/people-talent-program",
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
      "Intake and eligibility re-confirmed periodically; verify with regional ISC office before submitting.",
    status: { kind: "opens", on: "06/2026" },
    link: "https://www.sac-isc.gc.ca/eng/1596809415775/1596809469296",
    confidence: {
      kind: "seed",
      needs:
        "ICBF's status as an active program (vs. wound-down post-COVID) and the 'opens 06/2026' projection are both unverified. Needs: a current call to the regional ISC office — most important is whether ICBF is still accepting new applications at all, or whether the equivalent envelope has rolled into a successor program. The whole slot may need to be replaced once that's checked.",
    },
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
    confidence: {
      kind: "seed",
      needs:
        "Co-operatives First works prairie-first; their formal coverage of Northwestern Ontario is unclear. Needs: a direct contact at Co-operatives First confirming whether 807 (or a forked second co-op in Northwestern Ontario) is in-scope, and the actual program name (the 'CoopStart-style' framing is the executor's gloss — replace with the real stream name once known).",
    },
  },
];
