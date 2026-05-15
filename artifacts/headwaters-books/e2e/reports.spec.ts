import { test, expect } from "@playwright/test";
import { setupClerkTestingToken } from "@clerk/testing/playwright";

test.describe("Reports page (/pnl)", () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("pnl");
    await page.waitForLoadState("networkidle");
  });

  test("shows 'Reports' heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("all three tabs are rendered", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "By Cost Centre" }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("button", { name: "P&L by Month" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "By Category" }),
    ).toBeVisible();
  });

  test("By Cost Centre tab renders revenue/costs/net summary cards", async ({
    page,
  }) => {
    await expect(
      page.getByText("Total Revenue").first(),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByText("Total Costs").first(),
    ).toBeVisible();
    await expect(
      page.getByText("Net Income").first(),
    ).toBeVisible();
  });

  test("P&L by Month tab renders chart or empty state", async ({ page }) => {
    await page.getByRole("button", { name: "P&L by Month" }).click();

    const chart = page.locator(".recharts-responsive-container").first();
    const noData = page.getByText("No monthly data in this period.");

    // Use explicit waitFor so React Query has time to fire after the tab click
    await Promise.race([
      chart.waitFor({ state: "visible", timeout: 20_000 }),
      noData.waitFor({ state: "visible", timeout: 20_000 }),
    ]);

    const hasChart = await chart.isVisible().catch(() => false);
    const hasNoData = await noData.isVisible().catch(() => false);
    expect(hasChart || hasNoData).toBe(true);
  });

  test("By Category tab renders sortable table or empty state", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "By Category" }).click();

    const categoryHint = page.getByText(/click column headers to sort/i);
    const noData = page.getByText("No category data in this period.");

    // Wait for React Query to load data — either the table hint or the empty
    // state must appear. Explicit waitFor is more reliable than networkidle
    // because RQ may not start its fetch until after networkidle fires.
    await Promise.race([
      categoryHint.waitFor({ state: "visible", timeout: 20_000 }),
      noData.waitFor({ state: "visible", timeout: 20_000 }),
    ]);

    if (await noData.isVisible().catch(() => false)) {
      test.skip();
      return;
    }

    await expect(categoryHint).toBeVisible();
  });

  test("By Category table sorts when Total column header is clicked", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "By Category" }).click();

    const categoryHint = page.getByText(/click column headers to sort/i);
    const noData = page.getByText("No category data in this period.");

    await Promise.race([
      categoryHint.waitFor({ state: "visible", timeout: 20_000 }),
      noData.waitFor({ state: "visible", timeout: 20_000 }),
    ]);

    if (await noData.isVisible().catch(() => false)) {
      test.skip();
      return;
    }

    // Parse a formatted en-CA CAD currency string (e.g. "$1,234.56", "-$500.00")
    // back to a number for order comparisons.
    const parseCad = (text: string): number => {
      const isNeg = text.trimStart().startsWith("-");
      const digits = text.replace(/[^0-9.]/g, "");
      const num = parseFloat(digits);
      return isNeg ? -num : num;
    };

    // Read all Total column values (last <td> in each <tbody> row)
    const getTotals = async () => {
      const cells = page.locator("tbody td:last-child");
      const texts = await cells.allTextContents();
      return texts.map(parseCad).filter((n) => !isNaN(n));
    };

    const totalHeader = page.locator("th").filter({ hasText: "Total" }).last();
    await expect(totalHeader).toBeVisible();

    // ── Ascending sort ────────────────────────────────────────────────────────
    await totalHeader.click();
    await page.waitForTimeout(300);
    const ascValues = await getTotals();

    if (ascValues.length >= 2) {
      const sorted = [...ascValues].sort((a, b) => a - b);
      expect(ascValues).toEqual(sorted);
    }

    // ── Descending sort ───────────────────────────────────────────────────────
    await totalHeader.click();
    await page.waitForTimeout(300);
    const descValues = await getTotals();

    if (descValues.length >= 2) {
      const sortedDesc = [...descValues].sort((a, b) => b - a);
      expect(descValues).toEqual(sortedDesc);
    }
  });
});
