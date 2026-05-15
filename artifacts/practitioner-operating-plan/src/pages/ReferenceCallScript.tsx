/**
 * ReferenceCallScript.tsx
 *
 * Printable one-page reference-call script for any hired role.
 * Print via Cmd/Ctrl + P. Designed at letter width (8.5 in).
 */

const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";
const GREEN  = "#2d6a3f";
const YELLOW = "#9a6e1a";
const RED    = "#b03030";

interface Question {
  priority: number;
  question: string;
  listeningCue: string;
  greenFlag: string;
  yellowFlag: string;
  redFlag: string;
}

const QUESTIONS: Question[] = [
  {
    priority: 1,
    question: "How long did you work with [candidate], and what was their role relative to yours?",
    listeningCue: "Listen for specificity — a vague answer (\"we crossed paths sometimes\") signals a weak reference who may not actually know the candidate.",
    greenFlag: "Direct supervisor or close colleague for 6+ months; names specific responsibilities.",
    yellowFlag: "Knows the candidate but had limited direct oversight; relationship unclear.",
    redFlag: "Cannot describe actual work together; seems coached or evasive about the relationship.",
  },
  {
    priority: 2,
    question: "What were their greatest strengths in that role — give me a concrete example if you can.",
    listeningCue: "Real references come with stories. Fabricated or coached ones stay generic ('she was great with people'). Push for a specific moment.",
    greenFlag: "Names a specific scenario — a hard week, a problem solved, a skill demonstrated unprompted.",
    yellowFlag: "Warm but entirely generic; repeats the candidate's resume.",
    redFlag: "Pauses, changes subject, or circles back to asking what the job is — hasn't seen the candidate's best.",
  },
  {
    priority: 3,
    question: "Describe a time when things didn't go as planned. How did they handle it?",
    listeningCue: "This question separates candid references from cheerleaders. Nobody's record is perfect — a reference with zero negatives is hiding something.",
    greenFlag: "Tells a real stumble story and then explains how the candidate recovered or learned from it.",
    yellowFlag: "Acknowledges imperfection but frames everything as a virtue (\"she could be too dedicated\").",
    redFlag: "Insists there were no difficulties, deflects the question, or describes a serious incident minimised as minor.",
  },
  {
    priority: 4,
    question: "How did they respond when corrected, given critical feedback, or asked to change how they were doing something?",
    listeningCue: "Defensiveness under correction is the single biggest predictor of team friction. You need someone who can hear hard things.",
    greenFlag: "Took feedback without drama, implemented it, and followed up to confirm the change held.",
    yellowFlag: "Generally receptive but sometimes sulked or needed several rounds before adjusting.",
    redFlag: "Argued back, went around the feedback-giver, or repeated the same behaviour after repeated correction.",
  },
  {
    priority: 5,
    question: "How would you describe their reliability — were they consistently where they said they'd be, doing what they said they'd do?",
    listeningCue: "Reliability questions reveal patterns the candidate won't self-report. Listen for qualifications ('mostly', 'except when...') — any qualifier is a yellow flag.",
    greenFlag: "\"I never had to wonder\" — schedule, commitments, and communication all held without reminders.",
    yellowFlag: "Reliable on the big things but occasionally needed a nudge on follow-through or communication.",
    redFlag: "Frequent no-shows, last-minute cancellations, or a pattern of promising and then under-delivering.",
  },
  {
    priority: 6,
    question: "Were there ever any concerns — from you or others — about their judgment, honesty, or how they used their access to your home/family/finances?",
    listeningCue: "You are listening for the pause. A long pause before a clean answer is a yellow flag. A quick deflection ('not that I recall') after hesitation is a red flag. Trust your gut here.",
    greenFlag: "Clean and fast: \"No, I trusted them completely and I still do.\"",
    yellowFlag: "Hesitates, then gives a clean answer — probe once more (\"anything at all, even minor?\").",
    redFlag: "Hesitates and then qualifies, deflects, or mentions a vague incident they won't name. Any hesitation on honesty or access is a no.",
  },
  {
    priority: 7,
    question: "What type of role or environment do they thrive in — and where have you seen them struggle?",
    listeningCue: "This reveals fit, not just quality. A great person in the wrong environment is still a bad hire. Match what they say to the actual role you're filling.",
    greenFlag: "Describes a setting close to yours — independent work, clear tasks, relationship-based trust, Northern or remote context.",
    yellowFlag: "Thrives in structured corporate environments, large teams, or heavily supervised roles.",
    redFlag: "Described fit is a clear mismatch — very social person for a solitary role, or vice versa.",
  },
  {
    priority: 8,
    question: "If the right role came up, would you hire them again — and would you do it without hesitation?",
    listeningCue: "The closing question. The second part ('without hesitation') is what matters. A 'yes, but...' is a no in disguise. Listen for the speed and ease of the answer, not just the word.",
    greenFlag: "\"Yes, without hesitation. I'd call them tomorrow.\"",
    yellowFlag: "\"Yes, for the right role\" — means they have reservations about fit or specific concerns.",
    redFlag: "Pause before yes, hedging language, or pivoting to 'it depends on what you need.'",
  },
];

