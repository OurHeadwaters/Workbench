---
name: Stripe webhook test strategy
description: How to test stripeWebhook.ts in api-server without mocking the Stripe SDK
---

## The rule

Do NOT mock `stripe.webhooks.constructEvent`. Instead generate real HMAC-SHA256 signatures in the test so the genuine SDK verification passes.

**Why:** `vi.mock("stripe", ...)` + `vi.hoisted(...)` patterns for controlling `constructEvent` mock return values failed: the mock factory closes over a different copy of the hoisted vi.fn() than the test body modifies. Adding any `vi.mock("stripe", ...)` anywhere in the file (e.g. for a second router under test) overrides the Stripe import for the ENTIRE file because vi.mock is hoisted.

**How to apply:** Use this signing helper (Stripe SDK v22 uses the FULL `whsec_...` string — not base64-decoded — as the HMAC key):

```ts
function makeStripeSignature(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const sig = crypto.createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`).digest("hex");
  return `t=${timestamp},v1=${sig}`;
}
```

## The `fs` mock must explicitly set `default`

stripeWebhook.ts uses `import fs from "fs"` (CJS default import). If the mock spreads `...vi.importActual("fs")`, the real `fs` object ends up under `default` and ALL fs calls in the handler bypass the mock entirely.

**Fix:** synchronous factory, explicit `default`:

```ts
vi.mock("fs", () => {
  const impl = {
    existsSync: (p: string) => p in mockFsStore,
    readFileSync: (p: string, _enc?: unknown) => mockFsStore[p] ?? "{}",
    writeFileSync: (p: string, data: string) => { mockFsStore[p] = data; },
    mkdirSync: () => {},
  };
  return { ...impl, default: impl };
});
```

## beforeEach pattern

Always call `.mockClear()` + `.mockReturnValue(...)` (not just `mockReturnValue`) on every mock that accumulates call counts across tests. Also clear the `__store` array with `.length = 0`.

## GET /kits/access/:token is already covered

kits.test.ts already has a full "token validation" describe (valid → 200, expired → 410, unknown → 404). Do not duplicate in stripeWebhook.test.ts — it would require importing kitsRouter which adds a conflicting `vi.mock("stripe", ...)` to the file.
