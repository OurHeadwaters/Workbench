# North Star → Zone 2 / Buzz Alignment Document

> **Status:** Strategic reference and implementation roadmap.  
> **Audiences:** Practitioner (what changes and why) · Developer (what to build next).  
> **Last reviewed:** 2026-07-26  
> **Governing constraint:** The Eave Rule and the Z1–Z3 absolute prohibition as encoded in `artifacts/north-star/src/schema-notes.md` and `artifacts/north-star/src/types.ts`.

---

## Table of Contents

1. [North Star Feature Inventory](#1-north-star-feature-inventory)
2. [Zone 2 Mapping (per feature)](#2-zone-2-mapping-per-feature)
3. [Buzz-Layer Alignment](#3-buzz-layer-alignment)
4. [Concrete Implementation Steps (prioritised)](#4-concrete-implementation-steps-prioritised)
5. [Benefits Summary (plain language)](#5-benefits-summary-plain-language-for-a-skeptical-rural-business-owner)
6. [Missing Information](#6-missing-information)

---

## 1. North Star Feature Inventory

Every core feature in the current codebase, with its real-world benefit to a rural or small business operator.

### 1.1 Constellation / Zone Picker
**What it is:** Each "constellation" is a named work context — a project, a role, a hat — assigned to a privacy zone (Z0–Z5). The picker on the Today page lets the operator choose which constellations are active today.  
**Benefit:** You always know what hat you're wearing. Work in the store is separate from household planning, which is separate from community council obligations. Nothing bleeds into the wrong pile.

### 1.2 Daily Picks / Morning Triage
**What it is:** A single-screen daily focus interface (`MorningTriage.tsx`) that surfaces the day's constellations, acknowledges guardrails (`acknowledgedGuardrails` on `DailyPick`), and emits an `hoursByZone` record at close of day.  
**Benefit:** Reduces decision fatigue. One screen, one morning, one set of commitments for the day. The guardrails acknowledgement means the operator explicitly confirms the boundaries they're working inside before the day begins.

### 1.3 Contracts
**What it is:** `Contract` records that bind a constellation to a weekly hour target (`weeklyHourTarget`). Active contracts form the accountability layer for how much time is committed to each work context.  
**Benefit:** Turns informal commitments ("I'll spend about 20 hours on the store this week") into a trackable, reviewable record. Good for board reporting, grant applications, and self-discipline.

### 1.4 Kitchen Table / River Smith Briefings
**What it is:** An AI-facilitated nightly strategic review (`RiverSmithPanel.tsx`). River Smith is a scheduled AI job that generates a structured markdown briefing (`/api/river-smith/briefing/latest`), evaluates strategic decisions across seven dimensions (`kitchenTable7D.ts`), and surfaces flagged items for human review. The seven dimensions are: Physical/Material, Biological/Living Systems, Psychological/Narrative, Quantum/Probabilistic, Soul/Spiritual, Collective/Inter-subjective, and Future/Timelines.  
**Benefit:** Gives a small operator access to the kind of multi-angle strategic review that larger organisations pay consultants for. The river runs every night at 11:45 PM — the morning briefing is waiting when the day starts.

### 1.5 Task Autopilot
**What it is:** `TaskAutopilot.tsx` — a triage engine that pulls tasks from across all registered constellations (the Aquifer), classifies them GREEN/AMBER/RED, auto-approves GREEN (safe to build now), escalates AMBER to binary decisions, and queues RED items for deliberation with a specific council seat. The Aquifer is a pre-curated list of all known projects.  
**Benefit:** Turns an overwhelming backlog into a manageable daily triage. The operator approves or defers; the system handles the routing. This is the closest existing feature to agent-assisted task management.

### 1.6 Helping Hands
**What it is:** A community labour exchange — described in the task spec and referenced in the schema-notes. Allows task posting, claiming, completion, and settlement via XRP/IOU. Currently referenced in schema-notes and plan data; the full HH schema (`lib/db/src/schema/helpingHands.ts`) is specified but not yet present in the monorepo.  
**Benefit:** Let community members help each other with real work — and get paid for it without needing a bank, an invoice, or a platform middleman. The payment settles on the ledger automatically.

### 1.7 HH Badges / Skill Credentials
**What it is:** Verifiable skill progression markers issued through the Helping Hands system. The progression ladder runs from watching → doing → teaching. At the teaching tier, badges are issued as XRPL DIDs — decentralised identifiers that live on the ledger, not inside any one platform.  
**Benefit:** Your reputation is yours. A badge earned through Helping Hands in Deer Lake travels with you to any other community using the same system. The platform can change; the credential stays.

### 1.8 Inbox / Gmail Archive Mining
**What it is:** `ArchiveMiningPage.tsx` and `InboxSetupPage.tsx` — Gmail accounts are registered (`GmailAccount` type), keywords and senders are configured, and the archive is surfaced as triage-ready items. Items are tagged by zone and content type (`ArchiveContentType`) before entering the Content Bank.  
**Benefit:** Ten years of email becomes a knowledge asset rather than a search problem. Newsletters, research threads, and notes-to-self are surfaced, tagged, and made reusable.

### 1.9 Content Bank
**What it is:** A structured store of repurposable community knowledge assets (`ContentBankItem` type). Each item has a zone, a content type (course-material, email-sequence, case-study, voice-sample, discard), and notes. Items enter via archive mining or manual addition.  
**Benefit:** Stops the same knowledge getting rediscovered and re-written every season. The store's best operational knowledge is preserved and reusable.

### 1.10 Captures
**What it is:** `CaptureFab.tsx` — a floating action button for quick-capture of text and blobs mid-session. `Capture` records have optional text and blobId fields.  
**Benefit:** Nothing falls out of the day. A stray observation, a phone note, a photo of a whiteboard — captured immediately, tagged later.

### 1.11 Workbench Plan
**What it is:** `WorkbenchPlan` — a structured record of burst-window scheduling: phase, burst minutes, windows, window notes, and general notes. Managed via `setWorkbenchPlan` in the store.  
**Benefit:** Deep work doesn't happen by accident. The Workbench Plan makes burst windows visible so the day can be built around them rather than interrupted by them.

### 1.12 Weekly / Seasonal Reviews
**What it is:** `WeeklyReview` (shipped / stalled / next-intention) and `SeasonalReview` (what-changed / zones-shifted / statement-reflection) records. Managed via `WeeklyPage.tsx` and `SeasonalPage.tsx`.  
**Benefit:** Honest cadence. A weekly shipped/stalled/intention note takes 10 minutes and prevents the quarterly "where did the time go" spiral. Seasonal reviews track whether the zone configuration still matches reality.

### 1.13 Backup / Export
**What it is:** `exportBackup()` / `importBackup()` on the store — full JSON export of `AppState`. The backup timestamp is tracked via `lastBackedUpAt`.  
**Benefit:** Sovereignty over your own data. The operator can download everything, take it somewhere else, or restore from it. No lock-in.

### 1.14 Zone Gate UI (ZoneGate.tsx)
**What it is:** `ZoneGate.tsx` — visible, named gate crossing markers rendered in the constellation picker at the Z1→Z2 and Z2→Z3 boundaries. Each gate has a label, subtitle, and colour. The Z1→Z2 gate reads *"Work below is attributed to your household. Your private identity stays in Z1."* The Z2→Z3 gate reads *"Z3 identifiers may appear at this crossing but are not stored inside Z2 records."*  
**Benefit:** The gate is a visible moment of informed consent. The operator always knows which zone they are crossing into and what that means for their identity and data.

---

## 2. Zone 2 Mapping (per feature)

For each feature: why Z2 is the right home, what the Nostr/XRPL/Buzz leverage looks like, and what changes are needed for human/agent compatibility.

---

### 2.1 Constellation → Nostr "channel" or "label"

**Why Z2:** A constellation is operational work — not private enough for Z1 (it can be shared with collaborators), not public enough for Z3 (it carries household attribution). Z2 is the Workbench: the place where practitioners identify themselves by their work, not their name.

**Buzz leverage:**  
A Z2 npub (derived from the household seed, scoped to Z2, non-reversible) acts as the Workbench identity. Each constellation maps to a Nostr label or channel namespace under that npub. A Z2 constellation can publish work-status events (NIP-01 kind 1 or a custom kind) without revealing the Z1 household identity behind it. Other practitioners subscribe to the constellation's channel, not to the household.

**Human/agent compatibility changes needed:**
- Add `actor_type: "human" | "agent"` to any constellation-level event (not to the `Constellation` record itself — the record stays Z2-scoped).
- Gate event-publishing to the Z2 npub: only the household that owns a constellation may publish under its channel. Agents must be explicitly delegated write access to a specific constellation's channel.
- Queries that enumerate a household's constellations must stay human-only (they traverse the Z1→Z2 gate).

**Flag:** `linkedFamilyId` and `linkedShareToken` on `Constellation` are Eave Rule subjects. Neither may be read by agents — both are gated at Z1→Z2 and must not travel outward.  
**Compliance:** ✅ Safe now (publishing stub) / ⏳ Requires system npub (live relay publishing).

---

### 2.2 Daily Picks / Morning Triage → agent-readable task manifest

**Why Z2:** Daily picks are operational work commitments — they reference which constellations are active (Z2 layer) and track zone hours (privacy-safe aggregate), not personal identity.

**Buzz leverage:**  
The morning triage output is structured enough to become a machine-readable "morning manifest": a JSON document published to a Buzz relay each morning. The manifest lists active constellation IDs (Z2 pseudonyms only), acknowledged guardrails, and the day's burst windows. Agents subscribed to the household's Z2 relay channel can read this manifest, respond with intent-to-help events, and attach completed-work proofs.

The existing `acknowledgedGuardrails` field on `DailyPick` maps directly to a machine-checkable consent record in Buzz: an agent can observe which guardrails were acknowledged before deciding whether to proceed with a delegated task.

**Human/agent compatibility changes needed:**
- Add `actor_type: "human" | "agent"` to `DailyPick` (Tier 1).
- Emit a structured "morning manifest" JSON from the daily picks screen — zone-annotated, no Z1 fields, signed by the Z2 npub.
- The manifest event must include the list of `acknowledgedGuardrails` so agents have the same informed-consent record as the human operator.

**Compliance:** ✅ Safe now (manifest generation) / ⏳ Requires system npub (relay publishing).

---

### 2.3 Contracts → programmable payment trigger

**Why Z2:** A contract is an agreement between a household practitioner and a work context — operational, not personal. The weekly hour target is a Z2 commitment, not a Z1 identity disclosure.

**Buzz leverage:**  
When a contract milestone is met — attested by an agent or a peer via a signed completion event — an XRPL escrow releases automatically. No manual settlement step, no chasing. The attestation event contains the constellation's Z2 npub identifier (not the household name), preserving the Eave Rule at the Z2→Z3 crossing. The Z3 wallet address may appear at the crossing (in the audit event) but is not persisted inside the `Contract` record.

**Human/agent compatibility changes needed:**
- Define a structured contract-milestone event envelope: `{ kind: TBD, constellation_npub: string, contract_id: string, hours_completed: number, attested_by: string, actor_type: "human" | "agent", signature: string }`.
- Add a verification step: North Star confirms the attestation signature before triggering the escrow path.
- The `endsOn` field on `Contract` maps to a natural escrow-expiry date.

**Flag:** The Z3 wallet address in the settlement event must not be persisted in the `Contract` record. It lives in the audit/event layer only (giraffe constraint).  
**Compliance:** ⏳ Requires system npub / ⏳ Tier 3 for programmable escrow release.

---

### 2.4 Kitchen Table / River Smith → agent participant

**Why Z2:** The Kitchen Table operates in the practitioner layer — strategic review of work, not personal identity. River Smith already runs as a scheduled AI job with its own API identity (`/api/river-smith`).

**Buzz leverage:**  
River Smith becomes a named npub with its own key pair — a recognised Buzz participant. It posts structured briefing events (signed, timestamped) to the household's Z2 relay channel. Other agents (or human collaborators) can subscribe to and reply to these briefing events. River Smith's seven-dimension framework (`kitchenTable7D.ts`) maps naturally to a structured event schema: each dimension becomes a field in the briefing payload.

The existing `triggeredBy` field on briefings ("manual" vs scheduled) maps to `actor_type` in the Buzz event envelope.

**Human/agent compatibility changes needed:**
- River Smith needs a key pair before it can sign events (Tier 2 prerequisite: system npub established).
- Define a `river_briefing` Nostr event envelope wrapping the existing markdown output — same content, now also machine-readable.
- Briefing events must carry the Z2 npub, not a Z1 identifier. River Smith's relay identity is a system-level Z2 agent, not a household identity.
- Replies to River Smith briefings from other agents must be human-reviewable before they influence any operational decision.

**Flag:** River Smith's existing scheduler identity needs a key pair before Tier 2 work can proceed.  
**Compliance:** ✅ Safe now (briefing event envelope stub) / ⏳ Requires system npub (live participation).

---

### 2.5 Task Autopilot → fully agent-compatible task triage

**Why Z2:** Task triage is operational — it acts on work items across constellations, not on personal identity. The Aquifer (the pre-curated list of projects) is a Z2 construct: it tracks projects by URL and label, not by household.

**Buzz leverage:**  
The Autopilot's triage logic (GREEN/AMBER/RED classification) is already structured enough to be a Buzz-compatible decision engine. Agents with delegated npub access can propose tasks (POST a new task event via Nostr), receive triage classification in return, and act on GREEN approvals without human intervention. AMBER items remain human-gated (binary decisions). RED items always require a council seat deliberation.

The `acknowledgedGuardrails` pattern from Daily Picks applies here too: each task approval is a consent event that agents can observe.

**Human/agent compatibility changes needed:**
- Add `actor_type: "human" | "agent"` to task records (Tier 1).
- Agent task-posting must be via a signed Nostr event with a delegated npub; North Star verifies the signature before inserting (Tier 2).
- Auto-approve logic for GREEN must remain human-auditable: every auto-approval is a signed event.
- RED deliberation always routes to a human council seat — agents cannot self-approve RED items.

**Compliance:** ✅ Tier 1 (actor_type) / ⏳ Tier 2 (agent posting via signed event).

---

### 2.6 Helping Hands → fully agent-compatible labour market

**Why Z2:** HH tasks are community work — above the household (Z1) but below the fully public market (Z3). The Workbench is the right home: practitioners posting and claiming work, with settlement crossing into Z3 at the payment moment.

**Buzz leverage:**  
HH is the most Buzz-native feature in North Star. The full task lifecycle maps directly to Buzz events:

| Stage | Buzz event |
|---|---|
| Post task | Human or agent posts NIP-xx event with task description, skills required, XRP offer |
| Claim task | Agent or human replies with intent event (signed npub) |
| Complete task | Agent posts proof event (completion hash, duration, output reference) |
| Confirm | Human or oracle verifies the proof event |
| Settle | XRPL escrow releases on verified completion event |

Badge progression (watching → doing → teaching) stays **human-gated at the "teaching" tier**. An agent may attain "watching" and "doing" tiers through verified completions, but "teaching" requires a human co-attestation. This preserves the social trust layer at the boundary that matters most.

**Human/agent compatibility changes needed:**
- Add `actor_type: "human" | "agent"` to HH Task records (Tier 1).
- Define machine-readable event envelopes for all five lifecycle stages (Tier 2).
- The "teaching" badge tier must have a hard `human_required: true` flag in its attestation schema (Tier 3, VC schema lock).

**Compliance:** ✅ Tier 1 / ⏳ Tier 2 (full event lifecycle) / ⏳ Tier 3 (VC badge envelopes).

---

### 2.7 HH Badges → Nostr VC attestation

**Why Z2:** Skill credentials are practitioner-layer identity — they describe what a person can do in community work contexts, not who they are in their household.

**Buzz leverage:**  
XRPL DIDs already exist for HH badges. The addition is a Nostr-signed VC wrapper: a W3C Verifiable Credential with a Nostr signature, so any Buzz participant can verify a badge by querying a relay — no XRPL node access required. The credential contains the constellation's Z2 npub (not the household name), the skill tier, and the attesting npub(s).

A badge verification endpoint (`given a npub, return verifiable credentials`) eliminates the friction of XRPL queries for practitioners who only need to know "can this person do this work?"

**Human/agent compatibility changes needed:**
- Wrap XRPL DID badges in Nostr-signed VC envelope (Tier 3).
- Build agent-readable badge verification endpoint (Tier 3).
- The "teaching" attestation must include at least one human co-signer npub.

**Flag:** Tier 3 is blocked on VC schema lock. Do not build the VC wrapper until the schema is finalised.  
**Compliance:** ⏳ Tier 3 (requires VC schema lock).

---

### 2.8 Inbox / Gmail Archive Mining → agent ingestion surface

**Why Z2:** Email archive mining is operational — it processes raw material (email) into reusable knowledge assets. The Z2 layer is where knowledge gets structured for work, not where it stays private (Z1) or becomes public (Z3).

**Buzz leverage:**  
Agents can be granted a scoped read token — not a Z1 Gmail credential, but a limited access token that allows ingestion of pre-fetched archive batches. The agent reads the batch, produces tagging suggestions as Nostr events, and posts them back to the household's Z2 relay channel. The human reviews the suggestions before any item enters the Content Bank.

This pattern preserves the Z1→Z2 gate: the raw Gmail credential never leaves Z1. The agent only sees the already-fetched batch, and its output requires human approval before crossing into the permanent Content Bank.

**Human/agent compatibility changes needed:**
- Define a scoped read token protocol: human grants token, agent receives pre-fetched batch, agent posts tagging events, human approves before Content Bank insertion (Tier 3).
- The token must not grant access to the raw Gmail credential or to any Z1 identity fields on `GmailAccount` (address, fullName).
- The `hatLabels` field on the inbox configuration is a Z2 operational map — it may be visible to agents for tagging context but must not be used to infer Z1 identity.

**Compliance:** ⏳ Tier 3 (scoped read token, human-approval gate).

---

### 2.9 Content Bank → agent-readable knowledge asset store

**Why Z2:** The Content Bank stores structured knowledge assets tagged by zone and content type. Zone-tagged assets are zone-appropriate: a Z2-tagged item is Workbench knowledge, appropriate for agent access.

**Buzz leverage:**  
Agents can query the Content Bank for Z2-tagged items matching their current task context. A `retrieve(zone: "Z2", contentType: "course-material")` query returns relevant assets without exposing Z1-tagged items. The zone field on `ContentBankItem` becomes the access-control boundary for agent queries.

**Human/agent compatibility changes needed:**
- Zone-scoped read API for Content Bank (agents may only query their delegated zone or lower).
- Z1-tagged items must be permanently excluded from agent queries — the zone field is the hard gate.

**Compliance:** ✅ Safe now (zone-scoped read is a straightforward API filter).

---

### 2.10 Captures → agent ingestion surface (limited)

**Why Z2:** Captures are quick-capture items — they may contain Z1 content (personal notes) or Z2 content (operational observations). Zone-tagging at capture time determines agent access.

**Buzz leverage:**  
An agent with a processing delegation can read Captures that have been explicitly zone-tagged Z2 or above (never Z1) and propose Content Bank entries from them. The human approves before promotion to the Content Bank.

**Human/agent compatibility changes needed:**
- Add a zone field to `Capture` (currently absent — it has text and blobId only).
- Zone must default to Z1 (private) until the human explicitly promotes it. Agents may not read Z1 Captures.

**Compliance:** ✅ Safe now (zone field addition is Tier 1).

---

### 2.11 Workbench Plan → agent scheduling signal

**Why Z2:** The Workbench Plan is operational scheduling — burst windows, phases, notes. It belongs in Z2 because it describes how a practitioner allocates time for work, not who they are.

**Buzz leverage:**  
Published as a structured Nostr event so agents know when burst windows are active. When a burst window is published, agents can queue or defer work-intensive tasks accordingly — they don't interrupt deep work.

The `burstMinutes` and `windows` fields map to a simple scheduling event: `{ kind: TBD, active_from: ISO, active_until: ISO, burst_minutes: number, phase: string }`.

**Human/agent compatibility changes needed:**
- Emit a Workbench Plan event from the plan save action (Tier 1 stub, Tier 2 relay connection).
- Agents must treat the plan as a scheduling signal only — not as an identity disclosure.

**Compliance:** ✅ Safe now (event stub) / ⏳ Tier 2 (relay publishing).

---

### 2.12 Weekly / Seasonal Reviews → agent-readable cadence signal

**Why Z2:** Reviews are operational reflection — they track whether work is progressing, not who the person is. The `zonesShifted` field on `SeasonalReview` is a Z2 structural signal: it tells agents which zones are currently active for this household.

**Buzz leverage:**  
Published as a structured event at review time. Agents subscribed to the household's Z2 channel receive the cadence signal and can adjust their scheduling accordingly (e.g., if the seasonal review notes a zone shift, agents re-calibrate which constellation channels to monitor).

**Human/agent compatibility changes needed:**
- Emit a weekly-review event and seasonal-review event from the review save actions (Tier 1 stub).
- The `statementReflection` field on `SeasonalReview` must be excluded from agent-visible events (it may contain Z1 personal content).

**Compliance:** ✅ Safe now (event stub, with `statementReflection` excluded).

---

### 2.13 Backup / Export → sovereignty layer (agent-excluded)

**Why Z2 (with Z1 protection):** The backup export contains the full `AppState` including potentially Z1-sensitive content (statement fields: `who`, `why`, `noFly`). This feature is human-only — no agent may trigger, read, or transmit a backup export.

**Buzz leverage:** None. This feature is intentionally outside the agent layer.

**Human/agent compatibility changes needed:**
- Add a hard `human_only: true` guard to the export action — no signed agent event may trigger it.
- The backup JSON must be treated as a Z1 document in any future encryption or storage scheme.

**Compliance:** ✅ Already safe — no changes needed beyond the guard annotation.

---

### 2.14 Zone Gate UI (ZoneGate.tsx) → machine-checkable gate event

**Why Z2:** The Zone Gate is the literal boundary marker — the visible consent moment at Z1→Z2 and Z2→Z3 crossings. Its position in the UI is Z2 (it renders in the Workbench layer's constellation picker).

**Buzz leverage:**  
Each human crossing produces a signed gate-crossing event (Nostr custom kind, TBD). The event contains: the crossing direction (`Z1→Z2` or `Z2→Z3`), a timestamp, and the Z2 npub. No Z1 data is included. Agents observe gate-crossing events to understand the current operating context — they know the operator has crossed into the Workbench before taking action on Workbench tasks.

This makes the consent moment auditable: a regulatory audit can see "at 09:14, the practitioner crossed into the Workbench" without knowing who the practitioner is behind the household.

**Human/agent compatibility changes needed:**
- Emit a gate-crossing event from `ZoneGate.tsx` on each render of a crossing (Tier 2, requires relay connection).
- The event must contain zero Z1 fields. The crossing direction and Z2 npub are sufficient.
- Agents may observe but never emit gate-crossing events — crossing is a human act.

**Compliance:** ⏳ Tier 2 (requires relay connection and Z2 npub).

---

## 3. Buzz-Layer Alignment

### 3.1 Architecture Overview

North Star is the **business-operating surface**. Buzz (a Nostr-based open collaboration layer) wraps it as the **communication and coordination fabric**. The relationship is:

```
┌──────────────────────────────────────────────────────────┐
│                    Buzz / Nostr Relay                    │
│  (Z2 pseudonymous identity — npub, not household name)   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │              North Star                            │  │
│  │   (business operating surface — Z2 Workbench)     │  │
│  │                                                    │  │
│  │  Constellations · Daily Picks · Contracts          │  │
│  │  Kitchen Table · Task Autopilot · Helping Hands    │  │
│  │  Content Bank · Workbench Plan · Reviews           │  │
│  └────────────────────────────────────────────────────┘  │
│                          ↕ events                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  River Smith  │  │ HH Agents   │  │ Peer npubs   │   │
│  │  (Z2 npub)   │  │ (delegated) │  │ (community)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────┘
         ↕ (Z2→Z3 gate only — settlement events)
┌──────────────────────────────────────────────────────────┐
│                   XRPL — Z3 Settlement                   │
│         (wallet addresses, escrow, DIDs, IOUs)           │
└──────────────────────────────────────────────────────────┘
```

The Z1 household identity is **never in this diagram**. It exists only inside the Z1→Z2 gate — enough to know whose work this is, but invisible on the relay.

### 3.2 Z2 npub Identity and the Eave Rule

The Z2 npub is derived from the household's existing seed, scoped to Z2, and non-reversible to Z1. Concretely:

- **Derivation:** `npub = HKDF(household_seed, "zone:Z2", length=32)` — a one-way function. Given the npub, it is not possible to recover the household seed.
- **Scope:** The Z2 npub is used exclusively for Workbench-layer events. It is not the household's personal public key.
- **Relay topology:** The Z2 npub subscribes to a Headwaters Nostr relay (Tier 2). Events published under the Z2 npub are visible to other Z2 participants on that relay, but the relay does not store or expose Z1 identity.
- **Eave Rule compliance:** The npub is a Z2 pseudonym — it satisfies the requirement that contractor identification may appear in controlled form without being composable into a Z3→Z1 reverse lookup. Given a Z2 npub, no relay query can recover the household name or passphrase.

### 3.3 Task Lifecycle on Buzz

```
Create  →  Claim  →  Complete  →  Confirm  →  Settle
```

| Stage | Actor | Event | Notes |
|---|---|---|---|
| **Create** | Human or agent | NIP-xx event with task description, zone, skills, XRP offer | Zone must be Z2 or Z3; no Z1 fields |
| **Claim** | Agent or human | Reply event with intent + actor_type | Claim is an intent, not a lock |
| **Complete** | Agent | Proof event: completion hash, duration, output reference | Proof is auditable but not personally identifying |
| **Confirm** | Human or oracle | Verification event: signs the proof event's hash | Human-gated for all HH tasks |
| **Settle** | XRPL (automatic) | Escrow release on confirmed completion event | Z3 event — wallet addresses appear here only |

**Hard rules:**
- Agents may Create and Complete tasks.
- Agents may Claim tasks if they have a delegated npub.
- Confirm always requires a human (or a human-designated oracle with a time-limited grant).
- Settle is automatic — no human step needed once Confirm is done.
- The Z3 wallet address appears only in the Settle event and in the escrow record. It does not persist in any Z2 task record.

### 3.4 Permission Model

| Action | Default | Requires explicit delegation | Permanently out of scope for agents |
|---|---|---|---|
| Read Z2-tagged Content Bank items | ✅ | — | — |
| Read morning manifest | ✅ | — | — |
| Read gate-crossing events | ✅ | — | — |
| Post task (Create) | — | ✅ Signed grant from human npub | — |
| Claim task | — | ✅ Delegated npub with claim scope | — |
| Post completion proof | — | ✅ Task-scoped grant | — |
| Read Z1-tagged items (any) | — | — | ❌ Permanent prohibition |
| Trigger backup export | — | — | ❌ Human-only |
| Emit gate-crossing events | — | — | ❌ Human act only |
| Enumerate household's constellations | — | — | ❌ Traverses Z1→Z2 gate |
| Read `linkedFamilyId` / `linkedShareToken` | — | — | ❌ Eave Rule subjects |
| Access `statement` fields (who/why/noFly) | — | — | ❌ Z1 personal identity |
| Attain "teaching" badge tier autonomously | — | — | ❌ Human co-attestation required |

**Grant format:** A delegation is a signed Nostr event: `{ kind: TBD_GRANT, grantor_npub: Z2_npub, grantee_npub: agent_npub, scope: ["claim", "complete"], constellation_id: string, expires_at: ISO, signature: string }`. The grant is time-limited and constellation-scoped.

### 3.5 Audit Trail

Every event in the Buzz layer is signed, timestamped, and stored on the relay. The audit trail covers:

- Gate crossings (direction + Z2 npub + timestamp — no Z1 data)
- Task lifecycle steps (Create → Claim → Complete → Confirm → Settle)
- Payment settlement (XRPL escrow release events)
- Badge attestations (VC issuance events)
- Delegation grants and revocations

**The giraffe constraint applies throughout:** A regulator or auditor can query the relay and see: "On this date, this Z2 npub posted this task, claimed by this agent npub, completed with this proof, confirmed by this human npub, settled to this wallet address." They cannot query: "Which household is behind this Z2 npub?" The giraffe sees over the fence; it cannot see through the eave.

### 3.6 `acknowledgedGuardrails` as Machine-Checkable Consent

The `acknowledgedGuardrails` field on `DailyPick` is already the right shape for a Buzz consent record. In the Buzz layer:

- The morning manifest event includes the list of acknowledged guardrail IDs.
- Agents read this list before taking action on delegated tasks. If a required guardrail has not been acknowledged for the current day, the agent defers and notifies rather than proceeds.
- The acknowledgement is signed by the Z2 npub — it is an auditable consent record, not just a UI checkbox.

---

## 4. Concrete Implementation Steps (prioritised)

### Tier 1 — Safe to build now (no VC schema lock or system npub required)

These steps extend existing types and add stubs shaped for future relay connection. They do not require any external dependency and do not violate the Eave Rule.

**Step 1 — Add `actor_type` discriminator to HH Task and DailyPick records**
- Add `actor_type: "human" | "agent"` to the `DailyPick` type in `artifacts/north-star/src/types.ts`.
- Add the same field to the HH Task type when the HH schema is formalised.
- Default: `"human"` — no existing behaviour changes.
- Eave check: ✅ This field is Z2-scoped and contains no identity information.

**Step 2 — Define Z2 npub generation utility in `lib/zone-identity`**
- Create `lib/zone-identity/src/index.ts` with a `deriveZ2Npub(householdSeed: Uint8Array): string` function.
- Use HKDF-SHA256 with domain separator `"headwaters:zone:Z2:npub"`.
- The function must be one-way: no `recoverSeed` or inverse function.
- Write a unit test confirming that the same seed always produces the same npub, and that two different seeds produce different npubs.
- Eave check: ✅ Non-reversible by construction. Document this explicitly in the function's JSDoc.

**Step 3 — Add `publishToRelay(event)` stub in North Star**
- Create `artifacts/north-star/src/lib/relay-stub.ts` with a `publishToRelay(event: NostrEvent) => Promise<void>` function.
- Currently writes to `localStorage` under `"ns:relay:events"` with the event envelope: `{ kind, payload, z2npub, timestamp, signature: "stub" }`.
- Shape matches the real Nostr relay interface so Tier 2 wiring is a drop-in replacement.
- Eave check: ✅ Event envelope has no Z1 fields by design. Add a lint-time assertion that validates the envelope before storage.

**Step 4 — Emit structured "morning manifest" JSON from Daily Picks**
- In the daily picks save action, generate a `MorningManifest` object: `{ date, constellation_ids: string[], acknowledged_guardrails: string[], burst_windows: WorkbenchPlan | null, zone_ranking: ZoneId[] }`.
- No Z1 fields. No household name. No passphrase-derived data.
- Call `publishToRelay` with the manifest as payload (writes to localStorage stub in Tier 1).
- Eave check: ✅ Manifest contains Z2 constellation IDs and zone metadata only.

**Step 5 — Add `river_briefings` Nostr event envelope**
- In `RiverSmithPanel.tsx` / the River Smith API handler, after generating a briefing, also emit a structured event: `{ kind: TBD, generated_at: ISO, triggered_by: "human" | "scheduler", markdown_hash: string, structured_payload: { dimensions: [...] } }`.
- The event wraps the existing markdown output — it does not replace it.
- The `rawMarkdown` field is not included in the event payload (too large, too personal). The structured payload is the machine-readable summary.
- Call `publishToRelay` with this event (localStorage stub in Tier 1).
- Eave check: ✅ Event contains operational metadata only.

**Step 6 — Add zone field to `Capture`**
- Add `zone?: ZoneId` to the `Capture` type, defaulting to `undefined` (treated as Z1/private).
- Agents may not read Captures where `zone` is undefined or `"Z1"`.
- Eave check: ✅ Zone field is a classification marker, not an identity field.

---

### Tier 2 — Requires system npub to be established first

These steps require a real Nostr relay connection and a registered Z2 npub for the Headwaters system.

**Prerequisite:** Register North Star's Z2 npub on a Headwaters Nostr relay. Configure `NOSTR_RELAY_URL` and `NOSTR_SYSTEM_NPUB` in environment.

**Step 7 — Wire `publishToRelay` stub to real relay connection**
- Replace localStorage write in `relay-stub.ts` with a WebSocket connection to the configured relay.
- Add NIP-01 signing using the Z2 npub's private key (stored in env, never in client state).
- The stub interface is unchanged — Tier 1 callers automatically gain real relay publishing.

**Step 8 — Implement Helping Hands agent task-posting**
- An agent with a granted npub posts a new HH task via a signed Nostr event.
- North Star's API verifies the signature and the grant before inserting the task.
- Grant verification: check that a valid delegation grant exists for the agent npub, scoped to the target constellation, not expired.
- Eave check: ✅ Task post contains Z2 constellation ID, task description, XRP offer. No Z1 fields.

**Step 9 — Implement agent task-completion event**
- A signed Nostr event from an agent's npub triggers the XRPL escrow release path.
- The completion event must reference the task ID, include a completion proof hash, and be signed by the delegated npub.
- North Star verifies: (a) valid signature, (b) agent holds a completion-scope grant for this task, (c) a human Confirm event is present before escrow release fires.
- Eave check: ✅ Escrow release uses the Z3 wallet address from the task's original XRP offer — it does not derive the wallet from any Z1 field.

**Step 10 — Publish zone-gate crossing events from `ZoneGate.tsx`**
- On render of a gate crossing (Z1→Z2 or Z2→Z3), emit a crossing event via `publishToRelay`.
- Payload: `{ kind: TBD_GATE_CROSSING, crossing: "Z1→Z2" | "Z2→Z3", z2npub: string, crossed_at: ISO }`.
- No Z1 data. No constellation list. No household reference.
- Eave check: ✅ Crossing direction and timestamp only. Agents observe, never emit.

---

### Tier 3 — Wait for VC schema lock

These steps require the Verifiable Credential schema to be finalised and locked before building.

**Step 11 — Wrap XRPL DID badges in Nostr-signed VC envelope**
- Given a locked W3C VC schema, produce a VC for each HH badge: `{ @context, type: ["VerifiableCredential", "HHSkillBadge"], issuer: system_npub, credentialSubject: { id: z2npub, skill: string, tier: "watching" | "doing" | "teaching", constellation_id: string }, proof: { type: "NostrSignature", ... } }`.
- The "teaching" tier VC must include a `human_co_attested_by` field with at least one human npub.

**Step 12 — Build agent-readable badge verification endpoint**
- `GET /api/badges/verify?npub=<z2npub>` returns a list of VCs for that npub.
- No XRPL query required by the caller — the endpoint resolves the DID internally.
- Returns only VCs for the requested npub; no enumeration of all badge holders.

**Step 13 — Implement scoped agent read-token for Inbox/Archive Mining**
- Human grants a time-limited read token (not a Gmail credential) for a specific email batch.
- Agent reads batch, posts tagging suggestions as Nostr events to the household's Z2 channel.
- Human reviews and approves before Content Bank insertion.
- Token must not expose: Gmail address, full name, or any Z1 identity field from `GmailAccount`.

**Step 14 — Implement programmable contract milestone → escrow release**
- A structured attestation event (human or agent) triggers XRPL escrow release.
- Attestation event: `{ kind: TBD_MILESTONE, contract_id, milestone_description, completed_hours, attested_by: z2npub, actor_type: "human" | "agent", timestamp }`.
- Escrow release fires only after attestation is confirmed (human Confirm event).

---

### Flags — items requiring explicit review before Tier 2 work begins

> **Flag A:** `linkedFamilyId` and `linkedShareToken` on `Constellation` must be reviewed before any Buzz-layer feature touches them. Both are Eave Rule subjects. Neither is currently safe for agent read access. Any Tier 2 feature that queries constellation records must explicitly exclude these fields.

> **Flag B:** The `zone_bindings` table described in `schema-notes.md` does not yet exist. Tier 2 work assumes it is built first, with the direction lock enforced: `household_id → wallet_address` only, never the reverse.

> **Flag C:** River Smith's existing scheduler identity (the `/api/river-smith` service) needs a key pair before it can participate as a named Buzz agent. This is a prerequisite for Step 7 (Tier 2).

> **Flag D:** The `statement` fields on `AppState` (`who`, `why`, `noFly`) are Z1 personal identity. They must be permanently excluded from all agent-readable event envelopes and relay queries. Any new API route that touches `AppState` must strip these fields before agent-accessible responses.

---

## 5. Benefits Summary (plain language, for a skeptical rural business owner)

*No protocol names. No blockchain jargon. Just what you actually get.*

---

**Your work stays private to your household.**

Right now, the app already keeps your household life in one pile and your community business in another. That separation is built into the structure — not just a setting you can accidentally turn off. When you open North Star to plan your store's week, your household details stay invisible. The store work and the household work share the same tool but never the same room.

---

**Your reputation travels with you without your name.**

If you earn a skill badge — say, for completing cold-storage logistics work — that badge is yours. It's not stored in our database as "Bobbie from Deer Lake." It's a record that says "the person who holds this key completed this skill to this standard, verified by the community." If Headwaters ever closes, the badge still exists. If you move to another community using the same system, the badge follows. Your name is never attached to it unless you choose to attach it yourself.

---

**Payments for community work settle automatically — no chasing anyone.**

When you post a task in the community labour exchange, you can attach a payment to it upfront — held in escrow. When the work is done, and a community member confirms it, the payment releases automatically. No invoice. No waiting. No awkward "hey, did you send that yet?" conversation. This works for anything from "I need someone to haul feed this Friday" to a week-long construction project.

---

**The AI assistant that already helps you plan your week can now take real tasks off your plate — and show you proof.**

River Smith already reads the week's priorities every night and gives you a briefing in the morning. The next step is that River Smith — and other small AI helpers — can actually do tasks, not just describe them. They post their completed work as a record you can verify. You confirm it before anything is finalized. You stay in the decision seat; they do the legwork.

---

**Your skills are recognised in a way that follows you.**

The community labour exchange isn't just a job board. Every task you complete adds to a skill record — one that any participating community can read without needing to call Headwaters and ask. New projects, new partners, new opportunities: your track record is already there, readable by anyone you choose to share it with.

---

**None of this requires a bank account, a credit check, or a platform middleman.**

The payment layer runs on a shared ledger — the same one that a growing number of rural and First Nations communities are building on for exactly this reason. You need a wallet address, not a bank account. Headwaters runs the relay; you hold the keys. If Headwaters steps back, the system keeps running.

---

**One honest word of caution.**

This is a roadmap, not a product you can use today. The pieces that are ready — the zone separation, the daily planning, the backlog triage — those work now. The agent participation and automatic payment settlement are 6–18 months away, depending on how the community validation goes. We are building this in public and in order.

---

## 6. Missing Information

The following items could not be determined from the codebase alone and require external confirmation before the implementation roadmap can be fully executed.

| # | Item | Where it blocks | Who can answer |
|---|---|---|---|
| 1 | **System npub / Headwaters Nostr relay URL** — Does a Headwaters Nostr relay already exist? Is there an established system npub for North Star? | All Tier 2 steps are blocked without this. | Founder / infrastructure owner |
| 2 | **River Smith key pair** — Does the River Smith scheduler service have a dedicated key pair, or does it run under a shared system key? | Step 5 (Tier 1 envelope stub) can proceed; Step 7 (Tier 2 live participation) is blocked. | Server-side configuration |
| 3 | **VC schema version target** — What is the intended W3C VC schema version, and is there a lock date? | All Tier 3 steps are blocked until schema is locked. | Protocol team / schema author |
| 4 | **HH schema formalisation** — `lib/db/src/schema/helpingHands.ts` is referenced in the task spec but does not exist in the current monorepo. The full HH task lifecycle (Create → Settle) cannot be fully specified without it. | Steps 8, 9, and 14 need the HH schema before implementation. | DB schema owner |
| 5 | **`zone_bindings` table** — Does not yet exist (noted in `schema-notes.md`). Tier 2 assumes it is built with the direction lock enforced. | Steps 8 and 14 assume this table exists. | DB schema owner |
| 6 | **XRPL escrow path stub** — The spec references "the XRPL escrow release path already stubbed in the HH settlement flow." This stub was not found in the current codebase. Confirm whether the stub exists in a branch or needs to be written from scratch. | Steps 9 and 14 depend on this stub. | Developer |
| 7 | **Nostr event kind assignments** — Custom event kinds (TBD_GATE_CROSSING, TBD_GRANT, TBD_MILESTONE, etc.) need assigned kind numbers that do not conflict with existing NIPs. | All Tier 2+ event definitions need this before finalisation. | Protocol team |
| 8 | **Household seed storage** — Where is the household seed currently stored (localStorage, server-side, hardware wallet)? The Z2 npub derivation in Step 2 must be consistent with the existing seed storage model. | Step 2 implementation depends on this. | Developer / founder |

---

*Document maintained alongside `docs/zones-gates-reference.md` and `artifacts/north-star/src/schema-notes.md`. Any proposed change to this roadmap must pass the Eave Rule test in `schema-notes.md` § "How to test a proposed change against the Eave Rule" before being actioned.*
