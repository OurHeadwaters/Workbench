import { useKitAccess } from "@/lib/useKitAccess";
import { type StoredKitToken } from "@/lib/kitTokens";

const EVERGREEN = "#1f3d2e";
const CREAM = "#f4ede0";
const CREAM_DARK = "#ece3d4";
const INK = "#2c2c2c";
const MUTED = "#6b6b5e";
const FOREST = "#4a6741";

const GOODBYE_KIT_BUY_URL = "https://buy.stripe.com/28E7sNd4N399egs6fNbwk08";
const GOODBYE_KIT_ID = "goodbye-kit";

const DELIVERABLES = [
  {
    title: "Zone 0 Household Transition Framework",
    desc: "How to move a food system, not just boxes. Covers pantry documentation, what travels safely, what gets used down, and what order to do it in so nothing is wasted.",
    color: EVERGREEN,
  },
  {
    title: "Family Lifecycle Inventory",
    desc: "What to keep, what to pass on, what to let go. A structured worksheet for working through the physical and emotional weight of a household transition.",
    color: FOREST,
  },
  {
    title: "Passing It Forward Guide",
    desc: "Transferring homestead knowledge and food systems to the next generation — the recipes, the practices, the source relationships, and the seasonal rhythms that don't fit in a box.",
    color: "#5a7a50",
  },
  {
    title: "Northern Household Closing Checklist",
    desc: "Built for northern Ontario realities — climate, distance from supply, seasonal timing, and the specific pressures of closing a food-producing household in a place hours from everything.",
    color: "#3d5c34",
  },
];

function BuyerBanner({ buyerToken }: { buyerToken: StoredKitToken }) {
  const expiryDate = new Date(buyerToken.expiresAt).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        background: EVERGREEN,
        padding: "0.85rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span style={{ color: "#a8d4b0", fontSize: "1rem" }}>✓</span>
        <span style={{ fontSize: "0.82rem", color: "#d0ead4" }}>
          You own this kit, {buyerToken.buyerName}. Active until {expiryDate}.
        </span>
      </div>
      <a
        href={`/kits/access/${buyerToken.token}`}
        style={{
          display: "inline-block",
          background: CREAM,
          color: EVERGREEN,
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          padding: "0.4rem 0.9rem",
          borderRadius: 5,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        Access your kit →
      </a>
    </div>
  );
}

function BuyCTA({ buyerToken }: { buyerToken: StoredKitToken | null }) {
  if (buyerToken) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        <a
          href={`/kits/access/${buyerToken.token}`}
          style={{
            display: "inline-block",
            background: EVERGREEN,
            color: CREAM,
            fontWeight: 800,
            fontSize: "1.05rem",
            letterSpacing: "0.04em",
            padding: "0.9rem 2.5rem",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          Open your kit →
        </a>
        <p style={{ fontSize: "0.72rem", color: MUTED, margin: 0 }}>
          You already own this kit
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <a
        href={GOODBYE_KIT_BUY_URL}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          background: EVERGREEN,
          color: CREAM,
          fontWeight: 800,
          fontSize: "1.05rem",
          letterSpacing: "0.04em",
          padding: "0.9rem 2.5rem",
          borderRadius: 6,
          textDecoration: "none",
        }}
      >
        Get the Goodbye Kit — $27 CAD →
      </a>
      <p style={{ fontSize: "0.72rem", color: MUTED, margin: 0 }}>
        Digital download · Delivered by email · Print-ready PDFs
      </p>
      <a
        href="/kits/resend"
        style={{ fontSize: "0.72rem", color: MUTED, textDecoration: "none" }}
      >
        Already purchased? Re-send your access link →
      </a>
    </div>
  );
}

