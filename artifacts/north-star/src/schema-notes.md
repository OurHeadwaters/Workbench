# Schema Notes — North Star

## The Eave Rule (Governing Constraint)

> The Eave is the hard structural seam between Zone 1 (Household / Afloat — private household identity) and Zone 3 (Home Range / Community-facing work — XRPL wallet, above-board organizational identity).
> It is defined by intentional architectural absence: No table, no foreign key, no join, no query path, and no stored reference may ever connect a Zone 3 wallet address, any derived identifier, any zone-bind payload, or any zone-bind signature to a Zone 1 household record (name + passphrase identity).
> A household may voluntarily bind its own XRPL wallet using the lib/zone-identity primitives, but the binding must be stored as a one-way, non-reversible reference that never permits reverse lookup.
> Any proposed feature, route, migration, or type field (including the existing linkedFamilyId and linkedShareToken fields on the Constellation type) that would create such a path must be refused or redesigned to respect the seam.

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
