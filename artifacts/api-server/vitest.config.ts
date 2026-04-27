import { defineConfig } from "vitest/config";

// Standalone config so the runner doesn't try to load build.mjs or require
// a real DATABASE_URL — every external dep the route reaches into is
// mocked inside the test file itself.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
