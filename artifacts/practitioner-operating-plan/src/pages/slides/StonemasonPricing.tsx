/**
 * StonemasonPricing.tsx — Practitioner-layer pricing table + Guild cohort / tithe
 */

import {
  PRACTITIONER_TIERS,
  GUILD_COHORT_MIN,
  GUILD_COHORT_MAX,
  GUILD_TITHE_PCT,
  DEADHEAD_MONTHLY,
  DEADHEAD_ANNUAL,
  DEADHEAD_TRIAL_DAYS,
  DEADHEAD_POS,
} from "@/data/stonemason";

export default function StonemasonPricing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        <div className="flex items-center gap-[1vw] mb-[2vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Zone 3 Pricing
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.6vw] leading-[1.05] tracking-tight text-paper mb-[3vh]">
          Practitioner layer pricing — and the Guild mechanic.
        </h1>

        <div className="grid grid-cols-2 gap-[2.5vw] flex-1 min-h-0">

          {/* Practitioner tiers */}
          <div className="flex flex-col gap-[0.6vh] overflow-hidden">
            <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted mb-[0.4vh]">
              Practitioner Layer
            </div>
            <div className="flex flex-col gap-[0.5vh] flex-1 overflow-auto">
              {PRACTITIONER_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-start gap-[1.2vw] border border-rule rounded-[4px] px-[1.2vw] py-[1vh]"
                >
                  <div className="font-display font-semibold text-[1.05vw] text-accent tabular-nums whitespace-nowrap min-w-[7vw]">
                    {tier.price}
                  </div>
                  <div>
                    <div className="font-body text-[0.82vw] text-paper leading-[1.3]">{tier.label}</div>
                    <div className="font-body text-[0.75vw] text-muted leading-[1.4]">{tier.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guild + Deadhead */}
          <div className="flex flex-col gap-[2vh]">
            <div>
              <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted mb-[0.8vh]">
                Guild Layer
              </div>
              <div className="border border-rule rounded-[6px] px-[1.6vw] py-[1.8vh] flex flex-col gap-[1.2vh]">
                <div>
                  <div className="font-body text-[0.78vw] text-muted mb-[0.4vh]">Training cohort</div>
                  <div className="font-display font-semibold text-[2.4vw] text-paper tabular-nums leading-[1]">
                    ${GUILD_COHORT_MIN.toLocaleString("en-CA")}–${GUILD_COHORT_MAX.toLocaleString("en-CA")}
                    <span className="font-body font-normal text-[0.9vw] text-muted"> / person</span>
                  </div>
                </div>
                <div className="border-t border-rule pt-[1vh]">
                  <div className="font-body text-[0.78vw] text-muted mb-[0.4vh]">Founding practitioner tithe</div>
                  <div className="font-display font-semibold text-[2.4vw] text-accent tabular-nums leading-[1]">
                    {GUILD_TITHE_PCT}%
                  </div>
                  <div className="font-body text-[0.78vw] text-muted mt-[0.3vh]">
                    Of every certification fee — for the life of the practitioner's certification.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted mb-[0.8vh]">
                Deadhead SaaS — live proof point
              </div>
              <div className="border border-rule rounded-[6px] px-[1.6vw] py-[1.6vh] flex flex-col gap-[0.8vh]">
                <div className="flex gap-[2vw]">
                  <div>
                    <div className="font-body text-[0.75vw] text-muted">Monthly</div>
                    <div className="font-display font-semibold text-[1.6vw] text-paper tabular-nums">
                      ${DEADHEAD_MONTHLY} / mo
                    </div>
                  </div>
                  <div>
                    <div className="font-body text-[0.75vw] text-muted">Annual</div>
                    <div className="font-display font-semibold text-[1.6vw] text-paper tabular-nums">
                      ${DEADHEAD_ANNUAL} / yr
                    </div>
                  </div>
                  <div>
                    <div className="font-body text-[0.75vw] text-muted">Trial</div>
                    <div className="font-display font-semibold text-[1.6vw] text-paper tabular-nums">
                      {DEADHEAD_TRIAL_DAYS}-day free
                    </div>
                  </div>
                </div>
                <div className="font-body text-[0.78vw] text-muted leading-[1.45]">
                  POS: {DEADHEAD_POS}. The platform already accepts subscription revenue — this is the evidence.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
