/**
 * SaltBench.tsx — Salt P&L · Depot Bench Roster
 *
 * Covers the 4-person depot bench: rotation logic, compliance requirements
 * (SIN, banking, WSIB), pay structure, and links to the downloadable
 * depot-bench-roster.xlsx template the OM maintains.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const BENCH = [
  {
    name: "Marie T.",
    status: "Active",
    statusColor: "#4caf7d",
    role: "Primary lead",
    note: "SIN + banking on file. WSIB current. Completed 6 batches.",
  },
  {
    name: "Devin A.",
    status: "Active",
    statusColor: "#4caf7d",
    role: "Primary support",
    note: "SIN + banking on file. WSIB current.",
  },
  {
    name: "Jess W.",
    status: "Standby",
    statusColor: "#e9c8a8",
    role: "Standby (on-call)",
    note: "SIN + banking required before first paid batch.",
  },
  {
    name: "Roger S.",
    status: "Standby",
    statusColor: "#e9c8a8",
    role: "Standby (on-call)",
    note: "SIN + banking required before first paid batch.",
  },
];

const ROTATION = [
  { slot: "A", label: "Primary (lead)", pay: "$25/hr + $15 completion bonus", note: "Runs the depot floor. Signs off on batch QC." },
  { slot: "B", label: "Primary (support)", pay: "$25/hr", note: "Supports A. Steps up to A if A is unavailable." },
  { slot: "C", label: "Standby (on-call)", pay: "$50 flat availability fee", note: "Must be reachable. Activated if A or B can't attend." },
  { slot: "D", label: "Off-rotation", pay: "—", note: "Rests this batch. Returns to A next cycle." },
];

const COMPLIANCE = [
  { item: "SIN on file", timing: "Before first paid batch", owner: "OM collects; keep locked offsite" },
  { item: "Direct banking on file", timing: "Before first paid batch", owner: "OM collects; needed for e-transfer" },
  { item: "WSIB clearance certificate", timing: "Current at each batch date", owner: "Person renews; OM checks 2 weeks prior" },
  { item: "Signed SOP acknowledgement", timing: "Before first batch, then annually", owner: "OM stores signed copy in ops folder" },
];

export default function SaltBench() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[2vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              Salt P&L — Depot Bench Roster
            </div>
          </div>
          <a
            href={`${BASE}/depot-bench-roster.xlsx`}
            download="depot-bench-roster.xlsx"
            className="font-mono uppercase tracking-[0.18em] text-[0.78vw] px-[1vw] py-[0.5vh] rounded-[4px] transition-all duration-150 no-underline"
            style={{
              border: "1px solid rgba(184,90,62,0.55)",
              color: "#e9c8a8",
              background: "rgba(184,90,62,0.12)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(184,90,62,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(184,90,62,0.12)";
            }}
          >
            ↓ depot-bench-roster.xlsx
          </a>
        </div>

        <h1 className="font-display font-medium text-[3.4vw] leading-[1] tracking-tight text-paper mb-[0.4vh]">
          Four people. One rotation. No surprises.
        </h1>
        <div className="font-display italic text-[1.2vw] text-muted mb-[2.5vh] max-w-[70vw]">
          The bench runs A→B→C→D each batch. Everyone leads once every four batches. The spreadsheet is the OM's system of record — keep it current.
        </div>

        <div className="flex-1 grid grid-cols-3 gap-[2vw] min-h-0">

          {/* Left: Seed roster */}
          <div className="border border-rule rounded-[4px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-accent mb-[0.2vh]">
              Seed roster
            </div>
            <div className="flex-1 flex flex-col gap-[1.2vh]">
              {BENCH.map((person) => (
                <div
                  key={person.name}
                  className="rounded-[4px] px-[1vw] py-[0.8vh] flex flex-col gap-[0.2vh]"
                  style={{ background: "rgba(244,237,224,0.04)", border: "1px solid rgba(244,237,224,0.09)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-medium text-[1vw] text-paper">{person.name}</span>
                    <span
                      className="font-mono uppercase tracking-[0.14em] text-[0.65vw] px-[0.5vw] py-[0.15vh] rounded-[3px]"
                      style={{ color: person.statusColor, border: `1px solid ${person.statusColor}44`, background: `${person.statusColor}14` }}
                    >
                      {person.status}
                    </span>
                  </div>
                  <div className="font-mono text-[0.72vw] text-muted">{person.role}</div>
                  <div className="font-body text-[0.72vw] leading-[1.4]" style={{ color: "rgba(244,237,224,0.55)" }}>
                    {person.note}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-[1vh] border-t border-rule font-body text-[0.72vw] text-muted leading-[1.35]">
              Full contact details, SIN, and banking live in the spreadsheet only — not in this slide.
            </div>
          </div>

          {/* Middle: Rotation slots */}
          <div className="border border-rule rounded-[4px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.2vh]">
              Rotation slots — per batch
            </div>
            <div className="flex-1 flex flex-col gap-[0.8vh]">
              {ROTATION.map((r) => (
                <div key={r.slot} className="flex gap-[1vw]">
                  <div
                    className="font-display font-medium text-[1.6vw] w-[1.8vw] shrink-0 flex items-start justify-center pt-[0.2vh]"
                    style={{ color: r.slot === "A" ? "#4caf7d" : r.slot === "B" ? "#7ec8a0" : r.slot === "C" ? "#e9c8a8" : "rgba(244,237,224,0.3)" }}
                  >
                    {r.slot}
                  </div>
                  <div className="border-l border-rule pl-[0.8vw] flex flex-col gap-[0.1vh]">
                    <div className="font-mono uppercase tracking-[0.12em] text-[0.72vw] text-paper">{r.label}</div>
                    <div className="font-body text-[0.78vw] text-muted leading-[1.35]">{r.pay}</div>
                    <div className="font-body text-[0.72vw] leading-[1.35]" style={{ color: "rgba(244,237,224,0.5)" }}>{r.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-[1vh] border-t border-rule">
              <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw] text-muted mb-[0.4vh]">Standby rate — $1,200/batch</div>
              <div className="font-body text-[0.72vw] leading-[1.4]" style={{ color: "rgba(244,237,224,0.55)" }}>
                Slot C flat fee ($50) × the 4 people who cycle through standby across 4 batches, plus A+B hours — reconciled in the Budget slide. The Rotation sheet in the xlsx projects the next 12 batches automatically.
              </div>
            </div>
          </div>

          {/* Right: Compliance + download note */}
          <div className="border border-rule rounded-[4px] px-[1.4vw] py-[1.5vh] flex flex-col gap-[1vh]">
            <div className="font-mono uppercase tracking-[0.18em] text-[0.75vw] text-muted mb-[0.2vh]">
              Compliance — what must be on file
            </div>
            <div className="flex-1 flex flex-col gap-[0.8vh]">
              {COMPLIANCE.map((c) => (
                <div key={c.item} className="flex flex-col gap-[0.1vh] pb-[0.7vh] border-b border-rule last:border-0 last:pb-0">
                  <div className="font-body text-[0.82vw] text-paper font-medium leading-[1.3]">{c.item}</div>
                  <div className="flex gap-[0.6vw] flex-wrap">
                    <span className="font-mono text-[0.65vw]" style={{ color: "#e9c8a8" }}>When: {c.timing}</span>
                  </div>
                  <div className="font-body text-[0.72vw] text-muted leading-[1.35]">{c.owner}</div>
                </div>
              ))}
            </div>

            {/* Spreadsheet description */}
            <div
              className="rounded-[4px] px-[1vw] py-[0.8vh] flex flex-col gap-[0.4vh]"
              style={{ background: "rgba(184,90,62,0.08)", border: "1px solid rgba(184,90,62,0.3)" }}
            >
              <div className="font-mono uppercase tracking-[0.14em] text-[0.68vw]" style={{ color: "#e9c8a8" }}>
                depot-bench-roster.xlsx — 3 sheets
              </div>
              <div className="font-body text-[0.72vw] leading-[1.4]" style={{ color: "rgba(244,237,224,0.65)" }}>
                <strong className="text-paper">Sheet 1 — Roster:</strong> Name, base, phone, email, SIN on file, banking on file, WSIB # + expiry, signed SOP date, hire date, status, notes.
              </div>
              <div className="font-body text-[0.72vw] leading-[1.4]" style={{ color: "rgba(244,237,224,0.65)" }}>
                <strong className="text-paper">Sheet 2 — Batch History:</strong> Per-person log of batch date, role, hours, and pay.
              </div>
              <div className="font-body text-[0.72vw] leading-[1.4]" style={{ color: "rgba(244,237,224,0.65)" }}>
                <strong className="text-paper">Sheet 3 — Rotation:</strong> A→B→C→D schedule auto-projected for the next 12 batches from a start date.
              </div>
              <a
                href={`${BASE}/depot-bench-roster.xlsx`}
                download="depot-bench-roster.xlsx"
                className="font-mono uppercase tracking-[0.14em] text-[0.68vw] mt-[0.3vh] no-underline transition-colors duration-150"
                style={{ color: "#e9c8a8" }}
              >
                ↓ Download template →
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
