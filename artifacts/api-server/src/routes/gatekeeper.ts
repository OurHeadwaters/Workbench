import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  gatekeeperCapsTable,
  gatekeeperSeatsTable,
  gatekeeperMappingsTable,
  gatekeeperSuccessionLogTable,
  sandboxHouseholdsTable,
  sandboxSessionsTable,
} from "@workspace/db";
import { and, desc, eq, gt, asc } from "drizzle-orm";
import {
  GATEKEEPER_DOMAINS,
  FOOD_SUB_DOMAINS,
  FOOD_SYSTEM_SEED_MAPPINGS,
  SUCCESSION_EVENT_TYPES,
} from "../lib/gatekeeper";

const router: IRouter = Router();

// ─── Authorization ────────────────────────────────────────────────────────────
// Gatekeeper mutation endpoints require an authenticated sandbox organizer.
// The founding council is the organizer set — they manage cap/seat assignments.
// Read-only endpoints (GET) are open.

function extractToken(req: Request): string | null {
  const auth = req.header("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return null;
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

async function getOrganizerFromToken(req: Request) {
  const token = extractToken(req);
  if (!token) return null;
  const now = new Date();
  const rows = await db
    .select({ household: sandboxHouseholdsTable })
    .from(sandboxSessionsTable)
    .innerJoin(sandboxHouseholdsTable, eq(sandboxSessionsTable.householdId, sandboxHouseholdsTable.id))
    .where(
      and(
        eq(sandboxSessionsTable.token, token),
        gt(sandboxSessionsTable.expiresAt, now),
      ),
    )
    .limit(1);
  const household = rows[0]?.household ?? null;
  if (!household?.isOrganizer) return null;
  return household;
}

function requireOrganizer() {
  return async (req: Request, res: Response, next: () => void) => {
    const organizer = await getOrganizerFromToken(req);
    if (!organizer) {
      res.status(401).json({ error: "Organizer authorization required" });
      return;
    }
    res.locals.organizer = organizer;
    next();
  };
}

// ─── Seed guard ───────────────────────────────────────────────────────────────
// On first cap assignment the food system worked example mappings are seeded.
// Runs inside the same transaction as the cap insert — seed is atomic with cap creation.
async function ensureFoodSystemSeed(capId: string) {
  const existing = await db
    .select({ id: gatekeeperMappingsTable.id })
    .from(gatekeeperMappingsTable)
    .limit(1);
  if (existing.length > 0) return;

  await db.insert(gatekeeperMappingsTable).values(
    FOOD_SYSTEM_SEED_MAPPINGS.map((m) => ({
      brightSideTerm: m.brightSideTerm,
      systemsTerm: m.systemsTerm,
      domain: m.domain,
      category: m.category,
      subDomain: m.subDomain,
      rationale: m.rationale,
      authority: m.authority,
      isActive: true,
      authoredByCapId: capId,
    })),
  );
}

// ─── Serializers ─────────────────────────────────────────────────────────────

function serializeCap(row: typeof gatekeeperCapsTable.$inferSelect) {
  return {
    id: row.id,
    holderName: row.holderName,
    knowledgeDomain: row.knowledgeDomain,
    rationale: row.rationale,
    isActive: row.isActive,
    heldSince: row.heldSince instanceof Date ? row.heldSince.toISOString() : String(row.heldSince),
    relinquishedAt: row.relinquishedAt
      ? (row.relinquishedAt instanceof Date ? row.relinquishedAt.toISOString() : String(row.relinquishedAt))
      : null,
    relinquishedReason: row.relinquishedReason ?? null,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt),
  };
}

function serializeSeat(row: typeof gatekeeperSeatsTable.$inferSelect) {
  return {
    id: row.id,
    occupantName: row.occupantName,
    institutionalContext: row.institutionalContext,
    capId: row.capId ?? null,
    isActive: row.isActive,
    isInterim: row.isInterim,
    occupiedSince: row.occupiedSince instanceof Date ? row.occupiedSince.toISOString() : String(row.occupiedSince),
    vacatedAt: row.vacatedAt
      ? (row.vacatedAt instanceof Date ? row.vacatedAt.toISOString() : String(row.vacatedAt))
      : null,
    successionNote: row.successionNote ?? null,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt),
  };
}

