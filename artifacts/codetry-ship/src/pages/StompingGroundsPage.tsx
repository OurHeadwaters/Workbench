import { useState, useEffect } from "react";
import { WatershedRibbon } from "@/components/WatershedRibbon";
import { GrainOverlay } from "@/components/AmbientBackground";

interface Station {
  id: string;
  icon: string;
  name: string;
  tagline: string;
  body: string;
  actionLabel: string;
  actionHref: string;
}

const STATIONS: Station[] = [
  {
    id: "wisdom-dig",
    icon: "⛏️",
    name: "Wisdom Dig",
    tagline: "Mine the archive.",
    body:
      "Every episode of The Survival Podcast that built this path is waiting here. Dig through the audio archive — zone by zone, topic by topic — and surface the ideas that changed the trajectory. The Wisdom Dig is where knowledge turns into conviction.",
    actionLabel: "Enter the archive →",
    actionHref: "/listen",
  },
  {
    id: "wishing-well",
    icon: "🪣",
    name: "Wishing Well",
    tagline: "Put something in the water.",
    body:
      "The Well runs on the Headwaters micro-economy. Drop a tip to a creator, a contributor, or the practitioner whose work landed for you. Water flows downstream — this is how it starts. Every drop counts toward community overflow.",
    actionLabel: "Tip via the economy →",
    actionHref: "/economy/tip",
  },
  {
    id: "transformation-trail",
    icon: "🌿",
    name: "Transformation Trail",
    tagline: "Stage 1 → Stage 2 → Stage 3.",
    body:
      "The three-stage stomping path is the trail most of this community walked to reach this kitchen table. Fear to sovereignty to community ownership. The Trail maps the arc — and names the gap that Stage 2 never closed. Here you see where you've been and where the path leads.",
    actionLabel: "Walk the trail →",
    actionHref: "/home#stomping-path",
  },
  {
    id: "water-wheel",
    icon: "⚙️",
    name: "Water Wheel",
    tagline: "Watch the machine run.",
    body:
      "Income enters at the headwaters. It flows through four buckets in order — costs, reserve, reinvestment, community overflow — and nothing moves downstream until the bucket above is full. The Water Wheel shows the actual operating model, turning in real time. Not theory. A machine already running.",
    actionLabel: "See the full model →",
    actionHref: "/odyssey",
  },
  {
    id: "fireside",
    icon: "🔥",
    name: "Fireside",
    tagline: "Gather, speak, be heard.",
    body:
      "The Fireside is where the community tells its own story. Founding stories, practitioner logs, and field notes from the trail. Pull up a log, add your voice to the record. This is the oral tradition of the Headwaters Kitchen Table — kept in writing, kept alive.",
    actionLabel: "Read founding stories →",
    actionHref: "/founding-stories",
  },
];

const STOMPER_SEED = 2847;
const SESSION_KEY = "stomping-grounds:visited";
const COUNT_API = "/api/stomping-grounds/count";

