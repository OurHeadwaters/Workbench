import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseRenameMap, parseInline } from "../renameMap";

const SAMPLE = `# Rename map

Some prose above the table.

| # | Term | Where it appears | Drift | Proposed replacement | Second-order effects | Status |
|---|------|------------------|-------|----------------------|----------------------|--------|
| 1 | **Bucket** | contracts page | D | Streams (top) + Bucket (sub) | Header tile + carousel | proposed |
| 2 | KPI | every page | U, G | HeadlineNumber | ~6 imports | applied |
| 3 | Salts | index | — | (kept) | none | rejected |
| 4 | Foo | here | A | Bar | none | weird-status |

Some prose after the table.
`;

describe("parseRenameMap", () => {
  it("extracts every numbered row from the table", () => {
    const rows = parseRenameMap(SAMPLE);
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.num)).toEqual([1, 2, 3, 4]);
  });

  it("preserves raw markdown in cells (so inline formatting can be re-parsed downstream)", () => {
    const rows = parseRenameMap(SAMPLE);
    expect(rows[0].term).toBe("**Bucket**");
  });

  it("collects multi-symbol drift into an array of single letters", () => {
    const rows = parseRenameMap(SAMPLE);
    expect(rows[1].drift).toEqual(["U", "G"]);
  });

  it("treats an em-dash drift cell as no drift", () => {
    const rows = parseRenameMap(SAMPLE);
    expect(rows[2].drift).toEqual([]);
  });

  it("maps known status words case-insensitively", () => {
    const rows = parseRenameMap(SAMPLE);
    expect(rows[0].status).toBe("proposed");
    expect(rows[1].status).toBe("applied");
    expect(rows[2].status).toBe("rejected");
  });

  describe("unknown status fallback", () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it("falls back to 'proposed' for unknown status words", () => {
      const rows = parseRenameMap(SAMPLE);
      expect(rows[3].status).toBe("proposed");
    });

    it("warns once with the offending status and row number", () => {
      parseRenameMap(SAMPLE);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      const message = String(warnSpy.mock.calls[0][0]);
      expect(message).toContain("weird-status");
      expect(message).toContain("row 4");
    });
  });

  it("returns an empty array when the markdown contains no recognisable table", () => {
    expect(parseRenameMap("just prose, no table")).toEqual([]);
  });
});

describe("parseInline", () => {
  it("returns plain text when there is no markup", () => {
    expect(parseInline("hello world")).toEqual([
      { kind: "text", text: "hello world" },
    ]);
  });

  it("parses bold, italic, and code segments together in order", () => {
    const segs = parseInline("a **b** c *d* e `f` g");
    expect(segs).toEqual([
      { kind: "text", text: "a " },
      { kind: "bold", text: "b" },
      { kind: "text", text: " c " },
      { kind: "italic", text: "d" },
      { kind: "text", text: " e " },
      { kind: "code", text: "f" },
      { kind: "text", text: " g" },
    ]);
  });

  it("treats unclosed markers as plain text characters", () => {
    const segs = parseInline("trailing *star");
    expect(segs).toEqual([{ kind: "text", text: "trailing *star" }]);
  });
});
