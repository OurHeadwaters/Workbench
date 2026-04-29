import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Standalone config so the test runner doesn't load vite.config.ts
// (which requires PORT / BASE_PATH for the dev server). The React
// plugin is needed so .test.tsx files (e.g. the embed-route tests
// added in task #526) can use JSX syntax — the project's tsconfig
// keeps jsx="preserve" so vitest needs the plugin to transform.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "jsdom",
  },
});