const FLAGS = [
  { color: GREEN,  label: "Green flag",  description: "Proceed with confidence. Reference confirms what you saw in screening." },
  { color: YELLOW, label: "Yellow flag", description: "Note it; don't stop. Probe further or watch for it in the paid trial." },
  { color: RED,    label: "Red flag",    description: "Stop and investigate before advancing. Two red flags in one call is a no." },
];

function FlagDot({ color }: { color: string }) {
  return (
    <span style={{ display: "inline-block", width: "7pt", height: "7pt", borderRadius: "50%", background: color, marginRight: "5pt", verticalAlign: "middle" }} />
  );
}

export default function ReferenceCallScript() {
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

        {/* ── PAGE 1 ─────────────────────────────────────────────── */}
        <div style={{ width: "8.5in", minHeight: "11in", padding: "0.5in 0.6in", position: "relative", pageBreakAfter: "always" }}>

          {/* Amber rule */}
          <div style={{ height: "3pt", background: AMBER, margin: "0 0 12pt" }} />

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10pt" }}>
            <div>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
                Practitioner Operating Plan — Hiring Tools
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "20pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "4pt" }}>
                Reference-Call Script
              </div>
              <div style={{ fontSize: "8.5pt", color: MUTED, lineHeight: 1.45, maxWidth: "4.5in" }}>
                Standard script for any hired role. Three calls per candidate minimum.
                Use in order — do not skip Q6. Mark flags as you go.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Confidential</div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>Headwaters Development Services</div>
              <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "6pt" }}>Candidate: _______________</div>
              <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "2pt" }}>Reference: _______________</div>
              <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "2pt" }}>Date: ____________________</div>
            </div>
          </div>

          {/* Opening line */}
          <div style={{ background: "rgba(31,61,46,0.06)", border: `1pt solid ${RULE}`, borderRadius: "3pt", padding: "8pt 10pt", marginBottom: "10pt" }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "4pt" }}>
              Opening Line — say this verbatim
            </div>
            <div style={{ fontSize: "9pt", color: TEXT, lineHeight: 1.5, fontStyle: "italic" }}>
              "Hi [name], my name is [your name]. I'm doing a reference check for [candidate] who has applied for [role]. 
              I'll only take about ten minutes. I have eight questions — all of them are meant to help me set [candidate] up 
              for success, not catch them out. Everything you share stays between us. Ready to start?"
            </div>
          </div>

          {/* Flag legend */}
          <div style={{ display: "flex", gap: "14pt", marginBottom: "10pt", padding: "6pt 10pt", border: `1pt solid ${RULE}`, borderRadius: "3pt" }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, alignSelf: "center", marginRight: "4pt" }}>
              Flag legend:
            </div>
            {FLAGS.map(f => (
              <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: "4pt", flex: 1 }}>
                <FlagDot color={f.color} />
                <div>
                  <div style={{ fontSize: "7.5pt", fontWeight: 700, color: f.color }}>{f.label}</div>
                  <div style={{ fontSize: "7pt", color: MUTED, lineHeight: 1.35 }}>{f.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Questions */}
          {QUESTIONS.map((q, i) => (
            <div
              key={q.priority}
              style={{
                marginBottom: "8pt",
                paddingBottom: "8pt",
                borderBottom: i < QUESTIONS.length - 1 ? `0.5pt solid ${RULE}` : undefined,
              }}
            >
              <div style={{ display: "flex", gap: "8pt", alignItems: "flex-start" }}>
                <div style={{ minWidth: "14pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "7pt", fontWeight: 700, color: AMBER, paddingTop: "1pt" }}>
                  Q{q.priority}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "9pt", fontWeight: 600, color: DARK, lineHeight: 1.4, marginBottom: "3pt" }}>
                    {q.question}
                  </div>
                  <div style={{ fontSize: "7.5pt", color: MUTED, fontStyle: "italic", marginBottom: "4pt", lineHeight: 1.35 }}>
                    {q.listeningCue}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5pt" }}>
                    <div style={{ fontSize: "7.5pt", lineHeight: 1.3 }}>
                      <FlagDot color={GREEN} />
                      <span style={{ color: GREEN, fontWeight: 600 }}>Green: </span>
                      <span style={{ color: TEXT }}>{q.greenFlag}</span>
                    </div>
                    <div style={{ fontSize: "7.5pt", lineHeight: 1.3 }}>
                      <FlagDot color={YELLOW} />
                      <span style={{ color: YELLOW, fontWeight: 600 }}>Yellow: </span>
                      <span style={{ color: TEXT }}>{q.yellowFlag}</span>
                    </div>
                    <div style={{ fontSize: "7.5pt", lineHeight: 1.3 }}>
                      <FlagDot color={RED} />
                      <span style={{ color: RED, fontWeight: 600 }}>Red: </span>
                      <span style={{ color: TEXT }}>{q.redFlag}</span>
                    </div>
                  </div>
                  {/* Notes space */}
                  <div style={{ marginTop: "4pt", borderBottom: `0.5pt solid ${RULE}`, height: "14pt" }}>
                    <span style={{ fontSize: "7pt", color: MUTED }}>Notes: </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Close */}
          <div style={{ background: DARK, borderRadius: "3pt", padding: "9pt 12pt", marginTop: "6pt" }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "4pt" }}>
              Closing Line
            </div>
            <div style={{ fontSize: "9pt", color: "rgba(244,237,224,0.9)", lineHeight: 1.5, fontStyle: "italic" }}>
              "Last question, and this is the one I always end on: if you had an opening that fit [candidate], 
              would you hire them again — and would you do it without hesitation?" 
            </div>
            <div style={{ marginTop: "6pt", fontSize: "8pt", color: "rgba(244,237,224,0.6)", lineHeight: 1.4 }}>
              Pause. Wait for the full answer. A "yes, but…" is a no in disguise. A fast, unqualified yes is the only green flag.
              Thank them and let them go.
            </div>
          </div>

          {/* Summary box */}
          <div style={{ marginTop: "8pt", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8pt" }}>
            {["Total green flags", "Total yellow flags", "Total red flags", "Overall decision"].map((label, i) => (
              <div key={label} style={{ borderTop: `2pt solid ${i === 3 ? AMBER : RULE}`, paddingTop: "5pt" }}>
                <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: MUTED, marginBottom: "3pt" }}>
                  {label}
                </div>
                <div style={{ height: "12pt", borderBottom: `0.5pt solid ${RULE}` }} />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: "12pt", borderTop: `1pt solid rgba(31,61,46,0.12)`, paddingTop: "6pt", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "7pt", color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Headwaters Development Services · Confidential · Reference Call — Standard
            </div>
            <div style={{ fontSize: "7pt", color: MUTED }}>
              For handyman-housekeeper role use the extended script at /tools/reference-call-handyman
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
