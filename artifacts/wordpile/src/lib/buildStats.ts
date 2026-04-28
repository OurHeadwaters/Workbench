/**
 * Persistent per-pile build stats: runs, best placed, best frame count,
 * lifetime cracks, and whether the kid has ever reached "standing." Stored
 * in localStorage so the Build page can show progress across sessions
 * without depending on cloud sync (this is a play surface, not core data).
 *
 * Also handles a one-time migration that archives the old per-pile vote
 * tallies into a single keep-forever record so we can retire the variant
 * switcher without losing what kids picked during the playtest.
 */

export interface BuildStats {
  /** Number of runs that had at least one placement. */
  runs: number;
  /** Highest total placements (frame + trim) reached in a single run. */
  bestPlaced: number;
  /** Most load-bearing frame timbers seated at once. */
  bestFrame: number;
  /** Lifetime count of Avoid words that cracked. */
  crackCount: number;
  /** True once the building has reached the standing threshold here. */
  everStood: boolean;
  /** Wall-clock timestamp of the most recent stat write. */
  updatedAt: number;
}

export const EMPTY_STATS: BuildStats = {
  runs: 0,
  bestPlaced: 0,
  bestFrame: 0,
  crackCount: 0,
  everStood: false,
  updatedAt: 0,
};

const STATS_PREFIX = "wordpile:build-stats:v1:";
const VOTE_PREFIX = "wordpile:build-vote:";
const VOTE_ARCHIVE_KEY = "wordpile:build-vote-archive:v1";
const VOTE_MIGRATED_KEY = "wordpile:build-vote-migrated:v1";

function statsKey(pileId: string) {
  return `${STATS_PREFIX}${pileId}`;
}

export function readStats(pileId: string): BuildStats {
  if (typeof window === "undefined") return { ...EMPTY_STATS };
  try {
    const raw = window.localStorage.getItem(statsKey(pileId));
    if (!raw) return { ...EMPTY_STATS };
    const parsed = JSON.parse(raw) as Partial<BuildStats>;
    return {
      runs: typeof parsed.runs === "number" ? parsed.runs : 0,
      bestPlaced: typeof parsed.bestPlaced === "number" ? parsed.bestPlaced : 0,
      bestFrame: typeof parsed.bestFrame === "number" ? parsed.bestFrame : 0,
      crackCount: typeof parsed.crackCount === "number" ? parsed.crackCount : 0,
      everStood: !!parsed.everStood,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : 0,
    };
  } catch {
    return { ...EMPTY_STATS };
  }
}

export function writeStats(pileId: string, next: BuildStats) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      statsKey(pileId),
      JSON.stringify({ ...next, updatedAt: Date.now() }),
    );
  } catch {
    // Ignore — quota / privacy mode.
  }
}

export function resetStats(pileId: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(statsKey(pileId));
  } catch {
    // Ignore.
  }
}

/**
 * Pure merge: given the lifetime baseline (what we'd written into storage at
 * the start of this run, frozen by the most recent Reset) and the live run
 * counters, return the lifetime stats we should display and persist.
 *
 * Semantics that this helper locks in:
 * - `runs` increments by 1 the moment the kid does anything in the current
 *   run (any frame, trim, or crack). It stays at +1 for the rest of that
 *   run — repeated placements don't keep bumping it.
 * - `crackCount` is the baseline plus per-run cracks; over many resets in a
 *   single session, the lifetime tally is monotonic and sums every crack
 *   the kid has produced (because each Reset folds the current run into the
 *   baseline).
 * - `bestPlaced` and `bestFrame` are session-wide highs.
 * - `everStood` is sticky once true.
 *
 * The caller is responsible for advancing the baseline on Reset (set the
 * baseline to the merged result, then zero the run counters).
 */
export interface RunSnapshot {
  framePlaced: number;
  trimPlaced: number;
  cracks: number;
  standing: boolean;
}

