/**
 * Standalone production server for the Codetry Practitioner's Handbook.
 *
 * Serves three surfaces from a single port:
 *  1. The web PWA at `/` — installable to the home screen, fully offline once
 *     the service worker has cached the bundle.
 *  2. The Expo Go install page at `/install` (and the `/manifest` route with
 *     the right `expo-platform` header) — used when a practitioner wants to
 *     open the handbook through Expo Go on their phone.
 *  3. Static assets for either surface.
 *
 * Zero external dependencies — uses only Node.js built-ins.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const STATIC_ROOT = path.resolve(__dirname, "..", "static-build");
const TEMPLATE_PATH = path.resolve(__dirname, "templates", "landing-page.html");
const WEB_ROOT = path.join(STATIC_ROOT, "web");
const basePath = (process.env.BASE_PATH || "/").replace(/\/+$/, "");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
};

function getAppName() {
  try {
    const cfg = require(path.resolve(__dirname, "..", "app.config.js"));
    return cfg.expo?.name || "Codetry Practitioner's Handbook";
  } catch {
    return "Codetry Practitioner's Handbook";
  }
}

function safeJoin(root, urlPath) {
  const safe = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(root, safe);
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

function serveManifest(platform, res) {
  const manifestPath = path.join(STATIC_ROOT, platform, "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ error: `Manifest not found for platform: ${platform}` }),
    );
    return;
  }

  const manifest = fs.readFileSync(manifestPath, "utf-8");
  res.writeHead(200, {
    "content-type": "application/json",
    "expo-protocol-version": "1",
    "expo-sfv-version": "0",
  });
  res.end(manifest);
}

function serveLandingPage(req, res, landingPageTemplate, appName) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"];
  const baseUrl = `${protocol}://${host}`;
  const expsUrl = `${host}`;

  const html = landingPageTemplate
    .replace(/BASE_URL_PLACEHOLDER/g, baseUrl)
    .replace(/EXPS_URL_PLACEHOLDER/g, expsUrl)
    .replace(/APP_NAME_PLACEHOLDER/g, appName);

  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
}

function writeFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const headers = { "content-type": contentType };

  // Service workers must not be cached — the browser refreshes them based on
  // the byte stream. The HTML entry point should also be revalidated so a
  // redeploy reaches the user; immutable hashed assets can be cached hard.
  if (filePath.endsWith("sw.js") || filePath.endsWith("manifest.webmanifest")) {
    headers["cache-control"] = "no-cache";
  } else if (filePath.endsWith(".html")) {
    headers["cache-control"] = "no-cache";
  } else if (
    filePath.includes(`${path.sep}_expo${path.sep}`) ||
    filePath.includes(`${path.sep}assets${path.sep}__`)
  ) {
    headers["cache-control"] = "public, max-age=31536000, immutable";
  }

  // Service workers can only register at or below their script path; allow
  // the SW to control the whole artifact scope.
  if (filePath.endsWith("sw.js")) {
    headers["service-worker-allowed"] = "/";
  }

  const content = fs.readFileSync(filePath);
  res.writeHead(200, headers);
  res.end(content);
}

function serveStatic404(res) {
  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("Not Found");
}

function tryServeWebFile(pathname, res) {
  // Try the requested path inside the web build first.
  const direct = safeJoin(WEB_ROOT, pathname);
  if (direct && fs.existsSync(direct) && !fs.statSync(direct).isDirectory()) {
    writeFile(direct, res);
    return true;
  }
  return false;
}

function serveWebShell(res) {
  const indexPath = path.join(WEB_ROOT, "index.html");
  if (!fs.existsSync(indexPath)) {
    res.writeHead(503, { "content-type": "text/plain; charset=utf-8" });
    res.end(
      "Web build not found. Run `pnpm --filter @workspace/codetry-handbook run build` first.",
    );
    return;
  }
  writeFile(indexPath, res);
}

const landingPageTemplate = fs.readFileSync(TEMPLATE_PATH, "utf-8");
const appName = getAppName();

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  let pathname = url.pathname;

  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || "/";
  }

  // Expo Go manifest endpoint — only if the client identifies as a native
  // platform via the `expo-platform` header.
  if (pathname === "/" || pathname === "/manifest") {
    const platform = req.headers["expo-platform"];
    if (platform === "ios" || platform === "android") {
      return serveManifest(platform, res);
    }
  }

  // Expo Go install / QR landing page is now on a dedicated route so the
  // root URL can serve the installable PWA.
  if (
    pathname === "/install" ||
    pathname === "/install/" ||
    pathname === "/install.html"
  ) {
    return serveLandingPage(req, res, landingPageTemplate, appName);
  }

  // Web PWA: serve the static export. Files first, then SPA fallback to
  // index.html for client-side routes.
  if (fs.existsSync(WEB_ROOT)) {
    if (pathname === "/" || pathname === "") {
      return serveWebShell(res);
    }
    if (tryServeWebFile(pathname, res)) return;

    // SPA fallback for navigation requests (no file extension).
    const accept = req.headers["accept"] || "";
    const looksLikeNavigation =
      accept.includes("text/html") && !path.extname(pathname);
    if (looksLikeNavigation) {
      return serveWebShell(res);
    }
  }

  // Otherwise fall through to other static-build subpaths (Expo Go bundles,
  // platform manifests, etc.).
  const fallbackPath = safeJoin(STATIC_ROOT, pathname);
  if (fallbackPath && fs.existsSync(fallbackPath) && !fs.statSync(fallbackPath).isDirectory()) {
    writeFile(fallbackPath, res);
    return;
  }

  serveStatic404(res);
});

const port = parseInt(process.env.PORT || "3000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`Serving Codetry handbook on port ${port}`);
  console.log(`  PWA:           ${basePath || ""}/`);
  console.log(`  Expo Go page:  ${basePath || ""}/install`);
});
