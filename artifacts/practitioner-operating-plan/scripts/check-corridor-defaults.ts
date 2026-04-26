/// <reference types="node" />
/**
 * Guard: stops `costRegistry.ts` and `budgetMath.ts` from re-introducing
 * local literal copies of the cross-reserve corridor defaults that the
 * shared `@workspace/cross-reserve-corridor` package owns.
 *
 * Why this exists:
 *   Task #228 hoisted every cross-reserve corridor planning number
 *   (day rates, retainer, travel components, install shape, derived
 *   install/sticker totals) into `@workspace/cross-reserve-corridor`
 *   so the Practitioner Operating Plan registry and the Deer Lake
 *   "First reserve, then the next" slide can no longer drift apart.
 *
 *   Task #228 already added a guard on the Deer Lake side
 *   (`artifacts/deer-lake-store-plan/scripts/check-corridor-defaults.ts`)
 *   that fails the build if that slide regresses to a hard-coded number.
 *   This script is the matching guard on the *registry* side: if any
 *   cross-reserve `defaultValue` in `costRegistry.ts` (or any of the
 *   `CROSS_RESERVE_*` install-shape constants in `budgetMath.ts`) gets
 *   replaced with a numeric literal, this guard fails and the build
 *   stops. Edit the shape in `lib/cross-reserve-corridor/src/index.ts`
 *   instead — both decks pick the change up automatically.
 *
 *   See the deer-lake-side guard for the matching live-binding check
 *   on the slide that consumes these registry values at runtime.
 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const registryPath = path.join(projectRoot, "src/data/costRegistry.ts");
const budgetMathPath = path.join(projectRoot, "src/lib/budgetMath.ts");

const CORRIDOR_PACKAGE = "@workspace/cross-reserve-corridor";

// Registry imports the cost-registry file must keep pulling from the
// shared corridor package. If any of these is missing it means someone
// either deleted a derivation or rebound it to a literal.
const REQUIRED_REGISTRY_IMPORTS = [
  "CORRIDOR_ANNUAL_RETAINER",
  "CORRIDOR_DAY_RATES",
  "CORRIDOR_INSTALL_REVENUE_EXACT",
  "CORRIDOR_INSTALL_SHAPE",
  "CORRIDOR_TRAVEL_DEFAULTS",
  "CORRIDOR_TRAVEL_TOTAL_DEFAULT",
  "CORRIDOR_Y1_ALL_IN_DEFAULT",
] as const;

// budgetMath only needs the install-shape day counts; the day rates,
// retainer, and travel components are read live off the registry.
const REQUIRED_BUDGET_MATH_IMPORTS = ["CORRIDOR_INSTALL_SHAPE"] as const;

// Cost-registry entries whose `defaultValue` MUST come from the shared
// corridor package — not a numeric literal. Listed in the order the
// task description spelled out, mapped to the actual ids that exist in
// the registry today (see `lib/cross-reserve-corridor/src/index.ts` for
// the matching shared constants).
const GUARDED_REGISTRY_ENTRIES: ReadonlyArray<{
  id: string;
  /** Human-readable note used in error messages. */
  fromCorridor: string;
}> = [
  {
    id: "crossReserve.travel.flightPerWeek",
    fromCorridor: "CORRIDOR_TRAVEL_DEFAULTS.flightPerReturn",
  },
  {
    id: "crossReserve.travel.lodgingPerNight",
    fromCorridor: "CORRIDOR_TRAVEL_DEFAULTS.lodgingPerNight",
  },
  {
    id: "crossReserve.travel.foodPerOnsiteDay",
    fromCorridor: "CORRIDOR_TRAVEL_DEFAULTS.foodPerDay",
  },
  {
    id: "crossReserve.dayRate.onsite",
    fromCorridor: "CORRIDOR_DAY_RATES.onsitePerDay",
  },
  {
    id: "crossReserve.dayRate.remote",
    fromCorridor: "CORRIDOR_DAY_RATES.remotePerDay",
  },
  {
    id: "crossReserve.retainer.annual",
    fromCorridor: "CORRIDOR_ANNUAL_RETAINER",
  },
  {
    id: "crossReserve.installRevenue.perReserve",
    fromCorridor: "CORRIDOR_INSTALL_REVENUE_EXACT",
  },
  {
    id: "crossReserve.travel.totalPerInstall",
    fromCorridor: "CORRIDOR_TRAVEL_TOTAL_DEFAULT",
  },
  {
    id: "crossReserve.year1.stickerPrice",
    fromCorridor: "CORRIDOR_Y1_ALL_IN_DEFAULT",
  },
];

