import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use("/api", router);

// Serve print-marketing SPA so Puppeteer can reach it at localhost:{PORT}/print-marketing/
// In dev, PRINT_MARKETING_URL points at the Vite server so this is a no-op there.
const printMarketingDist = path.resolve(process.cwd(), "artifacts/print-marketing/dist/public");
if (fs.existsSync(printMarketingDist)) {
  app.use("/print-marketing", express.static(printMarketingDist));
  app.get("/print-marketing/*", (_req, res) => {
    res.sendFile(path.join(printMarketingDist, "index.html"));
  });
}

export default app;
