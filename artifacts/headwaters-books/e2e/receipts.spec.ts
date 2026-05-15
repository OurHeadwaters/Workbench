import { test, expect } from "@playwright/test";
import { setupClerkTestingToken } from "@clerk/testing/playwright";

test.describe("Receipts Queue page", () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("receipts");
    await page.waitForLoadState("networkidle");
  });

  test("shows 'Receipts Queue' heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Receipts Queue" }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("nav shows Receipts Queue link in sidebar", async ({ page }) => {
    const navLink = page.getByRole("link", { name: /receipts queue/i });
    await expect(navLink).toBeVisible({ timeout: 15_000 });
  });

  test("nav badge reflects uncleared receipt count", async ({ page }) => {
    const firstRow = page.locator('[data-testid^="clear-toggle-"]').first();
    const emptyState = page.getByText("All caught up");

    // Wait for React Query to resolve
    await Promise.race([
      firstRow.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {}),
      emptyState.waitFor({ state: "visible", timeout: 15_000 }),
    ]);

    const hasRows = await firstRow.isVisible().catch(() => false);
    const badge = page.locator("nav .badge, aside [class*='badge']").first();

    if (hasRows) {
      // Uncleared receipts exist — the nav badge MUST be visible
      await expect(badge).toBeVisible({ timeout: 5_000 });
    } else {
      // No uncleared receipts — the nav badge must NOT be visible
      await expect(badge).not.toBeVisible();
    }
  });

  test("renders receipt rows or empty state", async ({ page }) => {
    const emptyState = page.getByText("All caught up");
    const firstRow = page.locator('[data-testid^="clear-toggle-"]').first();

    // Wait for React Query to resolve — either rows or the empty state appear
    await Promise.race([
      firstRow.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {}),
      emptyState.waitFor({ state: "visible", timeout: 15_000 }),
    ]);

    const hasEmpty = await emptyState.isVisible().catch(() => false);
    const hasRows = await firstRow.isVisible().catch(() => false);

    expect(hasEmpty || hasRows).toBe(true);
  });

  test("toggling a receipt row marks it cleared", async ({ page }) => {
    const firstToggle = page.locator('[data-testid^="clear-toggle-"]').first();
    const emptyState = page.getByText("All caught up");

    await Promise.race([
      firstToggle.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {}),
      emptyState.waitFor({ state: "visible", timeout: 15_000 }),
    ]);

    const hasRows = await firstToggle.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstToggle.click();

    await expect(page.getByText(/marked as cleared/i)).toBeVisible({
      timeout: 8_000,
    });
  });
});