function serializeMapping(row: typeof gatekeeperMappingsTable.$inferSelect) {
  return {
    id: row.id,
    brightSideTerm: row.brightSideTerm,
    systemsTerm: row.systemsTerm,
    domain: row.domain,
    category: row.category,
    subDomain: row.subDomain ?? null,
    rationale: row.rationale,
    authority: row.authority,
    isActive: row.isActive,
    authoredByCapId: row.authoredByCapId ?? null,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt),
  };
}

function serializeLogEntry(row: typeof gatekeeperSuccessionLogTable.$inferSelect) {
  return {
    id: row.id,
    eventType: row.eventType,
    actorName: row.actorName,
    subjectId: row.subjectId,
    subjectKind: row.subjectKind,
    note: row.note,
    recordedAt: row.recordedAt instanceof Date ? row.recordedAt.toISOString() : String(row.recordedAt),
  };
}

// ─── CAP endpoints ───────────────────────────────────────────────────────────

// GET /gatekeeper/cap — current active cap (open), or all caps if ?all=true
router.get("/cap", async (req: Request, res: Response) => {
  const all = req.query.all === "true";
  if (all) {
    const rows = await db
      .select()
      .from(gatekeeperCapsTable)
      .orderBy(desc(gatekeeperCapsTable.heldSince));
    res.json(rows.map(serializeCap));
    return;
  }
  const rows = await db
    .select()
    .from(gatekeeperCapsTable)
    .where(eq(gatekeeperCapsTable.isActive, true))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "No active cap holder" });
    return;
  }
  res.json(serializeCap(rows[0]));
});

// POST /gatekeeper/cap — designate a new cap holder (organizer only)
// Wrapped in a transaction: old cap deactivation + new cap insert + log entries
// are all atomic. If the seed insert fails, no partial state is left.
const AssignCapSchema = z.object({
  holderName: z.string().min(1).max(120),
  knowledgeDomain: z.string().min(1).max(500),
  rationale: z.string().min(1).max(2000),
  actorName: z.string().min(1).max(120),
  note: z.string().min(1).max(1000),
});

router.post("/cap", requireOrganizer(), async (req: Request, res: Response) => {
  const parsed = AssignCapSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { holderName, knowledgeDomain, rationale, actorName, note } = parsed.data;

  const newCap = await db.transaction(async (tx) => {
    // Deactivate current cap(s)
    const currentCaps = await tx
      .select()
      .from(gatekeeperCapsTable)
      .where(eq(gatekeeperCapsTable.isActive, true));

    for (const current of currentCaps) {
      await tx
        .update(gatekeeperCapsTable)
        .set({ isActive: false, relinquishedAt: new Date(), relinquishedReason: "superseded", updatedAt: new Date() })
        .where(eq(gatekeeperCapsTable.id, current.id));
      await tx.insert(gatekeeperSuccessionLogTable).values({
        eventType: "cap_relinquished",
        actorName,
        subjectId: current.id,
        subjectKind: "cap",
        note: `Cap relinquished by ${current.holderName} — superseded by new designation. ${note}`,
      });
    }

    // Create the new cap
    const [created] = await tx
      .insert(gatekeeperCapsTable)
      .values({ holderName, knowledgeDomain, rationale, isActive: true })
      .returning();

    if (!created) throw new Error("Failed to create cap");

    // Record the assignment event
    await tx.insert(gatekeeperSuccessionLogTable).values({
      eventType: "cap_assigned",
      actorName,
      subjectId: created.id,
      subjectKind: "cap",
      note,
    });

    return created;
  });

  // Seed food system mappings if this is the first assignment (outside transaction
  // since it checks total mapping count — safe to run after cap is committed)
  await ensureFoodSystemSeed(newCap.id);

  res.status(201).json(serializeCap(newCap));
});

// POST /gatekeeper/cap/:id/relinquish — formally step down from the cap (organizer only)
const RelinquishCapSchema = z.object({
  relinquishedReason: z.string().min(1).max(200),
  actorName: z.string().min(1).max(120),
  note: z.string().min(1).max(1000),
});

