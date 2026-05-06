#!/usr/bin/env node
/**
 * codetry-book/audit.ts
 *
 * Drift detection for harvest.md passage citations.
 *
 * For every live-file citation in harvest.md the script:
 *   1. Reads the cited line range (or entire file for field-reference citations)
 *      from the source file.
 *   2. Extracts prose text from those lines, stripping JSX/TS syntax.
 *   3. Checks deterministically that the harvest passage appears in the source.
 *
 * Citation formats recognised:
 *   a) Line-range:        `artifacts/path, lines N–M`
 *   b) Field-reference:   `artifacts/path`   (no line numbers — whole-file search)
 *   c) Deleted-artifact:  `commit:...`        (skipped — not in working tree)
 *
 * Any backtick-quoted token beginning with "artifacts/" that does not match
 * one of these formats is treated as a hard failure so that formatting drift
 * in harvest.md cannot silently drop a passage from coverage.
 *
 * Matching is deterministic. The only normalizations applied are:
 *   • HTML entity decoding
 *   • markdown bold/italic stripping
 *   • typographic quote/apostrophe → ASCII
 *   • whitespace collapse
 *   • bold-title prefix stripping (see below)
 *   • loose punctuation (secondary tier, handles terminal-period differences
 *     between harvest list items and source strings)
 *   • ellipsis (…) fragment splitting (tertiary tier)
 *
 * Bold-title prefix stripping: harvest blockquotes often lead with
 * "**Phase Title** — body" where the title text comes from an adjacent source
 * property (e.g. `title:`) that sits just outside the cited line range.
 * The audit strips the leading `**...** — ` pattern from every blockquote
 * line before comparison so the body text is compared directly.
 *
 * Exits 0   — all passages verified, no drift detected.
 * Exits 1   — one or more passages drifted, out-of-range, or citation invalid.
 *
 * Usage (from repo root):
 *   npx tsx codetry-book/audit.ts
 * or, after adding to package.json scripts:
 *   pnpm run audit:harvest
 */

import * as fs from "fs";
import * as path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

type Citation =
  | { kind: "line-range"; filePath: string; lineStart: number; lineEnd: number }
  | { kind: "whole-file"; filePath: string }
  | { kind: "skip"; reason: string }
  | { kind: "invalid"; raw: string };

interface Passage {
  sectionId: string;
  /** Raw quote text as written in harvest.md (after stripping "> " prefixes). */
  quote: string;
  citation: Citation;
  citationLineNo: number;
}

// ─── Parse harvest.md ────────────────────────────────────────────────────────

/**
 * Classify a backtick-quoted citation token.
 *
 * We intentionally never return "invalid" for commit: tokens (they are skipped)
 * or for well-formed file-only references. Every other failure is hard.
 */
function classifyCitation(raw: string): Citation {
  const trimmed = raw.trim();

  // Deleted-artifact — not in working tree
  if (trimmed.startsWith("commit:")) {
    return { kind: "skip", reason: "deleted-artifact (commit: prefix)" };
  }

  // Must start with "artifacts/"
  if (!trimmed.startsWith("artifacts/")) {
    return { kind: "invalid", raw: trimmed };
  }

  // Line-range format: "artifacts/path, lines N" or "artifacts/path, lines N–M"
  const lineRangeMatch = trimmed.match(
    /^(artifacts\/[^,]+),\s+lines?\s+(\d+)(?:\s*[–\-]\s*(\d+))?/
  );
  if (lineRangeMatch) {
    const lineStart = parseInt(lineRangeMatch[2], 10);
    const lineEnd = lineRangeMatch[3]
      ? parseInt(lineRangeMatch[3], 10)
      : lineStart;
    return {
      kind: "line-range",
      filePath: lineRangeMatch[1].trim(),
      lineStart,
      lineEnd,
    };
  }

  // File-only reference: backtick-quoted content is just the path, with
  // human-readable annotation outside the backtick pair on the same line.
  // Accept if raw is a clean "artifacts/..." path with a known extension.
  if (/^artifacts\/[^\s,]+\.(ts|tsx|md|json)$/.test(trimmed)) {
    return { kind: "whole-file", filePath: trimmed };
  }

  // Anything else is a hard failure — unknown format in a live citation
  return { kind: "invalid", raw: trimmed };
}

