import {
  CROSS_RESERVE_INSTALL_WEEKS,
  useSecondAnchorScenarios,
} from "@/lib/budgetMath";

const fmtMoney0 = (n: number) =>
  `$${Math.round(n).toLocaleString("en-US")}`;

const fmtMoneyK = (n: number) =>
  `$${(Math.round(n / 100) / 10).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`;

const fmtSurplus = (n: number) =>
  n >= 0
    ? `+${fmtMoney0(n)} surplus`
    : `(${fmtMoney0(Math.abs(n))}) still short`;

export default function SecondAnchorScenarios() {
  const s = useSecondAnchorScenarios();
  const { scenarioInstallOnly: s1, scenarioInstallPlusRetainer: s2, scenarioTier2Stack: s3 } = s;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[4vh] flex flex-col">
        <div className="flex items-center justify-between mb-[1.5vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Closing the Y1 gap · option one — a second anchor
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
            Direct answer to the slide before this one
          </div>
        </div>

        <h1 className="font-display font-medium text-[3vw] leading-[0.98] tracking-tight text-primary mb-[0.5vh]" style={{ textWrap: "balance" }}>
          One second anchor inside Year One closes the {fmtMoney0(s.gap)} gap.
        </h1>
        <div className="font-display italic text-[1.2vw] text-muted mb-[1.8vh] max-w-[78vw]">
          Three concrete shapes for that anchor — installed, retained, or stacked — each derived from the same cross-reserve install pricing the deck already publishes ({fmtMoney0(s.installPerReserve)} per {CROSS_RESERVE_INSTALL_WEEKS}-week install, {fmtMoney0(s.retainerAnnual)}/yr retainer).
        </div>

        <div className="grid grid-cols-3 gap-[1.3vw] mb-[1.5vh]">
          {/* Scenario 1 */}
          <div className="bg-paper px-[1.6vw] py-[2vh] flex flex-col rounded-[6px]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.85vw] text-primary mb-[0.6vh] font-semibold">
              Shape A · Single install
            </div>
            <div className="font-display text-[1.55vw] leading-[1.05] text-primary mb-[1vh]">
              One {CROSS_RESERVE_INSTALL_WEEKS}-week install, no retainer in Y1
            </div>
            <div className="font-display font-semibold text-[2.4vw] text-primary leading-[1] mb-[0.4vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtMoney0(s1.inflow)}
            </div>
            <div className="font-mono text-[0.9vw] text-muted mb-[1.5vh]">
              Y1 inflow added · install fee only
            </div>
            <div className="border-t border-dashed border-rule pt-[0.8vh] space-y-[0.5vh]">
              <Row label="Gap remaining" value={fmtSurplus(s1.surplus)} positive={s1.surplus >= 0} />
              <Row label="Y2 carry-in" value={s1.y2Carry === 0 ? "$0 — needs renewal or new anchor" : fmtMoney0(s1.y2Carry) + "/yr"} />
            </div>
            <div className="mt-auto pt-[1vh] font-body text-[0.95vw] text-text leading-[1.4]">
              The cleanest shape if the receiving reserve wants the install priced as a single capital line and defers the discipline-keeper retainer to Y2.
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="px-[1.6vw] py-[2vh] flex flex-col rounded-[6px]" style={{ background: "rgba(184,90,62,0.08)", border: "1px solid var(--slide-accent)" }}>
            <div className="font-mono uppercase tracking-[0.2em] text-[0.85vw] text-accent mb-[0.6vh] font-semibold">
              Shape B · Install + retainer (recommended)
            </div>
            <div className="font-display text-[1.55vw] leading-[1.05] text-primary mb-[1vh]">
              Same install, retainer pro-rated for partial Y1
            </div>
            <div className="font-display font-semibold text-[2.4vw] text-accent leading-[1] mb-[0.4vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtMoney0(s2.totalInflow)}
            </div>
            <div className="font-mono text-[0.9vw] text-muted mb-[1.5vh]">
              {fmtMoney0(s2.installInflow)} install + {fmtMoney0(s2.retainerInflow)} retainer ({s2.retainerMonthsActive} mo · M{s2.landMonth} land)
            </div>
            <div className="border-t border-dashed border-rule pt-[0.8vh] space-y-[0.5vh]">
              <Row label="Gap remaining" value={fmtSurplus(s2.surplus)} positive={s2.surplus >= 0} accent />
              <Row label="Y2 carry-in" value={fmtMoney0(s2.y2Carry) + "/yr"} accent />
            </div>
            <div className="mt-auto pt-[1vh] font-body text-[0.95vw] text-text leading-[1.4]">
              Closes Y1 with a margin <em>and</em> seeds a {fmtMoney0(s2.y2Carry)}/yr Y2 floor. This is the shape the path-to-scale model assumes.
            </div>
          </div>

          {/* Scenario 3 */}
          <div className="bg-paper px-[1.6vw] py-[2vh] flex flex-col rounded-[6px]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.85vw] text-primary mb-[0.6vh] font-semibold">
              Shape C · Tier-2 stack (no travel)
            </div>
            <div className="font-display text-[1.55vw] leading-[1.05] text-primary mb-[1vh]">
              SMB / band-office subscriptions instead of an install
            </div>
            <div className="font-display font-semibold text-[2.4vw] text-primary leading-[1] mb-[0.4vh]" style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtMoney0(s3.realisticInflowLow)}–{fmtMoney0(s3.realisticInflowHigh)}
            </div>
            <div className="font-mono text-[0.9vw] text-muted mb-[1.5vh]">
              {s3.realisticSubsLow}–{s3.realisticSubsHigh} subs × ${s3.arpuLow}–${s3.arpuHigh}/mo · realistic Y1 portfolio
            </div>
            <div className="border-t border-dashed border-rule pt-[0.8vh] space-y-[0.5vh]">
              <Row label="Gap remaining (low)" value={fmtSurplus(s3.realisticInflowLow - s.gap)} positive={s3.realisticInflowLow >= s.gap} />
              <Row label="To fully close" value={`${s3.subsNeededAtMid} subs @ $${s3.arpuMid}/mo · or ${s3.subsNeededAtHigh} @ $${s3.arpuHigh}/mo`} />
              <Row label="Y2 carry-in" value={`${fmtMoney0(s3.y2CarryLow)}–${fmtMoney0(s3.y2CarryHigh)}/yr`} />
            </div>
            <div className="mt-auto pt-[1vh] font-body text-[0.95vw] text-text leading-[1.4]">
              The honest math: a 4–6-sub portfolio covers part of the gap. Fully replacing the install needs ~{s3.subsNeededAtHigh}–{s3.subsNeededAtMid} subscriptions — slower to ramp, but no time on the road.
            </div>
          </div>
        </div>

        {/* Timing strip */}
        <div className="bg-paper rounded-[6px] px-[2vw] py-[1.4vh] mb-[1.2vh]">
          <div className="flex items-center justify-between mb-[1vh]">
            <div className="font-mono uppercase tracking-[0.2em] text-[0.9vw] text-primary font-semibold">
              How late can the second anchor land? (Shape B, install + retainer)
            </div>
            <div className="font-mono text-[0.85vw] text-muted">
              {CROSS_RESERVE_INSTALL_WEEKS}-week install · retainer kicks in once install completes
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[1.5vw]">
            {s.timing.map((t) => {
              const surplus = -t.remainingGap;
              return (
                <div key={t.landMonth} className="border-t-[2px] pt-[0.8vh]" style={{ borderColor: t.closesGap ? "var(--slide-accent)" : "var(--slide-rule)" }}>
                  <div className="flex items-baseline justify-between mb-[0.3vh]">
                    <div className="font-display text-[1.5vw] font-semibold text-primary">
                      Land at M{t.landMonth}
                    </div>
                    <div className="font-mono text-[0.8vw] text-muted uppercase tracking-[0.18em]">
                      {t.installCompletedInY1 ? `install done M${t.landMonth + s.installDurationMonths}` : "spills into Y2"}
                    </div>
                  </div>
                  <div className="font-display text-[1.7vw] font-semibold leading-[1] mb-[0.3vh]" style={{ fontVariantNumeric: "tabular-nums", color: t.closesGap ? "var(--slide-accent)" : "var(--slide-text)" }}>
                    {fmtMoney0(t.totalInflow)}
                  </div>
                  <div className="font-body text-[0.95vw] text-text leading-[1.4]">
                    {fmtMoneyK(t.installInflow)} install + {t.retainerMonthsActive} mo retainer ({fmtMoney0(t.retainerInflow)}) · {fmtSurplus(surplus)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-[1vh] font-body italic text-[0.95vw] text-muted leading-[1.4]">
            Past M9, the {CROSS_RESERVE_INSTALL_WEEKS}-week install can't complete inside Y1; install revenue starts to spill into Y2 and the gap doesn't fully close on this slide alone.
          </div>
        </div>

        <div className="border-t border-rule pt-[1vh] flex items-start justify-between gap-[2vw]">
          <div className="font-body text-[0.9vw] text-muted leading-[1.45] max-w-[58vw]">
            <span className="font-mono uppercase tracking-[0.2em] text-[0.75vw] text-primary mr-[0.5vw]">What this slide is not:</span>
            it doesn't pick <em>which</em> reserve the second anchor is (see Pilot #2 candidate-scoring), it doesn't redo the Y2/Y3 path-to-scale headlines (those compose this same install + retainer over multiple years), and it isn't the receiving band's sticker-price view (covered by the reserve-#2 cost slide). It's also not the answer to the $40k day-one bridge or to contractor payment slippage — those address the <em>capital</em> and <em>timing</em> legs of the gap, not the <em>revenue</em> leg this slide answers.
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.8vw] text-muted text-right whitespace-nowrap">
            Year One · gap close · option 1 of N
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, positive, accent }: { label: string; value: string; positive?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="font-body text-[0.95vw] text-text">{label}</span>
      <span
        className="font-display text-[1.05vw] font-semibold"
        style={{
          fontVariantNumeric: "tabular-nums",
          color: accent
            ? "var(--slide-accent)"
            : positive === false
              ? "var(--slide-accent)"
              : "var(--slide-primary)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
