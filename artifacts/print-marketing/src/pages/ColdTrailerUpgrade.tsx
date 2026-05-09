import { PrintNav } from "../components/PrintNav";
import QRCodeStamp from "../components/QRCodeStamp";

const scopeItems = [
  {
    id: "01",
    title: "Air Conditioners — Units",
    detail: "2× CoolBot-compatible window ACs sourced from Rona or Home Depot (same model both units). Only one runs at a time — the second is on-deck for any failure. Confirm model with CoolBot compatibility list before purchase.",
    type: "Materials",
    budget: "$900 – $1,100",
  },
  {
    id: "02",
    title: "Air Conditioner Installation",
    detail: "Secure mounting of both units into trailer wall/roof openings. Seal and insulate penetrations. Wire or hardwire as required. Test CoolBot integration on both units before sign-off.",
    type: "Labour",
    budget: "$600 – $800",
  },
  {
    id: "03",
    title: "Exterior AC Covers",
    detail: "Protective covers for both AC units — must withstand highway speeds in winter. Confirm fit before ordering. Covers protect coils and housing from road blast and debris.",
    type: "Materials",
    budget: "$250 – $350",
  },
  {
    id: "04",
    title: "Heater — Unit & Install",
    detail: "Safe heater installation rated for confined/insulated space. Temperature gauge positioned for easy reading from door. Wiring must meet applicable code for the application. Test at operating temperature range before delivery.",
    type: "Materials + Labour",
    budget: "$700 – $950",
  },
  {
    id: "05",
    title: "807 Branding Decals",
    detail: "Remove existing Parr's Jars decals and apply 807 Food Co-op branding. Proofs to be supplied by Bobbie — confirm artwork specs and substrate before ordering. Includes surface prep and application.",
    type: "Materials + Labour",
    budget: "$600 – $900",
  },
  {
    id: "06",
    title: "Paint Touch-Ups",
    detail: "Wheel wells and any bare, rusted, or chipped areas. Match existing trailer colour or coat wheel wells in durable undercoat. Light surface prep and spot prime where needed.",
    type: "Materials + Labour",
    budget: "$350 – $500",
  },
  {
    id: "07",
    title: "Hitch TLC + Lights Inspection",
    detail: "Lubricate hitch mechanism, ball, and coupler. Inspect and test all running lights, brake lights, and turn signals. Replace any blown bulbs or corroded connections. Confirm trailer is road-ready.",
    type: "Labour + Materials",
    budget: "$150 – $250",
  },
  {
    id: "08",
    title: "Interior Flooring — Decision Pending",
    detail: "See flooring note below. Budget held pending decision. Rubber drainage mats from the food hub (no cost) are the current lead option. Shelf installation included here if elected.",
    type: "Pending Decision",
    budget: "$0 – $800",
  },
];

const totalLow = 3550;
const totalHigh = 5250;
const budget = 9995;
const contingency = budget - totalHigh;

