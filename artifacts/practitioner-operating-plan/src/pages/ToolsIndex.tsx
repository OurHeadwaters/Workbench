/**
 * ToolsIndex.tsx
 *
 * Hiring tools index — a single bookmark the practitioner can share.
 * Lists all three printable/interactive hiring companions with direct links.
 * Matches the print-format visual style (letter width, cream, amber headers).
 */

const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const TOOLS = [
  {
    number: "01",
    title: "SALT-01 Monthly Close",
    subtitle: "Bookkeeper · file each month's salt revenue and expenses",
    description:
      "File the salt cost-centre's monthly revenue and direct expenses. Each submission stamps an immutable per-month record — prior months are never overwritten. The one-pager SALT-01 block reads this history automatically and renders a sparkline of the last 3–6 months' net against the planning baseline.",
    path: `${BASE}/tools/salt-close`,
    label: "Open filing tool →",
    warn: false,
  },
  {
    number: "05",
    title: "Bench Swap",
    subtitle: "Operations Manager · swap primary or standby for any week",
    description:
      "Review the scheduled food-handler bench and override either role when coverage changes. Add a one-line reason (e.g. Marie sick) so the audit trail is legible weeks later. Overrides persist in the browser and survive page reloads. Open the Week Close-Out view to get a printable record with swap notes for the bookkeeper.",
    path: `${BASE}/tools/bench/week`,
    label: "Open bench swap →",
    warn: false,
  },
  {
    number: "05b",
    title: "Bench Week Close-Out",
    subtitle: "Bookkeeper / OM · printable record with swap reasons",
    description:
      "A printable audit record for any ISO week showing effective primary and standby roles. Swapped roles display swapped from <name> -- <reason> so the bookkeeper can reconcile coverage without hunting for Slack messages. Navigate by week and use Cmd/Ctrl + P to save as PDF.",
    path: `${BASE}/tools/bench/close`,
    label: "Open close-out →",
    warn: false,
  },
  {
    number: "02",
    title: "Reference-Call Script — Standard",
    subtitle: "Any hired role · 8 questions · 3 calls minimum",
    description:
      "One-page printable script with opening line, eight questions in priority order, listening cues for each, a green/yellow/red flag legend, per-question notes lines, and a verbatim closing question. Use this for the Operations Manager, Bookkeeper, Food Handler, or any other role.",
    path: `${BASE}/tools/reference-call`,
    label: "Open script →",
    warn: false,
  },
  {
    number: "03",
    title: "Reference-Call Script — Handyman-Housekeeper",
    subtitle: "Extended · 6 standard + 5 child-safety questions · 3 calls minimum",
    description:
      "Heavier script for the handyman-housekeeper role. Carries all six standard questions adapted for a home context, then a full child-safety block (C1–C5). Questions C2, C3, and C5 carry explicit hesitation-is-a-no disqualification language. C5 — 'would you leave them alone with your own children?' — is the single most important question in the entire hiring plan.",
    path: `${BASE}/tools/reference-call-handyman`,
    label: "Open script →",
    warn: true,
  },
  {
    number: "04",
    title: "Candidate Tracker",
    subtitle: "Live-fill · up to 4 candidates side-by-side · printable",
    description:
      "Interactive tracker for comparing candidates during and after the hiring process. Sections for identity, source channel, all three reference-call results, paid-trial dates and outcome, final decision (colour-coded), and running notes. Add up to four candidates side-by-side. Print (Cmd/Ctrl + P) to save state — data is not persisted between sessions.",
    path: `${BASE}/tools/candidate-tracker`,
    label: "Open tracker →",
    warn: false,
  },
];

