export default function BetMissionLine() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute -left-[10vw] -top-[10vh] w-[55vw] h-[55vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.04)" }}
      />
      <div
        className="absolute right-[6vw] bottom-[6vh] w-[16vw] h-[16vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.18)" }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-85">
              I · 03 — The line I won't lose
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-65">
            One sentence · the mission · permanent
          </div>
        </div>

        <div className="max-w-[82vw]">
          <div
            className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-70 mb-[3vh]"
            style={{ color: "#e9c8a8" }}
          >
            The mission line
          </div>
          <h1
            className="font-display text-[5vw] leading-[1.04] tracking-tight font-medium"
            style={{ textWrap: "balance", color: "#f4ede0" }}
          >
            The institution can be a cultivated microclimate,
            <span className="block italic font-normal" style={{ color: "#e9c8a8" }}>
              not a wind tunnel.
            </span>
          </h1>
          <div
            className="mt-[2vh] font-display italic text-[1.5vw] opacity-85"
            style={{ color: "#f4ede0" }}
          >
            Every screen is a small wall against the wind.
          </div>
        </div>

        <div className="grid grid-cols-12 gap-[2vw] items-end">
          <div className="col-span-7">
            <div
              className="border-l pl-[1.6vw]"
              style={{ borderColor: "#e9c8a8" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.85vw] mb-[1vh]"
                style={{ color: "#e9c8a8" }}
              >
                In plain language
              </div>
              <div
                className="font-body text-[1.3vw] leading-[1.5] opacity-95"
                style={{ textWrap: "pretty" }}
              >
                People in residential care — and the staff who care for them —
                deserve a room with the wind blocked. The institution doesn't
                have to be the wind. Bright Side is the tool that lets a
                single facility build that microclimate with the staff it
                actually has, the budget it actually has, and no third party
                in the middle.{" "}
                <span className="font-semibold" style={{ color: "#e9c8a8" }}>
                  PHI-free by construction. Single-facility seed. Plain
                  Postgres.
                </span>{" "}
                The staff is going to leave; the institution will too. The
                tool still works the next morning.
              </div>
            </div>
          </div>
          <div className="col-span-5">
            <div
              className="rounded-[0.4vw] p-[1.6vw]"
              style={{ background: "rgba(244,237,224,0.08)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold mb-[1.5vh]"
                style={{ color: "#e9c8a8" }}
              >
                The four teachers, in this room
              </div>
              <div className="space-y-[1.1vh]">
                <div
                  className="font-body text-[0.98vw] leading-[1.4] opacity-95"
                  style={{ color: "#f4ede0" }}
                >
                  <span
                    className="font-mono uppercase tracking-[0.18em] text-[0.78vw] font-semibold mr-[0.6vw]"
                    style={{ color: "#e9c8a8" }}
                  >
                    TSP
                  </span>
                  PHI-free by construction, single-facility seed, plain
                  Postgres. If times get tough, the tool still works.
                </div>
                <div
                  className="font-body text-[0.98vw] leading-[1.4] opacity-95"
                  style={{ color: "#f4ede0" }}
                >
                  <span
                    className="font-mono uppercase tracking-[0.18em] text-[0.78vw] font-semibold mr-[0.6vw]"
                    style={{ color: "#e9c8a8" }}
                  >
                    Salatin
                  </span>
                  Humble, durable copy. No clinical jargon. No fake AI praise.
                </div>
                <div
                  className="font-body text-[0.98vw] leading-[1.4] opacity-95"
                  style={{ color: "#f4ede0" }}
                >
                  <span
                    className="font-mono uppercase tracking-[0.18em] text-[0.78vw] font-semibold mr-[0.6vw]"
                    style={{ color: "#e9c8a8" }}
                  >
                    LFTN
                  </span>
                  Director controls in one place. Floor staff don't make
                  policy mid-shift.
                </div>
                <div
                  className="font-body text-[0.98vw] leading-[1.4] opacity-95"
                  style={{ color: "#f4ede0" }}
                >
                  <span
                    className="font-mono uppercase tracking-[0.18em] text-[0.78vw] font-semibold mr-[0.6vw]"
                    style={{ color: "#e9c8a8" }}
                  >
                    Cells
                  </span>
                  Peer-to-peer at unit scale. Shift Feed is hallway-to-
                  hallway. No manager approval.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
