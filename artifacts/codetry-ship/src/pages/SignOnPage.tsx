import { useState, type FormEvent } from "react";
import { ApiError, postSignOn } from "@/lib/api";

interface FormState {
  name: string;
  email: string;
  org: string;
  role: string;
  wouldBring: string;
  wouldWant: string;
  website: string; // honeypot
}

const EMPTY: FormState = {
  name: "",
  email: "",
  org: "",
  role: "",
  wouldBring: "",
  wouldWant: "",
  website: "",
};

export function SignOnPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedName, setConfirmedName] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await postSignOn({
        name: form.name.trim(),
        email: form.email.trim(),
        org: form.org.trim() || undefined,
        role: form.role.trim() || undefined,
        wouldBring: form.wouldBring.trim() || undefined,
        wouldWant: form.wouldWant.trim() || undefined,
      });
      setConfirmedName(res.name);
      setForm(EMPTY);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not reach the ship just now. Try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[42rem] px-6 sm:px-8 py-16 sm:py-24">
        {/* ----------------------------- header ----------------------------- */}
        <header className="space-y-6">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
            data-testid="header-eyebrow"
          >
            codetry · ship
          </p>
          <h1
            className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight"
            data-testid="header-title"
          >
            Sign on to the ship.
          </h1>
        </header>

        {/* ----------------------------- manifesto quote ----------------------------- */}
        <section
          className="mt-12 sm:mt-16 border-l-2 pl-6 sm:pl-8"
          style={{ borderColor: "hsl(var(--accent))" }}
          data-testid="section-manifesto"
        >
          <blockquote className="font-serif text-xl sm:text-2xl leading-snug">
            <p>
              Codetry is the practice of building the boat in the open — naming
              every plank, weighing every nail, and telling the people on the
              shore exactly where you mean to sail before you ask them to come
              aboard.
            </p>
          </blockquote>
          <p className="mt-4 signoff">— from the codetry manifesto</p>
        </section>

        {/* ----------------------------- ship metaphor ----------------------------- */}
        <section
          className="mt-12 sm:mt-16 space-y-5 font-serif text-base sm:text-lg leading-relaxed"
          data-testid="section-ship"
        >
          <p>
            A ship is a strange thing to ask people to join. You can&rsquo;t
            inspect the keel from the dock. You can&rsquo;t test the rigging
            until the wind comes up. The crew you sail with is the crew you
            cast off with — there&rsquo;s no quietly stepping back to land
            once the lines are off the cleat.
          </p>
          <p>
            So this is the part where we tell you what we&rsquo;re building,
            in plain enough language that you can decide for yourself. We are
            building a small economy you can fit inside a single northern
            community — store, books, freight, training — and the operating
            tools that let a council run it without an outside consultant on
            retainer. We are doing it dollar-honest, slowly, and with the
            people who actually have to live with the result.
          </p>
          <p>
            If you&rsquo;d like a place on the manifest, the form below is
            how. We&rsquo;ll save your name. We&rsquo;ll write you back when
            there&rsquo;s something concrete to share. We won&rsquo;t put you
            on a list, sell anything to you, or make you a fundraising
            number. Sign on if that arrangement reads right.
          </p>
        </section>

        <hr className="rule mt-12 sm:mt-16" />

        {/* ----------------------------- form / confirmation ----------------------------- */}
        <section className="mt-12 sm:mt-16" data-testid="section-form">
          {confirmedName ? (
            <div
              className="rounded-md border bg-card p-8 sm:p-10 space-y-5"
              style={{ borderColor: "hsl(var(--card-border))" }}
              role="status"
              aria-live="polite"
              data-testid="confirmation"
            >
              <p
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{ color: "hsl(var(--accent))" }}
              >
                signed on
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl leading-tight">
                {confirmedName}, your name is on the ship.
              </h2>
              <p className="font-serif text-base sm:text-lg leading-relaxed text-muted-foreground">
                We saved what you wrote. We&rsquo;ll send a short note to the
                email you gave us so you have something on file. After that,
                quiet — until there&rsquo;s a reason to write.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmedName(null)}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
                  data-testid="link-sign-someone-else"
                >
                  sign someone else on
                </button>
              </div>
              <p className="signoff pt-4">— codetry</p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-6"
              data-testid="form-signon"
              noValidate
            >
              {/* honeypot — hidden from people, present in DOM */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                  />
                </label>
              </div>

              <Field
                id="signon-name"
                label="Your name"
                required
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                testId="input-name"
                hint="The name we&rsquo;ll write back to."
              />
              <Field
                id="signon-email"
                label="Email"
                required
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                testId="input-email"
                hint="We&rsquo;ll send a short confirmation. No list, no marketing."
              />
              <Field
                id="signon-org"
                label="Org or community (optional)"
                value={form.org}
                onChange={(v) => setForm({ ...form, org: v })}
                testId="input-org"
              />
              <Field
                id="signon-role"
                label="Role or trade (optional)"
                value={form.role}
                onChange={(v) => setForm({ ...form, role: v })}
                testId="input-role"
              />
              <FieldArea
                id="signon-bring"
                label="What you&rsquo;d bring"
                value={form.wouldBring}
                onChange={(v) => setForm({ ...form, wouldBring: v })}
                testId="input-bring"
                hint="A skill, a relationship, a piece of work you&rsquo;ve done. Plain language is fine."
                rows={3}
              />
              <FieldArea
                id="signon-want"
                label="What you&rsquo;d want"
                value={form.wouldWant}
                onChange={(v) => setForm({ ...form, wouldWant: v })}
                testId="input-want"
                hint="A community, a season, a question — what would make this worth your time."
                rows={3}
              />

              {error ? (
                <p
                  role="alert"
                  className="font-sans text-sm text-destructive"
                  data-testid="form-error"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  data-testid="button-signon"
                >
                  {submitting ? "Signing on…" : "Put my name on the ship"}
                </button>
                <p className="signoff">— codetry</p>
              </div>
            </form>
          )}
        </section>

        {/* ----------------------------- footer ----------------------------- */}
        <footer
          className="mt-20 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="footer"
        >
          <p className="signoff">codetry · ship · {new Date().getFullYear()}</p>
          <a
            href="manifest"
            className="signoff underline underline-offset-4 hover:opacity-80"
            data-testid="link-operator"
          >
            operator
          </a>
        </footer>
      </div>
    </main>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  testId: string;
  type?: string;
  required?: boolean;
  hint?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  testId,
  type = "text",
  required,
  hint,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-sans text-sm font-medium"
      >
        {label}
        {required ? (
          <span className="ml-1" style={{ color: "hsl(var(--accent))" }}>
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={type === "email" ? "email" : "off"}
        className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2"
        style={{
          borderColor: "hsl(var(--card-border))",
        }}
        data-testid={testId}
      />
      {hint ? (
        <p
          className="font-sans text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      ) : null}
    </div>
  );
}

interface FieldAreaProps extends Omit<FieldProps, "type"> {
  rows?: number;
}

function FieldArea({
  id,
  label,
  value,
  onChange,
  testId,
  required,
  hint,
  rows = 3,
}: FieldAreaProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-sans text-sm font-medium"
        dangerouslySetInnerHTML={{
          __html:
            label + (required ? ' <span style="color:hsl(var(--accent))">*</span>' : ""),
        }}
      />
      <textarea
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2 resize-y"
        style={{
          borderColor: "hsl(var(--card-border))",
        }}
        data-testid={testId}
      />
      {hint ? (
        <p
          className="font-sans text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      ) : null}
    </div>
  );
}
