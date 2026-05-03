import { Link } from "wouter";
import QRCodeStamp from "../components/QRCodeStamp";

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

export default function MarketDisplay() {
  return (
    <>
      <PrintNav />
      <div className="print-page" style={{ padding: "0.5in 0.6in", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "11in" }}>

        {/* Top band */}
        <div style={{ background: "var(--evergreen)", margin: "-0.5in -0.6in 0", padding: "0.55rem 0.7in", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
            Headwaters Development Services
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
            Dryden Farmers Market · Saturdays 8 am – 1 pm
          </span>
        </div>

        {/* Brand name */}
        <div style={{ textAlign: "center", paddingTop: "0.55in" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "4.8rem", fontWeight: 900, color: "var(--evergreen)", lineHeight: 1, letterSpacing: "-0.02em" }}>
            Parr's Jars
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--rust)", marginTop: "0.3rem" }}>
            Hand-blended in Dryden, Ontario
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", margin: "0.4in 0" }}>
          <div style={{ height: 2, background: "var(--rust)", flex: 1 }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rust)" }} />
          <div style={{ height: 2, background: "var(--rust)", flex: 1 }} />
        </div>

        {/* Products grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35in", flex: 1 }}>
          {/* Salts card */}
          <div style={{ background: "var(--cream)", borderRadius: 8, padding: "0.45in 0.4in", border: "2px solid var(--evergreen)", display: "flex", flexDirection: "column" }}>
            <div style={{ borderBottom: "2px solid var(--rust)", paddingBottom: "0.2rem", marginBottom: "0.3rem" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust)", marginBottom: "0.1rem" }}>Artisan</p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "var(--evergreen)", lineHeight: 1 }}>Smoked<br />Salts</h2>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.55, marginTop: "0.2rem", flex: 1 }}>
              Cold-smoked over real wood. Birch, maple, and cedar smoke varieties. Wild herbs and northern botanicals. Each jar hand-blended in small batches.
            </p>
            <div style={{ marginTop: "0.35in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.1rem" }}>100 g jar</p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "3.2rem", fontWeight: 900, color: "var(--rust)", lineHeight: 1 }}>$12</p>
            </div>
          </div>

          {/* Maple syrup card */}
          <div style={{ background: "var(--evergreen)", borderRadius: 8, padding: "0.45in 0.4in", display: "flex", flexDirection: "column" }}>
            <div style={{ borderBottom: "2px solid var(--rust-light)", paddingBottom: "0.2rem", marginBottom: "0.3rem" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rust-light)", marginBottom: "0.1rem" }}>Pure Canadian</p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1 }}>Maple<br />Syrup</h2>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "rgba(244,237,224,0.78)", lineHeight: 1.55, marginTop: "0.2rem", flex: 1 }}>
              Amber and dark grades available. Light and delicate to robust and full-bodied. Perfect on pancakes, in baking, or as a natural sweetener.
            </p>
            <div style={{ marginTop: "0.35in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,237,224,0.65)", marginBottom: "0.1rem" }}>250 mL · 500 mL</p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "3.2rem", fontWeight: 900, color: "var(--rust-light)", lineHeight: 1 }}>$14 – $24</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "0.35in", background: "var(--cream-dark)", borderRadius: 6, padding: "0.5rem 0.7rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontStyle: "italic", color: "var(--evergreen)" }}>
            Ask us about wholesale pricing and custom gift sets
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)" }}>
              bobbie@ourheadwaters.ca
            </span>
            <QRCodeStamp />
          </div>
        </div>
      </div>
    </>
  );
}
