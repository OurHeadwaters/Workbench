import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import { createHmac, timingSafeEqual } from "crypto";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { ObjectPermission } from "../lib/objectAcl";
import { db, libraryEntriesTable, shareLinksTable } from "@workspace/db";
import { or, eq } from "drizzle-orm";
import { isOwnerRequest, OWNER_TOKEN } from "../lib/ownerAuth";

// ----------------------- upload authorization -----------------------
//
// /storage/uploads/request-url is the entry point for putting bytes into
// object storage.  We restrict it to either:
//   1. The library owner (LIBRARY_OWNER_TOKEN, sent as Authorization: Bearer
//      or x-library-owner-token).
//   2. A non-revoked, non-expired share link (its random token sent as
//      x-share-token).  Share contributors need this to upload through
//      tokenized links.
//
// Without this guard, anyone could mint signed upload URLs and write
// arbitrary objects to our bucket.

async function shareTokenIsValid(token: string): Promise<boolean> {
  if (!token) return false;
  const rows = await db
    .select()
    .from(shareLinksTable)
    .where(eq(shareLinksTable.token, token))
    .limit(1);
  if (!rows.length) return false;
  const link = rows[0]!;
  if (link.revokedAt) return false;
  if (link.expiresAt && link.expiresAt.getTime() <= Date.now()) return false;
  return true;
}

async function requireUploadAuth(
  req: Request,
  res: Response,
  next: () => void,
): Promise<void> {
  if (isOwnerRequest(req)) {
    next();
    return;
  }
  const shareToken = req.header("x-share-token")?.trim();
  if (shareToken && (await shareTokenIsValid(shareToken))) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
}

// ----------------------- signed download tokens -----------------------
//
// Short-lived HMAC-signed tokens allow the curator's browser to load
// private objects via plain <img src> / <iframe src> without leaking the
// long-lived LIBRARY_OWNER_TOKEN into src URLs.
//
// Token format (base64url-encoded JSON):
//   { p: objectPath, e: unix-seconds expiry, s: hex HMAC-SHA256 }
//
// LIBRARY_OWNER_TOKEN is used as the HMAC secret so tokens can't be
// forged without the server secret.

const SIGNED_URL_TTL_SECONDS = 300; // 5 minutes

function signDownloadToken(objectPath: string, expiresAt: number): string {
  const secret = OWNER_TOKEN ?? "no-secret-configured";
  const payload = `${objectPath}\n${expiresAt}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(
    JSON.stringify({ p: objectPath, e: expiresAt, s: sig }),
  ).toString("base64url");
}

function verifyDownloadToken(token: string): string | null {
  try {
    const decoded = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8"),
    );
    const { p, e, s } = decoded;
    if (typeof p !== "string" || typeof e !== "number" || typeof s !== "string")
      return null;
    if (Math.floor(Date.now() / 1000) > e) return null;
    const secret = OWNER_TOKEN ?? "no-secret-configured";
    const payload = `${p}\n${e}`;
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const aBuf = Buffer.from(expected, "hex");
    const bBuf = Buffer.from(s, "hex");
    if (aBuf.length !== bBuf.length) return null;
    if (!timingSafeEqual(aBuf, bBuf)) return null;
    return p;
  } catch {
    return null;
  }
}

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

/**
 * POST /storage/uploads/request-url
 *
 * Request a presigned URL for file upload.
 * The client sends JSON metadata (name, size, contentType) — NOT the file.
 * Then uploads the file directly to the returned presigned URL.
 */
router.post("/storage/uploads/request-url", requireUploadAuth, async (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;

    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

    res.json(
      RequestUploadUrlResponse.parse({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType },
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/**
 * GET /storage/public-objects/*
 *
 * Serve public assets from PUBLIC_OBJECT_SEARCH_PATHS.
 * These are unconditionally public — no authentication or ACL checks.
 * IMPORTANT: Always provide this endpoint when object storage is set up.
 */
router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;

    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const response = await objectStorageService.downloadObject(file);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

/**
 * GET /storage/signed-url?path=/objects/xxx
 *
 * Mint a short-lived signed download URL for a private object.
 * Requires owner auth (Authorization: Bearer / x-library-owner-token)
 * OR a valid share-link token (x-share-token) so that contributors
 * can also view files they uploaded.
 *
 * Returns: { signedUrl: string, expiresAt: number (unix seconds) }
 */
router.get("/storage/signed-url", async (req: Request, res: Response) => {
  let authorized = isOwnerRequest(req);
  if (!authorized) {
    const shareToken = req.header("x-share-token")?.trim();
    if (shareToken) {
      authorized = await shareTokenIsValid(shareToken);
    }
  }
  if (!authorized) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { path } = req.query;
  if (typeof path !== "string" || !path.startsWith("/objects/")) {
    res.status(400).json({ error: "Invalid path — must start with /objects/" });
    return;
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SIGNED_URL_TTL_SECONDS;
  const dt = signDownloadToken(path, expiresAt);
  const wildcardPart = path.slice("/objects/".length);
  const signedUrl = `/api/storage/objects/${wildcardPart}?dt=${dt}`;
  res.json({ signedUrl, expiresAt });
});

/**
 * GET /storage/objects/*
 *
 * Serve object entities from PRIVATE_OBJECT_DIR.
 *
 * Access requires one of:
 *   1. Owner token in Authorization: Bearer / x-library-owner-token header.
 *   2. Valid (non-revoked, non-expired) share-link token in x-share-token header.
 *   3. A short-lived signed download token in the ?dt= query parameter,
 *      minted by GET /storage/signed-url.  This lets the curator's browser
 *      load files via plain <img src> / <iframe src>.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;

    // ---- Auth check ----
    let authorized = isOwnerRequest(req);

    if (!authorized) {
      const shareToken = req.header("x-share-token")?.trim();
      if (shareToken) {
        authorized = await shareTokenIsValid(shareToken);
      }
    }

    if (!authorized) {
      const dt = req.query.dt;
      if (typeof dt === "string") {
        const tokenPath = verifyDownloadToken(dt);
        authorized = tokenPath === objectPath;
      }
    }

    if (!authorized) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Gate: only serve files actually referenced by a library entry
    // (either as the file storageRef or as a web-source screenshot).
    // This prevents arbitrary enumeration of the private bucket.
    // Access lockdown: refuse to serve any file belonging to a
    // confidential_queue entry — those must never be reachable via
    // a public or share-link URL until the founder clears them.
    const refMatch = `gcs:${objectPath}`;
    const referenced = await db
      .select({ id: libraryEntriesTable.id, status: libraryEntriesTable.status })
      .from(libraryEntriesTable)
      .where(
        or(
          eq(libraryEntriesTable.storageRef, refMatch),
          eq(libraryEntriesTable.storageRef, objectPath),
          eq(libraryEntriesTable.screenshotObjectPath, objectPath),
        ),
      )
      .limit(1);
    if (referenced.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    if (referenced[0]!.status === "confidential_queue") {
      res.status(403).json({ error: "This file is in the confidential queue and cannot be served publicly." });
      return;
    }

    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);

    const response = await objectStorageService.downloadObject(objectFile);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
