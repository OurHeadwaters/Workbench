import { Router, type IRouter } from "express";
import { db, financialSnapshotsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import {
  OWNER_TOKEN,
  isOwnerRequest,
  isValidOwnerToken,
} from "../lib/ownerAuth";

const router: IRouter = Router();

// Endpoints that bypass the owner-token gate.  Login is the only one because
// the contributor share-link flow does not exist for this artifact.
const PUBLIC_PREFIXES = ["/owner/login"];

router.use((req, res, next) => {
  if (PUBLIC_PREFIXES.some((p) => req.path.startsWith(p))) {
    next();
    return;
  }
  if (!OWNER_TOKEN) {
    res.status(503).json({
      error:
        "Owner authentication is not configured (LIBRARY_OWNER_TOKEN missing).",
    });
    return;
  }
  if (isOwnerRequest(req)) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
});

// Returns 200 if the gate above let the request through.  Frontend uses
// this to verify a stored token is still good before showing the dashboard.
router.get("/owner/me", (_req, res) => {
  res.json({ ok: true });
});

// Login: passphrase IS the bearer token (same model as the library).  We
// share the same env var so Bobbie only manages one passphrase.
router.post("/owner/login", (req, res) => {
  if (!OWNER_TOKEN) {
    res.status(503).json({
      error:
        "Owner authentication is not configured (LIBRARY_OWNER_TOKEN missing).",
    });
    return;
  }
  const body = (req.body ?? {}) as { passphrase?: unknown };
  const passphrase =
    typeof body.passphrase === "string" ? body.passphrase : "";
  if (!isValidOwnerToken(passphrase)) {
    res.status(401).json({ error: "Wrong passphrase" });
    return;
  }
  res.json({ ok: true, token: passphrase });
});

// ----------------------- snapshots -----------------------

// Snapshots come back newest-first.  The frontend uses [0] for the dashboard
// and the rest for the history list.  Numeric columns become strings via the
// pg driver, so we normalize them to numbers here for the JSON contract.
function serialize(row: typeof financialSnapshotsTable.$inferSelect) {
  return {
    id: row.id,
    year: row.year,
    takenAt: row.takenAt.toISOString(),
    watershedArr: row.watershedArr,
    ownerTakeHome: row.ownerTakeHome,
    portfolioValue: row.portfolioValue,
    xrpBalance: row.xrpBalance,
    xrpPriceUsd: Number(row.xrpPriceUsd),
    annualLivingExpenses: row.annualLivingExpenses,
    notes: row.notes,
  };
}

// Order by snapshot year (descending) first so backfilled rows for older
// years don't show up "ahead" of the newest year just because they were
// entered later.  Within a year (rare — Bobbie would have to re-record),
// the most-recent entry wins.
router.get("/snapshots", async (_req, res) => {
  const rows = await db
    .select()
    .from(financialSnapshotsTable)
    .orderBy(
      desc(financialSnapshotsTable.year),
      desc(financialSnapshotsTable.takenAt),
    );
  res.json({ snapshots: rows.map(serialize) });
});

// Convenience endpoint for the dashboard's "latest snapshot" panel — saves
// the client from pulling the full history just to render the top card.
router.get("/snapshots/latest", async (_req, res) => {
  const [row] = await db
    .select()
    .from(financialSnapshotsTable)
    .orderBy(
      desc(financialSnapshotsTable.year),
      desc(financialSnapshotsTable.takenAt),
    )
    .limit(1);
  if (!row) {
    res.json({ snapshot: null });
    return;
  }
  res.json({ snapshot: serialize(row) });
});

router.post("/snapshots", async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  // Integer fields refuse non-integers outright instead of rounding — these
  // rows are immutable history, so silently turning $215,499.50 into 215499
  // would be the kind of bug you only notice years later.
  function readInt(key: string, min = 0): number | null {
    const raw = body[key];
    if (typeof raw !== "number" || !Number.isInteger(raw)) return null;
    if (raw < min) return null;
    return raw;
  }
  function readNum(key: string, min = 0): number | null {
    const raw = body[key];
    if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
    if (raw < min) return null;
    return raw;
  }

  const year = readInt("year", 2026);
  const watershedArr = readInt("watershedArr");
  const ownerTakeHome = readInt("ownerTakeHome");
  const portfolioValue = readInt("portfolioValue");
  const xrpBalance = readInt("xrpBalance");
  const xrpPriceUsd = readNum("xrpPriceUsd");
  const annualLivingExpenses = readInt("annualLivingExpenses");
  const notes =
    typeof body.notes === "string" && body.notes.trim().length > 0
      ? body.notes.trim()
      : null;

  if (
    year === null ||
    watershedArr === null ||
    ownerTakeHome === null ||
    portfolioValue === null ||
    xrpBalance === null ||
    xrpPriceUsd === null ||
    annualLivingExpenses === null
  ) {
    res.status(400).json({
      error:
        "All numeric fields are required and must be non-negative numbers.",
    });
    return;
  }

  const [inserted] = await db
    .insert(financialSnapshotsTable)
    .values({
      year,
      watershedArr,
      ownerTakeHome,
      portfolioValue,
      xrpBalance,
      xrpPriceUsd: xrpPriceUsd.toFixed(4),
      annualLivingExpenses,
      notes,
    })
    .returning();

  if (!inserted) {
    res.status(500).json({ error: "Failed to record snapshot" });
    return;
  }

  res.json({ snapshot: serialize(inserted) });
});

export default router;