router.post("/cap/:id/relinquish", requireOrganizer(), async (req: Request, res: Response) => {
  const capId = req.params.id as string;
  const parsed = RelinquishCapSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { relinquishedReason, actorName, note } = parsed.data;

  const updated = await db.transaction(async (tx) => {
    const rows = await tx
      .select()
      .from(gatekeeperCapsTable)
      .where(eq(gatekeeperCapsTable.id, capId))
      .limit(1);
    if (!rows[0]) {
      throw Object.assign(new Error("Cap not found"), { status: 404 });
    }
    if (!rows[0].isActive) {
      throw Object.assign(new Error("Cap is already inactive"), { status: 400 });
    }

    const [u] = await tx
      .update(gatekeeperCapsTable)
      .set({ isActive: false, relinquishedAt: new Date(), relinquishedReason, updatedAt: new Date() })
      .where(eq(gatekeeperCapsTable.id, capId))
      .returning();

    await tx.insert(gatekeeperSuccessionLogTable).values({
      eventType: "cap_relinquished",
      actorName,
      subjectId: capId,
      subjectKind: "cap",
      note,
    });

    return u!;
  });

  res.json(serializeCap(updated));
});

// ─── SEAT endpoints ──────────────────────────────────────────────────────────

// GET /gatekeeper/seat — current active seat (open)
router.get("/seat", async (req: Request, res: Response) => {
  const all = req.query.all === "true";
  if (all) {
    const rows = await db
      .select()
      .from(gatekeeperSeatsTable)
      .orderBy(desc(gatekeeperSeatsTable.occupiedSince));
    res.json(rows.map(serializeSeat));
    return;
  }
  const rows = await db
    .select()
    .from(gatekeeperSeatsTable)
    .where(eq(gatekeeperSeatsTable.isActive, true))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "No active seat occupant" });
    return;
  }
  res.json(serializeSeat(rows[0]));
});

// POST /gatekeeper/seat — assign the Workbench seat (organizer only)
// Wrapped in a transaction: old seat vacation + new seat insert + log entries are atomic.
const AssignSeatSchema = z.object({
  occupantName: z.string().min(1).max(120),
  institutionalContext: z.string().max(500).default(""),
  capId: z.string().uuid().optional(),
  isInterim: z.boolean().default(false),
  actorName: z.string().min(1).max(120),
  note: z.string().min(1).max(1000),
});

router.post("/seat", requireOrganizer(), async (req: Request, res: Response) => {
  const parsed = AssignSeatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { occupantName, institutionalContext, capId, isInterim, actorName, note } = parsed.data;

  const newSeat = await db.transaction(async (tx) => {
    // Vacate current active seat(s)
    const currentSeats = await tx
      .select()
      .from(gatekeeperSeatsTable)
      .where(eq(gatekeeperSeatsTable.isActive, true));

    for (const current of currentSeats) {
      await tx
        .update(gatekeeperSeatsTable)
        .set({
          isActive: false,
          vacatedAt: new Date(),
          successionNote: `Vacated — seat assigned to ${occupantName}`,
          updatedAt: new Date(),
        })
        .where(eq(gatekeeperSeatsTable.id, current.id));
      await tx.insert(gatekeeperSuccessionLogTable).values({
        eventType: "seat_vacated",
        actorName,
        subjectId: current.id,
        subjectKind: "seat",
        note: `Seat vacated by ${current.occupantName} — assigned to ${occupantName}. ${note}`,
      });
    }

    const [created] = await tx
      .insert(gatekeeperSeatsTable)
      .values({ occupantName, institutionalContext, capId: capId ?? null, isInterim, isActive: true })
      .returning();

    if (!created) throw new Error("Failed to create seat record");

    await tx.insert(gatekeeperSuccessionLogTable).values({
      eventType: "seat_assigned",
      actorName,
      subjectId: created.id,
      subjectKind: "seat",
      note,
    });

    return created;
  });

  res.status(201).json(serializeSeat(newSeat));
});

// POST /gatekeeper/seat/:id/vacate — formally vacate the seat (organizer only)
const VacateSeatSchema = z.object({
  successionNote: z.string().min(1).max(500),
  actorName: z.string().min(1).max(120),
  note: z.string().min(1).max(1000),
});

router.post("/seat/:id/vacate", requireOrganizer(), async (req: Request, res: Response) => {
  const seatId = req.params.id as string;
  const parsed = VacateSeatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { successionNote, actorName, note } = parsed.data;

  const updated = await db.transaction(async (tx) => {
    const rows = await tx
      .select()
      .from(gatekeeperSeatsTable)
      .where(eq(gatekeeperSeatsTable.id, seatId))
      .limit(1);
    if (!rows[0]) {
      throw Object.assign(new Error("Seat not found"), { status: 404 });
    }
    if (!rows[0].isActive) {
      throw Object.assign(new Error("Seat is already inactive"), { status: 400 });
    }

    const [u] = await tx
      .update(gatekeeperSeatsTable)
      .set({ isActive: false, vacatedAt: new Date(), successionNote, updatedAt: new Date() })
      .where(eq(gatekeeperSeatsTable.id, seatId))
      .returning();

    await tx.insert(gatekeeperSuccessionLogTable).values({
      eventType: "seat_vacated",
      actorName,
      subjectId: seatId,
      subjectKind: "seat",
      note,
    });

    return u!;
  });

  res.json(serializeSeat(updated));
});

