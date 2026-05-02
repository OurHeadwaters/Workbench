import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Ask from "../sections/Ask";
import Recap from "../sections/Recap";
import WhoWorks from "../sections/WhoWorks";

// Locks the two-stage Deer Lake fee model in the walkthrough.
// Source of truth: V6 Headwaters Deer Lake engagement rates (hourly subcontract):
//   Stage 1 — planning trial: $25,000 flat (8 weeks · $150/hr billed · practitioner solo)
//             Below cost — intentional entry price (8 wk × 40 hr × $150 = $48k full cost).
//   Stage 2 — distribution live: $35,200/month
//     Bobbie $150/hr × 160 hr/mo = $24,000
//     Tyler subcontracted for distribution $70/hr × 160 hr/mo = $11,200
//     Gas card and insurance at cost on top. No IT/Support line (rolled under Tyler).
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

describe("Deer Lake walkthrough — Ask reveal locks the two-stage Headwaters fee", () => {
  const html = renderToStaticMarkup(<Ask />);

  it("names the Stage 1 planning trial fee of $25,000", () => {
    expect(html).toContain("$25,000");
  });

  it("names the $150/hr billed rate for Stage 1", () => {
    expect(html).toContain("$150/hr");
  });

  it("names the Stage 2 monthly rate of $35,200", () => {
    expect(html).toContain("$35,200");
  });

  it("names Tyler as subcontracted for distribution in Stage 2", () => {
    expect(html).toContain("Tyler subcontracted for distribution");
  });
});

describe("Deer Lake walkthrough — Recap Ask row locks the two-stage fee", () => {
  // Scope assertions to the Ask row specifically: each Recap row
  // renders as <label-cell><body-cell>, so the body text we care about
  // sits in the ~400 characters immediately following the ">Ask<"
  // label cell. Slicing there isolates this row from the other five.
  const html = renderToStaticMarkup(<Recap />);
  const askLabelIdx = html.indexOf(">Ask<");
  const askRowSlice = askLabelIdx >= 0 ? html.slice(askLabelIdx, askLabelIdx + 600) : "";

  it("isolates the Ask row from the rendered Recap", () => {
    expect(askLabelIdx).toBeGreaterThanOrEqual(0);
    expect(askRowSlice.length).toBeGreaterThan(0);
  });

  it("Ask row names the Stage 1 $25,000 trial fee", () => {
    expect(askRowSlice).toContain("$25,000");
  });

  it("Ask row names the Stage 2 $35,200/mo rate", () => {
    expect(askRowSlice).toContain("$35,200/mo");
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
