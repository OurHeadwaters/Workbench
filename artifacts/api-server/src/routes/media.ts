import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import { z } from "zod";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { db, mediaAssetsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

// Only accept object paths that were issued by this server's upload-url endpoint.
// They always live under /objects/uploads/
const MEDIA_OBJECT_PREFIX = "/objects/uploads/";

const RegisterMediaBody = z.object({
  filename: z.string().min(1).max(512),
  objectPath: z
    .string()
    .min(1)
    .refine((p) => p.startsWith(MEDIA_OBJECT_PREFIX), {
      message: `objectPath must start with ${MEDIA_OBJECT_PREFIX}`,
    }),
  contentType: z.string().default("image/jpeg"),
  sizeBytes: z.number().int().positive().optional(),
});

/**
 * GET /media/list
 * Returns all stored media assets ordered by most recently uploaded.
 * Each asset includes a stable `url` field that can be pasted into other artifacts.
 */
router.get("/media/list", async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(mediaAssetsTable)
      .orderBy(desc(mediaAssetsTable.uploadedAt));

    // Build absolute URLs so API consumers don't need to reconstruct them client-side.
    const origin = `${req.protocol}://${req.get("host")}`;
    const assets = rows.map((a) => {
      const rest = a.objectPath.replace(/^\/objects\//, "");
      return { ...a, url: `${origin}/api/media/objects/${rest}` };
    });

    res.json({ assets });
  } catch (error) {
    req.log.error({ err: error }, "Error listing media assets");
    res.status(500).json({ error: "Failed to list media assets" });
  }
});

/**
 * POST /media/upload-url
 * Request a presigned URL for a media file upload.
 * This is intentionally unauthenticated — the media manager is a private,
 * workspace-only internal tool. The presigned URL only allows writing to
 * the single server-generated object path and expires in 15 minutes.
 */
router.post("/media/upload-url", async (req: Request, res: Response) => {
  const { name, size, contentType } = req.body as {
    name?: string;
    size?: number;
    contentType?: string;
  };

  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

    res.json({ uploadURL, objectPath, metadata: { name, size, contentType } });
  } catch (error) {
    req.log.error({ err: error }, "Error generating media upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/**
 * POST /media/register
 * Register a media asset in the DB after direct GCS upload.
 * objectPath is validated to the /objects/uploads/ namespace only.
 */
router.post("/media/register", async (req: Request, res: Response) => {
  const parsed = RegisterMediaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid fields", details: parsed.error.issues });
    return;
  }

  try {
    const { filename, objectPath, contentType, sizeBytes } = parsed.data;

    const [asset] = await db
      .insert(mediaAssetsTable)
      .values({ filename, objectPath, contentType, sizeBytes })
      .returning();

    res.status(201).json({ asset });
  } catch (error) {
    req.log.error({ err: error }, "Error registering media asset");
    res.status(500).json({ error: "Failed to register media asset" });
  }
});

/**
 * DELETE /media/:id
 * Delete a media asset from the DB and GCS.
 */
router.delete("/media/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id ?? "");

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(mediaAssetsTable)
      .where(eq(mediaAssetsTable.id, id))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ error: "Asset not found" });
      return;
    }

    const asset = rows[0]!;

    // Try to delete from GCS — best effort
    try {
      const file = await objectStorageService.getObjectEntityFile(asset.objectPath);
      await file.delete();
    } catch (gcsErr) {
      if (!(gcsErr instanceof ObjectNotFoundError)) {
        req.log.warn({ err: gcsErr }, "Could not delete GCS object — removing DB record anyway");
      }
    }

    await db.delete(mediaAssetsTable).where(eq(mediaAssetsTable.id, id));

    res.json({ ok: true });
  } catch (error) {
    req.log.error({ err: error }, "Error deleting media asset");
    res.status(500).json({ error: "Failed to delete media asset" });
  }
});

/**
 * GET /media/objects/*path
 *
 * Serve stored media files. Gate: only serve object paths that are
 * registered in the media_assets table. This prevents enumeration
 * of other private bucket objects via this route.
 */
router.get("/media/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : String(raw ?? "");
    const objectPath = `/objects/${wildcardPath}`;

    // Gate: only serve paths registered in media_assets
    const referenced = await db
      .select({ id: mediaAssetsTable.id })
      .from(mediaAssetsTable)
      .where(eq(mediaAssetsTable.objectPath, objectPath))
      .limit(1);

    if (referenced.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(objectFile, 86400);

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
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving media object");
    res.status(500).json({ error: "Failed to serve media object" });
  }
});

export default router;
