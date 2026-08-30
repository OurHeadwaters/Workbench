import crypto from "node:crypto";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { and, eq, inArray, isNull, lte, or } from "drizzle-orm";
import {
  db,
  engagementAuditEventsTable,
  engagementIntegrationOutboxTable,
  engagementTenantIntegrationConfigsTable,
  engagementOrganizationsTable,
  engagementsTable,
} from "@workspace/db";

const MAX_ATTEMPTS = 8;
const LEASE_MS = 5 * 60 * 1000;
type Resolver = typeof lookup;

function ipv4Number(address: string): number {
  return address.split(".").reduce((value, part) => (value * 256 + Number(part)) >>> 0, 0);
}

function inV4(address: string, base: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ipv4Number(address) & mask) === (ipv4Number(base) & mask);
}

export function isGlobalOutboundAddress(address: string): boolean {
  const mapped = address.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  if (mapped) return isGlobalOutboundAddress(mapped);
  if (isIP(address) === 4) {
    return ![
      ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
      ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24],
      ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24],
      ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
    ].some(([base, bits]) => inV4(address, String(base), Number(bits)));
  }
  if (isIP(address) === 6) {
    const value = address.toLowerCase();
    return !(value === "::" || value === "::1"
      || /^(fc|fd)/.test(value) || /^fe[89ab]/.test(value) || /^ff/.test(value)
      || value.startsWith("2001:db8:") || value.startsWith("2001:2:")
      || value.startsWith("100:") || value.startsWith("2001:10:"));
  }
  return false;
}

export async function resolvePublicOutboundHost(hostname: string, resolver: Resolver = lookup): Promise<boolean> {
  try {
    const addresses = await resolver(hostname, { all: true, verbatim: true });
    return addresses.length > 0 && addresses.every(({ address }) => isGlobalOutboundAddress(address));
  } catch {
    return false;
  }
}

export function allowedOutboundUrl(raw: string | null | undefined, allowlist = process.env.ENGAGEMENT_OUTBOUND_ALLOWED_HOSTS): string | null {
  if (!raw || !allowlist) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname || url.hostname === "localhost") return null;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname) || url.hostname.includes(":")) return null;
    const allowed = allowlist.split(",").map((host) => host.trim().toLowerCase()).filter(Boolean);
    return allowed.includes(url.host.toLowerCase()) ? url.toString() : null;
  } catch {
    return null;
  }
}

function retryAt(attempt: number): Date {
  return new Date(Date.now() + Math.min(60 * 60 * 1000, 1_000 * 2 ** Math.min(attempt, 10)));
}

function safeError(error: unknown): string {
  if (error instanceof Error) return error.name === "Error" ? error.message.slice(0, 300) : error.name;
  return "Delivery failed";
}

export function deliveryFailure(attempts: number, message: string) {
  const terminal = attempts >= MAX_ATTEMPTS;
  return {
    status: terminal ? "dead_letter" : "failed",
    lastError: message.slice(0, 300),
    claimedAt: null,
    leaseExpiresAt: null,
    nextAttemptAt: terminal ? null : retryAt(attempts),
  };
}

async function finalizeFailure(outboxId: string, attempts: number, message: string) {
  await db.update(engagementIntegrationOutboxTable)
    .set(deliveryFailure(attempts, message))
    .where(eq(engagementIntegrationOutboxTable.id, outboxId));
}

export async function queueEngagementOutbound(
  tx: any,
  tenantId: string,
  engagementId: string,
  eventType: string,
  payload: Record<string, unknown>,
  actor = "system",
) {
  const [config] = await tx.select().from(engagementTenantIntegrationConfigsTable)
    .where(and(eq(engagementTenantIntegrationConfigsTable.tenantOpaqueId, tenantId), eq(engagementTenantIntegrationConfigsTable.integration, "z3")))
    .limit(1);
  const allowed = config?.status === "enabled"
    && Array.isArray(config.allowedOutboundEventTypes)
    && (config.allowedOutboundEventTypes as string[]).includes(eventType);
  if (allowed) {
    await tx.insert(engagementIntegrationOutboxTable).values({
      engagementId, destination: "z3", eventType, payload,
    });
  } else {
    await tx.insert(engagementAuditEventsTable).values({
      engagementId, action: "outbox.not_queued", actorType: "operator", actorReference: actor,
      payload: { eventType, reason: "Tenant integration is not enabled or event is not approved." },
    });
  }
}

