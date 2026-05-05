# ourheadwaters.ca — Domain Verification Log

## Verification run: 2026-05-05T23:15:43Z

### Replit deployment health check

Target: `https://northern-store-plan.replit.app`

| Path | Expected | Actual | Status |
|------|----------|--------|--------|
| `/` | HTTP 200 | HTTP 200 | PASS |
| `/library` | HTTP 301 → `/library/` | HTTP 301 → `/library/` | PASS |
| `/library/` | HTTP 200 | HTTP 200 | PASS |
| `/guide` | HTTP 301 → `/practitioners-guide-v2/` | HTTP 200 (no redirect) | NEEDS REPUBLISH |
| `/handbook` | HTTP 301 → `/codetry-handbook/` | HTTP 200 (no redirect) | NEEDS REPUBLISH |
| `/books` | HTTP 301 → `/headwaters-books/` | HTTP 200 (no redirect) | NEEDS REPUBLISH |
| `/print` | HTTP 301 → `/print-marketing/` | HTTP 200 (no redirect) | NEEDS REPUBLISH |

### Analysis

- The Replit deployment URL is **live and healthy** (HTTP 200 at root).
- The `/library → /library/` redirect is **confirmed working** (HTTP 301) — proves the redirect rule infrastructure is functional.
- The `/guide`, `/handbook`, `/books`, and `/print` redirect rules were added in a recent task but the project has **not been republished** since. Those redirects are correctly defined in `artifacts/codetry-ship/.replit-artifact/artifact.toml` but are not active in the current live deployment.

### What the band needs to do

**Step 1 — Republish the project** (resolves the 4 pending redirects):
1. Open the project in the main Replit workspace.
2. Click **Publish** → confirm the build. This activates all redirect rules from the current artifact.toml.
3. Re-run the smoke test below to confirm all redirects return 301.

**Step 2 — Add custom domain** (enables ourheadwaters.ca):
1. In the Deployments panel, click **Add domain** → enter `ourheadwaters.ca`.
2. Copy the verification target Replit shows.
3. In GoDaddy DNS (My Products → ourheadwaters.ca → DNS), add:
   - `CNAME` record: Name = `www`, Value = `northern-store-plan.replit.app`, TTL = 1 hour
   - `A` record: Name = `@`, Value = *(IP address shown in Replit's custom domain flow)*, TTL = 1 hour
4. Click **Verify** in Replit. DNS propagates in under 1 hour (up to 48 hours).

**Step 3 — Final smoke test** (run after DNS propagates):

```bash
# Run from any terminal after DNS is configured
for path in / /library /library/ /guide /handbook /books /print; do
  echo "Testing ourheadwaters.ca$path"
  curl -s -o /dev/null -w "  HTTP %{http_code} → %{redirect_url}\n" https://ourheadwaters.ca$path
done
```

Expected output:
```
Testing ourheadwaters.ca/
  HTTP 200 →
Testing ourheadwaters.ca/library
  HTTP 301 → https://ourheadwaters.ca/library/
Testing ourheadwaters.ca/library/
  HTTP 200 →
Testing ourheadwaters.ca/guide
  HTTP 301 → https://ourheadwaters.ca/practitioners-guide-v2/
Testing ourheadwaters.ca/handbook
  HTTP 301 → https://ourheadwaters.ca/codetry-handbook/
Testing ourheadwaters.ca/books
  HTTP 301 → https://ourheadwaters.ca/headwaters-books/
Testing ourheadwaters.ca/print
  HTTP 301 → https://ourheadwaters.ca/print-marketing/
```

### Current blockers (human action required)

| Blocker | Who | UI |
|---------|-----|----|
| Republish to activate new redirect rules | Band / Replit owner | Replit workspace → Publish button |
| Add `ourheadwaters.ca` as custom domain | Band / Replit owner | Replit Deployments panel → Custom Domains |
| Add DNS records | Band | GoDaddy → My Products → ourheadwaters.ca → DNS |
