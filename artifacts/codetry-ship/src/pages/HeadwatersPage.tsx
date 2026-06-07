import { useEffect, useRef, useState } from "react";
import { Redirect } from "wouter";
import WatershedMap from "@/components/WatershedMap";

/* ─────────────────────────────────────────────────────────────────────────────
   The Clearing — ourheadwaters.ca root page
   Full-bleed ambient video + wayfinding + origin story + zone map
───────────────────────────────────────────────────────────────────────────── */

const BASE = import.meta.env.BASE_URL;

const ZONES = [
  {
    id: "0",
    name: "Zone 0 — Saltbox",
    description:
      "The hearth. The home itself. Where decisions are made at the kitchen table and trust is built before it's needed.",
  },
  {
    id: "1",
    name: "Zone 1 — Kitchen Table",
    description:
      "Immediate neighbours and close allies. The people you'd call in a storm. The inner ring of a community-run economy.",
  },
  {
    id: "2",
    name: "Zone 2 — Workbench",
    description:
      "The working neighbourhood. Local producers, traders, and organizers who show up to the workbench and stay.",
  },
  {
    id: "3",
    name: "Zone 3 — Greenhouse",
    description:
      "The wider circle — people and institutions who are ready when called but not yet daily participants.",
  },
  {
    id: "4",
    name: "Zone 4 — Clearing",
    description:
      "Public community gathering. Where the economy becomes visible and newcomers find the door.",
  },
  {
    id: "5",
    name: "Zone 5 — Edge",
    description:
      "Beyond the community's edge. The world outside — where resources come from and where relationships reach.",
  },
  {
    id: "A",
    name: "The Aquifer",
    description:
      "Not a zone but the layer beneath all of them. Identity infrastructure — how the ledger holds, how trust is carried, how the system remembers across time.",
  },
];

const TOOLS = [
  {
    label: "The Arc",
    subtitle: "Headwaters Odyssey",
    description: "A guided journey through Codetry — language, discipline, and constellation practice — that turns into real community infrastructure.",
    href: `${BASE}odyssey`,
    accent: "#b85a3e",
  },
  {
    label: "The Compass",
    subtitle: "Community Orientation",
    description: "Find where you stand in the watershed. The Compass orients you — your zone, your role, your next move.",
    href: `${BASE}compass`,
    accent: "#d4a017",
  },
  {
    label: "The Kits",
    subtitle: "Headwaters Starter Offerings",
    description: "Self-serve tools and packages for communities ready to start building. Begin with a kit, hand it off when it runs.",
    href: `${BASE}headwaters/start`,
    accent: "rgba(56,189,248,0.80)",
  },
];

/* ─── Shared text styles ───────────────────────────────────────────────────── */
const eyebrow: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.34em",
  textTransform: "uppercase",
  color: "rgba(56,189,248,0.55)",
  margin: "0 0 14px",
};

const sectionHeading: React.CSSProperties = {
  fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)",
  fontWeight: 700,
  lineHeight: 1.1,
  color: "#f0e8d8",
  margin: "0 0 16px",
  letterSpacing: "-0.01em",
  fontFamily: "Georgia, serif",
};

const bodyText: React.CSSProperties = {
  fontSize: "clamp(0.95rem, 2.4vw, 1.05rem)",
  lineHeight: 1.75,
  color: "rgba(212,195,168,0.82)",
  fontFamily: "Georgia, serif",
};

const rule: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid rgba(212,195,168,0.08)",
  margin: "0",
};

