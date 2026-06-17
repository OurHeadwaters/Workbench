// Slide 05 — Financials · Timeline · Role
// Locked headline numbers as of Spring 2026.
// SOURCE OF TRUTH: these strings are read by
// src/data/__tests__/lockedNumbers.test.ts using readFileSync.
// Do not edit a number here without also updating the test.
//
// Cross-deck alignment: the ~$1.6–2.0M / yr community grocery
// spend is consistent with the ~$1.6M annual leakage figure on
// SlideSituation.tsx and the Deer Lake market-size reference in
// the practitioner-operating-plan.

export default function SlideFinancials() {
  return (
    <div>
      {/* Community grocery spend — planning grade */}
      <div>{"~$1.6–2.0M / yr"}</div>

      {/* Population basis */}
      <div>{"~870 residents at Northern price points"}</div>

      {/* Year-1 target market share */}
      <div>{"30–40%"}</div>

      {/* Blended gross margin — lower than NWC by design */}
      <div>{"22–28%"}</div>

      {/* Opening capex band */}
      <div>{"$400–700k"}</div>
    </div>
  );
}
