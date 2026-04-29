import { describe, expect, it } from "vitest";

import {
  BANNED_TERMS,
  HANDBOOK_SOURCE_FILES,
  MAX_SENTENCE_WORDS,
  countWords,
  extractBodyCopyStrings,
  findBannedVocabularyHits,
  findLongSentences,
  splitSentences,
} from "@/lib/voice/scan";

// Pulls every body-copy string out of handbook.ts and foundingExamples.ts
// once, so the assertions below all share the same scan.
const BODY_COPY = HANDBOOK_SOURCE_FILES.flatMap((file) =>
  extractBodyCopyStrings(file),
);

describe("grade-9 voice — body-copy scan setup", () => {
  it("finds body-copy strings in both source files", () => {
    const filesWithCopy = new Set(BODY_COPY.map((b) => b.file));
    expect(
      filesWithCopy,
      "scan picked up body copy from data/handbook.ts",
    ).toContain("data/handbook.ts");
    expect(
      filesWithCopy,
      "scan picked up body copy from data/foundingExamples.ts",
    ).toContain("data/foundingExamples.ts");
  });

  it("skips text inside kind:\"examples\" worked-example blocks", () => {
    // The Worked Example for "Listen for the noun" includes the literal
    // string "load-bearing" inside its rule field. If the AST walker
    // weren't skipping examples blocks, this string would surface in the
    // scan and the banned-vocabulary assertion below would already be
    // failing on it.
    const exampleProseLeaked = BODY_COPY.some((b) =>
      /unlockListeners/.test(b.text),
    );
    expect(
      exampleProseLeaked,
      "WorkedExample prose must be excluded from the body-copy scan",
    ).toBe(false);
  });
});

describe("grade-9 voice — banned academic vocabulary", () => {
  it("registers all eight banned terms", () => {
    expect([...BANNED_TERMS]).toEqual([
      "substrate",
      "tokenize",
      "reify",
      "vernacular",
      "primitive",
      "membrane",
      "load-bearing",
      "cross-zone",
    ]);
  });

  it("does not appear in handbook.ts or foundingExamples.ts body copy", () => {
    const hits = findBannedVocabularyHits(BODY_COPY);
    const formatted = hits
      .map(
        (h) =>
          `  ${h.file}:${h.line} [${h.term}] — ${h.preview}`,
      )
      .join("\n");
    expect(
      hits,
      hits.length === 0
        ? ""
        : `Found ${hits.length} banned academic vocabulary use(s) in body copy. Rewrite in plain language or, if the term is unavoidably technical, move the prose into a kind:"examples" block:\n${formatted}`,
    ).toEqual([]);
  });
});

describe("grade-9 voice — sentence length", () => {
  it("does not contain a sentence longer than the hard cap", () => {
    const hits = findLongSentences(BODY_COPY, MAX_SENTENCE_WORDS);
    const formatted = hits
      .map(
        (h) =>
          `  ${h.file}:${h.line} (${h.words} words): ${h.preview}${h.preview.length === 200 ? "…" : ""}`,
      )
      .join("\n");
    expect(
      hits,
      hits.length === 0
        ? ""
        : `Found ${hits.length} sentence(s) longer than ${MAX_SENTENCE_WORDS} words. Break the sentence into shorter ones to keep the grade-9 voice:\n${formatted}`,
    ).toEqual([]);
  });
});

describe("grade-9 voice — scan helpers", () => {
  it("splits prose at sentence-ending punctuation", () => {
    expect(splitSentences("One. Two! Three?")).toEqual([
      "One.",
      "Two!",
      "Three?",
    ]);
  });

  it("strips italic asterisks before counting words", () => {
    expect(countWords("the *books* are open")).toBe(4);
  });

  it("flags a banned term in a synthetic body-copy string", () => {
    const hits = findBannedVocabularyHits([
      { file: "synthetic.ts", line: 1, text: "this prose uses substrate" },
    ]);
    expect(hits.length).toBe(1);
    expect(hits[0].term).toBe("substrate");
  });

  it("flags a synthetic over-long sentence", () => {
    const long = Array.from({ length: 150 }, () => "word").join(" ") + ".";
    const hits = findLongSentences(
      [{ file: "synthetic.ts", line: 1, text: long }],
      MAX_SENTENCE_WORDS,
    );
    expect(hits.length).toBe(1);
    expect(hits[0].words).toBe(150);
  });
});
