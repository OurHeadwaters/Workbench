import { Router, type IRouter } from "express";
import puppeteer from "puppeteer-core";
import { execSync } from "child_process";
import { generatePosterServicesHtml } from "../lib/posterServicesHtml";
import { generateCapabilityStatementHtml } from "../lib/capabilityStatementHtml";

const router: IRouter = Router();

let capabilityStatementCache: Buffer | null = null;

function getChromiumPath(): string {
  try {
    const path = execSync("which chromium || which chromium-browser || which google-chrome", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim().split("\n")[0];
    if (path) return path;
  } catch {
    // fallthrough to known paths
  }
  const candidates = [
    "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
  ];
  for (const c of candidates) {
    try {
      execSync(`test -x "${c}"`, { stdio: "pipe" });
      return c;
    } catch {
      // next
    }
  }
  throw new Error("No Chromium executable found");
}

router.get("/services-poster.pdf", async (_req, res) => {
  let browser;
  try {
    const chromiumPath = getChromiumPath();
    browser = await puppeteer.launch({
      executablePath: chromiumPath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();

    const html = generatePosterServicesHtml();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for fonts
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="headwaters-poster-services.pdf"',
      "Content-Length": pdfBuffer.length,
      "Cache-Control": "no-cache",
    });
    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ error: "PDF generation failed" });
  } finally {
    if (browser) await browser.close();
  }
});

router.get("/capability-statement.pdf", async (_req, res) => {
  if (capabilityStatementCache) {
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="headwaters-capability-statement.pdf"',
      "Content-Length": capabilityStatementCache.length,
      "Cache-Control": "no-cache",
    });
    res.send(capabilityStatementCache);
    return;
  }

  let browser;
  try {
    const chromiumPath = getChromiumPath();
    browser = await puppeteer.launch({
      executablePath: chromiumPath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();

    const html = generateCapabilityStatementHtml();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    capabilityStatementCache = Buffer.from(pdfBuffer);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="headwaters-capability-statement.pdf"',
      "Content-Length": capabilityStatementCache.length,
      "Cache-Control": "no-cache",
    });
    res.send(capabilityStatementCache);
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ error: "PDF generation failed" });
  } finally {
    if (browser) await browser.close();
  }
});

export default router;
