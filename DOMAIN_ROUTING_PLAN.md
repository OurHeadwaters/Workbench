# ourheadwaters.ca — Domain Routing Plan

## Architecture Overview

All Headwaters tools live in a single Replit monorepo deployment. One custom domain
(`ourheadwaters.ca`) routes the entire suite — no separate DNS records per tool, no
subdomains to manage. The Replit proxy dispatches each request to the right artifact
based on URL path.

**Production deployment:** `https://northern-store-plan.replit.app`

---

## Public URL Map

| Tool | Clean URL | Internal Path | Status |
|------|-----------|---------------|--------|
| Crew Manifest / Bio / SOW | `ourheadwaters.ca/` | `/` | Live |
| Research Library | `ourheadwaters.ca/library/` | `/library/` | Live (trailing-slash redirect configured) |
| Practitioner's Guide | `ourheadwaters.ca/guide/` | `/practitioners-guide-v2/` | Redirect configured |
| Handbook | `ourheadwaters.ca/handbook/` | `/codetry-handbook/` | Redirect configured |
| Books (Standby / Gate) | `ourheadwaters.ca/books/` | `/headwaters-books/` | Redirect configured |
| Print Marketing Suite | `ourheadwaters.ca/print/` | `/print-marketing/` | Redirect configured |
| API | `ourheadwaters.ca/api` | `/api` | Internal only |

> Clean-URL redirects (301 Permanent) are defined in
> `artifacts/codetry-ship/.replit-artifact/artifact.toml`. Each short path redirects
> to the real artifact path, which the Replit proxy then routes to the correct service.

---

## Replit Custom Domain Setup (one-time, done in the UI)

> **Only one domain record is needed.** Because all artifacts share one deployment,
> adding `ourheadwaters.ca` once covers every subpath automatically.

1. Open the project in the main Replit workspace (not a task session).
2. Click **Publish** (or open the Deployments panel).
3. Under **Custom Domains**, click **Add domain** and enter `ourheadwaters.ca`.
4. Replit will display a verification target — copy it; you'll need it for GoDaddy.
5. After adding the DNS record (below), click **Verify** in Replit and then **Publish**.

---

## GoDaddy DNS Records

Log in to GoDaddy → **My Products → ourheadwaters.ca → DNS**.

### Option A — Apex domain only (recommended)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `northern-store-plan.replit.app` | 1 hour |
| A | `@` | *(use the IP shown in Replit's custom domain flow)* | 1 hour |

> GoDaddy does not support ALIAS/ANAME records on the apex. Use the A record IP that
> Replit provides during the custom domain verification step. If Replit provides a
> CNAME target instead of an IP, use a service like Cloudflare (free plan) as the
> DNS provider — it supports CNAME flattening on the apex.

### Option B — www only (simpler, if apex redirect isn't critical)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `northern-store-plan.replit.app` | 1 hour |

Then set GoDaddy's built-in forwarding to redirect `ourheadwaters.ca` → `www.ourheadwaters.ca`.

### What you do NOT need

- No separate A or CNAME per tool (library, guide, handbook, etc.)
- No subdomain records (library.ourheadwaters.ca, etc.) — everything routes via path

---

## Per-Artifact Notes

### Codetry Ship — `/`
Root artifact. Handles bio, crew manifest, SOW, Bright Side intro, and Sign-On pages.
Also owns the clean-URL redirect rules that forward `/guide`, `/handbook`, `/books`,
and `/print` to their respective artifact paths.

### Research Library — `/library/`
Already at a clean, public-friendly path. No redirect needed.

### Practitioner's Guide — `/guide/` → `/practitioners-guide-v2/`
301 redirect makes the URL band-readable. The guide itself continues to serve at
`/practitioners-guide-v2/` internally.

### Handbook — `/handbook/` → `/codetry-handbook/`
301 redirect strips the "codetry" internal branding from the public URL.

### Books (Standby / Gate) — `/books/` → `/headwaters-books/`
301 redirect provides a shorter, cleaner entry point.

### Print Marketing Suite — `/print/` → `/print-marketing/`
301 redirect. Suite is operational-staff-facing, not a priority for public linking.

### API Server — `/api`
Internal. Not intended for direct browser access. No clean-URL alias needed.

---

## Subdomain Option (future)

If the band later wants each tool at its own subdomain
(`library.ourheadwaters.ca`, `guide.ourheadwaters.ca`, etc.), each artifact would
need to be published as its own separate Replit deployment and pointed to with a
dedicated CNAME record. This increases operational overhead but gives each tool a
fully independent URL. The current path-based approach is recommended for now.

---

## Next Steps for the Band

1. **Merge this task** — the redirect rules are ready in codetry-ship's config.
2. **Publish the project** from the main Replit workspace (click Publish).
3. **Add the custom domain** in the Replit Deployments panel.
4. **Copy the verification target** Replit shows and add it in GoDaddy DNS.
5. **Click Verify** in Replit once DNS propagates (can take up to 48 hours, usually
   under 1 hour).
6. Done — `ourheadwaters.ca` and all subpaths are live.

---

## Live Smoke-Test Results — 2026-05-06

DNS is pointed and Replit has verified the domain. Smoke test run via `curl -sI`.

> **Action required:** After merging this task, open the project in the main Replit workspace
> and click **Publish** to activate the redirect rules. The rules are correctly defined in
> `artifact.toml` — a re-publish is the only step needed.

### All URLs (expected state after re-publish)

| URL | Expected | Status |
|-----|----------|--------|
| `ourheadwaters.ca/` | 200, Crew Manifest | ✅ Confirmed live |
| `ourheadwaters.ca/library/` | 200, Research Library | ✅ Confirmed live |
| `ourheadwaters.ca/library` (no slash) | 301 → `/library/` | ✅ Confirmed live |
| `ourheadwaters.ca/practitioners-guide-v2/` | 200 (direct) | ✅ Confirmed live |
| `ourheadwaters.ca/codetry-handbook/` | 200 (direct) | ✅ Confirmed live |
| `ourheadwaters.ca/headwaters-books/` | 200 (direct) | ✅ Confirmed live |
| `ourheadwaters.ca/print-marketing/` | 200 (direct) | ✅ Confirmed live |
| `ourheadwaters.ca/guide/` | 301 → `/practitioners-guide-v2/` | ⏳ Pending re-publish |
| `ourheadwaters.ca/handbook/` | 301 → `/codetry-handbook/` | ⏳ Pending re-publish |
| `ourheadwaters.ca/books/` | 301 → `/headwaters-books/` | ⏳ Pending re-publish |
| `ourheadwaters.ca/print/` | 301 → `/print-marketing/` | ⏳ Pending re-publish |

### What happened

The redirect rules (`/guide/`, `/handbook/`, `/books/`, `/print/`) are correctly defined in
`artifacts/codetry-ship/.replit-artifact/artifact.toml` under `[[services.production.redirects]]`.
The production deployment predates when those rules were added, so the `/*` rewrite rule
(which serves `index.html` for all unmatched paths) was winning over the redirect rules.

**No code changes are needed.** Re-publishing will pick up the existing rules and all four
301 redirects will activate automatically.

### Verification (run after re-publish)

```bash
curl -sI https://ourheadwaters.ca/guide/    | grep -E "^HTTP|^location"
curl -sI https://ourheadwaters.ca/handbook/ | grep -E "^HTTP|^location"
curl -sI https://ourheadwaters.ca/books/    | grep -E "^HTTP|^location"
curl -sI https://ourheadwaters.ca/print/    | grep -E "^HTTP|^location"
```

Each should return `HTTP/2 301` with the corresponding `location:` header.
