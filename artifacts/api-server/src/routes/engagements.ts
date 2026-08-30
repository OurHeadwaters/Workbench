import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  bookkeeperAccountsTable,
  bookkeeperCostCentresTable,
  bookkeeperTransactionLinesTable,
  bookkeeperTransactionsTable,
  db,
  engagementAuditEventsTable,
  engagementChangeOrdersTable,
  engagementHandoffsTable,
  engagementIntegrationInboxTable,
  engagementIntegrationOutboxTable,
  engagementInvoicesTable,
  engagementMilestonesTable,
  engagementOrganizationsTable,
  engagementPaymentsTable,
  engagementPostingRequestsTable,
  engagementScopeVersionsTable,
  engagementTenantOperatorsTable,
  engagementTenantIntegrationConfigsTable,
  engagementsTable,
  quoteRequestsTable,
} from "@workspace/db";
import { requireRole, type BookkeeperUser } from "../lib/bookkeeperAuth";
import {
  canReconcile,
  canPostPaymentAgainstInvoice,
  canPostControlledRequest,
  canUseTenantForQuote,
  hasDuplicatePaymentReference,
  handoffWebhookAllowed,
  payloadKeysAllowed,
  paymentNeedsManualReview,
  quoteEligibility,
  transitionGate,
  controlledPostingLines,
  validInvoiceAccounts,
  validReceivingAccount,
  verifyEngagementWebhook,
  Z3_EVENT_TYPES,
} from "../lib/engagementLifecycle";
import { allowedOutboundUrl, deliverOutboxRow, queueEngagementOutbound } from "../lib/engagementOutbound";

const router: IRouter = Router();
const opaque = z.string().min(8).max(200).regex(/^[A-Za-z0-9._:-]+$/, "tenantId must be opaque");
const id = z.string().uuid();
const stateSchema = z.enum(["draft", "active", "handoff_pending", "accepted", "closed", "cancelled"]);
const eventSchema = z.object({
  id: z.string().min(1).max(200),
  tenantId: opaque,
  type: z.string(),
  engagementId: id,
  payload: z.record(z.string(), z.unknown()).default({}),
});

function tenant(req: { query: Record<string, unknown>; body?: unknown }): string | null {
  const value = typeof req.query.tenantId === "string"
    ? req.query.tenantId
    : (req.body as { tenantId?: unknown } | undefined)?.tenantId;
  return opaque.safeParse(value).success ? String(value) : null;
}

function badTenant(res: Response) {
  return res.status(400).json({ error: "A valid opaque tenantId is required." });
}

async function memberAccess(user: BookkeeperUser, tenantId: string): Promise<boolean> {
  if (user.role === "owner") return true;
  const rows = await db
    .select({ id: engagementTenantOperatorsTable.id })
    .from(engagementTenantOperatorsTable)
    .where(and(
      eq(engagementTenantOperatorsTable.tenantOpaqueId, tenantId),
      eq(engagementTenantOperatorsTable.bookkeeperUserId, user.id),
    ))
    .limit(1);
  return rows.length === 1;
}

async function authorizeTenant(
  roles: Array<"owner" | "ops_manager" | "bookkeeper">,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  await requireRole(...roles)(req, res, async () => {
    const tenantId = tenant(req);
    if (!tenantId) {
      badTenant(res);
      return;
    }
    if (!(await memberAccess(req.bookkeeperUser!, tenantId))) {
      res.status(403).json({ error: "No membership for this tenant." });
      return;
    }
    next();
    return;
  });
}

const operator = (req: Request, res: Response, next: NextFunction) =>
  authorizeTenant(["owner", "ops_manager", "bookkeeper"], req, res, next);
const financial = (req: Request, res: Response, next: NextFunction) =>
  authorizeTenant(["owner", "bookkeeper"], req, res, next);

async function scopedEngagement(engagementId: string, tenantId: string) {
  const rows = await db
    .select({ engagement: engagementsTable, organization: engagementOrganizationsTable })
    .from(engagementsTable)
    .innerJoin(
      engagementOrganizationsTable,
      eq(engagementsTable.organizationId, engagementOrganizationsTable.id),
    )
    .where(and(
      eq(engagementsTable.id, engagementId),
      eq(engagementOrganizationsTable.tenantOpaqueId, tenantId),
    ))
    .limit(1);
  return rows[0] ?? null;
}

