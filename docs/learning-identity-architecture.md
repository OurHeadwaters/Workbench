# Helping Hands — XRPL/DID Graduation Path Architecture

*Canonical reference for the settlement layer. Written June 2026. Every agent or builder who touches the on-chain layer should start here.*

---

## Purpose

This document closes the "perpetually not built" risk for the Headwaters on-chain settlement layer. It makes the gap formal, bounded, and buildable in phases. It is not a commitment to build any specific phase by any specific date — it is a precise map of what exists today, what is targeted for v2, and what is long-range.

**Build phases used throughout this document:**

| Label | Meaning |
|-------|---------|
| **[LIVE]** | Running today. Simulated in DB — no XRPL transactions. Schema is production-ready. |
| **[V2]** | Next build target. Requires XRPL mainnet integration, but no new schema changes. |
| **[LONG-RANGE]** | Architecturally designed but deliberately deferred — AMM pools, Drip Harvester, Giving Well. |

---

## 1. The Graduation Stack

The full value-flow stack, bottom to top, from ambient micro-payment to commons contribution:

```
Lightning / v4v          [LONG-RANGE] ambient stream — media, listening, micro-sats
      ↓
P2P Engine (Tips)        [LIVE/V2]   lateral peer-to-peer value flow
      ↓
Helping Hands (Tasks)    [LIVE/V2]   structured work, credentials, reliability
      ↓
Envelopes (Custodial)    [LIVE]      named buckets, spending at local merchants
      ↓
Headwaters Bucket System [V2]        self-custody, Xaman wallet, RLUSD on XRPL
      ↓
Drip Harvester           [LONG-RANGE] savings earning yield in AMM pools
      ↓
Giving Well / Tithe      [LONG-RANGE] appreciated gains return to the commons
```

A member starts anywhere in the middle of this stack. The graduation path is a one-way ratchet upward — earning Community Tokens in Helping Hands is the entry; holding real RLUSD in a Xaman wallet with full on-chain badge credentials is the destination.

---

## 2. Identity Architecture — The Three-Table DID Model

The identity layer has three logical tiers. All three exist in the DB today; only the first is fully populated. The second and third gain on-chain anchors in v2.

### Tier 1 — Member Identity `[LIVE]`

**DB table:** `hh_members`

The primary identity record. Contains the member's off-chain profile, wallet state, and custodial balance metadata.

Key fields relevant to the DID path:

| Field | Role | XRPL counterpart |
|-------|------|-----------------|
| `id` (UUID) | Internal primary key | None — DB-only |
| `clerk_user_id` | Auth identity (Clerk) | None — Auth-layer only |
| `xrpl_address` | The member's XRPL account address | XRPL `Account` field |
| `did_ref` | Pointer to the on-chain DID document | `xrpl:did:<address>` URI |
| `wallet_type` | `custodial` or `self_custody` | Determines key-holder |
| `wallet_revealed_at` | First value event timestamp | Milestone for DID issuance |

In **[LIVE]** phase: `xrpl_address` and `did_ref` are null for all custodial members. The Aquifer holds a platform-controlled XRPL address internally for custodial settlement without exposing it to the member.

In **[V2]** phase: when a member initiates the Xaman handoff (§5), `xrpl_address` is populated with their personal wallet, `wallet_type` flips to `self_custody`, and `did_ref` is set to their canonical DID URI.

### Tier 2 — Credential Record `[LIVE → V2]`

**DB table:** `hh_member_badges` + `hh_badge_categories`

The credential record holds the member's attested skill progression. In **[LIVE]** phase this is a fully functional off-chain credentialing system — stages advance through admin/peer attestation, with the full `watching → learning → practicing → teaching` pipeline running in the DB.

In **[V2]** phase, each badge advancement at `practicing` or above generates a Verifiable Credential (VC) signed by the issuer's XRPL DID and anchored to the member's DID document. The DB row is authoritative for the application; the VC is the portable, verifiable export.

Key fields:

