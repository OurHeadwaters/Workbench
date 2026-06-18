/**
 * check-book-exports.js
 *
 * Checks whether exports/codetry-book-full.md and exports/codetry-book-data.json
 * are up to date with the handbook source files.
 *
 * Exits 0 if fresh, exits 1 (with a warning) if stale.
 *
 * Run with:
 *   pnpm --filter @workspace/codetry-handbook run check-exports
 *
 * Or pass --strict to treat staleness as a hard error (useful in CI).
 */

const fs = require("fs");
const path = require("path");

const strict = process.argv.includes("--strict");

function findWorkspaceRoot(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    dir = path.dirname(dir);
  }
  throw new Error("Could not find workspace root");
}

const PROJECT_DIR = path.resolve(__dirname, "..");
const WORKSPACE_ROOT = findWorkspaceRoot(PROJECT_DIR);
const EXPORTS_DIR = path.join(WORKSPACE_ROOT, "exports");

// Source files whose changes should trigger a re-export
const SOURCE_GLOBS = [
  // Data modules
  path.join(PROJECT_DIR, "data", "handbook.ts"),
  path.join(PROJECT_DIR, "data", "glossary.ts"),
  path.join(PROJECT_DIR, "data", "tales.ts"),
  path.join(PROJECT_DIR, "data", "stackCards.ts"),
  path.join(PROJECT_DIR, "data", "pioneerPath.ts"),
  path.join(PROJECT_DIR, "data", "constellation.ts"),
  path.join(PROJECT_DIR, "data", "constellation.json"),
  path.join(PROJECT_DIR, "data", "standby.ts"),
  path.join(PROJECT_DIR, "data", "foundingExamples.ts"),
  path.join(PROJECT_DIR, "data", "youthPath.ts"),
  path.join(PROJECT_DIR, "data", "authorPrompts.ts"),
  path.join(PROJECT_DIR, "data", "dailyDriver.ts"),
  // The export script itself
  path.join(PROJECT_DIR, "scripts", "export-book-snapshot.ts"),
];

// Also include all narration .md files
const NARRATION_DIR = path.join(PROJECT_DIR, "public", "narration");
function getNarrationFiles() {
  if (!fs.existsSync(NARRATION_DIR)) return [];
  return fs
    .readdirSync(NARRATION_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(NARRATION_DIR, f));
}

// Export targets
const EXPORT_FILES = [
  path.join(EXPORTS_DIR, "codetry-book-full.md"),
  path.join(EXPORTS_DIR, "codetry-book-data.json"),
];

function mtimeMs(filePath) {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return null;
  }
}

function relPath(p) {
  return path.relative(WORKSPACE_ROOT, p);
}

function main() {
  // Check that both export files exist
  const missing = EXPORT_FILES.filter((f) => !fs.existsSync(f));
  if (missing.length > 0) {
    console.error("✗ Book exports are missing:");
    for (const f of missing) console.error(`    ${relPath(f)}`);
    console.error(
      "\n  Run: pnpm --filter @workspace/codetry-handbook run export-book"
    );
    process.exit(1);
  }

  // Find oldest export mtime (the bottleneck)
  const exportMtimes = EXPORT_FILES.map((f) => ({ file: f, mtime: mtimeMs(f) }));
  const oldestExport = exportMtimes.reduce((a, b) =>
    a.mtime < b.mtime ? a : b
  );
  const exportCutoff = oldestExport.mtime;

  // Collect all source files
  const sourceFiles = [...SOURCE_GLOBS, ...getNarrationFiles()];

  // Find any source file newer than the exports
  const staleDrivers = [];
  for (const src of sourceFiles) {
    const mtime = mtimeMs(src);
    if (mtime === null) continue; // file doesn't exist — skip
    if (mtime > exportCutoff) {
      staleDrivers.push({
        file: src,
        delta: Math.round((mtime - exportCutoff) / 1000),
      });
    }
  }

  if (staleDrivers.length === 0) {
    const exportDate = new Date(exportCutoff).toISOString().split("T")[0];
    console.log(`✓ Book exports are fresh (last exported ${exportDate})`);
    process.exit(0);
  }

  const verb = strict ? "✗" : "⚠";
  console.warn(`${verb} Book exports are STALE — ${staleDrivers.length} source file(s) changed since last export:`);
  for (const { file, delta } of staleDrivers) {
    console.warn(`    ${relPath(file)}  (+${delta}s newer)`);
  }
  console.warn(
    "\n  Run: pnpm --filter @workspace/codetry-handbook run export-book"
  );

  if (strict) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