/* ─── HeadwatersPage ────────────────────────────────────────────────────────── */
export function HeadwatersPage() {
  const [visibleZones, setVisibleZones] = useState<boolean[]>(() =>
    new Array(ZONES.length).fill(false)
  );
  const zoneRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-zone-idx"));
            setVisibleZones((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    zoneRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes hwZoneCardIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    <main
      style={{
        background: "#02040a",
        minHeight: "100vh",
        color: "#d4c3a8",
        fontFamily: "Georgia, serif",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          HERO — full-bleed ambient video background
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Ambient video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={`/headwaters/clearing-poster.jpg`}
          src={`/headwaters/clearing-web.mp4`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.38,
            zIndex: 0,
          }}
        />

        {/* Gradient overlays */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(2,4,10,0.55) 0%, rgba(2,4,10,0.25) 40%, rgba(2,4,10,0.80) 100%)",
            zIndex: 1,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, rgba(2,4,10,0.55) 100%)",
            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 680,
            margin: "0 auto",
            padding: "80px 32px 60px",
            textAlign: "center",
          }}
        >
          <p style={eyebrow}>Headwaters · Northwestern Ontario · Treaty 3</p>

          <h1
            style={{
              fontSize: "clamp(2.6rem, 8vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.0,
              color: "#f0e8d8",
              margin: "0 0 20px",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 40px rgba(0,0,0,0.8)",
            }}
          >
            Clearing
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2.8vw, 1.2rem)",
              lineHeight: 1.7,
              color: "rgba(212,195,168,0.72)",
              margin: "0 auto 40px",
              maxWidth: 520,
            }}
          >
            Where a community economy finds its footing. The origin story, the
            watershed map, and the tools — all in one place.
          </p>

          {/* Scroll cue */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4 }}>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, rgba(212,195,168,0.7))" }} />
            <span style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase", color: "#d4c3a8" }}>
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WAYFINDING — Where are you standing today?
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "rgba(10,18,28,0.96)",
          borderTop: "1px solid rgba(56,189,248,0.10)",
          borderBottom: "1px solid rgba(56,189,248,0.10)",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: 740,
            margin: "0 auto",
            padding: "80px 32px",
            width: "100%",
          }}
        >
          <p style={{ ...eyebrow, color: "rgba(56,189,248,0.65)" }}>Find your place</p>
          <h2 style={{ ...sectionHeading, fontSize: "clamp(1.8rem, 5vw, 2.8rem)", marginBottom: 12 }}>
            Where are you standing today?
          </h2>
          <p
            style={{
              fontSize: "clamp(0.95rem, 2.4vw, 1.05rem)",
              lineHeight: 1.7,
              color: "rgba(212,195,168,0.65)",
              margin: "0 0 52px",
              maxWidth: 540,
            }}
          >
            The Compass finds your zone in two questions. The watershed map shows
            where you already are — from your kitchen table out to the horizon.
          </p>

          {/* Map + Compass CTA — side by side on wider screens */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 40,
              alignItems: "start",
              marginBottom: 40,
            }}
          >
            {/* Watershed Map */}
            <div>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase" as const,
                  color: "rgba(56,189,248,0.45)",
                  margin: "0 0 14px",
                }}
              >
                Watershed Map
              </p>
              <WatershedMap />
            </div>

            {/* Compass CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase" as const,
                  color: "rgba(56,189,248,0.45)",
                  margin: "0 0 14px",
                }}
              >
                Craft your Compass
              </p>

              {/* Dominant CTA card */}
              <a
                href={`${BASE}compass`}
                style={{
                  display: "block",
                  padding: "36px 32px",
                  background: "rgba(212,164,23,0.08)",
                  border: "2px solid rgba(212,164,23,0.45)",
                  borderRadius: 4,
                  textDecoration: "none",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,164,23,0.14)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,164,23,0.7)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,164,23,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,164,23,0.45)";
                }}
              >
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase" as const,
                    color: "rgba(212,164,23,0.70)",
                    margin: "0 0 10px",
                  }}
                >
                  Community Orientation
                </p>
                <h3
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "clamp(1.4rem, 3.5vw, 1.9rem)",
                    fontWeight: 700,
                    color: "#f0e8d8",
                    lineHeight: 1.15,
                    margin: "0 0 12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  The Compass
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "rgba(212,195,168,0.70)",
                    margin: "0 0 28px",
                  }}
                >
                  Two questions. Your zone, your role, your next move — in the
                  watershed and in the community.
                </p>
                <span
                  style={{
                    display: "inline-block",
                    padding: "11px 24px",
                    background: "#d4a017",
                    color: "#02040a",
                    fontFamily: "monospace",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase" as const,
                    borderRadius: 3,
                  }}
                >
                  Craft your Compass →
                </span>
              </a>

              {/* Secondary tools */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <a
                  href={`${BASE}odyssey`}
                  style={{
                    display: "block",
                    padding: "18px 20px",
                    background: "rgba(184,90,62,0.07)",
                    border: "1px solid rgba(184,90,62,0.25)",
                    borderRadius: 4,
                    textDecoration: "none",
                    transition: "background 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(184,90,62,0.13)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(184,90,62,0.07)";
                  }}
                >
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase" as const,
                      color: "rgba(184,90,62,0.65)",
                      margin: "0 0 6px",
                    }}
                  >
                    The Arc
                  </p>
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#f0e8d8",
                      margin: "0 0 5px",
                      lineHeight: 1.2,
                    }}
                  >
                    Headwaters Odyssey
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(212,195,168,0.55)", margin: 0, lineHeight: 1.5 }}>
                    A guided journey through language, discipline, and practice.
                  </p>
                </a>

                <a
                  href={`${BASE}headwaters/start`}
                  style={{
                    display: "block",
                    padding: "18px 20px",
                    background: "rgba(56,189,248,0.05)",
                    border: "1px solid rgba(56,189,248,0.18)",
                    borderRadius: 4,
                    textDecoration: "none",
                    transition: "background 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(56,189,248,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(56,189,248,0.05)";
                  }}
                >
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase" as const,
                      color: "rgba(56,189,248,0.50)",
                      margin: "0 0 6px",
                    }}
                  >
                    The Kits
                  </p>
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#f0e8d8",
                      margin: "0 0 5px",
                      lineHeight: 1.2,
                    }}
                  >
                    Starter Offerings
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(212,195,168,0.55)", margin: 0, lineHeight: 1.5 }}>
                    Self-serve tools for communities ready to start building.
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ORIGIN STORY
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 740,
          margin: "0 auto",
          padding: "96px 32px",
          width: "100%",
        }}
      >
        <p style={eyebrow}>Origin Story</p>
        <h2 style={sectionHeading}>How Headwaters came to be</h2>
        <hr style={rule} />

        {/* Chapter 1 — Doom Crowd */}
        <div style={{ paddingTop: 40, marginBottom: 52 }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.42)",
              marginBottom: 12,
            }}
          >
            Chapter I
          </p>
          <h3
            style={{
              fontSize: "clamp(1.15rem, 3vw, 1.45rem)",
              fontWeight: 700,
              color: "#f0e8d8",
              marginBottom: 16,
              letterSpacing: "-0.01em",
            }}
          >
            The Doom Crowd
          </h3>
          <p style={{ ...bodyText, marginBottom: 16 }}>
            It started in the forums — prepper forums, collapse prep communities, permaculture lists.
            A period of genuine alarm. What do you do when you believe the systems holding everything
            together are going to fail? You start learning to grow food. You start learning your
            neighbours' names. You start thinking about what resilience actually looks like when
            the grid goes down.
          </p>
          <p style={{ ...bodyText, marginBottom: 0 }}>
            The early Headwaters instinct came from that place: not paranoia, but preparation.
            Build the systems you want to exist before you need them. Don't wait for crisis.
            Let the crisis be the teacher, not the architect.
          </p>
        </div>

        <hr style={rule} />

        {/* Chapter 2 — Ron Paul Pivot */}
        <div style={{ paddingTop: 40, marginBottom: 52 }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.42)",
              marginBottom: 12,
            }}
          >
            Chapter II
          </p>
          <h3
            style={{
              fontSize: "clamp(1.15rem, 3vw, 1.45rem)",
              fontWeight: 700,
              color: "#f0e8d8",
              marginBottom: 16,
              letterSpacing: "-0.01em",
            }}
          >
            The Ron Paul Pivot
          </h3>
          <p style={{ ...bodyText, marginBottom: 16 }}>
            The doom crowd had a libertarian current running through it — sound money, hard
            money, get-out-of-the-system thinking. For a moment that current pulled hard.
            The appeal was real: distrust of institutions, distrust of centralized control,
            the idea that community self-determination could be built outside of captured systems.
          </p>
          <p style={{ ...bodyText, marginBottom: 16 }}>
            But the Ron Paul moment broke on the same reef it always does: it had no theory
            of community. No account of how people with different capacities build something
            together. It was an ideology of exit, not of construction.
          </p>
          <p style={{ ...bodyText, marginBottom: 0 }}>
            The Headwaters turn came from recognizing that the <em>critique</em> of centralized
            systems was right, but the answer wasn't individual exit — it was community infrastructure.
            You don't leave the watershed. You learn to steward it.
          </p>
        </div>

        <hr style={rule} />

        {/* Chapter 3 — Kitchen Table */}
        <div style={{ paddingTop: 40 }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.42)",
              marginBottom: 12,
            }}
          >
            Chapter III
          </p>
          <h3
            style={{
              fontSize: "clamp(1.15rem, 3vw, 1.45rem)",
              fontWeight: 700,
              color: "#f0e8d8",
              marginBottom: 16,
              letterSpacing: "-0.01em",
            }}
          >
            The Kitchen Table
          </h3>
          <p style={{ ...bodyText, marginBottom: 16 }}>
            The real beginning wasn't a forum. It was a kitchen table in Northwestern Ontario.
            Actual conversations between people who live here, who work here, who are trying
            to figure out how their community runs its own food and its own economy without
            waiting for someone from outside to come fix it.
          </p>
          <p style={{ ...bodyText, marginBottom: 16 }}>
            Headwaters is named for that moment: income enters at the practitioner's headwaters
            and flows downstream in order — costs, reserve, reinvestment, community overflow.
            Nothing moves until the bucket above it is full. Not a theory. A machine already running.
          </p>
          <p style={{ ...bodyText, marginBottom: 0 }}>
            The community is the watershed. Six zones, one neighbourhood, all of it connected.
            Water flows from the hearth outward — and back again.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ZONE MAP
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "rgba(56,189,248,0.02)",
          borderTop: "1px solid rgba(56,189,248,0.06)",
          borderBottom: "1px solid rgba(56,189,248,0.06)",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 100%, rgba(13,148,136,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 740,
            margin: "0 auto",
            padding: "96px 32px",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p style={eyebrow}>Watershed Map</p>
          <h2 style={sectionHeading}>The Six Zones + The Aquifer</h2>
          <p
            style={{
              ...bodyText,
              marginBottom: 56,
              maxWidth: 540,
              color: "rgba(212,195,168,0.62)",
            }}
          >
            The community is a watershed. Six zones of proximity and trust, and one
            layer of identity infrastructure running beneath them all.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {ZONES.map((z, i) => {
              const isAquifer = z.id === "A";
              const colors = [
                "234, 88, 12", // 0: Hearth (Warm Orange)
                "217, 119, 6", // 1: Lodge (Amber)
                "202, 138, 4", // 2: Bench (Yellow)
                "101, 163, 13", // 3: Standby (Olive)
                "14, 165, 233", // 4: Hall (Sky)
                "59, 130, 246", // 5: Wild (Blue)
                "13, 148, 136", // A: Aquifer (Teal)
              ];
              const baseColor = colors[i] || "255, 255, 255";
              const href = isAquifer ? `${BASE}map#zone-aquifer` : `${BASE}map#zone-${z.id}`;

              const isVisible = visibleZones[i];
              const staggerDelay = `${i * 90}ms`;

              return (
                <a
                  key={z.id}
                  href={href}
                  ref={(el) => { zoneRefs.current[i] = el; }}
                  data-zone-idx={i}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    background: isAquifer 
                      ? "radial-gradient(ellipse at 50% 0%, rgba(13,148,136,0.12) 0%, rgba(0,0,0,0) 80%), rgba(255,255,255,0.01)" 
                      : `linear-gradient(90deg, rgba(${baseColor}, 0.06) 0%, rgba(0,0,0,0) 100%)`,
                    border: `1px solid rgba(${baseColor}, 0.1)`,
                    borderRadius: isAquifer ? 12 : 2,
                    borderLeft: isAquifer ? `1px solid rgba(${baseColor}, 0.1)` : `3px solid rgba(${baseColor}, 0.5)`,
                    padding: "28px 32px",
                    overflow: "hidden",
                    cursor: "pointer",
                    opacity: isVisible ? undefined : 0,
                    animation: isVisible
                      ? `hwZoneCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay} both`
                      : undefined,
                    transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(6px)";
                    e.currentTarget.style.background = isAquifer 
                      ? "radial-gradient(ellipse at 50% 0%, rgba(13,148,136,0.2) 0%, rgba(0,0,0,0) 80%), rgba(255,255,255,0.03)" 
                      : `linear-gradient(90deg, rgba(${baseColor}, 0.12) 0%, rgba(0,0,0,0) 100%)`;
                    e.currentTarget.style.borderColor = `rgba(${baseColor}, 0.25)`;
                    if (!isAquifer) {
                      e.currentTarget.style.borderLeft = `3px solid rgba(${baseColor}, 0.8)`;
                    }
                    const arrow = e.currentTarget.querySelector('.zone-arrow') as HTMLElement;
                    if (arrow) arrow.style.transform = "translateX(4px)";
                    const num = e.currentTarget.querySelector('.zone-num') as HTMLElement;
                    if (num) {
                      num.style.background = `rgba(${baseColor}, 0.15)`;
                      num.style.borderColor = `rgba(${baseColor}, 0.4)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.background = isAquifer 
                      ? "radial-gradient(ellipse at 50% 0%, rgba(13,148,136,0.12) 0%, rgba(0,0,0,0) 80%), rgba(255,255,255,0.01)" 
                      : `linear-gradient(90deg, rgba(${baseColor}, 0.06) 0%, rgba(0,0,0,0) 100%)`;
                    e.currentTarget.style.borderColor = `rgba(${baseColor}, 0.1)`;
                    if (!isAquifer) {
                      e.currentTarget.style.borderLeft = `3px solid rgba(${baseColor}, 0.5)`;
                    }
                    const arrow = e.currentTarget.querySelector('.zone-arrow') as HTMLElement;
                    if (arrow) arrow.style.transform = "translateX(0)";
                    const num = e.currentTarget.querySelector('.zone-num') as HTMLElement;
                    if (num) {
                      num.style.background = `rgba(${baseColor}, 0.06)`;
                      num.style.borderColor = `rgba(${baseColor}, 0.15)`;
                    }
                  }}
                >
                  <div 
                    className="zone-num"
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: `rgba(${baseColor}, 0.06)`,
                      border: `1px solid rgba(${baseColor}, 0.15)`,
                      color: `rgba(${baseColor}, 0.9)`,
                      fontFamily: "monospace",
                      fontSize: isAquifer ? 24 : 18,
                      fontWeight: 700,
                      marginRight: 24,
                      flexShrink: 0,
                      transition: "all 0.3s ease",
                      boxShadow: `0 0 20px rgba(${baseColor}, 0.1) inset`
                    }}>
                    {isAquifer ? "∿" : z.id}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                      <h3 style={{
                        fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)",
                        fontWeight: 700,
                        color: "#f0e8d8",
                        margin: 0,
                        letterSpacing: "-0.01em",
                        fontFamily: "Georgia, serif"
                      }}>
                        {z.name}
                      </h3>
                    </div>
                    <p style={{
                      fontSize: "clamp(0.9rem, 2vw, 0.95rem)",
                      lineHeight: 1.6,
                      color: "rgba(212,195,168,0.65)",
                      margin: 0,
                      fontFamily: "Georgia, serif"
                    }}>
                      {z.description}
                    </p>
                  </div>

                  <div 
                    className="zone-arrow"
                    style={{ 
                      marginLeft: 20,
                      color: `rgba(${baseColor}, 0.6)`,
                      fontFamily: "monospace",
                      fontSize: 20,
                      transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    →
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TOOL ENTRY POINTS
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 740,
          margin: "0 auto",
          padding: "96px 32px",
          width: "100%",
        }}
      >
        <p style={eyebrow}>Entry Points</p>
        <h2 style={sectionHeading}>The tools of the watershed</h2>
        <p
          style={{
            ...bodyText,
            marginBottom: 56,
            maxWidth: 520,
            color: "rgba(212,195,168,0.62)",
          }}
        >
          Three ways in. Each one built for a different kind of readiness.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {TOOLS.map((tool) => (
            <a
              key={tool.label}
              href={tool.href}
              style={{
                display: "block",
                padding: "32px 36px",
                background: "rgba(212,195,168,0.03)",
                border: "1px solid rgba(212,195,168,0.08)",
                borderLeft: `3px solid ${tool.accent}`,
                textDecoration: "none",
                transition: "background 0.18s, border-color 0.18s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,195,168,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,195,168,0.03)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                    fontWeight: 700,
                    color: "#f0e8d8",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {tool.label}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: tool.accent,
                  }}
                >
                  {tool.subtitle}
                </span>
              </div>
              <p
                style={{
                  fontSize: "clamp(0.875rem, 2vw, 0.95rem)",
                  lineHeight: 1.65,
                  color: "rgba(212,195,168,0.60)",
                  margin: "0 0 14px",
                }}
              >
                {tool.description}
              </p>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(212,195,168,0.32)",
                }}
              >
                Enter →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: "1px solid rgba(212,195,168,0.07)",
          padding: "32px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          maxWidth: 740,
          margin: "0 auto",
          width: "100%",
          paddingBottom: 56,
        }}
      >
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(212,195,168,0.22)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          ourheadwaters.ca · Clearing · Northwestern Ontario · Treaty 3
        </p>
        <a
          href={`${BASE}home`}
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(212,195,168,0.32)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(212,195,168,0.12)",
            paddingBottom: 1,
          }}
        >
          Crew intake →
        </a>
      </footer>
    </main>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HeadwatersRedirect — used when /headwaters is hit directly
   Redirects to / so The Clearing is always at the root
───────────────────────────────────────────────────────────────────────────── */
export function HeadwatersRedirect() {
  return <Redirect to="/" />;
}
