/**
 * northStarProposals.test.ts
 *
 * Tests for POST /api/north-star/proposals/:id/outcome
 *
 * - Missing token → 401, no state change possible
 * - Wrong token → 401
 * - Valid token + accepted → 200 { ok: true, outcome: "accepted" }
 * - Valid token + rejected → 200 { ok: true, outcome: "rejected" }
 * - Valid token + bad outcome value → 400
 * - Valid token + missing outcome → 400
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ── set the owner token before any module is imported ────────────────────────
// ownerAuth.ts captures LIBRARY_OWNER_TOKEN at module-eval time, so this must
// be hoisted ahead of the import phase.
const VALID_TOKEN = "test-owner-token-secret-123";
vi.hoisted(() => {
  process.env.LIBRARY_OWNER_TOKEN = "test-owner-token-secret-123";
});

import express from "express";
import northStarProposalsRouter from "./northStarProposals";

// ── harness ───────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/north-star", northStarProposalsRouter);
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

const PROPOSAL_ID = "prop-test-abc-123";

function postOutcome(
  base: string,
  id: string,
  body: unknown,
  token?: string,
): Promise<Response> {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (token) headers["x-library-owner-token"] = token;
  return fetch(`${base}/api/north-star/proposals/${id}/outcome`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/north-star/proposals/:id/outcome — auth", () => {
  let h: Harness;
  beforeAll(async () => { h = await startHarness(); });
  afterAll(async () => { await h.close(); });

  it("returns 401 when no token is provided", async () => {
    const res = await postOutcome(h.base, PROPOSAL_ID, { outcome: "accepted" });
    expect(res.status).toBe(401);
    const body = await res.json() as { error: string };
    expect(body.error).toMatch(/unauthorized/i);
  });

  it("returns 401 when the token is wrong", async () => {
    const res = await postOutcome(h.base, PROPOSAL_ID, { outcome: "accepted" }, "wrong-token");
    expect(res.status).toBe(401);
  });

  it("does not reveal the correct token in the 401 body", async () => {
    const res = await postOutcome(h.base, PROPOSAL_ID, { outcome: "accepted" }, "bad-token");
    const body = await res.json() as { error: string };
    expect(body.error).not.toContain(VALID_TOKEN);
  });
});

describe("POST /api/north-star/proposals/:id/outcome — valid token, accepted", () => {
  let h: Harness;
  beforeAll(async () => { h = await startHarness(); });
  afterAll(async () => { await h.close(); });

  it("returns 200 with ok:true and outcome:'accepted'", async () => {
    const res = await postOutcome(h.base, PROPOSAL_ID, { outcome: "accepted" }, VALID_TOKEN);
    expect(res.status).toBe(200);
    const body = await res.json() as { ok: boolean; id: string; outcome: string };
    expect(body.ok).toBe(true);
    expect(body.outcome).toBe("accepted");
    expect(body.id).toBe(PROPOSAL_ID);
  });
});

describe("POST /api/north-star/proposals/:id/outcome — valid token, rejected", () => {
  let h: Harness;
  beforeAll(async () => { h = await startHarness(); });
  afterAll(async () => { await h.close(); });

  it("returns 200 with ok:true and outcome:'rejected'", async () => {
    const res = await postOutcome(h.base, PROPOSAL_ID, { outcome: "rejected" }, VALID_TOKEN);
    expect(res.status).toBe(200);
    const body = await res.json() as { ok: boolean; id: string; outcome: string };
    expect(body.ok).toBe(true);
    expect(body.outcome).toBe("rejected");
  });
});

describe("POST /api/north-star/proposals/:id/outcome — input validation", () => {
  let h: Harness;
  beforeAll(async () => { h = await startHarness(); });
  afterAll(async () => { await h.close(); });

  it("returns 400 when outcome is missing (valid token)", async () => {
    const res = await postOutcome(h.base, PROPOSAL_ID, {}, VALID_TOKEN);
    expect(res.status).toBe(400);
  });

  it("returns 400 when outcome is an invalid value (valid token)", async () => {
    const res = await postOutcome(h.base, PROPOSAL_ID, { outcome: "maybe" }, VALID_TOKEN);
    expect(res.status).toBe(400);
  });

  it("returns 400 when outcome is null (valid token)", async () => {
    const res = await postOutcome(h.base, PROPOSAL_ID, { outcome: null }, VALID_TOKEN);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/north-star/proposals/:id/outcome — Authorization: Bearer header", () => {
  let h: Harness;
  beforeAll(async () => { h = await startHarness(); });
  afterAll(async () => { await h.close(); });

  it("accepts the owner token via Authorization: Bearer header", async () => {
    const res = await fetch(
      `${h.base}/api/north-star/proposals/${PROPOSAL_ID}/outcome`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${VALID_TOKEN}`,
        },
        body: JSON.stringify({ outcome: "accepted" }),
      },
    );
    expect(res.status).toBe(200);
  });

  it("returns 401 when the Bearer token is wrong", async () => {
    const res = await fetch(
      `${h.base}/api/north-star/proposals/${PROPOSAL_ID}/outcome`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": "Bearer bad-token",
        },
        body: JSON.stringify({ outcome: "accepted" }),
      },
    );
    expect(res.status).toBe(401);
  });
});
