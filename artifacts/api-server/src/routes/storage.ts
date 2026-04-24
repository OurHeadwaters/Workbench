import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { ObjectPermission } from "../lib/objectAcl";
import { db, libraryEntriesTable, shareLinksTable } from "@workspace/db";
import { or, eq } from "drizzle-orm";
import { isOwnerRequest } from "../lib/ownerAuth";

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
 * GET /storage/objects/*
 *
 * Serve object entities from PRIVATE_OBJECT_DIR.
 * These are served from a separate path from /public-objects and can optionally
 * be protected with authentication or ACL checks based on the use case.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;

    // Gate: only serve files actually referenced by a library entry
    // (either as the file storageRef or as a web-source screenshot).
    // This prevents arbitrary enumeration of the private bucket.
    const refMatch = `gcs:${objectPath}`;
    const referenced = await db
      .select({ id: libraryEntriesTable.id })
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
