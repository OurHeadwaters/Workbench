# Open Questions

*First draft · assembled from editorial notes across Ch1–Ch5 and Appendix · 2026-05-06*
*Status: ACTIVE — this section is a living record. Questions move to the Resolved log at the bottom when a founder decision is applied and implemented. They are not removed until the decision is reflected in all affected files.*
*Position in book structure: after Part III (the practitioner in the field), before the Deep Dives appendix — as named in Ch5 §The structure of what follows.*

---

The purpose of this section is not resolution. It is memory.

The discipline keeps problems in writing so they cannot be quietly resolved by attrition — by forgetting, by defaulting, by letting the pressure of a deadline make the decision without a record. If a question disappears from this list without a named decision, it was not resolved. It drifted.

Each question below is genuinely open: no decision has been applied to the affected text, or the decision has been applied in one file but not propagated across all files that carry the problem.

---

## OQ-1 — Community consent to name the First Nation community

**Source:** Ch2 editorial notes, Q1
**Status:** Open — decision applied (keep unnamed), but consent itself has not been obtained.

Throughout Chapter 2, the community is referred to as "a northern community" — the community's name is withheld until the community has reviewed the chapter and confirmed they are comfortable being identified. This is the correct posture. It is not the resolved posture.

**What is open:** When and how will the consent conversation happen, with whom at the community, and who initiates it? Until that question has a name and a date attached to it, community consent is an intention, not a plan.

**What changes when it resolves:** A single find-and-replace pass in Ch2 and draft-v1.md replaces "a northern community" with the community's name. No prose rewrite required — the sentence structure was built to absorb the name cleanly.

---

## OQ-2 — draft-v1.md audit note still references original names

**Source:** Ch2 editorial notes, Q2 residual; draft-v1.md line 696
**Status:** Open — Ch2 chapter file has been updated (Sam → Chris/Morgan, Gilles → René), but draft-v1.md carries an audit line at line 696 that still reads: *"Real names Sam, Jess, and Gilles in Chapter 2 — pseudonymize or confirm consent?"*

The pseudonymization decision has been made and applied in the chapter file. The combined draft has not been reconciled. Until it is, anyone reading draft-v1.md encounters a live audit flag for a decision that is already settled — which is the definition of drift between the working files.

**What is open:** A reconciliation pass on draft-v1.md — remove the audit line at 696, verify the chapter 2 body text in the combined draft carries the pseudonyms (Chris, Morgan, René), not the original names.

**What changes when it resolves:** The audit flag is removed. The combined draft and the chapter file say the same thing.

---

## OQ-3 — Live links in Ch5 §The closing test — RESOLVED 2026-05-06

**Source:** Ch5 §The closing test
**Status:** Resolved. Three URLs identified from live artifacts and inserted into `codetry-book/drafts/05-sons-and-daughters-of-thunder.md`.

- **Claim 1** → https://ourheadwaters.ca/practitioners-guide-v2/ (the practitioner's guide — the operational plan, slide by slide)
- **Claim 2** → https://ourheadwaters.ca/community-store-walkthrough/ (the community store patterns, live)
- **Claim 3** → https://ourheadwaters.ca/codetry-handbook/ (the handbook, seven parts)

All three artifacts are live and public-facing. URLs appear in the Ch5 draft after each claim.

---

## OQ-4 — Scope document and rate sheet for the northern store methodology

**Source:** Appendix VI, final passage
**Status:** ~~Open~~ **Resolved 2026-05-07**

The scope document and rate sheet now exist as a print-ready artifact in the Headwaters Print Marketing Suite:

- **URL:** https://ourheadwaters.ca/print-marketing/scope-rate-sheet
- **PDF download:** available via the Download PDF button on that page
- **Content:** Six phases in order, $25,000 fixed / $175 hr rate, plain-language deliverables, what-is-included / what-this-is-not, dollar-honest note, contact block with QR code

