import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const MARKET_CONFIG = {
  venue: "Dryden Arena",
  hours: "3:00 – 6:00 pm",
  season: "mid June–mid September",
};

export default function PosterMarket() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="headwaters-poster-market.pdf" />
      <div id="pdf-target" className="print-page page-letter" style={{ padding: 0, overflow: "hidden", background: "var(--cream)", minHeight: "11in" }}>
        <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

          {/* Decorative background shapes */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "3.5in", left: "-1.5in", width: "6in", height: "6in", borderRadius: "50%", background: "rgba(31,61,46,0.05)" }} />
            <div style={{ position: "absolute", top: "-0.5in", right: "-1in", width: "3.5in", height: "3.5in", borderRadius: "50%", background: "rgba(184,90,62,0.08)" }} />
          </div>

          {/* Top evergreen band */}
          <div style={{ background: "var(--evergreen)", padding: "0.45in 0.65in 0.4in", flexShrink: 0, position: "relative", zIndex: 1 }}>
            {/* Top eyebrow */}
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.3rem" }}>
              Come Find Us ·
            </p>

            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "4rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1, letterSpacing: "-0.03em" }}>
              Dryden<br />Farmers Market
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "0.25rem 0" }}>
              <div style={{ height: 2, background: "var(--rust)", width: "1.2in" }} />
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--rust-light)" }}>Saturdays · {MARKET_CONFIG.season}</p>
            </div>

            <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.3rem", fontWeight: 600, color: "var(--cream)", letterSpacing: "0.02em" }}>
              {MARKET_CONFIG.hours}
            </p>

            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontStyle: "italic", color: "var(--rust-light)", margin: "0.15rem 0 0" }}>
              {MARKET_CONFIG.venue}
            </p>
          </div>

          {/* Main body */}
          <div style={{ flex: 1, padding: "0.45in 0.65in", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>

            {/* Parr's Jars feature */}
            <div style={{ marginBottom: "0.4in" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.15rem" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 900, color: "var(--evergreen)", lineHeight: 1 }}>
                  Parr's Jars
                </h2>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem", fontStyle: "italic", color: "var(--muted)" }}>
                  at the market
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontStyle: "italic", color: "var(--rust)", marginBottom: "0.2rem" }}>
                Hand-blended in Dryden, Ontario
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6, maxWidth: "5in" }}>
                Stop by the Parr's Jars table to browse artisan smoked salts, pure Canadian maple syrup, and seasonal small-batch specials — all made locally with northern ingredients.
              </p>
            </div>

            {/* Product highlights */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.25in", marginBottom: "0.4in" }}>
              {[
                { label: "Smoked Salts", note: "4 varieties · 100 g jars", price: "$12" },
                { label: "Maple Syrup", note: "Amber, Golden & Dark · 500 mL / 1 L", price: "from $18" },
                { label: "Dog Treats", note: "Beef Organs · single-ingredient", price: "$12" },
              ].map((p) => (
                <div key={p.label} style={{ background: "white", borderRadius: 6, padding: "0.3rem 0.4rem 0.35rem", border: "1px solid rgba(31,61,46,0.12)" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.95rem", color: "var(--evergreen)", marginBottom: "0.05rem" }}>{p.label}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.15rem" }}>{p.note}</p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 900, color: "var(--rust)" }}>{p.price}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35in" }}>
              <div style={{ height: 1, background: "rgba(31,61,46,0.2)", flex: 1 }} />
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--rust)" }} />
              <div style={{ height: 1, background: "rgba(31,61,46,0.2)", flex: 1 }} />
            </div>

            {/* Headwaters tagline */}
            <div style={{ marginBottom: "0.4in" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.2rem" }}>
                Presented by
              </p>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.12rem" }}>
                Headwaters Development Services
              </h3>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontStyle: "italic", color: "var(--rust)", marginBottom: "0.15rem" }}>
                Building capacity in northern communities
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.55, maxWidth: "4.8in" }}>
                Headwaters works with band councils, Indigenous businesses, and northern organizations on community stores, co-op platforms, and custom software. Ask Bobbie how we can help your community.
              </p>
            </div>

            <div style={{ flex: 1 }} />

            {/* Footer / contact */}
            <div style={{ background: "var(--evergreen)", borderRadius: 8, padding: "0.3in 0.4in", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--cream)", marginBottom: "0.1rem" }}>
                  ourheadwaters.ca
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(244,237,224,0.7)" }}>
                  bobbie@ourheadwaters.ca
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(244,237,224,0.75)", lineHeight: 1.6 }}>
                    Dryden, Ontario<br />
                    <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>Treaty 3 Territory</span>
                  </p>
                </div>
                <QRCodeStamp light />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
