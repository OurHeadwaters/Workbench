import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Standalone config so the test runner doesn't load vite.config.ts
// (which requires PORT to be set for the dev server).
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
    environment: "node",
  },
});
