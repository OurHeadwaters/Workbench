import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   WATER CANVAS — gentle flowing particle effect
   ───────────────────────────────────────────────────────────── */
function WaterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = window.innerWidth;
    let H = document.documentElement.scrollHeight;

    const resize = () => {
      W = window.innerWidth;
      H = document.documentElement.scrollHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      life: number; maxLife: number;
    }

    const PALETTE = [
      "rgba(91,143,208,", // deep water blue
      "rgba(94,143,114,", // spruce green
      "rgba(237,232,213,", // birchbark white
      "rgba(200,147,58,", // amber
    ];

    const particles: Particle[] = [];
    const MAX = 120;

    function spawn(): Particle {
      const life = 200 + Math.random() * 400;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.1 - Math.random() * 0.25,
        r: 1 + Math.random() * 2.5,
        alpha: 0,
        life: 0,
        maxLife: life,
      };
    }

    for (let i = 0; i < MAX; i++) {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let t = 0;
    function draw() {
      t++;
      ctx!.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.life++;
        p.x += p.vx + Math.sin(t * 0.007 + p.y * 0.003) * 0.18;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        p.alpha = progress < 0.2
          ? progress / 0.2
          : progress > 0.8
          ? (1 - progress) / 0.2
          : 1;

        const color = PALETTE[Math.floor((p.x / W) * PALETTE.length) % PALETTE.length];
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = color + (p.alpha * 0.22) + ")";
        ctx!.fill();

        if (p.life >= p.maxLife) Object.assign(p, spawn(), { life: 0, alpha: 0 });
      }
      animId = requestAnimationFrame(draw);
    }

    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   PULSE COUNTER — animated number
   ───────────────────────────────────────────────────────────── */
function PulseNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start: number | null = null;
          const duration = 1800;
          function step(ts: number) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setVal(Math.round(ease * target));
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────
   SECTION WRAPPER — fade-in on scroll
   ───────────────────────────────────────────────────────────── */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PERSONA CARD
   ───────────────────────────────────────────────────────────── */
