import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ExternalLink, ChevronRight, ChevronLeft, Plus, Minus, Edit2, Check } from "lucide-react";
import { BG, SURFACE, BORDER, BORDER_STRONG, TEXT, TEXT_2, AMBER, FONT_DISPLAY } from "@/lib/theme";

const SPRINT_START = new Date("2026-07-25T00:00:00");
const SPRINT_END   = new Date("2026-10-23T00:00:00");

const STAGES = [
  "Initial contact",
  "1st meeting",
  "2nd meeting ← you are here",
  "Proposal sent",
  "Verbal yes",
  "Contract signed",
  "Month 1 — credentials issued",
  "Month 2 — impact report sent",
  "Day 91 — renewal + expansion call",
];

const LS = {
  stage:        "sprint-gta-stage",
  nextAction:   "sprint-gta-next-action",
  goodbyeSales: "sprint-goodbye-sales",
  printConv:    "sprint-print-conversions",
  todayFocus:   "sprint-today-focus",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function daysRemaining(): number {
  const now = new Date();
  const diff = SPRINT_END.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function sprintDay(): number {
  const now = new Date();
  const diff = now.getTime() - SPRINT_START.getTime();
  return Math.min(90, Math.max(1, Math.ceil(diff / 86_400_000)));
}

const SURF2 = "#1A1714";

function EditableText({
  value, onChange, placeholder, large = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  large?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    onChange(draft.trim() || value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-start gap-2">
        <textarea
          autoFocus
          className="flex-1 rounded-lg px-3 py-2 resize-none outline-none"
          style={{
            backgroundColor: SURF2,
            border: `1px solid ${BORDER_STRONG}`,
            color: TEXT,
            fontSize: large ? 18 : 14,
            fontFamily: large ? FONT_DISPLAY : undefined,
            minHeight: large ? 64 : 52,
          }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commit(); } }}
        />
        <button
          onClick={commit}
          className="mt-1 w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: AMBER }}
        >
          <Check size={16} color="#0B0905" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className="w-full text-left rounded-lg px-3 py-2 flex items-start gap-2 group"
      style={{
        backgroundColor: SURF2,
        border: `1px solid ${BORDER}`,
        color: value === placeholder ? TEXT_2 : TEXT,
        fontSize: large ? 18 : 14,
        fontFamily: large ? FONT_DISPLAY : undefined,
        minHeight: large ? 64 : 52,
      }}
    >
      <span className="flex-1 leading-snug">{value || placeholder}</span>
      <Edit2 size={13} className="shrink-0 mt-0.5 opacity-30 group-hover:opacity-60 transition-opacity" />
    </button>
  );
}

function Counter({
  value, onChange, label, goal, sublabel,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  goal?: number;
  sublabel?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: SURF2, border: `1px solid ${BORDER}` }}
      >
        <Minus size={15} style={{ color: TEXT_2 }} />
      </button>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span style={{ color: TEXT, fontFamily: FONT_DISPLAY, fontSize: 28, lineHeight: 1 }}>{value}</span>
          {goal && (
            <span style={{ color: TEXT_2, fontSize: 13 }}>/ {goal} goal</span>
          )}
        </div>
        <p style={{ color: TEXT_2, fontSize: 12 }}>{sublabel ?? label}</p>
      </div>
      <button
        onClick={() => onChange(value + 1)}
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: "rgba(200,146,58,0.15)", border: `1px solid rgba(200,146,58,0.35)` }}
      >
        <Plus size={15} style={{ color: AMBER }} />
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: AMBER, marginBottom: 10 }}>
      {children}
    </p>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, ...style }}
    >
      {children}
    </div>
  );
}

