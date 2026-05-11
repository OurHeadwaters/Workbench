# Headwaters — Internal Data Inventory

**Purpose:** Operator reference. Every table or field that holds personally identifiable information (PII) or financial data, with retention assumptions and role-based access notes.

**Last updated:** May 2026  
**Maintained by:** Operator / project lead

---

## Definitions

| Term | Meaning |
|------|---------|
| PII | Name, email, IP address, user-agent, or any field that could identify a natural person |
| Financial | Dollar amounts, transaction descriptions, vendor names, receipt details |
| Role: Owner | Headwaters principal — full read/write across all tables |
| Role: Ops Manager | Operations staff — read/write submissions and transactions, no role management |
| Role: Bookkeeper | External accountant — read ledger and submissions, limited write |
| Role: Food Handler | Store staff — write own submissions only, read own submissions only |
| Role: Operator | Passphrase-gated admin on codetry-ship — reads Ship Manifest and Intake |

---

## 1. Ship Manifest (`ship_manifest`)

Public sign-on form at `codetry-ship` `/sign-on`.

| Field | Type | Notes |
|-------|------|-------|
| `email` | PII | Natural key; used for confirmation email via Resend |
| `name` | PII | Displayed on operator manifest |
| `org` | PII (optional) | Self-reported organization |
| `role` | PII (optional) | Self-reported role or trade |
| `would_bring` | PII | Free-text; may contain personal detail |
| `would_want` | PII | Free-text; may contain personal detail |
| `source_ip` | PII | Captured on submission for abuse-rate limiting |
| `user_agent` | PII | Captured on submission |
| `notification_status` | Operational | Whether operator email sent |
| `reply_status` | Operational | Whether auto-reply sent to signer |

**Who can read:** Operator (passphrase-authenticated) via manifest page.  
**Who can write:** Public (unauthenticated), one row per email (upsert).  
**Retention assumption:** Kept until manually deleted by operator.  
**Processor contact:** Resend (confirmation/reply emails), API Server on Replit (hosting).

---

## 2. Community Intake (`community_intake`)

Public intake form at `codetry-ship` `/` (home page).

| Field | Type | Notes |
|-------|------|-------|
| `name` | PII | Required |
| `email` | PII | Required; used for follow-up |
| `community` | PII | Self-reported community name |
| `role` | PII (optional) | Self-reported |
| `what_they_need` | PII | Free-text; may contain personal detail |
| `source_ip` | PII | Captured on submission |
| `user_agent` | PII | Captured on submission |
| `status` | Operational | `new` / reviewed workflow status |
| `notification_status` | Operational | Operator email status |

**Who can read:** Operator (passphrase-authenticated).  
**Who can write:** Public (unauthenticated).  
**Retention assumption:** Kept until manually deleted by operator.  
**Processor contact:** Resend (operator notification), API Server on Replit.

---

## 3. Subcontract Submissions (`subcontract_submission`)

Work-log form on codetry-ship for subcontractor time/expense entry.

| Field | Type | Notes |
|-------|------|-------|
| `submitted_by` | PII | Free-text name of subcontractor |
| `project` | Financial | Project code |
| `work_date` | Financial | Date of work |
| `scope_item` | Financial | Scope line description |
| `description` | Financial / PII | May include personal detail |
| `hours` | Financial | Billable hours |
| `rate_per_hour` | Financial | Billing rate |
| `expense_description` | Financial | Expense detail |
| `expense_amount` | Financial | Dollar amount |

**Who can read:** Operator (passphrase-authenticated).  
**Who can write:** Authenticated subcontractor session (passphrase-gated).  
**Retention assumption:** Kept until manually deleted; relevant to contract audits.  
**Processor contact:** API Server on Replit.

---

## 4. Library Contributors (`contributors`)

Curator-managed list of people who submit entries to the Research Library.

| Field | Type | Notes |
|-------|------|-------|
| `name` | PII | Required |
| `email` | PII (optional) | Used for share-link delivery |
| `organization` | PII (optional) | Self-reported org |
| `notes` | PII (optional) | Free-text curator notes |

**Who can read:** Library owner (token-authenticated).  
**Who can write:** Library owner only (not a public form).  
**Retention assumption:** Kept while library is active; delete when contributor relationship ends.  
**Processor contact:** API Server on Replit.

---

## 5. Library Share Links (`share_links`)

Tokenized links sent to contributors for submitting library entries.

| Field | Type | Notes |
|-------|------|-------|
| `contributor_id` | PII (FK) | References `contributors.id` |
| `token` | Operational | Unguessable token; controls access |
| `label` | Operational | Curator-assigned label |
| `expires_at` | Operational | Optional expiry |
| `revoked_at` | Operational | Set when revoked |

**Who can read:** Library owner.  
**Who can write:** Library owner (create), system (resolve/revoke).  
**Retention assumption:** Kept until revoked or contributor row deleted (cascade).

---

## 6. Library Producers (`producers`)