// Module-level constants in budgetMath that must keep reading off
// `CORRIDOR_INSTALL_SHAPE` rather than being rebound to a literal.
// These are the `installWeeks`, `onSiteDays`, and `remoteDays` shape
// inputs the task description called out.
const GUARDED_BUDGET_MATH_BINDINGS: ReadonlyArray<{
  name: string;
  fromCorridor: string;
}> = [
  {
    name: "CROSS_RESERVE_ONSITE_DAYS",
    fromCorridor: "CORRIDOR_INSTALL_SHAPE.onsiteDays",
  },
  {
    name: "CROSS_RESERVE_REMOTE_DAYS",
    fromCorridor: "CORRIDOR_INSTALL_SHAPE.remoteDays",
  },
  {
    name: "CROSS_RESERVE_INSTALL_WEEKS",
    fromCorridor: "CORRIDOR_INSTALL_SHAPE.installWeeks",
  },
];

function relative(filePath: string): string {
  return path.relative(projectRoot, filePath).replaceAll(path.sep, "/");
}

function escapeRegex(s: string): string {
  return s.replace(/[/\\.*+?^${}()|[\]]/g, "\\$&");
}

// Matches a bare numeric literal: `1000`, `1_000`, `42.5`, or a
// negated/parenthesised variant. We deliberately do NOT match
// expressions like `CORRIDOR_X * 12` — composing a derived literal off
// the corridor exports is a legitimate live binding.
const NUMERIC_LITERAL_RE = /^-?\(?\s*-?\d[\d_]*(\.\d+)?\s*\)?$/;

function fail(messages: string[]): never {
  console.error(
    `Corridor-defaults check failed (${messages.length} issue(s)) in the practitioner-operating-plan registry / budgetMath:\n`,
  );
  for (const message of messages) {
    console.error(`- ${message}`);
  }
  console.error(
    `\nEvery cross-reserve corridor number must come from \`${CORRIDOR_PACKAGE}\` (see lib/cross-reserve-corridor/src/index.ts). Edit the value there and both this registry and the Deer Lake "First reserve, then the next" slide pick it up automatically.`,
  );
  process.exit(1);
}

/**
 * Pulls the right-hand side of an entry's `defaultValue:` line. We
 * find `id: "<id>"` first, then walk forward to the first
 * `defaultValue:` we encounter, which (by registry convention — every
 * entry is an object literal with `id` declared before `defaultValue`)
 * belongs to that entry.
 */
function findDefaultValueRhs(source: string, id: string): string | null {
  const idMatch = source.match(
    new RegExp(`id:\\s*["']${escapeRegex(id)}["']`),
  );
  if (!idMatch || idMatch.index === undefined) return null;
  const after = source.slice(idMatch.index);
  const dvMatch = after.match(/defaultValue:\s*([^,\n]+?)\s*,/);
  if (!dvMatch) return null;
  return dvMatch[1].trim();
}

/**
 * Pulls the right-hand side of a top-level `export const NAME = ...;`
 * binding in `budgetMath.ts`. Only matches simple single-line bindings —
 * which is the pattern the install-shape constants currently use and
 * the only pattern that is safe to keep as a single source of truth.
 */
function findExportConstRhs(source: string, name: string): string | null {
  const re = new RegExp(
    String.raw`(?:^|\n)export\s+const\s+${escapeRegex(name)}\s*(?::\s*[^=]+)?=\s*([^;\n]+?)\s*;`,
  );
  const m = source.match(re);
  if (!m) return null;
  return m[1].trim();
}