function PersonaCard({
  emoji,
  name,
  arc,
  moments,
  feeling,
  color,
}: {
  emoji: string;
  name: string;
  arc: string;
  moments: string[];
  feeling: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(145deg, ${color}18 0%, ${color}08 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: 20,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}80, ${color}20)`,
          borderRadius: "20px 20px 0 0",
        }}
      />
      <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>{emoji}</div>
      <div>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 800, fontSize: "1.25rem", color: "#ede8d5", marginBottom: "0.25rem" }}>
          {name}
        </div>
        <div style={{ fontSize: "0.875rem", color: "#ede8d580", fontStyle: "italic" }}>{arc}</div>
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {moments.map((m, i) => (
          <li key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.9rem", color: "#ede8d5cc" }}>
            <span style={{ color, marginTop: 2, flexShrink: 0 }}>◆</span>
            {m}
          </li>
        ))}
      </ul>
      <div
        style={{
          marginTop: "auto",
          padding: "0.75rem 1rem",
          background: `${color}12`,
          borderRadius: 10,
          borderLeft: `3px solid ${color}60`,
          fontStyle: "italic",
          fontSize: "0.9rem",
          color: "#ede8d5cc",
        }}
      >
        "{feeling}"
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT TILE
   ───────────────────────────────────────────────────────────── */
function StatTile({
  value,
  label,
  color,
  animated = false,
  target,
  suffix,
}: {
  value?: string;
  label: string;
  color: string;
  animated?: boolean;
  target?: number;
  suffix?: string;
}) {
  return (
    <div
      style={{
        background: `${color}10`,
        border: `1px solid ${color}28`,
        borderRadius: 16,
        padding: "1.5rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontWeight: 800,
          fontSize: "2rem",
          color,
          lineHeight: 1,
        }}
      >
        {animated && target !== undefined ? (
          <PulseNumber target={target} suffix={suffix} />
        ) : (
          value
        )}
      </div>
      <div style={{ fontSize: "0.825rem", color: "#ede8d570", lineHeight: 1.4 }}>
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WATERSHED ICON — simple SVG node-stream illustration
   ───────────────────────────────────────────────────────────── */
function WatershedMap() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 600, margin: "0 auto" }}>
      <svg
        viewBox="0 0 600 300"
        style={{ width: "100%", opacity: 0.85 }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Streams */}
        <path d="M300 20 Q280 80 260 120 Q240 160 220 200 Q200 240 180 280" stroke="#5B8FD060" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M300 20 Q320 80 340 120 Q360 160 380 200 Q400 240 420 280" stroke="#5B8FD060" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M300 20 Q300 90 300 160 Q300 220 300 280" stroke="#5B8FD0" strokeWidth="2.5" />
        <path d="M180 120 Q220 130 260 140" stroke="#5B8FD050" strokeWidth="1.5" />
        <path d="M420 120 Q380 130 340 140" stroke="#5B8FD050" strokeWidth="1.5" />
        <path d="M120 200 Q180 190 240 195" stroke="#5B8FD040" strokeWidth="1.5" />
        <path d="M480 200 Q420 190 360 195" stroke="#5B8FD040" strokeWidth="1.5" />

        {/* Reserve nodes */}
        {[
          [300, 20], [180, 120], [420, 120], [120, 200], [240, 195], [360, 195], [480, 200],
          [180, 280], [260, 265], [340, 265], [420, 280], [300, 280],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={8} fill="#5B8FD020" stroke="#5B8FD060" strokeWidth={1} />
            <circle cx={cx} cy={cy} r={3} fill="#5B8FD0" />
          </g>
        ))}

        {/* Labels */}
        <text x={310} y={16} fill="#5B8FD0" fontSize={10} fontFamily="DM Sans, system-ui" opacity={0.8}>source</text>
        <text x={300} y={297} fill="#ede8d550" fontSize={10} fontFamily="DM Sans, system-ui" textAnchor="middle">the sea</text>
      </svg>
      <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#ede8d540", marginTop: "0.5rem" }}>
        40–60 reserve communities · hundreds of small watersheds
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────────────────────── */
export function VisionBoardPage() {
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #03090F 0%, #071410 20%, #0A0D08 50%, #0C0A04 80%, #080505 100%)",
        color: "#ede8d5",
        fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
        overflowX: "hidden",
      }}
    >
      <WaterCanvas />

      {/* Back link */}
      <a
        href={`${BASE}/`}
        style={{
          position: "fixed",
          top: "1.25rem",
          left: "1.5rem",
          zIndex: 100,
          color: "#ede8d550",
          fontSize: "0.8rem",
          textDecoration: "none",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          transition: "color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#ede8d5aa")}
        onMouseLeave={e => (e.currentTarget.style.color = "#ede8d550")}
      >
        ← North Star
      </a>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6rem 2rem 4rem",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Glow behind title */}
          <div style={{
            position: "absolute",
            top: "30%", left: "50%", transform: "translate(-50%, -50%)",
            width: 600, height: 300,
            background: "radial-gradient(ellipse, rgba(91,143,208,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{
            fontSize: "0.8rem", letterSpacing: "0.18em", color: "#5B8FD0",
            textTransform: "uppercase", marginBottom: "1.5rem",
          }}>
            18-Month Success Picture
          </div>

          <h1 style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontWeight: 800,
            fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
            lineHeight: 1.05,
            color: "#ede8d5",
            maxWidth: 800,
            marginBottom: "1.5rem",
          }}>
            The Watershed<br />
            <span style={{ color: "#5B8FD0" }}>is Alive</span>
          </h1>

          <p style={{
            maxWidth: 520,
            fontSize: "1.1rem",
            color: "#ede8d580",
            lineHeight: 1.7,
            marginBottom: "3rem",
          }}>
            What Headwaters looks like when it's working — quiet infrastructure
            flowing through hundreds of northern communities, one family at a time.
          </p>

          {/* Flowing line */}
          <div style={{
            width: 2,
            height: 80,
            background: "linear-gradient(180deg, #5B8FD060 0%, transparent 100%)",
            margin: "0 auto",
          }} />
          <div style={{ fontSize: "1.25rem", color: "#5B8FD060", marginTop: "0.5rem" }}>↓</div>
        </div>

        {/* ── 1. THE LANDSCAPE ─────────────────────────────────── */}
        <Section
          id="landscape"
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "6rem 2rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.18em", color: "#5E8F72", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              The Overall Landscape
            </div>
            <h2 style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#ede8d5",
              marginBottom: "1.25rem",
            }}>
              Quiet Infrastructure<br />
              <span style={{ color: "#5E8F72" }}>Across the North</span>
            </h2>
            <p style={{ color: "#ede8d575", lineHeight: 1.8, maxWidth: 580, margin: "0 auto 2rem" }}>
              Not a platform. Not a startup. A water table — invisible from above,
              essential below. Headwaters runs beneath hundreds of small communities
              across Canada, surfacing only when a family needs it.
            </p>
          </div>

          <WatershedMap />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginTop: "3rem",
            }}
          >
            {[
              { icon: "🌊", title: "Market Mosaic", desc: "Community-owned micro-market infrastructure in each watershed node" },
              { icon: "🏠", title: "Saltbox", desc: "The family hub — meal planning, budgeting, seasonal rhythm" },
              { icon: "🌱", title: "Earth Kit", desc: "Home-based practitioner tiers for food sovereignty" },
              { icon: "💻", title: "CODETRY", desc: "Skills pathway from learning to teaching to earning" },
            ].map(item => (
              <div
                key={item.title}
                style={{
                  background: "rgba(94,143,114,0.08)",
                  border: "1px solid rgba(94,143,114,0.2)",
                  borderRadius: 14,
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.35rem", color: "#5E8F72" }}>{item.title}</div>
                <div style={{ fontSize: "0.82rem", color: "#ede8d560", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(91,143,208,0.2), transparent)" }} />

        {/* ── 2–4. PERSONAS ────────────────────────────────────── */}
        <Section
          id="personas"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "6rem 2rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.18em", color: "#C8933A", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Three Lives Changed
            </div>
            <h2 style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#ede8d5",
              marginBottom: "1rem",
            }}>
              Who the Watershed Serves
            </h2>
            <p style={{ color: "#ede8d565", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
              Real people. Real kitchen tables. Real mornings that feel different now.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            <PersonaCard
              emoji="👩‍👧"
              name="The Single Mother"
              arc="From stretched thin to resourced"
              color="#C8933A"
              moments={[
                "Runs Kitchen workflow — family fed, budget held",
                "Saltbox guides her seasonal rhythm, no guesswork",
                "Helping Hands network carries her in hard weeks",
                "Market Mosaic gives her produce at cost, community credit",
                "Community loan cleared a gap that used to break everything",
              ]}
              feeling="I didn't know it could feel this steady."
            />
            <PersonaCard
              emoji="🧑‍💻"
              name="The Young Man"
              arc="From surviving to building"
              color="#5B8FD0"
              moments={[
                "Found CODETRY — learned by doing, not by sitting",
                "Earned his Teaching badge — now brings others in",
                "Xaman wallet tracks his work and his worth",
                "First real income from skills, not just labour",
                "Teaching the next one. The cycle turns.",
              ]}
              feeling="I used to just survive. Now I build things."
            />
            <PersonaCard
              emoji="📚"
              name="The Homeschool Mom"
              arc="From isolated to practitioner"
              color="#5E8F72"
              moments={[
                "Full-stack family: learning, food, finance, health — integrated",
                "Earth Kit practitioner tier — teaching neighbours",
                "Kids learn within the system, not despite it",
                "Community her classroom, watershed her curriculum",
                "Reached level three. Her neighbours call her for advice.",
              ]}
              feeling="This is what I always knew education could be."
            />
          </div>
        </Section>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(94,143,114,0.2), transparent)" }} />

        {/* ── 5. COMMUNITY TRANSFORMATION ─────────────────────── */}
        <Section
          id="community"
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "6rem 2rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.18em", color: "#A07BC0", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Community & Reserve Transformation
            </div>
            <h2 style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#ede8d5",
              marginBottom: "1.25rem",
            }}>
              The Measurable<br />
              <span style={{ color: "#A07BC0" }}>Shift</span>
            </h2>
            <p style={{ color: "#ede8d568", lineHeight: 1.75, maxWidth: 560, margin: "0 auto" }}>
              Sociophysics — the study of how information and behaviour move through
              human networks — says: change twelve percent of a community and the
              whole community changes. Headwaters is quietly reaching that threshold.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}>
            <StatTile animated target={50} suffix="+" label="Reserve communities using Headwaters tools" color="#A07BC0" />
            <StatTile animated target={25} suffix="+" label="Market Mosaic nodes active" color="#5B8FD0" />
            <StatTile animated target={12000} suffix="" label="Monthly active users at peak" color="#C8933A" />
            <StatTile animated target={450} suffix="/mo" label="Community tasks completed" color="#5E8F72" />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}>
            {[
              {
                icon: "📡",
                title: "Reliability Record",
                body: "Communities report that Headwaters tools work when their connection doesn't — designed for the north, not for downtown.",
                color: "#7A9BAA",
              },
              {
                icon: "🌐",
                title: "Band Council Integration",
                body: "Forty-plus band councils now reference Headwaters data in community planning. The language of the watershed has entered governance.",
                color: "#A07BC0",
              },
              {
                icon: "🔁",
                title: "Practitioner Cascade",
                body: "Each trained practitioner reaches 8–12 families. The watershed multiplies without the founder needing to be in the room.",
                color: "#5E8F72",
              },
            ].map(item => (
              <div
                key={item.title}
                style={{
                  background: `${item.color}0A`,
                  border: `1px solid ${item.color}25`,
                  borderRadius: 16,
                  padding: "1.5rem",
                }}
              >
                <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.4rem", color: item.color }}>{item.title}</div>
                <div style={{ fontSize: "0.84rem", color: "#ede8d560", lineHeight: 1.6 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(200,147,58,0.2), transparent)" }} />

        {/* ── 6. FOUNDER'S REALITY ─────────────────────────────── */}
        <Section
          id="founder"
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "6rem 2rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.75rem", letterSpacing: "0.18em", color: "#C8933A", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              The Founder's Reality
            </div>
            <h2 style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#ede8d5",
              marginBottom: "1.25rem",
            }}>
              The Saltbox Morning
            </h2>
          </div>

          <div style={{
            background: "linear-gradient(145deg, rgba(200,147,58,0.07) 0%, rgba(200,147,58,0.02) 100%)",
            border: "1px solid rgba(200,147,58,0.18)",
            borderRadius: 24,
            padding: "2.5rem",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: 3,
              background: "linear-gradient(90deg, #C8933A80, #C8933A20)",
              borderRadius: "24px 24px 0 0",
            }} />

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}>
              <div>
                <div style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 800, fontSize: "1.1rem", color: "#C8933A", marginBottom: "1rem" }}>
                  The Morning
                </div>
                <p style={{ color: "#ede8d575", lineHeight: 1.8, fontSize: "0.95rem" }}>
                  Coffee before the alerts. The dashboard shows green.
                  Forty-eight communities checked in overnight.
                  A message from a mother in the north: <em style={{ color: "#ede8d5aa" }}>"the kids slept warm and the food stretched."</em>
                </p>
                <p style={{ color: "#ede8d560", lineHeight: 1.8, fontSize: "0.9rem", marginTop: "0.75rem" }}>
                  This is what fifteen years of saying yes to the hard thing looks like
                  from the inside. Not glory. Quiet. Steady. Real.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 800, fontSize: "1.1rem", color: "#C8933A", marginBottom: "0.25rem" }}>
                  The Numbers
                </div>
                {[
                  { label: "Steady monthly revenue", value: "$18k–$26k/mo" },
                  { label: "Revenue from mission-aligned sources", value: ">80%" },
                  { label: "Team members carrying the load", value: "3–5 core" },
                  { label: "Countries with Headwaters presence", value: "2+" },
                  { label: "Years of sustained runway", value: "3+" },
                ].map(row => (
                  <div key={row.label} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    borderBottom: "1px solid rgba(200,147,58,0.12)",
                    paddingBottom: "0.5rem",
                    gap: "1rem",
                  }}>
                    <span style={{ fontSize: "0.84rem", color: "#ede8d558" }}>{row.label}</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#C8933A", whiteSpace: "nowrap" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── PULSE STRIP ──────────────────────────────────────── */}
        <Section
          id="pulse"
          style={{
            background: "rgba(91,143,208,0.04)",
            borderTop: "1px solid rgba(91,143,208,0.12)",
            borderBottom: "1px solid rgba(91,143,208,0.12)",
            padding: "4rem 2rem",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.18em", color: "#5B8FD0", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                The Pulse
              </div>
              <h2 style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                color: "#ede8d5",
              }}>
                Measurable Signs of Life
              </h2>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
            }}>
              <StatTile animated target={11500} suffix="" label="Monthly active users" color="#5B8FD0" />
              <StatTile animated target={420} suffix="/mo" label="Tasks completed" color="#5E8F72" />
              <StatTile animated target={47} suffix="" label="Reserve communities" color="#A07BC0" />
              <StatTile animated target={28} suffix="" label="Market Mosaic nodes" color="#C8933A" />
              <StatTile animated target={94} suffix="%" label="User retention at 90 days" color="#7A9BAA" />
              <StatTile animated target={340} suffix="" label="Messages: 'this changed things'" color="#D96C3A" />
            </div>
          </div>
        </Section>

        {/* ── CLOSING ──────────────────────────────────────────── */}
        <Section
          id="closing"
          style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "8rem 2rem 6rem",
            position: "relative",
          }}
        >
          {/* Radial glow */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 700, height: 400,
            background: "radial-gradient(ellipse, rgba(91,143,208,0.10) 0%, rgba(94,143,114,0.06) 50%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Flowing lines */}
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none" style={{ marginBottom: "3rem", opacity: 0.5 }}>
            <path d="M10 50 Q30 10 60 30 Q90 50 110 10" stroke="#5B8FD0" strokeWidth="1.5" fill="none" />
            <path d="M10 40 Q30 5 60 20 Q90 40 110 5" stroke="#5E8F72" strokeWidth="1" fill="none" opacity="0.6" />
            <circle cx="60" cy="30" r="4" fill="#5B8FD0" opacity="0.6" />
          </svg>

          <div style={{
            fontSize: "0.8rem", letterSpacing: "0.18em", color: "#5B8FD080",
            textTransform: "uppercase", marginBottom: "2rem",
          }}>
            18 months from now
          </div>

          <blockquote
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
              lineHeight: 1.15,
              color: "#ede8d5",
              maxWidth: 700,
              marginBottom: "2rem",
            }}
          >
            "The watershed is alive."
          </blockquote>

          <div style={{
            width: 60, height: 2,
            background: "linear-gradient(90deg, transparent, #C8933A60, transparent)",
            marginBottom: "2rem",
          }} />

          <p
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              fontStyle: "italic",
              color: "#ede8d580",
              maxWidth: 460,
              lineHeight: 1.6,
              marginBottom: "4rem",
            }}
          >
            It was worth it. The water is flowing.
          </p>

          {/* Final node */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.4 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#5B8FD0" }} />
            <div style={{ width: 1, height: 40, background: "linear-gradient(180deg, #5B8FD0, transparent)" }} />
          </div>

          {/* Footer */}
          <div style={{
            marginTop: "5rem",
            fontSize: "0.78rem",
            color: "#ede8d528",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Headwaters · June 2026 → December 2027
          </div>
        </Section>

      </div>
    </div>
  );
}
