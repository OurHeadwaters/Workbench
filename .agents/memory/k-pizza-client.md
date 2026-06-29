---
name: k-pizza import quirks
description: k-pizza uses its own API client package and gord-widget needs named import
---

**k-pizza API client:** k-pizza uses `@workspace/k-pizza-client-react` (in `lib/k-pizza-client-react/`), NOT `@workspace/api-client-react`. The two are completely different generated clients — k-pizza's is the "Konstantino Pizza Operating System API", this repo's is the Headwaters API.

**Why:** Brought in from OurHeadwaters/Workbench-Tools which had its own api-server and generated client. Decoupling the admin from this client is a planned future step.

**gord-widget default import:** This repo's gord-widget exports `{ GordWidget }` as a named export only. k-pizza and hinterland originally used `import GordWidget from "@workspace/gord-widget"` (default). Fixed to `import { GordWidget } from "@workspace/gord-widget"`. Any future artifact brought in from Workbench-Tools will need the same fix.
