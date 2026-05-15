/**
 * ReferenceCallHandyman.tsx
 *
 * Extended reference-call script for the handyman-housekeeper role.
 * This script carries all six standard questions PLUS a child-safety
 * block that must be completed before any offer is extended.
 *
 * HESITATION-IS-A-NO RULE: Any pause, hedge, or qualifier on the child-safety
 * questions is treated as a disqualifying red flag — no exceptions.
 *
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
const WARN   = "#7a1a1a";

interface Question {
  priority: string;
  question: string;
  listeningCue: string;
  greenFlag: string;
  yellowFlag: string;
  redFlag: string;
  absolute?: boolean;
}

const STANDARD_QUESTIONS: Question[] = [
  {
    priority: "S1",
    question: "How long did you work with [candidate], what was the role, and did they ever work in or around your home?",
    listeningCue: "Establish context early. For this role you need a reference who saw the candidate in a home environment — not just a professional setting.",
    greenFlag: "Worked directly with them in a home or caregiving context for 6+ months.",
    yellowFlag: "Knows them well professionally but limited home/caregiving exposure.",
    redFlag: "Vague relationship; no direct supervision; can't describe actual tasks.",
  },
  {
    priority: "S2",
    question: "What were their greatest strengths in that role — give me a concrete example.",
    listeningCue: "Push for a specific story. For this role, look for calm under pressure, attentiveness, and initiative without being asked.",
    greenFlag: "Describes initiative, care, and a specific moment where they went beyond the task.",
    yellowFlag: "Warm but generic — repeats obvious traits without illustration.",
    redFlag: "Hesitates; can only describe output, not the person doing it.",
  },
  {
    priority: "S3",
    question: "Describe a time things didn't go as planned. How did they handle it?",
    listeningCue: "Nobody's record is perfect. A reference with zero negatives is hiding something. Homes and households have crises — find out how this person responds.",
    greenFlag: "Tells a real stumble story; candidate stayed calm, communicated, and resolved it.",
    yellowFlag: "Acknowledges imperfection but frames it as a virtue; no real example.",
    redFlag: "Insists nothing ever went wrong, or minimises a serious incident.",
  },
  {
    priority: "S4",
    question: "How did they respond when corrected or asked to do something differently?",
    listeningCue: "In a home role, the practitioner or family members will be the correctors. You need someone who can hear hard feedback without drama.",
    greenFlag: "Took feedback cleanly, implemented it, and didn't bring it up again.",
    yellowFlag: "Generally receptive but occasionally sulked or needed multiple rounds.",
    redFlag: "Argued back, went around the feedback-giver, or repeated the same behaviour.",
  },
  {
    priority: "S5",
    question: "Were they reliable — consistently where they said they'd be, doing what they said they'd do?",
    listeningCue: "Household reliability is non-negotiable. Childcare and home maintenance schedules have no slack. Listen for any qualification.",
    greenFlag: "\"I never had to wonder\" — never a no-show, always communicated proactively.",
    yellowFlag: "Mostly reliable but needed occasional nudges; occasional last-minute changes.",
    redFlag: "Pattern of no-shows, late arrivals, or promises that didn't hold.",
  },
  {
    priority: "S6",
    question: "Were there any concerns — from you or others — about their honesty, judgment, or how they used their access to your home or possessions?",
    listeningCue: "LISTEN FOR THE PAUSE. A long pause before a clean answer is a yellow flag. Any hesitation followed by a qualifier on honesty or access is a disqualifying red flag for this role — not a probation note.",
    greenFlag: "\"No. I trusted them completely and I still do. They had full access and nothing ever made me wonder.\"",
    yellowFlag: "Hesitates then gives a clean answer — probe once more: \"anything at all, even something minor?\"",
    redFlag: "Any hesitation on honesty, any unnamed incident, any \"as far as I know.\" Treat as disqualifying.",
  },
];

const CHILD_SAFETY_QUESTIONS: Question[] = [
  {
    priority: "C1",
    question: "Did [candidate] ever interact with children — either in your household, or in settings where children were present?",
    listeningCue: "Establish baseline. If yes, every subsequent question in this block becomes mandatory and must be answered cleanly before you proceed.",
    greenFlag: "Yes — describes natural, appropriate, caring interaction; children were comfortable around them.",
    yellowFlag: "Limited interaction — probe whether it was by choice or circumstance.",
    redFlag: "Inconsistency about whether interactions occurred; deflection.",
  },
  {
    priority: "C2",
    question: "Were there times when they were alone with children — even briefly? How did that go?",
    listeningCue: "The word \"alone\" matters. Listen for hesitation, redirection, or sudden vagueness. A clean, fast, confident answer is the only green flag.",
    greenFlag: "\"Yes, and I never thought twice about it. Kids loved them. I'd leave them with my own kids right now.\"",
    yellowFlag: "\"I think so, briefly\" — vague about whether it happened or what it looked like.",
    redFlag: "Hesitates, changes subject, or adds a qualifier you didn't ask for.",
    absolute: true,
  },
  {
    priority: "C3",
    question: "Did anything about how they interacted with children ever make you pause — even momentarily?",
    listeningCue: "This is the direct discomfort question. It is deliberately uncomfortable. A good reference who genuinely trusts the candidate will answer this fast and clean. Slow it down if needed — do not rescue them by rephrasing.",
    greenFlag: "\"No. Nothing. Not once.\"",
    yellowFlag: "\"I don't think so\" or \"not really\" — these are not clean answers. Probe: \"So that's a definite no?\"",
    redFlag: "Any pause. Any \"well, there was this one time.\" Any qualifier. Stop the call and note in detail.",
    absolute: true,
  },
  {
    priority: "C4",
    question: "How would you describe their judgment when no one else was around — when it was just them and someone they were responsible for?",
    listeningCue: "This question tests unsupervised character. A home role means long stretches without oversight. You need someone whose judgment holds when nobody is watching.",
    greenFlag: "Consistent — \"same whether I was watching or not.\" Can describe a specific unsupervised moment where judgment was sound.",
    yellowFlag: "\"I think so\" or \"I never noticed a problem\" — uncertainty about unsupervised conduct.",
    redFlag: "Pauses or names a specific incident; contradicts earlier praise; goes vague exactly when you need specificity.",
  },
  {
    priority: "C5",
    question: "The final question — and I need you to think about it: would you leave [candidate] alone with your own children?",
    listeningCue:
      "THIS IS THE SINGLE MOST IMPORTANT QUESTION IN THE ENTIRE HIRING PROCESS FOR THIS ROLE. Do not soften it. Do not add qualifiers. Ask it exactly as written, then wait in silence. The only acceptable answer is a fast, unqualified yes. Anything else — a pause, a 'yes but', a 'probably', a laugh before answering, a 'that's a hard question' — is a no. Thank them and end the call.",
    greenFlag: "\"Yes. Without a second thought. Right now if you need me to.\"",
    yellowFlag: "\"I think so\" / \"probably\" / \"yeah, I believe so\" — these are all NO. Do not advance the candidate.",
    redFlag: "Any hesitation. Any qualification. Any deflection. Candidate does not advance — no exceptions.",
    absolute: true,
  },
];

function FlagDot({ color }: { color: string }) {
  return (
    <span style={{ display: "inline-block", width: "7pt", height: "7pt", borderRadius: "50%", background: color, marginRight: "4pt", verticalAlign: "middle" }} />
  );
}

function QuestionBlock({ q, shade }: { q: Question; shade?: boolean }) {
  return (
    <div
      style={{
        marginBottom: "7pt",
        paddingBottom: "7pt",
        borderBottom: `0.5pt solid ${q.absolute ? "rgba(176,48,48,0.25)" : RULE}`,
        background: shade ? "rgba(176,48,48,0.04)" : undefined,
        padding: shade ? "6pt 7pt" : undefined,
        borderRadius: shade ? "2pt" : undefined,
        border: shade ? `0.75pt solid rgba(176,48,48,0.2)` : undefined,
      }}
    >
      <div style={{ display: "flex", gap: "8pt", alignItems: "flex-start" }}>
        <div style={{ minWidth: "17pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "7pt", fontWeight: 700, color: shade ? RED : AMBER, paddingTop: "1pt" }}>
          {q.priority}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "9pt", fontWeight: 600, color: DARK, lineHeight: 1.4, marginBottom: "3pt" }}>
            {q.question}
          </div>
          {q.absolute && (
            <div style={{ fontSize: "7.5pt", fontWeight: 700, color: WARN, letterSpacing: "0.05em", marginBottom: "3pt", textTransform: "uppercase" }}>
              ⬥ Hesitation-is-a-no — any pause, qualifier, or hedge is a disqualifying red flag
            </div>
          )}
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
          <div style={{ marginTop: "4pt", borderBottom: `0.5pt solid ${RULE}`, height: "14pt" }}>
            <span style={{ fontSize: "7pt", color: MUTED }}>Notes: </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReferenceCallHandyman() {
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

          {/* Red-amber dual rule for this script */}
          <div style={{ display: "flex", height: "3pt", margin: "0 0 12pt" }}>
            <div style={{ flex: 1, background: AMBER }} />
            <div style={{ flex: 1, background: RED }} />
          </div>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10pt" }}>
            <div>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
                Practitioner Operating Plan — Hiring Tools
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "20pt", fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: "2pt" }}>
                Reference-Call Script
              </div>
              <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "14pt", fontWeight: 400, color: RED, fontStyle: "italic", marginBottom: "4pt" }}>
                Handyman-Housekeeper — Extended with Child-Safety Block
              </div>
              <div style={{ fontSize: "8.5pt", color: MUTED, lineHeight: 1.45, maxWidth: "4.2in" }}>
                Three calls per candidate minimum. Complete all six standard questions first,
                then every question in the child-safety block — in order, without skipping.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED }}>Confidential</div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>Headwaters Development Services</div>
              <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "6pt" }}>Candidate: _______________</div>
              <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "2pt" }}>Reference: _______________</div>
              <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "2pt" }}>Date: ____________________</div>
              <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "2pt" }}>Call #: ___  of  3</div>
            </div>
          </div>

          {/* Warning banner */}
          <div style={{ background: "rgba(122,26,26,0.08)", border: `1.5pt solid rgba(176,48,48,0.4)`, borderRadius: "3pt", padding: "7pt 10pt", marginBottom: "10pt" }}>
            <div style={{ fontSize: "8pt", fontWeight: 700, color: WARN, marginBottom: "3pt", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Hesitation-is-a-no rule — read before starting
            </div>
            <div style={{ fontSize: "8pt", color: TEXT, lineHeight: 1.5 }}>
              On questions C2, C3, and C5: any pause, hedge, qualifier, or laugh before answering is treated as a disqualifying red flag.
              You do not need a second red flag. You do not need to finish the call. The candidate does not advance.
              Write down the exact words the reference used before ending the conversation.
            </div>
          </div>

          {/* Opening line */}
          <div style={{ background: "rgba(31,61,46,0.06)", border: `1pt solid ${RULE}`, borderRadius: "3pt", padding: "7pt 10pt", marginBottom: "10pt" }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
              Opening Line — say this verbatim
            </div>
            <div style={{ fontSize: "9pt", color: TEXT, lineHeight: 1.5, fontStyle: "italic" }}>
              "Hi [name], my name is [your name]. I'm doing a reference check for [candidate] who has applied to work in our home as a handyman-housekeeper.
              I have about eleven questions — the last few relate to working around children and I want to be upfront about that.
              Everything you say stays between us. Ready?"
            </div>
          </div>

          {/* Flag legend */}
          <div style={{ display: "flex", gap: "10pt", marginBottom: "9pt", padding: "6pt 10pt", border: `1pt solid ${RULE}`, borderRadius: "3pt" }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED, alignSelf: "center", minWidth: "52pt" }}>
              Flag legend:
            </div>
            {[
              { color: GREEN,  label: "Green",  description: "Proceed. Reference confirms the candidate." },
              { color: YELLOW, label: "Yellow", description: "Note it; probe once more; watch in paid trial." },
              { color: RED,    label: "Red",    description: "Stop. Two reds in standard = no. Any red in child-safety block = no." },
            ].map(f => (
              <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: "4pt", flex: 1 }}>
                <span style={{ display: "inline-block", width: "7pt", height: "7pt", borderRadius: "50%", background: f.color, marginRight: "4pt", marginTop: "1pt", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "7.5pt", fontWeight: 700, color: f.color }}>{f.label}</div>
                  <div style={{ fontSize: "7pt", color: MUTED, lineHeight: 1.3 }}>{f.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Part 1 — Standard questions */}
          <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "5pt" }}>
            Part I — Standard Questions (S1–S6)
          </div>

          {STANDARD_QUESTIONS.map((q) => (
            <QuestionBlock key={q.priority} q={q} />
          ))}

          {/* Divider into child-safety block */}
          <div style={{ margin: "10pt 0 8pt", display: "flex", alignItems: "center", gap: "8pt" }}>
            <div style={{ flex: 1, height: "1pt", background: `rgba(176,48,48,0.35)` }} />
            <div style={{ fontSize: "7.5pt", fontWeight: 700, color: RED, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2pt 8pt", border: `1pt solid rgba(176,48,48,0.4)`, borderRadius: "2pt" }}>
              Child-Safety Block — C1 through C5 — All required, no skipping
            </div>
            <div style={{ flex: 1, height: "1pt", background: `rgba(176,48,48,0.35)` }} />
          </div>

          {/* Part 2 — Child-safety questions */}
          {CHILD_SAFETY_QUESTIONS.map((q) => (
            <QuestionBlock key={q.priority} q={q} shade={q.absolute} />
          ))}

          {/* Closing */}
          <div style={{ background: DARK, borderRadius: "3pt", padding: "9pt 12pt", marginTop: "8pt" }}>
            <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,237,224,0.55)", marginBottom: "4pt" }}>
              After C5 — If the call is still proceeding (all greens)
            </div>
            <div style={{ fontSize: "9pt", color: "rgba(244,237,224,0.9)", lineHeight: 1.5, fontStyle: "italic" }}>
              "Thank you — that's everything I needed, and I really appreciate your time. 
              Can I call you back if something specific comes up as we finish the hiring process?"
            </div>
            <div style={{ marginTop: "6pt", fontSize: "8pt", color: "rgba(244,237,224,0.6)", lineHeight: 1.4 }}>
              If the call ended early at C2, C3, or C5 — write down the exact words before hanging up.
              Do not advance the candidate. Do not discuss it with the candidate directly. Mark file closed.
            </div>
          </div>

          {/* Summary grid */}
          <div style={{ marginTop: "8pt", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "7pt" }}>
            {["Standard greens", "Standard reds", "Child-safety — any red?", "Would hire again? (C5)", "Final decision"].map((label, i) => (
              <div key={label} style={{ borderTop: `2pt solid ${i >= 2 ? RED : RULE}`, paddingTop: "5pt" }}>
                <div style={{ fontSize: "6.5pt", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: i >= 2 ? RED : MUTED, marginBottom: "3pt", lineHeight: 1.3 }}>
                  {label}
                </div>
                <div style={{ height: "12pt", borderBottom: `0.5pt solid ${RULE}` }} />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: "10pt", borderTop: `1pt solid rgba(31,61,46,0.12)`, paddingTop: "6pt", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "7pt", color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Headwaters Development Services · Confidential · Handyman-Housekeeper Reference Script
            </div>
            <div style={{ fontSize: "7pt", color: MUTED }}>
              Standard script (no child-safety block) at /tools/reference-call
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