| Field | Role | XRPL/DID counterpart |
|-------|------|----------------------|
| `hh_member_badges.id` (UUID) | Internal badge record key | VC `id` claim |
| `hh_member_badges.category_id` | FK to badge category | VC `type` array |
| `hh_member_badges.stage` | `watching/learning/practicing/teaching` | VC `credentialSubject.stage` |
| `hh_member_badges.issued_by_member_id` | Issuing member | VC `issuer` DID |
| `hh_member_badges.updated_at` | Last advancement timestamp | VC `issuanceDate` |
| `hh_badge_categories.name` | Human-readable skill name | VC subject label |
| `hh_badge_categories.domain` | Domain grouping | VC subject taxonomy |

### Tier 3 — On-Chain Anchor `[V2]`

The on-chain anchor is an XRPL DID document stored at the member's XRPL address via the `DIDSet` transaction type (XRPL amendment `DID`). It contains:

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:xrpl:1:<xrpl_address>",
  "verificationMethod": [{
    "id": "did:xrpl:1:<xrpl_address>#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:xrpl:1:<xrpl_address>",
    "publicKeyMultibase": "<xrpl_public_key>"
  }],
  "service": [{
    "id": "did:xrpl:1:<xrpl_address>#hhCredentials",
    "type": "LinkedVerifiablePresentation",
    "serviceEndpoint": "https://ourheadwaters.ca/api/did/<xrpl_address>/credentials"
  }]
}
```

The `serviceEndpoint` points to the Aquifer, which serves a signed credential bundle for any resolver. The on-chain anchor is minimal by design — the DID document holds the key material; the Aquifer holds the credential content; the XRPL ledger holds the attestation that the key material is controlled by this address.

---

## 3. XRPL Escrow Payment Design

### 3.1 Task Payment Lifecycle

The task payment lifecycle is fully modeled in the DB. The XRPL escrow fields are populated in **[V2]** when task pay is settled on-chain.

**Current DB model for task payments** (`hh_tasks` + `hh_earnings`):

```
Task posted (status: available)
  → claimed (status: claimed, claimed_at set)
  → completed by member (status: completed, completed_at set)
  → confirmed by admin (status: confirmed, confirmed_at set)
  → paid (hh_earnings row created)
```

**V2 XRPL escrow overlay:**

```
Task posted
  → Admin creates EscrowCreate tx on XRPL
      Condition:  FinishAfter = confirmedAt + buffer (e.g. 24h)
      Amount:     payAmount in drops (XRP) or IOU (RLUSD/community token)
      escrow_sequence written to hh_tasks.escrow_sequence
      escrow_tx_hash written to hh_tasks.escrow_tx_hash
  → Member claims
  → Member completes
  → Admin confirms
      Aquifer broadcasts EscrowFinish tx
      hh_earnings.xrpl_tx_hash set to the EscrowFinish tx hash
  → Payment is on-chain and verifiable
```

### 3.2 No-Show / Missed Claim Handling

If a task times out without completion (`no_show_count` incremented), the escrow is cancelled via `EscrowCancel`. The funds return to the band's operating wallet. No-show tracking continues in the DB as today — the XRPL layer adds the financial consequence (funds return) on top of the existing reputation consequence (no-show count incremented).

### 3.3 DB → XRPL Field Mapping for Task Payments

| DB field | XRPL field | Notes |
|----------|-----------|-------|
| `hh_tasks.pay_amount` | `EscrowCreate.Amount` | Convert to drops for XRP; IOU format for tokens |
| `hh_tasks.pay_currency` | `EscrowCreate.Amount.currency` | `XRP` → drops; `token` → IOU currency code from band |
| `hh_tasks.escrow_sequence` | `EscrowCreate.Sequence` | Stored for EscrowFinish reference |
| `hh_tasks.escrow_tx_hash` | `EscrowCreate.hash` | Stored for audit trail |
| `hh_earnings.xrpl_tx_hash` | `EscrowFinish.hash` | Written after confirmation |
| `hh_members.xrpl_address` | `EscrowFinish.Destination` | Member's wallet (custodial or self-custody) |

### 3.4 Community Token Escrow

Community Tokens are XRPL IOUs issued by the band's trust-line issuer wallet (`hh_bands.community_token_issuer`). Escrow for IOU amounts uses `EscrowCreate` with an IOU `Amount` object rather than drops. The band issuer wallet must have sufficient trust-line capacity to the member's address before EscrowFinish can settle.

---

## 4. Badge Credentials as XRPL DIDs

### 4.1 What a Verifiable Credential Looks Like On-Chain

A Helping Hands badge credential is a W3C Verifiable Credential signed with the issuer's XRPL private key. The credential is **not stored on-chain** (XRPL ledger storage is expensive for large payloads) — instead:

- The credential JSON is stored in the Aquifer DB (`hh_member_badges`, extended with a `vc_json` column in v2)
- The credential hash is stored in the XRPL DID document's `service` endpoint record
- The Aquifer's credential endpoint serves the signed VC to any resolver

**Credential shape for a "Teaching" badge:**

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://ourheadwaters.ca/context/helping-hands/v1"
  ],
  "id": "https://ourheadwaters.ca/api/did/<member_xrpl_address>/credentials/<badge_id>",
  "type": ["VerifiableCredential", "HelpingHandsBadge"],
  "issuer": "did:xrpl:1:<issuer_xrpl_address>",
  "issuanceDate": "<updated_at ISO timestamp>",
  "credentialSubject": {
    "id": "did:xrpl:1:<member_xrpl_address>",
    "badgeCategory": "<hh_badge_categories.name>",
    "domain": "<hh_badge_categories.domain>",
    "stage": "teaching",
    "bandId": "<hh_bands.id>",
    "bandName": "<hh_bands.name>"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "<timestamp>",
    "verificationMethod": "did:xrpl:1:<issuer_xrpl_address>#keys-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "<base58btc signature>"
  }
}
```

