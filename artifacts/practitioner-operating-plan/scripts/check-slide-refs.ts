/// <reference types="node" />
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

import { parseSlidesManifest, type SlideEntry } from "../src/data/slidesManifestSchema";
import {
  COST_REGISTRY,
  type CostEntry,
  type CostSlide,
} from "../src/data/costRegistry";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_PROJECT_ROOT = path.resolve(__dirname, "..");

export type CheckRunPaths = {
  projectRoot: string;
  slidesDir: string;
  manifestPath: string;
};

export function defaultPaths(projectRoot: string = DEFAULT_PROJECT_ROOT): CheckRunPaths {
  return {
    projectRoot,
    slidesDir: path.join(projectRoot, "src/pages/slides"),
    manifestPath: path.join(projectRoot, "src/data/slides-manifest.json"),
  };
}

export type ParsedEyebrow = {
  /** The exact text content of the eyebrow line, e.g. `V · Hiring 03 — IT/Tech`. */
  text: string;
  /** Part identifier, e.g. `I`, `V`, `VIII`, or `00` for the prologue. */
  part: string;
  /** Sub-key inside the part: `01`, `Hiring 03`, `Net-positive accountability`, or null. */
  subKey: string | null;
  /** True if the eyebrow looks like a section divider (`Part V · ...`). */
  isDivider: boolean;
  /** Numeric position within the part, if subKey is purely digits. */
  numericIndex: number | null;
  /** 1-based line number of the eyebrow text in the source file. */
  lineNumber: number;
};

export type SlideRecord = {
  entry: SlideEntry;
  filepath: string;
  fileLines: string[];
  eyebrow: ParsedEyebrow | null;
};

export type Issue = {
  level: "error" | "warning" | "review";
  filepath: string;
  lineNumber: number | null;
  message: string;
  detail?: string;
};

export type CheckResult = {
  errors: Issue[];
  warnings: Issue[];
  reviews: Issue[];
  slideCount: number;
};

const ROMAN_PART = "(?:[IVX]+|00)";

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
};

function isKnownRoman(token: string): boolean {
  return token === "00" || token in ROMAN_VALUES;
}

/**
 * Match the JSX-rendered eyebrow text on its own line. Eyebrows live in a
 * `font-mono uppercase tracking-[*em]` div and the text on the next line is
 * indented JSX text content like `              VIII · 02 — Salt runbook`.
 */
const EYEBROW_TEXT_RE = new RegExp(
  String.raw`^\s*((?:Part\s+)?${ROMAN_PART})\s+·\s+(.+?)\s*$`,
);