Research entities tracked in the Northern Food Systems Library.

| Field | Type | Notes |
|-------|------|-------|
| `name` | PII (org) | Organization or individual producer name |
| `contact_email` | PII | Optional contact address |
| `contact_phone` | PII | Optional contact phone |
| `location` | PII (low) | Geographic region |
| `website_url` | Operational | Public URL |

**Who can read:** Library owner (authenticated).  
**Who can write:** Library owner.  
**Retention assumption:** Kept while library entry exists.

---

## 7. Bookkeeper Users (`bk_app_users`)

Clerk-authenticated users of the Headwaters Books application.

| Field | Type | Notes |
|-------|------|-------|
| `clerk_user_id` | PII | Clerk's stable user identifier |
| `email` | PII | User's email address |
| `first_name` | PII | Optional |
| `last_name` | PII | Optional |
| `role` | Operational | `owner` / `ops_manager` / `bookkeeper` / `food_handler` |
| `last_seen_at` | Operational | Session tracking |
| `last_nudged_at` | Operational | Notification tracking |

**Who can read:** Owner role only.  
**Who can write:** System (on Clerk sign-in); Owner (role assignment).  
**Processor contact:** Clerk (identity/auth), API Server on Replit.  
**Retention assumption:** Kept while user has an active account; remove when role revoked.

---

## 8. Bookkeeper Transactions (`bk_transactions`)

Double-entry ledger transactions.

| Field | Type | Notes |
|-------|------|-------|
| `created_by_email` | PII / Financial | Email of bookkeeper who posted |
| `description` | Financial | Transaction description; may name vendors |
| `reference` | Financial | Invoice/cheque number |
| `voided_reason` | Financial | Correction rationale |

**Who can read:** Owner, Ops Manager, Bookkeeper.  
**Who can write:** Bookkeeper, Owner, Ops Manager.  
**Retention assumption:** Immutable once posted (void creates reversal); keep for 7 years per CRA guidelines.

---

## 9. Bookkeeper Submissions (`bk_submissions`)

Food-handler expense/inventory receipt queue.

| Field | Type | Notes |
|-------|------|-------|
| `submitted_by_email` | PII / Financial | Submitter's email |
| `submitted_by_name` | PII | Submitter's display name |
| `submitted_by_id` | PII (FK) | Links to `bk_app_users` |
| `decided_by_email` | PII | Email of approver/rejecter |
| `decided_by_id` | PII (FK) | Links to `bk_app_users` |
| `vendor` | Financial | Vendor name |
| `amount` | Financial | Dollar amount |
| `description` | Financial | What was purchased |
| `rejected_reason` | Financial | Rejection note |

**Who can read:** Submitter reads own; Owner, Ops Manager, Bookkeeper read all.  
**Who can write:** Food Handler (create); Bookkeeper/Ops/Owner (approve/reject).  
**Retention assumption:** Keep until linked transaction is 7 years old.

---

## 10. Bookkeeper Receipt Attachments (`bk_receipt_attachments`)

File uploads attached to submissions; stored in Google Cloud Storage.

| Field | Type | Notes |
|-------|------|-------|
| `original_filename` | PII (low) | May contain submitter's name |
| `storage_ref` | Operational | GCS object path |
| `content_type` | Operational | MIME type |
| `file_size` | Operational | Bytes |

**Who can read:** Same as parent submission.  
**Who can write:** Food Handler (upload); system (GCS reference).  
**Processor contact:** Google Cloud Storage (file hosting).  
**Retention assumption:** Same as submission.

---

## 11. Bookkeeper Audit Log (`bk_audit_log`)

Immutable record of every state-changing action.

| Field | Type | Notes |
|-------|------|-------|
| `actor_email` | PII | Who performed the action |
| `actor_id` | PII (FK) | Links to `bk_app_users` |
| `actor_role` | Operational | Role at time of action |
| `details` | Financial / PII | JSONB blob; may include names, amounts |

**Who can read:** Owner role only.  
**Who can write:** System only (automatic on every mutation).  
**Retention assumption:** Keep for 7 years.

---

## 12. Wordpile Piles & Words (`wordpile_piles`, `wordpile_words`)

Practitioner word-vocabulary tool; Clerk-authenticated.

| Field | Type | Notes |
|-------|------|-------|
| `clerk_user_id` | PII | Owner identifier (no separate user table) |
| `name` (pile) | PII (low) | Pile name; practitioner-chosen |
| `word` | PII (low) | Community vocabulary words |
| `note` | PII (low) | Practitioner annotation |
| `safer_alternative` | PII (low) | Suggested safer word |

**Who can read:** Authenticated owner of the pile only.  
**Who can write:** Owner only.  
**Processor contact:** Clerk (auth).  
**Retention assumption:** Kept until user deletes or account is removed.

---

## 13. Wordpile Short Links (`wordpile_short_links`)

Server-side share URLs for Wordpile piles.

