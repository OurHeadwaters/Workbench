/**
 * Closing.tsx — deck closing slide
 *
 * All dollar figures are imported from @/data/budgetScenarios.
 * Do NOT hardcode any cost-basis, reinvestment, ask, or bridge
 * numbers in this file.
 */

import { ASK, COST_BASIS, REINVEST, BRIDGE, SCENARIO_ROWS, fmt, fmtK } from "@/data/budgetScenarios";

export default function Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[6vh] flex flex-col justify-between text-paper">

        {/* Top bar */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div className="w-[1.4vw] h-[1.4vw] rounded-full" style={{ background: "var(--slide-accent)" }} />
            <div className="font-mono uppercase tracking-[0.25em] text-[1.1vw] opacity-90">
              Practitioner Operating Plan — Closing
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] opacity-60">
            Scenario B recommended
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col items-start max-w-[72vw]">
          <div className="h-[1px] mb-[3vh] w-[20vw]" style={{ background: "rgba(244,237,224,0.4)" }} />

          <div className="font-display font-medium text-[5.5vw] leading-[0.98] tracking-tight mb-[3vh]" style={{ textWrap: "balance" }}>
            Six numbers.<br />
            <span className="italic" style={{ color: "#e9c8a8" }}>One honest gap.</span>
          </div>

          {/* The six locked numbers */}
          <div className="grid grid-cols-3 gap-[2vw] w-full mb-[3vh]">
            <div className="border-t-[2px] border-rule pt-[1.5vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] opacity-60 mb-[0.5vh]">Cost basis (recommended)</div>
              <div className="font-display font-semibold text-[2.2vw] tabular-nums">{fmt(COST_BASIS.b)}<span className="text-[0.8vw] opacity-60 font-body font-normal">/mo</span></div>
            </div>
            <div className="border-t-[2px] border-rule pt-[1.5vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] opacity-60 mb-[0.5vh]">Monthly ask (recommended)</div>
              <div className="font-display font-semibold text-[2.2vw] tabular-nums">{fmt(ASK.recommended)}<span className="text-[0.8vw] opacity-60 font-body font-normal">/mo</span></div>
            </div>
            <div className="border-t-[2px] border-rule pt-[1.5vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] opacity-60 mb-[0.5vh]">Reinvestment</div>
              <div className="font-display font-semibold text-[2.2vw] tabular-nums">{fmt(REINVEST.b.amount)}<span className="text-[0.8vw] opacity-60 font-body font-normal"> ({REINVEST.b.pct}%)</span></div>
            </div>
            <div className="border-t-[2px] border-rule pt-[1.5vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] opacity-60 mb-[0.5vh]">Day-one bridge</div>
              <div className="font-display font-semibold text-[2.2vw] tabular-nums">{fmtK(BRIDGE.b)}</div>
            </div>
            <div className="border-t-[2px] border-rule pt-[1.5vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] opacity-60 mb-[0.5vh]">Floor ask (Scenario A)</div>
              <div className="font-display font-semibold text-[2.2vw] tabular-nums">{fmt(ASK.floor)}<span className="text-[0.8vw] opacity-60 font-body font-normal">/mo</span></div>
            </div>
            <div className="border-t-[2px] border-rule pt-[1.5vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] opacity-60 mb-[0.5vh]">Scale ask (Scenario C)</div>
              <div className="font-display font-semibold text-[2.2vw] tabular-nums">{fmt(ASK.scale)}<span className="text-[0.8vw] opacity-60 font-body font-normal">/mo</span></div>
            </div>
          </div>

          {/* Scenario summary */}
          <div className="w-full border-t border-rule pt-[1.5vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] opacity-60 mb-[1vh]">
              All three scenarios — cost · reinvestment · ask · bridge
            </div>
            <div className="grid grid-cols-3 gap-[1.5vw]">
              {SCENARIO_ROWS.map((s) => (
                <div
                  key={s.id}
                  className="rounded-[4px] px-[1.2vw] py-[1vh]"
                  style={{
                    background: s.id === "b" ? "rgba(184,90,62,0.12)" : "rgba(244,237,224,0.05)",
                    border: s.id === "b" ? "1px solid rgba(184,90,62,0.5)" : "1px solid rgba(244,237,224,0.12)",
                  }}
                >
                  <div className="font-mono uppercase tracking-[0.15em] text-[0.65vw] opacity-60 mb-[0.3vh]">{s.label}</div>
                  <div className="font-body text-[0.8vw] opacity-90 tabular-nums leading-[1.6]">
                    {fmt(s.costBasis)} cost · {fmt(s.reinvest)} reinvest ({s.reinvestPct}%)<br />
                    {fmt(s.ask)}/mo ask · {fmtK(s.bridge)} bridge
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div className="max-w-[44vw]">
            <div className="h-[1px] mb-[2vh] w-[18vw]" style={{ background: "rgba(244,237,224,0.3)" }} />
            <div className="font-body text-[1.2vw] leading-[1.5] opacity-85">
              The gap is real. The bridge is sized. The six people are in place.
              The only question left is the one worth asking.
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] opacity-75 mb-[1vh]">Closing line</div>
            <div className="font-display italic text-[1.9vw] leading-tight" style={{ color: "#e9c8a8" }}>
              "We always knew how to fix it.
              <div className="mt-[0.4vh]">Now we can."</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
