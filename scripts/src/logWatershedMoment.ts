import { db } from "@workspace/db";
import {
  libraryEntriesTable,
  projectBucketsTable,
  subjectsTable,
  entrySubjectsTable,
  entryBucketsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const FILENAME =
  "Pasted-Below-is-the-briefing-in-your-requested-section-order-W_1777060379603.txt";
const ATTACHED_DIR = path.resolve(process.cwd(), "../attached_assets");

const TITLE =
  "Watershed (formerly X-Buckets) — agent briefing on architecture, vocabulary, and integration surfaces";

const SUMMARY =
  "Comprehensive briefing returned from the Watershed project's AI agent in response to a context-handoff prompt. Maps the canonical vocabulary (rainfall / drop / Reservoir / cistern / Drip Harvester / Bucket / Assignment / Household), the literal stack (XRPL Payments + Memo strings as the only on-chain bucket link, Express + Postgres + Drizzle off-chain, Xaman / WalletConnect for non-custodial signing), the data model (Bucket, Assignment, PaydayHistoryEntry, IncomeStream, ExternalBill, Cardholder, GivingHistoryEntry plus household tables), the identity and custody posture (strictly non-custodial, hard 2-member household cap), the bucket model (Ramsey Baby Steps scaffold + payday waterfall + Drip Harvester continuous sweep), and the open integration questions for the downstream Deer Lake / practitioner / Pilot #2 work. Flags real privacy gotcha: the bucket name in the on-chain Memo is public on XRPL.";

const NOTES = `# The moment

Robin shared the X-Buckets / Watershed vision video (https://x-buckets-vision.replit.app/xbuckets-video/) — a 44-second, 7-scene piece titled "Watershed — Channel Every Drop" — and named it as the headwaters that set this whole arc in motion. They reframed the practitioner operating plan and the Deer Lake co-op store plan as Zone 1+ artifacts in a permaculture sense, with Watershed as Zone 0: the personal household budget system on XRPL, grassroots, decentralized, anti-surveillance. Built explicitly NOT for the top-down climate-action class — built for the lineage of theorists (the professors who revolted, the class before) who had the framework but never had the tooling to ship it. Grounding the computers and the watershed under Meath with personal responsibility and decentralization.

To map the seam between Watershed and the downstream work safely, I generated a 14-section context-handoff prompt and Robin pasted it into the Watershed project's AI agent. This entry archives the response that came back.

# What the briefing surfaces (read in order if revisiting)

1. **Two parallel vocabularies.** A water-metaphor layer for UI/brand (rainfall, drop, Reservoir, cistern, channels, Drip Harvester, payday, drought, Giving Well) and a code/data-model layer the user actually clicks (Bucket, Assignment, PaydayHistoryEntry, Household). Headwaters does not appear in code — available naming territory.

2. **Legacy "X-Buckets" still in the system.** Artifact directory, localStorage keys, patronage wallet constants, test snapshots, package paths. User-facing surface largely renamed; data-at-rest and source paths are not. Anything keying off the storage namespace will keep saying xbuckets for the foreseeable future.

3. **The on-chain link is one Memo string per Payment.** MemoData = hex("Watershed:<bucketName>:<note>"), MemoType = hex("text/plain"). That string is the entire on-chain audit thread between a transaction and its bucket — and it is publicly readable on XRPL. The bucket name and the note are public. This is the single biggest privacy gotcha when composing downstream.

4. **Hybrid source of truth, leaning off-chain.** Wallet balance in-asset → on-chain wins. Bucket assignments, targets, payday plans, history, drought flags → off-chain JSON in household_budget_state.state (TEXT, not encrypted at rest in any visible way). Reconciliation rule (lib/reconcile.ts) proportionally rescales bucket balances to match the live RLUSD balance whenever they drift.

5. **Single-tenant SaaS, not per-household self-hosted.** "Self-hosted under the meadow" is narrative framing. The codebase is a normal multi-tenant web app. No per-household deployment story shipped yet.

6. **Strictly non-custodial.** No in-app wallet creation, no seed-phrase UI, no recovery UI. Grandmother test inherited from Xaman, not solved by Watershed. There is also a no-crypto path via Stripe for users who don't want to touch a wallet — bucket model still works, no on-chain footprint.

7. **Households hard-capped at 2 members.** Schema supports more; route enforces 2 (HTTP 409). No role model — Cardholder.role: parent|child|partner is presentational, not an authorization boundary.

8. **No on-ledger waterfall, no XRPL Hooks, no on-ledger period-close artifact.** Payday Planner is a planning-time waterfall; Drip Harvester is the only continuous sweep (yield from a separate earner wallet → one configured savings cistern, with a 5% protocol fee on yield only).

9. **Bucket taxonomy is seeded, not enforced.** Spending defaults (Groceries, Restaurants, Gas, Entertainment, Clothing, Household, Bills, Gifts, Medical, Kids), Savings defaults (Starter Emergency Fund, Debt Payoff, Emergency Reserve), plus a Ramsey Baby Steps scaffold (US + CA variant) that classifies savings buckets into 7 steps via keyword match.

# Why this matters for the downstream artifacts

- **Reinvestment slide vocabulary should align.** The four reinvestment "buckets" in the practitioner deck (tech CAPEX, tooling, training, pilot reserve) compose with Watershed's bucket noun directly. "Channel" is metaphor only — do not use it as a product noun in the deck.
- **Memo privacy gotcha applies upstream too.** If the Deer Lake agency's reinvestment account is ever a Watershed instance, the four bucket names will be visible on-ledger. That's actually fine for transparency — but it should be an intentional choice surfaced in the Accountability slide, not a leak.
- **Single-tenant posture conflicts with the deck's self-hosted promise.** The Deer Lake plan provisions 9 self-hosted servers in the community. Watershed currently has no per-community self-hosted deployment pattern. If Watershed is meant to run on those servers, that's a roadmap item, not a current capability — important to distinguish.
- **2-member cap is incompatible with band-council use.** Anything community-scale on top of Watershed needs the cap lifted or a different deployment shape.

# Status

Logged for posterity. Not revisiting the moment beyond approvals for code-try purposes.

— Captured ${new Date().toISOString()}
`;

async function main() {
  const filepath = path.join(ATTACHED_DIR, FILENAME);
  const buf = await readFile(filepath);
  const hash = createHash("sha256").update(buf).digest("hex");
  const fileSize = buf.byteLength;

  // Idempotent: if we've already logged this exact briefing, just refresh the
  // notes (so re-running picks up edits) and return.
  const existing = await db
    .select()
    .from(libraryEntriesTable)
    .where(eq(libraryEntriesTable.contentHash, hash))
    .limit(1);

  // Ensure a "watershed" project bucket exists (the user's vocabulary; new
  // bucket sits beside deer-lake-store, lfif-cold-transport, 807-nwo-hub).
  let watershedBucket = (
    await db
      .select()
      .from(projectBucketsTable)
      .where(eq(projectBucketsTable.slug, "watershed"))
      .limit(1)
  )[0];
  if (!watershedBucket) {
    [watershedBucket] = await db
      .insert(projectBucketsTable)
      .values({
        slug: "watershed",
        name: "Watershed (Zone 0)",
        description:
          "Watershed (formerly X-Buckets) — personal household budget system on XRPL. Zone 0 in the permaculture framing; the headwaters every downstream artifact composes against.",
        color: "#3D6478",
      })
      .returning();
  }

  // Tag with research-reports + policy-governance subjects (already seeded).
  const subjectRows = await db
    .select()
    .from(subjectsTable)
    .where(
      // any of the two slugs
      eq(subjectsTable.slug, "research-reports"),
    );
  const policySubject = (
    await db
      .select()
      .from(subjectsTable)
      .where(eq(subjectsTable.slug, "policy-governance"))
      .limit(1)
  )[0];
  const subjectIds = [
    ...subjectRows.map((r) => r.id),
    ...(policySubject ? [policySubject.id] : []),
  ];

  let entryId: string;
  if (existing.length) {
    entryId = existing[0]!.id;
    await db
      .update(libraryEntriesTable)
      .set({
        title: TITLE,
        summary: SUMMARY,
        notes: NOTES,
        updatedAt: new Date(),
      })
      .where(eq(libraryEntriesTable.id, entryId));
    console.log(`[log] refreshed existing entry ${entryId}`);
  } else {
    const [row] = await db
      .insert(libraryEntriesTable)
      .values({
        kind: "file",
        title: TITLE,
        summary: SUMMARY,
        notes: NOTES,
        status: "published",
        storageRef: `gcs:/public-objects/attached_assets/${FILENAME}`,
        contentHash: hash,
        fileSize,
        contentType: "text/plain",
        originalFilename: FILENAME,
        fileType: "document",
      })
      .returning();
    entryId = row!.id;
    console.log(`[log] created entry ${entryId}`);
  }

  // Reset and re-attach tags so re-runs don't double-tag.
  await db
    .delete(entrySubjectsTable)
    .where(eq(entrySubjectsTable.entryId, entryId));
  if (subjectIds.length) {
    await db
      .insert(entrySubjectsTable)
      .values(subjectIds.map((sid) => ({ entryId, subjectId: sid })))
      .onConflictDoNothing();
  }
  await db
    .delete(entryBucketsTable)
    .where(eq(entryBucketsTable.entryId, entryId));
  await db
    .insert(entryBucketsTable)
    .values({ entryId, bucketId: watershedBucket!.id })
    .onConflictDoNothing();

  console.log(
    `[log] tagged: bucket=watershed, subjects=[${subjectIds.length} attached]`,
  );
  console.log(`[log] done.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
