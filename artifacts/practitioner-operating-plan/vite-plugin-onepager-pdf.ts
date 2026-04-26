/// <reference types="node" />
// Vite dev plugin: registers POST /api/onepager.pdf in the dev server
// so the OnePager's "Download PDF" button can auto-regenerate the
// printable sheet against the practitioner's live cost-review edits
// without leaving the browser.
//
// Flow:
//   1. Practitioner opens /onepager.
//   2. They edit a cross-reserve number in the cost-review modal —
//      the new value lives in localStorage[STORAGE_KEY].
//   3. They click "Download printable PDF". The button POSTs the
//      current AppState (JSON) to /api/onepager.pdf.
//   4. This middleware spins up puppeteer, points it at
//      http://localhost:${PORT}/onepager (the same dev server it
//      runs inside), seeds localStorage with the posted state via
//      page.evaluateOnNewDocument, renders the PDF, and streams the
//      buffer back as the response.
//   5. The browser turns the response into a download — fresh PDF on
//      disk, edits and all, no CLI step.
//
// The shared renderer in scripts/renderOnePagerPdf.ts is the same
// one the build-time export uses, so the dev path and the build path
// can never drift on print options or seeding behaviour.
//
// Production note: this plugin is `apply: "serve"` — it only attaches
// to the Vite dev server. In a static deploy the auto-regen endpoint
// isn't there and the OnePager UI falls back to the last-built static
// PDF (and surfaces a notice). The practitioner's day-to-day workflow
// runs `pnpm dev` locally, where the one-click flow is fully
// supported; a deployed mirror is read-only by design. If runtime
// regeneration is ever required in production, port the
// handleOnePagerPdfRequest handler into a Node sidecar service.

import type { Plugin, ViteDevServer } from "vite";

import {
  type RenderOnePagerOptions,
  renderOnePagerToPdf,
} from "./scripts/renderOnePagerPdf";
import { migrate, type AppState } from "./src/lib/storage";

export type OnePagerPdfMiddlewareOptions = {
  /** Override the renderer for tests. Defaults to the real puppeteer renderer. */
  render?: (options: RenderOnePagerOptions) => Promise<Buffer>;
  /** Override how the page URL is built (test seam). Defaults to http://127.0.0.1:${port}${base}onepager. */
  buildPageUrl?: (port: number, base: string) => string;
};

const ENDPOINT_RELATIVE = "api/onepager.pdf";

/**
 * Joins Vite's configured `base` (which always ends in "/") with a
 * trailing relative path so that, when BASE_PATH is non-root (e.g.
 * "/practitioner-operating-plan/"), the middleware mounts at the same
 * URL the browser posts to via `${import.meta.env.BASE_URL}api/...`.
 * Exported so the test can pin the join behaviour directly.
 */
export function joinBaseAndPath(base: string, relative: string): string {
  // Vite normalises base to start with "/" and end with "/", but
  // tolerate omitted slashes defensively.
  const baseSlashed = base.endsWith("/") ? base : `${base}/`;
  const baseRooted = baseSlashed.startsWith("/")
    ? baseSlashed
    : `/${baseSlashed}`;
  const rel = relative.startsWith("/") ? relative.slice(1) : relative;
  return `${baseRooted}${rel}`;
}

/**
 * Reads the JSON request body off a Connect-style middleware request.
 * Bounded at 5 MiB so a runaway client can't pin the dev server's
 * memory — far more than any AppState should ever weigh.
 */
async function readJsonBody(req: {
  on(event: "data", cb: (chunk: Buffer) => void): void;
  on(event: "end", cb: () => void): void;
  on(event: "error", cb: (err: Error) => void): void;
}): Promise<unknown> {
  const MAX_BYTES = 5 * 1024 * 1024;
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BYTES) {
        reject(new Error(`Request body exceeded ${MAX_BYTES} bytes`));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        if (raw.length === 0) {
          resolve(null);
          return;
        }
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function isAppStatePayload(
  parsed: unknown,
): parsed is { version: number } & Record<string, unknown> {
  return (
    typeof parsed === "object" &&
    parsed !== null &&
    "version" in parsed &&
    typeof (parsed as { version: unknown }).version === "number"
  );
}

/**
 * The handler logic, extracted so vitest can drive it directly with
 * fake req/res streams (and a mocked renderer) and assert end-to-end:
 * an AppState arrives → renderer is called with the seeded state →
 * PDF buffer is streamed back. No real Chromium required in tests.
 */
export async function handleOnePagerPdfRequest(
  req: {
    method?: string;
    on(event: "data", cb: (chunk: Buffer) => void): void;
    on(event: "end", cb: () => void): void;
    on(event: "error", cb: (err: Error) => void): void;
  },
  res: {
    statusCode: number;
    setHeader(name: string, value: string): void;
    end(body?: string | Buffer): void;
  },
  options: {
    pageUrl: string;
    render: (options: RenderOnePagerOptions) => Promise<Buffer>;
  },
): Promise<void> {
  if (req.method && req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Method Not Allowed");
    return;
  }

  let parsed: unknown;
  try {
    parsed = await readJsonBody(req);
  } catch (err) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(`Bad request: ${(err as Error).message}`);
    return;
  }

  let state: AppState | null = null;
  if (parsed !== null) {
    if (!isAppStatePayload(parsed)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end(
        "Bad request: expected an AppState payload (object with numeric `version` field) or null.",
      );
      return;
    }
    state = migrate(parsed);
  }

  let pdf: Buffer;
  try {
    pdf = await options.render({
      pageUrl: options.pageUrl,
      appState: state,
    });
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(
      `Failed to render printable PDF: ${(err as Error).message}`,
    );
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="practitioner-operating-plan-onepager.pdf"',
  );
  res.setHeader("Cache-Control", "no-store");
  res.end(pdf);
}

export function onePagerPdfPlugin(
  options: OnePagerPdfMiddlewareOptions = {},
): Plugin {
  const render = options.render ?? renderOnePagerToPdf;
  const buildPageUrl =
    options.buildPageUrl ??
    ((port: number, base: string) =>
      `http://127.0.0.1:${port}${joinBaseAndPath(base, "onepager")}`);
  return {
    name: "vite-plugin-onepager-pdf",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      // Mount under the configured base so a non-root BASE_PATH (e.g.
      // "/practitioner-operating-plan/") matches the URL the OnePager
      // button posts to via `${import.meta.env.BASE_URL}api/...`. With
      // root base this resolves to "/api/onepager.pdf"; with a path
      // base it resolves to "/practitioner-operating-plan/api/onepager.pdf".
      const base = server.config.base ?? "/";
      const mountPath = joinBaseAndPath(base, ENDPOINT_RELATIVE);
      server.middlewares.use(mountPath, async (req, res, next) => {
        try {
          const port =
            (server.config.server.port as number | undefined) ??
            (server.httpServer?.address() &&
            typeof server.httpServer.address() === "object"
              ? (server.httpServer.address() as { port: number }).port
              : 5173);
          await handleOnePagerPdfRequest(req, res, {
            pageUrl: buildPageUrl(port, base),
            render,
          });
        } catch (err) {
          // Defensive: should never reach here because the handler
          // catches its own errors, but if anything escapes, fall
          // back to vite's standard error handling rather than
          // crashing the dev server.
          next(err as Error);
        }
      });
    },
  };
}
