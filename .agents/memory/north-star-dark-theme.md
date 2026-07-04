---
name: North Star dark theme migration
description: Canonical theme tokens and known light-theme leftovers for the North Star artifact after the Task #2462 UX overhaul.
---

North Star (artifacts/north-star) standardized on a single dark theme via
`src/lib/theme.ts`: BG #0B0905, SURFACE #141210/#1A1714, TEXT #EDE8D5, AMBER
accent #C8923A, muted text via `rgba(237,232,213,0.35–0.7)` opacity steps.

**Why:** the app previously mixed this dark palette with an older light
theme (#FAFAF9 bg, #D6D0C7 borders, #78716C/#A8A29E/#44403C/#1C1917 text),
which read as visually broken/inconsistent across pages.

**How to apply:** when touching any North Star page/component, grep for
`#FAFAF9|#D6D0C7|#78716C|#A8A29E|#44403C|#1C1917` first — any hit is old
light-theme debris that should be converted to theme.ts tokens or the
rgba(237,232,213,X) muted-text scale, not left as literal hex.

The following pages still have unconverted light-theme leftovers (last
checked): WeeklyPage, SeasonalPage, DebriefPage, LandPlanPage,
PractitionerApplicationPage, PractitionerReviewPage, TesterKitPage,
TriageLandingPage, SponsorIntakePage, InboxSetupPage. Update this list once
they're migrated.

Also note: `@workspace/kitchen-table-client`'s `<KitchenTableButton />` is a
shared dev-only floating widget (max z-index, bottom-right, hidden via
`isDev()` in production) rendered globally in App.tsx across artifacts. It
can intercept clicks on bottom-nav elements during local testing — this is
not a production bug, just a dev-tooling quirk to route around (click the
nav label precisely, or test past it) rather than something to "fix" in app
code.
