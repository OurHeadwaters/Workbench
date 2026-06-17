# API Server — Secrets & Deployment Checklist

## ⚠️ Current status (audited 2026-06-17)

| Item | Status |
|------|--------|
| Webhook handler code (`stripeWebhook.ts`) | ✅ Complete |
| Goodbye Kit in kit registry | ✅ Complete |
| `STRIPE_SECRET_KEY` in Replit Secrets | ✅ Set 2026-06-17 |
| `STRIPE_WEBHOOK_SECRET` in Replit Secrets | ✅ Set 2026-06-17 |
| Payment Link `kit_id = goodbye-kit` metadata | ✅ Confirmed — `kit_id = goodbye-kit` set in Stripe Dashboard (2026-06-17) |
| Webhook endpoint registered in Stripe Dashboard | ⚠️ Unconfirmed — requires manual step in Stripe Dashboard (see below) |

---

## Required environment secrets

Set these via the Replit Secrets panel (or your deployment environment).

| Secret | Where to find it | Required for |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys → Secret key | All Stripe operations (kit publish, Connect onboarding, webhook verification) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks → [endpoint] → Signing secret (whsec_…) | `POST /api/stripe/webhook` — live kit purchase delivery |
| `KIT_WEBHOOK_SECRET` | Set to any strong random string | `POST /api/kits/purchase-webhook` — legacy manual webhook |
| `LIBRARY_OWNER_TOKEN` | Set to any strong random string | North Star / GORD kit-owner routes |

## Stripe webhook setup

### Step A — Set Payment Link metadata (Goodbye Kit)

The Goodbye Kit Payment Link must have `kit_id` in its metadata so the webhook
handler knows which kit to deliver.

1. Go to **Stripe Dashboard → Payment Links**.
2. Open: `https://buy.stripe.com/28E7sNd4N399egs6fNbwk08`
3. Click **Edit**.
4. Under **Metadata**, add:
   - Key: `kit_id`  Value: `goodbye-kit`
5. Save.

> Without this, the webhook handler will log `missing kit_id in metadata` and
> skip every delivery silently.

### Step B — Register the webhook endpoint

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. Set the endpoint URL:
   ```
   https://ourheadwaters.ca/api/stripe/webhook
   ```
3. Select events to listen for:
   - `checkout.session.completed`
4. Save. Copy the **Signing secret** (`whsec_…`) and set it as `STRIPE_WEBHOOK_SECRET`.

### Testing locally with Stripe CLI

```bash
stripe listen --forward-to https://<your-replit-dev-domain>/api/stripe/webhook
```

The CLI prints a webhook signing secret to use while testing — set it as `STRIPE_WEBHOOK_SECRET` for local runs.

## Kit delivery flow (end to end)

1. Buyer completes purchase via Stripe Payment Link or Checkout session.
2. Stripe fires `checkout.session.completed` to `/api/stripe/webhook`.
3. Server verifies signature, extracts `kit_id` from session metadata and buyer email from `customer_details.email`.
4. A 30-day access token is generated and written to `data/kit-tokens.json`.
5. Processed event IDs are written to `data/stripe-processed-events.json` (idempotency guard — prevents duplicate emails on Stripe retries).
6. Magic-link delivery email is sent via the Google Mail connector.
7. Buyer clicks the link → `GET /api/kits/access/:token` → kit content.

## Notes

- `STRIPE_WEBHOOK_SECRET` must match the signing secret for the specific endpoint registered in the Stripe dashboard. Live and test mode have different secrets.
- The `data/` directory is written at runtime. Ensure the server process has write access to it.
