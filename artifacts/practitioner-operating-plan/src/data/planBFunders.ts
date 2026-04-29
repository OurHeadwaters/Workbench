// Single named export consumed by /plan-b ("Top 5 funder slots").
// This file is the integration seam: it pulls the live program list
// from `planBFundersFeed.ts` (the slot a future grants-finder
// artifact would slide into) and derives the open / opens [date] /
// closed status against the current date so slots auto-flip as
// windows roll over.
//
// Graceful degradation: if the feed is empty or throws, this file
// falls back to a small built-in seed so the page never goes dark.
// `planBFundersSource` lets the page tell the reader which they're
// looking at.
//
// Confidence flag uses the same discriminated union as the rest of
// Plan B (see `planB.ts`): `seed` items name, in `needs`, the
// specific intel that would let them flip; `confirmed` items name,
// in `source`, the file in `docs/partnerships/` they were verified
// against.

import type { Confidence } from "./planB";
import {
  liveFunderPrograms,
  liveFundersGeneratedAt,
  type FunderProgram,
  type FunderProgramWindow,
} from "./planBFundersFeed";

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

export type FunderSource =
  | { kind: "live"; asOf: string; count: number }
  | { kind: "fallback"; reason: "empty" | "error" };

/** Built-in seed used only when the live feed is empty or throws. */
const seedFallback: FunderSlot[] = [
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

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function todayIso(now: Date): string {
  // Use UTC to avoid local-timezone drift on a static page that
  // gets viewed from anywhere.
  return now.toISOString().slice(0, 10);
}

function formatMonthYear(iso: string): string {
  const [y, m] = iso.split("-");
  return `${m}/${y}`;
}

/**
 * Derive an Open / Opens MM/YYYY / Closed pill from a program's
 * dated windows against `now`. Exported so the unit tests can
 * exercise the open/opens/closed boundaries directly.
 */
export function deriveFunderStatus(
  program: Pick<FunderProgram, "rolling" | "windows">,
  now: Date,
): FunderStatus {
  if (program.rolling) return { kind: "open" };

  const windows = (program.windows ?? []).filter(
    (w): w is FunderProgramWindow =>
      ISO_DATE_RE.test(w.opensOn) &&
      (w.closesOn === undefined || ISO_DATE_RE.test(w.closesOn)),
  );
  if (windows.length === 0) return { kind: "open" };

  const today = todayIso(now);

  const openNow = windows.find(
    (w) => w.opensOn <= today && (!w.closesOn || w.closesOn >= today),
  );
  if (openNow) {
    return openNow.closesOn
      ? { kind: "open", closesOn: formatMonthYear(openNow.closesOn) }
      : { kind: "open" };
  }

  const future = windows
    .filter((w) => w.opensOn > today)
    .sort((a, b) => a.opensOn.localeCompare(b.opensOn))[0];
  if (future) return { kind: "opens", on: formatMonthYear(future.opensOn) };

  // All known windows have closed and no future window is announced.
  return { kind: "closed" };
}

function programToSlot(program: FunderProgram, now: Date): FunderSlot {
  return {
    programName: program.programName,
    funder: program.funder,
    fitRationale: program.fitRationale,
    applicationWindow: program.applicationWindow,
    status: deriveFunderStatus(program, now),
    link: program.link,
    confidence: program.confidence,
  };
}

/**
 * Build the top-5 funder slots from the live feed at `now`. Returns
 * `null` when the feed is missing/empty so the caller can fall back.
 * Exported for tests.
 */
export function buildLiveFunderSlots(
  programs: readonly FunderProgram[],
  now: Date,
): FunderSlot[] | null {
  if (!Array.isArray(programs) || programs.length === 0) return null;
  return [...programs]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5)
    .map((p) => programToSlot(p, now));
}

function resolveFunders(now: Date): {
  slots: FunderSlot[];
  source: FunderSource;
  asOf: string | null;
} {
  try {
    const live = buildLiveFunderSlots(liveFunderPrograms, now);
    if (live && live.length > 0) {
      return {
        slots: live,
        source: { kind: "live", asOf: liveFundersGeneratedAt, count: live.length },
        asOf: liveFundersGeneratedAt,
      };
    }
    return {
      slots: seedFallback,
      source: { kind: "fallback", reason: "empty" },
      asOf: null,
    };
  } catch {
    return {
      slots: seedFallback,
      source: { kind: "fallback", reason: "error" },
      asOf: null,
    };
  }
}

const resolved = resolveFunders(new Date());

/** Top-5 funder slots rendered by /plan-b. */
export const planBFunders: FunderSlot[] = resolved.slots;

/** Tells the page whether it's looking at live data or the seed fallback. */
export const planBFundersSource: FunderSource = resolved.source;
