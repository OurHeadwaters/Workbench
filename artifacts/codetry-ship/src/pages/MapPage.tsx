import { useState, useEffect } from "react";
import { ZONES } from "@/data/zones";
import type { ZoneData, ZoneTool } from "@/data/zones";

const CREAM = "#f4ede0";
const FOREST = "#1f3d2e";
const MUTED = "#7a7a6e";
const RULE = "rgba(200,191,167,0.35)";

/* ─── Quiz types & routing ──────────────────────────────────────────────── */

type WhoAnswer = "household" | "practitioner" | "community" | null;
type SituationAnswer = "normal" | "standby" | null;

interface QuizState {
  who: WhoAnswer;
  situation: SituationAnswer;
  skipped: boolean;
}

function resolveHighlightedZones(quiz: QuizState): number[] {
  if (quiz.skipped || quiz.who === null || quiz.situation === null) return [];
  const base: Record<NonNullable<WhoAnswer>, number[]> = {
    household: [0],
    practitioner: [2],
    community: [4],
  };
  const zones = [...base[quiz.who]];
  if (quiz.situation === "standby") zones.push(3);
  return zones;
}

/* Zone addresses of tools to highlight for each answer combination.
   Keys are "who:situation". Values are zone-address strings. */
const TOOL_HIGHLIGHT_MAP: Record<string, string[]> = {
  "household:normal": ["Z0–A"],
  "household:standby": ["Z0–A", "Z3–A"],
  "practitioner:normal": ["Z2–C", "Z2–D"],
  "practitioner:standby": ["Z2–C", "Z2–D", "Z3–A"],
  "community:normal": ["Z2/Z4"],
  "community:standby": ["Z2/Z4", "Z3–A"],
};

function resolveHighlightedTools(quiz: QuizState): string[] {
  if (quiz.skipped || quiz.who === null || quiz.situation === null) return [];
  return TOOL_HIGHLIGHT_MAP[`${quiz.who}:${quiz.situation}`] ?? [];
}

interface HeaderContent {
  h1: string;
  intro: string;
}

function resolveHeaderContent(quiz: QuizState): HeaderContent {
  const defaultHeader: HeaderContent = {
    h1: "Six zones. One neighbourhood.",
    intro:
      "If you just arrived — from The Train, a shared link, or a QR code on a poster — this is the map. Each zone is a different kind of place. Pick the door that matches what you need.",
  };
  if (quiz.skipped || quiz.who === null || quiz.situation === null)
    return defaultHeader;

  if (quiz.who === "household" && quiz.situation === "normal") {
    return {
      h1: "You're in Zone 0 — The Saltbox.",
      intro:
        "Your household is your first zone. The saltbox holds what you need before winter comes — kit checked, roles assigned, everything in its place.",
    };
  }
  if (quiz.who === "household" && quiz.situation === "standby") {
    return {
      h1: "You're in Zone 0 — The Saltbox, with Zone 3 on watch.",
      intro:
        "The saltbox is open and the network is watching alongside you. Your household roles are live, and Zone 3 has eyes on the horizon.",
    };
  }
  if (quiz.who === "practitioner" && quiz.situation === "normal") {
    return {
      h1: "You're in Zone 2 — The Bench.",
      intro:
        "Planning season. Strategy on the bench, research in the library, the operating plan open. Your practitioner tools are ready when you are.",
    };
  }
  if (quiz.who === "practitioner" && quiz.situation === "standby") {
    return {
      h1: "You're in Zone 2 — The Bench, with Zone 3 on watch.",
      intro:
        "Execution season. Your bench is live, clients are moving, and Zone 3 has the standby ladder active. The tools are hot.",
    };
  }
  if (quiz.who === "community" && quiz.situation === "normal") {
    return {
      h1: "You're in Zone 4 — Community Hall.",
      intro:
        "Deliberation. The hall is set up, evidence is on the table, and the research library is open. No decision required yet — just good preparation.",
    };
  }
  if (quiz.who === "community" && quiz.situation === "standby") {
    return {
      h1: "You're in Zone 4 — Community Hall, with Zone 3 on watch.",
      intro:
        "Session active. Decisions are being made, the hall is open, and Zone 3 pilots are standing by. The community is present.",
    };
  }
  return defaultHeader;
}

