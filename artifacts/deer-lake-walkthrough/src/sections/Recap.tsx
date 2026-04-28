/**
 * The recap. Built to fit on a single phone screen so the contractor can
 * screenshot it and send it. Tight typography, six rows compressed to a
 * label/value table, no Reveals — everything visible at once.
 *
 * Targeted height: ~720px (iPhone 12/13/14 portrait minus chrome).
 */
export default function Recap() {
  const rows: Array<[string, string]> = [
    ["What", "A second store. Headwaters' system. Band runs the floor."],
    ["Route", "Thunder Bay → Sioux Lookout → Dryden → Deer Lake. Two cold trucks."],
    ["Team", "17–20 jobs for Deer Lake people in two years."],
    ["Stays", "Public price page. Household lookup. Written guide for running it."],
    ["Ask", "$420k year one. Likely from band reserves, back-loaded against the cold-chain pilot."],
    ["Off-ramp", "Walk away in Nov 2026 with the truck route, the software, the people trained."],
  ];

  return (
    <section
      id="recap"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-14 pb-20 flex flex-col">
        <div
          className="mono text-[10.5px] uppercase tracking-[0.22em] mb-2"
          style={{ color: "var(--color-accent)" }}
        >
          The whole plan, on one screen
        </div>
        <h2
          className="serif font-medium text-[24px] leading-[1.15]"
          style={{ textWrap: "balance" }}
        >
          A second store. Run by Deer Lake.
          <br />
          Margin stays in Deer Lake.
        </h2>

        <div className="mt-5 space-y-2.5">
          {rows.map(([label, body]) => (
            <div key={label} className="grid grid-cols-[68px_1fr] gap-3">
              <div
                className="mono text-[10px] uppercase tracking-[0.18em] pt-1"
                style={{ color: "var(--color-accent)" }}
              >
                {label}
              </div>
              <div
                className="serif text-[14.5px] leading-[1.35]"
                style={{ color: "var(--color-bg)" }}
              >
                {body}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 pt-4 border-t"
          style={{ borderColor: "rgba(244,237,224,0.22)" }}
        >
          <p
            className="serif italic text-[14.5px] leading-[1.45]"
            style={{ color: "var(--color-accent)" }}
          >
            He flew in a slow circle.
            <br />
            Then he flew out of sight.
          </p>
        </div>
      </div>
    </section>
  );
}