export function SprintPage() {
  const [stage, setStage]               = useState(() => load(LS.stage, 2));
  const [nextAction, setNextAction]     = useState(() => load(LS.nextAction, ""));
  const [goodbyeSales, setGoodbyeSales] = useState(() => load(LS.goodbyeSales, 0));
  const [printConv, setPrintConv]       = useState(() => load(LS.printConv, 0));
  const [todayFocus, setTodayFocus]     = useState(() => load(LS.todayFocus, ""));

  useEffect(() => { save(LS.stage, stage); }, [stage]);
  useEffect(() => { save(LS.nextAction, nextAction); }, [nextAction]);
  useEffect(() => { save(LS.goodbyeSales, goodbyeSales); }, [goodbyeSales]);
  useEffect(() => { save(LS.printConv, printConv); }, [printConv]);
  useEffect(() => { save(LS.todayFocus, todayFocus); }, [todayFocus]);

  const day  = sprintDay();
  const daysLeft = daysRemaining();
  const pct  = Math.round((day / 90) * 100);

  return (
    <div
      className="min-h-dvh pb-32 px-4 pt-6 max-w-lg mx-auto"
      style={{ backgroundColor: BG, color: TEXT }}
    >
      {/* ── Sprint header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: TEXT_2 }}>
            90-Day Revenue Sprint
          </p>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, lineHeight: 1.1, color: TEXT, margin: "4px 0 0" }}>
            Day {day} of 90
          </h1>
        </div>
        <div
          className="rounded-xl px-3 py-2 text-right shrink-0"
          style={{ backgroundColor: daysLeft <= 14 ? "rgba(239,68,68,0.10)" : "rgba(200,146,58,0.08)", border: `1px solid ${daysLeft <= 14 ? "rgba(239,68,68,0.25)" : "rgba(200,146,58,0.22)"}` }}
        >
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: daysLeft <= 14 ? "#EF4444" : AMBER, lineHeight: 1 }}>
            {daysLeft}
          </p>
          <p style={{ fontSize: 10, color: TEXT_2, letterSpacing: "0.12em", textTransform: "uppercase" }}>days left</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 rounded-full overflow-hidden h-1.5" style={{ backgroundColor: SURFACE }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: AMBER }}
        />
      </div>

      {/* ── Today's single focus ────────────────────────────────────── */}
      <div className="mb-5">
        <SectionLabel>Today's one move</SectionLabel>
        <EditableText
          value={todayFocus}
          onChange={setTodayFocus}
          placeholder="What is the single revenue action for today?"
          large
        />
      </div>

      {/* ── Track 1: GTA Landlord ───────────────────────────────────── */}
      <div className="mb-4">
        <SectionLabel>Track 1 · Gatehouse — GTA Landlord</SectionLabel>
        <Card>
          {/* Deal value */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: AMBER }}>$28,000</p>
              <p style={{ fontSize: 12, color: TEXT_2 }}>one-time + $3,000/mo recurring</p>
            </div>
            <div
              className="rounded-lg px-3 py-1.5 text-right"
              style={{ backgroundColor: "rgba(200,146,58,0.08)", border: `1px solid rgba(200,146,58,0.20)` }}
            >
              <p style={{ fontSize: 11, color: AMBER, fontFamily: "monospace", letterSpacing: "0.12em" }}>1,500 TENANTS</p>
              <p style={{ fontSize: 10, color: TEXT_2 }}>at $2.00/mo steward</p>
            </div>
          </div>

          {/* Stage ladder */}
          <div className="mb-4">
            <p style={{ fontSize: 11, color: TEXT_2, marginBottom: 8, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "monospace" }}>Deal stage</p>
            <div className="space-y-1">
              {STAGES.map((s, i) => {
                const done    = i < stage;
                const current = i === stage;
                const future  = i > stage;
                return (
                  <button
                    key={i}
                    onClick={() => setStage(i)}
                    className="w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                    style={{
                      backgroundColor: current ? "rgba(200,146,58,0.10)" : "transparent",
                      border: current ? `1px solid rgba(200,146,58,0.30)` : "1px solid transparent",
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px]"
                      style={{
                        backgroundColor: done ? AMBER : current ? "rgba(200,146,58,0.20)" : "rgba(237,232,213,0.06)",
                        border: done ? "none" : current ? `1.5px solid ${AMBER}` : `1px solid ${BORDER_STRONG}`,
                        color: done ? BG : current ? AMBER : TEXT_2,
                        fontWeight: 700,
                      }}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: done ? TEXT_2 : current ? TEXT : TEXT_2,
                        fontWeight: current ? 600 : 400,
                        textDecoration: done ? "line-through" : undefined,
                      }}
                    >
                      {s}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setStage(Math.max(0, stage - 1))}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors"
                style={{ backgroundColor: SURF2, border: `1px solid ${BORDER}`, color: TEXT_2 }}
              >
                <ChevronLeft size={12} /> Back
              </button>
              <button
                onClick={() => setStage(Math.min(STAGES.length - 1, stage + 1))}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ backgroundColor: "rgba(200,146,58,0.12)", border: `1px solid rgba(200,146,58,0.30)`, color: AMBER }}
              >
                Advance stage <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Next action */}
          <div>
            <p style={{ fontSize: 11, color: TEXT_2, marginBottom: 6, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "monospace" }}>Next action</p>
            <EditableText
              value={nextAction}
              onChange={setNextAction}
              placeholder="What happens before the next meeting?"
            />
          </div>

          {/* Modules reminder */}
          <div className="mt-4 rounded-xl p-3" style={{ backgroundColor: SURF2 }}>
            <p style={{ fontSize: 10, color: TEXT_2, fontFamily: "monospace", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>Modules on offer</p>
            <div className="grid grid-cols-2 gap-1 text-xs" style={{ color: TEXT_2 }}>
              {[
                ["Base $1.25/m", "tracker + impact"],
                ["Steward $2.00/m", "+ matchmaker"],
                ["Full $2.50/m", "+ moments + beacon"],
              ].map(([tier, desc]) => (
                <div key={tier} className="col-span-1">
                  <span style={{ color: TEXT, fontWeight: 500 }}>{tier}</span>
                  <span style={{ color: TEXT_2 }}> · {desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Track 2: Goodbye Kit ────────────────────────────────────── */}
      <div className="mb-4">
        <SectionLabel>Track 2 · Goodbye Kit — Individual</SectionLabel>
        <Card>
          <Counter
            value={goodbyeSales}
            onChange={setGoodbyeSales}
            label="sales"
            goal={10}
            sublabel={`sales · target 5–10 while Gatehouse closes`}
          />
          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
            <a
              href="https://codetry.ca/goodbye/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
              style={{ color: AMBER }}
            >
              codetry.ca/goodbye/ <ExternalLink size={13} />
            </a>
            <p style={{ fontSize: 11, color: TEXT_2, marginTop: 4 }}>Stripe live · license IDs stamped</p>
          </div>
        </Card>
      </div>

      {/* ── Track 3: Print Suite ────────────────────────────────────── */}
      <div className="mb-6">
        <SectionLabel>Track 3 · Print Suite — Free → Paid</SectionLabel>
        <Card>
          <Counter
            value={printConv}
            onChange={setPrintConv}
            label="conversions"
            sublabel="paid doc conversions from free users"
          />
          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
            <a
              href="https://codetry.ca/suite/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
              style={{ color: AMBER }}
            >
              codetry.ca/suite/ <ExternalLink size={13} />
            </a>
            <p style={{ fontSize: 11, color: TEXT_2, marginTop: 4 }}>13 sheets · Stripe live · license IDs stamped</p>
          </div>
        </Card>
      </div>

      {/* ── Doctrine lockout reminder ───────────────────────────────── */}
      <div
        className="rounded-2xl px-4 py-3 text-center mb-2"
        style={{ backgroundColor: SURF2, border: `1px solid ${BORDER}` }}
      >
        <p style={{ fontSize: 12, color: TEXT_2, fontStyle: "italic" }}>
          Everything else is doctrine. Doctrine waits.
        </p>
        <p style={{ fontSize: 11, color: TEXT_2, marginTop: 2 }}>
          Gatehouse → Goodbye Kit → Print Suite. In that order.
        </p>
      </div>

      {/* ── Links to deeper tools ───────────────────────────────────── */}
      <div className="flex gap-2 mt-4">
        {[
          { label: "This Week", href: "/this-week" },
          { label: "Inbox",     href: "/" },
          { label: "Table",     href: "/table" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex-1 rounded-xl py-2.5 text-center text-xs transition-colors"
            style={{ backgroundColor: SURF2, border: `1px solid ${BORDER}`, color: TEXT_2 }}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