export function StompingGroundsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [stomperCount, setStomperCount] = useState<number>(STOMPER_SEED);

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem(SESSION_KEY) === "1";

    async function recordVisit() {
      try {
        if (!alreadyVisited) {
          const res = await fetch(COUNT_API, { method: "POST" });
          if (res.ok) {
            const data = (await res.json()) as { count: number };
            setStomperCount(data.count);
            sessionStorage.setItem(SESSION_KEY, "1");
            return;
          }
        }
        const res = await fetch(COUNT_API);
        if (res.ok) {
          const data = (await res.json()) as { count: number };
          setStomperCount(data.count);
        }
      } catch {
        // Silently fall back to the seed number already shown
      }
    }

    recordVisit();
  }, []);

  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  return (
    <main
      className="min-h-screen w-full"
      style={{ background: "#0F1C18" }}
    >
      {/* ── hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #0a0f0c 0%, #0F1C18 100%)", minHeight: "52vh" }}
      >
        <GrainOverlay opacity={0.04} />

        {/* torch glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 70%, rgba(184,90,62,0.18) 0%, rgba(212,160,23,0.08) 35%, transparent 65%)",
          }}
        />

        <div
          className="relative z-10 mx-auto max-w-[42rem] px-6 sm:px-8 pt-16 pb-14 text-center flex flex-col items-center"
        >
          <p
            className="font-mono text-[8px] uppercase tracking-[0.32em] mb-5"
            style={{ color: "rgba(212,160,23,0.50)" }}
          >
            Crypto Castle · Stomping Grounds
          </p>

          <h1
            className="font-serif leading-[1.1] tracking-tight mb-5"
            style={{
              fontSize: "clamp(2.2rem, 7vw, 3.4rem)",
              color: "#f4ede0",
              textShadow: "0 2px 24px rgba(0,0,0,0.8)",
            }}
            data-testid="stomping-grounds-title"
          >
            The Stomping Grounds
          </h1>

          <p
            className="font-serif leading-[1.6] mb-8"
            style={{ fontSize: "clamp(1rem, 2.8vw, 1.1rem)", color: "rgba(244,237,224,0.70)" }}
          >
            Five stations around the castle. Each one a different kind of work.
            Dig in — the grounds reward those who stomp.
          </p>

          {/* Live counter */}
          <div
            className="rounded-sm px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{
              background: "rgba(212,160,23,0.08)",
              border: "1px solid rgba(212,160,23,0.22)",
              color: "rgba(212,160,23,0.85)",
            }}
            data-testid="stomper-count"
          >
            🥾 {stomperCount.toLocaleString()} humans have stomped these grounds
          </div>

          <a
            href={`${(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")}/castle`}
            className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
            style={{ color: "rgba(184,90,62,0.85)" }}
          >
            ← Back to the Castle
          </a>
        </div>
      </section>

      {/* ── stations grid ── */}
      <section
        className="mx-auto max-w-[56rem] px-6 sm:px-8 py-12 sm:py-16"
        aria-label="Five stations"
      >
        {/* Castle silhouette centrepiece */}
        <div className="flex justify-center mb-10">
          <img
            src={`${import.meta.env.BASE_URL}crypto-castle.png`}
            alt="Crypto Castle"
            style={{
              width: "clamp(160px, 28vw, 260px)",
              height: "auto",
              objectFit: "contain",
              filter:
                "brightness(0.75) sepia(0.3) drop-shadow(0 0 28px rgba(212,160,23,0.30))",
              opacity: 0.65,
            }}
            aria-hidden
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATIONS.map((station, i) => {
            const isOpen = open === station.id;
            return (
              <div
                key={station.id}
                className="rounded-lg overflow-hidden"
                style={{
                  background: isOpen ? "rgba(184,90,62,0.07)" : "rgba(15,28,24,0.8)",
                  border: isOpen
                    ? "1px solid rgba(184,90,62,0.35)"
                    : "1px solid rgba(244,237,224,0.08)",
                  transition: "background 0.2s ease, border-color 0.2s ease",
                  gridColumn: isOpen && i === 2 ? "1 / -1" : undefined,
                }}
                data-testid={`station-${station.id}`}
              >
                {/* Card header — always visible */}
                <button
                  type="button"
                  onClick={() => toggle(station.id)}
                  className="w-full px-5 py-5 text-left flex items-start gap-4 group"
                  aria-expanded={isOpen}
                  aria-controls={`${station.id}-panel`}
                >
                  <span className="text-2xl leading-none shrink-0 mt-0.5">{station.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-serif text-[17px] tracking-tight"
                      style={{ color: isOpen ? "#f4ede0" : "rgba(244,237,224,0.88)" }}
                    >
                      {station.name}
                    </p>
                    <p
                      className="font-mono text-[9px] uppercase tracking-[0.20em] mt-1"
                      style={{ color: isOpen ? "rgba(184,90,62,0.90)" : "rgba(212,160,23,0.55)" }}
                    >
                      {station.tagline}
                    </p>
                  </div>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    aria-hidden="true"
                    className="shrink-0 mt-1 opacity-40 group-hover:opacity-70 transition-all"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Expanded panel */}
                {isOpen && (
                  <div
                    id={`${station.id}-panel`}
                    className="px-5 pb-6"
                    style={{ borderTop: "1px solid rgba(184,90,62,0.18)" }}
                  >
                    <p
                      className="font-serif text-[14.5px] leading-[1.65] mt-4 mb-5"
                      style={{ color: "rgba(244,237,224,0.72)" }}
                    >
                      {station.body}
                    </p>
                    <a
                      href={`${(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")}${station.actionHref.startsWith("/") ? station.actionHref : "/" + station.actionHref}`}
                      className="inline-flex items-center gap-2 rounded-sm px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all hover:opacity-85"
                      style={{
                        background: "rgba(184,90,62,0.18)",
                        border: "1px solid rgba(184,90,62,0.40)",
                        color: "#f4ede0",
                      }}
                    >
                      {station.actionLabel}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <WatershedRibbon />
    </main>
  );
}
