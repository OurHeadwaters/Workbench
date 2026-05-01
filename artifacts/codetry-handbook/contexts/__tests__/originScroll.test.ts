import { describe, expect, it } from "vitest";

// ---------------------------------------------------------------------------
// Inline re-implementation of the saveOriginScroll / takeOriginScroll logic
// from ReaderState.tsx so we can unit-test it without a React component tree.
// If the production implementation changes, update this mirror accordingly.
// ---------------------------------------------------------------------------

function makeOriginScrollStore() {
  const map: Record<string, number> = {};

  function saveOriginScroll(chapterId: string, y: number) {
    map[chapterId] = y;
  }

  function takeOriginScroll(chapterId: string): number | null {
    const y = map[chapterId];
    if (y === undefined) return null;
    delete map[chapterId];
    return y;
  }

  return { saveOriginScroll, takeOriginScroll };
}

describe("origin scroll store — cross-chapter back-navigation", () => {
  it("returns the saved scroll Y when taking the origin for a chapter", () => {
    const { saveOriginScroll, takeOriginScroll } = makeOriginScrollStore();
    saveOriginScroll("4-2", 850);
    expect(takeOriginScroll("4-2")).toBe(850);
  });

  it("returns null when no origin was saved for a chapter", () => {
    const { takeOriginScroll } = makeOriginScrollStore();
    expect(takeOriginScroll("5-1")).toBeNull();
  });

  it("consumes the stored value — a second take returns null", () => {
    const { saveOriginScroll, takeOriginScroll } = makeOriginScrollStore();
    saveOriginScroll("4-2", 400);
    takeOriginScroll("4-2"); // first take — consumes
    expect(takeOriginScroll("4-2")).toBeNull(); // second take — empty
  });

  it("an overwrite replaces the previously stored Y", () => {
    const { saveOriginScroll, takeOriginScroll } = makeOriginScrollStore();
    saveOriginScroll("2-3", 100);
    saveOriginScroll("2-3", 999); // reader tapped another link from the same chapter
    expect(takeOriginScroll("2-3")).toBe(999);
  });

  it("stores independent entries for different originating chapters", () => {
    const { saveOriginScroll, takeOriginScroll } = makeOriginScrollStore();
    saveOriginScroll("4-2", 800);
    saveOriginScroll("5-1", 350);
    expect(takeOriginScroll("4-2")).toBe(800);
    expect(takeOriginScroll("5-1")).toBe(350);
  });

  it("consuming one chapter's origin does not affect another chapter's entry", () => {
    const { saveOriginScroll, takeOriginScroll } = makeOriginScrollStore();
    saveOriginScroll("4-2", 800);
    saveOriginScroll("5-1", 350);
    takeOriginScroll("4-2"); // consume 4-2 only
    expect(takeOriginScroll("5-1")).toBe(350); // 5-1 still intact
  });

  it("preserves the §1.7 → Deep Dive → §1.7 round-trip (regression)", () => {
    // Simulates: reader scrolls §1.7 to y=620, taps inline ref to DD chapter,
    // then navigates back to §1.7. Origin scroll for '1-7' should be restored.
    const { saveOriginScroll, takeOriginScroll } = makeOriginScrollStore();
    // onPressRef saves the origin when leaving §1.7
    saveOriginScroll("1-7", 620);
    // When §1.7 mounts again, takeOriginScroll('1-7') provides the restore Y
    const restored = takeOriginScroll("1-7");
    expect(restored).toBe(620);
    // Subsequent render/effect does not re-scroll
    expect(takeOriginScroll("1-7")).toBeNull();
  });

  it("preserves y=0 correctly (reader was at the very top when navigating)", () => {
    const { saveOriginScroll, takeOriginScroll } = makeOriginScrollStore();
    saveOriginScroll("1-1", 0);
    // y=0 must NOT be silently treated as "no entry" — the reader chose to
    // navigate from the top and should be returned to the top.
    const restored = takeOriginScroll("1-1");
    expect(restored).toBe(0);
    expect(restored).not.toBeNull();
  });
});
