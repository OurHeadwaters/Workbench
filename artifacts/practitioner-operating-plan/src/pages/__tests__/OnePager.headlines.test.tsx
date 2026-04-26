import * as React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Router } from "wouter";

import OnePager from "../OnePager";

void React;

// SSR-safe wouter location hook (mirrors Today.layout.test.tsx). The
// OnePager itself doesn't navigate, but Router context is required for
// any nested components that may call wouter hooks downstream.
const staticHook = (): [string, (to: string) => void] => ["/onepager", () => {}];

function render(): string {
  return renderToStaticMarkup(
    <Router hook={staticHook as never}>
      <OnePager />
    </Router>,
  );
}

// Strip HTML tags so substring matches survive React's tendency to
// split text across <span>/<sup>/etc. boundaries during SSR. The
// rendered prose we care about ("~$148.5k install ... + ~$22.5k travel
// pass-through* + $30k first-year retainer ≈ ~$201k Y1 all-in") is
// fragmented by the footnote <sup> tags otherwise, and a literal
// substring assertion would silently fail to find it.
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

describe("OnePager — cross-reserve panel headlines render from shared defaults", () => {
  // Component-level guard for Task #243: pinning the live derivations
  // and the formatter outputs (in crossReserve.test.ts) is necessary
  // but not sufficient — a future copy edit could swap one of these
  // formatter calls back to a hardcoded literal and the registry-side
  // tests would still pass. This test renders the actual OnePager to
  // static markup and asserts the four monetary headlines plus the
  // big "~$201,000" sticker appear, so any wiring drift between the
  // computed values and the rendered prose fails loudly here.

  it("renders the four monetary headlines (install / travel / retainer / Y1) at default state", () => {
    const text = stripTags(render());
    // Prose paragraph headlines.
    expect(text).toContain("~$148.5k install");
    expect(text).toContain("~$22.5k travel pass-through");
    expect(text).toContain("$30k first-year retainer");
    expect(text).toContain("~$201k Y1 all-in");
  });

  it("renders the Reserve #2 Y1 all-in big-number sticker as ~$201,000 at default state", () => {
    const text = stripTags(render());
    // The big-number panel uses formatPlanningDollars (long form),
    // not formatPlanningK, because the layout has space for the
    // comma-grouped dollar amount.
    expect(text).toContain("~$201,000");
  });

  it("renders the install shape (12-week / ~30 on-site / ~24 remote) inline with the install fee", () => {
    const text = stripTags(render());
    // These come from the shared cross-reserve-defaults install shape;
    // they were already wired in Task #239 but pinning them here keeps
    // the install paragraph as a single anchor point against future
    // drift.
    expect(text).toContain("12-week stint");
    expect(text).toContain("~30 on-site");
    expect(text).toContain("~24 remote days");
  });
});