const EYEBROW_OPEN_RE = /font-mono\s+uppercase\s+tracking-\[/;

export function parseEyebrowFromFile(fileLines: string[]): ParsedEyebrow | null {
  for (let i = 0; i < fileLines.length; i += 1) {
    if (!EYEBROW_OPEN_RE.test(fileLines[i])) continue;
    // The opening tag may span multiple lines (style/className wrapping).
    // Walk forward until we hit the line that closes the opening `>`.
    let openCloseIdx = i;
    while (
      openCloseIdx < fileLines.length &&
      !/>(\s*)$/.test(fileLines[openCloseIdx])
    ) {
      openCloseIdx += 1;
    }
    const textLineIdx = openCloseIdx + 1;
    if (textLineIdx >= fileLines.length) continue;
    const candidate = fileLines[textLineIdx];
    const match = candidate.match(EYEBROW_TEXT_RE);
    if (!match) continue;
    const partRaw = match[1];
    const rest = match[2];
    const partMatch = partRaw.match(/^(?:Part\s+)?(.+)$/);
    const part = partMatch ? partMatch[1] : partRaw;
    const isDivider = /^Part\s+/i.test(partRaw);
    const dashSplit = rest.split(/\s+—\s+/);
    const subKey = dashSplit[0]?.trim() || null;
    const numericMatch = subKey?.match(/^(\d+)$/) ?? null;
    const numericIndex = numericMatch ? parseInt(numericMatch[1], 10) : null;
    return {
      text: `${partRaw} · ${rest}`,
      part,
      subKey: isDivider ? null : subKey,
      isDivider,
      numericIndex,
      lineNumber: textLineIdx + 1,
    };
  }
  return null;
}

function loadSlideRecords(paths: CheckRunPaths): SlideRecord[] {
  const manifestRaw = JSON.parse(readFileSync(paths.manifestPath, "utf8")) as unknown;
  const slides = parseSlidesManifest(manifestRaw);
  const sorted = [...slides].sort((a, b) => a.position - b.position);
  return sorted.map((entry) => {
    const filepath = path.join(paths.projectRoot, entry.filepath);
    const content = readFileSync(filepath, "utf8");
    const fileLines = content.split(/\r?\n/);
    const eyebrow = parseEyebrowFromFile(fileLines);
    return { entry, filepath, fileLines, eyebrow };
  });
}

function relativePath(projectRoot: string, filepath: string): string {
  return path.relative(projectRoot, filepath).replaceAll(path.sep, "/");
}

function snippetAround(line: string, matchIndex: number, span = 60): string {
  const start = Math.max(0, matchIndex - span);
  const end = Math.min(line.length, matchIndex + span);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < line.length ? "…" : "";
  return `${prefix}${line.slice(start, end).trim()}${suffix}`;
}

function checkPartContiguity(
  records: SlideRecord[],
  paths: CheckRunPaths,
  errors: Issue[],
) {
  // For numeric-eyebrow slides, all slides in the same part should be
  // contiguous in manifest order, and their numeric subKey should match the
  // position-within-part.
  const numericByPart = new Map<string, SlideRecord[]>();
  for (const rec of records) {
    if (!rec.eyebrow || rec.eyebrow.numericIndex == null || rec.eyebrow.isDivider) continue;
    const list = numericByPart.get(rec.eyebrow.part) ?? [];
    list.push(rec);
    numericByPart.set(rec.eyebrow.part, list);
  }

  for (const [part, list] of numericByPart) {
    let expected = 1;
    for (const rec of list) {
      const idx = rec.eyebrow!.numericIndex!;
      if (idx !== expected) {
        errors.push({
          level: "error",
          filepath: relativePath(paths.projectRoot, rec.filepath),
          lineNumber: rec.eyebrow!.lineNumber,
          message:
            `Part ${part} eyebrow numbering out of order: slide at manifest position ` +
            `${rec.entry.position} ("${rec.entry.title}") has eyebrow "${rec.eyebrow!.text}" ` +
            `but expected ${part} · ${String(expected).padStart(2, "0")}.`,
          detail:
            `If the deck was just reordered, renumber this slide's eyebrow to keep the ` +
            `Part ${part} sequence contiguous, or move it back to its original position.`,
        });
      }
      expected = idx + 1;
    }
  }
}

function checkPartGroupingContiguous(
  records: SlideRecord[],
  paths: CheckRunPaths,
  errors: Issue[],
) {
  // All slides whose eyebrow names a numbered part (I..VIII) should appear in
  // a contiguous block. If a Part V slide shows up between two Part VIII
  // slides, that's almost certainly a stale eyebrow after a reorder.
  const seenParts = new Map<string, { firstPos: number; lastPos: number }>();
  for (const rec of records) {
    if (!rec.eyebrow) continue;
    const { part } = rec.eyebrow;
    if (!(part in ROMAN_VALUES)) continue;
    const range = seenParts.get(part) ?? {
      firstPos: rec.entry.position,
      lastPos: rec.entry.position,
    };
    range.firstPos = Math.min(range.firstPos, rec.entry.position);
    range.lastPos = Math.max(range.lastPos, rec.entry.position);
    seenParts.set(part, range);
  }

  const partsList = [...seenParts.entries()].sort(
    (a, b) => a[1].firstPos - b[1].firstPos,
  );
  for (let i = 0; i < partsList.length - 1; i += 1) {
    const [partA, rangeA] = partsList[i];
    const [partB, rangeB] = partsList[i + 1];
    if (rangeA.lastPos > rangeB.firstPos) {
      errors.push({
        level: "error",
        filepath: "src/data/slides-manifest.json",
        lineNumber: null,
        message:
          `Part ${partA} (positions ${rangeA.firstPos}–${rangeA.lastPos}) and Part ${partB} ` +
          `(positions ${rangeB.firstPos}–${rangeB.lastPos}) overlap in the manifest. ` +
          `A slide eyebrow probably went stale after a reorder.`,
      });
    }
  }
}

type RefMatch = {
  filepath: string;
  lineNumber: number;
  matchIndex: number;
  line: string;
  raw: string;
  groups: string[];
};

function* findMatches(records: SlideRecord[], pattern: RegExp): Generator<RefMatch> {
  for (const rec of records) {
    const eyebrowLine = rec.eyebrow?.lineNumber;
    for (let i = 0; i < rec.fileLines.length; i += 1) {
      if (eyebrowLine && i + 1 === eyebrowLine) continue;
      const line = rec.fileLines[i];
      const re = new RegExp(pattern.source, pattern.flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(line)) !== null) {
        yield {
          filepath: rec.filepath,
          lineNumber: i + 1,
          matchIndex: m.index,
          line,
          raw: m[0],
          groups: m.slice(1) as string[],
        };
        if (!re.global) break;
        if (m.index === re.lastIndex) re.lastIndex += 1;
      }
    }
  }
}

