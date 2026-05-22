# Schema Notes — North Star

## The Eave Rule (Governing Constraint) — Two-Gate Constitutional Model

> **Plain-language companion:** `docs/zones-gates-reference.md` explains the underlying model — what zones, gates, and membranes are, why they exist, and what they look like in practice — without prescribing any specific implementation. Read it alongside this document to understand the *why* behind each constraint.


> The Eave is the protective overhang and hard structural seam that shelters Zone 1 (Circle — private household identity) and Zone 2 (Workbench — operational practitioner layer) from Zone 3 (Community — XRPL wallet, above-board organizational identity).
> It is defined by intentional architectural absence with two controlled gates:
>
> **Z1–Z3 absolute prohibition:** No direct or composable path may ever connect a Zone 3 wallet address, derived identifier, zone-bind payload, or zone-bind signature to any Zone 1 household record (name + passphrase identity). This includes any path that traverses Zone 2 as an intermediate hop.
>
> **Z2–Z3 Gate:** Contractor identification may appear in controlled, auditable form at the crossing (e.g. for contracts or audit events), but must not persist as a stored reference inside Z2-scoped records (DailyPick, Contract, or equivalent). The giraffe (audit / regulatory visibility) may have sight across this gate, but the audit query shape must not be composable into a Z3 → Z1 reverse lookup.
>
> **Z1–Z2 Gate:** Household context may cross in controlled form (enough to know whose work this is), but remains gated and does not expose private identity outward toward Z3.
>
> A household may voluntarily bind its own XRPL wallet using `lib/zone-identity` primitives, stored as a one-way, non-reversible reference. The binding never permits reverse lookup.
>
> Any proposed feature, route, migration, or type field that violates these constraints — including the existing `linkedFamilyId` and `linkedShareToken` fields on the `Constellation` type — must be refused or redesigned to respect both gates and the absolute Z1–Z3 prohibition.

---

## Gate UI Implementation — Today Page (Constellation Picker)

> **Source:** `docs/zones-gates-reference.md` § "What a Gate Looks Like in Practice"

The constellation picker on the Today page is the first place where zone-crossing becomes a lived moment. Constellations are sorted by zone order (Z0 → Z1 → Z2 → Z3 → Z4 → Z5), and a visible, named gate marker is rendered at each constitutional boundary when both sides of the crossing are present in the active constellation list.

### Z1→Z2 Gate — Entering the Workbench

Rendered between the last Z1 constellation and the first Z2 constellation. Derived from the reference doc's description of the Z1–Z2 gate: *"a consent step, a role switch, a session context change that establishes 'I am now working as a practitioner.'"*

The gate marker reads: **"Z1 → Z2 · Entering the Workbench"** with the subtitle *"Work below is attributed to your household. Your private identity stays in Z1."*

### Z2→Z3 Gate — Community Crossing

Rendered between the last Z2 constellation and the first Z3 constellation. Derived from: *"a credential presented at the crossing but not stored inside the operational record."*

The gate marker reads: **"Z2 → Z3 · Community Crossing"** with the subtitle *"Z3 identifiers may appear at this crossing but are not stored inside Z2 records."*

### Component

`src/components/ZoneGate.tsx` — contains both gate variants. The component's header comment cites `docs/zones-gates-reference.md` as the explicit source and quotes the reference doc's language for each crossing type.

---

## Gate Definitions

### Z1–Z3 Absolute Prohibition

This is not a gate — it is a wall with no door. There is no form, controlled or otherwise, in which a Zone 3 wallet address, derived identifier, zone-bind payload, or zone-bind signature may be connected to a Zone 1 household record. Zone 2 does not dissolve this prohibition: any path that routes through the Workbench as an intermediate hop to achieve a Z3→Z1 traversal is equally forbidden.

### Z2–Z3 Gate — Controlled Crossing for Contractor Identification

