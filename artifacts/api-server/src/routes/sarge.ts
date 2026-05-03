/**
 * Sarge routes — Bobbie's personal mobile operating system backend.
 *
 * POST /api/sarge/week            — save (upsert) a week plan
 * GET  /api/sarge/week/current    — return the current week's plan + cards
 * PATCH /api/sarge/card/:id       — update a card's status
 * POST /api/sarge/barrier         — log a barrier note against a card
 * POST /api/sarge/generate        — AI: turn priorities into a card set
 */

import { Router, type IRouter } from "express";
import { db, sargeWeeksTable, sargeCardsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// ─── helpers ─────────────────────────────────────────────────────────────────

function currentISOWeek(): string {
  const now = new Date();
  const d = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function serializeCard(row: typeof sargeCardsTable.$inferSelect) {
  return {
    id: row.id,
    weekId: row.weekId,
    priorityId: row.priorityId,
    priorityLabel: row.priorityLabel,
    action: row.action,
    context: row.context ?? null,
    status: row.status,
    order: row.order,
    completedAt: row.completedAt?.toISOString() ?? null,
    barrierNote: row.barrierNote ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function serializeWeek(
  row: typeof sargeWeeksTable.$inferSelect,
  cards: typeof sargeCardsTable.$inferSelect[],
) {
  return {
    id: row.id,
    weekOf: row.weekOf,
    priorities: row.priorities,
    isLocked: row.isLocked,
    lockedAt: row.lockedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    cards: cards.map(serializeCard),
  };
}

// ─── GET /sarge/week/current ─────────────────────────────────────────────────

router.get("/week/current", async (_req, res) => {
  try {
    const [week] = await db
      .select()
      .from(sargeWeeksTable)
      .orderBy(desc(sargeWeeksTable.createdAt))
      .limit(1);

    if (!week) {
      res.json({ week: null });
      return;
    }

    const cards = await db
      .select()
      .from(sargeCardsTable)
      .where(eq(sargeCardsTable.weekId, week.id))
      .orderBy(sargeCardsTable.order);

    res.json({ week: serializeWeek(week, cards) });
  } catch (err) {
    logger.error({ err }, "sarge: GET /week/current failed");
    res.status(500).json({ error: "Failed to load current week" });
  }
});

// ─── POST /sarge/week ────────────────────────────────────────────────────────
//
// Upsert a week plan. If weekOf matches an existing row, update it.
// Accepts priorities array (and optional lock flag) in the body.
// If cards are provided, they are upserted (by id if present, else inserted).

router.post("/week", async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const weekOf =
    typeof body.weekOf === "string" ? body.weekOf : currentISOWeek();
  const priorities = Array.isArray(body.priorities) ? body.priorities : [];
  const isLocked = body.isLocked === true;
  const cards = Array.isArray(body.cards) ? body.cards : [];

  try {
    // Upsert week row
    const existing = await db
      .select()
      .from(sargeWeeksTable)
      .where(eq(sargeWeeksTable.weekOf, weekOf))
      .limit(1);

    let weekId: string;
    const now = new Date();

    if (existing.length > 0) {
      const row = existing[0]!;
      weekId = row.id;
      await db
        .update(sargeWeeksTable)
        .set({
          priorities: priorities as typeof sargeWeeksTable.$inferInsert["priorities"],
          isLocked,
          lockedAt: isLocked ? (row.lockedAt ?? now) : null,
          updatedAt: now,
        })
        .where(eq(sargeWeeksTable.id, weekId));
    } else {
      const [inserted] = await db
        .insert(sargeWeeksTable)
        .values({
          weekOf,
          priorities: priorities as typeof sargeWeeksTable.$inferInsert["priorities"],
          isLocked,
          lockedAt: isLocked ? now : null,
        })
        .returning();
      weekId = inserted!.id;
    }

    // Upsert cards if provided
    if (cards.length > 0) {
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i] as Record<string, unknown>;
        const UUID_RE =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const cardId =
          typeof c.id === "string" && UUID_RE.test(c.id) ? c.id : undefined;
        const action =
          typeof c.action === "string" ? c.action.trim() : "";
        if (!action) continue;

        const priorityId =
          typeof c.priorityId === "string" ? c.priorityId : "misc";
        const priorityLabel =
          typeof c.priorityLabel === "string" ? c.priorityLabel : "Misc";
        const context = typeof c.context === "string" ? c.context : null;
        const order = typeof c.order === "number" ? c.order : i;

        await db
          .insert(sargeCardsTable)
          .values({
            ...(cardId ? { id: cardId } : {}),
            weekId,
            priorityId,
            priorityLabel,
            action,
            context,
            status: "active",
            order,
          })
          .onConflictDoUpdate({
            target: sargeCardsTable.id,
            set: {
              action,
              context,
              priorityLabel,
              order,
              updatedAt: now,
            },
          });
      }
    }

    const [updatedWeek] = await db
      .select()
      .from(sargeWeeksTable)
      .where(eq(sargeWeeksTable.id, weekId))
      .limit(1);

    const updatedCards = await db
      .select()
      .from(sargeCardsTable)
      .where(eq(sargeCardsTable.weekId, weekId))
      .orderBy(sargeCardsTable.order);

    res.json({ week: serializeWeek(updatedWeek!, updatedCards) });
  } catch (err) {
    logger.error({ err }, "sarge: POST /week failed");
    res.status(500).json({ error: "Failed to save week" });
  }
});

// ─── PATCH /sarge/card/:id ───────────────────────────────────────────────────

router.patch("/card/:id", async (req, res) => {
  const { id } = req.params;
  const body = (req.body ?? {}) as Record<string, unknown>;

  const validStatuses = ["active", "done", "stuck"] as const;
  type CardStatus = typeof validStatuses[number];
  const status =
    typeof body.status === "string" &&
    (validStatuses as readonly string[]).includes(body.status)
      ? (body.status as CardStatus)
      : null;

  if (!status) {
    res.status(400).json({ error: "status must be one of: active, done, stuck" });
    return;
  }

  try {
    const now = new Date();
    const [updated] = await db
      .update(sargeCardsTable)
      .set({
        status,
        completedAt: status === "done" ? now : null,
        updatedAt: now,
      })
      .where(eq(sargeCardsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Card not found" });
      return;
    }

    res.json({ card: serializeCard(updated) });
  } catch (err) {
    logger.error({ err }, "sarge: PATCH /card/:id failed");
    res.status(500).json({ error: "Failed to update card" });
  }
});

// ─── POST /sarge/barrier ────────────────────────────────────────────────────

router.post("/barrier", async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const cardId = typeof body.cardId === "string" ? body.cardId : null;
  const note =
    typeof body.note === "string" ? body.note.trim().slice(0, 1000) : "";

  if (!cardId) {
    res.status(400).json({ error: "cardId is required" });
    return;
  }

  try {
    const now = new Date();
    const [updated] = await db
      .update(sargeCardsTable)
      .set({
        status: "stuck",
        barrierNote: note || null,
        updatedAt: now,
      })
      .where(eq(sargeCardsTable.id, cardId))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Card not found" });
      return;
    }

    res.json({ card: serializeCard(updated) });
  } catch (err) {
    logger.error({ err }, "sarge: POST /barrier failed");
    res.status(500).json({ error: "Failed to log barrier" });
  }
});

