type Part = {
  num: string;
  title: string;
  oneLine: string;
};

const parts: Part[] = [
  {
    num: "I",
    title: "Bright Side — the bet",
    oneLine: "The highway. The mission line. The reason the rest of the deck exists.",
  },
  {
    num: "II",
    title: "What Headwaters is",
    oneLine: "The agency that carries the bet — vision, name, and the open lanes.",
  },
  {
    num: "III",
    title: "What I protect",
    oneLine: "The non-negotiables, the rhythm, the two hard rules. The shape that lets the bet ship.",
  },
  {
    num: "IV",
    title: "The pipeline I keep",
    oneLine: "One rule, one map, one product at a time, and the test for new shiny things.",
  },
  {
    num: "V",
    title: "Deer Lake — the contract that pays",
    oneLine: "Six roles, seven hires, the budget, the cash flow, the accountability bar.",
  },
  {
    num: "VI",
    title: "For Dad — the case",
    oneLine: "Why this rate, this team, this value, this feedback window — in your language.",
  },
  {
    num: "VII",
    title: "The pilot, the template, the path to scale",
    oneLine: "Deer Lake first. The same rails for the next reserve. The unit economics, named.",
  },
  {
    num: "VIII",
    title: "What outlives the contract",
    oneLine: "The salt line at runbook. The studio winding to portfolio. The work the bet inherits.",
  },
];

export default function ReReadClosing() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
    >
      <div
        className="absolute -right-[10vw] -top-[10vh] w-[50vw] h-[50vw] rounded-full"
        style={{ background: "rgba(184,90,62,0.16)" }}
      />
      <div
        className="absolute -left-[8vw] bottom-[-10vh] w-[38vw] h-[38vw] rounded-full"
        style={{ background: "rgba(244,237,224,0.05)" }}
      />

      <div className="relative z-10 w-full h-full px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div className="flex items-center gap-[1.2vw]">
            <div
              className="w-[1.4vw] h-[1.4vw] rounded-full"
              style={{ background: "#e9c8a8" }}
            />
            <div className="font-mono uppercase tracking-[0.32em] text-[1.05vw] opacity-85">
              Closing — the deck in one page
            </div>
          </div>
          <div className="font-mono uppercase tracking-[0.22em] text-[1vw] opacity-65">
            Eight parts · one bet · one contract that pays for it
          </div>
        </div>

        <div className="mb-[2vh] max-w-[80vw]">
          <h1
            className="font-display text-[4.6vw] leading-[1.02] tracking-tight font-medium"
            style={{ textWrap: "balance" }}
          >
            Re-read this deck
            <span className="italic font-normal" style={{ color: "#e9c8a8" }}>
              {" "}any time the loose ends start winning.
            </span>
          </h1>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-x-[1.4vw] gap-y-[1vh] min-h-0 content-start">
          {parts.map((p) => (
            <div
              key={p.num}
              className="flex gap-[1vw] items-start rounded-[0.4vw] px-[1.2vw] py-[1.1vh]"
              style={{ background: "rgba(244,237,224,0.06)" }}
            >
              <div
                className="font-display italic text-[2.2vw] leading-none shrink-0"
                style={{ color: "#e9c8a8" }}
              >
                {p.num}.
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-[1.25vw] leading-tight font-medium mb-[0.3vh]">
                  {p.title}
                </div>
                <div className="font-body text-[0.92vw] leading-[1.45] opacity-85">
                  {p.oneLine}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-[2vh] pt-[1.5vh] border-t flex items-end justify-between"
          style={{ borderColor: "rgba(244,237,224,0.25)" }}
        >
          <div
            className="font-display italic text-[1.45vw] leading-[1.4] max-w-[60vw]"
            style={{ textWrap: "balance" }}
          >
            The highway is the bet. The contract is the freight that pays
            for the asphalt. Everything else either feeds it or gets out of
            its way.
          </div>
          <div className="text-right">
            <div className="font-mono uppercase tracking-[0.25em] text-[0.95vw] opacity-65 mb-[0.5vh]">
              Practitioner Operating Plan
            </div>
            <div
              className="font-display text-[1.4vw]"
              style={{ color: "#e9c8a8" }}
            >
              v2 · Spring 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
