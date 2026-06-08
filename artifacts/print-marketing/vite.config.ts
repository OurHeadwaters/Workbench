import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { execFileSync } from "child_process";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

function handbookWatcherPlugin() {
  const contentJson = path.normalize(path.resolve(import.meta.dirname, "scripts/handbook-content.json"));
  const generator = path.resolve(import.meta.dirname, "scripts/generate-handbook.mjs");

  function runGenerator(logger) {
    try {
      execFileSync(process.execPath, [generator], { stdio: "inherit" });
    } catch (e) {
      logger.error(`[handbook-watcher] Generator failed: ${e.message}\n${e.stderr ?? ""}`);
    }
  }

  return {
    name: "handbook-watcher",
    configureServer(server) {
      server.watcher.add(contentJson);
      server.watcher.on("change", (file) => {
        if (path.normalize(path.resolve(file)) === contentJson) {
          server.config.logger.info("[handbook-watcher] handbook-content.json changed — regenerating…");
          runGenerator(server.config.logger);
        }
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    nodePolyfills({ globals: { Buffer: true, process: true, global: true } }),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    handbookWatcherPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
