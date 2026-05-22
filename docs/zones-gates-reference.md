# Zones, Gates & Membranes — Base Reference

> This is the foundational model. It does not prescribe any specific UI or implementation.
> All context-specific applications (North Star, Practitioner's Guide, etc.) derive from this base.

---

## Three Zone Types

The model recognises three protected zones. The numbering (Z1, Z2, Z3) reflects their position in the constitutional framing — innermost to outermost.

| Zone | Name | Character |
|------|------|-----------|
| **Z1** | Circle | Private household identity. The innermost protected layer. Names, passphrases, and personal continuity live here. |
| **Z2** | Workbench | Operational / practitioner layer. Liminal — it has controlled crossings on both sides. Work happens here; attribution flows through it without exposing the person behind it. |
| **Z3** | Community | Above-board organisational identity. Public-facing: XRPL wallet addresses, community roles, regulatory handles. |

Zones are **not ranked by importance** — they are ranked by privacy exposure. Z1 is not "more important" than Z3; it is simply more private and therefore more protected.

---

## Zone Diagram

The zones are concentric and overlapping. Gates sit in the overlap regions, not at hard walls.

```
┌─────────────────────────────────────────────────────────────┐
│                         Z3 Community                        │
│                 (public identity, XRPL wallet)              │
│                                                             │
│          ┌──────────────────────────────────────┐           │
│          │       ╔══════════════╗               │           │
│          │       ║  Z2–Z3 Gate  ║               │           │
│          │       ╚══════════════╝               │           │
│          │         Z2 Workbench                 │           │
│          │    (operational / practitioner)      │           │
│          │                                      │           │
│          │    ┌────────────────────────┐        │           │
│          │    │  ╔══════════════╗      │        │           │
│          │    │  ║  Z1–Z2 Gate  ║      │        │           │
│          │    │  ╚══════════════╝      │        │           │
│          │    │     Z1 Circle          │        │           │
│          │    │  (private household    │        │           │
│          │    │   identity)            │        │           │
│          │    └────────────────────────┘        │           │
│          └──────────────────────────────────────┘           │
│                                                             │
│   ✗  Z1 ←──────────────────────────────────────→ Z3        │
│      (No gate. No path. Architectural absence.)             │
└─────────────────────────────────────────────────────────────┘
```

The two gates are **in the overlap regions**, not at the zone boundaries. Zones can and do share space — that is normal. The gate governs what flows through the shared space, not whether the zones touch.

---

## Gates as Membranes

A gate is not a wall. It is a **protective, functional material** positioned at the overlap between two zones — the place where they visually and operationally touch.

Gates are:

- **The interactive edges** — where action happens between zones
- **Permeable by design**, not locked by default
- **Visible** — you always know when you are crossing one (a consent step, a role switch, a session context change, a credential presented)
- **Context-specific in character** — the materials list varies by crossing

### The Hempcrete Formula

The base formula for a gate is the hempcrete analogy: a structural material that breathes, insulates, and flexes — it does not seal hermetically. Hempcrete admits moisture exchange while resisting structural damage. A gate admits identity signals while resisting composable reverse-lookup paths.

The "extended materials list" is what gets added per context: thermal mass, vapour barriers, acoustic layers, and so on. Each gate gets the mix it needs for its specific crossing. The base formula stays constant; the context-specific additives vary.

---

## The Two Constitutional Gates

These two gates are defined by the Eave Rule. They are the only permitted crossings. Everything else is either absent by design or prohibited.

### Z1–Z2 Gate — Household Context Into Work

Household context may cross inward in controlled form — enough to know whose work this is — but private identity does not travel outward toward Z3.

- **What may cross:** A scoped household reference (e.g. `household_id`) that attributes work to a household without exposing the person behind it.
- **What must not cross outward:** Name, passphrase, or any field that resolves back to the human identity behind the household.
- **Direction:** Z1 → Z2 to scope work. Not Z2 → Z1 or Z1 → Z3.

### Z2–Z3 Gate — Contractor Identification at the Crossing

Contractor identification may appear in controlled, auditable form at the crossing (e.g. for contracts or audit events), but must not persist as a stored reference inside Z2-scoped records.

- **What may appear at the crossing:** A Zone 3 identifier (wallet address, above-board role) present in an audit event or contract record header at the moment of crossing.
- **What must not persist:** The contractor identifier must not be stored as a field on any Z2-scoped record once the crossing is complete.
- **The giraffe constraint:** Audit / regulatory visibility across this gate is permitted, but the shape of any audit query must not be composable into a Z3 → Z1 reverse lookup. You cannot start from a wallet address, query audit events, and arrive at a household identity — even across multiple hops.

---

## The Z1–Z3 Absolute Prohibition

This is not a gate. It is an **architectural absence** — there is no form, controlled or otherwise, in which a Zone 3 identity may connect to a Zone 1 household record.

Zone 2 does not dissolve this prohibition. Any path that routes through the Workbench as an intermediate hop to achieve a Z3 → Z1 traversal is equally forbidden. The prohibition covers:

- Direct connections
- Composable multi-hop paths
- Zone-bind payloads or signatures stored in reversible form
- Derived identifiers that could correlate wallet addresses to household names

The only permitted direction is Z1 → Z3 (a household voluntarily binding its own wallet, one-way, non-reversible, no reverse lookup).

---

## The Membrane Principle

Zones overlap. The membrane is not at the hard boundary — it is **in the overlap region itself**.

Two zones sharing space is normal and healthy. A practitioner operating in Z2 will naturally brush against both Z1 context (whose work is this?) and Z3 context (what does this produce for the community?). The membrane does not prevent this contact. It governs what **flows through** the shared space.

Membranes provide **resilience**, not isolation. An isolated zone is fragile — a breach collapses everything. A breathing membrane distributes and absorbs pressure. The goal is a system that can be audited, regulated, and operated without any single query composing a path from the outermost to the innermost zone.

---

## What a Gate Looks Like in Practice

Gates are always visible. Examples at each crossing:

| Crossing | Gate form |
|----------|-----------|
| Personal → Working (Z1–Z2) | A consent step, a role switch, a session context change that establishes "I am now working as a practitioner" |
| Working → Community (Z2–Z3) | A credential presented at the crossing but not stored inside the operational record; an audit event that captures the moment without persisting the reference |
| Group to group (any Z–Z edge) | A shared protocol — a meeting format, a data standard, a mutual agreement — that both sides recognise and that defines the terms of the crossing |

---

## Relationship to the Eave Rule

The Eave Rule (defined in `artifacts/north-star/src/schema-notes.md`) is the **constitutional expression** of this model — the version that governs code, schema fields, migrations, and query shapes.

This document is the **plain-language base layer**. When reading the Eave Rule, this document is the conceptual companion that explains why the constraints exist, not just what they are.

If there is ever a conflict between this document and the Eave Rule, the Eave Rule governs. This document informs interpretation; the Eave Rule governs implementation.
