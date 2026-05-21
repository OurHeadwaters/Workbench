import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
 * AmbientBackground
 *
 * All motion uses only opacity + transform — GPU-composited, no re-paint.
 * The gradient backgrounds themselves are static; only the layer's
 * transform and opacity animate via CSS @keyframes defined in index.css.
 * ───────────────────────────────────────────────────────────────────────── */

interface AmbientBackgroundProps {
  className?: string;
  variant?: "aurora" | "mist" | "campfire";
}

export function AmbientBackground({ className = "", variant = "aurora" }: AmbientBackgroundProps) {
  const layers = VARIANT_LAYERS[variant];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {layers.map((l, i) => (
        <div
          key={i}
          className={`absolute inset-0 ${l.cls}`}
          style={{ background: l.bg }}
        />
      ))}
    </div>
  );
}

/* ── Per-variant layer definitions ────────────────────────────────────── */

const VARIANT_LAYERS: Record<
  "aurora" | "mist" | "campfire",
  { cls: string; bg: string }[]
> = {
  aurora: [
    {
      cls: "ambient-blob-a",
      bg: "radial-gradient(ellipse 120% 60% at 48% 18%, hsla(148,55%,22%,0.28) 0%, transparent 65%)",
    },
    {
      cls: "ambient-blob-b",
      bg: "radial-gradient(ellipse 90% 50% at 55% 35%, hsla(168,45%,18%,0.22) 0%, transparent 60%)",
    },
    {
      cls: "ambient-blob-c",
      bg: "radial-gradient(ellipse 70% 40% at 35% 55%, hsla(132,40%,15%,0.18) 0%, transparent 55%)",
    },
  ],
  mist: [
    {
      cls: "ambient-blob-a",
      bg: "radial-gradient(ellipse 100% 60% at 40% 30%, rgba(244,237,224,0.04) 0%, transparent 60%)",
    },
    {
      cls: "ambient-blob-b",
      bg: "radial-gradient(ellipse 80% 50% at 60% 60%, rgba(212,160,23,0.05) 0%, transparent 55%)",
    },
  ],
  campfire: [
    {
      cls: "ambient-campfire-a",
      bg: "radial-gradient(ellipse 80% 70% at 50% 100%, rgba(212,160,23,0.15) 0%, rgba(184,90,62,0.10) 30%, transparent 65%)",
    },
    {
      cls: "ambient-campfire-b",
      bg: "radial-gradient(ellipse 40% 35% at 50% 100%, rgba(212,160,23,0.08) 0%, transparent 50%)",
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * GrainOverlay — static SVG fractal noise layer, no animation
 * ───────────────────────────────────────────────────────────────────────── */

export function GrainOverlay({ opacity = 0.025 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * ScrollReveal — opacity + translateY on IntersectionObserver entry
 * Only opacity + transform: compositor-friendly, no re-paint.
 * ───────────────────────────────────────────────────────────────────────── */

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.willChange = "opacity, transform";
    el.style.transition = `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.willChange = "auto";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
