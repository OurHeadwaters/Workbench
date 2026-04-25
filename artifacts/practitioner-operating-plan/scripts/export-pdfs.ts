/// <reference types="node" />
import { execFileSync, spawn } from "child_process";
import { createServer } from "http";
import { mkdir, readFile, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import puppeteer from "puppeteer-core";

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
];

function resolveChromiumExecutable(): string | undefined {
  const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (fromEnv) return fromEnv;
  for (const candidate of ["chromium", "google-chrome", "chrome"]) {
    try {
      const found = execFileSync("which", [candidate], { encoding: "utf8" })
        .trim();
      if (found) return found;
    } catch {
      // Not found; try the next candidate.
    }
  }
  return undefined;
}

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

async function renderPdfs(port: number): Promise<void> {
  const executablePath = resolveChromiumExecutable();
  if (!executablePath) {
    throw new Error(
      "Could not find a Chromium executable. Install `chromium` as a system dependency, " +
        "or set PUPPETEER_EXECUTABLE_PATH to a Chrome/Chromium binary.",
    );
  }
  console.log(`[export-pdfs] Using Chromium at ${executablePath}`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    await mkdir(outputDir, { recursive: true });

    for (const pageSpec of PAGES) {
      const url = `http://127.0.0.1:${port}${pageSpec.route}`;
      const outputPath = path.join(outputDir, pageSpec.outputFile);
      console.log(
        `[export-pdfs] Rendering ${pageSpec.label} from ${url} ...`,
      );

      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 60_000 });
        await page.emulateMediaType("print");
        // Make sure any web fonts (if added later) are fully loaded before printing.
        await page.evaluate(async () => {
          if ("fonts" in document) {
            await (document as Document & {
              fonts: { ready: Promise<unknown> };
            }).fonts.ready;
          }
        });

        await page.pdf({
          path: outputPath,
          format: "letter",
          printBackground: true,
          preferCSSPageSize: true,
        });

        console.log(
          `[export-pdfs] Wrote ${path.relative(projectRoot, outputPath)}`,
        );
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

function shouldSkipBuild(): boolean {
  if (process.argv.includes("--skip-build")) return true;
  const flag = process.env.SKIP_BUILD;
  if (!flag) return false;
  return flag !== "0" && flag.toLowerCase() !== "false";
}

async function main() {
  if (shouldSkipBuild()) {
    console.log("[export-pdfs] Skipping internal build (SKIP_BUILD set).");
  } else {
    await buildBundle();
  }
  const server = await startStaticServer();
  try {
    await renderPdfs(server.port);
  } finally {
    await server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
