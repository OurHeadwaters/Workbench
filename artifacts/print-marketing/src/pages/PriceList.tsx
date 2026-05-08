import { useState } from "react";
import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const salts = [
  { name: "Salty Onion", desc: "Sea salt, onion powder, chive powder — the one that started it all. Flavour-forward on sourdough, eggs, avocado.", market: "$12.00", wholesale: "$8.50" },
  { name: "Salty Garlic", desc: "Sea salt, garlic powder, chive powder — for when garlic breath doesn't matter. Perfect on butter, bread, everything.", market: "$12.00", wholesale: "$8.50" },
  { name: "Salty Finish", desc: "Sea salt, paprika, garlic & onion mix — reach for this anywhere you'd use smoked paprika: wings, pork, devilled eggs.", market: "$12.00", wholesale: "$8.50" },
  { name: "Cheezy Salt", desc: "Nutritional yeast, sea salt, garlic & onion mix — the best seller. Dairy-free cheesy flavour, brilliant stirred into broth.", market: "$12.00", wholesale: "$8.50" },
];

const syrups = [
  { name: "Amber Maple Syrup — 500 mL", desc: "Delicate flavour, light golden colour", market: "$18.00", wholesale: "$13.00" },
  { name: "Amber Maple Syrup — 1 L", desc: "Delicate flavour, light golden colour", market: "$27.00", wholesale: "$19.00" },
  { name: "Golden Maple Syrup — 500 mL", desc: "Rich golden flavour, smooth and sweet", market: "$18.00", wholesale: "$13.00" },
  { name: "Golden Maple Syrup — 1 L", desc: "Rich golden flavour, smooth and sweet", market: "$27.00", wholesale: "$19.00" },
  { name: "Dark Maple Syrup — 500 mL", desc: "Robust, full-bodied — best for baking, marinades, and glazes", market: "$18.00", wholesale: "$13.00" },
  { name: "Dark Maple Syrup — 1 L", desc: "Robust, full-bodied — best for baking, marinades, and glazes", market: "$27.00", wholesale: "$19.00" },
];

const dogTreats = [
  { name: "Dog Treats — Beef Organs", desc: "Single-ingredient, air-dried beef organ treats for dogs", market: "$12.00", wholesale: "$8.50" },
];

