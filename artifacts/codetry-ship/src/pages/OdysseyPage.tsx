import { useState, type FormEvent } from "react";
import { ApiError, postIntake } from "@/lib/api";

interface FormState {
  name: string;
  community: string;
  q1: string; // what they're already organising
  q2: string; // what "handover" looks like
  email: string;
  website: string; // honeypot
}

const EMPTY: FormState = {
  name: "",
  community: "",
  q1: "",
  q2: "",
  email: "",
  website: "",
};

const PHASES = [
  { n: "01", label: "The Saltbox", body: "Name the work that already exists. Find the substrate you're standing on." },
  { n: "02", label: "Both-States", body: "Hold the tension between what is and what the community is building toward." },
  { n: "03", label: "Both-Sides", body: "Map the actors — who benefits, who bears cost, who decides." },
  { n: "04", label: "The Standby", body: "Build the readiness layer. The work that happens before the flood." },
  { n: "05", label: "The Gate", body: "Write the method down. Hand it off. Let the community run it." },
];

export function OdysseyPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedName, setConfirmedName] = useState<string | null>(null);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const whatTheyNeed = [
        `Already organising: ${form.q1.trim()}`,
        `Handover looks like: ${form.q2.trim()}`,
      ].join("\n\n");
      const res = await postIntake({
        name: form.name.trim(),
        email: form.email.trim(),
        community: form.community.trim(),
        role: "Odyssey — Pioneer intake",
        whatTheyNeed,
      });
      setConfirmedName(res.name);
      setForm(EMPTY);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not send just now. Try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="odyssey-page min-h-screen w-full bg-background text-foreground">

      {/* ── hero ── */}
      <section
        className="relative overflow-hidden px-6 sm:px-10 pt-16 pb-14"
        style={{ background: "hsl(145 36% 18%)", color: "hsl(38 36% 96%)" }}
        data-testid="odyssey-hero"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-10"
          style={{ background: "hsl(38 36% 94%)" }}
        />
        <div className="relative mx-auto max-w-[52rem]">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-4 opacity-70">
            headwaters odyssey
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-4">
            Become the hempcrete<br className="hidden sm:block" /> your community needs.
          </h1>
          <p className="font-serif text-lg italic mb-2 opacity-75">
            Whether the flood comes or not.
          </p>
          <p className="font-serif text-[15px] leading-[1.65] max-w-2xl opacity-90 mt-5">
            A disciplined, self-paced pioneer journey for people who already speak basic development language and want to strengthen their communities from the source.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[52rem] px-6 sm:px-8">

        <hr className="my-12 sm:my-16" style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── how it works ── */}
        <section data-testid="odyssey-how-it-works">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            how it works
          </p>
          <h2 className="font-serif text-3xl tracking-tight mb-1">
            5 Phases. 20 Stations.
          </h2>
          <p
            className="font-serif text-[15px] italic mb-8"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            You do the work. The next station opens.
          </p>

          {/* mechanic pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {[
              "Earn each station",
              "Full toolkit included",
              "Learn on your own time",
              "Private Signal group",
              "No deadlines · no pressure",
              "Free",
            ].map(tag => (
              <span
                key={tag}
                className="font-mono text-[9.5px] uppercase tracking-[0.15em] rounded-sm px-3 py-1.5 border"
                style={{
                  borderColor: "hsl(var(--card-border))",
                  color: "hsl(var(--muted-foreground))",
                  background: "hsl(var(--card))",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* phase list */}
          <div className="flex flex-col gap-3 mb-4">
            {PHASES.map((p, i) => (
              <div
                key={p.n}
                className="rounded-md border bg-card flex items-start gap-5 px-5 py-4"
                style={{ borderColor: "hsl(var(--card-border))" }}
              >
                <div
                  className="shrink-0 font-mono text-[11px] font-semibold w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                  style={{
                    background: i === 0 ? "hsl(var(--accent))" : "hsl(var(--card-border))",
                    color: i === 0 ? "hsl(var(--accent-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {p.n}
                </div>
                <div>
                  <p className="font-serif text-[15px] font-medium tracking-tight mb-1">
                    {p.label}
                  </p>
                  <p
                    className="font-serif text-[13.5px] leading-[1.5]"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-md border px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6"
            style={{
              borderColor: "hsl(var(--accent))",
              borderStyle: "dashed",
              background: "hsl(var(--card))",
            }}
          >
            <div
              className="shrink-0 rounded-sm px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em]"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
            >
              Each station
            </div>
            <p
              className="font-serif text-[14px] leading-[1.5]"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              One piece of real work. One field note. One unlock. No skipping.
            </p>
          </div>
        </section>

        <hr className="my-12 sm:my-16" style={{ borderColor: "hsl(var(--card-border))" }} />

        {/* ── intake form ── */}
        <section id="start" data-testid="odyssey-intake">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            start here
          </p>
          <h2 className="font-serif text-3xl tracking-tight mb-1">
            Three short questions.
          </h2>
          <p
            className="font-serif text-[15px] italic mb-8"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            So the journey begins in your real context, not a hypothetical one.
          </p>

          {confirmedName ? (
            <div
              className="rounded-md border px-6 py-8 text-center"
              style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
              data-testid="odyssey-confirmed"
            >
              <p className="font-serif text-xl mb-3">Thank you, {confirmedName}.</p>
              <p
                className="font-serif text-[15px] mb-6"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Station 1 is now unlocked for you in the app.
              </p>
              <a
                href="/codetry-handbook/path"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-85"
                style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
              >
                Open the Pioneer Path →
              </a>
              <p
                className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em]"
                style={{ color: "hsl(var(--muted-foreground))", opacity: 0.6 }}
              >
                Headwaters Odyssey · Phase 01 · The Saltbox
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-md border p-6 sm:p-8 flex flex-col gap-6"
              style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--card))" }}
              data-testid="odyssey-form"
            >
              {/* honeypot */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Your name" required>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="First name is fine"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="Where I can reach you"
                  />
                </Field>
              </div>

              <Field label="1. Which community or place are you called to serve?" required>
                <input
                  type="text"
                  required
                  value={form.community}
                  onChange={set("community")}
                  placeholder="Band council, co-op, neighbourhood, town — whatever fits"
                />
              </Field>

              <Field label="2. Share one word or phrase in your community that feels 'off' or load-bearing." required>
                <textarea
                  required
                  rows={2}
                  value={form.q1}
                  onChange={set("q1")}
                  placeholder="A word people use that doesn't quite fit. Or one that carries more weight than it should."
                />
              </Field>

              <Field label="3. What have you already tried to organise or strengthen? What happened?">
                <textarea
                  rows={3}
                  value={form.q2}
                  onChange={set("q2")}
                  placeholder="Don't polish it. What you tried and what actually happened — that's the real starting point."
                />
              </Field>

              {error && (
                <p
                  className="font-serif text-[13px]"
                  style={{ color: "hsl(0 72% 51%)" }}
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="self-start inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{ background: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
                data-testid="odyssey-submit"
              >
                {submitting ? "Sending…" : "Begin the Odyssey →"}
              </button>

              <p
                className="font-mono text-[9px] uppercase tracking-[0.14em]"
                style={{ color: "hsl(var(--muted-foreground))", opacity: 0.7 }}
              >
                Free · No account required · No spam
              </p>
            </form>
          )}
        </section>

        <div className="pb-20" />
      </div>
    </main>
  );
}

/* ── small helper ── */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>>;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {label}{required && <span aria-hidden style={{ color: "hsl(var(--accent))" }}> *</span>}
      </span>
      <style>{`
        .odyssey-page input[type=text],
        .odyssey-page input[type=email],
        .odyssey-page textarea {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--card-border));
          border-radius: 4px;
          padding: 10px 13px;
          font-family: var(--font-serif, Georgia, serif);
          font-size: 14px;
          color: hsl(var(--foreground));
          outline: none;
          resize: vertical;
          transition: border-color 0.15s;
        }
        .odyssey-page input[type=text]:focus,
        .odyssey-page input[type=email]:focus,
        .odyssey-page textarea:focus {
          border-color: hsl(var(--accent));
        }
        .odyssey-page input::placeholder,
        .odyssey-page textarea::placeholder {
          color: hsl(var(--muted-foreground));
          opacity: 0.6;
        }
      `}</style>
      {children}
    </label>
  );
}
