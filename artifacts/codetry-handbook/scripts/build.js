const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");

let metroProcess = null;

const projectRoot = path.resolve(__dirname, "..");

function findWorkspaceRoot(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  throw new Error("Could not find workspace root (no pnpm-workspace.yaml found)");
}

const workspaceRoot = findWorkspaceRoot(projectRoot);
const basePath = (process.env.BASE_PATH || "/").replace(/\/+$/, "");

function exitWithError(message) {
  console.error(message);
  if (metroProcess) {
    metroProcess.kill();
  }
  process.exit(1);
}

function setupSignalHandlers() {
  const cleanup = () => {
    if (metroProcess) {
      console.log("Cleaning up Metro process...");
      metroProcess.kill();
    }
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);
}

function stripProtocol(domain) {
  let urlString = domain.trim();

  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`;
  }

  return new URL(urlString).host;
}

function getDeploymentDomain() {
  if (process.env.REPLIT_INTERNAL_APP_DOMAIN) {
    return stripProtocol(process.env.REPLIT_INTERNAL_APP_DOMAIN);
  }

  if (process.env.REPLIT_DEV_DOMAIN) {
    return stripProtocol(process.env.REPLIT_DEV_DOMAIN);
  }

  if (process.env.EXPO_PUBLIC_DOMAIN) {
    return stripProtocol(process.env.EXPO_PUBLIC_DOMAIN);
  }

  console.error(
    "ERROR: No deployment domain found. Set REPLIT_INTERNAL_APP_DOMAIN, REPLIT_DEV_DOMAIN, or EXPO_PUBLIC_DOMAIN",
  );
  process.exit(1);
}

function prepareDirectories(timestamp) {
  console.log("Preparing build directories...");

  const staticBuild = path.join(projectRoot, "static-build");
  if (fs.existsSync(staticBuild)) {
    fs.rmSync(staticBuild, { recursive: true });
  }

  const dirs = [
    path.join(staticBuild, timestamp, "_expo", "static", "js", "ios"),
    path.join(staticBuild, timestamp, "_expo", "static", "js", "android"),
    path.join(staticBuild, "ios"),
    path.join(staticBuild, "android"),
    path.join(staticBuild, "web"),
  ];

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log("Build:", timestamp);
}

function walkFiles(root) {
  const results = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) results.push(full);
    }
  }
  if (fs.existsSync(root)) walk(root);
  return results;
}

function findExpoCli() {
  // Prefer the resolved JS entry so we can spawn it with `node` directly.
  // The `.bin/expo` shim is a shell script, which does not parse with node.
  const candidates = [
    path.join(projectRoot, "node_modules", "expo", "bin", "cli"),
    path.join(workspaceRoot, "node_modules", "expo", "bin", "cli"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function killProcessOnPort(port) {
  // We try `fuser` first (always present on Replit), then `lsof` as a fallback,
  // then `pkill` matching the metro entry. Any failure is fine — we just want
  // to make sure port `port` is free before re-spawning the bundler.
  return new Promise((resolve) => {
    const cmd =
      `fuser -k -n tcp ${port} 2>/dev/null || ` +
      `lsof -ti tcp:${port} 2>/dev/null | xargs -r kill -9 || ` +
      `pkill -9 -f "expo start" 2>/dev/null || true`;
    const proc = spawn("sh", ["-c", cmd], { stdio: "ignore" });
    proc.on("close", () => resolve());
    proc.on("error", () => resolve());
  });
}

async function buildWebExport(basePath) {
  console.log("\n=== Building PWA web export ===");

  // Metro on 8081 conflicts with `expo export` which spawns its own bundler.
  if (metroProcess) {
    console.log("Stopping Expo Go Metro before web export...");
    metroProcess.kill();
    metroProcess = null;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await killProcessOnPort(8081);
  }

  const webOutputDir = path.join(projectRoot, "static-build", "web");
  if (fs.existsSync(webOutputDir)) {
    fs.rmSync(webOutputDir, { recursive: true });
  }
  fs.mkdirSync(webOutputDir, { recursive: true });

  // expo's `experiments.baseUrl` requires no trailing slash.
  const exportBaseUrl = basePath.replace(/\/+$/, "") || "";

  const expoCli = findExpoCli();
  if (!expoCli) {
    exitWithError(
      "Could not find the expo CLI binary. Run `pnpm install` first.",
    );
  }

  await new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      EXPO_PUBLIC_BASE_URL: exportBaseUrl,
      // Make sure the dev server doesn't get reused.
      CI: "1",
    };
    const proc = spawn(
      "node",
      [expoCli, "export", "--platform", "web", "--output-dir", webOutputDir],
      {
        stdio: "inherit",
        cwd: projectRoot,
        env,
      },
    );
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`expo export exited with code ${code}`));
    });
    proc.on("error", reject);
  });

  console.log("Web export complete");
  return { webOutputDir, exportBaseUrl };
}

const HANDBOOK_ICON_FILES = [
  "icon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
];

function copyHandbookIcon(webOutputDir) {
  for (const filename of HANDBOOK_ICON_FILES) {
    const src = path.join(projectRoot, "assets", "images", filename);
    const dest = path.join(webOutputDir, filename);
    if (!fs.existsSync(src)) {
      exitWithError(`Missing handbook icon source: ${src}`);
    }
    fs.copyFileSync(src, dest);
  }
}

function writeManifest(webOutputDir, exportBaseUrl) {
  const templatePath = path.join(
    projectRoot,
    "server",
    "pwa",
    "manifest-template.json",
  );
  const template = fs.readFileSync(templatePath, "utf-8");
  const scope = (exportBaseUrl || "") + "/";
  const startUrl = scope;
  const iconUrl = scope + "icon.png";
  const icon192Url = scope + "icon-192.png";
  const icon512Url = scope + "icon-512.png";
  const iconMaskable512Url = scope + "icon-maskable-512.png";
  const filled = template
    .replace(/__SCOPE__/g, scope)
    .replace(/__START_URL__/g, startUrl)
    .replace(/__ICON_192_URL__/g, icon192Url)
    .replace(/__ICON_512_URL__/g, icon512Url)
    .replace(/__ICON_MASKABLE_512_URL__/g, iconMaskable512Url)
    .replace(/__ICON_URL__/g, iconUrl);
  fs.writeFileSync(
    path.join(webOutputDir, "manifest.webmanifest"),
    filled,
  );
  console.log("Wrote manifest.webmanifest");
}

function writeServiceWorker(webOutputDir, exportBaseUrl, cacheVersion) {
  const templatePath = path.join(projectRoot, "server", "pwa", "sw-template.js");
  const template = fs.readFileSync(templatePath, "utf-8");
  const scope = (exportBaseUrl || "") + "/";

  const allFiles = walkFiles(webOutputDir);
  const precache = new Set();
  precache.add(scope);
  precache.add(scope + "manifest.webmanifest");
  for (const filename of HANDBOOK_ICON_FILES) {
    precache.add(scope + filename);
  }

  for (const file of allFiles) {
    const rel = path.relative(webOutputDir, file).split(path.sep).join("/");
    if (rel === "sw.js" || rel === "register-sw.js") continue;
    if (rel === "metadata.json") continue;
    precache.add(scope + rel);
  }

  const precacheArr = Array.from(precache).sort();
  const filled = template
    .replace(/__CACHE_VERSION__/g, cacheVersion)
    .replace(/__BASE_PATH__/g, scope)
    .replace(/__NAVIGATION_FALLBACK__/g, scope)
    .replace(/__PRECACHE_LIST__/g, JSON.stringify(precacheArr, null, 2));

  fs.writeFileSync(path.join(webOutputDir, "sw.js"), filled);
  console.log(`Wrote sw.js (precaching ${precacheArr.length} entries)`);
}

function patchIndexHtml(webOutputDir, exportBaseUrl) {
  const indexPath = path.join(webOutputDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    exitWithError("Web export did not produce index.html");
  }
  let html = fs.readFileSync(indexPath, "utf-8");
  const scope = (exportBaseUrl || "") + "/";

  const registerScript = fs.readFileSync(
    path.join(projectRoot, "server", "pwa", "register-sw.js"),
    "utf-8",
  );

  const headInjection = `
  <link rel="manifest" href="${scope}manifest.webmanifest" />
  <link rel="apple-touch-icon" href="${scope}icon-512.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="${scope}icon-192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="${scope}icon-512.png" />
  <link rel="icon" type="image/png" sizes="1024x1024" href="${scope}icon.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Headwaters" />
  <meta name="application-name" content="Headwaters" />
  <meta name="description" content="An offline reader for Headwaters — a practical guide to how a community runs its own economy, in the Codetry tradition." />
`;

  // Insert into <head> right before </head>.
  html = html.replace("</head>", `${headInjection}</head>`);

  // Insert SW registration before </body>.
  const swSnippet = `\n<script>window.__CODETRY_BASE_PATH__=${JSON.stringify(scope)};</script>\n<script>${registerScript}</script>\n`;
  html = html.replace("</body>", `${swSnippet}</body>`);

  fs.writeFileSync(indexPath, html);
  console.log("Patched index.html with PWA hooks");
}

function clearMetroCache() {
  console.log("Clearing Metro cache...");

  const cacheDirs = [
    path.join(projectRoot, ".metro-cache"),
    path.join(projectRoot, "node_modules/.cache/metro"),
  ];

  for (const dir of cacheDirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  console.log("Cache cleared");
}

async function checkMetroHealth() {
  try {
    const response = await fetch("http://localhost:8081/status", {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function getExpoPublicReplId() {
  return process.env.REPL_ID || process.env.EXPO_PUBLIC_REPL_ID;
}

async function startMetro(expoPublicDomain, expoPublicReplId) {
  const isRunning = await checkMetroHealth();
  if (isRunning) {
    console.log("Metro already running");
    return;
  }

  console.log("Starting Metro...");
  console.log(`Setting EXPO_PUBLIC_DOMAIN=${expoPublicDomain}`);
  const env = {
    ...process.env,
    EXPO_PUBLIC_DOMAIN: expoPublicDomain,
    EXPO_PUBLIC_REPL_ID: expoPublicReplId,
  };

  if (expoPublicReplId) {
    console.log(`Setting EXPO_PUBLIC_REPL_ID=${expoPublicReplId}`);
  }

  metroProcess = spawn(
    "pnpm",
    [
      "exec",
      "expo",
      "start",
      "--no-dev",
      "--minify",
      "--localhost",
    ],
    {
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
      cwd: projectRoot,
      env,
    },
  );

  if (metroProcess.stdout) {
    metroProcess.stdout.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.log(`[Metro] ${output}`);
    });
  }
  if (metroProcess.stderr) {
    metroProcess.stderr.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.error(`[Metro Error] ${output}`);
    });
  }

  for (let i = 0; i < 60; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const healthy = await checkMetroHealth();
    if (healthy) {
      console.log("Metro ready");
      return;
    }
  }

  console.error("Metro timeout");
  process.exit(1);
}

async function downloadFile(url, outputPath) {
  const controller = new AbortController();
  const fiveMinMS = 5 * 60 * 1_000;
  const timeoutId = setTimeout(() => controller.abort(), fiveMinMS);

  try {
    console.log(`Downloading: ${url}`);
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const file = fs.createWriteStream(outputPath);
    await pipeline(Readable.fromWeb(response.body), file);

    const fileSize = fs.statSync(outputPath).size;

    if (fileSize === 0) {
      fs.unlinkSync(outputPath);
      throw new Error("Downloaded file is empty");
    }
  } catch (error) {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    if (error.name === "AbortError") {
      throw new Error(`Download timeout after 5m: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function downloadBundle(platform, timestamp) {
  const entryPath = path.resolve(projectRoot, "node_modules", "expo-router", "entry");
  const bundlePath = path.relative(workspaceRoot, entryPath);
  const url = new URL(`http://localhost:8081/${bundlePath}.bundle`);
  url.searchParams.set("platform", platform);
  url.searchParams.set("dev", "false");
  url.searchParams.set("hot", "false");
  url.searchParams.set("lazy", "false");
  url.searchParams.set("minify", "true");

  const output = path.join(
    "static-build",
    timestamp,
    "_expo",
    "static",
    "js",
    platform,
    "bundle.js",
  );

  console.log(`Fetching ${platform} bundle...`);
  await downloadFile(url.toString(), output);
  console.log(`${platform} bundle ready`);
}

async function downloadManifest(platform) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300_000);

  try {
    console.log(`Fetching ${platform} manifest...`);
    const response = await fetch("http://localhost:8081/manifest", {
      headers: { "expo-platform": platform },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const manifest = await response.json();
    console.log(`${platform} manifest ready`);
    return manifest;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        `Manifest download timeout after 5m for platform: ${platform}`,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function downloadBundlesAndManifests(timestamp) {
  console.log("Downloading bundles and manifests...");
  console.log("This may take several minutes for production builds...");

  try {
    // Bundles are sequential — Metro can't handle both platforms simultaneously
    // without stalling. Manifests are cheap and run in parallel after.
    await downloadBundle("ios", timestamp);
    await downloadBundle("android", timestamp);

    const [iosManifest, androidManifest] = await Promise.all([
      downloadManifest("ios"),
      downloadManifest("android"),
    ]);

    console.log("All downloads completed successfully");
    return { ios: iosManifest, android: androidManifest };
  } catch (error) {
    exitWithError(`Download failed: ${error.message}`);
  }
}

function extractAssets(timestamp) {
  const staticBuild = path.join(projectRoot, "static-build");
  const bundles = {
    ios: fs.readFileSync(
      path.join(staticBuild, timestamp, "_expo", "static", "js", "ios", "bundle.js"),
      "utf-8",
    ),
    android: fs.readFileSync(
      path.join(staticBuild, timestamp, "_expo", "static", "js", "android", "bundle.js"),
      "utf-8",
    ),
  };

  const assetsMap = new Map();
  const assetPattern =
    /httpServerLocation:"([^"]+)"[^}]*hash:"([^"]+)"[^}]*name:"([^"]+)"[^}]*type:"([^"]+)"/g;

  const extractFromBundle = (bundle, platform) => {
    for (const match of bundle.matchAll(assetPattern)) {
      const originalPath = match[1];
      const filename = match[3] + "." + match[4];

      const tempUrl = new URL(`http://localhost:8081${originalPath}`);
      const unstablePath = tempUrl.searchParams.get("unstable_path");

      if (!unstablePath) {
        throw new Error(`Asset missing unstable_path: ${originalPath}`);
      }

      const decodedPath = decodeURIComponent(unstablePath);
      const key = path.posix.join(decodedPath, filename);

      if (!assetsMap.has(key)) {
        const asset = {
          url: path.posix.join("/", decodedPath, filename),
          originalPath: originalPath,
          filename: filename,
          relativePath: decodedPath,
          hash: match[2],
          platforms: new Set(),
        };

        assetsMap.set(key, asset);
      }
      assetsMap.get(key).platforms.add(platform);
    }
  };

  extractFromBundle(bundles.ios, "ios");
  extractFromBundle(bundles.android, "android");

  return Array.from(assetsMap.values());
}

async function downloadAssets(assets, timestamp) {
  if (assets.length === 0) {
    return 0;
  }

  console.log("Copying assets...");
  let successCount = 0;
  const failures = [];

  const downloadPromises = assets.map(async (asset) => {
    const tempUrl = new URL(`http://localhost:8081${asset.originalPath}`);
    const unstablePath = tempUrl.searchParams.get("unstable_path");

    if (!unstablePath) {
      throw new Error(`Asset missing unstable_path: ${asset.originalPath}`);
    }

    const decodedPath = decodeURIComponent(unstablePath);

    const outputDir = path.join(
      projectRoot,
      "static-build",
      timestamp,
      "_expo",
      "static",
      "js",
      asset.relativePath,
    );
    fs.mkdirSync(outputDir, { recursive: true });
    const output = path.join(outputDir, asset.filename);

    try {
      const candidates = [
        path.join(projectRoot, decodedPath, asset.filename),
        path.join(workspaceRoot, decodedPath, asset.filename),
      ];
      const found = candidates.find((p) => fs.existsSync(p));
      if (!found) {
        throw new Error(`Asset not found on disk: ${asset.filename}`);
      }
      fs.copyFileSync(found, output);
      successCount++;
    } catch (error) {
      failures.push({
        filename: asset.filename,
        error: error.message,
        url: asset.originalPath,
      });
    }
  });

  await Promise.all(downloadPromises);

  if (failures.length > 0) {
    const errorMsg =
      `Failed to download ${failures.length} asset(s):\n` +
      failures
        .map((f) => `  - ${f.filename}: ${f.error} (${f.url})`)
        .join("\n");
    exitWithError(errorMsg);
  }

  console.log(`Copied ${successCount} assets`);
  return successCount;
}

function updateBundleUrls(timestamp, baseUrl) {
  const updateForPlatform = (platform) => {
    const bundlePath = path.join(
      projectRoot,
      "static-build",
      timestamp,
      "_expo",
      "static",
      "js",
      platform,
      "bundle.js",
    );
    let bundle = fs.readFileSync(bundlePath, "utf-8");

    bundle = bundle.replace(
      /httpServerLocation:"(\/[^"]+)"/g,
      (_match, capturedPath) => {
        const tempUrl = new URL(`http://localhost:8081${capturedPath}`);
        const unstablePath = tempUrl.searchParams.get("unstable_path");

        if (!unstablePath) {
          throw new Error(
            `Asset missing unstable_path in bundle: ${capturedPath}`,
          );
        }

        const decodedPath = decodeURIComponent(unstablePath);
        return `httpServerLocation:"${baseUrl}${basePath}/${timestamp}/_expo/static/js/${decodedPath}"`;
      },
    );

    fs.writeFileSync(bundlePath, bundle);
  };

  updateForPlatform("ios");
  updateForPlatform("android");
  console.log("Updated bundle URLs");
}

