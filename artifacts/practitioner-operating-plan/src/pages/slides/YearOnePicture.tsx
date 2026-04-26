export default function YearOnePicture() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Year One · 04
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            With Deer Lake as the only client
          </div>
        </div>

        <h1 className="font-display font-medium text-[4.4vw] leading-[0.98] tracking-tight text-primary mb-[1vh]" style={{ textWrap: "balance" }}>
          The honest cash picture.
        </h1>
        <div className="font-display italic text-[1.55vw] text-muted mb-[3vh] max-w-[68vw]">
          Locked numbers add up to a real Year-1 gap. Surfaced here, not buried in an appendix — because the gap is the next strategic question.
        </div>

        <div className="grid grid-cols-[1.2fr_1fr] gap-[2.5vw] flex-1">
          <div className="bg-paper rounded-[6px] px-[2vw] py-[2.5vh] flex flex-col">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-primary mb-[2vh] font-semibold">
              Revenue & cost reconciliation
            </div>
            <div className="flex items-center justify-between border-b border-dashed border-rule py-[1.1vh]">
              <span className="font-body text-[1.25vw] text-text">Deer Lake recurring contract</span>
              <span className="font-display text-[1.55vw] text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>$420,000</span>
            </div>
            <div className="flex items-center justify-between border-b border-dashed border-rule py-[1.1vh]">
              <span className="font-body text-[1.25vw] text-text">Tech-stack managed-services fee (Tier 2)</span>
              <span className="font-display text-[1.55vw] text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>$4,800</span>
            </div>
            <div className="flex items-center justify-between border-b border-dashed border-rule py-[1.1vh]">
              <span className="font-body text-[1.25vw] text-text">807 CDP grant <span className="text-muted text-[0.95vw]">(one-time)</span></span>
              <span className="font-display text-[1.55vw] text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>$20,500</span>
            </div>
            <div className="flex items-center justify-between border-b border-dashed border-rule py-[1.1vh]">
              <span className="font-body text-[1.25vw] text-text">Salts net cash</span>
              <span className="font-display text-[1.55vw] text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>$1,298</span>
            </div>
            <div className="flex items-center justify-between border-b border-rule py-[1.4vh] bg-bg -mx-[2vw] px-[2vw]">
              <span className="font-body font-semibold text-[1.3vw] text-primary">Y1 revenue total</span>
              <span className="font-display font-semibold text-[1.7vw] text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>$446,598</span>
            </div>
            <div className="flex items-center justify-between py-[1.4vh] mt-[1vh]">
              <span className="font-body text-[1.25vw] text-text">V3 cost basis <span className="text-muted text-[0.95vw]">($47,817 × 12)</span></span>
              <span className="font-display text-[1.55vw] text-text" style={{ fontVariantNumeric: "tabular-nums" }}>($573,800)</span>
            </div>
            <div className="mt-auto pt-[1.5vh] font-body text-[1vw] text-muted leading-[1.45]">
              People recurring $33,000/mo · variable amortized $2,625/mo · overheads ~$12,192/mo. V2 minus life supports, plus Deer Lake travel.
            </div>
          </div>

          <div className="rounded-[6px] px-[2vw] py-[2.5vh] flex flex-col" style={{ background: "rgba(184,90,62,0.08)", border: "1px solid var(--slide-accent)" }}>
            <div className="font-mono uppercase tracking-[0.2em] text-[0.95vw] text-accent mb-[1.5vh] font-semibold">
              Year-1 gap, surfaced honestly
            </div>
            <div className="font-body text-[1.2vw] text-text leading-[1.5] mb-[1.5vh]">
              With Deer Lake as the <em>only</em> client at full V3 ramp, the Year-1 cash gap is:
            </div>
            <div className="font-display font-semibold text-[5.2vw] text-accent leading-[1]" style={{ fontVariantNumeric: "tabular-nums" }}>
              ($127,202)
            </div>
            <div className="font-body text-[1.15vw] text-text leading-[1.5] mt-[2vh] mb-[1.5vh]">
              And <span className="font-semibold text-primary">$112,000 of Capital Recovery</span> from V2 is still standing — debt to lender and family that V3 has not begun to retire.
            </div>
            <div className="font-body italic text-[1.15vw] text-text leading-[1.5] mt-auto">
              The $35k Deer Lake contract is a real security floor for the practitioner and the team's core. It does not, by itself, fund Headwaters at the V3 cost basis.
            </div>
          </div>
        </div>

        <div className="mt-[2.5vh] flex items-center justify-between border-t border-rule pt-[1.5vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted">
            Paths to close it · pick one before the deck goes live
          </div>
          <div className="font-body text-[1.05vw] text-text">
            Phased hiring · Band #2 ramping by month 9 · founder carrying part of comp · structural change
          </div>
        </div>
      </div>
    </div>
  );
}
