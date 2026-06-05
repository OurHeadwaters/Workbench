import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

function buildPlainText(): string {
  return [
    "THE 3-LAYER NORTHERN PANTRY",
    "Parr's Jars · Wabigoon, Ontario · parrsjars.ca",
    "",
    "A printable system for building a real northern pantry — not a stockpile, not a prepper cache.",
    "Three layers you build in order. Start with Layer 1.",
    "",
    "---",
    "",
    "LAYER 1 — THE JAR KITCHEN (ZONE 0)",
    "Your active pantry. The food you eat every week.",
    "",
    "What belongs here:",
    "· Preserved and canned goods you made yourself",
    "· Grains, legumes, oils in active rotation",
    "· Root cellar basics: squash, potatoes, carrots, onions",
    "· Ferments at active stage (kraut, kvass, brine pickles)",
    "",
    "The rotation rule: first in, first out. If you can't see the back of the shelf, it isn't rotating.",
    "Label every jar with contents + date. No exceptions.",
    "",
    "THIS WEEK'S ACTION — LAYER 1:",
    "Do a pantry audit. Pull everything off one shelf. Note what's expired or forgotten.",
    "That number is your baseline. Write it down.",
    "",
    "---",
    "",
    "LAYER 2 — THE STANDBY ROOM (ZONE 1)",
    "Dry storage and the freezer system. The layer that carries you through a bad month.",
    "",
    "What belongs here:",
    "· Whole grains in sealed containers (rice, oats, wheat berries, barley)",
    "· Legumes — dried, not canned (last longer, take less space)",
    "· Dehydrated and freeze-dried produce",
    "· Fats with long shelf life: coconut oil, ghee, lard in sealed jars",
    "· Honey, maple syrup, salt, vinegar — the preservation infrastructure",
    "· Freezer: meat in dated vacuum bags, blanched vegetables, broth in 1-qt containers",
    "",
    "The freezer rule: freeze in meal-sized portions. If you're thawing a whole roast to use 200g, the system is wrong.",
    "",
    "THIS WEEK'S ACTION — LAYER 2:",
    "Open your freezer and take a full inventory. Sort by type, note the dates.",
    "Anything older than 12 months goes into this week's meals — today, not eventually.",
    "",
    "---",
    "",
    "LAYER 3 — THE 72-HOUR EXIT LAYER (ZONE 2)",
    "Two packs. Ready to go. The rule about when to open them.",
    "",
    "PACK A — Grab and Go (under 2 kg):",
    "· 72-hour food for one person: bars, nuts, jerky, instant oats",
    "· Water purification: tablets + collapsible filter",
    "· Small first aid kit + any prescription meds (30-day supply minimum)",
    "· Cash — small bills",
    "· Copies of documents: ID, insurance, land title, prescriptions",
    "· Phone charger + backup battery",
    "· Hand warmers (northern Ontario specific — always)",
    "· Emergency contact card (written, not digital)",
    "",
    "PACK B — 72-Hour Household (per person):",
    "· 3 days of real food — not just bars",
    "· Water: 4L per person per day minimum",
    "· Camp stove + fuel",
    "· Blankets or sleeping bags rated to -20°C",
    "· Flashlights, headlamps, batteries",
    "· Multi-tool, duct tape, paracord",
    "· Ice fishing auger or hand saw (if you're near water in winter)",
    "· Backup medication — for remote distance, 7-day supply not 3",
    "· Dog food and supplies if applicable",
    "",
    "THE RULE ABOUT WHEN TO OPEN THEM:",
    "\"You open Pack A when the decision to leave has been made.",
    " You open Pack B when you don't know when you're coming back.\"",
    "Do not open them to see what's inside. Check them instead — twice a year, on the same day you change the smoke alarm batteries.",
    "",
    "SPIRKO REDUNDANCY RULE:",
    "\"One is none. Two is one.\"",
    "Every critical system in your pantry needs a backup: two water filters, two fire starters, two ways to heat food.",
    "If one item failing means the whole layer fails, you have a single point of failure. Fix it now.",
    "",
    "---",
    "",
    "Download more resources and the full product line at:",
    "parrsjars.ca · ourheadwaters.ca/headwaters/start",
  ].join("\n");
}

