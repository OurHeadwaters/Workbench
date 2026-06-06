import { useState } from "react";
import QRCodeStamp from "../components/QRCodeStamp";
import { PrintNav } from "../components/PrintNav";

const RUST = "#b85a3e";
const INK = "#1a1a1a";
const MUTED = "#6b6b6b";
const RULE = "rgba(0,0,0,0.13)";

function buildPlainText(): string {
  return [
    "THE 3-LAYER NORTHERN PANTRY — WORKSHEET",
    "Parr's Jars · Wabigoon, Ontario · parrsjars.ca",
    "",
    "A fill-in worksheet for building a real northern pantry.",
    "Work through each layer in order. Start with Layer 1.",
    "",
    "---",
    "",
    "🫙 LAYER 1 — THE JAR KITCHEN (Zone 0)",
    "Your active pantry. Food you actually eat every week.",
    "",
    "CHECKLIST — What belongs here:",
    "□ Home-preserved and canned goods",
    "□ Grains, legumes, oils in active rotation",
    "□ Root cellar basics (squash, potatoes, carrots, onions)",
    "□ Active ferments (kraut, kvass, brine pickles)",
    "",
    "THE ROTATION RULE: First in, first out.",
    "Label every jar: contents + date. No exceptions.",
    "",
    "✍ THIS WEEK'S ACTION:",
    "Pull everything off one shelf. Count what's expired or forgotten.",
    "  Expired items found: _______",
    "  Date I did this: _______",
    "  What I noticed: _______________________________",
    "",
    "---",
    "",
    "📦 LAYER 2 — THE STANDBY ROOM (Zone 1)",
    "Dry storage + freezer. Carries you through a rough month.",
    "",
    "DRY STORAGE — What belongs here:",
    "□ Whole grains in sealed containers (rice, oats, wheat berries)",
    "□ Dried legumes — not canned (longer shelf life, less space)",
    "□ Dehydrated or freeze-dried produce",
    "□ Stable fats: coconut oil, ghee, lard in sealed jars",
    "□ Honey, maple syrup, salt, vinegar",
    "",
    "FREEZER — What belongs here:",
    "□ Meat in dated vacuum bags — meal-sized, not whole roasts",
    "□ Blanched vegetables in dated freezer bags",
    "□ Broth in 1-qt containers, upright",
    "",
    "✍ THIS WEEK'S ACTION:",
    "Do a full freezer inventory. Anything older than 12 months goes into this week's meals.",
    "  Oldest item found: _______  (dated: _______)",
    "  One thing I'm using up this week: _______",
    "",
    "---",
    "",
    "🎒 LAYER 3 — THE 72-HOUR EXIT LAYER (Zone 2)",
    "Two packs. One rule. Ready to go.",
    "",
    "PACK A — Grab and Go (under 2 kg):",
    "□ 72-hr food: bars, nuts, jerky, instant oats",
    "□ Water purification: tablets + collapsible filter",
    "□ First aid kit + prescription meds (30-day min)",
    "□ Cash — small bills",
    "□ Copies of documents: ID, insurance, land title, Rx",
    "□ Phone charger + backup battery",
    "□ Hand warmers (northern Ontario — always)",
    "□ Written emergency contact card",
    "",
    "PACK B — 72-Hour Household (per person):",
    "□ 3 days of real food — not just bars",
    "□ Water: 4L per person per day minimum",
    "□ Camp stove + fuel",
    "□ Sleeping bags or blankets rated to -20°C",
    "□ Flashlights, headlamps, extra batteries",
    "□ Multi-tool, duct tape, paracord",
    "□ Ice fishing auger or hand saw (northern winter)",
    "□ Backup medication — 7-day supply for remote distance",
    "",
    'THE RULE: "Open Pack A when the decision to leave has been made.',
    ' Open Pack B when you don\'t know when you\'re coming back."',
    "Check both packs twice a year — same day you change smoke alarm batteries.",
    "",
    "Pack A location: _______   Last checked: _______",
    "Pack B location: _______   Last checked: _______",
    "Next check date: _______",
    "",
    "---",
    "",
    "Download more resources: parrsjars.ca · ourheadwaters.ca/headwaters/start",
  ].join("\n");
}

type ChecklistItem = { id: string; label: string };

