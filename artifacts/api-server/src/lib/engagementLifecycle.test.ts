import crypto from "crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  canReconcile,
  canPostPaymentAgainstInvoice,
  canPostControlledRequest,
  canTransition,
  canUseTenantForQuote,
  controlledPostingLines,
  hasDuplicatePaymentReference,
  handoffWebhookAllowed,
  paymentNeedsManualReview,
  payloadKeysAllowed,
  quoteEligibility,
  transitionGate,
  validInvoiceAccounts,
  validReceivingAccount,
  verifyEngagementWebhook,
  Z3_EVENT_TYPES,
} from "./engagementLifecycle";

describe("engagement lifecycle constitutional controls", () => {
  it("permits only the canonical state graph", () => {
    expect(canTransition("draft", "active")).toBe(true);
    expect(canTransition("active", "accepted")).toBe(false);
    expect(canTransition("accepted", "closed")).toBe(true);
    expect(canTransition("closed", "active")).toBe(false);
  });

  it("verifies HMAC using exact bytes and a bounded timestamp", () => {
    const now = 1_700_000_000_000;
    const body = Buffer.from('{"id":"repeatable"}');
    const timestamp = String(now / 1000);
    const signature = crypto
      .createHmac("sha256", "test-secret")
      .update(`${timestamp}.`)
      .update(body)
      .digest("hex");
    expect(verifyEngagementWebhook("test-secret", timestamp, signature, body, now)).toBe(true);
    expect(verifyEngagementWebhook("test-secret", timestamp, "00", body, now)).toBe(false);
    expect(verifyEngagementWebhook("test-secret", String(now / 1000 - 301), signature, body, now)).toBe(false);
  });

  it("rejects a bad signature", () => {
    expect(verifyEngagementWebhook("secret", "1700000000", "not-hex", Buffer.from("{}"), 1_700_000_000_000)).toBe(false);
  });

  it("rejects an expired signature", () => {
    const body = Buffer.from("{}");
    const signature = crypto.createHmac("sha256", "secret").update("1699999699.").update(body).digest("hex");
    expect(verifyEngagementWebhook("secret", "1699999699", signature, body, 1_700_000_000_000)).toBe(false);
  });

  it("has no financial event in the inbound allowlist", () => {
    expect(Z3_EVENT_TYPES.has("invoice.approved")).toBe(false);
    expect(Z3_EVENT_TYPES.has("payment.recorded")).toBe(false);
    expect(Z3_EVENT_TYPES.has("handoff.rejected")).toBe(true);
  });

  it("rejects custom quotes for automatic conversion", () => {
    expect(quoteEligibility({ mode: "custom", totalCents: null, validUntil: new Date(2_000) }, 1_000)).toMatchObject({ eligible: false, status: 409 });
  });

  it("rejects expired standard quotes", () => {
    expect(quoteEligibility({ mode: "standard", totalCents: 100, validUntil: new Date(1_000) }, 1_000)).toMatchObject({ eligible: false, status: 410 });
  });

  it("allows owners to bind a new tenant", () => {
    expect(canUseTenantForQuote("owner", false, null, { legalOrganizationName: "A", organizationType: "Nation", organizationAddress: "X" })).toBe(true);
  });

  it("requires exact organization match and membership for non-owners", () => {
    const quote = { legalOrganizationName: "A", organizationType: "Nation", organizationAddress: "X" };
    expect(canUseTenantForQuote("bookkeeper", true, { legalName: "A", organizationType: "Nation", organizationAddress: "X" }, quote)).toBe(true);
    expect(canUseTenantForQuote("bookkeeper", false, { legalName: "A", organizationType: "Nation", organizationAddress: "X" }, quote)).toBe(false);
    expect(canUseTenantForQuote("bookkeeper", true, { legalName: "B", organizationType: "Nation", organizationAddress: "X" }, quote)).toBe(false);
  });

  it("gates acceptance on an accepted handoff", () => {
    expect(transitionGate("handoff_pending", "accepted", false)).toBe("An accepted handoff is required.");
    expect(transitionGate("handoff_pending", "accepted", true)).toBeNull();
  });

  it("validates invoice account types and normal sides", () => {
    const accounts = [
      { code: "REV", type: "revenue", normalSide: "credit", isActive: true },
      { code: "AR", type: "asset", normalSide: "debit", isActive: true },
    ];
    expect(validInvoiceAccounts(accounts, "REV", "AR")).toBe(true);
    expect(validInvoiceAccounts(accounts, "AR", "REV")).toBe(false);
  });

  it("validates receiving account type and side", () => {
    expect(validReceivingAccount({ type: "asset", normalSide: "debit", isActive: true })).toBe(true);
    expect(validReceivingAccount({ type: "liability", normalSide: "credit", isActive: true })).toBe(false);
  });

  it("detects cumulative overpayment", () => {
    expect(paymentNeedsManualReview(10_000, 8_000, 2_001)).toBe(true);
    expect(paymentNeedsManualReview(10_000, 8_000, 2_000)).toBe(false);
  });

  it("detects a duplicate payment reference on the same invoice", () => {
    expect(hasDuplicatePaymentReference([{ reference: "BANK-1" }], "BANK-1")).toBe(true);
    expect(hasDuplicatePaymentReference([{ reference: "BANK-1" }], "BANK-2")).toBe(false);
  });

  it("allows reconciliation only for a posted linked request", () => {
    expect(canReconcile([{ status: "posted", accountingTransactionId: "tx" }])).toBe(true);
    expect(canReconcile([{ status: "posted", accountingTransactionId: null }, { status: "pending", accountingTransactionId: "tx" }])).toBe(false);
  });

  it("accepts handoff webhooks only from pending engagement and handoff states", () => {
    expect(handoffWebhookAllowed("handoff_pending", "pending")).toBe(true);
    expect(handoffWebhookAllowed("active", "pending")).toBe(false);
    expect(handoffWebhookAllowed("handoff_pending", "accepted")).toBe(false);
  });

  it("enforces an exact per-event payload field allowlist", () => {
    expect(payloadKeysAllowed({ handoffId: "id", note: "ok" }, ["handoffId", "note"])).toBe(true);
    expect(payloadKeysAllowed({ handoffId: "id", financialAmount: 1 }, ["handoffId"])).toBe(false);
    expect(payloadKeysAllowed({}, undefined)).toBe(false);
  });

  it("builds controlled balanced posting lines with the engagement cost centre", () => {
    const lines = controlledPostingLines(12_345, "AR", "REV", "ENG-1");
    expect(lines).toEqual([
      { accountCode: "AR", costCentreCode: "ENG-1", debit: "123.45", credit: "0.00", lineOrder: 0 },
      { accountCode: "REV", costCentreCode: "ENG-1", debit: "0.00", credit: "123.45", lineOrder: 1 },
    ]);
  });

  it("requires an existing posted invoice posting before posting a payment", () => {
    expect(canPostPaymentAgainstInvoice(undefined)).toBe(false);
    expect(canPostPaymentAgainstInvoice({ status: "pending", accountingTransactionId: "tx", debitAccountCode: "AR" })).toBe(false);
    expect(canPostPaymentAgainstInvoice({ status: "posted", accountingTransactionId: "tx", debitAccountCode: "AR" })).toBe(true);
  });

  it("prevents a duplicate controlled posting by requiring pending status", () => {
    expect(canPostControlledRequest("pending", null)).toBe(true);
    expect(canPostControlledRequest("posted", "already-posted")).toBe(false);
    expect(canReconcile([{ status: "posted", accountingTransactionId: "already-posted" }])).toBe(true);
  });

  it("declares the static webhook before dynamic engagement routes", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/routes/engagements.ts"), "utf8");
    expect(source.indexOf('router.post("/webhooks/z3"')).toBeGreaterThan(-1);
    expect(source.indexOf('router.post("/webhooks/z3"')).toBeLessThan(source.indexOf('router.get("/:id"'));
  });
});