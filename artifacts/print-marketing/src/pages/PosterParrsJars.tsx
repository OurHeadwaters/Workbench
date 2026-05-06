import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

export default function PosterParrsJars() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="parrs-jars-poster.pdf" />
      <div id="pdf-target" className="print-page page-letter" style={{ padding: 0, overflow: "hidden", background: "var(--evergreen)", minHeight: "11in" }}>

        {/* Full-bleed background */}
        <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-2in", right: "-1.5in", width: "6in", height: "6in", borderRadius: "50%", background: "rgba(184,90,62,0.15)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-1in", left: "-1in", width: "4in", height: "4in", borderRadius: "50%", background: "rgba(244,237,224,0.06)", pointerEvents: "none" }} />

          {/* Top rule */}
          <div style={{ height: "0.18in", background: "var(--rust)", flexShrink: 0 }} />

          {/* Main content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0.55in 0.65in 0.5in", position: "relative", zIndex: 1 }}>

            {/* Eyebrow */}
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,237,224,0.6)", marginBottom: "0.15rem" }}>
              Headwaters Development Services
            </p>

            {/* Brand name */}
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "5.5rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "0.1in", paddingBottom: "0.06em", overflow: "visible" }}>
              Parr's<br />Jars
            </h1>

            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontStyle: "italic", color: "var(--rust-light)", marginBottom: "0.3in" }}>
              Hand-blended in Dryden, Ontario
            </p>

            {/* Rule */}
            <div style={{ width: "2.5in", height: 2, background: "var(--rust)", marginBottom: "0.35in" }} />

            {/* Tagline */}
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", fontWeight: 400, color: "var(--cream)", lineHeight: 1.45, maxWidth: "4.8in", marginBottom: "0.45in" }}>
              Small-batch artisan salts, pure Canadian maple syrup, and northern dog treats — crafted from the boreal north.
            </p>

            {/* Products */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25in", marginBottom: "0.45in" }}>
              {[
                { name: "Salty Onion", note: "Sea salt, onion powder, chive powder — flavour-forward on sourdough, eggs, avocado" },
                { name: "Salty Garlic", note: "Sea salt, garlic powder, chive powder — perfect on butter, bread, everything" },
                { name: "Salty Finish", note: "Sea salt, paprika, garlic & onion mix — anywhere you'd use smoked paprika" },
                { name: "Cheezy Salt", note: "Nutritional yeast, sea salt, garlic & onion mix — dairy-free cheesy flavour, the best seller" },
                { name: "Pure Maple Syrup", note: "Amber, Golden & Dark · 500 mL · 1 L" },
                { name: "Dog Treats", note: "Beef Organs — single-ingredient, air-dried" },
              ].map((p) => (
                <div key={p.name} style={{ borderLeft: "2px solid var(--rust)", paddingLeft: "0.55rem" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.88rem", color: "var(--cream)", lineHeight: 1.2, marginBottom: "0.1rem" }}>{p.name}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.73rem", color: "rgba(244,237,224,0.65)", fontStyle: "italic" }}>{p.note}</p>
                </div>
              ))}
            </div>

            {/* Price callout */}
            <div style={{ display: "flex", gap: "0.25in", marginBottom: "0.5in" }}>
              <div style={{ background: "var(--rust)", borderRadius: 6, padding: "0.35rem 0.7rem" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: "0.1rem" }}>Salts · 100 g jar</p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$12</p>
              </div>
              <div style={{ background: "rgba(244,237,224,0.12)", borderRadius: 6, padding: "0.35rem 0.7rem", border: "1px solid rgba(244,237,224,0.2)" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,237,224,0.65)", marginBottom: "0.1rem" }}>Maple Syrup · 500 mL</p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1 }}>$18</p>
              </div>
              <div style={{ background: "rgba(244,237,224,0.12)", borderRadius: 6, padding: "0.35rem 0.7rem", border: "1px solid rgba(244,237,224,0.2)" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,237,224,0.65)", marginBottom: "0.1rem" }}>Maple Syrup · 1 L</p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 900, color: "var(--cream)", lineHeight: 1 }}>$27</p>
              </div>
            </div>

            {/* Spacer pushes footer to bottom */}
            <div style={{ flex: 1 }} />

            {/* Bottom section */}
            <div style={{ borderTop: "1px solid rgba(244,237,224,0.2)", paddingTop: "0.35rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 600, color: "var(--cream)", marginBottom: "0.05rem" }}>
                  Dryden Farmers Market — Dryden Arena
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "rgba(244,237,224,0.65)" }}>
                  Saturdays 3–6 pm · mid June–mid September
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(244,237,224,0.75)" }}>ourheadwaters.ca</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "rgba(244,237,224,0.5)" }}>bobbie@ourheadwaters.ca</p>
                </div>
                <QRCodeStamp light />
              </div>
            </div>
          </div>

          {/* Bottom rust band */}
          <div style={{ height: "0.18in", background: "var(--rust)", flexShrink: 0 }} />
        </div>
      </div>
    </>
  );
}
