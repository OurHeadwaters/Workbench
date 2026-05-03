export default function Recap() {
  const rows: Array<[string, string]> = [
    ["What", "A community store. The band runs the floor. An operator couple on the cockpit."],
    ["System", "Square + QuickBooks + Local Line + the operator cockpit. Payroll stays small. Doors stay open. Truck stays on time."],
    ["Route", "Thunder Bay → Sioux Lookout → Dryden → community. Two cold trucks."],
    ["Back home", "~$125k–$200k of grocery margin stays in the community year one. 4 FT roles (contractor couple + the practitioner + distribution lead) + band casual pool of 15+ getting paid hours weekly."],
    ["Stays", "Public price page. Household lookup. Written guide for running it."],
    ["Ask", "Stage 1 — planning trial: $25,000 flat (8 weeks, practitioner solo). Stage 2 — practitioner $175/hr + distribution lead $70/hr, 160 hr/mo each: $39,200/mo + gas & insurance at cost. Band reserves. Most spending near the end, on the cold-chain pilot."],
    ["Off-ramp", "Walk away with the truck route, the software, the people trained."],
  ];

  return (
    <section id="cs-recap" className="w-full scroll-mt-20" style={{ background: "var(--cs-primary)", color: "var(--cs-bg)" }}>
      <div className="mx-auto max-w-[36rem] px-6 pt-14 pb-20 flex flex-col">
        <div className="text-[10.5px] uppercase tracking-[0.22em] mb-2" style={{ color: "var(--cs-accent)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>The whole plan, on one screen</div>
        <h2 className="text-[24px] leading-[1.15] font-medium" style={{ textWrap: "balance", fontFamily: "'Fraunces', Georgia, serif" }}>
          A community store. Run by the band.<br />Margin stays in the community.
        </h2>
        <div className="mt-5 space-y-2.5">
          {rows.map(([label, body]) => (
            <div key={label} className="grid grid-cols-[68px_1fr] gap-3">
              <div className="text-[10px] uppercase tracking-[0.18em] pt-1" style={{ color: "var(--cs-accent)", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>{label}</div>
              <div className="text-[14.5px] leading-[1.35]" style={{ color: "var(--cs-bg)", fontFamily: "'Fraunces', Georgia, serif" }}>{body}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t" style={{ borderColor: "rgba(244,237,224,0.22)" }}>
          <p className="italic text-[14.5px] leading-[1.45]" style={{ color: "var(--cs-accent)", fontFamily: "'Fraunces', Georgia, serif" }}>
            He flew in a slow circle.<br />Then he flew out of sight.
          </p>
        </div>
      </div>
    </section>
  );
}