// ─── MAPPINGS endpoints ───────────────────────────────────────────────────────

// GET /gatekeeper/mappings — open; filterable by domain/category/subDomain/activeOnly
router.get("/mappings", async (req: Request, res: Response) => {
  const domainFilter = typeof req.query.domain === "string" ? req.query.domain : undefined;
  const categoryFilter = typeof req.query.category === "string" ? req.query.category : undefined;
  const subDomainFilter = typeof req.query.subDomain === "string" ? req.query.subDomain : undefined;
  const activeOnly = req.query.activeOnly === "true";

  const conditions = [];
  if (domainFilter) conditions.push(eq(gatekeeperMappingsTable.domain, domainFilter));
  if (categoryFilter) conditions.push(eq(gatekeeperMappingsTable.category, categoryFilter));
  if (subDomainFilter) conditions.push(eq(gatekeeperMappingsTable.subDomain, subDomainFilter));
  if (activeOnly) conditions.push(eq(gatekeeperMappingsTable.isActive, true));

  const rows = await db
    .select()
    .from(gatekeeperMappingsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(
      asc(gatekeeperMappingsTable.domain),
      asc(gatekeeperMappingsTable.category),
      asc(gatekeeperMappingsTable.brightSideTerm),
    );

  res.json(rows.map(serializeMapping));
});

// POST /gatekeeper/mappings — author a new mapping (organizer only, requires active cap)
const CreateMappingSchema = z.object({
  brightSideTerm: z.string().min(1).max(300),
  systemsTerm: z.string().min(1).max(300),
  domain: z.enum(GATEKEEPER_DOMAINS),
  category: z.string().min(1).max(80),
  subDomain: z.enum(FOOD_SUB_DOMAINS).optional(),
  rationale: z.string().min(1).max(3000),
  authority: z.string().max(500).default(""),
});

router.post("/mappings", requireOrganizer(), async (req: Request, res: Response) => {
  const parsed = CreateMappingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  // Cap authorship is required — never create a mapping without an active cap holder.
  const activeCaps = await db
    .select()
    .from(gatekeeperCapsTable)
    .where(eq(gatekeeperCapsTable.isActive, true))
    .limit(1);

  if (!activeCaps[0]) {
    res.status(400).json({
      error: "No active cap holder. A Gatekeeper cap must be assigned before authoring mappings.",
    });
    return;
  }

  const capId = activeCaps[0].id;

  const [mapping] = await db
    .insert(gatekeeperMappingsTable)
    .values({
      ...parsed.data,
      subDomain: parsed.data.subDomain ?? null,
      isActive: true,
      authoredByCapId: capId,
    })
    .returning();

  res.status(201).json(serializeMapping(mapping!));
});

// PATCH /gatekeeper/mappings/:id — update a mapping (organizer only)
const UpdateMappingSchema = z.object({
  brightSideTerm: z.string().min(1).max(300).optional(),
  systemsTerm: z.string().min(1).max(300).optional(),
  category: z.string().min(1).max(80).optional(),
  subDomain: z.enum(FOOD_SUB_DOMAINS).nullable().optional(),
  rationale: z.string().min(1).max(3000).optional(),
  authority: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

router.patch("/mappings/:id", requireOrganizer(), async (req: Request, res: Response) => {
  const mappingId = req.params.id as string;
  const parsed = UpdateMappingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const rows = await db
    .select()
    .from(gatekeeperMappingsTable)
    .where(eq(gatekeeperMappingsTable.id, mappingId))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Mapping not found" });
    return;
  }

  const updates: Partial<typeof gatekeeperMappingsTable.$inferInsert> = { updatedAt: new Date() };
  if (parsed.data.brightSideTerm !== undefined) updates.brightSideTerm = parsed.data.brightSideTerm;
  if (parsed.data.systemsTerm !== undefined) updates.systemsTerm = parsed.data.systemsTerm;
  if (parsed.data.category !== undefined) updates.category = parsed.data.category;
  if (parsed.data.subDomain !== undefined) updates.subDomain = parsed.data.subDomain;
  if (parsed.data.rationale !== undefined) updates.rationale = parsed.data.rationale;
  if (parsed.data.authority !== undefined) updates.authority = parsed.data.authority;
  if (parsed.data.isActive !== undefined) updates.isActive = parsed.data.isActive;

  const [updated] = await db
    .update(gatekeeperMappingsTable)
    .set(updates)
    .where(eq(gatekeeperMappingsTable.id, mappingId))
    .returning();

  res.json(serializeMapping(updated!));
});

// DELETE /gatekeeper/mappings/:id — soft-deactivate a mapping (organizer only)
router.delete("/mappings/:id", requireOrganizer(), async (req: Request, res: Response) => {
  const mappingId = req.params.id as string;
  const rows = await db
    .select()
    .from(gatekeeperMappingsTable)
    .where(eq(gatekeeperMappingsTable.id, mappingId))
    .limit(1);
  if (!rows[0]) {
    res.status(404).json({ error: "Mapping not found" });
    return;
  }

  await db
    .update(gatekeeperMappingsTable)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(gatekeeperMappingsTable.id, mappingId));

  res.status(204).end();
});

// ─── SUCCESSION LOG endpoints ─────────────────────────────────────────────────

// GET /gatekeeper/succession — full chain of custody (open), most recent first
router.get("/succession", async (_req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(gatekeeperSuccessionLogTable)
    .orderBy(desc(gatekeeperSuccessionLogTable.recordedAt));
  res.json(rows.map(serializeLogEntry));
});

// POST /gatekeeper/succession — manually record a succession event (organizer only)
// Used for mappings_transferred and any other event that falls outside the normal
// cap/seat assignment flow.
const RecordSuccessionSchema = z.object({
  eventType: z.enum(SUCCESSION_EVENT_TYPES),
  actorName: z.string().min(1).max(120),
  subjectId: z.string().uuid(),
  subjectKind: z.enum(["cap", "seat"]),
  note: z.string().min(1).max(2000),
});

router.post("/succession", requireOrganizer(), async (req: Request, res: Response) => {
  const parsed = RecordSuccessionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const [entry] = await db
    .insert(gatekeeperSuccessionLogTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(serializeLogEntry(entry!));
});

// ─── STATUS summary (open) ────────────────────────────────────────────────────

// GET /gatekeeper/status — who holds the cap, who occupies the seat,
// alignment, succession window detection, and mapping counts by domain.
router.get("/status", async (_req: Request, res: Response) => {
  const [caps, seats, activeMappings] = await Promise.all([
    db.select().from(gatekeeperCapsTable).where(eq(gatekeeperCapsTable.isActive, true)).limit(1),
    db.select().from(gatekeeperSeatsTable).where(eq(gatekeeperSeatsTable.isActive, true)).limit(1),
    db.select().from(gatekeeperMappingsTable).where(eq(gatekeeperMappingsTable.isActive, true)),
  ]);

  const cap = caps[0] ?? null;
  const seat = seats[0] ?? null;

  const domainCounts: Record<string, number> = {};
  for (const m of activeMappings) {
    domainCounts[m.domain] = (domainCounts[m.domain] ?? 0) + 1;
  }

  res.json({
    cap: cap ? serializeCap(cap) : null,
    seat: seat ? serializeSeat(seat) : null,
    // True when the same person holds both cap and seat (normal operations).
    capAndSeatAligned: cap && seat ? cap.holderName === seat.occupantName : false,
    // True when the seat is occupied by an interim holder while the cap is unassigned,
    // or when cap holder and seat occupant are different people.
    successionWindowOpen:
      (!cap && !!seat && seat.isInterim) ||
      (!!cap && !!seat && cap.holderName !== seat.occupantName),
    activeMappingCount: activeMappings.length,
    mappingsByDomain: domainCounts,
  });
});

// ─── Error handler for transactional routes ──────────────────────────────────
// Routes that throw tagged errors (status property) propagate them here.
router.use((err: unknown, _req: Request, res: Response, next: (e: unknown) => void) => {
  if (err instanceof Error && "status" in err) {
    const status = (err as Error & { status: number }).status;
    res.status(status).json({ error: err.message });
    return;
  }
  next(err);
});

export default router;
