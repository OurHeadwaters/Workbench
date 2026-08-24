---
name: Stripe connection readiness
description: Stripe integration configuration required before Headwaters can sell and deliver digital products.
---

Before enabling a Stripe checkout flow, verify that the Replit Stripe connection supplies both a Stripe secret key and a webhook signing secret to the API service.

**Why:** A connection can report as healthy while its server credential settings are empty. In that state, hosted checkout sessions cannot be created safely and checkout webhooks cannot be signature-verified, so taking payment would risk failing delivery.

**How to apply:** Configure or repair the existing Stripe connection in Replit's Integrations settings, then restart the API service and verify that a checkout session can be created and that the webhook endpoint accepts a signed checkout completion event. Do not ask for or paste payment credentials in chat.