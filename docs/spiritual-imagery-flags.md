# Spiritual / cultural imagery — flagged spots

A short list of every spot in the two decks where the spiritual-imagery rule (`docs/spiritual-imagery-rule.md`) flagged something the founder should bring to Elders / Knowledge Keepers / named community members **before the deck is shown to the band council**.

Update this file every time a spot is added, resolved, or removed. Keep it short.

## Audit pass — April 2026

Decks audited end-to-end:

- `artifacts/deer-lake-store-plan/` — Cover, ProblemOpportunity, SupplyChain, StaffingModel, PosOps, FinancialsRole, ServicePartner, RisksAsk, WhyStoresFail{Market,SupplyOps,Financing}.
- `artifacts/practitioner-operating-plan/` — Cover, SlabVsGrassland, TheSixPeople, ThreeRevenueLayers, YearOnePicture, Closing.

The audit looked for: anonymous quotes, "as the Elders say" framings, composite community voices, ceremonial language used as decoration, and any words placed in an Elder's, Knowledge Keeper's, or community member's mouth.

## Open flags — bring to Elders / wisdom keepers

### 1. Deer Lake deck · Problem & Opportunity slide · "Today" column

- **File:** `artifacts/deer-lake-store-plan/src/pages/slides/ProblemOpportunity.tsx`
- **What was there:** An anonymous italic quote — *"Less like a local store — different clientele — more like a Walmart."* — labelled "Heard in Deer Lake". No source, no attribution.
- **What it is now:** A visible dashed-border placeholder reading *"Needs guidance from elders / wisdom keepers — placeholder, not for delivery."*
- **What's needed:** Either (a) a sourced and named account from a Deer Lake community member, recorded with permission, that the deck can attribute by name (or with a clearly-described non-naming convention they choose); or (b) the placeholder is removed entirely and the slide stands on its statistics + imagery alone.
- **Why this matters:** This is the only spot in either deck that explicitly puts community voice in quotation marks. Until it's resolved, the placeholder must stay visible so it can't be silently re-filled by a later edit.

## Watch list — founder's voice, but worth a second read with the right people

These are not rule violations — they are the founder's own voice or factual context. Listed here so the founder reviews them before delivery and confirms they read the way she intends in front of the council, not just on the page.

### A. Practitioner Operating Plan · Cover and Closing slides · "We always knew how to fix it. Now we can."

- **Files:** `artifacts/practitioner-operating-plan/src/pages/slides/Cover.tsx`, `Closing.tsx`
- **Status:** Allowed. On the Closing slide it's attributed to "Founder · April 2026". On the Cover it's labelled "Closing line" — same line, same speaker, used as a tease.
- **Why on the watch list:** The "we" reads as collective. The founder should confirm before council that this is heard as her own voice and not as a statement she is making *on behalf of* the community. If there's any risk of it landing the second way, the cleanest fix is to drop "Closing line" off the Cover and let the founder say the line out loud at the close instead.

### B. Practitioner Operating Plan · Closing slide · footer copy

- **File:** `artifacts/practitioner-operating-plan/src/pages/slides/Closing.tsx`
- **Line:** *"Value is not in material goods. Value is in the resources the earth provides. The system has to honour that — not optimize around it."*
- **Status:** Allowed. The slide footer attributes the page to "Founder · April 2026."
- **Why on the watch list:** This reads as a teaching, and "the resources the earth provides" carries weight that overlaps with land-based teachings the founder is not the source of. Confirm before delivery that it's clearly heard as her own conviction; otherwise pull it back to a less teaching-shaped sentence.

### C. Practitioner Operating Plan · One Pager (founder-facing) · "stay sacred"

- **File:** `artifacts/practitioner-operating-plan/src/pages/OnePager.tsx`
- **Line:** *"…the practitioner's days with the kids stay sacred…"*
- **Status:** Allowed — the founder's metaphor about her own days, in her own founder-facing summary.
- **Why on the watch list:** "Sacred" is the only spiritual word in the founder-facing one-pager. It's plain English here, not ceremonial — but worth checking once that no future edit accidentally widens the metaphor.

### D. Deer Lake deck · Cover slide · "Deer Lake First Nation · Treaty 5 · Northwestern Ontario"

- **File:** `artifacts/deer-lake-store-plan/src/pages/slides/Cover.tsx`
- **Status:** Allowed — factual place + treaty context.
- **Why on the watch list:** Treaty references are factual when handled as identifying context (where this is, what jurisdiction). They become voiced sentiment if the deck ever paraphrases what Treaty 5 *means* on someone else's behalf. None of that is in the deck today; flagged so future edits don't drift across the line.

## How to use this list before the council meeting

1. Read the **Open flags** section. For each entry, decide: source the words (with a named Elder / Knowledge Keeper / community member who agrees to be quoted), or remove the placeholder.
2. Read the **Watch list**. For each entry, read the line aloud the way it'll be heard. If it lands wrong, flag it back to the deck — the rule says nothing was put in anyone's mouth, but the founder gets the last call on her own voice.
3. Update this file the same time the deck is updated. The list is the audit trail, not a one-time pass.
