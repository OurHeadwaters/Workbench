# Saltbox Debrief — On-Chain Receipt Specification

**Status:** Design complete — awaiting digital implementation  
**Depends on:** Emergency Override chain record (saltbox-emergency-override.md)  
**Version:** 1.0 — May 2026

---

## What This Is

The debrief receipt is the closing half of the override cycle. It is not a report or a summary. It is a receipt — a timestamped, structured record that seals the override pair, confirms what happened, and makes the chain well-formed.

An override without a filed debrief is an open record. An open record is a gap. The debrief closes the gap.

**Bright Side framing:** The community does not assume the best and move on. It confirms it, writes it down, and links it back.

**The Systems equivalent (audit language):** Closure affidavit filed against incident warrant record.

---

## 1. Receipt Fields

Fields are listed in filing order. Each field carries its Bright Side name and its The Systems audit equivalent in parentheses.

---

### Field 1 — Opening Event Reference
**Bright Side:** The override this closes  
**The Systems:** Incident warrant identifier

- **What it contains:** The unique identifier of the override invocation event — consisting of the override timestamp (ISO 8601, UTC) and the invoker's cap reference.
- **Format:** `[cap-reference]@[ISO-timestamp]` — e.g. `CAP-003@2026-05-22T14:32:00Z`
- **Why it is here:** This is the chain link. Without it, the debrief is a free-floating record with no parent. A debrief that cannot point to a valid opening event is not a valid debrief.
- **Required:** Yes — the field is mandatory. A receipt with no opening event reference cannot be filed.

---

### Field 2 — Receipt Timestamp
**Bright Side:** When the debrief was filed  
**The Systems:** Closure affidavit execution timestamp

- **What it contains:** The exact date and time the debrief was submitted, recorded by the system at filing time (not self-reported by the filer).
- **Format:** ISO 8601, UTC
- **Why it is here:** Establishes whether the debrief was filed within the required window. Also the closing timestamp of the override pair — together with Field 1, it defines the duration the override was open.
- **Required:** Yes — system-generated at filing.

---

### Field 3 — Filer Identity
**Bright Side:** Who closed the record  
**The Systems:** Affiant cap reference

- **What it contains:** The cap reference of the person filing the debrief. This does not have to be the same person who invoked the override — but it must be a cap holder with standing to close records (see Invoker and Filer rules below).
- **Format:** Cap reference (e.g. `CAP-003`)
- **Why it is here:** Accountability. The chain knows who attested to the closing account, not just who opened the event.
- **Required:** Yes.

---

### Field 4 — What Actually Happened (Narrative)
**Bright Side:** What we did and why it was right  
**The Systems:** Event account (free text)

- **What it contains:** A free-text account of what occurred during the override. No template. No word limit floor. The filer writes what happened in their own words, as they would read it aloud to a community gathering.
- **Guidance:** This field is not a justification. It is an account. It should answer: What happened? Who was present? What was done? What was the result?
- **Why it is here:** The structured fields prove the receipt is well-formed. This field proves the override was real. A receipt with an empty or perfunctory narrative is a yellow flag — not an automatic rejection, but noted.
- **Required:** Yes — cannot be empty or whitespace-only.

---

### Field 5 — Stated Reason (Structured)
**Bright Side:** Why the override was needed  
**The Systems:** Emergency classification

- **What it contains:** One of three canonical emergency types, selected by the filer:
  - `fire` — Immediate physical danger to person or property within the space
  - `medical` — Health emergency requiring access by or for a household member, designated backup, or responding care provider
  - `neighbour` — Neighbour-helping-neighbour situation where withholding access would cause clear harm (e.g. an elder locked out in winter, a child left alone)
- **Why it is here:** The stated reason at debrief is compared against the stated reason at invocation. A mismatch is flagged — not rejected, but flagged for witness review or escalation. This is the chain's consistency check.
- **Required:** Yes. The filer must select a canonical type. If none fits, the outcome field (Field 7) must be set to `referred` and an explanation placed in the narrative (Field 4).

---

### Field 6 — Witness Confirmation
**Bright Side:** Whether someone else can say this is true  
**The Systems:** Corroborating witness attestation

- **What it contains:** One of:
  - `confirmed` — A witness was present and can attest to the account. Witness cap reference is included.
  - `absent-solo` — No witness was present. The override was a solo invocation.
  - `absent-post` — No witness was present at the time, but a neighbour or community member has since been informed and can speak to the filer's account.