function Checklist({ items }: { items: ChecklistItem[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.16rem" }}>
      {items.map((item) => (
        <label key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.28rem", cursor: "pointer" }}>
          <span
            onClick={() => setChecked((p) => ({ ...p, [item.id]: !p[item.id] }))}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "0.68rem",
              height: "0.68rem",
              minWidth: "0.68rem",
              border: `1.5px solid ${checked[item.id] ? RUST : "#aaa"}`,
              borderRadius: 2,
              marginTop: "0.14rem",
              background: checked[item.id] ? RUST : "transparent",
              color: "#fff",
              fontSize: "0.46rem",
              fontWeight: 900,
              flexShrink: 0,
              transition: "all 0.12s",
            }}
          >
            {checked[item.id] ? "✓" : ""}
          </span>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.63rem",
            color: checked[item.id] ? "#aaa" : INK,
            lineHeight: 1.55,
            textDecoration: checked[item.id] ? "line-through" : "none",
            transition: "all 0.12s",
          }}>
            {item.label}
          </p>
        </label>
      ))}
    </div>
  );
}

function WriteLine({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0.2rem", marginBottom: "0.06rem" }}>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.52rem", color: MUTED, whiteSpace: "nowrap", paddingBottom: "0.05rem" }}>
        {label}
      </p>
      <div style={{ flex: 1, borderBottom: `1px solid ${RULE}`, minWidth: "0.5in" }} />
    </div>
  );
}

function ActionBox({ layer, instruction, fields }: {
  layer: string;
  instruction: string;
  fields: string[];
}) {
  return (
    <div style={{
      marginTop: "0.08in",
      borderLeft: `2px solid ${RUST}`,
      paddingLeft: "0.1in",
    }}>
      <p style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.51rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: RUST,
        fontWeight: 700,
        marginBottom: "0.06rem",
      }}>
        ✍ This week's action — {layer}
      </p>
      <p style={{
        fontFamily: "var(--font-serif)",
        fontSize: "0.65rem",
        color: INK,
        lineHeight: 1.5,
        marginBottom: "0.1rem",
      }}>
        {instruction}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: fields.map(() => "1fr").join(" "), gap: "0.1in" }}>
        {fields.map((f) => <WriteLine key={f} label={f} />)}
      </div>
    </div>
  );
}

function LayerHeading({ num, icon, title, sub }: { num: string; icon: string; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.36rem", marginBottom: "0.07in" }}>
      <span style={{ fontSize: "1rem", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.49rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: RUST,
          fontWeight: 700,
          lineHeight: 1,
          marginBottom: "0.06rem",
        }}>
          {num}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.28rem", flexWrap: "wrap" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.86rem", fontWeight: 800, color: INK, lineHeight: 1.1 }}>
            {title}
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.66rem", fontStyle: "italic", color: MUTED }}>
            — {sub}
          </p>
        </div>
      </div>
    </div>
  );
}

function ColLabel({ icon, children }: { icon?: string; children: string }) {
  return (
    <p style={{
      fontFamily: "var(--font-sans)",
      fontSize: "0.51rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: MUTED,
      fontWeight: 600,
      marginBottom: "0.14rem",
    }}>
      {icon && <>{icon} </>}{children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: RULE, margin: "0.13in 0" }} />;
}

