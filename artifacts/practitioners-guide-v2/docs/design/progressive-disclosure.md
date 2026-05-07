# Progressive Disclosure Design Rule

**Canonical rule for all internal tools in this project.**
Established: 2026-05-02 (Task #632)

---

## The Rule

Every internal-tool page must be structured as follows:

1. **Big, clear bucket headings — always visible (never collapsed).**
   The heading names the bucket and its single most important decision signal (a status badge, a key number, or a next action).

2. **All operational detail lives inside accordions/dropdowns — collapsed by default.**
   Tables, rosters, overheads, P&L breakdowns, narrative paragraphs: all collapse.

3. **Each bucket shows only 1–3 "decision signals" at the top level:**
   - A status badge (confirmed / active / open-action / plan-b)
   - A key number (KPI)
   - A next action string

4. **Never show walls of text or tables at the top level.**

---

## Named Exceptions

Two pages have components that must remain visible by their nature as interactive tools.
These exceptions are explicit — they do not generalize to other pages.

### ComparePage — workspace table

The V3-vs-alternative-reality comparison table is the operating-framework workspace tool.
Collapsing it would make the tool non-functional (users can't compare scenarios without seeing both columns). The table is always visible. The explanatory sections ("What this workspace is for", "How we got here") are collapsed.

### ReplicationPage — Travels / Swaps two-column grid

The Travels / Swaps grid is the primary decision signal for a Pilot #2 conversation — it IS the one-page summary a practitioner opens in front of a buyer. Collapsing it defeats the purpose of the page. The grid is always visible. The positioning narrative, literate-programming framing, operating rhythm, and how-to-use guide are collapsed.

---

## Where This Applies

Internal tools only:
- Practitioner's Guide V2 (all pages) ✓
- Codetry Ship — Crew Manifest
- Northern Food Systems Research Library (internal views)
- Codetry Handbook (internal views)

## Where This Does NOT Apply

Public-facing or client-facing content:
- Northern Band Walkthrough
- Handbook public pages
- Any client deck or one-pager

---

## Implementation Pattern

```tsx
// Accordion wrapper (shadcn/ui)
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Always-visible signal
<div className="rounded-xl border ...">
  <div className="p-4">
    <p className="text-xl font-semibold">{keyNumber}</p>
    <StatusBadge status="confirmed" label="Confirmed" />
    <p className="text-xs text-muted-foreground">{oneLineSummary}</p>
  </div>
  <Accordion type="single" collapsible>
    <AccordionItem value="detail" className="border-t ...">
      <AccordionTrigger>Show detail</AccordionTrigger>
      <AccordionContent>
        {/* full table, narrative, etc. */}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>
```

## Rationale

Reduces decision-making overwhelm. The founder sees only what they need, when they need it.
The bucket heading is the answer; the accordion is the evidence.

This rule — including the named exceptions — applies to all future task agents working on
internal tools in this project. When in doubt, default to: heading + signal + accordion.
If you believe an exception is needed, add it to the named exceptions section above.
