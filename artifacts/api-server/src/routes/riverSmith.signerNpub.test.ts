/**
 * riverSmith — signerNpub wiring tests
 *
 * Confirms that generateRiverSmithBriefing() carries the Z2 npub from
 * getZ2Npub() into result.structuredJson.signerNpub, and that the absence
 * of a seed causes signerNpub to be null rather than an error.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

// ─── env setup (must happen before any module import) ────────────────────────

const VALID_NPUB =
  "npub1qpzry9x8gf2tvdw0s3jn54khce6mua7lmqqqxw";

process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL = "http://fake-openrouter.test";
process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY = "test-api-key";

// ─── mocks ────────────────────────────────────────────────────────────────────

vi.mock("../lib/z2Identity", () => ({
  initZ2Identity: vi.fn(),
  getZ2Npub: vi.fn(),
}));

vi.mock("../lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock("../lib/ownerAuth", () => ({
  isOwnerRequest: vi.fn().mockReturnValue(true),
  OWNER_TOKEN: "test-token",
}));

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");

  const projectTasksTable = makeTable({
    name: "project_tasks",
    pk: ["id"],
    columns: ["id", "title", "status", "createdAt", "updatedAt"],
    defaults: { status: "open" },
  });

  const deadheadItemsTable = makeTable({
    name: "deadhead_items",
    pk: ["id"],
    columns: ["id", "title", "source", "flushedAt", "createdAt"],
  });

  const deadheadFlushLogTable = makeTable({
    name: "deadhead_flush_log",
    pk: ["id"],
    columns: ["id", "count", "flushedAt"],
  });

  const communityIntakeTable = makeTable({
    name: "community_intake",
    pk: ["id"],
    columns: ["id", "name", "community", "whatTheyNeed", "createdAt"],
  });

  const messages = makeTable({
    name: "messages",
    pk: ["id"],
    columns: ["id", "role", "content", "createdAt"],
  });

  const bookkeeperTransactionsTable = makeTable({
    name: "bk_transactions",
    pk: ["id"],
    columns: ["id", "description", "postedDate", "status", "createdAt"],
  });

  const bookkeeperTransactionLinesTable = makeTable({
    name: "bk_transaction_lines",
    pk: ["id"],
    columns: ["id", "transactionId", "debit", "credit"],
  });

  const sargeWeeksTable = makeTable({
    name: "sarge_weeks",
    pk: ["id"],
    columns: ["id", "weekOf", "priorities", "isLocked", "lockedAt", "createdAt", "updatedAt"],
    defaults: { priorities: [], isLocked: false, lockedAt: null },
  });

  const sargeCardsTable = makeTable({
    name: "sarge_cards",
    pk: ["id"],
    columns: [
      "id", "weekId", "priorityId", "priorityLabel", "action", "context",
      "status", "order", "completedAt", "barrierNote", "createdAt", "updatedAt",
    ],
    defaults: { status: "active", order: 0, context: null, completedAt: null, barrierNote: null },
  });

  const riverBriefingsTable = makeTable({
    name: "river_briefings",
    pk: ["id"],
    columns: ["id", "rawMarkdown", "structuredJson", "status", "triggeredBy", "generatedAt", "createdAt"],
    defaults: { status: "published", triggeredBy: "scheduled" },
  });

  return {
    db: makeFakeDb(),
    projectTasksTable,
    deadheadItemsTable,
    deadheadFlushLogTable,
    communityIntakeTable,
    messages,
    bookkeeperTransactionsTable,
    bookkeeperTransactionLinesTable,
    sargeWeeksTable,
    sargeCardsTable,
    riverBriefingsTable,
  };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

// ─── imports (after mocks) ────────────────────────────────────────────────────

import { generateRiverSmithBriefing } from "./riverSmith";
import { getZ2Npub } from "../lib/z2Identity";

// ─── minimal River Smith markdown fixture ─────────────────────────────────────

const FAKE_BRIEFING_MD = `---
## 🌊 River Smith — Nightly Briefing
**Saturday, July 26, 2026**

### Eagle's Summary
The river ran quiet tonight. No significant disturbances across the watershed.

### Waters That Moved
- The river was quiet.

### Decisions Needed
No decisions needed tonight. The table can rest.

### Gord's Quiet Note
Gord checked the lines. They held. Gord's on board.
---`;

function makeFakeFetch(markdown: string) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      choices: [{ message: { content: markdown } }],
    }),
    text: async () => "",
  });
}

// ─── tests ────────────────────────────────────────────────────────────────────

describe("generateRiverSmithBriefing — signerNpub wiring", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeAll(() => {
    originalFetch = globalThis.fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  it("structuredJson.signerNpub is a valid bech32 npub1… string when Z2_HOUSEHOLD_SEED is configured", async () => {
    vi.mocked(getZ2Npub).mockReturnValue(VALID_NPUB);
    globalThis.fetch = makeFakeFetch(FAKE_BRIEFING_MD);

    const result = await generateRiverSmithBriefing("scheduled");

    expect(result.structuredJson.signerNpub).not.toBeNull();
    expect(result.structuredJson.signerNpub).toMatch(/^npub1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]+$/);
    expect(result.structuredJson.signerNpub).toBe(VALID_NPUB);
  });

  it("structuredJson.signerNpub is null (not an error) when Z2_HOUSEHOLD_SEED is absent", async () => {
    vi.mocked(getZ2Npub).mockReturnValue(null);
    globalThis.fetch = makeFakeFetch(FAKE_BRIEFING_MD);

    const result = await generateRiverSmithBriefing("scheduled");

    expect(result.structuredJson.signerNpub).toBeNull();
  });

  it("result still carries a valid id and rawMarkdown regardless of signerNpub", async () => {
    vi.mocked(getZ2Npub).mockReturnValue(VALID_NPUB);
    globalThis.fetch = makeFakeFetch(FAKE_BRIEFING_MD);

    const result = await generateRiverSmithBriefing("manual");

    expect(result.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(result.rawMarkdown).toBe(FAKE_BRIEFING_MD);
  });
});
