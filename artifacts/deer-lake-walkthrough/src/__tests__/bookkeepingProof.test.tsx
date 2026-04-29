import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import BookkeepingProof from "../sections/BookkeepingProof";
import WhatHeadwatersDelivers from "../sections/WhatHeadwatersDelivers";

// Locks the in-page bookkeeping proof shipped in task #526.
//
// The contract: scrolling the walkthrough between WhatHeadwatersDelivers
// and WhyThisTeam, the reader hits a dedicated bookkeeping section with
// three live previews loaded from the Headwaters Books embed routes.
// The old "Proof for line 1" Reveal in WhatHeadwatersDelivers is gone
// because its job is now done by this section.

const APP_TSX_PATH = join(import.meta.dirname, "..", "App.tsx");

describe("BookkeepingProof — three embedded previews", () => {
  const html = renderToStaticMarkup(<BookkeepingProof />);

  it("renders the section anchor target so deep links land on it", () => {
    expect(html).toContain('id="bookkeeping-proof"');
  });

  it("embeds all three Headwaters Books embed routes", () => {
    expect(html).toContain("/headwaters-books/embed/open-records");
    expect(html).toContain("/headwaters-books/embed/daily-close");
    expect(html).toContain("/headwaters-books/embed/month-end");
  });

  it("loads each preview as a lazy iframe", () => {
    const iframeTags = html.match(/<iframe\b[^>]*>/g) ?? [];
    expect(iframeTags.length).toBe(3);
    for (const tag of iframeTags) {
      expect(tag).toContain('loading="lazy"');
      expect(tag).toMatch(/src="\/headwaters-books\/embed\/[^"]+"/);
    }
  });

  it("keeps the open-in-another-tab link to the deeper app", () => {
    expect(html).toMatch(/href="\/headwaters-books\/"[^>]*target="_blank"/);
  });

  it("names the three captions a councillor expects", () => {
    expect(html).toContain("Open-records ledger");
    expect(html).toContain("Daily close");
    expect(html).toContain("Month-end pack");
  });
});

describe("App.tsx — bookkeeping section sits between Delivers and WhyThisTeam", () => {
  const source = readFileSync(APP_TSX_PATH, "utf8");

  it("imports BookkeepingProof", () => {
    expect(source).toMatch(/import\s+BookkeepingProof\s+from\s+"@\/sections\/BookkeepingProof"/);
  });

  it("renders BookkeepingProof after WhatHeadwatersDelivers and before WhyThisTeam", () => {
    // Other sections (e.g. CockpitTeaser) may sit between Delivers and
    // BookkeepingProof. The bookkeeping section's job is to land before
    // WhyThisTeam so the bookkeeping story is felt before the
    // credibility wall.
    const deliversIdx = source.indexOf("<WhatHeadwatersDelivers");
    const bookkeepingIdx = source.indexOf("<BookkeepingProof");
    const whyTeamIdx = source.indexOf("<WhyThisTeam");
    expect(deliversIdx, "<WhatHeadwatersDelivers /> present").toBeGreaterThanOrEqual(0);
    expect(bookkeepingIdx, "<BookkeepingProof /> present").toBeGreaterThan(deliversIdx);
    expect(whyTeamIdx, "<WhyThisTeam /> present").toBeGreaterThan(bookkeepingIdx);
  });

});

describe("WhatHeadwatersDelivers — old Line 1 Reveal is gone", () => {
  const html = renderToStaticMarkup(<WhatHeadwatersDelivers />);

  it("no longer renders the Proof for line 1 Reveal", () => {
    expect(html).not.toMatch(/Proof for line 1/);
  });

  it("still renders the Line 2 and Line 3 Reveals", () => {
    expect(html).toMatch(/Proof for line 2/);
    expect(html).toMatch(/Proof for line 3/);
  });

  it("keeps all three line-item heads above the fold", () => {
    expect(html).toContain("Till, books, open-records software.");
    expect(html).toContain("Cold-chain plan, truck route, ninety-day pilot.");
    expect(html).toContain("Staff training, written guide, steering committee.");
  });
});
