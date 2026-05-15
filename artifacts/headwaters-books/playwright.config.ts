import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "fs";
import path from "path";

const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:24089";
const BOOKS_BASE = "/headwaters-books";

const systemChromium =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
  "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium";

const storageStatePath = path.join(
  import.meta.dirname,
  "e2e",
  ".auth",
  "user.json",
);

const storageState = existsSync(storageStatePath)
  ? storageStatePath
  : undefined;

const DBUS_ENV = {
  DBUS_SESSION_BUS_ADDRESS: "unix:path=/tmp/fake-dbus-socket",
  DBUS_SYSTEM_BUS_ADDRESS: "unix:path=/tmp/fake-dbus-socket",
};

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "dot" : "list",
  use: {
    baseURL: `${BASE_URL}${BOOKS_BASE}/`,
    trace: "on-first-retry",
    storageState,
    launchOptions: {
      executablePath: systemChromium,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      env: { ...process.env, ...DBUS_ENV },
    },
  },
  webServer: [
    {
      command: `PORT=20502 BASE_PATH=/headwaters-books/ pnpm --filter @workspace/headwaters-books run dev`,
      url: `http://localhost:20502/headwaters-books/`,
      reuseExistingServer: true,
      timeout: 120_000,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      command: `PORT=8081 pnpm --filter @workspace/api-server run dev`,
      url: `http://localhost:8081/api/bookkeeper/me`,
      reuseExistingServer: true,
      timeout: 120_000,
      stdout: "ignore",
      stderr: "pipe",
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
