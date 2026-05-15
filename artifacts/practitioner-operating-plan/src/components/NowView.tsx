/**
 * NowView.tsx — Mobile-optimised "My Three Things" panel
 *
 * Shows today's three items in a compact chrome panel suitable for the
 * mobile /plan/today layout.  Surfaces yesterday's unchecked items with
 * a single "Carry over" button when open slots remain.
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

// ── Inline toast (mobile-friendly) ───────────────────────────────────────────

function InlineToast({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(31,61,46,0.08)",
        border: "1px solid rgba(31,61,46,0.15)",
        borderRadius: 6,
        padding: "7px 12px",
        fontSize: 12,
        fontFamily: "IBM Plex Mono, monospace",
        color: "#1f3d2e",
        fontWeight: 600,
        letterSpacing: "0.04em",
        marginTop: 8,
        animation: "nowFadeIn 0.2s ease",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6l3 3 5-5"
          stroke="#1f3d2e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {message}
    </div>
  );
}

// ── Mobile row ────────────────────────────────────────────────────────────────

function MobileRow({
  slot,
  item,
  highlighted,
  onChange,
}: {
  slot: 0 | 1 | 2;
  item: DailyItem | null;
  highlighted: boolean;
  onChange: (slot: 0 | 1 | 2, item: DailyItem | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item?.text ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const labels = ["First thing", "Second thing", "Third thing"];

  useEffect(() => {
    if (!editing) setDraft(item?.text ?? "");
  }, [item, editing]);

  function commitEdit() {
    setEditing(false);
    const trimmed = draft.trim();
    onChange(slot, trimmed ? { text: trimmed, done: item?.done ?? false } : null);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        background: highlighted ? "rgba(184,90,62,0.09)" : "rgba(255,255,255,0.55)",
        border: highlighted
          ? "1.5px solid rgba(184,90,62,0.28)"
          : "1.5px solid rgba(31,61,46,0.09)",
        marginBottom: 6,
        transition: "background 0.45s, border-color 0.45s",
        minHeight: 44,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => item && onChange(slot, { ...item, done: !item.done })}
        disabled={!item}
        style={{
          width: 22,
          height: 22,
          borderRadius: 5,
          border: item?.done ? "2px solid #1f3d2e" : "2px solid rgba(31,61,46,0.22)",
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
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#f4ede0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          placeholder={`${labels[slot]}…`}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 14,
            fontFamily: "IBM Plex Sans, system-ui, sans-serif",
            color: "#1f3d2e",
            padding: 0,
          }}
          autoFocus
        />
      ) : (
        <button
          onClick={() => {
            setDraft(item?.text ?? "");
            setEditing(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            cursor: "text",
            textAlign: "left",
            fontSize: 14,
            fontFamily: "IBM Plex Sans, system-ui, sans-serif",
            color: item
              ? item.done
                ? "rgba(31,61,46,0.35)"
                : "#1f3d2e"
              : "rgba(31,61,46,0.30)",
            textDecoration: item?.done ? "line-through" : "none",
            padding: 0,
            lineHeight: 1.4,
          }}
        >
          {item ? item.text : labels[slot] + "…"}
        </button>
      )}

      {item && !editing && (
        <button
          onClick={() => onChange(slot, null)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 6px",
            color: "rgba(31,61,46,0.22)",
            fontSize: 16,
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

// ── Yesterday summary strip ───────────────────────────────────────────────────

function YesterdayStrip({
  items,
  onCarryOver,
  disabled,
}: {
  items: DailyItem[];
  onCarryOver: () => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div
      style={{
        marginTop: 10,
        borderTop: "1px solid rgba(31,61,46,0.09)",
        paddingTop: 10,
      }}
    >
      {/* Chevron toggle */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#7a7a6e",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <span>
          Yesterday · {items.length} unfinished
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path d="M2 4l4 4 4-4" stroke="#7a7a6e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{ marginTop: 8 }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 6,
                background: "rgba(31,61,46,0.04)",
                border: "1px solid rgba(31,61,46,0.08)",
                marginBottom: 4,
                fontSize: 13,
                color: "rgba(31,61,46,0.65)",
                fontFamily: "IBM Plex Sans, system-ui, sans-serif",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(31,61,46,0.25)",
                  flexShrink: 0,
                }}
              />
              {item.text}
            </div>
          ))}

          {/* Carry-over button */}
          {!disabled && (
            <button
              onClick={onCarryOver}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                marginTop: 8,
                background: "rgba(184,90,62,0.07)",
                border: "1.5px solid rgba(184,90,62,0.25)",
                borderRadius: 7,
                padding: "10px 14px",
                fontSize: 12,
                fontFamily: "IBM Plex Mono, monospace",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "#b85a3e",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
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
              Carry over yesterday's open items
            </button>
          )}

          {disabled && (
            <div
              style={{
                marginTop: 6,
                fontSize: 11,
                color: "rgba(31,61,46,0.38)",
                fontFamily: "IBM Plex Mono, monospace",
                textAlign: "center",
              }}
            >
              Today's slots are full
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export default function NowView() {
  const tKey = todayKey();
  const yKey = yesterdayKey();

  const [items, setItems] = useState<DayThings>(() => loadDayThings(tKey));
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const uncheckedYesterday = getUncheckedFromDay(yKey);
  const todayEmpty = items.filter((i) => i === null).length;
  const slotsAvailable = todayEmpty > 0;

  function handleChange(slot: 0 | 1 | 2, item: DailyItem | null) {
    setDailyThing(tKey, slot, item);
    setItems(loadDayThings(tKey));
  }

  function handleCarryOver() {
    const filled = carryOverFromYesterday();
    if (filled.length === 0) return;
    setItems(loadDayThings(tKey));
    setHighlighted(filled);
    const msg =
      filled.length === 1 ? "1 item carried over" : `${filled.length} items carried over`;
    setToastMsg(msg);
    setTimeout(() => {
      setHighlighted([]);
      setToastMsg(null);
    }, 2400);
  }

  return (
    <>
      <style>{`
        @keyframes nowFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          background: "#f9f5ee",
          border: "1.5px solid rgba(31,61,46,0.10)",
          borderRadius: 12,
          padding: "14px 14px 12px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
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

          {/* Header-level carry-over button (when yesterday items exist & slots open) */}
          {uncheckedYesterday.length > 0 && slotsAvailable && (
            <button
              onClick={handleCarryOver}
              title="Carry over yesterday's open items"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(184,90,62,0.07)",
                border: "1.5px solid rgba(184,90,62,0.22)",
                borderRadius: 5,
                padding: "4px 10px",
                fontSize: 10,
                fontFamily: "IBM Plex Mono, monospace",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "#b85a3e",
                cursor: "pointer",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 9V6a4 4 0 018 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 6l-1.5 3H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Carry over ({uncheckedYesterday.length})
            </button>
          )}
        </div>

        {/* Today's rows */}
        {([0, 1, 2] as const).map((slot) => (
          <MobileRow
            key={slot}
            slot={slot}
            item={items[slot]}
            highlighted={highlighted.includes(slot)}
            onChange={handleChange}
          />
        ))}

        {/* Inline confirmation */}
        {toastMsg && <InlineToast message={toastMsg} />}

        {/* Yesterday strip (collapsible) */}
        <YesterdayStrip
          items={uncheckedYesterday}
          onCarryOver={handleCarryOver}
          disabled={!slotsAvailable}
        />
      </div>
    </>
  );
}
