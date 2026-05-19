/**
 * StonemasonOverview.tsx — Zone 3 Stonemason three-layer revenue model
 */

import { LAYERS, OUT_OF_SCOPE } from "@/data/stonemason";

export default function StonemasonOverview() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        <div className="flex items-center gap-[1vw] mb-[2vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Zone 3 Business Model
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.8vw] leading-[1.05] tracking-tight text-paper mb-[0.6vh]">
          The Stonemason model — three layers.
        </h1>
        <div className="font-display italic text-[1.2vw] text-muted mb-[3vh] max-w-[70vw]">
          Headwaters is the platform vendor. 807 is the first tenant. Communities are the beneficiaries — not the customers.
        </div>

        <div className="grid grid-cols-3 gap-[2vw] flex-1">
          {LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              className="rounded-[6px] border border-rule px-[1.8vw] py-[2.2vh] flex flex-col gap-[1.2vh]"
              style={i === 1 ? { borderColor: "var(--slide-accent)", background: "rgba(184,90,62,0.06)" } : {}}
            >
              <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] text-muted">
                Layer {i + 1}
              </div>
              <div
                className="font-display font-semibold text-[2vw] leading-[1] text-paper"
                style={i === 1 ? { color: "var(--slide-accent)" } : {}}
              >
                {layer.label}
              </div>
              <div className="font-display italic text-[0.95vw] text-muted leading-[1.3]">
                {layer.tagline}
              </div>
              <div className="font-body text-[0.82vw] text-muted leading-[1.55] flex-1">
                {layer.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[2.5vh] rounded-[6px] border border-rule px-[2vw] py-[1.6vh]">
          <div className="font-mono uppercase tracking-[0.16em] text-[0.68vw] text-muted mb-[0.8vh]">
            Out of scope — always
          </div>
          <div className="flex flex-wrap gap-x-[3vw] gap-y-[0.4vh]">
            {OUT_OF_SCOPE.map((item) => (
              <div key={item} className="font-body text-[0.8vw] text-muted leading-[1.5] flex items-start gap-[0.5vw]">
                <span className="text-accent mt-[0.1vh]">×</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
