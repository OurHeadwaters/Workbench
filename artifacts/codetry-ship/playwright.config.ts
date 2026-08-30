import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.CODETRY_SHIP_PORT ?? 4173);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const systemChromium =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
  "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium";

export default defineConfig({
  testDir: "./e2e",
  testMatch: /.*\.spec\.ts$/,
  timeout: 60_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "dot" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    launchOptions: {
      executablePath: systemChromium,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      env: {
        ...process.env,
        DBUS_SESSION_BUS_ADDRESS: "unix:path=/tmp/fake-dbus-socket",
        DBUS_SYSTEM_BUS_ADDRESS: "unix:path=/tmp/fake-dbus-socket",
      },
    },
  },
  webServer: {
    command: `PORT=${PORT} BASE_PATH=/ pnpm --filter @workspace/codetry-ship run dev`,
    url: `${BASE_URL}/`,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 412, height: 915 },
      },
    },
  ],
});