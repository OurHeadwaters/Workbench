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
      <div className="mx-auto max-w-[52rem] px-6 sm:px-8 py-16 sm:py-24">

        {/* ── header ── */}
        <header className="space-y-4" data-testid="home-header">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
            data-testid="home-eyebrow"
          >
            headwaters · northwestern ontario
          </p>
          <h1
            className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight"
            data-testid="home-title"
          >
            Food systems planning<br className="hidden sm:block" /> for northern communities.
          </h1>
          <p
            className="font-serif text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: "hsl(var(--muted-foreground))" }}
            data-testid="home-tagline"
          >
            Headwaters is a single-practitioner consultancy based in Dryden,
            Ontario. The work is operational: store plans, food hub design,
            community economic development — written in plain language, dollar-honest,
            and built to run without an outside consultant on retainer.
          </p>
        </header>

        {/* ── hero photo ── swap src when real photo is ready */}
        <div
          className="mt-10 w-full overflow-hidden rounded-md"
          style={{ aspectRatio: "16/9", background: "hsl(var(--card))", border: "1px solid hsl(var(--card-border))" }}
          data-testid="hero-photo-slot"
        >
          {/* TODO: replace with <img src={heroPhoto} alt="..." className="w-full h-full object-cover" /> */}
          <div className="w-full h-full grid place-items-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "hsl(var(--muted-foreground))" }}>
              photo coming
            </p>
          </div>
        </div>

        <hr
          className="my-12 sm:my-16"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        {/* ── start a conversation ── */}
        <section data-testid="home-intake">
          <div className="flex items-baseline justify-between gap-3 mb-6">
            <h2
              className="font-serif text-2xl tracking-tight"
              data-testid="intake-heading"
            >
              Start a conversation
            </h2>
          </div>

          <div className="space-y-4 font-serif text-[15px] leading-[1.6] mb-8" data-testid="intake-intro">
            <p>
              The usual first step is a trial period: a bounded scope of work
              at an hourly rate, no retainer, no long commitment. If the fit
              is right, it continues. If not, you leave with something useful
              and no obligation to keep going.
            </p>
            <p>
              Tell us a little about your community and what you are trying
              to build. That is enough to start.
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
                We have your message. Bobbie will read it and write back
                with a plain-language response — no sales pitch, no proposal
                deck. Usually within a day or two.
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

              <div className="flex flex-wrap items-center gap-5 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "hsl(var(--accent))",
                    color: "hsl(var(--background))",
                  }}
                  data-testid="button-intake-submit"
                >
                  {submitting ? "Sending…" : "Send message"}
                </button>
                <a
                  href="mailto:bobbie@ourheadwaters.ca"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60 hover:opacity-90"
                  style={{ color: "hsl(var(--foreground))" }}
                  data-testid="intake-email-fallback"
                >
                  or email directly →
                </a>
              </div>
            </form>
          )}
        </section>

        <hr
          className="my-12 sm:my-16"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        {/* ── the work ── */}
        <section data-testid="home-work">
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <h2
              className="font-serif text-2xl tracking-tight"
              data-testid="work-heading"
            >
              The work
            </h2>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--accent))" }}
            >
              shipped · running · readable
            </p>
          </div>

          <p
            className="font-serif text-[15px] leading-[1.6] mb-6"
            style={{ color: "hsl(var(--muted-foreground))" }}
            data-testid="work-explainer"
          >
            Headwaters builds software and operational tools for northern communities.
            These are live and in use — not demos, not proposals.
          </p>

          <div className="space-y-3" data-testid="work-cards">
            <ComingSoonCard
              eyebrow="Community store · Launching soon"
              title="Building the store — a community economic guide"
              description="What it takes to stand up a community-owned store in northwestern Ontario: the 807 supply chain, local hire and training, band council financing, co-op structure, and day-one operations. Plain language, open numbers."
              testId="work-card-store"
            />
            <ComingSoonCard
              eyebrow="Co-op membership · Coming soon"
              title="Co-op Membership Platform"
              description="A membership and governance platform for community-owned co-ops in the 807. Pending a vote from the pilot community before public launch."
              testId="work-card-coop"
            />
            <WorkCard
              eyebrow="Northern food systems · Knowledge commons"
              title="Northern Food Systems Research Library"
              description="A curated, searchable library of food systems research, producer contacts, and community case studies for northern and Indigenous communities. Open for contributors."
              href="/library/"
              testId="work-card-library"
            />
            <DemoCard
              eyebrow="Community ledger · Headwaters Books"
              title="Open books — what a community store's finances look like"
              description="A live demo of the bookkeeping tool: open records the band can read, the daily close the operators run each night, and the month-end pack the bookkeeper hands council. Sample data, no login."
              href="/headwaters-books/demo"
              testId="work-card-books-demo"
            />
            <WorkCard
              eyebrow="Grants · Northern communities"
              title="Grants Finder"
              description="A searchable index of funding available to northern and Indigenous communities — grants, programs, and deadlines in one place."
              href="https://community-knowledge-hub.replit.app/grants/"
              external
              testId="work-card-grants"
            />
            <WorkCard
              eyebrow="Personal finance · Headwaters"
              title="Headwaters Finance"
              description="Your money has been free-ranging. A personal finance tool that maps where money goes, built for people who move faster than any folder system."
              href="https://x-buckets-vision.replit.app/"
              external
              testId="work-card-finance"
            />
            <WorkCard
              eyebrow="Operations · For entrepreneurs"
              title="Rootwork"
              description="A calm command center for builders who can't sit still. Private and self-hosted — your notes stay yours. Drop in the chaos, find what you need in seconds."
              href="https://community-knowledge-hub.replit.app/studio/"
              external
              testId="work-card-rootwork"
            />
            <WorkCard
              eyebrow="Health · Long-term care"
              title="Bright Side"
              description="A recreation therapy companion for LTC homes — activity planning, resident engagement, and documentation built for the people on the floor."
              href="https://health-support-hub.replit.app/"
              external
              testId="work-card-brightside"
            />
            <WorkCard
              eyebrow="Journalling · Public and private"
              title="Dam Days"
              description="A journal that knows what to keep to yourself and what to share. Public entries, private pages, one place."
              href="https://conversation-log.replit.app/"
              external
              testId="work-card-damdays"
            />
          </div>
        </section>

        <hr
          className="my-12 sm:my-16"
          style={{ borderColor: "hsl(var(--card-border))" }}
        />

        {/* ── about ── */}
        <section data-testid="home-about">
          <div className="flex items-baseline justify-between gap-3 mb-5">
            <h2
              className="font-serif text-2xl tracking-tight"
              data-testid="about-heading"
            >
              The practitioner
            </h2>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--accent))" }}
            >
              bobbie parr
            </p>
          </div>

          <a
            href="bio"
            className="block mb-6 w-full overflow-hidden rounded-md group"
            style={{ aspectRatio: "4/3", maxHeight: "320px", background: "hsl(var(--card))", border: "1px solid hsl(var(--card-border))" }}
            data-testid="bio-photo-slot"
          >
            {/* TODO: replace inner div with <img src={bobbiePhoto} alt="Bobbie Parr" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" /> */}
            <div className="w-full h-full grid place-items-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "hsl(var(--muted-foreground))" }}>
                photo coming
              </p>
            </div>
          </a>

          <p
            className="font-serif text-[15px] leading-[1.6] mb-6"
            style={{ color: "hsl(var(--muted-foreground))" }}
            data-testid="about-body"
          >
            Single-practitioner, by design. Plain language, dollar-honest,
            no startup-pitch tone. See what we offer and how we work.
          </p>
          <a
            href="bio"
            className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-opacity hover:opacity-90"
            style={{
              background: "hsl(var(--accent))",
              color: "hsl(var(--background))",
            }}
            data-testid="link-bio"
          >
            Our services →
          </a>
        </section>

        {/* ── footer ── */}
        <footer
          className="mt-20 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="home-footer"
        >
          <p className="signoff">— bobbie parr · headwaters · dryden, ontario</p>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {new Date().getFullYear()}
          </p>
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

