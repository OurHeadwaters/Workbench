# Agents working in `artifacts/codetry-handbook`

## "Put it on the kitchen table" — local source tag

When the user, working inside this artifact, says **"put it on the kitchen
table"** (or close variants), the `source` for the drop is:

    artifacts/codetry-handbook

**Mobile note:** this is an Expo / React Native artifact. Auto-derivation
from `import.meta.env.BASE_URL` does not work here, and the shipped
`KitchenTableButton` renders HTML elements. So in this artifact you must
pass `source` explicitly:

```ts
import { putOnKitchenTable } from "@workspace/kitchen-table-client";

await putOnKitchenTable({
  title: "<one-line statement of what to discuss>",
  source: "artifacts/codetry-handbook",
  sourceRef: "<chapter slug / screen route, optional>",
});
```

The function is just a `fetch` — it works fine in React Native. Drops land
in `project_tasks` with `source = 'artifacts/codetry-handbook'`, then flow
into `deadhead_items` when the backlog flushes, then surface in the
north-star KitchenTablePage grouped by source.

**Do not** hand-roll a POST to `/api/tasks` — always go through the helper
so `source` is preserved end-to-end. **Do not** attach
`x-library-owner-token` to drops — the drop endpoint is open by design;
that header is for decision-cap routes only.

See `replit.md` for the full repo-wide protocol.
