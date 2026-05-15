/**
 * check-slide-refs.ts
 *
 * Build-time checker for slide cross-references.
 *
 * Catches three kinds of cross-references and validates each against the
 * slides directory or slides-manifest.json:
 *
 *   1. Text-based refs  — (ROMAN · text)  e.g. "(V · Net-positive accountability)"
 *      Validated against eyebrow declarations found in slide source files.
 *
 *   2. Numeric refs     — (ROMAN · NN)    e.g. "(VIII · 06)" or "(VI · 02b)"
 *      Validated against slide titles in slides-manifest.json.
 *
 *   3. Part prose refs  — "Part V" / "Parts I–V"
 *      Optionally validated: only checked when the manifest actually contains
 *      slides with Roman-numeral title prefixes (i.e. the manifest has part
 *      structure).  Refs whose parts are absent from the manifest are flagged;
 *      if the manifest has no part-structured slides at all, this check is
 *      skipped silently.
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

export interface SlideManifestEntry {
  id: string;
  position: number;
  filepath: string;
  title: string;
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
 * Matches numeric cross-references in parentheses:
 *   (ROMAN · NN)  where NN starts with a digit, e.g. (VI · 05) or (VIII · 06)
 *   The number token may include alphanumerics (e.g. 02b).
 *   Any trailing text inside the parens (e.g. " — subtitle") is captured but
 *   not stored in the ref text.
 */
const NUMERIC_CROSS_REF_RE = new RegExp(
  `\\(([${ROMAN_CHARS}]+)\\s*·\\s*(\\d[\\w]*)(?:[^)]*)\\)`,
  "g"
);

/**
 * Matches "Part V" or "Parts I–V" prose references.
 *   Group 1 = the Roman numeral(s), e.g. "V" or "I–V" or "I-V"
 */
const PART_PROSE_REF_RE = new RegExp(
  `\\bParts?\\s+([${ROMAN_CHARS}]+(?:\\s*[\\u2013\\-]\\s*[${ROMAN_CHARS}]+)?)\\b`,
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

/**
 * Collect numeric cross-references from source files.
 *
 * Returns refs of the form (ROMAN · NN) where the token after `· ` starts
 * with a digit — e.g. (VI · 05), (VIII · 06), (VI · 02b).
 * The stored ref text is "ROMAN · NN" (just the roman + number token, no
 * trailing description inside the parens).
 */
export function collectNumericCrossRefs(files: SourceFile[]): CrossRef[] {
  const refs: CrossRef[] = [];
  for (const { path: filePath, content } of files) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      NUMERIC_CROSS_REF_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = NUMERIC_CROSS_REF_RE.exec(lines[i])) !== null) {
        const roman = m[1];
        const num = m[2].trim();
        refs.push({
          text: `${roman} · ${num}`,
          file: filePath,
          line: i + 1,
        });
      }
    }
  }
  return refs;
}

/**
 * Validate numeric cross-references against the slides manifest.
 *
 * A ref "ROMAN · NN" is valid when at least one manifest slide has a title
 * that starts with "ROMAN · NN" (case-insensitive, normalised whitespace),
 * optionally followed by non-alphanumeric characters (e.g. " — subtitle").
 */
export function checkNumericRefs(
  manifest: SlideManifestEntry[],
  refs: CrossRef[]
): CheckError[] {
  const errors: CheckError[] = [];
  for (const ref of refs) {
    const normalizedRef = ref.text.replace(/\s+/g, " ").trim().toLowerCase();
    const matched = manifest.some((entry) => {
      const title = entry.title.replace(/\s+/g, " ").trim().toLowerCase();
      if (!title.startsWith(normalizedRef)) return false;
      if (title.length === normalizedRef.length) return true;
      return !/[a-z0-9]/.test(title[normalizedRef.length]);
    });
    if (!matched) {
      errors.push({
        ref,
        message:
          `Stale numeric cross-reference "(${ref.text})" at ${ref.file}:${ref.line}` +
          ` — no manifest slide title starts with "${ref.text}"`,
      });
    }
  }
  return errors;
}

/**
 * Collect "Part N" and "Parts I–V" prose references from source files.
 *
 * The stored ref text is the Roman numeral portion only, e.g. "V" or "I–V".
 */
