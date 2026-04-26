/// <reference types="node" />
/**
 * Guard: stops `FirstReserveThenTheNext.tsx` from re-introducing local
 * literal copies of the cross-reserve corridor defaults, and from
 * regressing away from the live-binding pattern that supersedes them.
 *
 * Why this exists:
 *   The slide's `INSTALL_FEE`, `Y1_RETAINER`, and day-rate constants
 *   used to be hard-coded numbers that mirrored — by comment, not by
 *   import — the `crossReserve.travel.*`,
 *   `crossReserve.installRevenue.perReserve`, and
 *   `crossReserve.retainer.annual` entries in the Practitioner Operating
 *   Plan deck's cost registry. Whenever someone updated a corridor
 *   number in the registry, this slide silently went stale and the
 *   share-link defaults started contradicting the rest of the project.
 *
 *   Task #228 first hoisted the defaults into a shared workspace
 *   package (`@workspace/cross-reserve-corridor`) both decks imported
 *   from. The follow-up landed an even stronger fix: the slide now
 *   reads each tunable corridor value *live* from the Practitioner
 *   Operating Plan's `useAppState` store via `resolveCost` /
 *   `getLiveCostValue` (re-exported by
 *   `@workspace/practitioner-operating-plan/budgetMath`). That means
 *   council edits made in the cost-review modal show up here at runtime
 *   too — the registry is the single source of truth at runtime, not
 *   just at build time.
 *
 *   This script enforces that the slide keeps using that live-binding
 *   pattern and does not regress to module-level numeric copies of the
 *   tunable corridor values.
 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const slidePath = path.join(
  projectRoot,
  "src/pages/slides/FirstReserveThenTheNext.tsx",
);
const BUDGET_MATH_PACKAGE =
  "@workspace/practitioner-operating-plan/budgetMath";
const STORAGE_PACKAGE = "@workspace/practitioner-operating-plan/storage";
const CORRIDOR_PACKAGE = "@workspace/cross-reserve-corridor";

// Names the slide must import from the budgetMath subpath. These are
// the live-binding helpers — `resolveCost` for plain registry reads,
// `getLiveCostValue` for derived ids whose value depends on other
// registry entries. Removing either of them means the slide is no
// longer reading live values from the registry.
const REQUIRED_BUDGET_IMPORTS = ["resolveCost", "getLiveCostValue"] as const;
// `useAppState` is what subscribes the slide to the live registry —
// without it, the `resolveCost` calls would just stare at a stale
// snapshot.
const REQUIRED_STORAGE_IMPORTS = ["useAppState"] as const;
// `CORRIDOR_DEFAULTS` is the canonical shared corridor-defaults
// object the Reset button restores from. Importing it directly from
// the shared package (rather than mirroring its values inline or
// reusing the live registry props) means a single edit to
// `lib/cross-reserve-corridor/src/index.ts` flows through to both
// first render and Reset behaviour.
const REQUIRED_CORRIDOR_IMPORTS = ["CORRIDOR_DEFAULTS"] as const;

// Keys on `CORRIDOR_DEFAULTS` that the Reset handler must restore.
// Order matches the calculator's editable fields top-to-bottom in the
// slide markup. If `lib/cross-reserve-corridor/src/index.ts` ever grows
// or renames a key, update this list (and the slide's reset()) in the
// same change.
const REQUIRED_RESET_DEFAULT_KEYS = [
  "flightPerReturn",
  "lodgingPerNight",
  "foodPerDay",
  "installWeeks",
  "onsiteDays",
] as const;

// Cost ids the slide must read live (via `resolveCost` or the
// `liveDerived` wrapper around `getLiveCostValue`). If any of these
// aren't referenced, someone has likely re-hardcoded a corridor value.
// Order matches their appearance in the slide for easier diff review.
const REQUIRED_LIVE_COST_IDS = [
  "crossReserve.dayRate.onsite",
  "crossReserve.dayRate.remote",
  "crossReserve.retainer.annual",
  "crossReserve.installRevenue.perReserve",
  "crossReserve.travel.flightPerWeek",
  "crossReserve.travel.lodgingPerNight",
  "crossReserve.travel.foodPerOnsiteDay",
] as const;

// Module-level identifier names that, if rebound to a numeric literal,
// mean someone re-introduced a hardcoded corridor value. Note we deliberately
// allow `INSTALL_WEEKS` and `ON_SITE_DAYS` — those are scoping decisions
// for the calculator panel, not corridor variables a chief would tune,
// and are documented as such inline in the slide.
const FORBIDDEN_NUMERIC_REBINDS = [
  "INSTALL_FEE",
  "Y1_RETAINER",
  "ONSITE_DAY_RATE",
  "REMOTE_DAY_RATE",
  "ANNUAL_RETAINER",
  "FLIGHT_PER_WEEK",
  "LODGING_PER_NIGHT",
  "FOOD_PER_DAY",
] as const;

function relative(filePath: string): string {
  return path.relative(projectRoot, filePath).replaceAll(path.sep, "/");
}

function fail(messages: string[]): never {
  console.error(
    `Corridor-defaults check failed (${messages.length} issue(s)) in ${relative(slidePath)}:\n`,
  );
  for (const message of messages) {
    console.error(`- ${message}`);
  }
  console.error(
    `\nThe slide must read its corridor values live from the Practitioner Operating Plan cost registry via \`${BUDGET_MATH_PACKAGE}\` (resolveCost / getLiveCostValue) and \`${STORAGE_PACKAGE}\` (useAppState). See lib/cross-reserve-corridor/src/index.ts for the build-time defaults the registry itself imports.`,
  );
  process.exit(1);
}

function escapeRegex(s: string): string {
  return s.replace(/[/\\.*+?^${}()|[\]]/g, "\\$&");
}

function main(): void {
  const issues: string[] = [];
  const source = readFileSync(slidePath, "utf-8");

  // 1. The budgetMath subpath must be imported.
  const budgetMathImport = new RegExp(
    `from\\s+["']${escapeRegex(BUDGET_MATH_PACKAGE)}["']`,
  );
  if (!budgetMathImport.test(source)) {
    issues.push(
      `missing import from \`${BUDGET_MATH_PACKAGE}\` — the slide must read corridor values live via resolveCost / getLiveCostValue.`,
    );
  }

  // 2. The storage subpath must be imported (useAppState subscription).
  const storageImport = new RegExp(
    `from\\s+["']${escapeRegex(STORAGE_PACKAGE)}["']`,
  );
  if (!storageImport.test(source)) {
    issues.push(
      `missing import from \`${STORAGE_PACKAGE}\` — without useAppState the slide would read a stale snapshot instead of the live registry.`,
    );
  }

  // 3. The shared corridor package must be imported directly so the
  //    Reset button can restore from `CORRIDOR_DEFAULTS` instead of
  //    re-derived live values or inline literals.
  const corridorImport = new RegExp(
    `from\\s+["']${escapeRegex(CORRIDOR_PACKAGE)}["']`,
  );
  if (!corridorImport.test(source)) {
    issues.push(
      `missing import from \`${CORRIDOR_PACKAGE}\` — the slide's Reset button must restore from \`CORRIDOR_DEFAULTS\` so an edit to lib/cross-reserve-corridor/src/index.ts flows through to reset behaviour.`,
    );
  }

  // 4. Each required helper name must appear in an import binding from
  //    the corresponding subpath.
  for (const name of REQUIRED_BUDGET_IMPORTS) {
    const namedImport = new RegExp(
      `import\\s*(?:type\\s*)?{[^}]*\\b${name}\\b[^}]*}\\s*from\\s*["']${escapeRegex(BUDGET_MATH_PACKAGE)}["']`,
      "s",
    );
    if (!namedImport.test(source)) {
      issues.push(
        `expected to import \`${name}\` from \`${BUDGET_MATH_PACKAGE}\` but it isn't in the import list.`,
      );
    }
  }
  for (const name of REQUIRED_STORAGE_IMPORTS) {
    const namedImport = new RegExp(
      `import\\s*(?:type\\s*)?{[^}]*\\b${name}\\b[^}]*}\\s*from\\s*["']${escapeRegex(STORAGE_PACKAGE)}["']`,
      "s",
    );
    if (!namedImport.test(source)) {
      issues.push(
        `expected to import \`${name}\` from \`${STORAGE_PACKAGE}\` but it isn't in the import list.`,
      );
    }
  }
  for (const name of REQUIRED_CORRIDOR_IMPORTS) {
    const namedImport = new RegExp(
      `import\\s*(?:type\\s*)?{[^}]*\\b${name}\\b[^}]*}\\s*from\\s*["']${escapeRegex(CORRIDOR_PACKAGE)}["']`,
      "s",
    );
    if (!namedImport.test(source)) {
      issues.push(
        `expected to import \`${name}\` from \`${CORRIDOR_PACKAGE}\` but it isn't in the import list.`,
      );
    }
  }

  // 5. Each canonical cross-reserve cost id must appear as a string
  //    literal somewhere in the slide (i.e. it's actually being read
  //    live). The slide must surface every tunable corridor value.
  for (const id of REQUIRED_LIVE_COST_IDS) {
    if (!source.includes(`"${id}"`)) {
      issues.push(
        `expected a live read of cost id \`"${id}"\` (via resolveCost or liveDerived) but no string-literal reference was found.`,
      );
    }
  }

  // 6. No module-level re-binding of the tunable corridor values to a
  //    numeric literal — those must come exclusively from live
  //    registry reads. We deliberately match only `const NAME = <numeric
  //    literal>` (with optional `_` separators); using the same name
  //    to bind a function call result is fine because that's the
  //    live-binding path.
  for (const name of FORBIDDEN_NUMERIC_REBINDS) {
    const numericLiteralRegex = new RegExp(
      String.raw`(^|[\s;])(?:const|let|var)\s+${name}\s*(?::\s*number\s*)?=\s*[\d][\d_]*\s*;?`,
      "m",
    );
    if (numericLiteralRegex.test(source)) {
      issues.push(
        `local numeric rebind of \`${name}\` found — this is a tunable corridor value that must come from a live \`resolveCost\` / \`liveDerived\` read against the registry, not a module-level literal.`,
      );
    }
  }

  // 7. The Reset handler must restore from `CORRIDOR_DEFAULTS`. We
  //    locate the `const reset = () => { … };` arrow body and verify
  //    that every editable corridor field is restored from a
  //    `CORRIDOR_DEFAULTS.<key>` member access. This is the core
  //    invariant the task established: a future edit to
  //    `lib/cross-reserve-corridor/src/index.ts` must flow through to
  //    Reset behaviour without any slide-local edits.
  const resetBlockMatch = source.match(
    /const\s+reset\s*=\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\};/,
  );
  if (!resetBlockMatch) {
    issues.push(
      `couldn't locate the \`const reset = () => { ... };\` arrow function — the guard needs that exact shape to verify the Reset handler restores from \`CORRIDOR_DEFAULTS\`.`,
    );
  } else {
    const resetBody = resetBlockMatch[1];
    for (const key of REQUIRED_RESET_DEFAULT_KEYS) {
      const accessRegex = new RegExp(
        `\\bCORRIDOR_DEFAULTS\\.${escapeRegex(key)}\\b`,
      );
      if (!accessRegex.test(resetBody)) {
        issues.push(
          `Reset handler must restore the \`${key}\` field from \`CORRIDOR_DEFAULTS.${key}\`, but no such reference was found inside \`const reset = () => { ... }\`. Sourcing reset values from anywhere else (props, inline literals, the live registry) breaks the contract that an edit to lib/cross-reserve-corridor/src/index.ts flows through to Reset behaviour.`,
        );
      }
    }
  }

  if (issues.length > 0) {
    fail(issues);
  }

  console.log(
    `✓ Corridor live-binding wired correctly (${REQUIRED_BUDGET_IMPORTS.length + REQUIRED_STORAGE_IMPORTS.length + REQUIRED_CORRIDOR_IMPORTS.length} helper import(s) verified, ${REQUIRED_LIVE_COST_IDS.length} live cost id(s) read, ${FORBIDDEN_NUMERIC_REBINDS.length} forbidden literal rebind(s) clean, Reset restores ${REQUIRED_RESET_DEFAULT_KEYS.length} field(s) from CORRIDOR_DEFAULTS) in ${relative(slidePath)}`,
  );
}

main();
