import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { stompingGroundsCounterTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

const SLUG = "total";
const SEED = 2847;

async function getOrInitCount(): Promise<number> {
  const rows = await db
    .select()
    .from(stompingGroundsCounterTable)
    .where(sql`${stompingGroundsCounterTable.slug} = ${SLUG}`)
    .limit(1);

  if (rows[0]) return rows[0].count;

  const [inserted] = await db
    .insert(stompingGroundsCounterTable)
    .values({ slug: SLUG, count: SEED })
    .onConflictDoNothing()
    .returning();

  if (inserted) return inserted.count;

  const retry = await db
    .select()
    .from(stompingGroundsCounterTable)
    .where(sql`${stompingGroundsCounterTable.slug} = ${SLUG}`)
    .limit(1);

  return retry[0]?.count ?? SEED;
}

// ── GET /stomping-grounds/count ──────────────────────────────────────────────
router.get("/count", async (_req: Request, res: Response) => {
  const count = await getOrInitCount();
  res.json({ count });
});

// ── POST /stomping-grounds/count ─────────────────────────────────────────────
// Increments the counter by 1 (called once per browser session from the client).
router.post("/count", async (_req: Request, res: Response) => {
  await getOrInitCount();

  const [updated] = await db
    .update(stompingGroundsCounterTable)
    .set({
      count: sql`${stompingGroundsCounterTable.count} + 1`,
      updatedAt: new Date(),
    })
    .where(sql`${stompingGroundsCounterTable.slug} = ${SLUG}`)
    .returning();

  res.json({ count: updated?.count ?? SEED });
});

export default router;
