import type { CSSProperties } from "react";
import { PrintNav } from "../components/PrintNav";

const base = import.meta.env.BASE_URL;

const CREAM   = "#f4ede0";
const EVERGREEN = "#1f3d2e";
const RUST    = "#b85a3e";
const INK     = "#1a1a1a";
const MUTED   = "#6b7560";
const BLUE    = "#1B5E8A";
const BLUE_SOFT = "#E8F4FD";

const PAGE: CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  background: CREAM,
  display: "flex",
  flexDirection: "column",
  fontFamily: "Inter, system-ui, sans-serif",
  color: INK,
  position: "relative",
  overflow: "hidden",
};

export default function DeerLakePartnership() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="deer-lake-2027-partnership.pdf"
        paginate={false}
      />

      <div id="pdf-target" style={{ background: "#d8d2c8" }}>
        <div className="page-letter" style={PAGE}>

          {/* ── TOP BAND ────────────────────────────────────── */}
          <div style={{
            background: EVERGREEN,
            padding: "0.45in 0.65in 0.38in",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.65rem", color: "rgba(244,237,224,0.6)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.1in" }}>
                2027 Distribution Partnership
              </p>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.7rem", color: CREAM, lineHeight: 1.15, fontWeight: 600, margin: 0 }}>
                807 Food Co-operative<br />
                × Deer Lake First Nation
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.12in", marginBottom: "0.08in" }}>
                <img
                  src={`${base}eagle-circle.png`}
                  alt="Headwaters"
                  style={{ width: "0.38in", height: "0.38in", objectFit: "contain", opacity: 0.88 }}
                />
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, color: CREAM, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>Headwaters</p>
                  <p style={{ fontSize: "0.48rem", color: "rgba(244,237,224,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Development Services</p>
                </div>
              </div>
              <p style={{ fontSize: "0.6rem", color: "rgba(244,237,224,0.55)", margin: 0, textAlign: "right" }}>
                Prepared · May 2026
              </p>
            </div>
          </div>

          {/* ── LEAD STATEMENT ──────────────────────────────── */}
          <div style={{ padding: "0.42in 0.65in 0.3in" }}>
            <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.15rem", lineHeight: 1.5, color: EVERGREEN, maxWidth: "6.8in", margin: 0 }}>
              This is the plan: regular food deliveries to Deer Lake — starting January 2027
              on the winter road. 807 can anchor the supply with real pantry staples through
              wholesale purchasing relationships, and fold in Northern Ontario producers
              where the product is seasonal, valuable, and cost-effective.
              The grants aren't in yet. The application goes in June 15, 2026.
              This is what it looks like if we do the work to get there.
            </p>
          </div>

          {/* ── THREE COLUMNS ────────────────────────────────── */}
          <div style={{ padding: "0 0.65in", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.22in" }}>

            {/* Who's at the table */}
            <div style={{ background: EVERGREEN, borderRadius: "6px", padding: "0.28in 0.28in 0.3in" }}>
              <p style={{ fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "0.14in", fontWeight: 700 }}>
                Who's at the table
              </p>
              {[
                { org: "807 Food Co-op", role: "Lead — Dryden" },
                { org: "Superior Seasons", role: "Supply — Thunder Bay" },
                { org: "Rockfront Farm", role: "Distribution — Sioux Lookout" },
                { org: "Headwaters", role: "Northern Coordinator — Dryden" },
                { org: "Deer Lake", role: "Community Coordinator — on-site" },
              ].map((p) => (
                <div key={p.org} style={{ marginBottom: "0.1in" }}>
                  <p style={{ color: CREAM, fontWeight: 600, fontSize: "0.7rem", margin: 0, lineHeight: 1.2 }}>{p.org}</p>
                  <p style={{ color: "rgba(244,237,224,0.55)", fontSize: "0.6rem", margin: 0 }}>{p.role}</p>
                </div>
              ))}
            </div>

            {/* What grants cover */}
            <div style={{ background: BLUE_SOFT, borderRadius: "6px", padding: "0.28in 0.28in 0.3in", border: `1.5px solid ${BLUE}` }}>
              <p style={{ fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: BLUE, marginBottom: "0.14in", fontWeight: 700 }}>
                What we're applying to fund
              </p>
              {[
                { item: "4 contracted positions", note: "NOHFC + FedNor CEDD" },
                { item: "Truck + food infrastructure", note: "LFIF capital grant" },
                { item: "Planning year (2026)", note: "Deer Lake First Nation" },
                { item: "Co-op development tools", note: "CDP grant via 807" },
              ].map((g) => (
                <div key={g.item} style={{ marginBottom: "0.11in" }}>
                  <p style={{ color: EVERGREEN, fontWeight: 600, fontSize: "0.7rem", margin: 0, lineHeight: 1.2 }}>{g.item}</p>
                  <p style={{ color: MUTED, fontSize: "0.6rem", margin: 0 }}>{g.note}</p>
                </div>
              ))}
              <div style={{ marginTop: "0.14in", paddingTop: "0.1in", borderTop: `1px solid #c5dcee` }}>
                <p style={{ fontSize: "0.6rem", color: MUTED, margin: 0 }}>
                  Grants do not cover food costs — that stays with the store's normal purchasing.
                </p>
              </div>
            </div>

            {/* The route */}
            <div style={{ background: CREAM, borderRadius: "6px", padding: "0.28in 0.28in 0.3in", border: `1.5px solid #d6cfc3` }}>
              <p style={{ fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, marginBottom: "0.14in", fontWeight: 700 }}>
                The route
              </p>
              {[
                { stop: "Thunder Bay", role: "Producers & supply" },
                { stop: "Sioux Lookout", role: "Distribution hub" },
                { stop: "Dryden", role: "Coordination & co-op" },
                { stop: "Deer Lake", role: "Community delivery" },
              ].map((s, i, arr) => (
                <div key={s.stop}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.1in" }}>
                    <div style={{
                      width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                      background: i === arr.length - 1 ? RUST : EVERGREEN,
                    }} />
                    <div>
                      <p style={{ color: INK, fontWeight: 600, fontSize: "0.7rem", margin: 0, lineHeight: 1.2 }}>{s.stop}</p>
                      <p style={{ color: MUTED, fontSize: "0.6rem", margin: 0 }}>{s.role}</p>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: "1px", height: "0.14in", background: "#c8c2b8", marginLeft: "3.5px", marginTop: "2px", marginBottom: "2px" }} />
                  )}
                </div>
              ))}
              <p style={{ fontSize: "0.6rem", color: MUTED, marginTop: "0.14in", marginBottom: 0 }}>
                Winter road opens January — truck runs April. Summer route follows.
              </p>
            </div>
          </div>

          {/* ── WHAT 2027 LOOKS LIKE ─────────────────────────── */}
          <div style={{ padding: "0.32in 0.65in 0" }}>
            <p style={{ fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, fontWeight: 700, marginBottom: "0.16in" }}>
              What 2027 looks like for Deer Lake
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.18in" }}>
              {[
                {
                  heading: "Regular deliveries on the winter road",
                  body: "A scheduled truck run from Dryden to Deer Lake, January through April. Same team, same route, every run.",
                },
                {
                  heading: "A local coordinator in the community",
                  body: "One person — ideally a Deer Lake community member — hired and contracted to handle receiving, distribution, and reporting.",
                },
                {
                  heading: "Deliveries continue through summer",
                  body: "Once the winter pilot proves the route, the supply chain keeps running through summer access. Bi-weekly or monthly cadence.",
                },
                {
                  heading: "A trial phase to find what's missing",
                  body: "The first year is a learning run. We find out what works, what the community needs more of, and what the next year should look like.",
                },
              ].map((item) => (
                <div key={item.heading} style={{ display: "flex", gap: "0.12in" }}>
                  <div style={{ width: "3px", borderRadius: "2px", background: RUST, flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.7rem", color: INK, margin: "0 0 0.04in" }}>{item.heading}</p>
                    <p style={{ fontSize: "0.65rem", color: MUTED, margin: 0, lineHeight: 1.5 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── THE ONE ASK ──────────────────────────────────── */}
          <div style={{ padding: "0.32in 0.65in 0" }}>
            <div style={{ background: EVERGREEN, borderRadius: "6px", padding: "0.28in 0.35in", display: "flex", alignItems: "center", gap: "0.35in" }}>
              <div style={{ flexShrink: 0 }}>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "2.2rem", color: CREAM, margin: 0, lineHeight: 1 }}>1</p>
                <p style={{ fontSize: "0.52rem", color: "rgba(244,237,224,0.5)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>ask</p>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.78rem", color: CREAM, margin: "0 0 0.06in" }}>
                  A letter of support from Chief & Council
                </p>
                <p style={{ fontSize: "0.65rem", color: "rgba(244,237,224,0.7)", margin: 0, lineHeight: 1.55, maxWidth: "5.2in" }}>
                  The grant application goes in June 15, 2026. Headwaters is writing it — NOHFC Enhance Your Community + FedNor CEDD, 50/50, covering people and logistics. A letter of support from Deer Lake First Nation is what makes it score. Headwaters drafts the language; Council reviews and signs. Decisions come back within 90 days — faster if we put the right calls in early.
                </p>
              </div>
            </div>
          </div>

          {/* ── FOOTER ───────────────────────────────────────── */}
          <div style={{ marginTop: "auto", padding: "0.3in 0.65in 0.38in", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #d6cfc3" }}>
            <div>
              <p style={{ fontSize: "0.62rem", color: EVERGREEN, fontWeight: 600, margin: 0 }}>Headwaters Development Services</p>
              <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0 }}>bobbie@ourheadwaters.ca · ourheadwaters.ca</p>
            </div>
            <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0, textAlign: "right" }}>
              Prepared for Deer Lake First Nation · May 2026<br />
              Questions: Headwaters is coordinating on behalf of the 807 partnership
            </p>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════
            PAGE 2 — THE 807 SUPPLY NETWORK
        ════════════════════════════════════════════════════ */}
        <div className="page-letter" style={{ ...PAGE, marginTop: "0.25in" }}>

          {/* ── TOP BAND ── */}
          <div style={{
            background: EVERGREEN,
            padding: "0.38in 0.65in 0.32in",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "0.65rem", color: "rgba(244,237,224,0.6)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.08in" }}>
                Supplier Reference · May 2026
              </p>
              <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.5rem", color: CREAM, lineHeight: 1.15, fontWeight: 600, margin: 0 }}>
                The 807 Supply Network
              </h2>
            </div>
            <p style={{ fontSize: "0.62rem", color: "rgba(244,237,224,0.6)", margin: 0, textAlign: "right", maxWidth: "3in", lineHeight: 1.5 }}>
              Established wholesale relationships — real product, regional producers, consistent delivery. This is what's already in the network.
            </p>
          </div>

          {/* ── SUPPLIER GRID ── */}
          <div style={{ padding: "0.38in 0.65in 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.28in" }}>

            {/* PANTRY STAPLES */}
            <div>
              <p style={{ fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", color: RUST, fontWeight: 700, marginBottom: "0.12in" }}>
                Pantry Staples
              </p>
              {[
                {
                  name: "Emily's Bread",
                  loc: "Thunder Bay",
                  note: "Sandwich bread, buns, tortillas, rye — wholesale from $2.75/unit. Ships via Manitoulin Transport.",
                },
                {
                  name: "Brûlée Creek Farms",
                  loc: "Kakabeka Falls",
                  note: "Stone-ground flour (whole wheat, rye), cold-pressed canola oil, baking mixes. $6/unit wholesale.",
                },
                {
                  name: "Big Lake Pasta",
                  loc: "Northwestern Ontario",
                  note: "Fusilli, radiatore, creste di gallo — 350g retail bags or 5 lb food-service. $3.75/unit wholesale.",
                },
              ].map((s) => (
                <div key={s.name} style={{ marginBottom: "0.13in", paddingBottom: "0.13in", borderBottom: "1px solid #e0d9d0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.03in" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.68rem", color: INK, margin: 0 }}>{s.name}</p>
                    <p style={{ fontSize: "0.55rem", color: MUTED, margin: 0 }}>{s.loc}</p>
                  </div>
                  <p style={{ fontSize: "0.6rem", color: MUTED, margin: 0, lineHeight: 1.45 }}>{s.note}</p>
                </div>
              ))}
            </div>

            {/* COFFEE & BEVERAGES */}
            <div>
              <p style={{ fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", color: RUST, fontWeight: 700, marginBottom: "0.12in" }}>
                Coffee & Beverages
              </p>
              {[
                {
                  name: "The Hub Roastery",
                  loc: "Sioux Lookout",
                  note: "Small-batch, single-origin coffee. 8 roasts. Wholesale from $13.50/12oz bag, $27/2lb. jesse@thehubroastery.ca",
                },
                {
                  name: "Nautical Coffee",
                  loc: "Keewatin (Lake of the Woods)",
                  note: "Off-grid specialty roaster. 5 blends including decaf. $13.25/340g wholesale (min. 12 bags). jeremy@nauticalcoffee.ca",
                },
                {
                  name: "Sap Sucker",
                  loc: "Northwestern Ontario",
                  note: "Sparkling maple water. Original, Lemon, Lime, Peach, Grapefruit. $1.90/355ml can wholesale (case of 12).",
                },
              ].map((s) => (
                <div key={s.name} style={{ marginBottom: "0.13in", paddingBottom: "0.13in", borderBottom: "1px solid #e0d9d0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.03in" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.68rem", color: INK, margin: 0 }}>{s.name}</p>
                    <p style={{ fontSize: "0.55rem", color: MUTED, margin: 0 }}>{s.loc}</p>
                  </div>
                  <p style={{ fontSize: "0.6rem", color: MUTED, margin: 0, lineHeight: 1.45 }}>{s.note}</p>
                </div>
              ))}
            </div>

            {/* NORTHERN SPECIALTY */}
            <div>
              <p style={{ fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", color: RUST, fontWeight: 700, marginBottom: "0.12in" }}>
                Northern Specialty
              </p>
              {[
                {
                  name: "Canada West Maple",
                  loc: "Thunder Bay",
                  note: "Pure maple syrup, blueberry maple, maple sugar, pancake mix. Wood-fired. From $7.50/200ml wholesale.",
                },
                {
                  name: "Thunder Oak Cheese",
                  loc: "Northwestern Ontario",
                  note: "Gouda (mild, jalapeño, smoked, dill) and cheese curds. From $5.69/wedge wholesale (case of 12).",
                },
                {
                  name: "June & Jo Spice Co",
                  loc: "Thunder Bay",
                  note: "Original, Sweet & Smokey, Hot & Spicy seasonings. Gluten-free crispy coating mix. $8.00/unit wholesale.",
                },
                {
                  name: "Heartbeat Hot Sauce",
                  loc: "Thunder Bay",
                  note: "12 varieties including Poirier's Louisiana Style and Lion's Mane Piri Piri. $8.25/bottle wholesale.",
                },
              ].map((s) => (
                <div key={s.name} style={{ marginBottom: "0.13in", paddingBottom: "0.13in", borderBottom: "1px solid #e0d9d0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.03in" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.68rem", color: INK, margin: 0 }}>{s.name}</p>
                    <p style={{ fontSize: "0.55rem", color: MUTED, margin: 0 }}>{s.loc}</p>
                  </div>
                  <p style={{ fontSize: "0.6rem", color: MUTED, margin: 0, lineHeight: 1.45 }}>{s.note}</p>
                </div>
              ))}
            </div>

            {/* FRESH, LOCAL & SEASONAL */}
            <div>
              <p style={{ fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", color: RUST, fontWeight: 700, marginBottom: "0.12in" }}>
                Fresh, Local & Seasonal
              </p>
              {[
                {
                  name: "Rockfront Family Farms",
                  loc: "Sioux Lookout",
                  note: "Microgreens, sunflower/pea/fava shoots, broccoli, radish blends. Grown to order, harvested fresh weekly.",
                },
                {
                  name: "DeBruin's Greenhouse",
                  loc: "Slate River (Hwy 61)",
                  note: "Living lettuce & basil, cherry tomatoes, grape tomatoes. No pesticides. Delivery Tuesdays and Fridays. Delivery included.",
                },
                {
                  name: "Eat the Fish",
                  loc: "Lake Superior / Lake Nipigon",
                  note: "Lake trout (boneless, skin-on fillet) $14/lb wholesale. Whitefish (boneless, skin-off) $15/lb wholesale.",
                },
                {
                  name: "Superior Bakes",
                  loc: "Thunder Bay",
                  note: "Protein balls, keto baked goods, cake mixes, pancake mix. Gluten-free options. From $2.25/unit wholesale.",
                },
              ].map((s) => (
                <div key={s.name} style={{ marginBottom: "0.13in", paddingBottom: "0.13in", borderBottom: "1px solid #e0d9d0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.03in" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.68rem", color: INK, margin: 0 }}>{s.name}</p>
                    <p style={{ fontSize: "0.55rem", color: MUTED, margin: 0 }}>{s.loc}</p>
                  </div>
                  <p style={{ fontSize: "0.6rem", color: MUTED, margin: 0, lineHeight: 1.45 }}>{s.note}</p>
                </div>
              ))}
            </div>

          </div>

          {/* ── HOW ORDERING WORKS ── */}
          <div style={{ padding: "0.3in 0.65in 0" }}>
            <div style={{ background: BLUE_SOFT, border: `1.5px solid ${BLUE}`, borderRadius: "6px", padding: "0.22in 0.3in", display: "flex", gap: "0.3in", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.4rem", color: BLUE, margin: 0, lineHeight: 1 }}>↗</p>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.7rem", color: EVERGREEN, margin: "0 0 0.05in" }}>
                  How the ordering system works today
                </p>
                <p style={{ fontSize: "0.62rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>
                  807 / Emily's Bread runs a consolidated NWO wholesale order form — a single order covers Canada West Maple, Thunder Oak Cheese, Big Lake Pasta, Heartbeat Hot Sauce, June & Jo, Superior Bakes, Sap Sucker, and Carol's Cakes. The Tuesday pickup (Thunder Bay → Dryden) and Wednesday delivery run is already operational. Folding Deer Lake in extends a route that already moves.
                </p>
              </div>
            </div>
          </div>

          {/* ── FOOTER PAGE 2 ── */}
          <div style={{ marginTop: "auto", padding: "0.28in 0.65in 0.38in", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #d6cfc3" }}>
            <div>
              <p style={{ fontSize: "0.62rem", color: EVERGREEN, fontWeight: 600, margin: 0 }}>Headwaters Development Services</p>
              <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0 }}>bobbie@ourheadwaters.ca · ourheadwaters.ca</p>
            </div>
            <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0, textAlign: "right" }}>
              Supplier reference — internal working document · May 2026<br />
              Prices reflect wholesale rates as of supplier lists on file
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
