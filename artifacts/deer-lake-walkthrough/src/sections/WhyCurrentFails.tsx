import { Reveal } from "@/components/Reveal";

const base = import.meta.env.BASE_URL;

/**
 * Why the current store fails. Per the spec: one image, one line, all
 * numbers behind a tap. The boreal landscape sits as a wide hero up top,
 * a single sentence sits beneath, and the comparison numbers wait inside
 * the Reveal so the page can be looked at without being read.
 */
export default function WhyCurrentFails() {
  return (
    <section
      id="why-current-fails"
      className="w-full scroll-mt-20"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] flex flex-col">
        <div className="relative w-full pt-10" aria-hidden={false}>
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "16 / 11",
              background: "var(--color-primary)",
            }}
          >
            <img
              src={`${base}hero-boreal.png`}
              alt="A single road cutting through frozen boreal forest under a flat winter sky — the only way into Deer Lake when the road is open"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 45%" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,46,38,0) 60%, rgba(20,46,38,0.55) 100%)",
              }}
            />
          </div>
        </div>

        <div className="px-6 pt-7 pb-16">
          <div
            className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Why the current store fails
          </div>

          <h2
            className="serif font-medium text-[30px] leading-[1.15]"
            style={{ color: "var(--color-primary)", textWrap: "balance" }}
          >
            One store. No other choice.
          </h2>

          <p
            className="serif italic text-[20px] leading-[1.45] mt-4 max-w-md"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Most of the federal grocery help never reaches the shelf.
          </p>

          <div className="mt-9 space-y-3">
            <Reveal label="See the numbers">
              <p>
                A family of four spends{" "}
                <span className="font-semibold">$1,680 a month</span> on
                groceries here. Down south, that same basket is{" "}
                <span className="font-semibold">$1,000</span>.
              </p>
              <p>
                Of every federal grocery help dollar, the store keeps{" "}
                <span className="font-semibold">42¢</span>. Only{" "}
                <span className="font-semibold">58¢</span> reaches the shelf.
              </p>
              <p>
                <span className="font-semibold">87 of every 100</span> fly-in
                First Nations in Ontario have just one grocery store. Deer
                Lake is one of them.
              </p>
              <p>
                <span className="font-semibold">$1.6 to $2.0 million</span>{" "}
                leaves Deer Lake every year — spent in Winnipeg, or kept by
                the one store in town.
              </p>
              <p
                className="mono text-[12px] uppercase tracking-[0.16em] mt-3"
                style={{ color: "var(--color-muted)" }}
              >
                Source · Nutrition North annual reports · Statistics Canada
              </p>
            </Reveal>

            <Reveal label="Why the southern playbook fails up here">
              <p>
                Northern stores are usually run by southern playbooks: hire
                one manager, schedule full-time shifts, run hours of service
                the way a Mississauga grocery does.
              </p>
              <p>
                None of those rules survive a -40°C winter, a closed winter
                road, or a community that bends around funerals and hunting
                season.
              </p>
              <p>The store that works up here is built the other way around.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
