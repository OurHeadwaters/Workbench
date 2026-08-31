# 807 board FAQ: a secure connection when funding allows

## Purpose of this pre-read

This FAQ is written for the 807 board agenda. It explains the proposed secure
connection in ordinary language so the board can approve the boundaries before
any technical setup begins.

The board is **not** being asked to approve a hostname, signing secret, API
credential, or immediate launch. Those belong in private technical
configuration and a later staging test.

This document uses “the external service” for the proposed connection. The
board should use the final service name in its motion only after the contracting
and technical owners confirm it.

## What is the decision?

**Should 807 approve a secure, limited connection with the external service,
to be configured later when funding and people are available?**

The connection would support the agreed work between 807 and Headwaters without
giving either side unrestricted access to the other side’s systems.

The board can choose:

1. **Approve** the connection within the boundaries listed below.
2. **Approve subject to stated changes** and list those changes in the minutes.
3. **Decline or defer** the decision until a named condition is met.

## Why might this help 807?

A connection could reduce repeated copying and make an approved engagement
easier to coordinate. It could allow the two projects to exchange only the
specific work updates and delivery evidence that 807 has approved.

It would not replace 807’s own systems or transfer control of 807’s operations.
807 would continue to control its people, roles, content, operational records,
and decisions about whether delivered work is accepted.

## What is confirmed today?

- The legal name is **807 Food Co-operative Inc.**
- `807` is a current local project slug, not the final immutable cross-system
  identifier.
- People and board/admin roles remain authoritative in 807’s identity system.
- 807’s operational systems remain authoritative for 807 operations.
- 807 finance remains separate from Headwaters’ books.
- Permission to publish 807 names, screenshots, metrics, outcomes, or
  case-study details has not been recorded.
- The connection is not enabled.

These facts are a starting point, not a substitute for the board’s decision.

## What information would move?

Only approved, above-board organization and engagement information should move.
The final field list must be approved before enablement.

### Information that may be considered

- The agreed cross-system tenant identifier
- 807’s approved organization identity and contact boundary
- Engagement, milestone, change-request, and handoff identifiers
- Approved scope or delivery status
- Evidence that 807 has authorized for the connection
- Acceptance or rejection of a specifically identified handoff
- Limited invoice status, invoice reference, approved amount summary, and
  payment-authority evidence where the contract requires it

### Information that must not move through this connection

- Household, member, wallet, or derived-identity information
- Passwords, signing secrets, API keys, or other credentials
- Unapproved personal information
- Full operational databases or unrestricted account access
- Automatic payment instructions or authority to post accounting entries
- Any name, screenshot, metric, outcome, or case study that 807 has not
  explicitly permitted for publication

The final approved field list should be recorded with the board decision. It
should be narrow enough that a new field requires a new approval.

## Who may do what?

The board should approve named roles, not just a general promise that “someone”
will manage the connection.

At minimum, the decision should identify who may:

- request work;
- approve or change scope;
- accept or reject delivery;
- approve payment-related evidence;
- revoke or suspend the connection; and
- act as the incident contact.

The board should also say whether one person may hold more than one of these
powers. Until that is explicitly approved, the safer rule is to keep the powers
separate.

## Where would the information be stored?

The information would remain in the systems responsible for it:

- 807 keeps authority over its operational and governance information;
- Headwaters keeps authority over its engagement ledger, quotes, contracts,
  billing records, and books; and
- only the approved cross-system summaries and event records are mirrored.

The board should require a written retention, deletion, backup, and incident
plan before go-live. The board should not approve indefinite retention by
default.

## How can 807 stop or revoke the connection?

807 should be able to suspend or revoke the connection without waiting for a
contract redesign. The operating procedure should include:

1. who can request an emergency suspension;
2. who can approve a normal suspension or revocation;
3. how credentials are rotated or disabled;
4. what happens to queued messages and stored copies;
5. how the other party confirms that access has stopped; and
6. how an incident or suspected misuse is reported to the named contact.

No connection should be enabled until these steps have an owner and a test
result.

## What accessibility, privacy, and publication limits apply?

The connection and its approval materials should meet 807’s required
accessibility, language, mobile, and low-bandwidth standards.