// ─── POST /sarge/generate ────────────────────────────────────────────────────
//
// Takes a list of priorities and uses AI to generate 2-4 concrete,
// ADHD-friendly action cards for each one. Returns a flat card array.

const GENERATE_SYSTEM = `You are Sarge, a focused tactical assistant for a practitioner running several live projects. 
Your job is to break weekly priorities into concrete, ADHD-friendly action cards.

Rules:
- Each priority gets 2–4 cards. Prefer 3.
- Each card action must be a single concrete step that can be completed in 30–90 minutes.
- Actions start with a strong verb (Write, Call, Send, Book, Draft, Review, Post, Ship, etc.)
- No vague actions like "work on X" or "think about Y"
- Context is 1–2 sentences max that give the minimum context needed to start — no fluff
- Cards must be scoped to THIS WEEK — not "eventually" or "someday"
- Total cards across all priorities: 8–18 maximum

Return ONLY valid JSON in this exact shape — no markdown, no commentary:
{
  "cards": [
    {
      "priorityId": "<same id from input>",
      "priorityLabel": "<same label from input>",
      "action": "<strong verb + concrete task>",
      "context": "<1-2 sentences of context>"
    }
  ]
}`;

router.post("/generate", async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const priorities = Array.isArray(body.priorities) ? body.priorities : [];

  if (priorities.length === 0) {
    res.status(400).json({ error: "priorities array is required" });
    return;
  }

  const userMessage = `Generate this week's action cards for the following priorities:

${priorities.map((p: Record<string, unknown>, i: number) => `${i + 1}. [id: ${p.id}] ${p.label}`).join("\n")}

Today is ${new Date().toDateString()}. Week: ${currentISOWeek()}.
Remember: 2-4 cards per priority, concrete single-session actions, ADHD-friendly scope.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: GENERATE_SYSTEM,
      messages: [{ role: "user", content: userMessage }],
    });

    const block = message.content[0];
    if (!block || block.type !== "text") {
      res.status(500).json({ error: "No text response from AI" });
      return;
    }

    const text = block.text.trim();
    // Strip any accidental markdown fences
    const jsonStr = text.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "");
    const parsed = JSON.parse(jsonStr) as { cards: unknown[] };

    res.json({ cards: parsed.cards });
  } catch (err) {
    logger.error({ err }, "sarge: POST /generate failed");
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
