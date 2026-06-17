import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import runtimeErrorModal from "@replit/vite-plugin-runtime-error-modal";
import path from "path";

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 20509;
const basePath = process.env.BASE_PATH ?? "/deer-lake-store-plan/";

const healthCheckPlugin = {
  name: "health-check",
  configureServer(server: {
    middlewares: {
      use: (fn: (req: { url?: string }, res: { statusCode: number; end: (s: string) => void }, next: () => void) => void) => void;
    };
  }) {
    server.middlewares.use((req, res, next) => {
      if (req.url === "/") {
        res.statusCode = 200;
        res.end("OK");
        return;
      }
      next();
    });
  },
};

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss(), runtimeErrorModal(), healthCheckPlugin],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