/**
 * Scan backward from citationIdx collecting all "> " blockquote lines.
 * Stops at: another citation, "##"/"###" heading, or "---".
 */
function collectBlockquotes(lines: string[], citationIdx: number): string[] {
  const collected: string[] = [];
  const MAX_LOOKBACK = 120;
  const start = citationIdx - 1;
  for (let j = start; j >= 0 && start - j < MAX_LOOKBACK; j--) {
    const ln = lines[j];
    if (/^`artifacts\//.test(ln) || /^`commit:/.test(ln)) break;
    if (/^#{2,4}\s/.test(ln) || ln === "---") break;
    if (ln.startsWith(">")) collected.unshift(ln);
  }
  return collected;
}

function stripBQPrefix(line: string): string {
  if (line.startsWith("> ")) return line.slice(2);
  if (line === ">") return "";
  return line;
}

function parseHarvest(harvestPath: string): Passage[] {
  const lines = fs.readFileSync(harvestPath, "utf8").split("\n");
  const passages: Passage[] = [];
  let sectionId = "unknown";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track current section
    const secMatch = line.match(/^###\s+([\w\-]+)\s*[·:]/);
    if (secMatch) { sectionId = secMatch[1]; continue; }

    // Citation lines look like: `artifacts/...` or `commit:...`
    const citMatch = line.match(/^`(artifacts\/[^`]+|commit:[^`]+)`/);
    if (!citMatch) continue;

    const citation = classifyCitation(citMatch[1]);

    const bqLines = collectBlockquotes(lines, i);
    if (bqLines.length === 0) continue;

    const quote = bqLines.map(stripBQPrefix).join("\n").trim();
    if (!quote) continue;

    passages.push({ sectionId, quote, citation, citationLineNo: i + 1 });
  }

  return passages;
}

// ─── Text extraction ──────────────────────────────────────────────────────────

function decodeEntities(s: string): string {
  return s
    .replace(/&rsquo;/g,  "\u2019")
    .replace(/&lsquo;/g,  "\u2018")
    .replace(/&rdquo;/g,  "\u201c")
    .replace(/&ldquo;/g,  "\u201d")
    .replace(/&mdash;/g,  "\u2014")
    .replace(/&ndash;/g,  "\u2013")
    .replace(/&amp;/g,    "&")
    .replace(/&nbsp;/g,   " ")
    .replace(/&#39;/g,    "\u2019")
    .replace(/&lt;/g,     "<")
    .replace(/&gt;/g,     ">");
}

function stripMD(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

/** Normalise typographic apostrophes/quotes to plain ASCII. */
function normChars(s: string): string {
  return s
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
}

function collapseWS(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Strip terminal sentence-boundary punctuation from both sides.
 * Used as a secondary-tier comparison to handle cases where harvest.md adds
 * a period at the end of each list item and the source string does not.
 */
function loosePunct(s: string): string {
  return s.replace(/[.!?,;:]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Safe, linear-time extraction of double-quoted string literal contents.
 *
 * Requires at least MIN_WORDS words per string to skip short label values
 * (e.g. `term: "The Standby"` is 2 words, `title: "Staffing and training plan"`
 * is 4 words — both would otherwise be inserted between longer prose strings,
 * disrupting substring matching). Most genuine prose strings start a sentence,
 * so 6 words is a safe lower bound.
 */
const MIN_WORDS = 6;

function extractQuotedStrings(src: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < src.length) {
    if (src[i] !== '"') { i++; continue; }
    i++;                       // skip opening "
    let content = "";
    while (i < src.length) {
      const ch = src[i];
      if (ch === "\\") {
        i++;
        if (i < src.length) {
          const esc = src[i];
          content += esc === "n" ? "\n" : esc === "t" ? " " : src[i];
          i++;
        }
      } else if (ch === '"') {
        i++;                   // closing "
        break;
      } else {
        content += ch;
        i++;
      }
    }
    if (content.split(/\s+/).filter(Boolean).length >= MIN_WORDS) {
      result.push(content);
    }
  }
  return result;
}

/**
 * Extract all JSX/HTML text-node content by stripping tags (<…>) and JS
 * expression containers ({…}) using a depth counter (linear, no backtracking).
 *
 * Returns the full remaining text as one string — no per-chunk filtering —
 * so that multiline prose spread across several JSX lines is preserved intact.
 */
function extractJsxText(src: string): string {
  let t1 = "";
  let td = 0;
  for (let i = 0; i < src.length; i++) {
    if (src[i] === "<") { td++; }
    else if (src[i] === ">" && td > 0) { td--; t1 += " "; }
    else if (td === 0) { t1 += src[i]; }
  }
  let t2 = "";
  let bd = 0;
  for (let i = 0; i < t1.length; i++) {
    if (t1[i] === "{") { bd++; }
    else if (t1[i] === "}" && bd > 0) { bd--; t2 += " "; }
    else if (bd === 0) { t2 += t1[i]; }
  }
  return t2;
}

/**
 * Extract all prose text from source lines and return a single normalised string.
 *
 * For .md  — direct prose, no extraction needed.
 * For .ts/.tsx — quoted string literals (≥ MIN_WORDS words) plus JSX text nodes.
 */
function extractSourceText(rawLines: string[], filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const raw = rawLines.join("\n");

  if (ext === ".md") {
    return collapseWS(normChars(stripMD(decodeEntities(raw))));
  }

  const parts: string[] = [
    ...extractQuotedStrings(raw),
    extractJsxText(raw),
  ];

  return collapseWS(normChars(stripMD(decodeEntities(parts.join(" ")))));
}

// ─── Quote normalisation ──────────────────────────────────────────────────────

/**
 * Strip a leading bold-title-dash prefix from a single blockquote line.
 *
 * Pattern:  **Title Text** — body …
 *            **Title Text**: body …
 *
 * Harvest blockquotes often begin with a phase/section title that comes from
 * an adjacent source property (e.g. `title:` or `name:`) which sits just
 * outside the cited line range. Stripping this prefix allows the body to be
 * compared directly against the source prose.
 *
 * Only the LEADING prefix is removed; the body is kept as-is.
 */
function stripBoldPrefix(line: string): string {
  // Match one or more "**Words** — " or "**Words**: " at the start of the line
  return line.replace(/^(\*\*[^*]+\*\*\s*[–—\-:]\s*)+/, "");
}

/**
 * Normalise a harvest blockquote for comparison.
 *
 * Steps:
 *   1. For each line of the raw quote, strip any leading **Bold** — prefix.
 *   2. Re-join and apply the standard normalization chain.
 */
function normaliseQuote(quote: string): string {
  const stripped = quote
    .split("\n")
    .map(stripBoldPrefix)
    .join(" ");
  return collapseWS(normChars(stripMD(decodeEntities(stripped))));
}

// ─── Comparison ───────────────────────────────────────────────────────────────

const ELLIPSIS = "\u2026";

/**
 * Returns true when the harvest passage is present in the source text.
 *
 * Three deterministic tiers — no fuzzy run-matching:
 *
 *   Tier 1 — Exact substring:
 *     normQuote appears verbatim in normSource.
 *
 *   Tier 2 — Loose punctuation:
 *     Both sides have sentence-boundary punctuation stripped before comparison.
 *     Handles harvest adding terminal periods to list items whose source strings
 *     do not carry trailing punctuation.
 *
 *   Tier 3 — Ellipsis fragments:
 *     If the harvest uses "…" as a truncation marker, each fragment is checked
 *     independently (loose punctuation applied).
 */
function matches(normQuote: string, normSource: string): boolean {
  // Tier 1: exact substring
  if (normSource === normQuote || normSource.includes(normQuote)) return true;

  // Tier 2: loose punctuation on both sides
  const lq = loosePunct(normQuote);
  const ls = loosePunct(normSource);
  if (ls === lq || ls.includes(lq)) return true;

  // Tier 3: ellipsis fragment split
  if (normQuote.includes(ELLIPSIS)) {
    const frags = lq
      .split("\u2026")
      .map((p) => p.trim())
      .filter((p) => p.split(" ").length >= 4);
    if (frags.length > 0 && frags.every((f) => ls.includes(f))) return true;
  }

  return false;
}

// ─── Diff display ─────────────────────────────────────────────────────────────

function formatDiff(normQuote: string, normSource: string): string {
  const lines: string[] = [];
  lines.push("  harvest (expected in source):");
  lines.push(`    "${normQuote.slice(0, 300)}${normQuote.length > 300 ? "…" : ""}"`);
  lines.push("  source (first 300 chars):");
  lines.push(`    "${normSource.slice(0, 300)}${normSource.length > 300 ? "…" : ""}"`);

  // Pinpoint first missing 3-word fragment from the quote
  const lq = loosePunct(normQuote);
  const ls = loosePunct(normSource);
  const qWords = lq.split(" ").filter(Boolean);
  for (let i = 0; i + 2 < qWords.length; i++) {
    const frag = qWords.slice(i, i + 3).join(" ");
    if (!ls.includes(frag)) {
      lines.push(`  first missing fragment at word ${i + 1}: "${frag}"`);
      break;
    }
  }

  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  const repoRoot = path.resolve(__dirname, "..");
  const harvestPath = path.join(__dirname, "harvest.md");

  if (!fs.existsSync(harvestPath)) {
    process.stderr.write(`ERROR: harvest.md not found at ${harvestPath}\n`);
    process.exit(1);
  }

  console.log("codetry-book/audit.ts — harvest drift check");
  console.log("=".repeat(60));
  console.log(`harvest.md : ${harvestPath}`);
  console.log(`repo root  : ${repoRoot}`);
  console.log();

  const passages = parseHarvest(harvestPath);
  console.log(`Passages found: ${passages.length}\n`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const passage of passages) {
    const { citation, sectionId, citationLineNo } = passage;
    const label =
      citation.kind === "line-range"
        ? `${sectionId} · ${citation.filePath} lines ${citation.lineStart}–${citation.lineEnd}`
        : citation.kind === "whole-file"
        ? `${sectionId} · ${citation.filePath} (whole file)`
        : citation.kind === "skip"
        ? `${sectionId} · ${citation.reason}`
        : `${sectionId} · INVALID`;

    // Hard failures
    if (citation.kind === "invalid") {
      process.stderr.write(
        `✗  INVALID CITATION: ${label}\n` +
        `   harvest.md line ${citationLineNo}: cannot parse "${citation.raw}"\n\n`
      );
      failed++;
      continue;
    }

    // Skip deleted artifacts
    if (citation.kind === "skip") {
      process.stdout.write(`⊘  SKIP: ${label}\n`);
      skipped++;
      continue;
    }

    const absPath = path.join(repoRoot, citation.filePath);

    if (!fs.existsSync(absPath)) {
      process.stderr.write(
        `✗  FILE NOT FOUND: ${label}\n` +
        `   harvest.md line ${citationLineNo}: ${absPath} does not exist\n\n`
      );
      failed++;
      continue;
    }

    const allLines = fs.readFileSync(absPath, "utf8").split("\n");

    // Determine which lines to check
    let citedLines: string[];
    if (citation.kind === "line-range") {
      if (citation.lineEnd > allLines.length) {
        process.stderr.write(
          `✗  OUT-OF-RANGE: ${label}\n` +
          `   harvest.md line ${citationLineNo}: cites lines ` +
          `${citation.lineStart}–${citation.lineEnd} ` +
          `but file only has ${allLines.length} lines.\n\n`
        );
        failed++;
        continue;
      }
      citedLines = allLines.slice(citation.lineStart - 1, citation.lineEnd);
    } else {
      // whole-file
      citedLines = allLines;
    }

    const normSource = extractSourceText(citedLines, citation.filePath);
    const normQuote = normaliseQuote(passage.quote);

    if (matches(normQuote, normSource)) {
      process.stdout.write(`✓  ${label}\n`);
      ok++;
    } else {
      process.stderr.write(
        `✗  DRIFT: ${label}\n` +
        `   harvest.md line ${citationLineNo}\n` +
        formatDiff(normQuote, normSource) + "\n\n"
      );
      failed++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(
    `Results: ${ok} passed · ${failed} failed · ${skipped} skipped ` +
    `(${passages.length} total)`
  );

  if (failed > 0) {
    process.stderr.write(
      `\n✗  ${failed} passage(s) failed.\n` +
      `   Fix the source text, or update harvest.md to reflect the change.\n`
    );
    process.exit(1);
  } else {
    console.log("\n✓  All passages verified. No drift detected.");
    process.exit(0);
  }
}

main();
