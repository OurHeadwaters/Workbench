import { describe, expect, it } from "vitest";

import { CHAPTERS, type Block } from "@/data/handbook";

/**
 * Off-vocabulary terms that must never appear in chapter titles or
 * subhead labels.  Each entry records the banned phrase and the
 * approved replacement so that the failure message is actionable.
 *
 * History: Task #701 (vocabulary audit) caught "tempo test" and
 * "context test" drifting back into subhead labels — the canonical
 * terms are "both-states test" and "both-sides test".  Task #702
 * installs this mechanical witness so the same drift cannot re-enter
 * without a visible CI failure.
 */
const OFF_VOCABULARY: Array<{ pattern: RegExp; use: string }> = [
  {
    pattern: /\btempo test\b/i,
    use: '"both-states test"',
  },
  {
    pattern: /\bcontext test\b/i,
    use: '"both-sides test"',
  },
  {
    pattern: /\btempos\b/i,
    use: '"states" (resting / activated)',
  },
  {
    pattern: /\bmodes\b/i,
    use: '"states" or the specific named state',
  },
  {
    pattern: /\bphases\b/i,
    use: '"states" or the specific named moment',
  },
];

function subheadTexts(blocks: Block[]): string[] {
  return blocks.flatMap((b) => (b.kind === "subhead" ? [b.text] : []));
}

describe("handbook vocabulary guard", () => {
  const chapterTitles = CHAPTERS.map((ch) => ({
    id: ch.id,
    number: ch.number,
    text: ch.title,
  }));

  const subheads = CHAPTERS.flatMap((ch) =>
    subheadTexts(ch.blocks).map((text) => ({
      id: ch.id,
      number: ch.number,
      text,
    })),
  );

  for (const { pattern, use } of OFF_VOCABULARY) {
    describe(`off-vocabulary: ${pattern}`, () => {
      it("does not appear in any chapter title", () => {
        const hits = chapterTitles.filter((t) => pattern.test(t.text));
        expect(
          hits,
          `Chapter title(s) contain off-vocabulary term ${pattern} — use ${use} instead:\n` +
            hits.map((h) => `  §${h.number} "${h.text}"`).join("\n"),
        ).toHaveLength(0);
      });

      it("does not appear in any subhead label", () => {
        const hits = subheads.filter((s) => pattern.test(s.text));
        expect(
          hits,
          `Subhead(s) in chapter(s) contain off-vocabulary term ${pattern} — use ${use} instead:\n` +
            hits.map((h) => `  §${h.number} subhead: "${h.text}"`).join("\n"),
        ).toHaveLength(0);
      });
    });
  }
});
