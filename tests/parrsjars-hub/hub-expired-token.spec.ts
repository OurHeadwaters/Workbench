/**
 * e2e: expired kit token shows LockedWall (with expired message), not hub content.
 *
 * Scenario: A token exists in the DB but its expires_at is in the past.
 * The server returns 410; useKitAccess sets status="expired"; the page
 * should render <LockedWall reason="expired" /> — showing "Your access link
 * has expired." and a re-send CTA — rather than the hub module grid or a
 * blank screen.
 *
 * Setup:
 *   - DB token: expires_at = NOW() - 1 day  (server rejects with 410)
 *   - localStorage expiresAt: far future      (client does NOT evict the entry)
 *
 * This combination lets RequireKitToken pass its synchronous gate so
 * ParrsJarsHubPage can mount and make the async server call that triggers
 * the 410 → expired branch.
 */

import { test, expect } from "@playwright/test";
import pg from "pg";

const KIT_ID = "pj-solutions-kit";
const TOKEN = "e2e-hub-expired-token-v1";
const LS_KEY = `headwaters:kit-token:${KIT_ID}`;
const LS_VALUE = JSON.stringify({
  token: TOKEN,
  expiresAt: "2099-12-31T23:59:59.000Z",
  buyerName: "E2E Buyer",
});

async function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL env var is not set");
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  return client;
}

test.beforeAll(async () => {
  const db = await getDb();
  try {
    await db.query(
      `INSERT INTO kit_tokens (token, kit_id, buyer_email, buyer_name, purchase_id, expires_at)
       VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '1 day')
       ON CONFLICT (token) DO UPDATE SET expires_at = NOW() - INTERVAL '1 day'`,
      [TOKEN, KIT_ID, "e2e-test@example.com", "E2E Buyer", "e2e-purchase-v1"],
    );
  } finally {
    await db.end();
  }
});

test.afterAll(async () => {
  const db = await getDb();
  try {
    await db.query("DELETE FROM kit_tokens WHERE token = $1", [TOKEN]);
  } finally {
    await db.end();
  }
});

test("expired kit token shows LockedWall with expired message, not hub content", async ({
  page,
}) => {
  await page.addInitScript(
    ({ key, value }: { key: string; value: string }) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // localStorage unavailable — test will fail on URL assertion below
      }
    },
    { key: LS_KEY, value: LS_VALUE },
  );

  await page.goto("/parrsjars/hub");

  // RequireKitToken should pass (localStorage is set) — page stays at /parrsjars/hub.
  // A redirect to /parrsjars/kit would mean the localStorage injection failed.
  await expect(page).toHaveURL(/\/parrsjars\/hub/, { timeout: 8_000 });

  // Loading spinner must disappear once the server responds with 410.
  await expect(page.getByText("Checking access…")).not.toBeVisible({
    timeout: 10_000,
  });

  // LockedWall (expired variant) must be visible.
  await expect(page.getByText("Your access link has expired.")).toBeVisible({
    timeout: 10_000,
  });

  // Re-send CTA gives the buyer a path forward.
  await expect(page.getByText("Re-send my access link →")).toBeVisible();

  // Hub module grid must NOT be shown — expired users see the wall, not the content.
  await expect(page.getByText("Principles to Preservation")).not.toBeVisible();
});
