# 807 integration agent questionnaire

## Current verified response

The 807-side project has confirmed:

- Canonical legal name: **807 Food Co-operative Inc.**
- The current local tenant slug is `807`, but no immutable cross-system tenant
  key exists yet. The local slug must not be entered into the Headwaters ledger
  as if it were the final integration key.
- Clerk is authoritative for people and board/admin roles. Machine credentials
  are separate, scoped, revocable server-to-server credentials.
- PostgreSQL/Drizzle, Square, Local Line, Resend, and Clerk remain authoritative
  for their respective operational concerns.
- 807 finance remains separate from Headwaters Books. Only invoice references,
  status, approved amount summaries, and payment-authority evidence may cross.
- Publication permission for names, screenshots, metrics, outcomes, or
  case-study details has not been recorded.
- The tenant-side implementation is intended to be white-label: 807 is the
  first proof, never the default inherited by a later co-op.

The adapter remains **not enabled** until the unresolved items below are
approved. The 807-side board workflow should present each unresolved item in
plain language with approve, reject, defer, and approve-with-conditions choices.
Approved answers may configure that tenant only; they must never become defaults
for another tenant.

Before enabling an 807 connection, answer and record:

1. What stable **opaque tenant ID** will 807 send? Confirm it is not a member,
   household, wallet, email, or derivable identifier.
2. Which above-board organization name and address should the operator register?
3. Who owns the shared HMAC secret, how is it rotated, and what is the incident
   contact? Never put the secret in an event body.
4. Which of the contract allowlisted event types are needed? Provide one
   redacted payload example for each.
5. What provider event id is stable across retries and replays?
6. Can 807 retry with identical bytes and timestamp/signature semantics?
7. What evidence URLs or objects are supplied, and are they authorized for
   operator access? Do not send personal/member records.
8. What handoff acceptance/rejection semantics and rejection note limits apply?
9. Which outbound events are required, where are they delivered, and how is
   delivery authenticated and idempotently acknowledged?
10. Confirm 807 will never request automatic invoice approval, accounting
    posting, payment creation, or a query path from Z3 to Z1.

Integration approval requires a named operator to confirm all answers and test
one duplicate event, one bad signature, and one tenant mismatch in a non-live
environment.

## Still requiring human decisions

- Immutable cross-system tenant key
- Contracting and invoicing signers
- Scope requester, scope approver, delivery acceptor, and payment authority
- Whether one person may hold more than one approval power
- Exact inbound and outbound field allowlists
- Credential rotation, revocation, retention, deletion, backup, and incident rules
- Staging and production-promotion ownership
- Mandatory accessibility, language, mobile, and low-bandwidth standards
- Exact brand and case-study permission