/**
 * check-slide-refs.test.ts
 *
 * Covers six exported functions from scripts/check-slide-refs.ts:
 *   - collectEyebrows          — extracts "ROMAN · text" labels from slide source
 *   - collectTextCrossRefs     — extracts (ROMAN · text) refs from source files
 *   - checkTextRefs            — validates text refs against the eyebrow set
 *   - collectNumericCrossRefs  — extracts (ROMAN · NN) numeric refs from source files
 *   - checkNumericRefs         — validates numeric refs against the slide manifest
 *   - collectPartRefs          — extracts "Part N" / "Parts I–V" prose refs
 *   - manifestParts            — derives the set of parts present in the manifest
 *   - checkPartRefs            — optionally validates part refs against the manifest
 *
 * Key scenarios tested:
 *   Text refs:
 *   - Valid reference that matches an existing eyebrow → no error
 *   - Eyebrow renamed (text changed) → stale-ref error
 *   - Eyebrow moved to different part (Roman changed) → stale-ref error
 *   - Numeric refs (VIII · 06) are not collected as text cross-refs
 *   - Eyebrow with suffix text still satisfies a shorter cross-ref
 *   - Case-insensitive and whitespace-normalised matching
 *   - Parenthesised cross-refs do NOT self-validate as eyebrows
 *
 *   Numeric refs:
 *   - (VI · 05) matches a manifest title that starts with "VI · 05"
 *   - (VI · 02b) matches alphanumeric number tokens
 *   - Stale numeric ref (part or number missing from manifest) → error
 *   - Text refs (ROMAN · letter) are NOT collected as numeric refs
 *   - Whitespace normalisation in numeric ref text
 *   - Multiple numeric refs reported in one pass
 *
 *   Part prose refs:
 *   - "Part V" collected correctly
 *   - "Parts I–V" collected with the full range text
 *   - Validation skipped when manifest has no part-structured slides
 *   - Validation fires when the part is absent from a part-structured manifest
 *   - Range ref where one endpoint is missing → error naming only the missing part
 *   - Range ref where both endpoints exist → no error
 *   - manifestParts returns only parts with Roman-numeral title prefixes
 */

import { describe, it, expect } from "vitest";
import {
  collectEyebrows,
  collectTextCrossRefs,
  checkTextRefs,
  collectNumericCrossRefs,
  checkNumericRefs,
  collectPartRefs,
  manifestParts,
  checkPartRefs,
  type SourceFile,
  type CrossRef,
  type SlideManifestEntry,
} from "../check-slide-refs.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

function src(path: string, content: string): SourceFile {
  return { path, content };
}

function slide(
  position: number,
  title: string,
  id = `id-${position}`
): SlideManifestEntry {
  return { id, position, filepath: `src/pages/slides/Slide${position}.tsx`, title };
}

// ── collectEyebrows ───────────────────────────────────────────────────────────