function checkCorridorImport(
  source: string,
  filePath: string,
  required: readonly string[],
  issues: string[],
): void {
  const importPresent = new RegExp(
    `from\\s+["']${escapeRegex(CORRIDOR_PACKAGE)}["']`,
  ).test(source);
  if (!importPresent) {
    issues.push(
      `${relative(filePath)}: missing \`from "${CORRIDOR_PACKAGE}"\` import — this file must read its corridor defaults from the shared package.`,
    );
    return;
  }
  for (const name of required) {
    const namedImport = new RegExp(
      `import\\s*(?:type\\s*)?{[^}]*\\b${escapeRegex(name)}\\b[^}]*}\\s*from\\s*["']${escapeRegex(CORRIDOR_PACKAGE)}["']`,
      "s",
    );
    if (!namedImport.test(source)) {
      issues.push(
        `${relative(filePath)}: expected to import \`${name}\` from \`${CORRIDOR_PACKAGE}\` but it isn't in the import list.`,
      );
    }
  }
}

function main(): void {
  const issues: string[] = [];
  const registrySource = readFileSync(registryPath, "utf-8");
  const budgetMathSource = readFileSync(budgetMathPath, "utf-8");

  // 1. Both files must keep importing from the shared package.
  checkCorridorImport(
    registrySource,
    registryPath,
    REQUIRED_REGISTRY_IMPORTS,
    issues,
  );
  checkCorridorImport(
    budgetMathSource,
    budgetMathPath,
    REQUIRED_BUDGET_MATH_IMPORTS,
    issues,
  );

  // 2. Each guarded registry entry must exist and its `defaultValue`
  //    must NOT be a bare numeric literal.
  for (const { id, fromCorridor } of GUARDED_REGISTRY_ENTRIES) {
    const rhs = findDefaultValueRhs(registrySource, id);
    if (rhs === null) {
      issues.push(
        `${relative(registryPath)}: cost-registry entry \`${id}\` is missing — every cross-reserve corridor entry must exist and read its default from \`${fromCorridor}\` (via \`${CORRIDOR_PACKAGE}\`).`,
      );
      continue;
    }
    if (NUMERIC_LITERAL_RE.test(rhs)) {
      issues.push(
        `${relative(registryPath)}: cost-registry entry \`${id}\` has \`defaultValue: ${rhs}\` — this is a hard-coded numeric literal. It must come from \`${fromCorridor}\` so the registry stays locked to \`${CORRIDOR_PACKAGE}\`.`,
      );
    }
  }

  // 3. Each guarded module-level constant in budgetMath must exist and
  //    must NOT be a bare numeric literal.
  for (const { name, fromCorridor } of GUARDED_BUDGET_MATH_BINDINGS) {
    const rhs = findExportConstRhs(budgetMathSource, name);
    if (rhs === null) {
      issues.push(
        `${relative(budgetMathPath)}: expected an \`export const ${name} = ${fromCorridor};\` binding but none was found — this is one of the install-shape constants that must come from \`${CORRIDOR_PACKAGE}\`.`,
      );
      continue;
    }
    if (NUMERIC_LITERAL_RE.test(rhs)) {
      issues.push(
        `${relative(budgetMathPath)}: \`export const ${name} = ${rhs}\` is a hard-coded numeric literal. It must come from \`${fromCorridor}\` so the install shape stays locked to \`${CORRIDOR_PACKAGE}\`.`,
      );
    }
  }

  if (issues.length > 0) {
    fail(issues);
  }

  console.log(
    `✓ Corridor defaults wired correctly (${REQUIRED_REGISTRY_IMPORTS.length + REQUIRED_BUDGET_MATH_IMPORTS.length} corridor import(s) verified, ${GUARDED_REGISTRY_ENTRIES.length} registry entry default(s) checked, ${GUARDED_BUDGET_MATH_BINDINGS.length} budgetMath install-shape constant(s) checked).`,
  );
}

main();
