import crypto from "crypto";
import type { QuoteRequestRow } from "@workspace/db";

export const HEADWATERS_SELLER = {
  legalName: "1001047300 ONTARIO INC.",
  operatingName: "Headwaters",
  practitioner: "Bobbie Parr",
  hstRegistered: false,
} as const;

const STANDARD_PRICES: Record<string, Record<string, number>> = {
  "initial implementation": {
    "co-op/not-for-profit": 2_000_000,
    "commercial/institutional": 2_800_000,
  },
  "additional standard tool": {
    "co-op/not-for-profit": 800_000,
    "commercial/institutional": 1_200_000,
  },
};

export function classifyQuote(input: {
  organizationType: string;
  selectedOffer: string;
  specialRequirements: string | null;
}): { mode: "standard" | "custom"; subtotalCents: number | null } {
  const price = STANDARD_PRICES[input.selectedOffer]?.[input.organizationType];
  const hasSpecialRequirements = Boolean(input.specialRequirements?.trim());
  if (!price || hasSpecialRequirements) {
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
  value.setDate(value.getDate() + 30);
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
    "",
    `Requested offer: ${row.selectedOffer}`,
    `Organization type: ${row.organizationType}`,
    `Subtotal: ${money(row.subtotalCents)}`,
    "HST: Not charged — seller is not currently registered for HST.",
    `Total: ${money(row.totalCents)}`,
    "",
    "Project description:",
    row.projectDescription,
    "",
    row.specialRequirements
      ? `Special requirements:\n${row.specialRequirements}\n`
      : "",
    standard
      ? [
          "Standard scope:",
          "Organizational and vocabulary mapping; governance and language record; Field Guide Finance; one selected operational layer; agreed data/content intake; role-based training; launch acceptance; initial results framework; and a later-tool roadmap.",
          "",
          "Excluded unless separately quoted:",
          "Integrations, migrations, regulated workflows, sensitive-data expansion, legal/accounting advice, research, travel, and custom product work.",
          "",
          `Valid until: ${date(row.validUntil)}`,
          `Download the grant-ready quote: ${pdfUrl}`,
        ].join("\n")
      : "This request needs a human scope review. No price or external commitment has been generated.",
    "",
    `${HEADWATERS_SELLER.operatingName}`,
    HEADWATERS_SELLER.legalName,
    `${HEADWATERS_SELLER.practitioner}, practitioner`,
  ]
    .filter(Boolean)
    .join("\n");
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
    .page { width: 8.5in; min-height: 11in; padding: .68in .72in; background: #fffdf8; position: relative; }
    .top { display:flex; justify-content:space-between; gap:30px; padding-bottom:22px; border-bottom:3px solid #17392b; }
    .brand { color:#17392b; font-family:Georgia,serif; font-size:28px; font-weight:bold; }
    .legal { margin-top:6px; font-size:10px; line-height:1.5; color:#526059; }
    h1 { margin:0; font: bold 24px Georgia,serif; color:#17392b; text-align:right; }
    .number { margin-top:7px; text-align:right; font-size:10px; letter-spacing:.08em; }
    .meta { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin:26px 0; }
    .label { color:#9a4d39; font-size:9px; text-transform:uppercase; letter-spacing:.12em; font-weight:bold; }
    .value { margin-top:5px; font-size:12px; line-height:1.5; white-space:pre-line; }
    h2 { margin:22px 0 8px; color:#17392b; font: bold 14px Georgia,serif; }
    p, li { font-size:10.5px; line-height:1.55; }
    .price { width:100%; margin-top:14px; border-collapse:collapse; }
    .price th, .price td { padding:10px 8px; border-bottom:1px solid #ccd2ce; text-align:left; font-size:10px; }
    .price th:last-child, .price td:last-child { text-align:right; }
    .total td { color:#17392b; font-size:13px; font-weight:bold; border-bottom:2px solid #17392b; }
    .notice { margin:18px 0; padding:12px 14px; background:#f3ead8; border-left:3px solid #d4a017; font-size:10px; line-height:1.5; }
    .footer { position:absolute; left:.72in; right:.72in; bottom:.45in; display:flex; justify-content:space-between; color:#68736d; font-size:8.5px; border-top:1px solid #d8ddd9; padding-top:9px; }
  </style>
</head>
<body>
<main class="page">
  <header class="top">
    <div>
      <div class="brand">${esc(HEADWATERS_SELLER.operatingName)}</div>
      <div class="legal">${esc(HEADWATERS_SELLER.legalName)}<br>${esc(HEADWATERS_SELLER.practitioner)}, practitioner</div>
    </div>
    <div><h1>${esc(title)}</h1><div class="number">${esc(row.quoteNumber)} · ${date(row.createdAt)}</div></div>
  </header>
  <section class="meta">
    <div><div class="label">Prepared for</div><div class="value">${esc(row.legalOrganizationName)}<br>${esc(row.organizationAddress)}<br>${esc(row.contactName)}${row.role ? ` · ${esc(row.role)}` : ""}<br>${esc(row.email)}</div></div>
    <div><div class="label">Project</div><div class="value">${esc(row.projectTitle)}<br>Funding program: ${esc(row.fundingProgram)}<br>Desired timing: ${esc(row.desiredTiming)}</div></div>
  </section>
  <h2>Purpose</h2><p>${esc(row.projectDescription)}</p>
  ${row.specialRequirements ? `<h2>Special requirements</h2><p>${esc(row.specialRequirements)}</p>` : ""}
  <h2>Commercial summary</h2>
  <table class="price">
    <thead><tr><th>Line</th><th>Basis</th><th>CAD</th></tr></thead>
    <tbody>
      <tr><td>${esc(row.selectedOffer)}</td><td>${esc(row.organizationType)}</td><td>${money(row.subtotalCents)}</td></tr>
      <tr><td>HST</td><td>Seller is not currently registered for HST</td><td>$0.00</td></tr>
      <tr class="total"><td colspan="2">Total</td><td>${money(row.totalCents)}</td></tr>
    </tbody>
  </table>
  ${
    standard
      ? `<h2>Included standard scope</h2>
         <p>Organizational and vocabulary mapping; governance and language record; Field Guide Finance; one selected operational layer; agreed data/content intake; role-based training; launch acceptance; an initial results framework; and a later-tool roadmap.</p>
         <h2>Assumptions and exclusions</h2>
         <p>The client names an authorized decision-maker, operator, payer route, and minimum necessary source information. Integrations, migrations, regulated workflows, sensitive-data expansion, legal/accounting advice, research, travel, and custom product work require a separate written scope.</p>
         <div class="notice">This is a non-binding budgetary quote for funding and planning purposes. It is valid until ${date(row.validUntil)}. Work begins only after both parties approve a written scope, timing, payment schedule, and acceptance criteria.</div>`
      : `<div class="notice">This request includes work that requires a human scope review. No automatic price, commitment, or final quote has been issued. Headwaters will review the request and reply with the next questions or a custom scope.</div>`
  }
  <footer><span>Build capacity that survives change.</span><span>${esc(row.quoteNumber)}</span></footer>
</main>
</body>
</html>`;
}