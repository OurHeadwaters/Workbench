import { defineConfig } from "vitest/config";
import path from "path";

// Standalone config so the test runner doesn't load vite.config.ts
// (which requires PORT and BASE_PATH to be set for the dev server).
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets",
      ),
    },
  },
  test: {
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "src/__tests__/**/*.test.ts",
    ],
    environment: "node",
  },
});