### 4.2 Stage Thresholds for Credential Issuance

Not every stage advancement generates an on-chain VC — only transitions that carry external value:

| Stage | On-chain VC issued? | Signer | Notes |
|-------|---------------------|--------|-------|
| `watching` | No | — | Self-initiated; no attestation required |
| `learning` | No | — | Active learning; off-chain record only |
| `practicing` | Yes **[V2]** | Admin/Knowledge Keeper DID | First externally-attested stage |
| `teaching` | Yes **[V2]** | Peer Teaching-holder DID | Peer-to-peer — requires a current `teaching` holder to sign |

This threshold design keeps the on-chain footprint minimal (only two VC types per skill) while preserving the full four-stage progression off-chain for progress tracking.

### 4.3 Peer-to-Peer Validation Ceremony

The `teaching` credential is the only credential that can be issued by a peer (another member who holds `teaching` in the same category) rather than requiring an admin. The ceremony:

1. **Proposer** — any member at `practicing` stage requests advancement
2. **Validator** — a current `teaching` holder reviews and approves in the Helping Hands UI
3. **Aquifer** — constructs the VC, prompts the validator to sign with their Xaman wallet
4. **Xaman** — displays the VC payload as a sign request; validator approves with their private key
5. **Aquifer** — stores the signed VC, updates `hh_member_badges.stage` to `teaching`, writes `issued_by_member_id`
6. **On-chain** — the validator's DID is now permanently linked to this credential as issuer

This is peer-to-peer credentialing: no institution, no central registry — the Teaching holder's reputation becomes the credential's backing.

---

## 5. Xaman Wallet Handoff Ceremony

### 5.1 The Trigger — First Value Event

The wallet reveal is triggered on first real value receipt (§ Progressive Wallet Reveal in the system overview). At this moment:

- `hh_members.wallet_revealed_at` is set
- The Aquifer sends a push/email notification: "You received value — here's your wallet"
- The member sees their custodial balance for the first time

This is the natural moment to surface the graduation path — the member now has something to protect.

### 5.2 The Handoff Flow

The Xaman handoff is a **[V2]** UX ceremony. It converts the member from `custodial` (platform holds keys) to `self_custody` (member holds keys). Steps:

1. **Member initiates** — taps "Claim your wallet" in the Helping Hands UI
2. **Aquifer prompts** — shows a plain-language explanation: "You're about to become the sole holder of your keys. If you lose them, no one can recover your funds."
3. **Xaman deep link** — the UI opens a Xaman deep link that creates a new XRPL account. Xaman handles key generation and seed phrase backup.
4. **Member returns address** — after Xaman setup, the member pastes (or QR-scans) their new XRPL address into the UI
5. **Aquifer verifies ownership** — the Aquifer issues a challenge (random memo), requests the member sign it via Xaman, and verifies the signature against the provided address. This prevents address spoofing.
6. **Migration** — once verified:
   - `hh_members.xrpl_address` = member's new address
   - `hh_members.wallet_type` = `self_custody`
   - Aquifer creates an XRPL DID document at the member's address (`DIDSet` transaction)
   - `hh_members.did_ref` = `did:xrpl:1:<address>`
   - Existing custodial balance is swept to the member's XRPL address via a settlement payment
   - Existing badge credentials are re-signed and anchored to the new DID
