/**
 * StonemasonRunway.tsx — Year 1–3+ income projections + 24-month quarterly runway map
 *
 * Reacts live to Zone 3 override assumptions set in the Cost Review modal.
 */

import { useState, useEffect } from "react";
import { computeIncomeYears, computeRunwayQuarters } from "@/data/stonemason";
import { loadOverrideValues } from "@/lib/stonemasonOverrides";

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-CA");
}

export default function StonemasonRunway() {
  const [overrideValues, setOverrideValues] = useState<Record<string, number>>(
    () => loadOverrideValues()
  );

  // Re-read overrides whenever the tab gains focus or localStorage changes
  useEffect(() => {
    const refresh = () => setOverrideValues(loadOverrideValues());
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const incomeYears    = computeIncomeYears(overrideValues);
  const runwayQuarters = computeRunwayQuarters(overrideValues);
  const maxRevMax      = Math.max(...runwayQuarters.map((q) => q.revenueMax));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        <div className="flex items-center gap-[1vw] mb-[2vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Zone 3 Income Projections &amp; Runway
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.5vw] leading-[1.05] tracking-tight text-paper mb-[2.5vh]">
          Year 1–3+ projections. 24-month quarterly map.
        </h1>

        <div className="grid grid-cols-2 gap-[2.5vw] flex-1 min-h-0">

          {/* Year 1–3 income table */}
          <div className="flex flex-col gap-[1.2vh] overflow-auto">
            <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted">
              Annual income — computed from assumptions
            </div>
            {incomeYears.map((yr) => (
              <div key={yr.label} className="border border-rule rounded-[6px] px-[1.4vw] py-[1.4vh]">
                <div className="flex items-baseline justify-between mb-[0.6vh]">
                  <div className="font-display font-semibold text-[1.1vw] text-paper">{yr.label}</div>
                  <div className="font-display font-semibold text-[1.3vw] text-accent tabular-nums">
                    {fmt(yr.low)}–{fmt(yr.high)}
                  </div>
                </div>
                <div className="flex flex-col gap-[0.25vh]">
                  {yr.sources.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between">
                      <span className="font-body text-[0.72vw] text-muted">{s.label}</span>
                      <span className="font-mono text-[0.72vw] text-muted tabular-nums">{s.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 24-month quarterly runway */}
          <div className="flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted">
              24-month quarterly runway — Q1 2026 → Q2 2027
            </div>
            <div className="flex flex-col gap-[0.55vh] flex-1">
              {runwayQuarters.map((q) => {
                const barPct = maxRevMax > 0 ? (q.revenueMax / maxRevMax) * 100 : 0;
                return (
                  <div key={q.id} className="flex items-center gap-[1.2vw]">
                    <div className="font-mono text-[0.68vw] text-muted tabular-nums w-[5.2vw] shrink-0">
                      {q.label}
                    </div>
                    <div className="flex-1 flex flex-col gap-[0.2vh]">
                      <div className="flex items-center gap-[0.8vw]">
                        <div
                          className="h-[1.4vh] rounded-sm transition-all"
                          style={{
                            width: `${barPct}%`,
                            background: "rgba(180,210,170,0.45)",
                            minWidth: "4%",
                          }}
                        />
                        <div className="font-mono text-[0.68vw] text-muted tabular-nums whitespace-nowrap">
                          {fmt(q.revenueMin)}–{fmt(q.revenueMax)}
                        </div>
                      </div>
                      <div className="font-body text-[0.7vw] text-muted leading-[1.3]">
                        <span className="text-paper/70">{q.focus}:</span>{" "}
                        {q.target}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
