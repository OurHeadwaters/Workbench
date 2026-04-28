/**
 * Shared bucket-behavior rules used by all three Build-game prototypes.
 *
 * The metaphor: every word is a 2x4. Load-bearing words are solid frame
 * timber; Interior words are decorative trim; Avoid words are rotten and
 * crack on contact. Unsorted words are "untreated lumber" — they place
 * loosely (the kid's reaction becomes the test) and trigger a one-tap
 * prompt to file them in a real bucket.
 */
import type { Bucket, WordEntry } from "@/data/types";

export type Behavior = "solid" | "decorative" | "fails" | "untested";

export function bucketBehavior(bucket: Bucket): Behavior {
  if (bucket === "load") return "solid";
  if (bucket === "interior") return "decorative";
  if (bucket === "avoid") return "fails";
  return "untested";
}

export function behaviorBlurb(b: Behavior): string {
  if (b === "solid") return "Holds weight.";
  if (b === "decorative") return "Sits on top — pretty, not structural.";
  if (b === "fails") return "Cracks. Won't hold.";
  return "Untreated. Place it and see what it does.";
}

/**
 * Color used for chrome (border, glow, fill) for a given bucket.
 * These mirror the existing wordpile palette so the game inherits the
 * workshop look without introducing new colors.
 */
export function bucketAccent(bucket: Bucket): string {
  if (bucket === "load") return "var(--color-load)";
  if (bucket === "interior") return "var(--color-interior)";
  if (bucket === "avoid") return "var(--color-avoid)";
  return "var(--color-unsorted)";
}

/**
 * Hex equivalents for the canvas-based prototype (Falling planks). Canvas
 * APIs can't read CSS variables, so we keep an authoritative copy here
 * matching `index.css`.
 */
export const BUCKET_HEX: Record<Bucket, string> = {
  load: "#1f3d2e",
  interior: "#6b7665",
  avoid: "#7a2e2e",
  unsorted: "#957d50",
};

export const PAPER_HEX = "#ede4d2";
export const CREAM_HEX = "#f4ede0";
export const SAND_HEX = "#c8bfa7";
export const INK_HEX = "#1f3d2e";
export const RULE_HEX = "#d4ccb6";

/**
 * Rough "structural" goal shared across prototypes: at least this many
 * load-bearing pieces successfully placed and the building counts as
 * "standing." Three is enough to feel like a wall + roof; small enough
 * that even a tiny pile reaches it.
 */
export const STANDING_THRESHOLD = 3;

export interface PlacementVerdict {
  /** What the prototype decided this word's behavior was. */
  behavior: Behavior;
  /** True if it counted toward the structural goal. */
  structural: boolean;
}

/**
 * Helper to short-format a word for a plank/block face. Long words wrap
 * weirdly on small blocks so we cap them with an ellipsis — the side tray
 * still shows the full word.
 */
export function planktext(w: WordEntry, max = 14): string {
  if (w.word.length <= max) return w.word;
  return w.word.slice(0, max - 1) + "…";
}
