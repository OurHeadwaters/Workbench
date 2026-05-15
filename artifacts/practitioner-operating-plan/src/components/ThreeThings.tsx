/**
 * ThreeThings.tsx — Desktop "MY THREE THINGS" card
 *
 * Shows the practitioner's three daily items for today, lets them check items
 * off, edit text, and carry over unchecked items from yesterday in one click.
 */

import { useState, useEffect, useRef } from "react";
import {
  loadDayThings,
  setDailyThing,
  getUncheckedFromDay,
  carryOverFromYesterday,
  yesterdayKey,
  todayKey,
  type DailyItem,
  type DayThings,
} from "@/lib/threeThings";

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1f3d2e",
        color: "#f4ede0",
        borderRadius: 8,
        padding: "10px 20px",
        fontSize: 13,
        fontFamily: "IBM Plex Mono, monospace",
        fontWeight: 600,
        letterSpacing: "0.04em",
        boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
        zIndex: 9999,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        animation: "fadeInUp 0.2s ease",
      }}
    >
      {message}
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

function ThingRow({
  slot,
  item,
  highlighted,
  dateKey,
  onChange,
}: {
  slot: 0 | 1 | 2;
  item: DailyItem | null;
  highlighted: boolean;
  dateKey: string;
  onChange: (slot: 0 | 1 | 2, item: DailyItem | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item?.text ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync draft when item changes externally (e.g. carry-over)
  useEffect(() => {
    if (!editing) setDraft(item?.text ?? "");
  }, [item, editing]);

  function commitEdit() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed === "") {
      onChange(slot, null);
    } else {
      onChange(slot, { text: trimmed, done: item?.done ?? false });
    }
  }

  function toggleDone() {
    if (!item) return;
    onChange(slot, { ...item, done: !item.done });
  }

  function startEdit() {
    setDraft(item?.text ?? "");
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  const slotLabels = ["First", "Second", "Third"];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        borderRadius: 7,
        background: highlighted
          ? "rgba(184,90,62,0.10)"
          : "rgba(31,61,46,0.03)",
        border: highlighted
          ? "1.5px solid rgba(184,90,62,0.30)"
          : "1.5px solid rgba(31,61,46,0.08)",
        transition: "background 0.4s, border-color 0.4s",
        marginBottom: 6,
        minHeight: 40,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={toggleDone}
        disabled={!item}
        aria-label={item?.done ? "Mark undone" : "Mark done"}
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: item?.done
            ? "2px solid #1f3d2e"
            : "2px solid rgba(31,61,46,0.25)",
          background: item?.done ? "#1f3d2e" : "transparent",
          cursor: item ? "pointer" : "default",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          transition: "all 0.15s",
        }}
      >
        {item?.done && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="#f4ede0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Text / input */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") {
              setDraft(item?.text ?? "");
              setEditing(false);
            }
          }}
          placeholder={`${slotLabels[slot]} thing…`}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 13,
            fontFamily: "IBM Plex Sans, system-ui, sans-serif",
            color: "#1f3d2e",
            padding: 0,
          }}
        />
      ) : (
        <button
          onClick={startEdit}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            cursor: "text",
            textAlign: "left",
            fontSize: 13,
            fontFamily: "IBM Plex Sans, system-ui, sans-serif",
            color: item
              ? item.done
                ? "rgba(31,61,46,0.38)"
                : "#1f3d2e"
              : "rgba(31,61,46,0.28)",
            padding: 0,
            textDecoration: item?.done ? "line-through" : "none",
            lineHeight: 1.4,
          }}
        >
          {item ? item.text : `Add ${slotLabels[slot].toLowerCase()} thing…`}
        </button>
      )}

      {/* Clear button */}
      {item && !editing && (
        <button
          onClick={() => onChange(slot, null)}
          aria-label="Clear"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 4px",
            color: "rgba(31,61,46,0.25)",
            fontSize: 14,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

export default function ThreeThings() {
  const tKey = todayKey();
  const yKey = yesterdayKey();

  const [items, setItems] = useState<DayThings>(() => loadDayThings(tKey));
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const uncheckedYesterday = getUncheckedFromDay(yKey);
  const todayEmpty = items.filter((i) => i === null).length;
  const showCarryOver =
    uncheckedYesterday.length > 0 && todayEmpty > 0;

  function handleChange(slot: 0 | 1 | 2, item: DailyItem | null) {
    setDailyThing(tKey, slot, item);
    setItems(loadDayThings(tKey));
  }

  function handleCarryOver() {
    const filled = carryOverFromYesterday();
    if (filled.length === 0) return;
    setItems(loadDayThings(tKey));
    setHighlighted(filled);
    setToast(
      filled.length === 1
        ? "1 item carried over"
        : `${filled.length} items carried over`
    );
    setTimeout(() => setHighlighted([]), 2200);
  }

  return (
    <>
      {/* Keyframe style injected once */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div
        style={{
          background: "#fff",
          border: "1.5px solid rgba(31,61,46,0.10)",
          borderRadius: 10,
          padding: "16px 18px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color: "#7a7a6e",
            }}
          >
            My Three Things
          </span>

          {showCarryOver && (
            <button
              onClick={handleCarryOver}
              title={`Carry over ${uncheckedYesterday.length} unfinished item${uncheckedYesterday.length !== 1 ? "s" : ""} from yesterday`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(184,90,62,0.07)",
                border: "1.5px solid rgba(184,90,62,0.25)",
                borderRadius: 5,
                padding: "4px 10px",
                fontSize: 10,
                fontFamily: "IBM Plex Mono, monospace",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "#b85a3e",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 9V6a4 4 0 018 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M2 6l-1.5 3H4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Carry over ({uncheckedYesterday.length})
            </button>
          )}
        </div>

        {/* Rows */}
        {([0, 1, 2] as const).map((slot) => (
          <ThingRow
            key={slot}
            slot={slot}
            item={items[slot]}
            highlighted={highlighted.includes(slot)}
            dateKey={tKey}
            onChange={handleChange}
          />
        ))}

        {/* Yesterday summary (when all today's slots filled / no carry-over available) */}
        {!showCarryOver && uncheckedYesterday.length > 0 && todayEmpty === 0 && (
          <div
            style={{
              marginTop: 8,
              fontSize: 11,
              color: "rgba(31,61,46,0.40)",
              fontFamily: "IBM Plex Mono, monospace",
              letterSpacing: "0.04em",
            }}
          >
            {uncheckedYesterday.length} from yesterday still open — today's slots are full.
          </div>
        )}
      </div>

      {toast && (
        <Toast message={`✓ ${toast}`} onDone={() => setToast(null)} />
      )}
    </>
  );
}
