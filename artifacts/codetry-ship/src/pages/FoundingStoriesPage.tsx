/**
 * FoundingStoriesPage — shared front door for both the youth and adult Odyssey.
 * Renders the three founding "girl" stories with a creek/stream motif between them.
 * At the bottom: two onward paths — youth journey or pioneer odyssey.
 *
 * Reading progress: scroll position is saved to localStorage so returning visitors
 * resume where they left off. Each story also has a "mark as read" toggle.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { TALES, type TaleBlock } from "@workspace/codetry-handbook/data/tales";

const SCROLL_KEY = "founding-stories:scroll";
const READ_KEY   = "founding-stories:read";

/* ── Founding story IDs and order ────────────────────────────────────────── */

const FOUNDING_IDS = [
  "the-girl-who-waited-for-the-eagle",
  "the-girl-who-never-knew",
  "the-girl-who-stopped-waiting-for-spring",
];

const FOUNDING_TALES = FOUNDING_IDS.map(
  (id) => TALES.find((t) => t.id === id)!
);

/* ── Creek SVG divider ───────────────────────────────────────────────────── */

function CreekDivider() {
  return (
    <div className="my-14 flex items-center justify-center" aria-hidden="true">
      <svg
        viewBox="0 0 480 48"
        width="100%"
        style={{ maxWidth: 480, display: "block" }}
      >
        <path
          d="M 0 24 C 30 14, 50 34, 80 24 C 110 14, 130 36, 160 24 C 190 12, 210 36, 240 24 C 270 12, 290 36, 320 24 C 350 12, 370 36, 400 24 C 430 12, 455 34, 480 24"
          fill="none"
          stroke="rgba(46,139,78,0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 0 32 C 30 22, 55 42, 85 30 C 115 18, 140 40, 170 30 C 200 20, 225 42, 255 30 C 285 18, 310 40, 340 30 C 370 20, 395 42, 425 30 C 450 20, 465 38, 480 32"
          fill="none"
          stroke="rgba(100,160,200,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* small pebble dots */}
        {[60, 140, 220, 300, 380].map((x) => (
          <circle key={x} cx={x} cy={24} r={2.5} fill="rgba(201,124,46,0.35)" />
        ))}
      </svg>
    </div>
  );
}

/* ── Story block renderer ────────────────────────────────────────────────── */

