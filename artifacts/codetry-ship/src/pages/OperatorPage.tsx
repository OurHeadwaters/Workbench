import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { ApiError, fetchManifest, setStoredOwnerToken } from "@/lib/api";

export function OperatorPage() {
  const [, navigate] = useLocation();
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await fetchManifest(pass);
      setStoredOwnerToken(pass);
      navigate("/workbench");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Wrong passphrase.");
      } else {
        setError("Could not verify. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-[42rem] px-6 sm:px-8 py-16 sm:py-24">
        <header className="space-y-6">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "hsl(var(--accent))" }}
          >
            headwaters
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            Operator access.
          </h1>
        </header>

        <p className="mt-8 font-serif text-base sm:text-lg leading-relaxed text-muted-foreground">
          Enter the operator passphrase to reach the Workbench.
        </p>

        <section className="mt-10" data-testid="section-operator">
          <form
            onSubmit={onSubmit}
            className="space-y-4 max-w-sm"
            data-testid="form-operator"
          >
            <div className="space-y-2">
              <label
                htmlFor="operator-passphrase"
                className="block font-sans text-sm font-medium"
              >
                Passphrase
              </label>
              <input
                id="operator-passphrase"
                type="password"
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter passphrase"
                className="block w-full rounded-sm border bg-input px-3 py-2 font-sans text-base focus:outline-none focus:ring-2"
                style={{ borderColor: "hsl(var(--card-border))" }}
                data-testid="input-operator-passphrase"
                autoFocus
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="font-sans text-sm text-destructive"
                data-testid="operator-error"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center px-7 py-3 rounded-sm font-sans text-sm font-medium tracking-wide bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
              data-testid="button-operator-submit"
            >
              {submitting ? "Verifying…" : "Enter Workbench"}
            </button>
          </form>
        </section>

        <footer
          className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "hsl(var(--card-border))" }}
        >
          <p className="signoff">headwaters · {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
