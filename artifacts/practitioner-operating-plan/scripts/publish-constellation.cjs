#!/usr/bin/env node
// Publish the canonical constellation manifest into this artifact's
// public/ directory at build time.
//
// SOURCE-OF-TRUTH NOTE (Task #562): the canonical constellation
// manifest now lives inside the codetry-handbook artifact at
// `artifacts/codetry-handbook/data/constellation.json`. The
// Practitioner Operating Plan publishes a byte-identical copy to its
// own `public/constellation.json` at build time so the deployed site
// can fetch it (the books site, the mobile Pioneer Path, and the
// handbook itself all read the canonical file directly via workspace
// imports — only POP needs a copy because Vite has to be able to serve
// the JSON over HTTP).
//
// Modes:
//   default  — copy SOURCE → DEST, overwriting any existing file.
//   --check  — verify DEST exists and matches SOURCE byte-for-byte;
//              exit non-zero (with a diff hint) if it does not. The
//              `typecheck` script runs in this mode so a stale public
//              copy fails CI before it ships.
//
// Usage:
//   node scripts/publish-constellation.cjs            # write mode
//   node scripts/publish-constellation.cjs --check    # verify only

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

function findWorkspaceRoot(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  throw new Error(
    "Could not find workspace root (no pnpm-workspace.yaml found)",
  );
}

const workspaceRoot = findWorkspaceRoot(projectRoot);
const SOURCE = path.join(
  workspaceRoot,
  "artifacts/codetry-handbook/data/constellation.json",
);
const DEST = path.join(projectRoot, "public/constellation.json");

function relFromWorkspace(p) {
  return path.relative(workspaceRoot, p);
}

function main() {
  const args = new Set(process.argv.slice(2));
  const check = args.has("--check");

  if (!fs.existsSync(SOURCE)) {
    console.error(
      `canonical constellation manifest not found: ${relFromWorkspace(SOURCE)}`,
    );
    process.exit(1);
  }

  const sourceBuf = fs.readFileSync(SOURCE);

  if (check) {
    if (!fs.existsSync(DEST)) {
      console.error(
        `published constellation manifest is MISSING: ${relFromWorkspace(DEST)}`,
      );
      console.error(
        `  publish with: pnpm --filter @workspace/practitioner-operating-plan run publish-constellation`,
      );
      process.exit(1);
    }
    const destBuf = fs.readFileSync(DEST);
    if (sourceBuf.equals(destBuf)) {
      console.log(
        `constellation.json is in sync (${sourceBuf.length} bytes).`,
      );
      return;
    }
    console.error(
      `published constellation manifest is OUT OF SYNC with the canonical source.`,
    );
    console.error(`  source: ${relFromWorkspace(SOURCE)} (${sourceBuf.length} bytes)`);
    console.error(`  dest:   ${relFromWorkspace(DEST)} (${destBuf.length} bytes)`);
    console.error(
      `  republish with: pnpm --filter @workspace/practitioner-operating-plan run publish-constellation`,
    );
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.writeFileSync(DEST, sourceBuf);
  console.log(
    `published ${relFromWorkspace(DEST)} (${sourceBuf.length} bytes) from ${relFromWorkspace(SOURCE)}.`,
  );
}

main();
