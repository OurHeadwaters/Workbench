import { describe, it, expect } from "vitest";

import {
  namingDiff,
  parseText,
  parseWordpileImport,
} from "../namingDiff";

describe("parseText", () => {
  it("returns no tokens for an empty string", () => {
    expect(parseText("").tokens).toEqual([]);
  });

  it("emits word tokens with character offsets and word indices", () => {
    const p = parseText("the saltbox is here");
    expect(p.tokens.map((t) => t.lower)).toEqual([
      "the",
      "saltbox",
      "is",
      "here",
    ]);
    expect(p.tokens[1]).toMatchObject({
      lower: "saltbox",
      charStart: 4,
      charEnd: 11,
      wordIndex: 1,
    });
  });

  it("preserves casing in token.text but lowercases token.lower", () => {
    const p = parseText("Saltbox");
    expect(p.tokens[0].text).toBe("Saltbox");
    expect(p.tokens[0].lower).toBe("saltbox");
  });

  it("handles internal apostrophes and hyphens as one token", () => {
    const p = parseText("don't co-op");
    expect(p.tokens.map((t) => t.lower)).toEqual(["don't", "co-op"]);
  });
});

describe("namingDiff", () => {
  it("returns an empty result for empty inputs", () => {
    const r = namingDiff([], "", "");
    expect(r.drops).toEqual([]);
    expect(r.substitutions).toEqual([]);
    expect(r.newCandidates).toEqual([]);
    expect(r.summary).toEqual([]);
  });

  it("returns an empty result when the watch list is empty", () => {
    const r = namingDiff([], "the saltbox is here", "the bucket is here");
    expect(r.drops).toEqual([]);
    expect(r.substitutions).toEqual([]);
  });

  it("treats a kept watched noun as kept, with no drop", () => {
    const r = namingDiff(
      ["saltbox"],
      "the saltbox is here",
      "yes the saltbox is here",
    );
    expect(r.drops).toEqual([]);
    expect(r.substitutions).toEqual([]);
    expect(r.summary[0]).toMatchObject({
      term: "saltbox",
      countA: 1,
      countB: 1,
      delta: 0,
    });
  });

  it("flags a watched noun that disappears between A and B", () => {
    const r = namingDiff(
      ["envelope"],
      "We track every envelope carefully.",
      "We track every category carefully.",
    );
    expect(r.drops).toHaveLength(1);
    expect(r.drops[0].term).toBe("envelope");
    expect(r.drops[0].occurrence.text).toBe("envelope");
    expect(r.summary[0]).toMatchObject({
      term: "envelope",
      countA: 1,
      countB: 0,
      delta: -1,
    });
  });

  it("identifies the substitution suspect in the same neighborhood", () => {
    const r = namingDiff(
      ["envelope"],
      "We track every envelope carefully.",
      "We track every category carefully.",
    );
    expect(r.substitutions).toHaveLength(1);
    const sub = r.substitutions[0];
    expect(sub.term).toBe("envelope");
    expect(sub.candidateInB.text).toBe("category");
    expect(sub.occurrenceInA.charStart).toBe(
      "We track every ".length,
    );
  });

  it("preserves the original casing of the substitution candidate", () => {
    const r = namingDiff(
      ["envelope"],
      "We track every envelope carefully.",
      "We track every Category carefully.",
    );
    expect(r.substitutions[0].candidateInB.text).toBe("Category");
  });

  it("matches multi-word watched terms case-insensitively", () => {
    const r = namingDiff(
      ["Wisdom Keeper"],
      "ask a wisdom keeper before shipping",
      "ask an elder before shipping",
    );
    expect(r.drops).toHaveLength(1);
    expect(r.drops[0].occurrence.text).toBe("wisdom keeper");
    expect(r.drops[0].occurrence.wordSpan).toBe(2);
  });

  it("does not flag stopwords like 'the' as substitution candidates", () => {
    const r = namingDiff(
      ["envelope"],
      "the envelope is over there.",
      "the is over there.",
    );
    expect(r.drops).toHaveLength(1);
    // No content word stepped into the gap.
    expect(r.substitutions).toHaveLength(0);
  });

  it("does not flag a word that already exists elsewhere in A", () => {
    // 'category' appears earlier in A, so its appearance near where
    // 'envelope' used to sit isn't a new substitution suspect.
    const r = namingDiff(
      ["envelope"],
      "the category is one thing; the envelope is another.",
      "the category is one thing; the category is another.",
    );
    expect(r.drops).toHaveLength(1);
    expect(r.substitutions).toHaveLength(0);
  });

  it("does not flag another watched noun as a substitution candidate", () => {
    // Both 'envelope' and 'category' are watched, so neither one
    // counts as a 'new' word stepping into the other's place.
    const r = namingDiff(
      ["envelope", "category"],
      "we file each envelope on payday",
      "we file each category on payday",
    );
    expect(r.drops.map((d) => d.term)).toEqual(["envelope"]);
    expect(r.substitutions).toHaveLength(0);
  });

  it("collects extra content words near a drop as new candidates", () => {
    const r = namingDiff(
      ["envelope"],
      "we move the envelope on payday",
      "we move the bucket on payday calendar",
    );
    // 'bucket' is the closest content word to where 'envelope' sat —
    // substitution. 'calendar' shows up in the same neighborhood and
    // didn't appear in A — new candidate.
    expect(r.drops).toHaveLength(1);
    expect(r.substitutions[0].candidateInB.text).toBe("bucket");
    const newWords = r.newCandidates.map((n) => n.newWord.text);
    expect(newWords).toContain("calendar");
  });

  it("matches multiple occurrences pairwise so only true drops surface", () => {
    const r = namingDiff(
      ["envelope"],
      "envelope one. middle. envelope two.",
      "envelope one. middle. ledger two.",
    );
    expect(r.drops).toHaveLength(1);
    expect(r.summary[0]).toMatchObject({ countA: 2, countB: 1, delta: -1 });
    expect(r.substitutions[0].candidateInB.text).toBe("ledger");
  });

  it("dedupes the watch list (case-insensitive) before scanning", () => {
    const r = namingDiff(
      ["envelope", "Envelope", "  envelope  "],
      "we file the envelope monthly",
      "we file the bucket monthly",
    );
    expect(r.summary).toHaveLength(1);
    expect(r.drops).toHaveLength(1);
  });

  it("ignores watch list entries that are pure punctuation/whitespace", () => {
    const r = namingDiff(
      [" ", "...", "  --  "],
      "we file the envelope monthly",
      "we file the bucket monthly",
    );
    expect(r.summary).toEqual([]);
    expect(r.drops).toEqual([]);
  });
});

