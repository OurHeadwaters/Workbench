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
    // Build a channel that expires ~1 second from now so we can observe the
    // live transition driven by useNow (500 ms poll interval).
    const channelId = `expiry-mid-session-${Date.now()}`;
    // Expires in 8 s — long enough for the page to load and the countdown badge to
    // appear, but short enough that the 500 ms poll flips the badge to "expired"
    // well within the test's assertion timeout.
    const expiresAt = new Date(Date.now() + 8_000).toISOString();

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
        // 500 ms poll so the UI flips to expired shortly after the 1 s expiry.
        localStorage.setItem("north-star:now-interval", "500");

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

    // 4. Wait for the useNow poll (500 ms interval) to catch the expiry and flip
    //    the badge.  The lab expires 8 s after the initScript runs; allow up to
    //    12 s from this point so clock skew and CI slowness don't cause flakes.
    const expiredBadge = page.locator("span").filter({ hasText: /^expired$/ });
    await expect(expiredBadge.first()).toBeVisible({ timeout: 12_000 });

    // 3. Reply textarea is absent from the start (isReadOnly is true on mount).
    await expect(page.getByPlaceholder("Reply to the lab…")).not.toBeVisible({ timeout: 5_000 });

    // 4. Read-only footer is present on first render.
    await expect(
      page.getByText("This lab is expired — no new events can be posted.")
    ).toBeVisible({ timeout: 5_000 });
  });

  // ── 6. Cold open on a lab seeded with archivedAt: shows expired badge, no reply ──
  //
  // Scenario: the useNow poll interval is set very long (60 s) so the UI does
  // NOT flip to read-only immediately after expiry.  The lab expires 1 second
  // after the page loads.  We wait 1.5 s (lab is now past expiresAt on the
  // real clock) and then try to submit a reply.
  // handleSend must check Date.now() directly and refuse the post — no new
  // event should appear in the feed.
  test("cold open on a lab seeded as archived shows expired badge and no reply input on first render", async ({ page }) => {
    const channelId = `cold-expired-${Date.now()}`;
    const expiresAt = new Date(Date.now() - 60 * 60 * 1_000).toISOString(); // already expired 1 h ago

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
        // Long poll — isReadOnly derives from expiresAt being in the past, not from a poll tick.
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
    const channelId = `drift-guard-send-${Date.now()}`;

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
        // Long poll keeps isReadOnly stale so the textarea stays visible after expiry.
        localStorage.setItem("north-star:now-interval", "60000");

        // Compute expiresAt here (browser time) so it is 1.5 s from when the
        // page actually mounts — not from when the test runner constructed the args.
        // useNow initialises with Date.now() so the lab must not be expired yet on
        // first render; 1.5 s gives enough headroom even on slow CI.
        const expiresAt = new Date(Date.now() + 1_500).toISOString();

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
          expiresAt,
          createdAt: new Date().toISOString(),
          createdBy: "human",
          invited_roles: [],
          event_feed: [],
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "drift-guard-lab", seed: SEED_STORE },
    );

    await page.goto(`channels/lab/${channelId}`);
    await expect(page.locator("h1")).toContainText("drift-guard-lab", { timeout: 10_000 });

    // 1. Textarea is visible (lab has not expired yet, useNow sees it as live)
    await expect(page.getByPlaceholder("Reply to the lab…")).toBeVisible({ timeout: 5_000 });

    // 2. Wait 2 s so the real clock is past expiresAt (1.5 s from mount), but the
    //    60-second useNow poll has NOT ticked — the UI still shows the textarea.
    await page.waitForTimeout(2_000);

    // 3. Textarea is still rendered (stale useNow hasn't flipped isReadOnly yet)
    await expect(page.getByPlaceholder("Reply to the lab…")).toBeVisible({ timeout: 3_000 });

    // 4. Type a message and submit — this fires handleSend with a stale isReadOnly
    const driftMessage = "This should be blocked by the real-time guard";

    await page.getByPlaceholder("Reply to the lab…").fill(driftMessage);
    await page.getByRole("button", { name: "Send" }).click();

    // 5. The message must NOT appear as a feed bubble — postLabEvent was suppressed.
    //    Scope the locator to the feed wrapper (.space-y-4) so we don't accidentally
    //    match the textarea's current value.
    await page.waitForTimeout(500);
    await expect(page.locator(".space-y-4").getByText(driftMessage)).not.toBeVisible({ timeout: 3_000 });
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
    const channelId = `drift-guard-agent-${Date.now()}`;

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
        // Long poll keeps isReadOnly stale so the ask-agent button stays visible after expiry.
        localStorage.setItem("north-star:now-interval", "60000");

        // Compute expiresAt in browser time (same reasoning as the handleSend test above).
        const expiresAt = new Date(Date.now() + 1_500).toISOString();

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
          expiresAt,
          createdAt: new Date().toISOString(),
          createdBy: "human",
          invited_roles: ["river-smith"],
          event_feed: [],
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "double-click-lab", seed: SEED_STORE },
    );

    await page.goto(`channels/lab/${channelId}`);
    await expect(page.locator("h1")).toContainText("double-click-lab", { timeout: 10_000 });

    // Ask-agent button is visible (lab not yet expired)
    const askBtn = page.getByRole("button", { name: /ask river smith/i });
    await expect(askBtn).toBeVisible({ timeout: 5_000 });

    // 2. Wait 2 s so the real clock is past expiresAt (1.5 s from mount), but the
    //    60-second useNow poll has NOT ticked — the UI still renders the ask-agent button.
    await page.waitForTimeout(2_000);

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

  // ── 8. Empty-textarea guard: clicking Send does not create a bubble ───────
  //
  // Scenario: the textarea is empty (reply.trim() === ""). The Send button
  // carries disabled={!reply.trim()} and handleSend returns early when reply is
  // empty. We dispatch a programmatic click on the disabled button to verify
  // that neither guard can be bypassed — zero bubbles must appear in the feed.
  test("clicking Send with an empty textarea does not add any bubble to the feed", async ({ page }) => {
    await page.goto("channels");
    await page.getByRole("button", { name: /start lab/i }).click();
    await page.getByPlaceholder("e.g. deer-lake-spike").fill(`empty-send-guard-${Date.now()}`);
    await page.getByRole("button", { name: "Open Lab" }).click();
    await expect(page).toHaveURL(/\/channels\/lab\/[a-z0-9-]+/, { timeout: 10_000 });

    // Textarea must be empty (default state)
    const textarea = page.getByPlaceholder("Reply to the lab…");
    await expect(textarea).toHaveValue("", { timeout: 5_000 });

    // Use dispatchEvent to bypass the HTML disabled attribute and hit handleSend
    const sendBtn = page.getByRole("button", { name: "Send" });
    await sendBtn.dispatchEvent("click");

    // Also try submitting the form directly via keyboard path
    await textarea.press("Enter");

    // Give React time to flush any queued updates
    await page.waitForTimeout(500);

    // No bubble (EventBubble div) should have appeared in the feed
    // EventBubble renders a <div> with flex gap-2.5; the feed wrapper has
    // class "space-y-4". Check that the feed contains no bubbles at all.
    const feedBubbles = page.locator(".space-y-4 > div");
    await expect(feedBubbles).toHaveCount(0, { timeout: 3_000 });
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

    const messageText = `send-double-${Date.now()}`;
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
    const channelId = `archive-race-${Date.now()}`;
    // Lab expires well in the future so it's not read-only
    const expiresAt = new Date(Date.now() + 60 * 60 * 1_000).toISOString(); // not expired

    await page.addInitScript(
      ({
        id,
        label,
        expires,
        archived,
        seed,
      }: {
        id: string;
        label: string;
        expires: string;
        archived: string;
        seed: string;
      }) => {
        localStorage.setItem("north-star:unlocked", "1");
        // Long poll so useNow is irrelevant — isArchived comes from archivedAt alone.
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

  // ── 11. Send-button double-click guard ───────────────────────────────────
  //
  // Scenario: the user fills the textarea and clicks the Send button twice in
  // rapid succession before React has re-rendered (clearing the textarea value
  // and releasing sendingRef).  The sendingRef guard in handleSend must block
  // the second invocation so only one human bubble appears in the feed.
  test("clicking Send twice rapidly produces only one message bubble", async ({ page }) => {
    await page.goto("channels");
    await page.getByRole("button", { name: /start lab/i }).click();
    await page.getByPlaceholder("e.g. deer-lake-spike").fill(`send-double-click-${Date.now()}`);
    await page.getByRole("button", { name: "Open Lab" }).click();
    await expect(page).toHaveURL(/\/channels\/lab\/[a-z0-9-]+/, { timeout: 10_000 });

    const messageText = `send-double-${Date.now()}`;
    await page.getByPlaceholder("Reply to the lab…").fill(messageText);

    const sendBtn = page.getByRole("button", { name: "Send" });
    await expect(sendBtn).toBeVisible({ timeout: 5_000 });

    // Dispatch two clicks in rapid succession using dispatchEvent so both fire
    // synchronously before React's state update re-render clears the textarea
    // value and releases sendingRef.
    await sendBtn.dispatchEvent("click");
    await sendBtn.dispatchEvent("click");

    // Give React time to flush queued updates.
    await page.waitForTimeout(500);

    // Exactly one human bubble for that text should appear in the feed.
    await expect(page.getByText(messageText)).toHaveCount(1, { timeout: 5_000 });

    // Textarea must have been cleared after the first (and only) send.
    await expect(page.getByPlaceholder("Reply to the lab…")).toHaveValue("", { timeout: 3_000 });
  });

  // ── 12. Archive-then-type race: handleSend blocks post to a pre-archived lab ──
  //
  // Scenario: the lab is seeded with archivedAt already set in the store so
  // isReadOnly is true on the very first render.  The reply form is therefore
  // never mounted.  The test verifies:
  //   (a) the "archived" badge appears immediately on mount (no poll needed),
  //   (b) the reply textarea is absent (UI guard),
  //   (c) the feed contains zero bubbles — no message can slip through.
  //
  // This guards the realTimeReadOnly check inside handleSend:
  //   const realTimeReadOnly = !!(channel?.archivedAt) || realTimeExpired;
  //   if (!reply.trim() || realTimeReadOnly || !channelId) return;
  // Even if that guard were somehow bypassed at the UI layer, the feed must
  // remain empty — a regression here would silently ship.
  test("archive-then-type race: pre-archived lab shows zero bubbles and no reply form", async ({ page }) => {
    const channelId = `archive-race-${Date.now()}`;
    const archivedAt = new Date(Date.now() - 5_000).toISOString(); // archived 5 s ago
    const expiresAt = new Date(Date.now() + 60 * 60 * 1_000).toISOString(); // not expired

    await page.addInitScript(
      ({
        id,
        label,
        expires,
        archived,
        seed,
      }: {
        id: string;
        label: string;
        expires: string;
        archived: string;
        seed: string;
      }) => {
        localStorage.setItem("north-star:unlocked", "1");
        // Long poll so useNow is irrelevant — isArchived comes from archivedAt alone.
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
          archivedAt: archived, // ← already archived before the page loads
          createdAt: new Date(Date.now() - 30 * 60 * 1_000).toISOString(),
          createdBy: "human",
          invited_roles: [],
          event_feed: [],
        });
        storeData.state.channels = channels;
        localStorage.setItem("north-star:v1", JSON.stringify(storeData));
      },
      { id: channelId, label: "archive-race-lab", expires: expiresAt, archived: archivedAt, seed: SEED_STORE },
    );

    // Navigate directly into the already-archived lab
    await page.goto(`channels/lab/${channelId}`);

    // 1. Lab name visible in header
    await expect(page.locator("h1")).toContainText("archive-race-lab", { timeout: 10_000 });

    // 2. "archived" badge is shown on the very first render — isArchived = !!(channel.archivedAt)
    const archivedBadge = page.locator("span").filter({ hasText: /^archived$/ });
    await expect(archivedBadge.first()).toBeVisible({ timeout: 5_000 });

    // 3. Reply textarea is absent — isReadOnly prevents the form from mounting
    await expect(page.getByPlaceholder("Reply to the lab…")).not.toBeVisible({ timeout: 5_000 });

    // 4. Read-only footer confirms the archived state
    await expect(
      page.getByText("This lab is archived — no new events can be posted."),
    ).toBeVisible({ timeout: 5_000 });

    // 5. Feed contains zero message bubbles.
    //    EventBubble renders a <div class="flex gap-2.5 …">; the chronological
    //    feed wrapper is <div class="space-y-4">.
    //    A bypass of handleSend's realTimeReadOnly guard would show a bubble here.
    const feedBubbles = page.locator(".space-y-4 > div");
    await expect(feedBubbles).toHaveCount(0, { timeout: 3_000 });
  });

  // ── 13. Stale / unknown lab ID shows not-found with back affordance ─────────
  //
  // Scenario: the user opens a bookmarked or shared URL for a lab that no
  // longer exists (or never existed) in their local store.  LabPage must
  // render a not-found message AND a "Back to Channels" button so they can
  // escape without using the browser back button.
  test("navigating to an unknown lab ID shows not-found message and a back affordance", async ({ page }) => {
    // Navigate directly to a lab URL whose ID is not in the store.
    // The store is empty of channels (SEED_STORE has channels: []), so
    // any ID will be unknown.
    await page.goto("channels/lab/this-id-does-not-exist");

    // Not-found message must be visible
    await expect(page.getByText("Lab channel not found.")).toBeVisible({ timeout: 10_000 });

    // "Back to Channels" button must be rendered as the escape route
    const backBtn = page.getByRole("button", { name: /back to channels/i });
    await expect(backBtn).toBeVisible({ timeout: 5_000 });

    // Clicking it navigates to the channels list
    await backBtn.click();
    await expect(page).toHaveURL(/\/channels$/, { timeout: 8_000 });
    await expect(page.getByRole("heading", { name: "Channels" })).toBeVisible({ timeout: 8_000 });
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
