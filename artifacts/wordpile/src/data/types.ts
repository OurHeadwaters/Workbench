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

export interface CommunityPile {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  words: WordEntry[];
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
