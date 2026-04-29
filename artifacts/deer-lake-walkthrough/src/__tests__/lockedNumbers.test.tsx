import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Ask from "../sections/Ask";
import Recap from "../sections/Recap";

// Locks the canonical $90k/mo Deer Lake fee in the walkthrough.
// Source of truth: ask.recommended in the practitioner-operating-plan
// cost registry ($1,080,000/yr · $90,000/mo full-stack agency
// engagement). Already guarded in the practitioner deck, store plan,
// and practitioners-guide V2 lockedNumbers tests; this file extends
// the guard to the walkthrough so the Ask + Recap copy can't drift.

describe("Deer Lake walkthrough — Ask reveal locks the $90k/mo fee", () => {
  const html = renderToStaticMarkup(<Ask />);

  it("names the $1,080,000 first-year total", () => {
    expect(html).toContain("$1,080,000");
  });

  it("names the $90,000 a month canonical rate", () => {
    expect(html).toContain("$90,000 a month");
  });

  it("frames the spend over twelve months so per-month math is unambiguous", () => {
    expect(html).toMatch(/twelve months|12 months/);
  });
});

describe("Deer Lake walkthrough — Recap Ask row locks the compact $90k/mo fee", () => {
  // Scope assertions to the Ask row specifically: each Recap row
  // renders as <label-cell><body-cell>, so the body text we care about
  // sits in the ~250 characters immediately following the ">Ask<"
  // label cell. Slicing there isolates this row from the other five.
  const html = renderToStaticMarkup(<Recap />);
  const askLabelIdx = html.indexOf(">Ask<");
  const askRowSlice = askLabelIdx >= 0 ? html.slice(askLabelIdx, askLabelIdx + 500) : "";

  it("isolates the Ask row from the rendered Recap", () => {
    expect(askLabelIdx).toBeGreaterThanOrEqual(0);
    expect(askRowSlice.length).toBeGreaterThan(0);
  });

  it("Ask row names the $1.08M year-one total in compact form", () => {
    expect(askRowSlice).toContain("$1.08M");
  });

  it("Ask row names the $90k/mo rate in compact form", () => {
    expect(askRowSlice).toContain("$90k/mo");
  });
});
