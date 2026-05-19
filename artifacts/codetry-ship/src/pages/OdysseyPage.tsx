import { useState, useRef, type FormEvent } from "react";
import { ApiError, postIntake } from "@/lib/api";
import { TrailArtGallery } from "@/components/TrailArtGallery";
import { TrailMapHero } from "@/components/TrailMapHero";

/* ── Phase data ────────────────────────────────────────────────────────── */

const PHASES = [
  {
    n: "01",
    label: "The Saltbox",
    body: "Name the work that already exists. Find the substrate you're standing on.",
    season: "Early spring — bare ground visible.",
  },
  {
    n: "02",
    label: "Both-States",
    body: "Hold the tension between what is and what the community is building toward.",
    season: "Late spring — two weathers in one day.",
  },
  {
    n: "03",
    label: "Both-Sides",
    body: "Map the actors — who benefits, who bears cost, who decides.",
    season: "High summer — long light, hard work.",
  },
  {
    n: "04",
    label: "The Standby",
    body: "Build the readiness layer. The work that happens before the flood.",
    season: "Autumn — provisions laid in.",
  },
  {
    n: "05",
    label: "The Gate",
    body: "Write the method down. Hand it off. Let the community run it.",
    season: "First snow — the trail is marked.",
  },
];

const MECHANIC_TAGS = [
  { glyph: "⊕", text: "Earn each station" },
  { glyph: "⊞", text: "Full toolkit included" },
  { glyph: "◷", text: "Learn on your own time" },
  { glyph: "⌀", text: "Private Signal group" },
  { glyph: "◌", text: "No deadlines · no pressure" },
  { glyph: "◇", text: "Free" },
];

/* ── Woodcut-style SVG phase icons ─────────────────────────────────────── */

function PhaseIcon({ n, className = "w-5 h-5" }: { n: string; className?: string }) {
  if (n === "01") return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C12 2 4 11 4 16.5a8 8 0 0016 0C20 11 12 2 12 2z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M9 16c0 2 1.5 3.5 3.5 3.5"
        stroke="rgba(244,237,224,0.6)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
  if (n === "02") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="9.5" cy="12" r="5.5" opacity="0.85"/>
      <circle cx="14.5" cy="12" r="5.5" opacity="0.85"/>
    </svg>
  );
  if (n === "03") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className}>
      <line x1="12" y1="3" x2="12" y2="11"/>
      <path d="M12 11 L6 20" opacity="0.85"/>
      <path d="M12 11 L18 20" opacity="0.85"/>
      <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
  if (n === "04") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 7.5h6l2 11H7L9 7.5z"/>
      <line x1="12" y1="3" x2="12" y2="7.5"/>
      <line x1="9" y1="18.5" x2="8.5" y2="21"/>
      <line x1="15" y1="18.5" x2="15.5" y2="21"/>
      <circle cx="12" cy="13" r="2.2" fill="currentColor" opacity="0.65" stroke="none"/>
    </svg>
  );
  if (n === "05") return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <line x1="3" y1="3" x2="3" y2="21"/>
      <line x1="21" y1="3" x2="21" y2="21"/>
      <line x1="3" y1="7" x2="21" y2="7"/>
      <line x1="3" y1="13" x2="10" y2="13"/>
      <line x1="14" y1="13" x2="21" y2="13"/>
      <line x1="3" y1="21" x2="21" y2="21"/>
    </svg>
  );
  return null;
}

/* ── Checkmark seal ────────────────────────────────────────────────────── */

function HempcreteCheckmark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14 mx-auto mb-5">
      <circle cx="32" cy="32" r="29" stroke="#1f3d2e" strokeWidth="2.5" opacity="0.3"/>
      <circle cx="32" cy="32" r="22" fill="#1f3d2e" opacity="0.08"/>
      <path
        d="M18 33 L27 42 L46 22"
        stroke="#1f3d2e"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 8 L33.9 14.5 H40.7 L35.1 18.5 L37 25 L32 21 L27 25 L28.9 18.5 L23.3 14.5 H30.1 Z"
        fill="none"
        stroke="#d4a017"
        strokeWidth="1"
        opacity="0.55"
      />
    </svg>
  );
}

/* ── Form state ────────────────────────────────────────────────────────── */

interface FormState {
  name: string;
  community: string;
  q1: string;
  q2: string;
  email: string;
  website: string;
}

const EMPTY: FormState = { name: "", community: "", q1: "", q2: "", email: "", website: "" };