interface DemoCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  testId: string;
}

function DemoCard({ eyebrow, title, description, href, testId }: DemoCardProps) {
  return (
    <a
      href={href}
      className="block rounded-md border bg-card p-5 sm:p-6 transition-colors hover:border-accent"
      style={{ borderColor: "hsl(var(--card-border))" }}
      data-testid={testId}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2"
        style={{ color: "hsl(var(--accent))" }}
      >
        {eyebrow}
      </p>
      <p className="font-serif text-[17px] font-medium tracking-tight mb-2">
        {title}
      </p>
      <p
        className="font-serif text-[14px] leading-[1.55]"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {description}
      </p>
      <p
        className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color: "hsl(var(--accent))" }}
      >
        View demo →
      </p>
    </a>
  );
}

interface ComingSoonCardProps {
  eyebrow: string;
  title: string;
  description: string;
  testId: string;
}

function ComingSoonCard({ eyebrow, title, description, testId }: ComingSoonCardProps) {
  return (
    <div
      className="block rounded-md border bg-card p-5 sm:p-6 opacity-75"
      style={{ borderColor: "hsl(var(--card-border))", borderStyle: "dashed" }}
      data-testid={testId}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2"
        style={{ color: "hsl(var(--accent))" }}
      >
        {eyebrow}
      </p>
      <p className="font-serif text-[17px] font-medium tracking-tight mb-2">
        {title}
      </p>
      <p
        className="font-serif text-[14px] leading-[1.55]"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {description}
      </p>
    </div>
  );
}

interface WorkCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  testId: string;
  external?: boolean;
}

function WorkCard({ eyebrow, title, description, href, testId, external }: WorkCardProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="block rounded-md border bg-card p-5 sm:p-6 transition-colors hover:border-accent"
      style={{ borderColor: "hsl(var(--card-border))" }}
      data-testid={testId}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2"
        style={{ color: "hsl(var(--accent))" }}
      >
        {eyebrow}
      </p>
      <p className="font-serif text-[17px] font-medium tracking-tight mb-2">
        {title}
      </p>
      <p
        className="font-serif text-[14px] leading-[1.55]"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {description}
      </p>
    </a>
  );
}
