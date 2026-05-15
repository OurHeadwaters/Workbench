/**
 * SaltBench.tsx — Salt P&L · Depot Bench Roster (VI · 02b)
 *
 * "Last batch" and "Next slot" columns are derived at render time from the
 * BATCHES array in saltBench.ts using today's date. Nothing is hand-coded.
 * Edit saltBench.ts when the rotation changes — this slide follows automatically.
 *
 * Right panel preserves compliance requirements, rotation slot legend, and
 * the depot-bench-roster.xlsx download link.
 */

import {
  SEATS,
  BATCHES,
  getLastBatch,
  getNextSlot,
  fmtDate,
} from "../../data/saltBench";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const TODAY = new Date();

function currentMonthLabel(): string {
  return TODAY.toLocaleDateString("en-CA", { month: "long", year: "numeric" });
}

function nextBatchPreview(): string {
  const todayStr = TODAY.toISOString().slice(0, 10);
  const next = BATCHES.find((b) => b.date >= todayStr);
  if (!next) return "—";
  return `Batch ${next.num} · ${fmtDate(next.date)}`;
}

const ROTATION = [
  { slot: "A", label: "Primary (lead)", pay: "$25/hr + $15 bonus", note: "Runs the depot floor. Signs off on batch QC." },
  { slot: "B", label: "Primary (support)", pay: "$25/hr", note: "Supports A. Steps up if A is unavailable." },
  { slot: "C", label: "Standby (on-call)", pay: "$50 flat fee", note: "Must be reachable. Activated if A or B can't attend." },
  { slot: "D", label: "Off-rotation", pay: "—", note: "Rests this batch. Returns to A next cycle." },
];

const COMPLIANCE = [
  { item: "SIN on file", timing: "Before first paid batch", owner: "OM collects; keep locked offsite" },
  { item: "Direct banking on file", timing: "Before first paid batch", owner: "OM collects; needed for e-transfer" },
  { item: "WSIB clearance certificate", timing: "Current at each batch date", owner: "Person renews; OM checks 2 weeks prior" },
  { item: "Signed SOP acknowledgement", timing: "Before first batch, then annually", owner: "OM stores signed copy in ops folder" },
];