7. **Post-migration** — all future task payments and tips are routed directly to `xrpl_address`. The custodial sub-wallet is retired.

### 5.3 What Migrates

| Data | Migration behaviour |
|------|---------------------|
| Token balance | Swept to member's XRPL address as IOU payment |
| Badge records | Re-anchored to new DID; DB rows unchanged |
| Reliability record | Stays in DB; referenced in DID service endpoint |
| Earnings history | Immutable in DB; xrpl_tx_hash populated from migration sweep |
| Referral record | DB only; no migration needed |
| Envelope budgets | Reset at migration — member rebuilds envelopes in their own Xaman wallet context |

### 5.4 Trust and Safety Guarantees

- **No funds move until ownership is verified.** The Aquifer never sends to an address without the challenge-response signature check.
- **The platform cannot reverse migration.** Once `wallet_type = self_custody`, the Aquifer loses key control — this is intentional and should be stated clearly to the member before migration.
- **Custodial option remains.** A member can stay custodial indefinitely. Migration is always opt-in.
- **Band admin is notified** when a member migrates — the admin dashboard shows `wallet_type` and `xrpl_address` for operational awareness.

---

## 6. Long-Range Layer — Drip Harvester and Giving Well

These are architecturally positioned but not built. They are documented here so the v2 build does not accidentally close off the path.

### 6.1 Drip Harvester `[LONG-RANGE]`

A member's RLUSD balance in their Xaman wallet can be allocated to an XRPL AMM pool (the XRP Ledger's native Automated Market Maker). The Drip Harvester is a Headwaters-operated interface that:

- Displays available AMM pools with community-aligned assets
- Allows the member to allocate a portion of their balance as a liquidity position
- Displays accrued LP fees (the "drip") in real time
- Routes the drip back to the member's Xaman wallet on a schedule

No new XRPL primitives required — XRPL's `AMMDeposit` and `AMMWithdraw` transactions cover this fully. The Headwaters layer is purely UX and routing.

### 6.2 Giving Well / Tithe `[LONG-RANGE]`

When a member's Drip Harvester position has appreciated, they may direct a portion of the yield to the Giving Well — a community commons account. The Giving Well:

- Is a named XRPL account controlled by band governance (multi-sig)
- Receives voluntary contributions from members' AMM yield
- Funds are disbursed via community decision-making (governance tooling out of scope)

The Giving Well closes the loop: member earns → member saves → savings earn yield → portion of yield returns to community → community funds more opportunities → more members earn.

---

## 7. Build Sequence

To implement v2 without breaking the live system:

1. **Provision XRPL testnet wallets** — one band issuer wallet, one platform escrow wallet. Test all escrow flows on testnet first.
2. **Implement `EscrowCreate` on task post** — write `escrow_sequence` and `escrow_tx_hash` to `hh_tasks`. Gate behind a feature flag per band.
3. **Implement `EscrowFinish` on task confirm** — write `xrpl_tx_hash` to `hh_earnings`.
4. **Implement `DIDSet` on member migration** — the Xaman handoff ceremony writes the DID document.
5. **Implement VC signing for `practicing` and `teaching` badges** — extend `hh_member_badges` with `vc_json` column, wire Xaman sign request into the badge advancement flow.
6. **Ship Xaman handoff UI** — the member-facing ceremony. Block on testnet validation first.
7. **Flip feature flag to mainnet** — gradual rollout, one band at a time.

---

## 8. What Is Not In Scope Here

- Governance tooling (rate-setting, dispute resolution) — separate downstream work
- Lightning Network / v4v integration — different protocol, different build track
- Changing any live UI or API routes — this document is reference only until v2 build begins
- Actual XRPL library integration (`xrpl.js` / `xumm-sdk` wiring) — downstream implementation task

---

*This document is the canonical reference for the XRPL/DID settlement layer. Do not build against a speculative interface — hold the gap cleanly until the v2 build track opens. Update this document when a phase moves from planned to live.*