describe("collectEyebrows", () => {
  it("collects a plain eyebrow string from JSX text content", () => {
    const file = src(
      "slides/Accountability.tsx",
      `<div>V · Net-positive accountability</div>`
    );
    const eyebrows = collectEyebrows([file]);
    expect(eyebrows.has("V · Net-positive accountability")).toBe(true);
  });

  it("collects an eyebrow from a string literal", () => {
    const file = src(
      "slides/SaltOpsNote.tsx",
      `const label = "VI · Slip-Flow Rehearsal — Dry-Run Script";`
    );
    const eyebrows = collectEyebrows([file]);
    const found = [...eyebrows].some((e) =>
      e.startsWith("VI · Slip-Flow Rehearsal")
    );
    expect(found).toBe(true);
  });

  it("does NOT collect numeric-only suffixes as text eyebrows", () => {
    const file = src(
      "slides/SaltKlaviyo.tsx",
      `<div>VI · 05 — Slip-Flow</div>`
    );
    const eyebrows = collectEyebrows([file]);
    const hasNumericStart = [...eyebrows].some((e) =>
      /^VI\s*·\s*0/.test(e)
    );
    expect(hasNumericStart).toBe(false);
  });

  it("ignores middle-dot phrases that do not start with a Roman numeral", () => {
    const file = src(
      "slides/Budget.tsx",
      `<span>Layer 1 · Signed today</span>`
    );
    const eyebrows = collectEyebrows([file]);
    const hasLayer = [...eyebrows].some((e) => e.includes("Signed today"));
    expect(hasLayer).toBe(false);
  });

  it("ignores money/rate phrases that contain a middle dot", () => {
    const file = src(
      "slides/Budget.tsx",
      `<td>$150/hr · 40 hrs/wk</td>`
    );
    const eyebrows = collectEyebrows([file]);
    expect(eyebrows.size).toBe(0);
  });

  it("collects eyebrows from multiple slide files", () => {
    const files = [
      src("slides/A.tsx", `<div>V · Net-positive accountability</div>`),
      src("slides/B.tsx", `<div>VI · Transparent reporting</div>`),
    ];
    const eyebrows = collectEyebrows(files);
    expect(eyebrows.has("V · Net-positive accountability")).toBe(true);
    expect(eyebrows.has("VI · Transparent reporting")).toBe(true);
  });

  it("normalises excess internal whitespace in eyebrow text", () => {
    const file = src(
      "slides/A.tsx",
      `<div>V  ·  Net-positive  accountability</div>`
    );
    const eyebrows = collectEyebrows([file]);
    expect(eyebrows.has("V · Net-positive accountability")).toBe(true);
  });

  it("does NOT collect a parenthesised cross-ref as an eyebrow (no self-match)", () => {
    // A slide body can reference another slide with (V · Net-positive accountability).
    // That parenthesised phrase must never be treated as an eyebrow declaration — if
    // it were, a ref could validate against itself even after the target was renamed.
    const file = src(
      "slides/Budget.tsx",
      `<p>Hub Operator headline (V · Net-positive accountability) — broken out here.</p>`
    );
    const eyebrows = collectEyebrows([file]);
    const selfMatch = [...eyebrows].some((e) =>
      e.startsWith("V · Net-positive accountability")
    );
    expect(selfMatch).toBe(false);
  });

  it("reports an error when the only occurrence of ref text is the parenthesised ref itself", () => {
    // Verifies end-to-end that a body ref cannot satisfy itself:
    // if the slide directory only contains (V · Net-positive accountability) as
    // prose (not a bare eyebrow declaration), the checker must flag it as stale.
    const slideFile = src(
      "slides/Budget.tsx",
      `<p>(V · Net-positive accountability)</p>`
    );
    const eyebrows = collectEyebrows([slideFile]);
    const refs = collectTextCrossRefs([slideFile]);
    const errors = checkTextRefs(eyebrows, refs);
    expect(errors).toHaveLength(1);
    expect(errors[0].ref.text).toBe("V · Net-positive accountability");
  });
});

// ── collectTextCrossRefs ──────────────────────────────────────────────────────

