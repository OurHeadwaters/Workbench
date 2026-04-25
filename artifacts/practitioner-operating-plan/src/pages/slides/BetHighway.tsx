export default function BetHighway() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute -right-[10vw] -top-[10vh] w-[50vw] h-[50vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.18)" }}
      />
      <div
        className="absolute -left-[8vw] bottom-[-10vh] w-[40vw] h-[40vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.05)" }}
      />

      <div className="relative z-10 w-full h-full px-[7vw] py-[7vh] flex flex-col justify-between">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-85">
              I · 01 — Bright Side is the highway
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-65">
            The bet — said out loud, before anything else
          </div>
        </div>

        <div className="max-w-[82vw]">
          <div
            className="font-display italic font-light text-[2.2vw] leading-[1.3] mb-[3vh] max-w-[60vw]"
            style={{ color: "#e9c8a8", textWrap: "balance" }}
          >
            "I could sell it in my sleep."
          </div>
          <h1
            className="font-display text-[6.4vw] leading-[1] tracking-tight font-medium"
            style={{ textWrap: "balance" }}
          >
            Bright Side is
            <span className="block italic font-normal" style={{ color: "#e9c8a8" }}>
              the highway.
            </span>
            <span className="block">Everything else is a feeder road.</span>
          </h1>
          <div
            className="mt-[3vh] font-body text-[1.55vw] leading-[1.5] opacity-95 max-w-[68vw] border-l pl-[1.6vw]"
            style={{ borderColor: "#e9c8a8" }}
          >
            A PHI-free, mobile-first companion app for residential-care staff — the
            clipboard, not the hospital chart. Zone 0 of Headwaters: dwelling, centralized;
            SaltBox is its decentralized twin.{" "}
            <span className="font-semibold" style={{ color: "#e9c8a8" }}>
              Every other line under Headwaters either feeds this or stays in its lane.
            </span>{" "}
            The Deer Lake contract pays the freight; the salt line sits in the depot's white
            space; the studio winds down to portfolio. The highway is what we're building toward.
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="max-w-[60vw]">
            <div
              className="h-[1px] mb-[2vh] w-[18vw]"
              style={{ background: "rgba(244,237,224,0.45)" }}
            />
            <div
              className="font-display italic text-[1.55vw] leading-[1.4] opacity-95"
              style={{ textWrap: "balance" }}
            >
              The test for any new line: does it ladder onto the highway, or does it
              widen the shoulder it has to drive on?
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] opacity-70 mb-[0.8vh]">
              For me · for the team · for Dad
            </div>
            <div
              className="font-display text-[1.8vw] leading-tight"
              style={{ color: "#e9c8a8" }}
            >
              The bet, named.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
