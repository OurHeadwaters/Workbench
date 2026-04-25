export default function BetThreeDoors() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              I · 02 — Three doors, one product
            </div>
            <h2
              className="font-display text-[3.6vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Three doors.
              <span className="italic font-normal text-accent"> One Bright Side.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.05vw] text-muted leading-[1.4]">
            One codebase, three audiences. The floor staff door, the lobby door,
            the director's door.{" "}
            <span className="text-primary font-semibold">
              All three already ship.
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[1.4vw] min-h-0">
          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1vh]">
              Door 01 · The floor
            </div>
            <div className="font-display text-[1.9vw] leading-tight text-primary font-medium mb-[1vh]">
              The clipboard, mid-shift.
            </div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-muted mb-[1.5vh]">
              /unit-sheet · resident list · transition runs
            </div>
            <div className="font-body text-[1vw] text-text leading-[1.5] flex-1">
              A swipeable cream paper card with a metal clip strip. Bed rows
              with a sky tab on the left like a page tab. Transition runs
              ("on the way → eyes on → returned") with a separate amber
              "needs redirect" counter that increments instead of overwriting
              — because redirecting someone with dementia three times in one
              walk is a fact, not a failure.
            </div>
            <div
              className="mt-[1.5vh] pt-[1.2vh] border-t font-mono text-[0.85vw] text-accent uppercase tracking-[0.2em]"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              An untrained RT picks it up mid-shift
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-paper)" }}
          >
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[1vh]">
              Door 02 · The lobby
            </div>
            <div className="font-display text-[1.9vw] leading-tight text-primary font-medium mb-[1vh]">
              Bright moments, on the wall.
            </div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-muted mb-[1.5vh]">
              /lobby · MVP wall · yesterday strip
            </div>
            <div className="font-body text-[1vw] text-text leading-[1.5] flex-1">
              Joy bubbles → MVPs → yesterday's bright moments. The TV in the
              lobby pairs once with a 90-day display token; the public kiosk
              has no permission to read anything but the MVP wall. The only
              place full names and photos surface — in the lit room, by
              design. You only see the bright side in the lit room.
            </div>
            <div
              className="mt-[1.5vh] pt-[1.2vh] border-t font-mono text-[0.85vw] text-accent uppercase tracking-[0.2em]"
              style={{ borderColor: "var(--slide-rule)" }}
            >
              The family sees the bright side
            </div>
          </div>

          <div
            className="rounded-[0.4vw] p-[1.8vw] flex flex-col"
            style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.95vw] font-semibold mb-[1vh]"
              style={{ color: "#e9c8a8" }}
            >
              Door 03 · The director
            </div>
            <div className="font-display text-[1.9vw] leading-tight font-medium mb-[1vh]">
              The settings, in one place.
            </div>
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.78vw] mb-[1.5vh] opacity-70"
              style={{ color: "#e9c8a8" }}
            >
              /sector · templates · planning pages
            </div>
            <div className="font-body text-[1vw] leading-[1.5] flex-1 opacity-95">
              Identity visibility, default checklists, template version
              history, locked template items the floor can rename but not
              silently delete. Planning pages are a generic slug-keyed
              operator notes surface — a workbench inside the floor app. The
              director sets the room. Floor staff aren't asked to make policy
              mid-shift.
            </div>
            <div
              className="mt-[1.5vh] pt-[1.2vh] border-t font-mono text-[0.85vw] uppercase tracking-[0.2em] opacity-80"
              style={{ borderColor: "rgba(244,237,224,0.3)", color: "#e9c8a8" }}
            >
              The director sets the microclimate
            </div>
          </div>
        </div>

        <div
          className="mt-[2.5vh] pt-[1.5vh] border-t font-display italic text-[1.3vw] text-muted leading-[1.4] max-w-[82vw]"
          style={{ borderColor: "var(--slide-rule)", textWrap: "balance" }}
        >
          One product, one codebase, three doors in.{" "}
          <span className="text-primary font-semibold not-italic">
            The floor door is the moat.
          </span>{" "}
          The lobby is the proof. The director's desk is where the institution
          becomes a microclimate. Each door makes the next one possible.
        </div>
      </div>
    </div>
  );
}
