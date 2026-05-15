/**
 * check-slide-refs.ts
 *
 * Scans every .tsx / .ts file under src/ for parenthesised cross-references
 * in the form  (Roman · descriptor)
 *
 * e.g.  (VI · 05)                        — eyebrow / step-number ref
 *       (VIII · 06)                       — eyebrow / step-number ref
 *       (V · Net-positive accountability) — position + title-fragment ref
 *
 * For EVERY match the script looks for a manifest entry whose title contains
 * the literal string  "Roman · descriptor"  (case-insensitive).  If no slide
 * title matches, the reference is stale.
 *
 * A failing check reports:
 *   file path · line number · the stale pattern · a list of what the manifest
 *   currently has that starts with the same Roman prefix (so the author knows
 *   what to update it to).
 *
 * Exit 0 → all references resolve to a current slide title.
 * Exit 1 → one or more stale / unresolvable references.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "src/data/slides-manifest.json");
const SRC_DIR = path.join(ROOT, "src");

// ── Types ─────────────────────────────────────────────────────────────────────
interface SlideEntry {
  id: string;
  position: number;
  filepath: string;
  title: string;
}

// ── Normalise a string for case-insensitive containment check ─────────────────
function normalise(s: string): string {
  return s.toLowerCase();
}

// ── Collect all .ts / .tsx source files recursively ──────────────────────────
function collectSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(full, acc);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))
    ) {
      acc.push(full);
    }
  }
  return acc;
}

// ── Pattern: ( RomanNumeral · some text )  ────────────────────────────────────
// Captures: group 1 = Roman numeral token, group 2 = descriptor text
// Matches both eyebrow refs (VI · 05), (VIII · 06) and title refs
// (V · Net-positive accountability).
const REF_PATTERN = /\(([IVXLCDM]+)\s·\s([^)]+)\)/g;

function fail(msg: string): void {
  process.stderr.write(`[check-slide-refs] ERROR  ${msg}\n`);
}

function info(msg: string): void {
  process.stdout.write(`[check-slide-refs] ${msg}\n`);
}

// ── Load manifest ─────────────────────────────────────────────────────────────
if (!fs.existsSync(MANIFEST_PATH)) {
  fail(`Manifest not found: ${MANIFEST_PATH}`);
  process.exit(1);
}

const manifest: SlideEntry[] = JSON.parse(
  fs.readFileSync(MANIFEST_PATH, "utf8"),
);

// Pre-normalise titles for fast lookup
const normalisedTitles: { entry: SlideEntry; norm: string }[] = manifest.map(
  (e) => ({ entry: e, norm: normalise(e.title) }),
);

// ── Scan source files ─────────────────────────────────────────────────────────
const files = collectSourceFiles(SRC_DIR);
let errors = 0;
let refsChecked = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const source = fs.readFileSync(file, "utf8");
  const lines = source.split("\n");

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    REF_PATTERN.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = REF_PATTERN.exec(line)) !== null) {
      const [fullMatch, romanRaw, descriptorRaw] = match;
      const descriptor = descriptorRaw.trim();

      // The canonical eyebrow string we expect to find in a slide title:
      // e.g.  "VI · 05"  or  "V · Net-positive accountability"
      const eyebrow = `${romanRaw} · ${descriptor}`;
      const eyebrowNorm = normalise(eyebrow);

      refsChecked++;

      // Does any manifest title contain this eyebrow string?
      const matched = normalisedTitles.filter((t) =>
        t.norm.includes(eyebrowNorm),
      );

      if (matched.length === 0) {
        // Collect hints: manifest titles that share the same Roman prefix
        const prefix = normalise(`${romanRaw} ·`);
        const hints = normalisedTitles
          .filter((t) => t.norm.includes(prefix))
          .map((t) => `  pos ${t.entry.position}: "${t.entry.title}"`);

        const hintBlock =
          hints.length > 0
            ? `\n  Slides in the manifest that share the same "${romanRaw} ·" prefix:\n${hints.join("\n")}`
            : `\n  No slides in the manifest have a "${romanRaw} ·" prefix at all.`;

        fail(
          `${rel}:${lineIdx + 1}  ${fullMatch}\n` +
            `  No slide found whose title contains "${eyebrow}".` +
            hintBlock +
            `\n  Update the reference or rename the slide eyebrow in the manifest.`,
        );
        errors++;
      }
    }
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
if (errors === 0) {
  info(
    `Checked ${refsChecked} cross-reference${refsChecked !== 1 ? "s" : ""} across ${files.length} files — OK`,
  );
} else {
  fail(
    `${errors} stale cross-reference${errors !== 1 ? "s" : ""} found — fix the issues above.`,
  );
  process.exit(1);
}
