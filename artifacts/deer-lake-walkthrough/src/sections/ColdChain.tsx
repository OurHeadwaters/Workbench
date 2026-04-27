import { Reveal } from "@/components/Reveal";

/**
 * The cold-chain route. Hero line is the route itself; the supporting
 * cards explain how each lane works without crowding the page.
 */
export default function ColdChain() {
  return (
    <div
      className="min-h-full w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[36rem] px-6 pt-24 pb-32 flex flex-col">
      <div
        className="mono text-[11px] uppercase tracking-[0.22em] mb-3"
        style={{ color: "var(--color-accent-warm)" }}
      >
        How groceries get here
      </div>
      <h2
        className="serif font-medium text-[34px] leading-[1.1]"
        style={{ color: "var(--color-primary)", textWrap: "balance" }}
      >
        Three ways in.
        <span
          className="italic font-normal block mt-2"
          style={{ color: "var(--color-accent-warm)" }}
        >
          One shelf, planned out carefully.
        </span>
      </h2>

      <div className="mt-7 space-y-4">
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-rule)",
          }}
        >
          <div
            className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Way 1 · The truck already on the road
          </div>
          <div
            className="serif text-[20px] leading-[1.25] font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            Thunder Bay → Sioux Lookout → Dryden
          </div>
          <p
            className="serif text-[16px] leading-[1.5] mt-2"
            style={{ color: "var(--color-text)" }}
          >
            A family-run cold truck. Already on this road every two weeks.
            Deer Lake joins the route in May 2026.
          </p>
        </div>

        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-rule)",
          }}
        >
          <div
            className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Way 2 · The winter-road truck we add
          </div>
          <div
            className="serif text-[20px] leading-[1.25] font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            Dryden → Deer Lake (winter road)
          </div>
          <p
            className="serif text-[16px] leading-[1.5] mt-2"
            style={{ color: "var(--color-text)" }}
          >
            A second truck for the winter road. Funded by the federal Local
            Food Infrastructure Fund. Kept separate on purpose. If one truck
            breaks down, the other still runs.
          </p>
        </div>

        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "var(--color-paper)",
            borderColor: "var(--color-rule)",
          }}
        >
          <div
            className="mono text-[10.5px] uppercase tracking-[0.18em] mb-1"
            style={{ color: "var(--color-accent-warm)" }}
          >
            Way 3 · Plane when the road is closed
          </div>
          <div
            className="serif text-[20px] leading-[1.25] font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            Flown in (April to November)
          </div>
          <p
            className="serif text-[16px] leading-[1.5] mt-2"
            style={{ color: "var(--color-text)" }}
          >
            Wasaya, Bearskin, and North Star Air. Extra stock on the shelf
            covers the gap weeks.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Reveal label="What's on the shelf" variant="ink">
          <p>
            <span className="font-semibold">Local first.</span> Food from
            Deer Lake itself goes on the shelf first. People know it comes
            from home.
          </p>
          <p>
            <span className="font-semibold">Regional next.</span> Slate River
            Dairy, Thunder Oak, Belluz, Sleepy G. Eggs, meat, and baked goods
            on the same route.
          </p>
          <p>
            <span className="font-semibold">Big brands direct.</span> Sysco,
            Gordon Food Service, Federated Co-operatives. Big orders keep
            the price low.
          </p>
          <p>
            <span className="font-semibold">Northern household brands.</span>{" "}
            Robin Hood flour, Carnation, Klik, Tang, Kraft Dinner, Bimbo
            bread. The brands people already buy.
          </p>
        </Reveal>

        <Reveal label="How shipping shows up on the price tag">
          <p>
            The federal grocery help shows up on the price tag. Shipping
            cost is printed where you can see it.
          </p>
          <p>
            Items without help money show their shipping on the tag. People
            see what they pay for, and why.
          </p>
        </Reveal>
      </div>
      </div>
    </div>
  );
}
