import { NeighbourhoodBadge } from "@workspace/zone-store";

const base = import.meta.env.BASE_URL;

/* ── Eagle Mark SVG ──────────────────────────────────────────────────────── */
function EagleMark({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.81)} viewBox="0 18 192 156" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="95" cy="63" r="52" fill="rgba(212,160,23,0.55)" />
      <path d="M 95,62 C 80,56 60,48 38,40 C 24,35 10,32 4,34 C 14,41 34,47 58,57 C 73,63 87,67 95,69 Z" fill="#EDE9E0"/>
      <path d="M 95,62 C 110,56 130,48 152,40 C 166,35 180,32 186,34 C 176,41 156,47 132,57 C 117,63 103,67 95,69 Z" fill="#EDE9E0"/>
      <ellipse cx="95" cy="68" rx="9" ry="8" fill="#EDE9E0"/>
      <ellipse cx="95" cy="53" rx="7" ry="8" fill="#EDE9E0"/>
      <ellipse cx="96" cy="51" rx="5" ry="5.5" fill="#F5F2EC"/>
      <path d="M 101,52 L 110,55 L 101,58 Z" fill="#d4a017"/>
      <path d="M 89,75 L 86,88 M 95,76 L 95,89 M 101,75 L 104,88" stroke="#EDE9E0" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M 7,35 L 1,27 M 15,32 L 10,23 M 24,30 L 20,21" stroke="#EDE9E0" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M 183,35 L 189,27 M 175,32 L 180,23 M 166,30 L 170,21" stroke="#EDE9E0" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M 28,176 L 32,163 L 37,173 L 43,158 L 49,167 L 55,153 L 62,165 L 69,150 L 76,162 L 84,147 L 91,159 L 95,144 L 99,159 L 106,147 L 114,162 L 121,150 L 128,165 L 134,153 L 140,167 L 146,158 L 152,173 L 157,163 L 162,176 Z" fill="#EDE9E0" opacity="0.22"/>
      <path d="M 20,130 Q 95,110 170,130" stroke="rgba(212,160,23,0.6)" strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
    </svg>
  );
}

