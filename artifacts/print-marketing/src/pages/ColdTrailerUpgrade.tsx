import { PrintNav } from "../components/PrintNav";
import QRCodeStamp from "../components/QRCodeStamp";

const scopeItems = [
  {
    id: "01",
    title: "Air Conditioners — Units",
    detail: "2× CoolBot-compatible window ACs sourced from Rona or Home Depot (same model both units). Only one runs at a time — the second is on-deck for any failure. Confirm model with CoolBot compatibility list before purchase.",
    type: "Materials",
  },
  {
    id: "02",
    title: "Air Conditioner Installation",
    detail: "Secure mounting of both units into trailer wall/roof openings. Seal and insulate penetrations. Wire or hardwire as required. Test CoolBot integration on both units before sign-off.",
    type: "Labour",
  },
  {
    id: "03",
    title: "Exterior AC Covers",
    detail: "Protective covers for both AC units — must withstand highway speeds in winter. Confirm fit before ordering. Covers protect coils and housing from road blast and debris.",
    type: "Materials",
  },
  {
    id: "04",
    title: "Heater — Unit & Install",
    detail: "Safe heater installation rated for confined/insulated space. Temperature gauge positioned for easy reading from door. Wiring must meet applicable code for the application. Test at operating temperature range before delivery.",
    type: "Materials + Labour",
  },
  {
    id: "05",
    title: "807 Branding Decals",
    detail: "Remove existing Parr's Jars decals and apply 807 Food Co-op branding. Proofs to be supplied by Bobbie — confirm artwork specs and substrate before ordering. Includes surface prep and application.",
    type: "Materials + Labour",
  },
  {
    id: "06",
    title: "Paint Touch-Ups",
    detail: "Wheel wells and any bare, rusted, or chipped areas. Match existing trailer colour or coat wheel wells in durable undercoat. Light surface prep and spot prime where needed.",
    type: "Materials + Labour",
  },
  {
    id: "07",
    title: "Hitch TLC + Lights Inspection",
    detail: "Lubricate hitch mechanism, ball, and coupler. Inspect and test all running lights, brake lights, and turn signals. Replace any blown bulbs or corroded connections. Confirm trailer is road-ready.",
    type: "Labour + Materials",
  },
  {
    id: "08",
    title: "Interior Flooring — Decision Pending",
    detail: "Rubber drainage mats from the food hub (already on hand, no cost) are the lead option — holes drain liquid through, loose-lay so they can be pulled up and hosed off. Shelf installation optional if desired.",
    type: "Pending Decision",
  },
];

function buildPlainText() {
  const lines: string[] = [
    "807 FOOD CO-OP — COLD TRAILER UPGRADE",
    "Contracted through Headwaters Development Services",
    "Subcontractor: Tyler — Rockfront Family Farms",
    "Total Budget: $9,995 (all-in: materials + Tyler's time)",
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
    lines.push(`${item.id}. ${item.title} [${item.type}]`);
    lines.push(item.detail);
    lines.push("");
  });

  lines.push("---");
  lines.push("");
  lines.push("FLOORING — DECISION REQUIRED");
  lines.push("");
  lines.push("Option A — Food hub drainage mats (lead option, no cost):");
  lines.push("Rubber kitchen mats with holes, already at the food hub. Liquid drains through.");
  lines.push("Loose-lay — pull up and hose off after a spill.");
  lines.push("");
  lines.push("Option B — Leave plywood:");
  lines.push("Assess condition, seal edges, confirm structure. Can be mopped and dried.");
  lines.push("");
  lines.push("Option C — Vinyl sheet (not recommended):");
  lines.push("Moisture trapped underneath creates mold in seasonal/stored trailers.");
  lines.push("");
  lines.push("Shelf installation is an optional add-on.");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("TRACKING");
  lines.push("Tyler tracks time and receipts directly with Bobbie.");
  lines.push("Budget: $9,995 total. Tyler sets his own rate. Spend tracked as work proceeds.");
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

      <div id="pdf-target" className="print-page page-letter" style={{ fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column", gap: "0.6rem" }}>

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
        <div style={{ borderBottom: "2px solid var(--rust)", paddingBottom: "0.35rem" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", fontWeight: 700, color: "var(--evergreen)", lineHeight: 1.1, marginBottom: "0.15rem" }}>
            Cold Trailer Upgrade
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", fontStyle: "italic", color: "var(--rust)" }}>
            Fully operational cold trailer for all seasons.
          </p>
        </div>

        {/* Budget bar — single box */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.8rem", alignItems: "center", background: "var(--evergreen)", borderRadius: 5, padding: "0.5rem 0.75rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244,237,224,0.65)", marginBottom: "0.1rem" }}>Total Budget</p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 900, color: "white", lineHeight: 1 }}>$9,995</p>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", color: "rgba(244,237,224,0.75)", lineHeight: 1.55 }}>
            All-in budget covering materials and Tyler's time. Tyler sets his own hourly rate and tracks spend as work proceeds — time and receipts submitted directly to Bobbie. Budget stretches as far as it goes.
          </p>
        </div>

        {/* Scope table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <thead>
            <tr style={{ background: "var(--evergreen)", color: "white" }}>
              <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.5rem", textAlign: "left", width: "4%" }}>#</th>
              <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.5rem", textAlign: "left", width: "24%" }}>Item</th>
              <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.5rem", textAlign: "left" }}>Detail</th>
              <th style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.5rem", textAlign: "center", width: "14%" }}>Type</th>
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
                rec: "Lead option — no cost",
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
            Confirm quantity and dimensions of food hub mats cover the trailer floor before deciding. Shelf installation (existing unit) is an optional add-on.
          </p>
        </div>

        {/* Tracking note */}
        <div style={{ background: "rgba(31,61,46,0.06)", border: "1px solid rgba(31,61,46,0.15)", borderRadius: 4, padding: "0.4rem 0.6rem", fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--muted)", lineHeight: 1.55 }}>
          <strong style={{ color: "var(--evergreen)" }}>Tracking: </strong>
          Tyler submits time and receipts directly with Bobbie as work proceeds. Rate set by Tyler. Decal artwork to be supplied by Bobbie before ordering. CoolBot AC model to be confirmed against compatibility list before purchase.
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