export function mergeRunIntoStats(
  baseline: BuildStats,
  run: RunSnapshot,
): BuildStats {
  const total = run.framePlaced + run.trimPlaced;
  const startedThisRun = total + run.cracks > 0;
  return {
    runs: startedThisRun ? baseline.runs + 1 : baseline.runs,
    bestPlaced: Math.max(baseline.bestPlaced, total),
    bestFrame: Math.max(baseline.bestFrame, run.framePlaced),
    crackCount: baseline.crackCount + run.cracks,
    everStood: baseline.everStood || run.standing,
    updatedAt: baseline.updatedAt,
  };
}

export interface ArchivedPileVotes {
  stacker: number;
  blocks: number;
  planks: number;
  lastChoice?: string;
}

interface ArchivedVotes {
  [pileId: string]: ArchivedPileVotes;
}

/**
 * Read the archived per-pile vote totals captured by `archiveBuildVotes`.
 * Returns null if there's no archive entry for this pile or if the totals
 * sum to zero (i.e. nobody actually voted on this pile, so there's nothing
 * to acknowledge). Safe to call before or after the migration runs.
 */
export function readArchivedVotesForPile(
  pileId: string,
): ArchivedPileVotes | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(VOTE_ARCHIVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ArchivedVotes;
    const entry = parsed[pileId];
    if (!entry) return null;
    const total =
      (typeof entry.stacker === "number" ? entry.stacker : 0) +
      (typeof entry.blocks === "number" ? entry.blocks : 0) +
      (typeof entry.planks === "number" ? entry.planks : 0);
    if (total <= 0) return null;
    return {
      stacker: typeof entry.stacker === "number" ? entry.stacker : 0,
      blocks: typeof entry.blocks === "number" ? entry.blocks : 0,
      planks: typeof entry.planks === "number" ? entry.planks : 0,
      lastChoice:
        typeof entry.lastChoice === "string" ? entry.lastChoice : undefined,
    };
  } catch {
    return null;
  }
}

/** True once the one-time vote-archive migration has been run. */
export function hasMigratedBuildVotes(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VOTE_MIGRATED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * One-time migration that sweeps every `wordpile:build-vote:<pileId>` key
 * into a single `wordpile:build-vote-archive:v1` record and removes the
 * originals. Idempotent — the migration flag prevents repeat runs.
 *
 * Returns the totals we ended up archiving (mostly so tests can assert it
 * actually moved data; runtime callers don't need to look at the result).
 */
export function archiveBuildVotes(): { migrated: number; totals: ArchivedVotes } {
  const result: { migrated: number; totals: ArchivedVotes } = {
    migrated: 0,
    totals: {},
  };
  if (typeof window === "undefined") return result;
  try {
    if (window.localStorage.getItem(VOTE_MIGRATED_KEY) === "1") {
      const existing = window.localStorage.getItem(VOTE_ARCHIVE_KEY);
      if (existing) result.totals = JSON.parse(existing) as ArchivedVotes;
      return result;
    }
    const archive: ArchivedVotes = {};
    const existing = window.localStorage.getItem(VOTE_ARCHIVE_KEY);
    if (existing) {
      try {
        Object.assign(archive, JSON.parse(existing) as ArchivedVotes);
      } catch {
        // Corrupted archive — overwrite cleanly below.
      }
    }
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(VOTE_PREFIX)) continue;
      toRemove.push(key);
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw) as Partial<ArchivedVotes[string]>;
        const pileId = key.slice(VOTE_PREFIX.length);
        archive[pileId] = {
          stacker: typeof parsed.stacker === "number" ? parsed.stacker : 0,
          blocks: typeof parsed.blocks === "number" ? parsed.blocks : 0,
          planks: typeof parsed.planks === "number" ? parsed.planks : 0,
          lastChoice:
            typeof parsed.lastChoice === "string" ? parsed.lastChoice : undefined,
        };
        result.migrated += 1;
      } catch {
        // Skip malformed individual entries.
      }
    }
    for (const k of toRemove) {
      try {
        window.localStorage.removeItem(k);
      } catch {
        // Ignore.
      }
    }
    window.localStorage.setItem(VOTE_ARCHIVE_KEY, JSON.stringify(archive));
    window.localStorage.setItem(VOTE_MIGRATED_KEY, "1");
    result.totals = archive;
  } catch {
    // Ignore — best-effort migration.
  }
  return result;
}
