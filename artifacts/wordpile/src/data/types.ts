export type Bucket = "unsorted" | "load" | "interior" | "avoid";

export const BUCKETS: Bucket[] = ["unsorted", "load", "interior", "avoid"];

export const BUCKET_LABELS: Record<Bucket, string> = {
  unsorted: "Unsorted",
  load: "Load-bearing",
  interior: "Interior design",
  avoid: "Avoid",
};

export const BUCKET_BLURB: Record<Bucket, string> = {
  unsorted: "Logged, not yet sorted.",
  load: "Structural — don't substitute.",
  interior: "Flavor / style — swappable.",
  avoid: "Reads wrong here. Use the safer alternative.",
};

export interface WordEntry {
  id: string;
  word: string;
  note: string;
  bucket: Bucket;
  saferAlternative: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * The three Build-page prototypes a practitioner can vote on after they've
 * tried each one. Kept in sync with the `Variant` type in BuildPage.
 */
export type BuildVariant = "stacker" | "blocks" | "planks";

/**
 * Cumulative tally of Build-page votes for a single pile, plus the most
 * recent choice this user made. Lives on the pile so it cloud-syncs
 * alongside words instead of getting stranded in per-device localStorage.
 *
 * `updatedAt` is the timestamp the most recent vote was recorded; /sync
 * uses it as the LWW tiebreaker so a stale device can't clobber newer
 * votes from another device.
 */
export interface BuildVotes {
  stacker: number;
  blocks: number;
  planks: number;
  lastChoice: BuildVariant | null;
  updatedAt: number;
}

export const EMPTY_BUILD_VOTES: BuildVotes = {
  stacker: 0,
  blocks: 0,
  planks: 0,
  lastChoice: null,
  updatedAt: 0,
};

export interface CommunityPile {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  words: WordEntry[];
  buildVotes: BuildVotes;
}

export interface WordpileData {
  version: 1;
  piles: Record<string, CommunityPile>;
  pileOrder: string[];
  selectedPileId: string | null;
}

export const EMPTY_DATA: WordpileData = {
  version: 1,
  piles: {},
  pileOrder: [],
  selectedPileId: null,
};

export interface PileExportWord {
  word: string;
  bucket: Bucket;
  note: string;
  saferAlternative: string;
}

export interface PileExportPayload {
  name: string;
  words: PileExportWord[];
  draft?: string;
}

export interface PileExport {
  format: "wordpile-export";
  formatVersion: 1;
  exportedAt: number;
  pile: PileExportPayload;
}

export interface PileBundleExport {
  format: "wordpile-bundle";
  formatVersion: 1;
  exportedAt: number;
  piles: PileExportPayload[];
}

export type AnyPileImport =
  | { kind: "pile"; payload: PileExport }
  | { kind: "bundle"; payload: PileBundleExport };
