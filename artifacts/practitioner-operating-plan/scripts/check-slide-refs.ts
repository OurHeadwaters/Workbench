/**
 * check-slide-refs.ts
 *
 * Build-time checker for slide cross-references.
 *
 * Catches text-based cross-references of the form (ROMAN · text) — e.g.
 * "(V · Net-positive accountability)" — and verifies that a slide in the
 * slides directory has a matching eyebrow that starts with that prefix.
 *
 * Part of the `check` pipeline alongside validate-slides.ts:
 *   pnpm run check   →  validate-slides && check-slide-refs
 *
 * Usage standalone:
 *   pnpm --filter @workspace/practitioner-operating-plan run check-slide-refs
 *
 * Exit 0 → all refs valid.
 * Exit 1 → at least one stale ref (renamed or moved slide).
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SourceFile {
  path: string;
  content: string;
}

export interface CrossRef {
  /** Full normalised ref text, e.g. "V · Net-positive accountability" */
  text: string;
  file: string;
  line: number;
}

export interface CheckError {
  ref: CrossRef;
  message: string;
}

// ── Regex constants ───────────────────────────────────────────────────────────

const ROMAN_CHARS = "IVXLCDM";

/**
 * Matches text-based cross-references in parentheses:
 *   (ROMAN · text-starting-with-letter)
 * Excludes numeric refs like (VIII · 06) where text starts with a digit.
 */
const TEXT_CROSS_REF_RE = new RegExp(
  `\\(([${ROMAN_CHARS}]+)\\s*·\\s*([A-Za-z][^)]+)\\)`,
  "g"
);

/**
 * Matches eyebrow declarations in slide source files:
 *   ROMAN · text-starting-with-letter
 *
 * Lookbehind excludes:
 *   - matches inside longer words (e.g. the "L" in "SALT")
 *   - matches that start immediately after "(" — that would be a cross-
 *     reference being mistaken for an eyebrow declaration (e.g. the body
 *     text "(V · Net-positive accountability)" must NOT be treated as an
 *     eyebrow, only the actual eyebrow label in the slide header qualifies).
 */
const EYEBROW_RE = new RegExp(
  `(?<![A-Za-z(])([${ROMAN_CHARS}]+)\\s*·\\s*([A-Za-z][^<>\\n"'\`{};,]*)`,
  "g"
);

// ── File helpers ──────────────────────────────────────────────────────────────

function walkTs(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      results.push(...walkTs(full));
    } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
      results.push(full);
    }
  }
  return results;
}

function readFiles(paths: string[]): SourceFile[] {
  return paths.map((p) => ({ path: p, content: readFileSync(p, "utf8") }));
}

// ── Core functions (exported for testing) ────────────────────────────────────

/**
 * Collect eyebrow labels from slide source files.
 *
 * Returns a Set of normalised "ROMAN · text" strings found in the files.
 * Normalisation: trim + collapse internal whitespace.
 */
export function collectEyebrows(files: SourceFile[]): Set<string> {
  const eyebrows = new Set<string>();
  for (const { content } of files) {
    EYEBROW_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = EYEBROW_RE.exec(content)) !== null) {
      const roman = m[1];
      const text = m[2].trim().replace(/\s+/g, " ");
      if (text.length >= 3) {
        eyebrows.add(`${roman} · ${text}`);
      }
    }
  }
  return eyebrows;
}

/**
 * Collect text-based cross-references from source files.
 *
 * Only returns refs of the form (ROMAN · text) where the text after `· `
 * starts with a letter — numeric refs like (VIII · 06) are excluded.
 */
export function collectTextCrossRefs(files: SourceFile[]): CrossRef[] {
  const refs: CrossRef[] = [];
  for (const { path: filePath, content } of files) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      TEXT_CROSS_REF_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = TEXT_CROSS_REF_RE.exec(lines[i])) !== null) {
        const roman = m[1];
        const text = m[2].trim().replace(/\s+/g, " ");
        refs.push({ text: `${roman} · ${text}`, file: filePath, line: i + 1 });
      }
    }
  }
  return refs;
}

/**
 * Validate each text cross-reference against collected eyebrows.
 *
 * A ref "ROMAN · text" is valid when at least one eyebrow either equals the
 * ref text or starts with it followed by a non-alphanumeric character
 * (allowing suffix text like " — subtitle" after the key phrase).
 *
 * Comparison is case-insensitive with normalised whitespace.
 */
export function checkTextRefs(
  eyebrows: Set<string>,
  refs: CrossRef[]
): CheckError[] {
  const errors: CheckError[] = [];
  for (const ref of refs) {
    const normalizedRef = ref.text.replace(/\s+/g, " ").trim().toLowerCase();
    const matched = [...eyebrows].some((eyebrow) => {
      const norm = eyebrow.replace(/\s+/g, " ").trim().toLowerCase();
      if (!norm.startsWith(normalizedRef)) return false;
      if (norm.length === normalizedRef.length) return true;
      return !/[a-z0-9]/.test(norm[normalizedRef.length]);
    });
    if (!matched) {
      errors.push({
        ref,
        message:
          `Stale text cross-reference "(${ref.text})" at ${ref.file}:${ref.line}` +
          ` — no slide eyebrow starts with "${ref.text}"`,
      });
    }
  }
  return errors;
}

// ── Main runner ───────────────────────────────────────────────────────────────

export function run(rootDir?: string): void {
  const root =
    rootDir ??
    join(dirname(fileURLToPath(import.meta.url)), "..");

  const slidesDir = join(root, "src", "pages", "slides");
  const srcDir = join(root, "src");

  const slideFiles = readFiles(walkTs(slidesDir));
  const allSrcFiles = readFiles(walkTs(srcDir));

  const eyebrows = collectEyebrows(slideFiles);
  const refs = collectTextCrossRefs(allSrcFiles);
  const errors = checkTextRefs(eyebrows, refs);

  if (errors.length === 0) {
    console.log(
      `✓ check-slide-refs: ${refs.length} text cross-reference(s) verified` +
        ` against ${eyebrows.size} eyebrow(s) — all valid.`
    );
    return;
  }

  for (const err of errors) {
    console.error(err.message);
  }
  console.error(
    `\n✗ check-slide-refs: ${errors.length} stale text cross-reference(s) found.`
  );
  process.exit(1);
}

// Run when executed directly (tsx scripts/check-slide-refs.ts)
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  run();
}
