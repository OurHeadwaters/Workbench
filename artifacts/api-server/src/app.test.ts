/**
 * app.test.ts — smoke tests for route-registration order in the real app
 *
 * Imports the real `src/app.ts` with all external/DB deps mocked and real
 * stub SPA directories created on disk so fs.existsSync passes (vi.mock("fs")
 * does not intercept `import fs from "fs"` in this project's vitest config —
 * managing real files is the required workaround).
 *
 * What this guards:
 *   If the root SPA catch-all ("/*path") ever moves above /api in app.ts,
 *   /api/health will start returning HTML instead of JSON and this suite
 *   will fail immediately.
 *
 *   If the SPA catch-all is removed or gated behind a non-existent dist
 *   directory, deep links like /arc/login will 404 and this suite will also
 *   fail.
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  vi,
} from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
import fs from "node:fs";

// ---------------------------------------------------------------------------
// Environment setup (must happen before any module under test loads)
// ---------------------------------------------------------------------------

vi.hoisted(() => {
  process.env.NODE_ENV = "test";
});

// ---------------------------------------------------------------------------
// Stub directories — fs.existsSync is NOT mockable for `import fs from "fs"`
// in this project's vitest config, so we create real stub dirs.
//
// app.ts resolves dist paths relative to:
//   - process.cwd() for codetry-ship and print-marketing
//   - import.meta.url  for sandbox and field-guide-finance
//
// When vitest runs from artifacts/api-server, process.cwd() is that dir.
// import.meta.url for src/app.ts → file://.../artifacts/api-server/src/app.ts
// so "../../X" resolves to   .../artifacts/api-server/X
// ---------------------------------------------------------------------------

const API_SERVER_ROOT = path.resolve(
  new URL(".", import.meta.url).pathname,
  "..",
);

const STUB_DIRS = [
  path.join(API_SERVER_ROOT, "artifacts", "codetry-ship", "dist", "public"),
  path.join(API_SERVER_ROOT, "artifacts", "print-marketing", "dist", "public"),
  path.join(API_SERVER_ROOT, "sandbox", "dist", "public"),
  path.join(API_SERVER_ROOT, "field-guide-finance", "dist", "public"),
];

const SPA_HTML =
  "<!doctype html><html><head></head><body>SPA STUB</body></html>";

function createStubDirs(): void {
  for (const dir of STUB_DIRS) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const indexHtml = path.join(dir, "index.html");
    if (!fs.existsSync(indexHtml)) {
      fs.writeFileSync(indexHtml, SPA_HTML, "utf8");
    }
  }
}

function removeStubDirs(): void {
  for (const dir of STUB_DIRS) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

// ---------------------------------------------------------------------------
// Mock all heavy dependencies that app.ts pulls in at load time
// ---------------------------------------------------------------------------

vi.mock("@workspace/zone-identity", () => ({
  deriveZ2Npub: () => "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
}));

vi.mock("pino-http", () => ({
  default: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock("@clerk/express", () => ({
  clerkMiddleware:
    () => (_req: unknown, _res: unknown, next: () => void) =>
      next(),
}));

vi.mock("./middlewares/clerkProxyMiddleware", () => ({
  CLERK_PROXY_PATH: "/__clerk_unused",
  clerkProxyMiddleware:
    () => (_req: unknown, _res: unknown, next: () => void) =>
      next(),
}));

vi.mock("./lib/logger", () => ({
  logger: {
    info: () => {},
    error: () => {},
    warn: () => {},
    debug: () => {},
    child: () => ({
      info: () => {},
      error: () => {},
      warn: () => {},
      debug: () => {},
    }),
  },
}));

vi.mock("./lib/riverSmithScheduler", () => ({
  scheduleNightlyBriefing: () => {},
}));

vi.mock("./lib/taskAutopilotScheduler", () => ({
  scheduleWeeklyArchive: () => {},
}));

vi.mock("./lib/kitTokensCleanup", () => ({
  scheduleKitTokensCleanup: () => {},
}));

vi.mock("./lib/kitDeliveryRecovery", () => ({
  runKitDeliveryRecovery: () => Promise.resolve(),
}));

// The api router: return a real router with /health and /healthz so we can
// confirm /api/* routes aren't shadowed by the catch-all.
vi.mock("./routes", async () => {
  const { Router } = await import("express");
  const r = Router();
  r.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });
  r.get("/healthz", (_req, res) => {
    res.json({ status: "ok" });
  });
  return { default: r };
});

// Stripe webhook router: empty, no stripe SDK needed.
vi.mock("./routes/stripeWebhook", async () => {
  const { Router } = await import("express");
  return { default: Router() };
});

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

interface Harness {
  base: string;
  close: () => Promise<void>;
}

let harness: Harness;

beforeAll(async () => {
  createStubDirs();

  const { default: app } = await import("./app");

  const srv: Server = createServer(app);
  await new Promise<void>((resolve) => srv.listen(0, "127.0.0.1", resolve));
  const addr = srv.address() as AddressInfo;

  harness = {
    base: `http://127.0.0.1:${addr.port}`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        srv.close((err) => (err ? reject(err) : resolve())),
      ),
  };
});

afterAll(async () => {
  await harness?.close();
  removeStubDirs();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("deep-link smoke tests — SPA catch-all does not shadow /api routes", () => {
  it("GET /api/health returns 200 JSON — not HTML", async () => {
    const res = await fetch(`${harness.base}/api/health`);
    expect(res.status).toBe(200);
    const ct = res.headers.get("content-type") ?? "";
    expect(ct).toMatch(/application\/json/);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("ok");
  });

  it("GET /api/healthz returns 200 JSON — not HTML", async () => {
    const res = await fetch(`${harness.base}/api/healthz`);
    expect(res.status).toBe(200);
    const ct = res.headers.get("content-type") ?? "";
    expect(ct).toMatch(/application\/json/);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("ok");
  });

  it("GET /arc/login returns 200 HTML — deep link served by SPA catch-all", async () => {
    const res = await fetch(`${harness.base}/arc/login`);
    expect(res.status).toBe(200);
    const ct = res.headers.get("content-type") ?? "";
    expect(ct).toMatch(/text\/html/);
    const body = await res.text();
    expect(body).toContain("<html");
  });

  it("GET /arc/ returns 200 HTML", async () => {
    const res = await fetch(`${harness.base}/arc/`);
    expect(res.status).toBe(200);
    const ct = res.headers.get("content-type") ?? "";
    expect(ct).toMatch(/text\/html/);
  });

  it("GET /workbench returns 200 HTML", async () => {
    const res = await fetch(`${harness.base}/workbench`);
    expect(res.status).toBe(200);
    const ct = res.headers.get("content-type") ?? "";
    expect(ct).toMatch(/text\/html/);
  });

  it("GET /start returns 200 HTML", async () => {
    const res = await fetch(`${harness.base}/start`);
    expect(res.status).toBe(200);
    const ct = res.headers.get("content-type") ?? "";
    expect(ct).toMatch(/text\/html/);
  });
});
