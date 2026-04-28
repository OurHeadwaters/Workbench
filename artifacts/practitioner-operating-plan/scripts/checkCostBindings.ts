/// <reference types="node" />
import { readdirSync, readFileSync } from "fs";
import path from "path";

/**
 * Static guard for `getLiveCostValue` / `liveDerived` callsites in the
 * deck. The historic failure mode is always shaped the same way: a
 * slide reads a derived cost id that is no longer covered by the
 * `getLiveCostValue` switch in `src/lib/budgetMath.ts`, which surfaces
 * either as a "TBD" placeholder (if the slide uses the null-tolerant
 * `liveDerived` helper) or — worse — as a thrown render that blanks
 * the whole deck. The `slidesStrippedRegistry` vitest catches the
 * thrown-render shape at test time. This script catches *both* shapes
 * earlier, at lint / authoring time, by parsing every literal id read
 * out of the slide sources and confirming it has a `case` branch in
 * the `getLiveCostValue` switch.
 *
 * Pure helpers are exported so the practitioner and deer-lake decks
 * can both reuse the same logic, and so the parsing can be unit-tested
 * with synthetic fixtures (see `__tests__/checkCostBindings.test.ts`).
 */

export type LiveCostCallFn = "getLiveCostValue" | "liveDerived";

export type LiveCostRead = {
  /** Absolute path to the source file containing the call. */
  filepath: string;
  /** 1-based line number of the call. */
  lineNumber: number;
  /** Which helper the call went through. */
  fn: LiveCostCallFn;
  /** The literal id passed as the second argument. */
  id: string;
};

export type CostBindingIssue = {
  message: string;
};

// `case "..."` literal extraction. Anchored on the keyword + a string
// literal so we don't pick up `case foo:` or `case 0:`.
const CASE_RE = /case\s+"([^"]+)"\s*:/g;

// Match `getLiveCostValue(<state>, "<id>")` and `liveDerived(<state>,
// "<id>")` calls where the id is a string literal. The first arg is
// allowed to be any identifier (state, appState, s, etc) — anything
// dynamic (e.g. variable id) is intentionally ignored because we
// can't statically resolve it here.
//
// Whitespace between tokens is `\s*` (not `[ \t]*`) so the regex also
// matches multi-line call formatting — slides routinely break long
// calls across lines, e.g.
//
//   liveDerived(
//     state,
//     "crossReserve.installRevenue.perReserve",
//   );
//
// A previous per-line scan missed exactly this shape. We also accept
// an optional trailing comma after the id literal (multi-line calls
// almost always carry one) before the closing paren.
const READ_RE =
  /(getLiveCostValue|liveDerived)\s*\(\s*[A-Za-z_$][A-Za-z0-9_$]*\s*,\s*"([^"]+)"\s*,?\s*\)/g;

/**
 * Extract the set of derived ids that `getLiveCostValue` knows how to
 * compute. We scan only inside the function body so unrelated
 * `case "..."` literals elsewhere in `budgetMath.ts` (or any future
 * helper) cannot accidentally widen the known-id set.
 */
export function parseDerivedIdsFromBudgetMath(source: string): Set<string> {
  const ids = new Set<string>();
  const fnStart = source.indexOf("function getLiveCostValue");
  if (fnStart < 0) return ids;
  const braceStart = source.indexOf("{", fnStart);
  if (braceStart < 0) return ids;
  let depth = 1;
  let i = braceStart + 1;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") depth -= 1;
    i += 1;
  }
  const body = source.slice(braceStart, i);
  for (const m of body.matchAll(CASE_RE)) {
    ids.add(m[1]);
  }
  return ids;
}

function* walkFiles(
  dir: string,
  skipDirs: ReadonlySet<string>,
): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      yield* walkFiles(full, skipDirs);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))
    ) {
      yield full;
    }
  }
}

/**
 * Map a 0-based character offset inside `source` to a 1-based line
 * number. Used to attach a useful line number to multi-line call
 * matches, where the function name and the id literal can sit on
 * different lines.
 */