router.post("/tenants/attach", requireRole("owner"), async (req, res) => {
  const parsed = z.object({ tenantId: opaque, bookkeeperUserId: id }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid tenant attachment." });
  await db.transaction((tx) => tx
    .insert(engagementTenantOperatorsTable)
    .values({
      tenantOpaqueId: parsed.data.tenantId,
      bookkeeperUserId: parsed.data.bookkeeperUserId,
    })
    .onConflictDoNothing());
  return res.status(201).json({ ok: true });
});

router.put("/tenants/:tenantId/integrations/z3", requireRole("owner"), async (req, res) => {
  const tenantId = opaque.safeParse(req.params.tenantId);
  const parsed = z.object({
    status: z.enum(["pending", "enabled", "suspended"]),
    allowedEventTypes: z.array(z.string()).max(20),
    allowedPayloadFields: z.record(z.string(), z.array(z.string().min(1).max(100)).max(100)),
    allowedOutboundEventTypes: z.array(z.string()).max(20),
    outboundEndpointUrl: z.string().url().optional().nullable(),
    outboundSecretEnvName: z.string().regex(/^[A-Z][A-Z0-9_]*$/).optional().nullable(),
  }).safeParse(req.body);
  if (!tenantId.success || !parsed.success) {
    return res.status(400).json({ error: "Invalid tenant integration configuration." });
  }
  if (parsed.data.status === "enabled" && (
    parsed.data.allowedEventTypes.some((type) => !Z3_EVENT_TYPES.has(type))
    || !allowedOutboundUrl(parsed.data.outboundEndpointUrl)
    || !parsed.data.outboundSecretEnvName
  )) {
    return res.status(422).json({ error: "Enabled integrations require approved inbound events, HTTPS outbound endpoint, and secret reference." });
  }
  const approval = parsed.data.status === "enabled"
    ? { approvedBy: req.bookkeeperUser!.email, approvedAt: new Date() }
    : { approvedBy: null, approvedAt: null };
  const [config] = await db.transaction(async (tx) => tx
    .insert(engagementTenantIntegrationConfigsTable)
    .values({
      tenantOpaqueId: tenantId.data,
      integration: "z3",
      ...parsed.data,
      ...approval,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        engagementTenantIntegrationConfigsTable.tenantOpaqueId,
        engagementTenantIntegrationConfigsTable.integration,
      ],
      set: { ...parsed.data, ...approval, updatedAt: new Date() },
    })
    .returning());
  return res.json({
    id: config.id,
    tenantOpaqueId: config.tenantOpaqueId,
    integration: config.integration,
    status: config.status,
    allowedEventTypes: config.allowedEventTypes,
    allowedPayloadFields: config.allowedPayloadFields,
    allowedOutboundEventTypes: config.allowedOutboundEventTypes,
    outboundEndpointUrl: config.outboundEndpointUrl,
    approvedAt: config.approvedAt,
  });
});

router.get("/", operator, async (req, res) => {
  const tenantId = tenant(req);
  if (!tenantId) return badTenant(res);
  const rows = await db
    .select({ engagement: engagementsTable, organization: engagementOrganizationsTable })
    .from(engagementsTable)
    .innerJoin(
      engagementOrganizationsTable,
      eq(engagementsTable.organizationId, engagementOrganizationsTable.id),
    )
    .where(eq(engagementOrganizationsTable.tenantOpaqueId, tenantId))
    .orderBy(desc(engagementsTable.createdAt));
  return res.json(rows.map(({ engagement, organization }) => ({
    ...engagement,
    organization: {
      id: organization.id,
      legalName: organization.legalName,
      tenantOpaqueId: organization.tenantOpaqueId,
    },
  })));
});

router.post("/convert-quote", operator, async (req, res) => {
  const parsed = z.object({ tenantId: opaque, quoteRequestId: id }).passthrough().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid conversion request." });

  const result = await db.transaction(async (tx) => {
    const [quote] = await tx
      .select()
      .from(quoteRequestsTable)
      .where(eq(quoteRequestsTable.id, parsed.data.quoteRequestId))
      .limit(1);
    if (!quote) return { status: 404 as const, error: "Quote not found." };

    const eligibility = quoteEligibility(quote);
    if (!eligibility.eligible) return { status: eligibility.status, error: eligibility.reason };

    const [existingOrganization] = await tx
      .select()
      .from(engagementOrganizationsTable)
      .where(eq(engagementOrganizationsTable.tenantOpaqueId, parsed.data.tenantId))
      .limit(1);
    const hasMembership = await memberAccess(req.bookkeeperUser!, parsed.data.tenantId);
    if (!canUseTenantForQuote(req.bookkeeperUser!.role, hasMembership, existingOrganization ?? null, quote)) {
      return {
        status: 403 as const,
        error: "Non-owners require membership and an exact existing tenant organization match.",
      };
    }

    const [duplicate] = await tx
      .select({
        id: engagementsTable.id,
        tenantOpaqueId: engagementOrganizationsTable.tenantOpaqueId,
      })
      .from(engagementsTable)
      .innerJoin(
        engagementOrganizationsTable,
        eq(engagementsTable.organizationId, engagementOrganizationsTable.id),
      )
      .where(eq(engagementsTable.quoteRequestId, quote.id))
      .limit(1);
    if (duplicate) {
      if (req.bookkeeperUser!.role !== "owner" && duplicate.tenantOpaqueId !== parsed.data.tenantId) {
        return { status: 403 as const, error: "Quote is not converted for this tenant." };
      }
      return { status: 200 as const, body: { id: duplicate.id, duplicate: true } };
    }

    let organization = existingOrganization;
    if (!organization) {
      [organization] = await tx
        .insert(engagementOrganizationsTable)
        .values({
          tenantOpaqueId: parsed.data.tenantId,
          legalName: quote.legalOrganizationName,
          organizationType: quote.organizationType,
          organizationAddress: quote.organizationAddress,
          sourceQuoteRequestId: quote.id,
        })
        .returning();
    }

    const inserted = await tx
      .insert(engagementsTable)
      .values({
        organizationId: organization.id,
        quoteRequestId: quote.id,
        title: quote.projectTitle,
        quoteAmountCents: quote.totalCents,
        state: "draft",
        quoteSnapshot: {
          quoteNumber: quote.quoteNumber,
          projectTitle: quote.projectTitle,
          selectedOffer: quote.selectedOffer,
          subtotalCents: quote.subtotalCents,
          taxCents: quote.taxCents,
          totalCents: quote.totalCents,
          validUntil: quote.validUntil?.toISOString(),
        },
      })
      .onConflictDoNothing()
      .returning();
    const engagement = inserted[0];
    if (!engagement) {
      const [concurrent] = await tx
        .select({ id: engagementsTable.id })
        .from(engagementsTable)
        .where(eq(engagementsTable.quoteRequestId, quote.id))
        .limit(1);
      return { status: 200 as const, body: { id: concurrent.id, duplicate: true } };
    }

    const costCentreCode = `ENG-${engagement.id.replace(/-/g, "").slice(0, 12).toUpperCase()}`;
    await tx.insert(bookkeeperCostCentresTable).values({
      code: costCentreCode,
      name: `Engagement: ${quote.projectTitle}`.slice(0, 300),
      parentEntity: "Headwaters",
      description: `Engagement ${engagement.id}`,
      isActive: true,
    });
    await tx
      .update(engagementsTable)
      .set({ costCentreCode, updatedAt: new Date() })
      .where(eq(engagementsTable.id, engagement.id));
    await tx.insert(engagementScopeVersionsTable).values({
      engagementId: engagement.id,
      version: 1,
      terms: {
        sourceQuoteNumber: quote.quoteNumber,
        selectedOffer: quote.selectedOffer,
        projectDescription: quote.projectDescription,
        desiredOutcome: quote.desiredOutcome,
        totalCents: quote.totalCents,
      },
    });
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: engagement.id,
      action: "quote.converted",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { quoteRequestId: quote.id },
    });
    await queueEngagementOutbound(tx, parsed.data.tenantId, engagement.id, "engagement.created", {
      engagementId: engagement.id, title: quote.projectTitle, state: "draft",
    }, req.bookkeeperUser!.email);
    return { status: 201 as const, body: { ...engagement, costCentreCode } };
  });

  if ("error" in result) return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.body);
});

