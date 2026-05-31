export function HeadwatersPage() {
  const BASE = import.meta.env.BASE_URL;

  return (
    <main
      style={{
        background: "#02040a",
        minHeight: "100vh",
        color: "#d4c3a8",
        fontFamily: "Georgia, serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(56,189,248,0.12)",
          padding: "48px 0 36px",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.55)",
              marginBottom: 14,
            }}
          >
            Headwaters
          </p>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#f0e8d8",
              margin: "0 0 12px",
              letterSpacing: "-0.01em",
            }}
          >
            The Clearing
          </h1>
          <p
            style={{
              fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)",
              lineHeight: 1.7,
              color: "rgba(212,195,168,0.60)",
              margin: 0,
              maxWidth: 560,
            }}
          >
            The origin story behind the system — how Headwaters came to be and
            why a community economy needs a clearing at its centre.
          </p>
        </div>
      </div>

      {/* ── Video ── */}
      <div
        style={{
          flex: 1,
          maxWidth: 800,
          width: "100%",
          margin: "52px auto 0",
          padding: "0 24px 80px",
        }}
      >
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            borderRadius: 8,
            border: "1px solid rgba(56,189,248,0.15)",
            background: "rgba(56,189,248,0.04)",
          }}
        >
          <iframe
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            src="https://www.youtube.com/embed/headwaters-clearing-video"
            title="The Clearing — Headwaters origin story"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* ── Footer nav ── */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(212,195,168,0.08)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: "rgba(212,195,168,0.28)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            ourheadwaters.ca/headwaters/ · The Clearing · Northwestern Ontario · Treaty 3
          </p>
          <a
            href={`${BASE}`}
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(212,195,168,0.38)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(212,195,168,0.14)",
              paddingBottom: 1,
            }}
          >
            ← ourheadwaters.ca
          </a>
        </div>
      </div>
    </main>
  );
}
