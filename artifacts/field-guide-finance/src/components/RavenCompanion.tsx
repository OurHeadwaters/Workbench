import { useEffect, useRef, useState } from "react";

export function RavenCompanion({ delay = 0 }: { delay?: number }) {
  const [phase, setPhase] = useState<"hidden" | "flying" | "perched">("hidden");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setPhase("flying");
      timerRef.current = setTimeout(() => setPhase("perched"), 900);
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [delay]);

  if (phase === "hidden") return null;

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        animation:
          phase === "flying"
            ? "ravenFly 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : "ravenPerch 3s ease-in-out infinite",
        transformOrigin: "center",
      }}
    >
      <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
        <path
          d="M16 14 C12 10 6 11 5 15 C4 18 7 21 12 21 L20 21 C25 21 28 18 27 15 C26 11 20 10 16 14Z"
          fill="#1a120a"
        />
        <path d="M5 15 C1 13 -1 17 1 20 C3 23 7 21 12 21" fill="#252015"/>
        <path d="M27 15 C31 13 33 17 31 20 C29 23 25 21 20 21" fill="#252015"/>
        <path d="M14 11 C14 7 16 5 18 8 C20 11 19 13 16 14" fill="#2d2010"/>
        <circle cx="19" cy="11" r="1.3" fill="#a8c8d8"/>
        <path d="M19 13 L23 15 L19 17" fill="#c97d2e" stroke="#c97d2e" strokeWidth="0.3"/>
        <path d="M11 21 L9 26 M21 21 L23 26" stroke="#1a120a" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

export function RavenInline({ className = "" }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
      <svg width="22" height="18" viewBox="0 0 32 28" fill="none">
        <path
          d="M16 14 C12 10 6 11 5 15 C4 18 7 21 12 21 L20 21 C25 21 28 18 27 15 C26 11 20 10 16 14Z"
          fill="#1b3a2d"
        />
        <path d="M5 15 C1 13 -1 17 1 20 C3 23 7 21 12 21" fill="#2d5a40"/>
        <path d="M27 15 C31 13 33 17 31 20 C29 23 25 21 20 21" fill="#2d5a40"/>
        <path d="M14 11 C14 7 16 5 18 8 C20 11 19 13 16 14" fill="#4a7c5f"/>
        <circle cx="19" cy="11" r="1.3" fill="#a8c8d8"/>
        <path d="M19 13 L23 15 L19 17" fill="#c97d2e"/>
        <path d="M11 21 L9 26 M21 21 L23 26" stroke="#1b3a2d" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    </span>
  );
}
