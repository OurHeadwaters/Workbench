/**
 * One-time migration: kit-tokens.json → kit_tokens DB table
 *
 * Reads `data/kit-tokens.json` (the legacy file-backed token store),
 * deduplicates against rows already in the `kit_tokens` table, and inserts
 * any missing records. On success the JSON file is renamed to
 * `data/kit-tokens.json.migrated` so the old path is clearly retired.
 *
 * Idempotent — safe to re-run. Tokens already in the DB are skipped.
 * If the JSON file is absent or empty the script exits cleanly.
 *
 * Run:
 *   pnpm --filter @workspace/api-server tsx src/scripts/migrate-kit-tokens.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db, kitTokensTable } from "@workspace/db";
import { eq } from "drizzle-orm";

interface LegacyTokenRecord {
  token: string;
  kit_id: string;
  buyer_email: string;
  buyer_name: string;
  purchase_id: string;
  created_at: string;
  expires_at: string;
}

type LegacyTokenStore = Record<string, LegacyTokenRecord>;

// Resolve relative to the api-server package root regardless of cwd.
// __dirname equivalent for ESM: strip src/scripts/<file> → package root → data/
const PACKAGE_ROOT = path.resolve(fileURLToPath(import.meta.url), "../../../../");
const DATA_DIR = path.join(PACKAGE_ROOT, "data");
const TOKENS_FILE = path.join(DATA_DIR, "kit-tokens.json");
const ARCHIVED_FILE = TOKENS_FILE + ".migrated";

async function migrate() {
  if (!fs.existsSync(TOKENS_FILE)) {
    console.log("No kit-tokens.json found — nothing to migrate.");
    process.exit(0);
  }

  let store: LegacyTokenStore;
  try {
    store = JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8")) as LegacyTokenStore;
  } catch (err) {
    console.error("Failed to parse kit-tokens.json:", err);
    process.exit(1);
  }

  const entries = Object.values(store);
  if (entries.length === 0) {
    console.log("kit-tokens.json is empty — nothing to migrate.");
    fs.renameSync(TOKENS_FILE, ARCHIVED_FILE);
    console.log(`Archived empty file → ${ARCHIVED_FILE}`);
    process.exit(0);
  }

  console.log(`Found ${entries.length} token(s) in kit-tokens.json. Migrating…\n`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const record of entries) {
    const token = record.token;

    if (!token || !record.kit_id || !record.buyer_email || !record.purchase_id) {
      console.error(`  FAIL  (malformed — missing required field):`, record);
      failed++;
      continue;
    }

    const existing = await db
      .select({ token: kitTokensTable.token })
      .from(kitTokensTable)
      .where(eq(kitTokensTable.token, token))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  skip  ${token.slice(0, 16)}… (already in DB)`);
      skipped++;
      continue;
    }

    try {
      await db.insert(kitTokensTable).values({
        token,
        kitId: record.kit_id,
        buyerEmail: record.buyer_email.toLowerCase(),
        buyerName: record.buyer_name ?? "Valued Buyer",
        purchaseId: record.purchase_id,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        expiresAt: new Date(record.expires_at),
      });
      console.log(`  ✓     ${token.slice(0, 16)}…  kit=${record.kit_id}  email=${record.buyer_email}`);
      inserted++;
    } catch (err) {
      console.error(`  ERROR ${token.slice(0, 16)}…`, err);
      failed++;
    }
  }

  console.log(`\nDone — ${inserted} inserted, ${skipped} skipped, ${failed} failed.`);

  if (failed > 0) {
    console.error(
      `\n${failed} record(s) failed to insert. Leaving kit-tokens.json in place so you can investigate.`,
    );
    process.exit(1);
  }

  fs.renameSync(TOKENS_FILE, ARCHIVED_FILE);
  console.log(`\nRetired legacy file → ${ARCHIVED_FILE}`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed unexpectedly:", err);
  process.exit(1);
});
