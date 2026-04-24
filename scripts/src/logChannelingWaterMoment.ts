import {
  db,
  libraryEntriesTable,
  projectBucketsTable,
  entryBucketsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const FILENAME = "IMG_1110_1777060754099.jpeg";
const ATTACHED_DIR = path.resolve(process.cwd(), "../attached_assets");

const TITLE =
  "Channeling water — the household speaks the watershed";

const SUMMARY =
  "The moment the Watershed vision proved itself in its own Zone 0. After the agent briefing was logged and Robin sent the word 'Anticipation' alongside screenshots of family group chats and a friend cheering the build (Darren: 'Work it!', user: 'Diamond hands can't wait for it...'), Robin's son walked in and said: 'Mom I stepped in poop.' Robin, calmly: 'Oh my goodness.' Son: 'At least I've been channeling water.' Photo attached: the actual spring-melt clearing where the channeling was happening — snow patches dissolving into last year's grass at the edge of the boreal, two kids barefoot in the runoff with a shovel and a basketball, redirecting water through the meadow. The vocabulary of the vision video has become the household's own working language. Robin's note: 'The ultimate role. My highest calling.'";

const NOTES = `# The exchange

> Son: "Mom I stepped in poop."
> Robin (calmly): "Oh my goodness."
> Son: "At least I've been channeling water."
> Robin: "The ultimate role. My highest calling."

# What this moment captures

This is the success metric the agent briefing in the previous library entry could not measure. Watershed has a data model, an XRPL Memo string, a Drip Harvester, a 2-member household cap, and a 35% reinvestment thesis. None of that proves the vision is alive. **A six-year-old defending stepping in poop with the verb form of his mother's life work** does.

The vocabulary of the vision video — *channel every drop, channeling water* — has crossed from product copy into the household's own working language. Permaculture Principle 1 is "Observe and Interact." The kid is doing it. He's reading the spring melt as a system to direct, naming the work he was doing when the poop happened, and offering the work as the redemption. He has internalised the framework his mother is also exporting to Deer Lake, to Pilot #2, to every reserve in the five-year scale plan. Zone 0 isn't a brand position. It's a kitchen.

# The texture surrounding the moment (logged here so it doesn't dissolve)

Just before the son walked in, Robin had sent four screenshots of the parallel threads they were holding:

- **Family chat (Parrsons):** Robin to family — *"Yeah bugs but refresh through the weekend and let me know when it hits."* / *"The presssssssure. Diamond hands can't wait for it..."* with a screenshot of a Replit Agent panel reading *"Task updates / Waiting for input / Fix failing e2e tests"* on the Xbucketsapp project. Family is watching the build live.
- **Darren Anderson 1:1:** Friend in their corner — *"You rock the casbah"* / *"Thanks buddy"* / *"Welcome! Did it work?!"* / *"Aint nobody got time for the at but at night. Haha I need IT"* / *"On a roll elsewhere"* / *"I must solve David's tap limit problem first!!!"* with a Hackerman meme. The kind of friend you keep.
- **Inbox:** 191 unread. Homeschool Fam 104. Homesteading 104. Soccer 9. The communities the work grows in.
- **Watershed agent panel:** Xbucketsapp started "Add an above-tap-limit 'abundan...'" — a real shipping bottleneck on the upstream Watershed project, currently waiting on Robin's input on failing e2e tests.

The pre-launch presssssssure, the family rooting them on, the friend cheering, the agent waiting on input, David's tap-limit fix queued up — and then the kid walks in and renames stepping in poop as the cost of channeling water. The whole stack snaps into its right order.

# Why this is being logged

Following the same pattern as the agent briefing entry: parked for posterity, content-hash deduped, idempotent re-run safe. Robin earlier flagged: not revisiting beyond approvals for code-try purposes. This one belongs in the same drawer.

— Captured ${new Date().toISOString()}
`;

async function main() {
  const filepath = path.join(ATTACHED_DIR, FILENAME);
  const buf = await readFile(filepath);
  const hash = createHash("sha256").update(buf).digest("hex");
  const fileSize = buf.byteLength;

  const existing = await db
    .select()
    .from(libraryEntriesTable)
    .where(eq(libraryEntriesTable.contentHash, hash))
    .limit(1);

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
        contentType: "image/jpeg",
        originalFilename: FILENAME,
        fileType: "image",
      })
      .returning();
    entryId = row!.id;
    console.log(`[log] created entry ${entryId}`);
  }

  await db
    .delete(entryBucketsTable)
    .where(eq(entryBucketsTable.entryId, entryId));
  await db
    .insert(entryBucketsTable)
    .values({ entryId, bucketId: watershedBucket!.id })
    .onConflictDoNothing();

  console.log(`[log] tagged: bucket=watershed`);
  console.log(`[log] done.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
