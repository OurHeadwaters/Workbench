# Z0 Key Custody Primitive — Saltbox Practice Pattern

**Zone:** Zone Zero · The Household
**Primitive class:** Custody — physical hold at the household layer
**Reference object:** The jar (household finance equivalent)
**Bright Side name:** the household seal
**The Systems name:** primary physical key custody record

---

## The Household Seal — what it is

The jar holds cash where every household member can see it and cannot be opened without everyone noticing. The household seal carries the same four properties into the Saltbox practice:

1. **Tangible.** It has a physical form a household member can point at and confirm is present.
2. **Visible.** It lives in the household's main gathering place — the kitchen shelf, the living room credenza, the entryway hook-rail — not hidden, not locked away, not behind a door that requires a separate key to reach.
3. **Communal.** Every adult member of the household knows what it is, where it lives, and what it holds without being asked.
4. **Non-trivial to access without noticing.** Opening the seal marks itself. The opened state is visible to the household before any single member can close it again.

The household seal is a standard letter envelope. It is sealed at the flap with a wax disc or a tamper-evident adhesive strip, and the primary holder signs their name across the seal face — one stroke of pen that crosses both the flap and the envelope body. If the flap is lifted, the signature is broken. That break is the broken-glass equivalent: it cannot be restored to an unbroken state, and every household member can read it without being trained to do so.

The envelope holds the keys — physical, cryptographic, or account-access — that the household designates as Z0 custody objects. The envelope itself is the custody record. Opening it is a custody event. A broken seal that was not opened by the primary holder, or opened without the household's knowledge, is a custody breach.

---

## Location logic

The household seal lives on a surface that every household member passes in the course of a normal day. The rule is not about aesthetics — it is about ambient visibility. If a household member could plausibly go three days without seeing the location, the location is wrong.

**Permitted locations:** kitchen shelf at eye level, entryway hook-rail, household bulletin board, living room side table.

**Not permitted:** bedroom drawer, locked cabinet, car glove compartment, storage room, any location that requires a second access action to reach.

The household seal does not move. If it must move — a household change, a remodel, a season — a custody event is logged, the new location is agreed by all adult members, and a new seal is set at the new location on the same day.

---

## Tamper-evidence property — the broken signature

The signature across the seal face is the only tamper-evidence mechanism required at Z0. No lock, no chain, no wax-drip-pattern verification. The signature serves one purpose: a break that is legible to any household member, without instruction, on first inspection.

The primary holder signs in full across the seal. Initials do not pass. A signature in a consistent personal style — the same hand that signs the household's documents — is the standard.

When the seal is opened for a legitimate custody event, the primary holder:
1. Breaks the seal and removes the contents.
2. Completes the custody action.
3. Returns the contents to the envelope.
4. Re-seals with a new wax disc or new tamper-evident strip.
5. Signs the new seal face.
6. Returns the envelope to its location.

The broken-and-re-sealed envelope is itself a custody record: it shows the new seal date (the seal date is written in pen on the envelope face before signing), and it holds the prior event in the custody log kept alongside it.

---

## Household composition variants

### Single-adult household

The single-adult household has one primary holder by default. There is no witness position.

Because no second member exists to hold the witness function, the single-adult household must name one external witness — a trusted neighbour, a practitioner from the same Workbench network, or a Lodge member at Zone 1 — who knows:
- The location of the household seal.
- The custody event protocol (how access is logged).
- The override path (who to contact if a breach is suspected and the primary holder is unreachable).

The external witness does not hold a key to the household. They hold no physical access to the seal. They hold the knowledge of the pattern so that a breach does not go unwitnessed because the household has only one adult.

The external witness is named in the custody log inside the envelope. The custody log is a single folded card — not a digital record — that sits inside the envelope with the keys. It records the external witness's name, their contact, and the date they accepted the witness role.

### Multi-adult household

The multi-adult household has one primary holder and one or more witness holders.

**Primary holder:** the adult who signs the seal, initiates all custody events, and holds the first-call obligation in a breach.

**Witness position:** every other adult member of the household. The witness position is not a co-signer, not a co-holder, not a backup primary. The witness holds one function: to confirm that a custody event occurred, that it was expected, and that the seal was in good order before and after.

The witness does not need to be present at every custody event. The witness function is discharged by the custody log entry: the primary holder logs the event, the date, the reason, and the new seal number (a sequential integer written on the seal face). A witness who was not present for an event may read the log and confirm the entry is consistent with what they knew of household plans.

In a multi-adult household with more than two adults, all adults hold witness position except the primary holder. The primary holder may rotate — rotation is itself a custody event, logged and sealed — but only one adult holds primary custody at any moment.

---

## Custody event — routine access

A custody event is expected access, recorded, and uncontested.

