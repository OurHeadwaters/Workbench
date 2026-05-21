import { useEffect, useRef } from "react";
import { Lock } from "lucide-react";
import { courseModules } from "@/data/courseModules";
import { ModuleIcon } from "@/components/NorthernIcons";
import { RavenCompanion } from "@/components/RavenCompanion";

interface LockedPreviewProps {
  onSignIn: () => void;
}

const MODULE_ACCENTS: Record<string, { bg: string; text: string; border: string }> = {
  m1: { bg: "#eef5f0", text: "#2d5a40", border: "#c2d9c7" },
  m2: { bg: "#fdf3e3", text: "#7a4a10", border: "#f5e2c0" },
  m3: { bg: "#e8f4f9", text: "#2d5070", border: "#b8d8e8" },
  m4: { bg: "#eef5f0", text: "#1b3a2d", border: "#c2d9c7" },
  m5: { bg: "#fdf3e3", text: "#5c3d1e", border: "#f5e2c0" },
};

function MistLayer() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <svg
        style={{ position: "absolute", top: "5%", left: "-5%", width: "60%", opacity: 0.12, animation: "mistFloat 18s ease-in-out infinite" }}
        viewBox="0 0 400 200" fill="none"
      >
        <ellipse cx="200" cy="100" rx="200" ry="80" fill="var(--ice)" />
      </svg>
      <svg
        style={{ position: "absolute", bottom: "10%", right: "-8%", width: "55%", opacity: 0.09, animation: "mistFloat2 22s ease-in-out infinite" }}
        viewBox="0 0 400 180" fill="none"
      >
        <ellipse cx="200" cy="90" rx="200" ry="70" fill="var(--moss)" />
      </svg>
      <svg
        style={{ position: "absolute", top: "30%", right: "10%", width: "35%", opacity: 0.07, animation: "mistFloat 28s ease-in-out infinite reverse" }}
        viewBox="0 0 300 140" fill="none"
      >
        <ellipse cx="150" cy="70" rx="150" ry="55" fill="var(--amber)" />
      </svg>
      {/* Horizon line */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--ice) 30%, var(--moss) 70%, transparent)", opacity: 0.3 }} />
    </div>
  );
}