| Field | Type | Notes |
|-------|------|-------|
| `clerk_user_id` | PII | Owner who can revoke |
| `pile_name` | PII (low) | Captured at create time |
| `payload` | PII (low) | Encoded pile contents (words, notes) |

**Who can read:** Anyone with the slug (anonymous resolve); Owner (manage/revoke).  
**Who can write:** Authenticated owner.  
**Retention assumption:** Kept until revoked or owner deletes; pile payload is readable by recipient.

---

## 14. Financial Snapshots (`financial_snapshots`)

Internal operator check-in tool (`check-in` artifact). Stores periodic financial health snapshots entered by the operator.

| Field | Type | Notes |
|-------|------|-------|
| `watershed_arr` | Financial | Annual recurring revenue in dollars |
| `owner_take_home` | Financial | Owner compensation in dollars |
| `portfolio_value` | Financial | Total portfolio valuation in dollars |
| `xrp_balance` | Financial | XRP token balance (integer units) |
| `xrp_price_usd` | Financial | XRP price in USD at snapshot time |
| `annual_living_expenses` | Financial | Operator's personal living expenses in dollars |
| `notes` | PII (low) | Free-text operator notes; may name individuals or situations |
| `year` | Operational | Year of snapshot |
| `taken_at` | Operational | Timestamp |

**Who can read:** Operator only (no public access; API key or equivalent required).  
**Who can write:** Operator only.  
**Retention assumption:** Kept indefinitely as a personal financial record.  
**Processor contact:** API Server on Replit.

---

## 15. AI Conversations & Messages (`conversations`, `messages`)

Sarge AI assistant conversation store. Conversations are initiated by the operator via the Sarge HQ interface.

| Table | Field | Type | Notes |
|-------|-------|------|-------|
| `conversations` | `title` | PII (low) | Operator-chosen or auto-generated title; may contain names or topics |
| `messages` | `content` | PII (low) | Full conversation text; operator prompts and Anthropic responses. May contain names, financial figures, or personal detail if included in prompts |
| `messages` | `role` | Operational | `user` or `assistant` |

**Who can read:** Operator only (no public access).  
**Who can write:** Operator (user turns); system (assistant turns via Anthropic API).  
**Third-party note:** Message content is sent to Anthropic for completions. See Third-Party Processors summary.  
**Retention assumption:** Kept while the operator uses Sarge; no automatic expiry.  
**Processor contact:** Anthropic (LLM completions), API Server on Replit.

---

## 16. Project Tasks & Deadhead (`project_tasks`, `deadhead_items`, `deadhead_flush_log`)

Internal task-management tables used by the congestion monitor. No user-facing forms; records are created programmatically by the operator tooling.

| Field | Type | Notes |
|-------|------|-------|
| `title` (project_tasks / deadhead_items) | Operational | Task description; may mention people or projects |
| All other fields | Operational | Status, timestamps, batch IDs |

**Who can read:** Operator only (API key required).  
**Who can write:** System (automated congestion flush) and operator tooling.  
**Retention assumption:** Kept while task management is active; `smashed`/`done` rows have no scheduled purge.  
**Processor contact:** API Server on Replit.

---

## 17. Sarge Planning (`sarge_weeks`, `sarge_cards`)

Internal weekly planning tool for the operator.

| Field | Type | Notes |
|-------|------|-------|
| `priorities` | Operational | Operator's focus list; may name people |
| `barrier_note` (card) | Operational | May name people or situations |

**Who can read:** Operator (authenticated via Clerk in the bookkeeper app, or API key).  
**Who can write:** Operator only.  
**Retention assumption:** Kept indefinitely; low PII risk.

---

## Third-Party Processors Summary

| Processor | What they receive | Purpose |
|-----------|-------------------|---------|
| **Clerk** | Email, name, Clerk user ID | Authentication for Bookkeeper, Wordpile accounts |
| **Resend** | Name, email of signer/intake submitter | Sending confirmation and notification emails |
| **Google Cloud Storage** | Receipt image files, library file uploads | File hosting; files identified by an opaque storage ref |
| **Anthropic** | Conversation text submitted to AI features | AI-assisted features (e.g., Sarge assistant); no PII is required but may be present if included in prompts |
| **Replit** | All data in-transit and at-rest | Application hosting platform (Canada/US data centres) |

---

## Deletion Requests

To request deletion of personal data, email: **bobbie@ourheadwaters.ca**

Manual deletion is performed by the operator within 30 days of request. No automated deletion portal exists at this time.

---

## Retention Summary

| Category | Default retention |
|----------|-----------------|
| Sign-on / intake submissions | Until manually deleted |
| Subcontract submissions | Until manually deleted |
| Library contributor records | Until manually deleted |
| Bookkeeper financial records | 7 years (CRA minimum) |
| Audit log | 7 years |
| Wordpile words and piles | Until user deletes or account removed |
| Wordpile short links | Until revoked |
| Sarge planning cards | Indefinite |
