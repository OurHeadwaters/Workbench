/// <reference types="node" />
// Helpers used by export-pdfs.ts to ferry a practitioner's runtime
// cost-review edits (otherwise locked inside their browser's
// localStorage) into the puppeteer page that renders the printable
// PDF. Without this, the on-page OnePager renders against the
// practitioner's edits while the PDF puppeteer-render uses an empty
// browser context — meaning a day-rate or retainer edit moves the
// live sheet but the downloadable PDF silently lags until the next
// deploy. With this, `pnpm export-onepager-pdf --app-state <file>`
// reads the same AppState shape `useAppState` writes to localStorage
// and seeds it into the puppeteer page before navigation, so the
// rendered PDF reflects whatever the practitioner most recently
// edited.
//
// Kept in a separate file from export-pdfs.ts so the unit tests can
// import the helpers without pulling puppeteer-core / chromium into
// the vitest sandbox.

import { readFileSync } from "fs";
import path from "path";

import { migrate, STORAGE_KEY, type AppState } from "../src/lib/storage";

export { STORAGE_KEY };

export type LoadAppStateOptions = {
  argv: readonly string[];
  env: NodeJS.ProcessEnv;
  /**
   * Resolves a relative path argument against this directory. Defaults
   * to `process.cwd()` so the CLI flag honours the practitioner's
   * shell working directory; tests pass an explicit value.
   */
  cwd?: string;
};

export type LoadAppStateResult =
  | { state: AppState; sourcePath: string }
  | null;

/**
 * Reads an `--app-state <path>` flag (or `--app-state=<path>`) from
 * `argv`, falling back to the `APP_STATE_FILE` env var. Returns the
 * parsed + migrated AppState alongside the resolved path it came
 * from, or `null` when no override was supplied. Throws if the path
 * was supplied but the file is missing / unparseable / fails the
 * AppState shape sanity check — surfacing the failure loudly is the
 * point: a silent fall-through would re-introduce the same staleness
 * bug this helper exists to prevent.
 */
export function loadAppStateOverride(
  options: LoadAppStateOptions,
): LoadAppStateResult {
  const cwd = options.cwd ?? process.cwd();
  const flagPath = readAppStateFlag(options.argv);
  const envPath = options.env.APP_STATE_FILE;
  const rawPath = flagPath ?? envPath;
  if (!rawPath) return null;
  const resolved = path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(cwd, rawPath);
  let raw: string;
  try {
    raw = readFileSync(resolved, "utf8");
  } catch (err) {
    throw new Error(
      `--app-state file not readable at ${resolved}: ${(err as Error).message}`,
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `--app-state file at ${resolved} is not valid JSON: ${(err as Error).message}`,
    );
  }
  if (!isAppStatePayload(parsed)) {
    throw new Error(
      `--app-state file at ${resolved} does not look like a practitioner-operating-plan AppState payload (expected an object with a numeric "version" field).`,
    );
  }
  const state = migrate(parsed);
  return { state, sourcePath: resolved };
}

function readAppStateFlag(argv: readonly string[]): string | null {
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--app-state") {
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        throw new Error(
          "--app-state requires a path argument (e.g. --app-state ./pop-state.json).",
        );
      }
      return next;
    }
    if (arg.startsWith("--app-state=")) {
      const value = arg.slice("--app-state=".length);
      if (!value) {
        throw new Error(
          "--app-state= requires a non-empty path (e.g. --app-state=./pop-state.json).",
        );
      }
      return value;
    }
  }
  return null;
}

function isAppStatePayload(
  parsed: unknown,
): parsed is { version: number } & Record<string, unknown> {
  return (
    typeof parsed === "object" &&
    parsed !== null &&
    "version" in parsed &&
    typeof (parsed as { version: unknown }).version === "number"
  );
}

/**
 * Returns a JS source string that, when evaluated in a browser
 * context (e.g. via puppeteer's `page.evaluateOnNewDocument`), seeds
 * `localStorage[STORAGE_KEY]` with the supplied AppState. The
 * encoded JSON is wrapped in a try/catch so a quota / serialization
 * hiccup in puppeteer can never crash the page render — the page
 * would just fall back to DEFAULT_STATE the same way it does for a
 * fresh browser, which is the existing pre-task behaviour.
 *
 * The seed runs at document-creation time (before any app script),
 * so by the time `useAppState`'s `loadState()` reads localStorage on
 * first mount, the practitioner's edits are already there.
 */
export function buildLocalStorageSeedScript(state: AppState): string {
  const encoded = JSON.stringify(state);
  // Embed the JSON as a JS string literal. JSON.stringify of a
  // string handles all the quoting / escaping we need. The outer
  // template runs that literal through localStorage.setItem.
  const encodedLiteral = JSON.stringify(encoded);
  const keyLiteral = JSON.stringify(STORAGE_KEY);
  return [
    "(function () {",
    "  try {",
    `    if (typeof window !== "undefined" && window.localStorage) {`,
    `      window.localStorage.setItem(${keyLiteral}, ${encodedLiteral});`,
    "    }",
    "  } catch (err) {",
    "    // Swallow: page falls back to DEFAULT_STATE on read failure,",
    "    // matching the pre-seeding behaviour rather than crashing the",
    "    // PDF render.",
    "  }",
    "})();",
  ].join("\n");
}
