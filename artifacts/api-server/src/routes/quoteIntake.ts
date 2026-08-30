import { Router, type IRouter, type Request } from "express";
import { db, quoteRequestsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { execFileSync } from "child_process";
import { checkRateLimit } from "../lib/rateLimit";
import {
  classifyQuote,
  calculateTaxCents,
  createQuoteNumber,
  quoteHtml,
  quotePlainText,
  quoteValidUntil,
  signQuoteId,
  verifyQuoteSignature,
} from "../lib/headwatersQuote";
import { sendQuoteEmail } from "../lib/quoteMailer";

const router: IRouter = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORGANIZATION_TYPES = new Set([
  "co-op/not-for-profit",
  "community organization",
  "commercial/institutional",
  "other",
]);
const OFFERS = new Set([
  "initial implementation",
  "additional standard tool",
  "annual support",
  "needs custom review",
]);

function readString(
  body: Record<string, unknown>,
  key: string,
  maxLength: number,
  required = true,
): string | null {
  const value = body[key];
  if (typeof value !== "string") return required ? null : "";
  const clean = value.trim();
  if (!clean) return required ? null : "";
  return clean.slice(0, maxLength);
}

function clientIp(req: Request): string {
  const forwarded = req.header("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function chromiumPath(): string {
  return execFileSync("sh", [
    "-c",
    "command -v chromium || command -v chromium-browser || command -v google-chrome",
  ], { encoding: "utf8" }).trim().split("\n")[0]!;
}

router.post("/quote-intake", async (req, res) => {
  const ip = clientIp(req);
  const rate = await checkRateLimit(`quote-intake:${ip}`, {
    windowMs: 60 * 60 * 1000,
    max: 4,
  });
  if (!rate.ok) {
    res.status(429).json({
      error: "Too many quote requests. Please wait before submitting again.",
      retryAfterSec: rate.retryAfterSec,
    });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  if (readString(body, "website", 1, false)) {
    res.status(201).json({
      ok: true,
      mode: "custom",
      name: "there",
    });
    return;
  }

  const contactName = readString(body, "contactName", 200);
  const email = readString(body, "email", 200);
  const role = readString(body, "role", 200, false);
  const legalOrganizationName = readString(body, "legalOrganizationName", 300);
  const organizationType = readString(body, "organizationType", 80);
  const organizationAddress = readString(body, "organizationAddress", 600);
  const projectTitle = readString(body, "projectTitle", 300);
  const fundingProgram = readString(body, "fundingProgram", 300);
  const desiredTiming = readString(body, "desiredTiming", 200);
  const selectedOffer = readString(body, "selectedOffer", 100);
  const projectDescription = readString(body, "projectDescription", 4000);
  const desiredOutcome = readString(body, "desiredOutcome", 3000);
  const intendedUsers = readString(body, "intendedUsers", 1000, false);
  const approximateScale = readString(body, "approximateScale", 500, false);
  const currentSystems = readString(body, "currentSystems", 1500, false);
  const accessibilityConnectivityNeeds = readString(
    body,
    "accessibilityConnectivityNeeds",
    1500,
    false,
  );
  const integrationNeeded = readString(body, "integrationNeeded", 20, false) || "not sure";
  const sensitiveDataInvolved =
    readString(body, "sensitiveDataInvolved", 20, false) || "not sure";
  const specialRequirements = readString(body, "specialRequirements", 3000, false);

  if (
    !contactName ||
    !email ||
    !EMAIL_RE.test(email) ||
    !legalOrganizationName ||
    !organizationType ||
    !ORGANIZATION_TYPES.has(organizationType) ||
    !organizationAddress ||
    !projectTitle ||
    !fundingProgram ||
    !desiredTiming ||
    !selectedOffer ||
    !OFFERS.has(selectedOffer) ||
    !projectDescription ||
    !desiredOutcome ||
    !new Set(["yes", "no", "not sure"]).has(integrationNeeded) ||
    !new Set(["yes", "no", "not sure"]).has(sensitiveDataInvolved)
  ) {
    res.status(422).json({
      error: "Please complete the required organization and project details.",
    });
    return;
  }

  const classification = classifyQuote({
    organizationType,
    selectedOffer,
    specialRequirements,
    integrationNeeded,
    sensitiveDataInvolved,
  });
  const quoteNumber = createQuoteNumber();
  const validUntil =
    classification.mode === "standard" ? quoteValidUntil() : null;
  const subtotalCents = classification.subtotalCents;
  const taxCents = calculateTaxCents(subtotalCents);
  const totalCents =
    subtotalCents === null || taxCents === null ? null : subtotalCents + taxCents;

  const [row] = await db
    .insert(quoteRequestsTable)
    .values({
      quoteNumber,
      contactName,
      email,
      role: role || null,
      legalOrganizationName,
      organizationType,
      organizationAddress,
      projectTitle,
      fundingProgram,
      desiredTiming,
      selectedOffer,
      projectDescription,
      desiredOutcome,
      intendedUsers: intendedUsers || null,
      approximateScale: approximateScale || null,
      currentSystems: currentSystems || null,
      accessibilityConnectivityNeeds: accessibilityConnectivityNeeds || null,
      integrationNeeded,
      sensitiveDataInvolved,
      specialRequirements: specialRequirements || null,
      mode: classification.mode,
      subtotalCents,
      taxCents,
      totalCents,
      validUntil,
      sourceIp: ip,
      userAgent: req.header("user-agent")?.slice(0, 500) ?? null,
    })
    .returning();

  const signature = signQuoteId(row!.id);
  const relativePdfUrl = `/api/quote-intake/${row!.id}/quote.pdf?sig=${signature}`;
  const origin = `${req.protocol}://${req.get("host")}`;
  const absolutePdfUrl = `${origin}${relativePdfUrl}`;
  const customerBody = quotePlainText(row!, absolutePdfUrl);
  const operatorEmail =
    process.env.HEADWATERS_QUOTE_EMAIL ?? "bobbie@ourheadwaters.ca";

  const [customerDelivery, operatorDelivery] = await Promise.all([
    sendQuoteEmail({
      to: email,
      subject:
        classification.mode === "standard"
          ? `${quoteNumber} — Headwaters budgetary quote`
          : `${quoteNumber} — Headwaters received your custom request`,
      body: `Hi ${contactName},\n\n${customerBody}`,
      replyTo: operatorEmail,
    }),
    sendQuoteEmail({
      to: operatorEmail,
      subject: `${classification.mode === "standard" ? "Quote sent" : "Custom review required"}: ${legalOrganizationName} — ${quoteNumber}`,
      body: customerBody,
      replyTo: email,
    }),
  ]);

  await db
    .update(quoteRequestsTable)
    .set({
      customerDeliveryStatus: customerDelivery.status,
      customerDeliveryError: customerDelivery.error ?? null,
      operatorDeliveryStatus: operatorDelivery.status,
      operatorDeliveryError: operatorDelivery.error ?? null,
    })
    .where(eq(quoteRequestsTable.id, row!.id));

  res.status(201).json({
    ok: true,
    mode: classification.mode,
    quoteNumber,
    ...(classification.mode === "standard" ? { pdfUrl: relativePdfUrl } : {}),
    name: contactName,
  });
});

router.get("/quote-intake/:id/quote.pdf", async (req, res) => {
  const id = req.params.id;
  const signature = typeof req.query.sig === "string" ? req.query.sig : "";
  if (!signature || !verifyQuoteSignature(id, signature)) {
    res.status(403).json({ error: "This quote link is not valid." });
    return;
  }

  const [row] = await db
    .select()
    .from(quoteRequestsTable)
    .where(eq(quoteRequestsTable.id, id))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Quote not found." });
    return;
  }

  let browser: Awaited<
    ReturnType<(typeof import("puppeteer-core"))["default"]["launch"]>
  > | null = null;
  try {
    const puppeteer = (await import("puppeteer-core")).default;
    browser = await puppeteer.launch({
      executablePath: chromiumPath(),
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    const page = await browser.newPage();
    await page.setContent(quoteHtml(row), {
      waitUntil: "networkidle0",
      timeout: 30_000,
    });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${row.quoteNumber}.pdf"`,
      "Cache-Control": "private, no-store",
    });
    res.send(Buffer.from(pdf));
  } finally {
    await browser?.close();
  }
});

export default router;