// This static route must remain before every /:id route.
router.post("/webhooks/z3", async (req, res) => {
  if (!verifyEngagementWebhook(
    process.env.ENGAGEMENT_Z3_WEBHOOK_SECRET,
    req.header("x-engagement-timestamp"),
    req.header("x-engagement-signature"),
    req.rawBody,
  )) {
    return res.status(401).json({ error: "Invalid webhook signature." });
  }

  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success || !Z3_EVENT_TYPES.has(parsed.data.type)) {
    return res.status(422).json({ error: "Unsupported event." });
  }
  const event = parsed.data;
  const handoffEvent = event.type === "handoff.accepted" || event.type === "handoff.rejected";
  const handoffId = handoffEvent ? id.safeParse(event.payload.handoffId) : null;
  if (handoffEvent && !handoffId?.success) {
    return res.status(422).json({ error: "Handoff events require a valid payload.handoffId." });
  }
  const validHandoffId = handoffId?.success ? handoffId.data : null;

  const result = await db.transaction(async (tx) => {
    const [duplicate] = await tx
      .select({ id: engagementIntegrationInboxTable.id })
      .from(engagementIntegrationInboxTable)
      .where(and(
        eq(engagementIntegrationInboxTable.integration, "z3"),
        eq(engagementIntegrationInboxTable.eventId, event.id),
      ))
      .limit(1)
      .for("update");
    if (duplicate) return { status: 200 as const, duplicate: true };

    const [config] = await tx
      .select()
      .from(engagementTenantIntegrationConfigsTable)
      .where(and(
        eq(engagementTenantIntegrationConfigsTable.tenantOpaqueId, event.tenantId),
        eq(engagementTenantIntegrationConfigsTable.integration, "z3"),
      ))
      .limit(1);
    const allowedTypes = config?.allowedEventTypes as string[] | undefined;
    const allowedFields = config?.allowedPayloadFields as Record<string, string[]> | undefined;
    if (
      config?.status !== "enabled"
      || !allowedTypes?.includes(event.type)
      || !payloadKeysAllowed(event.payload, allowedFields?.[event.type])
    ) {
      return { status: 403 as const, error: "Tenant integration is not enabled for this event payload." };
    }

    const [matched] = await tx
      .select({ engagement: engagementsTable })
      .from(engagementsTable)
      .innerJoin(
        engagementOrganizationsTable,
        eq(engagementsTable.organizationId, engagementOrganizationsTable.id),
      )
      .where(and(
        eq(engagementsTable.id, event.engagementId),
        eq(engagementOrganizationsTable.tenantOpaqueId, event.tenantId),
      ))
      .limit(1)
      .for("update");
    if (!matched) return { status: 404 as const, error: "Tenant or engagement does not match." };

    if (handoffEvent) {
      const [handoff] = await tx
        .select({ id: engagementHandoffsTable.id, status: engagementHandoffsTable.status })
        .from(engagementHandoffsTable)
        .where(and(
          eq(engagementHandoffsTable.id, validHandoffId!),
          eq(engagementHandoffsTable.engagementId, matched.engagement.id),
        ))
        .limit(1)
        .for("update");
      if (!handoff) return { status: 422 as const, error: "Handoff does not belong to this engagement." };
      if (!handoffWebhookAllowed(matched.engagement.state, handoff.status)) {
        return { status: 409 as const, error: "Handoff event is out of order or the handoff is terminal." };
      }
    }

    const inbox = await tx
      .insert(engagementIntegrationInboxTable)
      .values({
        integration: "z3",
        eventId: event.id,
        tenantOpaqueId: event.tenantId,
        eventType: event.type,
        payload: event.payload,
        status: "processed",
        processedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning({ id: engagementIntegrationInboxTable.id });
    if (!inbox.length) return { status: 200 as const, duplicate: true };

    if (handoffEvent) {
      const updated = await tx
        .update(engagementHandoffsTable)
        .set({
          status: event.type === "handoff.accepted" ? "accepted" : "rejected",
          respondedAt: new Date(),
          responseNote: typeof event.payload.note === "string"
            ? event.payload.note.slice(0, 2_000)
            : null,
        })
        .where(and(
          eq(engagementHandoffsTable.id, validHandoffId!),
          eq(engagementHandoffsTable.engagementId, matched.engagement.id),
          eq(engagementHandoffsTable.status, "pending"),
        ))
        .returning({ id: engagementHandoffsTable.id });
      if (!updated.length) {
        return { status: 409 as const, error: "Handoff event is out of order or the handoff is terminal." };
      }
    }
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: matched.engagement.id,
      action: `z3.${event.type}`,
      actorType: "integration",
      actorReference: "z3",
      payload: event.payload,
    });
    if (handoffEvent) {
      await queueEngagementOutbound(tx, event.tenantId, matched.engagement.id, event.type, {
        engagementId: matched.engagement.id, handoffId: validHandoffId, status: event.type === "handoff.accepted" ? "accepted" : "rejected",
      }, "z3");
    }
    return { status: 202 as const, duplicate: false };
  });

  if ("error" in result) return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json({ ok: true, duplicate: result.duplicate });
});

