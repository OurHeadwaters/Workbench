import { Router, type IRouter, type Request, type Response } from "express";
import { getAuth } from "@clerk/express";

const router: IRouter = Router();

const ELIGIBLE_TIERS = new Set(["harvest", "sustaining", "pro", "premium"]);

router.get("/check", async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const claims = auth?.sessionClaims as Record<string, unknown> | null;
  const publicMetadata = (claims?.["publicMetadata"] ?? {}) as Record<string, unknown>;
  const tier = typeof publicMetadata["tier"] === "string" ? publicMetadata["tier"].toLowerCase() : "none";

  const eligible = ELIGIBLE_TIERS.has(tier);

  res.json({ eligible, tier });
});

export default router;
