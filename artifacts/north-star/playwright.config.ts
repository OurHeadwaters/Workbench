import { defineConfig, devices } from "@playwright/test";

const PORT = 9000;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const NS_BASE = "/north-star";

const systemChromium =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
  "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium";

const DBUS_ENV = {
  DBUS_SESSION_BUS_ADDRESS: "unix:path=/tmp/fake-dbus-socket",
  DBUS_SYSTEM_BUS_ADDRESS: "unix:path=/tmp/fake-dbus-socket",
};

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "dot" : "list",
  use: {
    baseURL: `${BASE_URL}${NS_BASE}/`,
    trace: "on-first-retry",
    launchOptions: {
      executablePath: systemChromium,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      env: { ...process.env, ...DBUS_ENV },
    },
  },
  webServer: {
    command: `PORT=${PORT} BASE_PATH=/north-star/ pnpm --filter @workspace/north-star run dev`,
    url: `http://localhost:${PORT}/north-star/`,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