- **Format:** Status flag + optional cap reference (required if `confirmed`)
- **Why it is here:** Witness status at debrief closes the loop on witness status at invocation. A solo override invocation (filed without a witness at the opening) that also has no witness at debrief carries the highest accountability weight — it is valid, but it triggers the highest scrutiny at any future review.
- **Required:** Yes. The status must be declared. Omitting it is not the same as `absent-solo`.

---

### Field 7 — Outcome
**Bright Side:** How this was resolved  
**The Systems:** Disposition classification

- **What it contains:** One of:
  - `resolved` — The situation that required the override has ended. No further action needed. The chain is closed.
  - `escalated` — The situation was handled but raised concerns that require a formal community or governance review. The debrief is filed and the chain is closed, but a flag is raised for the next convening body.
  - `referred` — The situation could not be fully resolved at the time of filing, or the stated reason does not fit a canonical type. The debrief is filed as a partial record; the chain remains open pending a follow-on review.
- **Why it is here:** The chain needs to know whether closing the receipt means the matter is settled. `resolved` seals both the debrief and the underlying event. `escalated` seals the debrief but surfaces the event. `referred` keeps the chain open.
- **Required:** Yes.

---

### Field 8 — Override Flag (Carried)
**Bright Side:** Whether this was a routine event or an override  
**The Systems:** Incident classification flag

- **What it contains:** A flag carried forward from the opening event record:
  - `override` — This debrief closes an emergency override invocation
  - `routine` — This debrief closes a routine custody event (not an override)
- **Why it is here:** The flag is not set by the filer at debrief time — it is inherited from the opening event. This prevents a filer from retroactively reclassifying an override as routine. If the opening event was flagged `override`, the debrief must carry `override`.
- **Required:** Yes — system-inherited, not filer-selected.

---

## 2. Trigger Design

### What Opens the Debrief Window

The debrief window opens the moment an override invocation is recorded on the chain. The opening event is the trigger. There is no manual step to "start" the debrief process — the window is open from the instant the override is filed.

**The Systems equivalent:** The warrant is served; the response period begins.

### What Closes the Debrief Window

The debrief window closes when a valid debrief receipt is filed against the opening event reference. A receipt is valid when:

1. All required fields are present and non-empty
2. Field 1 (Opening Event Reference) matches a real, open override record on the chain
3. Field 8 (Override Flag) matches the flag on the referenced opening event
4. The filer identity (Field 3) is a recognised cap holder

**An invalid filing does not close the window.** It is returned with the field(s) that failed validation noted. The window remains open until a valid receipt is filed.

### Time Window

| Override Type | Expected Filing Window | Flag at 48h | Default at 72h |
|---|---|---|---|
| Override (emergency) | Within 24 hours of invocation | Window flagged as late | Record escalated automatically |
| Routine custody event | Within 72 hours of event | Window flagged as late | Record escalated automatically |

**"Flag at"** means the open record is marked visible to the cap holder and, if a witness was named, to the witness.  
**"Default at"** means the record is automatically escalated with outcome `escalated` and a system-generated note: `Debrief not filed within required window.` This is not a penalty — it is the chain's refusal to silently absorb an unclosed record.

### Valid Filing

A filing is valid if all required fields are present (see table below) and the structural checks above pass. A filing is not valid if:
- The opening event reference does not match any open record
- The override flag in Field 8 contradicts the opening event record
- The narrative (Field 4) is empty or contains only whitespace
- Field 6 (Witness Confirmation) is set to `confirmed` but no witness cap reference is supplied

**Required fields by record type:**

| Field | Override Debrief | Routine Debrief |
|---|---|---|
| 1 — Opening Event Reference | Required | Required |
| 2 — Receipt Timestamp | System-generated | System-generated |
| 3 — Filer Identity | Required | Required |
| 4 — Narrative | Required (cannot be minimal) | Required (may be brief) |
| 5 — Stated Reason | Required (canonical emergency type) | Not required — replaced by event type from custody schedule |
| 6 — Witness Confirmation | Required (must declare a status) | Optional unless community policy requires it |
| 7 — Outcome | Required | Required (`resolved` or `noted`) |
| 8 — Override Flag | System-inherited (`override`) | System-inherited (`routine`) |

---

## 3. Cycle Link

The override cycle is a pair: one opening record, one closing receipt. They are linked by the Opening Event Reference (Field 1).

