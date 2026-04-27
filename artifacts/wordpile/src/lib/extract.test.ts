import { describe, it, expect } from "vitest";
import { tokenizeDraft, extractCandidates } from "./extract";

describe("tokenizeDraft", () => {
  it("returns an empty list for an empty string", () => {
    expect(tokenizeDraft("")).toEqual([]);
  });

  it("emits a single word segment with preserved casing", () => {
    const segments = tokenizeDraft("Bannock");
    expect(segments).toEqual([
      { kind: "word", text: "Bannock", lower: "bannock" },
    ]);
  });

  it("alternates word and gap segments around whitespace and punctuation", () => {
    const segments = tokenizeDraft("Hello, world!");
    expect(segments).toEqual([
      { kind: "word", text: "Hello", lower: "hello" },
      { kind: "gap", text: ", " },
      { kind: "word", text: "world", lower: "world" },
      { kind: "gap", text: "!" },
    ]);
  });

  it("treats punctuation-only text as a single gap segment", () => {
    expect(tokenizeDraft("   ...   ")).toEqual([
      { kind: "gap", text: "   ...   " },
    ]);
  });

  it("captures a leading gap when the text starts with punctuation", () => {
    const segments = tokenizeDraft("  foo bar");
    expect(segments[0]).toEqual({ kind: "gap", text: "  " });
    expect(segments[1]).toEqual({ kind: "word", text: "foo", lower: "foo" });
  });

  it("preserves internal apostrophes and hyphens inside word segments", () => {
    const segments = tokenizeDraft("don't co-op");
    expect(segments.filter((s) => s.kind === "word")).toEqual([
      { kind: "word", text: "don't", lower: "don't" },
      { kind: "word", text: "co-op", lower: "co-op" },
    ]);
  });

  it("rejoins to the original input when concatenating segment text", () => {
    const input = "  Bannock, fry-bread!  Don't forget.\n  ";
    const rejoined = tokenizeDraft(input)
      .map((s) => s.text)
      .join("");
    expect(rejoined).toBe(input);
  });

  it("treats digits as gaps, not words", () => {
    const segments = tokenizeDraft("buy 3 fish");
    expect(segments.map((s) => s.kind)).toEqual([
      "word",
      "gap",
      "word",
    ]);
    expect(segments[1]).toEqual({ kind: "gap", text: " 3 " });
  });
});

describe("extractCandidates", () => {
  it("filters out stopwords, short tokens, digits, and already-filed words", () => {
    const text = "the bannock and the fish are good 12 a";
    const filed = new Set<string>(["fish"]);
    const result = extractCandidates(text, filed);
    const words = result.map((c) => c.word);
    expect(words).toContain("bannock");
    expect(words).toContain("good");
    expect(words).not.toContain("the");
    expect(words).not.toContain("and");
    expect(words).not.toContain("are");
    expect(words).not.toContain("fish");
    expect(words).not.toContain("12");
    expect(words).not.toContain("a");
  });

  it("counts duplicates and sorts by descending count then alphabetically", () => {
    const result = extractCandidates(
      "bannock bannock bannock fish fish moose",
      new Set(),
    );
    expect(result).toEqual([
      { word: "bannock", count: 3 },
      { word: "fish", count: 2 },
      { word: "moose", count: 1 },
    ]);
  });
});
