import { defineConfig } from "vitest/config";

// Standalone config so the test runner doesn't load vite.config.ts
// (which requires PORT to be set for the dev server).
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "node",
  },
});