router.get("/outbox/list", operator, async (req, res) => {
  const tenantId = tenant(req);
  if (!tenantId) return badTenant(res);
  const rows = await db
    .select({ outbox: engagementIntegrationOutboxTable })
    .from(engagementIntegrationOutboxTable)
    .innerJoin(engagementsTable, eq(engagementIntegrationOutboxTable.engagementId, engagementsTable.id))
    .innerJoin(
      engagementOrganizationsTable,
      eq(engagementsTable.organizationId, engagementOrganizationsTable.id),
    )
    .where(eq(engagementOrganizationsTable.tenantOpaqueId, tenantId));
  return res.json(rows.map((row) => row.outbox));
});

router.post("/outbox/:id/retry", operator, async (req, res) => {
  const parsed = z.object({ tenantId: opaque }).safeParse(req.body);
  if (!parsed.success) return badTenant(res);
  const [row] = await db
    .select({ outbox: engagementIntegrationOutboxTable })
    .from(engagementIntegrationOutboxTable)
    .innerJoin(engagementsTable, eq(engagementIntegrationOutboxTable.engagementId, engagementsTable.id))
    .innerJoin(
      engagementOrganizationsTable,
      eq(engagementsTable.organizationId, engagementOrganizationsTable.id),
    )
    .where(and(
      eq(engagementIntegrationOutboxTable.id, String(req.params.id)),
      eq(engagementOrganizationsTable.tenantOpaqueId, parsed.data.tenantId),
    ))
    .limit(1);
  if (!row) return res.status(404).json({ error: "Outbox delivery not found." });
  if (row.outbox.status === "delivering") {
    return res.status(409).json({ error: "Delivery is currently leased by a worker." });
  }
  if (!["failed", "dead_letter"].includes(row.outbox.status)) {
    return res.status(409).json({ error: "Only failed or dead-letter deliveries may be manually retried." });
  }
  const requeued = await db.transaction(async (tx) => {
    const [locked] = await tx.select().from(engagementIntegrationOutboxTable)
      .where(eq(engagementIntegrationOutboxTable.id, row.outbox.id))
      .limit(1)
      .for("update");
    if (!locked || locked.status === "delivering") return false;
    await tx.update(engagementIntegrationOutboxTable)
      .set({
        status: "pending", attempts: 0, lastError: null, claimedAt: null,
        leaseExpiresAt: null, nextAttemptAt: null,
      })
      .where(eq(engagementIntegrationOutboxTable.id, locked.id));
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: locked.engagementId,
      action: "outbox.requeued",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { outboxId: locked.id },
    });
    return true;
  });
  if (!requeued) return res.status(409).json({ error: "Delivery is currently leased by a worker." });
  const delivery = await deliverOutboxRow(row.outbox.id);
  return res.status(delivery === "sent" ? 200 : 202).json({ id: row.outbox.id, delivery });
});

router.post("/invoices/:invoiceId/approve", financial, async (req, res) => {
  const parsed = z.object({
    tenantId: opaque,
    revenueAccountCode: z.string().min(1),
    receivableAccountCode: z.string().min(1),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Explicit account codes are required." });

  const result = await db.transaction(async (tx) => {
    const [invoice] = await tx
      .select()
      .from(engagementInvoicesTable)
      .where(eq(engagementInvoicesTable.id, String(req.params.invoiceId)))
      .limit(1)
      .for("update");
    if (!invoice) return { status: 404 as const, error: "Invoice not found." };
    const found = await scopedEngagement(invoice.engagementId, parsed.data.tenantId);
    if (!found) return { status: 404 as const, error: "Invoice not found." };
    if (invoice.status !== "draft") {
      return { status: 409 as const, error: "Only draft invoices may be approved." };
    }

    const accounts = await tx
      .select()
      .from(bookkeeperAccountsTable)
      .where(inArray(bookkeeperAccountsTable.code, [
        parsed.data.revenueAccountCode,
        parsed.data.receivableAccountCode,
      ]));
    const [costCentre] = found.engagement.costCentreCode
      ? await tx
        .select()
        .from(bookkeeperCostCentresTable)
        .where(and(
          eq(bookkeeperCostCentresTable.code, found.engagement.costCentreCode),
          eq(bookkeeperCostCentresTable.isActive, true),
        ))
        .limit(1)
      : [];
    const valid = validInvoiceAccounts(
      accounts,
      parsed.data.revenueAccountCode,
      parsed.data.receivableAccountCode,
    ) && Boolean(costCentre);
    const [updated] = await tx
      .update(engagementInvoicesTable)
      .set({ status: valid ? "approved" : "manual_review", approvedAt: valid ? new Date() : null })
      .where(and(
        eq(engagementInvoicesTable.id, invoice.id),
        eq(engagementInvoicesTable.status, "draft"),
      ))
      .returning();
    if (!updated) return { status: 409 as const, error: "Invoice was already approved." };
    const [posting] = await tx
      .insert(engagementPostingRequestsTable)
      .values({
        invoiceId: invoice.id,
        status: valid ? "pending" : "manual_review",
        reason: valid ? null : "Account type/side or project cost centre is invalid.",
        debitAccountCode: parsed.data.receivableAccountCode,
        creditAccountCode: parsed.data.revenueAccountCode,
        costCentreCode: found.engagement.costCentreCode,
      })
      .returning();
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: invoice.engagementId,
      action: valid ? "invoice.approved" : "invoice.manual_review",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { invoiceId: invoice.id, postingRequestId: posting.id },
    });
    if (valid) await queueEngagementOutbound(tx, parsed.data.tenantId, invoice.engagementId, "invoice.approved", {
      engagementId: invoice.engagementId, invoiceId: invoice.id, amountCents: invoice.amountCents,
    }, req.bookkeeperUser!.email);
    return { status: 200 as const, body: { invoice: updated, postingRequest: posting } };
  });
  if ("error" in result) return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.body);
});

