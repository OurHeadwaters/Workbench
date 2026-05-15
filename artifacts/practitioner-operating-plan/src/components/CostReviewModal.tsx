/**
 * CostReviewModal.tsx
 *
 * Cost Review — two-tab page for the founder.
 *
 * Tab "Review"  — edit every cost line vs the planning default (Scenario B).
 *                 Each row shows the planning default, an override input,
 *                 a note field, and a skip button.
 *
 * Tab "Edits"   — one-click audit history: every item the founder changed
 *                 or skipped, with default → new value, Δ delta, and notes.
 *                 Printable for board conversations.
 *
 * Storage: costReview.ts (localStorage, key: hwop_cost_edits_v1)
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  COST_REGISTRY,
  type CostItem,
} from "@/data/costRegistry";
import {
  loadEdits,
  saveEdit,
  markSkipped,
  clearEdit,
  clearAllEdits,
  loadCustomLines,
  saveCustomLine,
  deleteCustomLine,
  clearAllCustomLines,
  customLinesToEdits,
  type CostEdit,
  type CustomLine,
  type HistoryEntry,
} from "@/lib/costReview";
import { fmt } from "@/data/budgetScenarios";

// ── Palette (matches app-wide print style) ────────────────────────────
const CREAM  = "#f4ede0";
const DARK   = "#1f3d2e";
const AMBER  = "#b85a3e";
const MUTED  = "#6b7665";
const RULE   = "#c8bfa7";
const TEXT   = "#2a2520";
const GREEN  = "#2a6b3e";
const RED_DK = "#7a1a1a";

type Tab = "review" | "edits";

// ── Formatting helpers ────────────────────────────────────────────────

function fmtDelta(delta: number): string {
  if (delta === 0) return "—";
  const sign = delta > 0 ? "+" : "−";
  return `${sign}$${Math.abs(delta).toLocaleString("en-US")}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Review row — one editable line item ──────────────────────────────

interface ReviewRowProps {
  item: CostItem;
  edit: CostEdit | null;
  onSave: (key: string, value: number, note: string) => void;
  onSkip: (key: string) => void;
  onClear: (key: string) => void;
}

function ReviewRow({ item, edit, onSave, onSkip, onClear }: ReviewRowProps) {
  const [value, setValue] = useState<string>(
    edit ? String(edit.newValue) : String(item.defaultValue)
  );
  const [note, setNote] = useState<string>(edit?.note ?? "");
  const [dirty, setDirty] = useState(false);

  const handleValueChange = (v: string) => {
    setValue(v);
    setDirty(true);
  };

  const handleNoteChange = (n: string) => {
    setNote(n);
    setDirty(true);
  };

  const handleSave = () => {
    const parsed = parseInt(value.replace(/[^0-9-]/g, ""), 10);
    if (isNaN(parsed)) return;
    onSave(item.key, parsed, note);
    setDirty(false);
  };

  const handleClear = () => {
    setValue(String(item.defaultValue));
    setNote("");
    setDirty(false);
    onClear(item.key);
  };

  const isEdited    = edit !== null && !edit.skipped && edit.delta !== 0;
  const isSkipped   = edit?.skipped ?? false;
  const parsedValue = parseInt(value.replace(/[^0-9-]/g, ""), 10);
  const currentDelta = isNaN(parsedValue) ? 0 : parsedValue - item.defaultValue;

  return (
    <tr
      style={{
        borderBottom: `0.5pt solid ${RULE}`,
        background: isSkipped
          ? "rgba(122,26,26,0.04)"
          : isEdited
          ? "rgba(42,107,62,0.05)"
          : "transparent",
      }}
    >
      {/* Label + description */}
      <td style={{ padding: "5pt 4pt", verticalAlign: "top", width: "22%" }}>
        <div style={{ fontWeight: 600, fontSize: "8.5pt", color: TEXT }}>
          {item.label}
        </div>
        <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "2pt", lineHeight: 1.35 }}>
          {item.description}
        </div>
        {isSkipped && (
          <div style={{ fontSize: "7pt", fontWeight: 700, color: RED_DK, marginTop: "3pt", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Skipped
          </div>
        )}
        {isEdited && (
          <div style={{ fontSize: "7pt", fontWeight: 700, color: GREEN, marginTop: "3pt", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Edited
          </div>
        )}
      </td>

      {/* Planning default */}
      <td style={{ padding: "5pt 4pt", textAlign: "right", verticalAlign: "top", width: "13%", fontSize: "9pt", color: MUTED }}>
        {fmt(item.defaultValue)}
      </td>

      {/* Override input */}
      <td style={{ padding: "5pt 4pt", verticalAlign: "top", width: "14%" }}>
        <input
          type="number"
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          disabled={isSkipped}
          style={{
            width: "100%",
            padding: "3pt 5pt",
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            fontSize: "8.5pt",
            border: `1pt solid ${dirty || isEdited ? AMBER : RULE}`,
            borderRadius: "3pt",
            background: isSkipped ? "rgba(0,0,0,0.04)" : CREAM,
            color: TEXT,
            boxSizing: "border-box",
          }}
        />
        {dirty && !isNaN(parsedValue) && currentDelta !== 0 && (
          <div style={{
            fontSize: "7pt",
            marginTop: "2pt",
            color: currentDelta > 0 ? RED_DK : GREEN,
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            letterSpacing: "0.04em",
          }}>
            {fmtDelta(currentDelta)} vs plan
          </div>
        )}
      </td>

      {/* Note */}
      <td style={{ padding: "5pt 4pt", verticalAlign: "top", width: "30%" }}>
        <input
          type="text"
          placeholder="Private note (optional)…"
          value={note}
          onChange={(e) => handleNoteChange(e.target.value)}
          disabled={isSkipped}
          style={{
            width: "100%",
            padding: "3pt 5pt",
            fontSize: "8pt",
            border: `1pt solid ${RULE}`,
            borderRadius: "3pt",
            background: isSkipped ? "rgba(0,0,0,0.04)" : CREAM,
            color: TEXT,
            boxSizing: "border-box",
          }}
        />
      </td>

      {/* Actions */}
      <td style={{ padding: "5pt 4pt", verticalAlign: "top", width: "21%", textAlign: "right" }}>
        <div style={{ display: "flex", gap: "5pt", justifyContent: "flex-end", flexWrap: "wrap" }}>
          {!isSkipped && (
            <button
              onClick={handleSave}
              disabled={!dirty}
              style={{
                padding: "3pt 9pt",
                fontSize: "7.5pt",
                fontWeight: 700,
                background: dirty ? AMBER : RULE,
                color: dirty ? CREAM : MUTED,
                border: "none",
                borderRadius: "3pt",
                cursor: dirty ? "pointer" : "default",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Save
            </button>
          )}
          {!isSkipped && (
            <button
              onClick={() => onSkip(item.key)}
              title="Mark this item as deferred / skip for now"
              style={{
                padding: "3pt 9pt",
                fontSize: "7.5pt",
                fontWeight: 700,
                background: "transparent",
                color: MUTED,
                border: `1pt solid ${RULE}`,
                borderRadius: "3pt",
                cursor: "pointer",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Skip
            </button>
          )}
          {(isEdited || isSkipped) && (
            <button
              onClick={handleClear}
              title="Restore planning default, remove override"
              style={{
                padding: "3pt 9pt",
                fontSize: "7.5pt",
                fontWeight: 600,
                background: "transparent",
                color: RED_DK,
                border: `1pt solid rgba(122,26,26,0.3)`,
                borderRadius: "3pt",
                cursor: "pointer",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Reset
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Add-custom-line form ──────────────────────────────────────────────

interface AddCustomLineFormProps {
  onSave: (line: Omit<CustomLine, "key" | "editedAt">) => void;
  onCancel: () => void;
}

function AddCustomLineForm({ onSave, onCancel }: AddCustomLineFormProps) {
  const [label,       setLabel]       = useState("");
  const [description, setDescription] = useState("");
  const [amount,      setAmount]      = useState("");
  const [note,        setNote]        = useState("");

  const canSave = label.trim().length > 0 && parseInt(amount, 10) >= 0 && !isNaN(parseInt(amount, 10));

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      label:       label.trim(),
      description: description.trim(),
      amount:      parseInt(amount, 10),
      note:        note.trim() || undefined,
    });
  };

  return (
    <div
      style={{
        marginTop: "10pt",
        background: "rgba(184,90,62,0.06)",
        border: `1pt solid ${AMBER}`,
        borderRadius: "4pt",
        padding: "10pt 12pt",
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: "7.5pt",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: AMBER,
          marginBottom: "8pt",
        }}
      >
        New custom cost line
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7pt", marginBottom: "7pt" }}>
        <div>
          <label style={{ display: "block", fontSize: "7.5pt", fontWeight: 600, color: MUTED, marginBottom: "2pt" }}>
            Label <span style={{ color: AMBER }}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Site allowance — Pickle Lake"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
            style={{
              width: "100%",
              padding: "3pt 6pt",
              fontSize: "8.5pt",
              border: `1pt solid ${label.trim() ? AMBER : RULE}`,
              borderRadius: "3pt",
              background: CREAM,
              color: TEXT,
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "7.5pt", fontWeight: 600, color: MUTED, marginBottom: "2pt" }}>
            Monthly amount ($) <span style={{ color: AMBER }}>*</span>
          </label>
          <input
            type="number"
            placeholder="0"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "3pt 6pt",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: "8.5pt",
              border: `1pt solid ${amount ? AMBER : RULE}`,
              borderRadius: "3pt",
              background: CREAM,
              color: TEXT,
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
      <div style={{ marginBottom: "7pt" }}>
        <label style={{ display: "block", fontSize: "7.5pt", fontWeight: 600, color: MUTED, marginBottom: "2pt" }}>
          Description (optional)
        </label>
        <input
          type="text"
          placeholder="Brief explanation of what this covers"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "3pt 6pt",
            fontSize: "8pt",
            border: `1pt solid ${RULE}`,
            borderRadius: "3pt",
            background: CREAM,
            color: TEXT,
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ marginBottom: "9pt" }}>
        <label style={{ display: "block", fontSize: "7.5pt", fontWeight: 600, color: MUTED, marginBottom: "2pt" }}>
          Private note (optional)
        </label>
        <input
          type="text"
          placeholder="Context for the board, rationale, etc."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: "100%",
            padding: "3pt 6pt",
            fontSize: "8pt",
            border: `1pt solid ${RULE}`,
            borderRadius: "3pt",
            background: CREAM,
            color: TEXT,
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "6pt", justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "3pt 12pt",
            fontSize: "7.5pt",
            fontWeight: 600,
            background: "transparent",
            color: MUTED,
            border: `1pt solid ${RULE}`,
            borderRadius: "3pt",
            cursor: "pointer",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            padding: "3pt 14pt",
            fontSize: "7.5pt",
            fontWeight: 700,
            background: canSave ? AMBER : RULE,
            color: canSave ? CREAM : MUTED,
            border: "none",
            borderRadius: "3pt",
            cursor: canSave ? "pointer" : "default",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Add line
        </button>
      </div>
    </div>
  );
}

// ── Custom line row in Review tab ─────────────────────────────────────

interface CustomLineRowProps {
  line: CustomLine;
  onDelete: (key: string) => void;
  onEdit: (line: CustomLine) => void;
}

function CustomLineRow({ line, onDelete, onEdit }: CustomLineRowProps) {
  const [editing, setEditing] = useState(false);
  const [label,       setLabel]       = useState(line.label);
  const [description, setDescription] = useState(line.description);
  const [amount,      setAmount]      = useState(String(line.amount));
  const [note,        setNote]        = useState(line.note ?? "");
  const [dirty,       setDirty]       = useState(false);

  const handleSave = () => {
    const parsed = parseInt(amount, 10);
    if (isNaN(parsed) || !label.trim()) return;
    onEdit({ ...line, label: label.trim(), description: description.trim(), amount: parsed, note: note.trim() || undefined });
    setDirty(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <tr style={{ borderBottom: `0.5pt solid ${RULE}`, background: "rgba(184,90,62,0.04)" }}>
        <td colSpan={5} style={{ padding: "6pt 4pt" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6pt", marginBottom: "6pt" }}>
            <div>
              <label style={{ display: "block", fontSize: "7pt", fontWeight: 600, color: MUTED, marginBottom: "2pt" }}>Label</label>
              <input type="text" value={label} onChange={(e) => { setLabel(e.target.value); setDirty(true); }}
                style={{ width: "100%", padding: "2pt 5pt", fontSize: "8.5pt", border: `1pt solid ${AMBER}`, borderRadius: "3pt", background: CREAM, color: TEXT, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "7pt", fontWeight: 600, color: MUTED, marginBottom: "2pt" }}>Monthly ($)</label>
              <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setDirty(true); }}
                style={{ width: "100%", padding: "2pt 5pt", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "8.5pt", border: `1pt solid ${AMBER}`, borderRadius: "3pt", background: CREAM, color: TEXT, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "7pt", fontWeight: 600, color: MUTED, marginBottom: "2pt" }}>Description</label>
              <input type="text" value={description} onChange={(e) => { setDescription(e.target.value); setDirty(true); }}
                style={{ width: "100%", padding: "2pt 5pt", fontSize: "8pt", border: `1pt solid ${RULE}`, borderRadius: "3pt", background: CREAM, color: TEXT, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "7pt", fontWeight: 600, color: MUTED, marginBottom: "2pt" }}>Private note</label>
              <input type="text" value={note} onChange={(e) => { setNote(e.target.value); setDirty(true); }}
                style={{ width: "100%", padding: "2pt 5pt", fontSize: "8pt", border: `1pt solid ${RULE}`, borderRadius: "3pt", background: CREAM, color: TEXT, boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "6pt", justifyContent: "flex-end" }}>
            <button onClick={() => setEditing(false)} style={{ padding: "2pt 10pt", fontSize: "7.5pt", fontWeight: 600, background: "transparent", color: MUTED, border: `1pt solid ${RULE}`, borderRadius: "3pt", cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}>Cancel</button>
            <button onClick={handleSave} disabled={!dirty || !label.trim()} style={{ padding: "2pt 10pt", fontSize: "7.5pt", fontWeight: 700, background: dirty && label.trim() ? AMBER : RULE, color: dirty && label.trim() ? CREAM : MUTED, border: "none", borderRadius: "3pt", cursor: dirty && label.trim() ? "pointer" : "default", letterSpacing: "0.04em", textTransform: "uppercase" }}>Save</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr style={{ borderBottom: `0.5pt solid ${RULE}`, background: "rgba(184,90,62,0.03)" }}>
      <td style={{ padding: "5pt 4pt", verticalAlign: "top", width: "22%" }}>
        <div style={{ fontWeight: 600, fontSize: "8.5pt", color: TEXT }}>{line.label}</div>
        {line.description && (
          <div style={{ fontSize: "7.5pt", color: MUTED, marginTop: "2pt", lineHeight: 1.35 }}>{line.description}</div>
        )}
        <div style={{ display: "inline-flex", alignItems: "center", marginTop: "3pt", padding: "1pt 5pt", background: AMBER, borderRadius: "2pt" }}>
          <span style={{ fontSize: "6.5pt", fontWeight: 700, color: CREAM, letterSpacing: "0.1em", textTransform: "uppercase" }}>Custom</span>
        </div>
      </td>
      <td style={{ padding: "5pt 4pt", textAlign: "right", verticalAlign: "top", width: "13%", fontSize: "9pt", color: MUTED, fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
        —
      </td>
      <td style={{ padding: "5pt 4pt", verticalAlign: "top", width: "14%", fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "9pt", fontWeight: 700, color: TEXT }}>
        {fmt(line.amount)}
      </td>
      <td style={{ padding: "5pt 4pt", verticalAlign: "top", width: "30%", fontSize: "7.5pt", color: line.note ? TEXT : MUTED, fontStyle: line.note ? "normal" : "italic" }}>
        {line.note ?? "No note"}
      </td>
      <td style={{ padding: "5pt 4pt", verticalAlign: "top", width: "21%", textAlign: "right" }}>
        <div style={{ display: "flex", gap: "5pt", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button
            onClick={() => setEditing(true)}
            style={{ padding: "3pt 9pt", fontSize: "7.5pt", fontWeight: 700, background: "transparent", color: MUTED, border: `1pt solid ${RULE}`, borderRadius: "3pt", cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Remove custom line "${line.label}"?`)) onDelete(line.key);
            }}
            style={{ padding: "3pt 9pt", fontSize: "7.5pt", fontWeight: 600, background: "transparent", color: RED_DK, border: `1pt solid rgba(122,26,26,0.3)`, borderRadius: "3pt", cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── History panel — expandable prior revisions for one edit row ───────

function HistoryPanel({ history }: { history: HistoryEntry[] }) {
  const rows = [...history].reverse(); // newest prior revision first
  return (
    <div
      style={{
        margin: "4pt 0 6pt 12pt",
        borderLeft: `2pt solid ${RULE}`,
        paddingLeft: "8pt",
      }}
    >
      <div
        style={{
          fontSize: "6.5pt",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: MUTED,
          marginBottom: "4pt",
        }}
      >
        Prior revisions ({history.length})
      </div>
      {rows.map((h, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "8pt",
              alignItems: "baseline",
              padding: "2pt 0",
              borderBottom: i < rows.length - 1 ? `0.5pt solid ${RULE}` : undefined,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: "7.5pt",
                fontWeight: 700,
                color: TEXT,
                minWidth: "52pt",
              }}
            >
              {fmt(h.newValue)}
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: "7pt",
                color: h.delta > 0 ? RED_DK : h.delta < 0 ? GREEN : MUTED,
                minWidth: "40pt",
              }}
            >
              {fmtDelta(h.delta)}
            </span>
            {h.skipped && (
              <span style={{ fontSize: "6.5pt", fontWeight: 700, color: RED_DK, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                skipped
              </span>
            )}
            {h.note && (
              <span style={{ fontSize: "7pt", color: MUTED, fontStyle: "italic", flex: 1 }}>
                {h.note}
              </span>
            )}
            <span style={{ fontSize: "6.5pt", color: MUTED, marginLeft: "auto", whiteSpace: "nowrap" }}>
              {fmtDate(h.editedAt)}
            </span>
          </div>
        ))}
    </div>
  );
}
// ── Edits tab — audit / diff view ─────────────────────────────────────

interface EditsViewProps {
  edits: CostEdit[];
  customLines: CustomLine[];
  showSkipped: boolean;
  onToggleSkipped: () => void;
  onClearAll: () => void;
}

function EditsView({
  edits,
  customLines,
  showSkipped,
  onToggleSkipped,
  onClearAll,
}: EditsViewProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const toggleHistory = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const valueEdits   = edits.filter((e) => !e.skipped && e.delta !== 0);
  const skippedEdits = edits.filter((e) => e.skipped);
  const customEdits  = customLinesToEdits(customLines);
  const totalDelta   = valueEdits.reduce((sum, e) => sum + e.delta, 0) +
                       customEdits.reduce((sum, e) => sum + e.delta, 0);
  const hasContent   = valueEdits.length > 0 || skippedEdits.length > 0 || customEdits.length > 0;

  if (!hasContent) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48pt 0",
          color: MUTED,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: "22pt", marginBottom: "8pt", opacity: 0.3 }}>◎</div>
        <div style={{ fontSize: "10pt", fontWeight: 600, color: DARK, marginBottom: "4pt" }}>
          No edits yet
        </div>
        <div style={{ fontSize: "9pt", lineHeight: 1.5 }}>
          Switch to the Review tab and adjust any cost line to see it here.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12pt",
          gap: "10pt",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span style={{ fontSize: "8pt", color: MUTED }}>
            {valueEdits.length} override{valueEdits.length !== 1 ? "s" : ""}&ensp;·&ensp;
            {customEdits.length} custom&ensp;·&ensp;
            {skippedEdits.length} skipped&ensp;·&ensp;
            net change{" "}
            <strong style={{ color: totalDelta > 0 ? RED_DK : GREEN }}>
              {fmtDelta(totalDelta)}/mo
            </strong>{" "}
            vs plan
          </span>
        </div>
        <div style={{ display: "flex", gap: "6pt" }}>
          <button
            onClick={onToggleSkipped}
            style={{
              padding: "3pt 10pt",
              fontSize: "7.5pt",
              fontWeight: 700,
              background: showSkipped ? DARK : "transparent",
              color: showSkipped ? CREAM : MUTED,
              border: `1pt solid ${showSkipped ? DARK : RULE}`,
              borderRadius: "3pt",
              cursor: "pointer",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {showSkipped ? "Hide Skipped" : "Show Skipped"}
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: "3pt 10pt",
              fontSize: "7.5pt",
              fontWeight: 700,
              background: AMBER,
              color: CREAM,
              border: "none",
              borderRadius: "3pt",
              cursor: "pointer",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Print / Export
          </button>
        </div>
      </div>

      {/* Value overrides table */}
      {valueEdits.length > 0 && (
        <div style={{ marginBottom: "16pt" }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: "7.5pt",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: AMBER,
              marginBottom: "5pt",
            }}
          >
            Value overrides — {valueEdits.length} line{valueEdits.length !== 1 ? "s" : ""} changed from planning defaults
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "8.5pt",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1.5pt solid ${RULE}`,
                  color: MUTED,
                  fontWeight: 600,
                  fontSize: "8pt",
                }}
              >
                <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "24%" }}>Role / Line</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "14%" }}>Plan default</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "14%" }}>Your value</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "12%" }}>Δ / mo</th>
                <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "22%" }}>Note</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "14%" }}>Last edited</th>
              </tr>
            </thead>
            <tbody>
              {valueEdits.map((edit) => {
                const item = COST_REGISTRY.find((r) => r.key === edit.key);
                const hasHistory = (edit.history?.length ?? 0) > 0;
                const isExpanded = expandedKeys.has(edit.key);
                return (
                  <React.Fragment key={edit.key}>
                    <tr
                      style={{ borderBottom: hasHistory && isExpanded ? "none" : `0.5pt solid ${RULE}` }}
                    >
                      <td style={{ padding: "4pt 4pt", fontWeight: 600, verticalAlign: "top" }}>
                        {item?.label ?? edit.key}
                        {item && (
                          <div style={{ fontSize: "7pt", color: MUTED, fontWeight: 400, marginTop: "1pt" }}>
                            {item.description}
                          </div>
                        )}
                        {hasHistory && (
                          <button
                            className="no-print"
                            onClick={() => toggleHistory(edit.key)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3pt",
                              marginTop: "3pt",
                              padding: "1pt 6pt",
                              fontSize: "6.5pt",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              background: isExpanded ? "rgba(31,61,46,0.08)" : "transparent",
                              color: isExpanded ? DARK : MUTED,
                              border: `0.5pt solid ${RULE}`,
                              borderRadius: "2pt",
                              cursor: "pointer",
                            }}
                          >
                            {isExpanded ? "▲" : "▼"}&ensp;{edit.history!.length} prior revision{edit.history!.length !== 1 ? "s" : ""}
                          </button>
                        )}
                      </td>
                      <td style={{ padding: "4pt 4pt", textAlign: "right", color: MUTED, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", verticalAlign: "top" }}>
                        {fmt(edit.defaultValue)}
                      </td>
                      <td style={{ padding: "4pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", verticalAlign: "top" }}>
                        {fmt(edit.newValue)}
                      </td>
                      <td
                        style={{
                          padding: "4pt 4pt",
                          textAlign: "right",
                          fontWeight: 700,
                          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                          color: edit.delta > 0 ? RED_DK : GREEN,
                          verticalAlign: "top",
                        }}
                      >
                        {fmtDelta(edit.delta)}
                      </td>
                      <td style={{ padding: "4pt 4pt", fontSize: "7.5pt", color: edit.note ? TEXT : MUTED, fontStyle: edit.note ? "normal" : "italic", verticalAlign: "top" }}>
                        {edit.note ?? "—"}
                      </td>
                      <td style={{ padding: "4pt 4pt", textAlign: "right", fontSize: "7pt", color: MUTED, verticalAlign: "top" }}>
                        {fmtDate(edit.editedAt)}
                      </td>
                    </tr>
                    {hasHistory && isExpanded && (
                      <tr key={`${edit.key}__history`} style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                        <td colSpan={6} style={{ padding: "0 4pt 4pt" }}>
                          <HistoryPanel history={edit.history!} />
                        </td>
                      </tr>
                    )}
                    {hasHistory && !isExpanded && (
                      <tr className="print-only" style={{ borderBottom: `0.5pt solid ${RULE}`, display: "none" }}>
                        <td colSpan={6} style={{ padding: "0 4pt 4pt" }}>
                          <HistoryPanel history={edit.history!} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `1.5pt solid ${RULE}`, background: "rgba(31,61,46,0.04)" }}>
                <td
                  style={{
                    padding: "5pt 4pt",
                    fontWeight: 700,
                    fontSize: "9pt",
                    color: DARK,
                  }}
                  colSpan={3}
                >
                  Net monthly change from plan
                </td>
                <td
                  style={{
                    padding: "5pt 4pt",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "9pt",
                    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                    color: totalDelta > 0 ? RED_DK : GREEN,
                  }}
                >
                  {fmtDelta(totalDelta)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Custom lines table */}
      {customEdits.length > 0 && (
        <div style={{ marginBottom: "16pt" }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: "7.5pt",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: AMBER,
              marginBottom: "5pt",
            }}
          >
            Custom lines — {customEdits.length} line{customEdits.length !== 1 ? "s" : ""} added by founder (not in planning defaults)
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "8.5pt",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1.5pt solid ${RULE}`,
                  color: MUTED,
                  fontWeight: 600,
                  fontSize: "8pt",
                }}
              >
                <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "26%" }}>Line</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "14%" }}>Plan default</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "14%" }}>Monthly amount</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "12%" }}>Δ / mo</th>
                <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "20%" }}>Note</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "14%" }}>Added</th>
              </tr>
            </thead>
            <tbody>
              {customLines.map((line) => (
                <tr key={line.key} style={{ borderBottom: `0.5pt solid ${RULE}`, background: "rgba(184,90,62,0.03)" }}>
                  <td style={{ padding: "4pt 4pt", fontWeight: 600, verticalAlign: "top" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "5pt", flexWrap: "wrap" }}>
                      <span>{line.label}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "1pt 5pt", background: AMBER, borderRadius: "2pt", flexShrink: 0 }}>
                        <span style={{ fontSize: "6.5pt", fontWeight: 700, color: CREAM, letterSpacing: "0.1em", textTransform: "uppercase" }}>Custom</span>
                      </span>
                    </div>
                    {line.description && (
                      <div style={{ fontSize: "7pt", color: MUTED, fontWeight: 400, marginTop: "1pt" }}>
                        {line.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "4pt 4pt", textAlign: "right", color: MUTED, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", verticalAlign: "top" }}>
                    —
                  </td>
                  <td style={{ padding: "4pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", verticalAlign: "top" }}>
                    {fmt(line.amount)}
                  </td>
                  <td style={{ padding: "4pt 4pt", textAlign: "right", fontWeight: 700, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", color: RED_DK, verticalAlign: "top" }}>
                    +{fmt(line.amount)}
                  </td>
                  <td style={{ padding: "4pt 4pt", fontSize: "7.5pt", color: line.note ? TEXT : MUTED, fontStyle: line.note ? "normal" : "italic", verticalAlign: "top" }}>
                    {line.note ?? "—"}
                  </td>
                  <td style={{ padding: "4pt 4pt", textAlign: "right", fontSize: "7pt", color: MUTED, verticalAlign: "top" }}>
                    {fmtDate(line.editedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Skipped items table (toggleable) */}
      {showSkipped && skippedEdits.length > 0 && (
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: "7.5pt",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "5pt",
            }}
          >
            Deferred items — {skippedEdits.length} line{skippedEdits.length !== 1 ? "s" : ""} skipped for now
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "8.5pt",
              tableLayout: "fixed",
              opacity: 0.75,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1pt solid ${RULE}`,
                  color: MUTED,
                  fontWeight: 600,
                  fontSize: "8pt",
                }}
              >
                <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "28%" }}>Role / Line</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "16%" }}>Plan default</th>
                <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "34%" }}>Note</th>
                <th style={{ padding: "3pt 4pt", textAlign: "right", width: "22%" }}>Deferred on</th>
              </tr>
            </thead>
            <tbody>
              {skippedEdits.map((edit) => {
                const item = COST_REGISTRY.find((r) => r.key === edit.key);
                return (
                  <tr key={edit.key} style={{ borderBottom: `0.5pt solid ${RULE}` }}>
                    <td style={{ padding: "4pt 4pt", fontWeight: 600, verticalAlign: "top" }}>
                      {item?.label ?? edit.key}
                    </td>
                    <td style={{ padding: "4pt 4pt", textAlign: "right", color: MUTED, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", verticalAlign: "top" }}>
                      {fmt(edit.defaultValue)}
                    </td>
                    <td style={{ padding: "4pt 4pt", fontSize: "7.5pt", color: edit.note ? TEXT : MUTED, fontStyle: edit.note ? "normal" : "italic", verticalAlign: "top" }}>
                      {edit.note ?? "—"}
                    </td>
                    <td style={{ padding: "4pt 4pt", textAlign: "right", fontSize: "7pt", color: MUTED, verticalAlign: "top" }}>
                      {fmtDate(edit.editedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reset all (danger zone) */}
      <div
        style={{
          marginTop: "20pt",
          paddingTop: "10pt",
          borderTop: `1pt solid ${RULE}`,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => {
            if (window.confirm("Remove all overrides and restore every cost line to its planning default?")) {
              onClearAll();
            }
          }}
          style={{
            padding: "3pt 12pt",
            fontSize: "7.5pt",
            fontWeight: 700,
            background: "transparent",
            color: RED_DK,
            border: `1pt solid rgba(122,26,26,0.3)`,
            borderRadius: "3pt",
            cursor: "pointer",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Reset all overrides
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────

export default function CostReviewModal() {
  const [tab, setTab] = useState<Tab>("review");
  const [editMap, setEditMap] = useState<Record<string, CostEdit>>({});
  const [customLines, setCustomLines] = useState<CustomLine[]>([]);
  const [showSkipped, setShowSkipped] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const refresh = useCallback(() => {
    const list = loadEdits();
    const map: Record<string, CostEdit> = {};
    for (const e of list) map[e.key] = e;
    setEditMap(map);
    setCustomLines(loadCustomLines());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSave = (key: string, value: number, note: string) => {
    saveEdit(key, value, note);
    refresh();
  };

  const handleSkip = (key: string) => {
    markSkipped(key);
    refresh();
  };

  const handleClear = (key: string) => {
    clearEdit(key);
    refresh();
  };

  const handleClearAll = () => {
    clearAllEdits();
    clearAllCustomLines();
    refresh();
  };

  const handleAddCustomLine = (line: Omit<CustomLine, "key" | "editedAt">) => {
    saveCustomLine(line);
    setShowAddForm(false);
    refresh();
  };

  const handleEditCustomLine = (line: CustomLine) => {
    saveCustomLine(line);
    refresh();
  };

  const handleDeleteCustomLine = (key: string) => {
    deleteCustomLine(key);
    refresh();
  };

  const editList  = Object.values(editMap);
  const editCount = editList.filter((e) => !e.skipped && e.delta !== 0).length;
  const skipCount = editList.filter((e) => e.skipped).length;
  const customCount = customLines.length;

  // Group registry items by scenario for the review tab
  const groupA = COST_REGISTRY.filter((i) => i.scenario === "A");
  const groupB = COST_REGISTRY.filter((i) => i.scenario === "B");
  const groupC = COST_REGISTRY.filter((i) => i.scenario === "C");

  return (
    <div style={{ background: "#d8d2c8", minHeight: "100vh" }}>
      <div
        id="cost-review-print-target"
        style={{
          width: "8.5in",
          margin: "0 auto",
          background: CREAM,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "9pt",
          color: TEXT,
        }}
      >
        <div style={{ width: "8.5in", minHeight: "11in", padding: "0.55in 0.65in" }}>

          {/* Amber rule */}
          <div style={{ height: "3pt", background: AMBER, margin: "0 0 14pt" }} />

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "14pt",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "7pt",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: AMBER,
                  marginBottom: "3pt",
                }}
              >
                Practitioner Operating Plan — Cost Review
              </div>
              <div
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: "22pt",
                  fontWeight: 700,
                  color: DARK,
                  lineHeight: 1.1,
                  marginBottom: "4pt",
                }}
              >
                Cost Review
              </div>
              <div style={{ fontSize: "9pt", color: MUTED, lineHeight: 1.5 }}>
                Override any planning default and attach a private note.
                The Edits tab shows everything you changed, ready to print for board conversations.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "7pt",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                Confidential
              </div>
              <div style={{ fontSize: "8pt", color: MUTED, marginTop: "2pt" }}>
                Headwaters Development Services
              </div>
            </div>
          </div>

          {/* Tab strip */}
          <div
            className="no-print"
            style={{
              display: "flex",
              gap: "0",
              borderBottom: `1.5pt solid ${RULE}`,
              marginBottom: "14pt",
            }}
          >
            {(["review", "edits"] as Tab[]).map((t) => {
              const label =
                t === "review"
                  ? "Review"
                  : `Edits${editCount + skipCount + customCount > 0 ? ` (${editCount + skipCount + customCount})` : ""}`;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "5pt 14pt",
                    fontSize: "8.5pt",
                    fontWeight: tab === t ? 700 : 500,
                    color: tab === t ? DARK : MUTED,
                    background: "transparent",
                    border: "none",
                    borderBottom: tab === t ? `2.5pt solid ${AMBER}` : `2.5pt solid transparent`,
                    cursor: "pointer",
                    marginBottom: "-1.5pt",
                    letterSpacing: "0.03em",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── REVIEW TAB ── */}
          {tab === "review" && (
            <div>

              {/* Helper note */}
              <div
                style={{
                  background: "rgba(31,61,46,0.05)",
                  border: `1pt solid ${RULE}`,
                  borderRadius: "3pt",
                  padding: "7pt 12pt",
                  fontSize: "8pt",
                  color: MUTED,
                  lineHeight: 1.55,
                  marginBottom: "14pt",
                }}
              >
                <strong style={{ color: DARK }}>How it works:</strong> The "Plan default" column shows the Scenario B planning number.
                Type a different value in the input and hit <strong>Save</strong> to record your override.
                Hit <strong>Skip</strong> to mark an item as deferred.
                Every change is visible in the <strong>Edits</strong> tab — printable for board review.
              </div>

              {/* Scenario A lines */}
              <SectionHeader label="Scenario A + B core lines" />
              <CostTable
                items={groupA}
                editMap={editMap}
                onSave={handleSave}
                onSkip={handleSkip}
                onClear={handleClear}
              />

              {/* Scenario B lines */}
              <SectionHeader label="Scenario B additions" style={{ marginTop: "12pt" }} />
              <CostTable
                items={groupB}
                editMap={editMap}
                onSave={handleSave}
                onSkip={handleSkip}
                onClear={handleClear}
              />

              {/* Scenario C lines */}
              <SectionHeader label="Scenario C scale lines" style={{ marginTop: "12pt" }} />
              <CostTable
                items={groupC}
                editMap={editMap}
                onSave={handleSave}
                onSkip={handleSkip}
                onClear={handleClear}
              />

              {/* Custom lines */}
              <div style={{ marginTop: "16pt" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5pt" }}>
                  <SectionHeader label={`Custom lines${customLines.length > 0 ? ` (${customLines.length})` : ""}`} />
                  {!showAddForm && (
                    <button
                      className="no-print"
                      onClick={() => setShowAddForm(true)}
                      style={{
                        padding: "3pt 12pt",
                        fontSize: "7.5pt",
                        fontWeight: 700,
                        background: AMBER,
                        color: CREAM,
                        border: "none",
                        borderRadius: "3pt",
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      + Add custom line
                    </button>
                  )}
                </div>

                {customLines.length > 0 && (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "8.5pt",
                      tableLayout: "fixed",
                      marginBottom: "6pt",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: `1.5pt solid ${RULE}`,
                          color: MUTED,
                          fontWeight: 600,
                          fontSize: "8pt",
                        }}
                      >
                        <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "22%" }}>Line</th>
                        <th style={{ padding: "3pt 4pt", textAlign: "right", width: "13%" }}>Plan default</th>
                        <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "14%" }}>Monthly amount</th>
                        <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "30%" }}>Private note</th>
                        <th style={{ padding: "3pt 4pt", textAlign: "right", width: "21%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customLines.map((line) => (
                        <CustomLineRow
                          key={line.key}
                          line={line}
                          onDelete={handleDeleteCustomLine}
                          onEdit={handleEditCustomLine}
                        />
                      ))}
                    </tbody>
                  </table>
                )}

                {customLines.length === 0 && !showAddForm && (
                  <div style={{ fontSize: "8pt", color: MUTED, fontStyle: "italic", padding: "6pt 0" }}>
                    No custom lines yet. Use "+ Add custom line" to capture costs not in the planning defaults.
                  </div>
                )}

                {showAddForm && (
                  <AddCustomLineForm
                    onSave={handleAddCustomLine}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── EDITS TAB ── */}
          {tab === "edits" && (
            <>
              {/* Print-only header (visible only when printing) */}
              <div
                className="print-only"
                style={{
                  display: "none",
                  marginBottom: "12pt",
                  borderBottom: `1pt solid ${RULE}`,
                  paddingBottom: "8pt",
                }}
              >
                <div style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: "7.5pt", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: AMBER, marginBottom: "3pt" }}>
                  Cost Review — Edits Audit
                </div>
                <div style={{ fontSize: "8pt", color: MUTED }}>
                  Printed {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })} · Headwaters Development Services · Confidential
                </div>
              </div>
              <EditsView
                edits={editList}
                customLines={customLines}
                showSkipped={showSkipped}
                onToggleSkipped={() => setShowSkipped((v) => !v)}
                onClearAll={handleClearAll}
              />
            </>
          )}

        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #cost-review-print-target,
          #cost-review-print-target * { display: revert !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          #cost-review-print-target {
            width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Local helpers ──────────────────────────────────────────────────────

function SectionHeader({
  label,
  style: extraStyle,
}: {
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        fontSize: "7.5pt",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: AMBER,
        marginBottom: "5pt",
        ...extraStyle,
      }}
    >
      {label}
    </div>
  );
}

function CostTable({
  items,
  editMap,
  onSave,
  onSkip,
  onClear,
}: {
  items: CostItem[];
  editMap: Record<string, CostEdit>;
  onSave: (key: string, value: number, note: string) => void;
  onSkip: (key: string) => void;
  onClear: (key: string) => void;
}) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "8.5pt",
        tableLayout: "fixed",
      }}
    >
      <thead>
        <tr
          style={{
            borderBottom: `1.5pt solid ${RULE}`,
            color: MUTED,
            fontWeight: 600,
            fontSize: "8pt",
          }}
        >
          <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "22%" }}>Role / Line</th>
          <th style={{ padding: "3pt 4pt", textAlign: "right", width: "13%" }}>Plan default</th>
          <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "14%" }}>Your value</th>
          <th style={{ padding: "3pt 4pt", textAlign: "left",  width: "30%" }}>Private note</th>
          <th style={{ padding: "3pt 4pt", textAlign: "right", width: "21%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <ReviewRow
            key={item.key}
            item={item}
            edit={editMap[item.key] ?? null}
            onSave={onSave}
            onSkip={onSkip}
            onClear={onClear}
          />
        ))}
      </tbody>
    </table>
  );
}