export function collectPartRefs(files: SourceFile[]): CrossRef[] {
  const refs: CrossRef[] = [];
  for (const { path: filePath, content } of files) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      PART_PROSE_REF_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = PART_PROSE_REF_RE.exec(lines[i])) !== null) {
        const roman = m[1].trim().replace(/\s+/g, " ");
        refs.push({ text: roman, file: filePath, line: i + 1 });
      }
    }
  }
  return refs;
}

/**
 * Derive the set of part Roman numerals that appear in the manifest.
 *
 * A slide is considered "part-structured" when its title starts with a
 * sequence of Roman-numeral characters followed by " · ".  Only those parts
 * are returned; slides without that prefix are ignored.
 */
export function manifestParts(manifest: SlideManifestEntry[]): Set<string> {
  const TITLE_ROMAN_RE = new RegExp(`^([${ROMAN_CHARS}]+)\\s*·`, "i");
  const parts = new Set<string>();
  for (const entry of manifest) {
    const m = TITLE_ROMAN_RE.exec(entry.title);
    if (m) parts.add(m[1].toUpperCase());
  }
  return parts;
}

/**
 * Validate "Part N" / "Parts I–V" prose references against the manifest.
 *
 * This check is *optional*: if the manifest contains no part-structured
 * slides (i.e. `manifestParts` returns an empty set), all refs pass silently.
 * This avoids false positives when the manifest doesn't yet use Roman-numeral
 * title prefixes for a given section.
 *
 * For range refs like "I–V" both endpoints are validated independently.
 * A ref is stale when any referenced part is absent from the manifest's
 * known parts.
 */
export function checkPartRefs(
  manifest: SlideManifestEntry[],
  refs: CrossRef[]
): CheckError[] {
  const parts = manifestParts(manifest);
  if (parts.size === 0) return [];

  const errors: CheckError[] = [];
  for (const ref of refs) {
    const endpoints = ref.text
      .split(/[\u2013\-]/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const missing = endpoints.filter((r) => !parts.has(r));
    if (missing.length > 0) {
      errors.push({
        ref,
        message:
          `Stale part reference "Part ${ref.text}" at ${ref.file}:${ref.line}` +
          ` — part(s) ${missing.map((p) => `"${p}"`).join(", ")} not found in manifest`,
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
  const manifestPath = join(root, "src", "data", "slides-manifest.json");

  const slideFiles = readFiles(walkTs(slidesDir));
  const allSrcFiles = readFiles(walkTs(srcDir));

  const manifest: SlideManifestEntry[] = JSON.parse(
    readFileSync(manifestPath, "utf8")
  );

  // ── Text refs ──────────────────────────────────────────────────────────────
  const eyebrows = collectEyebrows(slideFiles);
  const textRefs = collectTextCrossRefs(allSrcFiles);
  const textErrors = checkTextRefs(eyebrows, textRefs);

  // ── Numeric refs ───────────────────────────────────────────────────────────
  const numericRefs = collectNumericCrossRefs(allSrcFiles);
  const numericErrors = checkNumericRefs(manifest, numericRefs);

  // ── Part prose refs ────────────────────────────────────────────────────────
  const partRefs = collectPartRefs(allSrcFiles);
  const partErrors = checkPartRefs(manifest, partRefs);

  // Part-ref errors are warnings only — "Part N" headings in prose are often
  // legitimate section titles within a document, not stale slide cross-refs.
  // They are surfaced so authors can notice drift, but they never fail the build.
  for (const warn of partErrors) {
    console.warn(`[warn] ${warn.message}`);
  }
  if (partErrors.length > 0) {
    console.warn(
      `[warn] check-slide-refs: ${partErrors.length} part prose reference(s) not found` +
        ` in manifest (warnings only — build continues).`
    );
  }

  const fatalErrors = [...textErrors, ...numericErrors];

  if (fatalErrors.length === 0) {
    console.log(
      `✓ check-slide-refs: ` +
        `${textRefs.length} text ref(s), ` +
        `${numericRefs.length} numeric ref(s) verified — all valid.` +
        (partRefs.length > 0 ? ` (${partRefs.length} part ref(s) checked as warnings)` : "")
    );
    return;
  }

  for (const err of fatalErrors) {
    console.error(err.message);
  }
  console.error(
    `\n✗ check-slide-refs: ${fatalErrors.length} stale cross-reference(s) found ` +
      `(${textErrors.length} text, ${numericErrors.length} numeric).`
  );
  process.exit(1);
}

// Run when executed directly (tsx scripts/check-slide-refs.ts)
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  run();
}
