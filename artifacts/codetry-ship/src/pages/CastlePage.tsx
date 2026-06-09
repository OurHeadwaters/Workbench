import { WatershedRibbon } from "@/components/WatershedRibbon";
import { GrainOverlay } from "@/components/AmbientBackground";

interface Wing {
  icon: string;
  name: string;
  subtitle: string;
  body: string;
  href: string;
  actionLabel: string;
}

const WINGS: Wing[] = [
  {
    icon: "⚒️",
    name: "The Forge",
    subtitle: "Where Codetry is built.",
    body:
      "The practitioner's workshop. The tools are shaped here — the operating plans, the cost basis discipline, the community handoff architecture. If you want to understand what Codetry actually is and how it works, The Forge is the entry.",
    href: "/codetry",
    actionLabel: "Enter The Forge →",
  },
  {
    icon: "🪦",
    name: "The Crypts",
    subtitle: "The archive runs deep.",
    body:
      "Every episode, every field note, every founding story is stored here. The Survival Podcast archive. The oral tradition of the Headwaters Kitchen Table. The Crypts hold what the trail has already taught — so you don't start from scratch.",
    href: "/listen",
    actionLabel: "Descend into The Crypts →",
  },
  {
    icon: "🗡️",
    name: "The Armory",
    subtitle: "Tools ready to deploy.",
    body:
      "The Headwaters Kit is the weapons cache. Pre-built community tools, handoff-ready, no lock-in. The Armory stocks the shelf — community store playbooks, platform kits, governance templates, and practitioner guides. Take what fits your community.",
    href: "/headwaters/products",
    actionLabel: "Open The Armory →",
  },
  {
    icon: "🕳️",
    name: "The Black Hole Tower",
    subtitle: "The full neighbourhood map.",
    body:
      "The tower looks out over the entire watershed. From here you can see every zone — Saltbox to Edge — and how they connect. The Black Hole Tower is where extraction stops and community ownership begins. Orient before you build.",
    href: "/map",
    actionLabel: "Climb the Tower →",
  },
];

export function CastlePage() {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

  return (
    <main
      className="min-h-screen w-full"
      style={{ background: "#080d0a" }}
    >
      {/* ── full-bleed castle hero ── */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center"
        style={{ minHeight: "70vh" }}
        data-testid="castle-hero"
      >
        <GrainOverlay opacity={0.04} />

        {/* deep torch-orange ambient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 85%, rgba(184,90,62,0.22) 0%, rgba(212,160,23,0.10) 40%, transparent 70%)",
          }}
        />
        {/* top fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24"
          style={{ background: "linear-gradient(to bottom, #080d0a, transparent)" }}
        />
        {/* bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to top, #080d0a, transparent)" }}
        />

        {/* Castle image — centred */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-10 text-center">
          <p
            className="font-mono text-[8px] uppercase tracking-[0.32em] mb-8"
            style={{ color: "rgba(212,160,23,0.50)" }}
          >
            Crypto Castle · Hub
          </p>

          <img
            src={`${import.meta.env.BASE_URL}crypto-castle.png`}
            alt="The Crypto Castle"
            style={{
              width: "clamp(220px, 38vw, 420px)",
              height: "auto",
              objectFit: "contain",
              filter:
                "brightness(1.05) contrast(1.05) drop-shadow(0 0 48px rgba(212,160,23,0.35)) drop-shadow(0 0 96px rgba(184,90,62,0.20))",
              marginBottom: "2rem",
            }}
            data-testid="castle-image"
          />

          <h1
            className="font-serif leading-[1.08] tracking-tight mb-4"
            style={{
              fontSize: "clamp(2.4rem, 8vw, 4rem)",
              color: "#f4ede0",
              textShadow: "0 2px 32px rgba(0,0,0,0.9), 0 0 80px rgba(212,160,23,0.12)",
            }}
            data-testid="castle-title"
          >
            The Crypto Castle
          </h1>

          <p
            className="font-serif mb-8 max-w-[36rem]"
            style={{
              fontSize: "clamp(0.95rem, 2.6vw, 1.1rem)",
              color: "rgba(244,237,224,0.62)",
              lineHeight: 1.65,
            }}
          >
            The castle stands at the centre of the Headwaters watershed. Four wings,
            one purpose — community-owned infrastructure that outlasts any individual.
            Choose a wing and begin.
          </p>

          <a
            href={`${base}/stomping-grounds`}
            className="inline-flex items-center gap-2 rounded-sm px-6 py-3 font-mono text-[10px] uppercase tracking-[0.20em] transition-all hover:opacity-85"
            style={{
              background: "rgba(184,90,62,0.15)",
              border: "1px solid rgba(184,90,62,0.40)",
              color: "rgba(244,237,224,0.90)",
              boxShadow: "0 0 24px rgba(184,90,62,0.12)",
            }}
            data-testid="castle-stomping-grounds-link"
          >
            🥾 Visit the Stomping Grounds →
          </a>
        </div>
      </section>

      {/* ── four wings ── */}
      <section
        className="mx-auto max-w-[60rem] px-6 sm:px-8 py-14 sm:py-20"
        aria-label="Castle wings"
        data-testid="castle-wings"
      >
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px flex-1" style={{ background: "rgba(212,160,23,0.18)" }} />
          <p
            className="font-mono text-[8.5px] uppercase tracking-[0.32em] shrink-0"
            style={{ color: "rgba(212,160,23,0.55)" }}
          >
            Four wings · One castle
          </p>
          <div className="h-px flex-1" style={{ background: "rgba(212,160,23,0.18)" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WINGS.map((wing) => (
            <a
              key={wing.name}
              href={`${base}${wing.href}`}
              className="wing-card relative rounded-lg overflow-hidden hover:scale-[1.015]"
              style={{
                background: "rgba(15,28,24,0.70)",
                textDecoration: "none",
                display: "block",
              }}
              data-testid={`castle-wing-${wing.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {/* torch glow on hover — pulses via wing-card-glow keyframe */}
              <div
                aria-hidden
                className="wing-card-glow pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,160,23,0.10) 0%, transparent 65%)",
                }}
              />

              <div className="relative z-10 p-6 sm:p-7">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl leading-none shrink-0">{wing.icon}</span>
                  <div>
                    <p
                      className="font-serif text-xl tracking-tight"
                      style={{ color: "#f4ede0" }}
                    >
                      {wing.name}
                    </p>
                    <p
                      className="font-mono text-[9px] uppercase tracking-[0.20em] mt-1 transition-colors duration-200"
                      style={{ color: "rgba(212,160,23,0.60)" }}
                    >
                      {wing.subtitle}
                    </p>
                  </div>
                </div>

                <p
                  className="font-serif text-[14px] leading-[1.65] mb-5"
                  style={{ color: "rgba(244,237,224,0.60)" }}
                >
                  {wing.body}
                </p>

                <span
                  className="inline-block font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-200"
                  style={{ color: "rgba(212,160,23,0.70)" }}
                >
                  {wing.actionLabel}
                </span>
              </div>

              {/* bottom glow bar — torch accent */}
              <div
                aria-hidden
                className="wing-card-bar h-0.5"
                style={{ background: "linear-gradient(to right, rgba(212,160,23,0.6), rgba(184,90,62,0.4))" }}
              />
            </a>
          ))}
        </div>
      </section>

      <WatershedRibbon />
    </main>
  );
}