export default function NorthernPantryPrintable() {
  return (
    <>
      <PrintNav
        targetId="pdf-target"
        filename="northern-pantry-worksheet.pdf"
        onCopyPlainText={buildPlainText}
      />
      <div
        id="pdf-target"
        className="print-page page-letter"
        style={{ padding: 0, overflow: "hidden", background: "#fff", minHeight: "11in" }}
      >
        <div style={{ position: "relative", minHeight: "11in", display: "flex", flexDirection: "column" }}>

          {/* ── Header — no fill, just type and a rust rule ── */}
          <div style={{ padding: "0.28in 0.6in 0.18in", borderBottom: `3px solid ${RUST}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                  marginBottom: "0.1rem",
                }}>
                  Parr's Jars · Wabigoon, Ontario · parrsjars.ca
                </p>
                <h1 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: INK,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.1rem",
                }}>
                  The 3-Layer Northern Pantry
                </h1>
                <p style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.7rem",
                  fontStyle: "italic",
                  color: MUTED,
                }}>
                  A fill-in worksheet. Work through each layer in order — start with Layer 1.
                </p>
              </div>

              {/* Name / date box — outline only */}
              <div style={{
                border: `1px solid ${RULE}`,
                borderRadius: 4,
                padding: "0.08in 0.12in",
                flexShrink: 0,
                marginLeft: "0.2in",
                minWidth: "1.2in",
              }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.14rem" }}>Your name</p>
                <div style={{ borderBottom: `1px solid ${RULE}`, height: "0.18in", marginBottom: "0.1rem" }} />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.48rem", color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.14rem" }}>Date started</p>
                <div style={{ borderBottom: `1px solid ${RULE}`, height: "0.18in" }} />
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ flex: 1, padding: "0.18in 0.6in 0.14in", display: "flex", flexDirection: "column" }}>

            {/* LAYER 1 */}
            <section>
              <LayerHeading num="Layer 1" icon="🫙" title="The Jar Kitchen — Zone 0" sub="Your active pantry. Food you eat every week." />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.14in" }}>
                <div>
                  <ColLabel>✓ What belongs here</ColLabel>
                  <Checklist items={[
                    { id: "l1-1", label: "Home-preserved and canned goods" },
                    { id: "l1-2", label: "Grains, legumes, oils in active rotation" },
                    { id: "l1-3", label: "Root cellar basics — squash, potatoes, carrots, onions" },
                    { id: "l1-4", label: "Active ferments — kraut, kvass, brine pickles" },
                  ]} />
                </div>
                <div>
                  <ColLabel>📋 The rotation rule</ColLabel>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.65rem", color: INK, lineHeight: 1.6 }}>
                    <strong>First in, first out.</strong> If you can't see the back of the shelf, it isn't rotating.
                    Label every jar: <em>contents + date</em>. No exceptions.
                  </p>
                  <div style={{ marginTop: "0.1rem" }}>
                    <WriteLine label="Last audited:" />
                  </div>
                </div>
              </div>
              <ActionBox
                layer="Layer 1"
                instruction="Pull everything off one shelf. Count what's expired or forgotten. Write it below — that number is your baseline."
                fields={["Expired items found", "Date I did this", "What I noticed"]}
              />
            </section>

            <Divider />

            {/* LAYER 2 */}
            <section>
              <LayerHeading num="Layer 2" icon="📦" title="The Standby Room — Zone 1" sub="Dry storage + freezer. Carries you through a rough month." />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.14in" }}>
                <div>
                  <ColLabel icon="🌾">Dry storage — what belongs here</ColLabel>
                  <Checklist items={[
                    { id: "l2-1", label: "Whole grains in sealed containers (rice, oats, wheat berries)" },
                    { id: "l2-2", label: "Dried legumes — not canned (more space, longer shelf life)" },
                    { id: "l2-3", label: "Dehydrated or freeze-dried produce" },
                    { id: "l2-4", label: "Stable fats: coconut oil, ghee, lard in sealed jars" },
                    { id: "l2-5", label: "Honey, maple syrup, salt, vinegar — the preservation base" },
                  ]} />
                </div>
                <div>
                  <ColLabel icon="❄️">Freezer — what belongs here</ColLabel>
                  <Checklist items={[
                    { id: "l2-6", label: "Meat in dated vacuum bags — meal-sized, not whole roasts" },
                    { id: "l2-7", label: "Blanched vegetables in dated freezer bags" },
                    { id: "l2-8", label: "Broth in 1-qt containers, standing upright" },
                  ]} />
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.61rem", fontStyle: "italic", color: MUTED, lineHeight: 1.5, marginTop: "0.08rem" }}>
                    Rule: if you're thawing more than you'll eat, the system is wrong.
                  </p>
                </div>
              </div>
              <ActionBox
                layer="Layer 2"
                instruction="Do a full freezer inventory. Anything older than 12 months goes into this week's meals — today, not eventually."
                fields={["Oldest item found", "Its date", "What I'm cooking this week"]}
              />
            </section>

            <Divider />

            {/* LAYER 3 */}
            <section>
              <LayerHeading num="Layer 3" icon="🎒" title="The 72-Hour Exit Layer — Zone 2" sub="Two packs. One rule. Ready to go." />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.12in", marginBottom: "0.09in" }}>
                {/* Pack A */}
                <div style={{ borderTop: `2px solid ${INK}`, paddingTop: "0.07in" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.7rem", fontWeight: 700, color: INK, marginBottom: "0.06rem" }}>
                    Pack A — Grab and Go{" "}
                    <span style={{ fontWeight: 400, color: MUTED, fontStyle: "italic", fontSize: "0.62rem" }}>under 2 kg</span>
                  </p>
                  <Checklist items={[
                    { id: "pa-1", label: "72-hr food: bars, nuts, jerky, instant oats" },
                    { id: "pa-2", label: "Water purification: tablets + collapsible filter" },
                    { id: "pa-3", label: "First aid kit + meds (30-day min)" },
                    { id: "pa-4", label: "Cash — small bills" },
                    { id: "pa-5", label: "Copies: ID, insurance, land title, prescriptions" },
                    { id: "pa-6", label: "Phone charger + backup battery" },
                    { id: "pa-7", label: "Hand warmers — northern Ontario, always" },
                    { id: "pa-8", label: "Written emergency contact card" },
                  ]} />
                  <div style={{ marginTop: "0.06rem" }}><WriteLine label="Location:" /></div>
                </div>

                {/* Pack B */}
                <div style={{ borderTop: `2px solid ${INK}`, paddingTop: "0.07in" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.7rem", fontWeight: 700, color: INK, marginBottom: "0.06rem" }}>
                    Pack B — 72-Hour Household{" "}
                    <span style={{ fontWeight: 400, color: MUTED, fontStyle: "italic", fontSize: "0.62rem" }}>per person</span>
                  </p>
                  <Checklist items={[
                    { id: "pb-1", label: "3 days of real food — not just bars" },
                    { id: "pb-2", label: "Water: 4L per person per day minimum" },
                    { id: "pb-3", label: "Camp stove + fuel" },
                    { id: "pb-4", label: "Sleeping bags or blankets rated to -20°C" },
                    { id: "pb-5", label: "Flashlights, headlamps, extra batteries" },
                    { id: "pb-6", label: "Multi-tool, duct tape, paracord" },
                    { id: "pb-7", label: "Ice fishing auger or hand saw (northern winter)" },
                    { id: "pb-8", label: "Backup medication — 7-day supply for remote distance" },
                  ]} />
                  <div style={{ marginTop: "0.06rem" }}><WriteLine label="Location:" /></div>
                </div>
              </div>

              {/* The rule — outline box only, no fill */}
              <div style={{
                border: `1px solid rgba(0,0,0,0.18)`,
                borderLeft: `3px solid ${INK}`,
                borderRadius: "0 4px 4px 0",
                padding: "0.06in 0.12in",
                marginBottom: "0.07in",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.2in",
              }}>
                <div>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.67rem", fontStyle: "italic", color: INK, lineHeight: 1.55 }}>
                    "Open Pack A when the decision to leave has been made.<br />
                    Open Pack B when you don't know when you're coming back."
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.56rem", color: MUTED, marginTop: "0.04rem" }}>
                    🔔 Check both packs twice a year — same day you change the smoke alarm batteries.
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <WriteLine label="Next check date:" />
                </div>
              </div>

              {/* Spirko — left border only, no fill */}
              <div style={{ borderLeft: `2px solid ${RUST}`, paddingLeft: "0.1in" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.51rem", letterSpacing: "0.1em", textTransform: "uppercase", color: RUST, fontWeight: 700, marginBottom: "0.02rem" }}>
                  🔁 Spirko Redundancy Rule
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.68rem", fontWeight: 700, color: INK, marginBottom: "0.02rem" }}>
                  "One is none. Two is one."
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.62rem", color: INK, lineHeight: 1.5 }}>
                  Every critical system needs a backup: two water filters, two fire starters, two ways to heat food.
                  If one item failing collapses the whole layer, fix it before you need to use it.
                </p>
              </div>
            </section>

            {/* ── Footer ── */}
            <div style={{
              marginTop: "auto",
              paddingTop: "0.1in",
              borderTop: `1px solid ${RULE}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.78rem", fontWeight: 700, color: INK, marginBottom: "0.03rem" }}>
                  Parr's Jars — parrsjars.ca
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", color: MUTED, lineHeight: 1.5 }}>
                  Wabigoon, Ontario · More resources at ourheadwaters.ca/headwaters/start
                </p>
              </div>
              <QRCodeStamp url="https://ourheadwaters.ca/headwaters/start" size={42} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
