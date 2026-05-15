import { useState, type FormEvent } from "react";
import { ApiError, postIntake } from "@/lib/api";

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
    <main className="home-page min-h-screen w-full bg-background text-foreground">

      {/* ── hero ── */}
      <section
        className="relative overflow-hidden px-6 sm:px-10 pt-16 pb-14"
        style={{ background: "hsl(145 36% 18%)", color: "hsl(38 36% 96%)" }}
        data-testid="home-header"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-10"
          style={{ background: "hsl(38 36% 94%)" }}
        />
        <div className="relative mx-auto max-w-[52rem]">

          {/* Eagle mark — sunset disc */}
          <div className="mb-7" data-testid="home-eyebrow">
            <img
              src={`${import.meta.env.BASE_URL}eagle-mark.svg`}
              alt="Headwaters — Northwestern Ontario"
              style={{ width: 88, height: 72, objectFit: "contain" }}
            />
          </div>

          <p
            className="font-serif text-xl sm:text-2xl font-medium mb-2 leading-tight"
            data-testid="home-practitioner-byline"
          >
            <a
              href={`${import.meta.env.BASE_URL}bio`}
              className="hover:opacity-80 transition-opacity"
              style={{ color: "hsl(38 36% 96%)" }}
            >
              Bobbie Parr — practitioner, Headwaters
            </a>
          </p>
          <h1
            className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-3"
            data-testid="home-title"
          >
            Your community store,<br className="hidden sm:block" /> open and running.
          </h1>
          <p
            className="font-serif text-lg italic mb-8 opacity-75"
            data-testid="home-tagline"
          >
            Food systems planning for northern communities — practitioner-built, flat fee, no retainer required.
          </p>

          {/* Two real buttons side by side */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="#conversation"
              className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "hsl(var(--accent))", color: "hsl(38 36% 96%)" }}
              data-testid="hero-cta-primary"
            >
              Start a conversation (short form) →
            </a>
            <a
              href={`${import.meta.env.BASE_URL}services`}
              className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] border transition-opacity hover:opacity-90"
              style={{ borderColor: "hsla(38, 36%, 96%, 0.55)", color: "hsl(38 36% 96%)" }}
              data-testid="hero-cta-services"
            >
              What it looks like to build →
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[52rem] px-6 sm:px-8">

        {/* ── hero photo ── */}
        <div
          className="mt-10 w-full overflow-hidden rounded-md"
          style={{ aspectRatio: "16/9" }}
          data-testid="hero-photo-slot"
        >
          <img
            src={`${import.meta.env.BASE_URL}hero-harvest.jpeg`}
            alt="Community potato harvest — neighbours of all ages sorting potatoes together in a field near Dryden, Ontario"
            className="w-full h-full object-cover"
          />
        </div>

        <hr
          className="my-12 sm:my-16"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        {/* ── the work ── */}
        <section data-testid="home-work">
          <div
            className="rounded-md px-5 py-4 mb-8 relative overflow-hidden"
            style={{ background: "hsl(145 36% 22%)", color: "hsl(38 36% 96%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: "hsl(38 36% 94%)" }}
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] mb-1.5 opacity-70">
              shipped · running · readable
            </p>
            <h2
              className="font-serif text-2xl sm:text-3xl tracking-tight"
              data-testid="work-heading"
            >
              The work
            </h2>
          </div>

          <p
            className="font-serif text-[15px] leading-[1.6] mb-6"
            style={{ color: "hsl(var(--muted-foreground))" }}
            data-testid="work-explainer"
          >
            Seven simple tools. One community economy. Each tool connects to the next — learn the work, track the work, account for the work, and everything behind them that makes it run.
          </p>

          {/* ── three entry cards replacing the blunt full-width services button ── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
            data-testid="link-services"
          >
            {[
              {
                label: "Community store",
                blurb: "Site selection, co-op structure, band financing, and day-one operations.",
                color: "hsl(14 64% 36%)",
                fg: "hsl(38 36% 96%)",
                anchor: "store",
              },
              {
                label: "Platform & co-op",
                blurb: "Membership systems, governance tools, and shared community infrastructure.",
                color: "hsl(145 36% 22%)",
                fg: "hsl(38 36% 96%)",
                anchor: "platform",
              },
              {
                label: "Custom tool",
                blurb: "Purpose-built software for the specific problem in front of you.",
                color: "hsl(30 40% 50%)",
                fg: "hsl(38 36% 96%)",
                anchor: "custom",
              },
            ].map(({ label, blurb, color, fg, anchor }) => (
              <a
                key={label}
                href={`${import.meta.env.BASE_URL}services#${anchor}`}
                className="block rounded-md border overflow-hidden transition-opacity hover:opacity-90"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <div className="px-4 py-3.5" style={{ background: color, color: fg }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em]">{label}</p>
                </div>
                <div className="px-4 py-3" style={{ background: "hsl(var(--card))" }}>
                  <p
                    className="font-serif text-[13px] leading-[1.5] mb-2 break-words"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {blurb}
                  </p>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.14em] whitespace-nowrap"
                    style={{ color }}
                  >
                    See examples →
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* ── Seven simple tools section ── */}
          <div data-testid="work-cards">

            {/* Core flow label */}
            <p
              className="font-mono text-[10px] uppercase tracking-[0.24em] mb-4"
              style={{ color: "hsl(var(--accent))" }}
            >
              The core flow — learn → track → account
            </p>

            <div className="space-y-2 mb-4">
              {[
                {
                  icon: "📖",
                  name: "The Handbook",
                  sub: "Codetry Handbook",
                  desc: "Where you start. A plain-language guide that teaches the Headwaters way of working — how to scope a job, how to hand it over, and how a community can run its own economy.",
                  color: "hsl(145 36% 22%)",
                  testId: "work-card-handbook",
                  href: "/codetry-handbook/",
                },
                {
                  icon: "📋",
                  name: "Practitioner's Guide",
                  sub: "Practitioners Guide V2",
                  desc: "Where your work lives. A structured reference that tracks each engagement — the scope, the phases, the decisions, and the handover. Keeps every project honest.",
                  color: "hsl(145 28% 32%)",
                  testId: "work-card-guide",
                  href: "/practitioners-guide-v2/",
                },
                {
                  icon: "📚",
                  name: "The Accounts",
                  sub: "Headwaters Books",
                  desc: "Where the money is recorded. Tracks what came in, what went out, and what the work delivered — so the community always knows where it stands financially.",
                  color: "hsl(145 22% 42%)",
                  testId: "work-card-books",
                  href: "/headwaters-books/",
                },
              ].map(({ icon, name, sub, desc, color, testId, href }, i) => (
                <div key={name}>
                  <a
                    href={href}
                    className="block rounded-md border bg-card p-4 flex gap-3.5 items-start transition-opacity hover:opacity-80"
                    style={{ borderColor: "hsl(var(--card-border))", borderLeft: `4px solid ${color}` }}
                    data-testid={testId}
                  >
                    <span className="text-2xl leading-none mt-0.5 shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <p className="font-serif text-[15px] font-medium tracking-tight">{name}</p>
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.1em]"
                          style={{ color }}
                        >{sub}</span>
                      </div>
                      <p className="font-serif text-[13.5px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {desc}
                      </p>
                    </div>
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
              ))}
            </div>

            {/* Supporting layers divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "hsl(var(--card-border))" }} />
              <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "hsl(var(--muted-foreground))" }}>
                Supporting layers
              </p>
              <div className="flex-1 h-px" style={{ background: "hsl(var(--card-border))" }} />
            </div>

            <p
              className="font-serif text-[13.5px] leading-[1.55] mb-4"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Four tools back up the core flow — they hold the evidence, the materials, the team, and the files that everything else draws from.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              {[
                {
                  icon: "🔬",
                  name: "Research Library",
                  sub: "Northern Food Systems Library",
                  desc: "Curated research, reports, and links about northern food systems — so every decision is grounded in real data, not guesswork.",
                  color: "hsl(14 64% 36%)",
                  testId: "work-card-library",
                  href: "/library/",
                },
                {
                  icon: "🖨️",
                  name: "Print Marketing Suite",
                  sub: "Headwaters Print Marketing",
                  desc: "Print-ready flyers, posters, rack cards, and forms for every public-facing moment — from a farmers market table to a band council pitch.",
                  color: "hsl(14 50% 44%)",
                  testId: "work-card-print",
                  href: "/print-marketing/",
                },
                {
                  icon: "🚢",
                  name: "Crew Manifest",
                  sub: "Codetry Ship",
                  desc: "Shows who is on which project, what role they fill, and how the crew fits together — so nothing falls through the cracks.",
                  color: "hsl(220 20% 32%)",
                  testId: "work-card-ship",
                  href: "/",
                },
                {
                  icon: "🗄️",
                  name: "Media Library",
                  sub: "Headwaters API",
                  desc: "Stores photos, documents, and media assets so every other tool can pull from one reliable source — no more hunting for the right logo version.",
                  color: "hsl(200 25% 35%)",
                  testId: "work-card-media",
                  href: "/media/",
                },
              ].map(({ icon, name, sub, desc, color, testId, href }) => (
                <a
                  key={name}
                  href={href}
                  className="block rounded-md border bg-card p-4 flex gap-3 items-start transition-opacity hover:opacity-80"
                  style={{ borderColor: "hsl(var(--card-border))", borderLeft: `4px solid ${color}` }}
                  data-testid={testId}
                >
                  <span className="text-xl leading-none mt-0.5 shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                      <p className="font-serif text-[14px] font-medium tracking-tight shrink-0">{name}</p>
                      <span
                        className="font-mono text-[9px] uppercase tracking-[0.08em] block truncate min-w-0 max-w-full"
                        style={{ color }}
                      >{sub}</span>
                    </div>
                    <p className="font-serif text-[13px] leading-[1.45]" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* How it fits callout */}
            <div
              className="mt-4 rounded-md px-5 py-4"
              style={{ background: "hsl(145 36% 22%)", color: "hsl(38 36% 96%)" }}
              data-testid="work-seven-tools-callout"
            >
              <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] mb-2 opacity-70">How it all connects</p>
              <p className="font-serif text-[14px] leading-[1.6]">
                <strong>The Handbook</strong> teaches you how Headwaters works.{" "}
                <strong>The Practitioner's Guide</strong> captures each job you do.{" "}
                <strong>The Accounts</strong> keep the money honest. Behind them: the{" "}
                <strong>Research Library</strong> grounds decisions in real evidence, the{" "}
                <strong>Print Suite</strong> puts everything on paper, the{" "}
                <strong>Crew Manifest</strong> shows who's doing what, and the{" "}
                <strong>Media Library</strong> keeps the files in one place.
                {" "}Seven simple tools. One system. Yours.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href={`${import.meta.env.BASE_URL}work`}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] border-b pb-0.5 transition-opacity hover:opacity-70"
              style={{ color: "hsl(var(--accent))", borderColor: "hsl(var(--accent))" }}
              data-testid="work-see-case-studies"
            >
              See case studies →
            </a>
          </div>
        </section>

        {/* ── social proof ── */}
        <section>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-6"
            style={{ color: "hsl(var(--accent))" }}
          >
            from the communities
          </p>
          <blockquote
            className="rounded-md border-l-4 pl-6 py-2"
            style={{ borderColor: "hsl(var(--accent))" }}
          >
            <p className="font-serif text-xl sm:text-2xl leading-[1.4] italic mb-5">
              "Our team used to keep everything afloat with an overflowing Google Drive, but now we can clearly see the strategic progress every day with some really cool operating tools!"
            </p>
            <footer className="flex flex-col gap-0.5">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                807 Food Co-operative
              </p>
            </footer>
          </blockquote>
        </section>

        <hr
          className="my-12 sm:my-16"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        {/* ── how it starts ── */}
        <section data-testid="home-how-it-starts">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            the first step
          </p>
          <h2
            className="font-serif text-3xl tracking-tight mb-1"
            data-testid="how-it-starts-heading"
          >
            A trial period, not a contract
          </h2>
          <p
            className="font-serif text-[15px] italic mb-8"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Every engagement starts with a defined phase — a fixed fee, a clear scope, and a real deliverable. No retainer, no open-ended commitment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-10">
            {[
              { step: "1", label: "Send a message", body: "Tell us what your community is trying to build. A sentence or two is enough." },
              { step: "2", label: "Phase 1", body: "6–8 weeks, fixed fee, bounded scope. You get something real at the end whether or not it continues." },
              { step: "3", label: "Decision point", body: "If the fit is right, the next phase begins. If not, you leave with something useful and no obligation." },
              { step: "4", label: "Continue", body: "Each phase has its own scope, fee, and deliverables. Renewed only if the work calls for it." },
            ].map(({ step, label, body }) => (
              <div
                key={step}
                className="rounded-md border bg-card p-5"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <div
                  className="font-mono text-[11px] font-semibold mb-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                >
                  {step}
                </div>
                <p className="font-serif text-[15px] font-medium tracking-tight mb-1.5">{label}</p>
                <p className="font-serif text-[13.5px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-md border px-5 py-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6"
            style={{ borderColor: "hsl(var(--accent))", borderStyle: "dashed", background: "hsl(var(--card))" }}
            data-testid="flat-fee-callout"
          >
            <div
              className="shrink-0 rounded-sm px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em]"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
            >
              How we charge
            </div>
            <p className="font-serif text-[14px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>
              <strong style={{ color: "hsl(var(--foreground))" }}>Flat fee, not hourly.</strong>{" "}
              You own every deliverable at handoff — no licensing, no retainer required to keep it working. The community keeps the tools.
            </p>
          </div>

          <div
            className="rounded-md border p-6 sm:p-8"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: "hsl(var(--accent))" }}>
              phase fees
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Phase 1", value: "$28,000", note: "6–8 weeks. Fixed fee, defined scope, real deliverable. Shorter engagement = reduced invoice." },
                { label: "Phase 2+", value: "Scoped per phase", note: "Each subsequent phase is priced to its scope before work begins." },
                { label: "Travel & expenses", value: "At cost", note: "Travel to site and expenses reimbursed at cost with receipts." },
              ].map(({ label, value, note }) => (
                <div key={label}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
                  <p className="font-serif text-2xl font-medium tracking-tight mb-1">{value}</p>
                  <p className="font-serif text-[13px] leading-[1.5]" style={{ color: "hsl(var(--muted-foreground))" }}>{note}</p>
                </div>
              ))}
            </div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.14em] mt-5"
              style={{ color: "hsl(var(--muted-foreground))", opacity: 0.7 }}
            >
              All fees CAD · excludes HST
            </p>
          </div>
        </section>

        <hr
          className="my-12 sm:my-16"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        {/* ── start a conversation ── */}
        <section id="conversation" data-testid="home-intake">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            get in touch
          </p>
          <h2
            className="font-serif text-3xl tracking-tight mb-1"
            data-testid="intake-heading"
          >
            Start a conversation
          </h2>

          <div className="space-y-4 font-serif text-[15px] leading-[1.6] mt-4 mb-8" data-testid="intake-intro">
            <p>
              Tell us a little about your community and what you are trying to build.
              That is enough to start. Bobbie will write back with a plain-language
              response — no sales pitch, no proposal deck. Usually within a day or two.
            </p>
          </div>

          {confirmedName ? (
            <div
              className="rounded-md border bg-card p-7 sm:p-9 space-y-4"
              style={{ borderColor: "hsl(var(--card-border))" }}
              role="status"
              aria-live="polite"
              data-testid="intake-confirmation"
            >
              <p
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--accent))" }}
              >
                received
              </p>
              <h3 className="font-serif text-2xl leading-tight">
                Thank you, {confirmedName}.
              </h3>
              <p className="font-serif text-base leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                We have your message. Bobbie will read it and write back — no sales pitch, no proposal deck.
              </p>
              <button
                type="button"
                onClick={() => setConfirmedName(null)}
                className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
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
                  className="block font-sans text-sm font-medium"
                >
                  What are you trying to build?{" "}
                  <span style={{ color: "hsl(var(--accent))" }}>*</span>
                </label>
                <textarea
                  id="intake-need"
                  required
                  rows={4}
                  value={form.whatTheyNeed}
                  onChange={(e) => setForm({ ...form, whatTheyNeed: e.target.value })}
                  placeholder="A sentence or two is enough. What is the problem, and what would a good outcome look like for your community?"
                  className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2 resize-y"
                  style={{ borderColor: "hsl(var(--card-border))" }}
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
                  className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "hsl(var(--accent))",
                    color: "hsl(var(--accent-foreground))",
                  }}
                  data-testid="button-intake-submit"
                >
                  {submitting ? "Sending…" : "Send message →"}
                </button>
                <a
                  href="mailto:bobbie@ourheadwaters.ca"
                  className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                  data-testid="intake-email-fallback"
                >
                  or email directly
                </a>
              </div>
            </form>
          )}
        </section>

        <hr
          className="my-12 sm:my-16"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        {/* ── the practitioner ── */}
        <section data-testid="home-about">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            the practitioner
          </p>
          <h2
            className="font-serif text-3xl tracking-tight mb-1"
            data-testid="about-heading"
          >
            Bobbie Parr
          </h2>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em] mb-6"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            headwaters · dryden, ontario
          </p>

          <a
            href={`${import.meta.env.BASE_URL}bio`}
            className="block mb-6 w-full overflow-hidden rounded-md group"
            style={{ aspectRatio: "4/3", maxHeight: "320px" }}
            data-testid="bio-photo-slot"
          >
            <img
              src={`${import.meta.env.BASE_URL}bobbie-bio.jpeg`}
              alt="Bobbie Parr with a Parr's Jars crate of fresh local produce, outdoors in Northwestern Ontario"
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" style={{ objectPosition: "center 82%" }}
            />
          </a>

          <p
            className="font-serif text-[15px] leading-[1.6] mb-8"
            style={{ color: "hsl(var(--muted-foreground))" }}
            data-testid="about-body"
          >
            Northwestern Ontario practitioner. Community development degree, years on the ground in
            northern communities, and the founder of Parr&rsquo;s Jars — a small preserves business
            out of the bush near Dryden that keeps her hands in the actual work the operating plans
            are about. The voice is the same across all of it: plain, dollar-honest, no startup-pitch tone.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#conversation"
              className="inline-flex items-center gap-2 rounded-sm px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
              data-testid="about-cta-conversation"
            >
              Start a conversation (short form) →
            </a>
            <a
              href={`${import.meta.env.BASE_URL}bio`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
              data-testid="link-bio"
            >
              Read the bio
            </a>
          </div>
        </section>

        {/* ── footer ── */}
        <footer
          className="mt-20 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="home-footer"
        >
          <p className="signoff">— bobbie parr · headwaters · dryden, ontario</p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Privacy
            </a>
            <a
              href={`${import.meta.env.BASE_URL}operator`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))", opacity: 0.5 }}
              data-testid="footer-operator-link"
            >
              Operator
            </a>
            <a
              href={`${import.meta.env.BASE_URL}sign-on`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] hover:opacity-80"
              style={{ color: "hsl(var(--muted-foreground))", opacity: 0.5 }}
              data-testid="footer-sign-on-link"
            >
              Sign on
            </a>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {new Date().getFullYear()}
            </p>
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
      <label htmlFor={id} className="block font-sans text-sm font-medium">
        {label}
        {required ? (
          <span className="ml-1" style={{ color: "hsl(var(--accent))" }}>*</span>
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
        className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2"
        style={{ borderColor: "hsl(var(--card-border))" }}
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
