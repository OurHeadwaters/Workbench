---
name: Gatehouse revenue sprint
description: 90-day revenue sprint context and North Star Sprint tab built July 25 2026
---

## Sprint context (July 25 – October 23, 2026)

Three revenue tracks in priority order:
1. **Gatehouse Engine / GTA Landlord** — 2nd meeting / pitch phase. $28k one-time + $3k/mo recurring. 1,500 tenants. Template deal.
2. **Goodbye Kit** (individual) — Stripe live at codetry.ca/goodbye/. Target 5–10 sales while Gatehouse closes.
3. **Print Suite** (individual) — Stripe live at codetry.ca/suite/. Convert free users to paid docs.

## Gatehouse pricing (locked)
- Base: $1.25/member/mo — tracker + impact modules
- Steward: $2.00/member/mo — + matchmaker
- Full: $2.50/member/mo — + moments + beacon

## Modules naming rule
These are **Modules** not Kits. "Kit" is reserved for practitioner instruments (Goodbye Kit, Shattered Kit, etc.).

## North Star Sprint tab
- Route: `/sprint`  
- Page: `artifacts/north-star/src/pages/SprintPage.tsx`
- Nav: first tab in NavBar, amber-coloured Target icon, always visible
- State: all localStorage, no server dependency
- Content: 90-day countdown, deal stage ladder (9 stages), next action, Goodbye Kit counter, Print Suite counter, today's single focus

**Why:** Bobbie needed a daily revenue focus view separate from the doctrine/constellation work that dominates the rest of North Star.
