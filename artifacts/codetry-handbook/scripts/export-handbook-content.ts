/**
 * export-handbook-content.ts
 *
 * One-time + on-demand script: reads the canonical TypeScript data files and
 * writes them as JSON to artifacts/api-server/src/data/handbook/.
 *
 * Run with:
 *   pnpm --filter @workspace/codetry-handbook run export-content
 *
 * Re-run whenever chapter content changes in the TypeScript source files.
 * Future edits should go straight to the JSON files in api-server so the
 * handbook app never needs to restart for content-only changes.
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PARTS, CHAPTERS } from "../data/handbook";
import { PIONEER_STATIONS } from "../data/pioneerPath";
import {
  RUNGS,
  SUB_SHELVES,
  VOCAB,
  ITEMS,
  STANDBY_PRIMITIVE,
  STANDBY_PRIMITIVE_NAME,
  STANDBY_PRIMITIVE_SUMMARY,
} from "../data/standby";
import { FOUNDING_EXAMPLE_COMMENTARY } from "../data/foundingExamples";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function run() {
  const apiDataDir = join(
    __dirname,
    "../../../artifacts/api-server/src/data/handbook",
  );
  mkdirSync(apiDataDir, { recursive: true });

  writeFileSync(
    join(apiDataDir, "chapters.json"),
    JSON.stringify({ PARTS, CHAPTERS }, null, 2),
    "utf-8",
  );
  console.log("✓ chapters.json written (" + CHAPTERS.length + " chapters)");

  writeFileSync(
    join(apiDataDir, "pioneer-path.json"),
    JSON.stringify({ PIONEER_STATIONS }, null, 2),
    "utf-8",
  );
  console.log(
    "✓ pioneer-path.json written (" +
      PIONEER_STATIONS.length +
      " stations)",
  );

  writeFileSync(
    join(apiDataDir, "standby.json"),
    JSON.stringify(
      {
        RUNGS,
        SUB_SHELVES,
        VOCAB,
        ITEMS,
        STANDBY_PRIMITIVE,
        STANDBY_PRIMITIVE_NAME,
        STANDBY_PRIMITIVE_SUMMARY,
      },
      null,
      2,
    ),
    "utf-8",
  );
  console.log("✓ standby.json written (" + ITEMS.length + " items)");

  writeFileSync(
    join(apiDataDir, "founding-examples.json"),
    JSON.stringify({ FOUNDING_EXAMPLE_COMMENTARY }, null, 2),
    "utf-8",
  );
  console.log(
    "✓ founding-examples.json written (" +
      FOUNDING_EXAMPLE_COMMENTARY.length +
      " entries)",
  );

  console.log(
    "\nAll content exported to artifacts/api-server/src/data/handbook/",
  );
  console.log(
    "Future content edits: edit the JSON files there — no app rebuild needed.",
  );
}

run();
