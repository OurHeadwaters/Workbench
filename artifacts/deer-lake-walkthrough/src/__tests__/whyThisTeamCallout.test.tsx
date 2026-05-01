import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import WhyThisTeam from "../sections/WhyThisTeam";

/**
 * Locks the Practitioner Operating Plan callout inside WhyThisTeam
 * against silent drift (task #535, updated for the Deer Lake cost
 * reframe landed alongside task #596).
 *
 * The callout keeps the one-pager's eyebrow and $60k+/month headline
 * (general framing for what this class of engagement costs) but the
 * tier-ladder paragraph was replaced with the Deer Lake-specific cost:
 *   - $29,000/month fixed to Headwaters (Practitioner $80/hr, Tyler
 *     $35/hr, IT/Assistant $35/hr, $5k overhead)
 *   - Gas card and insurance at cost on top.
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
    // Whitespace-tolerant: the JSX wraps the headline across two
    // lines, so static markup may preserve an inline newline + indent
    // between "Here's where it" and "goes.". Apostrophe-tolerant:
    // renderToStaticMarkup escapes "'" as "&#x27;". Match the
    // meaningful sentence regardless of either detail.
    expect(html).toMatch(
      /\$60,000 a month or more is real money\.\s*Here(?:'|&#x27;)s where it\s+goes\./,
    );
  });

  it("names the Deer Lake-specific $29,000/month fixed rate (not the abstract tier ladder)", () => {
    expect(html).toContain("$29,000/month fixed");
  });

  it("names all three Headwaters roles with their hourly rates", () => {
    expect(html).toContain("$80/hr");
    expect(html).toContain("$35/hr");
  });

  it("mentions gas card and insurance at cost (the variable component)", () => {
    expect(html).toContain("Gas card and insurance");
    expect(html).toContain("at cost");
  });
});
