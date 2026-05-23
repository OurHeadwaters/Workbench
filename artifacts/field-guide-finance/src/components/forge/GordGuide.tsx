import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { GordBird } from "@/components/forge/GordBird";
import { PAGE_TIPS, SMITH_HECKLES } from "@/lib/forgeCastleTips";
import type { ForgePage } from "@/lib/forgeCastleTips";

function routeToPage(path: string): ForgePage {
  if (path.startsWith("/forge/build")) return "forge";
  if (path.startsWith("/forge/battle-feed")) return "battle-feed";
  if (path.startsWith("/forge/shallows")) return "shallows";
  if (path.startsWith("/forge/great-hall")) return "great-hall";
  if (path.startsWith("/forge/library")) return "library";
  if (path.startsWith("/forge/progress")) return "progress";
  if (path.startsWith("/forge/module")) return "modules";
  if (path.startsWith("/forge/modules")) return "modules";
  if (path.startsWith("/forge")) return "faction";
  return "faction";
}

const BUBBLE_STYLES = `
@keyframes gordBubbleIn {
  from { opacity: 0; transform: translateY(10px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}
@keyframes gordBubbleOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(6px); }
}
.gord-bubble-enter { animation: gordBubbleIn 0.22s ease-out forwards; }
.gord-bubble-exit  { animation: gordBubbleOut 0.18s ease-in forwards; }
`;

let bubbleStylesInjected = false;

export function GordGuide() {
  const [location] = useLocation();
  const page = routeToPage(location);
  const tips = PAGE_TIPS[page] ?? SMITH_HECKLES.slice(0, 3);

  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [introduced, setIntroduced] = useState(false);

  useEffect(() => {
    if (!bubbleStylesInjected && typeof document !== "undefined") {
      const tag = document.createElement("style");
      tag.textContent = BUBBLE_STYLES;
      document.head.appendChild(tag);
      bubbleStylesInjected = true;
    }
  }, []);

  useEffect(() => {
    setTipIndex(0);
    setExiting(false);
    const dismissed = sessionStorage.getItem(`gord-dismissed-${page}`);
    if (dismissed) {
      setVisible(false);
      setIntroduced(true);
      return;
    }
    const t = setTimeout(() => {
      setVisible(true);
      setIntroduced(true);
    }, 1800);
    return () => clearTimeout(t);
  }, [page]);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      sessionStorage.setItem(`gord-dismissed-${page}`, "1");
    }, 200);
  }, [page]);

  const recall = useCallback(() => {
    sessionStorage.removeItem(`gord-dismissed-${page}`);
    setTipIndex((i) => (i + 1) % tips.length);
    setExiting(false);
    setVisible(true);
  }, [page, tips.length]);

  const nextTip = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setTipIndex((i) => (i + 1) % tips.length);
      setExiting(false);
    }, 180);
  }, [tips.length]);

  useEffect(() => {
    if (!visible) return;
    const t = setInterval(nextTip, 14000);
    return () => clearInterval(t);
  }, [visible, nextTip]);

  const currentTip = tips[tipIndex] ?? tips[0];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 16,
        zIndex: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        pointerEvents: "none",
      }}
    >
      {visible && introduced && (
        <div
          className={exiting ? "gord-bubble-exit" : "gord-bubble-enter"}
          style={{
            maxWidth: 230,
            minWidth: 180,
            borderRadius: 12,
            border: "1px solid rgba(217,119,6,0.45)",
            backgroundColor: "#1a1508",
            boxShadow: "0 4px 24px rgba(0,0,0,0.55), 0 0 0 1px rgba(217,119,6,0.1)",
            padding: "10px 12px 8px",
            position: "relative",
            pointerEvents: "all",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -7,
              left: 20,
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "7px solid rgba(217,119,6,0.45)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -5,
              left: 21,
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #1a1508",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <span
              style={{
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#D97706",
                fontFamily: "var(--font-sans)",
              }}
            >
              {page === "forge" ? "Gord on Smith" : "Gord says"}
            </span>
            <button
              onClick={dismiss}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                cursor: "pointer",
                fontSize: "0.75rem",
                lineHeight: 1,
                padding: "0 0 0 8px",
                minHeight: 24,
                minWidth: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Dismiss"
            >
              ×
            </button>
          </div>

          <p
            style={{
              fontSize: "0.78rem",
              color: "#F0CFA0",
              lineHeight: 1.55,
              fontFamily: "var(--font-sans)",
              margin: 0,
              fontStyle: page === "forge" ? "italic" : "normal",
            }}
          >
            {currentTip}
          </p>

          {tips.length > 1 && (
            <button
              onClick={nextTip}
              style={{
                marginTop: 7,
                background: "none",
                border: "none",
                color: "#D97706",
                cursor: "pointer",
                fontSize: "0.68rem",
                padding: 0,
                fontFamily: "var(--font-sans)",
                display: "flex",
                alignItems: "center",
                gap: 4,
                minHeight: 24,
              }}
              title="Next tip"
            >
              <span
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                }}
              >
                {tips.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      backgroundColor: i === tipIndex ? "#D97706" : "rgba(217,119,6,0.3)",
                      display: "inline-block",
                    }}
                  />
                ))}
              </span>
              <span>next →</span>
            </button>
          )}
        </div>
      )}

      <div
        style={{
          position: "relative",
          pointerEvents: "all",
          cursor: "pointer",
        }}
        onClick={visible ? dismiss : recall}
        title={visible ? "Dismiss Gord" : "Ask Gord"}
      >
        <GordBird size={46} variant="full" animated={true} />
        {!visible && introduced && (
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#D97706",
              border: "1.5px solid #0f0f1a",
              animation: "gordFloat 2s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}
