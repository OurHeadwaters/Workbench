import { describe, it, expect, beforeEach, vi } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

// ─── mocks ────────────────────────────────────────────────────────────────────
//
// The sarge router reaches into:
//   - `@workspace/db`                      — real Postgres pool
//   - `drizzle-orm`                        — column comparators
//   - `@workspace/integrations-anthropic-ai` — Anthropic client (only used by
//                                             /generate — we mock it to avoid
//                                             real network calls even if that
//                                             route isn't exercised here)
//   - `../lib/logger`                      — pino logger

vi.mock("@workspace/db", async () => {
  const { makeTable, makeFakeDb } = await import("../test/fakeDb");

  const sargeWeeksTable = makeTable({
    name: "sarge_weeks",
    pk: ["id"],
    columns: [
      "id",
      "weekOf",
      "priorities",
      "isLocked",
      "lockedAt",
      "createdAt",
      "updatedAt",
    ],
    defaults: {
      priorities: [],
      isLocked: false,
      lockedAt: null,
    },
  });

  const sargeCardsTable = makeTable({
    name: "sarge_cards",
    pk: ["id"],
    columns: [
      "id",
      "weekId",
      "priorityId",
      "priorityLabel",
      "action",
      "context",
      "status",
      "order",
      "completedAt",
      "barrierNote",
      "createdAt",
      "updatedAt",
    ],
    defaults: {
      status: "active",
      order: 0,
      context: null,
      completedAt: null,
      barrierNote: null,
    },
  });

  return { db: makeFakeDb(), sargeWeeksTable, sargeCardsTable };
});

vi.mock("drizzle-orm", async () => {
  const { fakeDrizzle } = await import("../test/fakeDb");
  return fakeDrizzle;
});

vi.mock("@workspace/integrations-anthropic-ai", () => ({
  anthropic: {
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ type: "text", text: '{"cards":[]}' }],
      }),
    },
  },
}));

