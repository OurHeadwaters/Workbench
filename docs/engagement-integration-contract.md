# Engagement integration contract

## Boundary

The Aquifer owns the engagement ledger. An integrating Zone 3 service supplies
only an opaque `tenantId` plus above-board organization activity. It must not
send household, member, wallet, or derived identity fields. `tenantId` is
opaque and is matched exactly to the organization registered by an operator.

## Inbound event envelope

`POST /api/engagements/webhooks/z3` accepts JSON:

```json
{"id":"provider-event-id","tenantId":"opaque-tenant-id","type":"milestone.evidence","engagementId":"uuid","payload":{}}
```

Headers:

* `X-Engagement-Timestamp`: Unix seconds
* `X-Engagement-Signature`: lowercase hex HMAC-SHA256 of
  `timestamp + "." + raw request body`, using the shared secret.

Consumers must retry the same event `id` after a transport failure. The server
deduplicates on `(integration, id)` and returns the original acknowledgement.
Events older/newer than five minutes are rejected. Allowed types are:
`build.acknowledged`, `milestone.evidence`, `milestone.status`,
`change.request`, `handoff.accepted`, and `handoff.rejected`.

`handoff.accepted` and `handoff.rejected` require the exact handoff UUID in
`payload.handoffId`. The handoff must belong to the envelope's `engagementId`;
the server updates only that handoff and rejects missing, malformed, or
cross-engagement identifiers.

## Tenant enablement and approvals

Inbound Z3 traffic is denied until an owner enables that tenant's Z3
integration configuration. Enablement records the explicitly approved event
types and the exact allowed payload keys for each type; extra keys are
rejected before an inbox row is stored. Ledger organizations may be created
while an integration remains `pending`, but `pending` and `suspended` tenants
cannot send inbound events. Tenant `807` remains pending: its immutable key
and required board approvals are unresolved.

Owners configure it with
`PUT /api/engagements/tenants/:tenantId/integrations/z3` and
`{ status: "pending"|"enabled"|"suspended", allowedEventTypes: string[], allowedPayloadFields: { [eventType]: string[] } }`.
Enabling records the approving operator and time. Enabled outbound delivery also
requires an HTTPS `outboundEndpointUrl`, an `outboundSecretEnvName` (a server
environment-variable reference, never the secret itself), and
`allowedOutboundEventTypes`.
The endpoint hostname (and optional explicit port) must exactly match the
server-side `ENGAGEMENT_OUTBOUND_ALLOWED_HOSTS` allowlist. Localhost, IP
literals, private/reserved destinations, userinfo, redirects, and any
non-HTTPS URL are rejected; delivery checks the allowlist again each time.
Immediately before fetch, the worker resolves every DNS answer and fails closed
if resolution fails or any IPv4/IPv6 result is non-global (including loopback,
private, link-local, carrier-grade NAT, documentation, benchmark, multicast,
unspecified, unique-local, and IPv4-mapped private space). The validation is
adjacent to fetch; the current fetch runtime does not expose address pinning,
so this narrows but does not claim to eliminate the DNS rebinding interval.

## Controlled posting ceremony

`POST /api/engagements/posting-requests/:postingRequestId/post` is restricted
to owner/bookkeeper roles and requires `{ tenantId, postedDate?, reference? }`.
It posts one pending controlled request atomically into `bk_transactions` and
two balanced `bk_transaction_lines`, using the engagement cost centre. Invoice
requests debit their stored receivable and credit revenue; payment requests
require the invoice's already-posted receivable request, debit the receiving
asset, and credit that receivable. It never calculates tax or changes invoice
amounts.

Inbound events never approve invoices, post accounting, or create payments.
Those operations remain authenticated operator ceremonies.

## Outbound delivery

Outbox rows are durable and expose `pending`, `sent`, `failed`, `delivering`,
and terminal `dead_letter` states, attempt count, and a safe error summary.
Delivery is default-denied for pending/suspended tenants and unapproved event
types. The worker signs the exact JSON body with the configured environment
secret, sends the outbox UUID as `Idempotency-Key`, accepts only 2xx, and never
logs response bodies or secrets. An operator retry invokes real delivery.
Workers lease rows while delivering, recover only expired leases after a
restart, use a bounded request timeout, apply exponential retry delay, and
dead-letter after the configured attempt limit.

## Accounting boundary

Invoice approval and payment recording create explicit posting requests. A
bookkeeper must select existing active chart-of-account codes and post balanced
`bk_transactions` lines before a request can be marked `posted`. If an account
or cost centre is unavailable, it is `manual_review`; no guessed tax, revenue,
or recognition entries are permitted.

## Operator API contract

Every authenticated operator call carries `tenantId` in its JSON body (mutations)
or query string (reads). It is authorization-scoped using the durable
`engagement_tenant_operators` mapping; it is not trusted merely because it was
provided. Owners bootstrap access with `POST /api/engagements/tenants/attach`
using `{ tenantId, bookkeeperUserId }`.

`POST /api/engagements/convert-quote` now ignores client supplied title and
scope language: its project title, immutable quote snapshot, and initial scope
derive from the still-valid standard `quoteRequestId`. Repeating a conversion
returns `{ id, duplicate: true }`. Invoice approval requires
`revenueAccountCode` and `receivableAccountCode`; payment recording requires
`receivingAccountCode`, `reference`, and ISO `receivedAt`. Financial routes are
owner/bookkeeper-only. Reconciliation returns conflict until a controlled
posting request has a linked `posted` ledger transaction.