export default function NorthernPantryPrintable() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="northern-pantry-printable.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{
          padding: 0,
          overflow: "hidden",
          background: "var(--cream)",
          minHeight: "11in",
        }}
      >
        <div
          style={{
            position: "relative",
            minHeight: "11in",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "var(--evergreen)",
              padding: "0.32in 0.6in 0.28in",
              flexShrink: 0,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.55rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(244,237,224,0.5)",
                marginBottom: "0.08rem",
              }}
            >
              Parr's Jars · Wabigoon, Ontario · parrsjars.ca
            </p>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.9rem",
                fontWeight: 900,
                color: "var(--cream)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "0.06rem",
              }}
            >
              The 3-Layer Northern Pantry
            </h1>
            <div
              style={{
                width: "1.6in",
                height: 2,
                background: "var(--rust)",
                margin: "0.1rem 0 0.14rem",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.76rem",
                fontStyle: "italic",
                color: "rgba(244,237,224,0.72)",
                lineHeight: 1.45,
              }}
            >
              A printable system for a real northern pantry. Three layers, built in order.
              Start with Layer 1.
            </p>
          </div>

          {/* Body — three layers in columns */}
          <div
            style={{
              flex: 1,
              padding: "0.22in 0.6in 0.18in",
              display: "flex",
              flexDirection: "column",
              gap: "0.18in",
            }}
          >
            {/* Layer 1 */}
            <section>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.3rem",
                  marginBottom: "0.06in",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--rust)",
                    fontWeight: 700,
                  }}
                >
                  Layer 1
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: "var(--evergreen)",
                  }}
                >
                  The Jar Kitchen — Zone 0
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.72rem",
                    fontStyle: "italic",
                    color: "var(--muted)",
                  }}
                >
                  — Your active pantry. Food you eat every week.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.12in",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginBottom: "0.05rem",
                    }}
                  >
                    What belongs here
                  </p>
                  {[
                    "Home-preserved and canned goods in active rotation",
                    "Grains, legumes, oils you'll use this week",
                    "Root cellar: squash, potatoes, carrots, onions",
                    "Active ferments: kraut, kvass, brine pickles",
                  ].map((b) => (
                    <div
                      key={b}
                      style={{
                        display: "flex",
                        gap: "0.22rem",
                        marginBottom: "0.04rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "0.65rem",
                          color: "var(--rust)",
                          flexShrink: 0,
                          lineHeight: 1.55,
                        }}
                      >
                        →
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.65rem",
                          color: "var(--ink)",
                          lineHeight: 1.55,
                        }}
                      >
                        {b}
                      </p>
                    </div>
                  ))}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginBottom: "0.05rem",
                    }}
                  >
                    The rotation rule
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.67rem",
                      color: "var(--ink)",
                      lineHeight: 1.6,
                    }}
                  >
                    First in, first out. If you can't see the back of the shelf, it isn't
                    rotating. Label every jar: contents + date. No exceptions.
                  </p>
                </div>
              </div>
              <div
                style={{
                  marginTop: "0.08in",
                  background: "rgba(184,90,62,0.08)",
                  borderLeft: "2px solid var(--rust)",
                  padding: "0.06in 0.12in",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.57rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--rust)",
                    fontWeight: 700,
                    marginBottom: "0.02rem",
                  }}
                >
                  This week's action — Layer 1
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.68rem",
                    color: "var(--ink)",
                    lineHeight: 1.5,
                  }}
                >
                  Do a pantry audit. Pull everything off one shelf. Note what's expired or
                  forgotten. That number is your baseline — write it down.
                </p>
              </div>
            </section>

            <div style={{ height: 1, background: "rgba(31,61,46,0.12)" }} />

            {/* Layer 2 */}
            <section>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.3rem",
                  marginBottom: "0.06in",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--rust)",
                    fontWeight: 700,
                  }}
                >
                  Layer 2
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: "var(--evergreen)",
                  }}
                >
                  The Standby Room — Zone 1
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.72rem",
                    fontStyle: "italic",
                    color: "var(--muted)",
                  }}
                >
                  — Dry storage + freezer system. Carries you through a bad month.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.12in",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginBottom: "0.05rem",
                    }}
                  >
                    Dry storage
                  </p>
                  {[
                    "Whole grains in sealed containers (rice, oats, wheat berries)",
                    "Legumes — dried, not canned (more space-efficient, longer shelf life)",
                    "Dehydrated and freeze-dried produce",
                    "Stable fats: coconut oil, ghee, lard in sealed jars",
                    "Honey, maple syrup, salt, vinegar — the preservation base",
                  ].map((b) => (
                    <div key={b} style={{ display: "flex", gap: "0.22rem", marginBottom: "0.03rem" }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.65rem", color: "var(--rust)", flexShrink: 0, lineHeight: 1.55 }}>→</span>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.64rem", color: "var(--ink)", lineHeight: 1.55 }}>{b}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginBottom: "0.05rem",
                    }}
                  >
                    Freezer system
                  </p>
                  {[
                    "Meat in dated vacuum bags — meal-sized portions, not whole roasts",
                    "Blanched vegetables in freezer bags with date + contents",
                    "Broth in 1-qt containers, standing upright",
                    "Rule: if you're thawing more than you'll eat, the system is wrong",
                  ].map((b) => (
                    <div key={b} style={{ display: "flex", gap: "0.22rem", marginBottom: "0.03rem" }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.65rem", color: "var(--rust)", flexShrink: 0, lineHeight: 1.55 }}>→</span>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.64rem", color: "var(--ink)", lineHeight: 1.55 }}>{b}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  marginTop: "0.08in",
                  background: "rgba(184,90,62,0.08)",
                  borderLeft: "2px solid var(--rust)",
                  padding: "0.06in 0.12in",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.57rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--rust)",
                    fontWeight: 700,
                    marginBottom: "0.02rem",
                  }}
                >
                  This week's action — Layer 2
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.68rem",
                    color: "var(--ink)",
                    lineHeight: 1.5,
                  }}
                >
                  Open your freezer and take a full inventory. Sort by type, note the dates.
                  Anything older than 12 months goes into this week's meals — today, not eventually.
                </p>
              </div>
            </section>

            <div style={{ height: 1, background: "rgba(31,61,46,0.12)" }} />

            {/* Layer 3 */}
            <section>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.3rem",
                  marginBottom: "0.06in",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--rust)",
                    fontWeight: 700,
                  }}
                >
                  Layer 3
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: "var(--evergreen)",
                  }}
                >
                  The 72-Hour Exit Layer — Zone 2
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.72rem",
                    fontStyle: "italic",
                    color: "var(--muted)",
                  }}
                >
                  — Two packs, one rule.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.12in",
                  marginBottom: "0.08in",
                }}
              >
                {/* Pack A */}
                <div
                  style={{
                    border: "1px solid rgba(31,61,46,0.18)",
                    borderRadius: 4,
                    padding: "0.08in 0.1in",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--evergreen)",
                      marginBottom: "0.04rem",
                    }}
                  >
                    Pack A — Grab and Go <span style={{ fontWeight: 400, color: "var(--muted)", fontStyle: "italic" }}>(under 2 kg)</span>
                  </p>
                  {[
                    "72-hr food for one: bars, nuts, jerky, instant oats",
                    "Water purification: tablets + collapsible filter",
                    "Small first aid kit + prescription meds (30-day min)",
                    "Cash — small bills",
                    "Document copies: ID, insurance, land title, Rx",
                    "Phone charger + backup battery",
                    "Hand warmers — northern Ontario specific, always",
                    "Written emergency contact card",
                  ].map((b) => (
                    <div key={b} style={{ display: "flex", gap: "0.2rem", marginBottom: "0.02rem" }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.6rem", color: "var(--rust)", flexShrink: 0, lineHeight: 1.55 }}>·</span>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.61rem", color: "var(--ink)", lineHeight: 1.5 }}>{b}</p>
                    </div>
                  ))}
                </div>

                {/* Pack B */}
                <div
                  style={{
                    border: "1px solid rgba(31,61,46,0.18)",
                    borderRadius: 4,
                    padding: "0.08in 0.1in",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--evergreen)",
                      marginBottom: "0.04rem",
                    }}
                  >
                    Pack B — 72-Hour Household <span style={{ fontWeight: 400, color: "var(--muted)", fontStyle: "italic" }}>(per person)</span>
                  </p>
                  {[
                    "3 days of real food — not just bars",
                    "Water: 4L per person per day minimum",
                    "Camp stove + fuel",
                    "Blankets or sleeping bags rated to -20°C",
                    "Flashlights, headlamps, batteries",
                    "Multi-tool, duct tape, paracord",
                    "Ice fishing auger or hand saw (northern winter)",
                    "Backup medication: 7-day supply for remote distance",
                  ].map((b) => (
                    <div key={b} style={{ display: "flex", gap: "0.2rem", marginBottom: "0.02rem" }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.6rem", color: "var(--rust)", flexShrink: 0, lineHeight: 1.55 }}>·</span>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.61rem", color: "var(--ink)", lineHeight: 1.5 }}>{b}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The rule */}
              <div
                style={{
                  background: "var(--evergreen)",
                  borderRadius: 4,
                  padding: "0.07in 0.12in",
                  marginBottom: "0.07in",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.68rem",
                    fontStyle: "italic",
                    color: "rgba(244,237,224,0.9)",
                    lineHeight: 1.55,
                  }}
                >
                  "You open Pack A when the decision to leave has been made.
                  You open Pack B when you don't know when you're coming back."
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.6rem",
                    color: "rgba(244,237,224,0.55)",
                    marginTop: "0.04rem",
                  }}
                >
                  Check both packs twice a year — the same day you change the smoke alarm batteries.
                </p>
              </div>

              {/* Spirko Redundancy Rule */}
              <div
                style={{
                  background: "rgba(184,90,62,0.08)",
                  borderLeft: "3px solid var(--rust)",
                  padding: "0.06in 0.12in",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.57rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--rust)",
                    fontWeight: 700,
                    marginBottom: "0.02rem",
                  }}
                >
                  Spirko Redundancy Rule
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--evergreen)",
                    marginBottom: "0.02rem",
                  }}
                >
                  "One is none. Two is one."
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.66rem",
                    color: "var(--ink)",
                    lineHeight: 1.5,
                  }}
                >
                  Every critical system needs a backup: two water filters, two fire starters, two ways
                  to heat food. If one item failing collapses the whole layer, you have a single point
                  of failure. Fix it before you need to use it.
                </p>
              </div>

              {/* Layer 3 action */}
              <div
                style={{
                  marginTop: "0.07in",
                  background: "rgba(184,90,62,0.08)",
                  borderLeft: "2px solid var(--rust)",
                  padding: "0.06in 0.12in",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.57rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--rust)",
                    fontWeight: 700,
                    marginBottom: "0.02rem",
                  }}
                >
                  This week's action — Layer 3
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.68rem",
                    color: "var(--ink)",
                    lineHeight: 1.5,
                  }}
                >
                  Locate your packs (or admit you don't have them yet). Set a calendar reminder for
                  6 months from today titled "Check the packs." That's step one.
                </p>
              </div>
            </section>

            {/* Footer */}
            <div style={{ marginTop: "auto", paddingTop: "0.1in", borderTop: "1px solid rgba(31,61,46,0.14)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.82rem", fontWeight: 700, color: "var(--evergreen)", marginBottom: "0.03rem" }}>
                  Parr's Jars — parrsjars.ca
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  Wabigoon, Ontario · More resources at{" "}
                  <span style={{ color: "var(--evergreen)", fontWeight: 600 }}>ourheadwaters.ca/headwaters/start</span>
                </p>
              </div>
              <QRCodeStamp url="https://ourheadwaters.ca/headwaters/start" size={44} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
