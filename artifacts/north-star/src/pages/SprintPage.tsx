import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ExternalLink, ChevronRight, Plus, Minus, Edit2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { BG, SURFACE, SURFACE_2, BORDER, BORDER_STRONG, TEXT, TEXT_2, TEXT_3, AMBER, GREEN, RED, FONT_DISPLAY } from "@/lib/theme";

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

const Z3_COLOR = "#A07BC0";
const Z0_COLOR = "#C8933A";

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

function EditableText({
  value, onChange, placeholder, large = false, autoFocus = false
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  large?: boolean;
  autoFocus?: boolean;
}) {
  const [editing, setEditing] = useState(autoFocus || (!value && large));
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(draft.length, draft.length);
    }
  }, [editing]);

  const commit = () => {
    onChange(draft.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="relative z-10 w-full animate-in fade-in duration-200">
        <textarea
          ref={inputRef}
          className="w-full rounded-2xl px-5 py-4 resize-none outline-none tap-feedback"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            border: `1px solid ${large ? AMBER : BORDER_STRONG}`,
            color: TEXT,
            fontSize: large ? 32 : 16,
            fontFamily: large ? FONT_DISPLAY : undefined,
            minHeight: large ? 120 : 80,
            lineHeight: 1.1,
            boxShadow: large ? `0 0 20px rgba(200,146,58,0.1)` : 'none'
          }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          }}
          onBlur={commit}
          placeholder={placeholder}
        />
        <div className="absolute right-4 bottom-4 flex gap-2">
          <button
            onMouseDown={(e) => { e.preventDefault(); commit(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors tap-feedback"
          >
            <Check size={16} color={TEXT} />
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = !value.trim();

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className="w-full text-left rounded-2xl px-5 py-4 flex items-start gap-4 group tap-feedback relative z-10"
      style={{
        backgroundColor: isEmpty ? "transparent" : "rgba(0,0,0,0.2)",
        border: `1px solid ${isEmpty ? (large ? "rgba(200,146,58,0.3)" : BORDER) : BORDER}`,
        minHeight: large ? 120 : 80,
        transition: "all 0.2s ease"
      }}
    >
      <div className="flex-1">
        {isEmpty ? (
          <span style={{ 
            color: large ? AMBER : TEXT_2, 
            fontSize: large ? 24 : 16, 
            fontFamily: large ? FONT_DISPLAY : undefined,
            opacity: 0.7 
          }}>
            {placeholder}
          </span>
        ) : (
          <span style={{ 
            color: TEXT, 
            fontSize: large ? 32 : 16, 
            fontFamily: large ? FONT_DISPLAY : undefined,
            lineHeight: 1.1,
            display: "block"
          }}>
            {value}
          </span>
        )}
      </div>
      <Edit2 size={16} className={`shrink-0 mt-2 transition-opacity ${isEmpty ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} color={TEXT_3} />
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
  const [pulse, setPulse] = useState(false);

  const handleInc = () => {
    onChange(value + 1);
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
  };

  const handleDec = () => {
    onChange(Math.max(0, value - 1));
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-baseline gap-2">
          <span 
            className="transition-transform duration-200"
            style={{ 
              color: TEXT, 
              fontFamily: FONT_DISPLAY, 
              fontSize: 36, 
              lineHeight: 1,
              transform: pulse ? "scale(1.1)" : "scale(1)",
              display: "inline-block"
            }}
          >
            {value}
          </span>
          {goal && (
            <span style={{ color: TEXT_2, fontSize: 14 }}>/ {goal} {label}</span>
          )}
        </div>
        <p style={{ color: TEXT_3, fontSize: 12, marginTop: 4 }}>{sublabel ?? label}</p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleDec}
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 tap-feedback"
          style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}` }}
        >
          <Minus size={18} style={{ color: TEXT_2 }} />
        </button>
        <button
          onClick={handleInc}
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 tap-feedback relative"
          style={{ 
            backgroundColor: "rgba(200,146,58,0.1)", 
            border: `1px solid rgba(200,146,58,0.3)` 
          }}
        >
          <Plus size={18} style={{ color: AMBER }} />
          {pulse && (
            <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "rgba(200,146,58,0.4)" }} />
          )}
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children, color = AMBER }: { children: React.ReactNode, color?: string }) {
  return (
    <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color, marginBottom: 12 }}>
      {children}
    </p>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="rounded-3xl p-5 relative overflow-hidden"
      style={{ backgroundColor: "rgba(20, 18, 16, 0.6)", backdropFilter: "blur(8px)", border: `1px solid ${BORDER}`, ...style }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

function ConstellationArc({ stage, onAdvance }: { stage: number; onAdvance: () => void }) {
  const [pulsing, setPulse] = useState(false);

  const handleAdvance = () => {
    if (stage < STAGES.length - 1) {
      setPulse(true);
      setTimeout(() => {
        onAdvance();
        setPulse(false);
      }, 400);
    }
  };

  return (
    <div className="py-6 my-2 relative">
      <div className="flex justify-between items-center relative z-10 px-2">
        {STAGES.map((s, i) => {
          const done    = i < stage;
          const current = i === stage;
          const future  = i > stage;
          
          // Calculate an arc curve (parabola)
          const mid = (STAGES.length - 1) / 2;
          const distFromMid = Math.abs(i - mid);
          const yOffset = distFromMid * distFromMid * 1.5; // simple curve

          return (
            <div key={i} className="relative flex flex-col items-center group" style={{ transform: `translateY(${yOffset}px)` }}>
              {/* Connecting line to previous node */}
              {i > 0 && (
                <div 
                  className="absolute right-[50%] top-[8px] h-[1px] w-[calc(100%+16px)] -z-10 origin-right"
                  style={{
                    background: done || current ? `linear-gradient(90deg, ${AMBER} 0%, transparent 100%)` : BORDER,
                    opacity: done ? 0.5 : current ? 0.3 : 0.1,
                  }}
                />
              )}
              
              <div
                className={`w-4 h-4 rounded-full transition-all duration-500 flex items-center justify-center
                  ${current ? 'constellation-node-current' : ''}
                  ${pulsing && current ? 'scale-150' : 'scale-100'}
                `}
                style={{
                  backgroundColor: done ? AMBER : current ? Z3_COLOR : "transparent",
                  border: done ? "none" : current ? `2px solid ${Z3_COLOR}` : `1px solid ${BORDER_STRONG}`,
                  boxShadow: done ? `0 0 10px ${AMBER}` : current ? `0 0 15px ${Z3_COLOR}` : "none",
                }}
              />
              
              {/* Tooltip on hover */}
              <div className="absolute top-6 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-black/80 text-[10px] px-2 py-1 rounded backdrop-blur text-white border border-white/10 shadow-xl">
                  {s.replace(" ← you are here", "")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 text-center">
        <p style={{ color: TEXT_2, fontSize: 13, marginBottom: 8, fontStyle: "italic" }}>
          Current: <span style={{ color: Z3_COLOR, fontWeight: 500 }}>{STAGES[stage].replace(" ← you are here", "")}</span>
        </p>
        <button
          onClick={handleAdvance}
          disabled={stage >= STAGES.length - 1}
          className="tap-feedback rounded-full px-6 py-2.5 text-sm font-medium transition-all"
          style={{ 
            backgroundColor: stage >= STAGES.length - 1 ? SURFACE : `rgba(160,123,192,0.15)`, 
            border: `1px solid ${stage >= STAGES.length - 1 ? BORDER : `rgba(160,123,192,0.3)`}`, 
            color: stage >= STAGES.length - 1 ? TEXT_3 : Z3_COLOR,
            opacity: stage >= STAGES.length - 1 ? 0.5 : 1
          }}
        >
          {stage >= STAGES.length - 1 ? "Completed" : "Advance Stage"}
        </button>
      </div>
    </div>
  );
}

export function SprintPage() {
  const [stage, setStage]               = useState(() => load(LS.stage, 2));
  const [nextAction, setNextAction]     = useState(() => load(LS.nextAction, ""));
  const [goodbyeSales, setGoodbyeSales] = useState(() => load(LS.goodbyeSales, 0));
  const [printConv, setPrintConv]       = useState(() => load(LS.printConv, 0));
  const [todayFocus, setTodayFocus]     = useState(() => load(LS.todayFocus, ""));
  
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => { save(LS.stage, stage); }, [stage]);
  useEffect(() => { save(LS.nextAction, nextAction); }, [nextAction]);
  useEffect(() => { save(LS.goodbyeSales, goodbyeSales); }, [goodbyeSales]);
  useEffect(() => { save(LS.printConv, printConv); }, [printConv]);
  useEffect(() => { save(LS.todayFocus, todayFocus); }, [todayFocus]);

  const day  = sprintDay();
  const daysLeft = daysRemaining();
  const pct  = Math.round((day / 90) * 100);
  
  const isUrgent = daysLeft <= 14;

  return (
    <div className="min-h-dvh pb-32 px-4 pt-8 max-w-lg mx-auto relative" style={{ zIndex: 1 }}>
      
      {/* ── Sprint header & River ───────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: TEXT_2, marginBottom: 4 }}>
            Revenue Sprint
          </p>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 800, lineHeight: 1, color: TEXT }}>
            Day {day}
          </h1>
        </div>
        
        <div className="text-right">
          <span style={{ 
            fontFamily: FONT_DISPLAY, 
            fontSize: 28, 
            fontWeight: 700, 
            color: isUrgent ? RED : TEXT,
            opacity: isUrgent ? 1 : 0.9 
          }}>
            {daysLeft}
          </span>
          <span style={{ fontSize: 12, color: TEXT_3, letterSpacing: "0.1em", textTransform: "uppercase", marginLeft: 4 }}>left</span>
        </div>
      </div>

      {/* Progress River */}
      <div className="mb-12 rounded-full overflow-hidden h-2 relative" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out slow-river"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* ── Today's single focus ────────────────────────────────────── */}
      <div className="mb-12 relative">
        <div className="lantern-glow" />
        <SectionLabel>Today's One Move</SectionLabel>
        <EditableText
          value={todayFocus}
          onChange={setTodayFocus}
          placeholder="Declare the single revenue action for today."
          large
        />
        <div className="h-px w-full mt-8 watershed-shimmer" />
      </div>

      {/* ── Track 1: GTA Landlord ───────────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel color={Z3_COLOR}>Track 1 · Gatehouse (GTA Landlord)</SectionLabel>
        <Card style={{ borderColor: `rgba(160,123,192,0.2)` }}>
          
          <ConstellationArc 
            stage={stage} 
            onAdvance={() => setStage(Math.min(STAGES.length - 1, stage + 1))} 
          />

          <div className="mt-8 mb-6">
            <p style={{ fontSize: 11, color: TEXT_3, marginBottom: 8, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace" }}>Next Action</p>
            <EditableText
              value={nextAction}
              onChange={setNextAction}
              placeholder="What happens before the next stage?"
            />
          </div>

          {/* Deal Value & Pricing Fold */}
          <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, color: Z3_COLOR }}>$28,000</p>
                <p style={{ fontSize: 13, color: TEXT_2 }}>one-time + $3k/mo</p>
              </div>
              <button 
                onClick={() => setShowPricing(!showPricing)}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full tap-feedback"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: TEXT_2 }}
              >
                Pricing {showPricing ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
            
            {showPricing && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-4 bg-black/40 rounded-xl p-4">
                <p style={{ fontSize: 11, color: Z3_COLOR, fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 8 }}>1,500 TENANTS</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/60">Base $1.25/m</span><span className="text-white/40">tracker + impact</span></div>
                  <div className="flex justify-between"><span className="text-white">Steward $2.00/m</span><span className="text-white/40">+ matchmaker</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Full $2.50/m</span><span className="text-white/40">+ moments + beacon</span></div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Track 2: Goodbye Kit ────────────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel color={Z0_COLOR}>Track 2 · Goodbye Kit (Individual)</SectionLabel>
        <Card style={{ borderColor: `rgba(200,146,58,0.2)` }}>
          <Counter
            value={goodbyeSales}
            onChange={setGoodbyeSales}
            label="sales"
            goal={10}
            sublabel="Target: 5–10 while Gatehouse closes"
          />
          <div className="mt-6 pt-4 flex justify-between items-center" style={{ borderTop: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 11, color: TEXT_3 }}>Stripe live · License IDs stamped</p>
            <a
              href="https://codetry.ca/goodbye/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors hover:bg-white/10"
              style={{ color: Z0_COLOR, backgroundColor: "rgba(200,146,58,0.1)" }}
            >
              codetry.ca <ExternalLink size={10} />
            </a>
          </div>
        </Card>
      </div>

      {/* ── Track 3: Print Suite ────────────────────────────────────── */}
      <div className="mb-12">
        <SectionLabel color={Z0_COLOR}>Track 3 · Print Suite (Free → Paid)</SectionLabel>
        <Card style={{ borderColor: `rgba(200,146,58,0.2)` }}>
          <Counter
            value={printConv}
            onChange={setPrintConv}
            label="conversions"
            sublabel="Paid doc conversions from free users"
          />
          <div className="mt-6 pt-4 flex justify-between items-center" style={{ borderTop: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 11, color: TEXT_3 }}>13 sheets · Stripe live</p>
            <a
              href="https://codetry.ca/suite/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors hover:bg-white/10"
              style={{ color: Z0_COLOR, backgroundColor: "rgba(200,146,58,0.1)" }}
            >
              codetry.ca <ExternalLink size={10} />
            </a>
          </div>
        </Card>
      </div>

      {/* ── Docs ─────────────────────────────────── */}
      <div className="mt-12 mb-2 flex justify-center">
        <Link
          href="/zone2-alignment"
          className="flex items-center gap-1.5 text-[11px] px-4 py-2 rounded-full border transition-colors hover:opacity-80"
          style={{ color: "#6B7AAD", borderColor: "#1E2A4A", background: "#0D1220" }}
        >
          <span>⟳</span>
          Zone 2 / Buzz Alignment — feature inventory &amp; implementation roadmap
          <ChevronRight size={10} />
        </Link>
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <div className="text-center mt-8 mb-8 opacity-40">
        <p style={{ fontSize: 13, color: TEXT, fontStyle: "italic", fontFamily: FONT_DISPLAY }}>
          Everything else is doctrine. Doctrine waits.
        </p>
      </div>

    </div>
  );
}
