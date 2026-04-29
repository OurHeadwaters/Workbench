import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Standalone config so the test runner doesn't load vite.config.ts
// (which requires PORT / BASE_PATH to be set for the dev server).
// Mirrors artifacts/deer-lake-store-plan/vitest.config.ts.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
    ],
    environment: "jsdom",
  },
});
