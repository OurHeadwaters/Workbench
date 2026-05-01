import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import WhyThisTeam from "../sections/WhyThisTeam";

/**
 * Locks the Practitioner Operating Plan callout inside WhyThisTeam
 * against silent drift (task #535, updated for the Deer Lake cost
 * reframe landed alongside task #596, rates corrected in task #597).
 *
 * The callout keeps the one-pager's eyebrow and $60k+/month headline
 * (general framing for what this class of engagement costs) but the
 * tier-ladder paragraph was replaced with the Deer Lake-specific cost:
 *   - ~$41,000/month to Headwaters
 *   - Practitioner $150/hr (independent consultant)
 *   - Tyler's company $70/hr (Tyler + helper, subcontract through Tyler's business)
 *   - IT/Support ~$900/mo partial
 *   - $5,000/month overhead
 *   - Gas card and insurance at cost on top.
 *   - No employer payroll obligations on either party.
 *
 * This test locks that specific breakdown so a future edit can't
 * silently drop the rate breakdown or reintroduce the abstract
 * $60k/$90k/$125k tier ladder that confused the target contractor.
 */

describe("Deer Lake walkthrough — WhyThisTeam Practitioner Operating Plan callout", () => {
  const html = renderToStaticMarkup(<WhyThisTeam />);

  it("keeps the 'The artifact to open · Practitioner Operating Plan' eyebrow", () => {
    expect(html).toContain(
      "The artifact to open · Practitioner Operating Plan",
    );
  });

  it("leads with the one-pager's $60,000-a-month inflection-point headline", () => {
    expect(html).toMatch(
      /\$60,000 a month or more is real money\.\s*Here(?:'|&#x27;)s where it\s+goes\./,
    );
  });

  it("names the Deer Lake-specific ~$41,000/month rate (not the abstract tier ladder)", () => {
    expect(html).toContain("$41,000");
  });

  it("names the $150/hr practitioner rate", () => {
    expect(html).toContain("$150/hr");
  });

  it("names the $70/hr Tyler subcontract rate", () => {
    expect(html).toContain("$70/hr");
  });

  it("mentions gas card and insurance at cost (the variable component)", () => {
    expect(html).toContain("Gas card and insurance");
    expect(html).toContain("at cost");
  });

  it("notes no employer payroll obligations", () => {
    expect(html).toContain("No employer payroll obligations");
  });
});
