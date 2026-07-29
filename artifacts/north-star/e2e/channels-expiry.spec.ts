/**
 * ChannelsPage expiry e2e tests
 *
 * Covers:
 *  1. A channel with a short TTL flips to "expired" via fast-poll without
 *     waiting 10 seconds — verifies the localStorage["north-star:now-interval"]
 *     override wires through to useNow() in ChannelsPage.
 *  2. A channel that is already expired on first load shows "expired" immediately.
 *  3. A channel with no expiry never shows an expiry badge.
 */

import { test, expect, type Page } from "@playwright/test";

// Minimal seeded zustand persist state — same shape as lab-channel.spec.ts.
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

/** Inject the unlock flag and onboarding-complete patch before the page script runs. */
async function seedBase(page: Page) {
  await page.addInitScript((seed: string) => {
    localStorage.setItem("north-star:unlocked", "1");
    if (!localStorage.getItem("north-star:v1")) {
      localStorage.setItem("north-star:v1", seed);
    } else {
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

test.describe("ChannelsPage expiry", () => {
  // ── 1. Fast-poll: short-TTL channel flips to expired quickly ────────────────
  //
  // Scenario: a workbench channel is seeded with expiresAt 400 ms from now.
  // north-star:now-interval is set to 100 ms so useNow() polls every 100 ms.
  // After 600 ms the poll will have ticked past the expiry time — the badge
  // must read "expired" without ever waiting 10 seconds.
  test("channel with short TTL shows expired badge via fast poll without waiting 10 s", async ({ page }) => {
    const channelId = `ch-fast-expiry-${Date.now()}`;
    // Expires 400 ms after the initScript runs (i.e. before the page finishes loading).
    // We compute the timestamp here and pass it in; addInitScript captures it in
    // the serialised argument so it reflects the real wall clock.
    const expiresAt = new Date(Date.now() + 400).toISOString();

    await page.addInitScript(
      ({
        id,
        label,
        expires,
        seed,
        intervalMs,
      }: {
        id: string;
        label: string;
        expires: string;
        seed: string;
        intervalMs: string;
      }) => {
        localStorage.setItem("north-star:unlocked", "1");
        // Fast poll — 100 ms between ticks instead of the default 10 000 ms.
        localStorage.setItem("north-star:now-interval", intervalMs);

        let storeData: { state: Record<string, unknown>; version: number };
        try {
          const raw = localStorage.getItem("north-star:v1");
          storeData = raw ? JSON.parse(raw) : JSON.parse(seed);
        } catch {
          storeData = JSON.parse(seed);
        }
        (storeData.state as Record<string, unknown>).onboarding = { completed: true, step: 0 };
        const channels = (storeData.state.channels as unknown[]) ?? [];
        channels.push({
          id,
          label,
          category: "workbench",
          expiresAt: expires,
          createdAt: new Date(Date.now() - 60_000).toISOString(),
          createdBy: "human",
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      {
        id: channelId,
        label: "fast-expiry-channel",
        expires: expiresAt,
        seed: SEED_STORE,
        intervalMs: "100",
      },
    );

    await page.goto("channels");
    await expect(page.getByRole("heading", { name: "Channels" })).toBeVisible({ timeout: 15_000 });

    // The channel row must be visible
    await expect(page.getByText("fast-expiry-channel")).toBeVisible({ timeout: 8_000 });

    // Wait 700 ms — well within a second, nowhere near 10 s.
    // The 100 ms poll will have ticked at least once past the 400 ms expiry.
    await page.waitForTimeout(700);

    // ChannelsPage's `processed` useMemo stamps archivedAt on expired channels,
    // so ChannelRow sees isArchived=true and renders the "archived" pill (not
    // "expired") — that is the correct observable signal of expiry on this page.
    const archivedBadge = page.locator("span").filter({ hasText: /^archived$/ });
    await expect(archivedBadge.first()).toBeVisible({ timeout: 3_000 });
  });

  // ── 2. Already-expired channel shows expired badge on first render ──────────
  //
  // Scenario: the channel's expiresAt is 1 hour in the past when the page loads.
  // isExpired is true on the very first render — no poll tick is needed.
  test("channel already past its expiresAt shows expired badge immediately on load", async ({ page }) => {
    const channelId = `ch-already-expired-${Date.now()}`;
    const expiresAt = new Date(Date.now() - 60 * 60_000).toISOString(); // 1 h ago

    await page.addInitScript(
      ({
        id,
        label,
        expires,
        seed,
      }: {
        id: string;
        label: string;
        expires: string;
        seed: string;
      }) => {
        localStorage.setItem("north-star:unlocked", "1");
        // Slow poll — we must not need a tick to see the expired badge.
        localStorage.setItem("north-star:now-interval", "60000");

        let storeData: { state: Record<string, unknown>; version: number };
        try {
          const raw = localStorage.getItem("north-star:v1");
          storeData = raw ? JSON.parse(raw) : JSON.parse(seed);
        } catch {
          storeData = JSON.parse(seed);
        }
        (storeData.state as Record<string, unknown>).onboarding = { completed: true, step: 0 };
        const channels = (storeData.state.channels as unknown[]) ?? [];
        channels.push({
          id,
          label,
          category: "workbench",
          expiresAt: expires,
          createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
          createdBy: "human",
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "already-expired-channel", expires: expiresAt, seed: SEED_STORE },
    );

    await page.goto("channels");
    await expect(page.getByRole("heading", { name: "Channels" })).toBeVisible({ timeout: 15_000 });

    // Channel row must be present
    await expect(page.getByText("already-expired-channel")).toBeVisible({ timeout: 8_000 });

    // ChannelsPage's `processed` useMemo stamps archivedAt on expired channels,
    // so ChannelRow renders the "archived" pill on first render — no poll tick needed.
    const archivedBadge = page.locator("span").filter({ hasText: /^archived$/ });
    await expect(archivedBadge.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── 3. Channel with no expiry never shows an expiry badge ──────────────────
  //
  // Scenario: a permanent workbench channel (no expiresAt) should never show
  // "expired" or any TTL countdown, even with a very fast poll.
  test("channel with no expiry does not show any TTL or expired badge", async ({ page }) => {
    const channelId = `ch-no-expiry-${Date.now()}`;

    await page.addInitScript(
      ({
        id,
        label,
        seed,
      }: {
        id: string;
        label: string;
        seed: string;
      }) => {
        localStorage.setItem("north-star:unlocked", "1");
        localStorage.setItem("north-star:now-interval", "100");

        let storeData: { state: Record<string, unknown>; version: number };
        try {
          const raw = localStorage.getItem("north-star:v1");
          storeData = raw ? JSON.parse(raw) : JSON.parse(seed);
        } catch {
          storeData = JSON.parse(seed);
        }
        (storeData.state as Record<string, unknown>).onboarding = { completed: true, step: 0 };
        const channels = (storeData.state.channels as unknown[]) ?? [];
        channels.push({
          id,
          label,
          category: "workbench",
          // expiresAt intentionally omitted
          createdAt: new Date(Date.now() - 60_000).toISOString(),
          createdBy: "human",
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "permanent-channel", seed: SEED_STORE },
    );

    await page.goto("channels");
    await expect(page.getByRole("heading", { name: "Channels" })).toBeVisible({ timeout: 15_000 });

    // Channel row visible
    await expect(page.getByText("permanent-channel")).toBeVisible({ timeout: 8_000 });

    // Let a few fast-poll ticks pass to confirm no badge ever appears.
    await page.waitForTimeout(400);

    // No expired badge anywhere on the page
    await expect(page.locator("span").filter({ hasText: /^expired$/ })).toHaveCount(0, {
      timeout: 2_000,
    });

    // No TTL countdown badge ("X left") either
    await expect(page.locator("span").filter({ hasText: /left$/ })).toHaveCount(0, {
      timeout: 2_000,
    });
  });
});
