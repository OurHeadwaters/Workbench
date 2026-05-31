import { useState, type FormEvent } from "react";
import { ApiError, postIntake } from "@/lib/api";
import testimonials from "@/data/testimonials";
import { TrailSignPost } from "@/components/TrailSignPost";
import { AmbientBackground, GrainOverlay, ScrollReveal } from "@/components/AmbientBackground";

interface IntakeFormState {
  name: string;
  email: string;
  community: string;
  role: string;
  whatTheyNeed: string;
  website: string; // honeypot
}

const EMPTY_INTAKE: IntakeFormState = {
  name: "",
  email: "",
  community: "",
  role: "",
  whatTheyNeed: "",
  website: "",
};

export function HomePage() {
  const [form, setForm] = useState<IntakeFormState>(EMPTY_INTAKE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedName, setConfirmedName] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await postIntake({
        name: form.name.trim(),
        email: form.email.trim(),
        community: form.community.trim(),
        role: form.role.trim() || undefined,
        whatTheyNeed: form.whatTheyNeed.trim(),
      });
      setConfirmedName(res.name);
      setForm(EMPTY_INTAKE);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not send your message just now. Try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="home-page min-h-screen w-full" style={{ background: "#0F1C18" }}>

      {/* ── hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "88vh", background: "#0F1C18" }}
        data-testid="home-header"
      >
        {/* Aurora ambient */}
        <AmbientBackground variant="aurora" />
        {/* Grain */}
        <GrainOverlay opacity={0.035} />
        {/* Topographic contour lines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 od-topo" style={{ opacity: 0.06 }} />
        {/* Radial gradient fade to dark at bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(10,20,14,0.2) 0%, rgba(10,20,14,0.0) 50%, rgba(10,20,14,0.9) 100%)",
          }}
        />
        {/* Edge vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 120% 80% at 50% 50%, transparent 45%, rgba(8,16,12,0.45) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[42rem] px-6 sm:px-8 pt-20 pb-20 text-center flex flex-col items-center justify-center" style={{ minHeight: "88vh" }}>

          {/* The Shore eyebrow */}
          <p
            className="font-mono text-[8px] uppercase tracking-[0.32em] mb-6"
            style={{ color: "rgba(212,160,23,0.50)" }}
          >
            The Shore · Home Base
          </p>

          {/* Eagle mark — centred, luminous */}
          <div className="flex justify-center mb-8" data-testid="home-eyebrow">
            <img
              src={`${import.meta.env.BASE_URL}eagle-mark.svg`}
              alt="Headwaters — Northwestern Ontario"
              style={{
                height: 72, width: "auto", objectFit: "contain",
                filter: "brightness(1.15) drop-shadow(0 0 18px rgba(212,160,23,0.25))",
              }}
            />
          </div>

          {/* Byline */}
          <p
            className="font-serif mb-0.5 leading-tight"
            data-testid="home-practitioner-byline"
          >
            <a
              href={`${import.meta.env.BASE_URL}bio`}
              className="hover:opacity-85 transition-opacity"
              style={{ color: "#f4ede0" }}
            >
              <span
                className="block font-serif tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", color: "#f4ede0", fontStyle: "italic" }}
              >
                Bobbie Parr
              </span>
              <span
                className="block font-serif"
                style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)", color: "#d4a017", lineHeight: 1.3 }}
              >
                Headwaters Practitioner
              </span>
              <span
                className="block font-mono text-[10px] uppercase tracking-[0.28em] mt-1"
                style={{ color: "rgba(244,237,224,0.40)" }}
              >
                Northwestern Ontario
              </span>
            </a>
          </p>

          {/* Mantra — the three lines, large cinematic serif */}
          <h1
            className="font-serif leading-[1.12] tracking-tight mt-8 mb-9"
            style={{
              fontSize: "clamp(2rem, 7vw, 3.6rem)",
              color: "#f4ede0",
              textShadow: "0 2px 24px rgba(0,0,0,0.7)",
            }}
            data-testid="home-title"
          >
            Build it.<br />
            Hand it off.<br />
            <span style={{ color: "#d4a017", fontStyle: "italic" }}>Community Runs It.</span>
          </h1>

          {/* Service description — glassmorphic dark panel */}
          <div
            className="rounded-md mx-auto mb-10 px-6 py-5 text-left w-full"
            style={{
              background: "rgba(15,28,24,0.72)",
              border: "1px solid rgba(212,160,23,0.22)",
              maxWidth: 500,
              boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(244,237,224,0.04)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p
              className="font-serif leading-[1.6] mb-3"
              style={{ fontSize: "clamp(0.95rem, 2.6vw, 1.05rem)", color: "rgba(244,237,224,0.88)" }}
              data-testid="home-tagline"
            >
              For communities that want to own what they build — resilient food systems and community-run economies, handed off without lock-in.
            </p>
            <p
              className="font-serif text-[13px] leading-[1.65] mb-3 pt-3"
              style={{ color: "rgba(244,237,224,0.52)", borderTop: "1px solid rgba(244,237,224,0.07)" }}
            >
              Income enters at the practitioner's headwaters. It flows through four buckets in order — costs, reserve, reinvestment, community overflow — and nothing moves downstream until the bucket above it is full. Not a theory. A machine already running.
            </p>
            <p
              className="font-serif text-[12px] leading-[1.65] mb-3 pt-3"
              style={{ color: "rgba(244,237,224,0.38)", borderTop: "1px solid rgba(244,237,224,0.05)", fontStyle: "italic" }}
            >
              The community is the watershed. Water flows from the hearth outward — Salt Box → Lodge → Bench → Standby → Community Hall → The Wild — and back again. Six zones, one neighbourhood, all of it connected.
            </p>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "rgba(212,160,23,0.8)" }}
              data-testid="home-name-hierarchy"
            >
              Practitioner-built · Flat fee · No retainer
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <a
              href="#conversation"
              className="btn-plaque"
              style={{ fontSize: "0.625rem", letterSpacing: "0.2em" }}
              data-testid="hero-cta-primary"
            >
              Start a conversation →
            </a>
            <a
              href={`${import.meta.env.BASE_URL}services`}
              className="inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all hover:border-white/40"
              style={{
                background: "transparent",
                border: "1px solid rgba(244,237,224,0.18)",
                color: "rgba(244,237,224,0.65)",
              }}
              data-testid="hero-cta-services"
            >
              What it looks like to build →
            </a>
          </div>

          {/* Community member entry point */}
          <div
            className="mt-8 rounded-md px-5 py-4 w-full text-left"
            style={{
              maxWidth: 480,
              background: "rgba(212,160,23,0.07)",
              border: "1px solid rgba(212,160,23,0.22)",
            }}
            data-testid="hero-community-entry"
          >
            <p
              className="font-mono text-[9px] uppercase tracking-[0.24em] mb-2"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              For community members
            </p>
            <p
              className="font-serif text-[15px] leading-[1.55] mb-3"
              style={{ color: "rgba(244,237,224,0.78)" }}
            >
              Is your community ready to run its own economy?
            </p>
            <a
              href={`${import.meta.env.BASE_URL}map`}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-75"
              style={{ color: "#d4a017" }}
              data-testid="hero-community-map-link"
            >
              Read the neighbourhood map — orient before the Odyssey →
            </a>
            <a
              href="/north-star/"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60 mt-2"
              style={{ color: "rgba(244,237,224,0.38)" }}
              data-testid="hero-tester-portal-link"
            >
              Step inside the living map → Tester Portal
            </a>
          </div>

          {/* Gord the owl */}
          <p
            className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(244,237,224,0.18)" }}
          >
            Gord the owl waits in the Arc — message-in-a-bottle feedback welcome.
          </p>

          {/* Youth Odyssey micro-link */}
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em]">
            <a
              href={`${import.meta.env.BASE_URL}story`}
              className="transition-opacity hover:opacity-70"
              style={{ color: "rgba(244,237,224,0.28)" }}
              data-testid="hero-story-link"
            >
              Youth Odyssey — 4 phases · 8 stations →
            </a>
          </p>

          {/* Scroll indicator */}
          <div className="mt-10 flex flex-col items-center gap-2 opacity-30">
            <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, transparent, rgba(244,237,224,0.6))" }} />
            <span className="font-mono text-[8px] uppercase tracking-[0.28em]" style={{ color: "#f4ede0" }}>Scroll</span>
          </div>
        </div>
      </section>

      {/* ── odyssey ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: "#1f3d2e",
          backgroundImage: `url("${import.meta.env.BASE_URL}odyssey/hero-banner.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center 55%",
        }}
        data-testid="home-odyssey"
      >
        {/* Darkening overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(20,46,32,0.72) 0%, rgba(20,46,32,0.88) 100%)",
          }}
        />
        {/* Topographic overlay */}
        <div aria-hidden className="absolute inset-0 od-topo" style={{ opacity: 0.15 }} />

        <div className="relative z-10 px-6 sm:px-10 py-16 sm:py-20">
          <div className="mx-auto max-w-[38rem] text-center">
            {/* Eyebrow with gold rule */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-6" style={{ background: "rgba(212,160,23,0.6)" }} />
              <p
                className="font-mono text-[9.5px] uppercase tracking-[0.32em]"
                style={{ color: "rgba(212,160,23,0.85)" }}
              >
                Headwaters Odyssey
              </p>
              <div className="h-px w-6" style={{ background: "rgba(212,160,23,0.6)" }} />
            </div>

            <h2
              className="font-serif text-3xl sm:text-4xl tracking-tight leading-[1.12] mb-5"
              style={{ color: "#f4ede0" }}
            >
              Become the hempcrete your community needs —<br className="hidden sm:block" /> whether the flood comes or not.
            </h2>
            <p
              className="font-serif text-base sm:text-[16.5px] leading-[1.65] mb-3"
              style={{ color: "rgba(244,237,224,0.82)" }}
            >
              A guided, self-paced pioneer journey that turns Codetry — language, discipline, and constellation practice — into real community infrastructure.
            </p>
            <p
              className="font-serif text-[14px] italic leading-[1.6] mb-9"
              style={{ color: "rgba(244,237,224,0.55)" }}
            >
              Built for headwaters people who are already organising locally.
            </p>

            {/* Trail fork sign — visual junction of both paths */}
            <div className="flex justify-center mb-8">
              <TrailSignPost mode="fork" compact />
            </div>

            {/* Primary CTA — adult practitioner path */}
            <div className="flex flex-col items-center justify-center gap-3">
              <a
                href={`${import.meta.env.BASE_URL}odyssey`}
                className="inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-all hover:opacity-90"
                style={{ background: "#b85a3e", color: "#f4ede0" }}
                data-testid="odyssey-cta"
              >
                Begin the Odyssey →
              </a>
              <a
                href={`${import.meta.env.BASE_URL}story`}
                className="font-mono text-[10px] uppercase tracking-[0.16em] transition-opacity hover:opacity-80"
                style={{ color: "rgba(244,237,224,0.42)" }}
                data-testid="story-cta"
              >
                For youth and families →
              </a>
            </div>

            {/* Trail tags row */}
            <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
              {[
                { label: "Free",                    href: null },
                { label: "Self-paced",              href: null },
                { label: "5 Phases · 20 Stations",  href: null },
                { label: "Youth Odyssey: 4 phases · 8 stations", href: `${import.meta.env.BASE_URL}story` },
              ].map(({ label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    className="font-mono text-[8.5px] uppercase tracking-[0.14em] underline-offset-2 hover:opacity-80 transition-opacity"
                    style={{ color: "rgba(212,160,23,0.65)", textDecoration: "underline" }}
                  >
                    {label}
                  </a>
                ) : (
                  <span
                    key={label}
                    className="font-mono text-[8.5px] uppercase tracking-[0.14em]"
                    style={{ color: "rgba(244,237,224,0.4)" }}
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── aquifer ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: "#020812" }}
        data-testid="home-aquifer"
      >
        {/* Deep-water base gradient — dark blue-black */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #020812 0%, #040f1e 50%, #020c18 100%)",
          }}
        />
        {/* Luminous cyan radial glow — centred, underground-water feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 aquifer-glow"
          style={{
            background: "radial-gradient(ellipse 80% 55% at 50% 60%, rgba(14,165,233,0.13) 0%, rgba(6,82,140,0.08) 40%, transparent 70%)",
          }}
        />
        {/* Secondary glow — cooler, deeper */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 aquifer-glow-secondary"
          style={{
            background: "radial-gradient(ellipse 50% 35% at 50% 75%, rgba(56,189,248,0.07) 0%, transparent 60%)",
          }}
        />
        {/* Topographic contour lines — same pattern as other sections */}
        <div aria-hidden className="pointer-events-none absolute inset-0 od-topo" style={{ opacity: 0.07 }} />
        {/* Grain overlay */}
        <GrainOverlay opacity={0.04} />
        {/* Top fade from Odyssey green into deep water */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: 80,
            background: "linear-gradient(to bottom, rgba(20,46,32,0.55), transparent)",
          }}
        />
        {/* Bottom fade into page background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: 80,
            background: "linear-gradient(to top, #0F1C18, transparent)",
          }}
        />

        <div className="relative z-10 px-6 sm:px-10 py-20 sm:py-24">
          <div className="mx-auto max-w-[38rem] text-center">
            <ScrollReveal>
              {/* Eyebrow with cyan rule */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-6" style={{ background: "rgba(56,189,248,0.45)" }} />
                <p
                  className="font-mono text-[9.5px] uppercase tracking-[0.32em]"
                  style={{ color: "rgba(56,189,248,0.70)" }}
                >
                  Identity Infrastructure
                </p>
                <div className="h-px w-6" style={{ background: "rgba(56,189,248,0.45)" }} />
              </div>

              <h2
                className="font-serif tracking-tight leading-[1.1] mb-5"
                style={{
                  fontSize: "clamp(2.2rem, 7vw, 3.4rem)",
                  color: "#e8f4f8",
                  textShadow: "0 0 60px rgba(56,189,248,0.18), 0 2px 24px rgba(0,0,0,0.8)",
                }}
              >
                The Aquifer
              </h2>

              <p
                className="font-serif leading-[1.65] mb-9"
                style={{
                  fontSize: "clamp(1rem, 2.8vw, 1.15rem)",
                  color: "rgba(200,232,248,0.72)",
                }}
              >
                The identity infrastructure beneath everything — how the ledger holds, how trust is carried, how the system remembers.
              </p>

              {/* CTA */}
              <div className="inline-flex flex-col items-center gap-3">
                <a
                  href={`${import.meta.env.BASE_URL}aquifer`}
                  className="inline-flex items-center justify-center gap-2 rounded-sm px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.20em] transition-all hover:opacity-85"
                  style={{
                    background: "rgba(14,165,233,0.15)",
                    border: "1px solid rgba(56,189,248,0.40)",
                    color: "rgba(186,230,253,0.95)",
                    boxShadow: "0 0 32px rgba(14,165,233,0.12), inset 0 0 0 1px rgba(56,189,248,0.08)",
                  }}
                  data-testid="aquifer-cta"
                >
                  Enter the Aquifer →
                </a>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {["XRPL-anchored", "SHA-256 hash witnessing", "DID-compatible"].map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[8.5px] uppercase tracking-[0.14em]"
                      style={{ color: "rgba(56,189,248,0.45)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div
        className="mx-auto max-w-[52rem] px-6 sm:px-8"
        style={{ background: "#0F1C18" }}
      >

        {/* ── hero photo ── */}
        <ScrollReveal>
          <div
            className="mt-10 w-full overflow-hidden rounded-lg"
            style={{
              aspectRatio: "16/9",
              boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
              border: "1px solid rgba(244,237,224,0.07)",
            }}
            data-testid="hero-photo-slot"
          >
            <img
              src={`${import.meta.env.BASE_URL}hero-harvest.jpeg`}
              alt="Community potato harvest — neighbours of all ages sorting potatoes together in a field near Dryden, Ontario"
              className="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>

        <div
          className="my-12 sm:my-16 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(244,237,224,0.12), transparent)" }}
        />

        {/* ── how it starts ── */}
        <section data-testid="home-how-it-starts">
          <ScrollReveal>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
              style={{ color: "#d4a017" }}
            >
              the first step
            </p>
            <h2
              className="font-serif text-3xl tracking-tight mb-1"
              style={{ color: "#f4ede0" }}
              data-testid="how-it-starts-heading"
            >
              A trial period, not a contract
            </h2>
            <p
              className="font-serif text-[15px] italic mb-8"
              style={{ color: "rgba(244,237,224,0.50)" }}
            >
              Every engagement starts with a defined phase — a fixed fee, a clear scope, and a real deliverable. No retainer, no open-ended commitment.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-10">
            {[
              { step: "1", label: "Send a message", body: "Tell us what your community is trying to build. A sentence or two is enough." },
              { step: "2", label: "Phase 1", body: "6–8 weeks, fixed fee, bounded scope. You get something real at the end whether or not it continues." },
              { step: "3", label: "Decision point", body: "If the fit is right, the next phase begins. If not, you leave with something useful and no obligation." },
              { step: "4", label: "Continue", body: "Each phase has its own scope, fee, and deliverables. Renewed only if the work calls for it." },
            ].map(({ step, label, body }, i) => (
              <ScrollReveal key={step} delay={i * 70}>
                <div
                  className="rounded-lg p-5 h-full cin-card"
                >
                  <div
                    className="font-mono text-[11px] font-semibold mb-3 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "#d4a017", color: "#0F1C18" }}
                  >
                    {step}
                  </div>
                  <p className="font-serif text-[15px] tracking-tight mb-1.5" style={{ color: "#f4ede0" }}>{label}</p>
                  <p className="font-serif text-[13.5px] leading-[1.55]" style={{ color: "rgba(244,237,224,0.55)" }}>
                    {body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div
              className="rounded-lg px-5 py-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6"
              style={{
                borderColor: "#d4a017",
                borderStyle: "dashed",
                borderWidth: "1px",
                background: "rgba(212,160,23,0.05)",
              }}
              data-testid="flat-fee-callout"
            >
              <div
                className="shrink-0 rounded-sm px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em]"
                style={{ background: "#d4a017", color: "#0F1C18" }}
              >
                How we charge
              </div>
              <p className="font-serif text-[14px] leading-[1.55]" style={{ color: "rgba(244,237,224,0.65)" }}>
                <strong style={{ color: "#f4ede0" }}>Flat fee, not hourly.</strong>{" "}
                You own every deliverable at handoff — no licensing, no retainer required to keep it working. The community keeps the tools.
              </p>
            </div>

            <div
              className="rounded-lg p-6 sm:p-8 cin-card"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-4" style={{ color: "#d4a017" }}>
                phase fees
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "Phase 1", value: "$28,000", note: "6–8 weeks. Fixed fee, defined scope, real deliverable. Shorter engagement = reduced invoice." },
                  { label: "Phase 2+", value: "$18,000–$60,000", note: "Typical per-phase range depending on scope and duration. Phase 2 (the main build) commonly runs $52,000–$60,000 over 4–6 months; later phases step down as the community takes ownership. Each phase is confirmed with the community before work begins." },
                  { label: "Travel & expenses", value: "At cost", note: "Travel to site and expenses reimbursed at cost with receipts." },
                ].map(({ label, value, note }) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "rgba(244,237,224,0.38)" }}>{label}</p>
                    <p className="font-serif text-2xl tracking-tight mb-1.5" style={{ color: "#f4ede0" }}>{value}</p>
                    <p className="font-serif text-[13px] leading-[1.55]" style={{ color: "rgba(244,237,224,0.52)" }}>{note}</p>
                  </div>
                ))}
              </div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.14em] mt-6"
                style={{ color: "rgba(244,237,224,0.22)" }}
              >
                All fees CAD · excludes HST
              </p>
            </div>
          </ScrollReveal>
        </section>

        <div
          className="my-12 sm:my-16 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(244,237,224,0.10), transparent)" }}
        />

        {/* ── the work ── */}
        <section data-testid="home-work">
          <ScrollReveal>
            <div
              className="rounded-lg px-5 py-5 mb-8 relative overflow-hidden cin-card"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-08"
                style={{ background: "#d4a017" }}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] mb-2" style={{ color: "rgba(212,160,23,0.65)" }}>
                shipped · running · readable
              </p>
              <h2
                className="font-serif text-2xl sm:text-3xl tracking-tight"
                style={{ color: "#f4ede0" }}
                data-testid="work-heading"
              >
                The work
              </h2>
            </div>

            <p
              className="font-serif text-[15px] leading-[1.65] mb-6"
              style={{ color: "rgba(244,237,224,0.62)" }}
              data-testid="work-explainer"
            >
              Seven simple tools. One community economy. <strong style={{ color: "#f4ede0" }}>Headwaters is the practice</strong> — the food systems and economic development work. <strong style={{ color: "#f4ede0" }}>Codetry is the discipline it runs on</strong> — the method for building and handing over systems that communities own outright. Each tool connects to the next: learn the work, track the work, account for the work, and everything behind them that makes it run.
            </p>
          </ScrollReveal>

          {/* ── three entry cards ── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
            data-testid="link-services"
          >
            {[
              { label: "Community store", blurb: "Site selection, co-op structure, band financing, and day-one operations.", color: "#b85a3e", anchor: "store" },
              { label: "Platform & co-op", blurb: "Membership systems, governance tools, and shared community infrastructure.", color: "#1f3d2e", anchor: "platform" },
              { label: "Custom tool", blurb: "Purpose-built software for the specific problem in front of you.", color: "#c97c2e", anchor: "custom" },
            ].map(({ label, blurb, color, anchor }, i) => (
              <ScrollReveal key={label} delay={i * 60}>
                <a
                  href={`${import.meta.env.BASE_URL}services#${anchor}`}
                  className="block rounded-lg overflow-hidden cin-card h-full"
                >
                  <div
                    className="px-4 py-3.5"
                    style={{ background: color, borderBottom: "1px solid rgba(0,0,0,0.2)" }}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "#f4ede0" }}>{label}</p>
                  </div>
                  <div className="px-4 py-4">
                    <p className="font-serif text-[13px] leading-[1.55] mb-2" style={{ color: "rgba(244,237,224,0.60)" }}>{blurb}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color }}>See examples →</p>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          {/* ── Seven simple tools section ── */}
          <div data-testid="work-cards">

            <ScrollReveal>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.24em] mb-4"
                style={{ color: "#d4a017" }}
              >
                The core flow — learn → track → account
              </p>
            </ScrollReveal>

            <div className="space-y-2 mb-4">
              {[
                { icon: "📖", name: "The Handbook", sub: "Codetry Handbook", desc: "Where you start. A plain-language guide that teaches the Headwaters way of working — how to scope a job, how to hand it over, and how a community can run its own economy.", color: "#1f3d2e", testId: "work-card-handbook", href: "/codetry-handbook/" },
                { icon: "📋", name: "Practitioner's Guide", sub: "Practitioners Guide V2", desc: "Where your work lives. A structured reference that tracks each engagement — the scope, the phases, the decisions, and the handover. Keeps every project honest.", color: "#2a4d36", testId: "work-card-guide", href: "/practitioners-guide-v2/" },
                { icon: "📚", name: "The Accounts", sub: "Headwaters Books", desc: "Where the money is recorded. Tracks what came in, what went out, and what the work delivered — so the community always knows where it stands financially.", color: "#345c45", testId: "work-card-books", href: "/headwaters-books/" },
              ].map(({ icon, name, sub, desc, color, testId, href }, i) => (
                <ScrollReveal key={name} delay={i * 50}>
                  <div>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Opens in a new tab"
                      className="relative group flex rounded-lg p-4 gap-3.5 items-start cin-card"
                      style={{ borderLeft: `4px solid ${color}` }}
                      data-testid={testId}
                    >
                      <span className="text-2xl leading-none mt-0.5 shrink-0">{icon}</span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <p className="font-serif text-[15px] tracking-tight" style={{ color: "#f4ede0" }}>{name}</p>
                          <span className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: `${color}bb` }}>{sub}</span>
                        </div>
                        <p className="font-serif text-[13.5px] leading-[1.55]" style={{ color: "rgba(244,237,224,0.55)" }}>{desc}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" className="absolute top-2.5 right-2.5 w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" fill="none" stroke="#d4a017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 2H2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V6" /><path d="M6.5 1.5h2v2" /><path d="M9 1 5.5 4.5" /></svg>
                    </a>
                    {i < 2 && (
                      <div className="flex flex-col items-start pl-[2rem] py-1">
                        <div className="w-px h-3" style={{ background: color, opacity: 0.35 }} />
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] whitespace-nowrap" style={{ color, opacity: 0.7 }}>
                          {i === 0 ? "then track in" : "money flows to"}
                        </span>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Supporting layers divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: "rgba(244,237,224,0.10)" }} />
              <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "rgba(244,237,224,0.28)" }}>
                Supporting layers
              </p>
              <div className="flex-1 h-px" style={{ background: "rgba(244,237,224,0.10)" }} />
            </div>

            <p className="font-serif text-[13.5px] leading-[1.6] mb-4" style={{ color: "rgba(244,237,224,0.50)" }}>
              Four tools back up the core flow — they hold the evidence, the materials, the team, and the files that everything else draws from.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              {[
                { icon: "🔬", name: "Research Library", sub: "Northern Food Systems Library", desc: "Curated research, reports, and links about northern food systems — so every decision is grounded in real data, not guesswork.", color: "#b85a3e", testId: "work-card-library", href: "/library/" },
                { icon: "🖨️", name: "Print Marketing Suite", sub: "Headwaters Print Marketing", desc: "Print-ready flyers, posters, rack cards, and forms for every public-facing moment — from a farmers market table to a band council pitch.", color: "#9c4a2f", testId: "work-card-print", href: "/print-marketing/" },
                { icon: "🚢", name: "Crew Manifest", sub: "Codetry Ship", desc: "Shows who is on which project, what role they fill, and how the crew fits together — so nothing falls through the cracks.", color: "#3a5070", testId: "work-card-ship", href: "/" },
                { icon: "🗄️", name: "Media Library", sub: "Headwaters API", desc: "Stores photos, documents, and media assets so every other tool can pull from one reliable source — no more hunting for the right logo version.", color: "#2a4560", testId: "work-card-media", href: "/media/" },
              ].map(({ icon, name, sub, desc, color, testId, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Opens in a new tab"
                  className="relative group flex rounded-lg p-4 gap-3 items-start cin-card"
                  style={{ borderLeft: `4px solid ${color}` }}
                  data-testid={testId}
                >
                  <span className="text-xl leading-none mt-0.5 shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                      <p className="font-serif text-[14px] tracking-tight shrink-0" style={{ color: "#f4ede0" }}>{name}</p>
                      <span className="font-mono text-[9px] uppercase tracking-[0.08em] block truncate min-w-0 max-w-full" style={{ color: `${color}cc` }}>{sub}</span>
                    </div>
                    <p className="font-serif text-[13px] leading-[1.5]" style={{ color: "rgba(244,237,224,0.50)" }}>{desc}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" className="absolute top-2.5 right-2.5 w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" fill="none" stroke="#d4a017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 2H2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V6" /><path d="M6.5 1.5h2v2" /><path d="M9 1 5.5 4.5" /></svg>
                </a>
              ))}
            </div>

            {/* How it fits callout */}
            <ScrollReveal>
              <div
                className="mt-4 rounded-lg px-5 py-5 cin-card"
                data-testid="work-seven-tools-callout"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] mb-2" style={{ color: "rgba(212,160,23,0.60)" }}>How it all connects</p>
                <p className="font-serif text-[14px] leading-[1.65]" style={{ color: "rgba(244,237,224,0.72)" }}>
                  <strong style={{ color: "#f4ede0" }}>The Handbook</strong> teaches you how Headwaters works.{" "}
                  <strong style={{ color: "#f4ede0" }}>The Practitioner's Guide</strong> captures each job you do.{" "}
                  <strong style={{ color: "#f4ede0" }}>The Accounts</strong> keep the money honest. Behind them: the{" "}
                  <strong style={{ color: "#f4ede0" }}>Research Library</strong> grounds decisions in real evidence, the{" "}
                  <strong style={{ color: "#f4ede0" }}>Print Suite</strong> puts everything on paper, the{" "}
                  <strong style={{ color: "#f4ede0" }}>Crew Manifest</strong> shows who's doing what, and the{" "}
                  <strong style={{ color: "#f4ede0" }}>Media Library</strong> keeps the files in one place.
                  {" "}Seven simple tools. One system. Yours.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-8 text-center">
            <a
              href={`${import.meta.env.BASE_URL}work`}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] border-b pb-0.5 transition-opacity hover:opacity-70"
              style={{ color: "#d4a017", borderColor: "#d4a017" }}
              data-testid="work-see-case-studies"
            >
              See case studies →
            </a>
          </div>
        </section>

        {/* ── social proof ── */}
        <section data-testid="home-testimonial">
          <ScrollReveal>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em] mb-6"
              style={{ color: "#d4a017" }}
            >
              from the communities
            </p>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 80}>
                <blockquote
                  className="rounded-lg border-l-4 pl-6 py-3 cin-card pr-5"
                  style={{ borderColor: "#d4a017" }}
                >
                  <p
                    className="font-serif text-xl leading-[1.45] italic mb-5"
                    style={{ color: "#f4ede0" }}
                    data-testid="testimonial-quote"
                  >
                    "{t.quote}"
                  </p>
                  <footer className="flex flex-col gap-0.5">
                    <p className="font-mono text-[11px] tracking-tight" style={{ color: "rgba(244,237,224,0.75)" }} data-testid="testimonial-name">{t.name}</p>
                    {t.title && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(244,237,224,0.38)" }} data-testid="testimonial-title">{t.title}</p>
                    )}
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(244,237,224,0.38)" }} data-testid="testimonial-community">{t.community}</p>
                  </footer>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <div
          className="my-12 sm:my-16 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(244,237,224,0.10), transparent)" }}
        />

        {/* ── start a conversation ── */}
        <section id="conversation" data-testid="home-intake">
          <ScrollReveal>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
              style={{ color: "#d4a017" }}
            >
              get in touch
            </p>
            <h2
              className="font-serif text-3xl tracking-tight mb-1"
              style={{ color: "#f4ede0" }}
              data-testid="intake-heading"
            >
              Start a conversation
            </h2>

            <div className="space-y-3 font-serif text-[15px] leading-[1.65] mt-4 mb-8" style={{ color: "rgba(244,237,224,0.65)" }} data-testid="intake-intro">
              <p>
                Tell us a little about your community and what you are trying to build.
                That is enough to start. Bobbie will write back with a plain-language
                response — no sales pitch, no proposal deck. Usually within a day or two.
              </p>
            </div>
          </ScrollReveal>

          {confirmedName ? (
            <div
              className="rounded-xl p-7 sm:p-9 space-y-4 cin-card"
              role="status"
              aria-live="polite"
              data-testid="intake-confirmation"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "#d4a017" }}>received</p>
              <h3 className="font-serif text-2xl leading-tight" style={{ color: "#f4ede0" }}>Thank you, {confirmedName}.</h3>
              <p className="font-serif text-base leading-relaxed" style={{ color: "rgba(244,237,224,0.60)" }}>
                We have your message. Bobbie will read it and write back — no sales pitch, no proposal deck.
              </p>
              <button
                type="button"
                onClick={() => setConfirmedName(null)}
                className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                style={{ color: "rgba(244,237,224,0.50)" }}
                data-testid="intake-send-another"
              >
                send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-5"
              data-testid="form-intake"
              noValidate
            >
              {/* honeypot */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
              >
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <IntakeField
                  id="intake-name"
                  label="Your name"
                  required
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  testId="input-intake-name"
                />
                <IntakeField
                  id="intake-email"
                  label="Email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  testId="input-intake-email"
                />
                <IntakeField
                  id="intake-community"
                  label="Community or organisation"
                  required
                  value={form.community}
                  onChange={(v) => setForm({ ...form, community: v })}
                  testId="input-intake-community"
                />
                <IntakeField
                  id="intake-role"
                  label="Your role (optional)"
                  value={form.role}
                  onChange={(v) => setForm({ ...form, role: v })}
                  testId="input-intake-role"
                  placeholder="Chief, Manager, Director…"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="intake-need"
                  className="block font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(244,237,224,0.55)" }}
                >
                  What are you trying to build?{" "}
                  <span style={{ color: "#d4a017" }}>*</span>
                </label>
                <textarea
                  id="intake-need"
                  required
                  rows={4}
                  value={form.whatTheyNeed}
                  onChange={(e) => setForm({ ...form, whatTheyNeed: e.target.value })}
                  placeholder="A sentence or two is enough. What is the problem, and what would a good outcome look like for your community?"
                  className="block w-full rounded-md px-3 py-2.5 font-sans text-base focus:outline-none focus:ring-1 resize-y transition-all"
                  style={{
                    background: "rgba(244,237,224,0.04)",
                    border: "1px solid rgba(244,237,224,0.14)",
                    color: "#f4ede0",
                    caretColor: "#d4a017",
                  }}
                  data-testid="input-intake-need"
                />
              </div>

              {error ? (
                <p
                  role="alert"
                  className="font-sans text-sm text-destructive"
                  data-testid="intake-error"
                >
                  {error}
                </p>
              ) : null}

              <p
                className="font-sans text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Your name and email are stored to follow up on your submission.{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:opacity-80"
                >
                  See our privacy policy.
                </a>
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-plaque disabled:opacity-60 disabled:cursor-not-allowed"
                  data-testid="button-intake-submit"
                >
                  {submitting ? "Sending…" : "Send message →"}
                </button>
                <a
                  href="mailto:bobbie@ourheadwaters.ca"
                  className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                  style={{ color: "rgba(244,237,224,0.38)" }}
                  data-testid="intake-email-fallback"
                >
                  or email directly
                </a>
              </div>
            </form>
          )}
        </section>

        <div
          className="my-12 sm:my-16 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(244,237,224,0.10), transparent)" }}
        />

        {/* ── the practitioner ── */}
        <section data-testid="home-about">
          <ScrollReveal>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
              style={{ color: "#d4a017" }}
            >
              the practitioner
            </p>
            <h2
              className="font-serif text-3xl tracking-tight mb-1"
              style={{ color: "#f4ede0" }}
              data-testid="about-heading"
            >
              Bobbie Parr
            </h2>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em] mb-6"
              style={{ color: "rgba(244,237,224,0.35)" }}
            >
              headwaters · dryden, ontario
            </p>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <a
              href={`${import.meta.env.BASE_URL}bio`}
              className="block mb-6 w-full overflow-hidden rounded-lg group"
              style={{
                aspectRatio: "4/3",
                maxHeight: "320px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
                border: "1px solid rgba(244,237,224,0.07)",
              }}
              data-testid="bio-photo-slot"
            >
              <img
                src={`${import.meta.env.BASE_URL}bobbie-bio.jpeg`}
                alt="Bobbie Parr with a Parr's Jars crate of fresh local produce, outdoors in Northwestern Ontario"
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" style={{ objectPosition: "center 82%" }}
              />
            </a>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <p
              className="font-serif text-[15px] leading-[1.65] mb-8"
              style={{ color: "rgba(244,237,224,0.60)" }}
              data-testid="about-body"
            >
              Community development degree, years on the ground in northern communities, and the founder
              of Parr&rsquo;s Jars — a small preserves business out of the bush near Dryden that keeps
              her hands in the actual work the operating plans are about. She built Headwaters to solve
              the problems she couldn&rsquo;t find help for: how a northern organisation plans a food
              system, owns its own tools, and hands them forward without a consultant in the room. The
              voice is plain, dollar-honest, no startup-pitch tone.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="#conversation"
                className="btn-plaque"
                data-testid="about-cta-conversation"
              >
                Start a conversation →
              </a>
              <a
                href={`${import.meta.env.BASE_URL}bio`}
                className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                style={{ color: "rgba(244,237,224,0.38)" }}
                data-testid="link-bio"
              >
                Is Bobbie the right fit? Read the bio →
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* ── footer ── */}
        <footer
          className="mt-20 pt-8"
          style={{ borderTop: "1px solid rgba(244,237,224,0.08)" }}
          data-testid="home-footer"
        >
          {/* Community partner circle ring */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <p className="font-mono text-[8px] uppercase tracking-[0.28em]" style={{ color: "rgba(244,237,224,0.22)" }}>
              Community partners
            </p>
            <div className="flex items-center justify-center">
              {[
                { initials: "HW", label: "Headwaters Collective",    color: "#1f3d2e", accent: "#d4a017" },
                { initials: "BN", label: "Boreal North Network",     color: "#2a4560", accent: "#7ab3cc" },
                { initials: "CF", label: "Cedar Falls Community",    color: "#3d2010", accent: "#c97c2e" },
                { initials: "GP", label: "Green Pine Co-op",         color: "#1f3020", accent: "#6aaa78" },
                { initials: "KL", label: "Kenora Lake Initiative",   color: "#1c2e3e", accent: "#7ab3cc" },
                { initials: "WR", label: "Wabigoon River Institute", color: "#2e1c0a", accent: "#b85a3e" },
              ].map((p, i) => (
                <div
                  key={p.initials}
                  title={p.label}
                  aria-label={p.label}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: p.color,
                    border: `2px solid rgba(244,237,224,0.10)`,
                    boxShadow: "0 0 0 1.5px rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: i === 0 ? 0 : -10,
                    position: "relative",
                    zIndex: 6 - i,
                    cursor: "default",
                    transition: "transform 0.18s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; }}
                >
                  <span
                    className="font-mono"
                    style={{ fontSize: "9px", letterSpacing: "0.08em", color: p.accent, fontWeight: 600 }}
                  >
                    {p.initials}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p
            className="font-serif text-[13px] italic text-center mb-8"
            style={{ color: "rgba(244,237,224,0.25)" }}
          >
            Headwaters is a living watershed, not a product company.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="signoff" style={{ color: "rgba(244,237,224,0.35)" }}>— bobbie parr · headwaters · dryden, ontario</p>
            <div className="flex flex-wrap items-center gap-5">
              {[
                { label: "What is Codetry?", href: `${import.meta.env.BASE_URL}codetry`, testId: "footer-what-is-codetry-link" },
                { label: "Privacy", href: "/privacy" },
                { label: "Listen", href: `${import.meta.env.BASE_URL}listen`, testId: "footer-listen-link" },
                { label: "Operator", href: `${import.meta.env.BASE_URL}operator`, testId: "footer-operator-link" },
                { label: "Sign on", href: `${import.meta.env.BASE_URL}sign-on`, testId: "footer-sign-on-link" },
                { label: "Read the origin", href: `${import.meta.env.BASE_URL}founding-stories`, testId: "footer-origin-link" },
              ].map(({ label, href, testId }) => (
                <a
                  key={label}
                  href={href}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-70 transition-opacity"
                  style={{ color: "rgba(244,237,224,0.28)" }}
                  {...(testId ? { "data-testid": testId } : {})}
                >
                  {label}
                </a>
              ))}
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(244,237,224,0.18)" }}>
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}

interface IntakeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  testId: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

function IntakeField({
  id,
  label,
  value,
  onChange,
  testId,
  type = "text",
  required,
  placeholder,
}: IntakeFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: "rgba(244,237,224,0.55)" }}
      >
        {label}
        {required ? (
          <span className="ml-1" style={{ color: "#d4a017" }}>*</span>
        ) : null}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={type === "email" ? "email" : "off"}
        className="block w-full rounded-md px-3 py-2.5 font-sans text-base focus:outline-none focus:ring-1 transition-all"
        style={{
          background: "rgba(244,237,224,0.04)",
          border: "1px solid rgba(244,237,224,0.14)",
          color: "#f4ede0",
          caretColor: "#d4a017",
        }}
        data-testid={testId}
      />
    </div>
  );
}

