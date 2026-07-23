/* eslint-disable no-restricted-globals */
// Pioneer Path service worker. Cache-first for narration MP3s (with
// Range-request support so partial-content audio fetches still get
// served from cache), network-first with cache fallback for shell
// assets. Scoped to the artifact's BASE_URL so it cohabits with the
// rest of the handbook.

const CACHE_NAME = "headwaters-pioneer-path-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("headwaters-pioneer-path-") && k !== CACHE_NAME)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isPathAsset(url) {
  if (url.origin !== self.location.origin) return false;
  return url.pathname.startsWith(new URL("./", self.location.href).pathname);
}

function isNarration(url) {
  return /\/narration\/.+\.mp3$/.test(url.pathname);
}

function isShellAsset(url) {
  if (url.pathname === "" || url.pathname.endsWith("/")) return true;
  return /\.(html|js|css|woff2?|svg)$/.test(url.pathname);
}

function parseRange(rangeHeader, totalBytes) {
  const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader || "");
  if (!m) return null;
  const startStr = m[1];
  const endStr = m[2];
  let start;
  let end;
  if (startStr === "" && endStr !== "") {
    const suffix = parseInt(endStr, 10);
    if (Number.isNaN(suffix) || suffix <= 0) return null;
    start = Math.max(0, totalBytes - suffix);
    end = totalBytes - 1;
  } else {
    start = parseInt(startStr, 10);
    end = endStr === "" ? totalBytes - 1 : parseInt(endStr, 10);
    if (Number.isNaN(start) || Number.isNaN(end)) return null;
  }
  if (start < 0 || end >= totalBytes || start > end) return null;
  return { start, end };
}

async function buildRangeResponse(fullResponse, rangeHeader) {
  const buffer = await fullResponse.clone().arrayBuffer();
  const total = buffer.byteLength;
  const range = parseRange(rangeHeader, total);
  if (!range) {
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          fullResponse.headers.get("Content-Type") || "audio/mpeg",
        "Content-Length": String(total),
        "Accept-Ranges": "bytes",
      },
    });
  }
  const slice = buffer.slice(range.start, range.end + 1);
  return new Response(slice, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type":
        fullResponse.headers.get("Content-Type") || "audio/mpeg",
      "Content-Length": String(slice.byteLength),
      "Content-Range": `bytes ${range.start}-${range.end}/${total}`,
      "Accept-Ranges": "bytes",
    },
  });
}

async function handleNarration(req) {
  const cache = await caches.open(CACHE_NAME);
  const range = req.headers.get("Range");
  const cached = await cache.match(req.url, { ignoreVary: true });
  if (cached) {
    if (range) return buildRangeResponse(cached, range);
    return cached;
  }
  try {
    // Fetch the full file (no Range header) so we can cache the entire
    // body. Audio elements often issue 206 partial responses; those
    // are not cacheable as a whole, so we issue our own 200 fetch.
    const full = await fetch(req.url, { credentials: "same-origin" });
    if (full && full.status === 200) {
      cache.put(req.url, full.clone()).catch(() => {});
      if (range) return buildRangeResponse(full, range);
      return full;
    }
    return await fetch(req);
  } catch (err) {
    return new Response("", { status: 504, statusText: "offline" });
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (!isPathAsset(url)) return;

  if (isNarration(url)) {
    event.respondWith(handleNarration(req));
    return;
  }

  if (isShellAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const res = await fetch(req);
          if (res && res.status === 200) {
            cache.put(req, res.clone()).catch(() => {});
          }
          return res;
        } catch (err) {
          const hit = await cache.match(req, { ignoreVary: true });
          if (hit) return hit;
          const indexUrl = new URL("./path/", self.location.href);
          const index = await cache.match(indexUrl, { ignoreVary: true });
          if (index) return index;
          return new Response("Offline", {
            status: 503,
            statusText: "offline",
          });
        }
      })(),
    );
  }
});