describe("parseWordpileImport", () => {
  it("pulls load-bearing words from a single-pile export", () => {
    const json = JSON.stringify({
      format: "wordpile-export",
      formatVersion: 1,
      exportedAt: 0,
      pile: {
        name: "Saltbox",
        words: [
          { word: "saltbox", bucket: "load", note: "", saferAlternative: "" },
          { word: "household", bucket: "interior", note: "", saferAlternative: "" },
          { word: "envelope", bucket: "load", note: "", saferAlternative: "" },
          { word: "category", bucket: "avoid", note: "", saferAlternative: "" },
        ],
      },
    });
    const r = parseWordpileImport(json);
    expect(r.words).toEqual(["saltbox", "envelope"]);
    expect(r.piles).toHaveLength(1);
    expect(r.piles[0].name).toBe("Saltbox");
  });

  it("pulls load-bearing words across all piles in a bundle", () => {
    const json = JSON.stringify({
      format: "wordpile-bundle",
      formatVersion: 1,
      exportedAt: 0,
      piles: [
        {
          name: "Saltbox",
          words: [
            { word: "saltbox", bucket: "load", note: "", saferAlternative: "" },
          ],
        },
        {
          name: "Headwaters",
          words: [
            { word: "envelope", bucket: "load", note: "", saferAlternative: "" },
            { word: "Saltbox", bucket: "load", note: "", saferAlternative: "" }, // dedupes
          ],
        },
      ],
    });
    const r = parseWordpileImport(json);
    expect(r.words).toEqual(["saltbox", "envelope"]);
    expect(r.piles).toHaveLength(2);
  });

  it("throws a clear error on non-JSON input", () => {
    expect(() => parseWordpileImport("not json {")).toThrow(/Could not read/);
  });

  it("throws on an unrecognized format envelope", () => {
    const json = JSON.stringify({ format: "something-else" });
    expect(() => parseWordpileImport(json)).toThrow(/Unrecognized/);
  });
});
