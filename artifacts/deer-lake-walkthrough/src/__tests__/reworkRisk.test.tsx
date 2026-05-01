import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ReworkRisk from "../sections/ReworkRisk";

// Locks the contractor-pain pitch in <ReworkRisk />. The Ask and Recap
// sections already have lockedNumbers tests preventing the canonical
// $90k/mo language from drifting; this file extends the same kind of
// editorial guard to the Rework Risk section, which is the first thing
// in the walkthrough that names the contractor's pain.
//
// The locks here are intentionally claim-level, not full-paragraph:
// - the headline ("the doors got built too small")
// - the three top-level claim headlines (symptom / cause / fix)
// - the three Reveal labels (rework triggers, planning rhyme, locking
//   the plan)
// - the artifact links the "fix" reveal points at, since the whole
//   point of the section is to tell the contractor those artifacts
//   are already shipped and clickable.
//
// If a future agent rewrites the section's framing they must update
// this test on purpose, not by accident.

describe("Deer Lake walkthrough — ReworkRisk locks the headline", () => {
  const html = renderToStaticMarkup(<ReworkRisk />);

  it("names 'the doors got built too small' as the section headline", () => {
    expect(html).toContain("The doors got built too small.");
  });
});

describe("Deer Lake walkthrough — ReworkRisk locks the three top-level claims", () => {
  const html = renderToStaticMarkup(<ReworkRisk />);

  it("Claim 1 (the symptom) is present alongside the headline that restates it", () => {
    // The doors-too-small phrase is rendered twice: once as the
    // section headline, once as the Claim 1 card head. We assert
    // both occurrences so removing the Claim 1 card while keeping
    // the headline (or vice versa) breaks the test.
    const matches = html.match(/The doors got built too small\./g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("Claim 1 card carries the 'Claim 1 · The symptom' eyebrow", () => {
    // Locks the card-level structure too: if the eyebrow tag drifts
    // we want to know, since it's part of the editorial frame.
    expect(html).toContain("Claim 1 · The symptom");
  });

  it("Claim 2 (the cause) names planning with no rhyme or reason", () => {
    expect(html).toContain("The planning process has no rhyme or reason.");
  });

  it("Claim 3 (the fix) names securing the plan and building once", () => {
    expect(html).toContain("Secure the plan. Build it once.");
  });
});

describe("Deer Lake walkthrough — ReworkRisk locks the three Reveal labels", () => {
  const html = renderToStaticMarkup(<ReworkRisk />);

  it("first reveal labels the rework-triggers explainer", () => {
    expect(html).toContain("What rework actually looks like on this build");
  });

  it("second reveal labels the planning-process explainer", () => {
    expect(html).toContain("Why the planning process has no rhyme or reason");
  });

  it("third reveal labels the locking-the-plan explainer", () => {
    // renderToStaticMarkup escapes apostrophes inside attribute-free
    // text as &#x27;, so match either the raw or the escaped form.
    expect(html).toMatch(
      /What (?:'|&#x27;)locking the plan(?:'|&#x27;) actually means here/,
    );
  });
});

describe("Deer Lake walkthrough — ReworkRisk locks the already-shipped artifact links", () => {
  const html = renderToStaticMarkup(<ReworkRisk />);

  it("links to the practitioner workbench (the who-does-what artifact)", () => {
    expect(html).toContain("/practitioners-guide-v2/workbench");
  });

  it("links to /cockpit (the operator tablet artifact)", () => {
    // ROUTES.cockpit resolves to the walkthrough's BASE_URL +
    // "cockpit", so the rendered href ends with "/cockpit" regardless
    // of base. Match the trailing path segment to stay base-agnostic.
    expect(html).toMatch(/\/cockpit(?:["/])/);
  });
});