function StoryBody({ blocks }: { blocks: TaleBlock[] }) {
  return (
    <div className="space-y-0">
      {blocks.map((block, i) => {
        if (block.kind === "break") {
          return <div key={i} className="h-6" />;
        }
        if (block.kind === "italic") {
          return (
            <p
              key={i}
              className="font-serif italic"
              style={{
                fontSize: "clamp(1rem, 2.8vw, 1.125rem)",
                color: "rgba(244,237,224,0.78)",
                lineHeight: 1.85,
                marginBottom: "0.6em",
              }}
            >
              {block.text}
            </p>
          );
        }
        return (
          <p
            key={i}
            className="font-serif"
            style={{
              fontSize: "clamp(1rem, 2.8vw, 1.125rem)",
              color: "rgba(244,237,224,0.88)",
              lineHeight: 1.85,
              marginBottom: "0.6em",
            }}
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

/* ── Mark-as-read toggle ─────────────────────────────────────────────────── */

function ReadToggle({
  storyId,
  read,
  onToggle,
}: {
  storyId: string;
  read: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(storyId)}
      aria-pressed={read}
      aria-label={read ? "Mark story as unread" : "Mark story as read"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45rem",
        background: read ? "rgba(46,139,78,0.15)" : "rgba(244,237,224,0.04)",
        border: read
          ? "1px solid rgba(46,139,78,0.45)"
          : "1px solid rgba(244,237,224,0.1)",
        borderRadius: "2rem",
        padding: "0.3rem 0.8rem",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      {/* small leaf / checkmark icon */}
      <svg
        viewBox="0 0 14 14"
        width="11"
        height="11"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {read ? (
          <path
            d="M2 7 L5.5 10.5 L12 3.5"
            fill="none"
            stroke="rgba(46,139,78,0.9)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <circle
            cx="7"
            cy="7"
            r="4.5"
            fill="none"
            stroke="rgba(244,237,224,0.22)"
            strokeWidth="1.3"
          />
        )}
      </svg>
      <span
        className="font-mono uppercase tracking-[0.2em]"
        style={{
          fontSize: "7.5px",
          color: read ? "rgba(46,139,78,0.85)" : "rgba(244,237,224,0.3)",
        }}
      >
        {read ? "Read" : "Mark as read"}
      </span>
    </button>
  );
}

/* ── Resume banner ───────────────────────────────────────────────────────── */

function ResumeBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        background: "rgba(13,29,21,0.94)",
        border: "1px solid rgba(46,139,78,0.4)",
        borderRadius: "2rem",
        padding: "0.55rem 1.1rem",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
        whiteSpace: "nowrap",
      }}
    >
      <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
        <path
          d="M2 7 L5.5 10.5 L12 3.5"
          fill="none"
          stroke="rgba(46,139,78,0.9)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="font-mono uppercase tracking-[0.2em]"
        style={{ fontSize: "8px", color: "rgba(244,237,224,0.65)" }}
      >
        Resumed where you left off
      </span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 0.1rem",
          color: "rgba(244,237,224,0.3)",
          fontSize: "13px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */

export function FoundingStoriesPage() {
  const [readStories, setReadStories] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(READ_KEY);
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const scrollRestoredRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Restore scroll on first mount ── */
  useEffect(() => {
    if (scrollRestoredRef.current) return;
    scrollRestoredRef.current = true;

    let savedY = 0;
    try {
      const raw = localStorage.getItem(SCROLL_KEY);
      if (raw) savedY = parseInt(raw, 10);
    } catch {
      /* localStorage unavailable — skip restore */
      return;
    }

    if (savedY > 0) {
      window.scrollTo(0, savedY);
      setShowResumeBanner(true);
    }
  }, []);

  /* ── Save scroll position (debounced) ── */
  useEffect(() => {
    function handleScroll() {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)));
        } catch {
          /* ignore */
        }
      }, 300);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  /* ── Toggle read state ── */
  const toggleRead = useCallback((id: string) => {
    setReadStories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(READ_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <main
      style={{
        background: "linear-gradient(to bottom, #0d1d15 0%, #16261e 40%, #1a2e24 80%, #162535 100%)",
        minHeight: "100vh",
        color: "#f4ede0",
      }}
    >
      {/* ── Header ── */}
      <header
        className="max-w-[44rem] mx-auto px-6 sm:px-8"
        style={{ paddingTop: "clamp(3rem, 8vw, 5rem)", paddingBottom: "2.5rem" }}
      >
        <p
          className="font-mono uppercase tracking-[0.28em] mb-4"
          style={{ fontSize: "9px", color: "rgba(201,124,46,0.7)" }}
        >
          Headwaters · Founding Stories
        </p>
        <h1
          className="font-serif mb-4"
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "#f4ede0",
          }}
        >
          Three Girls,<br />One River
        </h1>
        <p
          className="font-serif italic"
          style={{
            fontSize: "clamp(1rem, 3vw, 1.2rem)",
            color: "rgba(244,237,224,0.55)",
            lineHeight: 1.65,
            maxWidth: "34rem",
          }}
        >
          These are the stories that run beneath everything else here.
          Read them before you begin — whichever path you take.
        </p>

        {/* creek intro line */}
        <div className="mt-8 flex items-center gap-3">
          <svg viewBox="0 0 80 12" width="80" style={{ display: "block" }} aria-hidden="true">
            <path
              d="M 0 6 C 10 2, 18 10, 28 6 C 38 2, 46 10, 56 6 C 66 2, 74 10, 80 6"
              fill="none"
              stroke="rgba(46,139,78,0.5)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="font-mono uppercase tracking-[0.22em]"
            style={{ fontSize: "8px", color: "rgba(244,237,224,0.25)" }}
          >
            Three stories · one creek
          </span>
        </div>
      </header>

      {/* ── Stories ── */}
      <div className="max-w-[44rem] mx-auto px-6 sm:px-8 pb-4">
        {FOUNDING_TALES.map((tale, idx) => (
          <div key={tale.id}>
            {/* Story header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3 gap-4">
                <span
                  className="font-mono uppercase tracking-[0.22em]"
                  style={{ fontSize: "8.5px", color: "rgba(201,124,46,0.6)" }}
                >
                  Story {String(idx + 1).padStart(2, "0")} of 03
                </span>
                <ReadToggle
                  storyId={tale.id}
                  read={readStories.has(tale.id)}
                  onToggle={toggleRead}
                />
              </div>
              <h2
                className="font-serif mb-2"
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                  color: "#f4ede0",
                }}
              >
                {tale.title}
              </h2>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "clamp(0.9rem, 2.6vw, 1.05rem)",
                  color: "rgba(201,124,46,0.75)",
                  lineHeight: 1.55,
                }}
              >
                {tale.subtitle}
              </p>
              <div
                className="mt-4 h-px"
                style={{ background: "rgba(201,124,46,0.18)" }}
              />
            </div>

            {/* Story body */}
            <StoryBody blocks={tale.body} />

            {/* Author note */}
            <div
              className="mt-8 px-5 py-4 rounded-xl"
              style={{
                background: "rgba(244,237,224,0.04)",
                border: "1px solid rgba(244,237,224,0.08)",
              }}
            >
              <p
                className="font-mono uppercase tracking-[0.2em] mb-2"
                style={{ fontSize: "7.5px", color: "rgba(201,124,46,0.5)" }}
              >
                Author's note
              </p>
              {tale.authorNote.split("\n").map((line, i) => (
                <p
                  key={i}
                  className="font-serif italic"
                  style={{
                    fontSize: "13px",
                    color: "rgba(244,237,224,0.42)",
                    lineHeight: 1.7,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Creek divider between stories */}
            {idx < FOUNDING_TALES.length - 1 && <CreekDivider />}
          </div>
        ))}
      </div>

      {/* ── Onward paths ── */}
      <footer
        className="max-w-[44rem] mx-auto px-6 sm:px-8"
        style={{ paddingTop: "3rem", paddingBottom: "5rem" }}
      >
        {/* final creek line */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(46,139,78,0.22)" }} />
          <svg viewBox="0 0 16 16" width="16" aria-hidden="true">
            <circle cx="8" cy="8" r="3" fill="rgba(100,160,200,0.4)" />
          </svg>
          <div className="flex-1 h-px" style={{ background: "rgba(46,139,78,0.22)" }} />
        </div>

        <p
          className="font-mono uppercase tracking-[0.28em] text-center mb-3"
          style={{ fontSize: "8.5px", color: "rgba(244,237,224,0.3)" }}
        >
          Choose your path
        </p>
        <p
          className="font-serif italic text-center mb-8"
          style={{
            fontSize: "clamp(1rem, 3vw, 1.15rem)",
            color: "rgba(244,237,224,0.5)",
            lineHeight: 1.65,
          }}
        >
          The creek runs the same direction from here.<br />
          Which bank are you on?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/story"
            className="flex-1 sm:max-w-[18rem] flex flex-col items-center gap-1 px-6 py-5 rounded-xl transition-all hover:opacity-85"
            style={{
              background: "rgba(31,61,46,0.5)",
              border: "1.5px solid rgba(46,139,78,0.35)",
              textDecoration: "none",
            }}
          >
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{ fontSize: "8px", color: "rgba(201,124,46,0.7)" }}
            >
              Youth Journey
            </span>
            <span
              className="font-serif"
              style={{ fontSize: "1.05rem", color: "#f4ede0", fontWeight: 500 }}
            >
              I'm a young reader →
            </span>
            <span
              className="font-mono"
              style={{ fontSize: "7.5px", color: "rgba(244,237,224,0.3)", letterSpacing: "0.1em" }}
            >
              /story
            </span>
          </a>

          <a
            href="/odyssey"
            className="flex-1 sm:max-w-[18rem] flex flex-col items-center gap-1 px-6 py-5 rounded-xl transition-all hover:opacity-85"
            style={{
              background: "rgba(20,35,55,0.5)",
              border: "1.5px solid rgba(122,179,204,0.3)",
              textDecoration: "none",
            }}
          >
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{ fontSize: "8px", color: "rgba(122,179,204,0.7)" }}
            >
              Pioneer Odyssey
            </span>
            <span
              className="font-serif"
              style={{ fontSize: "1.05rem", color: "#f4ede0", fontWeight: 500 }}
            >
              I'm a practitioner →
            </span>
            <span
              className="font-mono"
              style={{ fontSize: "7.5px", color: "rgba(244,237,224,0.3)", letterSpacing: "0.1em" }}
            >
              /odyssey
            </span>
          </a>
        </div>
      </footer>

      {/* ── Resume banner (shown when scroll was restored) ── */}
      {showResumeBanner && (
        <ResumeBanner onDismiss={() => setShowResumeBanner(false)} />
      )}
    </main>
  );
}