function updateManifests(manifests, timestamp, baseUrl, assetsByHash) {
  const updateForPlatform = (platform, manifest) => {
    if (!manifest.launchAsset || !manifest.extra) {
      exitWithError(`Malformed manifest for ${platform}`);
    }

    manifest.launchAsset.url = `${baseUrl}${basePath}/${timestamp}/_expo/static/js/${platform}/bundle.js`;
    manifest.launchAsset.key = `bundle-${timestamp}`;
    manifest.createdAt = new Date(
      Number(timestamp.split("-")[0]),
    ).toISOString();
    manifest.extra.expoClient.hostUri =
      baseUrl.replace("https://", "") + "/" + platform;
    manifest.extra.expoGo.debuggerHost =
      baseUrl.replace("https://", "") + "/" + platform;
    manifest.extra.expoGo.packagerOpts.dev = false;

    if (manifest.assets && manifest.assets.length > 0) {
      manifest.assets.forEach((asset) => {
        if (!asset.url) return;

        const hash = asset.hash;
        if (!hash) return;

        const assetInfo = assetsByHash.get(hash);
        if (!assetInfo) return;

        asset.url = `${baseUrl}${basePath}/${timestamp}/_expo/static/js/${assetInfo.relativePath}/${assetInfo.filename}`;
      });
    }

    fs.writeFileSync(
      path.join(projectRoot, "static-build", platform, "manifest.json"),
      JSON.stringify(manifest, null, 2),
    );
  };

  updateForPlatform("ios", manifests.ios);
  updateForPlatform("android", manifests.android);
  console.log("Manifests updated");
}

