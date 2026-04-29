import { describe, it, expect } from "vitest";
import {
  WORKED_EXAMPLES,
  checkWorkedExampleAlignment,
} from "../CodetryDisciplinePage";
import { RENAME_MAP } from "@/lib/renameMap";

describe("CodetryDisciplinePage worked examples", () => {
  it("references row numbers that exist in the live RENAME_MAP", () => {
    const liveRowNums = new Set(RENAME_MAP.map((r) => r.num));
    for (const ex of WORKED_EXAMPLES) {
      expect(liveRowNums.has(ex.row)).toBe(true);
    }
  });

  it("each example's expectedDriftSymbol is still present on its row", () => {
    for (const ex of WORKED_EXAMPLES) {
      const row = RENAME_MAP.find((r) => r.num === ex.row);
      expect(row).toBeDefined();
      expect(row!.drift).toContain(ex.expectedDriftSymbol);
    }
  });

  it("checkWorkedExampleAlignment returns null when the example is in sync", () => {
    for (const ex of WORKED_EXAMPLES) {
      expect(checkWorkedExampleAlignment(ex)).toBeNull();
    }
  });

  it("checkWorkedExampleAlignment returns a warning when the row is missing", () => {
    const stale = { ...WORKED_EXAMPLES[0], row: 999 };
    const warning = checkWorkedExampleAlignment(stale);
    expect(warning).toMatch(/no longer in the rename map/);
  });

  it("checkWorkedExampleAlignment returns a warning when the drift symbol changes", () => {
    const wrong = { ...WORKED_EXAMPLES[0], expectedDriftSymbol: "G" as const };
    const warning = checkWorkedExampleAlignment(wrong);
    if (
      RENAME_MAP.find((r) => r.num === WORKED_EXAMPLES[0].row)?.drift.includes(
        "G",
      )
    ) {
      expect(warning).toBeNull();
    } else {
      expect(warning).toMatch(/no longer carries/);
    }
  });
});
