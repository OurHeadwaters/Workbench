import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import WhyThisTeam from "../sections/WhyThisTeam";

/**
 * Locks the Practitioner Operating Plan callout inside WhyThisTeam
 * against silent drift away from the one-pager's own $60k+/month
 * inflection-point framing (task #535).
 *
 * The walkthrough previously called the engagement "the $90,000-a-month
 * engagement total" — a mis-frame, since the one-pager itself leads
 * with "a community development contract at $60k+/month is a real
 * inflection point" and treats:
 *   - $60k  as the FLOOR tier,
 *   - $90k  as the RECOMMENDED rate (the rate this walkthrough uses),
 *   - $125k as the SCALE tier (once a second store is running).
 *
 * Nothing in the existing test suite caught the drift; a human did.
 * This file converts that human catch into a permanent CI guard:
 * editing the callout in a way that drops the eyebrow, the
 * $60k+/month inflection-point headline, or any of the three tiers
 * fails this test.
 *
 * Source-of-truth note. The standalone practitioner-operating-plan
 * artifact (which the task brief referenced as the home of
 * `OnePager.tsx` and `costRegistry.ts`) has been retired and its
 * content migrated into the practitioners-guide-v2 `/workbench`
 * archive page — see `lib/locked-fees/src/lockedFees.test.ts` for
 * the workspace-level audit that codifies the migration. There is
 * therefore no live `OnePager.tsx` whose headline string can be
 * imported as a shared constant; the optional second assertion in
 * the task brief is moot. The $60k / $90k / $125k tier values
 * themselves are also guarded elsewhere (Ask + Recap rows lock $90k
 * in `lockedNumbers.test.tsx`; the deer-lake store-plan deck locks
 * the full tier ladder). This test only locks the callout's own
 * framing — eyebrow, inflection-point headline, and the three-tier
 * mention.
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

  it("frames $60k as the FLOOR tier", () => {
    // Tier values render inside a font-semibold span followed by the
    // tier label in plain text. Anchoring on `</span> floor` pins the
    // assertion to the floor-tier span specifically.
    expect(html).toMatch(/\$60k\s*<\/span>\s*floor/);
  });

  it("frames $90k as the RECOMMENDED tier the walkthrough uses", () => {
    expect(html).toMatch(/\$90k\s*<\/span>\s*recommended/);
    expect(html).toContain("the rate this walkthrough uses");
  });

  it("frames $125k as the SCALE tier (once a second store is running)", () => {
    expect(html).toMatch(/\$125k\s*<\/span>\s*once a/);
    expect(html).toMatch(/second store is running/);
  });
});
