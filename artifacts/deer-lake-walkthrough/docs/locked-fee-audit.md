# Locked $90k/mo Deer Lake fee — drift audit

One-time audit run alongside the walkthrough's new `lockedNumbers.test.tsx`
guard (task #462). The walkthrough's first-year fee copy is now pinned
to the canonical `$90,000/mo` recommended ask from the practitioners
guide V3 (`$1,080,000` over twelve months in the Ask reveal,
`$1.08M` / `$90k/mo` in the Recap row).

This file documents the cross-artifact grep audit that ran at the
same time, so the next reviewer can see what was checked, the counts,
and which surfaces (if any) needed a Layer-1 framing label fix.

## Scope

Searched `*.ts`, `*.tsx`, `*.md` in:

- `artifacts/practitioners-guide-v2`
- `artifacts/practitioner-operating-plan`
- `artifacts/deer-lake-store-plan`
- `artifacts/deer-lake-walkthrough`

Literals: `$35,000`, `$35k`, `$420,000`, `$420k`.

Excluded by intent: `node_modules`, `dist`, `static-build`, `_expo`,
build artifacts.

## Results

| Artifact | $35k hits | $420k hits | Surface kind | Needed label fix? |
| --- | --- | --- | --- | --- |
| `practitioners-guide-v2` | 0 | 0 | — | no |
| `practitioner-operating-plan` | 8 | 4 | code comments + cost-registry `context` strings + `__tests__` (not user-visible prose); each one already names "Layer 1 software-only" + "absorbs / replaces" | no |
| `deer-lake-store-plan` | 6 | 0 | user-visible prose in `ServicePartner.tsx`, `BandCouncilSummary.tsx`, `RisksAsk.tsx`, `FinancialsRole.tsx`, plus `docs/read-aloud-audit.md`; every hit already says "Replaces today's $35k/mo software-only contract" | no |
| `deer-lake-walkthrough` | 0 | 0 | — | no |

## Notes

- One incidental `$35k` match in
  `artifacts/practitioner-operating-plan/src/lib/__tests__/crossReserve.test.ts:521`
  is the cross-reserve discipline-keeper retainer, not the Layer-1
  software-only contract — different number, different deliverable.
- The `$35k/mo` Layer-1 software-only contract and the `$90k/mo`
  recommended ask are the same client on an upgrade path; the ask
  *replaces* the Layer-1 line, it is never billed in addition to it.
  That framing must remain present on every prose surface that
  mentions the Layer-1 number — the audit confirms it does today.
- The audit is a snapshot, not a guard. Follow-up #463 proposes a
  workspace-level test that scans all four artifacts on every CI run
  for unlabeled `$35k`/`$420k` mentions so this check becomes
  permanent.