router.post("/invoices/:invoiceId/payments", financial, async (req, res) => {
  const parsed = z.object({
    tenantId: opaque,
    amountCents: z.number().int().positive(),
    reference: z.string().min(1).max(300),
    receivedAt: z.string().datetime(),
    receivingAccountCode: z.string().min(1),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "A payment reference, date, and receiving account are required." });
  }

  const result = await db.transaction(async (tx) => {
    const [invoice] = await tx
      .select()
      .from(engagementInvoicesTable)
      .where(eq(engagementInvoicesTable.id, String(req.params.invoiceId)))
      .limit(1)
      .for("update");
    if (!invoice) return { status: 404 as const, error: "Invoice not found." };
    const found = await scopedEngagement(invoice.engagementId, parsed.data.tenantId);
    if (!found) return { status: 404 as const, error: "Invoice not found." };
    if (invoice.status !== "approved") {
      return { status: 409 as const, error: "Payments require an approved invoice." };
    }
    const [account] = await tx
      .select()
      .from(bookkeeperAccountsTable)
      .where(eq(bookkeeperAccountsTable.code, parsed.data.receivingAccountCode))
      .limit(1);
    if (!validReceivingAccount(account)) {
      return { status: 409 as const, error: "Receiving account must be an active normal-debit asset." };
    }
    const [costCentre] = found.engagement.costCentreCode
      ? await tx
        .select()
        .from(bookkeeperCostCentresTable)
        .where(and(
          eq(bookkeeperCostCentresTable.code, found.engagement.costCentreCode),
          eq(bookkeeperCostCentresTable.isActive, true),
        ))
        .limit(1)
      : [];
    if (!costCentre) return { status: 409 as const, error: "Project cost centre is missing or inactive." };

    const prior = await tx
      .select()
      .from(engagementPaymentsTable)
      .where(eq(engagementPaymentsTable.invoiceId, invoice.id));
    if (hasDuplicatePaymentReference(prior, parsed.data.reference)) {
      return { status: 409 as const, error: "Duplicate payment reference for this invoice." };
    }
    const overpaid = paymentNeedsManualReview(
      invoice.amountCents,
      prior.reduce((sum, payment) => sum + payment.amountCents, 0),
      parsed.data.amountCents,
    );
    const [payment] = await tx
      .insert(engagementPaymentsTable)
      .values({
        invoiceId: invoice.id,
        amountCents: parsed.data.amountCents,
        reference: parsed.data.reference,
        receivingAccountCode: parsed.data.receivingAccountCode,
        receivedAt: new Date(parsed.data.receivedAt),
      })
      .onConflictDoNothing()
      .returning();
    if (!payment) return { status: 409 as const, error: "Duplicate payment reference for this invoice." };

    const [invoicePosting] = await tx
      .select()
      .from(engagementPostingRequestsTable)
      .where(eq(engagementPostingRequestsTable.invoiceId, invoice.id))
      .orderBy(desc(engagementPostingRequestsTable.createdAt))
      .limit(1);
    const payable = !overpaid && invoicePosting?.status === "posted" && invoicePosting.debitAccountCode;
    const [posting] = await tx
      .insert(engagementPostingRequestsTable)
      .values({
        paymentId: payment.id,
        status: payable ? "pending" : "manual_review",
        reason: overpaid
          ? "Payment exceeds the cumulative invoice balance."
          : payable
            ? null
            : "Invoice posting is not posted with a receivable account.",
        debitAccountCode: parsed.data.receivingAccountCode,
        creditAccountCode: invoicePosting?.debitAccountCode ?? null,
        costCentreCode: found.engagement.costCentreCode,
      })
      .returning();
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: invoice.engagementId,
      action: overpaid ? "payment.manual_review" : "payment.recorded",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { paymentId: payment.id, postingRequestId: posting.id, overpaid },
    });
    if (!overpaid) await queueEngagementOutbound(tx, parsed.data.tenantId, invoice.engagementId, "payment.recorded", {
      engagementId: invoice.engagementId, paymentId: payment.id, invoiceId: invoice.id, amountCents: payment.amountCents, reference: payment.reference,
    }, req.bookkeeperUser!.email);
    return { status: 201 as const, body: { payment, postingRequest: posting } };
  });
  if ("error" in result) return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.body);
});

