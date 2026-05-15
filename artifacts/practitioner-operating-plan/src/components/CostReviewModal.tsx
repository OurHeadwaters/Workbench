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

import { useState, useEffect, useCallback } from "react";
import {
  COST_REGISTRY,
  type CostItem,
} from "@/data/costRegistry";
import {
  loadEdits,
  loadEdit,
  saveEdit,
  markSkipped,
  clearEdit,
  clearAllEdits,
  type CostEdit,
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

// ── Edits tab — audit / diff view ─────────────────────────────────────

interface EditsViewProps {
  edits: CostEdit[];
  showSkipped: boolean;
  onToggleSkipped: () => void;
  onClearAll: () => void;
}

function EditsView({
  edits,
  showSkipped,
  onToggleSkipped,
  onClearAll,
}: EditsViewProps) {
  const valueEdits  = edits.filter((e) => !e.skipped && e.delta !== 0);
  const skippedEdits = edits.filter((e) => e.skipped);
  const totalDelta   = valueEdits.reduce((sum, e) => sum + e.delta, 0);
  const hasContent   = valueEdits.length > 0 || skippedEdits.length > 0;

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
                return (
                  <tr
                    key={edit.key}
                    style={{ borderBottom: `0.5pt solid ${RULE}` }}
                  >
                    <td style={{ padding: "4pt 4pt", fontWeight: 600, verticalAlign: "top" }}>
                      {item?.label ?? edit.key}
                      {item && (
                        <div style={{ fontSize: "7pt", color: MUTED, fontWeight: 400, marginTop: "1pt" }}>
                          {item.description}
                        </div>
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
  const [showSkipped, setShowSkipped] = useState(false);

  const refresh = useCallback(() => {
    const list = loadEdits();
    const map: Record<string, CostEdit> = {};
    for (const e of list) map[e.key] = e;
    setEditMap(map);
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
    refresh();
  };

  const editList  = Object.values(editMap);
  const editCount = editList.filter((e) => !e.skipped && e.delta !== 0).length;
  const skipCount = editList.filter((e) => e.skipped).length;

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
                  : `Edits${editCount + skipCount > 0 ? ` (${editCount + skipCount})` : ""}`;
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
