/// <reference types="node" />
// Reusable puppeteer renderer used by both the build-time export
// (export-pdfs.ts → /onepager → static public/*.pdf) and the dev-time
// auto-regenerate trigger (vite-plugin-onepager-pdf.ts → POST
// /api/onepager.pdf with the practitioner's live AppState in the body
// → fresh PDF buffer streamed back). Sharing a single renderer means
// the two paths can never drift on print options, navigation timing,
// or the localStorage seeding step that keeps the printed sheet
// honest about cost-review edits.
//
// `launchBrowser` is dependency-injectable so the dev middleware test
// can drive the full edit→trigger→PDF pipeline against a fake browser
// without booting Chromium in the test sandbox.

import { execFileSync } from "child_process";

import puppeteer, {
  type Browser,
  type LaunchOptions,
  type PDFOptions,
} from "puppeteer-core";

import {
  buildLocalStorageSeedScript,
} from "./seedAppState";
import type { AppState } from "../src/lib/storage";

export type RenderOnePagerOptions = {
  /** Fully-qualified URL to navigate puppeteer to (e.g. http://localhost:5173/onepager). */
  pageUrl: string;
  /** AppState to seed into localStorage before navigation. Pass null to render against DEFAULT_STATE. */
  appState: AppState | null;
  /** Override the puppeteer launcher — used by tests. */
  launchBrowser?: (options: LaunchOptions) => Promise<Browser>;
  /** Override the chromium discovery — used by tests. */
  resolveChromium?: () => string | undefined;
  /** Override the PDF render options (defaults match the build-time export). */
  pdfOptions?: PDFOptions;
  /** page.goto timeout in ms. */
  navigationTimeoutMs?: number;
};

export const DEFAULT_PDF_OPTIONS: PDFOptions = {
  format: "letter",
  printBackground: true,
  preferCSSPageSize: true,
};

export function defaultResolveChromium(): string | undefined {
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

export async function defaultLaunchBrowser(
  options: LaunchOptions,
): Promise<Browser> {
  return puppeteer.launch(options);
}

/**
 * Renders a single page (typically `/onepager`) to a PDF buffer with
 * the supplied AppState seeded into localStorage *before* the page's
 * scripts run. Puppeteer's `evaluateOnNewDocument` is the only place
 * this can hook in early enough — by the time `useAppState`'s
 * `loadState()` reads localStorage on first mount, the practitioner's
 * edits are already there and the OnePager renders against them.
 *
 * Returns the PDF as a Node Buffer ready to stream back to the
 * browser (dev middleware) or write to disk (build-time export).
 */
export async function renderOnePagerToPdf(
  options: RenderOnePagerOptions,
): Promise<Buffer> {
  const resolveChromium = options.resolveChromium ?? defaultResolveChromium;
  const launchBrowser = options.launchBrowser ?? defaultLaunchBrowser;
  const pdfOptions = options.pdfOptions ?? DEFAULT_PDF_OPTIONS;
  const navigationTimeoutMs = options.navigationTimeoutMs ?? 60_000;

  const executablePath = resolveChromium();
  if (!executablePath) {
    throw new Error(
      "Could not find a Chromium executable. Install `chromium` as a system dependency, " +
        "or set PUPPETEER_EXECUTABLE_PATH to a Chrome/Chromium binary.",
    );
  }

  const browser = await launchBrowser({
    headless: true,
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();
    try {
      if (options.appState) {
        const seedScript = buildLocalStorageSeedScript(options.appState);
        await page.evaluateOnNewDocument(seedScript);
      }
      await page.goto(options.pageUrl, {
        waitUntil: "networkidle0",
        timeout: navigationTimeoutMs,
      });
      await page.emulateMediaType("print");
      // Make sure any web fonts (if added later) are fully loaded
      // before printing — same dance the build-time export does.
      await page.evaluate(async () => {
        if ("fonts" in document) {
          await (document as Document & {
            fonts: { ready: Promise<unknown> };
          }).fonts.ready;
        }
      });
      const pdf = await page.pdf(pdfOptions);
      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