describe("collectTextCrossRefs", () => {
  it("collects a text cross-ref from a comment in source", () => {
    const file = src(
      "pages/Budget.tsx",
      `// See (V · Net-positive accountability) for detail.\n`
    );
    const refs = collectTextCrossRefs([file]);
    expect(refs).toHaveLength(1);
    expect(refs[0].text).toBe("V · Net-positive accountability");
    expect(refs[0].file).toBe("pages/Budget.tsx");
    expect(refs[0].line).toBe(1);
  });

  it("collects a text cross-ref embedded in JSX prose", () => {
    const file = src(
      "pages/Budget.tsx",
      `<p>Hub Operator headline (V · Net-positive accountability) — broken out here.</p>`
    );
    const refs = collectTextCrossRefs([file]);
    expect(refs).toHaveLength(1);
    expect(refs[0].text).toBe("V · Net-positive accountability");
  });

  it("does NOT collect a numeric cross-ref like (VIII · 06)", () => {
    const file = src(
      "pages/Budget.tsx",
      `<p>See (VIII · 06) for the rate breakdown.</p>`
    );
    const refs = collectTextCrossRefs([file]);
    expect(refs).toHaveLength(0);
  });

  it("collects cross-refs from multiple files and reports correct file/line", () => {
    const files = [
      src(
        "pages/A.tsx",
        `line1\n(V · Net-positive accountability)\nline3`
      ),
      src(
        "pages/B.tsx",
        `(VI · Transparent reporting)`
      ),
    ];
    const refs = collectTextCrossRefs(files);
    expect(refs).toHaveLength(2);
    const refA = refs.find((r) => r.file === "pages/A.tsx")!;
    expect(refA.line).toBe(2);
    const refB = refs.find((r) => r.file === "pages/B.tsx")!;
    expect(refB.text).toBe("VI · Transparent reporting");
    expect(refB.line).toBe(1);
  });

  it("normalises whitespace in the captured ref text", () => {
    const file = src(
      "pages/Budget.tsx",
      `(V  ·  Net-positive  accountability)`
    );
    const refs = collectTextCrossRefs([file]);
    expect(refs[0].text).toBe("V · Net-positive accountability");
  });
});

// ── checkTextRefs ─────────────────────────────────────────────────────────────

