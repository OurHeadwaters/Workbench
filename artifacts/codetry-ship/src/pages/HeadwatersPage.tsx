import { useEffect, useRef, useState } from "react";
import { Redirect } from "wouter";

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
    name: "Zone 4 — The Clearing",
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
    label: "The Legend",
    subtitle: "Zone Key",
    description: "The key to the six zones. Find where you stand in the watershed — your zone, your role, your next move.",
    href: `${BASE}legend`,
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener("canplay", attemptPlay);
    attemptPlay();

    const onTouch = () => {
      attemptPlay();
      document.removeEventListener("touchstart", onTouch);
    };

    if (video.paused) {
      document.addEventListener("touchstart", onTouch, { passive: true });
    }

    return () => {
      video.removeEventListener("canplay", attemptPlay);
      document.removeEventListener("touchstart", onTouch);
    };
  }, []);

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
          ref={videoRef}
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
            pointerEvents: "none",
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
            Workbench
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
            Where the work gets done. The origin story, the watershed map,
            and the tools — all at one table.
          </p>

          {/* Scroll cue */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4 }}>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, rgba(212,195,168,0.7))" }} />
            <span style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.28em", textTransform: "uppercase", color: "#d4c3a8" }}>
              Scroll
            </span>
          </div>
        </div>

        {/* Workbench silhouette — grounds the hero */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            pointerEvents: "none",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 1200 220"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", maxWidth: 1400, display: "block" }}
            preserveAspectRatio="xMidYMax meet"
          >
            <defs>
              {/* Repeating diamond — beadwork-style pattern for apron */}
              <pattern id="wb-diamond" x="0" y="0" width="24" height="28" patternUnits="userSpaceOnUse">
                <polygon points="12,3 21,9 12,15 3,9" fill="none" stroke="rgba(100,58,14,0.42)" strokeWidth="1.1" />
                <circle cx="12" cy="9" r="1.8" fill="rgba(115,68,20,0.38)" />
              </pattern>
              {/* Sinuous water lines — Headwaters watershed motif */}
              <pattern id="wb-water" x="0" y="0" width="110" height="36" patternUnits="userSpaceOnUse">
                <path d="M0,11 Q27,5 55,11 Q82,17 110,11" fill="none" stroke="rgba(100,58,14,0.22)" strokeWidth="1.1" strokeLinecap="round" />
                <path d="M0,25 Q27,19 55,25 Q82,31 110,25" fill="none" stroke="rgba(100,58,14,0.16)" strokeWidth="1" strokeLinecap="round" />
              </pattern>
              {/* Clip for apron region */}
              <clipPath id="apron-clip">
                <rect x="128" y="76" width="944" height="28" rx="2" />
              </clipPath>
              {/* Clip for surface region */}
              <clipPath id="surface-clip">
                <rect x="112" y="44" width="976" height="36" rx="4" />
              </clipPath>
            </defs>

            {/* ── Back legs ─────────────────────────────────────────────── */}
            <rect x="170" y="70" width="20" height="150" rx="3" fill="rgba(158,126,72,0.88)" />
            <rect x="1010" y="70" width="20" height="150" rx="3" fill="rgba(158,126,72,0.88)" />

            {/* ── Lower shelf ───────────────────────────────────────────── */}
            <rect x="154" y="150" width="892" height="13" rx="3" fill="rgba(172,138,84,0.92)" />
            {/* shelf edge highlight */}
            <rect x="154" y="150" width="892" height="2" rx="1" fill="rgba(210,178,120,0.40)" />

            {/* ── Front legs ────────────────────────────────────────────── */}
            <rect x="140" y="76" width="26" height="144" rx="3" fill="rgba(168,132,78,0.97)" />
            <rect x="1034" y="76" width="26" height="144" rx="3" fill="rgba(168,132,78,0.97)" />
            {/* leg inner face shadow */}
            <rect x="158" y="76" width="8" height="144" rx="2" fill="rgba(120,88,40,0.18)" />
            <rect x="1034" y="76" width="8" height="144" rx="2" fill="rgba(120,88,40,0.18)" />

            {/* ── Bench apron — dark cream base ─────────────────────────── */}
            <rect x="128" y="76" width="944" height="28" rx="2" fill="rgba(182,148,94,0.97)" />
            {/* Diamond bead pattern overlaid */}
            <rect x="128" y="76" width="944" height="28" fill="url(#wb-diamond)" clipPath="url(#apron-clip)" />
            {/* Anishinaabe double-curve: two opposing wave bands */}
            <path
              d="M140,84 Q195,78 250,84 Q305,90 360,84 Q415,78 470,84 Q525,90 580,84 Q635,78 690,84 Q745,90 800,84 Q855,78 910,84 Q965,90 1020,84 Q1058,80 1072,84"
              fill="none" stroke="rgba(100,55,10,0.52)" strokeWidth="1.6" strokeLinecap="round"
            />
            <path
              d="M140,96 Q195,102 250,96 Q305,90 360,96 Q415,102 470,96 Q525,90 580,96 Q635,102 690,96 Q745,90 800,96 Q855,102 910,96 Q965,90 1020,96 Q1058,100 1072,96"
              fill="none" stroke="rgba(100,55,10,0.42)" strokeWidth="1.3" strokeLinecap="round"
            />
            {/* Apron top edge line */}
            <line x1="128" y1="77" x2="1072" y2="77" stroke="rgba(220,188,130,0.45)" strokeWidth="1" />

            {/* ── Work surface — thick top plank, dark cream ────────────── */}
            <rect x="112" y="44" width="976" height="36" rx="4" fill="rgba(196,162,104,0.97)" />
            {/* Water-line pattern on surface */}
            <rect x="112" y="44" width="976" height="36" fill="url(#wb-water)" clipPath="url(#surface-clip)" />
            {/* Surface top highlight edge */}
            <rect x="112" y="44" width="976" height="3" rx="2" fill="rgba(228,198,148,0.55)" />
            {/* Wood grain shadows */}
            <line x1="200" y1="46" x2="200" y2="78" stroke="rgba(110,68,18,0.10)" strokeWidth="1" />
            <line x1="420" y1="46" x2="420" y2="78" stroke="rgba(110,68,18,0.08)" strokeWidth="1" />
            <line x1="640" y1="46" x2="640" y2="78" stroke="rgba(110,68,18,0.09)" strokeWidth="1" />
            <line x1="860" y1="46" x2="860" y2="78" stroke="rgba(110,68,18,0.08)" strokeWidth="1" />

            {/* ── Centre medallion — four-direction mark ────────────────── */}
            <g transform="translate(600,62)">
              <circle cx="0" cy="0" r="9" fill="none" stroke="rgba(100,55,10,0.38)" strokeWidth="1.4" />
              <circle cx="0" cy="0" r="4" fill="none" stroke="rgba(100,55,10,0.32)" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.8" fill="rgba(115,65,15,0.48)" />
              <line x1="-18" y1="0" x2="-10" y2="0" stroke="rgba(100,55,10,0.38)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="10"  y1="0" x2="18"  y2="0" stroke="rgba(100,55,10,0.38)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="-18" x2="0" y2="-10" stroke="rgba(100,55,10,0.38)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="10"  x2="0" y2="18"  stroke="rgba(100,55,10,0.38)" strokeWidth="1.2" strokeLinecap="round" />
            </g>
            {/* Small feather marks left and right of medallion */}
            <path d="M520,58 Q528,54 534,62 Q528,60 520,58Z" fill="rgba(100,55,10,0.28)" />
            <path d="M680,58 Q672,54 666,62 Q672,60 680,58Z" fill="rgba(100,55,10,0.28)" />

            {/* ── Leg vise (left detail) ────────────────────────────────── */}
            <rect x="92" y="58" width="24" height="52" rx="2" fill="rgba(162,126,74,0.95)" />
            <rect x="86" y="72" width="10" height="8" rx="1" fill="rgba(140,108,58,0.97)" />
            {/* vise carved mark */}
            <circle cx="104" cy="84" r="3.5" fill="none" stroke="rgba(100,55,10,0.35)" strokeWidth="1" />

            {/* ── Tool well / back rail ─────────────────────────────────── */}
            <rect x="1068" y="44" width="20" height="36" rx="2" fill="rgba(160,124,72,0.97)" />
          </svg>
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

        {/* Chapter 1 — Kitchen Table */}
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
          ourheadwaters.ca · Workbench · Northwestern Ontario · Treaty 3
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
