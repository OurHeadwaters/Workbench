const EVERGREEN = "#1f3d2e";
const RUST = "#b85a3e";
const CREAM = "#f4ede0";
const INK = "#2c2c2c";
const MUTED = "#6b6b5e";
const GOLD = "#c89a2e";

const CONVERTKIT_FORM_ACTION = "https://app.convertkit.com/forms/REPLACE_CONVERTKIT_FORM_ID/subscriptions";
const NORTHERN_PANTRY_URL = "/print-marketing/suite/northern-pantry";
const PRODUCTS_URL = "/headwaters/products";

const MANIFESTO = [
  "START WHERE YOU ARE",
  "USE WHAT YOU HAVE",
  "DO WHAT YOU CAN",
  "TRACK IT ALL",
  "GROW, BABY, GROW",
];

const products = [
  {
    name: "The 3-Layer Northern Pantry",
    price: "Free",
    desc: "A printable guide to Bobbie's three-zone pantry system — the jar kitchen, the standby room, and the 72-hour exit layer. Download and print.",
    href: NORTHERN_PANTRY_URL,
    cta: "Download free →",
    accent: EVERGREEN,
  },
  {
    name: "Zone 0 Starter Kit",
    price: "$17",
    desc: "The first thing to build — your active pantry. Printable worksheets, rotation tracker, and the Zone 0 method in plain language.",
    href: "https://buy.stripe.com/REPLACE_ZONE0_LINK",
    cta: "Get the kit →",
    accent: RUST,
  },
  {
    name: "Preparedness Pack",
    price: "$17",
    desc: "The second layer — dry storage, a working freezer system, and what to do when the road closes for three days.",
    href: "https://buy.stripe.com/REPLACE_PREP_PACK_LINK",
    cta: "Get the pack →",
    accent: RUST,
  },
  {
    name: "Jars & Scars",
    price: "$27",
    desc: "Eight chapters on building a real northern food life — the book Bobbie wished existed when she started.",
    href: "https://buy.stripe.com/REPLACE_JARS_SCARS_LINK",
    cta: "Get the book →",
    accent: "#4a6741",
  },
  {
    name: "Course 1 — Food Preservation & Canning",
    price: "$97",
    desc: "Ten sessions. Everything from your first pressure canner to running a small jar kitchen. The founding-edition price.",
    href: "https://buy.stripe.com/REPLACE_COURSE1_LINK",
    cta: "Join Course 1 →",
    accent: EVERGREEN,
  },
];

const SESSION_FLOW = [
  { step: "1", label: "Download", desc: "The free Northern Pantry printable — your three-zone map." },
  { step: "2", label: "Join the list", desc: "Get the weekly newsletter from the jar kitchen." },
  { step: "3", label: "Start Zone 0", desc: "The $17 Starter Kit. One week of practice." },
  { step: "4", label: "Go deeper", desc: "Course 1 when you're ready. Founding price: $97." },
];

const OBJECTIONS = [
  {
    q: "I've never heard of Parr's Jars.",
    a: "Good — that means you found this from someone who trusted you enough to share it. Parr's Jars has been running out of a jar kitchen in Wabigoon, Ontario since 2015. The 807 Food Co-op — which grew from the same kitchen — has moved over $147,000 through a community-owned channel in under three years. The work speaks.",
  },
  {
    q: "Why would I take advice from a Canadian woman I've never met?",
    a: "You wouldn't — not on faith alone. That's why everything here starts free. Download the Northern Pantry printable. Read the emails. If the system makes sense in your kitchen, the kit will make sense too. No subscription, no recurring charge, no pressure.",
  },
  {
    q: "Is this relevant to where I live?",
    a: "The three-layer system works anywhere you're more than 30 minutes from a grocery store. Bobbie built it in Northwestern Ontario — boreal, cold, remote. If anything, the northern framing makes it more conservative, not less. You can always adapt the specifics. The discipline doesn't change.",
  },
];

