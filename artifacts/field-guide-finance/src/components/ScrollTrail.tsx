import { useEffect, useRef, useState } from "react";

export function ScrollTrail({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const [glowHeight, setGlowHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight <= clientHeight ? 1 : scrollTop / (scrollHeight - clientHeight);
      setGlowHeight(Math.max(0.04, Math.min(1, pct)));
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "22px",
        top: "120px",
        bottom: "40px",
        width: "2px",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Track */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "2px",
          background: "repeating-linear-gradient(180deg, var(--border-light) 0px, var(--border-light) 6px, transparent 6px, transparent 12px)",
          opacity: 0.6,
        }}
      />
      {/* Glowing fill */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${glowHeight * 100}%`,
          borderRadius: "2px",
          background: "linear-gradient(180deg, var(--amber) 0%, var(--ice-dark) 100%)",
          transition: "height 0.3s ease",
          boxShadow: "0 0 8px var(--amber-mid), 0 0 2px var(--amber)",
          opacity: 0.7,
        }}
      />
      {/* Dot at progress head */}
      <div
        style={{
          position: "absolute",
          left: "-3px",
          top: `calc(${glowHeight * 100}% - 4px)`,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "var(--amber)",
          boxShadow: "0 0 6px var(--amber), 0 0 12px var(--amber-mid)",
          transition: "top 0.3s ease",
        }}
      />
    </div>
  );
}

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const targets = container.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}