**The pair is well-formed when:**
- The opening record has `status: open`
- A valid debrief receipt exists with Field 1 pointing to the opening record's identifier
- After the receipt is filed, the opening record's status moves to `closed`

**The pair is ill-formed when:**
- An opening record exists with no matching receipt and the window has expired
- A receipt exists but Field 1 does not match any opening record (orphaned receipt — treated as invalid, not stored)
- An opening record has `status: closed` but no receipt can be found (corrupt chain — treated as an escalation flag)

**Structural rule:** Neither record is meaningful in isolation. An override record with no receipt is open. A receipt with no opening record is orphaned. The chain only recognises pairs.

**The Systems equivalent:** A warrant is not discharged until a response record is filed against it. Neither the warrant nor the response is a standalone document.

---

## 4. Routine vs. Override Distinction

Not all debriefs follow overrides. Some custody events (scheduled access, planned handoffs, designated maintenance windows) are routine, and the community may choose to require a debrief for these as well.

### Structural differences

| Feature | Override Debrief | Routine Debrief |
|---|---|---|
| Trigger | Override invocation (emergency) | Routine custody event |
| Field 8 value | `override` | `routine` |
| Time window | 24 hours | 72 hours |
| Narrative (Field 4) | Required — cannot be minimal | Required — can be brief |
| Stated Reason (Field 5) | Must be canonical emergency type | Not required — replaced by event type from custody schedule |
| Witness (Field 6) | Required declaration (confirmed / absent-solo / absent-post) | Recommended but optional unless community policy requires it |
| Default on non-filing | Automatic escalation at 72h | Community-configurable — escalation or archive |
| Outcome options | resolved / escalated / referred | resolved / noted |

### Are routine debriefs required?

Routine debriefs are **optional at the community level** — the community decides whether scheduled custody events require a debrief receipt. However:
- If a routine event *becomes* an override mid-execution (something unexpected occurs), the record type must be amended to `override` and the override debrief rules apply from that point forward.
- If the community has adopted a policy requiring routine debriefs, non-filing within the window follows the same default logic as override non-filing (escalation, not silence).

---

## 5. Bright Side / The Systems Field Translation

For external audit, compliance review, or any formal submission to a body that does not recognise Bright Side language, the following translation table applies. Use the The Systems column verbatim in any outgoing document. The Gate translation layer applies this substitution automatically when the record passes through it.

| Field | Bright Side Label | The Systems Label |
|---|---|---|
| 1 | The override this closes | Incident warrant identifier |
| 2 | When the debrief was filed | Closure affidavit execution timestamp |
| 3 | Who closed the record | Affiant cap reference |
| 4 | What we did and why it was right | Event account (free text) |
| 5 | Why the override was needed | Emergency classification |
| 6 | Whether someone else can say this is true | Corroborating witness attestation |
| 7 | How this was resolved | Disposition classification |
| 8 | Whether this was a routine event or an override | Incident classification flag |

**Outcome value translations:**
| Bright Side | The Systems |
|---|---|
| resolved | Matter closed — no further action required |
| escalated | Matter closed — referred for formal review |
| referred | Matter open — pending secondary review |
| noted (routine only) | Routine event recorded — no action required |

**Override flag translations:**
| Bright Side | The Systems |
|---|---|
| override | Emergency invocation — warrant class: incident |
| routine | Scheduled access event — warrant class: administrative |

---

## Invoker and Filer Rules

The filer of the debrief (Field 3) does not have to be the person who invoked the override. However:

- The filer must be a recognised cap holder
- If the invoker is capable of filing, they should file — the default expectation is that the invoker closes what they opened
- If the invoker cannot file (medical, travel, incapacity), a designated backup cap holder may file on their behalf; this is noted in the narrative (Field 4)
- A witness who was present at the override invocation may not serve as the sole filer — they may co-attest (Field 6) but the filer must be distinct from the witness

---

## Notes for Digital Implementation (When Ready)

This specification is complete for design purposes. When digital implementation begins:

- The Opening Event Reference (Field 1) becomes a foreign key or content-addressed hash linking to the override invocation record
- Field 8 (Override Flag) is never exposed as an editable field in the filing UI — it is read from the opening record and displayed, not entered
- Receipt Timestamp (Field 2) is server-stamped, not client-reported
- Orphaned receipts (no matching opening record) must be rejected at the API layer, not stored and flagged later
- The pair model (opening record + closing receipt) maps cleanly to the existing `translations` table pattern in The Gate: one input record (opening event), one output record (receipt), linked by a reference field