function buildPlainText() {
  const lines: string[] = [
    "807 FOOD CO-OP — COLD TRAILER UPGRADE",
    "Contracted through Headwaters Development Services",
    "Subcontractor: Tyler — Rockfront Family Farms",
    `Total Budget: $${budget.toLocaleString()}`,
    "",
    "OUTCOME",
    "Fully operational cold trailer for all seasons.",
    "",
    "---",
    "",
    "SCOPE OF WORK",
    "",
  ];

  scopeItems.forEach((item) => {
    lines.push(`${item.id}. ${item.title} [${item.type}] — Est. ${item.budget}`);
    lines.push(item.detail);
    lines.push("");
  });

  lines.push("---");
  lines.push("");
  lines.push("FLOORING DECISION NOTE");
  lines.push("");
  lines.push("Option A — Food hub drainage mats (RECOMMENDED, $0): Rubber kitchen mats with holes,");
  lines.push("already on hand at the food hub. Liquid drains through the holes rather than pooling.");
  lines.push("Loose-lay, so they can be pulled up and hosed off after a spill. No cost, no moisture");
  lines.push("trap, easy to clean. Confirm quantity and dimensions cover the trailer floor.");
  lines.push("");
  lines.push("Option B — Leave plywood: Assess condition, seal edges, confirm structure. Spills");
  lines.push("can be mopped and dried. No trapped moisture. Harder to clean a full bottle break.");
  lines.push("");
  lines.push("Option C — Vinyl sheet flooring: Easy to clean surface, but moisture that gets");
  lines.push("underneath cannot escape — creates mold and must risk in seasonal/stored trailers.");
  lines.push("Not recommended unless edges can be perfectly sealed.");
  lines.push("");
  lines.push("Shelf installation: Optional add-on. Confirm dimensions and mounting method.");
  lines.push("Include if desired within budget.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("BUDGET NOTE");
  lines.push("The $9,995 total covers everything: materials AND Tyler's labour (Rockfront Family Farms).");
  lines.push("Tyler invoices Headwaters directly. All receipts to be submitted to Bobbie Parr.");
  lines.push("");
  lines.push(`BUDGET SUMMARY`);
  lines.push(`Total Budget: $${budget.toLocaleString()} (materials + Tyler's labour, all-in)`);
  lines.push(`Estimated Scope: $${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}`);
  lines.push(`Contingency / Remaining: ~$${contingency.toLocaleString()} (covers flooring decision + overages)`);
  lines.push("");
  lines.push("All receipts to Bobbie Parr on completion. Decal artwork supplied by Bobbie — confirm specs before ordering.");
  lines.push("CoolBot AC model to be confirmed against compatibility list before purchase.");
  lines.push("");
  lines.push("---");
  lines.push("Headwaters Development Services");
  lines.push("bobbie@ourheadwaters.ca · ourheadwaters.ca");

  return lines.join("\n");
}

export default function ColdTrailerUpgrade() {
  return (
    <>
      <PrintNav targetId="pdf-target" filename="807-cold-trailer-upgrade.pdf" onCopyPlainText={buildPlainText} />

      <div id="pdf-target" className="print-page page-letter" style={{ fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column", gap: "0.55rem" }}>

        {/* Header band */}
        <div style={{ background: "var(--evergreen)", margin: "-0.5in -0.6in 0", padding: "0.45rem 0.6in", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,237,224,0.65)", marginBottom: "0.1rem" }}>
              Headwaters Development Services — Subcontract Work Order
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,237,224,0.85)" }}>
              Client: 807 Food Co-op · Subcontractor: Tyler — Rockfront Family Farms
            </p>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", color: "rgba(244,237,224,0.5)", letterSpacing: "0.08em" }}>
            2026
          </p>
        </div>

        {/* Title block */}
        <div style={{ borderBottom: "2px solid var(--rust)", paddingBottom: "0.35rem", marginBottom: "0.1rem" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.1, marginBottom: "0.15rem" }}>
            Cold Trailer Upgrade
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontStyle: "italic", color: "var(--rust)" }}>
            Fully operational cold trailer for all seasons. Scope, needs, and budget — $9,995 total.
          </p>
        </div>

        {/* Budget summary bar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.2rem", marginBottom: "0.1rem" }}>
          <div style={{ background: "var(--evergreen)", borderRadius: 5, padding: "0.4rem 0.6rem" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,237,224,0.65)", marginBottom: "0.15rem" }}>Total Budget</p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$9,995</p>
          </div>
          <div style={{ background: "var(--cream)", border: "1.5px solid var(--evergreen)", borderRadius: 5, padding: "0.4rem 0.6rem" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.15rem" }}>Estimated Scope</p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 900, color: "var(--evergreen)", lineHeight: 1 }}>${totalLow.toLocaleString()} – ${totalHigh.toLocaleString()}</p>
          </div>
          <div style={{ background: "var(--cream)", border: "1.5px solid rgba(31,61,46,0.2)", borderRadius: 5, padding: "0.4rem 0.6rem" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.15rem" }}>Contingency / Remaining</p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 900, color: "var(--muted)", lineHeight: 1 }}>~${contingency.toLocaleString()}</p>
          </div>
        </div>

        {/* Scope table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <thead>
            <tr style={{ background: "var(--evergreen)", color: "white" }}>
              <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.5rem", textAlign: "left", width: "3%" }}>#</th>
              <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.5rem", textAlign: "left", width: "22%" }}>Item</th>
              <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.5rem", textAlign: "left" }}>Detail</th>
              <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.5rem", textAlign: "center", width: "12%" }}>Type</th>
              <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.5rem", textAlign: "right", width: "14%" }}>Est. Budget</th>
            </tr>
          </thead>
          <tbody>
            {scopeItems.map((item, i) => (
              <tr key={item.id} style={{ background: i % 2 === 0 ? "white" : "var(--cream)", verticalAlign: "top" }}>
                <td style={{ padding: "0.35rem 0.5rem", fontFamily: "var(--font-sans)", fontSize: "0.68rem", color: "var(--muted)", fontWeight: 600 }}>{item.id}</td>
                <td style={{ padding: "0.35rem 0.5rem", fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.78rem", color: "var(--ink)", lineHeight: 1.3 }}>{item.title}</td>
                <td style={{ padding: "0.35rem 0.5rem", fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.45 }}>{item.detail}</td>
                <td style={{ padding: "0.35rem 0.5rem", textAlign: "center" }}>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    padding: "0.1rem 0.35rem",
                    borderRadius: 3,
                    background: item.type === "Pending Decision" ? "rgba(184,90,62,0.12)" : "rgba(31,61,46,0.1)",
                    color: item.type === "Pending Decision" ? "var(--rust)" : "var(--evergreen)",
                  }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: "0.35rem 0.5rem", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.78rem", textAlign: "right", color: item.type === "Pending Decision" ? "var(--rust)" : "var(--ink)" }}>{item.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Flooring decision note */}
        <div style={{ background: "rgba(184,90,62,0.07)", border: "1.5px solid rgba(184,90,62,0.3)", borderRadius: 5, padding: "0.45rem 0.6rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--rust)", fontWeight: 700, marginBottom: "0.3rem" }}>
            Flooring — Decision Required Before Work Begins
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem" }}>
            {[
              {
                label: "A — Food Hub Drainage Mats",
                body: "Rubber kitchen mats with holes, already on hand at the food hub. Liquid drains through rather than pooling. Loose-lay — pull up and hose off after a spill. No cost, no moisture trap.",
                rec: "Recommended — $0",
                highlight: true,
              },
              {
                label: "B — Leave Plywood",
                body: "Assess condition, seal edges, confirm structure. No trapped moisture. Can be mopped and dried. Harder to clean a full bottle break but manageable.",
                rec: "Lower risk",
                highlight: false,
              },
              {
                label: "C — Vinyl Sheet",
                body: "Easy to clean surface but moisture underneath cannot escape — creates mold and must in seasonal/stored trailers. Not recommended unless edges are perfectly sealed.",
                rec: "Not recommended",
                highlight: false,
              },
            ].map((opt) => (
              <div key={opt.label} style={{ background: opt.highlight ? "rgba(31,61,46,0.06)" : "white", border: opt.highlight ? "1.5px solid var(--evergreen)" : "none", borderRadius: 3, padding: "0.3rem 0.4rem" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700, color: opt.highlight ? "var(--evergreen)" : "var(--ink)", marginBottom: "0.15rem" }}>{opt.label}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "var(--muted)", lineHeight: 1.4, marginBottom: "0.2rem" }}>{opt.body}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 600, color: opt.highlight ? "var(--evergreen)" : "var(--rust)" }}>{opt.rec}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "var(--muted)", marginTop: "0.3rem" }}>
            Confirm quantity and dimensions of food hub mats cover the trailer floor before deciding. Shelf installation (existing unit) is an optional add-on — include if desired within remaining budget.
          </p>
        </div>

        {/* Budget note + Terms strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem" }}>
          <div style={{ background: "rgba(31,61,46,0.07)", borderRadius: 4, padding: "0.35rem 0.55rem", fontSize: "0.68rem", color: "var(--muted)", lineHeight: 1.5, fontFamily: "var(--font-sans)" }}>
            <strong style={{ color: "var(--evergreen)" }}>Budget covers everything: </strong>
            The $9,995 total includes both materials and Tyler's labour (Rockfront Family Farms). Tyler invoices Headwaters directly. No separate labour quote needed.
          </div>
          <div style={{ background: "var(--cream)", borderRadius: 4, padding: "0.35rem 0.55rem", fontSize: "0.68rem", color: "var(--muted)", lineHeight: 1.5, fontFamily: "var(--font-sans)" }}>
            <strong style={{ color: "var(--evergreen)" }}>Notes: </strong>
            All receipts to Bobbie Parr on completion. Decal artwork supplied by Bobbie — confirm specs and substrate before ordering. CoolBot AC model to be confirmed against compatibility list before purchase.
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(31,61,46,0.18)", paddingTop: "0.35rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 600, color: "var(--evergreen)", marginBottom: "0.03rem" }}>
              Headwaters Development Services
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)" }}>
              bobbie@ourheadwaters.ca · ourheadwaters.ca
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "var(--muted)", textAlign: "right" }}>
              807 Food Co-op · Cold Trailer Project
            </p>
            <QRCodeStamp />
          </div>
        </div>

      </div>
    </>
  );
}