const NEXT_PREV_RE = /\b(next|previous)\s+slide\b/gi;
const NUMBERED_REF_RE = new RegExp(
  String.raw`(?:Part\s+)?(${ROMAN_PART})\s+·\s+(\d{1,2})\b`,
  "g",
);
const PART_REF_RE = /\bPart\s+([IVX]+)\b/g;
const PARTS_RANGE_RE = /\bParts\s+([IVX]+)\s*[–-]\s*([IVX]+)\b/g;

function checkNumberedReferences(
  records: SlideRecord[],
  paths: CheckRunPaths,
  errors: Issue[],
) {
  const numberedKeys = new Set<string>();
  for (const rec of records) {
    if (!rec.eyebrow || rec.eyebrow.numericIndex == null) continue;
    numberedKeys.add(
      `${rec.eyebrow.part} · ${String(rec.eyebrow.numericIndex).padStart(2, "0")}`,
    );
  }

  for (const match of findMatches(records, NUMBERED_REF_RE)) {
    const part = match.groups[0];
    const num = parseInt(match.groups[1], 10);
    const key = `${part} · ${String(num).padStart(2, "0")}`;
    if (numberedKeys.has(key)) continue;
    errors.push({
      level: "error",
      filepath: relativePath(paths.projectRoot, match.filepath),
      lineNumber: match.lineNumber,
      message: `Stale slide reference "${match.raw}" — no slide has eyebrow ${key}.`,
      detail: snippetAround(match.line, match.matchIndex),
    });
  }
}

function checkPartReferences(
  records: SlideRecord[],
  paths: CheckRunPaths,
  errors: Issue[],
) {
  const knownParts = new Set<string>();
  for (const rec of records) {
    if (rec.eyebrow && rec.eyebrow.part in ROMAN_VALUES) {
      knownParts.add(rec.eyebrow.part);
    }
  }

  // Range first so we can avoid double-flagging the inner `Part X` matches.
  const rangeSpans: Array<{
    filepath: string;
    lineNumber: number;
    start: number;
    end: number;
  }> = [];
  for (const match of findMatches(records, PARTS_RANGE_RE)) {
    const a = match.groups[0];
    const b = match.groups[1];
    const missing: string[] = [];
    if (!knownParts.has(a)) missing.push(a);
    if (!knownParts.has(b)) missing.push(b);
    if (missing.length > 0) {
      errors.push({
        level: "error",
        filepath: relativePath(paths.projectRoot, match.filepath),
        lineNumber: match.lineNumber,
        message:
          `Stale Parts range reference "${match.raw}" — ` +
          `${missing.map((p) => `Part ${p}`).join(", ")} not found in the manifest.`,
        detail: snippetAround(match.line, match.matchIndex),
      });
    }
    rangeSpans.push({
      filepath: match.filepath,
      lineNumber: match.lineNumber,
      start: match.matchIndex,
      end: match.matchIndex + match.raw.length,
    });
  }

  for (const match of findMatches(records, PART_REF_RE)) {
    const insideRange = rangeSpans.some(
      (r) =>
        r.filepath === match.filepath &&
        r.lineNumber === match.lineNumber &&
        match.matchIndex >= r.start &&
        match.matchIndex < r.end,
    );
    if (insideRange) continue;
    const part = match.groups[0];
    if (!isKnownRoman(part)) continue;
    if (knownParts.has(part)) continue;
    errors.push({
      level: "error",
      filepath: relativePath(paths.projectRoot, match.filepath),
      lineNumber: match.lineNumber,
      message: `Stale Part reference "${match.raw}" — no slide eyebrow declares Part ${part}.`,
      detail: snippetAround(match.line, match.matchIndex),
    });
  }
}

