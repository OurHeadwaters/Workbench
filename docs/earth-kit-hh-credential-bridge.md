# Earth Kit → Helping Hands Credential Bridge

*Version 1 — June 2026. Living reference; update when tier equivalences or governance rules change.*

---

## What This Bridge Does

Earth Kit (Zone 0 · Goodbye Kit practitioner credentialing) and Helping Hands (Zone 3 · community labour badges) are parallel systems that credential the same kinds of people — practitioners who hold embodied knowledge in food, land stewardship, and community governance. This bridge defines:

1. **Domain overlap** — which skill areas map across both systems.
2. **Tier equivalence** — what an Earth Kit tier implies in Helping Hands badge terms, and vice versa.
3. **Governance ceremony** — who validates a cross-system claim in v1.
4. **Upgrade pathways** — how a credential in one system can open a door in the other.

---

## Domain Overlap

Not all Helping Hands domains map to Earth Kit, and Earth Kit covers areas (end-of-life care, household transition) that have no direct HH equivalent. The *bridgeable* domains are:

| Helping Hands Domain | Earth Kit Equivalent Area | Bridge Active? |
|---|---|---|
| `food` (Food & Harvest) | Food sovereignty practice | ✓ Yes |
| `land` (Land & Water) | Land-based ceremony and stewardship | ✓ Yes |
| `governance` (Governance) | Community decision-making protocols | ✓ Yes |
| `care` (Care & Wellbeing) | End-of-life companion / grief practice | Partial — see note |
| `craft` (Craft & Making) | Not directly mapped | ✗ No |
| `knowledge` (Knowledge & Culture) | Oral history and cultural transmission | ✗ No (future) |

**Care note:** End-of-life care is the *core* of Earth Kit but only a subset of HH `care`. The bridge is active only for practitioners whose Earth Kit application specifically names palliative or death-care practice. General wellness or elder care HH badges do not automatically bridge.

---

## Tier Equivalence Table

### Earth Kit → Helping Hands

| Earth Kit Tier | Implied HH Stage | Domains | Notes |
|---|---|---|---|
| **Watershed** (entry, no formal vetting) | Watching or Learning | food, land, governance | Shows interest; no governance ceremony needed |
| **Licensed** (application reviewed, community-vouched) | Practicing | food, land, governance | Cross-validated by founder gate (v1) |
| **Portfolio Verified** (documented case portfolio) | Teaching | food, land, governance | Strongest signal; Teaching badge issued with `credential_source: "earth_kit"` |

A Portfolio Verified Earth Kit practitioner doing active funeral home / transition work carries a **Teaching-level** signal in overlapping HH domains. This does not replace peer validation — it supplements it. The badge is marked `credential_source: "earth_kit"` to distinguish it from a badge earned through HH task history.

### Helping Hands → Earth Kit

| HH Stage Reached | Earth Kit Pathway Opened | Domains | Process |
|---|---|---|---|
| Teaching | May apply for **Licensed** status | food, land, governance | Manual application (v1) — see upgrade pathway below |
| Practicing (3+ months, community-confirmed) | May request **Watershed** acknowledgement | food, land, governance | Informal — founder acknowledges on request |
| Watching / Learning | No Earth Kit pathway yet | — | Continue in HH; Teaching opens the door |

---

## Governance Ceremony (v1)

**Who validates a cross-system credential claim?**

In v1, the validation gate is the **founder** (single-person gate). A cross-system credential is not issued automatically — it is issued by an admin advancing the badge with `credential_source: "earth_kit"` set.

Future versions should move to:
- **Peer consensus**: two existing Teaching-level practitioners in the domain co-sign
- **Elder gate**: a recognised Knowledge Keeper in the band approves

The `issuedByMemberId` field on `hh_member_badges` records who performed the advancement. The `credential_source` field records why.

---

## `credential_source` Field

The `credential_source` field on `hh_member_badges` records how a badge was earned:

| Value | Meaning |
|---|---|
| `hh_task_history` | Earned through completing HH tasks in the domain (default) |
| `peer_validation` | Advanced by a Knowledge Keeper or peer consensus |
| `earth_kit` | Granted on the basis of Earth Kit practitioner standing |

The UI surfaces `earth_kit` badges with a **"Practitioner Verified"** indicator — visually distinct from peer-validated badges — so institutional partners can see the richer credential context.

---

## HH → Earth Kit Upgrade Pathway (v1)

A community member who reaches **Teaching** level in `food`, `land`, or `governance` in Helping Hands may apply for **Earth Kit Licensed** standing. The path in v1 is:

1. Member sees a **"What's next?"** call-to-action on their My Credentials page when they hold a Teaching badge in a bridgeable domain.
2. The CTA links to the Goodbye Kit practitioner application form.
3. The application notes the HH Teaching badge(s) as supporting evidence.
4. The founder reviews the application using the normal practitioner review flow.
5. On approval, the founder (or admin) can advance the member's HH badges to `credential_source: "earth_kit"` to reflect the cross-validated standing.

**This pathway is named, not automated.** The application form and review flow are existing infrastructure. No new automation is built for v1.

---

## Goodbye Kit Practitioner Directory — HH Badge Display

When an Earth Kit practitioner is listed in the Goodbye Kit practitioner directory, their **HH Teaching badges in bridgeable domains** are shown on their profile card. This gives institutional partners (band councils, health authorities, funeral homes) a richer picture:

- Teaching in `food` → "Food & Harvest — Teaching"
- Teaching in `land` → "Land & Water — Teaching"
- Teaching in `governance` → "Governance — Teaching"

These are read-only on the directory — they cannot be issued or revoked from the directory view.

---

## Out of Scope (v1)

- **XRPL DID integration** — credential portability to a decentralised identity layer is tracked in `docs/learning-identity-architecture.md` and the XRPL gap archive.
- **Automated Earth Kit upgrade** — the upgrade pathway is documented and linked; the application step is manual.
- **Redesigning either system's core logic** — both badge systems continue to operate independently; this bridge is additive.
- **Automating `credential_source: "earth_kit"` issuance** — in v1 an admin manually sets this on badge advancement.

---

*Update this doc when: a tier equivalence is revised, a new bridgeable domain is added, the governance ceremony moves from founder-gate to peer consensus, or the automated upgrade path is built.*
