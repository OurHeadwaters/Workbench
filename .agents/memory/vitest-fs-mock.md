---
name: Vitest fs mock limitation
description: vi.mock("fs") does not intercept import fs from "fs" in this project's Node/vitest setup — avoid mocking fs; use DB-backed state or real file management instead.
---

## Rule
Do NOT use `vi.mock("fs", ...)` to intercept route code that does `import fs from "fs"` in this project's vitest environment. The mock is not applied to the route's module, so the real `fs` is called.

**Why:** In this project's vitest v4.1.5 + Node.js environment, `vi.mock("fs", ...)` does not intercept built-in module imports in modules-under-test. This was proven empirically while testing the Stripe webhook route: the real `stripe-processed-events.json` was read/written even with an fs mock registered.

**How to apply:**
- Prefer routing persistent state through the DB (via the fakeDb mock) instead of the filesystem — this is testable and more correct.
- If a route genuinely uses the filesystem for state, manage the real file directly in tests using `beforeAll`/`beforeEach`/`afterAll`, rather than trying to mock `fs`.

**Note:** The Stripe webhook route was migrated from file-based idempotency (`data/stripe-processed-events.json`) to DB-backed idempotency (`stripeProcessedEventsTable`), which removed the fs dependency from the route entirely and made tests straightforward.
