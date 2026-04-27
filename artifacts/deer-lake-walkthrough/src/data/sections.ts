/**
 * The walkthrough's section registry. Order is the read order.
 *
 * Each entry carries the section's eyebrow (the mono caption that runs
 * across the top and the bottom chrome), so the chrome doesn't have to
 * dig into each section component to know what to label.
 *
 * The actual section components live next door in `src/sections/` and
 * are wired up in `App.tsx` — keeping them as plain components (not
 * data) means each section can compose its own image, copy, and tap-to-
 * expand details without forcing every section into the same shape.
 */
export type SectionMeta = {
  id: string;
  eyebrow: string;
  /** Used for the recap-screen back-references. */
  shortTitle: string;
};

export const SECTIONS: SectionMeta[] = [
  {
    id: "prologue",
    eyebrow: "Prologue · The eagle answered",
    shortTitle: "The eagle answered",
  },
  {
    id: "what-it-is",
    eyebrow: "What the store is",
    shortTitle: "What the store is",
  },
  {
    id: "why-current-fails",
    eyebrow: "Why the current store fails",
    shortTitle: "Why the current store fails",
  },
  {
    id: "cold-chain",
    eyebrow: "How groceries get here",
    shortTitle: "The cold-chain route",
  },
  {
    id: "who-works",
    eyebrow: "Who works the store",
    shortTitle: "Who works the store",
  },
  {
    id: "first-morning",
    eyebrow: "The first morning",
    shortTitle: "The first morning",
  },
  {
    id: "what-stays",
    eyebrow: "What stays with Deer Lake",
    shortTitle: "What stays with Deer Lake",
  },
  {
    id: "ask",
    eyebrow: "The ask",
    shortTitle: "The ask",
  },
  {
    id: "recap",
    eyebrow: "Carry into the meeting",
    shortTitle: "The whole plan, on one screen",
  },
];