export default function SaltBench() {
  const monthLabel = currentMonthLabel();
  const nextBatch = nextBatchPreview();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="relative z-10 w-full h-full px-[6vw] py-[5vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-[1.8vh]">
          <div className="flex items-center gap-[1vw]">
            <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            <div className="font-mono uppercase tracking-[0.25em] text-[1vw] text-muted">
              VI · 02b — Salt Bench Roster
            </div>
          </div>
          <div className="flex items-center gap-[1.5vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-muted">
              {monthLabel}
            </div>
            <a
              href={`${BASE}/depot-bench-roster.xlsx`}
              download="depot-bench-roster.xlsx"
              className="font-mono uppercase tracking-[0.16em] text-[0.72vw] px-[0.9vw] py-[0.4vh] rounded-[4px] transition-all duration-150 no-underline"
              style={{
                border: "1px solid rgba(184,90,62,0.5)",
                color: "#e9c8a8",
                background: "rgba(184,90,62,0.10)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(184,90,62,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(184,90,62,0.10)";
              }}
            >
              ↓ depot-bench-roster.xlsx
            </a>
          </div>
        </div>

        <h1 className="font-display font-medium text-[3.4vw] leading-[1] tracking-tight text-paper mb-[0.4vh]">
          Who's up next.
        </h1>
        <div className="font-display italic text-[1.15vw] text-muted mb-[2.5vh] max-w-[72vw]">
          Last batch and Next slot derive from the Q2–Q4 rotation in{" "}
          <span className="not-italic font-mono text-paper/70 text-[0.92vw]">saltBench.ts</span>
          {" "}— this slide updates automatically.
        </div>

        {/* Main layout: roster table left · compliance + rotation right */}
        <div className="flex-1 grid grid-cols-[1.6fr_1fr] gap-[2.5vw] min-h-0">

          {/* Left — auto-updating roster table */}
          <div className="flex flex-col min-h-0">

            {/* Table header */}
            <div
              className="grid mb-[0.6vh]"
              style={{ gridTemplateColumns: "1.5fr 0.9fr 1.5fr 1.5fr" }}
            >
              {["Bench seat", "Title", "Last batch", "Next slot"].map((h) => (
                <div
                  key={h}
                  className="font-mono uppercase tracking-[0.18em] text-[0.72vw] text-muted pb-[0.6vh]"
                  style={{ borderBottom: "1px solid rgba(244,237,224,0.14)" }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-[0.4vh]">
              {SEATS.map((seat) => {
                const last = getLastBatch(seat.name, TODAY);
                const next = getNextSlot(seat.name, TODAY);

                const lastLabel = last
                  ? `${fmtDate(last.batch.date)} · ${last.role}`
                  : "—";

                const isNextPrimary = next?.role === "primary";
                const hasNext = !!next;

                return (
                  <div
                    key={seat.name}
                    className="grid items-center rounded-[4px] px-[0.8vw] py-[1vh]"
                    style={{
                      gridTemplateColumns: "1.5fr 0.9fr 1.5fr 1.5fr",
                      border: "1px solid rgba(244,237,224,0.09)",
                      background: "rgba(244,237,224,0.025)",
                    }}
                  >
                    <div className="font-display font-medium text-[1.25vw] text-paper leading-none">
                      {seat.name}
                    </div>
                    <div className="font-mono text-[0.68vw] text-muted uppercase tracking-[0.12em]">
                      {seat.title}
                    </div>
                    <div className="font-body text-[0.88vw] text-muted leading-snug">
                      {lastLabel}
                    </div>
                    <div className="flex items-center gap-[0.45vw]">
                      {hasNext && (
                        <span
                          className="inline-block rounded-[3px] px-[0.4vw] py-[0.2vh] font-mono uppercase tracking-[0.12em] text-[0.6vw] leading-none"
                          style={{
                            background: isNextPrimary ? "rgba(184,90,62,0.22)" : "rgba(244,237,224,0.10)",
                            color: isNextPrimary ? "#e9a080" : "rgba(244,237,224,0.6)",
                            border: isNextPrimary ? "1px solid rgba(184,90,62,0.35)" : "1px solid rgba(244,237,224,0.16)",
                          }}
                        >
                          {next!.role}
                        </span>
                      )}
                      <span
                        className="font-body text-[0.88vw] leading-snug"
                        style={{ color: hasNext ? "#f4ede0" : "rgba(244,237,224,0.3)" }}
                      >
                        {hasNext ? fmtDate(next!.batch.date) : "no slot"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer legend + next-batch callout */}
            <div className="mt-auto pt-[1.8vh] border-t border-rule flex items-center justify-between">
              <div className="flex items-center gap-[2vw]">
                {[
                  { role: "primary", label: "leads the batch day", primary: true },
                  { role: "backup",  label: "on-call cover",       primary: false },
                ].map(({ role, label, primary }) => (
                  <div key={role} className="flex items-center gap-[0.45vw]">
                    <span
                      className="inline-block rounded-[3px] px-[0.4vw] py-[0.2vh] font-mono uppercase tracking-[0.12em] text-[0.6vw] leading-none"
                      style={{
                        background: primary ? "rgba(184,90,62,0.22)" : "rgba(244,237,224,0.10)",
                        color: primary ? "#e9a080" : "rgba(244,237,224,0.6)",
                        border: primary ? "1px solid rgba(184,90,62,0.35)" : "1px solid rgba(244,237,224,0.16)",
                      }}
                    >
                      {role}
                    </span>
                    <span className="font-body text-[0.75vw] text-muted">{label}</span>
                  </div>
                ))}
              </div>
              <div
                className="flex items-center gap-[0.7vw] rounded-[5px] px-[1.1vw] py-[0.7vh]"
                style={{ background: "rgba(31,61,46,0.55)", border: "1px solid rgba(244,237,224,0.14)" }}
              >
                <div className="w-[0.65vw] h-[0.65vw] rounded-full bg-accent shrink-0" />
                <div>
                  <div className="font-mono uppercase tracking-[0.15em] text-[0.6vw] text-muted">Next batch</div>
                  <div className="font-body text-[0.85vw] text-paper font-semibold leading-snug">{nextBatch}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — rotation slots + compliance */}
          <div className="flex flex-col gap-[1.8vh] min-h-0">

            {/* Rotation slots */}
            <div className="border border-rule rounded-[4px] px-[1.2vw] py-[1.2vh] flex flex-col gap-[0.7vh]">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] text-muted mb-[0.1vh]">
                Rotation slots — per batch
              </div>
              {ROTATION.map((r) => (
                <div key={r.slot} className="flex gap-[0.8vw]">
                  <div
                    className="font-display font-medium text-[1.4vw] w-[1.5vw] shrink-0 flex items-start justify-center pt-[0.1vh]"
                    style={{
                      color: r.slot === "A" ? "#4caf7d"
                           : r.slot === "B" ? "#7ec8a0"
                           : r.slot === "C" ? "#e9c8a8"
                           : "rgba(244,237,224,0.28)",
                    }}
                  >
                    {r.slot}
                  </div>
                  <div className="border-l border-rule pl-[0.7vw] flex flex-col gap-[0.05vh]">
                    <div className="font-mono uppercase tracking-[0.1em] text-[0.68vw] text-paper">{r.label}</div>
                    <div className="font-body text-[0.72vw] text-muted">{r.pay}</div>
                    <div className="font-body text-[0.68vw] leading-[1.3]" style={{ color: "rgba(244,237,224,0.45)" }}>{r.note}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance */}
            <div className="flex-1 border border-rule rounded-[4px] px-[1.2vw] py-[1.2vh] flex flex-col gap-[0.6vh] min-h-0">
              <div className="font-mono uppercase tracking-[0.18em] text-[0.7vw] text-muted mb-[0.1vh]">
                Compliance — what must be on file
              </div>
              <div className="flex-1 flex flex-col gap-[0.6vh] overflow-auto">
                {COMPLIANCE.map((c) => (
                  <div key={c.item} className="flex flex-col gap-[0.05vh] pb-[0.6vh] border-b border-rule last:border-0 last:pb-0">
                    <div className="font-body text-[0.78vw] text-paper font-medium leading-[1.25]">{c.item}</div>
                    <div className="font-mono text-[0.62vw]" style={{ color: "#e9c8a8" }}>When: {c.timing}</div>
                    <div className="font-body text-[0.68vw] text-muted leading-[1.3]">{c.owner}</div>
                  </div>
                ))}
              </div>
              <div className="pt-[0.8vh] border-t border-rule font-body text-[0.68vw] text-muted leading-[1.3]">
                Full SIN, banking, and WSIB details live in the spreadsheet only — not in this slide.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