router.post("/payments/:paymentId/reconcile", financial, async (req, res) => {
  const parsed = z.object({ tenantId: opaque }).safeParse(req.body);
  if (!parsed.success) return badTenant(res);
  const result = await db.transaction(async (tx) => {
    const [payment] = await tx
      .select()
      .from(engagementPaymentsTable)
      .where(eq(engagementPaymentsTable.id, String(req.params.paymentId)))
      .limit(1);
    if (!payment) return { status: 404 as const, error: "Payment not found." };
    const [invoice] = await tx
      .select()
      .from(engagementInvoicesTable)
      .where(eq(engagementInvoicesTable.id, payment.invoiceId))
      .limit(1);
    const found = invoice && await scopedEngagement(invoice.engagementId, parsed.data.tenantId);
    if (!found) return { status: 404 as const, error: "Payment not found." };
    const requests = await tx
      .select()
      .from(engagementPostingRequestsTable)
      .where(eq(engagementPostingRequestsTable.paymentId, payment.id));
    if (!canReconcile(requests)) {
      return {
        status: 409 as const,
        error: "Payment cannot be reconciled until its posting request links to a posted ledger transaction.",
      };
    }
    const [updated] = await tx
      .update(engagementPaymentsTable)
      .set({ reconciledAt: new Date() })
      .where(eq(engagementPaymentsTable.id, payment.id))
      .returning();
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: found.engagement.id,
      action: "payment.reconciled",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { paymentId: updated.id },
    });
    return { status: 200 as const, body: updated };
  });
  if ("error" in result) return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.body);
});