async function main() {
  console.log("Building static Expo Go deployment...");

  setupSignalHandlers();

  const domain = getDeploymentDomain();
  const expoPublicReplId = getExpoPublicReplId();
  const baseUrl = `https://${domain}`;
  const timestamp = `${Date.now()}-${process.pid}`;

  prepareDirectories(timestamp);
  clearMetroCache();

  await startMetro(domain, expoPublicReplId);

  const downloadTimeout = 600000;
  const downloadPromise = downloadBundlesAndManifests(timestamp);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `Overall download timeout after ${downloadTimeout / 1000} seconds. ` +
            "Metro may be struggling to generate bundles. Check Metro logs above.",
        ),
      );
    }, downloadTimeout);
  });

  const manifests = await Promise.race([downloadPromise, timeoutPromise]);

  console.log("Processing assets...");
  const assets = extractAssets(timestamp);
  console.log("Found", assets.length, "unique asset(s)");

  const assetsByHash = new Map();
  for (const asset of assets) {
    assetsByHash.set(asset.hash, {
      relativePath: asset.relativePath,
      filename: asset.filename,
    });
  }

  const assetCount = await downloadAssets(assets, timestamp);

  if (assetCount > 0) {
    updateBundleUrls(timestamp, baseUrl);
  }

  console.log("Updating manifests and creating landing page...");
  updateManifests(manifests, timestamp, baseUrl, assetsByHash);

  // Web PWA export: produce a static web bundle and add a service worker
  // + web app manifest so the handbook can be installed to the home screen
  // and opened with no network.
  const webBasePath = basePath || "";
  const { webOutputDir, exportBaseUrl } = await buildWebExport(webBasePath);
  copyHandbookIcon(webOutputDir);
  writeManifest(webOutputDir, exportBaseUrl);
  writeServiceWorker(webOutputDir, exportBaseUrl, timestamp);
  patchIndexHtml(webOutputDir, exportBaseUrl);

  console.log("Build complete! Deploy to:", baseUrl);
  console.log(`PWA root: ${baseUrl}${exportBaseUrl}/`);

  if (metroProcess) {
    metroProcess.kill();
  }
  process.exit(0);
}

main().catch((error) => {
  console.error("Build failed:", error.message);
  if (metroProcess) {
    metroProcess.kill();
  }
  process.exit(1);
});