Characteristics of a custody event:
- The primary holder initiates access.
- The reason is known or knowable to household members (bill payment, credential renewal, identity verification for an outside institution, onboarding a new Zone 1 Lodge member).
- The seal is broken in the ordinary location or, if moved temporarily, the move was communicated to the household before access.
- A log entry is made before the seal is re-set.
- The new seal is set the same day access is complete.

A custody event does not require all household members to be present. It requires the log to be legible to them after the fact.

**Bright Side:** the household opened the seal.
**The Systems:** primary key custody record accessed by authorized holder; custody log updated; physical integrity restored same-day.

---

## Custody breach — override-triggering

A custody breach is unexpected, contested, or undocumented access.

A breach is triggered when any of the following is true:

1. **Broken seal with no log entry.** The envelope is found with a broken seal and no corresponding custody log entry in the holder's hand.
2. **Seal found at wrong location.** The envelope is not at the designated location and no relocation event was communicated.
3. **Primary holder denies the access.** A log entry exists, but the named primary holder did not make it.
4. **Seal broken by a non-primary member** without a logged relocation of primary custody responsibility to that member.
5. **The envelope is missing** and no custody event log explains its removal from the household.

A custody breach activates the override path. The breach is named — not investigated first, named — so that the household does not consume the time before notification trying to resolve ambiguity privately. Once named, the breach record is opened: who discovered it, when, what the physical state of the seal was, who was present. That record is the opening entry in the override chain.

**Bright Side:** the seal was broken without the household's knowledge.
**The Systems:** unauthorized access to primary physical key custody record; override chain record opened; external witness notified.

The distinction between a custody event and a custody breach is not intent — it is record. A primary holder who opened the seal in a genuine emergency but forgot to log the event has still triggered a breach condition. The remedy is to log the event retroactively with an explanation, close the breach record with that explanation noted, and set a fresh seal. The retroactive log is itself a custody event, not a second breach, provided the explanation is consistent with what the household knew at the time.

---

## Bright Side / The Systems translation — warrant record

The following table follows the warrant record pattern. Each row names the Bright Side term, its The Systems equivalent, and the rationale for the mapping — the column that would appear in a Gate translation ledger if this document were passed through for external audit.

| Bright Side term | The Systems term | Rationale |
|---|---|---|
| the household seal | primary physical key custody record | The seal names the physical object and its tamper-evidence property. The systems term names the custodial function and audit trail. |
| primary holder | authorized key custodian | The household uses *holder* because holding is a posture, not a role title. The systems term requires a named agent with delegated authority. |
| witness position | secondary custody acknowledgment role | The witness is not a co-holder; the systems term must not imply co-authorization. *Acknowledgment role* carries the right level of access without implying authority to act. |
| custody event | authorized custodial access; custody record updated | The systems term must name both the access and the record update. An access without a record update is a breach, not an event. |
| custody breach | unauthorized or undocumented key custody access; override chain record initiated | The systems term must name the chain consequence, not only the access condition. A breach without the chain consequence named is incomplete for audit. |
| the hold is broken | physical custody integrity compromised | Bright Side is direct. The systems term is the insurance and regulatory phrase. |
| external witness | designated third-party custody witness | For single-adult households. The third-party status must be explicit for institutional legibility. |
| the log | custody record | The log lives inside the envelope — a folded card, handwritten. The systems term applies whether the record is paper or digital. |
| the seal number | custody record sequence number | Each re-sealing carries a sequential integer on the envelope face. In external audit, this is the sequence number that links a log entry to a physical seal state. |
| override path | emergency key custody override procedure | Named in the custody log. The override path is defined separately (see downstream task). This entry names the path without defining it — the definition is out of scope for Z0 custody primitives. |

---

## What passes the both-sides test here

The household seal passes the both-sides test:

- **From the Bright Side:** a household member who knows nothing of the external institutions reads *the household seal* and understands that something is kept here, that it is closed, and that opening it is a deliberate act. The warmth is in the word *household* — this is ours, it belongs to this home, it is not institutional.

- **From The Systems side:** an auditor, a banker, or a regulator reads *primary physical key custody record* and understands that this is a physical document with an identified custodian, an access log, and an integrity verification mechanism. The tamper-evidence property (the signed seal) satisfies documentary custody requirements without a lock box or a notary.

Both readings are simultaneously correct. Neither erases the other.

---

## What this pattern does not cover

- **Digital key storage beyond Z0.** This pattern covers physical household custody only. Zone 1 and above are separate design questions.
- **Multi-household key sharing.** If a key must leave the household, that is an override condition, not a custody event. It belongs to the override path and the debrief record, both defined separately.
- **Workbench-licensed households.** A licensed Workbench may have additional custody requirements imposed by the Workbench agreement. This pattern defines the Z0 floor — the minimum that every household holds regardless of Workbench status. The Workbench layer adds to this pattern; it does not replace it.
