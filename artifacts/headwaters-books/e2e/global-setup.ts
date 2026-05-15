import { chromium } from "@playwright/test";
import { clerk, clerkSetup, setupClerkTestingToken } from "@clerk/testing/playwright";
import path from "path";

const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:24089";
const BOOKS_BASE = "/headwaters-books";
const APP_URL = `${BASE_URL}${BOOKS_BASE}/`;

const SYSTEM_CHROMIUM =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
  "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium";

export const STORAGE_STATE = path.join(
  import.meta.dirname,
  ".auth",
  "user.json",
);

const DBUS_ENV = {
  DBUS_SESSION_BUS_ADDRESS: "unix:path=/tmp/fake-dbus-socket",
  DBUS_SYSTEM_BUS_ADDRESS: "unix:path=/tmp/fake-dbus-socket",
};

export default async function globalSetup() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const ownerEmailRaw = process.env.HEADWATERS_OWNER_EMAIL ?? "";
  const ownerEmail = ownerEmailRaw.split(",")[0].trim();

  if (!secretKey) {
    throw new Error(
      "[e2e global-setup] CLERK_SECRET_KEY is required but not set.",
    );
  }

  if (!ownerEmail) {
    throw new Error(
      "[e2e global-setup] HEADWATERS_OWNER_EMAIL is required but not set.",
    );
  }

  await clerkSetup();
  console.log("[e2e global-setup] Clerk testing token obtained.");

  const browser = await chromium.launch({
    executablePath: SYSTEM_CHROMIUM,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    env: { ...process.env, ...DBUS_ENV },
    timeout: 60_000,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await setupClerkTestingToken({ page });
    await page.goto(APP_URL);
    await clerk.signIn({ page, emailAddress: ownerEmail });
    console.log("[e2e global-setup] Signed in as", ownerEmail);
    await context.storageState({ path: STORAGE_STATE });
    console.log("[e2e global-setup] Session state saved to", STORAGE_STATE);
  } finally {
    await context.close();
    await browser.close();
  }
}