export default function PriceList() {
  const [specials, setSpecials] = useState([
    { name: "", price: "" },
    { name: "", price: "" },
    { name: "", price: "" },
  ]);

  function updateSpecial(index: number, field: "name" | "price", value: string) {
    setSpecials((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }

  const filledSpecials = specials.filter((s) => s.name.trim() !== "");

  function buildPlainText(): string {
    const saltLines = salts.map(
      (s) => `${s.name} — ${s.desc}\n  Market: ${s.market}  Wholesale: ${s.wholesale}`
    ).join("\n\n");

    const syrupLines = syrups.map(
      (s) => `${s.name} — ${s.desc}\n  Market: ${s.market}  Wholesale: ${s.wholesale}`
    ).join("\n\n");

    const dogLines = dogTreats.map(
      (s) => `${s.name} — ${s.desc}\n  Market: ${s.market}  Wholesale: ${s.wholesale}`
    ).join("\n\n");

    const specialsBlock = filledSpecials.length > 0
      ? [
          "",
          "---",
          "",
          "THIS WEEK'S SPECIALS",
          "",
          ...filledSpecials.map((s) => `${s.name}  ${s.price || "—"}`),
        ].join("\n")
      : "";

    return [
      "PARR'S JARS — PRICE LIST",
      "Hand-blended in Dryden, Ontario · 2026 Season",
      "",
      "Bobbie Parr · bobbie@ourheadwaters.ca",
      "Dryden Farmers Market — Dryden Arena, Sat 3–6 pm, mid June–mid September",
      "ourheadwaters.ca",
      "",
      "---",
      "",
      "ARTISAN SMOKED SALTS — 100 g jar",
      "",
      saltLines,
      "",
      "---",
      "",
      "PURE CANADIAN MAPLE SYRUP",
      "Sourced from Sidders & Sons, Cochenour, ON — three generations of maple farming. Dark grade is best for baking.",
      "",
      syrupLines,
      "",
      "---",
      "",
      "DOG TREATS",
      "",
      dogLines,
      specialsBlock,
      "",
      "---",
      "",
      "WHOLESALE TERMS",
      "Minimum order: 25 cases. Payment net-30 on approved accounts. Available for local shops, restaurants, and gift stores. Contact Bobbie to arrange.",
      "",
      "CUSTOM BLENDS & GIFT SETS",
      "Custom salt blends and branded gift sets available for events, offices, and corporate gifting. Minimum quantities apply. Ask at the market table.",
      "",
      "---",
      "",
      "Parr's Jars — Handcrafted in Dryden, Ontario",
      "Prices subject to change",
    ].join("\n");
  }

  return (
    <>
      <PrintNav targetId="pdf-target" filename="parrs-jars-price-list.pdf" onCopyPlainText={buildPlainText} />

      {/* Specials editor — screen only, never prints */}
      <div className="no-print" style={{ maxWidth: 680, margin: "0 auto 1.5rem", padding: "0 1rem" }}>
        <div style={{ background: "white", border: "1.5px solid var(--rust)", borderRadius: 8, padding: "1.1rem 1.25rem" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 700, color: "var(--rust)", marginBottom: "0.25rem" }}>
            This Week's Specials
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.9rem", lineHeight: 1.5 }}>
            Fill in up to 3 specials below. They'll appear at the bottom of the printed price list. Leave a row blank to skip it.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {specials.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", width: "1.2rem", textAlign: "center", flexShrink: 0 }}>
                  {i + 1}.
                </span>
                <input
                  type="text"
                  placeholder="Product name"
                  value={s.name}
                  onChange={(e) => updateSpecial(i, "name", e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.45rem 0.65rem",
                    border: "1px solid rgba(31,61,46,0.22)",
                    borderRadius: 5,
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    color: "var(--ink)",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Price (e.g. $10.00)"
                  value={s.price}
                  onChange={(e) => updateSpecial(i, "price", e.target.value)}
                  style={{
                    width: "9rem",
                    padding: "0.45rem 0.65rem",
                    border: "1px solid rgba(31,61,46,0.22)",
                    borderRadius: 5,
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    color: "var(--ink)",
                    outline: "none",
                  }}
                />
              </div>
            ))}
          </div>
          {filledSpecials.length === 0 && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.75rem", fontStyle: "italic" }}>
              No specials entered yet — the section will be hidden on the printed page.
            </p>
          )}
        </div>
      </div>

      <div id="pdf-target" className="print-page page-letter" style={{ fontFamily: "var(--font-sans)" }}>
        {/* Header */}
        <div style={{ borderBottom: "3px solid var(--evergreen)", paddingBottom: "0.6rem", marginBottom: "1.1rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.15rem", whiteSpace: "nowrap" }}>
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
              bobbie@ourheadwaters.ca<br />
              Dryden Farmers Market — Dryden Arena, Sat 3–6 pm, mid June–mid September<br />
              ourheadwaters.ca
            </p>
          </div>
        </div>

        {/* Decorative rule */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.1rem" }}>
          <div style={{ height: 1, background: "var(--rust)", flex: 1 }} />
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", color: "var(--rust)", fontStyle: "italic" }}>2026 Season</span>
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
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--evergreen)", borderLeft: "3px solid var(--rust)", paddingLeft: "0.55rem", marginBottom: "0.25rem" }}>
            Pure Canadian Maple Syrup
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)", fontStyle: "italic", marginBottom: "0.55rem", paddingLeft: "0.55rem" }}>
            Sourced from Sidders &amp; Sons, Cochenour, ON — three generations of maple farming. Dark grade is best for baking.
          </p>
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

        {/* Dog Treats section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--evergreen)", borderLeft: "3px solid var(--rust)", paddingLeft: "0.55rem", marginBottom: "0.65rem" }}>
            Dog Treats
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--evergreen)", color: "white" }}>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "left" }}>Product</th>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "left", width: "36%" }}>Description</th>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "right", width: "14%" }}>Market</th>
                <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "right", width: "14%" }}>Wholesale</th>
              </tr>
            </thead>
            <tbody>
              {dogTreats.map((s, i) => (
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

        {/* This Week's Specials — only shown when at least one special is filled in */}
        {filledSpecials.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--rust)", borderLeft: "3px solid var(--rust)", paddingLeft: "0.55rem", marginBottom: "0.65rem" }}>
              ★ This Week's Specials
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--rust)", color: "white" }}>
                  <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "left" }}>Special Item</th>
                  <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.4rem 0.6rem", textAlign: "right", width: "20%" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {filledSpecials.map((s, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fff8f5" }}>
                    <td style={{ padding: "0.55rem 0.6rem", fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "0.95rem", color: "var(--ink)" }}>{s.name}</td>
                    <td style={{ padding: "0.55rem 0.6rem", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "1rem", textAlign: "right", color: "var(--rust)" }}>{s.price || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Notes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
          <div style={{ background: "var(--cream)", borderRadius: 4, padding: "0.75rem 0.9rem" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.3rem" }}>Wholesale Terms</h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Minimum order: 25 cases. Payment net-30 on approved accounts. Available for local shops, restaurants, and gift stores. Contact Bobbie to arrange.
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)" }}>Prices subject to change</span>
            <QRCodeStamp />
          </div>
        </div>
      </div>
    </>
  );
}
