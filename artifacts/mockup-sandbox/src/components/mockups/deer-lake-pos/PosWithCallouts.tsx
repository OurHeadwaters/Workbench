import { Pos } from "./Pos";
import "./_group.css";

const CALLOUTS: { title: string; body: string }[] = [
  {
    title: "Day-1 readability",
    body: "Plain category names a brand-new hire knows on sight (Grocery, Dairy, Frozen, Household, Hot Food, Tobacco). Whole-tile tap targets, no tiny buttons, no hidden gestures.",
  },
  {
    title: "Touch targets ≥ 60 px",
    body: "Every primary control on the cashier path — PIN keys, item tiles, cart qty +/−, payment buttons, cash quick-amounts, numpad, manager keypad — clears the 60 px floor for arm's-length tablet use.",
  },
  {
    title: "Calm operational tone",
    body: "Boreal green / cream / brick palette and IBM Plex type. Reads like an IKEA self-checkout or hospital kiosk, not a consumer app. Status info is monospace and quiet.",
  },
  {
    title: "Offline mode",
    body: "Tap the Online pill in the top bar to simulate satellite link loss. The bar turns amber and a strip reassures the cashier: \"Sales saved locally — will sync when satellite link is back.\"",
  },
  {
    title: "Community Account",
    body: "First-class payment method alongside Cash, Debit, and Credit — surfaces the band ledger workflow without burying it in a sub-menu.",
  },
  {
    title: "Manager override",
    body: "Visible top-bar affordance with its own PIN modal. Refunds, voids, and price overrides are accessible but never sit in the cashier's primary tap path.",
  },
  {
    title: "Northern realism",
    body: "Seed inventory and pricing reflect a fly-in store: Robin Hood flour 10 kg, Carnation evap, Klik, Tang, Kraft Dinner, fresh produce flown in weekly with a freight flag, frozen meat. Cart footer notes freight is included in the line price.",
  },
  {
    title: "Tax handling",
    body: "Sales display \"status card on file — exempt\" so the till makes the band-member tax exemption visible at every sale, instead of hiding it in a settings screen.",
  },
];

export function PosWithCallouts() {
  return (
    <div
      style={{
        background: "#e7dfd0",
        minHeight: "100vh",
        padding: 24,
        fontFamily: "var(--pos-font-sans)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1280px 380px",
          gap: 24,
          alignItems: "start",
          margin: "0 auto",
          maxWidth: 1720,
        }}
      >
        {/* Left: tablet-framed POS */}
        <div>
          <div
            style={{
              fontFamily: "var(--pos-font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#5a5544",
              marginBottom: 8,
            }}
          >
            Staff POS — Day 1 Ready · 1280 × 800 landscape tablet
          </div>
          <div
            style={{
              background: "#1f3d2e",
              padding: 16,
              borderRadius: 24,
              boxShadow: "0 24px 60px rgba(31,61,46,0.25), 0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: 1280,
                height: 800,
                background: "#f4ede0",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <Pos />
            </div>
          </div>
        </div>

        {/* Right: callouts panel */}
        <aside
          style={{
            background: "#f4ede0",
            border: "1px solid #d8cdb6",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 12px 30px rgba(31,61,46,0.10)",
            position: "sticky",
            top: 24,
          }}
          aria-label="Design callouts"
        >
          <div
            style={{
              fontFamily: "var(--pos-font-mono)",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#7a6f55",
              marginBottom: 6,
            }}
          >
            Deer Lake First Nation · General Store
          </div>
          <h1
            style={{
              fontFamily: "var(--pos-font-sans)",
              fontSize: 22,
              fontWeight: 600,
              color: "#1f3d2e",
              lineHeight: 1.15,
              margin: 0,
              marginBottom: 4,
            }}
          >
            Staff POS — Day 1 ready
          </h1>
          <div
            style={{
              fontSize: 13,
              color: "#2a2a1f",
              marginBottom: 14,
              lineHeight: 1.55,
              padding: "12px 14px",
              background: "#ebe2cf",
              borderLeft: "3px solid #1f3d2e",
              borderRadius: "0 6px 6px 0",
            }}
          >
            <strong style={{ color: "#1f3d2e" }}>Design brief.</strong> A
            calm, big-button POS sized for a 10–15&quot; landscape tablet so a
            day-1 cashier can run the till without training: plain-language
            categories, whole-tile tap targets ≥ 60 px, an always-visible cart,
            one big <em>Pay</em> button, four equally-weighted payment methods
            including the band&apos;s Community Account, a quick-amount cash
            tender pad, and an offline strip that reassures staff sales are
            saved locally when the satellite link drops. Manager override sits
            in the top bar, never in the cashier&apos;s primary path. Boreal
            green / cream / brick palette and IBM Plex type read as serious
            operational tooling — closer to an IKEA self-checkout than a
            consumer app.
          </div>
          <div
            style={{
              fontFamily: "var(--pos-font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#7a6f55",
              marginBottom: 10,
            }}
          >
            Detail
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {CALLOUTS.map((c, i) => (
              <div
                key={c.title}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    background: "#1f3d2e",
                    color: "#f4ede0",
                    fontFamily: "var(--pos-font-mono)",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1f3d2e",
                      marginBottom: 2,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#4a4a3a",
                      lineHeight: 1.5,
                    }}
                  >
                    {c.body}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid #d8cdb6",
              marginTop: 18,
              paddingTop: 14,
              fontFamily: "var(--pos-font-mono)",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#7a6f55",
            }}
          >
            UI mockup only · No real Square plumbing · Inventory & cashier are
            seeded for demo
          </div>
        </aside>
      </div>
    </div>
  );
}
