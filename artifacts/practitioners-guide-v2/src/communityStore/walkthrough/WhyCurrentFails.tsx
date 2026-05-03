import { Reveal } from "../plannerReveal";

const base = import.meta.env.BASE_URL;

export default function WhyCurrentFails() {
  const stats = [
    { lead: "$1,680 vs $1,000", body: "What a family of four spends in a remote community, every month, vs the same basket down south." },
    { lead: "Only 58¢ on the dollar", body: "Of every federal grocery help dollar, just 58¢ reaches the shelf. The store keeps the rest." },
    { lead: "$1.6 to $2.0 million leaves", body: "Every year, that much grocery spend leaves the community — to the south, or to the one store in town." },
  ];

  return (
    <section id="cs-why-current-fails" className="w-full scroll-mt-20" style={{ background: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] flex flex-col">
        <div className="relative w-full pt-10">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 11", background: "var(--cs-primary)" }}>
            <img src={`${base}hero-boreal.png`} alt="A single road cutting through frozen boreal forest" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center 45%" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,46,38,0) 60%, rgba(20,46,38,0.55) 100%)" }} />
          </div>
        </div>
        <div className="px-6 pt-7 pb-16">
          <div className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color: "var(--cs-accent-warm)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Why the current store fails</div>
          <h2 className="text-[30px] leading-[1.15] font-medium" style={{ color: "var(--cs-primary)", textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>One store. No other choice.</h2>
          <p className="italic text-[20px] leading-[1.45] mt-4 max-w-md" style={{ color: "var(--cs-accent-warm)", fontFamily: "'Fraunces', Georgia, serif" }}>Most of the federal grocery help never reaches the shelf.</p>
          <div className="mt-7 space-y-3">
            {stats.map((s) => (
              <div key={s.lead} className="rounded-xl p-4 border" style={{ background: "var(--cs-paper)", borderColor: "var(--cs-rule)" }}>
                <div className="text-[19px] leading-[1.25] font-semibold" style={{ color: "var(--cs-primary)", fontFamily: "'Fraunces', Georgia, serif" }}>{s.lead}</div>
                <div className="text-[15.5px] leading-[1.45] mt-1.5" style={{ color: "var(--cs-text)", fontFamily: "'Fraunces', Georgia, serif" }}>{s.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <Reveal label="Where these numbers come from">
              <p><span className="font-semibold">87 of every 100</span> fly-in First Nations in Ontario have just one grocery store. The same pattern holds across the north.</p>
              <p className="text-[12px] uppercase tracking-[0.16em] mt-3" style={{ color: "var(--cs-muted)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>Source · Nutrition North annual reports · Statistics Canada</p>
            </Reveal>
            <Reveal label="Why the southern playbook fails up here">
              <p>Northern stores are usually run by southern playbooks: hire one manager, schedule full-time shifts, run hours of service the way a Mississauga grocery does.</p>
              <p>None of those rules survive a -40°C winter, a closed winter road, or a community that bends around funerals and hunting season.</p>
              <p>The store that works up here is built the other way around.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
