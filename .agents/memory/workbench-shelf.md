---
name: Workbench shelf architecture
description: k-pizza and hinterland are the shelf reference builds; WORKBENCH_BRIEF.md is the canonical vision doc
---

The Workbench (Zone 2) has a "shelf" concept — composable modules a practitioner assembles into client builds and hands off. Two reference builds now live in this repo:

- `artifacts/k-pizza` — full operational window (admin + public site). Template for food/restaurant builds.
- `artifacts/hinterland` — simple design template for handmade/artisan Square-based businesses.

**Why:** These came from OurHeadwaters/Workbench-Tools. They prove the one-action → stacked-results pattern.

**How to apply:** See `WORKBENCH_BRIEF.md` for the full architecture. Next steps are: (1) decouple k-pizza admin from its API client, (2) build Square adapter, (3) build Proof Layer MVP.

**807-shop** belongs in Zone 3 (not this repo).
