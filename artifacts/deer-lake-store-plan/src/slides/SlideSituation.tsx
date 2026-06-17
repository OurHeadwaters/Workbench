// Slide 01 — Situation
// Locked headline numbers as of Spring 2026.
// SOURCE OF TRUTH: these strings are read by
// src/data/__tests__/lockedNumbers.test.ts using readFileSync.
// Do not edit a number here without also updating the test.
//
// Cross-deck alignment: the ~$1.6M annual leakage figure
// matches the Deer Lake market-size reference in the
// practitioner-operating-plan (budgetScenarios.ts).

export default function SlideSituation() {
  return (
    <div>
      {/* Capital leakage anchor — matches operating-plan market size */}
      <div>{"~$1.6M"}</div>

      {/* One-store monopoly statistic */}
      <div>{"87%"}</div>

      {/* Northern food basket — family of four */}
      <div>{"~$1,680 / month"}</div>

      {/* Southern Ontario equivalent */}
      <div>{"~$1,000"}</div>

      {/* Nutrition North pass-through to shelf */}
      <div>{"58¢"}</div>

      {/* Federal Nutrition North subsidy total */}
      <div>{"$144.8M"}</div>
    </div>
  );
}
