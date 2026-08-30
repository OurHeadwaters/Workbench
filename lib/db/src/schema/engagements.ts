import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { quoteRequestsTable } from "./quoteRequests";

// Deliberately Z2/Z3 only. tenantOpaqueId is supplied by the Z2–Z3 gate and
// is not a household, member, wallet, or reversible cross-zone identifier.
export const engagementOrganizationsTable = pgTable("engagement_organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantOpaqueId: text("tenant_opaque_id").notNull(),
  legalName: text("legal_name").notNull(),
  organizationType: text("organization_type"),
  organizationAddress: text("organization_address"),
  sourceQuoteRequestId: uuid("source_quote_request_id").references(() => quoteRequestsTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ tenantIdx: uniqueIndex("engagement_organizations_tenant_idx").on(t.tenantOpaqueId) }));

// Authorization is deliberately separate from the opaque tenant identifier.
// A tenant value in a request is a selector, never proof of authority.
export const engagementTenantOperatorsTable = pgTable("engagement_tenant_operators", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantOpaqueId: text("tenant_opaque_id").notNull(),
  bookkeeperUserId: uuid("bookkeeper_user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  membershipIdx: uniqueIndex("engagement_tenant_operators_unique").on(t.tenantOpaqueId, t.bookkeeperUserId),
  userIdx: index("engagement_tenant_operators_user_idx").on(t.bookkeeperUserId),
}));

// Integration traffic is opt-in per opaque tenant. A pending ledger tenant is
// intentionally not an integration tenant until an owner records approval.
export const engagementTenantIntegrationConfigsTable = pgTable("engagement_tenant_integration_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantOpaqueId: text("tenant_opaque_id").notNull(),
  integration: text("integration").notNull().default("z3"),
  status: text("status").notNull().default("pending"), // pending|enabled|suspended
  allowedEventTypes: jsonb("allowed_event_types").notNull().default([]),
  allowedPayloadFields: jsonb("allowed_payload_fields").notNull().default({}),
  allowedOutboundEventTypes: jsonb("allowed_outbound_event_types").notNull().default([]),
  outboundEndpointUrl: text("outbound_endpoint_url"),
  outboundSecretEnvName: text("outbound_secret_env_name"),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  tenantIntegrationIdx: uniqueIndex("engagement_tenant_integration_unique").on(t.tenantOpaqueId, t.integration),
}));

export const engagementsTable = pgTable("engagements", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => engagementOrganizationsTable.id),
  quoteRequestId: uuid("quote_request_id").references(() => quoteRequestsTable.id),
  title: text("title").notNull(),
  state: text("state").notNull().default("draft"), // draft|active|handoff_pending|accepted|closed|cancelled
  quoteAmountCents: integer("quote_amount_cents"),
  quoteSnapshot: jsonb("quote_snapshot").notNull(),
  currency: text("currency").notNull().default("CAD"),
  costCentreCode: text("cost_centre_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  orgIdx: index("engagements_organization_idx").on(t.organizationId),
  quoteIdx: uniqueIndex("engagements_quote_request_idx").on(t.quoteRequestId),
}));

export const engagementScopeVersionsTable = pgTable("engagement_scope_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id").notNull().references(() => engagementsTable.id),
  version: integer("version").notNull(),
  status: text("status").notNull().default("draft"), // draft|accepted|superseded
  terms: jsonb("terms").notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  acceptedBy: text("accepted_by"), // above-board organization representative only
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ versionIdx: uniqueIndex("engagement_scope_versions_unique").on(t.engagementId, t.version) }));

export const engagementMilestonesTable = pgTable("engagement_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id").notNull().references(() => engagementsTable.id),
  title: text("title").notNull(),
  status: text("status").notNull().default("planned"), // planned|in_progress|evidence_submitted|accepted|blocked
  amountCents: integer("amount_cents"),
  evidence: jsonb("evidence"),
  dueAt: timestamp("due_at", { withTimezone: true }),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ engagementIdx: index("engagement_milestones_engagement_idx").on(t.engagementId) }));

export const engagementChangeOrdersTable = pgTable("engagement_change_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id").notNull().references(() => engagementsTable.id),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull().default("requested"), // requested|approved|rejected|invoiced
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
}, (t) => ({ engagementIdx: index("engagement_change_orders_engagement_idx").on(t.engagementId) }));

export const engagementHandoffsTable = pgTable("engagement_handoffs", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id").notNull().references(() => engagementsTable.id),
  acceptanceCriteria: jsonb("acceptance_criteria").notNull(),
  status: text("status").notNull().default("pending"), // pending|accepted|rejected
  responseNote: text("response_note"),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const engagementInvoicesTable = pgTable("engagement_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id").notNull().references(() => engagementsTable.id),
  milestoneId: uuid("milestone_id").references(() => engagementMilestonesTable.id),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull().default("draft"), // draft|approved|manual_review|void
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  accountingTransactionId: uuid("accounting_transaction_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ engagementIdx: index("engagement_invoices_engagement_idx").on(t.engagementId) }));

export const engagementPaymentsTable = pgTable("engagement_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => engagementInvoicesTable.id),
  amountCents: integer("amount_cents").notNull(),
  reference: text("reference").notNull(),
  receivingAccountCode: text("receiving_account_code").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),
  reconciledAt: timestamp("reconciled_at", { withTimezone: true }),
  accountingTransactionId: uuid("accounting_transaction_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ referenceIdx: uniqueIndex("engagement_payments_invoice_reference_idx").on(t.invoiceId, t.reference) }));

export const engagementAuditEventsTable = pgTable("engagement_audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id").notNull().references(() => engagementsTable.id),
  action: text("action").notNull(),
  actorType: text("actor_type").notNull(), // operator|integration
  actorReference: text("actor_reference").notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ timelineIdx: index("engagement_audit_events_timeline_idx").on(t.engagementId, t.createdAt) }));

export const engagementIntegrationInboxTable = pgTable("engagement_integration_inbox", {
  id: uuid("id").primaryKey().defaultRandom(),
  integration: text("integration").notNull(),
  eventId: text("event_id").notNull(),
  tenantOpaqueId: text("tenant_opaque_id").notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  status: text("status").notNull().default("received"), // received|processed|rejected
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
}, (t) => ({ idempotencyIdx: uniqueIndex("engagement_inbox_idempotency_idx").on(t.integration, t.eventId) }));

export const engagementIntegrationOutboxTable = pgTable("engagement_integration_outbox", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id").notNull().references(() => engagementsTable.id),
  destination: text("destination").notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  status: text("status").notNull().default("pending"), // pending|sent|failed
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  claimedAt: timestamp("claimed_at", { withTimezone: true }),
  leaseExpiresAt: timestamp("lease_expires_at", { withTimezone: true }),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Posting is intentionally a controlled request, not an implicit side effect
// of a webhook. The transaction ID links to bk_transactions without copying it.
export const engagementPostingRequestsTable = pgTable("engagement_posting_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").references(() => engagementInvoicesTable.id),
  paymentId: uuid("payment_id").references(() => engagementPaymentsTable.id),
  status: text("status").notNull().default("pending"), // pending|posted|manual_review
  reason: text("reason"),
  accountingTransactionId: uuid("accounting_transaction_id"),
  debitAccountCode: text("debit_account_code"),
  creditAccountCode: text("credit_account_code"),
  costCentreCode: text("cost_centre_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});