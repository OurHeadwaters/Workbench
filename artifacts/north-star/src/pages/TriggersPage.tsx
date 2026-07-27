// ── TriggersPage — relay trigger registry ────────────────────────────────────
// Shows all registered triggers with enable/disable, last-fired time, and a
// "fire now" test button. All scheduling is client-side / browser-based.

import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Zap, Clock, GitBranch, ToggleLeft, ToggleRight } from "lucide-react";
import { useStore } from "@/store";
import { RELAY_EVENT_KINDS } from "@/lib/relay-stub";
import {
  BG, SURFACE, SURFACE_2, BORDER, BORDER_STRONG,
  TEXT, TEXT_2, TEXT_3, AMBER, FONT_DISPLAY,
} from "@/lib/theme";
import type { TriggerDefinition } from "@/types";

function formatRelative(iso: string | undefined): string {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function kindLabel(kind: number): string {
  const map: Record<number, string> = {
    [RELAY_EVENT_KINDS.MORNING_MANIFEST]: "MORNING_MANIFEST",
    [RELAY_EVENT_KINDS.BRIEFING_ENVELOPE]: "BRIEFING_ENVELOPE",
    [RELAY_EVENT_KINDS.GATE_CROSSING]: "GATE_CROSSING",
    [RELAY_EVENT_KINDS.WORKBENCH_PLAN_BURST]: "WORKBENCH_PLAN_BURST",
  };
  return map[kind] ?? `kind:${kind}`;
}

// ── Trigger card ──────────────────────────────────────────────────────────────

function TriggerCard({ trigger }: { trigger: TriggerDefinition }) {
  const setTrigger = useStore((s) => s.setTrigger);
  const fireTrigger = useStore((s) => s.fireTrigger);
  const [firing, setFiring] = useState(false);
  const [firedAt, setFiredAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFire() {
    if (firing) return;
    setFiring(true);
    setError(null);
    try {
      await fireTrigger(trigger.id);
      setFiredAt(new Date().toISOString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setFiring(false);
    }
  }

  const isScheduled = !!trigger.schedule;
  const isCondition = !!trigger.condition;

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{
        backgroundColor: SURFACE,
        border: `1px solid ${trigger.enabled ? BORDER_STRONG : BORDER}`,
        opacity: trigger.enabled ? 1 : 0.6,
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug" style={{ fontFamily: FONT_DISPLAY, color: TEXT }}>
            {trigger.name}
          </p>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: TEXT_3 }}>
            {trigger.id}
          </p>
        </div>

        {/* Enable / disable toggle */}
        <button
          onClick={() => setTrigger(trigger.id, { enabled: !trigger.enabled })}
          className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-medium transition-colors"
          style={{
            backgroundColor: trigger.enabled ? `${AMBER}22` : SURFACE_2,
            color: trigger.enabled ? AMBER : TEXT_3,
            border: `1px solid ${trigger.enabled ? `${AMBER}44` : BORDER}`,
          }}
          title={trigger.enabled ? "Disable trigger" : "Enable trigger"}
        >
          {trigger.enabled
            ? <ToggleRight size={13} />
            : <ToggleLeft size={13} />}
          <span>{trigger.enabled ? "enabled" : "disabled"}</span>
        </button>
      </div>

      {/* Metadata pills */}
      <div className="flex flex-wrap gap-2">
        {/* Kind badge */}
        <span
          className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-mono"
          style={{ backgroundColor: SURFACE_2, color: TEXT_3, border: `1px solid ${BORDER}` }}
        >
          {kindLabel(trigger.kind)}
        </span>

        {/* Schedule badge */}
        {isScheduled && (
          <span
            className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-mono"
            style={{ backgroundColor: "#0D1F1C", color: "#4A8A7C", border: "1px solid #1A3A33" }}
          >
            <Clock size={9} />
            {trigger.schedule}
          </span>
        )}

        {/* Condition badge */}
        {isCondition && (
          <span
            className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-mono"
            style={{ backgroundColor: "#1A1310", color: "#C5A96A", border: "1px solid #3A2A10" }}
          >
            <GitBranch size={9} />
            {trigger.condition}
          </span>
        )}
      </div>

      {/* Last-fired row */}
      <div className="flex items-center justify-between">
        <p className="text-[11px]" style={{ color: TEXT_3 }}>
          Last fired:{" "}
          <span style={{ color: TEXT_2 }}>
            {firedAt ? formatRelative(firedAt) : formatRelative(trigger.last_fired)}
          </span>
          {trigger.last_fired && (
            <span className="ml-1 font-mono text-[10px]" style={{ color: TEXT_3 }}>
              ({new Date(trigger.last_fired).toLocaleString("en-CA", { dateStyle: "short", timeStyle: "short" })})
            </span>
          )}
        </p>

        {/* Fire now button */}
        <button
          onClick={() => void handleFire()}
          disabled={firing || !trigger.enabled}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all"
          style={{
            backgroundColor: firing ? SURFACE_2 : "#1E332E",
            color: firing ? TEXT_3 : "#4A8A7C",
            border: `1px solid ${firing ? BORDER : "#2A4A43"}`,
            cursor: !trigger.enabled ? "not-allowed" : firing ? "wait" : "pointer",
            opacity: !trigger.enabled ? 0.4 : 1,
          }}
        >
          {firing ? (
            <span className="animate-pulse">◌</span>
          ) : (
            <Zap size={11} />
          )}
          <span>{firing ? "firing…" : "Fire now"}</span>
        </button>
      </div>

      {/* Error / success feedback */}
      {error && (
        <p className="text-[11px] rounded-lg px-3 py-2" style={{ backgroundColor: "#1A0E0A", color: "#C5603A", border: "1px solid #3A1A0A" }}>
          ⚠ {error}
        </p>
      )}
      {firedAt && !error && (
        <p className="text-[11px] rounded-lg px-3 py-2" style={{ backgroundColor: "#0D1F1C", color: "#4A8A7C", border: "1px solid #1A3A33" }}>
          ✓ Fired and published to relay — {new Date(firedAt).toLocaleTimeString("en-CA")}
        </p>
      )}
    </div>
  );
}


// ── Page ──────────────────────────────────────────────────────────────────────

export function TriggersPage() {
  const triggers = useStore((s) => s.triggers);

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10"
        style={{
          backgroundColor: `${SURFACE}e6`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm min-h-[44px]"
            style={{ color: TEXT_2 }}
          >
            <ChevronLeft size={18} /> Today
          </Link>
          <h2
            className="text-base font-medium"
            style={{ fontFamily: FONT_DISPLAY, color: TEXT }}
          >
            Trigger Registry
          </h2>
          <span className="text-xs min-h-[44px] flex items-center" style={{ color: TEXT_3 }}>
            {triggers.filter((t) => t.enabled).length}/{triggers.length} active
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-4">
        <p className="text-[12px] leading-relaxed" style={{ color: TEXT_3 }}>
          Triggers fire relay events automatically — on a schedule or on a named
          condition — so agents can run unattended. Payloads are built from
          Z2-safe store state only; no Z1 identity data is included.
        </p>

        {triggers.length === 0 && (
          <p className="text-sm text-center py-12" style={{ color: TEXT_3 }}>
            No triggers defined.
          </p>
        )}

        {triggers.map((t) => (
          <TriggerCard key={t.id} trigger={t} />
        ))}

        {/* Inline schedule legend */}
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}` }}
        >
          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: TEXT_3 }}>
            How triggers work
          </p>
          <ul className="space-y-1">
            {[
              ["Scheduled", "Fires at the given HH:MM time (±5 min). The browser must be open."],
              ["Condition", "Fires when code calls fireTrigger after a named event, e.g. on debrief save."],
              ["Fire now", "Test button — fires immediately regardless of schedule or condition."],
            ].map(([term, desc]) => (
              <li key={term} className="text-[11px] leading-relaxed" style={{ color: TEXT_3 }}>
                <span className="font-semibold" style={{ color: TEXT_2 }}>{term}: </span>
                {desc}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
