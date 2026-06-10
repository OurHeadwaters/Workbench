import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  hhMembersTable,
  hhMemberBadgesTable,
  hhBadgeCategoriesTable,
} from "@workspace/db";
import { and, eq, isNotNull } from "drizzle-orm";

const router: IRouter = Router();

// ── GET /did/:address/credentials ─────────────────────────────────────────────
// Public DID resolver endpoint — no auth required.
// Returns a Verifiable Presentation bundle containing all signed W3C Verifiable
// Credentials issued to the member identified by the given XRPL address.
//
// Architecture reference: docs/learning-identity-architecture.md §3 (Tier 3) + §4.1
// The serviceEndpoint in the member's on-chain DID document points here so that
// any standards-compliant DID resolver can retrieve and verify their credentials.
//
// Only returns badges where vc_json is populated (practicing + teaching stages).
// Watching and learning badges are off-chain only and are not included.
router.get("/:address/credentials", async (req: Request, res: Response) => {
  const address = Array.isArray(req.params.address)
    ? (req.params.address[0] ?? "")
    : (req.params.address ?? "");

  if (!address) {
    res.status(400).json({ error: "XRPL address is required" });
    return;
  }

  const member = await db.query.hhMembersTable.findFirst({
    where: eq(hhMembersTable.xrplAddress, address),
  });

  if (!member) {
    res.status(404).json({ error: "No member found for this XRPL address" });
    return;
  }

  const badgeRows = await db
    .select({
      id: hhMemberBadgesTable.id,
      stage: hhMemberBadgesTable.stage,
      vcJson: hhMemberBadgesTable.vcJson,
      updatedAt: hhMemberBadgesTable.updatedAt,
      categoryName: hhBadgeCategoriesTable.name,
      categoryDomain: hhBadgeCategoriesTable.domain,
    })
    .from(hhMemberBadgesTable)
    .innerJoin(
      hhBadgeCategoriesTable,
      eq(hhMemberBadgesTable.categoryId, hhBadgeCategoriesTable.id),
    )
    .where(
      and(
        eq(hhMemberBadgesTable.memberId, member.id),
        isNotNull(hhMemberBadgesTable.vcJson),
      ),
    )
    .orderBy(hhMemberBadgesTable.updatedAt);

  const credentials = badgeRows.map((row) => {
    try {
      return JSON.parse(row.vcJson!);
    } catch {
      return row.vcJson;
    }
  });

  const didUri = member.didRef ?? `did:xrpl:1:${address}`;

  const presentation = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://ourheadwaters.ca/context/helping-hands/v1",
    ],
    type: ["VerifiablePresentation"],
    holder: didUri,
    verifiableCredential: credentials,
  };

  res.json(presentation);
});

export default router;
