/**
 * sync-chapters.mjs
 *
 * Generates artifacts/api-server/src/data/handbook/chapters.json from the
 * canonical source: artifacts/codetry-handbook/data/handbook.ts
 *
 * Usage:
 *   node scripts/sync-chapters.mjs          # generate / update all JSON files
 *   node scripts/sync-chapters.mjs --check  # exit 1 if chapters.json is stale
 *
 * The build script (build.mjs) calls this automatically before every esbuild
 * run, so manual edits to chapters.json are no longer required or reliable.
 * `check-chapters` is also wired into the `typecheck` script so drift is
 * caught in CI without requiring a full build.
 *
 * How it works:
 *   Delegates to the handbook package's own export-handbook-content.ts script,
 *   which is the proven, working mechanism that already generates chapters.json
 *   (and its siblings). This avoids duplicating the tsx invocation context that
 *   the handbook package already has set up correctly.
 *
 *   In --check mode all four JSON files that the export script writes are
 *   saved before the export runs, compared after, and restored unconditionally
 *   so the check is fully non-destructive to the working tree. Exit 1 if
 *   chapters.json changed; exit 0 if it matched.
 */

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactDir = path.dirname(__dirname);

function findWorkspaceRoot(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    dir = path.dirname(dir);
  }
  throw new Error(
    "Could not find workspace root (no pnpm-workspace.yaml found)",
  );
}

const workspaceRoot = findWorkspaceRoot(artifactDir);

const HANDBOOK_DATA_DIR = path.join(
  artifactDir,
  "src/data/handbook",
);

// All four JSON files that export-handbook-content.ts writes.
// --check mode saves and restores ALL of them so the check is non-destructive.
// Drift is reported on chapters.json (the file this script is named for).
const ALL_GENERATED_FILES = [
  "chapters.json",
  "pioneer-path.json",
  "standby.json",
  "founding-examples.json",
].map((f) => path.join(HANDBOOK_DATA_DIR, f));

const CHAPTERS_JSON = ALL_GENERATED_FILES[0];

const HANDBOOK_DIR = path.join(workspaceRoot, "artifacts/codetry-handbook");

function runExportContent() {
  const result = spawnSync(
    "pnpm",
    ["exec", "tsx", "scripts/export-handbook-content.ts"],
    {
      cwd: HANDBOOK_DIR,
      stdio: ["inherit", "pipe", "pipe"],
      encoding: "utf-8",
    },
  );

  if (result.status !== 0) {
    const stderr = result.stderr ?? "";
    const error = result.error ? result.error.message : "";
    console.error(
      [
        "sync-chapters: export-handbook-content.ts failed.",
        "  source:  artifacts/codetry-handbook/data/handbook.ts",
        "  script:  artifacts/codetry-handbook/scripts/export-handbook-content.ts",
        "",
        stderr || error || "(no stderr output)",
      ].join("\n"),
    );
    process.exit(1);
  }

  return result.stdout;
}

const args = new Set(process.argv.slice(2));
const check = args.has("--check");

if (check) {
  mkdirSync(HANDBOOK_DATA_DIR, { recursive: true });

  // Save all four files before the export runs so we can restore them
  // unconditionally — keeping --check fully non-destructive.
  const snapshots = ALL_GENERATED_FILES.map((f) => ({
    path: f,
    content: existsSync(f) ? readFileSync(f, "utf-8") : null,
  }));

  const chaptersJsonBefore = snapshots[0].content ?? "";

  runExportContent();

  const chaptersJsonAfter = existsSync(CHAPTERS_JSON)
    ? readFileSync(CHAPTERS_JSON, "utf-8")
    : "";

  // Restore every file to its pre-check state regardless of outcome:
  // - files that existed before → restore original content
  // - files that were absent before but created by the export → delete
  for (const { path: filePath, content } of snapshots) {
    if (content !== null) {
      writeFileSync(filePath, content, "utf-8");
    } else if (existsSync(filePath)) {
      rmSync(filePath);
    }
  }

  if (chaptersJsonBefore === chaptersJsonAfter) {
    let chapterCount = "?";
    try {
      chapterCount = JSON.parse(chaptersJsonAfter).CHAPTERS?.length ?? "?";
    } catch (_) {}
    console.log(
      `chapters.json is in sync with handbook.ts (${chapterCount} chapters).`,
    );
  } else {
    console.error(
      [
        "chapters.json is OUT OF SYNC with artifacts/codetry-handbook/data/handbook.ts.",
        "  canonical: artifacts/codetry-handbook/data/handbook.ts",
        "  stale:     artifacts/api-server/src/data/handbook/chapters.json",
        "",
        "  To refresh and rebuild:",
        "    pnpm --filter @workspace/api-server run build",
        "",
        "  To refresh without a full build:",
        "    pnpm --filter @workspace/api-server run sync-chapters",
      ].join("\n"),
    );
    process.exit(1);
  }
} else {
  mkdirSync(HANDBOOK_DATA_DIR, { recursive: true });
  const stdout = runExportContent();

  let chapterCount = "?";
  try {
    chapterCount =
      JSON.parse(readFileSync(CHAPTERS_JSON, "utf-8")).CHAPTERS?.length ?? "?";
  } catch (_) {}
  console.log(
    `chapters.json synced from handbook.ts (${chapterCount} chapters, ${path.relative(workspaceRoot, CHAPTERS_JSON)}).`,
  );
  console.log(
    "  canonical source: artifacts/codetry-handbook/data/handbook.ts",
  );
  console.log(
    "  do not edit the JSON files directly — run sync-chapters or build to refresh.",
  );
  // Print per-file counts from the exporter but skip the now-stale advice
  // about editing the JSON files directly (handbook.ts is canonical).
  if (stdout) {
    stdout
      .split("\n")
      .filter(
        (line) =>
          !line.includes("Future content edits") &&
          !line.includes("All content exported") &&
          !line.includes("no app rebuild needed"),
      )
      .forEach((line) => line && console.log(line));
  }
}
