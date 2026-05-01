import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Ask from "../sections/Ask";
import Recap from "../sections/Recap";
import WhoWorks from "../sections/WhoWorks";

// Locks the canonical ~$41k/mo Deer Lake fee in the walkthrough.
// Source of truth: actual Headwaters Deer Lake engagement rates (updated
// task #597 — reframe from employee rates to independent-business rates):
//   Practitioner (independent consultant) $150/hr × 160 hrs = $24,000/mo
//   Tyler subcontract (Tyler's business, Tyler + helper) $70/hr × 160 hrs = $11,200/mo
//   IT/Support partial ~$900/mo
//   Overhead $5,000/mo
//   Total ≈ $41,100/mo → displayed as ~$41,000/mo, ~$492,000/yr
//   Gas card and insurance at cost on top.
// No Ontario employer payroll obligations on either Headwaters party.
// This file guards the Ask + Recap copy so the numbers can't drift.
//
// This file also locks the year-one home-margin figure introduced in
// task #531 — about $125,000 to $200,000 of grocery margin stays in
// Deer Lake in year one. The employment picture (task #595): 4 FT
// roles (contractor couple + Headwaters practitioner + distribution
// lead) plus a band casual pool of 15+ getting paid hours weekly.
// The figure is a derived number, not a free input, so a future agent
// that touches the inputs must update the derived figure too. The math:
//   Deer Lake's annual grocery spend ........ $1.6M – $2.0M
//   Year-one share captured by new store .... 30% – 40%
//   Extra margin retained per dollar ........ 26¢   (84¢ on the shelf
//                                                    vs 58¢ today)
//   Floor   = $1.6M × 0.30 × 0.26 ≈ $124.8k → "~$125k"
//   Ceiling = $2.0M × 0.40 × 0.26 ≈ $208.0k → "~$200k" (rounded down
//                                                       to a friendly
//                                                       round figure)
// The same figure is mirrored on FinancialsRole.tsx and
// BandCouncilSummary.tsx in the Deer Lake store-plan deck, where it
// is locked by that deck's lockedNumbers.test.ts.

describe("Deer Lake walkthrough — Ask reveal locks the ~$41k/mo Headwaters fee", () => {
  const html = renderToStaticMarkup(<Ask />);

  it("names the ~$492,000 first-year Headwaters fee total", () => {
    expect(html).toContain("$492,000");
  });

  it("names the ~$41,000 a month rate", () => {
    expect(html).toContain("$41,000");
  });

  it("frames the spend over twelve months so per-month math is unambiguous", () => {
    expect(html).toMatch(/twelve months|12 months/);
  });

  it("names the $150/hr practitioner rate", () => {
    expect(html).toContain("$150/hr");
  });

  it("names the $70/hr Tyler subcontract rate", () => {
    expect(html).toContain("$70/hr");
  });
});

describe("Deer Lake walkthrough — Recap Ask row locks the compact ~$41k/mo Headwaters fee", () => {
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

  it("Ask row names the ~$492k year-one total in compact form", () => {
    expect(askRowSlice).toContain("$492k");
  });

  it("Ask row names the ~$41k/mo rate in compact form", () => {
    expect(askRowSlice).toContain("$41k/mo");
  });
});

describe("Deer Lake walkthrough — Ask reveal locks the year-one home-margin figure", () => {
  // Reveal renders its children even when collapsed (it animates them
  // open via CSS grid-rows), so the static markup contains every
  // Reveal's body. We can assert against the whole rendered string
  // for the "What the band gets back" reveal.
  const html = renderToStaticMarkup(<Ask />);

  it("names the $125,000 to $200,000 year-one home-margin figure", () => {
    expect(html).toContain("$125,000 to $200,000");
  });

  it("shows the 30 to 40 percent year-one capture rate the figure derives from", () => {
    expect(html).toMatch(/30 to 40 percent/);
  });

  it("shows the $1.6–2.0M Deer Lake grocery-spend input", () => {
    // En-dash (U+2013) on purpose — same character used in source copy.
    expect(html).toContain("$1.6–2.0M");
  });

  it("shows the 26¢ extra-on-the-shelf margin retention", () => {
    expect(html).toContain("26¢");
  });

  it("frames the 26¢ as 84¢ on the shelf instead of 58¢", () => {
    expect(html).toContain("84¢ on the shelf, not 58¢");
  });

  it("names the four full-time roles and the 15+ band casual pool", () => {
    expect(html).toMatch(/four full-time roles/);
    expect(html).toContain("15+");
  });
});

describe("Deer Lake walkthrough — Recap 'Back home' row locks the compact $125k–$200k figure", () => {
  // Same row-isolation trick used for the Ask row above. The Recap
  // body cell sits in the ~250 characters immediately following the
  // ">Back home<" label cell.
  const html = renderToStaticMarkup(<Recap />);
  const labelIdx = html.indexOf(">Back home<");
  const rowSlice = labelIdx >= 0 ? html.slice(labelIdx, labelIdx + 500) : "";

  it("isolates the Back home row from the rendered Recap", () => {
    expect(labelIdx).toBeGreaterThanOrEqual(0);
    expect(rowSlice.length).toBeGreaterThan(0);
  });

  it("Back home row names the ~$125k–$200k year-one home-margin figure", () => {
    // En-dash (U+2013) — same character used in source copy.
    expect(rowSlice).toContain("~$125k–$200k");
  });

  it("Back home row names the 4 FT roles and the 15+ band casual pool", () => {
    expect(rowSlice).toContain("4 FT");
    expect(rowSlice).toContain("15+");
  });
});

describe("Deer Lake walkthrough — WhoWorks bullet locks the compact $125k–$200k figure", () => {
  // WhoWorks restates the same year-one home-margin figure that lives
  // on the Ask reveal, the Recap row, FinancialsRole, and
  // BandCouncilSummary. The derivation math is documented at the top
  // of this file — do not duplicate it here. This guard just pins the
  // surface so a future edit can't drift WhoWorks out of step with
  // the other four surfaces.
  const html = renderToStaticMarkup(<WhoWorks />);

  it("names the ~$125k–$200k year-one home-margin figure", () => {
    // En-dash (U+2013) — same character used in source copy.
    expect(html).toContain("$125k–$200k");
  });

  it("frames the figure against today's 58¢ on the dollar leakage", () => {
    expect(html).toContain("58¢ on the dollar");
  });

  it("anchors the four full-time roles and the 15+ band casual pool", () => {
    expect(html).toContain("15+");
    expect(html).toMatch(/Four full-time roles/);
  });
});
