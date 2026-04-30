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
    expect(dead[0].targetId).toBe("99.99");
  });

  it("catches fabricated dead back-matter references", () => {
    // Back-matter chapters (Deep Dives, Field Ledger) carry alphabetic
    // chapter numbers like DD.1 and FL.10. The validator must catch
    // dead refs to those too — otherwise a renumber inside back-matter
    // would silently degrade to plain text in the renderer.
    const fabricated = [
      {
        ...CHAPTERS[0],
        blocks: [
          {
            kind: "para" as const,
            text: "These point at §DD.99 and §FL.99 which do not exist.",
          },
        ],
      },
    ];
    const dead = findDeadReferences(fabricated);
    expect(dead.map((d) => d.reference).sort()).toEqual(["§DD.99", "§FL.99"]);
  });

  it("recognises real back-matter references as live", () => {
    // Sanity check: §DD.1 and §FL.1 are real chapter numbers in the
    // current handbook, so the validator (mirroring the renderer)
    // must treat them as live, not dead. We splice a synthetic chapter
    // into the real CHAPTERS list so the lookup map still resolves
    // back-matter numbers.
    const probe = {
      ...CHAPTERS[0],
      id: "test-probe",
      number: "0.0",
      blocks: [
        {
          kind: "para" as const,
          text: "These point at §DD.1 and §FL.1 which exist.",
        },
      ],
    };
    const dead = findDeadReferences([probe, ...CHAPTERS]);
    const probeRefs = dead.filter((d) => d.chapterId === "test-probe");
    expect(probeRefs).toEqual([]);
  });
});
