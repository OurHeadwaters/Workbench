import { db, libraryEntriesTable } from "@workspace/db";
import { like, eq, sql } from "drizzle-orm";
import { Storage } from "@google-cloud/storage";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const ATTACHED_DIR = path.resolve(process.cwd(), "../attached_assets");

const PUBLIC_PATHS = (process.env.PUBLIC_OBJECT_SEARCH_PATHS || "")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

if (PUBLIC_PATHS.length === 0) {
  console.error(
    "PUBLIC_OBJECT_SEARCH_PATHS not set. Configure object storage first.",
  );
  process.exit(1);
}

const TARGET_PUBLIC_PATH = PUBLIC_PATHS[0]!;

const storage = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: { type: "json", subject_token_field_name: "access_token" },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

function parseObjectPath(p: string): { bucketName: string; objectName: string } {
  const normalized = p.startsWith("/") ? p : `/${p}`;
  const parts = normalized.split("/");
  if (parts.length < 3) {
    throw new Error(`Invalid path: ${p}`);
  }
  return { bucketName: parts[1]!, objectName: parts.slice(2).join("/") };
}

function guessContentType(name: string): string {
  const ext = name.toLowerCase().split(".").pop() || "";
  switch (ext) {
    case "pdf": return "application/pdf";
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "gif": return "image/gif";
    case "webp": return "image/webp";
    case "svg": return "image/svg+xml";
    case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "xls": return "application/vnd.ms-excel";
    case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc": return "application/msword";
    case "csv": return "text/csv";
    case "txt": return "text/plain; charset=utf-8";
    case "zip": return "application/zip";
    default: return "application/octet-stream";
  }
}

const ACL_POLICY_METADATA_KEY = "custom:aclPolicy";
const PUBLIC_ACL = JSON.stringify({ owner: "system:seed", visibility: "public" });

async function uploadOne(filename: string): Promise<"uploaded" | "skipped"> {
  const fullObjectPath = `${TARGET_PUBLIC_PATH}/attached_assets/${filename}`;
  const { bucketName, objectName } = parseObjectPath(fullObjectPath);
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(objectName);

  const [exists] = await file.exists();
  if (exists) {
    // Ensure ACL is set even if file exists.
    try {
      await file.setMetadata({
        metadata: { [ACL_POLICY_METADATA_KEY]: PUBLIC_ACL },
      });
    } catch (err) {
      console.warn(`[upload]  could not refresh ACL on ${filename}:`, err);
    }
    return "skipped";
  }

  const local = path.join(ATTACHED_DIR, filename);
  const buf = await readFile(local);
  const contentType = guessContentType(filename);

  await file.save(buf, {
    contentType,
    metadata: {
      contentType,
      metadata: { [ACL_POLICY_METADATA_KEY]: PUBLIC_ACL },
    },
    resumable: false,
    validation: false,
  });

  return "uploaded";
}

async function main() {
  console.log(`[upload] target public path: ${TARGET_PUBLIC_PATH}/attached_assets/`);
  console.log(`[upload] reading ${ATTACHED_DIR}`);

  let files: string[];
  try {
    files = await readdir(ATTACHED_DIR);
  } catch (err) {
    console.error(`[upload] cannot read ${ATTACHED_DIR}:`, err);
    process.exit(1);
  }
  files = files.filter((f) => !f.startsWith("."));
  console.log(`[upload] ${files.length} file(s) to process`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  for (const filename of files) {
    try {
      const result = await uploadOne(filename);
      if (result === "uploaded") {
        uploaded++;
        console.log(`[upload]  + ${filename}`);
      } else {
        skipped++;
      }
    } catch (err) {
      failed++;
      console.error(`[upload]  ! ${filename}:`, err);
    }
  }
  console.log(
    `[upload] uploads done: uploaded=${uploaded} skipped=${skipped} failed=${failed}`,
  );

  // SAFETY: refuse to rewrite refs if any upload failed. Otherwise we'd
  // point library entries at object-storage paths that 404, leaving the
  // library in a broken state until someone re-runs the script. Re-running
  // after fixing the underlying upload failure(s) is the recovery path.
  if (failed > 0) {
    console.error(
      `[upload] aborting storage_ref rewrite because ${failed} file(s) failed to upload. ` +
        `Fix the upload failures above and re-run this script.`,
    );
    process.exitCode = 1;
    return;
  }

  // Rewrite library_entries.storage_ref from `attached:<filename>` to
  // `gcs:/public-objects/attached_assets/<filename>`. The frontend's
  // entryAssetUrl maps `gcs:<path>` → `/api/storage<path>`, so the resulting
  // URL is `/api/storage/public-objects/attached_assets/<filename>`, which
  // resolves via the public-objects route against PUBLIC_OBJECT_SEARCH_PATHS.
  console.log("[upload] rewriting storage_ref values in library_entries");
  const result = await db
    .update(libraryEntriesTable)
    .set({
      storageRef: sql`'gcs:/public-objects/attached_assets/' || substring(${libraryEntriesTable.storageRef} from 10)`,
    })
    .where(like(libraryEntriesTable.storageRef, "attached:%"))
    .returning({ id: libraryEntriesTable.id });
  console.log(`[upload] rewrote ${result.length} library_entries row(s)`);

  // Sanity check: surface any rows that still reference attached: (shouldn't happen).
  const stragglers = await db
    .select({ id: libraryEntriesTable.id, ref: libraryEntriesTable.storageRef })
    .from(libraryEntriesTable)
    .where(like(libraryEntriesTable.storageRef, "attached:%"));
  if (stragglers.length) {
    console.warn(
      `[upload] WARN: ${stragglers.length} row(s) still have attached: refs:`,
      stragglers,
    );
  }

  console.log("[upload] complete");
}

main()
  .then(async () => {
    await (await import("@workspace/db")).pool.end().catch(() => {});
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await (await import("@workspace/db")).pool.end().catch(() => {});
    process.exit(1);
  });
