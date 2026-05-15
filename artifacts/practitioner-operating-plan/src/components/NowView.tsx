/**
 * NowView.tsx — "This Week's 3" panel for the /plan/today page.
 *
 * Renders three editable item slots (text + checkbox).
 * On the first visit of a new ISO week, if the prior week had unchecked items,
 * shows a one-time banner letting the practitioner carry them over or start fresh.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  carryOverItems,
  checkRollover,
  currentWeekKey,
  dismissRollover,
  getOrCreateWeekThree,
  writeWeekThree,
  type RolloverPayload,
  type WeeklyItem,
  type WeeklyThree,
} from "@/lib/threeThings";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function ensureThreeSlots(items: WeeklyItem[]): WeeklyItem[] {
  const base = items.slice(0, 3);
  while (base.length < 3) base.push({ id: makeId(), text: "", done: false });
  return base;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RolloverBanner({
  payload,
  onCarryOver,
  onDismiss,
}: {
  payload: RolloverPayload;
  onCarryOver: () => void;
  onDismiss: () => void;
}) {
  const count = payload.unfinished.length;
  return (
    <div
      style={{
        background: "rgba(184,90,62,0.06)",
        border: "1.5px solid rgba(184,90,62,0.22)",
        borderRadius: 8,
        padding: "14px 16px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#b85a3e",
          marginBottom: 6,
        }}
      >
        New week · last week unfinished
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#2a2520",
          lineHeight: 1.55,
          marginBottom: 12,
        }}
      >
        You had{" "}
        <strong>
          {count} unfinished item{count !== 1 ? "s" : ""}
        </strong>{" "}
        last week. Carry {count !== 1 ? "them" : "it"} into this week, or start
        fresh?
      </div>

      <div
        style={{
          background: "rgba(31,61,46,0.04)",
          border: "1px solid rgba(31,61,46,0.10)",
          borderRadius: 6,
          padding: "8px 10px",
          marginBottom: 12,
        }}
      >
        {payload.unfinished.map((it) => (
          <div
            key={it.id}
            style={{
              fontSize: 12,
              color: "#4a4a40",
              lineHeight: 1.5,
              padding: "2px 0",
              display: "flex",
              gap: 8,
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 9,
                color: "#9a9a8e",
                flexShrink: 0,
              }}
            >
              ·
            </span>
            {it.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onCarryOver}
          style={{
            background: "#1f3d2e",
            color: "#f4ede0",
            border: "none",
            borderRadius: 5,
            padding: "7px 14px",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Carry over
        </button>
        <button
          onClick={onDismiss}
          style={{
            background: "transparent",
            color: "#7a7a6e",
            border: "1.5px solid rgba(31,61,46,0.15)",
            borderRadius: 5,
            padding: "7px 14px",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Start fresh
        </button>
      </div>
    </div>
  );
}

function ItemRow({
  item,
  index,
  onToggle,
  onEdit,
}: {
  item: WeeklyItem;
  index: number;
  onToggle: () => void;
  onEdit: (text: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const PLACEHOLDER = ["First priority this week", "Second priority", "Third priority"][index] ?? "Priority";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 0",
        borderBottom: index < 2 ? "1px solid rgba(31,61,46,0.07)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        aria-label={item.done ? "Mark incomplete" : "Mark complete"}
        style={{
          flexShrink: 0,
          marginTop: 2,
          width: 18,
          height: 18,
          borderRadius: 4,
          border: `1.5px solid ${item.done ? "#1f3d2e" : "rgba(31,61,46,0.28)"}`,
          background: item.done ? "#1f3d2e" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          transition: "all 0.12s",
        }}
      >
        {item.done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5l2.5 2.5 3.5-4"
              stroke="#f4ede0"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <input
        ref={inputRef}
        type="text"
        value={item.text}
        onChange={(e) => onEdit(e.target.value)}
        placeholder={PLACEHOLDER}
        maxLength={120}
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          fontSize: 14,
          fontFamily: "IBM Plex Sans, system-ui, sans-serif",
          color: item.done ? "#9a9a8e" : "#2a2520",
          textDecoration: item.done ? "line-through" : "none",
          padding: 0,
          lineHeight: 1.45,
          transition: "color 0.12s",
        }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NowView() {
  const weekKey = currentWeekKey();

  const [entry, setEntry] = useState<WeeklyThree | null>(null);
  const [slots, setSlots] = useState<WeeklyItem[]>([]);
  const [rollover, setRollover] = useState<RolloverPayload | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load on mount
  useEffect(() => {
    const loaded = getOrCreateWeekThree(weekKey);
    const items = ensureThreeSlots(loaded.items);
    setEntry(loaded);
    setSlots(items);

    const payload = checkRollover(weekKey);
    if (payload.hasUnfinished) {
      setRollover(payload);
    }
  }, [weekKey]);

  // Debounced persist whenever slots change
  const scheduleWrite = useCallback(
    (nextSlots: WeeklyItem[], nextEntry: WeeklyThree) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        const compact = nextSlots.filter((it) => it.text.trim().length > 0);
        writeWeekThree({ ...nextEntry, items: compact });
      }, 400);
    },
    [],
  );

  const handleToggle = useCallback(
    (idx: number) => {
      setSlots((prev) => {
        const next = prev.map((it, i) =>
          i === idx ? { ...it, done: !it.done } : it,
        );
        if (entry) scheduleWrite(next, entry);
        return next;
      });
    },
    [entry, scheduleWrite],
  );

  const handleEdit = useCallback(
    (idx: number, text: string) => {
      setSlots((prev) => {
        const next = prev.map((it, i) =>
          i === idx ? { ...it, text } : it,
        );
        if (entry) scheduleWrite(next, entry);
        return next;
      });
    },
    [entry, scheduleWrite],
  );

  const handleCarryOver = useCallback(() => {
    if (!rollover) return;
    const updated = carryOverItems(weekKey, rollover.unfinished);
    const items = ensureThreeSlots(updated.items);
    setEntry(updated);
    setSlots(items);
    setRollover(null);
  }, [rollover, weekKey]);

  const handleDismiss = useCallback(() => {
    const updated = dismissRollover(weekKey);
    setEntry(updated);
    setRollover(null);
  }, [weekKey]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const doneCount = slots.filter((it) => it.done && it.text.trim().length > 0).length;
  const filledCount = slots.filter((it) => it.text.trim().length > 0).length;

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid rgba(31,61,46,0.10)",
        borderRadius: 10,
        padding: "18px 20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: rollover ? 14 : 12,
        }}
      >
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#7a7a6e",
          }}
        >
          This Week's 3
        </div>
        {filledCount > 0 && (
          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              color: doneCount === filledCount ? "#1f3d2e" : "#9a9a8e",
              letterSpacing: "0.06em",
            }}
          >
            {doneCount}/{filledCount}
          </div>
        )}
      </div>

      {/* Rollover banner */}
      {rollover && rollover.hasUnfinished && (
        <RolloverBanner
          payload={rollover}
          onCarryOver={handleCarryOver}
          onDismiss={handleDismiss}
        />
      )}

      {/* Item rows */}
      <div>
        {slots.map((item, i) => (
          <ItemRow
            key={item.id}
            item={item}
            index={i}
            onToggle={() => handleToggle(i)}
            onEdit={(text) => handleEdit(i, text)}
          />
        ))}
      </div>

      {/* Week key hint */}
      <div
        style={{
          marginTop: 10,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 9,
          color: "rgba(154,154,142,0.6)",
          letterSpacing: "0.08em",
        }}
      >
        {weekKey}
      </div>
    </div>
  );
}
