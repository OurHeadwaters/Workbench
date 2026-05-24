import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function HubPage() {
  const [, navigate] = useLocation();

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--cream)",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "20px 24px 0",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="var(--forest)" strokeWidth="1.8" strokeLinejoin="round"/>
          <polyline points="9 22 9 12 15 12 15 22" stroke="var(--forest)" strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "var(--forest)" }}>
          Headwaters Learning
        </span>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: 780,
          margin: "0 auto",
          padding: "48px 24px 64px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--moss)",
              margin: 0,
            }}
          >
            Zone 1 · The Spring · Daily Tools
          </p>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--amber)",
              backgroundColor: "rgba(212,160,23,0.10)",
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            Permaculture
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            color: "var(--forest)",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Headwaters Learning
        </h1>
        <p
          style={{
            fontFamily: "var(--font-lora)",
            fontSize: "1.05rem",
            color: "var(--bark)",
            lineHeight: 1.75,
            maxWidth: 560,
            marginBottom: 36,
          }}
        >
          Two field guides. One for building a food economy. One for understanding the architecture beneath digital sovereignty. Both grounded in the same preparedness logic.
        </p>

        {/* Practical on mobile? tester prompt */}
        <div
          style={{
            marginBottom: 32,
            padding: "14px 18px",
            borderRadius: 10,
            border: "1px solid rgba(212,160,23,0.28)",
            backgroundColor: "rgba(212,160,23,0.05)",
            maxWidth: 540,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <span style={{ fontSize: "1.1rem", lineHeight: 1, paddingTop: 2 }}>📱</span>
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--amber)",
                marginBottom: 4,
              }}
            >
              Practical on mobile?
            </p>
            <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.88rem", color: "var(--bark)", lineHeight: 1.6, margin: 0 }}>
              Key concepts read fine on a phone. For the hands-on build sections, a wider screen helps — but start wherever you are. One lesson is enough to find out if it fits.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          <CourseCard
            badge="Field Guide"
            title="Field Guide Finance"
            subtitle="Northwestern Ontario Food Economy"
            description="Built around Bobbie Parr's journey with Parrs Jars. Plain-language financial guidance for NWO food entrepreneurs — proof before pitch, community capital, and sustainable structure."
            practicalTakeaway="Run your costs against a real harvest before you pitch to anyone. One honest number is worth ten projections."
            cta="Enter the Guide"
            accent="var(--forest)"
            accentLight="var(--moss-light)"
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M4 19.5 C4 18.1 5.1 17 6.5 17 L20 17" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M6.5 2 L20 2 L20 22 L6.5 22 C5.1 22 4 20.9 4 19.5 L4 4.5 C4 3.1 5.1 2 6.5 2Z" stroke="var(--forest)" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M8 7 L16 7 M8 11 L14 11" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
            onClick={() => navigate("/finance")}
            locked={false}
          />

          <CourseCard
            badge="The Forge"
            title="Crypto Castle"
            subtitle="Blockchain Architecture as Preparedness"
            description="Build systems from elemental primitives — Fire, Water, Earth, Air, Aether. Each maps to a Jack Spirko preparedness pillar. Survive The Reckoning. Name what you built with Codetry."
            practicalTakeaway="Name what you built at the end of each module. If you can't name it, you don't own it yet."
            cta="Enter The Forge"
            accent="#FF6B2B"
            accentLight="rgba(255,107,43,0.12)"
            icon={
              <span style={{ fontSize: 28 }}>⚒</span>
            }
            onClick={() => navigate("/forge")}
            locked={false}
          />
        </div>

        <div
          style={{
            marginTop: 56,
            padding: "20px 24px",
            borderRadius: 12,
            border: "1px solid var(--border-light)",
            backgroundColor: "var(--parchment)",
            maxWidth: 560,
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--moss)",
              marginBottom: 6,
            }}
          >
            Headwaters Principle
          </p>
          <p
            style={{
              fontFamily: "var(--font-lora)",
              fontSize: "0.92rem",
              color: "var(--bark)",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            "Sovereignty is not a product you buy. It is a set of skills you build, a set of relationships you cultivate, and a set of systems you understand well enough to repair."
          </p>
        </div>
      </main>
    </div>
  );
}

function CourseCard({
  badge,
  title,
  subtitle,
  description,
  practicalTakeaway,
  cta,
  accent,
  accentLight,
  icon,
  onClick,
  locked,
}: {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  practicalTakeaway?: string;
  cta: string;
  accent: string;
  accentLight: string;
  icon: React.ReactNode;
  onClick: () => void;
  locked: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid var(--border-light)",
        backgroundColor: "var(--parchment)",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 2px 12px rgba(27,58,45,0.06)",
        cursor: locked ? "default" : "pointer",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
      }}
      onClick={locked ? undefined : onClick}
      onMouseEnter={(e) => {
        if (!locked) {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(27,58,45,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(27,58,45,0.06)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            backgroundColor: accentLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: accent,
            backgroundColor: accentLight,
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          {badge}
        </span>
      </div>

      <div>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--forest)",
            marginBottom: 4,
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: "0.78rem", color: "var(--moss)", fontWeight: 600, marginBottom: 10 }}>
          {subtitle}
        </p>
        <p style={{ fontSize: "0.9rem", color: "var(--bark)", lineHeight: 1.65 }}>
          {description}
        </p>
        {practicalTakeaway && (
          <div
            style={{
              marginTop: 2,
              padding: "10px 12px",
              borderRadius: 8,
              backgroundColor: "rgba(27,58,45,0.05)",
              borderLeft: `3px solid ${accent}`,
            }}
          >
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--moss)", marginBottom: 3 }}>
              Practical takeaway
            </p>
            <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.85rem", color: "var(--bark)", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
              {practicalTakeaway}
            </p>
          </div>
        )}
      </div>

      <button
        style={{
          marginTop: "auto",
          padding: "10px 18px",
          borderRadius: 10,
          border: "none",
          backgroundColor: accent,
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.88rem",
          cursor: locked ? "default" : "pointer",
          opacity: locked ? 0.5 : 1,
          alignSelf: "flex-start",
          transition: "opacity 0.15s",
          fontFamily: "var(--font-sans)",
        }}
      >
        {locked ? "Coming soon" : cta} →
      </button>
    </div>
  );
}