function resolveCtaCopy(quiz: QuizState): string {
  if (quiz.skipped || quiz.who === null || quiz.situation === null)
    return "Pack your kit — Begin the Odyssey →";
  if (quiz.who === "household" && quiz.situation === "normal")
    return "Your household kit starts here — Begin the Odyssey →";
  if (quiz.who === "household" && quiz.situation === "standby")
    return "Your saltbox is open and your pilots are watching — Begin the Odyssey →";
  if (quiz.who === "practitioner" && quiz.situation === "normal")
    return "Your practitioner bench is ready — Begin the Odyssey →";
  if (quiz.who === "practitioner" && quiz.situation === "standby")
    return "Your bench is hot and your standby network is live — Begin the Odyssey →";
  if (quiz.who === "community" && quiz.situation === "normal")
    return "Your community hall is set — Begin the Odyssey →";
  if (quiz.who === "community" && quiz.situation === "standby")
    return "The hall is open and the session is active — Begin the Odyssey →";
  return "Pack your kit — Begin the Odyssey →";
}

function scrollToZone(zoneNumber: number) {
  const el = document.getElementById(`zone-${zoneNumber}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ─── Sub-components ────────────────────────────────────────────────────── */

function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: `1px solid ${RULE}`,
        borderRadius: 999,
        background: CREAM,
        padding: 3,
        gap: 0,
      }}
      role="group"
      aria-label="Toggle view mode"
    >
      <button
        type="button"
        onClick={() => onChange(false)}
        style={{
          padding: "4px 14px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          fontFamily: "monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          background: !value ? FOREST : "transparent",
          color: !value ? CREAM : MUTED,
          transition: "all 0.15s",
        }}
      >
        Good Times
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        style={{
          padding: "4px 14px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          fontFamily: "monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          background: value ? "#b85a3e" : "transparent",
          color: value ? "#fff" : MUTED,
          transition: "all 0.15s",
        }}
      >
        Standby
      </button>
    </div>
  );
}

function ToolPill({
  tool,
  highlighted,
}: {
  tool: ZoneTool;
  highlighted: boolean;
}) {
  const isExternal = !tool.url.startsWith("/") || tool.url === "#";
  const disabled = tool.url === "#";

  return (
    <a
      href={disabled ? undefined : tool.url}
      target={isExternal && !disabled ? "_blank" : undefined}
      rel={isExternal && !disabled ? "noopener noreferrer" : undefined}
      style={{
        display: "block",
        padding: "10px 13px",
        borderRadius: 8,
        border: highlighted
          ? `1.5px solid ${FOREST}`
          : `1px solid ${RULE}`,
        background: highlighted
          ? "rgba(31,61,46,0.07)"
          : disabled
          ? "rgba(200,191,167,0.15)"
          : "rgba(255,253,248,0.80)",
        textDecoration: "none",
        cursor: disabled ? "default" : "pointer",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
        opacity: disabled ? 0.55 : 1,
        boxShadow: highlighted ? `0 0 0 3px rgba(31,61,46,0.08)` : "none",
      }}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 2,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: highlighted ? FOREST : "#2a2520",
          }}
        >
          {highlighted && "→ "}
          {tool.name}
        </span>
        {tool.zoneAddress && (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: MUTED,
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            {tool.zoneAddress}
          </span>
        )}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: MUTED,
          lineHeight: 1.45,
        }}
      >
        {tool.tagline}
      </p>
      {!tool.inThisProject && tool.url !== "#" && (
        <span
          style={{
            display: "inline-block",
            marginTop: 4,
            fontFamily: "monospace",
            fontSize: 8,
            color: MUTED,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          External ↗
        </span>
      )}
    </a>
  );
}

function ZoneCard({
  zone,
  standby,
  highlighted,
  dimmed,
  highlightedTools,
}: {
  zone: ZoneData;
  standby: boolean;
  highlighted: boolean;
  dimmed: boolean;
  highlightedTools: string[];
}) {
  return (
    <div
      id={`zone-${zone.number}`}
      style={{
        borderRadius: 12,
        border: highlighted
          ? `2px solid ${zone.color}`
          : `1px solid ${RULE}`,
        overflow: "hidden",
        background: "#faf7f2",
        opacity: dimmed ? 0.38 : 1,
        transition: "opacity 0.3s, border 0.3s, box-shadow 0.3s",
        boxShadow: highlighted
          ? `0 0 0 4px ${zone.color}22, 0 4px 24px ${zone.color}18`
          : "none",
      }}
    >
      {/* Highlighted badge */}
      {highlighted && (
        <div
          style={{
            background: zone.color,
            padding: "5px 18px",
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          ← Your zone
        </div>
      )}

      {/* Header */}
      <div
        style={{
          background: zone.color,
          padding: "14px 18px 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                fontFamily: "monospace",
                fontSize: 13,
                fontWeight: 900,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {zone.number}
            </span>
            <div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 1,
                }}
              >
                Zone {zone.number}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                {zone.name}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 8.5,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.55)",
                  marginTop: 3,
                }}
              >
                {zone.terrain}
              </div>
            </div>
          </div>

          {/* State indicator */}
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 999,
              background: standby
                ? "rgba(184,90,62,0.85)"
                : "rgba(255,255,255,0.15)",
              fontFamily: "monospace",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fff",
              flexShrink: 0,
              alignSelf: "flex-start",
            }}
          >
            {standby ? "Standby" : zone.rootLabel}
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "rgba(255,255,255,0.72)",
            fontStyle: "italic",
            lineHeight: 1.45,
          }}
        >
          {zone.metaphor}
        </p>
      </div>

      {/* State description */}
      <div
        style={{
          padding: "12px 18px",
          background: standby
            ? "rgba(184,90,62,0.06)"
            : "rgba(31,61,46,0.04)",
          borderBottom: `1px solid ${RULE}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "#4a4035",
            lineHeight: 1.55,
          }}
        >
          {standby ? zone.standbyDesc : zone.goodTimesDesc}
        </p>
      </div>

      {/* Tools */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
        {zone.tools.length === 0 ? (
          <p style={{ margin: 0, fontSize: 11, color: MUTED, fontStyle: "italic", padding: "4px 4px" }}>
            No tools in this project for this zone yet.
          </p>
        ) : (
          zone.tools.map((tool) => (
            <ToolPill
              key={tool.zoneAddress ?? tool.name}
              tool={tool}
              highlighted={
                highlightedTools.length > 0 &&
                !!tool.zoneAddress &&
                highlightedTools.includes(tool.zoneAddress)
              }
            />
          ))
        )}
      </div>

      {/* Gate */}
      <div
        style={{
          margin: "0 14px 0",
          padding: "10px 13px",
          borderRadius: 8,
          border: `1px dashed rgba(200,191,167,0.6)`,
          background: "transparent",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: zone.color,
            marginBottom: 3,
          }}
        >
          Gate → {zone.gateName}
        </div>
        <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.45 }}>
          {zone.gateDesc}
        </p>
      </div>

      {/* Flows-to breadcrumb */}
      <div
        style={{
          margin: "8px 14px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          Zone {zone.number} of 5
        </span>
        {zone.flowsTo && (
          <>
            <span style={{ fontSize: 8, color: "rgba(200,191,167,0.7)" }}>—</span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: zone.color,
              }}
            >
              flows to {zone.flowsTo} →
            </span>
          </>
        )}
        {!zone.flowsTo && (
          <>
            <span style={{ fontSize: 8, color: "rgba(200,191,167,0.7)" }}>—</span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              the horizon
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Quiz component ────────────────────────────────────────────────────── */

const WHO_OPTIONS: { value: WhoAnswer; label: string; sub: string }[] = [
  { value: "household", label: "A household", sub: "Family, individual, or home unit" },
  { value: "practitioner", label: "A practitioner", sub: "Self-employed, contractor, or agency" },
  { value: "community", label: "A board or community", sub: "Governance, hall, or collective" },
];

const SITUATION_OPTIONS: { value: SituationAnswer; label: string; sub: string }[] = [
  { value: "normal", label: "Normal period", sub: "Everyday life — nothing urgent moving" },
  { value: "standby", label: "Active standby", sub: "Something is moving — the network is watching" },
];

function QuizChip({
  label,
  sub,
  selected,
  color,
  onClick,
}: {
  label: string;
  sub: string;
  selected: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        padding: "10px 14px",
        borderRadius: 8,
        border: selected
          ? `1.5px solid ${color ?? FOREST}`
          : `1px solid ${RULE}`,
        background: selected
          ? `${color ?? FOREST}12`
          : "rgba(255,253,248,0.7)",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s",
        flex: "1 1 140px",
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: selected ? (color ?? FOREST) : "#2a2520",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 10, color: MUTED, lineHeight: 1.4 }}>{sub}</span>
    </button>
  );
}

