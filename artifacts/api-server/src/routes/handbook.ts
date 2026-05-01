import { Router, type IRouter } from "express";
import { createReadStream, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source layout:  src/routes/handbook.ts → src/data/handbook/ (1 level up)
// Built layout:   dist/index.mjs        → src/data/handbook/ (../src/data/handbook)
// Detect which by checking whether the sibling "data" dir exists next to __dirname.
import { existsSync } from "fs";
const _srcSibling = join(__dirname, "../data/handbook");   // works when running from src/routes/
const _distSibling = join(__dirname, "../src/data/handbook"); // works when running from dist/
const DATA_DIR = existsSync(_srcSibling) ? _srcSibling : _distSibling;

const router: IRouter = Router();

function serveJson(filename: string) {
  return (_req: import("express").Request, res: import("express").Response) => {
    const filePath = join(DATA_DIR, filename);
    try {
      const stat = statSync(filePath);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Length", stat.size);
      res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
      createReadStream(filePath).pipe(res);
    } catch {
      res.status(404).json({ error: `${filename} not found — run export-content script` });
    }
  };
}

router.get("/chapters", serveJson("chapters.json"));
router.get("/pioneer-path", serveJson("pioneer-path.json"));
router.get("/standby", serveJson("standby.json"));
router.get("/founding-examples", serveJson("founding-examples.json"));

export default router;
