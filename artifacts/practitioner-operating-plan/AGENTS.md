# Agents working in `artifacts/practitioner-operating-plan`

## "Put it on the kitchen table" — local source tag

When the user, working inside this artifact, says **"put it on the kitchen
table"** (or close variants), the `source` for the drop is:

    artifacts/practitioner-operating-plan

You **don't have to pass it manually** — the shared helper auto-derives it
from `import.meta.env.BASE_URL` (Vite convention: `/<slug>/` →
`artifacts/<slug>`). Just call:

```ts
import { putOnKitchenTable } from "@workspace/kitchen-table-client";

await putOnKitchenTable({
  title: "<one-line statement of what to discuss>",
  sourceRef: "<page path / doc id, optional>",
});
```

Or in React UI code:

```tsx
import { KitchenTableButton, useKitchenTable } from "@workspace/kitchen-table-client/react";
// <KitchenTableButton />  ← source is auto-derived
```

This artifact already mounts a dev-only floating `<KitchenTableButton />`
in `src/App.tsx`. Drops land in `project_tasks` with
`source = 'artifacts/practitioner-operating-plan'`, then flow into `deadhead_items` when the
backlog flushes, then surface in the north-star KitchenTablePage grouped by
source.

**Override only when necessary** (e.g. cross-artifact tooling), via
`putOnKitchenTable({ title, source: "artifacts/practitioner-operating-plan" })`. **Do not**
hand-roll a POST to `/api/tasks` — always go through the helper so
`source` is preserved end-to-end. **Do not** attach
`x-library-owner-token` to drops — the drop endpoint is open by design;
that header is for decision-cap routes only.

See `replit.md` for the full repo-wide protocol.