function ZoneQuiz({
  quiz,
  onChange,
  onSkip,
}: {
  quiz: QuizState;
  onChange: (next: Partial<QuizState>) => void;
  onSkip: () => void;
}) {
  const highlightedZones = resolveHighlightedZones(quiz);
  const isComplete =
    !quiz.skipped && quiz.who !== null && quiz.situation !== null;

  function handleWhoClick(v: WhoAnswer) {
    onChange({ who: v, skipped: false });
  }

  function handleSituationClick(v: SituationAnswer) {
    onChange({ situation: v, skipped: false });
    setTimeout(() => {
      const zones = resolveHighlightedZones({ ...quiz, situation: v, skipped: false });
      if (zones.length > 0) scrollToZone(zones[0]);
    }, 120);
  }

  function handleJump() {
    if (highlightedZones.length > 0) scrollToZone(highlightedZones[0]);
  }

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid rgba(31,61,46,0.18)`,
        background: "rgba(31,61,46,0.04)",
        padding: "18px 20px 16px",
        marginBottom: 24,
        maxWidth: 560,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: FOREST,
          }}
        >
          Find your zone
        </div>
        <button
          type="button"
          onClick={onSkip}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: MUTED,
            padding: 0,
            textDecoration: "underline",
            textDecorationStyle: "dotted",
          }}
        >
          Skip — browse all zones
        </button>
      </div>

      {/* Q1 */}
      <div style={{ marginBottom: 14 }}>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 13,
            color: "#2a2520",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Who are you?
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {WHO_OPTIONS.map((opt) => (
            <QuizChip
              key={opt.value}
              label={opt.label}
              sub={opt.sub}
              selected={quiz.who === opt.value}
              color={FOREST}
              onClick={() => handleWhoClick(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Q2 — only show after Q1 is answered */}
      {quiz.who !== null && (
        <div style={{ marginBottom: isComplete ? 14 : 0 }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 13,
              color: "#2a2520",
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            What's your current situation?
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SITUATION_OPTIONS.map((opt) => (
              <QuizChip
                key={opt.value}
                label={opt.label}
                sub={opt.sub}
                selected={quiz.situation === opt.value}
                color={opt.value === "standby" ? "#b85a3e" : FOREST}
                onClick={() => handleSituationClick(opt.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Result summary */}
      {isComplete && (
        <div
          style={{
            borderTop: `1px solid rgba(31,61,46,0.12)`,
            paddingTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.45 }}>
            Your{" "}
            {highlightedZones.length === 1
              ? "door is"
              : "doors are"}{" "}
            <strong style={{ color: "#2a2520" }}>
              Zone {highlightedZones.join(" + Zone ")}
            </strong>{" "}
            — highlighted below.
          </p>
          <button
            type="button"
            onClick={handleJump}
            style={{
              background: FOREST,
              color: CREAM,
              border: "none",
              borderRadius: 6,
              padding: "6px 14px",
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Jump to my zone ↓
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── localStorage persistence ──────────────────────────────────────────── */

const QUIZ_STORAGE_KEY = "headwaters_zone_quiz";

function loadSavedQuiz(): { quiz: QuizState; collapsed: boolean } | null {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuizState;
    const isComplete =
      !parsed.skipped && parsed.who !== null && parsed.situation !== null;
    if (!isComplete && !parsed.skipped) return null;
    return { quiz: parsed, collapsed: true };
  } catch {
    return null;
  }
}

function saveQuiz(quiz: QuizState) {
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quiz));
  } catch {
    /* storage unavailable — fail silently */
  }
  broadcastZoneChange();
}

function broadcastZoneChange() {
  try {
    const bc = new BroadcastChannel("headwaters_zone");
    bc.postMessage("change");
    bc.close();
  } catch {
    /* BroadcastChannel not supported */
  }
}

/* ─── Main page ─────────────────────────────────────────────────────────── */

function shouldResetOnLoad(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("change") === "1";
  } catch {
    return false;
  }
}

export function MapPage() {
  const resetRequested = shouldResetOnLoad();
  const saved = resetRequested ? null : loadSavedQuiz();

  const [standby, setStandby] = useState(false);
  const [quiz, setQuiz] = useState<QuizState>(
    saved?.quiz ?? { who: null, situation: null, skipped: false }
  );
  const [quizCollapsed, setQuizCollapsed] = useState(saved?.collapsed ?? false);

  /* When arriving via ?change=1 — clear localStorage and strip the param */
  useEffect(() => {
    if (!resetRequested) return;
    try {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    broadcastZoneChange();
    const url = new URL(window.location.href);
    url.searchParams.delete("change");
    window.history.replaceState(null, "", url.toString());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlightedZones = resolveHighlightedZones(quiz);
  const highlightedTools = resolveHighlightedTools(quiz);
  const quizActive = !quiz.skipped && (quiz.who !== null || quiz.situation !== null);
  const quizComplete = !quiz.skipped && quiz.who !== null && quiz.situation !== null;
  const headerContent = resolveHeaderContent(quiz);

  function handleQuizChange(next: Partial<QuizState>) {
    const updated = { ...quiz, ...next };
    setQuiz(updated);
    const nowComplete =
      !updated.skipped && updated.who !== null && updated.situation !== null;
    if (nowComplete) {
      saveQuiz(updated);
      setQuizCollapsed(true);
    }
  }

  function handleSkip() {
    const skipped: QuizState = { who: null, situation: null, skipped: true };
    setQuiz(skipped);
    saveQuiz(skipped);
    setQuizCollapsed(true);
  }

  function handleChange() {
    try {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    broadcastZoneChange();
    setQuiz({ who: null, situation: null, skipped: false });
    setQuizCollapsed(false);
  }

  /* On return visits, scroll to the visitor's highlighted zone once on mount */
  useEffect(() => {
    if (highlightedZones.length === 0) return;
    const timer = setTimeout(() => {
      scrollToZone(highlightedZones[0]);
    }, 300);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync standby toggle with quiz situation answer */
  useEffect(() => {
    if (quizComplete && quiz.situation === "standby") {
      setStandby(true);
    } else if (quizComplete && quiz.situation === "normal") {
      setStandby(false);
    }
  }, [quiz.situation, quizComplete]);

  const ctaCopy = resolveCtaCopy(quiz);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: CREAM,
        color: "#2a2520",
      }}
    >
      {/* Topographic texture */}
      <div
        aria-hidden
        className="od-topo pointer-events-none"
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.055,
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 820,
          margin: "0 auto",
          padding: "48px 20px 80px",
        }}
      >
        {/* Orientation header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: 10,
            }}
          >
            Headwaters · Neighbourhood Map
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 700,
              color: FOREST,
              lineHeight: 1.15,
              margin: "0 0 8px",
              transition: "opacity 0.25s",
            }}
          >
            {headerContent.h1}
          </h1>
          {quizComplete && (
            <button
              type="button"
              onClick={handleChange}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: MUTED,
                padding: 0,
                textDecoration: "underline",
                textDecorationStyle: "dotted",
                display: "block",
                marginBottom: 14,
              }}
            >
              Not you? Change your zone
            </button>
          )}
          <p
            style={{
              fontSize: 15,
              color: MUTED,
              lineHeight: 1.65,
              maxWidth: 560,
              margin: "0 0 14px",
              transition: "opacity 0.25s",
            }}
          >
            {headerContent.intro}
          </p>

          {/* Terrain tagline callout — mirrors the Compass "In the watershed" note */}
          {!quizComplete && (
            <div
              style={{
                marginBottom: 20,
                padding: "9px 13px",
                borderRadius: 7,
                background: "rgba(31,61,46,0.055)",
                border: "1px solid rgba(31,61,46,0.12)",
                maxWidth: 520,
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: FOREST,
                  marginBottom: 5,
                }}
              >
                In the watershed
              </div>
              <p style={{ margin: 0, fontSize: 11, color: MUTED, lineHeight: 1.65 }}>
                Zones 0–5 run from hearthside to horizon:{" "}
                {ZONES.map((z, i) => (
                  <span key={z.number}>
                    <span style={{ color: z.color, fontWeight: 700 }}>Z{z.number}</span>
                    {" "}<span>{z.terrain}</span>
                    {i < ZONES.length - 1 ? " · " : "."}
                  </span>
                ))}
                {" "}The{" "}
                <a
                  href="/compass"
                  style={{ color: FOREST, textDecoration: "underline", textDecorationStyle: "dotted" }}
                >
                  Compass
                </a>
                {" "}reads the same ground.
              </p>
            </div>
          )}

          {/* Quiz — collapsed summary on return visits, full quiz otherwise */}
          {quizCollapsed ? (
            <div
              style={{
                borderRadius: 10,
                border: `1px solid rgba(31,61,46,0.18)`,
                background: "rgba(31,61,46,0.04)",
                padding: "14px 20px",
                marginBottom: 24,
                maxWidth: 560,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: FOREST,
                    marginBottom: 4,
                  }}
                >
                  Your zone
                </div>
                <div style={{ fontSize: 13, color: "#2a2520", fontWeight: 600 }}>
                  {quiz.skipped
                    ? "Browsing all zones"
                    : `Zone ${resolveHighlightedZones(quiz).join(" + Zone ")}`}
                </div>
              </div>
              <button
                type="button"
                onClick={handleChange}
                style={{
                  background: "none",
                  border: `1px solid rgba(31,61,46,0.25)`,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: FOREST,
                  padding: "5px 12px",
                }}
              >
                Change
              </button>
            </div>
          ) : (
            <ZoneQuiz
              quiz={quiz}
              onChange={handleQuizChange}
              onSkip={handleSkip}
            />
          )}

          {/* Pre-Odyssey framing block */}
          <div
            style={{
              borderRadius: 10,
              border: `1px solid rgba(212,160,23,0.35)`,
              background: "rgba(212,160,23,0.06)",
              padding: "16px 20px",
              marginBottom: 24,
              maxWidth: 560,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#b85a3e",
                marginBottom: 7,
              }}
            >
              Make your map before the Odyssey
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#4a4035", lineHeight: 1.6 }}>
              The best travellers orient before they set out. This map shows the six zones of the Headwaters neighbourhood — the terrain you'll be navigating. Understand the shape of it here, then pack your kit and begin.
            </p>
            <a
              href="/odyssey"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: FOREST,
                textDecoration: "none",
                borderBottom: `1.5px solid ${FOREST}`,
                paddingBottom: 1,
                transition: "opacity 0.15s",
              }}
            >
              Begin the Odyssey →
            </a>
          </div>

          {/* Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <ToggleSwitch value={standby} onChange={setStandby} />
            <span style={{ fontSize: 11, color: MUTED }}>
              {standby
                ? "Standby view — what each zone does when something is moving."
                : "Good Times view — what each zone does on a normal day."}
            </span>
          </div>
        </div>

        {/* ── How the Watershed Works ── */}
        <div
          style={{
            marginBottom: 32,
            borderRadius: 10,
            border: `1px solid rgba(31,61,46,0.18)`,
            background: "rgba(31,61,46,0.04)",
            padding: "20px 22px",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: FOREST,
              marginBottom: 10,
            }}
          >
            How the Watershed Works
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#4a4035", lineHeight: 1.65 }}>
            In permaculture, zones radiate outward from the hearth — the place you visit most becomes Zone 0, and each zone further out is more public, more exposed, and more connected to the outside world. The Headwaters neighbourhood follows the same logic.
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#4a4035", lineHeight: 1.65 }}>
            Water flows from the hearth outward: <strong style={{ color: FOREST }}>The Saltbox (Hearth)</strong> → <strong style={{ color: "#1f3d2e" }}>The Lodge (Roots)</strong> → <strong style={{ color: "#1A5FA8" }}>The Bench (Trail)</strong> → <strong style={{ color: "#3D4A5C" }}>The Standby (Watch)</strong> → <strong style={{ color: "#0F766E" }}>Community Hall (Gather)</strong> → <strong style={{ color: "#5B3E8C" }}>The Wild (Horizon)</strong> — and back again. The community is the watershed.
          </p>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {[
              { num: 0, label: "Hearth", color: "#7A4E2D" },
              { num: 1, label: "Spring", color: "#1f3d2e" },
              { num: 2, label: "Trail", color: "#1A5FA8" },
              { num: 3, label: "Circle", color: "#3D4A5C" },
              { num: 4, label: "Square", color: "#0F766E" },
              { num: 5, label: "Ridge", color: "#5B3E8C" },
            ].map(({ num, label, color }, i, arr) => (
              <div key={num} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <a
                  href={`#zone-${num}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 9px 3px 5px",
                    borderRadius: 999,
                    background: color,
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 16, height: 16, borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)",
                    fontFamily: "monospace", fontSize: 8, fontWeight: 900, color: "#fff",
                  }}>
                    {num}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {label}
                  </span>
                </a>
                {i < arr.length - 1 && (
                  <span style={{ fontFamily: "monospace", fontSize: 9, color: MUTED }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Zone grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
            gap: 16,
          }}
        >
          {ZONES.map((zone) => {
            const isHighlighted = highlightedZones.includes(zone.number);
            const isDimmed = quizActive && highlightedZones.length > 0 && !isHighlighted;
            return (
              <ZoneCard
                key={zone.number}
                zone={zone}
                standby={standby}
                highlighted={isHighlighted}
                dimmed={isDimmed}
                highlightedTools={isHighlighted ? highlightedTools : []}
              />
            );
          })}
        </div>

        {/* Footer — Odyssey CTA */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${RULE}`,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>
            {quizComplete
              ? "Your zone is identified. When you're ready —"
              : "Six zones. One neighbourhood. Each zone is a different kind of place — pick the door that matches what you need."}
          </p>
          <a
            href="/odyssey"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 20px",
              borderRadius: 6,
              background: FOREST,
              color: "#f4ede0",
              fontFamily: "monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            {ctaCopy}
          </a>
        </div>
      </div>
    </main>
  );
}
