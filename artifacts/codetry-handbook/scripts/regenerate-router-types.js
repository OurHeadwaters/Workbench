#!/usr/bin/env node
//
// Regenerate `.expo/types/router.d.ts` so `tsc` always sees the current set
// of Expo Router routes for this app.
//
// Why this exists: `.expo/` is gitignored, and Expo only refreshes the typed
// routes file while `expo start` is watching `app/`. Without this script, a
// fresh checkout (or any environment that hasn't run `expo start` since a new
// route was added) would have a stale or missing `router.d.ts`, and `tsc`
// would reject valid `router.push("/some-route")` calls with TS2345.
//
// `package.json`'s `typecheck` script runs this immediately before `tsc`.
//
// Note: this calls into expo-router's internal `typed-routes/generate` module
// (the same code path the Expo CLI uses). If you upgrade `expo-router`, sanity
// check that these import paths still resolve.
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const appRoot = path.join(projectRoot, "app");
const typesDir = path.join(projectRoot, ".expo", "types");
const outFile = path.join(typesDir, "router.d.ts");

if (!fs.existsSync(appRoot)) {
  console.error(
    `[regenerate-router-types] expected app/ directory at ${appRoot}`,
  );
  process.exit(1);
}

process.env.EXPO_ROUTER_APP_ROOT = appRoot;

let getTypedRoutesDeclarationFile;
let requireContextPonyfill;
let ctxIgnore;
try {
  ({ getTypedRoutesDeclarationFile } = require(
    "expo-router/build/typed-routes/generate",
  ));
  requireContextPonyfill = require(
    "expo-router/build/testing-library/require-context-ponyfill",
  ).default;
  ({ EXPO_ROUTER_CTX_IGNORE: ctxIgnore } = require("expo-router/_ctx-shared"));
} catch (err) {
  console.error(
    "[regenerate-router-types] could not load expo-router internals:",
    err.message,
  );
  process.exit(1);
}

fs.mkdirSync(typesDir, { recursive: true });

let contents;
try {
  const ctx = requireContextPonyfill(appRoot, true, ctxIgnore);
  contents = getTypedRoutesDeclarationFile(ctx, {});
} catch (err) {
  console.error(
    "[regenerate-router-types] failed to build router.d.ts:",
    err.message,
  );
  process.exit(1);
}

if (!contents) {
  console.error(
    "[regenerate-router-types] expo-router returned empty declaration file",
  );
  process.exit(1);
}

fs.writeFileSync(outFile, contents);
console.log(
  `[regenerate-router-types] wrote ${path.relative(projectRoot, outFile)}`,
);
