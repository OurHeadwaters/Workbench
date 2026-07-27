import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.SHIP_PORT ?? "21384";
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: ".",
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: false,
  reporter: [["list"]],
  retries: 0,
  workers: 1,
  use: {
    baseURL: BASE_URL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    trace: "off",
    video: "off",
    screenshot: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          executablePath:
            process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
            "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium",
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        },
      },
    },
  ],
});