export function GoodbyeKitPage() {
  const { storedToken: buyerToken } = useKitAccess(GOODBYE_KIT_ID);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: CREAM,
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        color: INK,
      }}
    >
      {buyerToken && <BuyerBanner buyerToken={buyerToken} />}

      {/* Hero */}
      <div
        style={{
          background: EVERGREEN,
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#a8d4b0",
            fontWeight: 700,
            marginBottom: "1.25rem",
          }}
        >
          Headwaters · Wabigoon, Ontario
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            color: CREAM,
            margin: "0 auto 1.1rem",
            maxWidth: 660,
          }}
        >
          The Goodbye Kit
        </h1>
        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            color: "#c8deca",
            maxWidth: 500,
            margin: "0 auto 0.75rem",
            lineHeight: 1.7,
          }}
        >
          The household transition guide — closing one chapter, opening the next with intention.
        </p>
        <p
          style={{
            fontSize: "0.82rem",
            color: "#9abfa0",
            fontStyle: "italic",
            marginBottom: "2.75rem",
          }}
        >
          Four print-ready PDFs · $27 CAD · Delivered to your inbox
        </p>

        <BuyCTA buyerToken={buyerToken} />
      </div>

      {/* Origin */}
      <div
        style={{
          background: CREAM_DARK,
          padding: "3rem 1.5rem",
          borderBottom: `1px solid #d8cfbf`,
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: FOREST,
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Why this kit exists
          </p>
          <p
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.12rem)",
              lineHeight: 1.8,
              color: INK,
            }}
          >
            Not every Headwaters resource is about building up. Sometimes the work is knowing how
            to close something well — a household, a season, a chapter. The Goodbye Kit is for
            that. For the move that's been decided. For the home that's being handed off. For the
            moment when the question isn't how to grow more, but how to leave well.
          </p>
        </div>
      </div>

      {/* What's in it */}
      <div style={{ padding: "3.5rem 1.5rem", maxWidth: 800, margin: "0 auto" }}>
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: FOREST,
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          What's in it
        </p>
        <h2
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "clamp(1.3rem, 3vw, 1.7rem)",
            fontWeight: 800,
            color: EVERGREEN,
            marginBottom: "1rem",
          }}
        >
          Four documents. One complete closing framework.
        </h2>
        <p style={{ color: MUTED, lineHeight: 1.75, fontSize: "0.92rem", marginBottom: "2.5rem", maxWidth: 600 }}>
          Everything is delivered as print-ready PDFs in your confirmation email — no account
          required, no portal to log into. Print them, fill them in, share the relevant pages
          with the people helping you close.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {DELIVERABLES.map((item) => (
            <div
              key={item.title}
              style={{
                background: "white",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(31,61,46,0.07)",
                borderLeft: `4px solid ${item.color}`,
                padding: "1.4rem 1.5rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: EVERGREEN,
                  marginBottom: "0.5rem",
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: MUTED, fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          background: CREAM_DARK,
          borderTop: `1px solid #d8cfbf`,
          padding: "3.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
            fontWeight: 700,
            color: EVERGREEN,
            marginBottom: "0.6rem",
          }}
        >
          Ready to close well?
        </p>
        <p style={{ color: MUTED, fontSize: "0.88rem", marginBottom: "2rem", lineHeight: 1.65 }}>
          $27 CAD. No subscription. No account. Just the tools to do it right.
        </p>
        <BuyCTA buyerToken={buyerToken} />
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "2rem 1.5rem",
          textAlign: "center",
          borderTop: `1px solid #d8cfbf`,
        }}
      >
        <p style={{ fontSize: "0.72rem", color: MUTED, margin: "0 0 0.35rem" }}>
          Headwaters Development Services · Wabigoon, Ontario
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <a href="/" style={{ fontSize: "0.72rem", color: MUTED, textDecoration: "none" }}>
            ourheadwaters.ca
          </a>
          <a href="/privacy" style={{ fontSize: "0.72rem", color: MUTED, textDecoration: "none" }}>
            Privacy
          </a>
          <a href="/kits/resend" style={{ fontSize: "0.72rem", color: MUTED, textDecoration: "none" }}>
            Re-send access link
          </a>
        </div>
      </div>
    </div>
  );
}
