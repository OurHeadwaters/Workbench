import express, { type Express, type Request } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import router from "./routes";
import stripeWebhookRouter from "./routes/stripeWebhook";
import { logger } from "./lib/logger";
import { scheduleNightlyBriefing } from "./lib/riverSmithScheduler";
import { scheduleWeeklyArchive } from "./lib/taskAutopilotScheduler";
import { scheduleKitTokensCleanup } from "./lib/kitTokensCleanup";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

const app: Express = express();

// Trust exactly one proxy hop (Replit's edge proxy) so req.ip is the real
// client IP. This is required for IP-based rate limiting to be reliable and
// not spoofable via a forged X-Forwarded-For header.
app.set("trust proxy", 1);

if (process.env.NODE_ENV === "production" && !process.env.NURSERY_COOKIE_SECRET) {
  throw new Error("NURSERY_COOKIE_SECRET must be set in production");
}
const NURSERY_COOKIE_SECRET =
  process.env.NURSERY_COOKIE_SECRET ?? "nursery-local-dev-secret";

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
app.use(cookieParser(NURSERY_COOKIE_SECRET));

// Stripe webhook must be registered BEFORE express.json() so the raw Buffer
// is available for stripe.webhooks.constructEvent signature verification.
// The route itself applies express.raw({ type: 'application/json' }).
app.use("/api/stripe", stripeWebhookRouter);

app.use(
  express.json({
    verify: (_req: Request, _res, buf) => {
      (_req as Request).rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use("/api", router);

// Serve print-marketing SPA so Puppeteer can reach it at localhost:{PORT}/print-marketing/
// In dev, PRINT_MARKETING_URL points at the Vite server so this is a no-op there.
const printMarketingDist = path.resolve(process.cwd(), "artifacts/print-marketing/dist/public");
if (fs.existsSync(printMarketingDist)) {
  app.use("/print-marketing", express.static(printMarketingDist));
  app.get("/print-marketing/*path", (_req, res) => {
    res.sendFile(path.join(printMarketingDist, "index.html"));
  });
}

// Serve sandbox SPA at /sandbox/ — invite-only village board
// Built with: pnpm --filter @workspace/sandbox run build
// Use import.meta.url so the path resolves correctly regardless of CWD.
const sandboxDist = new URL("../../sandbox/dist/public", import.meta.url).pathname;
if (fs.existsSync(sandboxDist)) {
  app.use("/sandbox", express.static(sandboxDist));
  app.get("/sandbox/*path", (_req, res) => {
    res.sendFile(path.join(sandboxDist, "index.html"));
  });
}


// Serve field-guide-finance SPA at /field-guide-finance/
const fieldGuideFinanceDist = new URL("../../field-guide-finance/dist/public", import.meta.url).pathname;
if (fs.existsSync(fieldGuideFinanceDist)) {
  app.use("/field-guide-finance", express.static(fieldGuideFinanceDist));
  app.get("/field-guide-finance/*path", (_req, res) => {
    res.sendFile(path.join(fieldGuideFinanceDist, "index.html"));
  });
}

// Serve the media manager UI at /media/ (internal workspace tool)
// Use import.meta.url so the path works regardless of CWD in dev or prod.
const mediaManagerHtml = new URL("../src/media-manager.html", import.meta.url).pathname;
app.get(["/media", "/media/"], (_req, res) => res.sendFile(mediaManagerHtml));

// Serve codetry-ship SPA at / (root) — must be LAST so it doesn't shadow
// any of the above /api, /print-marketing, /sandbox, /field-guide-finance, or /media routes.
const codetryShipDist = path.resolve(process.cwd(), "artifacts/codetry-ship/dist/public");
if (fs.existsSync(codetryShipDist)) {
  app.use("/", express.static(codetryShipDist));
  app.get("/*path", (_req, res) => {
    res.sendFile(path.join(codetryShipDist, "index.html"));
  });
}

scheduleNightlyBriefing();
scheduleWeeklyArchive();
scheduleKitTokensCleanup();

export default app;
