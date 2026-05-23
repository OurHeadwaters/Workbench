/**
 * React bindings for the Kitchen Table client.
 *
 * Exposes:
 *   - useKitchenTable(source) — returns a function bound to an artifact id.
 *   - <KitchenTableButton source="artifacts/north-star" /> — a tiny
 *     dev-only floating button that opens a one-line prompt and drops the
 *     entered text onto the Kitchen Table. Hidden in production builds.
 *
 * The button is intentionally minimal chrome — the point is the wiring,
 * not a per-artifact UI.
 */

import * as React from "react";
import { useCallback, useState } from "react";
import {
  putOnKitchenTable,
  deriveSource,
  type PutOnKitchenTableInput,
  type KitchenTableDrop,
} from "./index";

export function useKitchenTable(source?: string, baseUrl?: string) {
  return useCallback(
    (input: PutOnKitchenTableInput) =>
      putOnKitchenTable({ ...input, source, baseUrl }),
    [source, baseUrl],
  );
}

function isDev(): boolean {
  // Vite & most bundlers expose import.meta.env.DEV. We guard via try/catch
  // because some environments (Expo web) don't define import.meta.env.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (import.meta as any).env;
    if (env && typeof env.DEV === "boolean") return env.DEV;
    if (env && env.MODE) return env.MODE !== "production";
  } catch {
    // ignore
  }
  if (typeof process !== "undefined" && process.env) {
    return process.env.NODE_ENV !== "production";
  }
  return false;
}

export interface KitchenTableButtonProps {
  /**
   * Artifact id. Optional — auto-derived from `import.meta.env.BASE_URL`
   * via `deriveSource()`. Pass explicitly only to override.
   */
  source?: string;
  sourceRef?: string;
  /** Force-show in production too (e.g. for owner-only views). */
  alwaysShow?: boolean;
}

export function KitchenTableButton({
  source,
  sourceRef,
  alwaysShow,
}: KitchenTableButtonProps): React.ReactElement | null {
  const resolvedSource = source ?? deriveSource() ?? "unknown";
  const drop = useKitchenTable(resolvedSource);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!alwaysShow && !isDev()) return null;

  const submit = async () => {
    const title = text.trim();
    if (!title) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const ref =
        sourceRef ??
        (typeof window !== "undefined" ? window.location.pathname + window.location.hash : undefined);
      const result: KitchenTableDrop = await drop({ title, sourceRef: ref });
      void result;
      setStatus("ok");
      setText("");
      setTimeout(() => {
        setStatus("idle");
        setOpen(false);
      }, 1200);
    } catch (err) {
      setStatus("err");
      setErrorMsg(err instanceof Error ? err.message : "drop failed");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 2147483000,
        fontFamily: "system-ui, sans-serif",
      }}
      data-testid="kitchen-table-button"
    >
      {open ? (
        <div
          style={{
            background: "#13110E",
            color: "#EAE4DB",
            border: "1px solid #2C241D",
            borderRadius: 6,
            padding: 12,
            width: 320,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, color: "#8C7B6D" }}>
            kitchen table · {resolvedSource}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="put it on the kitchen table…"
            rows={3}
            autoFocus
            style={{
              width: "100%",
              background: "#1C1814",
              color: "#EAE4DB",
              border: "1px solid #2A231E",
              borderRadius: 4,
              padding: 8,
              fontSize: 13,
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {status === "err" && (
            <div style={{ fontSize: 11, color: "#E07A5F", marginTop: 6 }}>{errorMsg}</div>
          )}
          {status === "ok" && (
            <div style={{ fontSize: 11, color: "#86A985", marginTop: 6 }}>dropped — see Deadhead intake</div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => { setOpen(false); setStatus("idle"); setErrorMsg(""); }}
              style={{
                background: "transparent",
                color: "#8C7B6D",
                border: "1px solid #2A231E",
                borderRadius: 4,
                padding: "6px 10px",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={status === "sending" || !text.trim()}
              style={{
                background: "#8C7B6D",
                color: "#13110E",
                border: "none",
                borderRadius: 4,
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 600,
                cursor: status === "sending" ? "wait" : "pointer",
                opacity: !text.trim() ? 0.4 : 1,
              }}
            >
              {status === "sending" ? "dropping…" : "drop"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title={`put it on the kitchen table (${resolvedSource})`}
          style={{
            background: "#13110E",
            color: "#EAE4DB",
            border: "1px solid #2C241D",
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
            opacity: 0.85,
          }}
        >
          ☷ kitchen table
        </button>
      )}
    </div>
  );
}
