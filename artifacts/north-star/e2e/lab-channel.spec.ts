/**
 * Lab channel e2e tests
 *
 * Covers:
 *  1. Creating a lab from ChannelsPage → landing on LabPage
 *  2. Expiry countdown badge visible in LabPage header
 *  3. Posting a human reply and verifying it appears in the feed
 *  4. Archiving a lab blocks new posts (read-only state)
 */

import { test, expect, type Page } from "@playwright/test";

// Minimal seeded zustand persist state that marks onboarding complete.
// Must match the north-star:v1 persist key and schema version 11.
const SEED_STORE = JSON.stringify({
  state: {
    schemaVersion: 11,
    installedAt: new Date().toISOString(),
    onboarding: { completed: true, step: 0 },
    channels: [],
    constellations: [],
    contracts: [],
    contractMilestones: [],
    dailyPicks: {},
    weeklyReviews: [],
    seasonalReviews: [],
    guide: { lastSectionByChapter: {} },
    captures: [],
    dismissedNudges: {},
    pendingReplies: {},
    contentBank: [],
    inbox: { keywords: [], senders: [], enabled: false, hatLabels: [] },
    gmailAccounts: [],
    workbenchPlan: null,
    helpingHandsTasks: [],
    triggers: [],
    improvementProposals: [],
    zoneRanking: ["Z0", "Z1", "Z2", "Z3", "Z4", "Z5"],
    statement: null,
  },
  version: 11,
});

/**
 * Inject localStorage keys before the page script runs so neither the
 * password gate nor the onboarding guard fires.
 */
async function seedLocalStorage(page: Page) {
  await page.addInitScript((seed: string) => {
    localStorage.setItem("north-star:unlocked", "1");
    // Only seed the store if there is no existing state (avoids clobbering a
    // live store on repeated runs).
    if (!localStorage.getItem("north-star:v1")) {
      localStorage.setItem("north-star:v1", seed);
    } else {
      // Patch the onboarding flag without disturbing other state.
      try {
        const raw = localStorage.getItem("north-star:v1")!;
        const parsed = JSON.parse(raw) as { state: Record<string, unknown>; version: number };
        (parsed.state as Record<string, unknown>).onboarding = { completed: true, step: 0 };
        localStorage.setItem("north-star:v1", JSON.stringify(parsed));
      } catch {
        localStorage.setItem("north-star:v1", seed);
      }
    }
  }, SEED_STORE);
}

// The base URL in playwright.config.ts is http://localhost:9000/north-star/
// page.goto("channels") → http://localhost:9000/north-star/channels
// page.goto(".") → http://localhost:9000/north-star/

test.describe("Lab channel", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
  });

  // ── 1. Create lab and land on LabPage ──────────────────────────────────────
  test("creates a lab from ChannelsPage and navigates to LabPage", async ({ page }) => {
    await page.goto("channels");
    await expect(page.getByRole("heading", { name: "Channels" })).toBeVisible({ timeout: 15_000 });

    // Open the Start Lab bottom sheet
    await page.getByRole("button", { name: /start lab/i }).click();
    await expect(page.getByRole("heading", { name: "Start Lab" })).toBeVisible({ timeout: 8_000 });

    const labName = `test-lab-${Date.now()}`;
    await page.getByPlaceholder("e.g. deer-lake-spike").fill(labName);
    await page.getByRole("button", { name: "Open Lab" }).click();

    // Should navigate to LabPage
    await expect(page).toHaveURL(/\/channels\/lab\/[a-z0-9-]+/, { timeout: 10_000 });

    // Lab title visible in header
    await expect(page.locator("h1")).toContainText(labName, { timeout: 8_000 });
  });

  // ── 2. Expiry countdown badge ──────────────────────────────────────────────
  test("expiry countdown badge is visible in LabPage header after lab creation", async ({ page }) => {
    await page.goto("channels");
    await page.getByRole("button", { name: /start lab/i }).click();
    await page.getByPlaceholder("e.g. deer-lake-spike").fill(`countdown-lab-${Date.now()}`);
    await page.getByRole("button", { name: "Open Lab" }).click();
    await expect(page).toHaveURL(/\/channels\/lab\/[a-z0-9-]+/, { timeout: 10_000 });

    // The header badge contains amber-colored text like "2h left" or "1h 59m left".
    // It is a <span> that includes a Clock icon and text ending in "left".
    const countdownBadge = page.locator("span").filter({ hasText: /\d+.*left/ });
    await expect(countdownBadge.first()).toBeVisible({ timeout: 8_000 });
  });

  // ── 3. Post a human reply and verify it in the feed ───────────────────────
  test("posting a human reply appears in the feed", async ({ page }) => {
    await page.goto("channels");
    await page.getByRole("button", { name: /start lab/i }).click();
    await page.getByPlaceholder("e.g. deer-lake-spike").fill(`reply-lab-${Date.now()}`);
    await page.getByRole("button", { name: "Open Lab" }).click();
    await expect(page).toHaveURL(/\/channels\/lab\/[a-z0-9-]+/, { timeout: 10_000 });

    const replyText = "Hello from the automated test";
    await page.getByPlaceholder("Reply to the lab…").fill(replyText);
    await page.getByRole("button", { name: "Send" }).click();

    // Reply appears in the chat feed
    await expect(page.getByText(replyText)).toBeVisible({ timeout: 8_000 });

    // Textarea cleared after sending
    await expect(page.getByPlaceholder("Reply to the lab…")).toHaveValue("", { timeout: 5_000 });
  });

  // ── 4. Archived lab is read-only ──────────────────────────────────────────
  test("archived lab blocks new posts and shows read-only state", async ({ page }) => {
    // Create a lab
    await page.goto("channels");
    await page.getByRole("button", { name: /start lab/i }).click();
    const labName = `archive-lab-${Date.now()}`;
    await page.getByPlaceholder("e.g. deer-lake-spike").fill(labName);
    await page.getByRole("button", { name: "Open Lab" }).click();
    await expect(page).toHaveURL(/\/channels\/lab\/([a-z0-9-]+)/, { timeout: 10_000 });

    // Go back to channels
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByRole("heading", { name: "Channels" })).toBeVisible({ timeout: 8_000 });

    // Archive the lab via the row's archive button (aria-label="Archive lab")
    await page.getByRole("button", { name: "Archive lab" }).click();

    // Click the now-archived row to navigate into the LabPage
    // The row is a div with the lab name text; clicking it navigates to LabPage
    // because lab rows always have an onClick regardless of archive state.
    await page.locator("p.truncate", { hasText: labName }).click();
    await expect(page).toHaveURL(/\/channels\/lab\/[a-z0-9-]+/, { timeout: 10_000 });

    // Header shows "archived" badge
    await expect(page.locator("span").filter({ hasText: /^archived$/ })).toBeVisible({ timeout: 8_000 });

    // Reply textarea is absent (read-only mode)
    await expect(page.getByPlaceholder("Reply to the lab…")).not.toBeVisible({ timeout: 5_000 });

    // Footer message confirms read-only state
    await expect(
      page.getByText("This lab is archived — no new events can be posted.")
    ).toBeVisible({ timeout: 5_000 });
  });
});
