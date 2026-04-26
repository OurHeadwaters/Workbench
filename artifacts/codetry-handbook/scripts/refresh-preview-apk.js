#!/usr/bin/env node
/**
 * Keep the preview APK link on `/install/apk` from going dead.
 *
 * EAS hosts the signed APK that `eas build --profile preview` produces, but
 * the artifact URL itself stops resolving about 14 days after the build
 * finishes. The handbook is meant to be sideloaded onto practitioners'
 * phones in the field, so the install URL must keep working without an
 * engineer pressing buttons every two weeks.
 *
 * This script is the cron-side of that promise:
 *
 *   1. Asks EAS for the most recent finished `preview` Android build.
 *   2. If that build is younger than `PREVIEW_MAX_AGE_DAYS` (default 10),
 *      exits 0 with "no rebuild needed" — the existing APK URL is fine.
 *   3. Otherwise kicks off `eas build --platform android --profile preview
 *      --non-interactive --no-wait`. EAS runs the build in its cloud and
 *      the next time `/install/apk` is hit, the cached lookup expires,
 *      the new build is found, and the redirect target updates itself.
 *
 * Wire it up as a Replit scheduled deployment (cron) — see
 * `artifacts/codetry-handbook/README.md` ("Keeping the preview APK fresh")
 * for the runbook. Running it more often than the rebuild threshold is
 * harmless: the script no-ops if a recent build is already present.
 */

const { spawn } = require("child_process");
const path = require("path");

const {
  fetchLatestFinishedPreviewBuild,
  buildAgeMs,
  EAS_ARTIFACT_TTL_MS,
} = require("../server/eas-builds");

const HANDBOOK_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(HANDBOOK_DIR, "..", "..");

const MAX_AGE_DAYS = (() => {
  const raw = process.env.PREVIEW_MAX_AGE_DAYS;
  if (!raw) return 10;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0 || n >= 14) {
    // Stay strictly under the 14-day expiry, otherwise the next request to
    // /install/apk will return a 503.
    console.warn(
      `[refresh-preview-apk] Ignoring PREVIEW_MAX_AGE_DAYS=${raw}; using default 10.`,
    );
    return 10;
  }
  return n;
})();

const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

function fmtAge(ms) {
  if (!Number.isFinite(ms)) return "unknown";
  const days = ms / (24 * 60 * 60 * 1000);
  return `${days.toFixed(1)} days`;
}

function startEasBuild() {
  return new Promise((resolve, reject) => {
    // `--no-wait` so EAS prints a build URL and returns immediately. The
    // build itself runs on Expo's infrastructure even after this script
    // exits, which is what we want from a cron job.
    const args = [
      "--filter",
      "@workspace/codetry-handbook",
      "exec",
      "eas",
      "build",
      "--platform",
      "android",
      "--profile",
      "preview",
      "--non-interactive",
      "--no-wait",
    ];

    console.log(`[refresh-preview-apk] Starting: pnpm ${args.join(" ")}`);
    const child = spawn("pnpm", args, {
      cwd: REPO_ROOT,
      stdio: "inherit",
      env: process.env,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`eas build exited with code ${code}`));
    });
  });
}

async function main() {
  if (!process.env.EXPO_TOKEN) {
    console.error(
      "[refresh-preview-apk] EXPO_TOKEN is not set. Add it as a secret " +
        "(https://expo.dev/accounts/headwaters7/settings/access-tokens) " +
        "and rerun.",
    );
    process.exit(2);
  }

  const force = process.argv.includes("--force");

  const build = await fetchLatestFinishedPreviewBuild({
    platform: "ANDROID",
    buildProfile: "preview",
  });

  if (!build) {
    console.log(
      "[refresh-preview-apk] No finished preview Android build found on EAS yet — kicking off the first one.",
    );
    await startEasBuild();
    return;
  }

  const age = buildAgeMs(build);
  console.log(
    `[refresh-preview-apk] Latest preview build: id=${build.id} ` +
      `completedAt=${build.completedAt} age=${fmtAge(age)}`,
  );
  console.log(`[refresh-preview-apk] Threshold: ${MAX_AGE_DAYS} days ` +
    `(${fmtAge(MAX_AGE_MS)}); EAS artifact TTL: ${fmtAge(EAS_ARTIFACT_TTL_MS)}.`);

  if (!force && age < MAX_AGE_MS) {
    console.log(
      "[refresh-preview-apk] Build is fresh enough; not rebuilding. " +
        "Pass --force to override.",
    );
    return;
  }

  if (force) {
    console.log("[refresh-preview-apk] --force passed; rebuilding regardless of age.");
  } else {
    console.log(
      `[refresh-preview-apk] Build is older than ${MAX_AGE_DAYS} days; ` +
        "kicking off a fresh preview build.",
    );
  }

  await startEasBuild();
  console.log(
    "[refresh-preview-apk] EAS build dispatched. " +
      "It will finish on Expo's cloud; /install/apk will start serving the " +
      "new APK on its next cache miss (~5 minutes after the build finishes).",
  );
}

main().catch((err) => {
  console.error("[refresh-preview-apk] FAILED:", err && err.stack ? err.stack : err);
  process.exit(1);
});
