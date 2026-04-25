import { namingActions, type NamingAction } from "@/data/namingActions";

type Action = NamingAction;

const actions: Action[] = namingActions;

export default function NamingActionItems() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              III · 04 — What the founder does this week
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              Six items.
              <span className="italic font-normal text-accent"> Sequenced so nothing locks you in before clearance.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            Domains and email today. Trademark search this week. Agent opinion
            before any filing or printing. Then incorporate. In that order.
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-[1vw] gap-y-[1.1vh] min-h-0 content-start">
          {actions.map((a) => (
            <ActionRow key={a.num} a={a} />
          ))}
        </div>

        <div
          className="mt-[1.5vh] p-[1.2vw] rounded-[0.3vw] flex items-baseline justify-between gap-[2vw]"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div
            className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold shrink-0"
            style={{ color: "#e9c8a8" }}
          >
            The rule of sequence
          </div>
          <div
            className="font-display italic text-[1.25vw] leading-[1.35] text-right"
            style={{ color: "#f4ede0" }}
          >
            Buying domains doesn't lock you in. Filing a trademark does. Don't
            sequence those backwards.
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionRow({ a }: { a: Action }) {
  return (
    <div
      className="rounded-[0.4vw] p-[1.1vw] flex gap-[1vw] items-start"
      style={{ background: "var(--slide-paper)" }}
    >
      <div className="shrink-0 flex flex-col items-center pt-[0.2vh]">
        <div
          className="w-[1.6vw] h-[1.6vw] rounded-[0.2vw] border-[0.15vw] flex items-center justify-center"
          style={{ borderColor: "var(--slide-accent)" }}
        >
          <span className="font-mono text-[0.8vw] text-accent font-semibold">
            {a.num}
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-[1vw] mb-[0.3vh]">
          <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold">
            {a.when}
          </div>
          <div className="font-mono text-[0.78vw] text-muted shrink-0">
            {a.cost}
          </div>
        </div>
        <div className="font-display text-[1.15vw] text-primary font-medium leading-tight mb-[0.4vh]">
          {a.title}
        </div>
        <div className="font-body text-[0.88vw] text-text leading-[1.45]">
          {a.detail}
        </div>
        {a.link && (
          <div className="mt-[0.5vh]">
            <a
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.78vw] text-accent underline decoration-1 underline-offset-[0.25vh] hover:opacity-80"
            >
              {a.linkLabel ?? a.link}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
