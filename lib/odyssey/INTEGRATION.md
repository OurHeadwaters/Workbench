# Headwaters Odyssey — Integration Guide

Adding a new host app takes about an hour. Here's the pattern.

---

## What the Odyssey layer does

When a user is in a zone or working on a topic that maps to a known problem,
they see a **trail sign** — a soft, dismissible card that surfaces a practical,
community-vetted tool recommendation. No hard sell. Value-exchange framing.

Trail signs are managed in the `odyssey_trail_signs` database table, approved
by an admin before appearing on any trail, and served via the API at
`GET /api/odyssey/trail-signs`.

---

## 1. Install the shared package

```jsonc
// your-artifact/package.json
{
  "dependencies": {
    "@workspace/odyssey": "workspace:*"
  }
}
```

---

## 2. Call `getTrailSigns(zone, tags?)` for in-memory seeds

The `@workspace/odyssey` package ships 5 seed trail signs. Use these for
development or as a fallback when the API is unavailable.

```ts
import { getTrailSigns } from "@workspace/odyssey";

// Get signs relevant to Z2 work on client contracts
const signs = getTrailSigns("Z2", ["client-work", "contracts"]);
```

---

## 3. Fetch from the API for live, curated signs

```ts
const res = await fetch("/api/odyssey/trail-signs?zone=Z2&tags=client-work,contracts");
const { signs } = await res.json();
```

---

## 4. Render with `TrailSignCard` or `OdysseyTrail`

Copy `artifacts/north-star/src/components/TrailSign.tsx` into your host app or
adapt the pattern to your design system.

```tsx
import { OdysseyTrail } from "@/components/TrailSign";
import { getTrailSigns } from "@workspace/odyssey";

function MyPage() {
  const signs = getTrailSigns("Z3");
  return (
    <div>
      {/* your page content */}
      <OdysseyTrail signs={signs} />
    </div>
  );
}
```

The `OdysseyTrail` component shows one sign at a time. Dismissed signs rotate
to the next; once all are dismissed the component unmounts.

---

## 5. Submit new sponsors via the intake form

Anyone can submit a tool at `/north-star/sponsor-intake`. Submissions land as
`status: "pending"` in the database.

**To approve a submission:**

```http
PATCH /api/odyssey/trail-signs/:id/approve
Authorization: (Clerk session cookie)
```

**To view the review queue:**

```http
GET /api/odyssey/admin/queue
Authorization: (Clerk session cookie)
```

---

## Data model

| Field | Description |
|---|---|
| `toolName` | Display name of the tool |
| `problemStatement` | The practitioner problem this solves (their words, not marketing) |
| `costTier` | `free` / `$` / `$$` / `$$$` |
| `actionUrl` | Where the practitioner goes to take the first step |
| `actionLabel` | CTA text (default: "Take a look") |
| `communityProof` | One sentence of social proof |
| `zoneTags` | Comma-separated: `any`, `Z1`, `Z2`, `Z3`, `Z4` |
| `topicTags` | Comma-separated topic keywords |
| `status` | `pending` → `approved` or `rejected` |

---

## Seed signs (self-sponsorships)

The registry ships with 5 approved self-sponsorships that prove the format:

| Tool | Zones | Topics |
|---|---|---|
| North Star | any | planning, triage, daily |
| Morning Triage | Z1, Z2 | triage, prioritization |
| Practitioner's Guide | Z2 | client-work, workflow |
| Field Guide Finance | Z1 | finance, tracking |
| Headwaters Books | Z3, Z4 | publishing, community |
