import crypto from "crypto";
import type { QuoteRequestRow } from "@workspace/db";

function configuredDays(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const HEADWATERS_SELLER = {
  legalName: process.env.HEADWATERS_SELLER_LEGAL_NAME ?? "1001047300 ONTARIO INC.",
  displayName:
    process.env.HEADWATERS_SELLER_DISPLAY ??
    "Headwaters, operated by 1001047300 ONTARIO INC.",
  operatingName: "Headwaters",
  practitionerName: process.env.HEADWATERS_PRACTITIONER_NAME ?? "Bobbie Parr",
  practitionerTitle: process.env.HEADWATERS_PRACTITIONER_TITLE ?? "Founder",
  mailingAddress:
    process.env.HEADWATERS_SELLER_ADDRESS ?? "Box 50 Wabigoon, ON P0V 2W0",
  email: process.env.HEADWATERS_QUOTE_EMAIL ?? "bobbie@ourheadwaters.ca",
  phone: process.env.HEADWATERS_SELLER_PHONE ?? "807 220 3654",
  hstRegistered: process.env.HEADWATERS_HST_REGISTERED === "true",
  hstNumber: process.env.HEADWATERS_HST_NUMBER ?? "",
};

export const HEADWATERS_QUOTE_TERMS = {
  validityDays: configuredDays(process.env.HEADWATERS_QUOTE_VALIDITY_DAYS, 60),
  payment:
    process.env.HEADWATERS_QUOTE_PAYMENT_TERMS ??
    "50% upfront and 50% on delivery",
  travel:
    process.env.HEADWATERS_QUOTE_TRAVEL_TERMS ??
    "Travel is reviewed case by case and separately confirmed where applicable.",
};

const STANDARD_PRICES: Record<string, Record<string, number>> = {
  "initial implementation": {
    "co-op/not-for-profit": 2_000_000,
    "community organization": 2_000_000,
    "commercial/institutional": 2_800_000,
  },
  "additional standard tool": {
    "co-op/not-for-profit": 800_000,
    "community organization": 800_000,
    "commercial/institutional": 1_200_000,
  },
};

export function classifyQuote(input: {
  organizationType: string;
  selectedOffer: string;
  specialRequirements: string | null;
  integrationNeeded?: string | null;
  sensitiveDataInvolved?: string | null;
}): { mode: "standard" | "custom"; subtotalCents: number | null } {
  const price = STANDARD_PRICES[input.selectedOffer]?.[input.organizationType];
  const hasSpecialRequirements = Boolean(input.specialRequirements?.trim());
  const expandedScope =
    input.integrationNeeded === "yes" ||
    input.integrationNeeded === "not sure" ||
    input.sensitiveDataInvolved === "yes" ||
    input.sensitiveDataInvolved === "not sure";
  if (!price || hasSpecialRequirements || expandedScope) {
    return { mode: "custom", subtotalCents: null };
  }
  return { mode: "standard", subtotalCents: price };
}

export function createQuoteNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `HW-${date}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export function quoteValidUntil(from = new Date()): Date {
  const value = new Date(from);
  value.setDate(value.getDate() + HEADWATERS_QUOTE_TERMS.validityDays);
  return value;
}

export function money(cents: number | null): string {
  if (cents === null) return "To be confirmed after review";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function calculateTaxCents(subtotalCents: number | null): number | null {
  if (subtotalCents === null) return null;
  return HEADWATERS_SELLER.hstRegistered
    ? Math.round(subtotalCents * 0.13)
    : 0;
}

function taxDescription(): string {
  if (!HEADWATERS_SELLER.hstRegistered) {
    return "HST not charged. The seller is not currently registered for HST.";
  }
  return `HST (13%)${HEADWATERS_SELLER.hstNumber ? ` — ${HEADWATERS_SELLER.hstNumber}` : ""}`;
}

export function signQuoteId(id: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is required for quote links");
  return crypto.createHmac("sha256", secret).update(id).digest("hex");
}

export function verifyQuoteSignature(id: string, signature: string): boolean {
  const expected = signQuoteId(id);
  const left = Buffer.from(expected, "hex");
  const right = Buffer.from(signature, "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function esc(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function date(value: Date | string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

export function quotePlainText(row: QuoteRequestRow, pdfUrl: string): string {
  const standard = row.mode === "standard";
  return [
    standard
      ? `Budgetary quote ${row.quoteNumber}`
      : `Custom quote request ${row.quoteNumber}`,
    "",
    `Prepared for: ${row.legalOrganizationName}`,
    `Contact: ${row.contactName}${row.role ? `, ${row.role}` : ""}`,
    `Project: ${row.projectTitle}`,
    `Funding program: ${row.fundingProgram}`,
    `Desired timing: ${row.desiredTiming}`,
    `Intended users: ${row.intendedUsers || "Not provided"}`,
    `Approximate scale: ${row.approximateScale || "Not provided"}`,
    `Current systems: ${row.currentSystems || "Not provided"}`,
    `Accessibility/connectivity: ${row.accessibilityConnectivityNeeds || "Not provided"}`,
    `Integration needed: ${row.integrationNeeded || "Not sure"}`,
    `Sensitive data involved: ${row.sensitiveDataInvolved || "Not sure"}`,
    "",
    `Requested offer: ${row.selectedOffer}`,
    `Organization type: ${row.organizationType}`,
    `Subtotal: ${money(row.subtotalCents)}`,
    `${taxDescription()}: ${money(row.taxCents)}`,
    `Total: ${money(row.totalCents)}`,
    `Payment: ${HEADWATERS_QUOTE_TERMS.payment}`,
    HEADWATERS_QUOTE_TERMS.travel,
    "",
    "Project description:",
    row.projectDescription,
    "",
    "Desired outcome:",
    row.desiredOutcome || "To be confirmed with the applicant.",
    "",
    row.specialRequirements
      ? `Special requirements:\n${row.specialRequirements}\n`
      : "",
    standard
      ? [
          "Standard scope:",
          "Organizational and vocabulary mapping; governance and language record; Field Guide Finance; one selected operational layer; agreed data/content intake; role-based training; launch acceptance; initial results framework; and a later-tool roadmap.",
          "",
          "Grant-ready project insert:",
          `Problem: ${row.projectDescription}`,
          `Objective: ${row.desiredOutcome || "Confirm a practical, locally operated improvement with the applicant."}`,
          "Activities: discovery and mapping; configuration; controlled content/data intake; operator training; acceptance; and handoff.",
          "Outputs: one bounded working system, governance and language record, trained operators, acceptance record, initial results framework, and roadmap.",
          `Indicative timeline: nine weeks, aligned where possible with ${row.desiredTiming}.`,
          `Base budget: ${money(row.subtotalCents)} CAD, exclusive of applicable taxes and separately scoped additions.`,
          `Expected capacity outcome: ${row.desiredOutcome || "Greater local continuity, clearer authority, and a maintainable operating method."}`,
          "Applicant review: verify every fact, funding-program requirement, eligibility statement, scope assumption, security requirement, and budget before using this draft.",
          "Headwaters does not determine fund eligibility, guarantee funding, or submit the application.",
          "",
          "Excluded unless separately quoted:",
          "Integrations, migrations, regulated workflows, sensitive-data expansion, legal/accounting advice, research, travel, and custom product work.",
          "",
          `Valid until: ${date(row.validUntil)}`,
          `Download the grant-ready quote: ${pdfUrl}`,
        ].join("\n")
      : "This request needs a human scope review. No price or external commitment has been generated.",
    "",
    HEADWATERS_SELLER.displayName,
    `${HEADWATERS_SELLER.practitionerName}, ${HEADWATERS_SELLER.practitionerTitle}`,
    HEADWATERS_SELLER.mailingAddress,
    `${HEADWATERS_SELLER.email} · ${HEADWATERS_SELLER.phone}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function quoteEmailHtml(row: QuoteRequestRow, pdfUrl: string, greetingName?: string | null): string {
  const standard = row.mode === "standard";
  const title = standard ? "Budgetary Quote" : "Custom Quote Request";

  const introStandard = `Thank you for requesting a budgetary quote. Based on your inputs, we've prepared a standard projection for <strong>${esc(row.projectTitle)}</strong> at <strong>${esc(row.legalOrganizationName)}</strong>.`;
  const introCustom = `Thank you for requesting a quote for <strong>${esc(row.projectTitle)}</strong> at <strong>${esc(row.legalOrganizationName)}</strong>. Because your project includes special requirements or scope that falls outside our standard bounds, it needs a human review to give you an accurate assessment.`;
  const nextStepsStandard = `A downloadable, grant-ready PDF is available below. Review the scope and budget details carefully to ensure they match your funding application.`;
  const nextStepsCustom = `We will review your request and follow up shortly with questions or a custom scope. No automatic commitment or price has been issued.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)} ${esc(row.quoteNumber)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4ede0; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #14231d;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4ede0; width: 100%;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #fffdf8; border-top: 6px solid #17392b; box-shadow: 0 4px 12px rgba(23, 57, 43, 0.08);">
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <h1 style="margin: 0 0 24px 0; font-family: Georgia, serif; font-size: 28px; color: #17392b; font-weight: bold;">
                ${standard ? 'Budgetary Quote' : 'Custom Request Received'}
              </h1>
              ${greetingName ? `<p style="margin: 0 0 16px 0; font-family: Arial, sans-serif; font-size: 16px; color: #17392b; line-height: 1.5;">Hi ${esc(greetingName)},</p>` : ''}
              <p style="margin: 0 0 16px 0; font-family: Arial, sans-serif; font-size: 16px; color: #2d4539; line-height: 1.6;">
                ${standard ? introStandard : introCustom}
              </p>
              <p style="margin: 0 0 32px 0; font-family: Arial, sans-serif; font-size: 16px; color: #2d4539; line-height: 1.6;">
                ${standard ? nextStepsStandard : nextStepsCustom}
              </p>

              ${standard ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 36px;">
                <tr>
                  <td align="center">
                    <a href="${esc(pdfUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #d4a017; color: #14231d; text-decoration: none; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; border-radius: 4px;">Download grant-ready quote</a>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Project Summary Section -->
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 20px; color: #17392b; border-bottom: 1px solid #d8ddd9; padding-bottom: 8px;">Request Summary</h2>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px; font-family: Arial, sans-serif; font-size: 14px; color: #2d4539; line-height: 1.5;">
                <tr>
                  <td width="35%" valign="top" style="padding: 10px 0; font-weight: bold; color: #526059;">Reference</td>
                  <td width="65%" valign="top" style="padding: 10px 0;">${esc(row.quoteNumber)}</td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Project</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">${esc(row.projectTitle)}</td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Organization</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">
                    ${esc(row.legalOrganizationName)}<br>
                    <span style="color: #68736d; font-size: 13px;">${esc(row.organizationType)}</span><br>
                    <span style="color: #68736d; font-size: 13px;">${esc(row.organizationAddress)}</span>
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Contact</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">
                    ${esc(row.contactName)}${row.role ? ` · <span style="color: #68736d; font-size: 13px;">${esc(row.role)}</span>` : ""}<br>
                    <a href="mailto:${esc(row.email)}" style="color: #68736d; font-size: 13px; text-decoration: none;">${esc(row.email)}</a>
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Funding Program</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">${esc(row.fundingProgram)}</td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Timeline</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">${esc(row.desiredTiming)}</td>
                </tr>
              </table>

              <!-- Scope Details -->
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 20px; color: #17392b; border-bottom: 1px solid #d8ddd9; padding-bottom: 8px;">Scope &amp; Needs</h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 14px; color: #2d4539; line-height: 1.5;">
                <tr>
                  <td width="35%" valign="top" style="padding: 10px 0; font-weight: bold; color: #526059;">Requested Offer</td>
                  <td width="65%" valign="top" style="padding: 10px 0;">${esc(row.selectedOffer)}</td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Intended Users</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">${esc(row.intendedUsers || "Not provided")}</td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Scale</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">${esc(row.approximateScale || "Not provided")}</td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Current Systems</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">${esc(row.currentSystems || "Not provided")}</td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Access Needs</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">${esc(row.accessibilityConnectivityNeeds || "Not provided")}</td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Integrations</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">${esc(row.integrationNeeded || "Not sure")}</td>
                </tr>
                <tr>
                  <td valign="top" style="padding: 10px 0; font-weight: bold; color: #526059; border-top: 1px solid #eef0ef;">Sensitive Data</td>
                  <td valign="top" style="padding: 10px 0; border-top: 1px solid #eef0ef;">${esc(row.sensitiveDataInvolved || "Not sure")}</td>
                </tr>
              </table>

              ${standard ? `
              <div style="margin-bottom: 32px; font-family: Arial, sans-serif; font-size: 14px; color: #2d4539; line-height: 1.6;">
                <p style="margin: 0 0 4px 0; font-weight: bold; color: #526059;">Standard Included Scope</p>
                <p style="margin: 0 0 16px 0;">Organizational and vocabulary mapping; governance and language record; Field Guide Finance; one selected operational layer; agreed data/content intake; role-based training; launch acceptance; an initial results framework; and a later-tool roadmap.</p>

                <p style="margin: 0 0 4px 0; font-weight: bold; color: #526059;">Assumptions and Exclusions</p>
                <p style="margin: 0;">The client names an authorized decision-maker, operator, payer route, and minimum necessary source information. Integrations, migrations, regulated workflows, sensitive-data expansion, legal/accounting advice, research, travel, and custom product work require a separate written scope.</p>
              </div>
              ` : '<div style="margin-bottom: 32px;"></div>'}

              <!-- Project Description & Outcome -->
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 20px; color: #17392b; border-bottom: 1px solid #d8ddd9; padding-bottom: 8px;">Project Details</h2>
              <div style="margin-bottom: 32px; font-family: Arial, sans-serif; font-size: 14px; color: #2d4539; line-height: 1.6;">
                <p style="margin: 0 0 4px 0; font-weight: bold; color: #526059;">Description</p>
                <p style="margin: 0 0 20px 0;">${esc(row.projectDescription).replace(/\n/g, '<br>')}</p>

                <p style="margin: 0 0 4px 0; font-weight: bold; color: #526059;">Desired Outcome</p>
                <p style="margin: 0 0 20px 0;">${esc(row.desiredOutcome || "To be confirmed with the applicant.")}</p>

                ${row.specialRequirements ? `
                <p style="margin: 0 0 4px 0; font-weight: bold; color: #526059;">Special Requirements</p>
                <p style="margin: 0 0 20px 0;">${esc(row.specialRequirements).replace(/\n/g, '<br>')}</p>
                ` : ''}
              </div>

              <!-- Commercial Summary -->
              ${standard ? `
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 20px; color: #17392b; border-bottom: 1px solid #d8ddd9; padding-bottom: 8px;">Commercial Summary</h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; font-family: Arial, sans-serif; font-size: 14px; color: #2d4539;">
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #526059; border-bottom: 1px solid #eef0ef;">Base budget</td>
                  <td align="right" style="padding: 10px 0; border-bottom: 1px solid #eef0ef;">${money(row.subtotalCents)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #526059; border-bottom: 1px solid #eef0ef;">${taxDescription()}</td>
                  <td align="right" style="padding: 10px 0; border-bottom: 1px solid #eef0ef;">${money(row.taxCents)}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 0; font-weight: bold; color: #17392b; font-size: 16px;">Total CAD</td>
                  <td align="right" style="padding: 14px 0; font-weight: bold; color: #17392b; font-size: 16px;">${money(row.totalCents)}</td>
                </tr>
              </table>

              <div style="background-color: #f3ead8; border-left: 4px solid #d4a017; padding: 16px 20px; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 13px; color: #526059; line-height: 1.5;">
                <p style="margin: 0 0 8px 0;"><strong>Payment Terms:</strong> ${esc(HEADWATERS_QUOTE_TERMS.payment)}</p>
                <p style="margin: 0 0 12px 0;"><strong>Travel:</strong> ${esc(HEADWATERS_QUOTE_TERMS.travel)}</p>
                <p style="margin: 0;">This is a non-binding budgetary quote valid until <strong>${date(row.validUntil)}</strong>. It is subject to eligibility, scope, and security review. Work begins only after both parties approve a written scope.</p>
              </div>
              ` : `
              <div style="background-color: #f3ead8; border-left: 4px solid #d4a017; padding: 16px 20px; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 13px; color: #526059; line-height: 1.5;">
                <p style="margin: 0;">This is a custom request under review. No automatic price or formal commitment has been generated. Headwaters will coordinate with you to confirm the best approach.</p>
              </div>
              `}

            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #17392b; color: #f4ede0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6;">
                <tr>
                  <td width="60%" valign="top">
                    <strong style="color: #fffdf8; font-family: Georgia, serif; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">${esc(HEADWATERS_SELLER.operatingName)}</strong><br>
                    <span style="color: #a8b8b0;">Build capacity that survives change.</span>
                  </td>
                  <td width="40%" valign="top" align="right" style="color: #a8b8b0;">
                    ${esc(HEADWATERS_SELLER.practitionerName)}, ${esc(HEADWATERS_SELLER.practitionerTitle)}<br>
                    ${esc(HEADWATERS_SELLER.mailingAddress)}<br>
                    <a href="mailto:${esc(HEADWATERS_SELLER.email)}" style="color: #d4a017; text-decoration: none;">${esc(HEADWATERS_SELLER.email)}</a><br>
                    ${esc(HEADWATERS_SELLER.phone)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function quoteHtml(row: QuoteRequestRow): string {
  const standard = row.mode === "standard";
  const title = standard ? "Budgetary Quote" : "Custom Quote Request";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${esc(title)} ${esc(row.quoteNumber)}</title>
  <style>
    @page { size: Letter; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #14231d; background: #f4ede0; font-family: Arial, sans-serif; }
    .page { width: 8.5in; min-height: 11in; padding: .55in .72in; background: #fffdf8; position: relative; }
    .page + .page { break-before: page; page-break-before: always; }
    .top { display:flex; justify-content:space-between; gap:30px; padding-bottom:18px; border-bottom:3px solid #17392b; }
    .brand { color:#17392b; font-family:Georgia,serif; font-size:28px; font-weight:bold; }
    .legal { margin-top:6px; font-size:10px; line-height:1.5; color:#526059; }
    h1 { margin:0; font: bold 24px Georgia,serif; color:#17392b; text-align:right; }
    .number { margin-top:7px; text-align:right; font-size:10px; letter-spacing:.08em; }
    .meta { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin:20px 0; }
    .label { color:#9a4d39; font-size:9px; text-transform:uppercase; letter-spacing:.12em; font-weight:bold; }
    .value { margin-top:5px; font-size:12px; line-height:1.5; white-space:pre-line; }
    h2 { margin:16px 0 6px; color:#17392b; font: bold 14px Georgia,serif; }
    p, li { font-size:10.5px; line-height:1.55; }
    .price { width:100%; margin-top:14px; border-collapse:collapse; }
    .price th, .price td { padding:10px 8px; border-bottom:1px solid #ccd2ce; text-align:left; font-size:10px; }
    .price th:last-child, .price td:last-child { text-align:right; }
    .total td { color:#17392b; font-size:13px; font-weight:bold; border-bottom:2px solid #17392b; }
    .notice { margin:14px 0; padding:10px 14px; background:#f3ead8; border-left:3px solid #d4a017; font-size:10px; line-height:1.5; }
    .footer { position:absolute; left:.72in; right:.72in; bottom:.45in; display:flex; justify-content:space-between; color:#68736d; font-size:8.5px; border-top:1px solid #d8ddd9; padding-top:9px; }
  </style>
</head>
<body>
<main class="page">
  <header class="top">
    <div>
      <div class="brand">${esc(HEADWATERS_SELLER.operatingName)}</div>
       <div class="legal">${esc(HEADWATERS_SELLER.displayName)}<br>${esc(HEADWATERS_SELLER.practitionerName)}, ${esc(HEADWATERS_SELLER.practitionerTitle)}<br>${esc(HEADWATERS_SELLER.mailingAddress)}<br>${esc(HEADWATERS_SELLER.email)} · ${esc(HEADWATERS_SELLER.phone)}</div>
    </div>
    <div><h1>${esc(title)}</h1><div class="number">${esc(row.quoteNumber)} · ${date(row.createdAt)}</div></div>
  </header>
  <section class="meta">
    <div><div class="label">Prepared for</div><div class="value">${esc(row.legalOrganizationName)}<br>${esc(row.organizationAddress)}<br>${esc(row.contactName)}${row.role ? ` · ${esc(row.role)}` : ""}<br>${esc(row.email)}</div></div>
    <div><div class="label">Project</div><div class="value">${esc(row.projectTitle)}<br>Funding program: ${esc(row.fundingProgram)}<br>Desired timing: ${esc(row.desiredTiming)}</div></div>
  </section>
  <h2>Purpose</h2><p>${esc(row.projectDescription)}</p>
  <p><strong>Desired outcome:</strong> ${esc(row.desiredOutcome || "To be confirmed with the applicant.")}</p>
  <p><strong>Intended users:</strong> ${esc(row.intendedUsers || "Not provided")}<br>
  <strong>Approximate scale:</strong> ${esc(row.approximateScale || "Not provided")}<br>
  <strong>Current systems:</strong> ${esc(row.currentSystems || "Not provided")}<br>
  <strong>Accessibility/connectivity:</strong> ${esc(row.accessibilityConnectivityNeeds || "Not provided")}</p>
  ${row.specialRequirements ? `<h2>Special requirements</h2><p>${esc(row.specialRequirements)}</p>` : ""}
  <h2>Commercial summary</h2>
  <table class="price">
    <thead><tr><th>Line</th><th>Basis</th><th>CAD</th></tr></thead>
    <tbody>
      <tr><td>${esc(row.selectedOffer)}</td><td>${esc(row.organizationType)}</td><td>${money(row.subtotalCents)}</td></tr>
       <tr><td>HST</td><td>${esc(taxDescription())}</td><td>${money(row.taxCents)}</td></tr>
      <tr class="total"><td colspan="2">Total</td><td>${money(row.totalCents)}</td></tr>
    </tbody>
  </table>
  ${
    standard
      ? `<h2>Included standard scope</h2>
         <p>Organizational and vocabulary mapping; governance and language record; Field Guide Finance; one selected operational layer; agreed data/content intake; role-based training; launch acceptance; an initial results framework; and a later-tool roadmap.</p>
         <h2>Assumptions and exclusions</h2>
         <p>The client names an authorized decision-maker, operator, payer route, and minimum necessary source information. Integrations, migrations, regulated workflows, sensitive-data expansion, legal/accounting advice, research, travel, and custom product work require a separate written scope.</p>
         <p><strong>Payment:</strong> ${esc(HEADWATERS_QUOTE_TERMS.payment)}<br><strong>Travel:</strong> ${esc(HEADWATERS_QUOTE_TERMS.travel)}</p>
         <div class="notice">This is a non-binding budgetary quote for funding and planning purposes. It is valid until ${date(row.validUntil)}, subject to eligibility, scope, and security review, and is not a guarantee of grant eligibility or funding. Work begins only after both parties approve a written scope, timing, payment schedule, and acceptance criteria.</div>`
      : `<div class="notice">This request includes work that requires a human scope review. No automatic price, commitment, or final quote has been issued. Headwaters will review the request and reply with the next questions or a custom scope.</div>`
  }
  <footer class="footer"><span>Build capacity that survives change.</span><span>${esc(row.quoteNumber)}</span></footer>
</main>
${standard ? `
<main class="page">
  <header class="top">
    <div>
      <div class="brand">${esc(HEADWATERS_SELLER.operatingName)}</div>
      <div class="legal">${esc(HEADWATERS_SELLER.displayName)}<br>${esc(HEADWATERS_SELLER.email)} · ${esc(HEADWATERS_SELLER.phone)}</div>
    </div>
    <div><h1>Grant-ready<br>Project Insert</h1><div class="number">${esc(row.quoteNumber)}</div></div>
  </header>
  <section class="meta">
    <div><div class="label">Applicant</div><div class="value">${esc(row.legalOrganizationName)}<br>${esc(row.organizationAddress)}</div></div>
    <div><div class="label">Project</div><div class="value">${esc(row.projectTitle)}<br>Funding program: ${esc(row.fundingProgram)}</div></div>
  </section>
  <h2>Problem</h2><p>${esc(row.projectDescription)}</p>
  <h2>Objective</h2><p>${esc(row.desiredOutcome || "Confirm a practical, locally operated improvement with the applicant.")}</p>
  <h2>Activities</h2><p>Discovery and mapping; configuration; controlled content/data intake; operator training; acceptance; and handoff.</p>
  <h2>Outputs and deliverables</h2><p>One bounded working system, governance and language record, trained operators, acceptance record, initial results framework, and roadmap.</p>
  <h2>Indicative timeline and budget</h2><p>Nine weeks, aligned where possible with ${esc(row.desiredTiming)}. Base budget: ${money(row.subtotalCents)} CAD, exclusive of applicable taxes and separately scoped additions.</p>
  <h2>Expected capacity outcome</h2><p>${esc(row.desiredOutcome || "Greater local continuity, clearer authority, and a maintainable operating method.")}</p>
  <div class="notice"><strong>Applicant review required.</strong> Verify every fact, funding-program requirement, eligibility statement, scope assumption, security requirement, and budget before using this draft. Headwaters does not determine fund eligibility, guarantee funding, or submit the application.</div>
  <footer class="footer"><span>Draft funding insert · applicant must verify</span><span>${esc(row.quoteNumber)}</span></footer>
</main>` : ""}
</body>
</html>`;
}