function offsetToLineNumber(source: string, offset: number): number {
  let line = 1;
  const upTo = Math.min(offset, source.length);
  for (let i = 0; i < upTo; i += 1) {
    if (source.charCodeAt(i) === 0x0a /* \n */) line += 1;
  }
  return line;
}

/**
 * Find every literal-id `getLiveCostValue` / `liveDerived` callsite
 * across the given files. Files in `ignoreFiles` are skipped — used to
 * skip `budgetMath.ts` itself (its internal recursion through
 * `getLiveCostValue` is part of the derivation chain, not a slide
 * binding).
 *
 * The scan operates on whole-file source (not per-line) so multi-line
 * calls — extremely common in the slides, where `liveDerived(state,
 * "...long.id...")` is broken across three or four lines — are still
 * matched. The reported `lineNumber` is the line the call *starts*
 * on, derived from the match's character offset.
 */
export function findLiveCostReads(
  files: readonly string[],
  options: { ignoreFiles?: ReadonlySet<string> } = {},
): LiveCostRead[] {
  const ignore = options.ignoreFiles ?? new Set<string>();
  const reads: LiveCostRead[] = [];
  for (const file of files) {
    if (ignore.has(file)) continue;
    const source = readFileSync(file, "utf8");
    const re = new RegExp(READ_RE.source, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(source)) !== null) {
      reads.push({
        filepath: file,
        lineNumber: offsetToLineNumber(source, m.index),
        fn: m[1] as LiveCostCallFn,
        id: m[2],
      });
    }
  }
  return reads;
}

export type CheckCostBindingsOptions = {
  /** Project root used to relativise filepaths in issue messages. */
  projectRoot: string;
  /** Path to the `budgetMath.ts` whose `getLiveCostValue` switch is the
   * source of truth for derived ids. */
  budgetMathPath: string;
  /** Directories to walk for slide / page sources. */
  scanDirs: readonly string[];
  /** Optional extra files to skip (in addition to `__tests__` dirs and
   * `budgetMath.ts` itself, which are skipped automatically). */
  ignoreFiles?: ReadonlySet<string>;
};

/**
 * Top-level check: parse the derived-id set from `budgetMath.ts`,
 * walk the slide / page directories, and report every literal id that
 * is read but not derived. The error message is shaped exactly as
 * the task spec calls for — `id X is read by slide Y:line via fn()
 * but has no derivation case in budgetMath.ts:getLiveCostValue.`
 */
export function checkCostBindings(
  opts: CheckCostBindingsOptions,
): CostBindingIssue[] {
  const issues: CostBindingIssue[] = [];
  const budgetMathSource = readFileSync(opts.budgetMathPath, "utf8");
  const known = parseDerivedIdsFromBudgetMath(budgetMathSource);

  const allFiles: string[] = [];
  const skipDirs = new Set(["__tests__", "node_modules"]);
  for (const dir of opts.scanDirs) {
    for (const file of walkFiles(dir, skipDirs)) {
      allFiles.push(file);
    }
  }

  const ignore = new Set<string>(opts.ignoreFiles ?? []);
  // Always ignore the budgetMath source itself — its recursive
  // `getLiveCostValue(state, "crossReserve.year2.revenue")` calls are
  // part of the derivation chain, not slide bindings.
  ignore.add(path.normalize(opts.budgetMathPath));

  const reads = findLiveCostReads(allFiles, { ignoreFiles: ignore });
  for (const read of reads) {
    if (known.has(read.id)) continue;
    const rel = path
      .relative(opts.projectRoot, read.filepath)
      .replaceAll(path.sep, "/");
    issues.push({
      message:
        `id "${read.id}" is read by ${rel}:${read.lineNumber} via ${read.fn}() ` +
        `but has no derivation case in budgetMath.ts:getLiveCostValue. ` +
        `Add a case for "${read.id}" or remove the binding.`,
    });
  }

  return issues;
}