describe("checkTextRefs", () => {
  function ref(text: string, file = "Budget.tsx", line = 10): CrossRef {
    return { text, file, line };
  }

  it("returns no errors when the ref matches an eyebrow exactly", () => {
    const eyebrows = new Set(["V · Net-positive accountability"]);
    const errors = checkTextRefs(eyebrows, [
      ref("V · Net-positive accountability"),
    ]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors when the eyebrow has suffix text beyond the ref", () => {
    const eyebrows = new Set([
      "V · Net-positive accountability — how Headwaters closes the loop",
    ]);
    const errors = checkTextRefs(eyebrows, [
      ref("V · Net-positive accountability"),
    ]);
    expect(errors).toHaveLength(0);
  });

  it("returns an error when the eyebrow was renamed (text changed)", () => {
    const eyebrows = new Set(["V · Transparent reporting"]);
    const errors = checkTextRefs(eyebrows, [
      ref("V · Net-positive accountability"),
    ]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("V · Net-positive accountability");
    expect(errors[0].message).toContain("Budget.tsx:10");
  });

  it("returns an error when the slide was moved to a different part (Roman changed)", () => {
    const eyebrows = new Set(["VI · Net-positive accountability"]);
    const errors = checkTextRefs(eyebrows, [
      ref("V · Net-positive accountability"),
    ]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("Budget.tsx:10");
    expect(errors[0].message).toContain("V · Net-positive accountability");
  });

  it("returns an error when no eyebrows exist at all", () => {
    const errors = checkTextRefs(new Set(), [
      ref("V · Net-positive accountability"),
    ]);
    expect(errors).toHaveLength(1);
  });

  it("does not confuse a partial eyebrow-text prefix with a real match", () => {
    const eyebrows = new Set(["V · Net-positive accountability model extended"]);
    const errors = checkTextRefs(eyebrows, [
      ref("V · Net-positive accountability"),
    ]);
    expect(errors).toHaveLength(0);
  });

  it("matching is case-insensitive", () => {
    const eyebrows = new Set(["V · NET-POSITIVE ACCOUNTABILITY"]);
    const errors = checkTextRefs(eyebrows, [
      ref("V · Net-positive accountability"),
    ]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors when the refs list is empty", () => {
    const eyebrows = new Set(["V · Net-positive accountability"]);
    const errors = checkTextRefs(eyebrows, []);
    expect(errors).toHaveLength(0);
  });

  it("reports the correct file and line in the error message", () => {
    const eyebrows = new Set<string>();
    const errors = checkTextRefs(eyebrows, [
      ref("V · Net-positive accountability", "src/pages/slides/Budget.tsx", 217),
    ]);
    expect(errors[0].message).toContain(
      "src/pages/slides/Budget.tsx:217"
    );
  });

  it("catches multiple stale refs in one pass", () => {
    const eyebrows = new Set(["V · Net-positive accountability"]);
    const errors = checkTextRefs(eyebrows, [
      ref("V · Net-positive accountability"),
      ref("VI · Transparent reporting", "CashFlow.tsx", 42),
      ref("VII · Missing slide", "Closing.tsx", 5),
    ]);
    expect(errors).toHaveLength(2);
    expect(errors.map((e) => e.ref.text)).toContain("VI · Transparent reporting");
    expect(errors.map((e) => e.ref.text)).toContain("VII · Missing slide");
  });
});

// ── collectNumericCrossRefs ───────────────────────────────────────────────────

describe("collectNumericCrossRefs", () => {
  it("collects a simple numeric ref like (VI · 05)", () => {
    const file = src(
      "pages/Budget.tsx",
      `<p>See (VI · 05) for the Klaviyo setup.</p>`
    );
    const refs = collectNumericCrossRefs([file]);
    expect(refs).toHaveLength(1);
    expect(refs[0].text).toBe("VI · 05");
    expect(refs[0].file).toBe("pages/Budget.tsx");
    expect(refs[0].line).toBe(1);
  });

  it("collects alphanumeric number tokens like (VI · 02b)", () => {
    const file = src(
      "pages/Budget.tsx",
      `// See (VI · 02b) for the bench roster.\n`
    );
    const refs = collectNumericCrossRefs([file]);
    expect(refs).toHaveLength(1);
    expect(refs[0].text).toBe("VI · 02b");
  });

  it("collects (VIII · 06) which was previously ignored by the text checker", () => {
    const file = src(
      "pages/Budget.tsx",
      `<p>See (VIII · 06) for the rate breakdown.</p>`
    );
    const refs = collectNumericCrossRefs([file]);
    expect(refs).toHaveLength(1);
    expect(refs[0].text).toBe("VIII · 06");
  });

  it("does NOT collect text refs like (V · Net-positive accountability)", () => {
    const file = src(
      "pages/Budget.tsx",
      `<p>(V · Net-positive accountability)</p>`
    );
    const refs = collectNumericCrossRefs([file]);
    expect(refs).toHaveLength(0);
  });

  it("normalises whitespace in the numeric ref text", () => {
    const file = src(
      "pages/Budget.tsx",
      `(VI  ·  05)`
    );
    const refs = collectNumericCrossRefs([file]);
    expect(refs[0].text).toBe("VI · 05");
  });

  it("reports correct line number for numeric refs", () => {
    const file = src(
      "pages/Budget.tsx",
      `line 1\nline 2\n(VI · 06) here`
    );
    const refs = collectNumericCrossRefs([file]);
    expect(refs[0].line).toBe(3);
  });

  it("collects numeric refs from multiple files", () => {
    const files = [
      src("pages/A.tsx", `(VI · 05)`),
      src("pages/B.tsx", `(VI · 06)`),
    ];
    const refs = collectNumericCrossRefs(files);
    expect(refs).toHaveLength(2);
    expect(refs.map((r) => r.text)).toContain("VI · 05");
    expect(refs.map((r) => r.text)).toContain("VI · 06");
  });

  it("returns empty array when no numeric refs are present", () => {
    const file = src("pages/Budget.tsx", `<p>No refs here.</p>`);
    const refs = collectNumericCrossRefs([file]);
    expect(refs).toHaveLength(0);
  });
});

// ── checkNumericRefs ──────────────────────────────────────────────────────────

describe("checkNumericRefs", () => {
  function ref(text: string, file = "Budget.tsx", line = 10): CrossRef {
    return { text, file, line };
  }

  const manifest = [
    slide(18, "VI · 02b — Salt Bench Roster"),
    slide(19, "VI · 05 — Slip-Flow Rehearsal: Klaviyo Setup"),
    slide(20, "VI · 06 — Slip-Flow Rehearsal: Dry-Run Script"),
  ];

  it("returns no errors when the ref matches a manifest title exactly", () => {
    const errors = checkNumericRefs(manifest, [ref("VI · 05")]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors when the manifest title has a longer suffix", () => {
    const errors = checkNumericRefs(manifest, [ref("VI · 06")]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors for alphanumeric number tokens like 02b", () => {
    const errors = checkNumericRefs(manifest, [ref("VI · 02b")]);
    expect(errors).toHaveLength(0);
  });

  it("returns an error when the number token does not match any manifest slide", () => {
    const errors = checkNumericRefs(manifest, [ref("VI · 99")]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("VI · 99");
    expect(errors[0].message).toContain("Budget.tsx:10");
  });

  it("returns an error when the Roman part does not match", () => {
    const errors = checkNumericRefs(manifest, [ref("VIII · 06")]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("VIII · 06");
  });

  it("matching is case-insensitive", () => {
    const caseManifest = [slide(1, "vi · 05 — lowercase title")];
    const errors = checkNumericRefs(caseManifest, [ref("VI · 05")]);
    expect(errors).toHaveLength(0);
  });

  it("matching is whitespace-normalised", () => {
    const errors = checkNumericRefs(manifest, [
      { text: "VI  ·  05", file: "Budget.tsx", line: 1 },
    ]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors when the refs list is empty", () => {
    const errors = checkNumericRefs(manifest, []);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors when the manifest is empty and refs list is also empty", () => {
    const errors = checkNumericRefs([], []);
    expect(errors).toHaveLength(0);
  });

  it("returns an error for every stale ref when multiple are stale", () => {
    const errors = checkNumericRefs(manifest, [
      ref("VI · 05"),
      ref("VI · 99", "A.tsx", 1),
      ref("IX · 01", "B.tsx", 2),
    ]);
    expect(errors).toHaveLength(2);
    expect(errors.map((e) => e.ref.text)).toContain("VI · 99");
    expect(errors.map((e) => e.ref.text)).toContain("IX · 01");
  });

  it("does not partially match — 'VI · 0' must not satisfy 'VI · 05'", () => {
    const errors = checkNumericRefs(manifest, [ref("VI · 0")]);
    expect(errors).toHaveLength(1);
  });

  it("reports the correct file and line in the error message", () => {
    const errors = checkNumericRefs(manifest, [
      ref("VI · 99", "src/pages/slides/SaltBench.tsx", 42),
    ]);
    expect(errors[0].message).toContain("src/pages/slides/SaltBench.tsx:42");
  });
});

// ── collectPartRefs ───────────────────────────────────────────────────────────

describe("collectPartRefs", () => {
  it("collects 'Part V' prose references", () => {
    const file = src("pages/Budget.tsx", `See Part V for context.`);
    const refs = collectPartRefs([file]);
    expect(refs).toHaveLength(1);
    expect(refs[0].text).toBe("V");
    expect(refs[0].line).toBe(1);
  });

  it("collects 'Parts I–V' range references (en-dash)", () => {
    const file = src("pages/Budget.tsx", `Parts I–V cover the foundation.`);
    const refs = collectPartRefs([file]);
    expect(refs).toHaveLength(1);
    expect(refs[0].text).toBe("I–V");
  });

  it("collects 'Parts I-V' range references (hyphen)", () => {
    const file = src("pages/Budget.tsx", `Parts I-V cover the foundation.`);
    const refs = collectPartRefs([file]);
    expect(refs).toHaveLength(1);
    expect(refs[0].text).toMatch(/^I[–\-]V$/);
  });

  it("collects 'Parts' (plural) followed by a single numeral", () => {
    const file = src("pages/Budget.tsx", `Parts VI and VII are ops.`);
    const refs = collectPartRefs([file]);
    expect(refs).toHaveLength(1);
    expect(refs[0].text).toBe("VI");
  });

  it("reports correct file and line number", () => {
    const file = src("pages/Budget.tsx", `line1\nSee Part VI here.\nline3`);
    const refs = collectPartRefs([file]);
    expect(refs[0].file).toBe("pages/Budget.tsx");
    expect(refs[0].line).toBe(2);
  });

  it("returns empty array when no part refs are present", () => {
    const file = src("pages/Budget.tsx", `<p>No part references here.</p>`);
    const refs = collectPartRefs([file]);
    expect(refs).toHaveLength(0);
  });
});

// ── manifestParts ─────────────────────────────────────────────────────────────

describe("manifestParts", () => {
  it("returns Roman numerals from part-structured slide titles", () => {
    const m = [
      slide(1, "VI · 02b — Salt Bench Roster"),
      slide(2, "VI · 05 — Klaviyo Setup"),
      slide(3, "Cover"),
    ];
    const parts = manifestParts(m);
    expect(parts.has("VI")).toBe(true);
    expect(parts.size).toBe(1);
  });

  it("returns an empty set when no slide has a Roman-numeral title prefix", () => {
    const m = [
      slide(1, "Cover"),
      slide(2, "Budget"),
      slide(3, "Closing"),
    ];
    const parts = manifestParts(m);
    expect(parts.size).toBe(0);
  });

  it("collects multiple distinct Roman numerals", () => {
    const m = [
      slide(1, "IV · 01 — Intro"),
      slide(2, "V · 01 — Overview"),
      slide(3, "VI · 02b — Salt Bench"),
    ];
    const parts = manifestParts(m);
    expect(parts.has("IV")).toBe(true);
    expect(parts.has("V")).toBe(true);
    expect(parts.has("VI")).toBe(true);
    expect(parts.size).toBe(3);
  });

  it("is case-normalised to uppercase", () => {
    const m = [slide(1, "vi · 01 — lowercase")];
    const parts = manifestParts(m);
    expect(parts.has("VI")).toBe(true);
  });
});

// ── checkPartRefs ─────────────────────────────────────────────────────────────

describe("checkPartRefs", () => {
  function ref(text: string, file = "Budget.tsx", line = 10): CrossRef {
    return { text, file, line };
  }

  const partManifest = [
    slide(1, "IV · 01 — Foundation"),
    slide(2, "V · 01 — Strategy"),
    slide(3, "VI · 02b — Salt Bench Roster"),
    slide(4, "Cover"),
  ];

  it("returns no errors when the referenced part exists in the manifest", () => {
    const errors = checkPartRefs(partManifest, [ref("VI")]);
    expect(errors).toHaveLength(0);
  });

  it("returns an error when the referenced part is absent from the manifest", () => {
    const errors = checkPartRefs(partManifest, [ref("VIII")]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("VIII");
    expect(errors[0].message).toContain("Budget.tsx:10");
  });

  it("returns no errors for a range ref when both endpoints exist", () => {
    const errors = checkPartRefs(partManifest, [ref("IV–VI")]);
    expect(errors).toHaveLength(0);
  });

  it("returns an error when one endpoint of a range is missing", () => {
    const errors = checkPartRefs(partManifest, [ref("IV–VIII")]);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('"VIII"');
    expect(errors[0].message).not.toContain('"IV"');
  });

  it("skips validation entirely when the manifest has no part-structured slides", () => {
    const plainManifest = [slide(1, "Cover"), slide(2, "Budget")];
    const errors = checkPartRefs(plainManifest, [ref("V"), ref("VI")]);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors when the refs list is empty", () => {
    const errors = checkPartRefs(partManifest, []);
    expect(errors).toHaveLength(0);
  });

  it("reports the correct file and line in the error message", () => {
    const errors = checkPartRefs(partManifest, [
      ref("IX", "src/pages/slides/Budget.tsx", 55),
    ]);
    expect(errors[0].message).toContain("src/pages/slides/Budget.tsx:55");
  });

  it("catches multiple stale part refs in one pass", () => {
    const errors = checkPartRefs(partManifest, [
      ref("VI"),
      ref("VII", "A.tsx", 1),
      ref("IX", "B.tsx", 2),
    ]);
    expect(errors).toHaveLength(2);
    expect(errors.map((e) => e.ref.text)).toContain("VII");
    expect(errors.map((e) => e.ref.text)).toContain("IX");
  });
});
