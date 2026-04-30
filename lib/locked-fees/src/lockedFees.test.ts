import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Workspace-level Deer Lake fee-drift guard (per task #463).
 *
 * Task #462 ran a one-time grep audit across the four financial-heavy
 * artifacts to confirm every `$35,000` / `$35k` / `$420,000` / `$420k`
 * mention either lives in code/tests or is properly framed as the
 * Layer-1 software-only contract that the `$90k/mo` recommended ask
 * absorbs. The audit caught zero issues — but it was a snapshot. The
 * next prose edit could quietly reintroduce an unlabeled `$35k` and
 * nothing would fail.
 *
 * This test converts that one-shot human check into a permanent CI
 * guard. It walks every user-visible `*.tsx` file under each
 * artifact's `src/` directory and every `*.md` file in each artifact
 * (excluding `AGENTS.md`, `__tests__/`, and build output dirs), looks
 * for the four locked-fee literals, and fails if any hit isn't within
 * ±200 characters of one of the framing words:
 *
 *   - "Layer 1"        (lowercase variant matches via case-insensitive)
 *   - "software-only"
 *   - "signed today"
 *   - "replaces"
 *   - "absorbs"
 *
 * The framing words pin the hits to the canonical "$35k/mo Layer-1
 * software-only contract that the $90k/mo recommended ask absorbs"
 * narrative. A bare `$35k` with no framing — exactly what re-creates
 * the original $35k-vs-$90k confusion — fails this guard.
 *
 * Excluded surfaces (by file glob):
 *   - `*.ts` (cost registry, code, tests are not user-visible prose)
 *   - `__tests__/` directories
 *   - `node_modules/`, `dist/`, `static-build/`, `_expo/`
 *   - `AGENTS.md` (agent-only authoring notes)
 *
 * Per-line opt-out:
 *   A line containing the substring `locked-fees: ignore` is skipped.
 *   Use `<!-- locked-fees: ignore -->` in markdown or
 *   `{/* locked-fees: ignore *\/}` in TSX when a hit is intentional
 *   and shouldn't carry the framing words (e.g. a list of historical
 *   numbers in an audit table).
 */

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..", "..");

const ARTIFACTS = [
  "practitioners-guide-v2",
  "practitioner-operating-plan",
  "deer-lake-walkthrough",
  // (artifacts/deer-lake-store-plan was retired, so it is no longer
  // scanned. The guard scope is kept exactly in sync with the live
  // financial-heavy artifacts.)
] as const;

// Literals we lock. Order matters for matching: the longer comma-form
// literals are listed before the short `k` form so that overlapping
// matches don't collide. We use a single regex with alternation and
// `\b` boundaries so `$3500k` or `$35,0000` won't false-match.
const FEE_PATTERN = /\$(?:35,000|35k|420,000|420k)\b/g;

// Case-insensitive framing-word check. Any one is sufficient.
const FRAMING_WORDS = [
  "layer 1",
  "software-only",
  "signed today",
  "replaces",
  "absorbs",
] as const;

const FRAMING_WINDOW = 200; // chars before AND after the match

const OPT_OUT_MARKER = "locked-fees: ignore";

const EXCLUDED_DIR_NAMES = new Set([
  "node_modules",
  "dist",
  "static-build",
  "_expo",
  "build",
  ".next",
  "__tests__",
]);

const EXCLUDED_BASENAMES = new Set(["AGENTS.md"]);

interface FileScanTarget {
  /** Absolute path to the file. */
  absolutePath: string;
  /** Repo-relative path used in failure messages. */
  relativePath: string;
}

function listFilesRecursively(
  rootDir: string,
  predicate: (relPath: string, basename: string) => boolean,
): FileScanTarget[] {
  const out: FileScanTarget[] = [];

  function walk(dir: string): void {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return; // missing dir is fine; per-file existence is asserted separately
    }
    for (const name of entries) {
      const abs = path.join(dir, name);
      let stats;
      try {
        stats = statSync(abs);
      } catch {
        continue;
      }
      if (stats.isDirectory()) {
        if (EXCLUDED_DIR_NAMES.has(name)) continue;
        walk(abs);
        continue;
      }
      if (!stats.isFile()) continue;
      if (EXCLUDED_BASENAMES.has(name)) continue;
      const rel = path.relative(REPO_ROOT, abs);
      if (predicate(rel, name)) {
        out.push({ absolutePath: abs, relativePath: rel });
      }
    }
  }

  walk(rootDir);
  out.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  return out;
}