export default function ToolsIndex() {
  return (
    <div style={{ background: "#d8d2c8", minHeight: "100vh" }}>
      <div
        style={{
          width: "8.5in",
          margin: "0 auto",
          background: CREAM,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "9pt",
          color: TEXT,
        }}
      >
        <div style={{ width: "8.5in", minHeight: "11in", padding: "0.55in 0.65in" }}>

          {/* Amber rule */}
          <div style={{ height: "3pt", background: AMBER, margin: "0 0 14pt" }} />

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18pt" }}>
            <div>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
                Practitioner Operating Plan — Hiring Tools
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "24pt", fontWeight: 700, color: DARK, lineHeight: 1.05, marginBottom: "5pt" }}>
                Tools Index
              </div>
              <div style={{ fontSize: "9pt", color: MUTED, lineHeight: 1.5, maxWidth: "4.5in" }}>
                Four tools that turn the operating runbook from doctrine into working instruments.
                File salt closes in Tool 01, open the reference script for the role you're calling, then log results in the tracker.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Confidential</div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>Headwaters Development Services</div>
            </div>
          </div>

          {/* Rule */}
          <div style={{ height: "1pt", background: RULE, marginBottom: "18pt" }} />

          {/* Tools */}
          {TOOLS.map((tool, i) => (
            <div
              key={tool.number}
              style={{
                marginBottom: i < TOOLS.length - 1 ? "16pt" : "0",
                paddingBottom: i < TOOLS.length - 1 ? "16pt" : "0",
                borderBottom: i < TOOLS.length - 1 ? `1pt solid ${RULE}` : undefined,
                display: "grid",
                gridTemplateColumns: "0.4in 1fr auto",
                gap: "0 16pt",
                alignItems: "start",
              }}
            >
              {/* Number */}
              <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "22pt", fontWeight: 700, color: "rgba(184,90,62,0.18)", lineHeight: 1, paddingTop: "2pt" }}>
                {tool.number}
              </div>

              {/* Content */}
              <div>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>
                  {tool.subtitle}
                </div>
                <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "15pt", fontWeight: 700, color: DARK, lineHeight: 1.15, marginBottom: "6pt" }}>
                  {tool.title}
                </div>
                {tool.warn && (
                  <div style={{ fontSize: "7.5pt", fontWeight: 700, color: "#7a1a1a", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5pt" }}>
                    ⬥ Hesitation-is-a-no rule applies to C2, C3, and C5
                  </div>
                )}
                <div style={{ fontSize: "9pt", color: TEXT, lineHeight: 1.55 }}>
                  {tool.description}
                </div>
              </div>

              {/* Link */}
              <div style={{ paddingTop: "20pt" }}>
                <a
                  href={tool.path}
                  style={{
                    display: "inline-block",
                    fontSize: "8pt",
                    fontWeight: 700,
                    color: CREAM,
                    background: AMBER,
                    padding: "5pt 12pt",
                    borderRadius: "3pt",
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tool.label}
                </a>
              </div>
            </div>
          ))}

          {/* Quick reference */}
          <div style={{ marginTop: "22pt", background: "rgba(31,61,46,0.05)", border: `1pt solid ${RULE}`, borderRadius: "3pt", padding: "10pt 14pt" }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "7pt" }}>
              Quick reference — how the four tools connect
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10pt" }}>
              {[
                { step: "Tool 01", action: "File salt closes", detail: "File each month's salt revenue and expenses. History flows to the one-pager sparkline automatically." },
                { step: "Tool 02", action: "Screen candidates", detail: "Record name, source channel, and screening date in the Candidate Tracker (Tool 04)." },
                { step: "Tool 03", action: "Run reference calls", detail: "Open Tool 02 (standard) or Tool 03 (handyman-housekeeper). Complete three calls per candidate. Log results in Tool 04." },
                { step: "Tool 04", action: "Compare and decide", detail: "Side-by-side view shows all reference results, paid-trial outcome, and decision for up to 4 candidates at once." },
              ].map(s => (
                <div key={s.step}>
                  <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: AMBER, marginBottom: "2pt" }}>{s.step}</div>
                  <div style={{ fontSize: "9pt", fontWeight: 600, color: DARK, marginBottom: "3pt" }}>{s.action}</div>
                  <div style={{ fontSize: "8pt", color: MUTED, lineHeight: 1.45 }}>{s.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "18pt", borderTop: `1pt solid rgba(31,61,46,0.12)`, paddingTop: "8pt", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "7pt", color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Headwaters Development Services · Confidential · Hiring Tools
            </div>
            <div style={{ fontSize: "7pt", color: MUTED }}>
              Three calls per candidate minimum · Hesitation-is-a-no on child-safety block
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