vi.mock("../lib/logger", () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

// ─── imports (after mocks) ────────────────────────────────────────────────────

import express from "express";
import sargeRouter from "./sarge";
import * as dbModule from "@workspace/db";
import type { FakeTable } from "../test/fakeDb";

const sargeWeeksTable = (
  dbModule as unknown as { sargeWeeksTable: FakeTable }
).sargeWeeksTable;

const sargeCardsTable = (
  dbModule as unknown as { sargeCardsTable: FakeTable }
).sargeCardsTable;

// ─── harness ─────────────────────────────────────────────────────────────────

interface Harness {
  base: string;
  close: () => Promise<void>;
}

async function startHarness(): Promise<Harness> {
  const app = express();
  app.use(express.json());
  app.use("/api/sarge", sargeRouter);
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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── helpers ─────────────────────────────────────────────────────────────────

async function postWeek(
  base: string,
  body: Record<string, unknown>,
): Promise<{ week: { id: string; weekOf: string; isLocked: boolean; cards: WeekCard[] } }> {
  const res = await fetch(`${base}/api/sarge/week`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`POST /week failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<{ week: { id: string; weekOf: string; isLocked: boolean; cards: WeekCard[] } }>;
}

interface WeekCard {
  id: string;
  action: string;
  status: string;
  barrierNote: string | null;
  completedAt: string | null;
}

async function patchCard(
  base: string,
  cardId: string,
  status: string,
): Promise<{ card: WeekCard }> {
  const res = await fetch(`${base}/api/sarge/card/${cardId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error(`PATCH /card/${cardId} failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<{ card: WeekCard }>;
}

async function getCurrentWeek(
  base: string,
): Promise<{ week: { id: string; isLocked: boolean; cards: WeekCard[] } | null }> {
  const res = await fetch(`${base}/api/sarge/week/current`);
  if (!res.ok) {
    throw new Error(`GET /week/current failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<{ week: { id: string; isLocked: boolean; cards: WeekCard[] } | null }>;
}

// ─── setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  sargeWeeksTable.__store.length = 0;
  sargeCardsTable.__store.length = 0;
});

// ─── tests ────────────────────────────────────────────────────────────────────

describe("sarge — GET /week/current with no data", () => {
  it("returns { week: null } when there are no weeks", async () => {
    const h = await startHarness();
    try {
      const body = await getCurrentWeek(h.base);
      expect(body.week).toBeNull();
    } finally {
      await h.close();
    }
  });
});

describe("sarge — full lock → mobile-fetch cycle", () => {
  it("saves a week with cards, locks it, and mobile GET returns valid-UUID card IDs", async () => {
    const h = await startHarness();
    try {
      // 1. Desktop: save a week with two cards (simulating post-generate save)
      const priorities = [{ id: "marketing", label: "Marketing", order: 0, isActive: true }];
      const cards = [
        {
          priorityId: "marketing",
          priorityLabel: "Marketing",
          action: "Write the newsletter draft",
          context: "Due Friday",
          order: 0,
        },
        {
          priorityId: "marketing",
          priorityLabel: "Marketing",
          action: "Send follow-up emails",
          context: "Reply to last week's leads",
          order: 1,
        },
      ];

      const saved = await postWeek(h.base, {
        weekOf: "2026-W18",
        priorities,
        isLocked: false,
        cards,
      });

      expect(saved.week.weekOf).toBe("2026-W18");
      expect(saved.week.isLocked).toBe(false);
      expect(saved.week.cards).toHaveLength(2);

      // All card IDs must be valid UUIDs
      for (const card of saved.week.cards) {
        expect(card.id).toMatch(UUID_RE);
      }

      // 2. Desktop: lock the week
      const locked = await postWeek(h.base, {
        weekOf: "2026-W18",
        priorities,
        isLocked: true,
        cards: saved.week.cards, // send back the cards with their assigned IDs
      });

      expect(locked.week.isLocked).toBe(true);
      expect(locked.week.cards).toHaveLength(2);

      // IDs must be stable across the lock upsert
      const lockedIds = locked.week.cards.map((c) => c.id).sort();
      const savedIds = saved.week.cards.map((c) => c.id).sort();
      expect(lockedIds).toEqual(savedIds);

      // 3. Mobile: GET /week/current — simulates the handbook app fetching
      const current = await getCurrentWeek(h.base);

      expect(current.week).not.toBeNull();
      expect(current.week!.isLocked).toBe(true);
      expect(current.week!.cards).toHaveLength(2);

      // All card IDs are valid UUIDs (the critical regression guard)
      for (const card of current.week!.cards) {
        expect(card.id).toMatch(UUID_RE);
        expect(card.status).toBe("active");
      }
    } finally {
      await h.close();
    }
  });
});

describe("sarge — card status updates survive a reload", () => {
  it("marks a card done → GET /week/current shows status=done", async () => {
    const h = await startHarness();
    try {
      // Create a locked week with one card
      const saved = await postWeek(h.base, {
        weekOf: "2026-W19",
        priorities: [{ id: "hiring", label: "Hiring", order: 0, isActive: true }],
        isLocked: true,
        cards: [
          {
            priorityId: "hiring",
            priorityLabel: "Hiring",
            action: "Review applications",
            context: "Deadline is Monday",
            order: 0,
          },
        ],
      });

      const cardId = saved.week.cards[0]!.id;
      expect(cardId).toMatch(UUID_RE);

      // Mark done via PATCH
      const patched = await patchCard(h.base, cardId, "done");
      expect(patched.card.status).toBe("done");
      expect(patched.card.completedAt).not.toBeNull();

      // Simulate a page reload: fetch current week again
      const reloaded = await getCurrentWeek(h.base);
      expect(reloaded.week).not.toBeNull();

      const reloadedCard = reloaded.week!.cards.find((c) => c.id === cardId);
      expect(reloadedCard).toBeDefined();
      expect(reloadedCard!.status).toBe("done");
      expect(reloadedCard!.completedAt).not.toBeNull();
    } finally {
      await h.close();
    }
  });

  it("marks a card stuck → GET /week/current shows status=stuck", async () => {
    const h = await startHarness();
    try {
      const saved = await postWeek(h.base, {
        weekOf: "2026-W19",
        priorities: [{ id: "ops", label: "Ops", order: 0, isActive: true }],
        isLocked: true,
        cards: [
          {
            priorityId: "ops",
            priorityLabel: "Ops",
            action: "Submit invoice to contractor",
            context: "Waiting on updated PO number",
            order: 0,
          },
        ],
      });

      const cardId = saved.week.cards[0]!.id;

      // Mark stuck via PATCH
      const patched = await patchCard(h.base, cardId, "stuck");
      expect(patched.card.status).toBe("stuck");

      // Simulate page reload
      const reloaded = await getCurrentWeek(h.base);
      const reloadedCard = reloaded.week!.cards.find((c) => c.id === cardId);
      expect(reloadedCard!.status).toBe("stuck");
    } finally {
      await h.close();
    }
  });

  it("logs a barrier note via POST /barrier → reload shows stuck + note", async () => {
    const h = await startHarness();
    try {
      const saved = await postWeek(h.base, {
        weekOf: "2026-W19",
        priorities: [{ id: "ops", label: "Ops", order: 0, isActive: true }],
        isLocked: true,
        cards: [
          {
            priorityId: "ops",
            priorityLabel: "Ops",
            action: "Send MOU to band council",
            context: "Need signature before end of week",
            order: 0,
          },
        ],
      });

      const cardId = saved.week.cards[0]!.id;

      // Log a barrier note
      const barrierRes = await fetch(`${h.base}/api/sarge/barrier`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cardId, note: "Waiting for admin to send final draft" }),
      });
      expect(barrierRes.ok).toBe(true);
      const barrierBody = (await barrierRes.json()) as { card: WeekCard };
      expect(barrierBody.card.status).toBe("stuck");
      expect(barrierBody.card.barrierNote).toBe("Waiting for admin to send final draft");

      // Reload — barrier note and stuck status must persist
      const reloaded = await getCurrentWeek(h.base);
      const reloadedCard = reloaded.week!.cards.find((c) => c.id === cardId);
      expect(reloadedCard!.status).toBe("stuck");
      expect(reloadedCard!.barrierNote).toBe("Waiting for admin to send final draft");
    } finally {
      await h.close();
    }
  });

  it("status can be toggled back to active from done → reload reflects the change", async () => {
    const h = await startHarness();
    try {
      const saved = await postWeek(h.base, {
        weekOf: "2026-W20",
        priorities: [{ id: "admin", label: "Admin", order: 0, isActive: true }],
        isLocked: true,
        cards: [
          {
            priorityId: "admin",
            priorityLabel: "Admin",
            action: "File grant report",
            context: "Quarterly deadline",
            order: 0,
          },
        ],
      });

      const cardId = saved.week.cards[0]!.id;

      // Mark done
      await patchCard(h.base, cardId, "done");

      // Revert to active
      const reverted = await patchCard(h.base, cardId, "active");
      expect(reverted.card.status).toBe("active");
      expect(reverted.card.completedAt).toBeNull();

      // Reload confirms the reversion
      const reloaded = await getCurrentWeek(h.base);
      const reloadedCard = reloaded.week!.cards.find((c) => c.id === cardId);
      expect(reloadedCard!.status).toBe("active");
      expect(reloadedCard!.completedAt).toBeNull();
    } finally {
      await h.close();
    }
  });
});

