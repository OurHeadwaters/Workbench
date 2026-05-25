import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Module, Lesson } from "@/data/courseModules";
import { ModuleIcon } from "@/components/NorthernIcons";

interface LessonViewProps {
  module: Module;
  lesson: Lesson;
}

const MODULE_ACCENTS: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  m1: { dot: "#4a7c5f", bg: "#eef5f0", text: "#2d5a40", border: "#c2d9c7" },
  m2: { dot: "#c97d2e", bg: "#fdf3e3", text: "#7a4a10", border: "#f5e2c0" },
  m3: { dot: "#6fa8c2", bg: "#e8f4f9", text: "#2d5070", border: "#b8d8e8" },
  m4: { dot: "#4a7c5f", bg: "#eef5f0", text: "#1b3a2d", border: "#c2d9c7" },
  m5: { dot: "#c97d2e", bg: "#fdf3e3", text: "#5c3d1e", border: "#f5e2c0" },
  m6: { dot: "#2a8a7a", bg: "#e6f4f2", text: "#1a5048", border: "#a0d4cc" },
};

function YouTubeEmbed({ url }: { url: string }) {
  const videoId = url.includes("v=")
    ? url.split("v=")[1]?.split("&")[0]
    : url.split("/").pop()?.split("?")[0];

  if (!videoId) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        height: 0,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 32,
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--border-light)",
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Course video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
}

export function LessonView({ module, lesson }: LessonViewProps) {
  const accent = MODULE_ACCENTS[module.id] ?? MODULE_ACCENTS["m1"];
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => (e.target as HTMLElement).classList.add("visible"), i * 70);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [lesson.id]);

  return (
    <article
      ref={articleRef}
      style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 48px" }}
    >
      {/* Module breadcrumb badge */}
      <div className="reveal" style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 10px 5px 7px",
            borderRadius: 8,
            backgroundColor: accent.bg,
            border: `1px solid ${accent.border}`,
          }}
        >
          <ModuleIcon moduleId={module.id} size={14} color={accent.dot} />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: accent.text }}>
            {module.title}
          </span>
        </div>
      </div>

      {/* Lesson title */}
      <h1
        className="reveal"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
          fontWeight: 700,
          color: "var(--forest)",
          lineHeight: 1.2,
          marginBottom: 24,
          letterSpacing: "-0.01em",
        }}
      >
        {lesson.title}
      </h1>

      {/* Stitched divider */}
      <div className="reveal journal-divider" style={{ marginBottom: 28 }} aria-hidden="true" />

      {/* Video */}
      {lesson.videoUrl && (
        <div className="reveal">
          <YouTubeEmbed url={lesson.videoUrl} />
        </div>
      )}

      {/* Hero image */}
      {lesson.heroImage && (
        <div
          className="reveal"
          style={{
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 32,
            boxShadow: "var(--shadow-card)",
            border: `1px solid ${accent.border}`,
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}${lesson.heroImage}`}
            alt=""
            style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 340 }}
          />
        </div>
      )}

      {/* Body content */}
      <div className="reveal prose-course">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--forest)", fontSize: "1.35rem", fontWeight: 700, marginTop: "1.75em", marginBottom: "0.5em" }}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontFamily: "var(--font-serif)", color: "var(--forest)", fontSize: "1.1rem", fontWeight: 600, marginTop: "1.5em", marginBottom: "0.4em" }}>
                {children}
              </h3>
            ),
            blockquote: ({ children }) => (
              <blockquote
                style={{
                  borderLeft: `3px solid ${accent.dot}`,
                  padding: "12px 18px",
                  backgroundColor: accent.bg,
                  borderRadius: "0 10px 10px 0",
                  color: accent.text,
                  fontStyle: "italic",
                  margin: "1.75em 0",
                  fontFamily: "var(--font-lora)",
                }}
              >
                {children}
              </blockquote>
            ),
            hr: () => (
              <hr
                style={{
                  border: "none",
                  height: 1,
                  background: "repeating-linear-gradient(90deg, transparent, transparent 4px, var(--border) 4px, var(--border) 8px)",
                  margin: "2em 0",
                }}
                aria-hidden="true"
              />
            ),
            table: ({ children }) => (
              <div style={{ overflowX: "auto", margin: "1.5em 0", borderRadius: 12, border: "1px solid var(--border-light)", boxShadow: "var(--shadow-card)" }}>
                <table style={{ minWidth: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead style={{ backgroundColor: accent.bg }}>
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: accent.text,
                  borderBottom: `1px solid ${accent.border}`,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td
                style={{
                  padding: "9px 14px",
                  borderBottom: "1px solid var(--border-light)",
                  color: "var(--ink)",
                  fontFamily: "var(--font-lora)",
                  verticalAlign: "top",
                }}
              >
                {children}
              </td>
            ),
            strong: ({ children }) => (
              <strong style={{ fontWeight: 700, color: "var(--forest)" }}>{children}</strong>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--amber)", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul style={{ paddingLeft: "1.4em", marginBottom: "1em" }}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol style={{ paddingLeft: "1.4em", marginBottom: "1em" }}>{children}</ol>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: "0.4em", lineHeight: 1.75 }}>{children}</li>
            ),
          }}
        >
          {lesson.body}
        </ReactMarkdown>
      </div>

      {/* Bottom journal flourish */}
      <div aria-hidden="true" style={{ marginTop: 40, opacity: 0.15 }}>
        <svg width="100%" height="24" viewBox="0 0 600 24" fill="none" preserveAspectRatio="none">
          <path d="M0 16 Q75 8 150 16 Q225 22 300 12 Q375 4 450 14 Q525 22 600 14" stroke="var(--forest)" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
    </article>
  );
}
