type Question = {
  num: string;
  prompt: string;
  passes: string;
  fails: string;
};

const questions: Question[] = [
  {
    num: "01",
    prompt: "Does it ladder to the mission line?",
    passes: "It advances decentralized governance, proof of consent, or democracy without representation in some concrete way.",
    fails: "It's interesting but doesn't sit anywhere on the highway — it's a sibling business, not a tributary.",
  },
  {
    num: "02",
    prompt: "Does it cost work-block hours this quarter?",
    passes: "It can be carried by the team or the calendar already in place — no new founder hours required.",
    fails: "It needs hours from the 10:30–4 work block. Those hours are spoken for. The answer is no, even if the idea is right.",
  },
  {
    num: "03",
    prompt: "Is the next contract still named?",
    passes: "Pilot #2 is named, dated, and on the prospect map. The pipeline rule still holds with this added in.",
    fails: "Saying yes to this means the pipeline rule slips. Anything that breaks the pipeline rule loses, regardless of merit.",
  },
  {
    num: "04",
    prompt: "Does Bright Side advance this week regardless?",
    passes: "Bright Side still gets at least one commit this week with this added in. The bet keeps moving.",
    fails: "This week the highway stops to make room for the new shiny thing. That's the trap by definition. Defer or decline.",
  },
];

export default function ShinyLooseEndTest() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.5vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              IV · 04 — The shiny loose end test
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Four questions
              <span className="italic font-normal text-accent"> before saying yes to anything new.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1.05vw] text-muted leading-[1.4]">
            New contract, new product idea, new partner intro, new conference
            invite. Pause. Run all four. A no on any one is a no on the
            whole thing — at least until next quarter's review.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1.4vw] gap-y-[1.4vh] min-h-0 content-start">
          {questions.map((q) => (
            <QuestionCard key={q.num} q={q} />
          ))}
        </div>

        <div
          className="mt-[2vh] rounded-[0.4vw] px-[2vw] py-[1.5vh] font-display italic text-[1.25vw] leading-[1.4] text-bg"
          style={{ background: "var(--slide-primary)" }}
        >
          <span className="font-mono uppercase tracking-[0.22em] text-[0.9vw] not-italic opacity-80 mr-[1vw]">
            The default
          </span>
          A default no protects the bet. A default yes protects the loose-end
          trap. Pick the one you want to win this year.
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ q }: { q: Question }) {
  return (
    <div
      className="rounded-[0.4vw] p-[1.5vw] flex gap-[1vw] items-start"
      style={{ background: "var(--slide-paper)" }}
    >
      <div className="shrink-0">
        <div
          className="w-[2.4vw] h-[2.4vw] rounded-[0.3vw] border-[0.18vw] flex items-center justify-center"
          style={{ borderColor: "var(--slide-accent)" }}
        >
          <span className="font-mono text-[1vw] text-accent font-semibold">
            {q.num}
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-display text-[1.45vw] text-primary font-medium leading-tight mb-[1vh]">
          {q.prompt}
        </div>
        <div className="grid grid-cols-2 gap-[0.8vw]">
          <div>
            <div className="font-mono uppercase tracking-[0.22em] text-[0.72vw] font-semibold mb-[0.3vh] text-primary">
              Passes when
            </div>
            <div className="font-body text-[0.88vw] text-text leading-[1.4]">
              {q.passes}
            </div>
          </div>
          <div>
            <div
              className="font-mono uppercase tracking-[0.22em] text-[0.72vw] font-semibold mb-[0.3vh]"
              style={{ color: "var(--slide-accent)" }}
            >
              Fails when
            </div>
            <div className="font-body text-[0.88vw] text-muted leading-[1.4]">
              {q.fails}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
