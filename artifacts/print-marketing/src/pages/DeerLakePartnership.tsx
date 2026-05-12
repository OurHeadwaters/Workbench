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

          {/* ── SUPPLIER GRID — 3 columns ── */}
          <div style={{ padding: "0.3in 0.65in 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.2in" }}>

            {(() => {
              const CAT = (label: string) => (
                <p style={{ fontSize: "0.46rem", letterSpacing: "0.16em", textTransform: "uppercase", color: RUST, fontWeight: 700, marginBottom: "0.1in", marginTop: 0 }}>{label}</p>
              );
              const S = (name: string, loc: string, note: string) => (
                <div key={name} style={{ marginBottom: "0.09in", paddingBottom: "0.09in", borderBottom: "1px solid #e8e2d8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.6rem", color: INK, margin: 0, lineHeight: 1.2 }}>{name}</p>
                    <p style={{ fontSize: "0.5rem", color: MUTED, margin: 0, flexShrink: 0, marginLeft: "0.06in" }}>{loc}</p>
                  </div>
                  <p style={{ fontSize: "0.55rem", color: MUTED, margin: 0, lineHeight: 1.4 }}>{note}</p>
                </div>
              );

              return (<>
                {/* COL 1 */}
                <div>
                  {CAT("Pantry & Dry Goods")}
                  {S("Emily's Bread", "Thunder Bay", "Bread, buns, tortillas, rye. From $2.75/unit. Ships via Manitoulin Transport.")}
                  {S("Brûlée Creek Farms", "Kakabeka Falls", "Stone-ground flour (whole wheat, rye, sifted), cold-pressed canola oil, baking mixes. $6/unit.")}
                  {S("Big Lake Pasta", "NWO", "Fusilli, radiatore, creste di gallo — 350g bags or 5 lb food-service. $3.75/unit.")}

                  <div style={{ marginTop: "0.14in" }}>
                    {CAT("Coffee & Beverages")}
                    {S("The Hub Roastery", "Sioux Lookout", "8 single-origin roasts, small-batch. Wholesale $13.50/12oz, $27/2lb.")}
                    {S("Nautical Coffee", "Keewatin", "Off-grid houseboat roaster. 5 blends incl. decaf. $13.25/340g (min. 12 bags).")}
                    {S("Boreal Coffee", "NWO via 807", "On the 807 Local Line weekly shop. 6 products available.")}
                    {S("Sap Sucker", "NWO", "Sparkling maple water — 5 flavours. $1.90/355ml can (case of 12).")}
                  </div>
                </div>

                {/* COL 2 */}
                <div>
                  {CAT("Meat & Protein")}
                  {S("Black Barn Farms", "NWO via 807", "19 products on the 807 Local Line. Beef and proteins, weekly availability.")}
                  {S("Huber's Bavarian Meats", "NWO via 807", "18 products — deli, sausage, Bavarian specialties. Weekly on the 807 Local Line.")}
                  {S("Cloverbelt Country Meats", "Oxdrift (Hwy 17)", "Abattoir + butcher shop, between Sioux Lookout & Dryden. Beef, pork, poultry.")}
                  {S("Eat the Fish", "Lake Superior / Nipigon", "Lake trout (boneless, skin-on) $14/lb. Whitefish (boneless, skin-off) $15/lb.")}

                  <div style={{ marginTop: "0.14in" }}>
                    {CAT("Dairy")}
                    {S("Lock City Dairies", "Sault Ste. Marie → NWO", "Licensed Ontario distributor. Fluid milk, chocolate milk, butter, half & half. Delivers to Thunder Bay and Northwestern Ontario. School nutrition program participant.")}
                  </div>
                </div>

                {/* COL 3 */}
                <div>
                  {CAT("Specialty & Condiments")}
                  {S("Canada West Maple", "Thunder Bay", "Pure maple syrup, blueberry maple, maple sugar, pancake mix. Wood-fired. From $7.50/200ml.")}
                  {S("Thunder Oak Cheese", "NWO", "Gouda (mild, jalapeño, smoked, dill) + cheese curds. From $5.69/wedge (case of 12).")}
                  {S("June & Jo Spice Co", "Thunder Bay", "Original, Sweet & Smokey, Hot & Spicy. GF crispy coating mix. $8.00/unit.")}
                  {S("Heartbeat Hot Sauce", "Thunder Bay", "12 varieties incl. Poirier's Louisiana Style + Lion's Mane Piri Piri. $8.25/bottle.")}
                  {S("Bucky's BBQ Blend", "NWO", "Spice blends: What's the Dill, Devils Dill, Lemon Pepper, Dill Garlic Parm and more. buckysbbqblend.com")}
                  {S("Foraged North", "NWO via 807", "Wild rice salad kit, Hagens salad dressing, Busters Championship Seasoning. 10 products on 807 Local Line.")}

                  <div style={{ marginTop: "0.14in" }}>
                    {CAT("Fresh & Seasonal")}
                    {S("Rockfront Family Farms", "Sioux Lookout", "Microgreens, shoots (sunflower, pea, fava), radish blends. Grown to order weekly.")}
                    {S("DeBruin's Greenhouse", "Slate River", "Living lettuce & basil, cherry tomatoes. No pesticides. Tue/Fri delivery, cost included.")}
                    {S("Belluz Farms / Superior Seasons", "Thunder Bay", "Arugula, scallions, butterblend lettuce, seasonal greens. Via Superior Seasons online market.")}
                    {S("Superior Bakes", "Thunder Bay", "Protein balls, keto baked goods, cake mixes. GF options. From $2.25/unit.")}
                    {S("Parr's Jars", "NWO via 807", "Preserved goods on the 807 Local Line. 4 products.")}
                  </div>
                </div>
              </>);
            })()}

          </div>

          {/* ── HOW ORDERING WORKS ── */}
          <div style={{ padding: "0.2in 0.65in 0" }}>
            <div style={{ background: BLUE_SOFT, border: `1.5px solid ${BLUE}`, borderRadius: "6px", padding: "0.18in 0.26in", display: "flex", gap: "0.22in", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.2rem", color: BLUE, margin: 0, lineHeight: 1 }}>↗</p>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.66rem", color: EVERGREEN, margin: "0 0 0.04in" }}>
                  Three ordering systems — all already running
                </p>
                <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0, lineHeight: 1.5 }}>
                  <strong style={{ color: INK }}>807 Local Line</strong> — weekly shop (Thu–Mon), Dryden + Sioux Lookout deliveries, out-of-town pickup Thursdays. &nbsp;
                  <strong style={{ color: INK }}>Emily's Bread NWO order form</strong> — one order covers 8+ NWO producers, Tuesday Thunder Bay pickup → Wednesday Dryden delivery. &nbsp;
                  <strong style={{ color: INK }}>Superior Seasons</strong> — Thunder Bay online farmers' market, producer-direct, Wed/Thu distribution. &nbsp;Folding Deer Lake in extends routes that are already moving.
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
              Based on 2024 research. Prices and availability subject to change.<br />
              Full verification requires a paid engagement.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
