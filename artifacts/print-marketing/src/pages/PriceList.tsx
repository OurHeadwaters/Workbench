import { Link } from "wouter";

const salts = [
  { name: "Dryden Smokehouse Salt", desc: "Cold-smoked over maple wood, rich and savoury", market: "$12.00", wholesale: "$8.50" },
  { name: "Boreal Birch Salt", desc: "Delicate birch-smoked finish, light and versatile", market: "$12.00", wholesale: "$8.50" },
  { name: "Wild Herb & Forest Salt", desc: "Foraged herbs, spruce tip and sage", market: "$12.00", wholesale: "$8.50" },
  { name: "Cedar & Lake Salt", desc: "Cedar-kissed, inspired by northern shorelines", market: "$12.00", wholesale: "$8.50" },
  { name: "Northern Garlic Salt", desc: "Roasted garlic and cracked pepper blend", market: "$12.00", wholesale: "$8.50" },
];

const syrups = [
  { name: "Amber Maple Syrup — 250 mL", desc: "Delicate flavour, light golden colour", market: "$14.00", wholesale: "$10.00" },
  { name: "Amber Maple Syrup — 500 mL", desc: "Delicate flavour, light golden colour", market: "$24.00", wholesale: "$17.00" },
  { name: "Dark Maple Syrup — 250 mL", desc: "Robust, full-bodied, ideal for cooking", market: "$14.00", wholesale: "$10.00" },
  { name: "Dark Maple Syrup — 500 mL", desc: "Robust, full-bodied, ideal for cooking", market: "$24.00", wholesale: "$17.00" },
];

function PrintNav() {
  return (
    <div className="no-print screen-nav">
      <Link href="/">← Back to suite</Link>
      <button className="btn-print" onClick={() => window.print()}>
        🖨 Print this page
      </button>
    </div>
  );
}

export default function PriceList() {
  return (
    <>
      <PrintNav />
      <div className="print-page" style={{ fontFamily: "var(--font-sans)" }}>
        {/* Header */}
        <div style={{ borderBottom: "3px solid var(--evergreen)", paddingBottom: "0.6rem", marginBottom: "1.1rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.15rem" }}>
              Headwaters Development Services
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.1 }}>
              Parr's Jars
            </h1>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontStyle: "italic", color: "var(--rust)", marginTop: "0.1rem" }}>
              Hand-blended in Dryden, Ontario
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.7 }}>
              Bobbie Parr<br />
              bobbie@headwatersdevelopment.ca<br />
              Dryden Farmers Market — Saturdays, 8 am–1 pm<br />
              headwatersdevelopment.ca
            </p>
          </div>
        </div>

        {/* Decorative rule */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.1rem" }}>
          <div style={{ height: 1, background: "var(--rust)", flex: 1 }} />
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", color: "var(--rust)", fontStyle: "italic" }}>2025 Price List</span>
          <div style={{ height: 1, background: "var(--rust)", flex: 1 }} />
        </div>

        {/* Salts section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--evergreen)", borderLeft: "3px solid var(--rust)", paddingLeft: "0.55rem", marginBottom: "0.65rem" }}>
            Artisan Smoked Salts &nbsp;— 100 g jar
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--evergreen)", color: "white" }}>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "left" }}>Product</th>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "left", width: "36%" }}>Tasting Note</th>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "right", width: "14%" }}>Market</th>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "right", width: "14%" }}>Wholesale</th>
              </tr>
            </thead>
            <tbody>
              {salts.map((s, i) => (
                <tr key={s.name} style={{ background: i % 2 === 0 ? "white" : "var(--cream)" }}>
                  <td style={{ padding: "0.5rem 0.6rem", fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "0.88rem", color: "var(--ink)" }}>{s.name}</td>
                  <td style={{ padding: "0.5rem 0.6rem", fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)", fontStyle: "italic" }}>{s.desc}</td>
                  <td style={{ padding: "0.5rem 0.6rem", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9rem", textAlign: "right", color: "var(--ink)" }}>{s.market}</td>
                  <td style={{ padding: "0.5rem 0.6rem", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9rem", textAlign: "right", color: "var(--muted)" }}>{s.wholesale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Maple Syrup section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--evergreen)", borderLeft: "3px solid var(--rust)", paddingLeft: "0.55rem", marginBottom: "0.65rem" }}>
            Pure Canadian Maple Syrup
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--evergreen)", color: "white" }}>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "left" }}>Product</th>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "left", width: "36%" }}>Tasting Note</th>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "right", width: "14%" }}>Market</th>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "right", width: "14%" }}>Wholesale</th>
              </tr>
            </thead>
            <tbody>
              {syrups.map((s, i) => (
                <tr key={s.name} style={{ background: i % 2 === 0 ? "white" : "var(--cream)" }}>
                  <td style={{ padding: "0.5rem 0.6rem", fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "0.88rem", color: "var(--ink)" }}>{s.name}</td>
                  <td style={{ padding: "0.5rem 0.6rem", fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)", fontStyle: "italic" }}>{s.desc}</td>
                  <td style={{ padding: "0.5rem 0.6rem", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9rem", textAlign: "right", color: "var(--ink)" }}>{s.market}</td>
                  <td style={{ padding: "0.5rem 0.6rem", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9rem", textAlign: "right", color: "var(--muted)" }}>{s.wholesale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
          <div style={{ background: "var(--cream)", borderRadius: 4, padding: "0.75rem 0.9rem" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.3rem" }}>Wholesale Terms</h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Minimum order: 12 units. Payment net-30 on approved accounts. Available for local shops, restaurants, and gift stores. Contact Bobbie to arrange.
            </p>
          </div>
          <div style={{ background: "var(--cream)", borderRadius: 4, padding: "0.75rem 0.9rem" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.3rem" }}>Custom Blends & Gift Sets</h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Custom salt blends and branded gift sets available for events, offices, and corporate gifting. Minimum quantities apply. Ask at the market table.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(31,61,46,0.18)", paddingTop: "0.7rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--rust)" }} />
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.8rem", fontStyle: "italic", color: "var(--evergreen)" }}>Parr's Jars — Handcrafted in Dryden, Ontario</span>
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)" }}>Prices subject to change · headwatersdevelopment.ca</span>
        </div>
      </div>
    </>
  );
}
