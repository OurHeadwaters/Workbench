import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import { ApiError, postSignOn } from "@/lib/api";

interface FormState {
  name: string;
  email: string;
  community: string;
  wouldWant: string;
  website: string; // honeypot
}

const EMPTY: FormState = {
  name: "",
  email: "",
  community: "",
  wouldWant: "",
  website: "",
};

const LISTEN_CANONICAL = "codetry.ca/listen";
const LISTEN_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}/listen`
    : `https://${LISTEN_CANONICAL}`;

export function ListenPage() {
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
        org: form.community.trim() || undefined,
        wouldWant: form.wouldWant.trim() || undefined,
        source: "listen-tsp",
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
    <main className="listen-page min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[42rem] px-6 sm:px-8 py-16 sm:py-24 print:py-0 print:max-w-full">

        {/* ---- eyebrow ---- */}
        <p
          className="font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: "hsl(var(--accent))" }}
        >
          headwaters · heard on the survival podcast
        </p>

        {/* ---- headline ---- */}
        <h1 className="mt-5 font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
          A community store that belongs to the people who shop in it.
        </h1>

        {/* ---- print-only one-liner ---- */}
        <p className="hidden print:block mt-3 font-serif text-base leading-snug">
          Codetry is the operating system for a community economy — store, accounts, freight, and training — built in the open, owned by the band.
        </p>

        <p className="mt-6 font-serif text-xl sm:text-2xl leading-snug text-foreground/70 print:hidden">
          Not a co-op pitch. Not a grant application. A working system — being
          built right now, in Northwestern Ontario, by a household that lives
          the same logistical reality you do.
        </p>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- what is codetry ---- */}
        <section className="mt-10 sm:mt-12 space-y-5 font-serif text-base sm:text-lg leading-relaxed print:hidden">
          <p>
            <strong>Codetry</strong> is the operating system for a community
            economy. Store, accounts, freight, training — everything a small
            northern community needs to run its own supply without importing
            outside management or handing control to a southern vendor.
          </p>
          <p>
            The short version: your community gets a real store, real
            transparent accounts, and a trained local team. Headwaters builds the
            software and teaches the people. The band owns the result.
          </p>
          <p>
            It&rsquo;s designed for the north — for communities where the road
            closes with the ice, where the workforce flexes with hunting season,
            where the current system costs more than it returns. Not a southern
            model patched for a northern address. A different design for a
            different foundation.
          </p>
        </section>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- show notes / episode list ---- */}
        <section
          className="mt-10 sm:mt-12 print:hidden"
          data-testid="section-show-notes"
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--accent))" }}
          >
            episode
          </p>

          <div
            className="rounded-sm border px-5 py-4 space-y-2"
            style={{ borderColor: "hsl(var(--card-border))" }}
          >
            <p className="font-serif font-semibold text-base">
              <a
                href="https://www.thesurvivalpodcast.com/local-food-parr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                &ldquo;Community vs. Collapse&rdquo; — The Survival Podcast
              </a>
            </p>
            <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/70">
              Bobbie Parr sits down with Jack Spirko to talk local food, northern logistics, and what it actually takes to build a community economy from scratch. Recorded in 2023.
            </p>
          </div>
        </section>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- who is bobbie ---- */}
        <section
          className="mt-10 sm:mt-12 print:mt-4"
          data-testid="section-bobbie"
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--accent))" }}
          >
            who is building this
          </p>

          <div
            className="rounded-sm border p-6 sm:p-8 space-y-4 print:border-black print:bg-transparent print:p-0 print:border-0 print:space-y-1"
            style={{ borderColor: "hsl(var(--card-border))", background: "hsl(var(--muted))" }}
          >
            <p className="font-serif font-semibold text-lg sm:text-xl">
              Bobbie Parr — Wabigoon, Ontario
            </p>
            <p className="font-serif text-base sm:text-[17px] leading-relaxed text-foreground/80 print:hidden">
              Bobbie homesteads in Wabigoon with her kids. She holds a degree in
              Community Development with a minor in
              Native Studies. She founded{" "}
              <a
                href="https://parrsjars.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                Parr&rsquo;s Jars
              </a>
              , the{" "}
              <a
                href="https://807foodcoop.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                807 Food Co-op
              </a>
              , and{" "}
              <a
                href="https://ourheadwaters.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                Headwaters
              </a>
              , while homeschooling her children on a working homestead.
            </p>
            <p className="font-serif text-base sm:text-[17px] leading-relaxed text-foreground/80">
              In 2024 the Northwest Ontario Innovation Centre named her{" "}
              <a
                href="https://www.tbnewswatch.com/success/hard-working-innovattors-honoured-9846445"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                <strong>Innovative Hero of the Year</strong>
              </a>. In 2023 she sat down
              with Jack Spirko on{" "}
              <em>The Survival Podcast</em> for the episode{" "}
              <a
                href="https://www.thesurvivalpodcast.com/local-food-parr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-80"
                style={{ color: "hsl(var(--accent))" }}
              >
                <strong>&ldquo;Community vs. Collapse&rdquo;</strong>
              </a>{" "}
              — the same
              show you&rsquo;re listening to now.
            </p>
            <p className="font-serif text-base sm:text-[17px] leading-relaxed text-foreground/80 print:hidden">
              She is the practitioner — the person delivering the software,
              training the team, and making the monthly site visits. This is not
              a proposal from an organization. It is a project being built by
              someone who already knows what northern logistics actually costs.
            </p>
          </div>
        </section>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- why now / trust ---- */}
        <section
          className="mt-10 sm:mt-12 print:hidden"
          data-testid="section-trust"
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
            style={{ color: "hsl(var(--accent))" }}
          >
            why this is moving now
          </p>

          <div className="space-y-4">
            <TrustRow
              label="807 Food Co-op"
              detail="A working food co-op in Northwestern Ontario. Real members, real orders, real logistics — the proof-of-concept that Codetry grew out of."
              href="https://807foodcoop.ca"
            />
            <TrustRow
              label="Co-operators CDP financial inclusion project"
              detail="The 807 Food Co-op is part of a Co-operators Community Development Program partnership targeting financial inclusion for northern households by end of 2026. The grant relationship is active."
            />
            <TrustRow
              label="Deer Lake First Nation — active delivery"
              detail="Headwaters is currently delivering the store operating system to Deer Lake First Nation: software, accounts, freight coordination, and on-site training. Not planned. In progress."
            />
            <TrustRow
              label="The Codetry Handbook"
              detail="A full practitioner guide to running a community economy — the vocabulary, the tools, the operating model. Freely available. Built in the open."
            />
          </div>
        </section>

        <hr className="rule mt-10 sm:mt-12 print:hidden" />

        {/* ---- form / confirmation ---- */}
        <section className="mt-10 sm:mt-12 print:hidden" data-testid="section-form">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            put your name on the list
          </p>
          <p className="font-serif text-base sm:text-lg leading-relaxed mb-8 text-foreground/75">
            If you heard this on the podcast and want to know when something
            concrete is available near you — put your name here. That&rsquo;s
            all this is. No pitch, no fundraising number. When there&rsquo;s
            something real to share, we&rsquo;ll write to you.
          </p>

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
              data-testid="form-listen"
              noValidate
            >
              {/* honeypot */}
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
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </label>
              </div>

              <Field
                id="listen-name"
                label="Your name"
                required
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                testId="input-name"
                hint="The name we&rsquo;ll write back to."
              />
              <Field
                id="listen-email"
                label="Email"
                required
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                testId="input-email"
                hint="We&rsquo;ll send a short confirmation. No list, no marketing."
              />
              <Field
                id="listen-community"
                label="Your community or region (optional)"
                value={form.community}
                onChange={(v) => setForm({ ...form, community: v })}
                testId="input-community"
                hint="Helps us understand where interest is coming from."
              />
              <FieldArea
                id="listen-want"
                label="What would you want from a store like this in your area? (optional)"
                value={form.wouldWant}
                onChange={(v) => setForm({ ...form, wouldWant: v })}
                testId="input-want"
                hint="Plain language is fine. A sentence is enough."
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
                  data-testid="button-listen-signon"
                >
                  {submitting ? "Signing on…" : "Put my name on the list"}
                </button>
                <p className="signoff">— headwaters</p>
              </div>

              <p className="font-serif text-sm text-foreground/60 pt-1">
                Have more to say?{" "}
                <Link
                  href="/sign-on"
                  className="underline underline-offset-4 hover:opacity-80"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  Use the full sign-on form →
                </Link>
              </p>
            </form>
          )}
        </section>

        {/* ---- shareable / printable footer block ---- */}
        <section
          className="mt-16 sm:mt-20 rounded-sm border p-6 sm:p-8 print:border-black"
          style={{ borderColor: "hsl(var(--card-border))" }}
          data-testid="section-share"
          aria-label="Shareable link and QR code"
        >
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5 print:text-black"
            style={{ color: "hsl(var(--accent))" }}
          >
            share this page
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              className="shrink-0 rounded-sm overflow-hidden bg-white p-2"
              style={{ lineHeight: 0 }}
            >
              <QRCodeSVG
                value={LISTEN_URL}
                size={120}
                fgColor="#1a1a1a"
                bgColor="#ffffff"
                level="M"
              />
            </div>
            <div className="space-y-2">
              <p
                className="font-mono text-base sm:text-lg font-bold tracking-tight print:text-black"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {LISTEN_CANONICAL}
              </p>
              <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/65 print:text-black">
                Scan the code or type the address. Works on any phone — no app
                required. Share it in your show notes, your group chat, or
                hand someone this page after the episode.
              </p>
            </div>
          </div>
        </section>

        {/* ---- footer ---- */}
        <footer
          className="mt-12 pt-8 border-t flex flex-wrap items-center justify-between gap-4 print:hidden"
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

// ---- sub-components ----

function TrustRow({
  label,
  detail,
  href,
}: {
  label: string;
  detail: string;
  href?: string;
}) {
  return (
    <div
      className="rounded-sm border px-5 py-4 space-y-1"
      style={{ borderColor: "hsl(var(--card-border))" }}
    >
      <p className="font-serif font-semibold text-base">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-80"
            style={{ color: "hsl(var(--accent))" }}
          >
            {label}
          </a>
        ) : (
          label
        )}
      </p>
      <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/70">
        {detail}
      </p>
    </div>
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
      <label htmlFor={id} className="block font-sans text-sm font-medium">
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
        style={{ borderColor: "hsl(var(--card-border))" }}
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
            label +
            (required
              ? ' <span style="color:hsl(var(--accent))">*</span>'
              : ""),
        }}
      />
      <textarea
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2 resize-y"
        style={{ borderColor: "hsl(var(--card-border))" }}
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
