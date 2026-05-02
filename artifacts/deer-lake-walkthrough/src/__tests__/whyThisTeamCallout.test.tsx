import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import WhyThisTeam from "../sections/WhyThisTeam";

/**
 * Locks the Practitioner Operating Plan callout inside WhyThisTeam
 * against silent drift (task #535, updated for the two-stage pricing
 * model — Stage 1 $25,000 flat trial at $80/hr, Stage 2 $42,000/mo).
 *
 * The callout keeps the one-pager's eyebrow and $60k+/month headline
 * (general framing for what this class of engagement costs) but the
 * tier-ladder paragraph was replaced with the Deer Lake-specific two-
 * stage cost breakdown:
 *   Stage 1 — planning trial: $25,000 flat (8 weeks × $80/hr, practitioner solo)
 *   Stage 2 — distribution live: $42,000/month
 *     Tyler subcontracted for distribution joins the Practitioner.
 *     IT/Support partial + overhead.
 *     Gas card and insurance at cost on top.
 *     No employer payroll obligations on either party.
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

  it("names the Stage 1 $25,000 planning trial fee", () => {
    expect(html).toContain("$25,000");
  });

  it("names the $80/hr trial practitioner rate", () => {
    expect(html).toContain("$80/hr");
  });

  it("names the Stage 2 $42,000/month rate", () => {
    expect(html).toContain("$42,000/month");
  });

  it("names Tyler as subcontracted for distribution in Stage 2", () => {
    expect(html).toContain("Tyler subcontracted for distribution");
  });

  it("mentions gas card and insurance at cost (the variable component)", () => {
    expect(html).toContain("Gas card and insurance");
    expect(html).toContain("at cost");
  });

  it("notes no employer payroll obligations", () => {
    expect(html).toContain("No employer payroll obligations");
  });
});
