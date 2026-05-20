import { useState, type FormEvent } from "react";
import { Link } from "wouter";
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
        setError("Could not reach the server just now. Try again in a moment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground">

      {/* ── boreal field journal hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#1f3d2e", color: "#f4ede0" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("${import.meta.env.BASE_URL}odyssey/hempcrete-texture.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.10,
            mixBlendMode: "multiply",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 od-topo" style={{ opacity: 0.10 }} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(10,22,14,0.4) 100%)" }}
        />
        <div className="relative z-10 mx-auto max-w-[38rem] px-6 sm:px-8 pt-12 pb-14 text-center">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.28em] mb-5"
            style={{ color: "rgba(212,160,23,0.8)" }}
            data-testid="header-eyebrow"
          >
            headwaters
          </p>
          <h1
            className="font-serif leading-[1.12] tracking-tight"
            style={{ fontSize: "clamp(2rem, 7vw, 3rem)", color: "#f4ede0" }}
            data-testid="header-title"
          >
            Sign on.
          </h1>
          <p
            className="font-serif italic mt-4"
            style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)", color: "rgba(244,237,224,0.65)", lineHeight: 1.55 }}
          >
            Rooted in reserves and northern communities — built to replicate anywhere.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[42rem] px-6 sm:px-8 pt-10 pb-16">

        {/* ----------------------------- operator callout ----------------------------- */}
        <div
          className="mt-8 flex items-center gap-3 rounded-sm border px-5 py-3.5"
          style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted))" }}
          data-testid="operator-callout"
        >
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em] shrink-0"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Operator?
          </span>
          <Link
            href="/operator"
            className="font-mono text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--accent))" }}
            data-testid="operator-callout-link"
          >
            Sign in with your passphrase →
          </Link>
        </div>

        {/* ----------------------------- manifesto quote ----------------------------- */}
        <section
          className="mt-12 sm:mt-16 border-l-2 pl-6 sm:pl-8"
          style={{ borderColor: "hsl(var(--accent))" }}
          data-testid="section-manifesto"
        >
          <blockquote className="font-serif text-xl sm:text-2xl leading-snug">
            <p>
              Headwaters is the practice of building in the open — naming
              every decision, sharing every number, and telling the people in
              the community exactly what is being built before asking them
              to come aboard.
            </p>
          </blockquote>
          <p className="mt-4 signoff">— from the headwaters approach</p>
        </section>

        {/* ----------------------------- about ----------------------------- */}
        <section
          className="mt-12 sm:mt-16 space-y-5 font-serif text-base sm:text-lg leading-relaxed"
          data-testid="section-ship"
        >
          <p>
            Building a community economy takes time, honesty, and people who
            are willing to stay with it. You can&rsquo;t inspect the foundation
            from the outside. You can&rsquo;t test the store until the doors
            open. The community you build with is the community you live with
            — there&rsquo;s no quietly stepping back once the work begins.
          </p>
          <p>
            So this is the part where we tell you what we&rsquo;re building,
            in plain enough language that you can decide for yourself. We are
            building a small economy you can fit inside a single northern
            community — store, accounts, freight, training — and the operating
            tools that let a council run it without an outside consultant on
            retainer. We are doing it dollar-honest, slowly, and with the
            people who actually have to live with the result.
          </p>
          <p>
            If you&rsquo;d like a place on the list, the form below is
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
                {confirmedName}, your name is on the list.
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
              <p className="signoff pt-4">— headwaters</p>
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

              <p
                className="font-sans text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Your name and email are stored so we can write back to you.{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:opacity-80"
                >
                  See our privacy policy.
                </a>
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  data-testid="button-signon"
                >
                  {submitting ? "Signing on…" : "Put my name on the list"}
                </button>
                <p className="signoff">— headwaters</p>
              </div>
            </form>
          )}
        </section>

        {/* ----------------------------- footer ----------------------------- */}
        <footer
          className="mt-12 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="footer"
        >
          <p className="signoff">headwaters · {new Date().getFullYear()}</p>
          <a
            href="/privacy"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Privacy
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
