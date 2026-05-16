import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

// ── hoisted setup ─────────────────────────────────────────────────────────────
// Must be in place before the capture module loads so HMAC_KEY and
// CAPTURE_PATH are picked up at module-eval time.

const TEST_HMAC_KEY = "test-capture-hmac-key-exactly-32b";
let tmpCapturePath = "";

vi.hoisted(() => {
  process.env.CAPTURE_HMAC_KEY = "test-capture-hmac-key-exactly-32b";
});

// ── import after hoisted env is set ──────────────────────────────────────────
import express from "express";
import captureRouter, { __clearRateLimiter } from "./capture";

// ── harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/capture", captureRouter);
  const srv: Server = createServer(app);
  await new Promise<void>((resolve) => srv.listen(0, "127.0.0.1", resolve));
  const addr = srv.address() as AddressInfo;
  return {
    base: `http://127.0.0.1:${addr.port}`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        srv.close((err) => (err ? reject(err) : resolve())),
      ),
  };
}

const INITIAL_CONTENT = [
  "# CAPTURE",
  "",
  "_(Paste new entries below this line.)_",
  "",
].join("\n");

beforeEach(() => {
  tmpCapturePath = path.join(os.tmpdir(), `capture-test-${Date.now()}.md`);
  fs.writeFileSync(tmpCapturePath, INITIAL_CONTENT, "utf-8");
  process.env.CAPTURE_PATH = tmpCapturePath;
  __clearRateLimiter();
});

afterEach(() => {
  delete process.env.CAPTURE_PATH;
  try { fs.unlinkSync(tmpCapturePath); } catch { /* already gone */ }
});

// ── helpers ───────────────────────────────────────────────────────────────────

async function getNonce(base: string): Promise<string> {
  const res = await fetch(`${base}/api/capture/nonce`);
  const body = await res.json() as { token?: string };
  if (!body.token) throw new Error("no token in nonce response");
  return body.token;
}

async function postCapture(
  base: string,
  payload: Record<string, unknown>,
): Promise<Response> {
  return fetch(`${base}/api/capture`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/capture/nonce", () => {
  it("returns a token and expiresAt", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(`${h.base}/api/capture/nonce`);
      expect(res.status).toBe(200);
      const body = await res.json() as { token?: string; expiresAt?: number };
      expect(typeof body.token).toBe("string");
      expect(body.token?.split(".")).toHaveLength(3);
      expect(typeof body.expiresAt).toBe("number");
      expect(body.expiresAt).toBeGreaterThan(Date.now());
    } finally {
      await h.close();
    }
  });
});

describe("POST /api/capture — nonce gate", () => {
  it("returns 403 when no nonce is supplied", async () => {
    const h = await startHarness();
    try {
      const res = await postCapture(h.base, {
        thought: "hello",
        constellation: "Codetry",
        urgency: "now",
      });
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("returns 403 when the nonce is tampered", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      const tampered = nonce + "x";
      const res = await postCapture(h.base, {
        thought: "hello",
        constellation: "Codetry",
        urgency: "now",
        nonce: tampered,
      });
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("returns 403 when the nonce is a random string", async () => {
    const h = await startHarness();
    try {
      const res = await postCapture(h.base, {
        thought: "hello",
        constellation: "Codetry",
        urgency: "now",
        nonce: "not.a.valid.nonce.at.all",
      });
      expect(res.status).toBe(403);
    } finally {
      await h.close();
    }
  });

  it("returns 200 with a valid nonce", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      const res = await postCapture(h.base, {
        thought: "Valid thought",
        constellation: "Codetry",
        urgency: "now",
        nonce,
      });
      expect(res.status).toBe(200);
      const body = await res.json() as { ok?: boolean };
      expect(body.ok).toBe(true);
    } finally {
      await h.close();
    }
  });
});

describe("POST /api/capture — input validation", () => {
  it("returns 400 when thought is missing", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      const res = await postCapture(h.base, { constellation: "Codetry", urgency: "now", nonce });
      expect(res.status).toBe(400);
      const body = await res.json() as { error?: string };
      expect(body.error).toMatch(/thought/i);
    } finally {
      await h.close();
    }
  });

  it("returns 400 when thought is empty string", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      const res = await postCapture(h.base, { thought: "   ", constellation: "Codetry", urgency: "now", nonce });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });

  it("returns 400 when thought exceeds 2000 chars", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      const res = await postCapture(h.base, {
        thought: "x".repeat(2001),
        constellation: "Codetry",
        urgency: "now",
        nonce,
      });
      expect(res.status).toBe(400);
      const body = await res.json() as { error?: string };
      expect(body.error).toMatch(/2000/);
    } finally {
      await h.close();
    }
  });

  it("accepts thought of exactly 2000 chars", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      const res = await postCapture(h.base, {
        thought: "x".repeat(2000),
        constellation: "Codetry",
        urgency: "now",
        nonce,
      });
      expect(res.status).toBe(200);
    } finally {
      await h.close();
    }
  });

  it("returns 400 for an invalid urgency value", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      const res = await postCapture(h.base, {
        thought: "hello",
        constellation: "Codetry",
        urgency: "someday",
        nonce,
      });
      expect(res.status).toBe(400);
      const body = await res.json() as { error?: string };
      expect(body.error).toMatch(/urgency/i);
    } finally {
      await h.close();
    }
  });

  it("returns 400 when constellation exceeds 100 chars", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      const res = await postCapture(h.base, {
        thought: "hello",
        constellation: "C".repeat(101),
        urgency: "now",
        nonce,
      });
      expect(res.status).toBe(400);
    } finally {
      await h.close();
    }
  });
});