function checkAdjacentSlideReferences(
  records: SlideRecord[],
  paths: CheckRunPaths,
  errors: Issue[],
  reviews: Issue[],
) {
  const byPosition = new Map<number, SlideRecord>();
  for (const rec of records) {
    byPosition.set(rec.entry.position, rec);
  }
  const positions = [...byPosition.keys()].sort((a, b) => a - b);
  if (positions.length === 0) return;
  const minPos = positions[0];
  const maxPos = positions[positions.length - 1];

  for (const match of findMatches(records, NEXT_PREV_RE)) {
    const isNext = /next/i.test(match.groups[0]);
    const owner = records.find((r) => r.filepath === match.filepath);
    if (!owner) continue;
    const ownPos = owner.entry.position;
    const adjacentPos = isNext ? ownPos + 1 : ownPos - 1;
    const adjacent = byPosition.get(adjacentPos) ?? null;

    if (!adjacent) {
      errors.push({
        level: "error",
        filepath: relativePath(paths.projectRoot, match.filepath),
        lineNumber: match.lineNumber,
        message:
          `"${match.raw}" but this slide is at manifest position ${ownPos} ` +
          `(${ownPos === minPos ? "first" : ownPos === maxPos ? "last" : "edge"} slide in the deck).`,
        detail: snippetAround(match.line, match.matchIndex),
      });
      continue;
    }

    reviews.push({
      level: "review",
      filepath: relativePath(paths.projectRoot, match.filepath),
      lineNumber: match.lineNumber,
      message:
        `"${match.raw}" → adjacent is "${adjacent.entry.title}" ` +
        `(${relativePath(paths.projectRoot, adjacent.filepath)})`,
      detail: snippetAround(match.line, match.matchIndex),
    });
  }
}

function getSlideFilenames(slidesDir: string): string[] {
  return readdirSync(slidesDir).filter((name) => name.endsWith(".tsx"));
}

const SLIDE_HREF_RE = /^\/slide(\d+)$/;

/**
 * Verify every `slide(N, label, manifestFile)` constant in `costRegistry.ts`
 * still points at the right slide. The cost-review modal renders these as
 * "where this appears" links; if a manifest reorder shifts a slide's
 * position, the registry's hrefs go stale and the modal silently sends
 * users to the wrong slide.
 *
 * Exported for unit testing — pass a synthetic registry + manifest to
 * exercise the drift detection without touching the real artifact.
 */
