// Per-piece commentary that the Part III chapters in handbook.ts
// consume for each constellation-wide piece.
//
// The constellation manifest is the source-of-truth for each piece's
// vocabulary, severity ladder, sub-shelves, and rejected alternatives.
// The commentary here is *handbook authorial*: the why-this-was-chosen-
// as-two-sided exploration, the per-piece reads from each zone, the
// takeaway pull, and the open questions the practitioner is still
// sitting with. Keeping it next to handbook.ts (not inside the manifest)
// keeps the manifest from accumulating handbook copy and lets the same
// piece be summarised differently for different surfaces if a future
// surface needs to.
//
// Add a new entry here whenever a new constellation-wide piece is
// registered in
// artifacts/practitioner-operating-plan/public/constellation.json. The
// chapter generator throws if a piece is in the snapshot without
// matching commentary here — same discipline standby.ts uses to refuse
// to silently default.

import type { Block } from "./handbook";

export type FoundingExampleCommentary = {
  primitiveId: string;
  titleSuffix: string;
  whyTwoSided: Block[];
  crossZoneReads: string[];
  takeaway: { pull: string; closingPara: string };
  openQuestions: string[];
};

export const FOUNDING_EXAMPLE_COMMENTARY: FoundingExampleCommentary[] = [
  {
    primitiveId: "the-standby",
    titleSuffix: "the constellation's first non-zone primitive",
    whyTwoSided: [
      { kind: "subhead", text: "Why the umbrella is two-sided" },
      {
        kind: "para",
        text:
          "The Standby holds two registers that an outside system would almost certainly split apart. On one side is a slow, always-on practice — the pantry shelf is stocked, the contact tree is current, the generator gets test-started, the watch reads the morning advisory before anything is happening. On the other side is a fast, episodic event. A fire call opens, the rosters flip, the standby stock comes out where everyone can see it, and the system runs in active until the call stands down. Two sides, one umbrella.",
      },
      {
        kind: "para",
        text:
          "If the slow side and the fast side were named separately — *The Pantry* for the shelf, *The Call* for the event — the constellation would end up with two systems. One would have an inventory cadence and no event handling; the other would have an event handler and no preparation discipline. The cultures would split. The moment a call opened, the practitioner would discover that the people who keep the pantry are not the people who run the call, and the handoff would have to be invented under fire. The both-states test catches this before it happens. Pick the slow side and ask whether the umbrella name still fits the fast side. Pick the fast side and ask whether the umbrella name still fits the slow side. *Standby* passes both — *on standby* and *standby stock* are the same posture in different speeds. *Pantry* and *Call* each pass only one.",
      },
      {
        kind: "callout",
        text:
          "The two-sidedness here is *time*. One system, two speeds. Slow side and fast side are the same plumbing running at different rates.",
      },
    ],
    crossZoneReads: [
      "Zone 0 (Saltbox + Bright Side) — household and institutional standby checklists mirror the co-op's standby stock list, item for item.",
      "Zone 1 (Headwaters) — a standby budget envelope sleeves up automatically during an active call (drought → water-cost envelope, fire → supply-cost envelope, freight → stockpile envelope).",
      "Zone 2 (Practitioner Operating Plan) — standby debriefs come up here as the across-zones synthesis the workbench is for. No live call state is kept on the workbench, only the after-action read.",
      "Zone 3 (Community Knowledge Hub) — host zone. Centralized disruptions are felt collectively here first. Call history is the record kept here. The Common Pantry and The Watch are the sub-shelves.",
      "Zone 4 (Regen Revolution) — sector-level standby modeling: which industries have which fragilities to which calls (freight → packed weights, power → cold storage, key-person → Karen).",
      "Zone 5 (Dam Days and Shallows) — debriefs that someone wants to share publicly float to the Shallows. Private-by-default holds.",
    ],
    takeaway: {
      pull:
        "When a system has both a slow side (always-on practice) and a fast side (active event), the name has to do both jobs in one word. Otherwise the system will fork into two systems with two cultures.",
      closingPara:
        "The Standby is the first piece used across the whole constellation. It is hosted in Zone 3 because that is where centralized disruptions are felt collectively first. Every zone reads it. The both-states principle it carries is now a named principle in the manifest, ready the next time a piece has to do double duty.",
    },
    openQuestions: [
      "What is the right cadence for the slow side's stock-check ritual that does not drift into bureaucratic ritual? Monthly is too easy to skip; weekly is too easy to resent; *whenever there's an advisory* is reactive, not standby.",
      "Does standby stock get ledgered the way money does in Zone 1? Or is it deliberately kept off the books — held by the household and the co-op directly, outside the financial pieces — so stocking does not become accounting?",
      "When two calls overlap (a fire call open while a freight call is still standing down), do they share a single active rung, or does each call get its own ladder running in parallel? The manifest currently assumes one call at a time.",
      "How does the practitioner know when *not* to open a call? An over-eager active rung wears down the discipline as fast as a missed one does, and there is no rejected-alternative entry yet for *did not open the call when we should have*.",
      "When does a long fast side stop being a fast side and become the new slow side? A six-month freight outage is no longer a call — it is a new always-on. Does the system know how to absorb a call into the slow side without losing the debrief?",
    ],
  },
  {
    primitiveId: "the-gate",
    titleSuffix: "language across institutional boundaries",
    whyTwoSided: [
      { kind: "subhead", text: "Why the umbrella is two-sided" },
      {
        kind: "para",
        text:
          "The Gate holds two registers that an outside system would not even recognise as siblings. On one side is the *bright side* — the constellation's own dialect, the words a community uses with itself in its own kitchens, meetings, and ledgers: *neighbour*, *channel*, *the books*, *standby stock*, *the watch*. On the other side is *massity* — mass-society dialect, the language a regulator, a banker, a funder, a lawyer, or generic SaaS English will accept: *resident*, *bank account*, *financial statements*, *inventory reserves*, *compliance officer*. Neither side is wrong inside its own room. Each side is unfit currency in the other's room.",
      },
      {
        kind: "para",
        text:
          "If the two sides were named separately — *Translator* for the bright-to-massity direction, *Importer* for the massity-to-bright direction — the constellation would end up with two pipes and no posture. The Gate is more than directional substitution. It decides whether a piece of language *should* cross at all, in either direction. It logs every substitution so the bright-side noun stays on file alongside the massity equivalent. And it has a *refused* rung for source-side language that has no honest target-side equivalent and would lose its meaning under any substitution. The both-sides test catches the shape. Pick the bright side and ask whether the umbrella name still respects the massity side. Pick the massity side and ask whether the umbrella name still respects the bright side. *Gate* passes both. Neither side is the inside, and neither is the outside — the Gate is the doorway that lets each room keep its own language while still allowing communication across.",
      },
      {
        kind: "callout",
        text:
          "The two-sidedness here is *room*. One system, two rooms. Bright side and massity are the same plumbing facing different rooms.",
      },
      { kind: "subhead", text: "How this differs from the Standby" },
      {
        kind: "para",
        text:
          "The Standby's two sides are *time* — the same system in slow and fast speed. The Gate's two sides are *room* — the same system facing two audiences that hold different vocabularies as right. The Standby's principle is *both-states*; the Gate's principle is *both-sides*. Both are now named principles in the manifest. A future piece may need a third axis (densities? scales? jurisdictions?), and the principles array is open-ended on purpose. The discipline travels; the worked examples pile up.",
      },
    ],
    crossZoneReads: [
      "Zone 0 (Saltbox + Bright Side) — every form filled out for the school, the doctor, the child welfare office crosses a small gate. The household's word for who-belongs is *kin* or *neighbour*. The form's word is *resident* or *legal guardian*. The household keeps both on the fridge. The form goes out with the massity word.",
      "Zone 1 (Headwaters) — every grant application, CRA filing, and banker meeting is a Gate event. The bright side says *channel*. Massity says *bank account*. Same plumbing, different room. The mappings ledger is what keeps the two from drifting apart in the practitioner's own head.",
      "Zone 2 (Practitioner Operating Plan) — proposals, contracts, and statements of work cross the Gate between practitioner-vocabulary and client-vocabulary. The workbench logs which words crossed, in which direction, and what they became, so the next contract starts from the previous translation, not from scratch.",
      "Zone 3 (Community Knowledge Hub) — host zone alongside The Standby. Co-op invoices, band council resolutions, and regulator filings are the highest-volume gate traffic in the constellation. Host because Z3 is where the community's collective economic surface meets every external counterparty at once.",
      "Zone 4 (Regen Revolution) — sector-level translation: a *trapline*, a *family-run cold truck*, a *seed library* gets one massity-side equivalent for grant purposes — *harvesting operation*, *refrigerated logistics SME*, *plant-genetic-resource program*. The bright-side name continues to live unchanged at home.",
      "Zone 5 (Dam Days and Shallows) — public communication runs into a third register the Gate refuses to formalise: *plain language for the wider public*, neither bright-side nor massity. The Gate handles bright-to-massity and back. The third register lives one zone over, and the Shallows decide what gets said publicly in whose words.",
    ],
    takeaway: {
      pull:
        "When a system has language that has to live inside two rooms that do not trust each other, the metaphor must hold both sides without flattening either. Otherwise the system will pick a dialect and lose the other room.",
      closingPara:
        "The Gate is the second piece used across the whole constellation. It is hosted in Zone 3 alongside The Standby because that is where the community's collective surface meets every external counterparty — and it is read by every zone. The both-sides principle it carries is named alongside both-states in the manifest, ready the next time a piece has to hold two rooms at once.",
    },
    openQuestions: [
      "Should *refused* (the rung) become its own ledger, or is it just a category of *cleared with a note that no honest equivalent existed*? The first treats refusal as a first-class outcome the practitioner reviews periodically. The second treats it as a footnote on a clearance and lets it disappear into the file.",
      "Where does the third register — plain public language for Zone 5 — live? Inside the Gate as a fourth direction, alongside it as a sibling piece (a *Public Voice*?), or out of scope entirely on the grounds that the Shallows already do it without naming it?",
      "When the Gate refuses to translate, what is the next move? Does the practitioner rewrite the source-side language until it is gateable, or does the document just go out untranslated with a footnote saying *this term has no honest equivalent in the target dialect*? The first protects the document. The second protects the noun.",
      "Does the Gate need a severity escalation when massity tries to *replace* a bright-side word inside source documents — not just translate them on the way out? A funder editing the practitioner's own kitchen-language inside a draft is a different event than the practitioner translating it on the way out, and the manifest currently does not distinguish.",
      "Is *massity* the right name for the other side? It does the work (mass society, the world of forms and dashboards and policy) but it is also a coined word, which means it has no native speakers. The Standby's vocabulary is largely borrowed and weight-tested. The Gate's *massity* is invented. That is allowed — but worth re-examining once the Gate has been used in the field.",
    ],
  },
];

export function findFoundingExampleCommentary(
  primitiveId: string,
): FoundingExampleCommentary {
  const hit = FOUNDING_EXAMPLE_COMMENTARY.find(
    (c) => c.primitiveId === primitiveId,
  );
  if (!hit) {
    throw new Error(
      `No founding-example commentary registered for primitive "${primitiveId}". Add an entry in data/foundingExamples.ts.`,
    );
  }
  return hit;
}
