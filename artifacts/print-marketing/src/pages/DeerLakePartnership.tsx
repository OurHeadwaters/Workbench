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
        paginate={true}
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
                <img src={`${base}eagle-mark.svg`} alt="Headwaters" style={{ width: "0.38in", height: "0.31in", objectFit: "contain", flexShrink: 0, opacity: 0.88 }} />
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
              <div style={{ background: RUST, borderRadius: "3px", padding: "0.03in 0.1in", marginBottom: "0.14in", display: "inline-block" }}>
                <p style={{ fontSize: "0.62rem", fontWeight: 800, color: CREAM, letterSpacing: "0.13em", textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>Who's at the table</p>
              </div>
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
              <div style={{ background: BLUE, borderRadius: "3px", padding: "0.03in 0.1in", marginBottom: "0.14in", display: "inline-block" }}>
                <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#fff", letterSpacing: "0.13em", textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>What we're applying to fund</p>
              </div>
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
              <div style={{ background: EVERGREEN, borderRadius: "3px", padding: "0.03in 0.1in", marginBottom: "0.14in", display: "inline-block" }}>
                <p style={{ fontSize: "0.62rem", fontWeight: 800, color: CREAM, letterSpacing: "0.13em", textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>The Route</p>
              </div>
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
            <div style={{ background: EVERGREEN, borderRadius: "3px", padding: "0.045in 0.14in", marginBottom: "0.16in", display: "inline-block" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, color: CREAM, letterSpacing: "0.13em", textTransform: "uppercase", margin: 0, lineHeight: 1.1 }}>What 2027 looks like for Deer Lake</p>
            </div>
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
            padding: "0.26in 0.65in 0.2in",
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

          {/* ── SUPPLIER GRID — store-department layout ── */}
          <div style={{ padding: "0.18in 0.65in 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.18in" }}>

            {(() => {
              const DEPT = (label: string) => (
                <div style={{ background: EVERGREEN, borderRadius: "3px", padding: "0.032in 0.1in", marginBottom: "0.07in", marginTop: 0 }}>
                  <p style={{ fontSize: "0.66rem", fontWeight: 800, color: CREAM, letterSpacing: "0.13em", textTransform: "uppercase", margin: 0, lineHeight: 1.1, fontFamily: "Inter, system-ui, sans-serif" }}>{label}</p>
                </div>
              );
              const S = (name: string, loc: string, note: string) => (
                <div key={name} style={{ marginBottom: "0.048in", paddingBottom: "0.048in", borderBottom: "1px solid #ede8e1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.57rem", color: INK, margin: 0, lineHeight: 1.2 }}>{name}</p>
                    <p style={{ fontSize: "0.46rem", color: MUTED, margin: 0, flexShrink: 0, marginLeft: "0.05in" }}>{loc}</p>
                  </div>
                  <p style={{ fontSize: "0.51rem", color: MUTED, margin: 0, lineHeight: 1.38 }}>{note}</p>
                </div>
              );

              return (<>
                {/* COL 1 — Fresh Perimeter + Coffee */}
                <div>
                  {DEPT("Produce")}
                  {S("Rockfront Family Farms", "Sioux Lookout", "Microgreens, sunflower/pea/fava shoots, radish blends. Grown to order weekly.")}
                  {S("DeBruin's Greenhouse", "Slate River", "Living lettuce, basil, cherry + grape tomatoes. No pesticides. Tue/Fri delivery included.")}
                  {S("Belluz Farms", "Thunder Bay", "Arugula, butterblend lettuce, scallions. Via Superior Seasons.")}
                  {S("Warner's Farm", "NWO", "Apples — Cortland, 2nds mixed, half-bushel. Via Superior Seasons.")}
                  {S("Matt Corbett Garlic Farm", "NWO", "Garlic. Local market channel.")}
                  {S("Edible Wilds", "Superior Seasons", "Wild-harvested leeks (ramps). Sustainable, seasonal.")}
                  {S("Lennox Farms", "Superior Seasons", "Forced pink rhubarb. Seasonal.")}

                  <div style={{ marginTop: "0.09in" }}>
                    {DEPT("Baking")}
                    {S("Emily's Bread", "Thunder Bay", "Sandwich bread, buns, tortillas, rye, Kaiser rolls. From $2.75/unit. Manitoulin Transport.")}
                    {S("Brûlée Creek Farms", "Kakabeka Falls", "Stone-ground flour (whole wheat, rye, sifted), cold-pressed canola oil, baking mixes. $6/unit.")}
                  </div>

                  <div style={{ marginTop: "0.09in" }}>
                    {DEPT("Beverages")}
                    {S("The Hub Roastery", "Sioux Lookout", "Small-batch, single-origin. 8 roasts. Wholesale $13.50/12oz, $27/2lb.")}
                    {S("Nautical Coffee", "Keewatin", "Off-grid houseboat roaster. 5 blends incl. decaf. $13.25/340g (min. 12 bags).")}
                    {S("Boreal Coffee", "NWO via 807", "6 products on the 807 Local Line weekly shop.")}
                    {S("Sap Sucker", "NWO", "Sparkling maple water. 5 flavours. $1.90/355ml can (case of 12).")}
                  </div>
                </div>

                {/* COL 2 — Meat, Fish, Dairy + Pantry */}
                <div>
                  {DEPT("Meat")}
                  {S("Black Barn Farms", "NWO via 807", "19 products on the 807 Local Line. Beef and proteins, weekly.")}
                  {S("Huber's Bavarian Meats", "NWO via 807", "18 products — deli meats, sausage, Bavarian specialties. Weekly on 807.")}
                  {S("Cloverbelt Country Meats", "Oxdrift (Hwy 17)", "Abattoir + butcher shop between Sioux Lookout & Dryden. Beef, pork, poultry.")}
                  {S("Walls' Pork Shop", "Oxdrift", "103-year-old family farm. Pork + fresh vegetables. No chemicals or preservatives.")}
                  {S("Zurbrigg Family Farm", "Oxdrift", "Mixed farm. Beef, lamb, and seasonal. zurbriggfamilyfarm.com")}

                  <div style={{ marginTop: "0.09in" }}>
                    {DEPT("Fish")}
                    {S("Eat the Fish", "Lake Superior / Nipigon", "Lake trout (boneless, skin-on) $14/lb. Whitefish (boneless, skin-off) $15/lb.")}
                  </div>

                  <div style={{ marginTop: "0.09in" }}>
                    {DEPT("Dairy")}
                    {S("Lock City Dairies", "Sault Ste. Marie → NWO", "Licensed Ontario distributor. Fluid milk (homo, 2%, 1%, skim), chocolate milk, butter, half & half. Sat. delivery near Dryden, $200/skid. School nutrition program participant.")}
                  </div>

                  <div style={{ marginTop: "0.09in" }}>
                    {DEPT("Pantry")}
                    {S("Big Lake Pasta", "NWO", "Fusilli, radiatore, creste di gallo. 350g retail or 5 lb food-service. $3.75/unit.")}
                    {S("Foraged North", "NWO via 807", "Wild rice salad kit, Hagens dressing, Busters Championship Seasoning. 10 products.")}
                  </div>
                </div>

                {/* COL 3 — The Shelves */}
                <div>
                  {DEPT("Sweets")}
                  {S("Canada West Maple", "Thunder Bay", "Pure maple syrup, blueberry maple, maple sugar, pancake mix. Wood-fired. From $7.50/200ml.")}
                  {S("Roy Sidders Maple Syrup", "NWO", "Local maple. Dryden / Oxdrift area markets.")}
                  {S("Eady's Honey", "NWO", "Local beekeeper. Area farmers' markets.")}

                  <div style={{ marginTop: "0.09in" }}>
                    {DEPT("Spices")}
                    {S("Thunder Oak Cheese", "NWO", "Gouda (mild, jalapeño, smoked, dill) + cheese curds. From $5.69/wedge.")}
                    {S("June & Jo Spice Co", "Thunder Bay", "Original, Sweet & Smokey, Hot & Spicy. GF crispy coating mix. $8.00/unit.")}
                    {S("Shumka Dust Spices", "NWO", "Artisan spice blends. Local market channel.")}
                    {S("Heartbeat Hot Sauce", "Thunder Bay", "12 varieties incl. Poirier's Louisiana Style + Lion's Mane Piri Piri. $8.25/bottle.")}
                    {S("Bucky's BBQ Blend", "NWO", "What's the Dill, Devils Dill, Lemon Pepper, Dill Garlic Parm + more. buckysbbqblend.com")}
                  </div>

                  <div style={{ marginTop: "0.09in" }}>
                    {DEPT("Boxes & Snacks")}
                    {S("Superior Bakes", "Thunder Bay", "Keto snacks & package mixes — protein balls, keto cups, pancake and cake mixes. GF options. From $2.25/unit.")}
                    {S("Parr's Jars", "NWO via 807", "Gourmet salt blends. Circular economy partner since 2020 — near-expiry botanicals transformed into shelf-stable value-added product. On the 807 Local Line.")}
                  </div>
                </div>
              </>);
            })()}

          </div>

          {/* ── HOW ORDERING WORKS ── */}
          <div style={{ padding: "0.14in 0.65in 0" }}>
            <div style={{ background: BLUE_SOFT, border: `1.5px solid ${BLUE}`, borderRadius: "6px", padding: "0.13in 0.22in", display: "flex", gap: "0.18in", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>
                <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.2rem", color: BLUE, margin: 0, lineHeight: 1 }}>↗</p>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.66rem", color: EVERGREEN, margin: "0 0 0.04in" }}>
                  Four supply channels — all already running
                </p>
                <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>
                  <strong style={{ color: INK }}>807 Local Line</strong> — weekly shop Thu–Mon, Dryden + Sioux Lookout deliveries, out-of-town pickup Thursdays 3–4pm. &nbsp;
                  <strong style={{ color: INK }}>Emily's Bread NWO order form</strong> — single order covers 8+ NWO producers, Tuesday Thunder Bay pickup → Wednesday Dryden delivery. &nbsp;
                  <strong style={{ color: INK }}>Superior Seasons</strong> — Thunder Bay online farmers' market, ordering opens Wed 5:30pm, closes Fri 4:30pm, Wed/Thu distribution. &nbsp;
                  <strong style={{ color: INK }}>Lock City Dairies</strong> — Saturday 4–6pm delivery to a meeting point near Dryden, 48ft trailer, $200/skid. &nbsp;
                  Folding Deer Lake in extends routes that are already moving.
                </p>
              </div>
            </div>
          </div>

          {/* ── FOOTER PAGE 2 ── */}
          <div style={{ marginTop: "auto", padding: "0.16in 0.65in 0.22in", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #d6cfc3" }}>
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

        {/* ═══════════════════════════════════════════════════════
            PAGE 3 — The Hotel Kitchen Problem
            ═══════════════════════════════════════════════════════ */}
        <div className="page-letter" id="pdf-page3" style={{ ...PAGE, marginTop: "0.25in" }}>

          {/* ── HEADER ── */}
          <div style={{ background: EVERGREEN, padding: "0.32in 0.65in 0.28in", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#a8c4a0", margin: "0 0 0.08in" }}>Five Years of Proof · Now Scaling North</p>
              <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "2.1rem", color: CREAM, margin: 0, lineHeight: 1.1, fontWeight: 400 }}>
                The Circular<br />
                <em style={{ fontStyle: "italic" }}>Kitchen</em>
              </h1>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.3in" }}>
              <img src={`${base}eagle-mark.svg`} alt="Headwaters" style={{ width: "0.55in", height: "0.46in", objectFit: "contain", marginLeft: "auto", marginBottom: "0.06in", opacity: 0.9, display: "block" }} />
              <p style={{ fontSize: "0.48rem", color: "#a8c4a0", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>Headwaters<br />Development Services</p>
            </div>
          </div>

          {/* ── FRAMING — 2 col ── */}
          <div style={{ padding: "0.3in 0.65in 0", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "0.3in" }}>
            <div>
              <div style={{ background: RUST, borderRadius: "3px", padding: "0.04in 0.12in", marginBottom: "0.12in", display: "inline-block" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 800, color: CREAM, letterSpacing: "0.13em", textTransform: "uppercase", margin: 0, lineHeight: 1.1 }}>Not a new idea</p>
              </div>
              <p style={{ fontSize: "0.68rem", color: INK, lineHeight: 1.65, margin: 0 }}>
                Since 2020, Headwaters has been running a live circular economy with <strong>Parr's Jars</strong> and <strong>807 Food Co-op</strong> — actively converting near-expiry and surplus goods into value-added products and keeping that money inside the NWO food network. Five years of real data. A model that works. The hotel kitchen is the next application of the same logic.
              </p>
            </div>
            <div style={{ background: EVERGREEN, borderRadius: "6px", padding: "0.2in 0.22in" }}>
              <p style={{ fontSize: "0.48rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#a8c4a0", fontWeight: 700, margin: "0 0 0.12in" }}>The economic math</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.1in" }}>
                <div style={{ borderLeft: "2px solid #a8c4a0", paddingLeft: "0.1in" }}>
                  <p style={{ fontSize: "0.58rem", color: CREAM, margin: 0, lineHeight: 1.5 }}><strong>Saving waste covers the cost</strong> of bringing better quality goods at better prices.</p>
                </div>
                <div style={{ borderLeft: "2px solid #a8c4a0", paddingLeft: "0.1in" }}>
                  <p style={{ fontSize: "0.58rem", color: CREAM, margin: 0, lineHeight: 1.5 }}><strong>Better purchasing power</strong> means more variety, less markup, more reliable supply.</p>
                </div>
                <div style={{ borderLeft: "2px solid #a8c4a0", paddingLeft: "0.1in" }}>
                  <p style={{ fontSize: "0.58rem", color: CREAM, margin: 0, lineHeight: 1.5 }}><strong>The surplus stays right there</strong> — in Deer Lake, not heading south with the freight bill.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── THE LOOP — three steps across full width ── */}
          <div style={{ padding: "0.3in 0.65in 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.2in" }}>

            {/* Step 1 */}
            <div style={{ background: "#fff", border: `1.5px solid #ddd8cf`, borderRadius: "6px", padding: "0.22in 0.24in" }}>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "2rem", color: EVERGREEN, margin: "0 0 0.1in", lineHeight: 1 }}>1</p>
              <p style={{ fontWeight: 700, fontSize: "0.68rem", color: EVERGREEN, margin: "0 0 0.08in" }}>Store flags what's moving slow</p>
              <p style={{ fontSize: "0.6rem", color: MUTED, margin: 0, lineHeight: 1.6 }}>
                Inventory software tracks sell-through by day. When greens, fish, or bread are approaching their rotation window, the system flags them — not as waste, but as an opportunity to redirect.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ background: "#fff", border: `1.5px solid #ddd8cf`, borderRadius: "6px", padding: "0.22in 0.24in" }}>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "2rem", color: EVERGREEN, margin: "0 0 0.1in", lineHeight: 1 }}>2</p>
              <p style={{ fontWeight: 700, fontSize: "0.68rem", color: EVERGREEN, margin: "0 0 0.08in" }}>Kitchen gets a "what to cook today" brief</p>
              <p style={{ fontSize: "0.6rem", color: MUTED, margin: 0, lineHeight: 1.6 }}>
                The hotel kitchen receives a practical suggestion — drawn from Headwaters' years of NWO recipe knowledge — that turns today's flagged inventory into breakfast, lunch specials, or a feature dish. No guesswork. No waste.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ background: "#fff", border: `1.5px solid #ddd8cf`, borderRadius: "6px", padding: "0.22in 0.24in" }}>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "2rem", color: EVERGREEN, margin: "0 0 0.1in", lineHeight: 1 }}>3</p>
              <p style={{ fontWeight: 700, fontSize: "0.68rem", color: EVERGREEN, margin: "0 0 0.08in" }}>Revenue stays in Deer Lake</p>
              <p style={{ fontSize: "0.6rem", color: MUTED, margin: 0, lineHeight: 1.6 }}>
                Guests eat local food, prepared well. The store moves inventory it would have marked down. The hotel kitchen has a daily menu built for them. The money circles — store, hotel, community — instead of leaking south.
              </p>
            </div>
          </div>

          {/* ── WHAT THIS LOOKS LIKE IN PRACTICE ── */}
          <div style={{ padding: "0.28in 0.65in 0" }}>
            <div style={{ background: RUST, borderRadius: "3px", padding: "0.045in 0.14in", marginBottom: "0.16in", display: "inline-block" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, color: CREAM, letterSpacing: "0.13em", textTransform: "uppercase", margin: 0, lineHeight: 1.1 }}>What this looks like in practice</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.16in" }}>

              {/* Example 1 */}
              <div style={{ borderLeft: `3px solid ${EVERGREEN}`, paddingLeft: "0.14in" }}>
                <p style={{ fontWeight: 700, fontSize: "0.63rem", color: INK, margin: "0 0 0.05in" }}>Microgreens & lake trout — Wednesday</p>
                <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>
                  Rockfront microgreens harvested Monday. By Wednesday sell-through is partial. System flags → kitchen gets: <em>"Lake trout fillet on a bed of pea shoots + radish blend, lemon butter."</em> It's on the lunch board by 11am.
                </p>
              </div>

              {/* Example 2 */}
              <div style={{ borderLeft: `3px solid ${EVERGREEN}`, paddingLeft: "0.14in" }}>
                <p style={{ fontWeight: 700, fontSize: "0.63rem", color: INK, margin: "0 0 0.05in" }}>Emily's bread — day 3 loaves</p>
                <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>
                  Sandwich loaves at day 3. System flags → kitchen gets: <em>"Thick-cut French toast with Warner's apple compote and Roy Sidders maple."</em> Saturday breakfast special — guests love it, store clears the shelf.
                </p>
              </div>

              {/* Example 3 */}
              <div style={{ borderLeft: `3px solid ${EVERGREEN}`, paddingLeft: "0.14in" }}>
                <p style={{ fontWeight: 700, fontSize: "0.63rem", color: INK, margin: "0 0 0.05in" }}>Rhubarb in season — Superior Seasons order</p>
                <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>
                  Lennox Farms forced rhubarb arrives in quantity. System flags surplus → kitchen gets: <em>"Rhubarb compote for oatmeal station. Rhubarb crumble for dinner dessert."</em> Two uses, one delivery, zero waste.
                </p>
              </div>

              {/* Example 4 */}
              <div style={{ borderLeft: `3px solid ${EVERGREEN}`, paddingLeft: "0.14in" }}>
                <p style={{ fontWeight: 700, fontSize: "0.63rem", color: INK, margin: "0 0 0.05in" }}>Walls' pork — mixed cuts</p>
                <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>
                  A whole-animal order includes cuts that move slower at retail. System flags → kitchen gets: <em>"Pork shoulder hash for Saturday breakfast. House-made sausage patties for the week."</em> Butcher shop math works out.
                </p>
              </div>
            </div>
          </div>

          {/* ── WHY HEADWATERS CAN DO THIS ── */}
          <div style={{ padding: "0.28in 0.65in 0" }}>
            <div style={{ background: BLUE_SOFT, border: `1.5px solid ${BLUE}`, borderRadius: "6px", padding: "0.2in 0.28in" }}>
              <p style={{ fontWeight: 700, fontSize: "0.68rem", color: EVERGREEN, margin: "0 0 0.1in" }}>What makes this different from a grant proposal — it's already running</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.18in" }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.6rem", color: INK, margin: "0 0 0.05in" }}>Five years of live data</p>
                  <p style={{ fontSize: "0.57rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>The Parr's Jars + 807 circular model has been running since 2020. What converts, what doesn't, what the community buys, what needs a second life — all of that is documented and informing the Deer Lake build.</p>
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.6rem", color: INK, margin: "0 0 0.05in" }}>NWO recipe knowledge, producer by producer</p>
                  <p style={{ fontSize: "0.57rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>We know what Rockfront microgreens do on a plate. We know how Emily's day-3 bread performs in a French toast. The recipe library is built from real experience with this exact supply chain — not food-service theory.</p>
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.6rem", color: INK, margin: "0 0 0.05in" }}>Software turns the model into a daily habit</p>
                  <p style={{ fontSize: "0.57rem", color: MUTED, margin: 0, lineHeight: 1.55 }}>The inventory and kitchen brief tools are being built on top of the same co-op platform. The data already flows — the kitchen brief is one more output from what the system already tracks. No extra effort required.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── THE BIGGER POINT ── */}
          <div style={{ padding: "0.28in 0.65in 0" }}>
            <div style={{ borderTop: `2px solid ${EVERGREEN}`, paddingTop: "0.2in" }}>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "1.15rem", color: EVERGREEN, margin: "0 0 0.1in", lineHeight: 1.3, fontWeight: 400 }}>
                "Saving the food waste is what covers getting more quality goods at better prices — with money to spare that stays right there."
              </p>
              <p style={{ fontSize: "0.6rem", color: MUTED, margin: 0, lineHeight: 1.65, maxWidth: "5.8in" }}>
                This is the core of what Headwaters has learned since 2020: waste recovery is not a cleanup problem, it's a purchasing strategy. Every dollar recovered from a near-expiry item is a dollar that funds the next delivery of something better. The hotel kitchen is the easy button for Deer Lake — a daily, practical mechanism that every guest sees on a plate and every community member sees in the store's prices. The same logic extends to the school, to catering, to seasonal events. The system gets smarter every time it runs.
              </p>
            </div>
          </div>

          {/* ── FOOTER PAGE 3 ── */}
          <div style={{ marginTop: "auto", padding: "0.28in 0.65in 0.38in", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #d6cfc3" }}>
            <div>
              <p style={{ fontSize: "0.62rem", color: EVERGREEN, fontWeight: 600, margin: 0 }}>Headwaters Development Services</p>
              <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0 }}>bobbie@ourheadwaters.ca · ourheadwaters.ca</p>
            </div>
            <p style={{ fontSize: "0.58rem", color: MUTED, margin: 0, textAlign: "right" }}>
              Prepared for Deer Lake First Nation · May 2026<br />
              Headwaters is coordinating on behalf of the 807 partnership
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
