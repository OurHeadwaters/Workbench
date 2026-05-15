/**
 * validate-slides.ts
 *
 * Checks that slides-manifest.json is internally consistent and every
 * referenced filepath exists on disk.
 *
 * Exit 0 → clean.
 * Exit 1 → one or more errors (details printed to stderr).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "src/data/slides-manifest.json");
const SLIDES_DIR = path.join(ROOT, "src/pages/slides");

interface SlideEntry {
  id: string;
  position: number;
  filepath: string;
  title: string;
}

function fail(msg: string): void {
  process.stderr.write(`[validate-slides] ERROR  ${msg}\n`);
}

function info(msg: string): void {
  process.stdout.write(`[validate-slides] ${msg}\n`);
}

let errors = 0;

// ── 1. Load manifest ──────────────────────────────────────────────────────────
if (!fs.existsSync(MANIFEST_PATH)) {
  fail(`Manifest not found: ${MANIFEST_PATH}`);
  process.exit(1);
}

const manifest: SlideEntry[] = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
info(`Loaded manifest — ${manifest.length} entries`);

// ── 2. Every filepath must resolve to a real file ─────────────────────────────
for (const entry of manifest) {
  const abs = path.join(ROOT, entry.filepath);
  if (!fs.existsSync(abs)) {
    fail(`Slide file missing (position ${entry.position}, id ${entry.id}): ${entry.filepath}`);
    errors++;
  }
}

// ── 3. No duplicate positions ─────────────────────────────────────────────────
const positionsSeen = new Map<number, string>();
for (const entry of manifest) {
  if (positionsSeen.has(entry.position)) {
    fail(
      `Duplicate position ${entry.position}: "${entry.title}" and "${positionsSeen.get(entry.position)}"`,
    );
    errors++;
  } else {
    positionsSeen.set(entry.position, entry.title);
  }
}

// ── 4. Positions must be 1 … N with no gaps ───────────────────────────────────
const positions = [...positionsSeen.keys()].sort((a, b) => a - b);
for (let i = 0; i < positions.length; i++) {
  if (positions[i] !== i + 1) {
    fail(
      `Position sequence has a gap: expected ${i + 1}, found ${positions[i]}. ` +
        `Renumber slides-manifest.json so positions run 1…${manifest.length} without gaps.`,
    );
    errors++;
    break;
  }
}

// ── 5. Every .tsx file in src/pages/slides/ must appear in the manifest ───────
const manifestFilepaths = new Set(manifest.map((e) => e.filepath.replace(/\\/g, "/")));

if (fs.existsSync(SLIDES_DIR)) {
  const slideFiles = fs
    .readdirSync(SLIDES_DIR)
    .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

  for (const file of slideFiles) {
    const rel = `src/pages/slides/${file}`;
    if (!manifestFilepaths.has(rel)) {
      fail(
        `Slide file not listed in manifest: ${rel}. ` +
          `Add an entry to slides-manifest.json or remove the file.`,
      );
      errors++;
    }
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
if (errors === 0) {
  info(`All ${manifest.length} slides validated — OK`);
} else {
  fail(`${errors} error${errors !== 1 ? "s" : ""} found — fix the issues above.`);
  process.exit(1);
}