**What may appear at the crossing:** A contractor's Zone 3 identifier (e.g. wallet address or above-board organizational identity) may be present in an audit event, contract record header, or regulatory log entry at the moment of crossing. This is the "giraffe" position — visible from above for audit and regulatory purposes.

**What must not persist inside Z2 records:** The contractor identifier must not be stored as a field on any Z2-scoped record — no `contractorWalletAddress`, no `z3Id`, no derived token — on `DailyPick`, `Contract`, or any equivalent Z2 entity. Once the crossing event is recorded, the reference lives in the audit/event layer only, not in the operational record itself.

**Audit query shape constraint (the giraffe constraint):** Audit visibility across this gate is permitted, but the shape of any audit query must not be composable into a Z3 → Z1 reverse lookup. Concretely: it must not be possible to start with a wallet address, query audit events at the Z2–Z3 gate, and arrive at a household name or passphrase identity — even across multiple hops or joined queries.

### Z1–Z2 Gate — Controlled Crossing for Household Context

**What may appear at the crossing:** Enough household context to establish whose work this is — for example, a `household_id` reference that gates which Z2 records belong to which household. This is necessary for operational correctness (a contractor's DailyPick must be attributable to a household).

**What must not cross outward:** The gate is directional. Household context flows inward (Z1 → Z2) to scope work, but private identity — name, passphrase, or any field that resolves back to the human identity behind the household — must not be exposed outward toward Z3. The gate does not carry private identity forward.

---

## Intended `zone_bindings` Table

This table does not yet exist. When it is created, the following rules apply unconditionally.

### Purpose

Record a household's voluntary, self-initiated binding of its own XRPL wallet to its Zone 3 identity. The binding is one-way and non-reversible.

### Permitted columns

| Column | Type | Notes |
|---|---|---|
| `id` | uuid / text PK | Opaque row identifier. Not derived from either identity. |
| `household_id` | text | FK → households table (Zone 1 record). Write-once. The **source** of the binding. |
| `wallet_address` | text | Zone 3 XRPL wallet address. The **target** of the binding. Write-once. |
| `bound_at` | timestamptz | When the household initiated the binding. |
| `zone_bind_payload_hash` | text | A one-way hash of the zone-bind payload. Stored for auditability only; the original payload must not be stored in this table. |

### Explicitly forbidden columns and patterns

- **No column** that allows querying "which household has this wallet address." There must be no unique index, covering index, or inverted lookup on `wallet_address` that returns a household identity.
- **No column** that stores a zone-bind signature or the raw zone-bind payload in a form that can be correlated back to a household.
- **No foreign key** from any Zone 3 table pointing *into* this table in a direction that would allow wallet→household traversal.
- **No join path** of any kind (direct or transitive) that connects `wallet_address` → `household_id` or `wallet_address` → any name/passphrase field.
- **No `linkedFamilyId`-style reverse-lookup field** added to this table or to the `Constellation` interface without explicit Eave Rule review.

### Direction lock

```
PERMITTED:   household_id  →  wallet_address   (Zone 1 actor binds Zone 3 handle)
FORBIDDEN:   wallet_address →  household_id    (reverse lookup — violates the Eave)
```

### How to test a proposed change against the Eave Rule

Before adding any column, index, route, or query that touches this table or the `linkedFamilyId` / `linkedShareToken` fields on `Constellation`:

1. Ask: "Does this change make it possible — even indirectly — to start from a wallet address or zone-bind token and arrive at a household name or passphrase identity?"
2. If yes, the change violates the Eave Rule and must be refused or redesigned.
3. If no, document why the direction lock is preserved and proceed.

---

## Fields on `Constellation` subject to the Eave Rule

Both fields are declared in `src/types.ts` with a full block comment. Summary:

- **`linkedFamilyId`** — household→wallet direction only. No reverse lookup permitted.
- **`linkedShareToken`** — write-once, direction-locked. Must not resolve back to a Zone 1 identity.

See the comment block in `types.ts` for the verbatim rule and per-field guidance.
