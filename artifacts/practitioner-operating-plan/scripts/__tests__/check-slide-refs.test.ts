/**
 * check-slide-refs.test.ts
 *
 * Covers three exported functions from scripts/check-slide-refs.ts:
 *   - collectEyebrows      — extracts "ROMAN · text" labels from slide source
 *   - collectTextCrossRefs — extracts (ROMAN · text) refs from source files
 *   - checkTextRefs        — validates refs against the eyebrow set
 *
 * Key scenarios tested:
 *   - Valid reference that matches an existing eyebrow → no error
 *   - Eyebrow renamed (text changed) → stale-ref error
 *   - Eyebrow moved to different part (Roman changed) → stale-ref error
 *   - Numeric refs (VIII · 06) are not collected as text cross-refs
 *   - Eyebrow with suffix text still satisfies a shorter cross-ref
 *   - Case-insensitive and whitespace-normalised matching
 *   - Parenthesised cross-refs do NOT self-validate as eyebrows
 */

import { describe, it, expect } from "vitest";
import {
  collectEyebrows,
  collectTextCrossRefs,
  checkTextRefs,
  type SourceFile,
  type CrossRef,
} from "../check-slide-refs.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

function src(path: string, content: string): SourceFile {
  return { path, content };
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
