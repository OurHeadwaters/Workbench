/**
 * smoke-verify-access.mjs
 *
 * Fetches the most recent kit_tokens row from Postgres and confirms the
 * GET /api/kits/access/:token endpoint resolves it correctly.
 *
 * Usage:  node artifacts/api-server/scripts/smoke-verify-access.mjs
 */

import { createRequire } from "module";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Load the compiled DB package from the workspace
const require = createRequire(resolve(__dirname, "../../../lib/db/dist/index.js"));

// Use dynamic import for the ESM-compiled db package
const dbModule = await import(resolve(__dirname, "../../../lib/db/dist/index.js"));
const { db, kitTokensTable } = dbModule;

// drizzle-orm helpers
const drizzleOrm = await import("drizzle-orm");
const { desc } = drizzleOrm;

const API = `http://localhost:${process.env.PORT ?? 8081}`;

const rows = await db
  .select()
  .from(kitTokensTable)
  .orderBy(desc(kitTokensTable.createdAt))
  .limit(3);

if (!rows.length) {
  console.error("❌  No rows in kit_tokens table — the DB insert did not succeed.");
  process.exit(1);
}

console.log(`\nFound ${rows.length} token(s) in kit_tokens:\n`);
for (const row of rows) {
  console.log(`  token     : ${row.token.slice(0, 16)}…`);
  console.log(`  kit_id    : ${row.kitId}`);
  console.log(`  email     : ${row.buyerEmail}`);
  console.log(`  expires_at: ${row.expiresAt}`);
  console.log();
}

const latest = rows[0];

console.log(`Testing GET ${API}/api/kits/access/${latest.token.slice(0, 16)}…\n`);

const res = await fetch(`${API}/api/kits/access/${latest.token}`);
const body = await res.json();

console.log(`HTTP ${res.status}`);
console.log(JSON.stringify(body, null, 2));

if (res.status !== 200 || !body.ok) {
  console.error("\n❌  Access endpoint did not resolve the token.");
  process.exit(1);
}

console.log("\n✅  Access link resolves correctly.");
console.log(`   Kit name : ${body.kit?.name}`);
console.log(`   Buyer    : ${body.buyer_name}`);