export function LockedPreview({ onSignIn }: LockedPreviewProps) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => (e.target as HTMLElement).classList.add("visible"), i * 60);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{ minHeight: "100dvh", backgroundColor: "var(--cream)", fontFamily: "var(--font-sans)" }}
      ref={revealRef}
    >
      {/* ─── Header ─── */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "14px 20px",
          backgroundColor: "var(--parchment)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 19.5 C4 18.1 5.1 17 6.5 17 L20 17" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M6.5 2 L20 2 L20 22 L6.5 22 C5.1 22 4 20.9 4 19.5 L4 4.5 C4 3.1 5.1 2 6.5 2Z" stroke="var(--forest)" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M8 7 L16 7 M8 11 L14 11" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "1.05rem", color: "var(--forest)" }}>
              Field Guide Finance
            </span>
          </div>
          <button
            onClick={onSignIn}
            className="trail-sign-btn"
            style={{
              backgroundColor: "var(--forest)",
              color: "var(--cream)",
              padding: "8px 18px",
              fontSize: "0.82rem",
            }}
          >
            Sign in
          </button>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg, var(--forest) 0%, #2d5a40 55%, #1a4535 100%)",
          minHeight: 440,
          display: "flex",
          alignItems: "center",
        }}
      >
        <MistLayer />

        {/* Paper texture */}
        <div
          aria-hidden="true"
          className="texture-paper"
          style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }}
        />

        {/* Northern grid lines (map feel) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(var(--ice) 1px, transparent 1px), linear-gradient(90deg, var(--ice) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.04,
          }}
        />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "56px 24px 64px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <span
              className="stamp"
              style={{ backgroundColor: "rgba(168,200,216,0.2)", color: "var(--ice)", border: "1px solid rgba(168,200,216,0.35)" }}
            >
              <Lock size={10} />
              807 Benefits Premium
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              fontWeight: 700,
              color: "var(--cream)",
              lineHeight: 1.15,
              maxWidth: 620,
              marginBottom: 20,
              letterSpacing: "-0.01em",
            }}
          >
            A Field Guide to Financing<br />
            <em style={{ color: "var(--amber-mid)", fontStyle: "italic" }}>your food business</em>
          </h1>

          <p
            style={{
              color: "rgba(244,237,224,0.82)",
              fontFamily: "var(--font-lora)",
              fontSize: "1.05rem",
              lineHeight: 1.75,
              maxWidth: 540,
              marginBottom: 32,
            }}
          >
            Practical financial literacy for food entrepreneurs and co-op members in Northwestern Ontario —
            written from the field, with Bobbie Parr's Parrs Jars story as the anchor.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={onSignIn}
              className="trail-sign-btn"
              style={{
                backgroundColor: "var(--amber)",
                color: "white",
                padding: "13px 28px",
                fontSize: "0.95rem",
              }}
            >
              Begin the trail
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M2 7 L12 7 M8 3 L12 7 L8 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <RavenCompanion delay={1200} />
          </div>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: 28, marginTop: 40, flexWrap: "wrap" }}>
            {[
              { val: "5", label: "Modules" },
              { val: "10", label: "Lessons" },
              { val: "NWO", label: "Focused" },
            ].map(({ val, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--amber-mid)" }}>
                  {val}
                </span>
                <span style={{ fontSize: "0.72rem", color: "rgba(244,237,224,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to bottom, transparent, var(--cream))",
          }}
        />
      </section>

      {/* ─── Body ─── */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>

          {/* What's inside */}
          <div className="reveal">
            <p className="section-label" style={{ marginBottom: 20 }}>Trail Map — What's Inside</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {courseModules.map((mod, i) => {
                const accent = MODULE_ACCENTS[mod.id] ?? MODULE_ACCENTS["m1"];
                const isFirst = i === 0;
                return (
                  <div
                    key={mod.id}
                    className={`trail-marker reveal`}
                    style={{
                      borderRadius: 14,
                      border: `1px solid ${isFirst ? accent.border : "var(--border-light)"}`,
                      backgroundColor: isFirst ? accent.bg : "var(--parchment)",
                      padding: "18px 18px 16px",
                      position: "relative",
                      opacity: !isFirst ? 0.7 : 1,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    {!isFirst && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          color: "var(--bark-light)",
                          opacity: 0.5,
                        }}
                        aria-hidden="true"
                      >
                        <Lock size={13} />
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: isFirst ? accent.border : "var(--cream-dark)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <ModuleIcon
                          moduleId={mod.id}
                          size={22}
                          color={isFirst ? accent.text : "var(--bark-light)"}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <span
                            style={{
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: isFirst ? accent.text : "var(--bark-light)",
                              opacity: 0.7,
                            }}
                          >
                            Module {i + 1}
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontWeight: 600,
                            fontSize: "0.92rem",
                            color: isFirst ? accent.text : "var(--bark)",
                            lineHeight: 1.3,
                            marginBottom: isFirst ? 6 : 0,
                          }}
                        >
                          {mod.title}
                        </p>
                        {isFirst && (
                          <p style={{ fontSize: "0.78rem", color: "var(--bark)", lineHeight: 1.55, marginBottom: 6 }}>
                            {mod.description}
                          </p>
                        )}
                        <p style={{ fontSize: "0.72rem", color: "var(--bark-light)", letterSpacing: "0.03em" }}>
                          {mod.lessons.length} lesson{mod.lessons.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA / video card */}
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
            <div
              style={{
                borderRadius: 18,
                border: "1px solid var(--border)",
                backgroundColor: "var(--parchment)",
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Video thumbnail */}
              <div style={{ position: "relative", paddingBottom: "52%", backgroundColor: "var(--forest)" }}>
                <img
                  src="https://img.youtube.com/vi/XWsaayAuH-Q/hqdefault.jpg"
                  alt="807 Grows — Bobbie Parr / Parrs Jars"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(27,58,45,0.65) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      backgroundColor: "rgba(244,237,224,0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path d="M5 3 L15 9 L5 15Z" fill="var(--forest)" />
                    </svg>
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                  <p style={{ color: "rgba(244,237,224,0.75)", fontSize: "0.68rem", marginBottom: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>Featured · Module 1</p>
                  <p style={{ fontFamily: "var(--font-serif)", color: "var(--cream)", fontSize: "0.92rem", fontWeight: 600 }}>
                    807 Grows — Bobbie Parr &amp; Parrs Jars
                  </p>
                </div>
              </div>

              <div style={{ padding: "24px 24px 28px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--forest)", fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
                  Your story is the business case
                </h2>
                <p style={{ fontSize: "0.86rem", color: "var(--bark)", lineHeight: 1.65, marginBottom: 24, fontFamily: "var(--font-lora)" }}>
                  Available to <strong>Harvest household</strong> and <strong>Pro producer</strong> members of 807 Benefits.
                  Sign in to unlock all five modules and start where your business is right now.
                </p>

                <button
                  onClick={onSignIn}
                  className="trail-sign-btn"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    backgroundColor: "var(--forest)",
                    color: "var(--cream)",
                    padding: "13px 20px",
                    fontSize: "0.9rem",
                    marginBottom: 10,
                  }}
                >
                  <span>Sign in to start learning</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7 L12 7 M8 3 L12 7 L8 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <p style={{ fontSize: "0.72rem", textAlign: "center", color: "var(--bark-light)" }}>
                  Member of 807 Benefits? Your access is already included.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