describe("POST /api/capture — append behaviour", () => {
  it("inserts the entry after the marker line", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      await postCapture(h.base, {
        thought: "Testing the append",
        constellation: "Pioneer Path",
        urgency: "next",
        nonce,
      });
      const content = fs.readFileSync(tmpCapturePath, "utf-8");
      const markerIdx = content.indexOf("_(Paste new entries below this line.)_");
      expect(markerIdx).toBeGreaterThan(-1);
      // Entry must appear AFTER the marker
      const entryIdx = content.indexOf("## Testing the append");
      expect(entryIdx).toBeGreaterThan(markerIdx);
    } finally {
      await h.close();
    }
  });

  it("writes all required fields into the entry", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      await postCapture(h.base, {
        thought: "My raw thought here",
        constellation: "Codetry",
        urgency: "later",
        nonce,
      });
      const content = fs.readFileSync(tmpCapturePath, "utf-8");
      expect(content).toContain("**Raw thought:** My raw thought here");
      expect(content).toContain("**Constellation:** Codetry");
      expect(content).toContain("**Urgency:** later");
      expect(content).toContain("**Connects to:**");
      expect(content).toContain("**Notes:**");
    } finally {
      await h.close();
    }
  });

  it("defaults missing constellation to 'Unsure'", async () => {
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      await postCapture(h.base, { thought: "Thought without constellation", urgency: "now", nonce });
      const content = fs.readFileSync(tmpCapturePath, "utf-8");
      expect(content).toContain("**Constellation:** Unsure");
    } finally {
      await h.close();
    }
  });

  it("accumulates multiple entries in order, newest first after marker", async () => {
    const h = await startHarness();
    try {
      const n1 = await getNonce(h.base);
      await postCapture(h.base, { thought: "First thought", constellation: "Codetry", urgency: "now", nonce: n1 });
      const n2 = await getNonce(h.base);
      await postCapture(h.base, { thought: "Second thought", constellation: "Codetry", urgency: "later", nonce: n2 });

      const content = fs.readFileSync(tmpCapturePath, "utf-8");
      const first = content.indexOf("## First thought");
      const second = content.indexOf("## Second thought");
      // Both entries present
      expect(first).toBeGreaterThan(-1);
      expect(second).toBeGreaterThan(-1);
      // Second entry is inserted before the first (newest-first after marker)
      expect(second).toBeLessThan(first);
    } finally {
      await h.close();
    }
  });

  it("appends at end of file when the marker is absent", async () => {
    fs.writeFileSync(tmpCapturePath, "# CAPTURE\n\nNo marker here.\n", "utf-8");
    const h = await startHarness();
    try {
      const nonce = await getNonce(h.base);
      const res = await postCapture(h.base, {
        thought: "Marker-less file test",
        constellation: "Codetry",
        urgency: "now",
        nonce,
      });
      expect(res.status).toBe(200);
      const content = fs.readFileSync(tmpCapturePath, "utf-8");
      expect(content).toContain("## Marker-less file test");
    } finally {
      await h.close();
    }
  });
});

describe("POST /api/capture — rate limiting", () => {
  it("returns 429 after 15 requests in the same window", async () => {
    const h = await startHarness();
    try {
      // Burn through the rate limit with nonce fetches (they share the limit)
      const responses: number[] = [];
      for (let i = 0; i < 20; i++) {
        const r = await fetch(`${h.base}/api/capture/nonce`);
        responses.push(r.status);
      }
      expect(responses).toContain(429);
    } finally {
      await h.close();
    }
  });
});