export function HeadwatersStartPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: CREAM,
        fontFamily: "var(--font-sans, Inter, sans-serif)",
      }}
    >
      {/* ── Hero ── */}
      <header style={{ background: EVERGREEN, padding: "3rem 1.5rem 2.5rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.5)",
              marginBottom: "0.75rem",
            }}
          >
            {/* BOBBIE: fill in — e.g. "Heard on The Survival Podcast · Episode [number]" */}
            Heard on The Survival Podcast · Parr's Jars · Wabigoon, Ontario
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(1.7rem, 5.5vw, 2.6rem)",
              fontWeight: 900,
              color: CREAM,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            {/* BOBBIE: if you know the specific hook Jack used in your episode, replace this with a direct callback */}
            The supply chain was never designed for where you live.
            <br />
            <span style={{ color: "#d4a017", fontStyle: "italic" }}>The jar kitchen was.</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(0.95rem, 2.6vw, 1.1rem)",
              color: "rgba(244,237,224,0.82)",
              lineHeight: 1.65,
              maxWidth: 540,
              marginBottom: "1.25rem",
            }}
          >
            I'm Bobbie Parr. I run a jar kitchen on a homestead in Wabigoon, Ontario — spring-fed
            well, manual pump, a garden built up from clay. What I built here scaled into the 807
            Food Co-op, $147,000 moved through a community-owned channel, and a consulting practice
            that now works with northern First Nations communities on food sovereignty.
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(0.9rem, 2.4vw, 1rem)",
              color: "rgba(244,237,224,0.6)",
              lineHeight: 1.6,
              maxWidth: 540,
            }}
          >
            If you followed a link from TSP, you're in the right place. Start with the free guide below.
          </p>
        </div>
      </header>

      {/* ── First-session flow ── */}
      <div style={{ background: RUST, padding: "1rem 1.5rem" }}>
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {SESSION_FLOW.map((s, i) => (
            <div key={s.step} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {s.step}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.72)",
                    fontStyle: "italic",
                  }}
                >
                  — {s.desc}
                </span>
              </div>
              {i < SESSION_FLOW.length - 1 && (
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.25rem" }}>

        {/* ── Manifesto ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              borderLeft: `4px solid ${RUST}`,
              paddingLeft: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            {MANIFESTO.map((line) => (
              <p
                key={line}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(0.78rem, 2vw, 0.88rem)",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: EVERGREEN,
                  lineHeight: 1.5,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </section>

        {/* ── Lead magnet box ── */}
        <section
          style={{
            background: "white",
            borderRadius: 8,
            borderTop: `4px solid ${GOLD}`,
            boxShadow: "0 1px 6px rgba(31,61,46,0.10)",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 700,
              marginBottom: "0.4rem",
            }}
          >
            Free Download
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
              fontWeight: 800,
              color: EVERGREEN,
              lineHeight: 1.15,
              marginBottom: "0.6rem",
            }}
          >
            The 3-Layer Northern Pantry
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.9rem",
              color: INK,
              lineHeight: 1.65,
              marginBottom: "0.5rem",
            }}
          >
            A single 8.5×11 printable covering the three zones of Bobbie's pantry system — the active
            jar kitchen, the standby room, and the 72-hour exit layer. Print it, put it on your
            fridge, and work through it one layer at a time.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 1.1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
            }}
          >
            {[
              "Layer 1 — The Jar Kitchen (Zone 0): active pantry + rotation discipline",
              "Layer 2 — The Standby Room (Zone 1): dry storage + freezer system",
              "Layer 3 — The 72-Hour Exit Layer: two packs + the Spirko Redundancy Rule",
            ].map((item) => (
              <li
                key={item}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  fontSize: "0.82rem",
                  color: MUTED,
                  lineHeight: 1.55,
                }}
              >
                <span style={{ color: GOLD, fontFamily: "var(--font-serif)", flexShrink: 0 }}>→</span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={NORTHERN_PANTRY_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              background: GOLD,
              color: "white",
              fontFamily: "var(--font-sans)",
              fontSize: "0.88rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "0.7rem 1.4rem",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Download free — print &amp; use today
          </a>
        </section>

        {/* ── Email signup ── */}
        <section
          style={{
            background: EVERGREEN,
            borderRadius: 8,
            padding: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.5)",
              fontWeight: 700,
              marginBottom: "0.4rem",
            }}
          >
            Stay in the Loop
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(1.05rem, 2.8vw, 1.3rem)",
              fontWeight: 800,
              color: CREAM,
              lineHeight: 1.2,
              marginBottom: "0.5rem",
            }}
          >
            Weekly from the jar kitchen.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.88rem",
              color: "rgba(244,237,224,0.72)",
              lineHeight: 1.6,
              marginBottom: "1.1rem",
            }}
          >
            One email a week — what's in season, what's in the jars, what's working. No noise.
            Unsubscribe any time.
          </p>
          {/* BOBBIE: replace REPLACE_CONVERTKIT_FORM_ID with your real ConvertKit form ID */}
          <form
            action={CONVERTKIT_FORM_ACTION}
            method="POST"
            style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}
          >
            <input
              type="email"
              name="email_address"
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                minWidth: 200,
                background: "rgba(244,237,224,0.12)",
                border: "1px solid rgba(244,237,224,0.25)",
                borderRadius: 6,
                padding: "0.65rem 0.9rem",
                color: CREAM,
                fontSize: "0.88rem",
                fontFamily: "var(--font-sans)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: RUST,
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "0.65rem 1.25rem",
                fontFamily: "var(--font-sans)",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Join the list
            </button>
          </form>
        </section>

        {/* ── Products preview ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: RUST,
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            What's available
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {products.map((p) => (
              <div
                key={p.name}
                style={{
                  background: "white",
                  borderRadius: 8,
                  boxShadow: "0 1px 4px rgba(31,61,46,0.07)",
                  borderLeft: `4px solid ${p.accent}`,
                  padding: "1rem 1.1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        color: EVERGREEN,
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: p.accent,
                      }}
                    >
                      {p.price}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: MUTED, lineHeight: 1.5 }}>
                    {p.desc}
                  </p>
                </div>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: p.accent,
                    color: "white",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    padding: "0.5rem 1rem",
                    borderRadius: 5,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <a
              href={PRODUCTS_URL}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                color: EVERGREEN,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              See full product descriptions →
            </a>
          </div>
        </section>

        {/* ── Backstory ── */}
        <section
          style={{
            background: "white",
            borderRadius: 8,
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 1px 4px rgba(31,61,46,0.07)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: MUTED,
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            How this started
          </p>
          <div
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "0.92rem",
              color: INK,
              lineHeight: 1.75,
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <p>
              The Ron Paul 2012 campaign was the first political thing I paid real attention to.
              Not because I'm a libertarian — I'm not — but because someone finally said out loud
              that the systems we depend on were built to serve other people's interests. I heard
              that and thought: what would it mean to actually be less dependent? Not as a political
              statement. Just as a practical question.
            </p>
            <p>
              We bought land in Wabigoon. Built up a garden from clay. Put in a spring-fed well with
              a manual pump — so when the power goes out, water still comes. Started canning because
              the surplus needed somewhere to go. The jar kitchen grew from there: if we're going to
              preserve food anyway, we might as well do it well enough to sell.
            </p>
            <p>
              {/* BOBBIE: fill in — if there's one specific story from the homestead that tested the system — a road closure, a power outage, a winter that proved the jars weren't optional — add it here. A specific moment lands harder than a summary. */}
              Parr's Jars became a business because the neighbours wanted what was in those jars. A
              few households pooling their orders became the 807 Food Co-op. A co-op that needed
              a management system became Headwaters. None of it was planned as a progression — it
              was just what happened when you take the problem seriously and don't stop.
            </p>
            <p>
              The work now extends to northern First Nations communities — places that have been paying
              fly-in grocery prices for a generation. The same discipline that built the jar kitchen
              scales to building a community-owned store. It's the same question, bigger radius.
            </p>
          </div>
        </section>

        {/* ── Objection handling ── */}
        <section style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: MUTED,
              fontWeight: 700,
              marginBottom: "0.85rem",
            }}
          >
            Fair questions
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {OBJECTIONS.map((o) => (
              <div
                key={o.q}
                style={{
                  borderLeft: `3px solid ${EVERGREEN}`,
                  paddingLeft: "1rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: EVERGREEN,
                    marginBottom: "0.35rem",
                    lineHeight: 1.4,
                  }}
                >
                  {o.q}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.88rem",
                    color: MUTED,
                    lineHeight: 1.65,
                  }}
                >
                  {o.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Social proof ── */}
        <section
          style={{
            background: EVERGREEN,
            borderRadius: 8,
            padding: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(244,237,224,0.5)",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            In numbers
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            {[
              { value: "$147,000+", label: "through the 807 Food Co-op channel" },
              { value: "142", label: "member households" },
              { value: "3,000+", label: "transactions in 27 months" },
              /* BOBBIE: fill in — years operating Parr's Jars, crate subscriber count, or other proof */
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                    fontWeight: 900,
                    color: CREAM,
                    lineHeight: 1,
                    marginBottom: "0.3rem",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.68rem",
                    color: "rgba(244,237,224,0.6)",
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          {/* BOBBIE: fill in — add one or two real customer quotes here. Format: quote + first name + city */}
          <div
            style={{
              borderTop: "1px solid rgba(244,237,224,0.15)",
              paddingTop: "1rem",
              fontFamily: "var(--font-serif)",
              fontSize: "0.88rem",
              fontStyle: "italic",
              color: "rgba(244,237,224,0.65)",
              lineHeight: 1.65,
            }}
          >
            {/* BOBBIE: replace this placeholder with a real quote. Something from a co-op member, a crate subscriber, or a TSP listener who reached out. */}
            "I didn't think a $17 kit would actually change how I think about my pantry. It did."
            <br />
            <span style={{ fontSize: "0.75rem", fontStyle: "normal", color: "rgba(244,237,224,0.4)" }}>
              — BOBBIE: replace with real name + city
            </span>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: `3px solid ${EVERGREEN}`,
          background: CREAM,
          padding: "1.75rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.82rem",
              color: MUTED,
              lineHeight: 1.65,
              marginBottom: "0.5rem",
            }}
          >
            Bobbie Parr · Parr's Jars · Headwaters Development Services · Wabigoon, Ontario
          </p>
          <a
            href="mailto:bobbie@ourheadwaters.ca"
            style={{ fontSize: "0.82rem", color: RUST, textDecoration: "none", fontWeight: 600 }}
          >
            bobbie@ourheadwaters.ca
          </a>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.7rem",
              color: MUTED,
              marginTop: "0.75rem",
              fontStyle: "italic",
              lineHeight: 1.55,
            }}
          >
            Water runs downhill. It doesn't ask permission. Build the channel — the rest follows.
          </p>
        </div>
      </footer>
    </div>
  );
}
