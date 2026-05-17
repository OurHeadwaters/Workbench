import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { ApiError, joinViaReferral } from "@/lib/api";

export function EconomyJoinPage() {
  const params = useParams<{ code: string }>();
  const code = params.code ?? "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [bonusAmount, setBonusAmount] = useState<string | null>(null);
  const [tokenCode, setTokenCode] = useState<string>("tokens");

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });

  useEffect(() => {
    if (code) setStatus("idle");
  }, [code]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage(null);
    try {
      const res = await joinViaReferral({
        referralCode: code,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
      });
      setBonusAmount(res.bonusAmount);
      setTokenCode(res.tokenCode ?? "tokens");
      setStatus("success");
    } catch (err) {
      if (err instanceof ApiError) {
        setMessage(err.message);
      } else {
        setMessage("Something went wrong. Try again in a moment.");
      }
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[38rem] px-6 sm:px-8 py-16 sm:py-24">

        <header className="space-y-5">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            codetry · you were invited
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            Someone in your community wants you in.
          </h1>
        </header>

        {status === "success" ? (
          <div
            className="mt-12 rounded-sm border bg-card p-8 sm:p-10 space-y-5"
            style={{ borderColor: "hsl(var(--card-border))" }}
            role="status"
            aria-live="polite"
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "hsl(var(--accent))" }}
            >
              you&rsquo;re in
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl leading-tight">
              Your account is created.
            </h2>
            <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              A{" "}
              <strong>{bonusAmount} {tokenCode}</strong>{" "}
              joining bonus is reserved for you — and the same for the person
              who invited you. The credits appear in your wallet the first time
              you sign in. We deposit them the moment your account is verified.
            </p>
            <p className="font-serif text-base sm:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              Check your inbox for a sign-in link. Once you&rsquo;re in, your
              wallet will show your balance.
            </p>
            <div className="pt-2">
              <a
                href="/economy"
                className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Learn how the economy works
              </a>
            </div>
            <p className="signoff pt-4">— headwaters</p>
          </div>
        ) : (
          <>
            <section className="mt-10 sm:mt-12 space-y-4 font-serif text-base sm:text-lg leading-relaxed">
              <p>
                When you sign up through this link, you and the person who
                shared it both receive a bonus credit. It lands in your wallet
                the first time you sign in — once your account is verified.
              </p>
              <p>
                No app to download. No credit card. Just your name and email.
                Your wallet will be waiting when you sign in.
              </p>
            </section>

            <form
              onSubmit={handleSubmit}
              className="mt-10 sm:mt-12 space-y-5"
              noValidate
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <FieldIn
                  id="join-first"
                  label="First name"
                  required
                  value={form.firstName}
                  onChange={(v) => setForm({ ...form, firstName: v })}
                />
                <FieldIn
                  id="join-last"
                  label="Last name"
                  required
                  value={form.lastName}
                  onChange={(v) => setForm({ ...form, lastName: v })}
                />
              </div>
              <FieldIn
                id="join-email"
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                hint="We&rsquo;ll send your welcome note here. No list, no marketing."
              />

              {message && (
                <p role="alert" className="font-sans text-sm text-destructive">
                  {message}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                >
                  {status === "loading" ? "Joining…" : "Join and collect my bonus"}
                </button>
                <p className="signoff">— headwaters</p>
              </div>
              <p
                className="font-sans text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Referral code: <code className="font-mono">{code}</code>
              </p>
            </form>
          </>
        )}

        <footer
          className="mt-12 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">headwaters · codetry · {new Date().getFullYear()}</p>
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

interface FieldInProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
}

function FieldIn({ id, label, value, onChange, type = "text", required, hint }: FieldInProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-sans text-sm font-medium">
        {label}
        {required && (
          <span className="ml-1" style={{ color: "hsl(var(--accent))" }}>*</span>
        )}
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
      />
      {hint && (
        <p
          className="font-sans text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      )}
    </div>
  );
}
