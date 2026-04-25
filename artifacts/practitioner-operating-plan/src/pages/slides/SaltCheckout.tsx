type CartItem = {
  name: string;
  variant: string;
  qty: number;
  price: string;
};

const cart: CartItem[] = [
  { name: "Parr's Jars · Wild Lake Salt", variant: "150g · sea salt blend", qty: 2, price: "$28.00" },
  { name: "Parr's Jars · Smoked Cedar Salt", variant: "150g · finishing", qty: 1, price: "$16.00" },
  { name: "Custom label add-on", variant: "wedding · 60 jars", qty: 0, price: "—" },
];

export default function SaltCheckout() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[5vw] py-[4vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[2vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              VIII · 04 — Storefront checkout
            </div>
            <h2
              className="font-display text-[3.4vw] leading-[1] tracking-tight text-primary font-medium"
              style={{ textWrap: "balance" }}
            >
              "Ships in the next batch."
              <span className="italic font-normal text-accent"> Date is dynamic. The "2 days" promise is gone.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[28vw] font-body text-[1vw] text-muted leading-[1.4]">
            The customer sees the same date the OM sets in Shopify, in three
            places: the sitewide banner, the cart drawer, and the checkout
            shipping line.{" "}
            <span className="text-primary font-semibold">
              No "ships in 2 days" copy survives anywhere on the salt site.
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-[1.05fr_1fr] gap-[1.4vw] min-h-0">
          {/* Storefront mockup */}
          <div className="flex flex-col gap-[0.8vh] min-h-0">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold">
              Storefront mockup · parrsjars.ca
            </div>
            <div
              className="rounded-[0.4vw] flex-1 flex flex-col min-h-0 overflow-hidden border"
              style={{ background: "#fdfaf2", borderColor: "var(--slide-rule)" }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-[0.4vw] px-[0.8vw] py-[0.5vh] border-b"
                style={{ background: "#efe7d2", borderColor: "var(--slide-rule)" }}
              >
                <span className="w-[0.55vw] h-[0.55vw] rounded-full" style={{ background: "#d4a373" }} />
                <span className="w-[0.55vw] h-[0.55vw] rounded-full" style={{ background: "#c9b487" }} />
                <span className="w-[0.55vw] h-[0.55vw] rounded-full" style={{ background: "#a89968" }} />
                <span className="ml-[0.6vw] font-mono text-[0.7vw] text-muted">parrsjars.ca / cart</span>
              </div>

              {/* Sitewide banner */}
              <div
                className="px-[1vw] py-[0.6vh] font-mono uppercase tracking-[0.18em] text-[0.7vw] text-center"
                style={{ background: "var(--slide-primary)", color: "#f4ede0" }}
              >
                One batch a month · Next batch ships Friday, Apr 24, 2026
              </div>

              {/* Cart body */}
              <div className="px-[1.2vw] py-[1vh] flex-1 flex flex-col min-h-0">
                <div className="font-display text-[1.3vw] text-primary font-semibold mb-[0.6vh]">
                  Your cart (3 items)
                </div>
                <table className="w-full text-[0.8vw] font-body" style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    {cart.filter((c) => c.qty > 0).map((c) => (
                      <tr key={c.name} className="border-t" style={{ borderColor: "var(--slide-rule)" }}>
                        <td className="py-[0.5vh] pr-[0.5vw]">
                          <div className="font-semibold text-text">{c.name}</div>
                          <div className="text-muted text-[0.72vw]">{c.variant}</div>
                        </td>
                        <td className="py-[0.5vh] pr-[0.5vw] text-center font-mono text-text">×{c.qty}</td>
                        <td className="py-[0.5vh] text-right font-mono text-text">{c.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Per-line ship promise — replaces the old "ships in 2 days" copy */}
                <div
                  className="mt-[0.8vh] rounded-[0.3vw] px-[0.8vw] py-[0.7vh] font-body text-[0.78vw] leading-[1.4]"
                  style={{ background: "#f4ede0", color: "#1f3d2e" }}
                >
                  <div className="font-semibold mb-[0.2vh]">Ships in the next batch · Friday, Apr 24, 2026</div>
                  <div className="text-muted">
                    We pack and ship one batch a month from the Dryden depot.
                    You'll get tracking the morning it leaves. Charged today,
                    held for the batch. Cancel any time before Friday.
                  </div>
                </div>

                <div className="mt-auto pt-[0.8vh] flex items-center justify-between border-t" style={{ borderColor: "var(--slide-rule)" }}>
                  <div className="font-body text-[0.78vw] text-muted">Subtotal · shipping calculated next</div>
                  <div className="font-display text-[1.3vw] text-primary font-semibold font-mono">$44.00</div>
                </div>
                <button
                  className="mt-[0.6vh] py-[0.7vh] rounded-[0.3vw] font-mono uppercase tracking-[0.2em] text-[0.78vw] font-semibold"
                  style={{ background: "var(--slide-primary)", color: "#f4ede0" }}
                >
                  Continue to checkout →
                </button>
              </div>
            </div>
          </div>

          {/* Where the date lives + what's banned */}
          <div className="flex flex-col gap-[1vh] min-h-0">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold">
              How the date stays in sync
            </div>
            <div
              className="rounded-[0.4vw] p-[1.1vw]"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="grid grid-cols-[auto_1fr] gap-x-[0.8vw] gap-y-[0.5vh] font-body text-[0.85vw] leading-[1.4]">
                <div className="font-mono text-accent text-[0.78vw] pt-[0.1vh]">01</div>
                <div>
                  OM sets <span className="font-mono text-primary">salt.next_batch_ship</span>{" "}
                  metafield in Shopify on the first Mon of each batch cycle (and again immediately on a slip).
                </div>
                <div className="font-mono text-accent text-[0.78vw] pt-[0.1vh]">02</div>
                <div>
                  Theme reads the metafield and renders it in the sitewide
                  banner, on every product page, and in the cart line above.
                </div>
                <div className="font-mono text-accent text-[0.78vw] pt-[0.1vh]">03</div>
                <div>
                  Shopify catalog sync feeds the same value into Klaviyo as
                  profile property <span className="font-mono text-primary">next_batch_ship</span>{" "}
                  for the two emails on the previous slide.
                </div>
                <div className="font-mono text-accent text-[0.78vw] pt-[0.1vh]">04</div>
                <div>
                  Order confirmation email and the post-purchase page both
                  pull from the same source — no copy lives anywhere else.
                </div>
              </div>
            </div>

            <div
              className="rounded-[0.4vw] p-[1.1vw]"
              style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
            >
              <div
                className="font-mono uppercase tracking-[0.22em] text-[0.78vw] font-semibold mb-[0.5vh]"
                style={{ color: "#e9c8a8" }}
              >
                Banned site-wide
              </div>
              <div className="font-body text-[0.85vw] leading-[1.45]">
                <span className="font-semibold">"Ships in 2 days"</span>,{" "}
                <span className="font-semibold">"In stock — order now"</span>,{" "}
                any countdown timer, any "fast shipping" badge. The product
                template is forked from the old DTC theme with these copy
                blocks deleted, not hidden.
              </div>
            </div>

            <div
              className="rounded-[0.4vw] p-[1.1vw] flex-1 min-h-0"
              style={{ background: "var(--slide-paper)" }}
            >
              <div className="font-mono uppercase tracking-[0.22em] text-[0.78vw] text-accent font-semibold mb-[0.5vh]">
                If the metafield is empty
              </div>
              <div className="font-body text-[0.85vw] text-text leading-[1.45]">
                The theme falls back to{" "}
                <span className="font-semibold text-primary">"Ships in the next monthly batch — date posted by Monday"</span>{" "}
                and the Add-to-cart button stays enabled. The OM gets a Slack
                ping every Monday at 9:00 ET if the metafield isn't set for
                the current cycle. No silent stale dates, ever.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