/* ── Main page ─────────────────────────────────────────────────────────── */

export function OdysseyPage() {
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [confirmedName, setConfirmedName] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(0);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const BASE = import.meta.env.BASE_URL;

  const handlePhaseClick = (n: number) => {
    setActivePhase(n);
    const el = phaseRefs.current[n - 1];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const whatTheyNeed = [
        `Word or phrase that feels off: ${form.q1.trim()}`,
        `Already tried / what happened: ${form.q2.trim()}`,
      ].join("\n\n");
      const res = await postIntake({
        name:        form.name.trim(),
        email:       form.email.trim(),
        community:   form.community.trim(),
        role:        "Odyssey — Pioneer intake",
        whatTheyNeed,
      });
      setConfirmedName(res.name);
      setForm(EMPTY);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send just now. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="odyssey-page min-h-screen w-full" style={{ background: "#f4ede0" }}>

      {/* ══════════════════════════════════════════════════════ HERO ══ */}
      <section
        className="relative overflow-hidden px-6 sm:px-10 pt-20 pb-28"
        style={{
          background: "#1f3d2e",
          backgroundImage: `url("${BASE}odyssey/hero-banner.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
        data-testid="odyssey-hero"
      >
        {/* Darkening gradient overlay — text legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,46,32,0.62) 0%, rgba(20,46,32,0.80) 55%, rgba(20,46,32,0.97) 100%)",
          }}
        />
        {/* Topographic texture overlay */}
        <div
          aria-hidden
          className="absolute inset-0 od-topo"
          style={{ opacity: 0.18 }}
        />

        <div className="relative z-10 mx-auto max-w-[52rem]">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-px w-8 opacity-50"
              style={{ background: "#d4a017" }}
            />
            <p
              className="font-mono text-[12px] uppercase tracking-[0.32em]"
              style={{ color: "rgba(212,160,23,0.85)" }}
            >
              Headwaters Odyssey
            </p>
          </div>

          <h1
            className="font-serif text-[2.6rem] sm:text-[3.4rem] leading-[1.04] tracking-tight mb-5"
            style={{ color: "#f4ede0" }}
          >
            Become the hempcrete<br className="hidden sm:block" /> your community needs.
          </h1>
          <p
            className="font-serif text-lg italic mb-2 od-pencil"
            style={{ color: "rgba(244,237,224,0.72)", textDecorationColor: "rgba(212,160,23,0.35)" }}
          >
            Whether the flood comes or not.
          </p>
          <p
            className="font-serif text-[17px] leading-[1.7] max-w-2xl mt-6"
            style={{ color: "rgba(244,237,224,0.85)" }}
          >
            A disciplined, self-paced pioneer journey for people who already speak
            basic development language and want to strengthen their communities from the source.
          </p>

          {/* Scroll cue + story crosslink */}
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="#start"
              className="inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.24em] transition-opacity hover:opacity-80"
              style={{ color: "rgba(212,160,23,0.9)" }}
            >
              Begin ↓
            </a>
            <a
              href="/story"
              className="font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-80"
              style={{ color: "rgba(244,237,224,0.38)" }}
            >
              New here? Read the story first →
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ TRAIL ART GALLERY ══ */}
      {/* Sophie's watercolour — the first painting left on the trail.  */}
      {/* Real art by real people from the communities this journey     */}
      {/* passes through. Each piece is a pebble left for the next one. */}
      <TrailArtGallery />

      {/* ══════════════════════════════════════ MAIN CONTENT COLUMN ══ */}
      <div className="mx-auto max-w-[52rem] px-6 sm:px-8">

        {/* ══════════════════════════════════ PLAIN-LANGUAGE INTRO ══ */}
        <section className="pt-14 pb-10" data-testid="odyssey-intro">
          <p
            className="font-serif text-[17px] leading-[1.75] mb-4"
            style={{ color: "#1f3d2e" }}
          >
            The Headwaters Odyssey is a free, self-paced learning journey through the economic concepts that underpin community-owned development. Working through five phases and twenty stations, you build a practical understanding of how the Headwaters model applies to your own community — and produce real field notes along the way.
          </p>
          <p
            className="font-serif text-[17px] leading-[1.7]"
            style={{ color: "rgba(31,61,46,0.68)" }}
          >
            By the time you reach the final station, you hold a clear map of the economic levers your community can pull and the language to discuss them with councils, funders, and neighbours alike. Each station unlocks only after you complete the one before it — there are no shortcuts, and no cost.
          </p>
        </section>

        {/* Trail divider */}
        <div className="od-trail-rule">
          <span>Phase trail</span>
        </div>

        {/* ═════════════════════════════════════ HOW IT WORKS ══ */}
        <section data-testid="odyssey-how-it-works">
          <p
            className="font-mono text-[12px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "#b85a3e" }}
          >
            How it works
          </p>
          <h2
            className="font-serif text-3xl tracking-tight mb-1"
            style={{ color: "#1f3d2e" }}
          >
            5 Phases. 20 Stations.
          </h2>
          <p
            className="font-serif text-[16px] italic mb-6"
            style={{ color: "rgba(31,61,46,0.55)" }}
          >
            You do the work. The next station opens.
          </p>

          {/* Mechanic tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {MECHANIC_TAGS.map(({ glyph, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.14em] px-3 py-1.5"
                style={{
                  color: "rgba(31,61,46,0.72)",
                  borderBottom: "1.5px solid rgba(31,61,46,0.2)",
                }}
              >
                <span style={{ color: "#b85a3e", fontSize: "11px" }}>{glyph}</span>
                {text}
              </span>
            ))}
          </div>
        </section>

      </div>{/* close max-w column */}

      {/* ═══════════════════════════════════════════ TRAIL MAP HERO ══ */}
      {/* Full-width illustrated trail map — 5 phase zones, interactive */}
      <section
        className="w-full overflow-hidden"
        style={{ borderTop: "1px solid rgba(31,61,46,0.10)", borderBottom: "1px solid rgba(31,61,46,0.10)" }}
        data-testid="odyssey-trail-map"
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: "#0d1d15",
            borderBottom: "1px solid rgba(244,237,224,0.07)",
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.28em]"
            style={{ color: "rgba(244,237,224,0.3)" }}>
            Headwaters Odyssey · Trail Map
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(212,160,23,0.45)" }}>
            Tap a phase to read it ↓
          </span>
        </div>
        <TrailMapHero
          currentPhase={activePhase}
          onPhaseClick={handlePhaseClick}
        />
      </section>

      {/* ════════════════════════════════════ PHASE JOURNAL CARDS ══ */}
      {/* Each phase rendered as a boreal field-journal entry card.    */}
      <section
        className="w-full py-10 px-4 sm:px-8"
        style={{ background: "#f4ede0" }}
        data-testid="odyssey-phase-cards"
      >
        <div className="mx-auto max-w-[52rem] space-y-4">
          {PHASES.map((p, i) => {
            const phaseColors = ["#b85a3e","#d4a017","#2e8b4e","#c97c2e","#4a8aab"];
            const accent = phaseColors[i] ?? "#b85a3e";
            const isActive = activePhase === i + 1;
            return (
              <div
                key={p.n}
                ref={(el) => { phaseRefs.current[i] = el; }}
                className="rounded-md overflow-hidden transition-all duration-300"
                style={{
                  background: isActive ? "#fffdf8" : "#f9f3e9",
                  border: `1.5px solid ${isActive ? accent : "rgba(184,90,62,0.18)"}`,
                  boxShadow: isActive
                    ? `0 4px 20px rgba(0,0,0,0.10), 0 0 0 1px ${accent}22`
                    : "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {/* Card header — rust accent border-left */}
                <div
                  className="flex items-start gap-4 px-5 py-4"
                  style={{ borderLeft: `4px solid ${accent}` }}
                >
                  <div
                    className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: `${accent}22`, border: `1.5px solid ${accent}55`, color: accent }}
                  >
                    <PhaseIcon n={p.n} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
                      <h3
                        className="font-serif text-[18px] font-semibold tracking-tight"
                        style={{ color: "#1f3d2e" }}
                      >
                        {p.label}
                      </h3>
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.22em] shrink-0 px-2 py-0.5 rounded-sm"
                        style={{ background: `${accent}18`, color: accent }}
                      >
                        Phase {p.n}
                      </span>
                    </div>
                    {/* Trail condition — "rust italic" teaser */}
                    <p
                      className="font-serif text-[13px] italic mb-2"
                      style={{ color: accent, opacity: 0.85 }}
                    >
                      {p.season}
                    </p>
                    <p
                      className="font-serif text-[15px] leading-[1.65]"
                      style={{ color: "rgba(31,61,46,0.78)" }}
                    >
                      {p.body}
                    </p>
                  </div>
                </div>
                {/* Pencil-line separator + station count */}
                <div
                  className="flex items-center justify-between px-5 py-2"
                  style={{
                    borderTop: "1px dashed rgba(184,90,62,0.18)",
                    background: "rgba(31,61,46,0.025)",
                  }}
                >
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.22em]"
                    style={{ color: "rgba(31,61,46,0.32)" }}
                  >
                    4 stations · earn each one
                  </span>
                  <a
                    href="#start"
                    className="font-mono text-[9px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
                    style={{ color: accent }}
                  >
                    Begin now →
                  </a>
                  <button
                    onClick={() => handlePhaseClick(i + 1)}
                    className="font-mono text-[9px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
                    style={{ color: accent }}
                  >
                    {isActive ? "↑ on map" : "show on map ↑"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Station key note */}
          <div
            className="rounded-md px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2"
            style={{
              background: "#f0e8d8",
              border: "1.5px dashed rgba(184,90,62,0.32)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <span
              className="shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] px-3 py-1.5 rounded-sm"
              style={{ background: "#1f3d2e", color: "#f4ede0" }}
            >
              Each station
            </span>
            <p
              className="font-serif text-[16px] leading-[1.5]"
              style={{ color: "rgba(31,61,46,0.72)" }}
            >
              One piece of real work. One field note. One unlock. No skipping.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[52rem] px-6 sm:px-8">

        {/* Trail divider */}
        <div className="od-trail-rule">
          <span>Start here</span>
        </div>

        {/* ═══════════════════════════════════════ INTAKE / CONFIRM ══ */}
        <section id="start" data-testid="odyssey-intake">
          <p
            className="font-mono text-[12px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "#b85a3e" }}
          >
            Begin the journey
          </p>
          <h2
            className="font-serif text-3xl tracking-tight mb-1"
            style={{ color: "#1f3d2e" }}
          >
            Three short questions.
          </h2>
          <p
            className="font-serif text-[16px] italic mb-8"
            style={{ color: "rgba(31,61,46,0.55)" }}
          >
            So the journey begins in your real context, not a hypothetical one.
          </p>

          {confirmedName ? (

            /* ── Confirmation — firelight glow ── */
            <div
              className="od-firelight rounded-md px-6 py-10 text-center"
              style={{
                border: "1px solid rgba(212,160,23,0.3)",
                boxShadow: "0 4px 24px rgba(212,160,23,0.12)",
              }}
              data-testid="odyssey-confirmed"
            >
              <HempcreteCheckmark />
              <p
                className="font-serif text-2xl mb-3"
                style={{ color: "#1f3d2e" }}
              >
                Welcome to the trail, {confirmedName}.
              </p>
              <p
                className="font-serif text-[16px] leading-[1.6] mb-2"
                style={{ color: "rgba(31,61,46,0.72)" }}
              >
                Station 1 is now unlocked for you in the app.
              </p>
              <p
                className="font-serif text-[15px] italic mb-8"
                style={{ color: "rgba(31,61,46,0.52)" }}
              >
                Phase 01 · The Saltbox — find the substrate you're standing on.
              </p>
              <a
                href="/codetry-handbook/path"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3 font-mono text-[13px] uppercase tracking-[0.18em] transition-all hover:opacity-90"
                style={{ background: "#1f3d2e", color: "#f4ede0" }}
              >
                Open the Pioneer Path →
              </a>
              <p
                className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(31,61,46,0.38)" }}
              >
                Headwaters Odyssey · sealed with hempcrete
              </p>
            </div>

          ) : (

            /* ── Intake form — field journal aesthetic ── */
            <div
              className="od-card rounded-md overflow-hidden"
              style={{ background: "#f4ede0" }}
              data-testid="odyssey-form"
            >
              {/* Journal page header bar */}
              <div
                className="px-6 sm:px-8 py-4 flex items-center gap-3"
                style={{
                  background: "#1f3d2e",
                  backgroundImage: `url("${BASE}odyssey/journal-page.jpg")`,
                  backgroundSize: "cover",
                  backgroundBlendMode: "multiply",
                }}
              >
                <span style={{ color: "#d4a017", fontSize: "16px", opacity: 0.9 }}>⌁</span>
                <p
                  className="font-mono text-[12px] uppercase tracking-[0.28em]"
                  style={{ color: "rgba(244,237,224,0.78)" }}
                >
                  Pioneer intake · Field Journal
                </p>
                <div className="flex-1" />
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "rgba(244,237,224,0.4)" }}
                >
                  W20 · Phase 01
                </p>
              </div>

              <form onSubmit={onSubmit} className="p-6 sm:p-8 flex flex-col gap-7">
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={set("website")}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden
                  style={{ display: "none" }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <JournalField label="Your name" required>
                    <input
                      className="od-field-input"
                      type="text"
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="First name is fine"
                    />
                  </JournalField>
                  <JournalField label="Email" required>
                    <input
                      className="od-field-input"
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      placeholder="Where I can reach you"
                    />
                  </JournalField>
                </div>

                <JournalField label="1. Which community or place are you called to serve?" required>
                  <input
                    className="od-field-input"
                    type="text"
                    required
                    value={form.community}
                    onChange={set("community")}
                    placeholder="Band council, co-op, neighbourhood, town — whatever fits"
                  />
                </JournalField>

                <JournalField label="2. Share one word or phrase in your community that feels 'off' or load-bearing." required>
                  <textarea
                    className="od-field-input"
                    required
                    rows={2}
                    value={form.q1}
                    onChange={set("q1")}
                    placeholder="A word people use that doesn't quite fit. Or one that carries more weight than it should."
                  />
                </JournalField>

                <JournalField label="3. What have you already tried to organise or strengthen? What happened?">
                  <textarea
                    className="od-field-input"
                    rows={3}
                    value={form.q2}
                    onChange={set("q2")}
                    placeholder="Don't polish it. What you tried and what actually happened — that's the real starting point."
                  />
                </JournalField>

                {error && (
                  <p
                    className="font-serif text-[15px]"
                    style={{ color: "#9c4a2f" }}
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-[13px] uppercase tracking-[0.18em] transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: "#b85a3e", color: "#f4ede0" }}
                    data-testid="odyssey-submit"
                  >
                    {submitting ? "Sending…" : "Begin the Odyssey →"}
                  </button>
                  <p
                    className="font-mono text-[12px] uppercase tracking-[0.14em]"
                    style={{ color: "rgba(31,61,46,0.4)" }}
                  >
                    Free · No account required · No spam
                  </p>
                </div>
              </form>
            </div>

          )}
        </section>

        {/* ═══════════════════════════════════ SUBMIT YOUR ART ══ */}
        <div className="od-trail-rule mt-4">
          <span>Leave your mark</span>
        </div>

        <section id="submit-art" className="pb-6" data-testid="odyssey-submit-art">
          <div
            className="od-card rounded-md px-6 py-7"
            style={{ background: "#f4ede0" }}
          >
            <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
              <span style={{ fontSize: "22px", lineHeight: 1, marginTop: "2px", flexShrink: 0 }}>🌿</span>
              <div>
                <p
                  className="font-serif text-[17px] font-medium mb-2 tracking-tight"
                  style={{ color: "#1f3d2e" }}
                >
                  Are you an artist from a community this trail passes through?
                </p>
                <p
                  className="font-serif text-[16px] leading-[1.65] mb-4"
                  style={{ color: "rgba(31,61,46,0.68)" }}
                >
                  If this landscape is yours — if you've lived at the headwaters — we want your work here.
                  Any medium. Any format. The only rule: it has to be yours and it has to be real.
                  When it's here, people on the trail can tip you directly using community tokens.
                </p>
                <a
                  href="mailto:bobbie@ourheadwaters.ca?subject=Trail%20Art%20Submission"
                  className="inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
                  style={{ color: "#b85a3e" }}
                >
                  Submit your work → bobbie@ourheadwaters.ca
                </a>
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.14em] mt-3 leading-[1.7]"
                  style={{ color: "rgba(31,61,46,0.38)" }}
                >
                  Include: your name · your community · a title if you have one · your XRPL address for tips (optional)
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="pb-24" />
      </div>
    </main>
  );
}

/* ── Journal field label ────────────────────────────────────────────────── */

function JournalField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactElement;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span
        className="font-mono text-[12px] uppercase tracking-[0.18em] od-pencil"
        style={{
          color: "rgba(31,61,46,0.65)",
          textDecorationColor: "rgba(184,90,62,0.25)",
        }}
      >
        {label}
        {required && <span aria-hidden style={{ color: "#b85a3e" }}> *</span>}
      </span>
      {children}
    </label>
  );
}
