/**
 * StonemasonGrants.tsx — Grant positioning + Rootwork pilot strategy
 */

import { GRANT_PROGRAMS, ROOTWORK_AVATARS, ROOTWORK_OPEN_DECISIONS } from "@/data/stonemason";

export default function StonemasonGrants() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        <div className="flex items-center gap-[1vw] mb-[2vh]">
          <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
          <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
            Grant Positioning &amp; Rootwork Pilot
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.5vw] leading-[1.05] tracking-tight text-paper mb-[1vh]">
          Four grant targets. Six pilot avatars.
        </h1>

        <div className="rounded-[6px] border border-rule px-[1.8vw] py-[1.2vh] mb-[2vh]" style={{ borderColor: "rgba(180,210,170,0.4)", background: "rgba(180,210,170,0.06)" }}>
          <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw] text-muted mb-[0.4vh]">
            Founder eligibility story
          </div>
          <div className="font-body text-[0.8vw] text-paper/80 leading-[1.55]">
            Headwaters is a northern Ontario-based sole practitioner (Wabigoon, Treaty 3 Territory) with a documented track record of economic development work in remote First Nations communities.
            The Codetry/Deadhead stack was built and is maintained in the north, for the north.
            That geography, the Indigenous community focus, and the small-business profile make this entity
            eligible for NOHFC (northern geography), OTF (community benefit, food security),
            New Horizons (elder knowledge and rural food access), and CDAP (small-business digital adoption).
            The practitioner has no prior grant relationships with any of these funders — all four are first-approach.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[2.5vw] flex-1 min-h-0">

          {/* Grant programs */}
          <div className="flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted mb-[0.2vh]">
              Target grant programs
            </div>
            <div className="flex flex-col gap-[0.7vh] flex-1">
              {GRANT_PROGRAMS.map((g) => (
                <div key={g.id} className="border border-rule rounded-[6px] px-[1.4vw] py-[1.2vh]">
                  <div className="flex items-baseline gap-[0.8vw] mb-[0.3vh]">
                    <div className="font-display font-semibold text-[0.95vw] text-accent">{g.acronym}</div>
                    <div className="font-body text-[0.72vw] text-muted">{g.name}</div>
                  </div>
                  <div className="font-body text-[0.75vw] text-paper/70 leading-[1.4] mb-[0.2vh]">
                    <span className="text-muted">Eligibility:</span> {g.eligibility}
                  </div>
                  <div className="font-body text-[0.75vw] text-paper/70 leading-[1.4]">
                    <span className="text-muted">Fit:</span> {g.fit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rootwork pilot */}
          <div className="flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.16em] text-[0.7vw] text-muted mb-[0.2vh]">
              Rootwork pilot — six avatars
            </div>
            <div className="flex flex-col gap-[0.55vh]">
              {ROOTWORK_AVATARS.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-[0.8vw] border border-rule rounded-[4px] px-[1.2vw] py-[0.9vh]"
                >
                  <div className="font-mono text-[0.68vw] text-accent mt-[0.15vh] shrink-0">{a.id.toUpperCase()}</div>
                  <div>
                    <div className="font-body text-[0.78vw] text-paper leading-[1.3]">{a.label}</div>
                    <div className="font-body text-[0.72vw] text-muted leading-[1.3]">{a.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-rule rounded-[6px] px-[1.4vw] py-[1.2vh] mt-[0.4vh]">
              <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw] text-muted mb-[0.6vh]">
                Open pilot decisions
              </div>
              {ROOTWORK_OPEN_DECISIONS.map((d) => (
                <div key={d} className="flex items-start gap-[0.5vw] mb-[0.3vh]">
                  <span className="text-accent text-[0.8vw] mt-[0.05vh]">?</span>
                  <span className="font-body text-[0.78vw] text-muted leading-[1.4]">{d}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
