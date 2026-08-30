import crypto from "crypto";

export const ENGAGEMENT_TRANSITIONS: Record<string, readonly string[]> = {
  draft: ["active", "cancelled"],
  active: ["handoff_pending", "cancelled"],
  handoff_pending: ["active", "accepted", "cancelled"],
  accepted: ["closed"],
  closed: [],
  cancelled: [],
};

export const Z3_EVENT_TYPES = new Set([
  "build.acknowledged",
  "milestone.evidence",
  "milestone.status",
  "change.request",
  "handoff.accepted",
  "handoff.rejected",
]);

export function canTransition(from: string, to: string): boolean {
  return ENGAGEMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export type QuoteEligibility =
  | { eligible: true }
  | { eligible: false; status: 409 | 410; reason: string };

export function quoteEligibility(
  quote: { mode: string; totalCents: number | null; validUntil: Date | null },
  now = Date.now(),
): QuoteEligibility {
  if (quote.mode !== "standard" || quote.totalCents === null) {
    return { eligible: false, status: 409, reason: "Custom-review quotes require a human scope decision." };
  }
  if (!quote.validUntil || quote.validUntil.getTime() <= now) {
    return { eligible: false, status: 410, reason: "Quote has expired and cannot be converted." };
  }
  return { eligible: true };
}

export function canUseTenantForQuote(
  role: string,
  hasMembership: boolean,
  organization: { legalName: string; organizationType: string | null; organizationAddress: string | null } | null,
  quote: { legalOrganizationName: string; organizationType: string; organizationAddress: string },
): boolean {
  if (role === "owner") return true;
  return hasMembership
    && organization !== null
    && organization.legalName === quote.legalOrganizationName
    && organization.organizationType === quote.organizationType
    && organization.organizationAddress === quote.organizationAddress;
}

export function transitionGate(
  from: string,
  to: string,
  hasAcceptedHandoff: boolean,
): string | null {
  if (!canTransition(from, to)) return `Transition from ${from} to ${to} is not allowed.`;
  if (to === "accepted" && !hasAcceptedHandoff) return "An accepted handoff is required.";
  if (to === "closed" && from !== "accepted") return "Only an accepted engagement may be closed.";
  return null;
}

export function validInvoiceAccounts(
  accounts: Array<{ code: string; type: string; normalSide: string; isActive: boolean }>,
  revenueCode: string,
  receivableCode: string,
): boolean {
  const revenue = accounts.find((account) => account.code === revenueCode);
  const receivable = accounts.find((account) => account.code === receivableCode);
  return Boolean(
    revenue
    && receivable
    && revenue.code !== receivable.code
    && revenue.isActive
    && revenue.type === "revenue"
    && revenue.normalSide === "credit"
    && receivable.isActive
    && receivable.type === "asset"
    && receivable.normalSide === "debit",
  );
}

export function validReceivingAccount(
  account: { type: string; normalSide: string; isActive: boolean } | undefined,
): boolean {
  return Boolean(account?.isActive && account.type === "asset" && account.normalSide === "debit");
}

export function paymentNeedsManualReview(
  invoiceAmountCents: number,
  priorPaymentCents: number,
  paymentAmountCents: number,
): boolean {
  return priorPaymentCents + paymentAmountCents > invoiceAmountCents;
}

export function hasDuplicatePaymentReference(
  payments: Array<{ reference: string }>,
  reference: string,
): boolean {
  return payments.some((payment) => payment.reference === reference);
}

export function canReconcile(
  requests: Array<{ status: string; accountingTransactionId: string | null }>,
): boolean {
  return requests.some((request) => request.status === "posted" && Boolean(request.accountingTransactionId));
}

export function handoffWebhookAllowed(
  engagementState: string,
  handoffStatus: string,
): boolean {
  return engagementState === "handoff_pending" && handoffStatus === "pending";
}

export function payloadKeysAllowed(
  payload: Record<string, unknown>,
  allowedFields: readonly string[] | undefined,
): boolean {
  return Array.isArray(allowedFields) && Object.keys(payload).every((key) => allowedFields.includes(key));
}

export function controlledPostingLines(
  amountCents: number,
  debitAccountCode: string,
  creditAccountCode: string,
  costCentreCode: string,
) {
  const amount = (amountCents / 100).toFixed(2);
  return [
    { accountCode: debitAccountCode, costCentreCode, debit: amount, credit: "0.00", lineOrder: 0 },
    { accountCode: creditAccountCode, costCentreCode, debit: "0.00", credit: amount, lineOrder: 1 },
  ];
}

export function canPostPaymentAgainstInvoice(
  invoicePosting: { status: string; accountingTransactionId: string | null; debitAccountCode: string | null } | undefined,
): boolean {
  return Boolean(
    invoicePosting?.status === "posted"
    && invoicePosting.accountingTransactionId
    && invoicePosting.debitAccountCode,
  );
}

export function canPostControlledRequest(
  status: string,
  accountingTransactionId: string | null,
): boolean {
  return status === "pending" && accountingTransactionId === null;
}

export function verifyEngagementWebhook(
  secret: string | undefined,
  timestamp: string | undefined,
  signature: string | undefined,
  body: Buffer | undefined,
  now = Date.now(),
): boolean {
  if (!secret || !timestamp || !signature || !body || !/^\d+$/.test(timestamp)) return false;
  const ts = Number(timestamp);
  if (!Number.isSafeInteger(ts) || Math.abs(now - ts * 1000) > 5 * 60 * 1000) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.`).update(body).digest("hex");
  const got = Buffer.from(signature, "hex");
  const wanted = Buffer.from(expected, "hex");
  return got.length === wanted.length && crypto.timingSafeEqual(got, wanted);
}