import { describe, expect, it } from "vitest";

import {
  BANNED_TERMS,
  HANDBOOK_SOURCE_FILES,
  MAX_SENTENCE_WORDS,
  countWords,
  extractBodyCopyStrings,
  extractConstellationStrings,
  findBannedVocabularyHits,
  findLongSentences,
  splitSentences,
} from "@/lib/voice/scan";

// Pulls every body-copy string out of handbook.ts and foundingExamples.ts
// once, so the assertions below all share the same scan.
const BODY_COPY = HANDBOOK_SOURCE_FILES.flatMap((file) =>
  extractBodyCopyStrings(file),
);

// Pulls every reader-facing string out of the bundled constellation
// manifest (data/constellation.ts) once. Carve-outs (vocabulary terms,
// names, machine ids, worked examples) are documented inline in scan.ts.
const CONSTELLATION_COPY = extractConstellationStrings();

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

describe("voice — banned vocabulary list (currently empty)", () => {
  // 30 April 2026 — BANNED_TERMS was emptied as part of the §6.4
  // sledgehammer revert. The infrastructure is preserved so a future
  // derivative everyday-language volume can re-seed the list with its
  // own alias map. The academic source volume is exempt by design.
  it("starts as an empty list (academic volume is exempt)", () => {
    expect([...BANNED_TERMS]).toEqual([]);
  });

  it("therefore reports no banned-term hits in body copy", () => {
    const hits = findBannedVocabularyHits(BODY_COPY);
    expect(hits).toEqual([]);
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

describe("grade-9 voice — constellation manifest", () => {
  it("finds reader-facing strings in the bundled constellation", () => {
    expect(
      CONSTELLATION_COPY.length,
      "extractConstellationStrings() returned no strings — the manifest may be empty or the extractor lost its fields",
    ).toBeGreaterThan(0);
    // Every entry should be tagged with the constellation source file so
    // failure messages point a reader at data/constellation.ts.
    expect(
      CONSTELLATION_COPY.every((b) => b.file.startsWith("data/constellation.ts")),
    ).toBe(true);
  });

  // Per-field coverage guard. Every reader-facing leaf field documented
  // in scan.ts must surface at least one extracted string. If a future
  // change to extractPrimitiveStrings / extractZoneStrings drops one of
  // these fields — or silently switches the array-element child it
  // pulls (e.g. severityLadder[].rung instead of .meaning) — the
  // banned-vocabulary and long-sentence assertions below would silently
  // pass on that field. This guard fails loudly with the missing leaf
  // path instead.
  it("covers every documented manifest field via extractConstellationStrings()", () => {
    const expectedLeaves: { name: string; pattern: RegExp }[] = [
      { name: "primitive.summary", pattern: /\.summary$/ },
      { name: "primitive.hostZoneRationale", pattern: /\.hostZoneRationale$/ },
      { name: "primitive.vocabulary[].role", pattern: /\.vocabulary\[\d+\]\.role$/ },
      { name: "primitive.severityLadder[].meaning", pattern: /\.severityLadder\[\d+\]\.meaning$/ },
      { name: "primitive.subShelves[].role", pattern: /\.subShelves\[\d+\]\.role$/ },
      { name: "primitive.rejectedAlternatives[].reason", pattern: /\.rejectedAlternatives\[\d+\]\.reason$/ },
      { name: "zone.domain", pattern: /\.domain$/ },
      { name: "zone.tagline", pattern: /\.tagline$/ },
    ];
    const missing = expectedLeaves
      .filter(({ pattern }) => !CONSTELLATION_COPY.some((b) => pattern.test(b.file)))
      .map(({ name }) => name);
    expect(
      missing,
      missing.length === 0
        ? ""
        : `extractConstellationStrings() is no longer surfacing these documented manifest leaf fields: ${missing.join(", ")}. Re-add the extraction in lib/voice/scan.ts so the grade-9 voice rules continue to cover them.`,
    ).toEqual([]);
  });

  it("does not appear in constellation reader-facing prose", () => {
    const hits = findBannedVocabularyHits(CONSTELLATION_COPY);
    const formatted = hits
      .map((h) => `  ${h.file} [${h.term}] — ${h.preview}`)
      .join("\n");
    expect(
      hits,
      hits.length === 0
        ? ""
        : `Found ${hits.length} banned academic vocabulary use(s) in constellation manifest fields that flow into chapter prose. Rewrite the field in plain language in artifacts/codetry-handbook/data/constellation.json and re-run \`pnpm --filter @workspace/codetry-handbook run sync-constellation\`. Field carve-outs (vocabulary terms, sub-shelf names, rejected-name names, primitive/zone names) are documented in lib/voice/scan.ts:\n${formatted}`,
    ).toEqual([]);
  });

  it("does not contain a sentence longer than the hard cap in the constellation", () => {
    const hits = findLongSentences(CONSTELLATION_COPY, MAX_SENTENCE_WORDS);
    const formatted = hits
      .map(
        (h) =>
          `  ${h.file} (${h.words} words): ${h.preview}${h.preview.length === 200 ? "…" : ""}`,
      )
      .join("\n");
    expect(
      hits,
      hits.length === 0
        ? ""
        : `Found ${hits.length} sentence(s) longer than ${MAX_SENTENCE_WORDS} words in constellation manifest fields. Break the sentence into shorter ones in artifacts/codetry-handbook/data/constellation.json and re-run \`pnpm --filter @workspace/codetry-handbook run sync-constellation\`:\n${formatted}`,
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

  it("returns no banned-term hits while the banned list is empty", () => {
    // Sanity: with BANNED_TERMS empty, no synthetic prose can produce
    // a hit. Re-seed BANNED_TERMS in scan.ts to revive the path.
    const hits = findBannedVocabularyHits([
      { file: "synthetic.ts", line: 1, text: "this prose uses substrate" },
    ]);
    expect(hits).toEqual([]);
  });

  it("flags a sentence that exceeds the current cap", () => {
    // Build a sentence one word longer than the cap so the test tracks
    // whatever MAX_SENTENCE_WORDS happens to be set to in scan.ts.
    const overCap = MAX_SENTENCE_WORDS + 1;
    const long = Array.from({ length: overCap }, () => "word").join(" ") + ".";
    const hits = findLongSentences(
      [{ file: "synthetic.ts", line: 1, text: long }],
      MAX_SENTENCE_WORDS,
    );
    expect(hits.length).toBe(1);
    expect(hits[0].words).toBe(overCap);
  });
});
