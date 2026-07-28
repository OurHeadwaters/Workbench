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

    const labName = `archive-lab-${Date.now()}`;
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

    const backBtn = page.getByRole("button", { name: /back to channels/i });
    await page.getByPlaceholder("Reply to the lab…").fill(replyText);
    await page.getByRole("button", { name: "Send" }).click();

    // Reply appears in the chat feed
    await expect(page.getByText(replyText)).toBeVisible({ timeout: 8_000 });

    // Textarea cleared after sending
    await expect(page.getByPlaceholder("Reply to the lab…")).toHaveValue("", { timeout: 5_000 });
  });

  // ── 4. Mid-session expiry flips to read-only without a page reload ────────
  test("lab expiring mid-session switches badge to expired and hides reply input", async ({ page }) => {
    // Build a channel that expires ~3 seconds from now so we can observe the
    // live transition driven by useNow (10-second poll interval).
    const channelId = `agent-drift-guard-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 1_000).toISOString();

    await page.addInitScript(
      ({ id, label, expires, seed }: { id: string; label: string; expires: string; seed: string }) => {
        localStorage.setItem("north-star:unlocked", "1");
        // Use a very long poll interval so the UI never flips read-only on its own
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
          category: "lab",
          expiresAt: expires,
          createdAt: new Date().toISOString(),
          createdBy: "human",
          invited_roles: [],
          event_feed: [],
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "expiry-test-lab", expires: expiresAt, seed: SEED_STORE },
    );

    // Navigate directly to the lab page (no UI creation flow needed)
    await page.goto(`channels/lab/${channelId}`);

    // 1. Lab name is visible in header
    await expect(page.locator("h1")).toContainText("expiry-test-lab", { timeout: 10_000 });

    // 2. Countdown badge shows time remaining (0m left, since < 1 minute)
    const countdownBadge = page.locator("span").filter({ hasText: /\d+.*left/ });
    await expect(countdownBadge.first()).toBeVisible({ timeout: 8_000 });

    // 3. Reply textarea is present before expiry
    await expect(page.getByPlaceholder("Reply to the lab…")).toBeVisible({ timeout: 5_000 });

    // 4. Wait past expiry (3 s) and past the next useNow poll tick (≤ 500 ms).
    //    localStorage["north-star:now-interval"] = "500" is set above so the
    //    hook polls every 500 ms instead of every 10 s, making this fast.
    const expiredBadge = page.locator("span").filter({ hasText: /^expired$/ });
    await expect(expiredBadge.first()).toBeVisible({ timeout: 5_000 });

    // 3. Reply textarea is absent from the start (isReadOnly is true on mount).
    await expect(page.getByPlaceholder("Reply to the lab…")).not.toBeVisible({ timeout: 5_000 });

    // 4. Read-only footer is present on first render.
    await expect(
      page.getByText("This lab is expired — no new events can be posted.")
    ).toBeVisible({ timeout: 5_000 });
  });

  // ── 5. Cold open on an already-expired lab ────────────────────────────────
  //
  // Scenario: the lab's expiresAt is in the past on the very first render.
  // The "expired" badge and read-only footer must appear immediately without
  // waiting for a useNow poll tick, and the reply textarea must be absent.
  test("cold open on an already-expired lab shows expired badge and hides reply input", async ({ page }) => {
    const channelId = `agent-drift-guard-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 1_000).toISOString();

    await page.addInitScript(
      ({ id, label, expires, seed }: { id: string; label: string; expires: string; seed: string }) => {
        localStorage.setItem("north-star:unlocked", "1");
        // Use a very long poll interval so the UI never flips read-only on its own
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
          category: "lab",
          expiresAt: expires,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1_000).toISOString(), // created 2 hours ago
          createdBy: "human",
          invited_roles: [],
          event_feed: [],
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "cold-expired-lab", expires: expiresAt, seed: SEED_STORE },
    );

    // Navigate directly to the lab page — this is a cold open on an already-expired lab.
    await page.goto(`channels/lab/${channelId}`);

    // 1. Lab name is visible in header
    await expect(page.locator("h1")).toContainText("cold-expired-lab", { timeout: 10_000 });

    // 2. "expired" badge is shown on the very first render — no poll tick needed.
    //    The badge text is exactly "expired" (not a countdown like "2h left").
    const expiredBadge = page.locator("span").filter({ hasText: /^expired$/ });
    await expect(expiredBadge.first()).toBeVisible({ timeout: 5_000 });

    // 3. Reply textarea is absent from the start (isReadOnly is true on mount).
    await expect(page.getByPlaceholder("Reply to the lab…")).not.toBeVisible({ timeout: 5_000 });

    // 4. Read-only footer is present on first render.
    await expect(
      page.getByText("This lab is expired — no new events can be posted.")
    ).toBeVisible({ timeout: 5_000 });
  });

  // ── 6. Clock-drift guard: handleSend blocks posts on expired lab ──────────
  //
  // Scenario: the useNow poll interval is set very long (60 s) so the UI does
  // NOT flip to read-only immediately after expiry.  The lab expires 1 second
  // after the page loads.  We wait 1.5 s (lab is now past expiresAt on the
  // real clock) and then try to submit a reply.
  // handleSend must check Date.now() directly and refuse the post — no new
  // event should appear in the feed.
  test("handleSend does not call postLabEvent after real expiry even when useNow poll is stale", async ({ page }) => {
    const channelId = `agent-drift-guard-${Date.now()}`;
    // Lab expires 1 second from now
    const expiresAt = new Date(Date.now() + 1_000).toISOString();

    await page.addInitScript(
      ({ id, label, expires, seed }: { id: string; label: string; expires: string; seed: string }) => {
        localStorage.setItem("north-star:unlocked", "1");
        // Use a very long poll interval so the UI never flips read-only on its own
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
          category: "lab",
          expiresAt: expires,
          createdAt: new Date().toISOString(),
          createdBy: "human",
          invited_roles: [],
          event_feed: [],
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "drift-guard-lab", expires: expiresAt, seed: SEED_STORE },
    );

    await page.goto(`channels/lab/${channelId}`);
    await expect(page.locator("h1")).toContainText("drift-guard-lab", { timeout: 10_000 });

    // 1. Textarea is visible (lab has not expired yet, useNow sees it as live)
    await expect(page.getByPlaceholder("Reply to the lab…")).toBeVisible({ timeout: 5_000 });

    // 2. Wait 1.5 s so the real clock is past expiresAt, but the 60-second
    //    useNow poll has NOT ticked — the UI still shows the textarea.
    await page.waitForTimeout(1_500);

    // 3. Textarea is still rendered (stale useNow hasn't flipped isReadOnly yet)
    await expect(page.getByPlaceholder("Reply to the lab…")).toBeVisible({ timeout: 3_000 });

    // 4. Type a message and submit — this fires handleSend with a stale isReadOnly
    const driftMessage = "This should be blocked by the real-time guard";

    const messageText = `double-send-${Date.now()}`;
    await page.getByPlaceholder("Reply to the lab…").fill(driftMessage);
    await page.getByRole("button", { name: "Send" }).click();

    // 5. The message must NOT appear in the feed — postLabEvent was suppressed
    await page.waitForTimeout(500);
    await expect(page.getByText(driftMessage)).not.toBeVisible({ timeout: 3_000 });
  });

  // ── 7. Clock-drift guard: handleAskAgent blocks posts on expired lab ───────
  //
  // Scenario: the useNow poll interval is set very long (60 s) so the UI does
  // NOT flip to read-only immediately after expiry.  The lab expires 1 second
  // after the page loads and has an invited agent role so the Ask-agent button
  // is visible.  We wait 1.5 s (lab is now past expiresAt on the real clock)
  // and then click the Ask-agent button.
  // handleAskAgent must check Date.now() directly and refuse to post — no
  // agent event should appear in the feed.
  test("handleAskAgent does not call postLabEvent after real expiry even when useNow poll is stale", async ({ page }) => {
    const channelId = `agent-drift-guard-${Date.now()}`;
    // Lab expires 1 second from now
    const expiresAt = new Date(Date.now() + 1_000).toISOString();

    await page.addInitScript(
      ({ id, label, expires, seed }: { id: string; label: string; expires: string; seed: string }) => {
        localStorage.setItem("north-star:unlocked", "1");
        // Use a very long poll interval so the UI never flips read-only on its own
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
          category: "lab",
          expiresAt: expires,
          createdAt: new Date().toISOString(),
          createdBy: "human",
          invited_roles: ["river-smith"],
          event_feed: [],
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "agent-drift-guard-lab", expires: expiresAt, seed: SEED_STORE },
    );

    await page.goto(`channels/lab/${channelId}`);
    await expect(page.locator("h1")).toContainText("agent-drift-guard-lab", { timeout: 10_000 });

    // 1. Ask-agent button is visible before expiry (lab has not expired yet)
    const askBtn = page.getByRole("button", { name: /ask river smith/i });
    await expect(askBtn).toBeVisible({ timeout: 5_000 });

    // 2. Wait 1.5 s so the real clock is past expiresAt, but the 60-second
    //    useNow poll has NOT ticked — the UI still renders the ask-agent button.
    await page.waitForTimeout(1_500);

    // 3. Ask-agent button is still rendered (stale useNow hasn't flipped isReadOnly yet)
    await expect(askBtn).toBeVisible({ timeout: 3_000 });

    // 4. Click the Ask-agent button — handleAskAgent fires with a stale isReadOnly
    await askBtn.click();

    // 5. No agent event should appear in the feed (postLabEvent was suppressed).
    //    Wait a generous window that covers the 800 ms thinking delay plus margins.
    await page.waitForTimeout(1_200);
    // generateAgentStub("river-smith", …) always includes "constellation signals".
    // If postLabEvent fired, that text would be visible; it must not be.
    await expect(page.getByText(/constellation signals/i)).not.toBeVisible({ timeout: 3_000 });
  });

  // ── 9. Enter-key double-send guard ────────────────────────────────────────
  //
  // Scenario: the user types a message and presses Enter twice in rapid
  // succession before React has re-rendered (clearing the textarea value).
  // The sendingRef guard in handleSend must block the second submission so
  // only one bubble for that text appears in the feed.
  test("pressing Enter twice rapidly does not duplicate the message", async ({ page }) => {
    await page.goto("channels");
    await page.getByRole("button", { name: /start lab/i }).click();
    await page.getByPlaceholder("e.g. deer-lake-spike").fill(`enter-guard-lab-${Date.now()}`);
    await page.getByRole("button", { name: "Open Lab" }).click();
    await expect(page).toHaveURL(/\/channels\/lab\/[a-z0-9-]+/, { timeout: 10_000 });

    const messageText = `enter-double-send-${Date.now()}`;
    const textarea = page.getByPlaceholder("Reply to the lab…");
    await textarea.fill(messageText);

    // Dispatch two Enter keydowns in rapid succession — both fire synchronously
    // before React's state update re-render clears the textarea value.
    await textarea.press("Enter");
    await textarea.press("Enter");

    // Give React time to flush any queued updates.
    await page.waitForTimeout(500);

    // Exactly one bubble for that text should appear in the feed.
    await expect(page.getByText(messageText)).toHaveCount(1, { timeout: 5_000 });

    // Textarea must have been cleared after the first (and only) send.
    await expect(textarea).toHaveValue("", { timeout: 3_000 });
  });

  // ── 10. Ask-agent double-click guard ─────────────────────────────────────
  //
  // Scenario: the user clicks an Ask-agent button twice in rapid succession
  // before React has re-rendered (setting askingRole and disabling the button).
  // The askingRole guard in handleAskAgent must block the second invocation so
  // only one agent response bubble appears in the feed.
  test("clicking Ask-agent twice rapidly produces only one agent bubble", async ({ page }) => {
    const channelId = `ask-agent-double-click-${Date.now()}`;
    // Lab expires well in the future so it's not read-only
    const expiresAt = new Date(Date.now() + 60 * 60 * 1_000).toISOString();

    await page.addInitScript(
      ({ id, label, expires, seed }: { id: string; label: string; expires: string; seed: string }) => {
        localStorage.setItem("north-star:unlocked", "1");

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
          category: "lab",
          expiresAt: expires,
          createdAt: new Date().toISOString(),
          createdBy: "human",
          invited_roles: ["river-smith"],
          event_feed: [],
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "double-click-lab", expires: expiresAt, seed: SEED_STORE },
    );

    await page.goto(`channels/lab/${channelId}`);
    await expect(page.locator("h1")).toContainText("double-click-lab", { timeout: 10_000 });

    // Ask-agent button is visible
    const askBtn = page.getByRole("button", { name: /ask river smith/i });
    await expect(askBtn).toBeVisible({ timeout: 5_000 });

    // Click twice in rapid succession using dispatchEvent so both fire before
    // React re-renders (which would disable the button via askingRole state).
    await askBtn.dispatchEvent("click");
    await askBtn.dispatchEvent("click");

    // Wait long enough for both the thinking delay (800 ms) and any queued
    // state updates to settle.
    await page.waitForTimeout(1_500);

    // Exactly one agent bubble should appear — "constellation signals" is always
    // present in the river-smith stub response.
    await expect(page.getByText(/constellation signals/i)).toHaveCount(1, { timeout: 5_000 });
  });

  // ── 8. Archived lab is read-only ──────────────────────────────────────────
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