type CardAccent = "rust" | "evergreen" | "sage" | "amber";

const ACCENT_STYLES: Record<CardAccent, { border: string; bg: string; band: string; bandFg: string }> = {
  rust:      { border: "hsl(14 64% 36%)",  bg: "hsl(var(--card))", band: "hsl(14 64% 36%)",  bandFg: "hsl(38 36% 96%)" },
  evergreen: { border: "hsl(145 36% 22%)", bg: "hsl(var(--card))", band: "hsl(145 36% 22%)", bandFg: "hsl(38 36% 96%)" },
  sage:      { border: "hsl(145 18% 45%)", bg: "hsl(var(--card))", band: "hsl(145 18% 45%)", bandFg: "hsl(38 36% 96%)" },
  amber:     { border: "hsl(30 40% 50%)",  bg: "hsl(var(--card))", band: "hsl(30 40% 50%)",  bandFg: "hsl(38 36% 96%)" },
};

function CardDescription({ hook, detail }: { hook: string; detail: string }) {
  return (
    <div className="space-y-1">
      <p className="font-serif text-[15px] font-medium leading-[1.45]">
        {hook}
      </p>
      <p
        className="font-serif text-[13px] leading-[1.55]"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {detail}
      </p>
    </div>
  );
}

interface DemoCardProps {
  eyebrow: string;
  title: string;
  href: string;
  testId: string;
  accent?: CardAccent;
  hook?: string;
  detail?: string;
  description?: string;
  thumb?: string;
  thumbAlt?: string;
}

