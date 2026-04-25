export default function HiringITTech() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4.5vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2.2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[0.95vw] text-muted mb-[0.8vh]">
              III · Hiring 03 — IT/Tech
            </div>
            <h2
              className="font-display text-[3.2vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              One person who can run the rack
              <span className="italic font-normal text-accent"> and unjam the printer.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[26vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] text-muted mb-[0.4vh]">
              Target hire
            </div>
            <div className="font-display text-[1.4vw] text-primary leading-tight font-medium">
              6–10 weeks to start
            </div>
            <div className="font-body text-[0.95vw] text-muted mt-[0.4vh] leading-[1.4]">
              Northern-Ontario MSPs and Lakehead/Confederation grads — the
              search is wider than the local-hire roles.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Where to source — wider net than the local hires">
            <Row><b>Highest yield:</b> existing northern-Ontario MSPs with one full-stack generalist who wants to leave shared support and own a real stack.</Row>
            <Row>Lakehead, Confederation, and Sault College CS / network-tech grads with co-op time. New grads who self-host are the right shape.</Row>
            <Row>Self-hosting / homelab communities (r/selfhosted, r/homelab, GrapheneOS user forums). The people who already run servers for fun.</Row>
            <Row>Linux SRE / DevOps freelancers in Thunder Bay, Sudbury, Winnipeg open to a 0.6–0.8 FTE retainer with field travel.</Row>
            <Row>Last resort, not first: large MSPs. They'll quote enterprise rates and ship a different junior every visit. Walk away.</Row>
          </Section>

          <Section title="Screening questions">
            <Row>Walk me through the last server you stood up — bare metal or VM, OS, what it runs, how you back it up.</Row>
            <Row>A councillor's privacy phone won't connect to the dashboard. Talk me through the first 15 minutes.</Row>
            <Row>What's your documentation discipline? Show me a runbook you've written that someone else has actually used.</Row>
            <Row>Comfort with a quarterly fly-in to Deer Lake — and helping the OM unjam a label printer in Dryden the same week?</Row>
            <Row>Pager rotation: are you OK being the one phone that rings when a server's down at 11pm on a Tuesday?</Row>
          </Section>
        </div>

        <div className="grid grid-cols-2 gap-[1.2vw] mb-[1.4vh]">
          <Section title="Paid trial structure — one week, two deliverables">
            <Row><b>Day 1–2.</b> Stand up a single self-hosted service (price dashboard staging) on supplied hardware. Document as you go.</Row>
            <Row><b>Day 3–4.</b> Triage a deliberately misconfigured GrapheneOS phone + a flaky office switch. Note what they touch and what they leave alone.</Row>
            <Row><b>Day 5.</b> Hand back: a working service, a runbook the OM can follow, and a written triage log. No runbook = no hire.</Row>
            <Row>Trial paid at the going day rate — $600–$900/day depending on level. Not "show us your portfolio for free."</Row>
          </Section>

          <Section title="Walk away if…" tone="danger">
            <Row>Enterprise-only background with no field comfort. The store is not a corporate office.</Row>
            <Row>Won't write down what they did. The whole point is a deployment checklist that survives the first reserve.</Row>
            <Row>Treats the privacy phones as a downgrade rather than the spec. Surveillance-capitalism stack is not the deal here.</Row>
            <Row>"I don't really do printers." The role is the rack and the printer, in the same week.</Row>
            <Row>Won't take pager rotation, or wants every after-hours call billable on top of the retainer.</Row>
          </Section>
        </div>

        <ThirtySixtyNinety
          d30="Inventory of the existing stack, baseline monitoring up, written runbook for the price-dashboard service, and a triage log live."
          d60="Servers + GrapheneOS phones in the field, dashboard public, documented backup and restore drill completed once with the OM watching."
          d90="The OM can recover the most common failures from the runbook alone. The IT/Tech is the second call, not the first, for everything except true infra."
        />
      </div>
    </div>
  );
}

function Section({
  title,
  tone,
  children,
}: {
  title: string;
  tone?: "danger";
  children: React.ReactNode;
}) {
  const isDanger = tone === "danger";
  return (
    <div
      className="rounded-[0.4vw] p-[1.2vw] flex flex-col"
      style={{ background: "var(--slide-paper)" }}
    >
      <div
        className="font-mono uppercase tracking-[0.22em] text-[0.85vw] font-semibold mb-[0.9vh]"
        style={{ color: isDanger ? "var(--slide-primary)" : "var(--slide-accent)" }}
      >
        {title}
      </div>
      <div className="space-y-[0.7vh] font-body text-[0.95vw] leading-[1.4] text-text">
        {children}
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-[0.7vw]">
      <div className="text-accent font-semibold w-[0.9vw] shrink-0">→</div>
      <div>{children}</div>
    </div>
  );
}

function ThirtySixtyNinety({
  d30,
  d60,
  d90,
}: {
  d30: string;
  d60: string;
  d90: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-[1.2vw]">
      <DayCard label="Day 30" body={d30} />
      <DayCard label="Day 60" body={d60} />
      <DayCard label="Day 90" body={d90} accent />
    </div>
  );
}

function DayCard({
  label,
  body,
  accent,
}: {
  label: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-[0.4vw] p-[1.1vw]"
      style={
        accent
          ? { background: "var(--slide-primary)", color: "var(--slide-bg)" }
          : { background: "var(--slide-paper)" }
      }
    >
      <div
        className="font-mono uppercase tracking-[0.22em] text-[0.8vw] mb-[0.3vh]"
        style={{ color: accent ? "#e9c8a8" : "var(--slide-muted)" }}
      >
        {label}
      </div>
      <div
        className="font-body text-[0.95vw] leading-[1.4]"
        style={accent ? { opacity: 0.9 } : undefined}
      >
        {body}
      </div>
    </div>
  );
}