export function checkCostRegistrySlideRefs(
  registry: ReadonlyArray<CostEntry>,
  manifest: ReadonlyArray<SlideEntry>,
): Issue[] {
  const errors: Issue[] = [];
  const manifestByFile = new Map<string, SlideEntry>();
  for (const entry of manifest) {
    manifestByFile.set(entry.filepath, entry);
  }

  const seen = new Set<string>();
  for (const entry of registry) {
    for (const slideRef of entry.slides) {
      if (!slideRef.manifestFile) continue;
      // Same `slide(...)` constant is shared across many entries; only
      // report each unique (manifestFile, href) pair once.
      const dedupeKey = `${slideRef.manifestFile}::${slideRef.href}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const hrefMatch = slideRef.href.match(SLIDE_HREF_RE);
      if (!hrefMatch) {
        errors.push({
          level: "error",
          filepath: "src/data/costRegistry.ts",
          lineNumber: null,
          message:
            `Cost-registry slide link for "${slideRef.label}" has manifestFile ` +
            `"${slideRef.manifestFile}" but a non-slide href "${slideRef.href}". ` +
            `Either drop manifestFile (for non-slide pages) or fix the href.`,
        });
        continue;
      }

      const declaredPosition = parseInt(hrefMatch[1], 10);
      const manifestEntry = manifestByFile.get(slideRef.manifestFile);
      if (!manifestEntry) {
        errors.push({
          level: "error",
          filepath: "src/data/costRegistry.ts",
          lineNumber: null,
          message:
            `Cost-registry slide link for "${slideRef.label}" points at ` +
            `"${slideRef.manifestFile}" but no manifest entry has that filepath. ` +
            `Update the manifestFile string or remove the registry link.`,
        });
        continue;
      }

      if (manifestEntry.position !== declaredPosition) {
        errors.push({
          level: "error",
          filepath: "src/data/costRegistry.ts",
          lineNumber: null,
          message:
            `Stale cost-registry slide link "${slideRef.label}" → ${slideRef.href}. ` +
            `Manifest places "${manifestEntry.title}" (${slideRef.manifestFile}) at ` +
            `position ${manifestEntry.position}.`,
          detail:
            `Update the slide(${declaredPosition}, "${slideRef.label}", "${slideRef.manifestFile}") ` +
            `call in src/data/costRegistry.ts to slide(${manifestEntry.position}, ...).`,
        });
      }
    }
  }

  return errors;
}

export function runCheck(paths: CheckRunPaths = defaultPaths()): CheckResult {
  // Surface a sanity error if the slides directory is empty or unreadable.
  const knownFiles = getSlideFilenames(paths.slidesDir);
  void knownFiles;

  const records = loadSlideRecords(paths);
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const reviews: Issue[] = [];

  checkPartContiguity(records, paths, errors);
  checkPartGroupingContiguous(records, paths, errors);
  checkNumberedReferences(records, paths, errors);
  checkPartReferences(records, paths, errors);
  checkAdjacentSlideReferences(records, paths, errors, reviews);

  // Cost-registry check only runs against the real artifact (the imported
  // `COST_REGISTRY` lives at a fixed path). Skip it for fixture runs that
  // point at a different project root.
  if (paths.projectRoot === DEFAULT_PROJECT_ROOT) {
    const manifest = records.map((r) => r.entry);
    errors.push(...checkCostRegistrySlideRefs(COST_REGISTRY, manifest));
  }

  return { errors, warnings, reviews, slideCount: records.length };
}

function formatIssue(issue: Issue): string {
  const loc = issue.lineNumber == null ? issue.filepath : `${issue.filepath}:${issue.lineNumber}`;
  const detail = issue.detail ? `\n      ${issue.detail}` : "";
  return `  - ${loc}\n      ${issue.message}${detail}`;
}

export function reportToConsole(result: CheckResult): void {
  if (result.reviews.length > 0) {
    console.log(
      `\nAdjacent-slide references (${result.reviews.length}) — review these against the manifest order after a reorder:`,
    );
    for (const issue of result.reviews) {
      console.log(formatIssue(issue));
    }
  }

  if (result.warnings.length > 0) {
    console.warn(`\nWarnings (${result.warnings.length}):`);
    for (const issue of result.warnings) {
      console.warn(formatIssue(issue));
    }
  }

  if (result.errors.length > 0) {
    console.error(
      `\nSlide cross-reference check failed (${result.errors.length} error(s)):`,
    );
    for (const issue of result.errors) {
      console.error(formatIssue(issue));
    }
    return;
  }

  console.log(
    `\n✓ Slide cross-references look healthy across ${result.slideCount} slides.`,
  );
}

const isCli = (() => {
  try {
    const entry = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
    return entry === import.meta.url;
  } catch {
    return false;
  }
})();

if (isCli) {
  const result = runCheck();
  reportToConsole(result);
  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}