Privacy limits should be written as an allowlist: name the permitted information
instead of saying “relevant data.” Publication permission is separate from
operational sharing. Approval to operate the connection does **not** grant
permission to use 807’s name, branding, images, metrics, or outcomes publicly.

## What happens if funding is not available yet?

The board can approve the intended boundaries now and defer technical
configuration until funding, staffing, and a technical owner are available.
Alternatively, it can defer the entire decision.

The current commercial model is a **working policy**, not yet an approved
canonical commitment. For planning, Year 1 is a $20,000 Codetry engagement plus
the base build using the current strategic plan. Year 2 is a separate $20,000
engagement for an additional layer plus a new annual strategic plan supporting
board and training implementation. The normal $6,000 annual operating fee is
waived only while an active annual engagement qualifies; it is $0 during that
period and is not added to Year 2.

Those amounts describe proposed grant-supported project work. They do not
record a funding award, sponsorship, unrestricted 807 operating revenue, or
permission to publish 807 material. Before any engagement is approved, the
written scope must name the payer, eligible costs, restrictions, matching
requirements, timing, and reporting obligations. A commercial decision becomes
canonical only after it is formally recorded by the authorized parties.

If the board approves boundaries now:

- no connection is turned on automatically;
- no credentials are placed in board minutes;
- no technical endpoint is treated as approved until verified;
- the approval remains subject to the staging test; and
- a separate go-live confirmation is required after staging succeeds.

## What happens after a board approval?

The sequence should be:

1. Record the board’s outcome, conditions, role assignments, data allowlist,
   retention rules, and revocation owner.
2. Confirm the contracting and invoicing entities and authorized signers.
3. Confirm the immutable cross-system tenant key. The local slug `807` is not
   sufficient by itself.
4. Confirm the exact inbound and outbound event and field allowlists.
5. Have the technical owner configure private credentials and the approved
   destination outside the board record.
6. Run a non-live staging test for duplicate delivery, invalid signatures,
   tenant mismatch, rejection, suspension, and revocation.
7. Review the staging evidence with 807.
8. Hold a separate go-live confirmation. Board approval of the boundaries is
   not the same as go-live approval.

## What is still unresolved for 807?

The board or authorized 807 decision-makers still need to settle:

- the immutable cross-system tenant key;
- contracting and invoicing signers;
- request, scope, acceptance, and payment authorities;
- whether one person may hold multiple powers;
- exact inbound and outbound field and event allowlists;
- retention, deletion, backup, incident, and revocation requirements;
- staging and production-promotion ownership;
- accessibility, language, mobile, and low-bandwidth requirements; and
- brand and case-study permission.

The current response confirms the legal name, but it does not settle these
remaining decisions.

## Suggested agenda motion

> **Resolved that 807 Food Co-operative Inc. approves planning for a secure,
> limited connection with the external service, subject to the boundaries and
> conditions recorded in this pre-read and the following amendments:**
>
> - Approved information:
> - Prohibited information:
> - Authorized request, scope, acceptance, and payment roles:
> - Retention and deletion rule:
> - Suspension and revocation owner:
> - Accessibility and privacy conditions:
> - Conditions that must be completed before staging:
> - Conditions that must be completed before go-live:
>
> **Resolved that private technical credentials and infrastructure details will
> not be recorded in the board minutes, and that a separate go-live decision is
> required after a successful staging test.**

## Suggested minutes record

Record:

- the date and meeting;
- the motion and outcome;
- who was present and whether quorum was met;
- each approved boundary and condition;
- each deferred or declined item and its owner;
- the staging owner and expected evidence; and
- the person responsible for bringing the separate go-live confirmation.

Do not record:

- signing secrets;
- API keys or passwords;
- private endpoint details;
- unrestricted data-export instructions; or
- a statement that 807 has approved publication when it has not.

## Related technical checklist

After the board has recorded its boundaries, the technical owner can complete
the private connection checklist in
[`807-agent-questionnaire.md`](./807-agent-questionnaire.md). The current
implementation keeps the 807 adapter pending until the immutable key, approved
allowlists, and other human decisions are recorded.