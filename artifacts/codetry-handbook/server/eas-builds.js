/**
 * Shared helpers for talking to the EAS build API.
 *
 * Used by:
 *   - server/serve.js — to power the `/install/apk` redirect that always
 *     points at the most recent finished preview build.
 *   - scripts/refresh-preview-apk.js — to decide whether to kick off a fresh
 *     preview build before the previous one's APK link expires.
 *
 * The EAS GraphQL endpoint (`https://api.expo.dev/graphql`) authenticates
 * with the same `EXPO_TOKEN` the rest of the EAS CLI uses, which the Replit
 * project has configured as a secret.
 *
 * No external dependencies — uses Node's built-in `fetch` (Node >= 18).
 */

const DEFAULT_PROJECT_ID =
  process.env.EXPO_PROJECT_ID || "ccfff076-0500-4aa5-be7d-2d71e7953ad2";
const EAS_API_URL = "https://api.expo.dev/graphql";

const LATEST_BUILD_QUERY = `
  query LatestPreviewBuild(
    $appId: String!
    $platform: AppPlatform!
    $buildProfile: String!
    $limit: Int!
  ) {
    app {
      byId(appId: $appId) {
        builds(
          offset: 0
          limit: $limit
          filter: {
            platform: $platform
            status: FINISHED
            distribution: INTERNAL
            buildProfile: $buildProfile
          }
        ) {
          id
          status
          completedAt
          createdAt
          buildProfile
          platform
          distribution
          artifacts {
            buildUrl
            applicationArchiveUrl
          }
        }
      }
    }
  }
`;

/**
 * Fetch the most recent finished EAS build matching the given filters.
 *
 * @param {object} opts
 * @param {"ANDROID"|"IOS"} [opts.platform="ANDROID"]
 * @param {string} [opts.buildProfile="preview"]
 * @param {string} [opts.projectId]
 * @param {string} [opts.token] - defaults to process.env.EXPO_TOKEN
 * @returns {Promise<null | {
 *   id: string,
 *   completedAt: string,
 *   createdAt: string,
 *   buildProfile: string,
 *   platform: string,
 *   buildUrl: string | null
 * }>}
 */
async function fetchLatestFinishedPreviewBuild({
  platform = "ANDROID",
  buildProfile = "preview",
  projectId = DEFAULT_PROJECT_ID,
  token = process.env.EXPO_TOKEN,
} = {}) {
  if (!token) {
    throw new Error(
      "EXPO_TOKEN env var is not set; cannot query the EAS build API. " +
        "Add it as a secret (https://expo.dev/accounts/headwaters7/settings/access-tokens).",
    );
  }

  const res = await fetch(EAS_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: LATEST_BUILD_QUERY,
      variables: {
        appId: projectId,
        platform,
        buildProfile,
        limit: 1,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `EAS API responded ${res.status} ${res.statusText}: ${text.slice(0, 500)}`,
    );
  }

  const json = await res.json();
  if (Array.isArray(json.errors) && json.errors.length) {
    throw new Error(
      `EAS GraphQL errors: ${JSON.stringify(json.errors).slice(0, 500)}`,
    );
  }

  const builds = json?.data?.app?.byId?.builds ?? [];
  if (!builds.length) return null;

  const b = builds[0];
  const buildUrl =
    b.artifacts?.buildUrl || b.artifacts?.applicationArchiveUrl || null;

  return {
    id: b.id,
    completedAt: b.completedAt,
    createdAt: b.createdAt,
    buildProfile: b.buildProfile,
    platform: b.platform,
    buildUrl,
  };
}

/**
 * EAS hosts artifact URLs (the `buildUrl`) on a CDN that 404s the file
 * about 14 days after the build finishes. We refuse to redirect to a build
 * older than this so that practitioners get a clear error instead of a
 * dead download.
 */
const EAS_ARTIFACT_TTL_MS = 14 * 24 * 60 * 60 * 1000;

function buildAgeMs(build) {
  if (!build?.completedAt) return Number.POSITIVE_INFINITY;
  const completed = new Date(build.completedAt).getTime();
  if (!Number.isFinite(completed)) return Number.POSITIVE_INFINITY;
  return Date.now() - completed;
}

function isBuildArtifactExpired(build) {
  return buildAgeMs(build) >= EAS_ARTIFACT_TTL_MS;
}

module.exports = {
  DEFAULT_PROJECT_ID,
  EAS_API_URL,
  EAS_ARTIFACT_TTL_MS,
  fetchLatestFinishedPreviewBuild,
  buildAgeMs,
  isBuildArtifactExpired,
};