The Appendix VI passage ("the only thing missing is a one-page scope document") is now satisfied by this artifact. If a book link is desired, the URL above can be inserted alongside the Appendix VI passage in the combined draft.

**Decision:** The scope document lives outside the book, in the print marketing suite. The book passage stands as-is — it names the gap at the time of writing, which was accurate. A footnote or inline URL may be added in a later editing pass.

---

## OQ-5 — Book structure sections not yet drafted

**Source:** Ch5 §The structure of what follows
**Status:** ~~Open~~ **Resolved 2026-05-07**

Chapter 5 §The structure of what follows describes the full book in this order:

1. **Grounding** — the teachers, Thunder, and the reading lineages
2. **Part I** — the discipline: what it is, where it lives, the three or four moves it makes
3. **Part II** — the discipline applied to a real community economy (seven zones, two primitives)
4. **Part III** — the practitioner in the field, including Zone 0 as first ground
5. **Open Questions** — this section
6. **Deep Dives** — optional; five chapters on how codetry differs from the disciplines it most closely resembles
7. **Field Ledger** — the practical entry point for practitioners ready to begin

The five completed chapters (Ch1–Ch5) map approximately to the Part I and Part II register. Grounding (the reading lineages and Thunder) now exists in the handbook as a built section (teachers, Thunder, pioneer path). The Field Ledger also now exists as a built section in the handbook (11 entries, §FL.1–§FL.11). Part III (the practitioner in the field, Zone 0 household as the first ground) still has no dedicated draft.

**Resolution:** All three sections now exist. Grounding and Field Ledger were built in a prior session. Part III (four chapters: 3.8–3.11) was drafted as `codetry-book/drafts/part-three-practitioner-in-the-field.md` and added to the handbook app as chapters pt3-1 through pt3-4 in the "The Practice" part. The full structural arc named in Ch5 §The structure of what follows is now complete.

---

## Resolved Questions — for the record

*Questions resolved in the current editing pass (2026-05-06). Kept here so the record of the decision survives even after the working editorial notes are eventually cleaned from the chapter files.*

**UG-B and UG-C (Ch4) — Whether the two held harvest passages belong in the Appendix.**
Decision: Both placed. UG-B (the structural comparison of both-states and both-sides) is Deep Dive III in appendix-deep-dives.md. UG-C (the Refused outcome at bar level, worked through the Parr's Jars example) is Deep Dive IV. The bridging prose was written as part of the appendix assembly. Both passages are now self-contained deep-dive entries consistent with the framing note at the top of the appendix file.

**Q3 (Ch5) — Whether the 5-H open-the-work passage stays in Chapter 5 or moves to an appendix.**
Decision: Keep it in Chapter 5. The invitation is the only outward-facing gesture in the closing sequence and is load-bearing. The band-council register can be paraphrased in a future revision if needed; the passage does not move.

**Q4 (Ch5) — Whether the ship-image callback at the end of Chapter 5 is a wanted echo or feels repetitive.**
Decision: Keep it. The callback is a wanted echo — Chapter 1 announces the vessel; Chapter 5 uses the same image in a valedictory register. The three closing lines are compressed enough that the echo reads as recapitulation, not redundancy. Trim point, if needed: drop only the final line ("The headwaters are behind us. The water moves.") and end on "A vessel. Seaworthy. Ready."

**Q5 (Ch4) — Whether to draft the Deep Dives appendix before the second pass of Ch2–Ch5 was complete.**
Decision: Hold the appendix until the second pass was done. The second pass is now complete (all chapters: second pass, founder-reviewed, decisions applied 2026-05-06). The appendix has been drafted as appendix-deep-dives.md. The hold condition is met; the appendix is the current state.

**Q1 partial (Ch2) — Pseudonymization of Sam, Jess, and Gilles.**
Decision: Pseudonymize. Names changed in the Ch2 chapter file: Gilles → René; Sam and Jess → Chris and Morgan. The decision is applied in the chapter file. The residual — propagating the change to draft-v1.md — is logged as open question OQ-2 above.

---

*End of Open Questions.*
