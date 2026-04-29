import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import OpenRecords from "../embed/OpenRecords";
import DailyClose from "../embed/DailyClose";
import MonthEnd from "../embed/MonthEnd";
import { SAMPLE } from "../embed/sampleData";

// Locks the three public embed routes shipped in task #526.
//
// The Deer Lake walkthrough loads these as iframes. Two contracts:
//   1. Each embed renders its own surface (open-records, daily-close,
//      month-end) populated from the shared sample dataset.
//   2. Each embed wears the "Sample · Deer Lake demo" badge so a
//      councillor never confuses the demo numbers for real numbers.
//   3. The App Router registers all three routes as plain (un-gated)
//      Routes so they don't sit behind Clerk auth.

const APP_TSX_PATH = join(import.meta.dirname, "..", "App.tsx");

describe("Embed routes — sample-data badge", () => {
  it.each([
    ["open-records", <OpenRecords key="o" />],
    ["daily-close", <DailyClose key="d" />],
    ["month-end", <MonthEnd key="m" />],
  ] as const)("%s wears the sample badge", (_id, element) => {
    const html = renderToStaticMarkup(element);
    expect(html).toContain(SAMPLE.brand);
    expect(html).toMatch(/data-testid="embed-sample-badge"/);
  });
});

describe("Embed routes — content from the shared sample dataset", () => {
  it("open-records lists every cost centre", () => {
    const html = renderToStaticMarkup(<OpenRecords />);
    for (const cc of SAMPLE.costCentres) {
      expect(html).toContain(cc.code);
      expect(html).toContain(cc.name);
    }
  });

  it("daily-close shows drawer + deposit + kicked items", () => {
    const html = renderToStaticMarkup(<DailyClose />);
    expect(html).toContain("Cash drawer");
    expect(html).toContain("Deposit slip");
    expect(html).toContain("Kicked to the bookkeeper");
    // Every kicked item shows up.
    for (let i = 0; i < SAMPLE.dailyClose.kickedToBookkeeper.length; i++) {
      expect(html).toContain(`data-testid="kicked-row-${i}"`);
    }
  });

  it("month-end shows P&L rows, variances, and a sign-off line", () => {
    const html = renderToStaticMarkup(<MonthEnd />);
    expect(html).toContain("Cost-centre P&amp;L");
    expect(html).toContain("Top variances");
    expect(html).toContain("Sign-off");
    expect(html).toContain(SAMPLE.signOff.preparedBy);
    expect(html).toContain(SAMPLE.signOff.presentedTo);
    for (let i = 0; i < SAMPLE.variances.length; i++) {
      expect(html).toContain(`data-testid="variance-row-${i}"`);
    }
  });
});

describe("App.tsx — embed routes are registered un-gated", () => {
  const source = readFileSync(APP_TSX_PATH, "utf8");

  it.each(["open-records", "daily-close", "month-end"])(
    "/embed/%s is mounted as a plain Route, not a ProtectedRoute",
    (slug) => {
      // The route line itself must use <Route ...>, not <ProtectedRoute ...>.
      // We check the immediate context around the path string.
      const idx = source.indexOf(`/embed/${slug}`);
      expect(idx, `/embed/${slug} present`).toBeGreaterThanOrEqual(0);
      // Find the start of the JSX tag by walking back to the previous '<'.
      const openIdx = source.lastIndexOf("<", idx);
      expect(openIdx, "tag open present").toBeGreaterThanOrEqual(0);
      const tagPrefix = source.slice(openIdx, idx);
      expect(
        tagPrefix,
        `/embed/${slug} must be a plain <Route ...>, not protected`,
      ).toMatch(/^<Route\b/);
      expect(tagPrefix).not.toMatch(/ProtectedRoute/);
    },
  );

  it("imports the three embed components", () => {
    expect(source).toMatch(/EmbedOpenRecords[\s\S]*from\s+"@\/embed\/OpenRecords"/);
    expect(source).toMatch(/EmbedDailyClose[\s\S]*from\s+"@\/embed\/DailyClose"/);
    expect(source).toMatch(/EmbedMonthEnd[\s\S]*from\s+"@\/embed\/MonthEnd"/);
  });
});