router.post("/posting-requests/:postingRequestId/post", financial, async (req, res) => {
  const parsed = z.object({
    tenantId: opaque,
    postedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    reference: z.string().min(1).max(300).optional(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid posting ceremony request." });

  const result = await db.transaction(async (tx) => {
    const [posting] = await tx
      .select()
      .from(engagementPostingRequestsTable)
      .where(eq(engagementPostingRequestsTable.id, String(req.params.postingRequestId)))
      .limit(1)
      .for("update");
    if (!posting) return { status: 404 as const, error: "Posting request not found." };
    if (!canPostControlledRequest(posting.status, posting.accountingTransactionId)) {
      return { status: 409 as const, error: "Only an unposted pending request may be posted." };
    }

    let engagementId: string;
    let amountCents: number;
    let debitAccountCode = posting.debitAccountCode;
    let creditAccountCode = posting.creditAccountCode;
    let expectedDebitType: "invoice" | "payment";
    if (posting.invoiceId) {
      const [invoice] = await tx.select().from(engagementInvoicesTable)
        .where(eq(engagementInvoicesTable.id, posting.invoiceId)).limit(1);
      if (!invoice) return { status: 409 as const, error: "Invoice posting request has no invoice." };
      engagementId = invoice.engagementId;
      amountCents = invoice.amountCents;
      expectedDebitType = "invoice";
    } else if (posting.paymentId) {
      const [payment] = await tx.select().from(engagementPaymentsTable)
        .where(eq(engagementPaymentsTable.id, posting.paymentId)).limit(1);
      if (!payment) return { status: 409 as const, error: "Payment posting request has no payment." };
      const [invoice] = await tx.select().from(engagementInvoicesTable)
        .where(eq(engagementInvoicesTable.id, payment.invoiceId)).limit(1);
      if (!invoice) return { status: 409 as const, error: "Payment invoice is missing." };
      engagementId = invoice.engagementId;
      amountCents = payment.amountCents;
      expectedDebitType = "payment";
      const [invoicePosting] = await tx.select().from(engagementPostingRequestsTable)
        .where(and(
          eq(engagementPostingRequestsTable.invoiceId, invoice.id),
          eq(engagementPostingRequestsTable.status, "posted"),
        ))
        .orderBy(desc(engagementPostingRequestsTable.createdAt))
        .limit(1);
      if (!canPostPaymentAgainstInvoice(invoicePosting)) {
        return { status: 409 as const, error: "Payment posting requires a posted invoice receivable posting." };
      }
      creditAccountCode = invoicePosting.debitAccountCode;
    } else {
      return { status: 409 as const, error: "Posting request is not linked to an invoice or payment." };
    }

    const [engagement] = await tx.select({ engagement: engagementsTable, organization: engagementOrganizationsTable })
      .from(engagementsTable)
      .innerJoin(engagementOrganizationsTable, eq(engagementsTable.organizationId, engagementOrganizationsTable.id))
      .where(and(
        eq(engagementsTable.id, engagementId),
        eq(engagementOrganizationsTable.tenantOpaqueId, parsed.data.tenantId),
      ))
      .limit(1);
    if (!engagement) return { status: 404 as const, error: "Posting request not found." };
    if (!debitAccountCode || !creditAccountCode || !engagement.engagement.costCentreCode) {
      return { status: 409 as const, error: "Posting request lacks controlled account or cost centre data." };
    }
    const accounts = await tx.select().from(bookkeeperAccountsTable)
      .where(inArray(bookkeeperAccountsTable.code, [debitAccountCode, creditAccountCode]));
    const [costCentre] = await tx.select().from(bookkeeperCostCentresTable)
      .where(and(
        eq(bookkeeperCostCentresTable.code, engagement.engagement.costCentreCode),
        eq(bookkeeperCostCentresTable.isActive, true),
      ))
      .limit(1);
    const validAccounts = expectedDebitType === "invoice"
      ? validInvoiceAccounts(accounts, creditAccountCode, debitAccountCode)
      : validReceivingAccount(accounts.find((account) => account.code === debitAccountCode))
        && validReceivingAccount(accounts.find((account) => account.code === creditAccountCode));
    if (!validAccounts || !costCentre) {
      return { status: 409 as const, error: "Controlled accounts or project cost centre are invalid." };
    }
    const [transaction] = await tx.insert(bookkeeperTransactionsTable).values({
      postedDate: parsed.data.postedDate ?? new Date().toISOString().slice(0, 10),
      description: `Engagement ${expectedDebitType} posting`,
      reference: parsed.data.reference ?? `ENG-POST:${posting.id}`,
      status: "posted",
      createdById: req.bookkeeperUser!.id,
      createdByEmail: req.bookkeeperUser!.email,
    }).returning();
    await tx.insert(bookkeeperTransactionLinesTable).values(
      controlledPostingLines(amountCents, debitAccountCode, creditAccountCode, engagement.engagement.costCentreCode)
        .map((line) => ({ ...line, transactionId: transaction.id })),
    );
    const [updated] = await tx.update(engagementPostingRequestsTable)
      .set({ status: "posted", accountingTransactionId: transaction.id, debitAccountCode, creditAccountCode })
      .where(and(
        eq(engagementPostingRequestsTable.id, posting.id),
        eq(engagementPostingRequestsTable.status, "pending"),
      ))
      .returning();
    if (!updated) throw new Error("Posting request changed during controlled posting.");
    await tx.insert(engagementAuditEventsTable).values({
      engagementId,
      action: "posting_request.posted",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { postingRequestId: posting.id, accountingTransactionId: transaction.id },
    });
    return { status: 201 as const, body: { postingRequest: updated, transaction } };
  });
  if ("error" in result) return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.body);
});

router.get("/:id", operator, async (req, res) => {
  const tenantId = tenant(req);
  if (!tenantId) return badTenant(res);
  const found = await scopedEngagement(String(req.params.id), tenantId);
  if (!found) return res.status(404).json({ error: "Engagement not found." });
  const engagement = found.engagement;
  const [scopes, milestones, changes, handoffs, invoices, payments, timeline, integrationConfig] = await Promise.all([
    db.select().from(engagementScopeVersionsTable)
      .where(eq(engagementScopeVersionsTable.engagementId, engagement.id))
      .orderBy(asc(engagementScopeVersionsTable.version)),
    db.select().from(engagementMilestonesTable)
      .where(eq(engagementMilestonesTable.engagementId, engagement.id)),
    db.select().from(engagementChangeOrdersTable)
      .where(eq(engagementChangeOrdersTable.engagementId, engagement.id)),
    db.select().from(engagementHandoffsTable)
      .where(eq(engagementHandoffsTable.engagementId, engagement.id)),
    db.select().from(engagementInvoicesTable)
      .where(eq(engagementInvoicesTable.engagementId, engagement.id)),
    db.select({ payment: engagementPaymentsTable })
      .from(engagementPaymentsTable)
      .innerJoin(engagementInvoicesTable, eq(engagementPaymentsTable.invoiceId, engagementInvoicesTable.id))
      .where(eq(engagementInvoicesTable.engagementId, engagement.id)),
    db.select().from(engagementAuditEventsTable)
      .where(eq(engagementAuditEventsTable.engagementId, engagement.id))
      .orderBy(asc(engagementAuditEventsTable.createdAt)),
    db.select({
      status: engagementTenantIntegrationConfigsTable.status,
      allowedEventTypes: engagementTenantIntegrationConfigsTable.allowedEventTypes,
      allowedPayloadFields: engagementTenantIntegrationConfigsTable.allowedPayloadFields,
      approvedAt: engagementTenantIntegrationConfigsTable.approvedAt,
    })
      .from(engagementTenantIntegrationConfigsTable)
      .where(and(
        eq(engagementTenantIntegrationConfigsTable.tenantOpaqueId, tenantId),
        eq(engagementTenantIntegrationConfigsTable.integration, "z3"),
      ))
      .limit(1),
  ]);
  const paymentRows = payments.map((row) => row.payment);
  const [invoicePostings, paymentPostings] = await Promise.all([
    invoices.length
      ? db.select().from(engagementPostingRequestsTable)
        .where(inArray(engagementPostingRequestsTable.invoiceId, invoices.map((invoice) => invoice.id)))
      : Promise.resolve([]),
    paymentRows.length
      ? db.select().from(engagementPostingRequestsTable)
        .where(inArray(engagementPostingRequestsTable.paymentId, paymentRows.map((payment) => payment.id)))
      : Promise.resolve([]),
  ]);
  return res.json({
    ...engagement,
    organization: found.organization,
    scopes,
    milestones,
    changeOrders: changes,
    handoffs,
    invoices,
    payments: paymentRows,
    postingRequests: [...invoicePostings, ...paymentPostings],
    integration: integrationConfig[0] ?? {
      status: "pending",
      allowedEventTypes: [],
      allowedPayloadFields: {},
      approvedAt: null,
    },
    timeline,
  });
});

router.post("/:id/state", operator, async (req, res) => {
  const parsed = z.object({ tenantId: opaque, state: stateSchema }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid state request." });
  const found = await scopedEngagement(String(req.params.id), parsed.data.tenantId);
  if (!found) return res.status(404).json({ error: "Engagement not found." });

  const result = await db.transaction(async (tx) => {
    const acceptedHandoffs = parsed.data.state === "accepted"
      ? await tx
        .select({ id: engagementHandoffsTable.id })
        .from(engagementHandoffsTable)
        .where(and(
          eq(engagementHandoffsTable.engagementId, found.engagement.id),
          eq(engagementHandoffsTable.status, "accepted"),
        ))
        .limit(1)
      : [];
    const error = transitionGate(
      found.engagement.state,
      parsed.data.state,
      acceptedHandoffs.length > 0,
    );
    if (error) return { status: 409 as const, error };
    const [updated] = await tx
      .update(engagementsTable)
      .set({ state: parsed.data.state, updatedAt: new Date() })
      .where(and(
        eq(engagementsTable.id, found.engagement.id),
        eq(engagementsTable.state, found.engagement.state),
      ))
      .returning();
    if (!updated) {
      return { status: 409 as const, error: "Engagement state changed concurrently; reload and retry." };
    }
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: updated.id,
      action: "engagement.state_changed",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { from: found.engagement.state, to: updated.state },
    });
    await queueEngagementOutbound(tx, parsed.data.tenantId, updated.id, "engagement.state_changed", {
      engagementId: updated.id, state: updated.state,
    }, req.bookkeeperUser!.email);
    return { status: 200 as const, body: updated };
  });
  if ("error" in result) return res.status(result.status).json({ error: result.error });
  return res.status(result.status).json(result.body);
});

router.post("/:id/milestones", operator, async (req, res) => {
  const parsed = z.object({
    tenantId: opaque,
    title: z.string().min(1).max(300),
    amountCents: z.number().int().positive().optional(),
    dueAt: z.string().datetime().optional(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid milestone." });
  const found = await scopedEngagement(String(req.params.id), parsed.data.tenantId);
  if (!found) return res.status(404).json({ error: "Engagement not found." });
  const row = await db.transaction(async (tx) => {
    const [created] = await tx.insert(engagementMilestonesTable).values({
      engagementId: found.engagement.id,
      title: parsed.data.title,
      amountCents: parsed.data.amountCents ?? null,
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
    }).returning();
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: found.engagement.id,
      action: "milestone.created",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { milestoneId: created.id },
    });
    return created;
  });
  return res.status(201).json(row);
});

router.post("/:id/change-orders", operator, async (req, res) => {
  const parsed = z.object({
    tenantId: opaque,
    description: z.string().min(1).max(5_000),
    amountCents: z.number().int().positive(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid change order." });
  const found = await scopedEngagement(String(req.params.id), parsed.data.tenantId);
  if (!found) return res.status(404).json({ error: "Engagement not found." });
  const row = await db.transaction(async (tx) => {
    const [created] = await tx.insert(engagementChangeOrdersTable).values({
      engagementId: found.engagement.id,
      description: parsed.data.description,
      amountCents: parsed.data.amountCents,
    }).returning();
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: found.engagement.id,
      action: "change_order.requested",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { changeOrderId: created.id },
    });
    return created;
  });
  return res.status(201).json(row);
});

router.post("/:id/handoffs", operator, async (req, res) => {
  const parsed = z.object({
    tenantId: opaque,
    acceptanceCriteria: z.record(z.string(), z.unknown()),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid handoff." });
  const found = await scopedEngagement(String(req.params.id), parsed.data.tenantId);
  if (!found) return res.status(404).json({ error: "Engagement not found." });
  const row = await db.transaction(async (tx) => {
    const [created] = await tx.insert(engagementHandoffsTable).values({
      engagementId: found.engagement.id,
      acceptanceCriteria: parsed.data.acceptanceCriteria,
    }).returning();
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: found.engagement.id,
      action: "handoff.created",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { handoffId: created.id },
    });
    await queueEngagementOutbound(tx, parsed.data.tenantId, found.engagement.id, "handoff.created", {
      engagementId: found.engagement.id, handoffId: created.id, acceptanceCriteria: created.acceptanceCriteria,
    }, req.bookkeeperUser!.email);
    return created;
  });
  return res.status(201).json(row);
});

router.post("/:id/invoices", financial, async (req, res) => {
  const parsed = z.object({
    tenantId: opaque,
    amountCents: z.number().int().positive(),
    milestoneId: id.optional(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid invoice." });
  const found = await scopedEngagement(String(req.params.id), parsed.data.tenantId);
  if (!found) return res.status(404).json({ error: "Engagement not found." });
  const result = await db.transaction(async (tx) => {
    if (parsed.data.milestoneId) {
      const [milestone] = await tx.select({ id: engagementMilestonesTable.id })
        .from(engagementMilestonesTable)
        .where(and(
          eq(engagementMilestonesTable.id, parsed.data.milestoneId),
          eq(engagementMilestonesTable.engagementId, found.engagement.id),
        ))
        .limit(1);
      if (!milestone) return { error: "Milestone is not part of this engagement." };
    }
    const [created] = await tx.insert(engagementInvoicesTable).values({
      engagementId: found.engagement.id,
      amountCents: parsed.data.amountCents,
      milestoneId: parsed.data.milestoneId ?? null,
    }).returning();
    await tx.insert(engagementAuditEventsTable).values({
      engagementId: found.engagement.id,
      action: "invoice.drafted",
      actorType: "operator",
      actorReference: req.bookkeeperUser!.email,
      payload: { invoiceId: created.id },
    });
    return { created };
  });
  if ("error" in result) return res.status(422).json({ error: result.error });
  return res.status(201).json(result.created);
});

router.get("/:id/timeline", operator, async (req, res) => {
  const tenantId = tenant(req);
  if (!tenantId) return badTenant(res);
  const found = await scopedEngagement(String(req.params.id), tenantId);
  if (!found) return res.status(404).json({ error: "Engagement not found." });
  const rows = await db
    .select()
    .from(engagementAuditEventsTable)
    .where(eq(engagementAuditEventsTable.engagementId, found.engagement.id))
    .orderBy(asc(engagementAuditEventsTable.createdAt));
  return res.json(rows);
});

export default router;