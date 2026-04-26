/// <reference types="node" />
import { spawn } from "child_process";
import { createServer } from "http";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { loadAppStateOverride, type LoadAppStateResult } from "./seedAppState";
import { renderOnePagerToPdf } from "./renderOnePagerPdf";

type PageExport = {
  route: string;
  outputFile: string;
  label: string;
};

const PAGES: PageExport[] = [
  {
    route: "/onepager",
    outputFile: "practitioner-operating-plan-onepager.pdf",
    label: "one-pager",
  },
  {
    route: "/checklist",
    outputFile: "headwaters-checklist.pdf",
    label: "Headwaters checklist",
  },
  {
    route: "/lease-tooling",
    outputFile: "dad-lease-checklist.pdf",
    label: "Dad-lease CRA tooling checklist",
  },
  {
    route: "/hours",
    outputFile: "headwaters-hours-by-pillar.pdf",
    label: "Quarterly hours-by-pillar report",
  },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist/public");
const outputDir = path.join(projectRoot, "public");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".ico": "image/x-icon",
};

async function buildBundle(): Promise<void> {
  console.log("[export-pdfs] Building production bundle (BASE_PATH=/) ...");
  await new Promise<void>((resolve, reject) => {
    const proc = spawn(
      "pnpm",
      ["exec", "vite", "build", "--config", "vite.config.ts"],
      {
        cwd: projectRoot,
        env: {
          ...process.env,
          BASE_PATH: "/",
          PORT: "5173",
          NODE_ENV: "production",
        },
        stdio: "inherit",
      },
    );
    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`vite build exited with code ${code}`));
    });
  });
}

async function fileExistsAsFile(filePath: string): Promise<boolean> {
  try {
    const s = await stat(filePath);
    return s.isFile();
  } catch {
    return false;
  }
}

async function startStaticServer(): Promise<{
  port: number;
  close: () => Promise<void>;
}> {
  const indexHtmlPath = path.join(distDir, "index.html");
  if (!(await fileExistsAsFile(indexHtmlPath))) {
    throw new Error(
      `Expected built index.html at ${indexHtmlPath}. Did the build succeed?`,
    );
  }

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      const decoded = decodeURIComponent(url.pathname);
      const candidate = path.normalize(path.join(distDir, decoded));

      if (!candidate.startsWith(distDir)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }

      let filePath = candidate;
      if (!(await fileExistsAsFile(filePath))) {
        // SPA fallback: any unknown route is handled by the app shell.
        filePath = indexHtmlPath;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
      const data = await readFile(filePath);
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "no-store");
      res.end(data);
    } catch (err) {
      res.statusCode = 500;
      res.end(String(err));
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to bind static server");
  }

  return {
    port: address.port,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      ),
  };
}

async function renderPdfs(
  port: number,
  appStateOverride: LoadAppStateResult,
): Promise<void> {
  if (appStateOverride) {
    console.log(
      `[export-pdfs] Seeding puppeteer localStorage from ${appStateOverride.sourcePath}`,
    );
  }

  await mkdir(outputDir, { recursive: true });

  for (const pageSpec of PAGES) {
    const url = `http://127.0.0.1:${port}${pageSpec.route}`;
    const outputPath = path.join(outputDir, pageSpec.outputFile);
    console.log(`[export-pdfs] Rendering ${pageSpec.label} from ${url} ...`);

    // Each page gets its own browser instance so the same shared
    // renderer used by the dev-time auto-regenerate trigger
    // (vite-plugin-onepager-pdf.ts) is exercised end-to-end here too.
    // Modest cost — Chromium boots once per page in a build that runs
    // a handful of times per deploy.
    const buffer = await renderOnePagerToPdf({
      pageUrl: url,
      appState: appStateOverride?.state ?? null,
    });
    await writeFile(outputPath, buffer);
    console.log(
      `[export-pdfs] Wrote ${path.relative(projectRoot, outputPath)}`,
    );
  }
}

function shouldSkipBuild(): boolean {
  if (process.argv.includes("--skip-build")) return true;
  const flag = process.env.SKIP_BUILD;
  if (!flag) return false;
  return flag !== "0" && flag.toLowerCase() !== "false";
}

async function main() {
  // Resolve the practitioner's --app-state override up front so a
  // typo / missing file fails before we spin up vite + puppeteer.
  const appStateOverride = loadAppStateOverride({
    argv: process.argv.slice(2),
    env: process.env,
  });
  if (shouldSkipBuild()) {
    console.log("[export-pdfs] Skipping internal build (SKIP_BUILD set).");
  } else {
    await buildBundle();
  }
  const server = await startStaticServer();
  try {
    await renderPdfs(server.port, appStateOverride);
  } finally {
    await server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