/* ── Landing wall ────────────────────────────────────────────────────────── */
export default function Index() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: "#1f3d2e",
        backgroundImage: `url("${base}hero-images/eagle-sky-2-2400x900.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
      }}
    >
      {/* Neighbourhood badge — fixed top right */}
      <div style={{ position: "fixed", top: 12, right: 16, zIndex: 50 }}>
        <NeighbourhoodBadge zoneId={2} />
      </div>

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(15,35,24,0.78) 0%, rgba(15,35,24,0.88) 55%, rgba(10,28,18,0.97) 100%)",
        }}
      />

      {/* Topographic texture */}
      <div
        aria-hidden
        className="od-topo-light pointer-events-none absolute inset-0"
        style={{ opacity: 0.14 }}
      />

      {/* Main content — centred vertically */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
        }}
      >
        {/* Eagle mark */}
        <div style={{ marginBottom: "2rem" }}>
          <EagleMark size={156} />
        </div>

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ height: "1px", width: "2.5rem", background: "#d4a017", opacity: 0.55 }} />
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "rgba(212,160,23,0.82)",
              margin: 0,
            }}
          >
            Headwaters Development Services
          </p>
          <div style={{ height: "1px", width: "2.5rem", background: "#d4a017", opacity: 0.55 }} />
        </div>

        {/* Wordmark */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.6rem, 7vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.0,
            color: "#f4ede0",
            margin: "0 0 1rem",
            letterSpacing: "-0.015em",
          }}
        >
          Headwaters
        </h1>

        {/* One-line statement of purpose */}
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            fontStyle: "italic",
            color: "rgba(244,237,224,0.72)",
            margin: "0 0 2rem",
          }}
        >
          Building the economic infrastructure northern communities own and run.
        </p>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.88rem, 1.8vw, 1rem)",
            color: "rgba(244,237,224,0.62)",
            maxWidth: "34rem",
            margin: "0 auto",
            lineHeight: 1.75,
          }}
        >
          Headwaters works alongside First Nations and northern communities to design
          local supply systems, food infrastructure, and cooperative economic engines.
          We bring the strategy, the documents, and the follow-through — so the work
          stays in community hands.
        </p>

        {/* Contact CTA */}
        <div style={{ marginTop: "2.5rem" }}>
          <a
            href="mailto:hello@ourheadwaters.ca"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#f4ede0",
              textDecoration: "none",
              border: "1px solid rgba(212,160,23,0.45)",
              borderRadius: "2px",
              padding: "0.65rem 1.5rem",
              background: "rgba(212,160,23,0.08)",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,160,23,0.18)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.7)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,160,23,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.45)";
            }}
            onFocus={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,160,23,0.18)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.7)";
              (e.currentTarget as HTMLAnchorElement).style.outline = "2px solid rgba(212,160,23,0.6)";
              (e.currentTarget as HTMLAnchorElement).style.outlineOffset = "3px";
            }}
            onBlur={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,160,23,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.45)";
              (e.currentTarget as HTMLAnchorElement).style.outline = "none";
            }}
          >
            <span style={{ color: "rgba(212,160,23,0.8)", fontSize: "0.9rem" }}>✉</span>
            Get in touch
          </a>
        </div>
      </div>

      {/* Navigation section */}
      <div
        style={{
          position: "relative",
          borderTop: "1px solid rgba(212,160,23,0.18)",
          padding: "2rem 1.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.68rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(212,160,23,0.65)",
            textAlign: "center",
            margin: "0 0 1.25rem",
          }}
        >
          Where to go next
        </p>

        {/* Nav cards — stacked on mobile, row on sm+ */}
        <div className="nav-card-grid">
          {/* Primary: Browse all documents */}
          <a
            href={`${base}internal`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "0.85rem 1.1rem",
              minHeight: "56px",
              background: "rgba(212,160,23,0.10)",
              border: "1px solid rgba(212,160,23,0.35)",
              borderRadius: "3px",
              textDecoration: "none",
              transition: "background 0.18s, border-color 0.18s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,160,23,0.18)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.6)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,160,23,0.10)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.35)";
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(244,237,224,0.95)",
                  fontWeight: 600,
                  marginBottom: "0.2rem",
                }}
              >
                Browse all documents
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.78rem",
                  color: "rgba(244,237,224,0.68)",
                  lineHeight: 1.4,
                }}
              >
                Proposals, templates, and internal resources
              </div>
            </div>
            <span style={{ color: "rgba(212,160,23,0.85)", fontSize: "1.1rem", flexShrink: 0 }}>→</span>
          </a>

          {/* How it all connects */}
          <a
            href={`${base}ecosystem-guide`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "0.85rem 1.1rem",
              minHeight: "56px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,160,23,0.18)",
              borderRadius: "3px",
              textDecoration: "none",
              transition: "background 0.18s, border-color 0.18s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,160,23,0.10)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.4)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.18)";
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(244,237,224,0.92)",
                  fontWeight: 500,
                  marginBottom: "0.2rem",
                }}
              >
                How it all connects
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.78rem",
                  color: "rgba(244,237,224,0.62)",
                  lineHeight: 1.4,
                }}
              >
                The Headwaters ecosystem — roles, systems, and the full picture
              </div>
            </div>
            <span style={{ color: "rgba(212,160,23,0.75)", fontSize: "1.1rem", flexShrink: 0 }}>→</span>
          </a>

          {/* Parr's Jars Workshop Kit */}
          <a
            href={`${base}pj-kit`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "0.85rem 1.1rem",
              minHeight: "56px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(212,160,23,0.18)",
              borderRadius: "3px",
              textDecoration: "none",
              transition: "background 0.18s, border-color 0.18s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,160,23,0.10)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.4)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,160,23,0.18)";
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(244,237,224,0.92)",
                  fontWeight: 500,
                  marginBottom: "0.2rem",
                }}
              >
                Parr's Jars Workshop Kit
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.78rem",
                  color: "rgba(244,237,224,0.62)",
                  lineHeight: 1.4,
                }}
              >
                Community canning program — guides, signage, and session materials
              </div>
            </div>
            <span style={{ color: "rgba(212,160,23,0.75)", fontSize: "1.1rem", flexShrink: 0 }}>→</span>
          </a>
        </div>

        {/* Slim footer credit */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a
            href="https://ourheadwaters.ca"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(212,160,23,0.5)",
              textDecoration: "none",
            }}
          >
            ourheadwaters.ca
          </a>
        </div>
      </div>
    </div>
  );
}