function collectScanTargets(artifactSlug: string): FileScanTarget[] {
  const artifactRoot = path.join(REPO_ROOT, "artifacts", artifactSlug);

  // *.tsx restricted to src/ — the user-visible component surface.
  const srcDir = path.join(artifactRoot, "src");
  const tsxTargets = listFilesRecursively(
    srcDir,
    (_rel, basename) => basename.endsWith(".tsx"),
  );

  // *.md scanned across the whole artifact (docs/, README, etc.) so a
  // future read-aloud worksheet or change log can't quietly reintroduce
  // an unlabeled $35k. AGENTS.md is excluded above.
  const mdTargets = listFilesRecursively(
    artifactRoot,
    (_rel, basename) => basename.endsWith(".md"),
  );

  return [...tsxTargets, ...mdTargets];
}

interface UnframedHit {
  file: string;
  line: number;
  column: number;
  matched: string;
  context: string;
}

function findUnframedHits(target: FileScanTarget): UnframedHit[] {
  const source = readFileSync(target.absolutePath, "utf-8");
  const hits: UnframedHit[] = [];

  // Reset regex state for each file (it's stateful across .exec calls).
  const re = new RegExp(FEE_PATTERN.source, FEE_PATTERN.flags);

  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;

    // Per-line opt-out: if the line containing the match has the
    // marker, skip without checking framing.
    const lineStart = source.lastIndexOf("\n", matchStart - 1) + 1;
    const lineEndRaw = source.indexOf("\n", matchEnd);
    const lineEnd = lineEndRaw === -1 ? source.length : lineEndRaw;
    const line = source.slice(lineStart, lineEnd);
    if (line.includes(OPT_OUT_MARKER)) continue;

    // ±FRAMING_WINDOW characters around the match.
    const winStart = Math.max(0, matchStart - FRAMING_WINDOW);
    const winEnd = Math.min(source.length, matchEnd + FRAMING_WINDOW);
    const windowText = source.slice(winStart, winEnd).toLowerCase();

    const framed = FRAMING_WORDS.some((word) => windowText.includes(word));
    if (framed) continue;

    // Compute 1-indexed line/column for friendlier error output.
    const before = source.slice(0, matchStart);
    const lineNum = (before.match(/\n/g)?.length ?? 0) + 1;
    const colNum = matchStart - lineStart + 1;

    hits.push({
      file: target.relativePath,
      line: lineNum,
      column: colNum,
      matched: match[0],
      context: line.trim(),
    });
  }

  return hits;
}

function formatHits(hits: UnframedHit[]): string {
  return hits
    .map(
      (h) =>
        `  - ${h.file}:${h.line}:${h.column}  matched "${h.matched}"\n      ${h.context}`,
    )
    .join("\n");
}

describe("Deer Lake locked-fee drift guard (workspace-level)", () => {
  for (const artifact of ARTIFACTS) {
    describe(`artifact: ${artifact}`, () => {
      const targets = collectScanTargets(artifact);

      it("scans at least one user-visible file (sanity guard against rename)", () => {
        // If this fails, the artifact directory was renamed/moved and
        // the guard is silently scanning nothing. Fail loudly.
        expect(
          targets.length,
          `Expected to scan at least one *.tsx or *.md file under artifacts/${artifact}. ` +
            `If the artifact was renamed, update lib/locked-fees/src/lockedFees.test.ts.`,
        ).toBeGreaterThan(0);
      });

      it("every $35k / $35,000 / $420k / $420,000 hit is framed as Layer-1 software-only", () => {
        const allUnframed: UnframedHit[] = [];
        for (const target of targets) {
          allUnframed.push(...findUnframedHits(target));
        }

        if (allUnframed.length > 0) {
          throw new Error(
            `Found ${allUnframed.length} unframed Deer Lake fee mention(s) in ${artifact}.\n\n` +
              `Each $35k / $35,000 / $420k / $420,000 mention in user-visible *.tsx or *.md ` +
              `must sit within ${FRAMING_WINDOW} characters of one of: ` +
              `${FRAMING_WORDS.map((w) => `"${w}"`).join(", ")}.\n\n` +
              `If a hit is intentional and shouldn't carry framing (e.g. an audit table ` +
              `listing historical literals), append the marker "${OPT_OUT_MARKER}" on the same line.\n\n` +
              `Unframed hits:\n${formatHits(allUnframed)}\n`,
          );
        }
      });
    });
  }

  it("guards exactly the live financial-heavy artifacts (per task #462 audit scope)", () => {
    // If this list grows or shrinks, update the guard intentionally —
    // don't let a silent typo reduce coverage. The Deer Lake Store
    // Plan deck was originally part of this scope but has since been
    // retired, leaving three live financial-heavy artifacts.
    expect([...ARTIFACTS]).toEqual([
      "practitioners-guide-v2",
      "practitioner-operating-plan",
      "deer-lake-walkthrough",
    ]);
  });
});