export async function deliverOutboxRow(
  outboxId: string,
  fetcher: typeof fetch = fetch,
  resolver: Resolver = lookup,
): Promise<"sent" | "skipped" | "failed"> {
  const claimed = await db.transaction(async (tx) => {
    const now = new Date();
    const [row] = await tx.select({
      outbox: engagementIntegrationOutboxTable,
      config: engagementTenantIntegrationConfigsTable,
    })
      .from(engagementIntegrationOutboxTable)
      .innerJoin(engagementsTable, eq(engagementIntegrationOutboxTable.engagementId, engagementsTable.id))
      .innerJoin(engagementOrganizationsTable, eq(engagementsTable.organizationId, engagementOrganizationsTable.id))
      .innerJoin(
        engagementTenantIntegrationConfigsTable,
        and(
          eq(engagementTenantIntegrationConfigsTable.tenantOpaqueId, engagementOrganizationsTable.tenantOpaqueId),
          eq(engagementTenantIntegrationConfigsTable.integration, "z3"),
        ),
      )
      .where(and(
        eq(engagementIntegrationOutboxTable.id, outboxId),
        or(
          eq(engagementIntegrationOutboxTable.status, "pending"),
          and(eq(engagementIntegrationOutboxTable.status, "failed"), or(isNull(engagementIntegrationOutboxTable.nextAttemptAt), lte(engagementIntegrationOutboxTable.nextAttemptAt, now))),
          and(eq(engagementIntegrationOutboxTable.status, "delivering"), lte(engagementIntegrationOutboxTable.leaseExpiresAt, now)),
        ),
      ))
      .limit(1)
      .for("update", { skipLocked: true });
    if (!row || row.outbox.attempts >= MAX_ATTEMPTS || row.config.status !== "enabled") return null;
    if (!Array.isArray(row.config.allowedOutboundEventTypes)
      || !(row.config.allowedOutboundEventTypes as string[]).includes(row.outbox.eventType)
      || !row.config.outboundEndpointUrl
      || !row.config.outboundSecretEnvName) return null;
    await tx.update(engagementIntegrationOutboxTable)
      .set({ status: "delivering", attempts: row.outbox.attempts + 1, claimedAt: now, leaseExpiresAt: new Date(now.getTime() + LEASE_MS), nextAttemptAt: null })
      .where(eq(engagementIntegrationOutboxTable.id, outboxId));
    return row;
  });
  if (!claimed) return "skipped";
  const endpoint = allowedOutboundUrl(claimed.config.outboundEndpointUrl);
  if (!endpoint) {
    await finalizeFailure(outboxId, claimed.outbox.attempts + 1, "Outbound destination is not currently allowlisted.");
    return "failed";
  }
  const secret = process.env[claimed.config.outboundSecretEnvName!];
  if (!secret) {
    await finalizeFailure(outboxId, claimed.outbox.attempts + 1, "Configured outbound signing secret is unavailable.");
    return "failed";
  }
  const body = JSON.stringify({ id: claimed.outbox.id, type: claimed.outbox.eventType, payload: claimed.outbox.payload });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = crypto.createHmac("sha256", secret).update(`${timestamp}.`).update(body).digest("hex");
  try {
    const hostname = new URL(endpoint).hostname;
    if (!(await resolvePublicOutboundHost(hostname, resolver))) {
      await finalizeFailure(outboxId, claimed.outbox.attempts + 1, "Outbound hostname did not resolve exclusively to public addresses.");
      return "failed";
    }
    const response = await fetcher(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-engagement-timestamp": timestamp,
        "x-engagement-signature": signature,
        "idempotency-key": claimed.outbox.id,
      },
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });
    if (response.ok) {
      await db.update(engagementIntegrationOutboxTable).set({
        status: "sent", sentAt: new Date(), lastError: null, claimedAt: null, leaseExpiresAt: null,
      }).where(eq(engagementIntegrationOutboxTable.id, outboxId));
      return "sent";
    }
    await finalizeFailure(outboxId, claimed.outbox.attempts + 1, `HTTP ${response.status}`);
    return "failed";
  } catch (error) {
    await finalizeFailure(outboxId, claimed.outbox.attempts + 1, safeError(error));
    return "failed";
  }
}

export async function runEngagementOutboundDeliveries(): Promise<void> {
  const rows = await db.select({ id: engagementIntegrationOutboxTable.id })
    .from(engagementIntegrationOutboxTable)
    .where(inArray(engagementIntegrationOutboxTable.status, ["pending", "failed", "delivering"]))
    .limit(25);
  for (const row of rows) await deliverOutboxRow(row.id);
}