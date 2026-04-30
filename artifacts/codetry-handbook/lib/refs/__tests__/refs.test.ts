import { describe, expect, it } from "vitest";

import { CHAPTERS } from "@/data/handbook";
import {
  extractChapterStrings,
  findDeadReferences,
  formatDeadReferences,
} from "@/lib/refs/scan";

describe("inline §X.Y cross-references", () => {
  it("only point at chapters that exist", () => {
    const dead = findDeadReferences(CHAPTERS);
    if (dead.length > 0) {
      throw new Error(
        `Found ${dead.length} dead chapter cross-reference(s) — a chapter was likely renumbered without updating its inline §X.Y pointers:\n${formatDeadReferences(dead)}`,
      );
    }
    expect(dead).toEqual([]);
  });

  it("scans every chapter for at least one body string", () => {
    // Sanity check: if the extraction ever silently stops covering
    // chapters, the dead-reference test above would pass vacuously.
    // This guards against that regression.
    for (const chapter of CHAPTERS) {
      const strings = extractChapterStrings(chapter);
      expect(
        strings.length,
        `chapter ${chapter.id} (${chapter.title}) has no extractable body strings`,
      ).toBeGreaterThan(0);
    }
  });

  it("catches a fabricated dead reference", () => {
    // Confirms the validator would actually fail if a chapter were
    // renumbered without updating its inline references.
    const fabricated = [
      {
        ...CHAPTERS[0],
        blocks: [
          {
            kind: "para" as const,
            text: "This points at §99.99 which does not exist.",
          },
        ],
      },
    ];
    const dead = findDeadReferences(fabricated);
    expect(dead).toHaveLength(1);
    expect(dead[0].reference).toBe("§99.99");
    expect(dead[0].targetId).toBe("99-99");
  });
});