describe("sarge — PATCH /card/:id validation", () => {
  it("returns 400 for an invalid status value", async () => {
    const h = await startHarness();
    try {
      // We don't need an existing card — the route rejects before the DB query
      const res = await fetch(`${h.base}/api/sarge/card/some-id`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "invalid-status" }),
      });
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error?: string };
      expect(body.error).toMatch(/active|done|stuck/);
    } finally {
      await h.close();
    }
  });

  it("returns 404 when the card ID does not exist", async () => {
    const h = await startHarness();
    try {
      const res = await fetch(
        `${h.base}/api/sarge/card/00000000-0000-4000-8000-000000000000`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status: "done" }),
        },
      );
      expect(res.status).toBe(404);
    } finally {
      await h.close();
    }
  });
});

describe("sarge — POST /week card-ID stability", () => {
  it("re-posting cards with explicit UUIDs does not create duplicate rows", async () => {
    const h = await startHarness();
    try {
      // First save — cards get auto-generated IDs
      const first = await postWeek(h.base, {
        weekOf: "2026-W21",
        priorities: [],
        isLocked: false,
        cards: [
          { priorityId: "p1", priorityLabel: "P1", action: "Task one", order: 0 },
        ],
      });

      expect(first.week.cards).toHaveLength(1);
      const cardId = first.week.cards[0]!.id;
      expect(cardId).toMatch(UUID_RE);

      // Second save — send the card back WITH its assigned ID (lock flow)
      const second = await postWeek(h.base, {
        weekOf: "2026-W21",
        priorities: [],
        isLocked: true,
        cards: [
          {
            id: cardId,
            priorityId: "p1",
            priorityLabel: "P1",
            action: "Task one",
            order: 0,
          },
        ],
      });

      // Must still be exactly one card — no duplicates
      expect(second.week.cards).toHaveLength(1);
      expect(second.week.cards[0]!.id).toBe(cardId);

      // And the in-memory store should also have exactly one card row
      expect(sargeCardsTable.__store).toHaveLength(1);
    } finally {
      await h.close();
    }
  });
});