function DemoCard({ eyebrow, title, hook, detail, description, href, testId, accent = "rust", thumb, thumbAlt }: DemoCardProps) {
  const { border, bg, band, bandFg } = ACCENT_STYLES[accent];
  return (
    <a
      href={href}
      className="block rounded-md border overflow-hidden transition-opacity hover:opacity-90"
      style={{ borderColor: "hsl(var(--card-border))", background: bg }}
      data-testid={testId}
    >
      {/* coloured header band */}
      <div
        className={`px-5 ${thumb ? "py-3" : "py-7"}`}
        style={{ background: band, color: bandFg }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">{eyebrow}</p>
      </div>
      {thumb && (
        <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img
            src={`${import.meta.env.BASE_URL}${thumb}`}
            alt={thumbAlt ?? title}
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p className="font-serif text-[17px] font-medium tracking-tight mb-2">
          {title}
        </p>
        {hook && detail ? (
          <CardDescription hook={hook} detail={detail} />
        ) : (
          <p className="font-serif text-[14px] leading-[1.55]" style={{ color: "hsl(var(--muted-foreground))" }}>
            {description}
          </p>
        )}
        <p
          className="mt-3 font-mono text-xs uppercase tracking-[0.18em]"
          style={{ color: border }}
        >
          View demo →
        </p>
      </div>
    </a>
  );
}

interface ComingSoonCardProps {
  eyebrow: string;
  title: string;
  testId: string;
  accent?: CardAccent;
  hook?: string;
  detail?: string;
  description?: string;
  thumb?: string;
  thumbAlt?: string;
}

function ComingSoonCard({ eyebrow, title, hook, detail, description, testId, accent = "amber", thumb, thumbAlt }: ComingSoonCardProps) {
  const { border, bg, band, bandFg } = ACCENT_STYLES[accent];
  return (
    <div
      className="block rounded-md border overflow-hidden opacity-75"
      style={{
        borderColor: "hsl(var(--card-border))",
        borderStyle: "dashed",
        background: bg,
      }}
      data-testid={testId}
    >
      {/* coloured header band */}
      <div
        className={`px-5 ${thumb ? "py-3" : "py-7"}`}
        style={{ background: band, color: bandFg, opacity: 0.85 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">{eyebrow}</p>
      </div>
      {thumb && (
        <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img
            src={`${import.meta.env.BASE_URL}${thumb}`}
            alt={thumbAlt ?? title}
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p className="font-serif text-[17px] font-medium tracking-tight mb-2">
          {title}
        </p>
        {hook && detail ? (
          <CardDescription hook={hook} detail={detail} />
        ) : (
          <p className="font-serif text-[14px] leading-[1.55]" style={{ color: "hsl(var(--muted-foreground))" }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

interface WorkCardProps {
  eyebrow: string;
  title: string;
  href: string;
  testId: string;
  accent?: CardAccent;
  hook?: string;
  detail?: string;
  description?: string;
  external?: boolean;
  thumb?: string;
  thumbAlt?: string;
}

function WorkCard({ eyebrow, title, hook, detail, description, href, testId, accent = "evergreen", external, thumb, thumbAlt }: WorkCardProps) {
  const { border, bg, band, bandFg } = ACCENT_STYLES[accent];
  return (
    <a
      href={href}
      className="block rounded-md border overflow-hidden transition-opacity hover:opacity-90"
      style={{ borderColor: "hsl(var(--card-border))", background: bg }}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-testid={testId}
    >
      {/* coloured header band */}
      <div
        className={`px-5 ${thumb ? "py-3" : "py-7"}`}
        style={{ background: band, color: bandFg }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.22em]">{eyebrow}</p>
      </div>
      {thumb && (
        <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img
            src={`${import.meta.env.BASE_URL}${thumb}`}
            alt={thumbAlt ?? title}
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p className="font-serif text-[17px] font-medium tracking-tight mb-2">
          {title}
        </p>
        {hook && detail ? (
          <CardDescription hook={hook} detail={detail} />
        ) : (
          <p className="font-serif text-[14px] leading-[1.55]" style={{ color: "hsl(var(--muted-foreground))" }}>
            {description}
          </p>
        )}
        <p
          className="mt-3 font-mono text-xs uppercase tracking-[0.18em]"
          style={{ color: border }}
        >
          {external ? "Open →" : "Read →"}
        </p>
      </div>
    </a>
  );
}
