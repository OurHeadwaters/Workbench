/**
 * Seed the odyssey_trail_signs table with the initial 5 self-sponsorships.
 * Run once: pnpm --filter @workspace/api-server tsx src/scripts/seed-odyssey.ts
 *
 * Idempotent — skips rows where toolName already exists.
 */
import { db, odysseyTrailSignsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SEEDS = [
  {
    toolName: "North Star",
    problemStatement: "You start each day without a clear structure — priorities scatter and the important gets buried under the urgent.",
    costTier: "free",
    actionUrl: "/north-star/",
    actionLabel: "Open North Star",
    communityProof: "Used daily by Headwaters practitioners across 3 communities",
    zoneTags: "any",
    topicTags: "planning,triage,daily,structure",
    status: "approved",
  },
  {
    toolName: "Morning Triage",
    problemStatement: "Decision overwhelm hits before 9am — your inbox owns your day before you do.",
    costTier: "free",
    actionUrl: "/north-star/",
    actionLabel: "Start your triage",
    communityProof: "Built into the daily practitioner routine",
    zoneTags: "Z1,Z2",
    topicTags: "triage,prioritization,inbox,morning",
    status: "approved",
  },
  {
    toolName: "Practitioner's Guide",
    problemStatement: "Client work runs on gut feel — there's no repeatable system for onboarding, scoping, or wrapping up engagements.",
    costTier: "free",
    actionUrl: "/practitioners-guide-v2/",
    actionLabel: "Open the guide",
    communityProof: "The canonical playbook for independent Headwaters practitioners",
    zoneTags: "Z2",
    topicTags: "client-work,workflow,contracts,onboarding",
    status: "approved",
  },
  {
    toolName: "Field Guide Finance",
    problemStatement: "Income and expenses live in four different places — you can't see the full picture until it's too late.",
    costTier: "free",
    actionUrl: "/field-guide-finance/",
    actionLabel: "Open Field Guide Finance",
    communityProof: "Used for monthly closes by the founding Headwaters household",
    zoneTags: "Z1",
    topicTags: "finance,tracking,bookkeeping,income",
    status: "approved",
  },
  {
    toolName: "Headwaters Books",
    problemStatement: "Community knowledge stays locked in private documents, group chats, and individual heads.",
    costTier: "free",
    actionUrl: "/headwaters-books/",
    actionLabel: "Browse the catalog",
    communityProof: "Publishing community knowledge since the founding of Headwaters",
    zoneTags: "Z3,Z4",
    topicTags: "publishing,community,knowledge,writing",
    status: "approved",
  },
] as const;

async function seed() {
  let inserted = 0;
  let skipped = 0;

  for (const row of SEEDS) {
    const existing = await db
      .select({ id: odysseyTrailSignsTable.id })
      .from(odysseyTrailSignsTable)
      .where(eq(odysseyTrailSignsTable.toolName, row.toolName))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  skip  ${row.toolName} (already exists)`);
      skipped++;
      continue;
    }

    await db.insert(odysseyTrailSignsTable).values({
      ...row,
      approvedAt: new Date(),
      approvedBy: "seed-script",
    });
    console.log(`  ✓     ${row.toolName}`);
    inserted++;
  }

  console.log(`\nDone — ${inserted} inserted, ${skipped} skipped.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
