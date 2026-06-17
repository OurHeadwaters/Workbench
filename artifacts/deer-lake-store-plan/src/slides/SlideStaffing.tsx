// Slide 03 — Staffing
// Locked staffing model and wind-down arc as of Spring 2026.
// SOURCE OF TRUTH: these strings are read by
// src/data/__tests__/lockedNumbers.test.ts using readFileSync.
// Do not edit a number here without also updating the test.

export default function SlideStaffing() {
  return (
    <div>
      {/* 12-month staffing wind-down arc */}
      <div>{"Month 1: ~80% rotational / 20% local. Month 12: ~20% rotational / 80% local."}</div>

      {/* Working-holiday economics anchor — $25/hr × 60 hr/wk × 9 rotations */}
      <div>{"$54k banked, rent paid for"}</div>

      {/* Community ownership comparison — Mistissini Meechum */}
      <div>{"~84¢ on the dollar"}</div>

      {/* Local job creation target */}
      <div>{"17–20 community jobs"}</div>
    </div>
  );
}
