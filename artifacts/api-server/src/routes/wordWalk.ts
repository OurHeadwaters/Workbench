import { Router, type IRouter } from "express";
import { readRenameMap, writeRowStatus, type RenameStatus } from "../lib/renameMap";

const router: IRouter = Router();

const VALID_VERDICTS = new Set<RenameStatus>(["approved", "rejected", "deferred"]);

router.get("/words", (_req, res) => {
  try {
    const rows = readRenameMap();
    res.json({ rows });
  } catch (err) {
    console.error("[word-walk] GET /words error:", err);
    res.status(500).json({ error: "Failed to read rename-map.md" });
  }
});

router.post("/decide", (req, res) => {
  const { rowId, verdict } = req.body as { rowId?: unknown; verdict?: unknown };

  if (typeof rowId !== "number" || !Number.isInteger(rowId) || rowId < 1) {
    res.status(400).json({ error: "rowId must be a positive integer" });
    return;
  }
  if (typeof verdict !== "string" || !VALID_VERDICTS.has(verdict as RenameStatus)) {
    res.status(400).json({ error: "verdict must be one of: approved, rejected, deferred" });
    return;
  }

  try {
    writeRowStatus(rowId, verdict as RenameStatus);
    const rows = readRenameMap();
    const updated = rows.find((r) => r.id === rowId);
    if (!updated) {
      res.status(404).json({ error: `Row ${rowId} not found after update` });
      return;
    }
    res.json({ row: updated });
  } catch (err: unknown) {
    console.error("[word-walk] POST /decide error:", err);
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("not found")) {
      res.status(404).json({ error: message });
      return;
    }
    res.status(500).json({ error: "Failed to update rename-map.md" });
  }
});

export default router;
